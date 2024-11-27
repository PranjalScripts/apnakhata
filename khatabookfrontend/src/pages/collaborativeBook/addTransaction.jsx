import React, { useState, useEffect } from "react";
import axios from "axios";

const AddTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [formData, setFormData] = useState({
    transactionId: "",
    transactionType: "you will give",
    amount: "",
    description: "",
    transactionDate: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Fetch transactions on component mount
  useEffect(() => {
      const fetchTransactions = async () => {
        const token = localStorage.getItem("token");
      try {
          const response = await axios.get("http://localhost:5100/api/transactions",
            {
              headers: { Authorization: `Bearer ${token}` },
            }
        );
        setTransactions(response.data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch transactions.");
      }
    };
    fetchTransactions();
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

      try {
        const token = localStorage.getItem("token");
        const response = await axios.post(
          "http://localhost:5100/api/add-transaction",

          formData,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      setSuccess(response.data.message);
      setTransactions((prev) => [...prev, response.data.updatedTransaction]);
      setFormData({
        transactionId: "",
        transactionType: "you will give",
        amount: "",
        description: "",
        transactionDate: "",
      });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add transaction.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-5 bg-white rounded shadow-md">
      <h1 className="text-2xl font-bold mb-5">Manage Transactions</h1>

      {/* Success and Error Messages */}
      {success && <p className="text-green-600 mb-4">{success}</p>}
      {error && <p className="text-red-600 mb-4">{error}</p>}

      {/* Add Transaction Form */}
      <form onSubmit={handleSubmit} className="mb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Transaction ID
            </label>
            <input
              type="text"
              name="transactionId"
              value={formData.transactionId}
              onChange={handleChange}
              placeholder="Transaction ID"
              className="w-full border rounded px-3 py-2 focus:ring focus:ring-blue-200"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Transaction Type
            </label>
            <select
              name="transactionType"
              value={formData.transactionType}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 focus:ring focus:ring-blue-200"
            >
              <option value="you will give">You Will Give</option>
              <option value="you will get">You Will Get</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Amount</label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              placeholder="Enter Amount"
              className="w-full border rounded px-3 py-2 focus:ring focus:ring-blue-200"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Description
            </label>
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter Description"
              className="w-full border rounded px-3 py-2 focus:ring focus:ring-blue-200"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Transaction Date
            </label>
            <input
              type="date"
              name="transactionDate"
              value={formData.transactionDate}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 focus:ring focus:ring-blue-200"
            />
          </div>
        </div>
        <button
          type="submit"
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add Transaction
        </button>
      </form>

      {/* Transaction List */}
      <h2 className="text-xl font-bold mb-4">Transaction History</h2>
      <div
        className="overflow-x-auto overflow-y-auto "
        style={{
          maxHeight: "300px", // Adjust height to fit your needs
          maxWidth: "100%", // Optional: Restrict width
          border: "1px solid #ccc", // Optional: Add a border to make it visually distinct
        }}
      >
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 border">Transaction ID</th>
              <th className="px-4 py-2 border">Type</th>
              <th className="px-4 py-2 border">Amount</th>
              <th className="px-4 py-2 border">Outstanding Balance</th>
              <th className="px-4 py-2 border">Description</th>
              <th className="px-4 py-2 border">Date</th>
            </tr>
          </thead>
          <tbody>
            {transactions.length ? (
              transactions.map((transaction) =>
                transaction.transactionHistory.map((entry, index) => (
                  <tr
                    key={`${transaction._id}-${index}`}
                    className="text-center"
                  >
                    <td className="px-4 py-2 border">{transaction._id}</td>
                    <td className="px-4 py-2 border">
                      {entry.transactionType}
                    </td>
                    <td className="px-4 py-2 border">{entry.amount || "-"}</td>
                    <td className="px-4 py-2 border">
                      {entry.outstandingBalance}
                    </td>
                    <td className="px-4 py-2 border">
                      {entry.description || "-"}
                    </td>
                    <td className="px-4 py-2 border">
                      {new Date(entry.transactionDate).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-4">
                  No transactions found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AddTransactions;
