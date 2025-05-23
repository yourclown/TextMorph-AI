// models/eventRegistration.js
const mongoose = require("mongoose");
const crypto = require("crypto");


const eventRegistrationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    eventId: { type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true },
        registrationToken: { type: String, unique: true, required: true },

  },
  { timestamps: true }
);

eventRegistrationSchema.pre("save", async function (next) {
  if (!this.registrationToken) {
    let isUnique = false;
    let attempts = 0;
    const maxAttempts = 3;

    while (!isUnique && attempts < maxAttempts) {
      this.registrationToken = crypto.randomBytes(16).toString("hex");
      try {
        // Check if token exists
        const existing = await mongoose.models.EventRegistration.findOne({
          registrationToken: this.registrationToken,
        });
        if (!existing) {
          isUnique = true;
        }
      } catch (error) {
        return next(error);
      }
      attempts++;
    }

    if (!isUnique) {
      return next(new Error("Failed to generate unique registration token"));
    }
  }
  next();
});

module.exports = mongoose.model("EventRegistration", eventRegistrationSchema);