# Mohibs School

Production school-management platform consisting of a React/Vite client and an Express/MongoDB API, deployed via Docker on an EC2 instance with automated CI/CD through GitHub Actions.

## Table of Contents

- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Tech Stack](#tech-stack)
- [Environment Variables](#environment-variables)
- [Local Development](#local-development)
- [Docker](#docker)
- [CI/CD Pipeline](#cicd-pipeline)
- [Infrastructure Setup (One-Time)](#infrastructure-setup-one-time)
- [Deployment](#deployment)
- [HTTPS / SSL](#https--ssl)
- [Secrets Management](#secrets-management)
- [Troubleshooting](#troubleshooting)
- [Manual Operations Cheat Sheet](#manual-operations-cheat-sheet)

---

## Architecture

```
                        ┌──────────────────────────┐
                        │        Internet          │
                        └────────────┬─────────────┘
                                     │  :80 / :443
                        ┌────────────▼───────────────┐
                        │      Nginx (reverse        │
                        │      proxy + SSL)          │
                        └──────┬─────────────┬───────┘
             school.mohibs.in  │             │  api.school.mohibs.in
                        ┌──────▼───────┐ ┌───▼────────────────────┐
                        │  client      │ │  server                │
                        │  (React/Vite)│ │  (Express + Mongoose)  │
                        │  :80         │ │  :5000                 │
                        └──────────────┘ └─────────┬──────────────┘
                                                   │
                                          ┌────────▼───────────┐
                                          │   MongoDB Atlas     │
                                          │   (managed DB)      │
                                          └────────────────────┘
```

All three application containers run on a single EC2 instance via Docker Compose. Nginx is the only container exposed to the internet (ports 80/443); `client` and `server` are reachable only inside the Docker network.

Unlike a Node-rendered frontend, `client` is a **static single-page app** — Vite builds plain HTML/CSS/JS at Docker build time, and the final image runs a lightweight `nginx:alpine` container just to serve those static files (with SPA fallback routing to `index.html`).

## Project Structure

```
mohibs-school/
├─ client/                     React 18 + Vite, Tailwind/DaisyUI, Redux Toolkit, React Router
│  ├─ Dockerfile
│  ├─ .dockerignore
│  ├─ nginx.conf                SPA routing config
│  └─ .env.example
├─ server/                     Express + MongoDB/Mongoose API
│  ├─ Dockerfile
│  ├─ .dockerignore
│  └─ .env.example
├─ nginx/
│  └─ default.conf              Reverse proxy + SSL config
├─ docker-compose.yml
├─ .github/
│  └─ workflows/
│     └─ deploy.yml             CI/CD pipeline
├─ .gitattributes               Forces LF line endings for .sh files
└─ .gitignore
```

## Tech Stack

| Layer            | Technology                                                         |
| ---------------- | ------------------------------------------------------------------ |
| Client           | React 18, Vite, Tailwind CSS, DaisyUI, Redux Toolkit, React Router |
| Server           | Express, MongoDB/Mongoose                                          |
| Auth             | JWT (cookie-based)                                                 |
| Media            | Cloudinary                                                         |
| Email            | Nodemailer (SMTP)                                                  |
| Payments         | Razorpay (subscriptions)                                           |
| Database         | MongoDB Atlas (managed)                                            |
| Containerization | Docker (multi-stage builds)                                        |
| Reverse proxy    | Nginx                                                              |
| CI/CD            | GitHub Actions                                                     |
| Image registry   | Docker Hub                                                         |
| Secrets          | AWS SSM Parameter Store                                            |
| Hosting          | AWS EC2 (Ubuntu)                                                   |

## Environment Variables

### `client/.env` (local dev only — never committed)

```dotenv
VITE_BASE_URL=https://api.school.mohibs.in
```

`VITE_*` variables are public by design — Vite bakes them into the built JS bundle at **build time**. In production this is passed as a Docker build arg; the client container has no runtime `.env` file at all.

### `server/.env` (local dev only — never committed)

```dotenv
NODE_ENV=development
PORT=5000
HOSTNAME=localhost

MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/dbname

JWT_SECRET=xxxxxxxxxxxx
JWT_EXPIRY=7d

CLOUDINARY_CLOUD_NAME=xxxxxxxxx
CLOUDINARY_API_KEY=xxxxxxxxx
CLOUDINARY_API_SECRET=xxxxxxxxx

SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USERNAME=xxxxxxxxx
SMTP_PASSWORD=xxxxxxxxx
SMTP_FROM_EMAIL=no-reply@school.mohibs.in

RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxx
RAZORPAY_SECRET=xxxxxxxxxxxx
RAZORPAY_PLAN_ID=plan_xxxxxxxxx

FRONTEND_URL=http://localhost:5173

CONTACT_US_EMAIL=contact@school.mohibs.in
```

Every one of these is a **runtime secret** — none are build-time values, since `server` has no client-bundled config. In production, all of them live in AWS SSM Parameter Store and are written to `.env.server` on the EC2 instance fresh on every deploy.

## Local Development

Each app runs independently — Docker is used for production builds/deployment only, not local dev.

```bash
cd server
cp .env.example .env      # fill in dev credentials
npm install
npm run dev                # http://localhost:5000 (or your PORT)
```

```bash
cd client
cp .env.example .env      # fill in dev credentials
npm install
npm run dev                # http://localhost:5173 (Vite default)
```

Make sure `client/.env`'s `VITE_BASE_URL` points at wherever `server` is actually running locally (e.g. `http://localhost:5000`).

## Docker

Both apps use multi-stage Dockerfiles producing minimal Alpine-based production images.

### Client build

```bash
docker build \
  --build-arg VITE_BASE_URL=https://api.school.mohibs.in \
  -t mohibs-school-client ./client
```

The final image is `nginx:alpine` serving the Vite `dist/` build output — not a Node process. `client/nginx.conf` includes SPA fallback routing (`try_files $uri $uri/ /index.html`), required so refreshing on a client-routed path (e.g. `/dashboard`) doesn't 404.

### Server build

```bash
docker build -t mohibs-school-server ./server
```

Plain Express app — `npm ci --omit=dev` in a deps stage, then copied into a slim runner stage. No compile/build step, no ORM migration step (Mongoose has no migration system by default).

### Important details

- `client`'s Dockerfile passes `VITE_BASE_URL` as a build arg — anything the client needs at runtime must be baked in at build time; there's no way to inject it after the static files are built.
- `server`'s `Dockerfile` should expose whichever port your app actually listens on (`PORT` env var) — adjust `EXPOSE` and the healthcheck URL if it differs from `5000`.
- A health endpoint is expected at `GET /api/health` returning `200` — add it if missing:
  ```js
  app.get("/api/health", (req, res) => res.status(200).json({ status: "ok" }));
  ```

## CI/CD Pipeline

Defined in `.github/workflows/deploy.yml`. Triggers on push to `main`, or manually via **Actions → Build and Deploy → Run workflow**.

**Flow:**

1. **`changes`** — detects whether `client/` and/or `server/` changed, so only the affected app(s) rebuild.
2. **`build-client`** / **`build-server`** — build each Docker image, push to Docker Hub tagged `:latest` and `:<commit-sha>`. Uses `docker/setup-buildx-action` (required for GHA cache export) and layer caching.
3. **`deploy`** — runs after both build jobs succeed or are skipped:
   - Copies `docker-compose.yml` and `nginx/default.conf` to EC2 via SCP.
   - SSHes in, pulls fresh secrets from AWS SSM into `.env.server`.
   - Logs into Docker Hub, runs `docker compose pull && docker compose up -d --remove-orphans`.
   - Prunes dangling images.

### Required GitHub repository secrets

`Settings → Secrets and variables → Actions → Secrets`

| Secret               | Purpose                      |
| -------------------- | ---------------------------- |
| `DOCKERHUB_USERNAME` | Docker Hub login             |
| `DOCKERHUB_TOKEN`    | Docker Hub access token      |
| `EC2_HOST`           | EC2 public IP/domain         |
| `EC2_USER`           | SSH user (`ubuntu`)          |
| `EC2_SSH_KEY`        | Private key contents for SSH |

### Required GitHub repository variables

`Settings → Secrets and variables → Actions → Variables`

| Variable        | Example value                  |
| --------------- | ------------------------------ |
| `VITE_BASE_URL` | `https://api.school.mohibs.in` |

This is the only build-time variable in the whole project — everything server-side is a runtime secret via SSM.

## Infrastructure Setup (One-Time)

### 1. EC2 instance

```bash
ssh -i your-key.pem ubuntu@your-ec2-ip

curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER
newgrp docker

sudo apt update && sudo apt install -y awscli

mkdir -p ~/app/nginx
echo "DOCKERHUB_USERNAME=your-dockerhub-username" > ~/app/.env
```

**Security group:** open inbound `22` (SSH, ideally IP-restricted), `80` (HTTP), `443` (HTTPS).

### 2. IAM role for EC2 → SSM access

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": ["ssm:GetParametersByPath", "ssm:GetParameter"],
      "Resource": "arn:aws:ssm:*:*:parameter/prod/school-server/*"
    },
    {
      "Effect": "Allow",
      "Action": ["kms:Decrypt"],
      "Resource": "*"
    }
  ]
}
```

Attach to a role (`mohibs-school-ec2-ssm-role`), and attach that role to the EC2 instance via **EC2 → Instance → Actions → Security → Modify IAM role**.

### 3. IAM user for local secret management

Create a separate IAM user with `AmazonSSMFullAccess`, generate CLI access keys, `aws configure` locally.

### 4. DNS

```
school.mohibs.in     → EC2 IP
api.school.mohibs.in → EC2 IP
```

## Deployment

Fully automated — push to `main` (or run the workflow manually) rebuilds changed images and redeploys via SSH.

**Force a rebuild with no code changes:**

```bash
git commit --allow-empty -m "Trigger CI/CD rebuild"
git push origin main
```

Or use **Run workflow** in the Actions tab (enabled via `workflow_dispatch`) — rebuilds both images regardless of the path filter.

## HTTPS / SSL

```bash
ssh -i your-key.pem ubuntu@your-ec2-ip
sudo apt install -y certbot

cd ~/app
docker compose stop nginx
sudo certbot certonly --standalone -d school.mohibs.in -d api.school.mohibs.in
```

`nginx/default.conf` includes an HTTP→HTTPS redirect and SSL server blocks for both domains, referencing:

```
/etc/letsencrypt/live/school.mohibs.in/fullchain.pem
/etc/letsencrypt/live/school.mohibs.in/privkey.pem
```

(Certbot names the folder after the first `-d` domain — both subdomains share one cert.)

**Auto-renewal** (crontab, daily, only renews within 30 days of expiry):

```bash
sudo crontab -e
```

```
0 3 * * * docker compose -f /home/ubuntu/app/docker-compose.yml stop nginx && certbot renew --standalone --quiet && docker compose -f /home/ubuntu/app/docker-compose.yml start nginx
```

## Secrets Management

Production secrets live in **AWS SSM Parameter Store** under `/prod/school-server/*`, encrypted (`SecureString`), fetched fresh on every deploy.

**Push/update a secret:**

```bash
aws ssm put-parameter --name /prod/school-server/MONGO_URI \
  --value "mongodb+srv://user:pass@cluster.mongodb.net/dbname" \
  --type SecureString --overwrite
```

**List current values:**

```bash
aws ssm get-parameters-by-path --path /prod/school-server/ --with-decryption
```

The deploy workflow reconstructs `.env.server` on the server using:

```bash
aws ssm get-parameters-by-path --path /prod/school-server/ --with-decryption \
  --query "Parameters[*].[Name,Value]" --output text | \
  awk -F'\t' '{n=split($1,a,"/"); print a[n]"="$2}' > .env.server
```

> Note the `-F'\t'` (tab) delimiter for the outer split, with a separate `/`-split applied only to the parameter _name_ column — splitting the whole line by `/` corrupts any value containing slashes (e.g. `MONGO_URI`).

Rotating a secret takes effect on the next deploy, or immediately via:

```bash
docker compose restart server
```

## Troubleshooting

| Symptom                                               | Cause                                                                                          | Fix                                                                               |
| ----------------------------------------------------- | ---------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| `Cache export is not supported for the docker driver` | Default buildx driver can't export GHA cache                                                   | Add `docker/setup-buildx-action@v3` before build                                  |
| Client shows 404 on refresh at a non-root route       | Missing SPA fallback in nginx                                                                  | Confirm `client/nginx.conf` has `try_files $uri $uri/ /index.html`                |
| `.env` parse error: unexpected character              | `awk -F'/'` splits the whole line (including the value) by `/`, corrupting URLs                | Split only on tab for columns, and only split the name column by `/`              |
| 502 Bad Gateway on `api.school.mohibs.in`             | `server` container isn't healthy/running                                                       | `docker logs server --tail 50` to diagnose                                        |
| Deploy fails: `dependency failed to start: unhealthy` | `depends_on` used `condition: service_healthy`, hard-failing on a briefly-unhealthy dependency | Use plain list form `depends_on: [server]` — ordering only, not a health gate     |
| CORS errors from client to server                     | `FRONTEND_URL` / CORS config in Express doesn't match the deployed client domain               | Confirm `FRONTEND_URL=https://school.mohibs.in` in SSM matches production exactly |
| A shell script fails with exit 127                    | CRLF line endings                                                                              | `sed -i 's/\r$//' <file>`; enforce via `.gitattributes`                           |

## Manual Operations Cheat Sheet

```bash
# SSH in
ssh -i your-key.pem ubuntu@your-ec2-ip

# Check running containers
docker ps

# View logs
docker logs server --tail 50
docker logs client --tail 50
docker logs nginx --tail 50

# Restart a single service (e.g. after rotating a secret)
cd ~/app
docker compose restart server

# Full redeploy manually (normally handled by CI/CD)
docker compose pull
docker compose up -d --remove-orphans

# Check SSL cert status
sudo certbot certificates

# Verify both domains are live
curl -I https://school.mohibs.in
curl -I https://api.school.mohibs.in
```
