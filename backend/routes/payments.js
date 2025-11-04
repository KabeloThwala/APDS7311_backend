import express from "express";

import authMiddleware from "../middleware/authMiddleware.js";
import { requireRoles } from "../middleware/roleMiddleware.js";
import {
  validatePaymentPayload,
  validateStatusUpdate,
} from "../middleware/validation.js";
import Payment from "../models/Payment.js";

const router = express.Router();

router.get("/", authMiddleware, async (req, res) => {
  try {
    const isCustomer = req.user.role === "customer";
    const filter = isCustomer ? { userId: req.user.id } : {};
    const payments = await Payment.find(filter)
      .sort({ createdAt: -1 })
      .populate("userId", "fullName accountNumber");

    res.json(payments);
  } catch (err) {
    console.error("Error fetching payments:", err);
    res.status(500).json({ message: "Failed to fetch payments" });
  }
});

router.post("/", authMiddleware, requireRoles(["customer"]), validatePaymentPayload, async (req, res) => {
  try {
    const payment = await Payment.create({
      ...req.body,
      status: "pending",
      userId: req.user.id,
    });
    res.status(201).json(payment);
  } catch (err) {
    console.error("Error creating payment:", err);
    res.status(400).json({ message: "Failed to create payment" });
  }
});

router.patch(
  "/:id/verify",
  authMiddleware,
  requireRoles(["employee", "admin"]),
  async (req, res) => {
    try {
      const payment = await Payment.findById(req.params.id);
      if (!payment) {
        res.status(404).json({ message: "Payment not found" });
        return;
      }

      if (payment.status !== "pending") {
        res.status(400).json({ message: "Only pending payments can be verified" });
        return;
      }

      payment.status = "verified";
      payment.verifiedBy = req.user.id;
      payment.verifiedAt = new Date();
      await payment.save();

      res.json(payment);
    } catch (err) {
      console.error("Error verifying payment:", err);
      res.status(400).json({ message: "Failed to verify payment" });
    }
  }
);

router.patch(
  "/:id/submit",
  authMiddleware,
  requireRoles(["employee", "admin"]),
  async (req, res) => {
    try {
      const payment = await Payment.findById(req.params.id);
      if (!payment) {
        res.status(404).json({ message: "Payment not found" });
        return;
      }

      if (payment.status !== "verified") {
        res.status(400).json({ message: "Only verified payments can be submitted" });
        return;
      }

      payment.status = "submitted";
      payment.submittedAt = new Date();
      await payment.save();

      res.json(payment);
    } catch (err) {
      console.error("Error submitting payment:", err);
      res.status(400).json({ message: "Failed to submit payment" });
    }
  }
);

router.patch(
  "/:id/reject",
  authMiddleware,
  requireRoles(["employee", "admin"]),
  async (req, res) => {
    try {
      const payment = await Payment.findById(req.params.id);
      if (!payment) {
        res.status(404).json({ message: "Payment not found" });
        return;
      }

      if (payment.status === "submitted") {
        res.status(400).json({ message: "Submitted payments cannot be rejected" });
        return;
      }

      payment.status = "rejected";
      payment.verifiedBy = req.user.id;
      payment.verifiedAt = new Date();
      await payment.save();

      res.json(payment);
    } catch (err) {
      console.error("Error rejecting payment:", err);
      res.status(400).json({ message: "Failed to reject payment" });
    }
  }
);

router.patch(
  "/:id/status",
  authMiddleware,
  requireRoles(["employee", "admin"]),
  validateStatusUpdate,
  async (req, res) => {
    try {
      const payment = await Payment.findById(req.params.id);
      if (!payment) {
        res.status(404).json({ message: "Payment not found" });
        return;
      }

      if (req.body.status === "verified" && payment.status !== "pending") {
        res.status(400).json({ message: "Only pending payments can be verified" });
        return;
      }

      payment.status = req.body.status;
      if (req.body.status === "verified") {
        payment.verifiedBy = req.user.id;
        payment.verifiedAt = new Date();
      }
      if (req.body.status === "submitted") {
        payment.submittedAt = new Date();
      }

      await payment.save();
      res.json(payment);
    } catch (err) {
      console.error("Error updating payment status:", err);
      res.status(400).json({ message: "Failed to update payment status" });
    }
  }
);

export default router;
