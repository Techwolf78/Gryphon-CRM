import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaRocket, FaHome } from 'react-icons/fa';
import image1 from '../assets/astronaut.png'; // Import your astronaut image

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-[#0f2027] via-[#203a43] to-[#2c5364] text-white relative overflow-hidden">
      {/* Floating astronaut image */}
      <img
        src={image1}
        alt="Lost Astronaut"
        className="w-40 md:w-60 animate-float mb-4"
      />

      <h1 className="text-4xl md:text-6xl font-bold mb-4">404</h1>
      <p className="text-lg md:text-2xl mb-6 text-center px-6 max-w-xl">
        Uh-oh! Looks like you've drifted off course. This page doesn't exist in our galaxy.
      </p>

      <button
        onClick={() => navigate('/')}
        className="flex items-center gap-2 bg-[#00A388] hover:bg-[#00cba9] text-white px-6 py-2 rounded-full text-lg shadow-lg transition-all"
      >
        <FaHome /> Take me home
      </button>

      {/* Stars background effect */}
      <div className="absolute top-0 left-0 w-full h-full z-[-1] overflow-hidden">
        <div className="w-full h-full bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10" />
      </div>

      {/* Floating animation style */}
      <style>
        {`
          .animate-float {
            animation: float 4s ease-in-out infinite;
          }

          @keyframes float {
            0%, 100% {
              transform: translateY(0px);
            }
            50% {
              transform: translateY(-15px);
            }
          }
        `}
      </style>
    </div>
  );
};

export default NotFoundPage;
