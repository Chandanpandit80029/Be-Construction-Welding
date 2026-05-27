import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FaFacebookF, FaInstagram, FaTwitter, FaLinkedinIn, FaYoutube,
  FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock, FaArrowRight,
  FaHardHat, FaAngleRight, FaPaperPlane, FaWhatsapp
} from 'react-icons/fa';
import { companyInfo, navLinks, services as staticServices } from '../../constants';
import { useRealtimeCollection } from '../../hooks/useFirestore';
import { addDocument } from '../../hooks/useFirestore';

const socialIcons = [
  { icon: FaFacebookF, link: companyInfo.social.facebook, color: 'hover:bg-[#1877F2]' },
  { icon: FaInstagram, link: companyInfo.social.instagram, color: 'hover:bg-[#E4405F]' },
  { icon: FaTwitter, link: companyInfo.social.twitter, color: 'hover:bg-[#1DA1F2]' },
  { icon: FaLinkedinIn, link: companyInfo.social.linkedin, color: 'hover:bg-[#0A66C2]' },
  { icon: FaYoutube, link: companyInfo.social.youtube, color: 'hover:bg-[#FF0000]' },
];

const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [subscribing, setSubscribing] = useState(false);
  const location = useLocation();

  const { data: servicesData } = useRealtimeCollection('services', { 
    orderBy: 'createdAt' 
  });

  const displayServices = (servicesData?.length > 0 ? servicesData : staticServices).slice(0, 6);

  const handleNewsletter = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubscribing(true);
    try {
      await addDocument('newsletter', { email: email.trim(), subscribedAt: new Date().toISOString() });
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 3000);
    } catch (err) {
      console.error('Newsletter subscription failed:', err);
    } finally {
      setSubscribing(false);
    }
  };

  const footerLinks = {
    company: [
      { name: 'About Us', path: '/about' },
      { name: 'Our Services', path: '/services' },
      { name: 'Projects', path: '/projects' },
      { name: 'Gallery', path: '/gallery' },
      { name: 'Blog', path: '/blog' },
      { name: 'Contact Us', path: '/contact' },
    ],
    services: displayServices.map(s => ({
      name: s.title,
      path: `/services/${s.slug || s.title?.toLowerCase().replace(/\s+/g, '-')}`,
    })),
    support: [
      { name: 'Get a Quote', path: '/quote' },
      { name: 'FAQs', path: '/faqs' },
      { name: 'Privacy Policy', path: '/privacy' },
      { name: 'Terms of Service', path: '/terms' },
    ],
  };

  return (
    <footer className="bg-[#111111] text-white relative overflow-hidden">
      {/* Decorative pattern */}
      <div className="absolute inset-0 pattern-hex opacity-30 pointer-events-none" />
      
      {/* Gold top border */}
      <div className="h-1 w-full bg-linear-to-r from-[#FBBF24] via-[#D97706] to-[#FBBF24]" />

      {/* Main Footer Content */}
      <div className="relative z-10 container-custom pt-12 sm:pt-16 pb-8 sm:pb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-8 sm:gap-10">
          {/* Company Info - Full width on mobile */}
          <div className="sm:col-span-2 lg:col-span-2 xl:col-span-2">
            <Link to="/" className="flex items-center space-x-3 mb-4 sm:mb-6">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#FBBF24] rounded-xl flex items-center justify-center flex-shrink-0">
                <FaHardHat className="text-[#111111] text-lg sm:text-xl" />
              </div>
              <div>
                <h3 className="text-white font-bold text-lg sm:text-xl">{companyInfo.shortName}</h3>
                <p className="text-[#FBBF24] text-[10px] sm:text-xs font-medium uppercase tracking-wider">{companyInfo.tagline}</p>
              </div>
            </Link>
            <p className="text-gray-400 mb-4 sm:mb-6 leading-relaxed text-sm">
              {companyInfo.description}
            </p>
            
            {/* Contact Details - Compact on mobile */}
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/5 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                  <FaMapMarkerAlt className="text-[#FBBF24] text-xs sm:text-sm" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-gray-400 text-[10px] sm:text-xs uppercase tracking-wider font-medium">Address</p>
                  <p className="text-white text-xs sm:text-sm break-words">
                    {companyInfo.address.street}<br />
                    {companyInfo.address.city}, {companyInfo.address.state} {companyInfo.address.zipCode}
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/5 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                  <FaPhone className="text-[#FBBF24] text-xs sm:text-sm" />
                </div>
                <div>
                  <p className="text-gray-400 text-[10px] sm:text-xs uppercase tracking-wider font-medium">Phone</p>
                  <a href={`tel:${companyInfo.phone}`} className="text-white text-xs sm:text-sm hover:text-[#FBBF24] transition-colors">
                    {companyInfo.phone}
                  </a>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/5 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                  <FaEnvelope className="text-[#FBBF24] text-xs sm:text-sm" />
                </div>
                <div>
                  <p className="text-gray-400 text-[10px] sm:text-xs uppercase tracking-wider font-medium">Email</p>
                  <a href={`mailto:${companyInfo.email}`} className="text-white text-xs sm:text-sm hover:text-[#FBBF24] transition-colors break-all">
                    {companyInfo.email}
                  </a>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/5 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                  <FaClock className="text-[#FBBF24] text-xs sm:text-sm" />
                </div>
                <div>
                  <p className="text-gray-400 text-[10px] sm:text-xs uppercase tracking-wider font-medium">Working Hours</p>
                  <p className="text-white text-xs sm:text-sm">{companyInfo.workingHours.weekdays}</p>
                  <p className="text-gray-500 text-[11px] sm:text-xs">{companyInfo.workingHours.saturday}</p>
                  <p className="text-gray-500 text-[11px] sm:text-xs">{companyInfo.workingHours.sunday}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold text-base sm:text-lg mb-4 sm:mb-6 relative inline-block">
              Quick Links
              <span className="absolute -bottom-2 left-0 w-8 h-0.5 bg-[#FBBF24]" />
            </h4>
            <ul className="space-y-2.5 sm:space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className={`flex items-center space-x-2 text-xs sm:text-sm transition-all duration-300 group ${
                      location.pathname === link.path ? 'text-[#FBBF24]' : 'text-gray-400 hover:text-[#FBBF24]'
                    }`}
                  >
                    <FaAngleRight className="text-[10px] text-[#FBBF24] group-hover:translate-x-1 transition-transform" />
                    <span>{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-white font-semibold text-base sm:text-lg mb-4 sm:mb-6 relative inline-block">
              Our Services
              <span className="absolute -bottom-2 left-0 w-8 h-0.5 bg-[#FBBF24]" />
            </h4>
            <ul className="space-y-2.5 sm:space-y-3">
              {footerLinks.services.map((service) => (
                <li key={service.path}>
                  <Link
                    to={service.path}
                    className="flex items-center space-x-2 text-xs sm:text-sm text-gray-400 hover:text-[#FBBF24] transition-all duration-300 group"
                  >
                    <FaAngleRight className="text-[10px] text-[#FBBF24] group-hover:translate-x-1 transition-transform" />
                    <span className="line-clamp-1">{service.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter & Social */}
          <div>
            <h4 className="text-white font-semibold text-base sm:text-lg mb-4 sm:mb-6 relative inline-block">
              Stay Updated
              <span className="absolute -bottom-2 left-0 w-8 h-0.5 bg-[#FBBF24]" />
            </h4>
            
            {/* Newsletter */}
            <div className="mb-4 sm:mb-6">
              <p className="text-gray-400 text-xs sm:text-sm mb-3 sm:mb-4">
                Subscribe to our newsletter for project updates and industry insights.
              </p>
              <form onSubmit={handleNewsletter} className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  className="w-full bg-white/10 border border-white/10 rounded-xl py-2.5 sm:py-3 pl-3 sm:pl-4 pr-12 text-white text-xs sm:text-sm placeholder-gray-500 focus:border-[#FBBF24] focus:outline-none transition-all"
                  required
                />
                <button
                  type="submit"
                  disabled={subscribing}
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-9 sm:h-9 bg-[#FBBF24] rounded-lg flex items-center justify-center text-[#111111] hover:bg-[#D97706] transition-all disabled:opacity-50"
                >
                  <FaPaperPlane className="text-xs" />
                </button>
              </form>
              {subscribed && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-green-400 text-xs mt-2"
                >
                  ✓ Successfully subscribed!
                </motion.p>
              )}
            </div>

            {/* Social Links */}
            <div>
              <p className="text-gray-400 text-xs sm:text-sm mb-3">Follow Us</p>
              <div className="flex flex-wrap gap-2">
                {socialIcons.map((social, idx) => (
                  <a
                    key={idx}
                    href={social.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-9 h-9 sm:w-10 sm:h-10 bg-white/5 rounded-lg flex items-center justify-center text-gray-400 ${social.color} hover:text-white transition-all duration-300 hover:scale-110`}
                  >
                    <social.icon className="text-xs sm:text-sm" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* WhatsApp Floating Button - Mobile */}
        <div className="mt-6 sm:hidden">
          <a
            href={`https://wa.me/${companyInfo.phone?.replace(/[^0-9]/g, '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center space-x-2 w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition-all"
          >
            <FaWhatsapp className="text-lg" />
            <span>Chat on WhatsApp</span>
          </a>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-3 md:space-y-0">
            <p className="text-gray-500 text-xs sm:text-sm text-center md:text-left">
              &copy; {new Date().getFullYear()} {companyInfo.name}. All rights reserved. 
              Built with precision & passion.
            </p>
            <div className="flex items-center space-x-4 sm:space-x-6">
              <Link to="/privacy" className="text-gray-500 text-xs sm:text-sm hover:text-[#FBBF24] transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-gray-500 text-xs sm:text-sm hover:text-[#FBBF24] transition-colors">
                Terms
              </Link>
              <Link to="/faqs" className="text-gray-500 text-xs sm:text-sm hover:text-[#FBBF24] transition-colors">
                FAQs
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;