"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { X } from "lucide-react";

const VirtualLinkModal: React.FC<{ link: string; onClose: () => void }> = ({
  link,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-gray-800 bg-opacity-40 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
        className="bg-white p-6 md:p-10 rounded-xl shadow-lg relative max-w-md w-full mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors duration-300"
        >
          <motion.div
            whileHover={{ rotate: 90 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <X size={24} />
          </motion.div>
        </button>

        {/* Modal Header */}
        <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4">
          Virtual Event Link
        </h2>

        {/* Modal Body */}
        <p className="mb-4 text-gray-600">Here’s your virtual event link:</p>
        <div className="flex items-center mb-6">
          <input
            type="text"
            value={link}
            readOnly
            className="flex-grow p-2 md:p-3 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
          &nbsp;
          <button
            onClick={handleCopy}
            className={`px-4 py-2 md:px-6 md:py-2.5 bg-blue-400 text-white rounded-r-lg hover:bg-blue-500 transition-colors duration-300 ${
              copied ? "bg-green-400 hover:bg-green-500" : ""
            }`}
          >
            {copied ? "Copied!" : "Copy Link"}
          </button>
        </div>

        {/* Modal Footer */}
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-600 rounded-lg hover:bg-gray-300 transition-colors duration-300"
          >
            Close
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default VirtualLinkModal;