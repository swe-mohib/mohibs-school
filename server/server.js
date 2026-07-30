import { v2 as cloudinary } from "cloudinary";
import Razorpay from "razorpay";

import app from "./app.js";
import { connectToDb } from "./configs/db.js";

const PORT = process.env.PORT || 5000;
const HOSTNAME = process.env.HOSTNAME;

// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Razorpay configuration
export const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});

const startServer = async () => {
  try {
    await connectToDb();
    const server = app.listen(PORT, () => {
      console.log(`App is live at http://${HOSTNAME || "0.0.0.0"}:${PORT}`);
    });

    const shutdown = (signal) => {
      console.log(`${signal} received; shutting down gracefully`);
      server.close(() => process.exit(0));
    };

    process.on("SIGTERM", () => shutdown("SIGTERM"));
    process.on("SIGINT", () => shutdown("SIGINT"));
  } catch (error) {
    console.error("Unable to start server:", error.message);
    process.exit(1);
  }
};

startServer();
