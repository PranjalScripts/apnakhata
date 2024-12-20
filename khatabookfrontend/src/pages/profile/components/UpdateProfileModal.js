import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ProfileUpdate from '../../../components/auth/ProfileUpdate/prorfileupdate';

const UpdateProfileModal = ({ showModal, setShowModal, onUpdate }) => {
  const onClose = () => setShowModal(false);

  return (
    <AnimatePresence>
      {showModal && (
        <motion.div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-lg transform relative"
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h5 className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Update Profile
              </h5>
              <button
                className="text-gray-400 hover:text-gray-600 transition-colors duration-200 focus:outline-none group"
                onClick={onClose}
              >
                <svg
                  className="h-6 w-6 transform group-hover:rotate-90 transition-transform duration-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="p-6">
              <ProfileUpdate onClose={onClose} onUpdate={onUpdate} />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default UpdateProfileModal;
