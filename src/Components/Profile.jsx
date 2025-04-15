// Profile.js
import React from 'react';
import { FaUserCircle } from 'react-icons/fa';

const Profile = ({ isOpen }) => {
  return (
    <div className="flex items-center  text-white">
      {/* Profile Pic */}
      <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
        <FaUserCircle size={24} />
      </div>
      {/* Display name if sidebar is open */}
      {isOpen && <span className="ml-3">John Doe</span>}
    </div>
  );
};

export default Profile;
