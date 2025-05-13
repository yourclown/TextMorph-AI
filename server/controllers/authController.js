const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { OAuth2Client } = require("google-auth-library");
const catchAsync = require("../utils/catchAsync");
const { sendResetPasswordOTP } = require("../utils/emailService");
const OTP= require("../models/otp")


const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);


const signup = async (req, res) => {
  const { email, password } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ msg: "User already exists" });
  }

  const newUser = new User({ email, password });
  await newUser.save();

  res.status(201).json({ msg: "User created successfully" });
};
const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return res.status(400).json({ msg: "Invalid credentials" });
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return res.status(400).json({ msg: "Invalid credentials" });
  }

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: "2d", // 2 days expiry
  });

  res.cookie("auth_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production" ? true : false, 
    maxAge: 2 * 24 * 60 * 60 * 1000, // 2 days in milliseconds
    sameSite: "Strict",
  });
  
  res.json({ msg: "Login successful",token });
};

const googleLogin = async (req, res) => {
  const { id_token } = req.body;
  try {
    // 1) Verify the token
    const ticket = await client.verifyIdToken({
      idToken: id_token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const email    = payload.email;   // real email
    const googleId = payload.sub;     // unique Google user ID
    const name     = payload.name;
    const avatar   = payload.picture;

    // 2) Find or create
    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        email,
        googleId,
        name,
        avatar,
        // no password needed
      });
    }

    // 3) Issue your JWT
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "2d" }
    );

    res.json({ token });
  } catch (err) {
    console.error("Google login error:", err);
    res.status(401).json({ msg: "Google login failed" });
  }
};

const logout=(res,req)=>{
  console.log(req.body);


res.clearCookie("auth_token", {
    httpOnly: false,
    secure: process.env.NODE_ENV === "development",
    sameSite: "Strict",
  });

  res.json({ msg: "Logged out successfully" });
};

  const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };
  
  // Request OTP for password reset
  const requestPasswordReset = catchAsync(async (req, res) => {
    const { email } = req.body;
  
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }
  
    // Generate OTP
    const otp = generateOTP();
  
    // Save OTP to MongoDB
    await OTP.create({ email, otp });
  
    // Send OTP via email
    await sendResetPasswordOTP(email, otp);
  
    res.status(200).json({ success: true, message: "OTP sent to your email" });
  });
  
  // Verify OTP and reset password
  const verifyOTPAndResetPassword = catchAsync(async (req, res) => {
    const { email, otp, newPassword, confirmPassword } = req.body;
  
    // Validate inputs
    if (!email || !otp || !newPassword || !confirmPassword) {
      return res.status(400).json({ success: false, error: "All fields are required" });
    }
  
    if (newPassword !== confirmPassword) {
      return res.status(400).json({ success: false, error: "Passwords do not match" });
    }
  
    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, error: "Password must be at least 6 characters" });
    }
  
    // Find OTP
    const otpRecord = await OTP.findOne({ email, otp });
    if (!otpRecord) {
      return res.status(400).json({ success: false, error: "Invalid or expired OTP" });
    }
  
    // Find user
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }
  
    // Update password
    user.password = newPassword;
    await user.save();
  
    // Delete used OTP
    await OTP.deleteOne({ _id: otpRecord._id });
  
    res.status(200).json({ success: true, message: "Password reset successfully" });
  });
  
  module.exports = {
    signup,
    login,
    googleLogin,
    logout,
    requestPasswordReset,
    verifyOTPAndResetPassword,
  };