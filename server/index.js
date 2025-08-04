import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import authRouter from "./routes/authRoutes.js";

const app = express();
connectDB();

app.use(cors());
app.use(cookieParser());
app.use(express.json());

//API Endpoints
app.get("/", (req, res) => {
  res.send("API is running");
});

//Auth Endpoints
app.use("/api/auth", authRouter);

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
