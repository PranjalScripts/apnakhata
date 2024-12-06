import React from "react";
import { AiOutlineArrowLeft, AiOutlineArrowRight } from "react-icons/ai";

const TransactionRow = ({ transaction, onNavigate }) => (
  <tr className="hover:bg-gray-50">
    <td className="border border-gray-300 px-4 py-5 flex items-center space-x-2">
      {transaction.source === "client"
        ? transaction.userId?.name || "N/A"
        : transaction.clientUserId?.name || "N/A"}

      {transaction.source === "client" ? (
        <AiOutlineArrowLeft
          className="text-blue-500"
          title="Client Transaction"
        />
      ) : (
        <AiOutlineArrowRight className="text-orange-500" title="Transaction" />
      )}
    </td>

    <td className="border border-gray-300 px-4 py-2 capitalize">
      {transaction.confirmedYouWillGet || 0}
    </td>

    <td className="border border-gray-300 px-4 py-2 capitalize">
      {transaction.confirmedYouWillGive || 0}
    </td>

    <td className="border border-gray-300 px-4 py-2">
      {transaction.outstandingBalance || "N/A"}
    </td>
    <td className="border border-gray-300 px-4 py-2">
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded"
        onClick={() => onNavigate(transaction.id)}
      >
        View Details
      </button>
    </td>
  </tr>
);

export default TransactionRow;
