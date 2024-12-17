import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/auth/login/login";
import Signup from "./components/auth/login/signup";
import Home from "./pages/Home/Home";
import Book from "./pages/books/book";
import Users from "./pages/clientUsers/clientUsers";
import Profile from "./pages/profile/userprofile";
import Landing from "./components/LandingPage/Landing";
import Loans from "./pages/loans/loan";
import Invoice from "./pages/invoice/invoice";
import CollaborativeBook from "./pages/collaborativeBook/youWereAdded/collaborativeBook";
import Layout from "./pages/Layout/Layout";
import CollaborativeBookRecords from "./pages/collaborativeBook/youWereAdded/CollaborativeBookRecords";
import YouAdded from "./pages/collaborativeBook/youAdded/YouAdded";
import History from "./pages/collaborativeBook/youAdded/history";
import AddTransactions from "./pages/collaborativeBook/youAdded/AddTransactions";
import YourBooks from "./pages/selfRecord/yourBooks";
import SelfRecordByBookID from "./pages/selfRecord/selfrecordbyBookID";
import TransactionHistory from "./pages/selfRecord/history";
import PageNotFound from "./pages/pageNotFound/PageNotFound";
import DashBoard from "./pages/DashBoard/DashBoard";


function App() {
  return (
    <Router>
      <Routes>
     
        <Route path="/" element={<Landing />} />

        {/* Dashboard and other pages using Layout */}
        <Route path="/" element={<Layout />}>
          <Route path="home" element={<Home />} />
          <Route path="dashboard" element={<DashBoard />} />
          <Route path="your-books" element={<YourBooks />} />
          <Route path="/your-books/:bookId" element={<SelfRecordByBookID />} />
          <Route path="transaction-history/:transactionId" element={<TransactionHistory />}/>
          <Route path="users" element={<Users />} />
          <Route path="book" element={<Book />} />
          <Route path="profile" element={<Profile />} />
          <Route path="loans" element={<Loans />} />
          <Route path="invoice" element={<Invoice />} />
          <Route path="collaborativebook" element={<CollaborativeBook />} />
          <Route path="youadded" element={<YouAdded />} />
          <Route path="/history/:transactionId" element={<History />} />
          <Route path="/addtransaction" element={<AddTransactions />} />
          <Route
            path="/transaction-details/:transactionId"
            element={<CollaborativeBookRecords />}
          />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </Router>
  );
}
 
export default App;
