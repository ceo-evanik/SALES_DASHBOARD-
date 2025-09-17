// backend/validators/user.validator.js
import { body } from "express-validator";

// -------------------- CREATE USER --------------------
export const createUserValidation = [
  body("name").notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Valid email required"),
  body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 chars"),
  body("userType").isIn(["admin","support","sales"]).withMessage("userType must be admin/support/sales"),

  // If sales then require sales-specific fields
  body("salespersonId")
    .if(body("userType").equals("sales"))
    .notEmpty()
    .withMessage("salespersonId required for sales"),
  body("department")
    .if(body("userType").equals("sales"))
    .notEmpty()
    .withMessage("department required for sales"),
  body("supervisorId")
    .if(body("userType").equals("sales"))
    .notEmpty()
    .withMessage("supervisorId required for sales"),
  body("supervisorName")
    .if(body("userType").equals("sales"))
    .notEmpty()
    .withMessage("supervisorName required for sales"),
];

// -------------------- UPDATE USER --------------------
export const updateUserValidation = [
  body("name").optional().notEmpty().withMessage("Name cannot be empty"),
  body("email").optional().isEmail().withMessage("Valid email required"),
  body("password").optional().isLength({ min: 6 }).withMessage("Password must be at least 6 chars"),
  body("userType").optional().isIn(["admin","support","sales"]).withMessage("userType must be admin/support/sales"),

  // If sales then require sales-specific fields when provided
  body("salespersonId")
    .if(body("userType").equals("sales"))
    .optional()
    .notEmpty()
    .withMessage("salespersonId required for sales"),
  body("department")
    .if(body("userType").equals("sales"))
    .optional()
    .notEmpty()
    .withMessage("department required for sales"),
  body("supervisorId")
    .if(body("userType").equals("sales"))
    .optional()
    .notEmpty()
    .withMessage("supervisorId required for sales"),
  body("supervisorName")
    .if(body("userType").equals("sales"))
    .optional()
    .notEmpty()
    .withMessage("supervisorName required for sales"),
];
