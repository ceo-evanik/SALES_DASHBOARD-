import express from "express";
import cors from "cors";
import helmet from "helmet";
import cluster from "cluster";
import os from "os";
import "dotenv/config";

import { connectDB, disconnectDB } from "./config/db.js";
import { errorHandler } from "./middlewares/error.Handler.js";
import { logger } from "./config/logger.js";

// Routes
import authRoutes from "./routes/authRoutes.js";
import invoiceRoutes from "./routes/invoiceRoutes.js";
import evkTargetRoutes from "./routes/evkTargetRoutes.js";
import zohoRoutes from "./routes/zohoRoutes.js"; // ✅ NEW
import userRoutes from "./routes/userRoutes.js"; // ✅ NEW

const PORT = process.env.PORT || 4003;

if (cluster.isPrimary) {
  const numCPUs = os.cpus().length;
  logger.info(`🟢 Master ${process.pid} is running`);
  logger.info(`⚡ Spawning ${numCPUs} workers (1 per CPU)`);

  // Fork workers
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  // Restart worker if it crashes
  cluster.on("exit", (worker, code, signal) => {
    logger.error(`❌ Worker ${worker.process.pid} died. Restarting...`);
    cluster.fork();
  });
} else {
  // Worker processes
  const app = express();

  // Middleware
  app.use(express.json());
  app.use(cors({ origin: "*", credentials: true }));
  app.use(helmet());

  // Health check
  app.get("/", (req, res) => {
    res.send("🚀 Server is working");
  });

  app.get("/health", (req, res) => {
    res.status(200).json({
      status: "ok",
      uptime: process.uptime(),
      pid: process.pid,
    });
  });

  // API Routes
  app.use("/api/auth", authRoutes);
  app.use("/api/users", userRoutes); 
  app.use("/api/invoices", invoiceRoutes);
  app.use("/api/targets", evkTargetRoutes);
  app.use("/api/zoho", zohoRoutes); // ✅ NEW for Zoho sync endpoints

  // Error handler
  app.use(errorHandler);

  // DB connection
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
