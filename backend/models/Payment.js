// backend/models/Payment.js
import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  amount: { type: Number, required: true },
  currency: { type: String, required: true },
  recipientAccount: { type: String, required: true },
  swiftCode: { type: String, required: true },
  reference: { type: String },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  status: { type: String, enum: ["pending", "verified", "completed"], default: "pending" },
}, { timestamps: true });

export default mongoose.model("Payment", paymentSchema);
