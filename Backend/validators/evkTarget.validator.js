// validators/evkTarget.validator.js
import { body } from "express-validator";

export const createTargetValidation = [
  body("evkId").isNumeric().withMessage("evkId must be a number"),
  body("salesperson").isMongoId().withMessage("Invalid salesperson ObjectId"),
  body("name").isString(),
  body("revenueStream").isString(),
  body("zohoSalespersonId").isString(),
  body("imageUrl").optional({ nullable: true }).isString(),
  body("totalTarget").isNumeric().withMessage("totalTarget must be a number"),
  body("totalAch").optional().isNumeric(),
  body("date").isISO8601().withMessage("date must be a valid ISO8601 date"),
  body("months").optional().isArray(),
  body("months.*.month")
    .optional()
    .matches(/^\d{4}-(0[1-9]|1[0-2])$/),
  body("months.*.target").optional().isNumeric(),
  body("months.*.achieved").optional().isNumeric(),
];

export const updateTargetValidation = [
  body("evkId").optional().isNumeric(),
  body("salesperson").optional().isMongoId(),
  body("name").optional().isString(),
  body("revenueStream").optional().isString(),
  body("zohoSalespersonId").optional().isString(),
  body("imageUrl").optional({ nullable: true }).isString(),
  body("totalTarget").optional().isNumeric(),
  body("totalAch").optional().isNumeric(),
  body("date").optional().isISO8601(),
  body("months").optional().isArray(),
  body("months.*.month")
    .optional()
    .matches(/^\d{4}-(0[1-9]|1[0-2])$/),
  body("months.*.target").optional().isNumeric(),
  body("months.*.achieved").optional().isNumeric(),
];

export const achievedValidation = [
  body("achieved").isNumeric().withMessage("Achieved must be a number"),
];
