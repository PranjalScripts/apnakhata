// import React, { useState, useEffect } from "react";
// import { useParams } from "react-router-dom";
// import axios from "axios";

// const TransactionHistory = () => {
//   const { transactionId } = useParams();
//   const [transactionData, setTransactionData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchTransactionDetails = async () => {
//       try {
//         setLoading(true);
//         const token = localStorage.getItem("token");

//         const response = await axios.get(
//           `${process.env.REACT_APP_URL}/api/v4/transaction/get-transaction/${transactionId}`,
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );
//         if (response.data.success) {
//           setTransactionData(response.data.data);
//         } else {
//           setError("Failed to fetch transaction details");
//         }
//       } catch (err) {
//         setError(err.message || "Something went wrong");
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (transactionId) {
//       fetchTransactionDetails();
//     }
//   }, [transactionId]);

//   if (loading) {
//     return <div className="text-center text-gray-600">Loading...</div>;
//   }

//   if (error) {
//     return <div className="text-center text-red-500">Error: {error}</div>;
//   }

//   if (!transactionData) {
//     return <div className="text-center text-gray-600">No transaction details found.</div>;
//   }

//   return (
//     <div className="min-h-screen bg-gray-100 p-6">
//       <div className="container mx-auto max-w-5xl bg-white shadow-md rounded-lg p-6">
//         <h2 className="text-2xl font-bold text-gray-800 mb-4">Transaction Details</h2>

//         {/* Transaction Details */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
//           <p>
//             <strong className="text-gray-700">Transaction ID:</strong>{" "}
//             <span className="text-gray-900">{transactionData._id}</span>
//           </p>
//           <p>
//             <strong className="text-gray-700">Book ID:</strong>{" "}
//             <span className="text-gray-900">{transactionData.bookId}</span>
//           </p>
//           <p>
//             <strong className="text-gray-700">User ID:</strong>{" "}
//             <span className="text-gray-900">{transactionData.userId}</span>
//           </p>
//           <p>
//             <strong className="text-gray-700">Client User ID:</strong>{" "}
//             <span className="text-gray-900">{transactionData.clientUserId}</span>
//           </p>
//           {transactionData.outstandingBalance !== 0 && (
//             <p>
//               <strong className="text-gray-700">{transactionData.outstandingBalance < 0?"you will give":"you will get"}:</strong>{" "}
//               <span
//                 className={`${
//                   transactionData.outstandingBalance < 0
//                     ? "text-red-500"
//                     : "text-green-500"
//                 }`}
//               >
//                 {Math.abs(transactionData.outstandingBalance)}
//               </span>
//             </p>
//           )}
//           <p>
//             <strong className="text-gray-700">Created At:</strong>{" "}
//             <span className="text-gray-900">
//               {new Date(transactionData.createdAt).toLocaleString()}
//             </span>
//           </p>
//           <p>
//             <strong className="text-gray-700">Updated At:</strong>{" "}
//             <span className="text-gray-900">
//               {new Date(transactionData.updatedAt).toLocaleString()}
//             </span>
//           </p>
//         </div>

//         {/* Transaction History Table */}
//         <h3 className="text-xl font-semibold text-gray-800 mb-4">Transaction History</h3>
//         <div className="overflow-x-auto">
//           <table className="w-full border-collapse border border-gray-300">
//             <thead className="bg-gray-100">
//               <tr>
//                 <th className="border border-gray-300 px-4 py-2 text-left text-gray-700">Date</th>
//                 <th className="border border-gray-300 px-4 py-2 text-left text-gray-700">Type</th>
//                 <th className="border border-gray-300 px-4 py-2 text-left text-gray-700">Amount</th>
//                 <th className="border border-gray-300 px-4 py-2 text-left text-gray-700">Description</th>
//                 <th className="border border-gray-300 px-4 py-2 text-left text-gray-700">
//                   Outstanding Balance
//                 </th>
//                 <th className="border border-gray-300 px-4 py-2 text-left text-gray-700">Notify</th>
//               </tr>
//             </thead>
//             <tbody>
//               {transactionData.transactionHistory
//                 .filter((entry) => entry.outstandingBalance !== 0) // Filter out rows where outstandingBalance is 0
//                 .map((entry) => (
//                   <tr key={entry._id} className="hover:bg-gray-50">
//                     <td className="border border-gray-300 px-4 py-2">
//                       {new Date(entry.transactionDate).toLocaleString()}
//                     </td>
//                     <td className="border border-gray-300 px-4 py-2">{entry.transactionType}</td>
//                     <td className="border border-gray-300 px-4 py-2">{entry.amount || "N/A"}</td>
//                     <td className="border border-gray-300 px-4 py-2">{entry.description || "N/A"}</td>
//                     <td
//                       className={`border border-gray-300 px-4 py-2 ${
//                         entry.outstandingBalance < 0
//                           ? "text-red-500"
//                           : "text-green-500"
//                       }`}
//                     >
//                       {Math.abs(entry.outstandingBalance)}
//                     </td>
//                   </tr>
//                 ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default TransactionHistory;







// import React, { useState, useEffect } from "react";
// import { useParams } from "react-router-dom";
// import axios from "axios";

// const TransactionHistory = () => {
//   const { transactionId } = useParams();
//   const [transactionData, setTransactionData] = useState(null);
//   const [bookId, setBookId] = useState("");
//   const [clientUserId, setClientUserId] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [showModal, setShowModal] = useState(false);
//   const [modalType, setModalType] = useState(""); // Distinguish between "You Will Give" and "You Will Get"
//   const [formData, setFormData] = useState({
//     amount: "",
//     description: "",
//   });

//   useEffect(() => {
//     const fetchTransactionDetails = async () => {
//       try {
//         setLoading(true);
//         const token = localStorage.getItem("token");

//         const response = await axios.get(
//           `${process.env.REACT_APP_URL}/api/v4/transaction/get-transaction/${transactionId}`,
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );

