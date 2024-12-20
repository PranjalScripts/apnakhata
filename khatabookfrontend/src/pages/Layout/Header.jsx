import { FaSearch, FaCog, FaBell } from "react-icons/fa";

export default function Header() {
  return (
    <div className="fixed  top-0  flex items-center justify-between bg-white border-b border-gray-100 px-8 py-4 w-[81%] z-[10]">
      {/* Title */}
      <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent">
        Overview
      </h1>

      {/* Action Items */}
      <div className="flex items-center gap-6">
        {/* Search Bar */}
        <div className="flex items-center bg-gray-50 hover:bg-gray-100 rounded-lg px-4 py-2.5 transition-colors duration-200 border border-gray-100 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100">
          <FaSearch className="text-gray-400 text-sm" />
          <input
            type="text"
            placeholder="Quick search..."
            className="bg-transparent text-sm text-gray-600 placeholder-gray-400 focus:outline-none ml-3 w-56"
          />
        </div>

        {/* Icons */}
        <div className="flex items-center gap-4">
          <button className="relative p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-all duration-200">
            <FaCog className="text-lg" />
          </button>
          <button className="relative p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-all duration-200">
            <FaBell className="text-lg" />
            <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-[10px] font-bold text-white rounded-full flex items-center justify-center">
              2
            </span>
          </button>
        </div>

        {/* Profile Section */}
        <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
          <div className="hidden md:flex flex-col items-end">
            <p className="text-sm font-medium text-gray-700">John Doe</p>
          </div>
          <div className="relative">
            <img
              src="https://via.placeholder.com/40"
              alt="Profile"
              className="w-10 h-10 rounded-full object-cover ring-2 ring-white shadow-sm"
            />
            <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full ring-2 ring-white"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
