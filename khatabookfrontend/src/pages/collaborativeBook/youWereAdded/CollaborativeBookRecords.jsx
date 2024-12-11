import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { MdEdit, MdDelete } from "react-icons/md";
import { IoDownload } from "react-icons/io5";
import { saveAs } from "file-saver";

const CollaborativeBookRecords = () => {
  const { transactionId } = useParams(); 
  const [transaction, setTransaction] = useState(null);
  const [updatingEntryId, setUpdatingEntryId] = useState(null);
 const [isModalOpen, setIsModalOpen] = useState(false);
 const [modalImage, setModalImage] = useState(null);

 
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    transactionType: "",
    amount: 0,
    description: "",
    file:"",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const userId = localStorage.getItem("userId");
  const [isEditing, setIsEditing] = useState(false);

  const [editData, setEditData] = useState({
    id: null,
    amount: "",
    transactionType: "",
  });
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

    // Create a new FormData object
    const formDataToSend = new FormData();
    formDataToSend.append("transactionType", formData.transactionType);
    formDataToSend.append("amount", formData.amount);
    formDataToSend.append("description", formData.description);
    if (formData.file) {
      formDataToSend.append("file", formData.file); // Append the file if it exists
    }

    try {
      const response = await fetch(
        `http://localhost:5100/api/collab-transactions/transactions/${transactionId}/add`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formDataToSend, // Send FormData instead of JSON
        }
      );

      const data = await response.json();

      if (response.ok) {
        setTransaction((prev) => ({
          ...prev,
          transactionHistory: [...prev.transactionHistory, data.transaction], // Adjust based on the response
        }));
        setShowForm(false);
        setFormData({
          transactionType: "",
          amount: 0,
          description: "",
          file: "",
        });
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
const closeModal = () => {
  setIsModalOpen(false);
  setModalImage(null);
};
  const handleImageClick = (imagePath) => {
    setModalImage(`http://localhost:5100/${imagePath.replace(/\\/g, "/")}`);
    setIsModalOpen(true);
  };
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
   const { id, amount, transactionType, description, file } = editData;

   const token = localStorage.getItem("token");

   // Prepare form data for file upload and other fields
   const formData = new FormData();
   formData.append("amount", parseFloat(amount));
   formData.append("transactionType", transactionType.toLowerCase());
   if (description) formData.append("description", description);
   if (file) formData.append("file", file);

   try {
     const response = await fetch(
       `http://localhost:5100/api/collab-transactions/transactions/${transactionId}/entries/${id}`,
       {
         method: "PATCH",
         headers: {
           Authorization: `Bearer ${token}`,
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
     } else {
       alert("Failed to update the transaction. Please try again.");
     }
   } catch (error) {
     console.error("Error updating transaction:", error);
     alert("An error occurred while updating the transaction.");
   }
 };

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
                      ? transaction.outstandingBalance > 0
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
          You Will Give
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
          You Will Get
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
            <input
              type="file"
              onChange={(e) =>
                setFormData({ ...formData, file: e.target.files[0] })
              }
            />
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

      <h2 className="text-2xl bg-white shadow-lg rounded-lg p-6font-semibold text-gray-800 mb-4">
        Transaction History
      </h2>
      <div className="">
        <table className="min-w-full bg-white shadow-lg rounded-lg p-6table-auto">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="px-2 py-1 text-left text-gray-700">
                Initiated By
              </th>
              <th className="px-2 py-1 text-left text-gray-700">
                Transaction Type
              </th>
              <th className="px-2 py-1 text-left text-gray-700">Amount</th>
              <th className="px-2 py-1 text-left text-gray-700">Description</th>
              <th className="px-2 py-1 text-left text-gray-700">
                Transaction Date
              </th>
              <th className="px-2 py-1 text-left text-gray-700">files</th>
              <th className="px-2 py-1 text-left text-gray-700">Status</th>

              <th className="px-2 py-1 text-left text-gray-700">Action</th>
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
                      ? "You will get"
                      : "You will give"}{" "}
                  </td>

                  <td className="px-4 py-2">{history.amount.toFixed(2)}</td>
                  <td className="px-4 py-2">{history.description}</td>
                  <td className="border border-gray-300 px-4 py-2">
                    {new Date(history.transactionDate).toLocaleString()}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {typeof history.file === "string" &&
                    history.file.trim() !== "" ? (
                      <img
                        src={`http://localhost:5100/${history.file.replace(
                          /\\/g,
                          "/"
                        )}`}
                        alt="Transaction File"
                        className="max-w-xs max-h-32 object-contain cursor-pointer"
                        onClick={() => handleImageClick(history.file)}
                      />
                    ) : (
                      <span>No file provided</span> // Display this message when no file exists
                    )}
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
              type="number"
              value={editData.amount}
              onChange={(e) =>
                setEditData({ ...editData, amount: e.target.value })
              }
              className="border rounded px-4 py-2"
              placeholder="Amount"
              required
            />
            <input
              type="file"
              onChange={(e) =>
                setEditData({ ...editData, file: e.target.files[0] })
              }
              className="border rounded px-4 py-2"
            />
            <textarea
              value={editData.description}
              onChange={(e) =>
                setEditData({ ...editData, description: e.target.value })
              }
              className="border rounded px-4 py-2"
              placeholder="Description"
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
    </div>
  );
};

export default CollaborativeBookRecords;