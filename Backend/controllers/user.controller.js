import User from "../models/user.Model.js";
import bcrypt from "bcryptjs";
import {logger} from "../config/logger.js";

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

    // email unique
    const existing = await User.findOne({ email });
    if (existing)
      return res.status(400).json({ message: "Email already exists" });

    // if creating sales, ensure sales fields provided
    if (userType === "sales") {
      if (!salespersonId || !department || !supervisorId || !supervisorName) {
        return res.status(400).json({ message: "Missing salesperson details" });
      }
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashed,
      contactNo,
      userType,
      salespersonId: userType === "sales" ? salespersonId : null,
      department: userType === "sales" ? department : null,
      supervisorId: userType === "sales" ? supervisorId : null,
      supervisorName: userType === "sales" ? supervisorName : null,
    });

    logger.info(
      `Admin(${req.user.id}) created user: ${email} type=${userType}`
    );

    // Return all user fields except password
    const userObj = user.toObject();
    delete userObj.password; // remove password before sending

    res.status(201).json({
      message: "User created",
      data: userObj,
    });
  } catch (err) {
    next(err);
  }
};
