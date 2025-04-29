const express = require("express");
const auth = require("../middleware/authmiddleware");
const { createOrder, verifyPayment } = require("../controllers/paymentController");
const catchAsync = require("../utils/catchAsync");

const router = express.Router();

router.post("/create-order", auth, catchAsync(createOrder));

// Verify Razorpay payment
router.post("/verify-payment", auth, catchAsync(verifyPayment));

module.exports = router;