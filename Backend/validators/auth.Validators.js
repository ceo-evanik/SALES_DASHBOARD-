// backend/validators/authValidator.js
import { body } from "express-validator";

export const loginValidation = [
  body("email").isEmail().withMessage("Valid email required"),
  body("password").notEmpty().withMessage("Password is required"),
];

// This register is *only* for initial bootstrap when DB empty.
// For creating users (admin flow) use userValidator in userRoutes.
export const registerValidation = [
  body("name").notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Valid email required"),
  body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 chars"),
  body("userType").optional().isIn(["admin","support","sales"]).withMessage("Invalid userType"),
];
