import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaChartBar, FaProjectDiagram, FaTools, FaImages, FaEnvelope,
  FaFileAlt, FaStar, FaUsers, FaCog, FaSignOutAlt, FaTimes,
  FaChevronDown, FaSearch, FaBell, FaNewspaper,
  FaUserShield, FaChartLine, FaSearch as FaSearchIcon, FaUser,
  FaAngleDoubleLeft, FaHistory
} from 'react-icons/fa';
import { adminNavLinks, adminGroups } from '../../constants';
import { useAuth } from '../../contexts/AuthContext';

const iconMap = {
  FaChartBar, FaProjectDiagram, FaTools, FaImages, FaEnvelope,
  FaFileAlt, FaStar, FaUsers, FaCog, FaNewspaper, FaUserShield,
  FaChartLine, FaBell, FaSearch: FaSearchIcon, FaUser, FaHistory
};

const AdminSidebar = ({ isOpen, onClose, collapsed, onToggleCollapse }) => {
  const location = useLocation();
  const { logout } = useAuth();
  const [expandedGroups, setExpandedGroups] = useState({});
  const [searchQuery, setSearchQuery] = useState('');

  const filteredLinks = adminNavLinks.filter(link =>
    link.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const groupedLinks = adminGroups.map(group => ({
    ...group,
    links: filteredLinks.filter(l => l.group === group.key)
  })).filter(g => g.links.length > 0);

  const toggleGroup = (key) => {
    setExpandedGroups(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleLogout = async () => {
    await logout();
  };

  const isActive = (path) => location.pathname === path;

  const renderNavItem = (link) => {
    const IconComponent = iconMap[link.icon] || FaChartBar;
    const active = isActive(link.path);

    return (
      <Link
        key={link.path}
        to={link.path}
        onClick={onClose}
        className={`relative flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-300 group ${
          active
            ? 'a-sidebar-active'
            : 'a-text-secondary hover:a-text-primary hover:a-hover border border-transparent'
        }`}
      >
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-300 ${
          active
            ? 'a-hover'
            : 'a-input a-text-secondary'
        }`}>
          <IconComponent className="text-sm" />
        </div>
        {!collapsed && (
          <>
            <span className={`text-sm font-medium ${active ? 'a-text-primary' : 'a-text-primary'}`}>
              {link.name}
            </span>
            {active && (
              <motion.div
                layoutId="activeIndicator"
                className="ml-auto w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: 'var(--aaccent-500)' }}
              />
            )}
          </>
        )}
      </Link>
    );
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      <aside
        className={`fixed top-0 left-0 h-full z-50 transition-all duration-500 ease-in-out ${
          collapsed ? 'w-19' : 'w-70'
        } ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 a-sidebar a-border-strong`}
      >
        <div className="h-full flex flex-col shadow-xl shadow-black/5">
          {/* Logo */}
          <div className={`flex items-center justify-between p-4 a-border ${collapsed ? 'flex-col gap-3' : ''}`}>
            <Link to="/admin" className={`flex items-center gap-3 ${collapsed ? 'flex-col' : ''}`} onClick={onClose}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg"
                style={{ background: 'var(--aaccent-500)' }}>
                <span className="text-white font-bold text-sm">BE</span>
              </div>
              {!collapsed && (
                <div>
                  <h2 className="font-bold text-sm a-text-primary">Admin Panel</h2>
                  <p className="text-[10px] a-text-muted">BE Construction</p>
                </div>
              )}
            </Link>
            <button
              onClick={onToggleCollapse}
              className="hidden lg:flex p-1.5 a-text-muted hover:a-text-primary hover:a-hover rounded-lg transition-all"
            >
              <FaAngleDoubleLeft className={`text-xs transition-transform ${collapsed ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto px-3 py-4" style={{ scrollbarWidth: 'thin' }}>
            {groupedLinks.map((group) => (
              <div key={group.key} className="mb-4">
                {!collapsed && (
                  <button
                    onClick={() => toggleGroup(group.key)}
                    className="flex items-center justify-between w-full px-3 py-2 text-[10px] font-semibold uppercase tracking-widest a-text-muted"
                  >
                    <span>{group.name}</span>
                    <FaChevronDown className={`text-[8px] transition-transform duration-200 ${expandedGroups[group.key] !== false ? 'rotate-0' : '-rotate-90'}`} />
                  </button>
                )}
                <div className="space-y-1">
                  {(expandedGroups[group.key] !== false ? group.links : group.links).map(link => renderNavItem(link))}
                </div>
              </div>
            ))}
          </nav>

          {/* Logout */}
          <div className="a-border p-3">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl a-text-secondary hover:a-text-primary hover:a-hover transition-all text-sm"
            >
              <FaSignOutAlt className="text-xs" />
              {!collapsed && <span>Sign Out</span>}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;