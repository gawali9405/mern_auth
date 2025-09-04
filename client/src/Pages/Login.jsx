import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { useAuth } from "../Context/AuthContext"; 

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth(); // <-- use the login function from context

  const [formData, setFormData] = useState({ email: "", password: "" });

  // Handle input changes
  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Handle login form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8000/api/user/sign-in",
        formData
      );

      // ✅ Update context + localStorage instantly
      login(response.data.user, response.data.token);

      toast.success("Login successful!");
      navigate("/");
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message || "Something went wrong. Try again!"
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900">
      <div className="relative w-full max-w-sm p-8 bg-white/10 backdrop-blur-lg rounded-3xl shadow-lg">
        <h1 className="text-4xl font-bold text-white mb-6 text-center">
          Login
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email field */}
          <div>
            <label className="block text-white font-medium mb-1">Email</label>
            <input
              type="text"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              className="w-full px-4 py-3 rounded-xl bg-white/20 placeholder-gray-300 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white/30 transition"
              required
            />
          </div>

          {/* Password field */}
          <div>
            <label className="block text-white font-medium mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="********"
              className="w-full px-4 py-3 rounded-xl bg-white/20 placeholder-gray-300 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white/30 transition"
              required
            />
          </div>

          {/* Remember me + forgot password */}
          <div className="flex justify-between items-center text-sm text-gray-200">
            <label className="flex items-center gap-2">
              <input type="checkbox" className="accent-blue-800" />
              Remember me
            </label>
            <Link to="/forgot-password" className="hover:underline text-orange-500">
              Forgot Password?
            </Link>
          </div>

          {/* Login button */}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition duration-300 cursor-pointer"
          >
            LOGIN
          </button>

          {/* Sign-up link */}
          <p className="text-sm text-gray-200 mt-4">
            Don't have an account?{" "}
            <Link to="/sign-up" className="text-orange-500 hover:underline">
              Sign Up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
