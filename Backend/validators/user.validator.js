import { body } from "express-validator";

// -------------------- CREATE USER --------------------
export const createUserValidation = [
  body("name").notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Valid email required"),
  body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 chars"),
  body("userType").isIn(["admin","user","superadmin"]).withMessage("userType must be valid"),

  // Sales department specific checks
  body("salespersonId")
    .if(body("department").equals("sales"))
    .notEmpty()
    .withMessage("salespersonId required for sales"),
  body("supervisorId")
    .if(body("department").equals("sales"))
    .notEmpty()
    .withMessage("supervisorId required for sales"),
  body("supervisorName")
    .if(body("department").equals("sales"))
    .notEmpty()
    .withMessage("supervisorName required for sales"),
];

// -------------------- UPDATE USER --------------------
export const updateUserValidation = [
  body("name").optional().notEmpty().withMessage("Name cannot be empty"),
  body("email").optional().isEmail().withMessage("Valid email required"),
  body("password").optional().isLength({ min: 6 }).withMessage("Password must be at least 6 chars"),
  body("userType").optional().isIn(["admin","user","superadmin"]).withMessage("userType must be valid"),

  body("salespersonId")
    .if(body("department").equals("sales"))
    .optional()
    .notEmpty()
    .withMessage("salespersonId required for sales"),
  body("supervisorId")
    .if(body("department").equals("sales"))
    .optional()
    .notEmpty()
    .withMessage("supervisorId required for sales"),
  body("supervisorName")
    .if(body("department").equals("sales"))
    .optional()
    .notEmpty()
    .withMessage("supervisorName required for sales"),
];
