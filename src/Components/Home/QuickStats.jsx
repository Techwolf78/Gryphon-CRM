import React from "react";
import { FaUniversity, FaRupeeSign, FaUserGraduate, FaBriefcase } from "react-icons/fa";

const stats = [
  { label: "Total Colleges", value: "120", icon: <FaUniversity /> },
  { label: "Sales This Month", value: "₹4.2L", icon: <FaRupeeSign /> },
  { label: "Total Students", value: "6,000", icon: <FaUserGraduate /> },
  { label: "Students Placed", value: "2,000", icon: <FaBriefcase /> },
];

const QuickStats = () => (
  <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
    {stats.map((stat, index) => (
      <div
        key={index}
        className="bg-white rounded-lg shadow-lg p-6 flex items-center justify-between"
      >
        {/* Icon on left */}
        <div className="w-10 h-10 flex items-center justify-center rounded-full bg-[#e0f4f1] text-[#008370] text-2xl">
          {stat.icon}
        </div>

        {/* Text block on right */}
        <div className="text-right">
        <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
          <h2 className="text-md font-semibold text-gray-500">{stat.label}</h2>

        </div>
      </div>
    ))}
  </div>
);

export default QuickStats;
