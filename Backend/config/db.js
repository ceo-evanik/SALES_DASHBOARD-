import mongoose from "mongoose";
import { logger } from "./logger.js";

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: "sales_dashboard", // change if needed
    });
    logger.info("✅ MongoDB connected successfully!");

    // Handle graceful shutdown
    process.on("SIGINT", gracefulExit);
    process.on("SIGTERM", gracefulExit);
  } catch (error) {
    logger.error(`❌ MongoDB connection failed: ${error.message}`);
    process.exit(1);
  }
};

export const disconnectDB = async () => {
  try {
    await mongoose.connection.close(false); // false = don’t force, let ongoing ops finish
    logger.info("🛑 MongoDB connection closed.");
  } catch (error) {
    logger.error(`❌ Error closing MongoDB: ${error.message}`);
  }
};

const gracefulExit = async () => {
  logger.info("⚠️  Received shutdown signal, closing MongoDB connection...");
  await disconnectDB();
  process.exit(0);
};
