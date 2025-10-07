import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import Payment from "../models/Payment.js";

const router = express.Router();

// Get all payments for current user
router.get("/", authMiddleware, async (req, res) => {
  try {
    const payments = await Payment.find({ userId: req.user.id });
    res.json(payments);
  } catch (err) {
    console.error("Error fetching payments:", err);
    res.status(500).json({ message: "Failed to fetch payments" });
  }
});

// Create a new payment
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { amount, currency, recipientAccount, swiftCode, reference } = req.body;

    const payment = new Payment({
      userId: req.user.id,
      amount,
      currency,
      recipientAccount,
      swiftCode,
      reference,
      status: "Pending",
    });

    await payment.save();
    res.json(payment);
  } catch (err) {
    console.error("Error creating payment:", err);
    res.status(400).json({ message: "Failed to create payment" });
  }
});

export default router;
