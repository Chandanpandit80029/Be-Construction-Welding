import React from 'react';
import { motion } from 'framer-motion';
import { FaStar, FaQuoteRight, FaStarHalfAlt } from 'react-icons/fa';
import { getImageUrl } from '../../utils/image';

const StarRating = ({ rating = 5 }) => {
  const fullStars = Math.floor(rating);
  const hasHalf = rating % 1 !== 0;
  const stars = [];

  for (let i = 0; i < fullStars; i++) {
    stars.push(<FaStar key={`full-${i}`} className="text-[#FBBF24] text-xs sm:text-sm" />);
  }
  if (hasHalf) {
    stars.push(<FaStarHalfAlt key="half" className="text-[#FBBF24] text-xs sm:text-sm" />);
  }
  return <div className="flex space-x-0.5">{stars}</div>;
};

const TestimonialCard = ({ testimonial, index = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 relative"
    >
      {/* Quote Icon */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6">
        <FaQuoteRight className="text-[#FBBF24] text-xl sm:text-2xl opacity-20" />
      </div>

      {/* Rating */}
      <div className="mb-3 sm:mb-4">
        <StarRating rating={testimonial.rating || 5} />
      </div>

      {/* Text */}
      <p className="text-gray-600 text-sm sm:text-base mb-4 sm:mb-6 leading-relaxed line-clamp-4 sm:line-clamp-none">
        "{testimonial.text || testimonial.content}"
      </p>

      {/* Author */}
      <div className="flex items-center space-x-3 sm:space-x-4">
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
          {testimonial.image ? (
            <img
              src={getImageUrl(testimonial.image)}
              alt={testimonial.name}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[#FBBF24] to-[#D97706] flex items-center justify-center text-white font-bold text-sm sm:text-base">
              {testimonial.name?.charAt(0) || 'C'}
            </div>
          )}
        </div>
        <div className="min-w-0">
          <h4 className="font-bold text-[#111111] text-sm sm:text-base">{testimonial.name}</h4>
          <p className="text-gray-500 text-xs sm:text-sm truncate">{testimonial.role || testimonial.company || 'Client'}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default TestimonialCard;