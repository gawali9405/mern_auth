import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { API_URL } from "../config.js";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, email, password, confirmPassword } = formData;

    // Frontend validation
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }
    if (email.length < 6) {
      toast.error("Email must be at least 6 characters long");
      return;
    }

    try {
      // Send only required fields to backend
      const response = await axios.post(
        `${API_URL}/api/user/sign-up`,
        {
          name,
          email,
          password,
        },
        { withCredentials: true }
      );

      toast.success(response.data?.message || "Registered successfully!");
      console.log(response.data);

      // Reset form
      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
      });

      navigate("/"); // Redirect to home or login page
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
          Register
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-white font-medium mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Full Name"
              className="w-full px-4 py-3 rounded-xl bg-white/20 placeholder-gray-300 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white/30 transition"
            />
          </div>

          <div>
            <label className="block text-white font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email Address"
              className="w-full px-4 py-3 rounded-xl bg-white/20 placeholder-gray-300 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white/30 transition"
            />
          </div>

          <div>
            <label className="block text-white font-medium mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="********"
              className="w-full px-4 py-3 rounded-xl bg-white/20 placeholder-gray-300 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white/30 transition"
            />
          </div>

          <div>
            <label className="block text-white font-medium mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="********"
              className="w-full px-4 py-3 rounded-xl bg-white/20 placeholder-gray-300 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white/30 transition"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition duration-300 cursor-pointer"
          >
            REGISTER
          </button>

          <p className="text-sm text-gray-200 mt-4 text-center">
            Already have an account?{" "}
            <Link to="/sign-in" className="text-orange-500 hover:underline">
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
