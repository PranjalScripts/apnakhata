import React from 'react';
import { MdEdit, MdDelete } from "react-icons/md";

const TransactionTable = ({
  transaction, 
  userId, 
  updating, 
  updateTransactionStatus, 
  openEditForm, 
  handleDeleteClick, 
  handleImageClick 
}) => {
  if (!transaction?.transactionHistory) {
    return null;
  }

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleString('en-IN');
    } catch (error) {
      return 'N/A';
    }
  };

  const formatAmount = (amount) => {
    try {
      return Number(amount).toLocaleString('en-IN');
    } catch (error) {
      return '0';
    }
  };

  // Utility function to determine row color based on transaction type and status
  const getRowClass = (transactionType, status) => {
    if (transactionType === 'you will get' && status === 'confirmed') {
      return 'bg-green-100';
    } else if (transactionType === 'you will give' && status === 'confirmed') {
      return 'bg-red-100';
    } else if (status === 'pending') {
      return 'bg-gray-100 opacity-70'; // faded color for pending transactions
    }
    return ''; // default row color
  };

  return (
    <div className="overflow-x-auto">
      <h2 className="text-xl font-semibold text-gray-700 mb-4">Transaction History</h2>
      <table className="min-w-full border-collapse border border-gray-300 bg-white shadow-lg rounded-lg">
        <thead>
          <tr className="bg-white text-left text-gray-700">
          <th className="border border-gray-300 px-4 py-2">Date</th>
            <th className="border border-gray-300 px-4 py-2">Initiated By</th>
            <th className="border border-gray-300 px-4 py-2">Transaction Type</th>
            <th className="border border-gray-300 px-4 py-2">Amount</th>
            <th className="border border-gray-300 px-4 py-2">Description</th>
            
            <th className="border border-gray-300 px-4 py-2">Status</th>
            <th className="border border-gray-300 px-4 py-2">Files</th>
            <th className="border border-gray-300 px-4 py-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {transaction.transactionHistory && transaction.transactionHistory.length > 0 ? (
            transaction.transactionHistory.map((history) => (
              <tr
                key={history._id}
                className={`hover:bg-gray-50 ${getRowClass(history?.transactionType, history?.confirmationStatus)}`}
              >
                 <td className="border border-gray-300 px-4 py-2">
  {new Date(history.transactionDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  })}
  <br />
  {new Date(history.transactionDate).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  })}
</td>

                <td className="border border-gray-300 px-4 py-2">
                  {history?.initiatedBy || 'N/A'}
                </td>
                <td className={`border border-gray-300 px-4 py-2 capitalize ${history?.transactionType === 'you will give' ? 'text-red-600' : 'text-green-600'}`}>
                  
                  {history?.transactionType  || 'N/A'}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  ₹{formatAmount(history?.amount)}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {history?.description || 'No description'}
                </td>
             
                <td className="border border-gray-300 px-4 py-2">
                  {history?.confirmationStatus === "confirmed" ? (
                    <span className="text-green-600 font-semibold bg-white px-4 py-2">Confirmed</span>
                  ) : userId === history?.initiaterId ? (
                    <span className="text-yellow-400  font-semibold bg-white px-4 py-2">Pending!</span>
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
                <td className="border border-gray-300 px-4 py-2 w-32">
                  {typeof history?.file === "string" && history.file.trim() !== "" ? (
                    <img
                      src={`${process.env.REACT_APP_URL}/${history.file.replace(/\\/g, "/")}`}
                      alt="Transaction File"
                      className="max-w-full max-h-32 object-contain cursor-pointer"
                      onClick={() => handleImageClick(history.file)}
                    />
                  ) : (
                    <span>No file provided</span>
                  )}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {userId === history?.initiaterId ? (
                    <div className="flex gap-2">
                      <button
                        onClick={() => openEditForm(history)}
                        className="text-yellow-500 hover:text-yellow-600"
                        title="Edit"
                      >
                        <MdEdit className="text-xl" />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(history)}
                        className="text-red-500 hover:text-red-600"
                        title="Delete"
                      >
                        <MdDelete className="text-xl" />
                      </button>
                    </div>
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
              <td colSpan="8" className="text-center py-4 text-gray-600">
                No transaction history available.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionTable;
