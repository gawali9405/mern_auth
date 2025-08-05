import express from "express";
import { getUserData } from "../controllers/userController.js";
import userAuth from "../middleware/userAuth.js";

const userRouter = express.Router();

// Get user data
userRouter.get("/data", userAuth, getUserData);

export default userRouter;
