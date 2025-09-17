import express from "express";
import { protect, authorize } from "../middlewares/auth.Middleware.js";
import validateRequest from "../middlewares/validateReq.js";
import { verifyZohoSalesperson } from "../middlewares/verifyZohoSalesperson.js";
import {
  adminCreateUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} from "../controllers/user.controller.js";
import {
  createUserValidation,
  updateUserValidation,
} from "../validators/user.validator.js";

const router = express.Router();

// -------------------- CREATE USER --------------------
// Admin creates users (sales/support/admin)
router.post(
  "/",
  protect,
  authorize("admin"),
  createUserValidation,
  validateRequest,
  verifyZohoSalesperson,
  adminCreateUser
);

// -------------------- GET ALL USERS --------------------
// Admin can view all users
router.get("/", protect, authorize("admin"), getAllUsers);

// -------------------- GET SINGLE USER --------------------
// Admin, Sales, or the user themselves can view single user details
router.get("/:id", protect, getUserById);

// -------------------- UPDATE USER --------------------
// Admin can update any user, user can update their own profile
router.put("/:id", protect, updateUserValidation, validateRequest, updateUser);

// -------------------- DELETE USER --------------------
// Admin can delete any user
router.delete("/:id", protect, authorize("admin"), deleteUser);

export default router;
