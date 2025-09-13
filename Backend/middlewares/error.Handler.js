import { logger } from "../config/logger.js";

export const errorHandler = (err, req, res, next) => {
  logger.error(
    `${err.message} | ${req.method} ${req.originalUrl} | Status: ${err.statusCode || 500}`
  );

  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  // Handle Mongoose validation errors
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors).map((val) => val.message).join(", ");
  }

  // Handle duplicate key error (email, etc.)
  if (err.code && err.code === 11000) {
    statusCode = 400;
    message = `Duplicate field value entered: ${Object.keys(err.keyValue)}`;
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid token";
  }
  if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Token expired";
  }

  res.status(statusCode).json({
    success: false,
    message,
    stack: process.env.NODE_ENV === "production" ? undefined : err.stack,
  });
};