//         if (response.data.success) {
//           const data = response.data.data;
//           setTransactionData(data);
//           setBookId(data.bookId || "");
//           setClientUserId(data.clientUserId || "");
//         } else {
//           throw new Error("Failed to fetch transaction details.");
//         }
//       } catch (err) {
//         setError(err.message || "Something went wrong.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (transactionId) fetchTransactionDetails();
//   }, [transactionId]);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleFormSubmit = async (e) => {
//     e.preventDefault();
//     const token = localStorage.getItem("token");

//     const transactionPayload = {
//       ...formData,
//       transactionType: modalType === "You Will Give" ? "you will give" : "you will get",
//       transactionId,
//       bookId,
//       clientUserId,
//     };

//     try {
//       const response = await axios.post(
//         `${process.env.REACT_APP_URL}/api/v4/transaction/create-transaction`,
//         transactionPayload,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       if (response.data.success) {
//         alert("Transaction created successfully!");
//         setShowModal(false);
//         setFormData({ amount: "", description: "" });

//         setTransactionData((prevData) => ({
//           ...prevData,
//           transactionHistory: [
//             ...(prevData?.transactionHistory || []),
//             response.data.data,
//           ],
//         }));
//       } else {
//         alert(`Failed to create transaction: ${response.data.message}`);
//       }
//     } catch (error) {
//       console.error("Error creating transaction:", error);
//       alert("An error occurred while creating the transaction.");
//     }
//   };

//   if (loading) return <div className="text-center text-gray-600">Loading...</div>;
//   if (error) return <div className="text-center text-red-500">Error: {error}</div>;
//   if (!transactionData) return <div className="text-center text-gray-600">No transaction details found.</div>;

//   return (
//     <div className="min-h-screen bg-gray-100 p-6">
//       <div className="container mx-auto max-w-5xl bg-white shadow-md rounded-lg p-6">
//         <h2 className="text-2xl font-bold text-gray-800 mb-4">Transaction Details</h2>

//         {/* Buttons */}
//         <div className="mb-6">
//           <button
//             className="bg-red-500 text-white px-4 py-2 rounded mr-4 hover:bg-red-600"
//             onClick={() => {
//               setModalType("You Will Give");
//               setShowModal(true);
//             }}
//           >
//             You Will Give
//           </button>
//           <button
//             className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
//             onClick={() => {
//               setModalType("You Will Get");
//               setShowModal(true);
//             }}
//           >
//             You Will Get
//           </button>
//         </div>

