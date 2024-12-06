import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AiOutlineArrowLeft, AiOutlineArrowRight } from "react-icons/ai"; // Import arrows

const Dashboard = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAllTransactions = async () => {
      const token = localStorage.getItem("token");
      try {
        const [clientTransactionsRes, transactionsRes] = await Promise.all([
          fetch(
            "http://localhost:5100/api/collab-transactions/client-transactions",
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          ),
          fetch("http://localhost:5100/api/collab-transactions/transactions", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const clientTransactions = await clientTransactionsRes.json();
        const transactions = await transactionsRes.json();

        const clientTransactionsWithSource = (
          clientTransactions.transactions || []
        ).map((transaction) => {
          const confirmedYouWillGet = transaction.transactionHistory
            .filter(
              (t) =>
                t.transactionType === "you will get" &&
                t.confirmationStatus === "confirmed"
            )
            .reduce((acc, curr) => acc + curr.amount, 0);

          const confirmedYouWillGive = transaction.transactionHistory
            .filter(
              (t) =>
                t.transactionType === "you will give" &&
                t.confirmationStatus === "confirmed"
            )
            .reduce((acc, curr) => acc + curr.amount, 0);

          const unconfirmedYouWillGet = transaction.transactionHistory
            .filter(
              (t) =>
                t.transactionType === "you will get" &&
                t.confirmationStatus !== "confirmed"
            )
            .reduce((acc, curr) => acc + curr.amount, 0);

          const unconfirmedYouWillGive = transaction.transactionHistory
            .filter(
              (t) =>
                t.transactionType === "you will give" &&
                t.confirmationStatus !== "confirmed"
            )
            .reduce((acc, curr) => acc + curr.amount, 0);

          return {
            ...transaction,
            confirmedYouWillGet,
            confirmedYouWillGive,
            unconfirmedYouWillGet,
            unconfirmedYouWillGive,
            source: "client",
            transactionId: transaction._id, // Get the transaction ID from clientTransactions
          };
        });

        const transactionsWithSource = (transactions.transactions || []).map(
          (transaction) => {
            const confirmedYouWillGet = transaction.transactionHistory
              .filter(
                (t) =>
                  t.transactionType === "you will get" &&
                  t.confirmationStatus === "confirmed"
              )
              .reduce((acc, curr) => acc + curr.amount, 0);

            const confirmedYouWillGive = transaction.transactionHistory
              .filter(
                (t) =>
                  t.transactionType === "you will give" &&
                  t.confirmationStatus === "confirmed"
              )
              .reduce((acc, curr) => acc + curr.amount, 0);

            const unconfirmedYouWillGet = transaction.transactionHistory
              .filter(
                (t) =>
                  t.transactionType === "you will get" &&
                  t.confirmationStatus !== "confirmed"
              )
              .reduce((acc, curr) => acc + curr.amount, 0);

            const unconfirmedYouWillGive = transaction.transactionHistory
              .filter(
                (t) =>
                  t.transactionType === "you will give" &&
                  t.confirmationStatus !== "confirmed"
              )
              .reduce((acc, curr) => acc + curr.amount, 0);

            return {
              ...transaction,
              confirmedYouWillGet,
              confirmedYouWillGive,
              unconfirmedYouWillGet,
              unconfirmedYouWillGive,
              source: "transaction",
              transactionId: transaction._id, // Get the transaction ID from transactions
            };
          }
        );

        setTransactions([
          ...clientTransactionsWithSource,
          ...transactionsWithSource,
        ]);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllTransactions();
  }, []);

  const viewTransactionDetails = (transactionId) => {
    navigate(`/transaction-details/${transactionId}`); // Pass transactionId to the URL
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg font-bold text-gray-700">Loading...</div>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Transactions</h1>
      {(transactions?.length || 0) === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-screen">
          <div className="text-lg font-bold text-gray-700 mb-4">
            No transactions found.
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse border border-gray-300 bg-white shadow-md rounded-lg">
            <thead>
              <tr className="bg-gray-100 text-left text-gray-700">
                <th className="border border-gray-300 px-4 py-2">Name</th>
                <th className="border border-gray-300 px-4 py-2">
                  You Will Get
                </th>
                <th className="border border-gray-300 px-4 py-2">
                  You Will Give
                </th>
                <th className="border border-gray-300 px-4 py-2">
                  Outstanding Balance
                </th>
                <th className="border border-gray-300 px-4 py-2">
                  See Details
                </th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction, index) => (
                <tr key={index} className="hover:bg-gray-50">
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
                      <AiOutlineArrowRight
                        className="text-orange-500"
                        title="Transaction"
                      />
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
                      onClick={() =>
                        viewTransactionDetails(transaction.transactionId)
                      }
                    >
                      Click here
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

   
    </div>
  );
};

export default Dashboard;

// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { fetchAllTransactions } from "./api";
// import Loading from "./Loading";
// import EmptyState from "./EmptyState";
// import TransactionTable from "./TransactionTable";

// const Dashboard = () => {
//   const [transactions, setTransactions] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const loadTransactions = async () => {
//       try {
//         const data = await fetchAllTransactions();
//         setTransactions(data);
//       } catch (error) {
//         console.error("Error fetching transactions:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadTransactions();
//   }, []);

//   if (loading) return <Loading />;
//   if (!transactions.length) return <EmptyState />;

//   return (
//     <div className="p-4 max-w-6xl mx-auto">
//       <h1 className="text-2xl font-bold text-gray-800 mb-6">Transactions</h1>
//       <TransactionTable transactions={transactions} viewTransactionDetails={viewTransactionDetails} />
//     </div>
//   );
// };

// export default Dashboard;
