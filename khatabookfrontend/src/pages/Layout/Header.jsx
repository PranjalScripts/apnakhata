import { FaSearch, FaCog, FaBell } from "react-icons/fa";

export default function Header() {
  return (
    <div className="fixed top-0 flex items-center justify-between bg-white shadow-sm px-6 py-3 w-[1260px]">
      {/* Title */}
      <h1 className="text-lg font-semibold text-gray-800">Overview</h1>

      {/* Action Items */}
      <div className="flex items-center space-x-4">
        {/* Search Bar */}
        <div className="flex items-center bg-gray-100 rounded-full px-4 py-2">
          <FaSearch className="text-gray-500 mr-2" />
          <input
            type="text"
            placeholder="Search for something"
            className="bg-transparent text-sm text-gray-600 placeholder-gray-500 focus:outline-none"
          />
        </div>

        {/* Icons */}
        <FaCog className="text-gray-400 hover:text-gray-600 cursor-pointer" />
        <FaBell className="text-gray-400 hover:text-gray-600 cursor-pointer" />

        {/* Profile Picture */}
        <img
          src="https://via.placeholder.com/40"
          alt="Profile"
          className="w-10 h-10 rounded-full"
        />
      </div>
    </div>
  );
}
