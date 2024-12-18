import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const AddTransactionForm = ({ 
  showForm, 
  selectedTransactionType, 
  newTransaction, 
  setNewTransaction, 
  handleAddTransaction, 
  setShowForm, 
  adding,
  setSelectedTransactionType 
}) => {
  const handleSubmit = async (e) => {
    e.preventDefault();
    await handleAddTransaction();
  };

  const resetForm = () => {
    setNewTransaction({ amount: "", description: "", file: null });
    setSelectedTransactionType("");
    setShowForm(false);
  };

  return (
    <>
      <div className="flex gap-4 mb-6">
        <button
          type="button"
          onClick={() => {
            resetForm();
            setSelectedTransactionType("you will get");
            setShowForm(true);
          }}
          className="px-4 py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600"
        >
          You Will Get
        </button>
        <button
          type="button"
          onClick={() => {
            resetForm();
            setSelectedTransactionType("you will give");
            setShowForm(true);
          }}
          className="px-4 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600"
        >
          You Will Give
        </button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => setShowForm(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800">
                  {selectedTransactionType === "you will get" ? "You Will Get" : "You Will Give"}
                </h3>
                <button
                  onClick={() => setShowForm(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="Enter amount"
                    value={newTransaction.amount}
                    onChange={(e) => setNewTransaction({ ...newTransaction, amount: e.target.value })}
                    className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <input
                    type="text"
                    placeholder="Enter description"
                    value={newTransaction.description}
                    onChange={(e) => setNewTransaction({ ...newTransaction, description: e.target.value })}
                    className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Attachment</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setNewTransaction(prev => ({ ...prev, file: e.target.files[0] }))}
                    className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={adding || !newTransaction.amount}
                    className="flex-1 bg-purple-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {adding ? "Adding..." : "Submit"}
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-lg font-semibold hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AddTransactionForm;
