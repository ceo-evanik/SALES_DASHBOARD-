import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { logger } from "../config/logger.js";

/**
 * generateToken -> payload { id, userType }
 */
const generateToken = (user) => {
  return jwt.sign({ id: user._id, userType: user.userType }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

// ---------------------- POST /api/auth/register ----------------------
export const register = async (req, res, next) => {
  try {
    const { name, email, password, contactNo, userType } = req.body;

    const total = await User.countDocuments();
    if (total > 0) {
      return res.status(403).json({
        message: "Registration disabled. Please ask an admin to create your account.",
      });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashed,
      contactNo,
      userType: userType || "admin",
    });

    const token = generateToken(user);
    logger.info(`Initial user created: ${email}`);

    // Convert to object and remove password
    const userObj = user.toObject();
    delete userObj.password;

    res.status(201).json({
      message: "Initial user created",
      token,
      user: userObj,
    });
  } catch (err) {
    next(err);
  }
};

// ---------------------- POST /api/auth/login ----------------------
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    const token = generateToken(user);
    logger.info(`User logged in: ${email}`);

    // Convert to object and remove password
    const userObj = user.toObject();
    delete userObj.password;

    res.json({
      message: "Login successful",
      token,
      user: userObj,
    });
  } catch (err) {
    next(err);
  }
};

// ---------------------- GET /api/auth/me ----------------------
export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
};
