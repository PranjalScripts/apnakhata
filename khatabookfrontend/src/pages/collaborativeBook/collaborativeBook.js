import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate instead of useHistory

const CollaborativeBook = () => {
  const [transactions, setTransactions] = useState([]); // Initialize as an empty array
  const navigate = useNavigate(); // Use useNavigate for navigation

  useEffect(() => {
    // Fetching the transaction data from the API
    const token = localStorage.getItem("token");
    fetch("http://localhost:5100/api/collab-transactions/client-transactions", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => response.json())
      .then((data) => {
        // Make sure `data.transactions` is an array
        if (Array.isArray(data.transactions)) {
          setTransactions(data.transactions);
        } else {
          setTransactions([]); // In case the API response isn't in the expected format
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setTransactions([]); // Set to empty array if there's an error
      });
  }, []);

  // Function to handle navigation to the transaction details page
  const viewTransactionDetails = (transactionId) => {
    // Use navigate to go to the details page with the transactionId
    navigate(`/transaction-details/${transactionId}`);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-4">
        Transaction Outstanding Balances
      </h1>

      {/* Conditionally render if there are no transactions */}
      {transactions.length === 0 ? (
        <p className="text-center text-xl font-semibold text-gray-500">
          No records found
        </p>
      ) : (
        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
          <thead>
            <tr>
              <th className="px-4 py-2 border-b text-left">Transaction ID</th>
              <th className="px-4 py-2 border-b text-left">Book Name</th>
              <th className="px-4 py-2 border-b text-left">User Name</th>
              <th className="px-4 py-2 border-b text-left">Client Name</th>
              <th className="px-4 py-2 border-b text-left">
                Outstanding Balance
              </th>
              {/* Add a new column for "View Details" button */}
              <th className="px-4 py-2 border-b text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => (
              <tr key={transaction._id} className="hover:bg-gray-100">
                <td className="px-4 py-2 border-b">{transaction._id}</td>
                <td className="px-4 py-2 border-b">
                  {transaction.bookId.bookname}
                </td>
                <td className="px-4 py-2 border-b">
                  {transaction.userId.name}
                </td>
                <td className="px-4 py-2 border-b">
                  {transaction.clientUserId.name}
                </td>
                <td className="px-4 py-2 border-b">
                  {transaction.outstandingBalance}
                </td>
                {/* Render the "View Details" button */}
                <td className="px-4 py-2 border-b">
                  <button
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                    onClick={() => viewTransactionDetails(transaction._id)}
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default CollaborativeBook;
