const axios = require("axios");
const { default: mongoose } = require("mongoose");
const User = require("../models/user");
const Payment = require("../models/payment");

const getUser = async (req, res) => {
  const userId = req.userId;
  const user = await User.findById(userId).select("email credits");
  if (!user) {
    return res.status(404).json({ msg: "user not found" });
  }
  // console.log(user);

  res.status(200).json(user);
};

const updateCredit = async (req, res) => {
  try {
    const userId = req.userId;
    const credits = 3;
    const amount = req.body.amount;

    if (credits === undefined || credits < 0) {
      return res.status(400).json({ msg: "Invalid credits value" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ msg: "user not found" });
    }


   const payment = new Payment({
  userId,
  payment_status: 1,
  total_amount: amount, // Note: your schema uses `total_amount`, not `amount`
});

await payment.save();


    user.credits = credits;
    user.total_amount += amount;
    user.payment_count+=1;


    const resp = await user.save();
    res.status(200).json({ success: true, credits: user.credits });
  } catch (error) {
    console.error("Error updating credits:", error.message);
    res.status(500).json({ success: false, msg: "Server error" });
  }
};


const getPaymentHistory = async (req, res) => {
  try {
    const userId = req.userId;

    // Fetch user details
    const user = await User.findById(userId).select("email payment_count total_amount");
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Fetch payment history
    const payments = await Payment.find({ userId })
      .select("amount payment_status createdAt")
      .sort({ createdAt: -1 }); // Sort by newest first

    res.status(200).json({
      success: true,
      user: {
        email: user.email,
        payment_count: user.payment_count,
        total_amount: user.total_amount
      },
      payments: payments.map(payment => ({
        amount: payment.amount,
        payment_status: payment.payment_status,
        createdAt: payment.createdAt
      }))
    });
  } catch (error) {
    console.error("Error fetching payment history:", error.message);
    res.status(500).json({ success: false, msg: "Server error" });
  }
};

module.exports = { getUser, updateCredit , getPaymentHistory };
