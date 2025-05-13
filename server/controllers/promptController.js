// server/controllers/promptController.js
import axios from "axios";
import Prompt from "../models/prompt.js";
import User from "../models/user.js";
// import { invalidateUserCache } from "../helpers/userCache.js";

export const transformText = async (req, res) => {
  const io = req.app.locals.io;
  const onlineUsers = req.app.locals.onlineUsers;
  const userId = req.userId;
  const socketId = onlineUsers[userId];

  // 1) Immediately notify client we’ve kicked off the job
  if (socketId) {
    io.to(socketId).emit("transformation-started", {
      message: "Preparing your transformation…",
    });
  }

  // 2) Send HTTP response right away
  res.status(200).json({
    success: true,
    message:
      "Your transformation is being prepared. You’ll get a real-time notification when it’s done.",
  });

  try {
    // 3) Simulate delay before AI call
    await new Promise((r) => setTimeout(r, 10000));

    // 4) Perform the actual AI call
    const { text, genre } = req.body;
    const apiKey = process.env.GROQ_API_KEY;
    const prompt = `create a story in 50 words with ${genre} style:\n\n${text}`;

    const aiRes = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.3-70b-versatile",
        max_tokens: 50,
        messages: [
          {
            role: "system",
            content:
              "You are a creative writing assistant specializing in transforming text into various genres.",
          },
          { role: "user", content: prompt },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
      }
    );

    const transformedText = aiRes.data.choices[0].message.content;

    // 5) Save to DB and deduct credit
    await Prompt.create({
      userId,
      genre,
      promptText: text,
      responseText: transformedText,
    });

    const user = await User.findById(userId);
    user.credits -= 1;
    user.lastCreditDeductedAt = new Date();
    await user.save();

    // await invalidateUserCache(userId);

    // 6) Finally, notify client that transformation is complete
    if (socketId) {
      io.to(socketId).emit("transformation-complete", {
        message: "Your transformation is ready!",
        transformedText,
        credits: user.credits,
      });
    }
  } catch (err) {
    console.error("Error in background transformation:", err);
    if (socketId) {
      io.to(socketId).emit("transformation-failed", {
        message: "Oops, something went wrong during transformation.",
      });
    }
  }
};

export const getHistory = async (req, res) => {
  try {
    const userId = req.userId;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 3;
    const search = req.query.search || "";
    const genre = req.query.genre || "";
    const skip = (page - 1) * limit;

    // Build query
    const query = { userId };

    // Add search filter for promptText or responseText
    if (search) {
      query.$or = [
        { promptText: { $regex: search, $options: "i" } },
        { responseText: { $regex: search, $options: "i" } },
      ];
    }

    // Add genre filter
    if (genre) {
      query.genre = genre;
    }

    // Fetch paginated results
    const history = await Prompt.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec();

    // Count total matching documents
    const total = await Prompt.countDocuments(query);

    return res.status(200).json({
      success: true,
      history,
      total,
      page,
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Error fetching history:", error.message);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
