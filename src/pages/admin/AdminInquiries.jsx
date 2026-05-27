import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaEnvelope, FaEye, FaTrash, FaCheck, FaSearch, FaTimes, FaUser, FaPhone, FaMapMarkerAlt, FaDollarSign } from 'react-icons/fa';
import { useRealtimeCollection, updateDocument, deleteDocument } from '../../hooks/useFirestore';
import AdminLayout from '../../components/admin/AdminLayout';
import LoadingSpinner from '../../components/shared/LoadingSpinner';

const AdminInquiries = () => {
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const { data: inquiries, loading } = useRealtimeCollection('inquiries', { orderBy: 'createdAt', orderDirection: 'desc' });

  const filteredInquiries = inquiries?.filter(inquiry => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = !searchTerm ||
      inquiry.name?.toLowerCase().includes(searchLower) ||
      inquiry.email?.toLowerCase().includes(searchLower) ||
      inquiry.subject?.toLowerCase().includes(searchLower) ||
      inquiry.description?.toLowerCase().includes(searchLower);
    const matchesFilter = filter === 'all' || inquiry.status === filter || (filter === 'new' && (inquiry.status === 'new' || inquiry.status === 'unread'));
    return matchesSearch && matchesFilter;
  });

  const markAsRead = async (id) => {
    await updateDocument('inquiries', id, { status: 'read' });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this inquiry?')) await deleteDocument('inquiries', id);
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    if (timestamp?.toDate) {
      return timestamp.toDate().toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    }
    try {
      return new Date(timestamp).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    } catch {
      return 'N/A';
    }
  };

  const truncateText = (text, maxLength = 80) => {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  if (loading) return <AdminLayout title="Inquiries"><LoadingSpinner fullScreen text="Loading..." /></AdminLayout>;

  const newCount = inquiries?.filter(i => i.status === 'new' || i.status === 'unread').length || 0;

  return (
    <AdminLayout title="Inquiry Management" subtitle="View and manage customer inquiries from the inquiries collection">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total', value: inquiries?.length || 0, color: 'blue' },
          { label: 'New/Unread', value: newCount, color: 'amber' },
          { label: 'Read', value: (inquiries?.length || 0) - newCount, color: 'emerald' },
          { label: 'Response Rate', value: '92%', color: 'violet' },
        ].map(s => (
          <div key={s.label} className="rounded-xl border border-theme bg-linear-to-br bg-card p-4">
            <p className="text-2xl font-bold text-primary">{s.value}</p>
            <p className="text-xs text-secondary mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-col lg:flex-row gap-3 mb-6">
        <div className="flex-1 relative">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary text-xs" />
          <input type="text" placeholder="Search by name, email, subject, or description..."
            value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2.5 bg-input border border-theme-strong rounded-xl text-sm text-primary placeholder-gray-500 focus:outline-none focus:border-amber-500/30" />
        </div>
        <select value={filter} onChange={(e) => setFilter(e.target.value)}
          className="px-4 py-2.5 bg-input border border-theme-strong rounded-xl text-sm text-primary focus:outline-none focus:border-amber-500/30">
          <option value="all">All</option>
          <option value="new">New</option>
          <option value="unread">Unread</option>
          <option value="read">Read</option>
        </select>
      </div>

      <div className="rounded-2xl border border-theme bg-linear-to-br bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left px-4 py-3 text-xs font-semibold text-secondary uppercase">Customer</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-secondary uppercase">Subject</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-secondary uppercase">Description</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-secondary uppercase">Status</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-secondary uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredInquiries?.map((inquiry) => (
                <tr key={inquiry.id} className={`hover:bg-card-hover transition-colors ${inquiry.status === 'new' || inquiry.status === 'unread' ? 'bg-amber-500/2' : ''}`}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${inquiry.status === 'new' || inquiry.status === 'unread' ? 'bg-amber-400' : 'bg-emerald-400'}`} />
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-primary truncate max-w-[140px]">{inquiry.name}</p>
                        <p className="text-[10px] text-secondary truncate max-w-[140px]">{inquiry.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-secondary max-w-[150px]">
                    <span className="truncate block">{inquiry.subject}</span>
                  </td>
                  <td className="px-4 py-3 max-w-[200px]">
                    <div className="flex items-center gap-1">
                      <p className="text-sm text-secondary truncate flex-1">
                        {inquiry.description ? truncateText(inquiry.description, 60) : inquiry.message ? truncateText(inquiry.message, 60) : '—'}
                      </p>
                      {(inquiry.description?.length > 60 || inquiry.message?.length > 60) && (
                        <button onClick={() => setSelectedInquiry(inquiry)} className="text-amber-400 hover:text-amber-300 text-xs whitespace-nowrap flex-shrink-0">more</button>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-lg text-[10px] font-medium ${
                      inquiry.status === 'new' || inquiry.status === 'unread'
                        ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    }`}>{inquiry.status}</span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => setSelectedInquiry(inquiry)}
                        className="p-2 text-secondary hover:text-amber-400 hover:bg-amber-500/10 rounded-lg transition-all"
                        title="View Details">
                        <FaEye className="text-xs" />
                      </button>
                      {inquiry.status !== 'read' && (
                        <button onClick={() => markAsRead(inquiry.id)}
                          className="p-2 text-secondary hover:text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-all"
                          title="Mark as Read">
                          <FaCheck className="text-xs" />
                        </button>
                      )}
                      <button onClick={() => handleDelete(inquiry.id)}
                        className="p-2 text-secondary hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                        title="Delete">
                        <FaTrash className="text-xs" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {(!filteredInquiries || filteredInquiries.length === 0) && (
          <div className="text-center py-20">
            <FaEnvelope className="text-4xl text-gray-700 mx-auto mb-3" />
            <p className="text-secondary">No inquiries found</p>
          </div>
        )}
      </div>

      {/* Detail Modal - Full Customer Message View */}
      <AnimatePresence>
        {selectedInquiry && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedInquiry(null)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-2xl bg-elevated border border-theme-strong rounded-2xl shadow-2xl shadow-black/50 max-h-[90vh] flex flex-col">
              
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 pb-4 border-b border-white/5">
                <div>
                  <h3 className="text-lg font-bold text-primary">Inquiry Details</h3>
                  <p className="text-xs text-secondary mt-0.5">{selectedInquiry.subject || 'No subject'}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-2.5 py-1 rounded-lg text-[10px] font-medium ${
                    selectedInquiry.status === 'new' || selectedInquiry.status === 'unread'
                      ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  }`}>{selectedInquiry.status}</span>
                  <button onClick={() => setSelectedInquiry(null)} className="text-secondary hover:text-primary transition-colors">
                    <FaTimes />
                  </button>
                </div>
              </div>

              {/* Modal Body - Scrollable */}
              <div className="p-6 overflow-y-auto flex-1 space-y-6">
                {/* Customer Information */}
                <div>
                  <h4 className="text-xs font-semibold text-secondary uppercase tracking-wider mb-3">Customer Information</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="flex items-center gap-3 p-3 bg-input rounded-xl">
                      <FaUser className="text-amber-400/70 text-sm flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-[10px] text-secondary">Name</p>
                        <p className="text-sm text-primary font-medium">{selectedInquiry.name}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-input rounded-xl">
                      <FaEnvelope className="text-amber-400/70 text-sm flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-[10px] text-secondary">Email</p>
                        <p className="text-sm text-primary truncate">{selectedInquiry.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-input rounded-xl">
                      <FaPhone className="text-amber-400/70 text-sm flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-[10px] text-secondary">Phone</p>
                        <p className="text-sm text-primary">{selectedInquiry.phone || '—'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-input rounded-xl">
                      <FaMapMarkerAlt className="text-amber-400/70 text-sm flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-[10px] text-secondary">Location</p>
                        <p className="text-sm text-primary truncate">{selectedInquiry.location || '—'}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Additional Details (if available) */}
                {(selectedInquiry.service || selectedInquiry.budget) && (
                  <div>
                    <h4 className="text-xs font-semibold text-secondary uppercase tracking-wider mb-3">Project Details</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {selectedInquiry.service && (
                        <div className="p-3 bg-input rounded-xl">
                          <p className="text-[10px] text-secondary">Service</p>
                          <p className="text-sm text-primary font-medium">{selectedInquiry.service}</p>
                        </div>
                      )}
                      {selectedInquiry.budget && (
                        <div className="p-3 bg-input rounded-xl">
                          <p className="text-[10px] text-secondary">Budget</p>
                          <p className="text-sm text-primary font-medium">{selectedInquiry.budget}</p>
                        </div>
                      )}
                      <div className="p-3 bg-input rounded-xl">
                        <p className="text-[10px] text-secondary">Date</p>
                        <p className="text-sm text-primary">{formatDate(selectedInquiry.createdAt)}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Source */}
                {selectedInquiry.source && (
                  <div>
                    <h4 className="text-xs font-semibold text-secondary uppercase tracking-wider mb-2">Source</h4>
                    <div className="p-3 bg-input rounded-xl">
                      <p className="text-sm text-primary">{selectedInquiry.source}</p>
                    </div>
                  </div>
                )}

                {/* Full Description / Message - EXPANDED, SCROLLABLE, VISIBLE TEXT */}
                <div>
                  <h4 className="text-xs font-semibold text-secondary uppercase tracking-wider mb-2">Full Message / Description</h4>
                  <div className="bg-input rounded-xl border border-theme-strong">
                    {(selectedInquiry.description || selectedInquiry.message) ? (
                      <div className="p-4 max-h-[300px] overflow-y-auto whitespace-pre-wrap break-words text-sm text-primary leading-relaxed font-normal">
                        {selectedInquiry.description || selectedInquiry.message}
                      </div>
                    ) : (
                      <div className="p-4 text-sm text-secondary italic">No description provided</div>
                    )}
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-6 pt-4 border-t border-white/5">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                  <div className="text-xs text-secondary">
                    {selectedInquiry.email && (
                      <a href={`mailto:${selectedInquiry.email}`}
                        className="inline-flex items-center gap-2 px-4 py-2.5 text-sm bg-secondary/10 text-primary border border-theme-strong rounded-xl hover:bg-hover transition-all duration-300 font-medium">
                        <FaEnvelope className="text-xs" /> Reply via Email
                      </a>
                    )}
                  </div>
                  <div className="flex gap-2">
                    {selectedInquiry.status !== 'read' && (
                      <button onClick={() => { markAsRead(selectedInquiry.id); setSelectedInquiry(prev => ({ ...prev, status: 'read' })); }}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 rounded-xl transition-all duration-300 font-medium">
                        <FaCheck className="text-xs" /> Mark as Read
                      </button>
                    )}
                    <button onClick={() => setSelectedInquiry(null)}
                      className="px-4 py-2.5 text-sm text-secondary border border-theme-strong rounded-xl hover:bg-hover transition-all duration-300">
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AdminLayout>
  );
};

export default AdminInquiries;