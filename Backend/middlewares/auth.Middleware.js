import jwt from "jsonwebtoken";
import User from "../models/user.Model.js";

// Protect routes: verify JWT and attach user
export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({ success: false, message: "Not authorized, token missing" });
  }

  try {
    // Decode token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch user without password
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({ success: false, message: "Not authorized, user not found" });
    }

    req.user = user; // full user object attached
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: "Not authorized, token invalid or expired" });
  }
};

// Role-based access control
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ success: false, message: "Forbidden: Access denied" });
    }
    next();
  };
};
