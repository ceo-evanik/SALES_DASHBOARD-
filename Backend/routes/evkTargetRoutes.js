import express from "express";
import {
  createTarget,
  getTargets,
  getTargetById,
  updateTarget,
  deleteTarget,
} from "../controllers/evkTarget.controller.js";
import { protect, authorize } from "../middlewares/auth.Middleware.js";

const router = express.Router();

router.post("/", protect, authorize("admin"), createTarget);
router.get("/", protect, authorize("admin", "sales"), getTargets);
router.get("/:id", protect, authorize("admin", "sales"), getTargetById);
router.put("/:id", protect, authorize("admin"), updateTarget);
router.delete("/:id", protect, authorize("admin"), deleteTarget);

export default router;
