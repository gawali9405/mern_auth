import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate, useLocation } from "react-router-dom";
import { API_URL } from "../config.js"

const VerifyOtp = () => {
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const inputsRef = useRef([]);
  const location = useLocation();
  const email = location?.state?.email || ""; // safely get email from navigate state

  // Autofocus first OTP box when page loads
  useEffect(() => {
    if (inputsRef.current[0]) {
      inputsRef.current[0].focus();
    }
  }, []);

  const handleOtpChange = (e, index) => {
    const value = e.target.value;
    if (/[^0-9]/.test(value)) return; // allow only numbers

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1); // only one digit
    setOtp(newOtp);

    // Move focus to next input automatically
    if (value && index < 5) {
      inputsRef.current[index + 1].focus();
    }
  };

  const handleBackspace = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const otpString = otp.join("");

    if (!email || otpString.length < 6) {
      toast.error("Please enter your Email and complete the 6-digit OTP.");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(
        `${API_URL}/api/user/verify-otp`,
        {
          email,
          otp: otpString,
        }
      );
      console.log(res.data.verificationToken);
      if (res.data?.success) {
        toast.success(res.data.message || "OTP verified successfully!");
        navigate("/reset-password", {
          state: { verificationToken: res.data.verificationToken },
        });
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Invalid or expired OTP.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900">
      <div className="relative w-full max-w-sm p-8 bg-white/10 backdrop-blur-lg rounded-3xl shadow-lg">
        <h1 className="text-3xl font-bold text-white mb-6 text-center">
          Verify OTP
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-white font-medium mb-1">Email</label>
            <input
              type="email"
              value={email}
              readOnly
              className="w-full px-4 py-3 rounded-xl bg-gray-500/30 text-white cursor-not-allowed focus:outline-none"
            />
          </div>
          <label className="block text-white font-medium mb-1">
            Enter the OTP sent to your email:
          </label>
          <div className="flex justify-between space-x-2">
            {otp.map((digit, index) => (
              <input
                key={index}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(e, index)}
                onKeyDown={(e) => handleBackspace(e, index)}
                ref={(el) => (inputsRef.current[index] = el)}
                className="w-12 h-12 text-center text-lg font-bold rounded-xl bg-white/20 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white/30 transition"
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition duration-300 cursor-pointer disabled:opacity-50"
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default VerifyOtp;
