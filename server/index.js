import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "../config/db.js";
import userRouter from "../routes/userRoute.js";

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(
  cors({
    origin: "https://mern-auth-mt5o553px-gawali.vercel.app", // frontend URL
    credentials: true, // allow cookies
  })
);
app.use(cookieParser());
app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.send("API is running");
});
app.use("/api/user", userRouter);

// For Vercel serverless function export
export default app;
