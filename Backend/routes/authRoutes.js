import express from "express";
import {
  register,
  login,
  updateUser,
  deleteUser,
  getMe,
  getUserById,
} from "../controllers/auth.controller.js";
import { protect, authorize } from "../middlewares/auth.Middleware.js";
import { registerValidation, loginValidation } from "../validators/auth.Validators.js";
import { validateRequest } from "../middlewares/validateReq.js";

const router = express.Router();

// -------------------- Public Routes -------------------- //
router.post("/register", registerValidation, validateRequest, register);
router.post("/login", loginValidation, validateRequest, login);

// -------------------- Protected Routes -------------------- //
router.get("/me", protect, getMe);                  // any logged-in user
router.get("/:id", protect, authorize("admin"), getUserById); // admin only
router.put("/:id", protect, updateUser);            // logged-in user
router.delete("/:id", protect, authorize("admin"), deleteUser); // admin only

export default router;
