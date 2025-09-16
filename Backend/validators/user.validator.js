// backend/validators/userValidator.js
import { body } from "express-validator";

export const createUserValidation = [
  body("name").notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Valid email required"),
  body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 chars"),
  body("userType").isIn(["admin","support","sales"]).withMessage("userType must be admin/support/sales"),

  // If sales then require sales-specific fields
  body("salespersonId").if(body("userType").equals("sales")).notEmpty().withMessage("salespersonId required for sales"),
  body("department").if(body("userType").equals("sales")).notEmpty().withMessage("department required for sales"),
  body("supervisorId").if(body("userType").equals("sales")).notEmpty().withMessage("supervisorId required for sales"),
  body("supervisorName").if(body("userType").equals("sales")).notEmpty().withMessage("supervisorName required for sales"),
];
