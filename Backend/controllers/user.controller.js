import User from "../models/user.Model.js";
import bcrypt from "bcryptjs";
import { logger } from "../config/logger.js";

export const adminCreateUser = async (req, res, next) => {
  try {
    const {
      name,
      email,
      password,
      contactNo,
      userType,
      salespersonId,
      department,
      supervisorId,
      supervisorName,
    } = req.body;

    // --- Validate contact number ---
    if (!/^\d{10}$/.test(contactNo)) {
      return res.status(400).json({
        success: false,
        field: "contactNo",
        message: "Contact number must be exactly 10 digits",
      });
    }

    // --- Check email uniqueness ---
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({
        success: false,
        field: "email",
        message: "Email already exists",
      });
    }

    // --- If salespersonId is passed, enforce uniqueness ---
    if (salespersonId) {
      const existingSalesperson = await User.findOne({ salespersonId });
      if (existingSalesperson) {
        return res.status(400).json({
          success: false,
          field: "salespersonId",
          message: "SalespersonId already exists",
        });
      }
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashed,
      contactNo,
      userType,
      department: department || null,
      salespersonId: salespersonId || null,   // ✅ always save if provided
      supervisorId: supervisorId || null,
      supervisorName: supervisorName || null,
    });

    logger.info(`Admin(${req.user.id}) created user: ${email} type=${userType}`);

    const userObj = user.toObject();
    delete userObj.password;

    res.status(201).json({ success: true, message: "User created", data: userObj });
  } catch (err) {
    next(err);
  }
};


// -------------------- Get all users (exclude admin) --------------------
export const getAllUsers = async (req, res, next) => {
  try {
    // Only return users who are not admin + populate their targets
    const users = await User.find({ userType: { $ne: "admin" } })
      .select("-password")
      .populate("targets"); // 👈 include all targets of each user

    res.json({ success: true, data: users });
  } catch (err) {
    next(err);
  }
};



// -------------------- Get single user --------------------
export const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    // Authorization: allow if admin or sales, or the user themselves
    if (
      req.user.userType !== "admin" &&
      req.user.userType !== "sales" &&
      req.user._id.toString() !== user._id.toString()
    ) {
      return res.status(403).json({ success: false, message: "Not authorized to view this user" });
    }

    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
};

// -------------------- Update user (Admin or self) --------------------
export const updateUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    // Authorization: admin or the user themselves
    if (req.user.userType !== "admin" && req.user._id.toString() !== user._id.toString()) {
      return res.status(403).json({ success: false, message: "Not authorized to update this user" });
    }

    // If password is being updated, hash it
    if (req.body.password) {
      req.body.password = await bcrypt.hash(req.body.password, 10);
    }

    Object.assign(user, req.body);
    await user.save();

    const userObj = user.toObject();
    delete userObj.password;

    logger.info(
      `User(${req.user._id}) updated user: ${user.email}`
    );
    res.json({ success: true, data: userObj });
  } catch (err) {
    next(err);
  }
};


// -------------------- Delete user (Admin only) --------------------
export const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    logger.info(`Admin(${req.user.id}) deleted user: ${user.email}`);
    res.json({ success: true, message: "User deleted successfully" });
  } catch (err) {
    next(err);
  }
};
