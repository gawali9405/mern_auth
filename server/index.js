import express from "express";
import "dotenv/config";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import userRouter from "./routes/userRoute.js";

const app = express();
connectDB();

// ✅ List all frontend origins you want to allow
const allowedOrigins = [
  process.env.FRONTEND_URL,                      // from .env (production)
  "https://mern-auth-mt5o553px-gawali.vercel.app", // your current frontend
  "http://localhost:3000",                       // local development
];

// ✅ CORS configuration
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like Postman, curl)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        console.warn(`❌ CORS blocked request from origin: ${origin}`);
        return callback(new Error("Not allowed by CORS"), false);
      }
    },
    credentials: true, // allow cookies / authorization headers
  })
);

// ✅ Handle preflight (OPTIONS) requests
app.options("*", cors({
  origin: allowedOrigins,
  credentials: true,
}));

// Middlewares
app.use(cookieParser());
app.use(express.json());

// API Endpoints
app.get("/", (req, res) => {
  res.send("API is running");
});

app.use("/api/user", userRouter);

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`✅ Server is running on port http://localhost:${PORT}`);
});
