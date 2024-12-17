import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, LazyMotion, domAnimation } from "framer-motion";
import Modal from "./Modal";
import { fetchClients, fetchBooks, createTransaction } from "./api";

const AddTransactions = () => {
  const [clientUserId, setClientUserId] = useState("");
  const [bookId, setBookId] = useState("");
  const [transactionType, setTransactionType] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null); // State to store the file
  const navigate = useNavigate();

  const [clients, setClients] = useState([]);
  const [books, setBooks] = useState([]);
  const [isLoadingClients, setIsLoadingClients] = useState(true);
  const [isLoadingBooks, setIsLoadingBooks] = useState(true);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showFailureModal, setShowFailureModal] = useState(false);

  useEffect(() => {
    const loadClients = async () => {
      try {
        const clientsData = await fetchClients();
        setClients(clientsData);
      } catch (error) {
        console.error("Error fetching clients:", error);
      } finally {
        setIsLoadingClients(false);
      }
    };

    const loadBooks = async () => {
      try {
        const booksData = await fetchBooks();
        setBooks(booksData);
      } catch (error) {
        console.error("Error fetching books:", error);
      } finally {
        setIsLoadingBooks(false);
      }
    };

    loadClients();
    loadBooks();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount)) {
      setShowFailureModal(true);
      return;
    }

    const transactionData = {
      clientUserId,
      bookId,
      transactionType,
      amount: parsedAmount,
      description,
    };

    try {
      await createTransaction(transactionData, file); // Pass the file to the API
      setShowSuccessModal(true);
    } catch (error) {
      console.error("Error creating transaction:", error);
      setShowFailureModal(true);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]; // Get the selected file
    if (selectedFile) {
      setFile(selectedFile); // Store it in the state
    }
  };

  const Goback = () => {
    navigate(-1);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-4">Add Transaction</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="clientUserId" className="block text-sm font-medium text-gray-700">
            Client
          </label>
          <select
            id="clientUserId"
            value={clientUserId}
            onChange={(e) => setClientUserId(e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            required
          >
            <option value="">Select Client</option>
            {isLoadingClients ? (
              <option>Loading clients...</option>
            ) : clients.length === 0 ? (
              <option>No clients available</option>
            ) : (
              clients.map((client) => (
                <option key={client._id} value={client._id}>
                  {client.name}
                </option>
              ))
            )}
          </select>
        </div>

        <div className="mb-4">
          <label htmlFor="bookId" className="block text-sm font-medium text-gray-700">
            Book
          </label>
          <select
            id="bookId"
            value={bookId}
            onChange={(e) => setBookId(e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            required
          >
            <option value="">Select Book</option>
            {isLoadingBooks ? (
              <option>Loading books...</option>
            ) : books.length === 0 ? (
              <option>No books available</option>
            ) : (
              books.map((book) => (
                <option key={book._id} value={book._id}>
                  {book.bookname}
                </option>
              ))
            )}
          </select>
        </div>

        <div className="mb-4">
          <label htmlFor="transactionType" className="block text-sm font-medium text-gray-700">
            Transaction Type
          </label>
          <select
            id="transactionType"
            value={transactionType}
            onChange={(e) => setTransactionType(e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            required
          >
            <option value="">Select Transaction Type</option>
            <option value="you will get">You will get</option>
            <option value="you will give">You will give</option>
          </select>
        </div>

        <div className="mb-4">
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
            Amount
          </label>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="file" className="block text-sm font-medium text-gray-700">
            Upload File
          </label>
          <input
            type="file"
            id="file"
            onChange={handleFileChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
          Create Transaction
        </button>
        <button
          type="button"
          className="ml-4 bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
          onClick={Goback}
        >
          Go Back
        </button>
      </form>

      {showSuccessModal && (
        <Modal
          type="success"
          message="Transaction created successfully."
          onClose={() => setShowSuccessModal(false)}
        />
      )}

      {showFailureModal && (
        <Modal
          type="failure"
          message="Failed to create transaction. Please try again."
          onClose={() => setShowFailureModal(false)}
        />
      )}
    </div>
  );
};

export default AddTransactions;
