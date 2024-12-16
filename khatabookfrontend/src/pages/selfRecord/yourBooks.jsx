import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const YourBooks = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookName, setBookName] = useState("");
  const [editingBook, setEditingBook] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate(); // Hook for navigation
 

  

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

  const openAddModal = () => {
    setEditingBook(null);
    setBookName("");
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
            onClick={() => navigate(`/your-books/${book._id}`)} // Navigate on click
            className="relative flex bg-blue-500 flex-col items-center justify-center text-white shadow-md rounded-full p-6 hover:shadow-lg transform hover:scale-105 transition duration-200 cursor-pointer"
             
          >
            <h2 className="text-lg font-semibold text-center">
              {book.bookname}
            </h2>
            <p className="text-sm text-center">
              Created At: {new Date(book.createdAt).toLocaleDateString()}
            </p>
          </div>
        ))}
        <div
          onClick={openAddModal}
          className="flex flex-col items-center justify-center text-gray-600 bg-gray-200 shadow-md rounded-full p-6 hover:shadow-lg transform hover:scale-105 transition duration-200 cursor-pointer"
        >
          <FaPlus className="text-3xl" />
          <p className="text-sm mt-2">Add Book</p>
        </div>
      </div>
    </div>
  );
};

export default YourBooks;
