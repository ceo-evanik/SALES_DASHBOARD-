import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.Model.js";
import { logger } from "../config/logger.js";

// Generate JWT
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role, userType: user.userType },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );
};

// Register User
export const register = async (req, res, next) => {
  try {
    const { name, email, password, contactNo, role, userType } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      contactNo,
      role,
      userType,
    });

    logger.info(`🟢 User registered: ${email}`);

    res.status(201).json({
      message: "User registered successfully",
      token: generateToken(user),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        userType: user.userType,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Login User
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    logger.info(`🟢 User logged in: ${email}`);

    res.json({
      message: "Login successful",
      token: generateToken(user),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        userType: user.userType,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Update User
export const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 10);
    }

    const user = await User.findByIdAndUpdate(id, updates, { new: true });
    if (!user) return res.status(404).json({ message: "User not found" });

    logger.info(`🟡 User updated: ${id}`);

    res.json({ message: "User updated", user });
  } catch (error) {
    next(error);
  }
};

// Delete User
export const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);

    if (!user) return res.status(404).json({ message: "User not found" });

    logger.info(`🔴 User deleted: ${id}`);
    res.json({ message: "User deleted" });
  } catch (error) {
    next(error);
  }
};

// Get Logged-in User
export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

// Get Particular User by ID (Admin only)
export const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).select("-password");

    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};
