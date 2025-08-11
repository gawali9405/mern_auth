import React from "react";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  return (
    <div className="flex justify-between items-center p-4 bg-gray-200">
      <h1 className="text-3xl font-bold text-blue-500">MERN Auth</h1>
      <button
        onClick={() => navigate("/login")}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300 ease-in-out"
      >
        Login
      </button>
    </div>
  );
};

export default Navbar;
