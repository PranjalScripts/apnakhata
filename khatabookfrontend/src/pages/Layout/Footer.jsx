import React from "react";
import { useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/book");
  };

  const handleUser = () => {
    navigate("/users");
  };

  return (
    <footer className="fixed bottom-0 w-full m-auto bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-4 border-t border-gray-300">
      <div className="flex justify-center  w-[80%]  space-x-4">
        <button
          className="bg-white text-blue-600 font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
          onClick={handleClick}
        >
          All Books
        </button>
        <button
          className="bg-white text-blue-600 font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
          onClick={handleUser}
        >
          All Users
        </button>
      </div>
    </footer>
  );
};

export default Footer;
