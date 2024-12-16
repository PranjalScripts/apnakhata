import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const YouAdded = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // To handle navigation

  useEffect(() => {
    const fetchTransactions = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch(
          `${process.env.REACT_APP_URL}/api/collab-transactions/transactions`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = await response.json();
        setTransactions(data.transactions);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg font-bold text-gray-700">Loading...</div>
      </div>
    );
  }
const handleTransaction = () => {
  // Handle the transaction logic here
  navigate('/addTransaction');
};

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Transaction Details
      </h1>
      {(transactions?.length || 0) === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-screen">
          <div className="text-lg font-bold text-gray-700 mb-4">
            No transactions found.
          </div>
          <button
            onClick={handleTransaction}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
          >
            Add Transaction
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse border border-gray-300 bg-white shadow-md rounded-lg">
            <thead>
              <tr className="bg-gray-100 text-left text-gray-700">
                <th className="border border-gray-300 px-4 py-2">Book Name</th>

                <th className="border border-gray-300 px-4 py-2">
                  Transaction Type
                </th>
                <th className="border border-gray-300 px-4 py-2">
                  Outstanding Balance
                </th>
                <th className="border border-gray-300 px-4 py-2">
                  Client Name
                </th>
                <th className="border border-gray-300 px-4 py-2">Mobile</th>
                <th className="border border-gray-300 px-4 py-2">Email</th>
                <th className="border border-gray-300 px-4 py-2">Details</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr key={transaction._id} className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2">
                    {transaction.bookId.bookname}
                  </td>

                  <td className="border border-gray-300 px-4 py-2 capitalize">
                    {transaction.transactionType}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {transaction.outstandingBalance}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {transaction.clientUserId.name}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {transaction.clientUserId.mobile}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {transaction.clientUserId.email}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    <button
                      onClick={() => navigate(`/history/${transaction._id}`)}
                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                      Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* <button
            onClick={handleTransaction}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
          >
            Add Transaction
          </button> */}
        </div>
      )}{" "}
    </div>
  );
};

export default YouAdded;
