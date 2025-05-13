// app.js
require('dotenv').config(); 
const express   = require("express");
const mongoose  = require("mongoose");
const http      = require("http");
const cors      = require("cors");
const dotenv    = require("dotenv");
const bodyParser = require("body-parser");
const errorHandler = require("./middleware/errorHandler");

const authRouter    = require("./routes/authRoutes");
const promptRouter  = require("./routes/promptsRouter");
const userRouter    = require("./routes/getUserRouter");
const paymentRouter = require("./routes/paymentRouter");
const postRoutes    = require("./routes/postRoutes");
const startCreditResetJob = require("./cron/creditReset");

const { initSocket } = require("./socket/socketServices");  

dotenv.config();

const app    = express();
const server = http.createServer(app);

// Initialize Socket.IO and get the instance & user map
const { io, onlineUsers } = initSocket(server, {
  origin: "http://localhost:5173",
  credentials: true
});

// Make io & onlineUsers available in controllers via app.locals
app.locals.io = io;
app.locals.onlineUsers = onlineUsers;

// Standard middleware
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));
app.use(bodyParser.json());
app.use(express.json());

// Routes
app.use("/api/auth",    authRouter);
app.use("/api/prompt",  promptRouter);
app.use("/api/user",    userRouter);
app.use("/api/payment", paymentRouter);
app.use("/api/posts", postRoutes);

app.use(errorHandler);

// Connect DB & start server
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    server.listen(5000, () => {
      startCreditResetJob();
      console.log("Server running on http://localhost:5000");
    });
  })
  .catch(err => console.error("MongoDB connection error:", err));
