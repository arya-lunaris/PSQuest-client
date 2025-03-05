import React, { useEffect } from "react";
import { motion } from "framer-motion";

const Modal = ({ isOpen, onClose, message }) => {
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onClose();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.3 }}
        className="bg-white p-4 rounded-lg shadow-xl w-50 text-center border border-gray-300"
      >
        <p className="text-sm">{message}</p>
      </motion.div>
    </div>
  );
};

export default Modal;
