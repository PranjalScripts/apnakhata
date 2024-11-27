// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { FaTh, FaList } from "react-icons/fa";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import "./BookPage.css"; // Import CSS for styling

// const BookPage = () => {
//   const [books, setBooks] = useState([]);
//   const [bookName, setBookName] = useState("");
//   const [editingBook, setEditingBook] = useState(null);
//   const [viewMode, setViewMode] = useState("list");
//   const [currentPage, setCurrentPage] = useState(1);
//   const [pageSize, setPageSize] = useState(viewMode === "list" ? 5 : 9);
//   const [searchTerm, setSearchTerm] = useState(""); // State for search term

//   useEffect(() => {
//     fetchBooks();
//     // eslint-disable-next-line
//   }, []);

//   const getAuthToken = () => {
//     return localStorage.getItem("token");
//   };

//   const fetchBooks = async () => {
//     try {
//       const response = await axios.get(
//         `${process.env.REACT_APP_URL}/api/v2/transactionBooks/getAll-books`,
//         {
//           headers: {
//             Authorization: `Bearer ${getAuthToken()}`,
//           },
//         }
//       );
//       setBooks(response.data.books);
//     } catch (error) {
//       toast.error("Failed to get books.");
//       console.error("Error fetching books", error);
//     }
//   };

//   const handleCreateBook = async () => {
//     try {
//       const response = await axios.post(
//         `${process.env.REACT_APP_URL}/api/v2/transactionBooks/create-books`,
//         { bookname: bookName },
//         {
//           headers: {
//             Authorization: `Bearer ${getAuthToken()}`,
//           },
//         }
//       );
//       setBooks([...books, response.data.book]);
//       setBookName("");
//       toast.success("Book added successfully!");
//     } catch (error) {
//       console.error("Error creating book", error);
//       toast.error("Failed to add book.");
//     }
//   };

//   const handleUpdateBook = async () => {
//     try {
//       const response = await axios.put(
//         `${process.env.REACT_APP_URL}/api/v2/transactionBooks/update-book/${editingBook._id}`,
//         { bookname: bookName },
//         {
//           headers: {
//             Authorization: `Bearer ${getAuthToken()}`,
//           },
//         }
//       );
//       setBooks(
//         books.map((book) =>
//           book._id === editingBook._id ? response.data.book : book
//         )
//       );
//       setEditingBook(null);
//       setBookName("");
//       toast.success("Book updated successfully!");
//     } catch (error) {
//       console.error("Error updating book", error);
//       toast.error("Failed to update book.");
//     }
//   };

//   const handleDeleteBook = async (bookId) => {
//     try {
//       await axios.delete(
//         `${process.env.REACT_APP_URL}/api/v2/transactionBooks/delete-book/${bookId}`,
//         {
//           headers: {
//             Authorization: `Bearer ${getAuthToken()}`,
//           },
//         }
//       );
//       setBooks(books.filter((book) => book._id !== bookId));
//       toast.success("Book deleted successfully!");
//     } catch (error) {
//       console.error("Error deleting book", error);
//       toast.error("Failed to delete book.");
//     }
//   };

//   // Pagination logic
//   const handlePageChange = (page) => {
//     setCurrentPage(page);
//   };

//   const filteredBooks = books.filter((book) =>
//     book.bookname.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const paginatedBooks = filteredBooks.slice(
//     (currentPage - 1) * pageSize,
//     currentPage * pageSize
//   );

//   const totalPages = Math.ceil(filteredBooks.length / pageSize);

//   return (
//     <div className="d-flex" style={{ "padding-left": "0" }}>
      
//       <div className="container my-4">
//         <h2 className="text-center mb-4">Manage Books</h2>

//         <div className="card p-3 mb-4">
//           <h5>{editingBook ? "Edit Book" : "Add Book"}</h5>
//           <div className="form-group">
//             <input
//               type="text"
//               className="form-control"
//               placeholder="Book Name"
//               value={bookName}
//               onChange={(e) => setBookName(e.target.value)}
//             />
//           </div>
//           <button
//             className="btn btn-primary mt-2"
//             onClick={editingBook ? handleUpdateBook : handleCreateBook}
//           >
//             {editingBook ? "Update Book" : "Add Book"}
//           </button>
//         </div>

//         {/* Search Input */}
//         <div className="form-group mb-4">
//           <input
//             type="text"
//             className="form-control"
//             placeholder="Search by book name"
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//           />
//         </div>

