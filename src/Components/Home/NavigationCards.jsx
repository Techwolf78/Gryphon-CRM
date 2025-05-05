import React from "react";
import { Link } from "react-router-dom";
import { FaChartLine, FaUserGraduate, FaUniversity, FaUserTie } from "react-icons/fa";

const navItems = [
  { to: "/sales", icon: <FaChartLine />, label: "Sales Dashboard" },
  { to: "/placement", icon: <FaUserTie />, label: "Placement Board" },
  { to: "/learning-and-development", icon: <FaUserGraduate />, label: "Learning & Development" },
  { to: "/tracker", icon: <FaUniversity />, label: "College Tracker" },
];

const NavigationCards = () => (
  <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
    {navItems.map((item, index) => (
      <Link
        key={index}
        to={item.to}
        className="bg-white rounded-lg shadow-md p-6 hover:bg-[#008370] hover:text-white transition-all flex flex-col items-center justify-center text-center"
      >
        <div className="text-3xl mb-4">{item.icon}</div>
        <p className="font-medium text-lg">{item.label}</p>
      </Link>
    ))}
  </div>
);

export default NavigationCards;
