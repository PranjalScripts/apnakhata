import React from "react";
import { MdEdit, MdDelete } from "react-icons/md";

const TransactionTable = ({ transactionHistory, userId, updateTransactionStatus, openEditForm, handleDelete, handleImageClick }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border-collapse border border-gray-300 bg-white shadow-md rounded-lg">
        <thead>
          <tr className="bg-gray-100 text-left text-gray-700">
            <th className="border border-gray-300 px-4 py-2">Initiated By</th>
            <th className="border border-gray-300 px-4 py-2">Transaction Type</th>
            <th className="border border-gray-300 px-4 py-2">Amount</th>
            <th className="border border-gray-300 px-4 py-2">Description</th>
            <th className="border border-gray-300 px-4 py-2">Date</th>
            <th className="border border-gray-300 px-4 py-2">Status</th>
            <th className="border border-gray-300 px-4 py-2">Files</th>
            <th className="border border-gray-300 px-4 py-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {transactionHistory?.length > 0 ? (
            transactionHistory.map((history) => (
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
                      className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600"
                    >
                      Confirm
                    </button>
                  )}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {typeof history.file === "string" && history.file.trim() !== "" ? (
                    <img
                      src={`$${process.env.REACT_APP_URL}/${history.file.replace(/\\/g, "/")}`}
                      alt="Transaction File"
                      className="max-w-xs max-h-32 object-contain cursor-pointer"
                      onClick={() => handleImageClick(history.file)}
                    />
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
                        onClick={() => handleDelete(history._id)}
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
