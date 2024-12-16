 import React, { useEffect } from 'react';
 import { motion, LazyMotion, domAnimation } from 'framer-motion';
 
 const SuccessModal = ({ isOpen, onClose, message }) => {
   useEffect(() => {
     if (isOpen) {
       const timer = setTimeout(() => {
         onClose();
       }, 2000); // Close after 2 seconds
       return () => clearTimeout(timer);
     }
   }, [isOpen, onClose]);
 
   return (
     <LazyMotion features={domAnimation}>
       {isOpen && (
         <motion.div
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           exit={{ opacity: 0 }}
           className="fixed inset-0 flex items-center justify-center z-50"
         >
           <div className="fixed inset-0 bg-black bg-opacity-30"></div>
           <motion.div
             initial={{ scale: 0.5, opacity: 0 }}
             animate={{ scale: 1, opacity: 1 }}
             exit={{ scale: 0.5, opacity: 0 }}
             className="bg-white rounded-lg p-6 shadow-xl relative z-10 flex flex-col items-center"
           >
             <motion.div
               initial={{ scale: 0 }}
               animate={{ scale: 1 }}
               transition={{ delay: 0.2 }}
               className="w-16 h-16 rounded-full bg-gradient-to-r from-green-400 to-blue-500 flex items-center justify-center mb-4"
             >
               <motion.svg
                 initial={{ pathLength: 0 }}
                 animate={{ pathLength: 1 }}
                 transition={{ duration: 0.5, delay: 0.2 }}
                 className="w-8 h-8 text-white"
                 fill="none"
                 viewBox="0 0 24 24"
                 stroke="currentColor"
               >
                 <motion.path
                   strokeLinecap="round"
                   strokeLinejoin="round"
                   strokeWidth={2}
                   d="M5 13l4 4L19 7"
                 />
               </motion.svg>
             </motion.div>
             <motion.p
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.3 }}
               className="text-lg font-semibold text-gray-800"
             >
               {message}
             </motion.p>
           </motion.div>
         </motion.div>
       )}
     </LazyMotion>
   );
 };
 
 export default SuccessModal;