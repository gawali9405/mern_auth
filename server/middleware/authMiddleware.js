import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

export const authMiddleware = async (req, res, next) => {
  try {
    // 1. Read token from cookie
    const token = req.cookies.token;
    if (!token) {
      return res
        .status(401)
        .json({ message: "Not authenticated", success: false });
    }

    // 2. Verify JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3. Find user
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    }

    // 4. Check if email verified
    if (!user.isVerified) {
      return res
        .status(403)
        .json({ message: "Please verify your email first", success: false });
    }

    // 5. Attach user to request
    req.user = user;

    next(); // ✅ go to next middleware or route
  } catch (error) {
    return res
      .status(401)
      .json({ message: "Invalid or expired token", success: false });
  }
};
