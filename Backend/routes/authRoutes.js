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
import {
  registerValidation,
  loginValidation,
} from "../validators/auth.Validators.js";
import { validateRequest } from "../middlewares/validateReq.js";
import User from "../models/user.Model.js";

const router = express.Router();

// -------------------- Public Routes -------------------- //
router.post("/register", registerValidation, validateRequest, register);
router.post("/login", loginValidation, validateRequest, login);

// -------------------- Protected Routes -------------------- //

// Any logged-in user can see their own profile
router.get("/me", protect, getMe);

// Admin (or support if needed) can fetch any user by ID
router.get("/:id", protect, authorize("admin"), getUserById);

// Update user: 
// - Admin can update anyone
// - Normal users can only update their own profile
router.put(
  "/:id",
  protect,
  (req, res, next) => {
    if (req.user.userType !== "admin" && req.user._id.toString() !== req.params.id) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: You can only update your own profile",
      });
    }
    next();
  },
  updateUser
);

// Only admin can delete users
router.delete("/:id", protect, authorize("admin"), deleteUser);

// -------------------- Logout Route -------------------- //
// Clear token from DB so user must login again
router.post("/logout", protect, async (req, res, next) => {
  try {
    req.user.token = null;
    await req.user.save();
    res.json({ message: "Logout successful" });
  } catch (error) {
    next(error);
  }
});

export default router;
