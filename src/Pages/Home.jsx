import React from 'react';
import { Link } from 'react-router-dom'; // Import Link to use navigation

const Home = () => {
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-semibold text-gray-800 mb-6">Home Page</h1>
      
      <div className="flex gap-8">
        {/* Buttons to navigate to different pages */}
        <Link to="/sales">
          <button className="px-6 py-2 bg-blue-500 text-white rounded">Sales</button>
        </Link>
        <Link to="/placement">
          <button className="px-6 py-2 bg-green-500 text-white rounded">Placement</button>
        </Link>
        <Link to="/learning-and-development">
          <button className="px-6 py-2 bg-yellow-500 text-white rounded">Learning and Development</button>
        </Link>
      </div>
    </div>
  );
};

export default Home;
