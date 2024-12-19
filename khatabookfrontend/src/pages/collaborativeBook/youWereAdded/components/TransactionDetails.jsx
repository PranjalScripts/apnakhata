import React from 'react';

const TransactionDetails = ({ transaction, userId }) => {
  return (
    <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
      <table className="min-w-full table-auto">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="px-4 py-2 text-left text-gray-700">Field</th>
            <th className="px-4 py-2 text-left text-gray-700">Value</th>
          </tr>
        </thead>
        <tbody>
           
            
          <tr className="border-t border-gray-200">
            <td className="px-4 py-2 font-medium text-gray-700">Book Name</td>
            <td className="px-4 py-2">{transaction.bookId.bookname}</td>
          </tr>
          <tr>
            <td className="px-4 py-2 font-medium text-gray-700">User Name</td>
            <td className="px-4 py-2">{transaction.userId.name}</td>
            <td className="px-4 py-2 font-medium text-gray-700">
              Other User
            </td>
            <td className="px-4 py-2">{transaction.clientUserId.name}</td>
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
  );
};

export default TransactionDetails;
