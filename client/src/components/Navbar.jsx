import React, { useContext, useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const Navbar = () => {
  const navigate = useNavigate();
  const { user, setUser, setIsLoading, getAuthState } = useContext(AppContext);
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
    navigate("/login");
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []); 
  return (
    <div className="flex justify-between items-center px-6 py-4 bg-gradient-to-r from-purple-500 to-blue-500 shadow-md">
      <h1
        className="text-2xl md:text-3xl font-extrabold text-white tracking-wide cursor-pointer"
        onClick={() => navigate("/")}
      >
        MERN Auth
      </h1>

      {user ? (
        <div className="relative" ref={menuRef}>
          {/* Avatar */}
          <div
            className="w-10 h-10 flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-full shadow cursor-pointer hover:scale-105 transition-transform duration-300"
            title={user.name}
            onClick={() => setShowMenu((prev) => !prev)}
          >
            {user.name?.charAt(0).toUpperCase()}
          </div>

          {/* Dropdown menu */}
          {showMenu && (
            <ul className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg overflow-hidden z-50">
              {user && !user.isVerified && (
                <li
                  onClick={() => {
                    getAuthState();
                    navigate("/email-verify");
                    setShowMenu(false);
                  }}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer"
                >
                  Verify Email
                </li>
              )}
              <li
                onClick={handleLogout}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer"
              >
                Logout
              </li>
            </ul>
          )}
        </div>
      ) : (
        <button
          onClick={() => {
            setIsLoading(true);
            navigate("/login");
          }}
          className="bg-white text-blue-600 font-semibold px-5 py-2 rounded-full shadow hover:shadow-lg hover:scale-105 transition-transform duration-300 ease-in-out"
        >
          Login
        </button>
      )}
    </div>
  );
};

export default Navbar;
