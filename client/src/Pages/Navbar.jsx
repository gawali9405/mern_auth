import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext"; 
import { FaUserCircle } from "react-icons/fa";

const Navbar = () => {
  const navigate = useNavigate();
  const { user, isLoggedIn, logout } = useAuth(); // <-- read user and logout from context

  const handleLogout = () => {
    logout();                  // <-- clears localStorage + resets user in context
    console.log("User logged out");
    navigate("/sign-in");      // <-- redirect to sign-in page
  };

  return (
    <nav className="sticky top-0 z-20 bg-white/10 backdrop-blur-md shadow-md px-6 py-4 flex justify-between items-center bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900">
      {/* Left: Logo / Brand */}
      <div
        onClick={() => navigate("/")}
        className="flex items-center gap-2 cursor-pointer"
      >
        <div className="bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 text-white font-bold px-3 py-1 rounded-lg shadow-lg text-xl">
          MERN
        </div>
      </div>

      {/* Right: User Profile / Logout (only if logged in) */}
      <div className="flex items-center gap-4">
        {isLoggedIn && (
          <>
            {/* Profile Avatar & Name */}
            {user && (
              <div className="flex items-center gap-2">
                <FaUserCircle className="w-10 h-10 rounded-full border border-white/20 shadow" />
                <span className="hidden sm:inline text-white font-medium">
                  {user.name || "User"}
                </span>
              </div>
            )}
            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-transform transform hover:scale-105 active:scale-95 shadow cursor-pointer"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
