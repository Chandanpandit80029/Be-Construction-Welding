import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaBars, FaTimes, FaPhone, FaEnvelope, FaQuoteRight, 
  FaChevronDown, FaHardHat, FaTools, FaIndustry, FaHome,
  FaCog, FaDoorClosed, FaWarehouse, FaBuilding, FaHammer,
  FaSearch, FaArrowRight, FaStar, FaClock, FaMapMarkerAlt,
  FaChevronRight, FaWhatsapp
} from 'react-icons/fa';
import { navLinks, companyInfo } from '../../constants';
import { useRealtimeCollection } from '../../hooks/useFirestore';

const serviceIcons = {
  'FaWelding': <FaHardHat className="text-lg md:text-xl" />,
  'FaHammer': <FaHammer className="text-lg md:text-xl" />,
  'FaIndustry': <FaIndustry className="text-lg md:text-xl" />,
  'FaHome': <FaHome className="text-lg md:text-xl" />,
  'FaTools': <FaTools className="text-lg md:text-xl" />,
  'FaWarehouse': <FaWarehouse className="text-lg md:text-xl" />,
  'FaDoorClosed': <FaDoorClosed className="text-lg md:text-xl" />,
  'FaCog': <FaCog className="text-lg md:text-xl" />,
  'FaBuilding': <FaBuilding className="text-lg md:text-xl" />,
};

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isServicesMega, setIsServicesMega] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeMobileSubmenu, setActiveMobileSubmenu] = useState(null);
  const megaMenuTimeout = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  const { data: servicesData } = useRealtimeCollection('services', { 
    orderBy: 'createdAt' 
  });

  const displayServices = servicesData?.length > 0 ? servicesData : [];

  // useEffect for useDocument data
  const [settingsData, setSettingsData] = useState(null);
  useEffect(() => {
    import('../../hooks/useFirestore').then(({ getDocument }) => {
      getDocument('websiteSettings', 'general').then(res => {
        if (res.success) setSettingsData(res.data);
      });
    });
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsServicesMega(false);
    setActiveMobileSubmenu(null);
  }, [location]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.top = `-${window.scrollY}px`;
    } else {
      const scrollY = document.body.style.top;
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.top = '';
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
      }
    }
    return () => { 
      document.body.style.overflow = ''; 
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.top = '';
    };
  }, [isMobileMenuOpen]);

  const handleMegaEnter = useCallback(() => {
    clearTimeout(megaMenuTimeout.current);
    setIsServicesMega(true);
  }, []);

  const handleMegaLeave = useCallback(() => {
    megaMenuTimeout.current = setTimeout(() => {
      setIsServicesMega(false);
    }, 200);
  }, []);

  const handleSearch = useCallback((e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  }, [searchQuery, navigate]);

  const isActive = (path) => location.pathname === path;

  const toggleMobileSubmenu = (menuName) => {
    setActiveMobileSubmenu(prev => prev === menuName ? null : menuName);
  };

  const closeMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false);
    setActiveMobileSubmenu(null);
  }, []);

  const mobileNavVariants = {
    hidden: { x: '100%', opacity: 0 },
    visible: { 
      x: 0, 
      opacity: 1,
      transition: { type: 'spring', damping: 28, stiffness: 250 }
    },
    exit: { 
      x: '100%', 
      opacity: 0,
      transition: { type: 'spring', damping: 30, stiffness: 300 }
    }
  };

  const mobileItemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      transition: { delay: i * 0.05, type: 'spring', stiffness: 300 }
    })
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? 'bg-white/98 backdrop-blur-lg shadow-[0_4px_30px_rgba(0,0,0,0.08)] py-1'
            : 'bg-transparent py-2 md:py-3'
        }`}
        style={{ paddingTop: isScrolled ? '0.25rem' : '0.5rem' }}
      >
        {/* Top Bar - Hidden on mobile */}
        <div className={`hidden lg:block transition-all duration-300 ${isScrolled ? 'h-0 overflow-hidden opacity-0' : 'h-auto opacity-100 border-b border-white/10'}`}>
          <div className="container-custom flex justify-between items-center py-2">
            <div className="flex items-center space-x-6 text-sm">
              <a
                href={`tel:${companyInfo.phone}`}
                className={`flex items-center space-x-2 transition-colors ${
                  isScrolled ? 'text-[#111111] hover:text-[#FBBF24]' : 'text-white/90 hover:text-[#FBBF24]'
                }`}
              >
                <FaPhone className="text-[#FBBF24] text-xs" />
                <span>{companyInfo.phone}</span>
              </a>
              <a
                href={`mailto:${companyInfo.email}`}
                className={`flex items-center space-x-2 transition-colors ${
                  isScrolled ? 'text-[#111111] hover:text-[#FBBF24]' : 'text-white/90 hover:text-[#FBBF24]'
                }`}
              >
                <FaEnvelope className="text-[#FBBF24] text-xs" />
                <span>{companyInfo.email}</span>
              </a>
            </div>
            <div className={`flex items-center space-x-4 text-sm ${
              isScrolled ? 'text-[#111111]' : 'text-white/90'
            }`}>
              <FaClock className="text-[#FBBF24] text-xs" />
              <span>{companyInfo.workingHours.weekdays}</span>
            </div>
          </div>
        </div>

        {/* Main Navigation */}
        <div className="container-custom">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2 sm:space-x-3 group">
              <motion.div
                whileHover={{ rotate: 6, scale: 1.05 }}
                className={`w-9 h-9 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center transition-all duration-300 shadow-lg ${
                  isScrolled
                    ? 'bg-[#111111] shadow-[#111111]/20'
                    : 'bg-[#FBBF24] shadow-[#FBBF24]/20'
                }`}
              >
                <span className={`font-bold text-base sm:text-lg ${isScrolled ? 'text-[#FBBF24]' : 'text-[#111111]'}`}>
                  BE
                </span>
              </motion.div>
              <div className="hidden xs:block sm:block">
                <h1 className={`font-bold text-sm sm:text-base leading-tight transition-colors duration-300 ${
                  isScrolled ? 'text-[#111111]' : 'text-white'
                }`}>
                  {companyInfo.shortName}
                </h1>
                <p className={`text-[10px] sm:text-xs font-medium tracking-wide uppercase transition-colors duration-300 ${
                  isScrolled ? 'text-[#FBBF24]' : 'text-[#FBBF24]'
                }`}>
                  {companyInfo.tagline}
                </p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-1">
              {navLinks.map((link) => {
                if (link.isButton) {
                  return (
                    <Link
                      key={link.path}
                      to={link.path}
                      className="ml-3 flex items-center space-x-2 bg-[#FBBF24] text-[#111111] px-5 py-2.5 rounded-lg font-semibold hover:bg-[#D97706] transition-all duration-300 transform hover:scale-105 shadow-lg shadow-[#FBBF24]/25 hover:shadow-[#FBBF24]/40"
                    >
                      <FaQuoteRight className="text-sm" />
                      <span>{link.name}</span>
                    </Link>
                  );
                }

                // Services link with mega menu
                if (link.path === '/services') {
                  return (
                    <div
                      key={link.path}
                      className="relative"
                      onMouseEnter={handleMegaEnter}
                      onMouseLeave={handleMegaLeave}
                    >
                      <Link
                        to={link.path}
                        className={`flex items-center space-x-1 px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                          isActive(link.path)
                            ? 'text-[#FBBF24] bg-[#FBBF24]/10'
                            : isScrolled
                              ? 'text-[#111111] hover:text-[#FBBF24] hover:bg-gray-100'
                              : 'text-white/90 hover:text-[#FBBF24] hover:bg-white/10'
                        }`}
                      >
                        <span>{link.name}</span>
                        <FaChevronDown className={`text-xs transition-transform duration-300 ${isServicesMega ? 'rotate-180' : ''}`} />
                      </Link>

                      {/* Mega Menu */}
                      <AnimatePresence>
                        {isServicesMega && (
                          <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                            className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[700px] bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden"
                            onMouseEnter={handleMegaEnter}
                            onMouseLeave={handleMegaLeave}
                          >
                            <div className="p-6">
                              <div className="grid grid-cols-3 gap-3">
                                {(displayServices.length > 0 ? displayServices : [
                                  { title: 'Welding Work', slug: 'welding-work', icon: 'FaHardHat', description: 'Professional welding services for all metals' },
                                  { title: 'Steel Fabrication', slug: 'steel-fabrication', icon: 'FaHammer', description: 'Custom steel fabrication solutions' },
                                  { title: 'Industrial Construction', slug: 'industrial-construction', icon: 'FaIndustry', description: 'Complete industrial solutions' },
                                  { title: 'Residential Construction', slug: 'residential-construction', icon: 'FaHome', description: 'Building dream homes' },
                                  { title: 'Metal Works', slug: 'metal-works', icon: 'FaTools', description: 'Custom metal work solutions' },
                                  { title: 'Roofing Structure', slug: 'roofing-structure', icon: 'FaWarehouse', description: 'Professional roofing solutions' },
                                ]).slice(0, 6).map((service, idx) => (
                                  <Link
                                    key={service.slug || idx}
                                    to={`/services/${service.slug || service.title?.toLowerCase().replace(/\s+/g, '-')}`}
                                    className="flex items-start space-x-3 p-3 rounded-xl hover:bg-[#FBBF24]/5 hover:border-[#FBBF24]/20 border border-transparent transition-all duration-200 group/mega"
                                  >
                                    <div className="w-10 h-10 bg-[#FBBF24]/10 rounded-lg flex items-center justify-center text-[#FBBF24] group-hover/mega:bg-[#FBBF24] group-hover/mega:text-white transition-all duration-200 flex-shrink-0">
                                      {serviceIcons[service.icon] || <FaHardHat className="text-xl" />}
                                    </div>
                                    <div>
                                      <h4 className="font-semibold text-[#111111] text-sm group-hover/mega:text-[#D97706] transition-colors">
                                        {service.title}
                                      </h4>
                                      <p className="text-gray-500 text-xs mt-0.5 line-clamp-1">
                                        {service.shortDescription || service.description || ''}
                                      </p>
                                    </div>
                                  </Link>
                                ))}
                              </div>
                              <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                                <p className="text-xs text-gray-400">
                                  <FaStar className="inline mr-1 text-[#FBBF24]" />
                                  Trusted by 350+ clients
                                </p>
                                <Link
                                  to="/services"
                                  className="text-sm font-semibold text-[#FBBF24] hover:text-[#D97706] transition-colors flex items-center space-x-1"
                                >
                                  <span>View All Services</span>
                                  <FaArrowRight className="text-xs" />
                                </Link>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                }

                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                      isActive(link.path)
                        ? 'text-[#FBBF24] bg-[#FBBF24]/10 border border-[#FBBF24]/20'
                        : isScrolled
                          ? 'text-[#111111] hover:text-[#FBBF24] hover:bg-gray-100'
                          : 'text-white/90 hover:text-[#FBBF24] hover:bg-white/10'
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}

              {/* Search Button */}
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className={`p-2.5 rounded-lg transition-all duration-300 ${
                  isScrolled
                    ? 'text-[#111111] hover:text-[#FBBF24] hover:bg-gray-100'
                    : 'text-white/90 hover:text-[#FBBF24] hover:bg-white/10'
                }`}
                aria-label="Search"
              >
                <FaSearch className="text-lg" />
              </button>
            </nav>

            {/* Mobile Actions (Phone + Menu) - proper spacing between icons */}
            <div className="flex items-center gap-3 lg:hidden">
              {/* Mobile Call Button */}
              <a
                href={`tel:${companyInfo.phone}`}
                className={`p-2.5 rounded-lg transition-all duration-300 flex items-center justify-center ${
                  isScrolled
                    ? 'text-[#111111] bg-gray-100 hover:bg-gray-200'
                    : 'text-white bg-white/10 hover:bg-white/20'
                }`}
                aria-label="Call us"
              >
                <FaPhone className="text-base sm:text-lg" />
              </a>
              
              {/* Mobile WhatsApp Button */}
              <a
                href={`https://wa.me/${companyInfo.phone?.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className={`p-2.5 rounded-lg transition-all duration-300 flex items-center justify-center ${
                  isScrolled
                    ? 'text-green-600 bg-green-50 hover:bg-green-100'
                    : 'text-green-400 bg-white/10 hover:bg-white/20'
                }`}
                aria-label="WhatsApp"
              >
                <FaWhatsapp className="text-base sm:text-lg" />
              </a>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={`p-2.5 rounded-lg transition-colors border ${
                  isScrolled
                    ? 'text-[#111111] border-gray-200 hover:bg-gray-100'
                    : 'text-white border-white/20 hover:bg-white/10'
                }`}
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? (
                  <FaTimes className="text-lg" />
                ) : (
                  <FaBars className="text-lg" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Search Bar Dropdown */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-white border-t border-gray-100 shadow-lg"
            >
              <div className="container-custom py-4">
                <form onSubmit={handleSearch} className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search services, projects, articles..."
                    className="w-full pl-12 pr-6 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-[#FBBF24] focus:ring-2 focus:ring-[#FBBF24]/10 outline-none transition-all text-[#111111]"
                    autoFocus
                  />
                  <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <button
                    type="submit"
                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-[#FBBF24] text-[#111111] px-4 py-1.5 rounded-lg font-semibold text-sm hover:bg-[#D97706] transition-colors"
                  >
                    Search
                  </button>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Mobile Menu Overlay - Full Screen Slide */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
              onClick={closeMobileMenu}
            />
            <motion.div
              variants={mobileNavVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fixed top-0 right-0 bottom-0 w-full max-w-sm bg-white z-50 lg:hidden shadow-2xl"
            >
              <div className="flex flex-col h-full">
                {/* Mobile Drawer Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                  <Link to="/" className="flex items-center space-x-2" onClick={closeMobileMenu}>
                    <div className="w-9 h-9 bg-[#111111] rounded-xl flex items-center justify-center">
                      <span className="text-[#FBBF24] font-bold text-sm">BE</span>
                    </div>
                    <div>
                      <h2 className="font-bold text-[#111111] text-sm">{companyInfo.shortName}</h2>
                    </div>
                  </Link>
                  <button
                    onClick={closeMobileMenu}
                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    aria-label="Close menu"
                  >
                    <FaTimes className="text-lg text-[#111111]" />
                  </button>
                </div>

                {/* Mobile Search */}
                <div className="px-4 py-3 border-b border-gray-100">
                  <form onSubmit={(e) => { 
                    e.preventDefault(); 
                    if(searchQuery.trim()) {
                      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`); 
                      closeMobileMenu();
                    }
                  }}>
                    <div className="relative">
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search..."
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 rounded-lg border border-gray-200 focus:border-[#FBBF24] outline-none text-sm text-[#111111]"
                      />
                      <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                    </div>
                  </form>
                </div>

                {/* Mobile Navigation */}
                <nav className="flex-1 overflow-y-auto py-2">
                  {navLinks.map((link, index) => {
                    if (link.isButton) {
                      return (
                        <motion.div
                          key={link.path}
                          custom={index}
                          variants={mobileItemVariants}
                          initial="hidden"
                          animate="visible"
                          className="px-4 py-2"
                        >
                          <Link
                            to={link.path}
                            onClick={closeMobileMenu}
                            className="flex items-center justify-center space-x-2 bg-[#FBBF24] text-[#111111] px-5 py-3.5 rounded-xl font-semibold hover:bg-[#D97706] transition-all duration-300 shadow-lg shadow-[#FBBF24]/20"
                          >
                            <FaQuoteRight className="text-sm" />
                            <span>{link.name}</span>
                          </Link>
                        </motion.div>
                      );
                    }

                    return (
                      <motion.div
                        key={link.path}
                        custom={index}
                        variants={mobileItemVariants}
                        initial="hidden"
                        animate="visible"
                      >
                        <button
                          onClick={() => {
                            if (link.path === '/services') {
                              toggleMobileSubmenu('services');
                            } else {
                              navigate(link.path);
                              closeMobileMenu();
                            }
                          }}
                          className={`w-full flex items-center px-4 py-3.5 transition-all duration-200 border-l-2 ${
                            isActive(link.path)
                              ? 'text-[#FBBF24] bg-[#FBBF24]/5 border-l-[#FBBF24] font-semibold'
                              : 'text-[#111111] hover:text-[#FBBF24] hover:bg-gray-50 border-l-transparent'
                          }`}
                        >
                          <span className="flex-1 text-left">{link.name}</span>
                          {link.path === '/services' ? (
                            <FaChevronDown className={`text-xs text-gray-400 transition-transform duration-200 ${activeMobileSubmenu === 'services' ? 'rotate-180' : ''}`} />
                          ) : (
                            <FaChevronRight className="text-xs text-gray-400" />
                          )}
                        </button>

                        {/* Mobile Services Submenu */}
                        <AnimatePresence>
                          {link.path === '/services' && activeMobileSubmenu === 'services' && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden bg-gray-50"
                            >
                              <div className="py-2 px-4 space-y-1">
                                {(displayServices.length > 0 ? displayServices : [
                                  { title: 'Welding Work', slug: 'welding-work', icon: 'FaHardHat' },
                                  { title: 'Steel Fabrication', slug: 'steel-fabrication', icon: 'FaHammer' },
                                  { title: 'Industrial Construction', slug: 'industrial-construction', icon: 'FaIndustry' },
                                  { title: 'Residential Construction', slug: 'residential-construction', icon: 'FaHome' },
                                  { title: 'Metal Works', slug: 'metal-works', icon: 'FaTools' },
                                  { title: 'Roofing Structure', slug: 'roofing-structure', icon: 'FaWarehouse' },
                                ]).slice(0, 6).map((service) => (
                                  <Link
                                    key={service.slug || service.title}
                                    to={`/services/${service.slug || service.title?.toLowerCase().replace(/\s+/g, '-')}`}
                                    onClick={closeMobileMenu}
                                    className="flex items-center space-x-3 px-3 py-2.5 rounded-lg hover:bg-white hover:shadow-sm transition-all text-sm"
                                  >
                                    <div className="w-8 h-8 bg-[#FBBF24]/10 rounded-lg flex items-center justify-center text-[#FBBF24] flex-shrink-0">
                                      {serviceIcons[service.icon] || <FaHardHat className="text-sm" />}
                                    </div>
                                    <span className="text-[#111111] font-medium">{service.title}</span>
                                  </Link>
                                ))}
                                <Link
                                  to="/services"
                                  onClick={closeMobileMenu}
                                  className="flex items-center justify-center space-x-1 text-[#FBBF24] font-semibold py-2.5 text-sm"
                                >
                                  <span>View All Services</span>
                                  <FaArrowRight className="text-xs" />
                                </Link>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    );
                  })}
                </nav>

                {/* Mobile Drawer Footer - Contact Info */}
                <div className="border-t border-gray-100 bg-gray-50 px-4 py-4 space-y-3">
                  <a
                    href={`tel:${companyInfo.phone}`}
                    className="flex items-center space-x-3 text-[#111111] hover:text-[#FBBF24] transition-colors"
                    onClick={closeMobileMenu}
                  >
                    <div className="w-9 h-9 bg-[#FBBF24]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FaPhone className="text-[#FBBF24] text-sm" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Call Us 24/7</p>
                      <p className="font-semibold text-sm">{companyInfo.phone}</p>
                    </div>
                  </a>
                  <a
                    href={`tel:${companyInfo.phone}`}
                    className="flex items-center space-x-3 text-green-600 hover:text-green-700 transition-colors"
                    onClick={closeMobileMenu}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <div className="w-9 h-9 bg-green-50 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FaWhatsapp className="text-green-600 text-sm" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">WhatsApp</p>
                      <p className="font-semibold text-sm">Chat with us</p>
                    </div>
                  </a>
                  <a
                    href={`mailto:${companyInfo.email}`}
                    className="flex items-center space-x-3 text-[#111111] hover:text-[#FBBF24] transition-colors"
                    onClick={closeMobileMenu}
                  >
                    <div className="w-9 h-9 bg-[#FBBF24]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FaEnvelope className="text-[#FBBF24] text-sm" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Email Us</p>
                      <p className="font-semibold text-sm">{companyInfo.email}</p>
                    </div>
                  </a>
                  <div className="flex items-center space-x-3">
                    <div className="w-9 h-9 bg-[#FBBF24]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FaMapMarkerAlt className="text-[#FBBF24] text-sm" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Visit Us</p>
                      <p className="font-semibold text-sm">{companyInfo.address.city}, {companyInfo.address.state}</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;