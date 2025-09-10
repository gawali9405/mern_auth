import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "../config/db.js";
import userRouter from "../routes/userRoute.js";

const app = express();

// connect db
connectDB();

// middleware
app.use(cors({
  origin: "https://mern-auth-mt5o553px-gawali.vercel.app",
  credentials: true,
}));
app.use(cookieParser());
app.use(express.json());

// routes
app.get("/", (req, res) => {
  res.send("API is running");
});
app.use("/api/user", userRouter);

export default app; // <- THIS is what Vercel will use as serverless handler
