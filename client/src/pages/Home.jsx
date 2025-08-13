import React from "react";
import Navbar from "../components/Navbar";
import Header from "../components/Header";

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-blue-100 to-purple-200">
      <Navbar />
      <Header />
    </div>
  );
};

export default Home;
