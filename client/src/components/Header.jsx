import React, { useContext } from "react";
import { AppContext } from "../context/AppContext";

const Header = () => {
  const { user } = useContext(AppContext);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
      <h1 className="text-5xl font-extrabold bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent drop-shadow-lg">
        Hey {user ? user.name : "Developer"}!
      </h1>
      <p className="mt-4 text-lg text-gray-600 max-w-xl">
        Are you ready to build a MERN stack authentication application?
      </p>
      <button className="mt-6 bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-3 rounded-full shadow-lg hover:opacity-90 hover:scale-105 transition-transform duration-300 ease-in-out">
        Get Started
      </button>
    </div>
  );
};

export default Header;
