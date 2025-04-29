const express= require("express");
const mongoose = require("mongoose");
const cors= require("cors");
const dotenv= require("dotenv");
const bodyParser = require("body-parser");
const errorHandler = require("./middleware/errorHandler")


dotenv.config();


const authRouter = require("./routes/authRoutes")
const promtRouter= require("./routes/promptsRouter")
const UserRouter= require("./routes/getUserRouter")
const paymentRouter =require("./routes/paymentRouter")

const app= express();
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}))
app.use(express.json());


app.use("/api/auth", authRouter);
app.use("/api/prompt", promtRouter);
app.use("/api/user",UserRouter);
app.use("/api/payment",paymentRouter);

app.use(errorHandler);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(5000, () => console.log("Server running on http://localhost:5000"));
  })