import mongoose from "mongoose";
import { logger } from "./logger.js";

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: "sales_dashboard", // change if needed
    });
    logger.info("✅ MongoDB connected successfully!");
  } catch (error) {
    logger.error(`❌ MongoDB connection failed: ${error.message}`);
    process.exit(1);
  }
};

export const disconnectDB = async () => {
  try {
    await mongoose.connection.close();
    logger.info("🛑 MongoDB connection closed.");
  } catch (error) {
    logger.error(`❌ Error closing MongoDB: ${error.message}`);
  }
};
