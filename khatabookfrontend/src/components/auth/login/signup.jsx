import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Sidebar from "../../.././pages/Layout/sidebar"; // Import Sidebar component
import { EyeIcon, EyeOffIcon } from '@heroicons/react/outline'; // Import icons for eye button

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^[0-9]{10}$/; // Assumes a 10-digit phone number

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!emailRegex.test(email)) {
      toast.warn("Please enter a valid email address.");
      return;
    }
    if (!phoneRegex.test(phone)) {
      toast.warn("Please enter a valid 10-digit phone number.");
      return;
    }

    try {
      // eslint-disable-next-line
      await axios.post(
        `${process.env.REACT_APP_URL}/api/v1/auth/signup`,
        { name, email, phone, password }
      );
      toast.success("Signup successful! You can now log in.");
      setName("");
      setEmail("");
      setPhone("");
      setPassword("");
    } catch (error) {
      toast.error(error.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="flex" style={{ paddingLeft: "8rem" }}>
      <Sidebar /> {/* Sidebar component */}
      <div className="container flex justify-center items-center h-screen w-full bg-gray-100">
        <div className="card p-4 shadow-lg rounded-lg max-w-md w-full border border-gray-300 bg-white">
          <h2 className="text-center mb-4 text-gray-700 text-2xl font-semibold">
            Signup
          </h2>
          <form onSubmit={handleSignup} className="space-y-4">
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-600">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Enter your name"
              />
            </div>
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-600">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Enter your email"
              />
            </div>
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-600">Phone</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Enter your phone number"
              />
            </div>
            <div className="mb-3 relative">
              <label className="block text-sm font-medium text-gray-600">Password</label>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
              >
                {showPassword ? (
                  <EyeOffIcon className="h-5 w-5 text-gray-500 mt-[100%]" />
                ) : (
                  <EyeIcon className="h-5 w-5 text-gray-500 mt-[100%]" />
                )}
              </button>
            </div>
            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md"
            >
              Signup
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
