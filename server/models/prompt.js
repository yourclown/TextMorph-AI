const mongoose = require("mongoose");

const promptSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    genre: { type: String, required: true },
    promptText: { type: String, required: true },
    responseText: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Prompt", promptSchema); 
