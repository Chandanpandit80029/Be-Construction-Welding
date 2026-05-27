import React, { lazy, Suspense } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import LoadingSpinner from './components/shared/LoadingSpinner';
import ScrollToTop from './components/shared/ScrollToTop';
import WhatsAppButton from './components/shared/WhatsAppButton';

// Lazy loaded public pages
const HomePage = lazy(() => import('./pages/home/HomePage'));
const AboutPage = lazy(() => import('./pages/about/AboutPage'));
const ServicesPage = lazy(() => import('./pages/services/ServicesPage'));
const ServiceDetailPage = lazy(() => import('./pages/services/ServiceDetailPage'));
const ProjectsPage = lazy(() => import('./pages/projects/ProjectsPage'));
const ProjectDetailPage = lazy(() => import('./pages/projects/ProjectDetailPage'));
const GalleryPage = lazy(() => import('./pages/gallery/GalleryPage'));
const BlogPage = lazy(() => import('./pages/blog/BlogPage'));
const BlogPostPage = lazy(() => import('./pages/blog/BlogPostPage'));
const TestimonialsPage = lazy(() => import('./pages/testimonials/TestimonialsPage'));
const ContactPage = lazy(() => import('./pages/contact/ContactPage'));
const QuotePage = lazy(() => import('./pages/quote/QuotePage'));
const SearchPage = lazy(() => import('./pages/search/SearchPage'));
const FAQPage = lazy(() => import('./pages/faq/FAQPage'));
const PrivacyPage = lazy(() => import('./pages/legal/PrivacyPage'));
const TermsPage = lazy(() => import('./pages/legal/TermsPage'));

// Lazy loaded admin pages
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'));
const Dashboard = lazy(() => import('./pages/admin/Dashboard'));
const AdminHeroSlider = lazy(() => import('./pages/admin/AdminHeroSlider'));
const AdminProjects = lazy(() => import('./pages/admin/AdminProjects'));
const AdminServices = lazy(() => import('./pages/admin/AdminServices'));
const AdminGallery = lazy(() => import('./pages/admin/AdminGallery'));
const AdminTestimonials = lazy(() => import('./pages/admin/AdminTestimonials'));
const AdminTeam = lazy(() => import('./pages/admin/AdminTeam'));
const AdminBlog = lazy(() => import('./pages/admin/AdminBlog'));
const AdminQuotes = lazy(() => import('./pages/admin/AdminQuotes'));
const AdminInquiries = lazy(() => import('./pages/admin/AdminInquiries'));
const AdminUsers = lazy(() => import('./pages/admin/AdminUsers'));
const AdminAnalytics = lazy(() => import('./pages/admin/AdminAnalytics'));
const AdminNotifications = lazy(() => import('./pages/admin/AdminNotifications'));
const AdminSEO = lazy(() => import('./pages/admin/AdminSEO'));
const AdminSettings = lazy(() => import('./pages/admin/AdminSettings'));
const AdminActivityLogs = lazy(() => import('./pages/admin/AdminActivityLogs'));

// Admin Dashboard Skeleton Loader - light theme skeleton
const AdminSkeleton = () => (
  <div className="min-h-screen bg-[#f1f5f9] p-6 lg:p-8">
    <div className="animate-pulse space-y-6">
      <div className="h-16 bg-white rounded-2xl border border-[#e2e8f0] shadow-sm" />
      <div className="h-32 bg-white rounded-2xl border border-[#e2e8f0]" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-32 bg-white rounded-2xl border border-[#e2e8f0]" />
        ))}
      </div>
      <div className="grid lg:grid-cols-2 gap-4 lg:gap-6">
        <div className="h-64 bg-white rounded-2xl border border-[#e2e8f0]" />
        <div className="h-64 bg-white rounded-2xl border border-[#e2e8f0]" />
      </div>
    </div>
  </div>
);

// Page Loader - light theme
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-[#f1f5f9]">
    <div className="text-center">
      <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
      <p className="text-[#64748b] font-medium">Loading...</p>
    </div>
  </div>
);

// Public Route Component - redirects to admin dashboard if already logged in as admin
const PublicRoute = ({ children }) => {
  const { currentUser, authReady, isAdmin } = useAuth();

  // Wait for auth to initialize
  if (!authReady) {
    return <LoadingSpinner fullScreen text="Loading..." />;
  }

  // If already authenticated as admin, redirect to dashboard
  if (currentUser && isAdmin()) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return children;
};

// Admin Route - protects admin pages
const AdminRoute = ({ children }) => {
  const { currentUser, isAdmin, userRole, authReady } = useAuth();

  // Wait for auth to initialize
  if (!authReady) {
    return <AdminSkeleton />;
  }

  // No user logged in - redirect to login
  if (!currentUser) {
    console.log('🔒 AdminRoute: No user, redirecting to login');
    return <Navigate to="/admin/login" replace />;
  }

  // User is logged in but not yet confirmed as admin (role still loading from cache)
  if (userRole === null) {
    return <AdminSkeleton />;
  }

  // User is logged in but not an admin
  if (!isAdmin()) {
    console.log('🔒 AdminRoute: User is not admin, redirecting to login');
    return <Navigate to="/admin/login" replace />;
  }

  // User is authenticated as admin - render the page
  console.log('🔓 AdminRoute: Access granted to admin:', currentUser.email);
  return <ThemeProvider>{children}</ThemeProvider>;
};

function AppRoutes() {
  return (
    <HelmetProvider>
      <Router>
        <ScrollToTop />
        <WhatsAppButton />
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/services/:slug" element={<ServiceDetailPage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/projects/:slug" element={<ProjectDetailPage />} />
            <Route path="/gallery" element={<GalleryPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blog/:slug" element={<BlogPostPage />} />
            <Route path="/testimonials" element={<TestimonialsPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/quote" element={<QuotePage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/faqs" element={<FAQPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/admin/login" element={<PublicRoute><AdminLogin /></PublicRoute>} />
            <Route path="/admin" element={<AdminRoute><Dashboard /></AdminRoute>} />
            <Route path="/admin/dashboard" element={<AdminRoute><Dashboard /></AdminRoute>} />
            <Route path="/admin/hero-slider" element={<AdminRoute><AdminHeroSlider /></AdminRoute>} />
            <Route path="/admin/projects" element={<AdminRoute><AdminProjects /></AdminRoute>} />
            <Route path="/admin/services" element={<AdminRoute><AdminServices /></AdminRoute>} />
            <Route path="/admin/gallery" element={<AdminRoute><AdminGallery /></AdminRoute>} />
            <Route path="/admin/testimonials" element={<AdminRoute><AdminTestimonials /></AdminRoute>} />
            <Route path="/admin/team" element={<AdminRoute><AdminTeam /></AdminRoute>} />
            <Route path="/admin/blog" element={<AdminRoute><AdminBlog /></AdminRoute>} />
            <Route path="/admin/quotes" element={<AdminRoute><AdminQuotes /></AdminRoute>} />
            <Route path="/admin/inquiries" element={<AdminRoute><AdminInquiries /></AdminRoute>} />
            <Route path="/admin/users" element={<AdminRoute><AdminUsers /></AdminRoute>} />
            <Route path="/admin/activity-logs" element={<AdminRoute><AdminActivityLogs /></AdminRoute>} />
            <Route path="/admin/analytics" element={<AdminRoute><AdminAnalytics /></AdminRoute>} />
            <Route path="/admin/notifications" element={<AdminRoute><AdminNotifications /></AdminRoute>} />
            <Route path="/admin/seo" element={<AdminRoute><AdminSEO /></AdminRoute>} />
            <Route path="/admin/settings" element={<AdminRoute><AdminSettings /></AdminRoute>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </Router>
    </HelmetProvider>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;
