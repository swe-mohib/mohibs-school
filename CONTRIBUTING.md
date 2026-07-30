# Contributing to Mohibs School

This guide covers everything needed to get both apps running locally and how to submit changes.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Getting the Code](#getting-the-code)
- [Setting Up `server`](#setting-up-server)
- [Setting Up `client`](#setting-up-client)
- [Running Both Together](#running-both-together)
- [Database Workflow](#database-workflow)
- [Testing Docker Builds Locally](#testing-docker-builds-locally)
- [Branching & Commit Conventions](#branching--commit-conventions)
- [Making a Contribution](#making-a-contribution)
- [Code Style](#code-style)
- [Common Local Issues](#common-local-issues)

---

## Prerequisites

| Tool    | Version                               | Check with         |
| ------- | ------------------------------------- | ------------------ |
| Node.js | 20.x (match production)               | `node -v`          |
| npm     | 10.x                                  | `npm -v`           |
| Git     | any recent                            | `git --version`    |
| Docker  | recent (optional, for testing builds) | `docker --version` |

You'll also need dev/test credentials for:

- A MongoDB instance (a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster or local `mongod` works for local dev)
- [Cloudinary](https://cloudinary.com) account
- An SMTP provider (e.g. Mailtrap for dev, or a real SMTP account in sandbox mode)
- [Razorpay](https://razorpay.com) test-mode keys and a test subscription plan

Ask a maintainer for shared dev credentials if you don't have your own — never use production keys locally.

## Getting the Code

```bash
git clone https://github.com/<org>/mohibs-school.git
cd mohibs-school
```

Repo layout:

```
mohibs-school/
├─ client/     React 18 + Vite, Tailwind/DaisyUI, Redux Toolkit, React Router
└─ server/     Express + MongoDB/Mongoose API
```

Each app has its own `package.json`, `node_modules`, and `.env` — install/run steps happen independently in each folder.

## Setting Up `server`

```bash
cd server
cp .env.example .env
```

Fill in `.env`:

```dotenv
NODE_ENV=development
PORT=5000
HOSTNAME=localhost

MONGO_URI=mongodb+srv://user:pass@your-dev-cluster.mongodb.net/dbname

JWT_SECRET=some-long-dev-secret
JWT_EXPIRY=7d

CLOUDINARY_CLOUD_NAME=your-dev-cloud-name
CLOUDINARY_API_KEY=xxxxxxxxx
CLOUDINARY_API_SECRET=xxxxxxxxx

SMTP_HOST=sandbox.smtp.mailtrap.io
SMTP_PORT=587
SMTP_USERNAME=xxxxxxxxx
SMTP_PASSWORD=xxxxxxxxx
SMTP_FROM_EMAIL=dev@school.mohibs.in

RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxx
RAZORPAY_SECRET=xxxxxxxxxxxx
RAZORPAY_PLAN_ID=plan_xxxxxxxxx

FRONTEND_URL=http://localhost:5173

CONTACT_US_EMAIL=dev-contact@school.mohibs.in
```

Install and run:

```bash
npm install
npm run dev
```

Runs at `http://localhost:5000` (or whatever `PORT` you set).

> There's no schema migration step for MongoDB/Mongoose the way there is with Prisma — Mongoose models define shape at the application level, and collections/documents adapt as your code changes. Just make sure any new required fields are handled gracefully for existing documents if you're working against shared dev data.

## Setting Up `client`

Open a **new terminal tab/window** (both apps run simultaneously):

```bash
cd client
cp .env.example .env
```

Fill in `.env`:

```dotenv
VITE_BASE_URL=http://localhost:5000
```

Point this at wherever `server` is running locally.

Install and run:

```bash
npm install
npm run dev
```

Vite's dev server runs at `http://localhost:5173` by default.

## Running Both Together

Recommended: two terminal tabs, one per app.

```bash
# Terminal 1
cd server && npm run dev      # http://localhost:5000

# Terminal 2
cd client && npm run dev      # http://localhost:5173
```

Confirm `client/.env`'s `VITE_BASE_URL` matches wherever `server` is actually listening.

## Database Workflow

Mongoose models live under `server/models/` (or wherever your project defines them). There's no formal migration system — schema changes take effect the moment the app restarts with updated model definitions.

**Guidelines when changing a model:**

- Adding an optional field is safe — existing documents simply won't have it until updated.
- Adding a **required** field on an existing collection with live data needs a one-off script to backfill existing documents, or a default value in the schema (`default: ...`) so old documents don't break on save/validate.
- Renaming or removing a field used elsewhere (routes, frontend) needs a coordinated change across `server` and `client` in the same PR/deploy.

**Inspecting data locally:**
Use [MongoDB Compass](https://www.mongodb.com/products/compass) or the `mongosh` CLI pointed at your dev `MONGO_URI` to browse collections directly.

## Testing Docker Builds Locally

Before opening a PR that touches a `Dockerfile` or `nginx.conf`, test it locally:

```bash
# From repo root

docker build \
  --build-arg VITE_BASE_URL=http://localhost:5000 \
  -t mohibs-school-client-test ./client

docker build -t mohibs-school-server-test ./server
```

If both build without errors, run them standalone to confirm startup:

```bash
docker run --rm -p 8080:80 mohibs-school-client-test
# visit http://localhost:8080 — confirm the SPA loads and client-side routes don't 404 on refresh

docker run --rm -p 5000:5000 \
  -e NODE_ENV=production \
  -e PORT=5000 \
  -e MONGO_URI="mongodb+srv://user:pass@your-dev-cluster.mongodb.net/dbname" \
  -e JWT_SECRET=some-dev-secret \
  -e JWT_EXPIRY=7d \
  -e CLOUDINARY_CLOUD_NAME=xxxx \
  -e CLOUDINARY_API_KEY=xxxx \
  -e CLOUDINARY_API_SECRET=xxxx \
  -e SMTP_HOST=sandbox.smtp.mailtrap.io \
  -e SMTP_PORT=587 \
  -e SMTP_USERNAME=xxxx \
  -e SMTP_PASSWORD=xxxx \
  -e SMTP_FROM_EMAIL=dev@school.mohibs.in \
  -e RAZORPAY_KEY_ID=rzp_test_xxxx \
  -e RAZORPAY_SECRET=xxxx \
  -e RAZORPAY_PLAN_ID=plan_xxxx \
  -e FRONTEND_URL=http://localhost:8080 \
  -e CONTACT_US_EMAIL=dev-contact@school.mohibs.in \
  mohibs-school-server-test
```

A build passing locally with the same `docker build` invocation used in CI is the strongest signal a PR won't break the pipeline.

## Branching & Commit Conventions

- Branch off `main`: `git checkout -b feature/short-description` or `fix/short-description`
- Keep commits scoped and descriptive. Prefixes like `feat:`, `fix:`, `chore:`, `docs:` are encouraged but not strictly enforced.
- Rebase on latest `main` before opening a PR:
  ```bash
  git fetch origin
  git rebase origin/main
  ```

## Making a Contribution

1. Branch, make your changes.
2. Run both apps locally and confirm the change works end-to-end.
3. If you changed a Mongoose model that existing data relies on, note any backfill/migration considerations in the PR description.
4. If you touched a `Dockerfile` or `nginx.conf`, test the Docker build locally (see above).
5. Push your branch and open a PR against `main`.
6. CI runs automatically — a failing `build-client` or `build-server` job means something needs fixing before merge (check the Actions log for the specific step).
7. Once merged to `main`, the deploy pipeline automatically rebuilds and redeploys only the app(s) whose folder changed — no manual deployment steps needed.

> Note: this repo deploys straight from `main` (single production environment, no staging branch) — be confident in a change before merging.

## Code Style

- Match existing formatting; run your editor's ESLint/Prettier integration if configured (check `.eslintrc`/`.prettierrc` if present).
- Keep Redux Toolkit slices and API calls organized consistently with the existing patterns in `client/src`.
- Keep Express routes, controllers, and models organized consistently with the existing patterns in `server/`.
- Keep secrets out of code and commits — always through `.env` (local) or SSM (production), never hardcoded.

## Common Local Issues

| Symptom                                 | Likely cause                                                                              | Fix                                                                                                                              |
| --------------------------------------- | ----------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| Client can't reach the API, CORS errors | `server`'s CORS config doesn't allow `http://localhost:5173`, or `VITE_BASE_URL` is wrong | Check `FRONTEND_URL` in `server/.env` matches your client's dev URL, and confirm `VITE_BASE_URL` points at the right server port |
| `MongoServerError: bad auth`            | Wrong `MONGO_URI` credentials or IP not whitelisted on Atlas                              | Double-check connection string; on Atlas, whitelist your local IP under Network Access                                           |
| JWT auth fails immediately              | `JWT_SECRET` mismatch between requests (e.g. server restarted with a different value)     | Keep `JWT_SECRET` stable in your local `.env`, don't regenerate it casually                                                      |
| Port 5000 or 5173 already in use        | Another process (or a previous run) still bound to the port                               | `lsof -i :5000` (or `:5173`) to find and stop it, or run on a different port                                                     |
| Emails not sending locally              | Real SMTP credentials used without sandbox mode, or blocked by provider                   | Use a sandbox SMTP service (e.g. Mailtrap) for local dev instead of production SMTP credentials                                  |

For anything related to production deployment, Docker, CI/CD, or infrastructure, see the main [README.md](./README.md).
