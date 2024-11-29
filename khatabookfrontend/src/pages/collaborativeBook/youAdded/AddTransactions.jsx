import React, { useState, useEffect } from "react";

const AddTransactions = () => {
  // State variables for form data
  const [clientUserId, setClientUserId] = useState("");
  const [bookId, setBookId] = useState("");
  const [transactionType, setTransactionType] = useState("");
  const [amount, setAmount] = useState(""); // Amount will be treated as a number
  const [description, setDescription] = useState("");
 

  const [clients, setClients] = useState([]); // To store client data
  const [books, setBooks] = useState([]); // To store book data

  const [isLoadingClients, setIsLoadingClients] = useState(true); // Loading state for clients
  const [isLoadingBooks, setIsLoadingBooks] = useState(true); // Loading state for books

  // Fetch clients and books on component mount
  useEffect(() => {
    const fetchClients = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch(
          `${process.env.REACT_APP_URL}/api/v3/client/getAll-clients`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = await response.json();
        console.log(data); // Log the entire response to check the structure
        if (data.success && Array.isArray(data.data)) {
          setClients(data.data); // Access the 'data' array in the response
        } else {
          console.error("Unexpected response structure:", data);
          alert("No clients found.");
        }
      } catch (error) {
        console.error("Error fetching clients:", error);
        alert("Error fetching clients.");
      } finally {
        setIsLoadingClients(false);
      }
    };

    const fetchBooks = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch(
          `${process.env.REACT_APP_URL}/api/v2/transactionBooks/getAll-books`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = await response.json();
        console.log(data); // Log the data to inspect its structure

        if (Array.isArray(data.books)) {
          setBooks(data.books); // Set books only if the data is an array
        } else {
          console.error("Expected an array of books but got:", data);
        }
      } catch (error) {
        console.error("Error fetching books:", error);
      } finally {
        setIsLoadingBooks(false);
      }
    };

    fetchClients();
    fetchBooks();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Ensure amount is a valid number
    const parsedAmount = parseFloat(amount); // Convert amount to a number

    if (isNaN(parsedAmount)) {
      alert("Please enter a valid amount");
      return;
    }

    // Prepare the request body
    const transactionData = {
      clientUserId,
      bookId,
      transactionType,
      amount: parsedAmount, // Store amount as a number
      description,
       
    };

    // Send the POST request to create a transaction
    try {
      const token = localStorage.getItem("token"); // Assuming you're using JWT token for authentication
      const response = await fetch(
        "http://localhost:5100/api/collab-transactions/create-transactions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(transactionData),
        }
      );

      if (response.ok) {
        alert("Transaction created successfully");
        // Reset the form or handle the response
      } else {
        alert("Failed to create transaction");
      }
    } catch (error) {
      console.error("Error creating transaction:", error);
      alert("An error occurred");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-4">Add Transaction</h1>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="clientUserId"
            className="block text-sm font-medium text-gray-700"
          >
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
          <label
            htmlFor="bookId"
            className="block text-sm font-medium text-gray-700"
          >
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
          <label
            htmlFor="transactionType"
            className="block text-sm font-medium text-gray-700"
          >
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
          <label
            htmlFor="amount"
            className="block text-sm font-medium text-gray-700"
          >
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
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700"
          >
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
 
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
        >
          Create Transaction
        </button>
      </form>
    </div>
  );
};

export default AddTransactions;
