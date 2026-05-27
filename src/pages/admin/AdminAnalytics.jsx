import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FaEye, FaUser, FaCalendarAlt, FaArrowUp, FaArrowDown,
  FaDownload, FaFilter, FaChartLine, FaChartBar, FaChartPie,
  FaGlobe, FaSearch, FaShareAlt, FaLink, FaEllipsisH
} from 'react-icons/fa';
import AdminLayout from '../../components/admin/AdminLayout';

const AdminAnalytics = () => {
  const [period, setPeriod] = useState('monthly');

  const stats = [
    { label: 'Total Visitors', value: '45,892', change: '+12.5%', up: true, icon: FaEye, color: 'blue' },
    { label: 'Page Views', value: '128,456', change: '+8.2%', up: true, icon: FaChartLine, color: 'emerald' },
    { label: 'Bounce Rate', value: '32.4%', change: '-2.1%', up: false, icon: FaChartBar, color: 'rose' },
    { label: 'Avg Session', value: '4m 32s', change: '+1.5%', up: true, icon: FaChartPie, color: 'violet' },
  ];

  return (
    <AdminLayout title="Analytics" subtitle="Track your website performance and traffic">
      {/* Period Selector */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        {['daily', 'weekly', 'monthly', 'yearly'].map(p => (
          <button key={p}
            onClick={() => setPeriod(p)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all capitalize ${
              period === p
                ? 'bg-amber-500/10 border border-amber-500/20 text-amber-400'
                : 'bg-input border border-theme-strong text-gray-400 hover:text-primary hover:bg-white/10'
            }`}
          >
            {p}
          </button>
        ))}
        <button className="ml-auto flex items-center gap-2 px-4 py-2 bg-input border border-theme-strong text-gray-400 rounded-xl hover:text-primary hover:bg-white/10 transition-all text-sm">
          <FaDownload className="text-xs" /> Export
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map(stat => (
          <div key={stat.label} className="rounded-xl border border-theme bg-linear-to-br bg-card p-5">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-lg bg-linear-to-br from-${stat.color}-500/20 to-${stat.color}-500/5 flex items-center justify-center border border-${stat.color}-500/10`}>
                <stat.icon className={`text-${stat.color}-400 text-base`} />
              </div>
              <span className={`flex items-center gap-1 text-xs font-medium ${
                stat.up ? 'text-emerald-400' : 'text-rose-400'
              }`}>
                {stat.up ? <FaArrowUp className="text-[9px]" /> : <FaArrowDown className="text-[9px]" />}
                {stat.change}
              </span>
            </div>
            <p className="text-2xl font-bold text-primary">{stat.value}</p>
            <p className="text-xs text-secondary mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid lg:grid-cols-2 gap-4 lg:gap-6 mb-6">
        {/* Visitors Chart */}
        <div className="rounded-2xl border border-theme bg-linear-to-br bg-card p-6">
          <h2 className="text-base font-bold text-primary mb-6">Visitor Overview</h2>
          <div className="h-64 relative">
            <div className="flex items-end justify-between h-full gap-2 relative">
              {[0, 25, 50, 75].map(i => (
                <div key={i} className="absolute left-0 right-0 border-t border-white/5" style={{ bottom: `${i}%` }} />
              ))}
              {[1200, 1900, 1500, 2500, 2200, 3000, 2800, 3500, 3100, 4000, 3800, 4200].map((val, i) => (
                <div key={i} className="flex-1 flex flex-col items-center relative z-10">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${(val / 4200) * 100}%` }}
                    transition={{ duration: 0.5, delay: i * 0.05 }}
                    className="w-full bg-linear-to-t from-blue-600 to-blue-400 rounded-t-lg hover:opacity-80 transition-opacity cursor-pointer relative group"
                  >
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-primary text-[10px] px-2 py-1 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                      {val.toLocaleString()} visitors
                    </div>
                  </motion.div>
                </div>
              ))}
              {['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'].map((m, i) => (
                <div key={m} className="absolute -bottom-5 text-[10px] text-gray-600" style={{ left: `${(i / 12) * 100 + (100 / 12 / 2)}%`, transform: 'translateX(-50%)' }}>
                  {m}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Traffic Sources */}
        <div className="rounded-2xl border border-theme bg-linear-to-br bg-card p-6">
          <h2 className="text-base font-bold text-primary mb-6">Traffic Sources</h2>
          <div className="space-y-4">
            {[
              { source: 'Direct', value: 35, color: 'from-blue-500 to-blue-400', icon: FaGlobe },
              { source: 'Search Engine', value: 28, color: 'from-emerald-500 to-emerald-400', icon: FaSearch },
              { source: 'Social Media', value: 20, color: 'from-violet-500 to-violet-400', icon: FaShareAlt },
              { source: 'Referral', value: 12, color: 'from-amber-500 to-amber-400', icon: FaLink },
              { source: 'Other', value: 5, color: 'from-rose-500 to-rose-400', icon: FaEllipsisH },
            ].map(item => (
              <div key={item.source}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs text-gray-400">{item.source}</span>
                  <span className="text-xs font-medium text-primary">{item.value}%</span>
                </div>
                <div className="h-2 bg-input rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${item.value}%` }}
                    transition={{ duration: 1, delay: 0.3 }}
                    className={`h-full rounded-full bg-linear-to-r ${item.color}`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Summary Table */}
      <div className="rounded-2xl border border-theme bg-linear-to-br bg-card overflow-hidden">
        <div className="p-6 border-b border-white/5">
          <h2 className="text-base font-bold text-primary">Page Performance</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left px-4 py-3 text-xs font-semibold text-secondary uppercase">Page</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-secondary uppercase">Views</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-secondary uppercase">Unique</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-secondary uppercase">Avg Time</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-secondary uppercase">Bounce</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-secondary uppercase">Trend</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {[
                { page: '/', views: 12500, unique: 8900, time: '3m 45s', bounce: '28%', trend: '+5%', up: true },
                { page: '/services', views: 8500, unique: 6200, time: '4m 12s', bounce: '32%', trend: '+8%', up: true },
                { page: '/projects', views: 7200, unique: 5100, time: '5m 30s', bounce: '25%', trend: '+12%', up: true },
                { page: '/contact', views: 4800, unique: 3500, time: '2m 15s', bounce: '45%', trend: '-3%', up: false },
                { page: '/about', views: 3200, unique: 2400, time: '3m 00s', bounce: '35%', trend: '+2%', up: true },
              ].map(row => (
                <tr key={row.page} className="hover:bg-card-hover transition-colors">
                  <td className="px-4 py-3 text-sm font-medium text-primary">{row.page}</td>
                  <td className="px-4 py-3 text-sm text-gray-400">{row.views.toLocaleString()}</td>
                  <td className="px-4 py-3 text-sm text-gray-400">{row.unique.toLocaleString()}</td>
                  <td className="px-4 py-3 text-sm text-gray-400">{row.time}</td>
                  <td className="px-4 py-3 text-sm text-gray-400">{row.bounce}</td>
                  <td className="px-4 py-3">
                    <span className={`flex items-center gap-1 text-xs ${
                      row.up ? 'text-emerald-400' : 'text-rose-400'
                    }`}>
                      {row.up ? <FaArrowUp className="text-[9px]" /> : <FaArrowDown className="text-[9px]" />}
                      {row.trend}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminAnalytics;

