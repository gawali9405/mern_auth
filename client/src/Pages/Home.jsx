import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";

const Home = () => { 
  const { isLoggedIn } = useAuth();

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 text-center px-4 overflow-hidden">
      {/* Animated background blobs */}
      <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-3xl animate-pulse pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/3 w-[300px] h-[300px] bg-indigo-500/20 rounded-full blur-2xl animate-ping pointer-events-none"></div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center">
        <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-4 drop-shadow-lg transition-transform duration-700 ease-out hover:scale-105">
          MERN Authentication
        </h1>

        <p className="text-gray-300 text-lg md:text-xl mb-8 max-w-xl transition-opacity duration-700 ease-in-out hover:opacity-90">
          Introducing modern MERN Authentication — safe, fast, and reliable
          login for your application.
        </p>

        {/* Show Login button only if user is NOT logged in */}
        {!isLoggedIn && (
          <Link
            to="/sign-in"
            className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-emerald-500 hover:to-green-500 text-white font-semibold text-lg rounded-full shadow-lg shadow-green-900/40 transform transition-transform duration-300 ease-in-out hover:scale-110 hover:shadow-2xl active:scale-95 cursor-pointer"
          >
            Login Here
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"
              />
            </svg>
          </Link>
        )}
      </div>
    </div>
  );
};

export default Home;