//         {/* View toggle buttons with tooltips */}
//         <div className="text-center my-3">
//           <span className="icon-tooltip">
//             <FaTh
//               className={`mx-2 ${viewMode === "grid" ? "text-primary" : ""}`}
//               style={{ cursor: "pointer" }}
//               onClick={() => {
//                 setViewMode("grid");
//                 setPageSize(9);
//                 setCurrentPage(1);
//               }}
//             />
//             <span className="tooltip-text">Grid View</span>
//           </span>
//           <span className="icon-tooltip">
//             <FaList
//               className={`mx-2 ${viewMode === "list" ? "text-primary" : ""}`}
//               style={{ cursor: "pointer" }}
//               onClick={() => {
//                 setViewMode("list");
//                 setPageSize(5);
//                 setCurrentPage(1);
//               }}
//             />
//             <span className="tooltip-text">List View</span>
//           </span>
//         </div>

//         {/* Conditionally render books based on selected view */}
//         {viewMode === "list" ? (
//           <div>
//             <table className="table table-bordered">
//               <thead>
//                 <tr>
//                   <th>#</th>
//                   <th>Book Name</th>
//                   <th>Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {paginatedBooks.map((book, index) => (
//                   <tr key={book._id}>
//                     <td>{(currentPage - 1) * pageSize + index + 1}</td>
//                     <td>{book.bookname}</td>
//                     <td>
//                       <button
//                         className="btn btn-secondary mx-1"
//                         onClick={() => {
//                           setEditingBook(book);
//                           setBookName(book.bookname);
//                         }}
//                       >
//                         Edit
//                       </button>
//                       <button
//                         className="btn btn-danger mx-1"
//                         onClick={() => handleDeleteBook(book._id)}
//                       >
//                         Delete
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>

//             {/* Pagination controls for list view */}
//             <div className="pagination-controls">
//               <button
//                 onClick={() => handlePageChange(currentPage - 1)}
//                 disabled={currentPage === 1}
//               >
//                 Previous
//               </button>
//               <span>{`${currentPage} of ${totalPages}`}</span>
//               <button
//                 onClick={() => handlePageChange(currentPage + 1)}
//                 disabled={currentPage === totalPages}
//               >
//                 Next
//               </button>
//             </div>
//           </div>
//         ) : (
//           <div className="row">
//             {paginatedBooks.map((book, index) => (
//               <div className="col-md-4 mb-3" key={book._id}>
//                 <div className="card h-100">
//                   <div className="card-body">
//                     <h5 className="card-title">
//                       {index + 1}. {book.bookname}
//                     </h5>
//                     <button
//                       className="btn btn-secondary mx-1"
//                       onClick={() => {
//                         setEditingBook(book);
//                         setBookName(book.bookname);
//                       }}
//                     >
//                       Edit
//                     </button>
//                     <button
//                       className="btn btn-danger mx-1"
//                       onClick={() => handleDeleteBook(book._id)}
//                     >
//                       Delete
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}

//         {/* Pagination controls for grid view */}
//         {viewMode === "grid" && (
//           <div className="pagination-controls">
//             <button
//               onClick={() => handlePageChange(currentPage - 1)}
//               disabled={currentPage === 1}
//             >
//               Previous
//             </button>
//             <span>{`${currentPage} of ${totalPages}`}</span>
//             <button
//               onClick={() => handlePageChange(currentPage + 1)}
//               disabled={currentPage === totalPages}
//             >
//               Next
//             </button>
//           </div>
//         )}
//       </div>
//       <ToastContainer />
//     </div>
//   );
// };

// export default BookPage;

