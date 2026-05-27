import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FaHistory, FaSearch, FaFilter, FaDownload, FaTrash,
  FaUser, FaFileAlt, FaPlus, FaEdit, FaTimes, FaCheck,
  FaCalendarAlt, FaExclamationTriangle, FaInfoCircle
} from 'react-icons/fa';
import AdminLayout from '../../components/admin/AdminLayout';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import { useRealtimeCollection } from '../../hooks/useFirestore';

const AdminActivityLogs = () => {
  const { data: logs, loading } = useRealtimeCollection('activityLogs', { orderBy: 'timestamp', orderDirection: 'desc' });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAction, setFilterAction] = useState('all');

  const filtered = (logs || []).filter(log => {
    const matchesSearch = (log.description || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (log.user || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAction = filterAction === 'all' || log.action === filterAction;
    return matchesSearch && matchesAction;
  });

  const getActionColor = (action) => {
    const colors = {
      create: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
      update: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
      delete: 'text-red-400 bg-red-500/10 border-red-500/20',
      publish: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
      unpublish: 'text-gray-400 bg-gray-500/10 border-gray-500/20',
      login: 'text-violet-400 bg-violet-500/10 border-violet-500/20',
    };
    return colors[action] || 'text-gray-400 bg-gray-500/10 border-gray-500/20';
  };

  const getActionIcon = (action) => {
    const icons = {
      create: FaPlus, update: FaEdit, delete: FaTrash,
      publish: FaCheck, unpublish: FaTimes, login: FaUser,
    };
    return icons[action] || FaInfoCircle;
  };

  if (loading) return <AdminLayout title="Activity Logs"><LoadingSpinner fullScreen /></AdminLayout>;

  return (
    <AdminLayout title="Activity Logs" subtitle="Track all admin actions and system events">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Activities', value: logs?.length || 0, icon: FaHistory, color: 'blue' },
          { label: 'Today', value: (logs || []).filter(l => l.timestamp?.toDate?.()?.toDateString?.() === new Date().toDateString()).length, icon: FaCalendarAlt, color: 'amber' },
          { label: 'Creations', value: (logs || []).filter(l => l.action === 'create').length, icon: FaPlus, color: 'emerald' },
          { label: 'Deletions', value: (logs || []).filter(l => l.action === 'delete').length, icon: FaTrash, color: 'red' },
        ].map(stat => (
          <div key={stat.label} className="rounded-xl border border-theme bg-linear-to-br bg-card p-4">
            <div className={`w-10 h-10 rounded-lg bg-linear-to-br from-${stat.color}-500/20 to-${stat.color}-500/5 flex items-center justify-center mb-2 border border-${stat.color}-500/10`}>
              <stat.icon className={`text-${stat.color}-400 text-base`} />
            </div>
            <p className="text-2xl font-bold text-primary">{stat.value}</p>
            <p className="text-xs text-secondary mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-3 mb-6">
        <div className="flex-1 relative">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 text-xs" />
          <input type="text" placeholder="Search activities..." value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2.5 bg-input border border-theme-strong rounded-xl text-sm text-primary placeholder-gray-500 focus:outline-none focus:border-amber-500/30" />
        </div>
        <select value={filterAction} onChange={(e) => setFilterAction(e.target.value)}
          className="px-4 py-2.5 bg-input border border-theme-strong rounded-xl text-sm text-gray-300 focus:outline-none focus:border-amber-500/30">
          <option value="all">All Actions</option>
          <option value="create">Create</option>
          <option value="update">Update</option>
          <option value="delete">Delete</option>
          <option value="publish">Publish</option>
          <option value="unpublish">Unpublish</option>
          <option value="login">Login</option>
        </select>
        <select value={filterAction} onChange={(e) => setFilterAction(e.target.value)}
          className="px-4 py-2.5 bg-input border border-theme-strong rounded-xl text-sm text-gray-300 focus:outline-none focus:border-amber-500/30">
          <option value="all">All Resources</option>
          <option value="project">Project</option>
          <option value="service">Service</option>
          <option value="blog">Blog</option>
          <option value="testimonial">Testimonial</option>
          <option value="gallery">Gallery</option>
          <option value="team">Team</option>
        </select>
      </div>

      {/* Activity List */}
      <div className="rounded-2xl border border-theme bg-linear-to-br bg-card overflow-hidden">
        {filtered.map((log, idx) => {
          const ActionIcon = getActionIcon(log.action);
          return (
            <motion.div key={log.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.02 }}
              className="flex items-center gap-4 p-4 border-b border-white/5 hover:bg-card-hover transition-colors">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 border ${getActionColor(log.action)}`}>
                <ActionIcon className="text-xs" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-primary">{log.description}</p>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-xs text-secondary flex items-center gap-1">
                    <FaUser className="text-[10px]" /> {log.user}
                  </span>
                  {log.resource && (
                    <span className="text-xs text-secondary flex items-center gap-1">
                      <FaFileAlt className="text-[10px]" /> {log.resource}
                    </span>
                  )}
                  <span className="text-xs text-gray-600">
                    {log.timestamp?.toDate?.()?.toLocaleString?.() || ''}
                  </span>
                </div>
              </div>
              <span className={`px-2 py-1 rounded-lg text-[10px] font-medium capitalize ${getActionColor(log.action)}`}>
                {log.action}
              </span>
            </motion.div>
          );
        })}
        {filtered.length === 0 && (
          <div className="text-center py-20">
            <FaHistory className="text-4xl text-gray-700 mx-auto mb-3" />
            <p className="text-secondary">No activity logs found</p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminActivityLogs;