import { body } from "express-validator";

// User registration validation rules
export const registerValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required"),

  body("email")
    .trim()
    .isEmail()
    .withMessage("Valid email is required"),

  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),

  body("contactNo")
    .optional()
    .isMobilePhone("any")
    .withMessage("Enter a valid phone number"),
];

// User login validation rules
export const loginValidation = [
  body("email")
    .trim()
    .isEmail()
    .withMessage("Valid email is required"),

  body("password")
    .notEmpty()
    .withMessage("Password is required"),
];
