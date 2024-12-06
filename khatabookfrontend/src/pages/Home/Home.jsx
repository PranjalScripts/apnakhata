 
import React, { useEffect, useState } from "react";
import SummaryCard from "./SummaryCard";
import BarChart from "./BarChart";
import PieChart from "./PieChart";
import TransactionList from "./TransactionList";
import TransactionDetails from "./TransactionDetails";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const Home = () => {
  //eslint-disable-next-line
  const [data,setData] = useState([]);
  const [totalBalance, setTotalBalance] = useState(0);
  const [totalCredit, setTotalCredit] = useState(0);
  const [totalDebit, setTotalDebit] = useState(0);
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  // Fetch transaction data on component mount
  useEffect(() => {
    const fetchTransactionData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_URL}/api/v4/transaction/get-transactions/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const transactions = response.data; // Assuming response.data contains the transaction array

        // Calculate total balance, credit, and debit
        const totalBalance = transactions.reduce(
          (acc, transaction) => acc + transaction.amount,
          0
        );
        const totalCredit = transactions
          .filter((transaction) => transaction.transactionType === "credit")
          .reduce((acc, transaction) => acc + transaction.amount, 0);
        const totalDebit = transactions
          .filter((transaction) => transaction.transactionType === "debit")
          .reduce((acc, transaction) => acc + transaction.amount, 0);

        // Set the state with calculated values
        setTotalBalance(totalBalance);
        setTotalCredit(totalCredit);
        setTotalDebit(totalDebit);
        setData(transactions); // Store the transaction data if needed for other components
      } catch (error) {
        console.error("Error fetching transaction data:", error);
      }
    };

    fetchTransactionData();
  }, [userId]);

  const handleDashboardClick = () => { 
    navigate("/dashboard");
  }
  
  return (
    <>
      <div className="p-6 bg-gray-100 min-h-screen w-full">
        {/* Top Summary Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <SummaryCard
            title="Total Balance"
            value={`${totalBalance.toFixed(2)}`}
            color="bg-yellow-100"
          />
          <SummaryCard
            title="Credit"
            value={`${totalCredit.toFixed(2)}`}
            color="bg-blue-100"
          />
          <SummaryCard
            title="Debit"
            value={`${totalDebit.toFixed(2)}`}
            color="bg-red-100"
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <div className="bg-white p-4 rounded-xl shadow-lg">
            <h3 className="text-lg font-semibold mb-4">Weekly Activity</h3>
            <BarChart />
          </div>
          <div className="bg-white p-4 rounded-xl shadow-lg">
            <h3 className="text-lg font-semibold mb-4">
              Books/Clients Statistics
            </h3>
            <PieChart />
          </div>
        </div>

        {/* Transaction Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <TransactionList />
          <TransactionDetails />
        </div>
      </div>
      <div className="flex justify-center p-3">
        <button
          className="border border-black rounded-2xl p-5 hover:text-white hover:bg-blue-900"
          onClick={handleDashboardClick}
        >
          Go to DashBoard
        </button>
      </div>
    </>
  );
};

export default Home;
