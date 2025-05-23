const Event = require("../models/event");
const EventRegistration = require("../models/eventRegistration");
const eventPayment = require("../models/eventPayment");
const User = require("../models/user");
const { sendEventRegistrationEmail } = require("../utils/emailService");
const Razorpay = require("razorpay");
const crypto = require("crypto");


const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});


const createEvent = async (req, res) => {
  try {
    const { name, date, location, description } = req.body;
    const userId = req.userId;

    if (!name || !date || !location || !description) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const event = new Event({
      userId,
      name,
      date,
      location,
      description,
    });

    await event.save();

    res.status(201).json({ success: true, message: "Event created successfully" });
  } catch (error) {
    console.error("Error creating event:", error.message);
    res.status(500).json({ success: false, error: "Server error" });
  }
};


const getEvents = async (req, res) => {
  try {
// console.log(req.body);
    const events = await Event.find().populate("userId", "email");
    console.log("hiii",events);
    res.status(200).json({ success: true, events });
  } catch (error) {
    console.error("Error fetching events:", error.message);
    res.status(500).json({ success: false, error: "Server error" });
  }
};


const getMyEvents = async (req, res) => {
  try {
    const userId = req.userId;
    const registrations = await EventRegistration.find({ userId }).populate({
      path: "eventId",
      select: "name date location description",
    });

    const events = registrations.map((reg) => ({
      registrationId: reg._id,
      registrationToken: reg.registrationToken,
      name: reg.eventId.name,
      date: reg.eventId.date,
      location: reg.eventId.location,
      description: reg.eventId.description,
    }));

    res.status(200).json({ success: true, events });
  } catch (error) {
    console.error("Error fetching registered events:", error.message);
    res.status(500).json({ success: false, error: "Server error" });
  }
};


const createEventOrder = async (req, res) => {
  try {
    const { eventId, amount } = req.body;
    const userId = req.userId; // Assuming auth middleware provides userId

    if (!eventId || !amount) {
      return res.status(400).json({ error: "Event ID and amount are required" });
    }

    const options = {
      amount: amount * 100, // Convert to paise (Razorpay expects amount in smallest currency unit)
      currency: "INR",
      receipt: `receipt_event_${Date.now()}`,
      notes: { type: "event", eventId },
    };

    const order = await razorpay.orders.create(options);
    console.log(order);
    return res.status(200).json({
      success: true,
      order_id: order.id,
      currency: order.currency,
      amount: order.amount,
    });
  } catch (error) {
    console.error("Error creating event order:", error.message);
    return res.status(500).json({ success: false, error: error.message });
  }
};

// Verify payment and register user for event
const verifyEventPayment = async (req, res) => {
  try {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;
    const userId = req.userId;
    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
        return res.status(400).json({ error: "Missing payment details" });
    }

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(body)
    .digest("hex");

    console.log(expectedSignature);
    // process.exit();
    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ success: false, error: "Invalid signature" });
    }

    // Fetch order details to get notes
    const order = await razorpay.orders.fetch(razorpay_order_id);
    const notes = order.notes;

    if (notes.type !== "event" || !notes.eventId) {
      return res.status(400).json({ error: "Invalid order type for event registration" });
    }

    // --- FIX STARTS HERE ---
    // Generate a unique registration token before creating the EventRegistration
    let registrationToken;
    let isUnique = false;
    let attempts = 0;
    const maxAttempts = 5; // Set a reasonable number of attempts

    while (!isUnique && attempts < maxAttempts) {
      registrationToken = crypto.randomBytes(16).toString("hex");
      const existingRegistration = await EventRegistration.findOne({ registrationToken });
      if (!existingRegistration) {
        isUnique = true;
      }
      attempts++;
    }

    if (!isUnique) {
      // If after several attempts, we can't generate a unique token, throw an error
      return res.status(500).json({ success: false, error: "Failed to generate unique registration token. Please try again." });
    }

    // Register user for the event
    const registration = new EventRegistration({
      userId,
      eventId: notes.eventId,
      registrationToken, // Provide the generated token here
    });
    await registration.save();

     const event = await Event.findById(notes.eventId); // Use findById

    // You should also check if the event was actually found
    if (!event) {
      return res.status(404).json({ success: false, error: "Event not found after registration." });
    }

    // Record the payment
    const payment = new eventPayment({
      userId,
      eventRegistrationId: registration._id,
      amount: order.amount / 100, // Convert paise to INR
      status: "completed", // Align with schema's enum
      method: "credit_card", // Optional, set based on payment method (e.g., from Razorpay)
      paidAt: new Date(), // Optional, set for successful payments
    });
    await payment.save();

const user = await User.findById(userId);
    if (!user) {
      console.error("User not found for email sending");
    } else {
      sendEventRegistrationEmail(user, event, registration, payment).catch((err) => {
        console.error("Error sending email:", err);
      });
    }

    return res.status(200).json({ success: true, message: "Event registration successful" });
  } catch (error) {
    console.error("Error verifying event payment:", error.message);
    return res.status(500).json({ success: false, error: error.message });
  }
};


module.exports = { createEvent, getEvents , createEventOrder, verifyEventPayment , getMyEvents};