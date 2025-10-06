const express = require("express");
const router = express.Router();
const { processPayment } = require("../services/paymentProcessorMock");

// POST /api/payments/create
// Body: { amount: number, userId: string }
router.post("/create", async (req, res) => {
  try {
    const { amount, userId } = req.body;
    if (typeof amount !== "number" || !userId) {
      return res.status(400).json({ error: "Invalid payload: amount (number) and userId are required." });
    }

    // Call mock payment processor
    const paymentResult = await processPayment(amount, userId);

    return res.status(200).json({
      message: "Payment processed (mock).",
      paymentResult,
    });
  } catch (err) {
    console.error("Payment processing error:", err);
    return res.status(500).json({ error: "Payment processing failed." });
  }
});

// simple test route: GET /api/payments/test
router.get("/test", (req, res) => res.json({ message: "Payments route OK" }));

module.exports = router;
