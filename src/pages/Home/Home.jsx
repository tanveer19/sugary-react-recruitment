import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div>
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h1 className="text-4xl font-bold mb-4">Welcome to Sugary!</h1>
        <p className="mb-6 text-lg text-center max-w-xl">
          Discover and manage materials easily. Login to access your dashboard
          and explore more features.
        </p>
        <Link to="/login" className="btn btn-primary">
          Get Started
        </Link>
      </div>
    </div>
  );
};

export default Home;
