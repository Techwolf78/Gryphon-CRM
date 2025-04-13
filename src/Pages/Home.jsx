import React from "react";
import { Link } from "react-router-dom"; // Import Link to use navigation

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-50 to-blue-50 p-6 flex flex-col justify-center items-center">
      <h1 className="text-4xl font-semibold text-gray-800 mb-12 text-center">
        Welcome to College Tracker
      </h1>

      {/* Navigation Buttons */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
        {/* Sales Button */}
        <Link to="/sales">
          <button className="px-8 py-3 bg-indigo-600 text-white rounded-lg shadow-lg transform transition duration-300 hover:scale-105 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-50">
            Sales
          </button>
        </Link>

        {/* Placement Button */}
        <Link to="/placement">
          <button className="px-8 py-3 bg-green-600 text-white rounded-lg shadow-lg transform transition duration-300 hover:scale-105 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-50">
            Placement
          </button>
        </Link>

        {/* Learning and Development Button */}
        <Link to="/learning-and-development">
          <button className="px-8 py-3 bg-orange-600 text-white rounded-lg shadow-lg transform transition duration-300 hover:scale-105 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-opacity-50">
            Learning & Development
          </button>
        </Link>

        {/* Tracker Button */}
        <Link to="/tracker">
          <button className="px-8 py-3 bg-yellow-600 text-white rounded-lg shadow-lg transform transition duration-300 hover:scale-105 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-opacity-50">
            Track College
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Home;
