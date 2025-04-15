import React, { useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../../src/firebase";
import { useNavigate } from "react-router-dom";
import logoutIcon from "../../src/assets/log.png";
import profileIcon from "../../src/assets/passport.avif"; // ✅ Your profile icon

const Profile = ({ isOpen }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const navigate = useNavigate();

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
      className={`text-white ${
        isOpen ? "flex-row" : "flex-col"
      } flex items-center gap-3`}
    >
      {/* Profile Icon (Image instead of FaUserCircle) */}
      <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-300">
        <img
          src={profileIcon}
          alt="Profile"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Name (only if open) */}
      {isOpen && (
        <span className="text-sm font-medium whitespace-nowrap">
          Manish Chopra
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
