import express from "express";
import {
  userSignUpController,
  verifyEmailController,
  userLoginController,
  logoutController,
  forgotPasswordController,
  verifyOtpController,
  resetPasswordController,
} from "../controllers/userController.js";

const userRouter = express.Router();

//USER ROUTES
userRouter.post("/sign-up", userSignUpController);
userRouter.get("/verify/:token", verifyEmailController);
userRouter.post("/sign-in", userLoginController);
userRouter.post("/logout", logoutController);
// Password reset flow
userRouter.post("/forgot-password", forgotPasswordController);
userRouter.post("/verify-otp", verifyOtpController);
userRouter.post("/reset-password", resetPasswordController);

export default userRouter;
