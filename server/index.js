// index.js
import express from "express";
import "dotenv/config";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import userRouter from "./routes/userRoute.js";

const app = express();

// ✅ Connect to Database
connectDB();

// ✅ CORS Configuration
const allowedOrigins = [
  "https://mern-auth-mt5o553px-gawali.vercel.app",   
];

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = "The CORS policy for this site does not allow access from the specified Origin.";
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
}));

// ✅ Handle preflight requests
app.options("*", cors());

// ✅ Middleware
app.use(cookieParser());
app.use(express.json());

// ✅ Routes
app.get("/", (req, res) => {
  res.send("API is running");
});

app.use("/api/user", userRouter);

// ✅ Export for Vercel (no app.listen)
export default app;
