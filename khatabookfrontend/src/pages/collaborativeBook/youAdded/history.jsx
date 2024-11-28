import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const History = () => {
  const { transactionId } = useParams(); // Get transaction ID from the route
  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchTransaction = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch(
          `http://localhost:5100/api/collab-transactions/single-transaction/${transactionId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = await response.json();
        if (data.success) {
          setTransaction(data.data);
        } else {
          console.error("Transaction not found");
        }
      } catch (error) {
        console.error("Error fetching transaction:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransaction();
  }, [transactionId]);

  const updateTransactionStatus = async (entryId) => {
    setUpdating(true);
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        `http://localhost:5100/api/collab-transactions/transactions/${transactionId}/entries/${entryId}/confirm`,
        {
          method: "PATCH",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.ok) {
        // Update the transaction state
        setTransaction((prev) => ({
          ...prev,
          transactionHistory: prev.transactionHistory.map((entry) =>
            entry._id === entryId
              ? { ...entry, confirmationStatus: "confirmed" }
              : entry
          ),
        }));
        alert("Transaction status updated successfully!");
      } else {
        console.error("Failed to update transaction status.");
        alert("Failed to update status. Please try again.");
      }
    } catch (error) {
      console.error("Error updating transaction status:", error);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg font-bold text-gray-700">Loading...</div>
      </div>
    );
  }

  if (!transaction) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg font-bold text-gray-700">
          Transaction not found
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Transaction Details
      </h1>
      <div className="mb-4">
        <p>
          <strong>Transaction ID:</strong> {transaction._id}
        </p>
        <p>
          <strong>Book Name:</strong> {transaction.bookId.bookname}
        </p>
        <p>
          <strong>User Name:</strong> {transaction.userId.name}
        </p>
        <p>
          <strong>Client Name:</strong> {transaction.clientUserId.name}
        </p>
        <p>
          <strong>Transaction Type:</strong> {transaction.transactionType}
        </p>
        <p>
          <strong>Outstanding Balance:</strong> {transaction.outstandingBalance}
        </p>
      </div>

      <h2 className="text-xl font-semibold text-gray-700 mb-4">
        Transaction History
      </h2>
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse border border-gray-300 bg-white shadow-md rounded-lg">
          <thead>
            <tr className="bg-gray-100 text-left text-gray-700">
              <th className="border border-gray-300 px-4 py-2">
                Transaction Type
              </th>
              <th className="border border-gray-300 px-4 py-2">Amount</th>
              <th className="border border-gray-300 px-4 py-2">Description</th>
              <th className="border border-gray-300 px-4 py-2">Date</th>
              <th className="border border-gray-300 px-4 py-2">
                Outstanding Balance
              </th>
               
              <th className="border border-gray-300 px-4 py-2">
                 Status
              </th>
            </tr>
          </thead>
          <tbody>
            {transaction.transactionHistory.map((history) => (
              <tr key={history._id} className="hover:bg-gray-50">
                <td className="border border-gray-300 px-4 py-2">
                  {history.transactionType}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {history.amount}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {history.description}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {new Date(history.transactionDate).toLocaleString()}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {history.outstandingBalance}
                </td>
                 
                <td className="border border-gray-300 px-4 py-2">
                  {history.confirmationStatus === "confirmed" ? (
                    <span className="text-green-600 font-semibold">
                      Confirmed
                    </span>
                  ) : (
                    <button
                      onClick={() => updateTransactionStatus(history._id)}
                      disabled={updating}
                      className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 disabled:opacity-50"
                    >
                      {updating ? "Updating..." : "Confirm"}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default History;
