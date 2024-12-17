import React from 'react';
import { MdEdit, MdDelete } from "react-icons/md";

const TransactionHistory = React.memo(({
  transaction,
  userId,
  handleImageClick,
  updateTransactionStatus,
  updatingEntryId,
  openEditForm,
  handleDelete
}) => {
  return (
    <div className="">
      <table className="min-w-full bg-white shadow-lg rounded-lg p-6 table-auto">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="px-2 py-1 text-left text-gray-700">
              Transaction Date
            </th>
            <th className="px-2 py-1 text-left text-gray-700">
              Initiated By
            </th>
            <th className="px-2 py-1 text-left text-gray-700">
              Transaction Type
            </th>
            <th className="px-2 py-1 text-left text-gray-700">Amount</th>
            <th className="px-2 py-1 text-left text-gray-700">Description</th>
            <th className="px-2 py-1 text-left text-gray-700">Files</th>
            <th className="px-2 py-1 text-left text-gray-700">Status</th>
            <th className="px-2 py-1 text-left text-gray-700">Action</th>
          </tr>
        </thead>
        <tbody>
          {transaction?.transactionHistory?.length > 0 ? (
            transaction.transactionHistory.map((history) => (
              <tr key={history._id + history.amount} className="border-b border-gray-100">
                <td className="border border-gray-300 px-4 py-2">
                  {new Date(history.transactionDate).toLocaleString()}
                </td>
                <td className="px-4 py-2">{history.initiatedBy}</td>
                <td className="px-4 py-2">
                  {history.transactionType === "you will give"
                    ? "You will get"
                    : "You will give"}{" "}
                </td>
                <td className="px-4 py-2">{history.amount.toFixed(2)}</td>
                <td className="px-4 py-2">{history.description}</td>
                <td className="border border-gray-300 px-4 py-2">
  {typeof history.file === "string" && history.file.trim() !== "" ? (
    // Check if the file is an image
    history.file.match(/\.(jpeg|jpg|gif|png)$/i) ? (
      <img
        src={`${process.env.REACT_APP_URL}/${history.file.replace(/\\/g, "/")}`}
        alt="Transaction File"
        className="max-w-xs max-h-32 object-contain cursor-pointer"
        onClick={() => handleImageClick(history.file)}
      />
    ) : // Check if the file is a PDF
    history.file.match(/\.pdf$/i) ? (
      <a
        href={`${process.env.REACT_APP_URL}/${history.file.replace(/\\/g, "/")}`}
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
                      <button
                        onClick={() => openEditForm(history)}
                        className="text-yellow-500 hover:text-yellow-600"
                        title="Edit"
                      >
                        <i className="text-xl">
                          <MdEdit />
                        </i>
                      </button>
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
              <td colSpan="8" className="text-center text-gray-600 py-4">
                No transaction history available.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}, (prevProps, nextProps) => {
  // Custom comparison function
  return JSON.stringify(prevProps.transaction) === JSON.stringify(nextProps.transaction);
});

TransactionHistory.displayName = 'TransactionHistory';

export default TransactionHistory;