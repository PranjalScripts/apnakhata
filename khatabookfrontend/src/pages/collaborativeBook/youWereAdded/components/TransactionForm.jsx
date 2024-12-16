import React from 'react';

const TransactionForm = ({ formData, isSubmitting, handleInputChange, handleAddTransaction, setShowForm }) => {
  return (
    <form
      onSubmit={handleAddTransaction}
      className="bg-white shadow-lg rounded-lg p-6 mb-6"
    >
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        Add {formData.transactionType} Transaction
      </h2>
      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">
          Amount
        </label>
        <input
          type="number"
          name="amount"
          className="w-full border-gray-300 rounded-md p-2"
          value={formData.amount}
          onChange={handleInputChange}
          required
          min="0"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">
          Description
        </label>
        <textarea
          name="description"
          className="w-full border-gray-300 rounded-md p-2"
          value={formData.description}
          onChange={handleInputChange}
        ></textarea>
        <input
          type="file"
          onChange={(e) =>
            handleInputChange({
              target: { name: 'file', value: e.target.files[0] }
            })
          }
        />
      </div>
      <div className="flex space-x-4">
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          {isSubmitting ? "Submitting..." : "Submit"}
        </button>
        <button
          type="button"
          className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
          onClick={() => setShowForm(false)}
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default TransactionForm;
