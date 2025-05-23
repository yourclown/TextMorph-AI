require("dotenv").config();

const nodemailer = require("nodemailer");
const puppeteer = require('puppeteer');
const ejs = require("ejs");
// const pdf = require("html-pdf");
const fs = require("fs").promises;
const path = require("path");

// Configure email transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASS,
  },
});


// Generic function to send email
const sendEmail = async (emailData) => {
  try {
    await transporter.sendMail(emailData);
    console.log(`Email sent successfully to ${emailData.to}`);
  } catch (error) {
    console.error(`Error sending email to ${emailData.to}:`, error.message);
    throw new Error(`Failed to send email: ${error.message}`);
  }
};

// Send low credit email
const sendLowCreditEmail = async (to, credits) => {
  const emailData = {
    from: process.env.GMAIL_USER,
    to,
    subject: "Your Mindryl-Ai Credits Are Low",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #333;">Hello!</h1>
        <p style="color: #555;">You have only <strong>${credits}</strong> credit${credits === 1 ? "" : "s"} left.</p>
        <p style="color: #555;"><a href="https://mindryl-ai.com/credit-topup" style="color: #007bff;">Recharge now</a> to continue using Mindryl-Ai without interruption.</p>
        <p style="color: #555;">Thanks,<br><strong>Mindryl-Ai Team</strong></p>
      </div>
    `,
  };
  return sendEmail(emailData);
};

// Send reset password OTP email
const sendResetPasswordOTP = async (to, otp) => {
  const emailData = {
    from: process.env.GMAIL_USER,
    to,
    subject: "Mindryl-Ai Password Reset OTP",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #333;">Hello!</h1>
        <p style="color: #555;">You requested to reset your password. Your OTP is:</p>
        <h2 style="color: #007bff;">${otp}</h2>
        <p style="color: #555;">This OTP is valid for 10 minutes. Do not share it with anyone.</p>
        <p style="color: #555;">If you did not request this, please ignore this email.</p>
        <p style="color: #555;">Thanks,<br><strong>Mindryl-Ai Team</strong></p>
      </div>
    `,
  };
  console.log(emailData);
  process.exit();
  return sendEmail(emailData);
};

// Generate PDF invoice from EJS template
const generateInvoicePDF = async (data) => {
  try {
    if (!data.user || !data.event || !data.registration || !data.payment) {
      throw new Error("Missing required data for invoice generation");
    }

    const templatePath = path.join(__dirname, "../views/invoice.ejs");
    const html = await ejs.renderFile(templatePath, data);

    const pdfPath = path.join(__dirname, `../temp/invoice_${data.registration._id}.pdf`);
    await fs.mkdir(path.dirname(pdfPath), { recursive: true });

    const browser = await puppeteer.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox"], // Required for many server environments
    });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" }); // Ensure content is fully loaded
    await page.pdf({
      path: pdfPath,
      format: "A4",
      printBackground: true, // Include CSS backgrounds in the PDF
    });
    await browser.close();

    return pdfPath;
  } catch (error) {
    console.error("Error in generateInvoicePDF:", error.message);
    throw error;
  }
};

// Send event registration email with PDF invoice (unchanged)
const sendEventRegistrationEmail = async (user, event, registration, payment) => {
  console.log([user, event, registration, payment]);
  try {
    // Generate PDF invoice
    const pdfPath = await generateInvoicePDF({ user, event, registration, payment });

    // Email data with simplified HTML body and PDF attachment
    const emailData = {
      from: process.env.GMAIL_USER,
      to: user.email,
      subject: "Event Registration Confirmation - Mindryl-Ai",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <p style="color: #555;">Thank you for registering for <strong>${event.name}</strong>!</p>
          <p style="color: #555;">Please find your invoice attached for your records.</p>
          <p style="color: #555;">If you have any questions, contact us at <a href="mailto:contact@mindryl-ai.com" style="color: #007bff;">contact@mindryl-ai.com</a>.</p>
          <p style="color: #555;">Best regards,<br><strong>Mindryl-Ai Team</strong></p>
        </div>
      `,
      attachments: [
        {
          filename: `Invoice_${registration._id}.pdf`,
          path: pdfPath,
          contentType: "application/pdf",
        },
      ],
    };

    // Send email
    await sendEmail(emailData);

    // Clean up temporary PDF file
    await fs.unlink(pdfPath).catch((err) => console.error("Error deleting PDF:", err.message));
  } catch (error) {
    console.error("Error in sendEventRegistrationEmail:", error.message);
    throw error; // Let caller handle
  }
};

module.exports = {
  sendLowCreditEmail,
  sendResetPasswordOTP,
  sendEventRegistrationEmail,
  sendEmail,
};