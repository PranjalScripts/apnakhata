import React, { useState } from "react";
import {
  FaTachometerAlt,
  FaFileAlt,
  FaUsers,
  FaSignOutAlt,
  FaSignInAlt,
  FaBook,
  FaIdCard,
  FaHandshake,
  FaHandHoldingUsd,
  FaReceipt,
  FaFileInvoiceDollar,
} from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Sidebar = () => {
  const { isLoggedIn, logout } = useAuth() || {}; // Ensure safe destructuring
  const navigate = useNavigate();
  const location = useLocation(); // Get the current location
  const [isCollabOpen, setCollabOpen] = useState(false); // State for dropdown toggle

  const handleLogout = () => {
    logout(); // Call the logout function to clear the authentication state
    navigate("/"); // Redirect to Landing page after logging out
  };

  const toggleCollabDropdown = () => {
    setCollabOpen(!isCollabOpen);
  };

  // Function to determine if the current path matches the link
  const isActive = (path) => location.pathname === path;

  return (
    <div className="fixed left-0 bg-white-500 shadow-lg text-black h-screen w-64 flex flex-col">
      {/* Logo Section */}
      <div className="text-xl font-bold p-4">
  <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-blue-500">
    <FaBook className="inline mr-2" />
    ApnaKhata
  </span>
</div>


      {/* Navigation Links */}
      <nav className="flex-1 mt-1">
        <ul>
          <li className={`  ${isActive('/dashboard') ? 'bg-blue-500 text-white' : 'hover:bg-blue-200'}`}>
            <a
              href="/dashboard"
              className="flex items-center px-4 py-3 space-x-4"
            >
              <FaTachometerAlt />
              <span>Dashboard</span>
            </a>
          </li>
          <li className={` ${isActive('/your-books') ? 'bg-blue-500 text-white' : 'hover:bg-blue-200'}`}>
            <a href="/your-books" className="flex items-center px-4 py-3 space-x-4">
              <FaFileInvoiceDollar />
              <span>Self Records</span>
            </a>
          </li>

          {/* Collabs with Dropdown */}
         

          <li className={`  ${isActive('/book') ? 'bg-blue-500 text-white' : 'hover:bg-blue-200'}`}>
            <a href="/book" className="flex items-center px-4 py-3 space-x-4">
              <FaBook />
              <span>Book</span>
            </a>
          </li>
          <li className={`  ${isActive('/users') ? 'bg-blue-500 text-white' : 'hover:bg-blue-200'}`}>
            <a href="/users" className="flex items-center px-4 py-3 space-x-4">
              <FaUsers />
              <span>Client Users</span>
            </a>
          </li>
          <li className={`  ${isActive('/loans') ? 'bg-blue-500 text-white' : 'hover:bg-blue-200'}`}>
            <a href="/loans" className="flex items-center px-4 py-3 space-x-4">
              <FaHandHoldingUsd />
              <span>Loans</span>
            </a>
          </li>
          <li className={`  ${isActive('/invoice') ? 'bg-blue-500 text-white' : 'hover:bg-blue-200'}`}>
            <a
              href="/invoice"
              className="flex items-center px-4 py-3 space-x-4"
            >
              <FaReceipt />
              <span>Invoice</span>
            </a>
          </li>
          {isLoggedIn && (
            <li className={`  ${isActive('/profile') ? 'bg-blue-500 text-white' : 'hover:bg-blue-200'}`}>
              <a
                href="/profile"
                className="flex items-center px-4 py-3 space-x-4"
              >
                <FaIdCard />
                <span>Your Profile</span>
              </a>
            </li>
          )}
        </ul>
      </nav>

      {/* Footer Section */}
      <div className="p-4 border-t border-blue-800">
        {isLoggedIn ? (
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-3 space-x-4 bg-blue-500 hover:bg-blue-700 rounded-md"
          >
            <FaSignOutAlt />
            <span>Logout</span>
          </button>
        ) : (
          <button
            onClick={() => navigate("/")}
            className="flex items-center w-full px-4 py-3 space-x-4 bg-blue-500 hover:bg-blue-700 rounded-md"
          >
            <FaSignInAlt />
            <span>Login</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default Sidebar;