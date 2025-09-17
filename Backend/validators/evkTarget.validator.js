// validators/evkTarget.validator.js
import { body } from "express-validator";

export const createTargetValidation = [
  body("evkId").isNumeric().withMessage("evkId must be a number"),

  // Require at least one of salesperson OR zohoSalespersonId
  body().custom((value, { req }) => {
    if (!req.body.salesperson && !req.body.zohoSalespersonId) {
      throw new Error("Either salesperson or zohoSalespersonId is required");
    }
    return true;
  }),

  // If salesperson provided → must be valid ObjectId
  body("salesperson")
    .optional()
    .isMongoId()
    .withMessage("Invalid salesperson ObjectId"),

  // If zohoSalespersonId provided → must be string
  body("zohoSalespersonId")
    .optional()
    .isString()
    .withMessage("zohoSalespersonId must be a string"),

  body("name").isString(),
  body("revenueStream").isString(),
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

  // Either field allowed (not both required)
  body("salesperson").optional().isMongoId(),
  body("zohoSalespersonId").optional().isString(),

  body("name").optional().isString(),
  body("revenueStream").optional().isString(),
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
