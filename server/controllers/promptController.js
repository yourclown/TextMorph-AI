const axios = require("axios");
const { default: mongoose } = require("mongoose");
const Prompt = require("../models/prompt"); // file name is 'prompt.js', small case
const User = require("../models/user");

const transformText = async (req, res) => {
  try {
    const { text, genre } = req.body;
    const userId = req.userId;
    const user = await User.findById(userId);
    // console.log("user:id",userID);
    // process.exit();

    if (!text || !genre) {
      return res
        .status(400)
        .json({ error: "Missing text or genre in request body" });
    }

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "Groq API key not configured" });
    }

    const prompt = `create a story in 100 words with ${genre} style:\n\n${text}`;

    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.3-70b-versatile", // Using LLaMA 3.3 70B model as per the cURL
        max_tokens: 500,
        messages: [
          {
            role: "system",
            content:
              "You are a creative writing assistant specializing in transforming text into various genres.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
      }
    );

    // Extract the transformed text from Groq's response
    const transformedText = response.data.choices[0].message.content;
    console.log(transformedText);

    const newPrompt = new Prompt({
      userId: userId,
      genre: genre,
      promptText: text,
      responseText: transformedText,
    });

     await newPrompt.save();
    if (!user) {
      throw new Error("User not found");
    }

    user.credits -= 1;
    await user.save();

    return res.status(200).json({
      success: true,
      transformedText,
      credits: user.credits,
    });
  } catch (error) {
    console.error(
      "Error transforming text:",
      error.response?.data || error.message
    );
    return res.status(500).json({
      success: false,
      error: error.response?.data?.error || error.message,
    });
  }
};

const getHistory = async (req, res) => {
  try {
    const userId = req.userId;

    const history = await Prompt.find({ userId })
      .sort({ createdAt: -1 })
      .exec();

    return res.status(200).json({ success: true, history });
  } catch (error) {
    console.error("Error fetching history:", error.message);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

module.exports = { transformText, getHistory };
