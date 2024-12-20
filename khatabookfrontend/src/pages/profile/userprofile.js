import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ProfileUpdate from "../../components/auth/ProfileUpdate/prorfileupdate";
import { toast } from "react-toastify";

const GetUserProfile = () => {
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.warn("Please log in to access your profile");
      navigate("/login"); // Redirect to login if not authenticated
      return;
    }

    const fetchUserProfile = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_URL}/api/v1/auth/get-profile`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setUserProfile(response.data.user);
      } catch (error) {
        console.error("Error fetching user profile", error);
        toast.error("Error fetching profile");
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-lg text-gray-500 animate-pulse">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10">
      <h2 className="text-3xl font-bold text-gray-700 mb-8">User Profile</h2>
      {userProfile ? (
        <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
          <div className="flex justify-center mb-4">
            {/* Display profile picture */}
            {userProfile.profilePicture && (
              <img
                src={`${process.env.REACT_APP_URL}/uploads/profile-pictures/${userProfile.profilePicture.split("\\").pop()}`}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover"
              />
            )}
          </div>
          <div className="mb-4">
            <h5 className="text-xl font-semibold text-gray-800">
              {userProfile.name}
            </h5>
          </div>
          <div className="mb-2">
            <p className="text-gray-600">
              <strong>Email:</strong> {userProfile.email}
            </p>
          </div>
          <div className="mb-4">
            <p className="text-gray-600">
              <strong>Phone:</strong> {userProfile.phone}
            </p>
          </div>
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md w-full"
            onClick={() => setShowModal(true)}
          >
            Update Profile
          </button>
        </div>
      ) : (
        <div className="text-red-500 bg-red-100 p-4 rounded-md">
          Failed to load profile data.
        </div>
      )}

      {/* Profile Update Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-lg">
            <div className="flex items-center justify-between px-4 py-2 border-b">
              <h5 className="text-lg font-semibold text-gray-700">
                Update Profile
              </h5>
              <button
                className="text-gray-500 hover:text-gray-700 focus:outline-none"
                onClick={() => setShowModal(false)}
              >
                ✕
              </button>
            </div>
            <div className="p-6">
              <ProfileUpdate onClose={() => setShowModal(false)} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GetUserProfile;
