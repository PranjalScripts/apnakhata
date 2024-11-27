import React, { useEffect, useState } from "react";
import axios from "axios";
import AddTransactions from "../collaborativeBook/addTransaction"; // Import AddTransactions component

const CollaborativeBook = () => {
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false); // State for modal visibility

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("User is not authenticated. Please log in.");
          setLoading(false);
          return;
        }

        const response = await axios.get(
          `${process.env.REACT_APP_URL}/api/transactions`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setTransactions(response.data);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "An error occurred while fetching transactions."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  const toggleModal = () => setShowModal(!showModal);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center mt-10">
        <div className="bg-red-100 text-red-700 px-6 py-4 rounded-md text-center">
          {error}
        </div>
      </div>
    );

  if (!transactions.length)
    return (
      <div className="flex justify-center items-center mt-10">
        <div className="bg-blue-100 text-blue-700 px-6 py-4 rounded-md text-center">
          No transactions available.
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Your Collabbed Transactions</h2>
          <button
            onClick={toggleModal}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Add Transaction
          </button>
        </div>
        <div className="overflow-x-auto shadow-md rounded-lg">
          <table className="table-auto w-full bg-white border border-gray-200 rounded-lg">
            <thead className="bg-gray-200 text-black">
              <tr>
                <th className="px-4 py-2">#</th>
                <th className="px-4 py-2">Transaction Type</th>
                <th className="px-4 py-2">Book Name</th>
                <th className="px-4 py-2">By (Username)</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Amount</th>
                <th>Records</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction, index) => (
                <tr
                  key={transaction._id}
                  className={`border-b ${
                    index % 2 === 0 ? "bg-gray-50" : "bg-white"
                  }`}
                >
                  <td className="px-4 py-2 text-center">{index + 1}</td>
                  <td className="px-4 py-2 text-center">
                    {transaction.transactionType === "you will get"
                      ? "you will give"
                      : "you will get"}
                  </td>
                  <td className="px-4 py-2 text-center">
                    {transaction.bookId?.bookname || "No book assigned"}
                  </td>
                  <td className="px-4 py-2 text-center">
                    {transaction.userId?.name || "Unknown"}
                  </td>
                  <td className="px-4 py-2 text-center">
                    {transaction.userId?.email || "No email"}
                  </td>
                  <td
                    className={`px-4 py-2 text-center font-bold ${
                      transaction.outstandingBalance < 0
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >
                    {Math.abs(transaction.outstandingBalance)}
                  </td>
                  <td>
                    <button
                      className="bg-blue-500 text-white px-2 py-2 ml-6 rounded hover:bg-blue-600"
                      onClick={() => {
                        window.location.href = `/collaborative-records/${transaction._id}`;
                      }}
                    >
                      View Records
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Transactions Modal */}
      {showModal && (
        <div
          className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50"
          onClick={toggleModal}
        >
          <div
            className="bg-white p-8 rounded shadow-md w-11/12 max-w-3xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded"
              onClick={toggleModal}
            >
              Close
            </button>
            <AddTransactions />
          </div>
        </div>
      )}
    </div>
  );
};

export default CollaborativeBook;
