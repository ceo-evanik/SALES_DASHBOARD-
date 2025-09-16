// backend/middlewares/roleMiddleware.js
export default function roleMiddleware(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });
    const role = req.user.userType || req.user.role;
    if (!allowedRoles.includes(role)) return res.status(403).json({ message: "Forbidden: insufficient rights" });
    next();
  };
}
