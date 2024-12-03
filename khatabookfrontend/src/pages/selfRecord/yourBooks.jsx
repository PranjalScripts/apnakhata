import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";

const YourBooks = () => {
  const [books, setBooks] = useState([]); // State to store books
  const [loading, setLoading] = useState(true); // State to handle loading
  const [error, setError] = useState(null); // State to handle errors
  const [bookName, setBookName] = useState(""); // State to store book name
  const [editingBook, setEditingBook] = useState(null); // State to handle editing book
  const [isModalOpen, setIsModalOpen] = useState(false); // State to handle modal visibility

  const excludedColors = ["#FFFFFF", "#FF0000", "#0000FF"]; // White, Red, Blue

  const getRandomColor = () => {
    let color;
    do {
      color = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
    } while (
      excludedColors.some(
        (excludedColors) =>
          parseInt(excludedColors.slice(1), 16) === parseInt(color.slice(1), 16)
      )
    );
    return color;
  };

  useEffect(() => {
    const fetchBooks = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_URL}/api/v2/transactionBooks/getAll-books`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (Array.isArray(response.data.books)) {
          setBooks(response.data.books);
        }
      } catch (err) {
        setError("Failed to fetch books. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  const handleAddBook = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${process.env.REACT_APP_URL}/api/v2/transactionBooks/create-books`,
        { bookname: bookName },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setBooks((prevBooks) => [...prevBooks, response.data.book]);
      setBookName("");
      setIsModalOpen(false); // Close modal after adding the book
    } catch (err) {
      alert("Failed to create book. Please try again later.");
    }
  };

  const handleDeleteBook = async (bookId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `${process.env.REACT_APP_URL}/api/v2/transactionBooks/delete-book/${bookId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setBooks((prevBooks) => prevBooks.filter((book) => book._id !== bookId));
    } catch (err) {
      alert("Failed to delete book. Please try again later.");
    }
  };

  const handleSaveBook = async () => {
    try {
      if (editingBook) {
        const token = localStorage.getItem("token");
        const response = await axios.put(
          `${process.env.REACT_APP_URL}/api/v2/transactionBooks/update-book/${editingBook._id}`,
          { bookname: bookName },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setBooks((prevBooks) =>
          prevBooks.map((book) =>
            book._id === editingBook._id ? response.data.book : book
          )
        );
        setEditingBook(null);
        setBookName("");
        setIsModalOpen(false); // Close modal after saving the book
      }
    } catch (err) {
      alert("Failed to save book. Please try again later.");
    }
  };

  const openAddModal = () => {
    setEditingBook(null);
    setBookName("");
    setIsModalOpen(true);
  };

  const openEditModal = (book) => {
    setEditingBook(book);
    setBookName(book.bookname);
    setIsModalOpen(true);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Your Books</h1>
      <div className="grid grid-cols-3 gap-4">
        {books.map((book) => (
          <div
            key={book._id}
            className="relative flex flex-col items-center justify-center text-white shadow-md rounded-full p-6 hover:shadow-lg transform hover:scale-105 transition duration-200"
            style={{
              backgroundColor: getRandomColor(),
            }}
          >
            <h2 className="text-lg font-semibold text-center">
              {book.bookname}
            </h2>
            <p className="text-sm text-center">
              Created At: {new Date(book.createdAt).toLocaleDateString()}
            </p>

            {/* Edit and Delete Icons */}
            <div className="absolute top-2 right-2 flex space-x-2">
              <button
                onClick={() => openEditModal(book)}
                className="text-blue-500 hover:text-blue-600"
              >
                <FaEdit />
              </button>
              <button
                onClick={() => handleDeleteBook(book._id)}
                className="text-red-500 hover:text-red-600"
              >
                <FaTrash />
              </button>
            </div>
          </div>
        ))}

        {/* Add New Book */}
        <div
          onClick={openAddModal}
          className="flex flex-col items-center justify-center text-gray-600 bg-gray-200 shadow-md rounded-full p-6 hover:shadow-lg transform hover:scale-105 transition duration-200 cursor-pointer"
        >
          <FaPlus className="text-3xl" />
          <p className="text-sm mt-2">Add Book</p>
        </div>
      </div>

      {/* Input Modal for Creating/Editing Book */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded-lg shadow-md w-80">
            <h2 className="text-xl font-semibold mb-4">
              {editingBook ? "Edit Book" : "Add Book"}
            </h2>
            <input
              type="text"
              value={bookName}
              onChange={(e) => setBookName(e.target.value)}
              placeholder="Enter book name"
              className="w-full p-2 border rounded-lg mb-4"
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-300 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={editingBook ? handleSaveBook : handleAddBook}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg"
              >
                {editingBook ? "Save" : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default YourBooks;
