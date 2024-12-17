import React, { useState, useEffect, useRef } from "react";
import { FaEyeSlash, FaEye, FaTimes } from "react-icons/fa";
import { toast } from "react-toastify";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
const LoginModal = ({ showLoginModal, setShowLoginModal }) => {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
const navigate = useNavigate();
 
const handleNavigate = () => {
  navigate("/home");
};
  const modalRef = useRef(null); // Ref for modal content

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^[0-9]{10}$/;

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!emailRegex.test(identifier) && !phoneRegex.test(identifier)) {
      toast.warn("Please enter a valid email or 10-digit phone number.");
      return;
    }

    const loginPayload = emailRegex.test(identifier)
      ? { email: identifier, password }
      : { phone: identifier, password };

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_URL}/api/v1/auth/login`,
        loginPayload
      );
      const { user, token } = response.data;
      login(user);
      localStorage.setItem("token", token);
      localStorage.setItem("userId", user.id);
      toast.success("Login successful");
      setShowLoginModal(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    }
  };

  // Close modal on clicking outside or pressing Escape key
  useEffect(() => {
    const handleOutsideOrEscape = (event) => {
      // Close on Escape key
      if (event.key === "Escape") {
        setShowLoginModal(false);
      }
      // Close on outside click
      if (event.type === "mousedown" && modalRef.current && !modalRef.current.contains(event.target)) {
        setShowLoginModal(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideOrEscape);
    document.addEventListener("keydown", handleOutsideOrEscape);

    return () => {
      document.removeEventListener("mousedown", handleOutsideOrEscape);
      document.removeEventListener("keydown", handleOutsideOrEscape);
    };
  }, [setShowLoginModal]);

  if (!showLoginModal) return null;

  return (
    <div>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black bg-opacity-50 z-40"></div>

      {/* Modal Container */}
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div
          ref={modalRef} // Attach ref to modal content
          className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full relative"
        >
          <button
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            onClick={() => setShowLoginModal(false)}
          >
            <FaTimes />
          </button>
          <h2 className="text-center text-xl font-bold text-gray-800 mb-4">
            Login
          </h2>
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Email or Phone
              </label>
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                required
                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter email or phone"
              />
            </div>
            <div className="mb-4 relative">
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter password"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-3 flex items-center text-gray-500 mt-[8%]"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-md shadow-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
            onClick={handleNavigate}
            >
              Login
            </button>
            <p className="text-center mt-4 text-sm text-gray-600">
              Don’t have an account?{" "}
              <a href="/signup" className="text-blue-600 hover:underline">
                Signup here
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
