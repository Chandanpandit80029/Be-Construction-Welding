import React, { useState } from 'react';
import { getImageUrl } from '../../utils/image';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaMapMarkerAlt, FaCalendar, FaArrowRight, FaExpand } from 'react-icons/fa';

const ProjectCard = ({ project, index = 0, showCategory = true }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);

  const placeholderImage = "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&h=600&fit=crop";
  const projectSlug = project.slug || project.id;

  const imageSrc = !imageError 
    ? (getImageUrl(project.thumbnail) || getImageUrl(project.image) || getImageUrl(project.galleryImages?.[0]) || getImageUrl(project.images?.[0]) || placeholderImage)
    : placeholderImage;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className="relative h-48 sm:h-56 md:h-64 overflow-hidden">
        <img
          src={imageSrc}
          alt={project.title || 'Project image'}
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          onError={() => setImageError(true)}
        />

        {/* Overlay */}
        <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-60'}`} />

        {/* Category Badge - Mobile friendly */}
        {showCategory && project.category && (
          <div className="absolute top-3 left-3 sm:top-4 sm:left-4">
            <span className="px-2.5 py-1 bg-[#FBBF24] text-[#111111] text-xs font-semibold rounded-full">
              {project.category}
            </span>
          </div>
        )}

        {/* Status Badge */}
        {project.status && (
          <div className="absolute top-3 right-3 sm:top-4 sm:right-4">
            <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
              project.status === 'Completed' 
                ? 'bg-green-500 text-white' 
                : project.status === 'Ongoing'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-500 text-white'
            }`}>
              {project.status}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 sm:p-5">
        <h3 className="text-base sm:text-lg font-bold text-[#111111] mb-2 group-hover:text-[#FBBF24] transition-colors duration-300 line-clamp-1">
          {project.title}
        </h3>
        <p className="text-gray-600 text-sm mb-3 sm:mb-4 line-clamp-2">
          {project.shortDescription || project.description}
        </p>

        {/* Meta info */}
        <div className="flex items-center justify-between text-xs sm:text-sm text-gray-500 mb-3 sm:mb-4 gap-2">
          {project.location && (
            <div className="flex items-center space-x-1 min-w-0">
              <FaMapMarkerAlt className="text-[#FBBF24] flex-shrink-0" />
              <span className="truncate">{project.location}</span>
            </div>
          )}
          {project.budget && (
            <div className="flex items-center space-x-1 flex-shrink-0">
              <span className="text-[#FBBF24] font-medium text-xs">₹</span>
              <span>{project.budget}</span>
            </div>
          )}
          {project.completionDate && (
            <div className="flex items-center space-x-1 flex-shrink-0">
              <FaCalendar className="text-[#FBBF24]" />
              <span>{new Date(project.completionDate).getFullYear()}</span>
            </div>
          )}
        </div>

        {/* CTA */}
        <Link
          to={`/projects/${projectSlug}`}
          className="inline-flex items-center space-x-2 text-[#FBBF24] font-semibold hover:text-[#D97706] transition-colors duration-300 group/link text-sm sm:text-base"
        >
          <span>View Details</span>
          <FaArrowRight className="transform group-hover/link:translate-x-1 transition-transform duration-300 text-xs" />
        </Link>
      </div>
    </motion.div>
  );
};

export default ProjectCard;
