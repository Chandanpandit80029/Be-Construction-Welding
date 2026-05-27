import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaBars, FaBell, FaUser, FaSearch, FaMoon, FaSun, FaSignOutAlt } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';

const AdminNavbar = ({ onToggleSidebar, sidebarOpen }) => {
  const { currentUser, logout } = useAuth();
  const [showProfile, setShowProfile] = React.useState(false);
  const [isDark, setIsDark] = React.useState(false);

  const toggleDark = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('adark');
  };

  const handleLogout = async () => {
    await logout();
  };

  return (
    <nav className="sticky top-0 z-30 a-navbar backdrop-blur-md a-border">
      <div className="flex items-center justify-between px-3 sm:px-4 lg:px-6 h-16">
        <div className="flex items-center space-x-3">
          {/* Mobile menu toggle */}
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2 rounded-lg a-text-secondary hover:a-text-primary hover:a-hover transition-all"
            aria-label="Toggle sidebar"
          >
            <FaBars className="text-lg" />
          </button>

          {/* Search Bar */}
          <div className="hidden sm:flex items-center">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-xs a-text-muted" />
              <input
                type="text"
                placeholder="Search..."
                className="a-input-field pl-9 pr-4 py-2 w-48 lg:w-64 text-xs"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-1 sm:space-x-2">
          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDark}
            className="p-2 rounded-lg a-text-secondary hover:a-text-primary hover:a-hover transition-all"
            aria-label="Toggle dark mode"
          >
            {isDark ? <FaSun className="text-sm" /> : <FaMoon className="text-sm" />}
          </button>

          {/* Notifications */}
          <button className="relative p-2 rounded-lg a-text-secondary hover:a-text-primary hover:a-hover transition-all">
            <FaBell className="text-sm" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
          </button>

          {/* Profile */}
          <div className="relative">
            <button
              onClick={() => setShowProfile(!showProfile)}
              className="flex items-center space-x-2 p-1.5 rounded-lg hover:a-hover transition-all"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-xs font-bold">
                {currentUser?.email?.[0]?.toUpperCase() || 'A'}
              </div>
              <div className="hidden md:block text-left">
                <p className="text-xs font-medium a-text-primary leading-tight truncate max-w-[120px]">
                  {currentUser?.email || 'Admin'}
                </p>
                <p className="text-[10px] a-text-muted">Administrator</p>
              </div>
            </button>

            {showProfile && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50"
              >
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-900 truncate">{currentUser?.email}</p>
                  <p className="text-xs text-gray-500">Administrator</p>
                </div>
                <button
                  onClick={() => { setShowProfile(false); handleLogout(); }}
                  className="w-full flex items-center space-x-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <FaSignOutAlt className="text-xs" />
                  <span>Sign Out</span>
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;