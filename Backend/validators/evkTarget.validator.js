import { body } from "express-validator";

export const targetValidation = [
  body("evkId").isNumeric().withMessage("evkId must be a number"),

  body("salesperson").optional().isMongoId().withMessage("Invalid salesperson ObjectId"),
  body("name").optional().isString(),
  body("revenueStream").optional().isString(),
  body("zohoSalespersonId").optional().isString(),
  body("imageUrl").optional().isString(),

  body("totalTarget").isNumeric().withMessage("totalTarget must be a number"),
  body("totalAch").optional().isNumeric().withMessage("totalAch must be a number"),

  body("date").isISO8601().withMessage("date must be a valid ISO8601 date"),

  body("months").optional().isArray(),
  body("months.*.month")
    .optional()
    .matches(/^\d{4}-(0[1-9]|1[0-2])$/)
    .withMessage("Month must be in format YYYY-MM"),
  body("months.*.target").optional().isNumeric().withMessage("Target must be a number"),
  body("months.*.achieved").optional().isNumeric().withMessage("Achieved must be a number"),
];

export const achievedValidation = [
  body("month")
    .matches(/^\d{4}-(0[1-9]|1[0-2])$/)
    .withMessage("Month must be in format YYYY-MM"),
  body("achieved").isNumeric().withMessage("Achieved must be a number"),
];
