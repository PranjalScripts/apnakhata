import React from "react";
import { useNavigate } from "react-router-dom";
import { FaBook, FaUsers, FaArrowRight, FaArrowLeft } from "react-icons/fa";

const Footer = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/book");
  };

  const handleUser = () => {
    navigate("/users");
  };

  return (
    <footer className="fixed bottom-0 left-[20%] w-[80%] bg-white/70 backdrop-blur-[2px]
    p-3 md:p-4 border-t border-gray-200">
      <div className="flex items-center justify-center space-x-8 md:space-x-12">
        {/* Transaction Direction Legend */}
        <div className="flex items-center space-x-6 text-sm text-gray-600">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 bg-green-100 rounded-md">
              <FaArrowRight className="w-3.5 h-3.5 text-green-600" />
            </div>
            <span>You initiated</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="p-1.5 bg-blue-100 rounded-md">
              <FaArrowLeft className="w-3.5 h-3.5 text-blue-600" />
            </div>
            <span>Others initiated</span>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center space-x-3 md:space-x-4">
          <button
            className="group flex items-center space-x-2 bg-gradient-to-r from-blue-500/90 to-indigo-600/90 
            text-white font-medium py-2 px-4 md:py-2.5 md:px-5 rounded-lg shadow-lg 
            hover:shadow-blue-500/25 hover:translate-y-[-1px] active:translate-y-[0px]
            focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 
            transition-all duration-200 text-sm md:text-base"
            onClick={handleClick}
          >
            <div className="p-1.5 bg-white/10 rounded-md group-hover:bg-white/20 transition-colors">
              <FaBook className="w-4 h-4" />
            </div>
            <span>Books</span>
          </button>

          <button
            className="group flex items-center space-x-2 bg-gradient-to-r from-violet-500/90 to-purple-600/90 
            text-white font-medium py-2 px-4 md:py-2.5 md:px-5 rounded-lg shadow-lg 
            hover:shadow-violet-500/25 hover:translate-y-[-1px] active:translate-y-[0px]
            focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:ring-offset-2 
            transition-all duration-200 text-sm md:text-base"
            onClick={handleUser}
          >
            <div className="p-1.5 bg-white/10 rounded-md group-hover:bg-white/20 transition-colors">
              <FaUsers className="w-4 h-4" />
            </div>
            <span>Users</span>
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
