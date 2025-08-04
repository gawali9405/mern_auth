import express from "express";
import { login, logout, register } from "../controllers/authController.js";

const authRouter = express.Router();

// Register Route
authRouter.post("/register", register);

// Login Route
authRouter.post("/login", login);

// Logout Route
authRouter.post("/logout", logout);

export default authRouter;
