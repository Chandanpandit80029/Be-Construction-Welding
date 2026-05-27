import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AdminSidebar from './AdminSidebar';
import AdminNavbar from './AdminNavbar';

const AdminLayout = ({ children, title, subtitle }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const pageVariants = {
    initial: { opacity: 0, y: 15 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] } },
    exit: { opacity: 0, y: -10, transition: { duration: 0.15 } }
  };

  return (
    <div className="min-h-screen a-body">
      <AdminSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      <div className={`admin-main-content transition-all duration-500 ease-in-out ${
        sidebarCollapsed ? 'lg:ml-19' : 'lg:ml-70'
      }`}>
        <AdminNavbar
          onToggleSidebar={() => setSidebarOpen(true)}
          sidebarOpen={sidebarOpen}
        />

        <main className="p-3 sm:p-4 lg:p-6 xl:p-8 min-h-[calc(100vh-64px)]">
          {(title || subtitle) && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 sm:mb-6 lg:mb-8"
            >
              {title && (
                <h1 className="text-lg sm:text-xl lg:text-2xl font-bold a-text-primary">
                  {title}
                </h1>
              )}
              {subtitle && (
                <p className="text-xs sm:text-sm mt-0.5 sm:mt-1 a-text-secondary">{subtitle}</p>
              )}
            </motion.div>
          )}

          <AnimatePresence mode="wait">
            <motion.div
              key={window.location.pathname}
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;