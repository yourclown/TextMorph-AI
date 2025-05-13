const express = require("express");
const {
  signup,
  login,
  googleLogin,
  logout,
  requestPasswordReset,
  verifyOTPAndResetPassword,
} = require("../controllers/authController");
const { signupValidator } = require("../utils/validators");
const { validationResult } = require("express-validator");
const catchAsync = require("../utils/catchAsync");
const rateLimit = require("express-rate-limit");
const router = express.Router();

// Rate limiter for reset password route
const resetPasswordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit to 5 requests per window
  message: { success: false, error: "Too many requests, please try again later" },
});

router.post(
  "/signup",
  signupValidator,
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    next();
  },
  catchAsync(signup)
);

router.post("/login", catchAsync(login));
router.post("/google", catchAsync(googleLogin));
router.post("/logout", catchAsync(logout));
router.post("/reset-password", resetPasswordLimiter, requestPasswordReset);
router.post("/verify-otp", verifyOTPAndResetPassword);

module.exports = router;