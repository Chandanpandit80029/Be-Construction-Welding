import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaChevronRight, FaPlay, FaPause, FaArrowRight, FaSpinner } from 'react-icons/fa';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination, EffectFade } from 'swiper/modules';
import { useRealtimeCollection } from '../../hooks/useFirestore';
import { companyInfo } from '../../constants';
import { getImageUrl } from '../../utils/image';

const defaultSlides = [
  {
    id: 'default-1',
    image: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=1920&h=1080&fit=crop',
    title: 'Building Dreams,',
    subtitle: 'Forging Excellence',
    description: companyInfo.description,
    button1Text: 'Get Free Quote',
    button1Link: '/quote',
    button2Text: 'View Projects',
    button2Link: '/projects',
    overlay: 0.5,
  },
  {
    id: 'default-2',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1920&h=1080&fit=crop',
    title: 'Precision Welding,',
    subtitle: 'Stronger Structures',
    description: 'Expert welding and fabrication services for industrial, commercial, and residential projects.',
    button1Text: 'Our Services',
    button1Link: '/services',
    button2Text: 'Contact Us',
    button2Link: '/contact',
    overlay: 0.55,
  },
  {
    id: 'default-3',
    image: 'https://images.unsplash.com/photo-1541888946425-d81bb51b6c79?w=1920&h=1080&fit=crop',
    title: '15+ Years of',
    subtitle: 'Construction Excellence',
    description: 'Trusted by 350+ clients for quality construction, steel fabrication, and welding solutions.',
    button1Text: 'About Us',
    button1Link: '/about',
    button2Text: 'Get a Quote',
    button2Link: '/quote',
    overlay: 0.6,
  },
];

