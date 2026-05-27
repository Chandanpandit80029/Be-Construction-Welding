import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FaProjectDiagram, FaEnvelope, FaStar, FaFileAlt, FaArrowUp,
  FaArrowDown, FaArrowRight, FaPlus, FaTools, FaImages, FaCog,
  FaUsers, FaEye, FaUserCheck, FaCalendarAlt,
  FaBuilding, FaHardHat, FaChartBar, FaDownload, FaHistory,
  FaSave, FaDatabase, FaCheck
} from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';
import AdminLayout from '../../components/admin/AdminLayout';
import { useCollection } from '../../hooks/useFirestore';
import { exportAllData, exportCollectionData } from '../../hooks/useActivityLog';

// Mini Chart component
const MiniChart = ({ data = [], trend = 'up', color = '#FBBF24' }) => {
  const points = data.map((val, i) => ({
    x: (i / (data.length - 1)) * 100,
    y: 100 - (val / Math.max(...data)) * 80
  }));
  if (points.length < 2) return null;
  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <defs>
        <linearGradient id={`gradient-${trend}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={color} stopOpacity="0.2"/>
          <stop offset="100%" stopColor={color} stopOpacity="0"/>
        </linearGradient>
      </defs>
      <path d={`${pathD} L 100 100 L 0 100 Z`} fill={`url(#gradient-${trend})`} />
      <path d={pathD} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      {[points[0], points[points.length - 1]].map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="3" fill={color} stroke="#0a0a0f" strokeWidth="1.5" />
      ))}
    </svg>
  );
};

const AnimatedCounter = ({ value, duration = 2000 }) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const end = parseInt(value) || 0;
    const increment = end / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) { setCount(end); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [value, duration]);
  return <>{count.toLocaleString()}</>;
};

