import jwt from "jsonwebtoken";
import User from "../models/User.js";

// 🔹 Protect Routes
export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith("Bearer ")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({ success: false, message: "Not authorized, token missing" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({ success: false, message: "Not authorized, user not found" });
    }

    req.user = user; // attach user object
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Not authorized, token invalid/expired",
    });
  }
};

// 🔹 Role-based access control
export const authorize = (...allowedTypes) => {
  return (req, res, next) => {
    if (!req.user || !allowedTypes.includes(req.user.userType)) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: Access denied",
      });
    }
    next();
  };
};
