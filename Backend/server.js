// server.js
import express from "express";
import cors from "cors";
import helmet from "helmet";
import cluster from "cluster";
import os from "os";
import rateLimit from "express-rate-limit";
import "dotenv/config";

import { env } from "./utils/env.Validators.js"; // ✅ env validator import
import { connectDB, disconnectDB } from "./config/db.js";
import { errorHandler } from "./middlewares/error.Handler.js";
import { logger } from "./config/logger.js";

// Routes
import authRoutes from "./routes/authRoutes.js";
import invoiceRoutes from "./routes/invoiceRoutes.js";
import evkTargetRoutes from "./routes/evkTargetRoutes.js";
import zohoRoutes from "./routes/zohoRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import textRoutes from "./routes/textRoutes.js"; // ✅ NEW

const PORT = env.PORT || 4003;

if (cluster.isPrimary) {
  const numCPUs = os.cpus().length;
  logger.info(`🟢 Master ${process.pid} is running`);
  logger.info(`⚡ Spawning ${numCPUs} workers (1 per CPU)`);

  for (let i = 0; i < numCPUs; i++) cluster.fork();

  cluster.on("exit", (worker) => {
    logger.error(`❌ Worker ${worker.process.pid} died. Restarting...`);
    cluster.fork();
  });
} else {
  const app = express();

  // 🔹 Middleware
  app.use(express.json());
  app.use(cors({ origin: "*", credentials: true }));
  app.use(helmet());

  // 🔹 Global Rate Limiter
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 100,
      standardHeaders: true,
      legacyHeaders: false,
      message: {
        success: false,
        message: "Too many requests from this IP, please try again later.",
      },
    })
  );

  // 🔹 Stricter limiter for login route
  app.use(
    "/api/auth/login",
    rateLimit({
      windowMs: 10 * 60 * 1000,
      max: 5,
      standardHeaders: true,
      legacyHeaders: false,
      message: {
        success: false,
        message: "Too many login attempts, please try again later.",
      },
    })
  );

  // Health check
  app.get("/", (req, res) => res.send("🚀 Server is working"));
  app.get("/health", (req, res) =>
    res.status(200).json({ status: "ok", uptime: process.uptime(), pid: process.pid })
  );

  // 🔹 API Routes
  app.use("/api/auth", authRoutes);
  app.use("/api/users/targets", evkTargetRoutes);
  app.use("/api/users", userRoutes);
  app.use("/api/invoices", invoiceRoutes);
  app.use("/api/zoho", zohoRoutes);
  app.use("/api/texts", textRoutes); // ✅ NEW

  // Error handler
  app.use(errorHandler);

  // DB connect
  connectDB();

  const server = app.listen(PORT, () => {
    logger.info(`✅ Worker ${process.pid} running on http://localhost:${PORT}`);
  });

  // Graceful shutdown
  const shutdown = async (signal) => {
    logger.warn(`⚠️ Received ${signal}. Closing server...`);
    server.close(async () => {
      await disconnectDB();
      logger.info("🔴 Server and DB connections closed.");
      process.exit(0);
    });
  };

  process.on("SIGINT", () => shutdown("SIGINT"));
  process.on("SIGTERM", () => shutdown("SIGTERM"));
}
