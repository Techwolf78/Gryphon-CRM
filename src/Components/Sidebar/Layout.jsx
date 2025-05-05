// Components/Layout.js
import React, { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import {
  FaHome, FaChartBar, FaUserTie, FaGraduationCap,
  FaUniversity, FaChevronLeft, FaChevronRight, FaBars,
} from 'react-icons/fa';
import Profile from './Profile';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../firebase';

const Layout = ({ children }) => {
  const [isOpen, setIsOpen] = useState(true);
  const location = useLocation();
  const [user] = useAuthState(auth);

  const toggleSidebar = () => setIsOpen(!isOpen);

  const allItems = [
    { path: '/', icon: <FaHome />, label: 'Home' },
    { path: '/sales', icon: <FaChartBar />, label: 'Sales' },
    { path: '/learning-and-development', icon: <FaGraduationCap />, label: 'L&D' },
    { path: '/placement', icon: <FaUserTie />, label: 'Placement' },
    { path: '/tracker', icon: <FaUniversity />, label: 'Tracker' },
  ];

  const roleNav = {
    'crm@gmail.com': allItems,
    'ummi@gryphonacademy.co.in': allItems,
    'shashi@gryphonacademy.co.in': allItems,
    'sales@gmail.com': allItems.filter((item) => item.path === '/sales'),
    'landd@gmail.com': allItems.filter((item) => item.path === '/learning-and-development'),
    'placement@gmail.com': allItems.filter((item) => item.path === '/placement'),
  };

  const visibleNav = roleNav[user?.email] || [];

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div
        className={`${isOpen ? 'w-44' : 'w-20'} transition-all duration-300 flex flex-col justify-between`}
        style={{ backgroundColor: '#006B5D' }} // Dark green background
      >
        <div>
          {/* Header */}
          <div className="flex items-center justify-between p-4 text-white">
            <span className="text-xl font-bold">{isOpen ? 'CRM' : 'CRM'}</span>
          </div>

          {/* Nav */}
          <nav className="flex-1 px-2 mt-4">
            {visibleNav.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center p-3 rounded-md mb-2 transition-all ${
                  location.pathname === item.path
                    ? 'bg-[#53d693] text-gray-800' // Active link color (light green with dark text)
                    : 'text-white hover:bg-[#008370]' // Hover color (darker green)
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                {isOpen && <span className="ml-3">{item.label}</span>}
              </Link>
            ))}
          </nav>
        </div>

        {/* Profile and Toggle */}
        <div className="p-4">
          <Profile isOpen={isOpen} />
          <hr className="border-t border-[#098A78] my-3" /> {/* Divider color */}
          <button
            onClick={toggleSidebar}
            className="bg-white text-[#a3e6c5] rounded-full p-2 shadow-md hover:bg-[#CCF0E9]" // Green button color and hover
          >
            {isOpen ? <FaChevronLeft /> : <FaChevronRight />}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-gray-100 p-6 overflow-y-auto">
        {children || <Outlet />}
      </div>
    </div>
  );
};

export default Layout;
