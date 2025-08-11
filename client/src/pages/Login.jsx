import React, { useState, useContext } from "react";
import { FaUser, FaEnvelope, FaLock } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const Login = () => {
  const [mode, setMode] = useState("Sign Up");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  const { backend_url, setIsLoading, setError, setUser } = useContext(AppContext);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const endpoint =
        mode === "Sign Up"
          ? `${backend_url}/api/auth/register`
          : `${backend_url}/api/auth/login`;

      const response = await axios.post(endpoint, formData);

      setUser(response.data.user);
      toast.success(`${mode} successful`);

      if (mode === "Sign Up") {
        navigate("/email-verify");
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      setError(error.response?.data?.message || error.message);
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-purple-400 via-blue-300 to-purple-500">
      <div className="bg-[#0F172A] text-white rounded-xl shadow-lg p-8 w-full max-w-sm">
        <h2 className="text-2xl font-bold text-center mb-2">
          {mode === "Sign Up" ? "Create Account" : "Login"}
        </h2>
        <p className="text-center text-gray-400 mb-6">
          {mode === "Sign Up" ? "Create your account" : "Login to your account"}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "Sign Up" && (
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

          <div className="text-right">
            <a href="/reset-password" className="text-blue-400 text-sm hover:underline">
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold py-2 rounded-full hover:opacity-90 transition"
          >
            {mode === "Sign Up" ? "Sign Up" : "Login"}
          </button>

          <p className="text-center text-sm text-gray-400">
            {mode === "Sign Up" ? (
              <>
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => setMode("Login")}
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
                  onClick={() => setMode("Sign Up")}
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
