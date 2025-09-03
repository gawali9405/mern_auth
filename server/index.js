import express from "express";
import "dotenv/config";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js"; 
import userRouter from "./routes/userRoute.js";

const app = express();  


app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
}));
app.use(cookieParser());
app.use(express.json());

//API Endpoints
app.get("/", (req, res) => {
  res.send("API is running");
});

app.use("/api/user", userRouter)


const PORT = process.env.PORT || 8000;
connectDB();

app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});