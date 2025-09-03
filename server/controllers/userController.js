import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import transporter from "../config/nodemailer.js";

// USER SIGNUP
export const userSignUpController = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "All fields are required", success: false });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(409)
        .json({ message: "User already exists", success: false });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      isVerified: false,
    });
    await newUser.save();

    const verifyToken = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "15m",
    });

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: "Verify your email address",
      text: `Please click on the link below to verify your email address:\n${process.env.BACKEND_URL}/api/user/verify/${verifyToken}`,
    };
    await transporter.sendMail(mailOptions);

    return res.status(201).json({
      message: "User registered successfully, please verify your email",
      user: { id: newUser._id, name: newUser.name, email: newUser.email },
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

//VERIFY EMAIL
export const verifyEmailController = async (req, res) => {
  try {
    const { token } = req.params;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    }
    user.isVerified = true;
    await user.save();
    return res.status(200).send(`
        <html>
          <head><title>Email Verified</title></head>
          <body style="font-family:sans-serif; text-align:center; padding:50px;">
            <h1>✅ Email verified successfully!</h1>
            <p>You can now close this window and log in.</p>
          </body>
        </html>
      `);
  } catch (error) {
    return res.status(400).json({
      message: "Invalid or expired token",
      error: error.message,
      success: false,
    });
  }
};

// LOGIN (with email verification check)
export const userLoginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Validate input
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "All fields are required", success: false });
    }

    // 2. Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    }

    // 3. Check if email is verified
    if (!user.isVerified) {
      return res.status(403).json({
        message: "Please verify your email before logging in",
        success: false,
      });
    }

    // 4. Check if password is correct
    const isPasswordMatched = await bcrypt.compare(password, user.password);
    if (!isPasswordMatched) {
      return res
        .status(401)
        .json({ message: "Invalid credentials", success: false });
    }

    // 5. Generate JWT
    const loginToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "2d",
    });

    // 6. Set HTTP-only cookie
    res.cookie("token", loginToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 2 * 24 * 60 * 60 * 1000, // 2 days
    });

    // 7. Send success response
    return res.status(200).json({
      message: "User logged in successfully",
      user: { id: user._id, name: user.name, email: user.email },
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
      success: false,
    });
  }
};

// LOGOUT
export const logoutController = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
  });
  return res
    .status(200)
    .json({ message: "Logged out successfully", success: true });
};

// FORGOT PASSWORD - SEND OTP
export const forgotPasswordController = async (req, res) => {
  try {
    const { email } = req.body;

    // 1. Validate input
    if (!email) {
      return res.status(400).json({
        message: "Email is required",
        success: false,
      });
    }

    // 2. Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        message:
          "If an account with this email exists, we've sent a password reset OTP",
        success: true, // Don't reveal if user exists for security
      });
    }

    // 3. Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes from now

    // 4. Save OTP to user
    user.resetPasswordOtp = otp;
    user.resetPasswordOtpExpiry = otpExpiry;
    await user.save();

    // 5. Send OTP via email
    const mailOptions = {
      from: process.env.SMTP_USER,
      to: email,
      subject: "Password Reset OTP",
      text: `Your OTP for password reset is: ${otp}\nThis OTP is valid for 15 minutes.`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Password Reset Request</h2>
          <p>You requested to reset your password. Use the following OTP to proceed:</p>
          <div style="background: #f4f4f4; padding: 10px; margin: 20px 0; text-align: center; font-size: 24px; letter-spacing: 5px;">
            ${otp}
          </div>
          <p>This OTP is valid for 15 minutes.</p>
          <p>If you didn't request this, please ignore this email.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    return res.status(200).json({
      message:
        "If an account with this email exists, we've sent a password reset OTP",
      success: true,
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    return res.status(500).json({
      message: "Error processing forgot password request",
      error: error.message,
      success: false,
    });
  }
};

// VERIFY OTP
export const verifyOtpController = async (req, res) => {
  try {
    const { email, otp } = req.body;

    // 1. Validate input
    if (!email || !otp) {
      return res.status(400).json({
        message: "Email and OTP are required",
        success: false,
      });
    }

    // 2. Find user and validate OTP
    const user = await User.findOne({
      email,
      resetPasswordOtp: otp,
      resetPasswordOtpExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid or expired OTP",
        success: false,
      });
    }

    // 3. Generate a one-time verification token
    const verificationToken = jwt.sign(
      { id: user._id, purpose: "otp-verification" },
      process.env.JWT_SECRET,
      { expiresIn: "5m" } // Short-lived token for security
    );

    // 4. Clear the OTP after successful verification
    user.resetPasswordOtp = undefined;
    user.resetPasswordOtpExpiry = undefined;
    await user.save();

    return res.status(200).json({
      message: "OTP verified successfully",
      success: true,
      verificationToken, // Send this token to be used for password reset
    });
  } catch (error) {
    console.error("OTP verification error:", error);
    return res.status(500).json({
      message: "Error verifying OTP",
      error: error.message,
      success: false,
    });
  }
};

// RESET PASSWORD HANDLER
export const resetPasswordController = async (req, res) => {
  try {
    const { newPassword } = req.body;
    const userId = req.userId;

    // 1. Validate input
    if (!newPassword) {
      return res.status(400).json({
        message: "New password is required",
        success: false,
      });
    }

    // 2. Find user by ID from token
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    // 3. Hash and update password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    return res.status(200).json({
      message: "Password reset successful",
      success: true,
    });
  } catch (error) {
    console.error("Reset password error:", error);
    return res.status(500).json({
      message: "Error resetting password",
      error: error.message,
      success: false,
    });
  }
};
