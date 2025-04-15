// Components/Layout.js
import React, { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import {
  FaHome, FaChartBar, FaUserTie, FaGraduationCap,
  FaUniversity, FaChevronLeft, FaChevronRight, FaBars,
} from 'react-icons/fa';
import Profile from './Profile';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';

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
      <div className={`${isOpen ? 'w-64' : 'w-20'} transition-all duration-300 flex flex-col justify-between`} style={{ backgroundColor: '#006B5D' }}>
        <div>
          {/* Header */}
          <div className="flex items-center justify-between p-4 text-white">
            <span className="text-xl font-bold">{isOpen ? 'Gryphon CRM' : 'CRM'}</span>
            <button onClick={toggleSidebar}><FaBars /></button>
          </div>

          {/* Nav */}
          <nav className="flex-1 px-2 mt-4">
            {visibleNav.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center p-3 rounded-md mb-2 transition-all ${
                  location.pathname === item.path
                    ? 'bg-[#00A388] text-white'
                    : 'text-white hover:bg-[#008370]'
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
          <hr className="border-t border-[#098A78] my-3" />
          <button
            onClick={toggleSidebar}
            className="bg-white text-[#008370] rounded-full p-2 shadow-md hover:bg-[#CCF0E9]"
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
