
import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const ClientUsers = () => {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ name: "", email: "", mobile: "" });
  const [editingUser, setEditingUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);

  const API_URL = `${process.env.REACT_APP_URL}/api/v3/client`;

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const phoneRegex =
    /^(?:\+?\d{1,3})?[-.\s]?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/;

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${API_URL}/getAll-clients`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setUsers(response.data.data || []);
    } catch (error) {
      toast.error("Error fetching client users");
    }
  };

  const validateInputs = () => {
    if (!emailRegex.test(newUser.email)) {
      toast.error("Please enter a valid email address");
      return false;
    }
    if (!phoneRegex.test(newUser.mobile)) {
      toast.error("Please enter a valid phone number");
      return false;
    }
    return true;
  };

  const createUser = async () => {
    if (!validateInputs()) return;

    try {
      const response = await axios.post(`${API_URL}/create-client`, newUser, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setUsers((prevUsers) => [...prevUsers, response.data.data]);
      setNewUser({ name: "", email: "", mobile: "" });
      setShowModal(false);
      toast.success("User created successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Error creating user");
    }
  };

  const updateUser = async () => {
    if (!validateInputs()) return;

    try {
      const response = await axios.put(
        `${API_URL}/update-client/${editingUser._id}`,
        newUser,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === editingUser._id ? response.data.data : user
        )
      );
      setEditingUser(null);
      setNewUser({ name: "", email: "", mobile: "" });
      setShowModal(false);
      toast.success("User updated successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Error updating user");
    }
  };

  const deleteUser = async (id) => {
    try {
      await axios.delete(`${API_URL}/delete-client/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setUsers(users.filter((user) => user._id !== id));
      toast.success("User deleted successfully!");
    } catch (error) {
      toast.error("Error deleting user");
    }
  };

  const openModalForCreate = () => {
    setEditingUser(null);
    setNewUser({ name: "", email: "", mobile: "" });
    setShowModal(true);
  };

  const openModalForEdit = (user) => {
    setEditingUser(user);
    setNewUser({ name: user.name, email: user.email, mobile: user.mobile });
    setShowModal(true);
  };

  useEffect(() => {
    fetchUsers();
    //eslint-disable-next-line
  }, []);

  const filteredUsers = users.filter(
    (user) =>
      user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.mobile?.includes(searchQuery)
  );

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="container mx-auto">
        <h1 className="text-2xl font-bold text-left mb-6">Client Users</h1>

        {/* Toast Container */}
        <ToastContainer position="top-right" autoClose={3000} />

        {/* Add User Button */}
        <div className="mb-6 flex justify-start">
          <button
            onClick={openModalForCreate}
            className="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600"
          >
            Add User
          </button>
        </div>

        {/* Search Input */}
        <div className="mb-6">
          <input
            type="text"
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Search by name or phone"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Users Table */}
        <div className="bg-white shadow-md rounded-lg overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-200 text-gray-600">
              <tr>
                <th className="px-4 py-2">#</th>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Mobile</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user, index) => (
                  <tr key={user._id} className="border-t">
                    <td className="px-4 py-2">{index + 1}</td>
                    <td className="px-4 py-2">{user.name}</td>
                    <td className="px-4 py-2">{user.email}</td>
                    <td className="px-4 py-2">{user.mobile}</td>
                    <td className="px-4 py-2 space-x-2">
                      <button
                        className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                        onClick={() => openModalForEdit(user)}
                      >
                        Edit
                      </button>
                      <button
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                        onClick={() => deleteUser(user._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-4 text-gray-600">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-1/3">
            <h3 className="text-lg font-semibold mb-4">
              {editingUser ? "Edit User" : "Add User"}
            </h3>
            <div className="grid grid-cols-1 gap-4">
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={newUser.name}
                onChange={(e) =>
                  setNewUser({ ...newUser, name: e.target.value })
                }
                className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={newUser.email}
                onChange={(e) =>
                  setNewUser({ ...newUser, email: e.target.value })
                }
                className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <input
                type="text"
                name="mobile"
                placeholder="Mobile"
                value={newUser.mobile}
                onChange={(e) =>
                  setNewUser({ ...newUser, mobile: e.target.value })
                }
                className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="flex justify-end space-x-4 mt-4">
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={editingUser ? updateUser : createUser}
                className="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600"
              >
                {editingUser ? "Save Changes" : "Add User"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientUsers;
