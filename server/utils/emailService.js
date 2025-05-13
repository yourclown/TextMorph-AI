const nodemailer = require("nodemailer");
require('dotenv').config(); // ← load .env right away

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASS,
  },
});

async function sendLowCreditEmail(to, credits) {
    return await transporter.sendMail({ // ← add return here
        from: process.env.GMAIL_USER,
    to,
    subject: "Your TextMorph AI credits are low",
    html: `
      <p>Hi there!</p>
      <p>You have only <strong>${credits}</strong> credit${credits === 1 ? "" : "s"} left.</p>
      <p><a href="https://yourdomain.com/credit-topup">Recharge now</a> to continue using TextMorph AI without interruption.</p>
      <p>Thanks,<br/>The TextMorph AI Team</p>
    `,
  });
}

async function sendResetPasswordOTP(to, otp) {
  return await transporter.sendMail({
    from: process.env.GMAIL_USER,
    to,
    subject: "TextMorph AI Password Reset OTP",
    html: `
      <p>Hi there!</p>
      <p>You requested to reset your password. Your OTP is:</p>
      <h2>${otp}</h2>
      <p>This OTP is valid for 10 minutes. Do not share it with anyone.</p>
      <p>If you did not request this, please ignore this email.</p>
      <p>Thanks,<br/>The TextMorph AI Team</p>
    `,
  });
}

module.exports = { sendLowCreditEmail ,sendResetPasswordOTP}; // ✅ correct export
