import React from 'react';
import { motion } from 'framer-motion';

const SectionTitle = ({ 
  subtitle, 
  title, 
  description, 
  centered = true, 
  light = false,
  showLine = true 
}) => {
  return (
    <div className={`mb-8 sm:mb-10 md:mb-12 ${centered ? 'text-center' : 'text-left'}`}>
      {/* Subtitle */}
      {subtitle && (
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className={`inline-block text-xs sm:text-sm font-semibold uppercase tracking-wider mb-1.5 sm:mb-2 ${
            light ? 'text-primary-400' : 'text-primary-500'
          }`}
        >
          {subtitle}
        </motion.span>
      )}

      {/* Title */}
      <motion.h2
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1 }}
        className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 ${
          light ? 'text-white' : 'text-[#111111]'
        }`}
      >
        {title}
      </motion.h2>

      {/* Decorative Line */}
      {showLine && (
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className={`h-1 w-16 sm:w-20 md:w-24 bg-[#FBBF24] rounded-full mb-3 sm:mb-4 ${
            centered ? 'mx-auto' : ''
          }`}
        />
      )}

      {/* Description */}
      {description && (
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className={`text-sm sm:text-base md:text-lg max-w-3xl ${
            centered ? 'mx-auto' : ''
          } ${light ? 'text-gray-300' : 'text-gray-600'}`}
        >
          {description}
        </motion.p>
      )}
    </div>
  );
};

export default SectionTitle;