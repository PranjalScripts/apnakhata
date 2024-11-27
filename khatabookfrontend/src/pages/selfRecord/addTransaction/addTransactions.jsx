// import React, { useState, useEffect } from "react";
 
// import axios from "axios";

// const  AddTransactions = () => {
//   const [clients, setClients] = useState([]);
//   const [books, setBooks] = useState([]);
//   const [transactionData, setTransactionData] = useState({
//     bookId: "",
//     userId: "",  
//     clientUserId: "",
//     transactionType: "you will get",
//     amount: "",
//     description: "",
//   });
//   const [message, setMessage] = useState("");

//   const token = localStorage.getItem("token");

//   const axiosInstance = axios.create({
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   });

//   useEffect(() => {
//     // Fetch clients
//     axiosInstance
//       .get(`${process.env.REACT_APP_URL}/api/v3/client/getAll-clients`)
//       .then((response) => {
//         if (
//           response.data &&
//           response.data.success &&
//           Array.isArray(response.data.data)
//         ) {
//           setClients(response.data.data);
//         } else {
//           console.error(
//             "Clients data is not in the expected format:",
//             response.data
//           );
//         }
//       })
//       .catch((error) => console.error("Error fetching clients:", error));

//     // Fetch books
//     axiosInstance
//       .get(`${process.env.REACT_APP_URL}/api/v2/transactionBooks/getAll-books`)
//       .then((response) => {
//         // Ensure we're accessing the `books` array in the response
//         if (Array.isArray(response.data.books)) {
//           setBooks(response.data.books);
//           console.log("Books data:", response.data.books); // For debugging
//         } else {
//           console.error(
//             "Books data is not in the expected format:",
//             response.data
//           );
//         }
//       })
//       .catch((error) => console.error("Error fetching books:", error));
//     // eslint-disable-next-line
//   }, []);

//   const handleChange = (e) => {
//     const { name, value } = e.target;

//     setTransactionData({
//       ...transactionData,
//       [name]: name === "amount" ? parseFloat(value) || 0 : value, // Convert amount to a number
//     });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     axiosInstance
//       .post(
//         `${process.env.REACT_APP_URL}/api/v4/transaction/create-transaction`,
//         transactionData
//       )
//       .then((response) => {
//         setMessage(response.data.message);
//         setTransactionData({
//           bookId: "",
//           userId: "",
//           clientUserId: "",
//           transactionType: "you will get",
//           amount: "",
//           description: "",
//         });
//       })
//       .catch((error) => {
//         setMessage(error.response?.data?.message || "An error occurred.");
//         console.error("Transaction creation error:", error);
//       });
//   };

//   return (
 

//       <div className="container p-4">
//         <h1>Self Record Page</h1>
//         {message && <div className="alert alert-info">{message}</div>}

//         <form onSubmit={handleSubmit} className="mt-4">
//           <div className="mb-3">
//             <label htmlFor="bookId" className="form-label">
//               Book
//             </label>
//             <select
//               className="form-select"
//               id="bookId"
//               name="bookId"
//               value={transactionData.bookId}
//               onChange={handleChange}
//               required
//             >
//               <option value="">Select Book</option>
//               {Array.isArray(books) &&
//                 books.map((book) => (
//                   <option key={book._id} value={book._id}>
//                     {book.bookname}
//                   </option>
//                 ))}
//             </select>
//           </div>

//           <div className="mb-3">
//             <label htmlFor="clientUserId" className="form-label">
//               Client
//             </label>
//             <select
//               className="form-select"
//               id="clientUserId"
//               name="clientUserId"
//               value={transactionData.clientUserId}
//               onChange={handleChange}
//               required
//             >
//               <option value="">Select Client</option>
//               {Array.isArray(clients) &&
//                 clients.map((client) => (
//                   <option key={client._id} value={client._id}>
//                     {client.name}
//                   </option>
//                 ))}
//             </select>
//           </div>

//           <div className="mb-3">
//             <label htmlFor="transactionType" className="form-label">
//               Transaction Type
//             </label>
//             <select
//               className="form-select"
//               id="transactionType"
//               name="transactionType"
//               value={transactionData.transactionType}
//               onChange={handleChange}
//             >
//               <option value="you will get">You Will Get</option>
//               <option value="you will give">You Will Give</option>
//             </select>
//           </div>

