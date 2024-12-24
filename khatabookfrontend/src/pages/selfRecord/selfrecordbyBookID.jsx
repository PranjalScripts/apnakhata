import React, { useState, useEffect } from "react";
import AddTransactions from "./Addselfrecord"; // Import the AddTransactions component
import { useParams, useNavigate } from "react-router-dom";

const SelfRecordByBookID = () => {
  const { bookId } = useParams();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal visibility state
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_URL}/api/v4/transaction/getbook-transactions/${bookId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const data = await response.json();
        if (data.success) {
          setTransactions(data.transactions);
        } else {
          throw new Error("Failed to fetch transactions");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [bookId]);

  if (loading) return <div className="text-center p-4">Loading...</div>;
  if (error) return <div className="text-red-500 p-4">Error: {error}</div>;

  const handleTransactionHistory = (transactionId) => {
    navigate(`/transaction-history/${transactionId}`);
  };

  const Modal = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-2 right-2 text-gray-500 hover:text-black"
          >
            &times;
          </button>
          {children}
        </div>
      </div>
    );
  };

  return (
    <div className="p-4 bg-gray-50 rounded shadow">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">
          Transactions for Book ID: {bookId}
        </h1>
        <button
          onClick={() => setIsModalOpen(true)} // Open the modal
          className="border bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add New Record
        </button>
      </div>

      {transactions.length === 0 ? (
        <div className="text-center">
          <p className="text-gray-500 mb-4">
            No transactions found for this book.
          </p>
        </div>
      ) : (
        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 px-4 py-2">
                Transaction Type
              </th>
              <th className="border border-gray-300 px-4 py-2">Initiated to</th>
              <th className="border border-gray-300 px-4 py-2">
                Outstanding Balance
              </th>
              <th className="border border-gray-300 px-4 py-2">
                Mobile Number
              </th>
              <th className="border border-gray-300 px-4 py-2">Email</th>
              <th className="border border-gray-300 px-4 py-2">See Details</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => (
              <tr key={transaction._id} className="hover:bg-gray-100">
                <td className="border border-gray-300 px-4 py-2">
                  {transaction.transactionType || "N/A"}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {transaction.clientUserId?.name || "N/A"}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {transaction.outstandingBalance}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {transaction.clientUserId?.mobile || "N/A"}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {transaction.clientUserId?.email || "N/A"}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <button
                    className="border bg-blue-500 text-white px-2 py-1 rounded-2xl"
                    onClick={() => handleTransactionHistory(transaction._id)}
                  >
                    See Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Modal for AddTransactions */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <AddTransactions />
      </Modal>
    </div>
  );
};

export default SelfRecordByBookID;