const HeroSlider = () => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [swiperInstance, setSwiperInstance] = useState(null);
  const [swiperReady, setSwiperReady] = useState(false);
  const [imageErrors, setImageErrors] = useState({});
  const [mounted, setMounted] = useState(false);
  const sectionRef = useRef(null);
  
  const { data: heroSlides, loading: slidesLoading } = useRealtimeCollection('heroSlides', {
    orderBy: 'order',
    orderDirection: 'asc',
  });

  // Use defaults if Firebase data is empty or still loading
  const slides = (heroSlides?.length > 0) ? heroSlides : defaultSlides;

  // Mark component as mounted for client-side rendering
  useEffect(() => {
    setMounted(true);
  }, []);

  // Ensure Swiper re-initializes when slides are ready
  useEffect(() => {
    if (!slidesLoading && slides?.length > 0) {
      // Small delay to ensure DOM is ready
      const timer = setTimeout(() => {
        setSwiperReady(true);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [slidesLoading, slides]);

  // Force Swiper update on mobile when orientation changes
  useEffect(() => {
    const handleResize = () => {
      if (swiperInstance) {
        setTimeout(() => {
          swiperInstance.update();
        }, 200);
      }
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, [swiperInstance]);

  const togglePlay = useCallback(() => {
    if (swiperInstance) {
      if (isPlaying) {
        swiperInstance.autoplay.stop();
      } else {
        swiperInstance.autoplay.start();
      }
      setIsPlaying(!isPlaying);
    }
  }, [swiperInstance, isPlaying]);

  // Handle image load error - use fallback
  const handleImageError = useCallback((slideId) => {
    setImageErrors(prev => ({ ...prev, [slideId]: true }));
  }, []);

  // Get the background style for a slide (handles both normal images and fallbacks)
  const getSlideBackgroundStyle = useCallback((slide) => {
    if (imageErrors[slide.id]) {
      return {
        background: 'linear-gradient(135deg, #111111 0%, #1F2937 50%, #374151 100%)',
      };
    }
    return {};
  }, [imageErrors]);

  const hasSlides = slides?.length > 0;

  return (
    <section 
      ref={sectionRef} 
      className="relative w-full h-screen max-h-screen min-h-screen overflow-hidden bg-[#111111] hero-swiper"
    >
      {/* Always show a dark background while loading */}
      {!hasSlides && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#111111] z-30">
          <div className="text-center">
            <FaSpinner className="text-[#FBBF24] text-3xl animate-spin mx-auto mb-4" />
            <p className="text-white/60 text-sm">Loading...</p>
          </div>
        </div>
      )}

      {hasSlides && mounted && (
        <Swiper
          modules={[Autoplay, Navigation, Pagination, EffectFade]}
          effect="fade"
          navigation={{
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
          }}
          pagination={{ clickable: true, dynamicBullets: true }}
          autoplay={{ delay: 6000, disableOnInteraction: false }}
          loop={true}
          className="h-full w-full"
          speed={800}
          watchSlidesProgress={true}
          resizeObserver={true}
          onSwiper={(swiper) => {
            setSwiperInstance(swiper);
            setSwiperReady(true);
            // Force multiple updates for mobile
            setTimeout(() => swiper?.update?.(), 100);
            setTimeout(() => swiper?.update?.(), 300);
            setTimeout(() => swiper?.update?.(), 600);
          }}
          onInit={(swiper) => {
            // Force update on init for mobile height
            setTimeout(() => swiper?.update?.(), 50);
            setTimeout(() => swiper?.update?.(), 150);
          }}
          onSlideChange={() => {
            // Ensure height stays correct after slide change on mobile
            if (swiperInstance) {
              setTimeout(() => swiperInstance.update(), 100);
            }
          }}
        >
          {slides.map((slide) => (
            <SwiperSlide key={slide.id} className="!h-full !w-full">
              <div 
                className="relative h-full w-full overflow-hidden"
                style={getSlideBackgroundStyle(slide)}
              >
                {/* BACKGROUND IMAGE - Always render the container to prevent black screen */}
                {slide.video ? (
                  <video
                    autoPlay muted loop playsInline preload="auto"
                    className="absolute top-0 left-0 w-full h-full object-cover"
                  >
                    <source src={slide.video} type="video/mp4" />
                  </video>
                ) : (
                  <>
                    {/* Always render an img tag, even if previous error - let it retry on re-mount */}
                    {!imageErrors[slide.id] && (
                      <img
                        src={getImageUrl(slide.image) || defaultSlides[0].image}
                        alt={slide.title || 'Hero slide'}
                        className="absolute top-0 left-0 w-full h-full object-cover bg-cover bg-center"
                        loading="eager"
                        fetchPriority="high"
                        onError={() => handleImageError(slide.id)}
                        style={{ 
                          display: 'block',
                          minHeight: '100%',
                          minWidth: '100%'
                        }}
                      />
                    )}
                    {/* Fallback gradient - visible only if image fails */}
                    {imageErrors[slide.id] && (
                      <div className="absolute inset-0 bg-gradient-to-br from-[#111111] via-[#1F2937] to-[#374151] w-full h-full" />
                    )}
                  </>
                )}
                
                {/* DARK OVERLAY - Reduced opacity on mobile */}
                <div 
                  className="absolute inset-0 z-[1]"
                  style={{ 
                    background: `linear-gradient(to bottom, rgba(0,0,0,${Math.min(slide.overlay || 0.5, 0.45)}), rgba(0,0,0,${Math.min((slide.overlay || 0.5) + 0.15, 0.6)}))`,
                  }}
                />
                
                {/* PATTERN OVERLAY */}
                <div className="absolute inset-0 z-[2] pattern-grid opacity-5 md:opacity-10" />

                {/* CONTENT - Fixed z-index stacking to be above overlays */}
                <div className="absolute inset-0 z-10 flex items-center justify-center px-4 sm:px-6 pt-24 md:pt-28 pb-16 md:pb-24">
                  <div className="w-full max-w-3xl mx-auto text-center">
                    
                    {/* BADGE */}
                    <motion.div
                      key={`${slide.id}-badge`}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.15, duration: 0.5 }}
                    >
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 mb-3 sm:mb-6 bg-black/40 backdrop-blur-md border border-[#FBBF24]/30 rounded-full text-[#FBBF24] text-[11px] sm:text-xs font-semibold">
                        <span className="w-1.5 h-1.5 bg-[#FBBF24] rounded-full animate-pulse" />
                        {companyInfo.shortName.toUpperCase()}
                      </span>
                    </motion.div>

                    {/* TITLE */}
                    <motion.h1
                      key={`${slide.id}-title`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3, duration: 0.6 }}
                      className="text-2xl leading-tight sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-2 sm:mb-3 max-w-full break-words relative"
                    >
                      {slide.title && <span className="block">{slide.title}</span>}
                      {slide.subtitle && (
                        <span className="text-[#FBBF24]">{slide.subtitle}</span>
                      )}
                    </motion.h1>

                    {/* DESCRIPTION */}
                    {slide.description && (
                      <motion.p
                        key={`${slide.id}-desc`}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.45, duration: 0.6 }}
                        className="text-xs sm:text-sm md:text-base lg:text-lg text-gray-300 mb-4 sm:mb-8 max-w-xl mx-auto leading-relaxed line-clamp-2 sm:line-clamp-3 md:line-clamp-none px-2 sm:px-0"
                      >
                        {slide.description}
                      </motion.p>
                    )}

                    {/* BUTTONS */}
                    <motion.div
                      key={`${slide.id}-btns`}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6, duration: 0.6 }}
                      className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full px-2 sm:px-0"
                    >
                      {slide.button1Text && (
                        <Link
                          to={slide.button1Link || '/quote'}
                          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#FBBF24] text-[#111111] px-5 sm:px-8 py-3 rounded-xl font-bold text-sm sm:text-base hover:bg-[#D97706] transition-all duration-300 shadow-lg shadow-[#FBBF24]/30 min-h-[46px]"
                        >
                          <span>{slide.button1Text}</span>
                          <FaArrowRight className="text-xs" />
                        </Link>
                      )}
                      {slide.button2Text && (
                        <Link
                          to={slide.button2Link || '/projects'}
                          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border-2 border-white/30 text-white px-5 sm:px-8 py-3 rounded-xl font-bold text-sm sm:text-base hover:bg-white hover:text-[#111111] transition-all duration-300 min-h-[46px]"
                        >
                          <span>{slide.button2Text}</span>
                          <FaChevronRight className="text-xs" />
                        </Link>
                      )}
                    </motion.div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      )}

      {/* Fallback static display when Swiper is not ready but slides exist */}
      {hasSlides && !mounted && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#111111] z-30">
          <div className="text-center">
            <FaSpinner className="text-[#FBBF24] text-3xl animate-spin mx-auto mb-4" />
            <p className="text-white/60 text-sm">Loading...</p>
          </div>
        </div>
      )}

      {/* PLAY/PAUSE BUTTON - only show when swiper is active */}
      {hasSlides && (
        <button
          onClick={togglePlay}
          className="absolute bottom-20 sm:bottom-8 right-4 sm:right-6 z-20 w-9 h-9 sm:w-11 sm:h-11 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center text-white/70 hover:bg-white/20 hover:text-white transition-all border border-white/15"
          aria-label={isPlaying ? 'Pause slideshow' : 'Play slideshow'}
        >
          {isPlaying ? <FaPause className="text-[10px] sm:text-xs" /> : <FaPlay className="text-[10px] sm:text-xs" />}
        </button>
      )}

      {/* SCROLL INDICATOR - desktop only */}
      <motion.div
        className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 hidden sm:flex flex-col items-center gap-1.5"
        animate={{ y: [0, 5, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <span className="text-[9px] text-white/40 uppercase tracking-[0.2em] font-medium">Scroll</span>
        <div className="w-3.5 h-6 border-2 border-white/20 rounded-full flex items-start justify-center p-1">
          <div className="w-0.5 h-2 bg-[#FBBF24] rounded-full" />
        </div>
      </motion.div>

      {/* NAVIGATION ARROWS - desktop only */}
      <div className="hidden lg:block">
        <div className="swiper-button-next !text-[#FBBF24] after:!text-lg !w-12 !h-12 !bg-black/40 !backdrop-blur-sm !rounded-full hover:!bg-black/60 !transition-all" />
        <div className="swiper-button-prev !text-[#FBBF24] after:!text-lg !w-12 !h-12 !bg-black/40 !backdrop-blur-sm !rounded-full hover:!bg-black/60 !transition-all" />
      </div>
    </section>
  );
};

export default HeroSlider;