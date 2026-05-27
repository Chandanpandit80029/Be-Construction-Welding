import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaArrowRight, FaTools, FaHammer, FaIndustry, FaHome, FaWarehouse, FaCog, FaBuilding, FaFire, FaWrench } from 'react-icons/fa';

// Service icon map (avoid importing all react-icons)
const iconMap = {
  FaTools,       // Metal Works / Tools
  FaFire,        // Welding Work (replaces FaWelding)
  FaHammer,      // Steel Fabrication
  FaIndustry,    // Industrial Construction
  FaHome,        // Residential Construction
  FaWarehouse,   // Roofing Structure
  FaWrench,      // Gate & Grill Fabrication (replaces FaDoorClosed)
  FaCog,         // Machine Welding
  FaBuilding     // Civil Construction
};

const ServiceCard = ({ service, index = 0 }) => {
  const IconComponent = iconMap[service.icon] || FaTools;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className="group bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300"
    >
      {/* Icon Header */}
      <div className="relative h-28 sm:h-32 bg-gradient-to-br from-[#111111] to-[#1F2937] flex items-center justify-center overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-4 left-4 w-16 h-16 border-2 border-[#FBBF24] rounded-full" />
          <div className="absolute bottom-4 right-4 w-20 h-20 border-2 border-[#FBBF24] rounded-full" />
        </div>
        
        {/* Icon */}
        <div className="relative z-10">
          <div className="w-14 h-14 sm:w-16 sm:h-16 bg-[#FBBF24] rounded-2xl flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg">
            <IconComponent className="text-2xl sm:text-3xl text-[#111111]" />
          </div>
        </div>

        {/* Bottom accent */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#FBBF24] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
      </div>

      {/* Content */}
      <div className="p-4 sm:p-6">
        <h3 className="text-base sm:text-lg md:text-xl font-bold text-[#111111] mb-2 sm:mb-3 group-hover:text-[#FBBF24] transition-colors duration-300">
          {service.title}
        </h3>
        <p className="text-gray-600 text-sm mb-3 sm:mb-4 line-clamp-2">
          {service.description}
        </p>

        {/* Features preview */}
        {service.features && service.features.length > 0 && (
          <ul className="mb-3 sm:mb-5 space-y-1.5 sm:space-y-2">
            {service.features.slice(0, 3).map((feature, idx) => (
              <li key={idx} className="flex items-center text-xs sm:text-sm text-gray-600">
                <span className="w-1.5 h-1.5 bg-[#FBBF24] rounded-full mr-2 flex-shrink-0" />
                <span className="line-clamp-1">{feature}</span>
              </li>
            ))}
          </ul>
        )}

        {/* CTA */}
        <Link
          to={`/services/${service.slug}`}
          className="inline-flex items-center space-x-2 text-[#FBBF24] font-semibold hover:text-[#D97706] transition-colors duration-300 group/link text-sm sm:text-base"
        >
          <span>Learn More</span>
          <FaArrowRight className="transform group-hover/link:translate-x-1 transition-transform duration-300 text-xs" />
        </Link>
      </div>
    </motion.div>
  );
};

export default ServiceCard;