import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Optional simple admin-only route check
function adminOnly(req, res, next) {
  if (req.user?.role !== "admin") {
    res.status(403).json({ message: "Admins only" });
    return;
  }
  next();
}

// Example admin route
router.get("/dashboard", authMiddleware, adminOnly, (req, res) => {
  res.json({ message: "Welcome to the admin dashboard", user: req.user });
});

export default router;
