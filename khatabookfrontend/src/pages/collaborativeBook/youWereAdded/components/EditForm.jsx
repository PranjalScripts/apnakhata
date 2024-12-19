import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes, FaFileUpload } from "react-icons/fa";

const EditForm = ({ editData, setEditData, handleEditSubmit, closeEditForm }) => {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden mx-auto my-4"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-violet-500 to-purple-600 p-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-white">
                Edit Transaction
              </h3>
              <button
                onClick={closeEditForm}
                className="text-white/80 hover:text-white transition-colors p-1 hover:bg-white/10 rounded-lg"
              >
                <FaTimes className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Form */}
          <div className="p-4 space-y-4">
            <form onSubmit={handleEditSubmit}>
              <div className="space-y-4">
                {/* Amount Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Amount
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
                    <input
                      type="number"
                      value={editData.amount}
                      onChange={(e) =>
                        setEditData({ ...editData, amount: e.target.value })
                      }
                      onKeyDown={(e) => {
                        if (e.key === 'e' || e.key === 'E') {
                          e.preventDefault();
                        }
                      }}
                      className="w-full pl-8 border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 
                      focus:ring-violet-500 focus:border-transparent transition-all duration-200
                      [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      placeholder="Enter amount"
                      required
                    />
                  </div>
                </div>

                {/* Transaction Type Select */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Transaction Type
                  </label>
                  <select
                    value={editData.transactionType}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        transactionType: e.target.value,
                      })
                    }
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 
                    focus:ring-violet-500 focus:border-transparent transition-all duration-200 
                    appearance-none bg-white"
                    required
                  >
                    <option value="" disabled>
                      Select Transaction Type
                    </option>
                    <option value="you will get">You Will Get</option>
                    <option value="you will give">You Will Give</option>
                  </select>
                </div>

                {/* Description Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    placeholder="Enter transaction description"
                    value={editData.description}
                    onChange={(e) =>
                      setEditData((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 
                    focus:ring-violet-500 focus:border-transparent transition-all duration-200 resize-none"
                    rows="2"
                  />
                </div>

                {/* File Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Update Attachment
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      onChange={(e) =>
                        setEditData((prev) => ({
                          ...prev,
                          file: e.target.files[0],
                        }))
                      }
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 
                      focus:ring-violet-500 focus:border-transparent transition-all duration-200
                      file:mr-3 file:py-1.5 file:px-3 file:rounded-full file:border-0
                      file:text-sm file:font-medium file:bg-violet-50 file:text-violet-700
                      hover:file:bg-violet-100 text-sm"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                      <FaFileUpload className="w-4 h-4" />
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-3">
                  <button
                    type="button"
                    onClick={closeEditForm}
                    className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium
                    hover:bg-gray-200 transform hover:scale-[1.02] transition-all duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-violet-500 to-purple-600 text-white px-4 py-2 rounded-lg 
                    text-sm font-medium hover:from-violet-600 hover:to-purple-700 transform hover:scale-[1.02] 
                    transition-all duration-200 shadow-md hover:shadow-lg active:scale-[0.98]"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </form>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default EditForm;
