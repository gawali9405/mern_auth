import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext"; 
import { FaUserCircle, FaSignOutAlt, FaUserCog, FaChevronDown, FaChevronUp } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const navigate = useNavigate();
  const { user, isLoggedIn, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setIsLoggingOut(false);
    }
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
      <div className="flex items-center gap-4 relative">
        {isLoggedIn && (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 bg-white/5 hover:bg-white/10 rounded-full px-3 py-1.5 transition-colors"
              aria-label="User menu"
              aria-expanded={isDropdownOpen}
            >
              <FaUserCircle className="w-8 h-8 sm:w-10 sm:h-10 text-white/90" />
              <span className="hidden sm:inline text-white font-medium truncate max-w-[120px] lg:max-w-[200px]">
                {user?.name || "User"}
              </span>
              {isDropdownOpen ? (
                <FaChevronUp className="text-white/70 ml-1" />
              ) : (
                <FaChevronDown className="text-white/70 ml-1" />
              )}
            </button>

            <AnimatePresence>
              {isDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-2 w-56 rounded-lg bg-white shadow-lg ring-1 ring-black/5 focus:outline-none z-30"
                >
                  <div className="py-1">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm text-gray-900 font-medium truncate">
                        {user?.name || 'User'}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {user?.email || ''}
                      </p>
                    </div>
                    <button
                      onClick={handleLogout}
                      disabled={isLoggingOut}
                      className="flex w-full items-center px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      <FaSignOutAlt className="mr-3" />
                      {isLoggingOut ? 'Signing out...' : 'Sign out'}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
