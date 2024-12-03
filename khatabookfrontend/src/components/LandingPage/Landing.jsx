
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import {
  BarChart3,
  Shield,
  Zap,
  Clock,
  ChevronRight,
  Receipt,
  PieChart,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { FaEyeSlash, FaEye } from "react-icons/fa";

function Landing() {
  const navigate = useNavigate();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
//eslint-disable-next-line
  const handleLoginClick = () => {
    setShowLoginModal(true);
  };

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
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col">
      {/* Navbar */}
      <nav className="bg-white shadow fixed w-full z-10">
        <div className="container mx-auto flex justify-between items-center py-4">
          <a href="/" className="flex items-center">
            <img
              src="https://i.ibb.co/bdhQrFG/pizeonflyfull.png"
              alt="pizeonflyfull"
              className="h-8"
            />
          </a>
          <button
            className="text-gray-700 lg:hidden"
            aria-label="Toggle navigation"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
          </button>
          <div className="hidden lg:flex items-center space-x-6">
            <a href="#features" className="text-gray-700 hover:text-blue-500">
              Features
            </a>
            <a href="#pricing" className="text-gray-700 hover:text-blue-500">
              Pricing
            </a>
            <a
              href="#testimonials"
              className="text-gray-700 hover:text-blue-500"
            >
              Testimonials
            </a>
            <button
              onClick={() => setShowLoginModal(true)}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg"
            >
              Login
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 mt-10 text-center bg-white">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-gray-800">
            Smart Expense Management{" "}
            <span className="text-blue-600">System</span>
          </h1>
          <p className="text-lg text-gray-600 mt-4">
            Transform your business expense tracking with insights, real-time
            reporting, and automated reconciliation.
          </p>
          <div className="flex justify-center gap-4 mt-6">
            <button
              onClick={() => setShowLoginModal(true)}
              className="bg-blue-600 text-white font-medium py-2 px-6 rounded-md flex items-center hover:bg-blue-700"
            >
              Get Started <ChevronRight className="ml-2" />
            </button>
            <button className="border border-blue-600 text-blue-600 font-medium py-2 px-6 rounded-md hover:bg-blue-100">
              Watch Demo
            </button>
          </div>
          <img
            src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80"
            alt="Dashboard Preview"
            className="w-full max-w-4xl mx-auto mt-8 rounded-lg shadow-lg"
          />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-10 bg-gray-100" id="features">
        <div className="container mx-auto text-center px-4">
          <h2 className="text-3xl font-bold mb-10">
            Everything you need to manage expenses
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <BarChart3 className="text-blue-600" size={24} />,
                title: "Real-time Analytics",
                description:
                  "Get instant insights into your spending patterns with powerful analytics tools.",
              },
              {
                icon: <Receipt className="text-blue-600" size={24} />,
                title: "Smart Receipt Scanning",
                description:
                  "Automatically extract data from receipts using our advanced OCR technology.",
              },
              {
                icon: <PieChart className="text-blue-600" size={24} />,
                title: "Budget Tracking",
                description:
                  "Set and monitor budgets with automatic alerts and spending forecasts.",
              },
              {
                icon: <Shield className="text-blue-600" size={24} />,
                title: "Secure & Compliant",
                description:
                  "Bank-grade security with automatic backup and encryption.",
              },
              {
                icon: <Zap className="text-blue-600" size={24} />,
                title: "Automated Processing",
                description:
                  "Save time with automated expense categorization and reporting.",
              },
              {
                icon: <Clock className="text-blue-600" size={24} />,
                title: "24/7 Support",
                description:
                  "Round-the-clock support to help you manage your expenses better.",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-white shadow-lg rounded-lg p-6 text-left"
              >
                <div className="mb-4">{feature.icon}</div>
                <h5 className="text-lg font-semibold mb-2">{feature.title}</h5>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-10 bg-blue-600 text-white text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-4">
            Ready to transform your expense management?
          </h2>
          <p className="text-lg mb-4">
            Join thousands of businesses that trust Pizeonfly for their expense
            management needs.
          </p>
        </div>
      </section>

      <footer className="bg-gray-800 text-gray-300 py-8 mt-auto">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Company Overview */}
            <div>
              <div className="flex items-center mb-4">
                <span className="text-white font-bold text-lg">
                  {" "}
                  <a href="/" className="flex items-center">
                    <img
                      src="https://i.ibb.co/bdhQrFG/pizeonflyfull.png"
                      alt="pizeonflyfull"
                      className="h-8"
                    />
                  </a>
                </span>
              </div>
              <p className="text-gray-400">
                Making expense management effortless for modern businesses.
              </p>
            </div>
            {/* Product Links */}
            <div>
              <h5 className="text-white font-semibold mb-3">Product</h5>
              <ul className="space-y-2">
                <li>
                  <a
                    href="https://pizeonfly.com/explore-our-digital-marketing-services-pizeonfly-in-delhi"
                    className="hover:text-white"
                  >
                    Features
                  </a>
                </li>

                <li>
                  <a href="https://pizeonfly.com/" className="hover:text-white">
                    Enterprise
                  </a>
                </li>
              </ul>
            </div>
            {/* Company Links */}
            <div>
              <h5 className="text-white font-semibold mb-3">Company</h5>
              <ul className="space-y-2">
                <li>
                  <a
                    href="https://pizeonfly.com/about-digital-marketing-agency-in-delhi-pizeonfly"
                    className="hover:text-white"
                  >
                    About
                  </a>
                </li>
                <li>
                  <a
                    href="https://pizeonfly.com/pizeonfly-blogs-expert-insights-trends-in-digital-marketing"
                    className="hover:text-white"
                  >
                    Blog
                  </a>
                </li>
              </ul>
            </div>
            {/* Legal Links */}
            <div>
              <h5 className="text-white font-semibold mb-3">Legal</h5>
              <ul className="space-y-2">
                <li>
                  <a
                    href="https://pizeonfly.com/privacy-policy"
                    className="hover:text-white"
                  >
                    Privacy
                  </a>
                </li>
                <li>
                  <a
                    href="https://pizeonfly.com/terms-of-use"
                    className="hover:text-white"
                  >
                    Terms
                  </a>
                </li>
              </ul>
            </div>
          </div>
          {/* Footer Bottom */}
          <div className="text-center mt-6">
            <p className="text-gray-500">
              © 2024 Pizeonfly. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* Login Modal */}
      {showLoginModal && (
        <div>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setShowLoginModal(false)} // Close modal on backdrop click
          ></div>

          {/* Modal Container */}
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div
              className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full"
              onClick={(e) => e.stopPropagation()} // Prevent clicks inside modal from closing it
            >
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
                    className="absolute inset-y-0 right-3 flex items-center text-gray-500"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-2 rounded-md shadow-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
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
      )}
    </div>
  );
}

export default Landing;
