import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FaBell, FaEnvelope, FaFileAlt, FaProjectDiagram, FaStar,
  FaTrash, FaCheck, FaCheckDouble, FaFilter, FaCalendarAlt,
  FaUser, FaCog, FaExclamationCircle, FaInfoCircle
} from 'react-icons/fa';
import AdminLayout from '../../components/admin/AdminLayout';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import { useRealtimeCollection, updateDocument, deleteDocument, addDocument } from '../../hooks/useFirestore';

const AdminNotifications = () => {
  const { data: notifications, loading } = useRealtimeCollection('notifications', { orderBy: 'createdAt', orderDirection: 'desc' });

  const [filter, setFilter] = useState('all');

  const filtered = (notifications || []).filter(n => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !n.read;
    return n.type === filter;
  });

  const markAsRead = async (id) => {
    await updateDocument('notifications', id, { read: true });
  };

  const markAllRead = async () => {
    if (notifications) {
      notifications.forEach(async (n) => {
        if (!n.read) await updateDocument('notifications', n.id, { read: true });
      });
    }
  };

  const deleteNotification = async (id) => {
    await deleteDocument('notifications', id);
  };

  const getIcon = (type) => {
    const icons = { quote: FaFileAlt, inquiry: FaEnvelope, project: FaProjectDiagram, testimonial: FaStar, system: FaCog };
    return icons[type] || FaBell;
  };

  const getColor = (type) => {
    const colors = { quote: 'amber', inquiry: 'blue', project: 'emerald', testimonial: 'violet', system: 'gray' };
    return colors[type] || 'gray';
  };

  const unreadCount = (notifications || []).filter(n => !n.read).length;

  if (loading) return <AdminLayout title="Notifications"><LoadingSpinner fullScreen /></AdminLayout>;

  return (
    <AdminLayout title="Notifications" subtitle="Stay updated with all activities">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Notifications', value: notifications?.length || 0, icon: FaBell, color: 'blue' },
          { label: 'Unread', value: unreadCount, icon: FaExclamationCircle, color: 'amber' },
          { label: 'Read', value: (notifications?.length || 0) - unreadCount, icon: FaCheck, color: 'emerald' },
          { label: 'Today', value: notifications?.filter(n => n.createdAt?.toDate?.()?.toDateString?.() === new Date().toDateString()).length || 0, icon: FaCalendarAlt, color: 'violet' },
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

      {/* Filter & Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div className="flex flex-wrap gap-2">
          {[{ value: 'all', label: 'All' }, { value: 'unread', label: 'Unread' }, { value: 'quote', label: 'Quotes' }, { value: 'inquiry', label: 'Inquiries' }, { value: 'project', label: 'Projects' }, { value: 'testimonial', label: 'Testimonials' }, { value: 'system', label: 'System' }].map(f => (
            <button key={f.value} onClick={() => setFilter(f.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all capitalize ${filter === f.value ? 'bg-amber-500/10 border border-amber-500/20 text-amber-400' : 'bg-input border border-theme-strong text-gray-400 hover:text-primary hover:bg-white/10'}`}>
              {f.label}
            </button>
          ))}
        </div>
        <button onClick={markAllRead} className="flex items-center gap-2 px-3 py-1.5 bg-input border border-theme-strong text-gray-400 rounded-lg hover:text-primary hover:bg-white/10 transition-all text-xs">
          <FaCheckDouble className="text-[10px]" /> Mark All Read
        </button>
      </div>

      {/* Notifications List */}
      <div className="rounded-2xl border border-theme bg-linear-to-br bg-card overflow-hidden">
        {filtered.map((notif, idx) => {
          const Icon = getIcon(notif.type);
          const color = getColor(notif.type);
          return (
            <motion.div key={notif.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.03 }}
              className={`flex items-center gap-4 p-4 border-b border-white/5 hover:bg-card-hover transition-colors ${!notif.read ? 'bg-amber-500/[0.02]' : ''}`}>
              <div className={`w-10 h-10 rounded-lg bg-linear-to-br from-${color}-500/20 to-${color}-500/5 flex items-center justify-center flex-shrink-0 border border-${color}-500/10`}>
                <Icon className={`text-${color}-400 text-sm`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm ${notif.read ? 'text-gray-400' : 'text-primary font-medium'}`}>{notif.message || notif.text}</p>
                <p className="text-xs text-gray-600 mt-0.5">{notif.createdAt?.toDate?.()?.toLocaleString?.() || notif.time || ''}</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                {!notif.read && (
                  <button onClick={() => markAsRead(notif.id)} className="p-2 text-secondary hover:text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-all" title="Mark as read">
                    <FaCheck className="text-xs" />
                  </button>
                )}
                <button onClick={() => deleteNotification(notif.id)} className="p-2 text-secondary hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all" title="Delete">
                  <FaTrash className="text-xs" />
                </button>
              </div>
            </motion.div>
          );
        })}
        {filtered.length === 0 && (
          <div className="text-center py-16">
            <FaBell className="text-4xl text-gray-700 mx-auto mb-3" />
            <p className="text-secondary">No notifications found</p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminNotifications;