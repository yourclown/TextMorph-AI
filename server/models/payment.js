const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    payment_status: { type: Number, required: true, default:0 },
    amount: { type: Number, required: true, default:0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payment", paymentSchema); 
