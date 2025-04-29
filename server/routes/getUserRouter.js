const express = require("express");
const auth = require("../middleware/authmiddleware");
const catchAsync = require("../utils/catchAsync");
const {getUser, updateCredit , getPaymentHistory}= require("../controllers/getUser")
const router = express.Router();

// Deduct credits endpoint
router.get('/get-user', auth, catchAsync(getUser));
router.post('/update-credits', auth, catchAsync(updateCredit));
router.get("/payment-history", auth, catchAsync(getPaymentHistory));



module.exports = router;