//         {/* Transaction Details */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
//           <p>
//             <strong className="text-gray-700">Transaction ID:</strong>{" "}
//             <span className="text-gray-900">{transactionData._id}</span>
//           </p>
//           <p>
//             <strong className="text-gray-700">Book ID:</strong>{" "}
//             <span className="text-gray-900">{transactionData.bookId}</span>
//           </p>
//           <p>
//             <strong className="text-gray-700">User ID:</strong>{" "}
//             <span className="text-gray-900">{transactionData.userId}</span>
//           </p>
//           <p>
//             <strong className="text-gray-700">Client User ID:</strong>{" "}
//             <span className="text-gray-900">{transactionData.clientUserId}</span>
//           </p>
//           {transactionData.outstandingBalance !== 0 && (
//             <p>
//               <strong className="text-gray-700">
//                 {transactionData.outstandingBalance < 0 ? "You Will Give" : "You Will Get"}:
//               </strong>{" "}
//               <span
//                 className={`${
//                   transactionData.outstandingBalance < 0 ? "text-red-500" : "text-green-500"
//                 }`}
//               >
//                 {Math.abs(transactionData.outstandingBalance)}
//               </span>
//             </p>
//           )}
//           <p>
//             <strong className="text-gray-700">Created At:</strong>{" "}
//             <span className="text-gray-900">
//               {new Date(transactionData.createdAt).toLocaleString()}
//             </span>
//           </p>
//           <p>
//             <strong className="text-gray-700">Updated At:</strong>{" "}
//             <span className="text-gray-900">
//               {new Date(transactionData.updatedAt).toLocaleString()}
//             </span>
//           </p>
//         </div>

//         {/* Transaction History Table */}
//         <h3 className="text-xl font-semibold text-gray-800 mb-4">Transaction History</h3>
//         <div className="overflow-x-auto">
//           <table className="w-full border-collapse border border-gray-300">
//             <thead className="bg-gray-100">
//               <tr>
//                 <th className="border border-gray-300 px-4 py-2 text-left text-gray-700">Date</th>
//                 <th className="border border-gray-300 px-4 py-2 text-left text-gray-700">Type</th>
//                 <th className="border border-gray-300 px-4 py-2 text-left text-gray-700">Amount</th>
//                 <th className="border border-gray-300 px-4 py-2 text-left text-gray-700">Description</th>
//                 <th className="border border-gray-300 px-4 py-2 text-left text-gray-700">
//                   Outstanding Balance
//                 </th>
//               </tr>
//             </thead>
//             <tbody>
//               {(transactionData.transactionHistory || [])
//                 .filter((entry) => entry.outstandingBalance !== 0)
//                 .map((entry) => (
//                   <tr key={entry._id} className="hover:bg-gray-50">
//                     <td className="border border-gray-300 px-4 py-2">
//                       {new Date(entry.transactionDate).toLocaleString()}
//                     </td>
//                     <td className="border border-gray-300 px-4 py-2">{entry.transactionType}</td>
//                     <td className="border border-gray-300 px-4 py-2">{entry.amount || "N/A"}</td>
//                     <td className="border border-gray-300 px-4 py-2">{entry.description || "N/A"}</td>
//                     <td
//                       className={`border border-gray-300 px-4 py-2 ${
//                         entry.outstandingBalance < 0 ? "text-red-500" : "text-green-500"
//                       }`}
//                     >
//                       {Math.abs(entry.outstandingBalance)}
//                     </td>
//                   </tr>
//                 ))}
//             </tbody>
//           </table>
//         </div>

        // {/* Modal */}
        // {showModal && (
        //   <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
        //     <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
        //       <h3 className="text-lg font-bold mb-4">{modalType} - Add Transaction</h3>
        //       <form onSubmit={handleFormSubmit}>
        //         {["amount", "description"].map((field) => (
        //           <div className="mb-4" key={field}>
        //             <label className="block text-gray-700 font-medium mb-1 capitalize">
        //               {field.replace(/([A-Z])/g, " $1")}
        //             </label>
        //             <input
        //               type={field === "amount" ? "number" : "text"}
        //               name={field}
        //               value={formData[field]}
        //               onChange={handleInputChange}
        //               className="w-full border border-gray-300 rounded px-3 py-2"
        //               required
        //             />
        //           </div>
        //         ))}
        //         <div className="flex justify-end">
        //           <button
        //             type="button"
        //             className="bg-gray-300 text-gray-800 px-4 py-2 rounded mr-2"
        //             onClick={() => setShowModal(false)}
        //           >
        //             Cancel
        //           </button>
        //           <button
        //             type="submit"
        //             className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        //           >
        //             Submit
        //           </button>
        //         </div>
        //       </form>
        //     </div>
        //   </div>
        // )}
