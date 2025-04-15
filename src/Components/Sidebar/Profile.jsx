import React, { useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase";
import { useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa"; // Importing user icon from react-icons
import logoutIcon from "../../assets/log.png";

const Profile = ({ isOpen }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const navigate = useNavigate();

  // Mapping email to names
  const nameMapping = {
    'ummi@gryphonacademy.co.in': 'Ummi Ansari',
    'shashi@gryphonacademy.co.in': 'Shashi Bhat',
    'crm@gmail.com': 'Admin',
    'sales@gmail.com': 'Sales User',
    'placement@gmail.com': 'Placement User',
    'landd@gmail.com': 'Learning and Development User',
  };

  const userEmail = auth.currentUser?.email; // Get the currently logged-in user's email
  const userName = userEmail ? nameMapping[userEmail] || 'User' : 'Guest'; // Get the user's name based on email, default to 'User' if not found

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div
      className={`text-white ${isOpen ? "flex-row" : "flex-col"} flex items-center gap-3`}
    >
      {/* User Icon */}
      <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-300 flex items-center justify-center">
        <FaUserCircle size={40} color="#fff" /> {/* Icon instead of image */}
      </div>

      {/* Name (only if open) */}
      {isOpen && (
        <span className="text-sm font-medium whitespace-nowrap">
          {userName} {/* Displaying the correct name */}
        </span>
      )}

      {/* Logout Icon (always visible) */}
      <div
        className="relative cursor-pointer"
        onClick={handleLogout}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        {/* Tooltip */}
        {showTooltip && (
          <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-xs bg-gray-800 text-white px-2 py-1 rounded-md z-10 shadow-md whitespace-nowrap">
            Logout
          </div>
        )}

        <img
          src={logoutIcon}
          alt="Logout"
          className="w-10 h-10 opacity-80 hover:opacity-100 transition"
        />
      </div>
    </div>
  );
};

export default Profile;
