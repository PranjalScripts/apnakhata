import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { MdEdit, MdDelete } from "react-icons/md";
import { IoDownload } from 'react-icons/io5';   

const History = () => {
  const { transactionId } = useParams(); // Get transaction ID from the route
  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [adding, setAdding] = useState(false);
  const [showForm, setShowForm] = useState(false); // Toggle form visibility
  const [isEditing, setIsEditing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImage, setModalImage] = useState(null);

  const [editData, setEditData] = useState({
    id: null,
    amount: "",
    transactionType: "",
  });
  const [selectedTransactionType, setSelectedTransactionType] = useState(""); // To store the transaction type
  const [newTransaction, setNewTransaction] = useState({
    amount: "",
    description: "",
  });
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

  const handleAddTransaction = async () => {
    if (!transaction) return;

    setAdding(true);
    const token = localStorage.getItem("token");
    const parsedAmount = parseFloat(newTransaction.amount);

    if (isNaN(parsedAmount)) {
      alert("Please enter a valid amount");
      setAdding(false);
      return;
    }

    const transactionData = {
      clientUserId: transaction.clientUserId,
      bookId: transaction.bookId,
      transactionType: selectedTransactionType,
      amount: parsedAmount,
      description: newTransaction.description,
      transactionId,
    };

    try {
      const response = await fetch(
        "http://localhost:5100/api/collab-transactions/create-transactions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(transactionData),
        }
      );

      if (response.ok) {
        const addedTransaction = await response.json();
        setTransaction((prev) => ({
          ...prev,
          transactionHistory: [
            ...prev.transactionHistory,
            addedTransaction.data,
          ],
        }));
        alert("Transaction added successfully!");
        setNewTransaction({ amount: "", description: "" });
        setShowForm(false);
      } else {
        console.error("Failed to add transaction");
        alert("Failed to add transaction. Please try again.");
      }
    } catch (error) {
      console.error("Error adding transaction:", error);
    } finally {
      setAdding(false);
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

  const handleDelete = async (entryId) => {
    const token = localStorage.getItem("token");
    if (window.confirm("Are you sure you want to delete this transaction?")) {
      try {
        const response = await fetch(
          `http://localhost:5100/api/collab-transactions/transactions/${transactionId}/entries/${entryId}`,
          {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (response.ok) {
          setTransaction((prev) => ({
            ...prev,
            transactionHistory: prev.transactionHistory.filter(
              (entry) => entry._id !== entryId
            ),
          }));
          alert("Transaction deleted successfully!");
        } else {
          console.error("Failed to delete transaction.");
          alert("Failed to delete transaction. Please try again.");
        }
      } catch (error) {
        console.error("Error deleting transaction:", error);
      }
    }
  };
  const openEditForm = (entry) => {
    setEditData({
      id: entry._id,
      amount: entry.amount,
      transactionType: entry.transactionType,
    });
    setIsEditing(true);
  };
  const closeEditForm = () => {
    setIsEditing(false);
    setEditData({ id: null, amount: "", transactionType: "" });
  };
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const { id, amount, transactionType } = editData;

    const token = localStorage.getItem("token");
    const updatedData = {
      amount: parseFloat(amount),
      transactionType: transactionType.toLowerCase(),
    };

    try {
      const response = await fetch(
        `http://localhost:5100/api/collab-transactions/transactions/${transactionId}/entries/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updatedData),
        }
      );

      if (response.ok) {
        const updatedEntry = await response.json();
        setTransaction((prev) => ({
          ...prev,
          transactionHistory: prev.transactionHistory.map((history) =>
            history._id === id ? { ...history, ...updatedEntry.data } : history
          ),
        }));
        alert("Transaction updated successfully!");
        closeEditForm();
      } else {
        alert("Failed to update the transaction. Please try again.");
      }
    } catch (error) {
      console.error("Error updating transaction:", error);
      alert("An error occurred while updating the transaction.");
    }
  };

  const handleImageClick = (imagePath) => {
    setModalImage(`http://localhost:5100/${imagePath.replace(/\\/g, "/")}`);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalImage(null);
  };
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
        Add New Transaction
      </h2>
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => {
            setSelectedTransactionType("you will get");
            setShowForm(true);
          }}
          className="px-4 py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600"
        >
          You Will Get
        </button>
        <button
          onClick={() => {
            setSelectedTransactionType("you will give");
            setShowForm(true);
          }}
          className="px-4 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600"
        >
          You Will Give
        </button>
      </div>
      {showForm && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAddTransaction();
          }}
          className="mb-6 border p-4 rounded-lg shadow-md"
        >
          <h3 className="text-lg font-bold text-gray-700 mb-4">
            {selectedTransactionType}
          </h3>
          <div className="grid gap-4 mb-4">
            <input
              type="text"
              placeholder="Amount"
              value={newTransaction.amount}
              onChange={(e) =>
                setNewTransaction({ ...newTransaction, amount: e.target.value })
              }
              className="border rounded px-4 py-2"
              required
            />
            <input
              type="text"
              placeholder="Description"
              value={newTransaction.description}
              onChange={(e) =>
                setNewTransaction({
                  ...newTransaction,
                  description: e.target.value,
                })
              }
              className="border rounded px-4 py-2"
              required
            />
          </div>
          <button
            type="submit"
            disabled={adding}
            className="px-4 py-2 bg-purple-500 text-white font-semibold rounded-lg hover:bg-purple-600 disabled:opacity-50"
          >
            {adding ? "Adding..." : "Submit"}
          </button>
          <button
            type="button"
            onClick={() => setShowForm(false)}
            className="ml-4 px-4 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600"
          >
            Cancel
          </button>
        </form>
      )}
      <h2 className="text-xl font-semibold text-gray-700 mb-4">
        Transaction History
      </h2>
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse border border-gray-300 bg-white shadow-md rounded-lg">
          <thead>
            <tr className="bg-gray-100 text-left text-gray-700">
              <th className="border border-gray-300 px-4 py-2">Initiated By</th>
              <th className="border border-gray-300 px-4 py-2">
                Transaction Type
              </th>
              <th className="border border-gray-300 px-4 py-2">Amount</th>
              <th className="border border-gray-300 px-4 py-2">Description</th>
              <th className="border border-gray-300 px-4 py-2">Date</th>
              <th className="border border-gray-300 px-4 py-2">Status</th>
              <th className="border border-gray-300 px-4 py-2">files</th>
              <th className="border border-gray-300 px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {transaction.transactionHistory.map((history) => (
              <tr key={history._id} className="hover:bg-gray-50">
                <td className="border border-gray-300 px-4 py-2">
                  {history.initiatedBy}
                </td>
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
                  {history.confirmationStatus === "confirmed" ? (
                    <span className="text-green-600 font-semibold">
                      Confirmed
                    </span>
                  ) : userId === history.initiaterId ? (
                    <span className="text-blue-600 font-semibold">
                      Pending!
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
                <td className="border border-gray-300 px-4 py-2">
                  <img
                    src={`http://localhost:5100/${history.file.replace(
                      /\\/g,
                      "/"
                    )}`}
                    alt="Transaction File"
                    className="max-w-xs max-h-32 object-contain cursor-pointer"
                    onClick={() => handleImageClick(history.file)}
                  />
                </td>

                <td className="border border-gray-300 px-4 py-2">
                  {userId === history.initiaterId ? (
                    <>
                      {/* Edit button */}
                      <button
                        onClick={() => openEditForm(history)}
                        className="text-yellow-500 hover:text-yellow-600"
                        title="Edit"
                      >
                        <i className="text-xl">
                          <MdEdit />
                        </i>
                      </button>

                      {/* Delete button */}
                      <button
                        onClick={() => handleDelete(history._id)}
                        className="text-red-500 hover:text-red-600"
                        title="Delete"
                      >
                        <i className="text-xl">
                          <MdDelete />
                        </i>
                      </button>
                    </>
                  ) : (
                    <span className="text-gray-500 italic">
                      You have not Initiated this transaction
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {isEditing && (
        <form
          onSubmit={handleEditSubmit}
          className="p-4 border rounded-lg shadow-md bg-white mb-4"
        >
          <h3 className="text-lg font-bold text-gray-700 mb-4">
            Edit Transaction
          </h3>
          <div className="grid gap-4 mb-4">
            <input
              type="text"
              value={editData.amount}
              onChange={(e) =>
                setEditData({ ...editData, amount: e.target.value })
              }
              className="border rounded px-4 py-2"
              placeholder="Amount"
              required
            />
            <select
              value={editData.transactionType}
              onChange={(e) =>
                setEditData({ ...editData, transactionType: e.target.value })
              }
              className="border rounded px-4 py-2"
              required
            >
              <option value="" disabled>
                Select Transaction Type
              </option>
              <option value="you will get">You Will Get</option>
              <option value="you will give">You Will Give</option>
            </select>
          </div>
          <div className="flex gap-4">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600"
            >
              Save Changes
            </button>
            <button
              type="button"
              onClick={closeEditForm}
              className="px-4 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50"
          onClick={closeModal}
        >
          <div className="bg-white p-4 rounded-lg w-3/4 max-h-[80vh] relative"> 
            {/* ye hai frame */}
            <div
              className="relative w-full h-full"
              onClick={(e) => e.stopPropagation()} // Prevent modal close on clicking the image container
            >
              <img
                src={modalImage}
                alt="Transaction File"
                className="w-full h-[80vh] flex select-none"
                style={{
                  height: "70vh",
                  width: "auto",
                  display: "flex",
                  WebkitUserSelect: "none",
                  margin: "auto", // For Safari
                }}
              />
              <button
                className="absolute top-4 right-4 bg-white rounded-full p-3 h-10 w-10 flex items-center justify-center text-xl font-bold"
                onClick={closeModal}
              >
                ✖
              </button>

              {/* Download Icon with increased size using inline style */}
              <a
                href={modalImage}
                download
                className="absolute bottom-0 -left-1 bg-white/10 backdrop-blur-lg	border rounded-full px-6 py-1 flex items-center justify-center text-3xl font-bold"
              >
                <IoDownload />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default History;