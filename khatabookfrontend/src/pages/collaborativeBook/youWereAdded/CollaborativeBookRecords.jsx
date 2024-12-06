import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const CollaborativeBookRecords = () => {
  const { transactionId } = useParams(); // Get transactionId from URL
  const [transaction, setTransaction] = useState(null);
  const [updatingEntryId, setUpdatingEntryId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    transactionType: "",
    amount: 0,
    description: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const userId = localStorage.getItem("userId");
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "amount" ? parseFloat(value) || 0 : value,
    }));
  };

  const handleAddTransaction = async (e) => {
    e.preventDefault();

    if (isSubmitting) return; // Prevent multiple submissions

    if (!formData.transactionType) {
      alert("Please select a transaction type.");
      return;
    }

    if (formData.amount <= 0) {
      alert("Please enter a valid amount greater than zero.");
      return;
    }

    setIsSubmitting(true);
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        `http://localhost:5100/api/collab-transactions/transactions/${transactionId}/add`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setTransaction((prev) => ({
          ...prev,
          transactionHistory: [...prev.transactionHistory, data.entry],
        }));
        setShowForm(false);
        setFormData({ transactionType: "", amount: 0, description: "" });
        alert("Transaction added successfully!");
      } else {
        console.error("Failed to add transaction.");
        alert(data.message || "Failed to add transaction.");
      }
    } catch (error) {
      console.error("Error adding transaction:", error);
      alert("Failed to add the transaction due to a network issue.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateTransactionStatus = async (entryId) => {
    setUpdatingEntryId(entryId);
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
      setUpdatingEntryId(null);
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
              <td className="px-4 py-2">{transaction.userId}</td>
            </tr>
            <tr className="border-t border-gray-200">
              <td className="px-4 py-2 font-medium text-gray-700">
                Outstanding Balance
              </td>
              <td className="px-4 py-2">
                <span
                  className={`${
                    userId === transaction.initiaterId
                      ? transaction.outstandingBalance> 0
                        ? "text-green-500"
                        : "text-red-500"
                      : transaction.outstandingBalance > 0
                      ? "text-red-500"
                      : "text-green-500"
                  }`}
                >
                  {Math.abs(transaction.outstandingBalance).toFixed(2)}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="flex space-x-4 mb-6">
        <button
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          onClick={() => {
            setShowForm(true);
            setFormData((prev) => ({
              ...prev,
              transactionType: "you will get",
            }));
          }}
        >
          You Will Get
        </button>
        <button
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          onClick={() => {
            setShowForm(true);
            setFormData((prev) => ({
              ...prev,
              transactionType: "you will give",
            }));
          }}
        >
          You Will Give
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleAddTransaction}
          className="bg-white shadow-lg rounded-lg p-6 mb-6"
        >
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Add {formData.transactionType} Transaction
          </h2>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">
              Amount
            </label>
            <input
              type="number"
              name="amount"
              className="w-full border-gray-300 rounded-md p-2"
              value={formData.amount}
              onChange={handleInputChange}
              required
              min="0"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">
              Description
            </label>
            <textarea
              name="description"
              className="w-full border-gray-300 rounded-md p-2"
              value={formData.description}
              onChange={handleInputChange}
            ></textarea>
          </div>
          <div className="flex space-x-4">
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>
            <button
              type="button"
              className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
              onClick={() => setShowForm(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        Transaction History
      </h2>
      <div className="bg-white shadow-lg rounded-lg p-6">
        <table className="min-w-full table-auto">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="px-4 py-2 text-left text-gray-700">
                Initiated By
              </th>
              <th className="px-4 py-2 text-left text-gray-700">
                Transaction Type
              </th>
              <th className="px-4 py-2 text-left text-gray-700">Amount</th>
              <th className="px-4 py-2 text-left text-gray-700">Description</th>
              <th className="px-4 py-2 text-left text-gray-700">
                Transaction Date
              </th>
              <th className="px-4 py-2 text-left text-gray-700">Status</th>
              <th className="px-4 py-2 text-left text-gray-700">Action</th>
            </tr>
          </thead>
          <tbody>
            {transaction.transactionHistory?.length > 0 ? (
              transaction.transactionHistory.map((history) => (
                <tr key={history._id} className="border-b border-gray-200">
                  <td className="px-4 py-2">{history.initiatedBy}</td>

                  <td className="px-4 py-2">
                    {userId === history.initiaterId
                      ? history.transactionType // Show the actual transaction type if user is the initiator
                      : history.transactionType === "you will give"
                      ? "You will get" // If the user is not the initiator, swap "you will give" to "you will get"
                      : "You will give"}{" "}
                  </td>

                  <td className="px-4 py-2">{history.amount.toFixed(2)}</td>
                  <td className="px-4 py-2">{history.description}</td>
                  <td className="border border-gray-300 px-4 py-2">
                    {new Date(history.transactionDate).toLocaleString()}
                  </td>
                  <td className="px-4 py-2">{history.confirmationStatus}</td>
                  <td className="px-4 py-2">
                    {history.confirmationStatus === "pending" &&
                      userId !== history.initiaterId && (
                        <button
                          onClick={() => updateTransactionStatus(history._id)}
                          disabled={updatingEntryId === history._id}
                          className={`px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 ${
                            updatingEntryId === history._id ? "opacity-50" : ""
                          }`}
                        >
                          {updatingEntryId === history._id
                            ? "Updating..."
                            : "Confirm"}
                        </button>
                      )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center text-gray-600 py-4">
                  No transaction history available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CollaborativeBookRecords;
