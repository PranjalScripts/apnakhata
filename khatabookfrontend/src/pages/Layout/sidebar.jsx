// import React from "react";
// import { Navbar, Nav, Button } from "react-bootstrap";
// import {
//   FaTachometerAlt,
//   FaFileAlt,
//   FaUsers,
//   FaSignOutAlt,
//   FaSignInAlt,
//   FaBook,
//   FaIdCard,
//   FaHandshake,
//   FaHandHoldingUsd,
//   FaReceipt,
// } from "react-icons/fa";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "../../context/AuthContext";
// import "./Sidebar.css";

// const Sidebar = () => {
//   const { isLoggedIn, logout } = useAuth() || {}; // Ensure safe destructuring
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     logout(); // Call the logout function to clear the authentication state
//     navigate("/"); // Redirect to Landing page after logging out
//   };

//   return (
//     <div className="sidebar-container">
//       <Navbar
//         bg="dark"
//         variant="dark"
//         className="flex-column vh-100 p-2 sidebar"
//       >
//         <Nav className="flex-column">
//           <Nav.Link
//             href="/dashboard"
//             className="sidebar-link"
//             aria-label="Dashboard"
//           >
//             <FaTachometerAlt className="icon" /> <span>Dashboard</span>
//           </Nav.Link>
//           <Nav.Link
//             href="/selfrecord"
//             className="sidebar-link"
//             aria-label="Self Record"
//           >
//             <FaFileAlt className="icon" /> <span>Self Record</span>
//           </Nav.Link>
//           <Nav.Link href="/book" className="sidebar-link" aria-label="Book">
//             <FaBook className="icon" /> <span>Book</span>
//           </Nav.Link>
//           <Nav.Link
//             href="/users"
//             className="sidebar-link"
//             aria-label="Client Users"
//           >
//             <FaUsers className="icon" /> <span>Client Users</span>
//           </Nav.Link>
//           <Nav.Link
//             href="/collaborativebook"
//             className="sidebar-link"
//             aria-label="Collaborative Book"
//           >
//             <FaHandshake className="icon" /> <span>Collaborative Book</span>
//           </Nav.Link>
//           <Nav.Link href="/loans" className="sidebar-link" aria-label="Loans">
//             <FaHandHoldingUsd className="icon" /> <span>Loans</span>
//           </Nav.Link>
//           <Nav.Link
//             href="/invoice"
//             className="sidebar-link"
//             aria-label="Invoice"
//           >
//             <FaReceipt className="icon" /> <span>Invoice</span>
//           </Nav.Link>

//           {isLoggedIn && (
//             <Nav.Link
//               href="/profile"
//               className="sidebar-link"
//               aria-label="Your Profile"
//             >
//               <FaIdCard className="icon" /> <span>Your Profile</span>
//             </Nav.Link>
//           )}
//         </Nav>

//         <Nav className="mt-auto">
//           {isLoggedIn ? (
//             <Button variant="outline-light" onClick={handleLogout}>
//               <FaSignOutAlt className="icon" /> <span>Logout</span>
//             </Button>
//           ) : (
//             <Button variant="outline-light" onClick={() => navigate("/")}>
//               <FaSignInAlt className="icon" /> <span>Login</span>
//             </Button>
//           )}
//         </Nav>
//       </Navbar>
//     </div>
//   );
// };

// export default Sidebar;


import React from "react";
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
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Header from "./Header";

const Sidebar = () => {
  const { isLoggedIn, logout } = useAuth() || {}; // Ensure safe destructuring
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); // Call the logout function to clear the authentication state
    navigate("/"); // Redirect to Landing page after logging out
  };

  return (
    // <div className="flex flex-row gap-2 mb-10">
      
      <div className="fixed left-0 bg-white-500 shadow-lg text-black h-screen w-64 flex flex-col">
        {/* Logo Section */}
        <div className="text-xl font-bold p-4">
          <span><FaBook className="inline mr-2" />
            ApnaBook</span>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 mt-1">
          <ul>
            <li className="hover:bg-gray-200">
              <a
                href="/dashboard"
                className="flex items-center px-4 py-3 space-x-4"
              >
                <FaTachometerAlt />
                <span>Dashboard</span>
              </a>
            </li>
            <li className="hover:bg-gray-200">
              <a
                href="/selfrecord"
                className="flex items-center px-4 py-3 space-x-4"
              >
                <FaFileAlt />
                <span>Collab Record</span>
              </a>
            </li>
            <li className="hover:bg-gray-200">
              <a href="/book" className="flex items-center px-4 py-3 space-x-4">
                <FaBook />
                <span>Book</span>
              </a>
            </li>
            <li className="hover:bg-gray-200">
              <a href="/users" className="flex items-center px-4 py-3 space-x-4">
                <FaUsers />
                <span>Client Users</span>
              </a>
            </li>
            <li className="hover:bg-gray-200">
              <a
                href="/collaborativebook"
                className="flex items-center px-4 py-3 space-x-4"
              >
                <FaHandshake />
                <span>Collaborative Book</span>
              </a>
            </li>
            <li className="hover:bg-gray-200">
              <a href="/loans" className="flex items-center px-4 py-3 space-x-4">
                <FaHandHoldingUsd />
                <span>Loans</span>
              </a>
            </li>
            <li className="hover:bg-gray-200">
              <a
                href="/invoice"
                className="flex items-center px-4 py-3 space-x-4"
              >
                <FaReceipt />
                <span>Invoice</span>
              </a>
            </li>
            {isLoggedIn && (
              <li className="hover:bg-gray-200">
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
              className="flex items-center w-full px-4 py-3 space-x-4 bg-blue-800 hover:bg-blue-700 rounded-md"
            >
              <FaSignOutAlt />
              <span>Logout</span>
            </button>
          ) : (
            <button
              onClick={() => navigate("/")}
              className="flex items-center w-full px-4 py-3 space-x-4 bg-blue-800 hover:bg-blue-700 rounded-md"
            >
              <FaSignInAlt />
              <span>Login</span>
            </button>
          )}
        </div>
      </div>
    //   <div className="w-[1080px] mb-8">
    //   <Header />
    //   </div>
    // </div>
  );
};

export default Sidebar;
