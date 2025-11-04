import express from "express";

import authMiddleware from "../middleware/authMiddleware.js";
import { requireRoles } from "../middleware/roleMiddleware.js";
import Payment from "../models/Payment.js";

const router = express.Router();

router.get(
  "/dashboard",
  authMiddleware,
  requireRoles(["employee", "admin"]),
  async (req, res) => {
    try {
      const [pending, verified, submitted, rejected] = await Promise.all([
        Payment.countDocuments({ status: "pending" }),
        Payment.countDocuments({ status: "verified" }),
        Payment.countDocuments({ status: "submitted" }),
        Payment.countDocuments({ status: "rejected" }),
      ]);

      res.json({
        user: req.user,
        metrics: { pending, verified, submitted, rejected },
      });
    } catch (err) {
      console.error("Admin dashboard error:", err);
      res.status(500).json({ message: "Failed to load dashboard" });
    }
  }
);

export default router;
