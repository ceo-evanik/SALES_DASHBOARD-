import express from "express";
import {
  createTarget,
  getTargets,
  updateTarget,
  deleteTarget,
  updateAchieved,
  getTargetsSummary,
} from "../controllers/evkTarget.controller.js";
import { protect, authorize } from "../middlewares/auth.Middleware.js";
import { targetValidation, achievedValidation } from "../validators/evkTarget.validator.js";

const router = express.Router();

// Admin create
router.post("/", protect, authorize("admin"), targetValidation, createTarget);

// Admin + sales + support: list
router.get("/", protect, authorize("admin", "sales", "support"), getTargets);

// Dashboard summary
router.get("/summary", protect, authorize("admin", "sales", "support"), getTargetsSummary);

// Admin update
router.put("/:id", protect, authorize("admin"), targetValidation, updateTarget);

// Admin delete
router.delete("/:id", protect, authorize("admin"), deleteTarget);

// Sales/support update achieved (only own unless admin)
router.patch("/:id/achieved", protect, authorize("admin", "sales", "support"), achievedValidation, updateAchieved);

export default router;
