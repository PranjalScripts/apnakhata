import React from "react";

const TransactionForm = ({
  showForm,
  selectedTransactionType,
  newTransaction,
  setNewTransaction,
  handleAddTransaction,
  adding,
  setShowForm
}) => {
  return (
    showForm && (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleAddTransaction();
        }}
        className="mb-6 border p-4 rounded-lg shadow-md"
      >
        <h3 className="text-lg font-bold text-gray-700 mb-4">
          {selectedTransactionType}
        </h3>
        <div className="grid gap-4 mb-4">
          <input
            type="text"
            placeholder="Amount"
            value={newTransaction.amount}
            onChange={(e) =>
              setNewTransaction({ ...newTransaction, amount: e.target.value })
            }
            className="border rounded px-4 py-2"
            required
          />
          <input
            type="text"
            placeholder="Description"
            value={newTransaction.description}
            onChange={(e) =>
              setNewTransaction({
                ...newTransaction,
                description: e.target.value,
              })
            }
            className="border rounded px-4 py-2"
          />

          <input
            type="file"
            onChange={(e) =>
              setNewTransaction((prev) => ({
                ...prev,
                file: e.target.files[0], // Store the file in state
              }))
            }
          />
        </div>
        <button
          type="submit"
          disabled={adding}
          className="px-4 py-2 bg-purple-500 text-white font-semibold rounded-lg hover:bg-purple-600 disabled:opacity-50"
        >
          {adding ? "Adding..." : "Submit"}
        </button>
        <button
          type="button"
          onClick={() => setShowForm(false)}
          className="ml-4 px-4 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600"
        >
          Cancel
        </button>
      </form>
    )
  );
};

export default TransactionForm;
