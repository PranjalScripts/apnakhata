import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { MdEdit, MdDelete } from "react-icons/md";
import { IoDownload } from 'react-icons/io5';   
import { saveAs } from "file-saver";
import ConfirmationModal from "./ConfirmationModal"; // Import the modal

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
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editData, setEditData] = useState({
    id: null,
    amount: "",
    transactionType: "",
  });
 // const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEntryId, setSelectedEntryId] = useState(null);

  const handleDeleteClick = (entryId) => {
    setSelectedEntryId(entryId);
    setIsDeleteModalOpen(true);
  };
  const [selectedTransactionType, setSelectedTransactionType] = useState(""); // To store the transaction type
  const [newTransaction, setNewTransaction] = useState({
    amount: "",
    description: "",
  });
  const userId = localStorage.getItem("userId");
  //fetch transaction
  useEffect(() => {
    const fetchTransaction = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch(
          `${process.env.REACT_APP_URL}/api/collab-transactions/single-transaction/${transactionId}`,
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
  //update transaction
  const updateTransactionStatus = async (entryId) => {
    setUpdating(true);
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        `${process.env.REACT_APP_URL}/api/collab-transactions/transactions/${transactionId}/entries/${entryId}/confirm`,
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
  //add transaction into transaction history
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

    // Create a FormData object for file upload
    const formData = new FormData();
    formData.append("clientUserId", transaction.clientUserId._id);
    formData.append("bookId", transaction.bookId._id);
    formData.append("transactionType", selectedTransactionType);
    formData.append("amount", parsedAmount);
    formData.append("description", newTransaction.description);
    formData.append("transactionId", transactionId);

    // Add the file if it exists
    if (newTransaction.file) {
      formData.append("file", newTransaction.file); // The 'file' key should match your backend file field
    }

    try {
      const response = await fetch(
        `${process.env.REACT_APP_URL}/api/collab-transactions/create-transactions`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData, // Use FormData instead of JSON.stringify
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
        setNewTransaction({ amount: "", description: "", file: null });
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

  //download file
  const handleDownload = async () => {
    try {
      // Extract the file name from the URL
      const urlParts = modalImage.split("/");
      const fileName = urlParts[urlParts.length - 1]; // Get the last part of the URL as the file name

      // Fetch the file
      const response = await fetch(modalImage);
      if (!response.ok) {
        throw new Error("Failed to fetch the file");
      }

      // Convert the response to a Blob
      const blob = await response.blob();

      // Save the file with its original name and format
      saveAs(blob, fileName);
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  //delete transaction
  const handleDelete = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        `${process.env.REACT_APP_URL}/api/collab-transactions/transactions/${transactionId}/entries/${selectedEntryId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.ok) {
        setTransaction((prev) => ({
          ...prev,
          transactionHistory: prev.transactionHistory.filter(
            (entry) => entry._id !== selectedEntryId
          ),
        }));
        // Optionally, show a success modal or notification here
      } else {
        console.error("Failed to delete transaction.");
        // Optionally, show a failure modal or notification here
      }
    } catch (error) {
      console.error("Error deleting transaction:", error);
    } finally {
      setIsDeleteModalOpen(false);
    }
  };

  //edit transaction
  const openEditForm = (entry) => {
    setEditData({
      id: entry._id,
      amount: entry.amount,
      transactionType: entry.transactionType,
      description: entry.description,
    });
    setIsEditing(true);
  };
  //close edit form
  const closeEditForm = () => {
    setIsEditing(false);
    setEditData({ id: null, amount: "", transactionType: "" });
  }; //edit transaction submit
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const { id, amount, transactionType, description, file } = editData;

    const token = localStorage.getItem("token");

    // Create FormData object for file upload and other data
    const formData = new FormData();
    formData.append("amount", parseFloat(amount));
    formData.append("transactionType", transactionType.toLowerCase());
    formData.append("description", description);

    // Add the file if it exists
    if (file) {
      formData.append("file", file); // The key 'file' must match the backend field
    }

    try {
      const response = await fetch(
        `${process.env.REACT_APP_URL}/api/collab-transactions/transactions/${transactionId}/entries/${id}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`, // Note: 'Content-Type' is automatically set for FormData
          },
          body: formData,
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
        window.location.reload();
      } else {
        alert("Failed to update the transaction. Please try again.");
      }
    } catch (error) {
      console.error("Error updating transaction:", error);
      alert("An error occurred while updating the transaction.");
    }
  };

  //handle image click
  const handleImageClick = (imagePath) => {
    setModalImage(
      `${process.env.REACT_APP_URL}/${imagePath.replace(/\\/g, "/")}`
    );
    setIsModalOpen(true);
  };
  //close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setModalImage(null);
  };
  //return jsx
  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Transaction Details
      </h1>
      <div className="mb-4">
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
            />

            <input
              type="file"
              onChange={(e) =>
                setNewTransaction((prev) => ({
                  ...prev,
                  file: e.target.files[0], // Store the file in state
                }))
              }
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
            {transaction.transactionHistory?.length > 0 ? (
              transaction.transactionHistory.map((history) => (
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
                   {typeof history.file === "string" &&
                   history.file.trim() !== "" ? (
                     // Check if the file is an image
                     history.file.match(/\.(jpeg|jpg|gif|png)$/i) ? (
                       <img
                         src={`${process.env.REACT_APP_URL}/${history.file.replace(
                           /\\/g,
                           "/"
                         )}`}
                         alt="Transaction File"
                         className="max-w-xs max-h-32 object-contain cursor-pointer"
                         onClick={() => handleImageClick(history.file)}
                       />
                     ) : // Check if the file is a PDF
                     history.file.match(/\.pdf$/i) ? (
                       <a
                         href={`${process.env.REACT_APP_URL}/${history.file.replace(
                           /\\/g,
                           "/"
                         )}`}
                         target="_blank"
                         rel="noopener noreferrer"
                         className="text-blue-500 hover:underline"
                       >
                         View PDF Attachment
                       </a>
                     ) : (
                       <span>Unsupported file type</span>
                     )
                   ) : (
                     <span>No file provided</span>
                   )}
                 </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {userId === history.initiaterId ? (
                      <>
                        <button
                          onClick={() => openEditForm(history)}
                          className="text-yellow-500 hover:text-yellow-600"
                          title="Edit"
                        >
                          <MdEdit className="text-xl" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(history._id)}
                          className="text-red-500 hover:text-red-600"
                          title="Delete"
                        >
                          <MdDelete className="text-xl" />
                        </button>
                      </>
                    ) : (
                      <span className="text-gray-500 italic">
                        You have not initiated this transaction
                      </span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center py-4 text-gray-600">
                  No transaction history available.
                </td>
              </tr>
            )}
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
          <input
            type="file"
            onChange={(e) =>
              setEditData((prev) => ({
                ...prev,
                file: e.target.files[0], // Store the file in state
              }))
            }
          />

          <input
            type="text"
            placeholder="Enter transaction description"
            value={editData.description}
            onChange={(e) =>
              setEditData((prev) => ({
                ...prev,
                description: e.target.value, // Update the description in state
              }))
            }
            className="border rounded px-4 py-2"
          />

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
              <button
                onClick={handleDownload}
                className="absolute bottom-0 -left-1 bg-white/10 backdrop-blur-lg	border rounded-full px-6 py-1 flex items-center justify-center text-3xl font-bold"
              >
                <IoDownload />
              </button>
            </div>
          </div>
        </div>
      )}
   <ConfirmationModal
  isOpen={isDeleteModalOpen}
  onClose={() => setIsDeleteModalOpen(false)}
  onConfirm={handleDelete}
/>
    </div>
    
  );
};

  
    
 

export default History;