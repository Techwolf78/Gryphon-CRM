// Layout.js
import React, { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import {
  FaHome,
  FaChartBar,
  FaUserTie,
  FaGraduationCap,
  FaUniversity,
  FaChevronLeft,
  FaChevronRight,
  FaBars,
} from 'react-icons/fa';
import Profile from './Profile';  // Import the Profile component

const Layout = () => {
  const [isOpen, setIsOpen] = useState(true);
  const location = useLocation();

  const toggleSidebar = () => setIsOpen(!isOpen);

  const navItems = [
    { path: '/', icon: <FaHome />, label: 'Home' },
    { path: '/sales', icon: <FaChartBar />, label: 'Sales' },
    { path: '/learning-and-development', icon: <FaGraduationCap />, label: 'L&D' },
    { path: '/placement', icon: <FaUserTie />, label: 'Placement' },
    { path: '/tracker', icon: <FaUniversity />, label: 'Tracker' },
  ];

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div
        className={`${
          isOpen ? 'w-64' : 'w-20'
        } duration-300 transition-all flex flex-col justify-between relative`}
        style={{ backgroundColor: '#006B5D' }} // Darker primary for sidebar bg
      >
        {/* Top Section */}
        <div>
          {/* Top Toggle */}
          <div className="flex items-center justify-between p-4 text-white">
            <span className="text-xl font-bold">
              {isOpen ? 'Gryphon CRM' : 'CRM'}
            </span>
            <button onClick={toggleSidebar}>
              <FaBars />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-2 mt-4">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center p-3 rounded-md mb-2 transition-all ${
                  location.pathname === item.path
                    ? 'bg-[#00A388] text-white' // lighter primary on active
                    : 'text-white hover:bg-[#008370]' // base primary on hover
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                {isOpen && <span className="ml-3">{item.label}</span>}
              </Link>
            ))}
          </nav>
        </div>

        {/* Bottom Section with Profile and Toggle Button */}
        <div className=" flex flex-col">
          {/* Profile Section */}
          <div className="mt-auto p-4">
            <Profile isOpen={isOpen} />
          </div>

          {/* Divider */}
          <hr className=" border-t border-[#098A78] w-full" />

          {/* Bottom Toggle Arrow */}
          <div className=" p-4">
            <button
              onClick={toggleSidebar}
              className="bg-white text-[#008370] rounded-full p-2 shadow-md hover:bg-[#CCF0E9] transition-all"
            >
              {isOpen ? <FaChevronLeft /> : <FaChevronRight />}
            </button>
          </div>
        </div>
      </div>

      {/* Main Page Content */}
      <div className="flex-1 bg-gray-100 p-6 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
