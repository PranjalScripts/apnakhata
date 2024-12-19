import React from "react";
import { motion, LazyMotion, domAnimation } from "framer-motion";

const DeleteConfirmationModal = ({ isOpen, bookName, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <LazyMotion features={domAnimation}>
      <motion.div
        className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[60]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4"
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
        >
          <div className="flex justify-center mb-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3 }}
              className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center"
            >
              <svg
                className="w-8 h-8 text-red-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h3 className="text-xl font-semibold text-gray-900 mb-2 text-center">
              Delete Book
            </h3>
            <p className="text-gray-500 mb-6 text-center">
              Are you sure you want to delete <span className="font-semibold text-gray-700">"{bookName}"</span>? 
              <br />
              <span className="text-red-500">This action cannot be undone.</span>
            </p>
          </motion.div>

          <div className="flex justify-end space-x-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onCancel}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md transition-colors duration-200"
            >
              Cancel
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onConfirm}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors duration-200"
            >
              Delete
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </LazyMotion>
  );
};

export default DeleteConfirmationModal;
