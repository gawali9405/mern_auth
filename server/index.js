import express from "express";
import "dotenv/config";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import userRouter from "./routes/userRoute.js";

const app = express();
connectDB();

// CORS setup
const allowedOrigin = process.env.FRONTEND_URL || "https://mern-auth-sandy.vercel.app";

app.use(cors({
  origin: allowedOrigin,
  credentials: true,
}));

// Handle preflight requests
app.options('*', cors({
  origin: allowedOrigin,
  credentials: true,
}));

app.use(cookieParser());
app.use(express.json());

// API Endpoints
app.get("/", (req, res) => {
  res.send("API is running");
});

app.use("/api/user", userRouter);

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});
