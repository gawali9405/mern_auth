import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    verifyOtp: { type: Number, default: null },
    verifyOtpExpiryAt: { type: Date, default: null },
    isVerified: { type: Boolean, default: false },
    resetOtp: { type: Number, default: null },
    resetOtpExpiryAt: { type: Date, default: null },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

export default User;
