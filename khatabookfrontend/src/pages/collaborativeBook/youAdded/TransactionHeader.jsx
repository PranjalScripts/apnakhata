import React from 'react';

const TransactionHeader = ({ transaction }) => {
  return (
    <div className="mb-8 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Transaction Details</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        <div className="bg-blue-50 p-4 rounded-lg shadow-sm">
          <p className="text-lg font-medium text-blue-600"><strong>Book Name:</strong></p>
          <p className="text-gray-700">{transaction.bookId.bookname}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg shadow-sm">
          <p className="text-lg font-medium text-green-600"><strong>User Name:</strong></p>
          <p className="text-gray-700">{transaction.userId.name}</p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg shadow-sm">
          <p className="text-lg font-medium text-yellow-600"><strong>Client Name:</strong></p>
          <p className="text-gray-700">{transaction.clientUserId.name}</p>
        </div>
        <div className="bg-red-50 p-4 rounded-lg shadow-sm">
          <p className="text-lg font-medium text-red-600"><strong>Outstanding Balance:</strong></p>
          <p className="text-gray-700">{transaction.outstandingBalance}</p>
        </div>
      </div>
    </div>
  );
};

export default TransactionHeader;
