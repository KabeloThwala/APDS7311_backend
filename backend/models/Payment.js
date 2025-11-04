// backend/models/Payment.js
import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    amount: { type: Number, required: true, min: 0.01 },
    currency: {
      type: String,
      required: true,
      enum: ["USD", "EUR", "GBP", "ZAR"],
    },
    provider: {
      type: String,
      required: true,
      enum: ["SWIFT", "TransferWise", "WesternUnion"],
      default: "SWIFT",
    },
    recipientAccount: { type: String, required: true },
    swiftCode: { type: String, required: true },
    reference: { type: String, maxlength: 80 },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "verified", "submitted", "rejected"],
      default: "pending",
    },
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    verifiedAt: { type: Date },
    submittedAt: { type: Date },
  },
  { timestamps: true }
);

paymentSchema.set("toJSON", {
  transform: (_, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

export default mongoose.model("Payment", paymentSchema);