//       </div>
//     </div>
//   );
// };

// export default TransactionHistory;


import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const TransactionHistory = () => {
  const { transactionId } = useParams();
  const [transactionData, setTransactionData] = useState(null);
  const [bookId, setBookId] = useState("");
  const [clientUserId, setClientUserId] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [formData, setFormData] = useState({
    amount: "",
    description: "",
  });

  const [bookName, setBookName] = useState("");
  const [clientName, setClientName] = useState("");

  useEffect(() => {
    const fetchTransactionDetails = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");

        const response = await axios.get(
          `${process.env.REACT_APP_URL}/api/v4/transaction/get-transaction/${transactionId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.success) {
          const data = response.data.data;
          setTransactionData(data);
          setBookId(data.bookId || "");
          setClientUserId(data.clientUserId || "");
          fetchBookName(data.bookId, token);

          fetchClientName(data.clientUserId, token);
        } else {
          throw new Error("Failed to fetch transaction details.");
        }
      } catch (err) {
        setError(err.message || "Something went wrong.");
      } finally {
        setLoading(false);
      }
    };

    if (transactionId) fetchTransactionDetails();
  }, [transactionId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
  
    // Convert amount to number and validate
    const parsedAmount = Number(formData.amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      alert("Please enter a valid positive numeric amount.");
      return;
    }
  
    // Prepare the transaction payload
    const transactionPayload = {
      ...formData,
      amount: parsedAmount, // Ensure amount is a number
      transactionType: modalType === "You Will Give" ? "you will give" : "you will get",
      transactionId,
      bookId,
      clientUserId,
    };
  
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_URL}/api/v4/transaction/create-transaction`,
        transactionPayload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      if (response.data.success) {
        alert("Transaction created successfully!");
        setShowModal(false);
  
        // Reset the form data
        setFormData({ amount: "", description: "" });
  
        // Update transaction history in the UI
        setTransactionData((prevData) => ({
          ...prevData,
          transactionHistory: [
            ...(prevData?.transactionHistory || []),
            response.data.data,
          ],
        }));
      } else {
        alert(`Failed to create transaction: ${response.data.message}`);
      }
    } catch (error) {
      console.error("Error creating transaction:", error);
      alert("An error occurred while creating the transaction.");
    }
  };
  

  // Fetch book name
  const fetchBookName = async (bookId, token) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_URL}/api/v2/transactionBooks/get-book/${bookId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setBookName(response.data.book.bookname || "Unknown Book");
    } catch (error) {
      setBookName("Unknown Book");
    }
  };



  // Fetch client name
  const fetchClientName = async (clientUserId, token) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_URL}/api/v3/client/get-client/${clientUserId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setClientName(response.data.data.name || "Unknown Client");
    } catch (error) {
      setClientName("Unknown Client");
    }
  };


  if (loading) return <div className="text-center text-gray-600">Loading...</div>;
  if (error) return <div className="text-center text-red-500">Error: {error}</div>;
  if (!transactionData) return <div className="text-center text-gray-600">No transaction details found.</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-1 gap-6">
        {/* Transaction Details Card */}
        <div className="rounded-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Transaction Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Book Name Card */}
            <div className="bg-yellow-100 shadow-md rounded-lg p-4 text-center">
              <h3 className="text-xl font-semibold text-gray-700 mb-2">Book</h3>
              <p className="text-gray-900 text-lg">{bookName || "Loading..."}</p>
            </div>

            {/* Client Name Card */}


            {/* You Will Give/Get Card */}
            <div className={`${transactionData.outstandingBalance < 0 ? "bg-red-100" : "bg-green-100"
                  } shadow-md rounded-lg p-4 text-center`}>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                You Will {transactionData.outstandingBalance < 0 ? "Give" : "Get"}
              </h3>
              <p
                className={`text-lg font-bold ${transactionData.outstandingBalance < 0 ? "text-red-500" : "text-green-500"
                  }`}
              >
                {transactionData.outstandingBalance !== 0
                  ? `${Math.abs(transactionData.outstandingBalance)}`
                  : "N/A"}
              </p>
            </div>
            <div className="bg-blue-100 shadow-md rounded-lg p-4 text-center">
              <h3 className="text-xl font-semibold text-gray-700 mb-2">Client</h3>
              <p className="text-gray-900 text-lg">{clientName || "Loading..."}</p>
            </div>
          </div>
        </div>


        <div className="bg-white shadow-md rounded-lg p-6 flex flex-col">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Transaction History</h2>
          <div className="overflow-x-auto mb-6 flex-grow">
            <table className="w-full border-collapse border border-gray-300">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border border-gray-300 px-4 py-2 text-left text-gray-700">Date</th>
                  <th className="border border-gray-300 px-4 py-2 text-right text-gray-700">You Will Give</th>
                  <th className="border border-gray-300 px-4 py-2 text-right text-gray-700">You Will Get</th>
                  <th className="border border-gray-300 px-4 py-2 text-left text-gray-700">Description</th>
                  <th className="border border-gray-300 px-4 py-2 text-left text-gray-700">
                    Outstanding Balance
                  </th>
                </tr>
              </thead>
              <tbody>
                {(transactionData.transactionHistory || [])
                  .filter((entry) => entry.outstandingBalance !== 0)
                  .map((entry) => (
                    <tr key={entry._id} className="hover:bg-gray-50">
                      <td className="border border-gray-300 px-4 py-2">
                        {new Date(entry.transactionDate).toLocaleString()}
                      </td>
                      <td className="border border-gray-300 bg-red-100 px-4 py-2 text-right">
                        {entry.transactionType === "you will give" ? entry.amount : ""}
                      </td>
                      <td className="border border-gray-300 bg-green-100 px-4 py-2 text-right">
                        {entry.transactionType === "you will get" ? entry.amount : ""}
                      </td>
                      <td className="border border-gray-300 bg-blue-100 px-4 py-2">{entry.description || "N/A"}</td>
                      <td
                        className={`border border-gray-300 px-4 py-2 ${entry.outstandingBalance < 0 ? "text-red-500" : "text-green-500"
                          }`}
                      >
                        {Math.abs(entry.outstandingBalance)}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
          {/* Buttons */}
          <div className="flex justify-between">
            <button
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              onClick={() => {
                setModalType("You Will Give");
                setShowModal(true);
              }}
            >
              You Will Give
            </button>
            <button
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              onClick={() => {
                setModalType("You Will Get");
                setShowModal(true);
              }}
            >
              You Will Get
            </button>
          </div>
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
              <h3 className="text-lg font-bold mb-4">{modalType} - Add Transaction</h3>
              <form onSubmit={handleFormSubmit}>
                {["amount", "description"].map((field) => (
                  <div className="mb-4" key={field}>
                    <label className="block text-gray-700 font-medium mb-1 capitalize">
                      {field.replace(/([A-Z])/g, " $1")}
                    </label>
                    <input
                      type={field === "amount" ? "number" : "text"}
                      name={field}
                      value={formData[field]}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded px-3 py-2"
                      required
                    />
                  </div>
                ))}
                <div className="flex justify-end">
                  <button
                    type="button"
                    className="bg-gray-300 text-gray-800 px-4 py-2 rounded mr-2"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default TransactionHistory;
