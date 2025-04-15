import React from "react";
import { Link } from "react-router-dom";
import { FaChartLine, FaUserGraduate, FaUniversity, FaUserTie } from "react-icons/fa";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Home = () => {
  // Sample chart data for Sales Growth
  const salesData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
    datasets: [
      {
        label: "Sales Growth",
        data: [10, 25, 40, 60, 80, 100, 120],
        fill: false,
        borderColor: "#008370",
        tension: 0.1,
        pointRadius: 5,
      },
    ],
  };

  const placementData = {
    labels: ["Q1", "Q2", "Q3", "Q4"],
    datasets: [
      {
        label: "Placement Rate",
        data: [80, 85, 90, 92],
        fill: false,
        borderColor: "#ff7f50",
        tension: 0.1,
        pointRadius: 5,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">

      {/* Welcome Section */}
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold text-gray-800">Welcome to the Ultimate Workflow Platform</h1>
        <p className="text-xl text-gray-600 mt-4">
          Streamline your processes across Sales, Learning & Development, and Placement with real-time collaboration and automation.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
        <div className="bg-white rounded-lg shadow-lg p-6 text-center">
          <h2 className="text-lg font-semibold text-gray-700">Total Colleges</h2>
          <p className="text-3xl font-bold text-[#008370] mt-2">120</p>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-6 text-center">
          <h2 className="text-lg font-semibold text-gray-700">Sales This Month</h2>
          <p className="text-3xl font-bold text-[#008370] mt-2">₹4.2L</p>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-6 text-center">
          <h2 className="text-lg font-semibold text-gray-700">Students Placed</h2>
          <p className="text-3xl font-bold text-[#008370] mt-2">532</p>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-6 text-center">
          <h2 className="text-lg font-semibold text-gray-700">Active Users</h2>
          <p className="text-3xl font-bold text-[#008370] mt-2">87</p>
        </div>
      </div>

      {/* Main Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <Link
          to="/sales"
          className="bg-white rounded-lg shadow-md p-6 hover:bg-[#008370] hover:text-white transition-all flex flex-col items-center justify-center text-center"
        >
          <FaChartLine className="text-3xl mb-4" />
          <p className="font-medium text-lg">Sales Dashboard</p>
        </Link>

        <Link
          to="/placement"
          className="bg-white rounded-lg shadow-md p-6 hover:bg-[#008370] hover:text-white transition-all flex flex-col items-center justify-center text-center"
        >
          <FaUserTie className="text-3xl mb-4" />
          <p className="font-medium text-lg">Placement Board</p>
        </Link>

        <Link
          to="/learning-and-development"
          className="bg-white rounded-lg shadow-md p-6 hover:bg-[#008370] hover:text-white transition-all flex flex-col items-center justify-center text-center"
        >
          <FaUserGraduate className="text-3xl mb-4" />
          <p className="font-medium text-lg">Learning & Development</p>
        </Link>

        <Link
          to="/tracker"
          className="bg-white rounded-lg shadow-md p-6 hover:bg-[#008370] hover:text-white transition-all flex flex-col items-center justify-center text-center"
        >
          <FaUniversity className="text-3xl mb-4" />
          <p className="font-medium text-lg">College Tracker</p>
        </Link>
      </div>

      {/* Platform Insights Section (Charts) */}
      <div className="mt-16">
        <h2 className="text-2xl font-semibold text-gray-800 mb-8">Platform Insights</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* Sales Growth Chart */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-medium text-gray-800 mb-4">Sales Growth</h3>
            <div className="bg-gray-50 p-4 rounded-lg shadow-md">
              <Line data={salesData} options={{ responsive: true, maintainAspectRatio: false }} />
            </div>
          </div>

          {/* Placement Success Chart */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-medium text-gray-800 mb-4">Placement Success Rate</h3>
            <div className="bg-gray-50 p-4 rounded-lg shadow-md">
              <Line data={placementData} options={{ responsive: true, maintainAspectRatio: false }} />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Home;
