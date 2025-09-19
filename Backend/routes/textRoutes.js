// routes/text.routes.js
import express from "express";
import {
  createText,
  getAllTexts,
  getTextById,
  updateText,
  deleteText,
} from "../controllers/text.controller.js";
import { protect, authorize } from "../middlewares/auth.Middleware.js";

const router = express.Router();

// 🔹 Create text (Admin only)
router.post("/", protect, authorize("admin"), createText);

// 🔹 Get all texts (public or logged-in)
router.get("/", getAllTexts);

// 🔹 Get single text (public or logged-in)
router.get("/:id", getTextById);

// 🔹 Update text (Admin only)
router.put("/:id", protect, authorize("admin"), updateText);

// 🔹 Delete text (Admin only)
router.delete("/:id", protect, authorize("admin"), deleteText);

export default router;
