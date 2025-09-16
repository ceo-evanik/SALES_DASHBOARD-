import express from "express";
import { login, register, getMe } from "../controllers/auth.controller.js";
import { loginValidation, registerValidation } from "../validators/auth.Validators.js";
import validateRequest from "../middlewares/validateReq.js";
import { protect } from "../middlewares/auth.Middleware.js";   // ✅ named import

const router = express.Router();

router.post("/register", registerValidation, validateRequest, register);
router.post("/login", loginValidation, validateRequest, login);
router.get("/me", protect, getMe);   // ✅ use protect

export default router;
