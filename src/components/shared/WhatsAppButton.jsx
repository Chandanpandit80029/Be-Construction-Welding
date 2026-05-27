import React, { useState } from 'react';
import { FaWhatsapp, FaCommentDots } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { companyInfo } from '../../constants';

const WhatsAppButton = () => {
  const [isHovered, setIsHovered] = useState(false);

  // Clean phone number for WhatsApp link (remove +, spaces, dashes)
  const cleanPhoneNumber = companyInfo.whatsapp.replace(/[^0-9]/g, '');
  const whatsappUrl = `https://wa.me/${cleanPhoneNumber}?text=Hello%20BE%20Construction,%20I%20would%20like%20to%20inquire%20about%20your%20services.`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-4 sm:bottom-8 right-4 sm:left-8 sm:right-auto z-40"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-label="Chat on WhatsApp"
    >
      {/* Tooltip */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 px-4 py-2 bg-white text-gray-800 text-sm rounded-lg whitespace-nowrap shadow-lg"
          >
            Chat with us on WhatsApp
            {/* Arrow */}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-white" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Button */}
      <motion.div
        className="relative w-12 h-12 sm:w-14 sm:h-14 bg-green-500 rounded-full shadow-lg flex items-center justify-center hover:bg-green-600 transition-colors duration-300"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <FaWhatsapp className="text-white text-xl sm:text-2xl" />
        
        {/* Pulse animation ring */}
        <span className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-75" />
        <span className="absolute -inset-1 rounded-full bg-green-500 opacity-20 animate-pulse" />
      </motion.div>

      {/* Quick message button */}
      <AnimatePresence>
        {isHovered && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 flex items-center space-x-2 bg-white text-black px-4 py-2 rounded-full shadow-lg text-sm font-medium hover:bg-gray-50 transition-colors"
            onClick={(e) => {
              e.preventDefault();
              window.open(whatsappUrl, '_blank');
            }}
          >
            <FaCommentDots className="text-green-500" />
            <span>Quick Message</span>
          </motion.button>
        )}
      </AnimatePresence>
    </a>
  );
};

export default WhatsAppButton;