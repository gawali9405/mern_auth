import express from "express";
import {
  isAuthenticated,
  login,
  logout,
  register,
  sendPasswordResetOtp,
  sendVerificationOtp,
  verifyPasswordResetOtp,
  verifyVerificationOtp,
} from "../controllers/authController.js";
import userAuth from "../middleware/userAuth.js";

const authRouter = express.Router();

// Register Route
authRouter.post("/register", register);

// Login Route
authRouter.post("/login", login);

// Logout Route
authRouter.post("/logout", logout);

// Verify Email Route
authRouter.post("/send-verify-otp", userAuth, sendVerificationOtp);

// Resend Verification OTP Route
authRouter.post("/verify-otp", userAuth, verifyVerificationOtp);

// Check if user is authenticated or not
authRouter.post("/is-auth", userAuth, isAuthenticated);

// send reset otp
authRouter.post("/send-reset-otp", sendPasswordResetOtp);

// reset password 
authRouter.post("/reset-password", verifyPasswordResetOtp);

export default authRouter;
