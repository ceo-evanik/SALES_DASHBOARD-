// backend/routes/userRoutes.js
import express from "express";
import { protect } from "../middlewares/auth.Middleware.js";   // ✅ named import
import { authorize } from "../middlewares/auth.Middleware.js"; // ✅ named import
import { adminCreateUser } from "../controllers/user.controller.js";
import { createUserValidation } from "../validators/user.validator.js";
import validateRequest from "../middlewares/validateReq.js";

const router = express.Router();

// ✅ Admin creates users (sales/support/admin)
router.post(
  "/",
  protect,                         // check token
  authorize("admin"),              // allow only admin role
  createUserValidation,            // validation for request body
  validateRequest,                 // check validation errors
  adminCreateUser                  // controller
);

export default router;
