import express from "express";
import {
  createTarget,
  getTargets,
  getTarget,
  updateTarget,
  deleteTarget,
  getTargetsSummary,
} from "../controllers/evkTarget.controller.js";
import { protect, authorize } from "../middlewares/auth.Middleware.js";
import {
  createTargetValidation,
  updateTargetValidation,
} from "../validators/evkTarget.validator.js";

const router = express.Router();
// Admin: Create target
router.post("/", protect, authorize("admin"), createTargetValidation, createTarget);

// Admin + sales + support: Get all targets
router.get("/", protect, authorize("admin", "sales", "support"), getTargets);

// Admin + sales + support: Get summary (must come BEFORE :id)
router.get("/summary", protect, authorize("admin", "sales", "support"), getTargetsSummary);

// Admin + sales + support: Get single target
router.get("/:id", protect, authorize("admin", "sales", "support"), getTarget);

// Admin: Update target
router.put("/:id", protect, authorize("admin"), updateTargetValidation, updateTarget);

// Admin: Delete target
router.delete("/:id", protect, authorize("admin"), deleteTarget);


export default router;