const Dashboard = () => {
  const { currentUser, userData } = useAuth();
  const { data: projects, loading: loadingProjects, error: errorProjects, retry: retryProjects } = useCollection('projects');
  const { data: inquiries, loading: loadingInquiries, error: errorInquiries, retry: retryInquiries } = useCollection('inquiries');
  const { data: testimonials, loading: loadingTestimonials, error: errorTestimonials, retry: retryTestimonials } = useCollection('testimonials');
  const { data: quoteRequests, loading: loadingQuotes, error: errorQuotes, retry: retryQuotes } = useCollection('quoteRequests');
  const { data: services, loading: loadingServices, error: errorServices, retry: retryServices } = useCollection('services');
  const { data: users, loading: loadingUsers, error: errorUsers, retry: retryUsers } = useCollection('users');
  const [exporting, setExporting] = useState(false);
  const [exportDone, setExportDone] = useState(false);

  const [visitorData] = useState([45, 52, 38, 65, 48, 72, 58, 85, 62, 78, 90, 95]);
  const [revenueData] = useState([12000, 19000, 15000, 25000, 22000, 30000, 28000]);

  // Collect all errors for status banner
  const allErrors = [errorProjects, errorInquiries, errorTestimonials, errorQuotes, errorServices, errorUsers].filter(Boolean);
  const isLoading = loadingProjects || loadingInquiries || loadingTestimonials || loadingQuotes || loadingServices || loadingUsers;

  const handleExport = async () => {
    setExporting(true);
    await exportAllData();
    setExporting(false);
    setExportDone(true);
    setTimeout(() => setExportDone(false), 3000);
  };

  const handleExportInquiries = async () => {
    await exportCollectionData('inquiries', 'inquiries');
  };

  // Retry all failed queries
  const handleRetryAll = () => {
    if (errorProjects) retryProjects();
    if (errorInquiries) retryInquiries();
    if (errorTestimonials) retryTestimonials();
    if (errorQuotes) retryQuotes();
    if (errorServices) retryServices();
    if (errorUsers) retryUsers();
  };

  const statsCards = [
    {
      title: 'Total Projects', value: projects?.length || 0, icon: FaProjectDiagram,
      gradient: 'from-blue-600 to-blue-500', trend: '+12%', trendUp: true, path: '/admin/projects',
      chart: [30, 45, 38, 52, 48, 65, 58]
    },
    {
      title: 'Total Services', value: services?.length || 9, icon: FaTools,
      gradient: 'from-emerald-600 to-emerald-500', trend: '+2%', trendUp: true, path: '/admin/services',
      chart: [40, 35, 50, 45, 55, 60, 58]
    },
    {
      title: 'Total Visitors', value: visitorData.reduce((a, b) => a + b, 0), icon: FaEye,
      gradient: 'from-violet-600 to-violet-500', trend: '+24%', trendUp: true, path: '/admin/analytics',
      chart: [25, 40, 35, 50, 42, 55, 48]
    },
    {
      title: 'Testimonials', value: testimonials?.length || 0, icon: FaStar,
      gradient: 'from-amber-500 to-amber-400', trend: '+5%', trendUp: true, path: '/admin/testimonials',
      chart: [20, 25, 22, 30, 28, 35, 32]
    },
    {
      title: 'Pending Inquiries', value: inquiries?.filter(i => i.status === 'new' || i.status === 'unread')?.length || 0,
      icon: FaEnvelope, gradient: 'from-rose-600 to-rose-500', trend: '-3%', trendUp: false, path: '/admin/inquiries',
      chart: [35, 30, 25, 28, 20, 22, 18]
    },
    {
      title: 'Quote Requests', value: quoteRequests?.length || 0, icon: FaFileAlt,
      gradient: 'from-purple-600 to-purple-500', trend: '+8%', trendUp: true, path: '/admin/quotes',
      chart: [15, 20, 18, 25, 22, 28, 25]
    },
    {
      title: 'Revenue', value: `₹${(revenueData.reduce((a, b) => a + b, 0) / 1000).toFixed(1)}K`,
      icon: null, gradient: 'from-cyan-600 to-cyan-500', trend: '+18%', trendUp: true, path: '/admin/analytics',
      chart: [50, 65, 55, 80, 70, 90, 85]
    },
    {
      title: 'Active Users', value: users?.length || 1, icon: FaUserCheck,
      gradient: 'from-orange-600 to-orange-500', trend: '+1', trendUp: true, path: '/admin/users',
      chart: [5, 8, 6, 10, 8, 12, 10]
    }
  ];

  const recentInquiries = inquiries?.slice(0, 5) || [];
  const recentQuotes = quoteRequests?.slice(0, 5) || [];

  const containerVariants = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.05 } } };
  const itemVariants = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

  return (
    <AdminLayout>
      {/* Error Banner */}
      {allErrors.length > 0 && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-red-500/20 rounded-lg flex items-center justify-center">
                <span className="text-red-400 font-bold">!</span>
              </div>
              <div>
                <p className="text-sm font-medium text-red-300">
                  {allErrors.length} data source{allErrors.length > 1 ? 's' : ''} failed to load
                </p>
                <p className="text-xs text-red-400/70 mt-0.5">Click Retry to attempt reconnection</p>
              </div>
            </div>
            <button onClick={handleRetryAll}
              className="flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-xl text-sm transition-all">
              Retry All
            </button>
          </div>
        </motion.div>
      )}

      {/* Welcome Banner */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl bg-linear-to-r bg-card border border-theme p-6 lg:p-8 mb-6 lg:mb-8">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-primary">Welcome back, {userData?.name || 'Admin'} 👋</h1>
            <p className="text-secondary mt-2 text-sm lg:text-base">Here's your construction business overview for today.</p>
            <div className="flex items-center gap-4 mt-4 text-sm text-secondary">
              <span className="flex items-center gap-1.5"><FaCalendarAlt className="text-amber-400 text-xs" />{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
              <span className="flex items-center gap-1.5"><FaHardHat className="text-amber-400 text-xs" />{projects?.length || 0} Active Projects</span>
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={handleExport} disabled={exporting}
              className="flex items-center gap-2 px-4 py-2.5 bg-white text-gray-800 border border-gray-200 hover:bg-blue-50 hover:shadow-md rounded-xl transition-all duration-300 text-sm font-medium disabled:opacity-50">
              {exporting ? <FaSave className="animate-spin text-xs" /> : <FaDownload className="text-xs" />}
              {exporting ? 'Exporting...' : 'Backup All Data'}
            </button>
          </div>
        </div>
        {exportDone && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="absolute bottom-4 right-6 flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg text-xs">
            <FaCheck className="text-[10px]" /> Backup downloaded!
          </motion.div>
        )}
      </motion.div>

      {/* Stats Grid */}
      <motion.div variants={containerVariants} initial="hidden" animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 lg:mb-8">
        {statsCards.map((stat, index) => (
          <motion.div key={stat.title} variants={itemVariants}
            className="group relative overflow-hidden rounded-2xl border border-theme bg-linear-to-br bg-card p-5 hover:border-white/10 transition-all duration-300 hover:shadow-xl hover:shadow-black/40">
            <div className={`absolute top-0 right-0 w-48 h-48 bg-linear-to-br ${stat.gradient} opacity-[0.03] rounded-full blur-3xl group-hover:opacity-[0.06] transition-opacity`} />
            <div className="absolute bottom-0 right-0 w-24 h-16 opacity-20">
              <MiniChart data={stat.chart} trend={stat.trendUp ? 'up' : 'down'} color={stat.gradient.includes('amber') ? '#FBBF24' : '#3B82F6'} />
            </div>
            <div className="flex items-center justify-between mb-3 relative z-10">
              <div className={`w-11 h-11 rounded-xl bg-linear-to-br ${stat.gradient} flex items-center justify-center shadow-lg shadow-black/30`}>
                {stat.icon ? <stat.icon className="text-primary text-lg" /> : <span className="text-primary text-lg font-bold">₹</span>}
              </div>
              <div className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-lg ${stat.trendUp ? 'text-emerald-400 bg-emerald-500/10' : 'text-rose-400 bg-rose-500/10'}`}>
                {stat.trendUp ? <FaArrowUp className="text-[10px]" /> : <FaArrowDown className="text-[10px]" />}
                <span>{stat.trend}</span>
              </div>
            </div>
            <h3 className="text-2xl lg:text-3xl font-bold text-primary relative z-10">
              {typeof stat.value === 'string' ? stat.value : <AnimatedCounter value={stat.value} />}
            </h3>
            <p className="text-secondary text-sm mt-1 relative z-10">{stat.title}</p>
            <Link to={stat.path} className="mt-3 text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all relative z-10">
              <span>View Details</span><FaArrowRight className="text-[10px]" />
            </Link>
          </motion.div>
        ))}
      </motion.div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-2 gap-4 lg:gap-6 mb-6 lg:mb-8">
        {/* Monthly Visitors Chart */}
        <div className="rounded-2xl border border-theme bg-linear-to-br bg-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-base font-bold text-primary">Monthly Visitors</h2>
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1.5 text-xs text-secondary"><div className="w-2 h-2 rounded-full bg-amber-400" />This Year</span>
              <span className="flex items-center gap-1.5 text-xs text-secondary"><div className="w-2 h-2 rounded-full bg-gray-600" />Last Year</span>
            </div>
          </div>
          <div className="h-48 lg:h-64">
            <div className="flex items-end justify-between h-full gap-1.5 relative">
              {[0, 1, 2, 3].map(i => <div key={i} className="absolute left-0 right-0 border-t border-white/5" style={{ bottom: `${(i + 1) * 20}%` }} />)}
              {visitorData.map((value, index) => {
                const height = (value / Math.max(...visitorData)) * 100;
                const lastYearHeight = ((value - (Math.random() * 20 - 10)) / Math.max(...visitorData)) * 100;
                return (
                  <div key={index} className="flex-1 flex items-end gap-0.5 relative z-10">
                    <motion.div initial={{ height: 0 }} animate={{ height: `${lastYearHeight}%` }} transition={{ duration: 0.5, delay: index * 0.05 }} className="w-1/2 bg-gray-600/50 rounded-t-sm" />
                    <motion.div initial={{ height: 0 }} animate={{ height: `${height}%` }} transition={{ duration: 0.5, delay: index * 0.05 }}
                      className="w-1/2 bg-linear-to-t from-amber-500 to-amber-400 rounded-t-sm hover:opacity-80 transition-opacity cursor-pointer relative group">
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-primary text-[10px] px-2 py-1 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">{value} visitors</div>
                    </motion.div>
                  </div>
                );
              })}
              {['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'].map((month, i) => (
                <div key={month} className="absolute -bottom-5 text-[10px] text-gray-600" style={{ left: `${(i / 12) * 100 + (100 / 12 / 2)}%`, transform: 'translateX(-50%)' }}>{month}</div>
              ))}
            </div>
          </div>
        </div>

        {/* Revenue Chart */}
        <div className="rounded-2xl border border-theme bg-linear-to-br bg-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-base font-bold text-primary">Revenue Analytics</h2>
            <span className="text-xs text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg font-medium">+18% growth</span>
          </div>
          <div className="h-48 lg:h-64">
            <div className="flex items-end justify-between h-full gap-2 relative">
              {[0, 1, 2, 3].map(i => <div key={i} className="absolute left-0 right-0 border-t border-white/5" style={{ bottom: `${(i + 1) * 20}%` }} />)}
              {revenueData.map((value, index) => {
                const height = (value / Math.max(...revenueData)) * 100;
                return (
                  <div key={index} className="flex-1 flex flex-col items-center gap-1 relative z-10">
                    <motion.div initial={{ height: 0 }} animate={{ height: `${height}%` }} transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="w-full bg-linear-to-t from-emerald-600 to-emerald-400 rounded-t-lg hover:opacity-80 transition-opacity cursor-pointer relative group">
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-primary text-[10px] px-2 py-1 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">₹{(value / 1000).toFixed(1)}K</div>
                    </motion.div>
                  </div>
                );
              })}
              {['Week 1','Week 2','Week 3','Week 4','Week 5','Week 6','Week 7'].map((week, i) => (
                <div key={week} className="absolute -bottom-5 text-[10px] text-gray-600" style={{ left: `${(i / 7) * 100 + (100 / 7 / 2)}%`, transform: 'translateX(-50%)' }}>{week}</div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity & Quick Stats */}
      <div className="grid lg:grid-cols-3 gap-4 lg:gap-6 mb-6 lg:mb-8">
        {/* Recent Inquiries */}
        <div className="lg:col-span-2 rounded-2xl border border-theme bg-linear-to-br bg-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-base font-bold text-primary">Recent Inquiries</h2>
            <div className="flex gap-2">
              <button onClick={handleExportInquiries} className="text-xs text-gray-400 hover:text-amber-400 flex items-center gap-1 transition-colors">
                <FaDownload className="text-[10px]" /> Export
              </button>
              <Link to="/admin/inquiries" className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 transition-colors">
                <span>View All</span><FaArrowRight className="text-[10px]" />
              </Link>
            </div>
          </div>
          {loadingInquiries ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : errorInquiries ? (
            <div className="text-center py-12">
              <p className="text-red-500 text-sm">{errorInquiries}</p>
              <button onClick={retryInquiries} className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-all">Retry</button>
            </div>
          ) : recentInquiries.length > 0 ? (
            <div className="space-y-2">
              {recentInquiries.map((inquiry, idx) => (
                <motion.div key={inquiry.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.05 }}
                  className="flex items-center justify-between p-3 rounded-xl bg-card-hover hover:bg-hover transition-colors border border-white/2 hover:border-white/5 group">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-linear-to-br from-blue-500/20 to-blue-500/5 flex items-center justify-center border border-blue-500/10">
                      <FaEnvelope className="text-blue-400 text-xs" />
                    </div>
                    <div>
                      <p className="font-medium text-primary text-sm">{inquiry.name}</p>
                      <p className="text-xs text-secondary">{inquiry.email || inquiry.subject}</p>
                    </div>
                  </div>
                  <span className={`px-2.5 py-1 rounded-lg text-xs font-medium ${inquiry.status === 'new' || inquiry.status === 'unread' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : inquiry.status === 'read' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 'bg-input text-gray-400 border border-theme-strong'}`}>
                    {inquiry.status || 'new'}
                  </span>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-14 h-14 rounded-full bg-input flex items-center justify-center mx-auto mb-3"><FaEnvelope className="text-2xl text-gray-700" /></div>
              <p className="text-secondary text-sm">No inquiries yet</p>
            </div>
          )}
        </div>

        {/* Quick Stats */}
        <div className="rounded-2xl border border-theme bg-linear-to-br bg-card p-6">
          <h2 className="text-base font-bold text-primary mb-6">Quick Stats</h2>
          <div className="space-y-4">
            {[
              { label: 'Completion Rate', value: '87%', color: 'emerald', progress: 87 },
              { label: 'On-time Delivery', value: '92%', color: 'blue', progress: 92 },
              { label: 'Client Satisfaction', value: '95%', color: 'amber', progress: 95 },
              { label: 'Team Efficiency', value: '78%', color: 'violet', progress: 78 },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs text-gray-400">{stat.label}</span>
                  <span className="text-xs font-semibold text-primary">{stat.value}</span>
                </div>
                <div className="h-1.5 bg-input rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${stat.progress}%` }} transition={{ duration: 1, delay: 0.5, ease: 'easeOut' }}
                    className="h-full rounded-full" style={{ background: stat.color === 'emerald' ? 'linear-gradient(90deg, #059669, #34d399)' : stat.color === 'blue' ? 'linear-gradient(90deg, #2563eb, #60a5fa)' : stat.color === 'amber' ? 'linear-gradient(90deg, #d97706, #fbbf24)' : 'linear-gradient(90deg, #7c3aed, #a78bfa)' }} />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-6 border-t border-white/5">
            <h3 className="text-xs font-semibold text-secondary uppercase tracking-wider mb-4">Quick Actions</h3>
            <div className="grid grid-cols-3 gap-2">
              {[
                { name: 'Add Project', icon: FaPlus, path: '/admin/projects', color: 'blue' },
                { name: 'Services', icon: FaTools, path: '/admin/services', color: 'emerald' },
                { name: 'Gallery', icon: FaImages, path: '/admin/gallery', color: 'violet' },
                { name: 'Activity Logs', icon: FaHistory, path: '/admin/activity-logs', color: 'amber' },
                { name: 'Backup', icon: FaDownload, path: '#', color: 'purple', action: handleExport },
                { name: 'Settings', icon: FaCog, path: '/admin/settings', color: 'gray' },
              ].map((action) => (
                action.action ? (
                  <button key={action.name} onClick={action.action}
                    className="flex flex-col items-center justify-center p-3 rounded-xl bg-card-hover border border-theme hover:border-white/10 hover:bg-hover transition-all group gap-2">
                    <div className={`w-8 h-8 rounded-lg bg-linear-to-br from-${action.color}-500/20 to-${action.color}-500/5 flex items-center justify-center border border-${action.color}-500/10 group-hover:scale-110 transition-transform`}>
                      <action.icon className={`text-${action.color}-400 text-xs`} />
                    </div>
                    <span className="text-[10px] font-medium text-gray-400 group-hover:text-gray-200 transition-colors text-center">{action.name}</span>
                  </button>
                ) : (
                  <Link key={action.name} to={action.path}
                    className="flex flex-col items-center justify-center p-3 rounded-xl bg-card-hover border border-theme hover:border-white/10 hover:bg-hover transition-all group gap-2">
                    <div className={`w-8 h-8 rounded-lg bg-linear-to-br from-${action.color}-500/20 to-${action.color}-500/5 flex items-center justify-center border border-${action.color}-500/10 group-hover:scale-110 transition-transform`}>
                      <action.icon className={`text-${action.color}-400 text-xs`} />
                    </div>
                    <span className="text-[10px] font-medium text-gray-400 group-hover:text-gray-200 transition-colors text-center">{action.name}</span>
                  </Link>
                )
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Quotes & Summary */}
      <div className="grid lg:grid-cols-2 gap-4 lg:gap-6">
        <div className="rounded-2xl border border-theme bg-linear-to-br bg-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-base font-bold text-primary">Recent Quote Requests</h2>
            <Link to="/admin/quotes" className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 transition-colors">
              <span>View All</span><FaArrowRight className="text-[10px]" />
            </Link>
          </div>
          {loadingQuotes ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : errorQuotes ? (
            <div className="text-center py-12">
              <p className="text-red-500 text-sm">{errorQuotes}</p>
              <button onClick={retryQuotes} className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-all">Retry</button>
            </div>
          ) : recentQuotes.length > 0 ? (
            <div className="space-y-2">
              {recentQuotes.map((quote, idx) => (
                <motion.div key={quote.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.05 }}
                  className="flex items-center justify-between p-3 rounded-xl bg-card-hover hover:bg-hover transition-colors border border-white/2 hover:border-white/5 group">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-linear-to-br from-purple-500/20 to-purple-500/5 flex items-center justify-center border border-purple-500/10">
                      <FaFileAlt className="text-purple-400 text-xs" />
                    </div>
                    <div>
                      <p className="font-medium text-primary text-sm">{quote.name}</p>
                      <p className="text-xs text-secondary">{quote.service || quote.projectType}</p>
                    </div>
                  </div>
                  <span className={`px-2.5 py-1 rounded-lg text-xs font-medium ${quote.status === 'pending' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : quote.status === 'approved' || quote.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : quote.status === 'rejected' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : 'bg-input text-gray-400 border border-theme-strong'}`}>
                    {quote.status || 'pending'}
                  </span>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-14 h-14 rounded-full bg-input flex items-center justify-center mx-auto mb-3"><FaFileAlt className="text-2xl text-gray-700" /></div>
              <p className="text-secondary text-sm">No quote requests yet</p>
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-theme bg-linear-to-br bg-card p-6">
          <h2 className="text-base font-bold text-primary mb-6">Business Summary</h2>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Active Projects', value: projects?.length || 0, icon: FaBuilding, color: 'blue' },
              { label: 'Team Members', value: 8, icon: FaUsers, color: 'amber' },
              { label: 'Service Categories', value: services?.length || 9, icon: FaTools, color: 'emerald' },
              { label: 'Years Experience', value: 15, icon: FaHardHat, color: 'violet' },
            ].map((item) => (
              <div key={item.label} className="p-4 rounded-xl bg-card-hover border border-theme hover:border-white/10 transition-all group">
                <div className={`w-10 h-10 rounded-lg bg-linear-to-br from-${item.color}-500/20 to-${item.color}-500/5 flex items-center justify-center mb-3 border border-${item.color}-500/10`}>
                  <item.icon className={`text-${item.color}-400 text-base`} />
                </div>
                <p className="text-xl font-bold text-primary">{item.value}</p>
                <p className="text-xs text-secondary mt-0.5">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;