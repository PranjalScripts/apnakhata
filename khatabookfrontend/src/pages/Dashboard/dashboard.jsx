// import React, { useState, useEffect, useRef } from "react";
// import { Bar } from "react-chartjs-2";
// import {
//   Chart as ChartJS,
//   BarElement,
//   CategoryScale,
//   LinearScale,
//   Tooltip,
//   Legend,
// } from "chart.js";
// import axios from "axios";
// import Sidebar from "../Layout/sidebar";
// import { toast } from "react-toastify";
// import Header from "./Header";
// import Transaction from "./TransactionPage";
// // Register Chart.js components
// ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

// // Cache object to store API responses
// const cache = {
//   books: { data: null, expiry: null },
//   clients: { data: null, expiry: null },
// };

// const Dashboard = () => {
//   const [bookData, setBookData] = useState({
//     labels: [],
//     datasets: [
//       {
//         label: "Books Created",
//         data: [],
//         backgroundColor: "rgba(75, 192, 192, 0.6)",
//         borderColor: "rgba(75, 192, 192, 1)",
//         borderWidth: 1,
//       },
//     ],
//   });

//   const [clientData, setClientData] = useState({
//     labels: [],
//     datasets: [
//       {
//         label: "Clients Created",
//         data: [],
//         backgroundColor: "rgb(106,170,125)",
//         borderColor: "rgb(49, 81, 30)",
//         borderWidth: 1,
//       },
//     ],
//   });

//   const API_BOOKS_URL =
//     `${process.env.REACT_APP_URL}/api/v2/transactionBooks/getAll-books`;
//   const API_CLIENTS_URL = `${process.env.REACT_APP_URL}/api/v3/client/getAll-clients`;
//   const isFetched = useRef(false); // Prevent multiple API calls on the same render

//   // Helper function to group data by date in ISO format
//   const groupByDate = (items, dateKey) => {
//     const grouped = {};
//     items.forEach((item) => {
//       const isoDate = new Date(item[dateKey]).toISOString().split("T")[0]; // Get ISO date (YYYY-MM-DD)
//       grouped[isoDate] = (grouped[isoDate] || 0) + 1;
//     });
//     return grouped;
//   };

//   // Fetch books with caching
//   const fetchBooks = async () => {
//     const now = Date.now();
//     if (cache.books.data && cache.books.expiry > now) {
//       return cache.books.data;
//     }

//     try {
//       const booksResponse = await axios.get(API_BOOKS_URL, {
//         headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
//       });

//       const books = booksResponse.data?.books || [];
//       const groupedBooks = groupByDate(books, "createdAt");

//       // Cache the result with 5-minute expiry
//       cache.books = {
//         data: groupedBooks,
//         expiry: now + 5 * 60 * 1000, // 5 minutes in milliseconds
//       };

//       return groupedBooks;
//     } catch (error) {
//       toast.error("Error fetching books");
//       console.error("Error fetching books:", error);
//       return {};
//     }
//   };

//   // Fetch clients with caching
//   const fetchClients = async () => {
//     const now = Date.now();
//     if (cache.clients.data && cache.clients.expiry > now) {
//       return cache.clients.data;
//     }

//     try {
//       const clientsResponse = await axios.get(API_CLIENTS_URL, {
//         headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
//       });

//       const clients = clientsResponse.data?.data || [];
//       const groupedClients = groupByDate(clients, "createdAt");

//       // Cache the result with 5-minute expiry
//       cache.clients = {
//         data: groupedClients,
//         expiry: now + 5 * 60 * 1000, // 5 minutes in milliseconds
//       };

//       return groupedClients;
//     } catch (error) {
//       toast.error("Error fetching clients");
//       console.error("Error fetching clients:", error);
//       return {};
//     }
//   };

//   // Fetch and update chart data
//   const fetchData = async () => {
//     if (isFetched.current) return;
//     isFetched.current = true;

//     try {
//       const booksByDate = await fetchBooks();
//       const clientsByDate = await fetchClients();

//       const sortedBookDates = Object.keys(booksByDate).sort();
//       const sortedClientDates = Object.keys(clientsByDate).sort();

//       setBookData((prevState) => ({
//         ...prevState,
//         labels: sortedBookDates,
//         datasets: [
//           {
//             ...prevState.datasets[0],
//             data: sortedBookDates.map((date) => booksByDate[date] || 0),
//           },
//         ],
//       }));

//       setClientData((prevState) => ({
//         ...prevState,
//         labels: sortedClientDates,
//         datasets: [
//           {
//             ...prevState.datasets[0],
//             data: sortedClientDates.map((date) => clientsByDate[date] || 0),
//           },
//         ],
//       }));
//     } catch (error) {
//       toast.error("Error fetching data");
//       console.error("Error fetching books or clients:", error);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//     // eslint-disable-next-line
//   }, []);

//   return (
//     <div className="d-flex" style={{ "padding-left": "0" }}>
//       <Sidebar /> 
//       <div className="container mt-4 ">
//         <div
//           className="charts-container"
//           style={{
//             display: "flex",
//             justifyContent: "space-between",
//             alignItems: "center",
//           }}
//         >
//           {/* Books Chart - Left Side */}
//           <div
//             className="chart-container"
//             style={{
//               width: "35%",
//               height: "300px",
//               display: "flex",
//               flexDirection: "column",
//               alignItems: "center",
//             }}
//           >
//             <h3>Books Created Over Time</h3>
//             <Bar
//               data={bookData}
//               options={{
//                 responsive: true,
//                 maintainAspectRatio: false,
//                 plugins: {
//                   legend: { position: "top" },
//                 },
//                 scales: {
//                   y: {
//                     beginAtZero: true,
//                     ticks: {
//                       stepSize: 1,
//                     },
//                   },
//                 },
//                 animation: {
//                   duration: 1000,
//                   easing: "easeInOutQuad",
//                 },
//               }}
//               width={400}
//               height={300}
//             />

//             <h3>Count Of Books & Clients</h3>

//             <Header />
//             <Transaction />
//           </div>

//           {/* Clients Chart - Right Side */}
//           <div
//             className="chart-container"
//             style={{
//               width: "35%",
//               height: "300px",
//               display: "flex",
//               flexDirection: "column",
//               alignItems: "center",
//             }}
//           >
//             <h3>Clients Created Over Time</h3>
//             <Bar
//               data={clientData}
//               options={{
//                 responsive: true,
//                 maintainAspectRatio: false,
//                 plugins: {
//                   legend: { position: "top" },
//                 },
//                 scales: {
//                   y: {
//                     beginAtZero: true,
//                     ticks: {
//                       stepSize: 1,
//                     },
//                   },
//                 },
//                 animation: {
//                   duration: 1000,
//                   easing: "easeInOutQuad",
//                 },
//               }}
//               width={400}
//               height={300}
//             />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;


import React, { useEffect, useState } from "react";
import SummaryCard from "./SummaryCard";
import BarChart from "./BarChart";
import PieChart from "./PieChart";
import TransactionList from "./TransactionList";
import TransactionDetails from "./TransactionDetails";
import axios from "axios";

const Dashboard = () => {
  const [data,setData] = useState([]);
  const [totalBalance, setTotalBalance] = useState(0);
  const [totalCredit, setTotalCredit] = useState(0);
  const [totalDebit, setTotalDebit] = useState(0);
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
            <h3 className="text-lg font-semibold mb-4">Books/Clients Statistics</h3>
            <PieChart />
          </div>
        </div>

        {/* Transaction Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <TransactionList />
          <TransactionDetails />
        </div>
      </div>
    </>
  );
};

export default Dashboard;
