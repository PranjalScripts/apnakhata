import React, { useState, useEffect } from "react";
import axios from "axios";

const CollaborativeBookRecords = () => {
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRecords = async () => {
            try {
                const response = await axios.get(
                    `${process.env.REACT_APP_URL}/api/transactions`,
                    {
                        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                    }
                );
                setRecords(response.data);
            } catch (err) {
                setError("Failed to fetch records");
            } finally {
                setLoading(false);
            }
        };

        fetchRecords();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen text-xl font-semibold text-gray-700">
                Loading...
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-screen text-xl font-semibold text-red-500">
                {error}
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Collaborative Book Records</h2>
            {records.length === 0 ? (
                <p className="text-lg text-gray-500">No records available.</p>
            ) : (
                records.map((record) => (
                    <div
                        key={record._id}
                        className="bg-white shadow-lg rounded-lg p-6 mb-6 border border-gray-200"
                    >
                        <h3 className="text-2xl font-semibold text-gray-800 mb-2">
                            Book: <span className="font-medium">{record.bookId.bookname}</span>
                        </h3>
                        <p className="text-lg text-gray-700 mb-2">
                            <strong>User:</strong> {record.userId.name}
                        </p>
                        <p className="text-lg text-gray-700 mb-2">
                            <strong>Client:</strong> {record.clientUserId}
                        </p>
                        <p className="text-lg text-gray-700 mb-4">
                            <strong>Outstanding Balance:</strong>{" "}
                            <span
                                className={`font-semibold ${record.outstandingBalance < 0 ? "text-red-500" : "text-green-500"
                                    }`}
                            >
                                {Math.abs(record.outstandingBalance)}
                            </span>
                        </p>

                        {/* Transaction History Table */}
                        <h4 className="text-xl font-semibold text-gray-800 mb-4">Transaction History:</h4>
                        <div className="overflow-x-auto">
                            <table className="min-w-full table-auto border-collapse border border-gray-300">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="px-4 py-2 border-b text-left text-gray-700">Type</th>
                                        <th className="px-4 py-2 border-b text-left text-gray-700">Amount</th>
                                        <th className="px-4 py-2 border-b text-left text-gray-700">Description</th>
                                        <th className="px-4 py-2 border-b text-left text-gray-700">Date</th>
                                        <th className="px-4 py-2 border-b text-left text-gray-700">Outstanding Balance</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {record.transactionHistory
                                        .filter((transaction) => transaction.outstandingBalance !== 0) // Filter out transactions with 0 outstandingBalance
                                        .map((transaction) => (
                                            <tr key={transaction._id} className="hover:bg-gray-50">
                                                <td className="px-4 py-2 border-b">{transaction.transactionType}</td>
                                                <td className="px-4 py-2 border-b">{transaction.amount || "N/A"}</td>
                                                <td className="px-4 py-2 border-b">{transaction.description || "N/A"}</td>
                                                <td className="px-4 py-2 border-b">
                                                    {new Date(transaction.transactionDate).toLocaleString()}
                                                </td>
                                                <td className="px-4 py-2 border-b">
                                                    <span
                                                        className={`font-semibold ${transaction.outstandingBalance < 0
                                                                ? "text-red-500"
                                                                : "text-green-500"
                                                            }`}
                                                    >
                                                        {Math.abs(transaction.outstandingBalance)}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                </tbody>

                            </table>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default CollaborativeBookRecords;
