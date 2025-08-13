import React, { useState, useContext } from "react";
import { FaUser, FaEnvelope, FaLock } from "react-icons/fa";
import { useNavigate, Link } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const Login = () => {
  const [mode, setMode] = useState("login");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  const { backend_url, setIsLoading, setError, setUser, getUserData } =
    useContext(AppContext);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const endpoint =
        mode === "signup"
          ? `${backend_url}/api/auth/register`
          : `${backend_url}/api/auth/login`;

      // Send only required fields
      const payload =
        mode === "signup"
          ? formData
          : { email: formData.email, password: formData.password };

      const response = await axios.post(endpoint, payload);

      // First update user with the response data
      setUser(response.data.user);
      toast.success(`${mode === "signup" ? "Sign Up" : "Login"} successful`);

      // For login, we already have the user data in the response
      if (mode === "login") {
        // The user data is already in response.data.user
        // No need to call getUserData() as we already have the data
        navigate("/");
      } else {
        // For signup, go to email verification
        navigate("/email-verify");
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Something went wrong";
      setError(errorMsg);
      toast.error(errorMsg);
      console.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-purple-400 via-blue-300 to-purple-500">
      <div className="bg-[#0F172A] text-white rounded-xl shadow-lg p-8 w-full max-w-sm">
        <h2 className="text-2xl font-bold text-center mb-2">
          {mode === "signup" ? "Create Account" : "Login"}
        </h2>
        <p className="text-center text-gray-400 mb-6">
          {mode === "signup" ? "Create your account" : "Login to your account"}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "signup" && (
            <div className="flex items-center bg-[#1E293B] rounded-full px-4 py-2">
              <FaUser className="text-gray-400 mr-3" />
              <input
                name="name"
                type="text"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                required
                className="bg-transparent focus:outline-none w-full placeholder-gray-400"
              />
            </div>
          )}

          <div className="flex items-center bg-[#1E293B] rounded-full px-4 py-2">
            <FaEnvelope className="text-gray-400 mr-3" />
            <input
              name="email"
              type="email"
              placeholder="Email id"
              value={formData.email}
              onChange={handleChange}
              required
              className="bg-transparent focus:outline-none w-full placeholder-gray-400"
            />
          </div>

          <div className="flex items-center bg-[#1E293B] rounded-full px-4 py-2">
            <FaLock className="text-gray-400 mr-3" />
            <input
              name="password"
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              className="bg-transparent focus:outline-none w-full placeholder-gray-400"
            />
          </div>

          {mode === "login" && (
            <div className="text-right">
              <Link
                to="/reset-password"
                className="text-blue-400 text-sm hover:underline"
              >
                Forgot password?
              </Link>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold py-2 rounded-full hover:opacity-90 transition"
          >
            {mode === "signup" ? "Sign Up" : "Login"}
          </button>

          <p className="text-center text-sm text-gray-400">
            {mode === "signup" ? (
              <>
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => setMode("login")}
                  className="text-blue-400 hover:underline"
                >
                  Login
                </button>
              </>
            ) : (
              <>
                New user?{" "}
                <button
                  type="button"
                  onClick={() => setMode("signup")}
                  className="text-blue-400 hover:underline"
                >
                  Sign Up
                </button>
              </>
            )}
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
