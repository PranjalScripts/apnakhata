import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const AddTransactions = () => {
  const { bookId } = useParams(); // Get bookId from URL params
  const [clients, setClients] = useState([]);
  const [transactionData, setTransactionData] = useState({
    userId: "",
    clientUserId: "",
    transactionType: "you will get",
    amount: "",
    description: "",
  });
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");

  const axiosInstance = axios.create({
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  useEffect(() => {
    // Fetch clients
    axiosInstance
      .get(`${process.env.REACT_APP_URL}/api/v3/client/getAll-clients`)
      .then((response) => {
        if (response.data?.success && Array.isArray(response.data.data)) {
          setClients(response.data.data);
        }
      })
      .catch((error) => console.error("Error fetching clients:", error));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setTransactionData({
      ...transactionData,
      [name]: name === "amount" ? parseFloat(value) || 0 : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Add bookId to the transaction data before submission
    const payload = { ...transactionData, bookId };

    axiosInstance
      .post(
        `${process.env.REACT_APP_URL}/api/v4/transaction/create-transaction`,
        payload
      )
      .then((response) => {
        setMessage(response.data.message);
        setTransactionData({
          userId: "",
          clientUserId: "",
          transactionType: "you will get",
          amount: "",
          description: "",
        });
      })
      .catch((error) => {
        setMessage(error.response?.data?.message || "An error occurred.");
        console.error("Transaction creation error:", error);
      });
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Add Transaction
        </h2>

        {message && (
          <div
            className={`p-4 mb-4 text-center rounded ${
              message.toLowerCase().includes("success")
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Client Select */}
          <div className="mb-4">
            <label
              htmlFor="clientUserId"
              className="block text-gray-700 font-medium"
            >
              Client
            </label>
            <select
              id="clientUserId"
              name="clientUserId"
              value={transactionData.clientUserId}
              onChange={handleChange}
              className="w-full mt-1 border-gray-300 rounded-lg shadow-sm"
              required
            >
              <option value="">Select Client</option>
              {clients.map((client) => (
                <option key={client._id} value={client._id}>
                  {client.name}
                </option>
              ))}
            </select>
          </div>

          {/* Transaction Type */}
          <div className="mb-4">
            <label
              htmlFor="transactionType"
              className="block text-gray-700 font-medium"
            >
              Transaction Type
            </label>
            <select
              id="transactionType"
              name="transactionType"
              value={transactionData.transactionType}
              onChange={handleChange}
              className="w-full mt-1 border-gray-300 rounded-lg shadow-sm"
            >
              <option value="you will get">You Will Get</option>
              <option value="you will give">You Will Give</option>
            </select>
          </div>

          {/* Amount */}
          <div className="mb-4">
            <label htmlFor="amount" className="block text-gray-700 font-medium">
              Amount
            </label>
            <input
              type="number"
              id="amount"
              name="amount"
              value={transactionData.amount}
              onChange={handleChange}
              className="w-full mt-1 border-gray-300 rounded-lg shadow-sm"
              required
            />
          </div>

          {/* Description */}
          <div className="mb-4">
            <label
              htmlFor="description"
              className="block text-gray-700 font-medium"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={transactionData.description}
              onChange={handleChange}
              className="w-full mt-1 border-gray-300 rounded-lg shadow-sm"
            ></textarea>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg shadow-md hover:bg-blue-600"
          >
            Create Transaction
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddTransactions;