import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaTh, FaList } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BookPage = () => {
  const [books, setBooks] = useState([]);
  const [bookName, setBookName] = useState("");
  const [editingBook, setEditingBook] = useState(null);
  const [viewMode, setViewMode] = useState("list");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(viewMode === "list" ? 5 : 9);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchBooks();
    // eslint-disable-next-line
  }, []);

  const getAuthToken = () => localStorage.getItem("token");

  const fetchBooks = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_URL}/api/v2/transactionBooks/getAll-books`,
        {
          headers: {
            Authorization: `Bearer ${getAuthToken()}`,
          },
        }
      );
      setBooks(response.data.books);
    } catch (error) {
      toast.error("Failed to get books.");
      console.error("Error fetching books", error);
    }
  };

  const handleSaveBook = async () => {
    try {
      if (editingBook) {
        const response = await axios.put(
          `${process.env.REACT_APP_URL}/api/v2/transactionBooks/update-book/${editingBook._id}`,
          { bookname: bookName },
          {
            headers: {
              Authorization: `Bearer ${getAuthToken()}`,
            },
          }
        );
        setBooks(
          books.map((book) =>
            book._id === editingBook._id ? response.data.book : book
          )
        );
        toast.success("Book updated successfully!");
      } else {
        const response = await axios.post(
          `${process.env.REACT_APP_URL}/api/v2/transactionBooks/create-books`,
          { bookname: bookName },
          {
            headers: {
              Authorization: `Bearer ${getAuthToken()}`,
            },
          }
        );
        setBooks([...books, response.data.book]);
        toast.success("Book added successfully!");
      }

      setShowModal(false);
      setEditingBook(null);
      setBookName("");
    } catch (error) {
      console.error("Error saving book", error);
      toast.error(editingBook ? "Failed to update book." : "Failed to add book.");
    }
  };

  const handleDeleteBook = async (bookId) => {
    try {
      await axios.delete(
        `${process.env.REACT_APP_URL}/api/v2/transactionBooks/delete-book/${bookId}`,
        {
          headers: {
            Authorization: `Bearer ${getAuthToken()}`,
          },
        }
      );
      setBooks(books.filter((book) => book._id !== bookId));
      toast.success("Book deleted successfully!");
    } catch (error) {
      console.error("Error deleting book", error);
      toast.error("Failed to delete book.");
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const filteredBooks = books.filter((book) =>
    book.bookname.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedBooks = filteredBooks.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const totalPages = Math.ceil(filteredBooks.length / pageSize);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="container mx-auto">
        <h2 className="text-2xl font-bold text-left mb-6">Manage Books</h2>

        {/* Add/Edit Button */}
        <div className="flex justify-left mb-6">
          <button
            onClick={() => {
              setShowModal(true);
              setEditingBook(null);
              setBookName("");
            }}
            className="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600"
          >
            Add Book
          </button>
        </div>

        {/* Search Bar */}
        <div className="flex justify-center mb-6">
          <input
            type="text"
            placeholder="Search by book name"
            className="w-full max-w-lg px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* View Mode Switch */}
        <div className="flex justify-center items-center space-x-4 mb-6">
          <FaTh
            className={`text-2xl cursor-pointer ${
              viewMode === "grid" ? "text-indigo-500" : "text-gray-500"
            }`}
            onClick={() => {
              setViewMode("grid");
              setPageSize(9);
              setCurrentPage(1);
            }}
          />
          <FaList
            className={`text-2xl cursor-pointer ${
              viewMode === "list" ? "text-indigo-500" : "text-gray-500"
            }`}
            onClick={() => {
              setViewMode("list");
              setPageSize(5);
              setCurrentPage(1);
            }}
          />
        </div>

        {/* Books Display */}
        {viewMode === "list" ? (
          <div className="overflow-x-auto">
            <table className="table-auto w-full bg-white shadow-md rounded mb-6">
              <thead>
                <tr className="bg-gray-200 text-left">
                  <th className="px-4 py-2">#</th>
                  <th className="px-4 py-2">Book Name</th>
                  <th className="px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedBooks.map((book, index) => (
                  <tr key={book._id} className="border-b">
                    <td className="px-4 py-2">{index + 1}</td>
                    <td className="px-4 py-2">{book.bookname}</td>
                    <td className="px-4 py-2 flex space-x-2">
                      <button
                        onClick={() => {
                          setEditingBook(book);
                          setBookName(book.bookname);
                          setShowModal(true);
                        }}
                        className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteBook(book._id)}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedBooks.map((book, index) => (
              <div
                key={book._id}
                className="bg-white p-4 shadow-md rounded flex flex-col justify-between"
              >
                <h5 className="text-lg font-semibold">{book.bookname}</h5>
                <div className="mt-4 flex space-x-2">
                  <button
                    onClick={() => {
                      setEditingBook(book);
                      setBookName(book.bookname);
                      setShowModal(true);
                    }}
                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteBook(book._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination Controls */}
        <div className="flex justify-between items-center mt-6">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 disabled:bg-gray-200"
          >
            Previous
          </button>
          <span className="text-gray-600">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 disabled:bg-gray-200"
          >
            Next
          </button>
        </div>
      </div>

      {/* Modal for Add/Edit */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-1/3">
            <h5 className="text-lg font-semibold mb-4">
              {editingBook ? "Edit Book" : "Add Book"}
            </h5>
            <input
              type="text"
              placeholder="Book Name"
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-4"
              value={bookName}
              onChange={(e) => setBookName(e.target.value)}
            />
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => {
                  setShowModal(false);
                  setEditingBook(null);
                  setBookName("");
                }}
                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveBook}
                className="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  );
};

export default BookPage;
