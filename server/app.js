import { config } from "dotenv";
config();
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import morgan from "morgan";
import mongoose from "mongoose";
import { errorMiddleware } from "./middlewares/error.middleware.js";

const app = express();

// Middleware
// Built-In
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Third-Party
app.use(
  cors({
    origin: [process.env.FRONTEND_URL],
    credentials: true,
  })
);
app.use(cookieParser());
app.use(morgan("dev"));

// Server status check route
app.get("/health", (_req, res) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({ status: "unavailable" });
  }

  return res.status(200).json({ status: "ok" });
});

app.get("/ping", (_req, res) => {
  res.status(200).send("pong");
});

// Import all routes
import { userRouter } from "./routes/user.routes.js";
import { courseRouter } from "./routes/course.route.js";
import { paymentRouter } from "./routes/payment.routes.js";
import { miscRouter } from "./routes/miscellaneous.routes.js";

// Routing to routes
app.use("/api/v1/user", userRouter);
app.use("/api/v1/courses", courseRouter);
app.use("/api/v1/payments", paymentRouter);
app.use("/api/v1", miscRouter);

// Default catch all route - 404
app.all("*", (_req, res) => {
  res.status(400).send("404 page not found !");
});

// Custom error handling middleware
app.use(errorMiddleware);

export default app;
