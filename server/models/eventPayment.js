const mongoose = require("mongoose");

const eventPaymentSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    eventRegistrationId: { type: mongoose.Schema.Types.ObjectId, ref: "EventRegistration", required: true },
    amount: { type: Number, required: true },
    status: { type: String, enum: ["pending", "completed", "failed"], default: "pending" },
    method: { type: String, enum: ["credit_card", "paypal", "cash"] },
    paidAt: { type: Date }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Event_Payment", eventPaymentSchema);