import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const CollaborativeBookRecords = () => {
  const { transactionId } = useParams(); // Get transactionId from URL
  const [transaction, setTransaction] = useState(null);
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
        console.error("Error fetching transaction details:", error);
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

  if (!transaction) {
    return (
      <div className="text-center py-10">Loading transaction details...</div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-3xl">
      <h1 className="text-3xl font-semibold text-gray-800 mb-6">
        Transaction Details
      </h1>

      <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
        <table className="min-w-full table-auto">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="px-4 py-2 text-left text-gray-700">Field</th>
              <th className="px-4 py-2 text-left text-gray-700">Value</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="px-4 py-2 font-medium text-gray-700">
                Transaction ID
              </td>
              <td className="px-4 py-2">{transaction._id}</td>
            </tr>
            <tr className="border-t border-gray-200">
              <td className="px-4 py-2 font-medium text-gray-700">Book Name</td>
              <td className="px-4 py-2">{transaction.bookId.bookname}</td>
            </tr>
            <tr>
              <td className="px-4 py-2 font-medium text-gray-700">User Name</td>
              <td className="px-4 py-2">{transaction.userId.name}</td>
            </tr>
            <tr className="border-t border-gray-200">
              <td className="px-4 py-2 font-medium text-gray-700">
                Client Name
              </td>
              <td className="px-4 py-2">{transaction.clientUserId.name}</td>
            </tr>
            <tr>
              <td className="px-4 py-2 font-medium text-gray-700">
                Transaction Type
              </td>
              <td className="px-4 py-2">{transaction.transactionType}</td>
            </tr>
            <tr className="border-t border-gray-200">
              <td className="px-4 py-2 font-medium text-gray-700">
                Outstanding Balance
              </td>
              <td className="px-4 py-2">{transaction.outstandingBalance}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        Transaction History
      </h2>
      <div className="bg-white shadow-lg rounded-lg p-6">
        <table className="min-w-full table-auto">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="px-4 py-2 text-left text-gray-700">
                Transaction type
              </th>
              <th className="px-4 py-2 text-left text-gray-700">Amount</th>
              <th className="px-4 py-2 text-left text-gray-700">Description</th>
              <th className="px-4 py-2 text-left text-gray-700">
                Transaction Date
              </th>
              <th className="px-4 py-2 text-left text-gray-700">Status</th>
              <th className="px-4 py-2 text-left text-gray-700">
                Update Status
              </th>
            </tr>
          </thead>
          <tbody>
            {transaction.transactionHistory.map((history) => (
              <tr key={history._id} className="border-t border-gray-200">
                <td className="px-4 py-2">{history.transactionType}</td>
                <td className="px-4 py-2">{history.amount}</td>
                <td className="px-4 py-2">{history.description}</td>
                <td className="px-4 py-2">
                  {new Date(history.transactionDate).toLocaleString()}
                </td>
                <td className="px-4 py-2">{history.confirmationStatus}</td>
                <td className="px-4 py-2">
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

export default CollaborativeBookRecords;
