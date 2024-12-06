import React from "react";
import TransactionRow from "./TransactionRow";

const TransactionTable = ({ transactions, viewTransactionDetails }) => (
  <div className="overflow-x-auto">
    <table className="min-w-full border-collapse border border-gray-300 bg-white shadow-md rounded-lg">
      <thead>
        <tr className="bg-gray-100 text-left text-gray-700">
          <th className="border border-gray-300 px-4 py-2">Name</th>
          <th
            colSpan={2}
            className="border border-gray-300 px-4 py-2 text-center"
          >
            Confirmed Transaction
          </th>
          <th className="border border-gray-300 px-4 py-2">
            Outstanding Balance
          </th>
          <th className="border border-gray-300 px-4 py-2">See details</th>
        </tr>
      </thead>
      <tbody>
        {transactions.map((transaction, index) => (
          <TransactionRow
            key={index}
            transaction={transaction}
            onNavigate={viewTransactionDetails}
          />
        ))}
      </tbody>
    </table>
  </div>
);

export default TransactionTable;
