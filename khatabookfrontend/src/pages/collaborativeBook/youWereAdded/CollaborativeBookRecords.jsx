import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { saveAs } from "file-saver";
import TransactionForm from "./components/TransactionForm";
import TransactionDetails from "./components/TransactionDetails";
import TransactionHistory from "./components/TransactionHistory";
import EditForm from "./components/EditForm";
import ImageModal from "./components/ImageModal";
import SuccessModal from "./components/SuccessModal";

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
    file: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const userId = localStorage.getItem("userId");
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    id: "",
    amount: "",
    description: "",
    file: null,
    transactionType: "",
  });
  const [updateTrigger, setUpdateTrigger] = useState(0);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

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
      console.error("Error fetching transaction details:", error);
    }
  };

  useEffect(() => {
    fetchTransaction();
  }, [transactionId, updateTrigger]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "amount" ? parseFloat(value) || 0 : value,
    }));
  };

  const handleAddTransaction = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

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
    const formDataToSend = new FormData();
    formDataToSend.append("transactionType", formData.transactionType);
    formDataToSend.append("amount", formData.amount);
    formDataToSend.append("description", formData.description);
    if (formData.file) {
      formDataToSend.append("file", formData.file);
    }

    try {
      const response = await fetch(
        `${process.env.REACT_APP_URL}/api/collab-transactions/transactions/${transactionId}/add`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formDataToSend,
        }
      );

      const data = await response.json();

      if (response.ok) {
        setTransaction((prev) => ({
          ...prev,
          transactionHistory: [...prev.transactionHistory, data.transaction],
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
      setUpdatingEntryId(null);
    }
  };

  const handleDelete = async (entryId) => {
    const token = localStorage.getItem("token");
    if (window.confirm("Are you sure you want to delete this transaction?")) {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_URL}/api/collab-transactions/transactions/${transactionId}/entries/${entryId}`,
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
      description: entry.description,
    });
    setIsEditing(true);
  };

  const closeEditForm = () => {
    setIsEditing(false);
    setEditData({ id: "", amount: "", transactionType: "" });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    const { id, amount, transactionType, description, file } = editData;
    const token = localStorage.getItem("token");

    // Prepare the form data
    const formData = new FormData();
    formData.append("amount", parseFloat(amount));
    formData.append("transactionType", transactionType.toLowerCase());
    if (description) formData.append("description", description);
    if (file) formData.append("file", file);

    try {
      // Make the API call
      const response = await fetch(
        `${process.env.REACT_APP_URL}/api/collab-transactions/transactions/${transactionId}/entries/${id}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      // Parse the response
      const updatedEntry = await response.json();

      // Check for success
      if (response.ok) {
        // Update the state with the updated transaction entry
        setTransaction((prev) => {
          const updatedHistory = prev.transactionHistory.map((history) =>
            history._id === id ? { ...editData, _id: id } : history
          );

          // Recalculate totals
          const { totalCredit, totalDebit } = updatedHistory.reduce(
            (acc, entry) => {
              if (entry.transactionType === "credit") {
                acc.totalCredit += parseFloat(entry.amount);
              } else {
                acc.totalDebit += parseFloat(entry.amount);
              }
              return acc;
            },
            { totalCredit: 0, totalDebit: 0 }
          );

          return {
            ...prev,
            transactionHistory: updatedHistory,
            totalCredit,
            totalDebit,
            balance: totalCredit - totalDebit,
          };
        });

        // Trigger updates and UI feedback
        setUpdateTrigger((prev) => prev + 1);
        closeEditForm();
        setShowSuccessModal(true);
      } else {
        console.error("Unexpected failure:", {
          responseOk: response.ok,
          updatedEntry,
        });
        alert("Failed to update the transaction. Please try again.");
      }
    } catch (error) {
      // Handle network or other errors
      console.error("Error updating transaction:", error);
      alert("An error occurred while updating the transaction.");
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalImage(null);
  };

  const handleImageClick = (imagePath) => {
    setModalImage(
      `${process.env.REACT_APP_URL}/${imagePath.replace(/\\/g, "/")}`
    );
    setIsModalOpen(true);
  };

  const handleDownload = async () => {
    try {
      const urlParts = modalImage.split("/");
      const fileName = urlParts[urlParts.length - 1];
      const response = await fetch(modalImage);
      if (!response.ok) {
        throw new Error("Failed to fetch the file");
      }
      const blob = await response.blob();
      saveAs(blob, fileName);
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  if (!transaction) {
    return (
      <div className="text-center py-10">Loading transaction details...</div>
    );
  }

  return (
    <div className="h-screen bg-gray-50 overflow-hidden flex flex-col">
      <div className="px-4 sm:px-6 lg:px-8 py-4 flex-none">
        {/* Header Section */}
        <div className="mb-4">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Transaction Details
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Manage and track your transactions with {transaction?.collaborator?.name}
          </p>
        </div>

        {/* Transaction Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-1 mb-4">
          {/* Book Name Card */}
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow p-4 text-white transform transition-all duration-300 hover:scale-102">
            <h3 className="text-sm font-medium opacity-80 mb-1">Book Name</h3>
            <p className="text-base font-semibold">{transaction.bookId?.bookname}</p>
          </div>

          {/* Outstanding Balance Card */}
          <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg shadow p-4 text-white transform transition-all duration-300 hover:scale-102">
            <h3 className="text-sm font-medium opacity-80 mb-1">Outstanding Balance</h3>
            <p className="text-xl font-bold">
              ₹{Math.abs(transaction.outstandingBalance || 0).toLocaleString('en-IN')}
            </p>
            <p className="text-xs opacity-80 mt-1">
              {userId === transaction.initiaterId
                ? transaction.outstandingBalance > 0
                  ? "You will receive"
                  : "You will pay"
                : transaction.outstandingBalance > 0
                ? "You will pay"
                : "You will receive"}
            </p>
          </div>

          {/* User Details Card */}
          <div className="bg-gradient-to-br from-pink-500 to-pink-600 rounded-lg shadow p-4 text-white transform transition-all duration-300 hover:scale-102">
            <h3 className="text-sm font-medium opacity-80 mb-1">User Details</h3>
            <div className="space-y-1">
              <div>
                <p className="text-xs opacity-80">Your Name</p>
                <p className="text-base font-semibold">{transaction.userId?.name}</p>
              </div>
              <div>
                <p className="text-xs opacity-80">Other User</p>
                <p className="text-base font-semibold">{transaction.clientUserId?.name}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2 mb-4">
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center px-3 py-1.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm font-medium rounded-md 
            hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 
            transition-all duration-200 shadow hover:shadow-md"
          >
            Add Transaction
          </button>
        </div>
      </div>

      {/* Transaction History Section - Scrollable */}
      <div className="flex-1 overflow-hidden px-4 sm:px-6 lg:px-8">
        <div className="h-full overflow-auto">
          <div className="bg-white rounded-lg shadow-sm border border-gray-100">
            <TransactionHistory
              transaction={transaction}
              userId={userId}
              handleImageClick={handleImageClick}
              updateTransactionStatus={updateTransactionStatus}
              updatingEntryId={updatingEntryId}
              openEditForm={openEditForm}
              handleDelete={handleDelete}
            />
          </div>
        </div>
      </div>

      {/* Forms and Modals */}
      {showForm && (
        <TransactionForm
          formData={formData}
          isSubmitting={isSubmitting}
          handleInputChange={handleInputChange}
          handleAddTransaction={handleAddTransaction}
          setShowForm={setShowForm}
        />
      )}

      {isEditing && (
        <EditForm
          editData={editData}
          setEditData={setEditData}
          handleEditSubmit={handleEditSubmit}
          closeEditForm={closeEditForm}
        />
      )}

      {isModalOpen && (
        <ImageModal
          modalImage={modalImage}
          closeModal={closeModal}
          handleDownload={handleDownload}
        />
      )}

      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        message="Transaction updated successfully!"
      />
    </div>
  );
};

export default CollaborativeBookRecords;