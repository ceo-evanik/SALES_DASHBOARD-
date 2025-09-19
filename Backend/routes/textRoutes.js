// backend/routes/text.routes.js
import express from "express";
import { protect, authorize } from "../middlewares/auth.Middleware.js";
import {
  createText,
  getAllTexts,
  getTextById,
  updateText,
  deleteText,
} from "../controllers/text.controller.js";

const router = express.Router();

// -------------------- Public Routes --------------------
router.get("/", getAllTexts);
router.get("/:id", getTextById);

// -------------------- Admin/Superadmin Only --------------------
router.post("/", protect, authorize("admin", "superadmin"), createText);
router.put("/:id", protect, authorize("admin", "superadmin"), updateText);
router.delete("/:id", protect, authorize("admin", "superadmin"), deleteText);

export default router;