//           <div className="mb-3">
//             <label htmlFor="amount" className="form-label">
//               Amount
//             </label>
//             <input
//               type="number"
//               className="form-control"
//               id="amount"
//               name="amount"
//               value={transactionData.amount}
//               onChange={handleChange}
//               required
//             />
//           </div>

//           <div className="mb-3">
//             <label htmlFor="description" className="form-label">
//               Description
//             </label>
//             <textarea
//               className="form-control"
//               id="description"
//               name="description"
//               value={transactionData.description}
//               onChange={handleChange}
//             ></textarea>
//           </div>

//           <button type="submit" className="btn btn-primary">
//             Create Transaction
//           </button>
//         </form>
//       </div>
   
//   );
// };

// export default  AddTransactions;


import React, { useState, useEffect } from "react";
import axios from "axios";

const AddTransactions = () => {
  const [clients, setClients] = useState([]);
  const [books, setBooks] = useState([]);
  const [transactionData, setTransactionData] = useState({
    bookId: "",
    userId: "",
    clientUserId: "",
    transactionType: "you will get",
    amount: "",
    description: "",
  });
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");

  const axiosInstance = axios.create({
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  useEffect(() => {
    // Fetch clients
    axiosInstance
      .get(`${process.env.REACT_APP_URL}/api/v3/client/getAll-clients`)
      .then((response) => {
        if (response.data?.success && Array.isArray(response.data.data)) {
          setClients(response.data.data);
        }
      })
      .catch((error) => console.error("Error fetching clients:", error));

    // Fetch books
    axiosInstance
      .get(`${process.env.REACT_APP_URL}/api/v2/transactionBooks/getAll-books`)
      .then((response) => {
        if (Array.isArray(response.data.books)) {
          setBooks(response.data.books);
        }
      })
      .catch((error) => console.error("Error fetching books:", error));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setTransactionData({
      ...transactionData,
      [name]: name === "amount" ? parseFloat(value) || 0 : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axiosInstance
      .post(
        `${process.env.REACT_APP_URL}/api/v4/transaction/create-transaction`,
        transactionData
      )
      .then((response) => {
        setMessage(response.data.message);
        setTransactionData({
          bookId: "",
          userId: "",
          clientUserId: "",
          transactionType: "you will get",
          amount: "",
          description: "",
        });
      })
      .catch((error) => {
        setMessage(error.response?.data?.message || "An error occurred.");
        console.error("Transaction creation error:", error);
      });
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Add Transaction
        </h2>

        {message && (
          <div
            className={`p-4 mb-4 text-center rounded ${
              message.toLowerCase().includes("success")
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="bookId" className="block text-gray-700 font-medium">
              Book
            </label>
            <select
              id="bookId"
              name="bookId"
              value={transactionData.bookId}
              onChange={handleChange}
              className="w-full mt-1 border-gray-300 rounded-lg shadow-sm"
              required
            >
              <option value="">Select Book</option>
              {books.map((book) => (
                <option key={book._id} value={book._id}>
                  {book.bookname}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label
              htmlFor="clientUserId"
              className="block text-gray-700 font-medium"
            >
              Client
            </label>
            <select
              id="clientUserId"
              name="clientUserId"
              value={transactionData.clientUserId}
              onChange={handleChange}
              className="w-full mt-1 border-gray-300 rounded-lg shadow-sm"
              required
            >
              <option value="">Select Client</option>
              {clients.map((client) => (
                <option key={client._id} value={client._id}>
                  {client.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label
              htmlFor="transactionType"
              className="block text-gray-700 font-medium"
            >
              Transaction Type
            </label>
            <select
              id="transactionType"
              name="transactionType"
              value={transactionData.transactionType}
              onChange={handleChange}
              className="w-full mt-1 border-gray-300 rounded-lg shadow-sm"
            >
              <option value="you will get">You Will Get</option>
              <option value="you will give">You Will Give</option>
            </select>
          </div>

          <div className="mb-4">
            <label htmlFor="amount" className="block text-gray-700 font-medium">
              Amount
            </label>
            <input
              type="number"
              id="amount"
              name="amount"
              value={transactionData.amount}
              onChange={handleChange}
              className="w-full mt-1 border-gray-300 rounded-lg shadow-sm"
              required
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="description"
              className="block text-gray-700 font-medium"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={transactionData.description}
              onChange={handleChange}
              className="w-full mt-1 border-gray-300 rounded-lg shadow-sm"
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg shadow-md hover:bg-blue-600"
          >
            Create Transaction
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddTransactions;
