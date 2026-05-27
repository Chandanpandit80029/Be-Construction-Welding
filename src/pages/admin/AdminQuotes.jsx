import React, { useState } from 'react';
import { FaEye, FaTrash, FaCheck, FaSearch, FaFileAlt, FaTimes, FaChevronDown, FaChevronUp, FaCalendarAlt, FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaDollarSign, FaCog } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { useRealtimeCollection, updateDocument, deleteDocument } from '../../hooks/useFirestore';
import AdminLayout from '../../components/admin/AdminLayout';
import LoadingSpinner from '../../components/shared/LoadingSpinner';

const AdminQuotes = () => {
  const [selectedQuote, setSelectedQuote] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedId, setExpandedId] = useState(null);
  const { data: quotes, loading } = useRealtimeCollection('quoteRequests', { orderBy: 'createdAt', orderDirection: 'desc' });

  const filteredQuotes = quotes?.filter(q => {
    const matchFilter = filter === 'all' || q.status === filter || (filter === 'pending' && q.status === 'new');
    const searchLower = searchTerm.toLowerCase();
    const matchSearch = !searchTerm ||
      q.name?.toLowerCase().includes(searchLower) ||
      q.email?.toLowerCase().includes(searchLower) ||
      q.service?.toLowerCase().includes(searchLower) ||
      q.subject?.toLowerCase().includes(searchLower) ||
      q.description?.toLowerCase().includes(searchLower);
    return matchFilter && matchSearch;
  });

  const updateStatus = async (id, status) => {
    await updateDocument('quoteRequests', id, { status });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this quote request?')) await deleteDocument('quoteRequests', id);
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

  const truncateText = (text, maxLength = 100) => {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'pending': return 'bg-amber-500/10 text-amber-400 border border-amber-500/20';
      case 'approved': return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
      case 'completed': return 'bg-blue-500/10 text-blue-400 border border-blue-500/20';
      case 'rejected': return 'bg-red-500/10 text-red-400 border border-red-500/20';
      default: return 'bg-gray-500/10 text-gray-400 border border-gray-500/20';
    }
  };

  if (loading) return <AdminLayout title="Quote Requests"><LoadingSpinner fullScreen /></AdminLayout>;

  const pending = quotes?.filter(q => q.status === 'pending').length || 0;

  return (
    <AdminLayout title="Quote Requests" subtitle="Manage customer quote requests from the quoteRequests collection">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total', value: quotes?.length || 0, color: 'blue' },
          { label: 'Pending', value: pending, color: 'amber' },
          { label: 'Approved', value: quotes?.filter(q => q.status === 'approved').length || 0, color: 'emerald' },
          { label: 'Rejected', value: quotes?.filter(q => q.status === 'rejected').length || 0, color: 'red' },
        ].map(s => (
          <div key={s.label} className="rounded-xl border border-theme bg-linear-to-br bg-card p-4">
            <p className="text-2xl font-bold text-primary">{s.value}</p>
            <p className="text-xs text-secondary mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col lg:flex-row gap-3 mb-6">
        <div className="flex-1 relative">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary text-xs" />
          <input type="text" placeholder="Search by name, email, service, subject, or description..."
            value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2.5 bg-input border border-theme-strong rounded-xl text-sm text-primary placeholder-gray-500 focus:outline-none focus:border-amber-500/30" />
        </div>
        <select value={filter} onChange={(e) => setFilter(e.target.value)}
          className="px-4 py-2.5 bg-input border border-theme-strong rounded-xl text-sm text-primary focus:outline-none focus:border-amber-500/30">
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-theme bg-linear-to-br bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left px-4 py-3 text-xs font-semibold text-secondary uppercase">Customer</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-secondary uppercase">Service</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-secondary uppercase">Budget</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-secondary uppercase">Description</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-secondary uppercase">Status</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-secondary uppercase">Date</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-secondary uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredQuotes?.map((quote) => (
                <tr key={quote.id} className="hover:bg-card-hover transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center flex-shrink-0">
                        <FaUser className="text-purple-400 text-[10px]" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-primary truncate max-w-[140px]">{quote.name}</p>
                        <p className="text-[10px] text-secondary truncate max-w-[140px]">{quote.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-secondary max-w-[120px]">
                    <span className="truncate block">{quote.service}</span>
                  </td>
                  <td className="px-4 py-3 text-sm text-secondary">{quote.budget || '—'}</td>
                  <td className="px-4 py-3 max-w-[200px]">
                    <div className="flex items-center gap-1">
                      <p className="text-sm text-secondary truncate flex-1">
                        {quote.description ? truncateText(quote.description, 80) : '—'}
                      </p>
                      {quote.description && quote.description.length > 80 && (
                        <button onClick={() => setSelectedQuote(quote)} className="text-amber-400 hover:text-amber-300 text-xs whitespace-nowrap flex-shrink-0">
                          more
                        </button>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-lg text-[10px] font-medium ${getStatusBadgeClass(quote.status)}`}>
                      {quote.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-secondary whitespace-nowrap">
                    {formatDate(quote.createdAt)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => setSelectedQuote(quote)}
                        className="p-2 text-secondary hover:text-amber-400 hover:bg-amber-500/10 rounded-lg transition-all"
                        title="View Details">
                        <FaEye className="text-xs" />
                      </button>
                      {quote.status === 'pending' && (
                        <>
                          <button onClick={() => updateStatus(quote.id, 'approved')}
                            className="p-2 text-secondary hover:text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-all"
                            title="Approve">
                            <FaCheck className="text-xs" />
                          </button>
                          <button onClick={() => updateStatus(quote.id, 'rejected')}
                            className="p-2 text-secondary hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                            title="Reject">
                            <FaTimes className="text-xs" />
                          </button>
                        </>
                      )}
                      <button onClick={() => handleDelete(quote.id)}
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
        {(!filteredQuotes || filteredQuotes.length === 0) && (
          <div className="text-center py-20">
            <FaFileAlt className="text-4xl text-gray-700 mx-auto mb-3" />
            <p className="text-secondary">No quote requests found</p>
          </div>
        )}
      </div>

      {/* Detail Modal - Full Customer Message View */}
      <AnimatePresence>
        {selectedQuote && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedQuote(null)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-2xl bg-elevated border border-theme-strong rounded-2xl shadow-2xl shadow-black/50 max-h-[90vh] flex flex-col">
              
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 pb-4 border-b border-white/5">
                <div>
                  <h3 className="text-lg font-bold text-primary">Quote Request Details</h3>
                  <p className="text-xs text-secondary mt-0.5">{selectedQuote.subject || 'No subject'}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-2.5 py-1 rounded-lg text-[10px] font-medium ${getStatusBadgeClass(selectedQuote.status)}`}>
                    {selectedQuote.status}
                  </span>
                  <button onClick={() => setSelectedQuote(null)} className="text-secondary hover:text-primary transition-colors">
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
                        <p className="text-sm text-primary font-medium">{selectedQuote.name}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-input rounded-xl">
                      <FaEnvelope className="text-amber-400/70 text-sm flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-[10px] text-secondary">Email</p>
                        <p className="text-sm text-primary truncate">{selectedQuote.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-input rounded-xl">
                      <FaPhone className="text-amber-400/70 text-sm flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-[10px] text-secondary">Phone</p>
                        <p className="text-sm text-primary">{selectedQuote.phone || '—'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-input rounded-xl">
                      <FaMapMarkerAlt className="text-amber-400/70 text-sm flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-[10px] text-secondary">Location</p>
                        <p className="text-sm text-primary truncate">{selectedQuote.location || '—'}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Project Details */}
                <div>
                  <h4 className="text-xs font-semibold text-secondary uppercase tracking-wider mb-3">Project Details</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="p-3 bg-input rounded-xl">
                      <p className="text-[10px] text-secondary">Service Type</p>
                      <p className="text-sm text-primary font-medium">{selectedQuote.service}</p>
                    </div>
                    <div className="p-3 bg-input rounded-xl">
                      <p className="text-[10px] text-secondary">Budget</p>
                      <p className="text-sm text-primary font-medium">{selectedQuote.budget || 'Not specified'}</p>
                    </div>
                    <div className="p-3 bg-input rounded-xl">
                      <p className="text-[10px] text-secondary">Submission Date</p>
                      <p className="text-sm text-primary">{formatDate(selectedQuote.createdAt)}</p>
                    </div>
                  </div>
                </div>

                {/* Subject */}
                {selectedQuote.subject && (
                  <div>
                    <h4 className="text-xs font-semibold text-secondary uppercase tracking-wider mb-2">Subject</h4>
                    <div className="p-3 bg-input rounded-xl">
                      <p className="text-sm text-primary">{selectedQuote.subject}</p>
                    </div>
                  </div>
                )}

                {/* Full Description / Message - EXPANDED, SCROLLABLE, VISIBLE TEXT */}
                <div>
                  <h4 className="text-xs font-semibold text-secondary uppercase tracking-wider mb-2">Full Description / Message</h4>
                  <div className="bg-input rounded-xl border border-theme-strong">
                    {selectedQuote.description ? (
                      <div className="p-4 max-h-[300px] overflow-y-auto whitespace-pre-wrap break-words text-sm text-primary leading-relaxed font-normal">
                        {selectedQuote.description}
                      </div>
                    ) : (
                      <div className="p-4 text-sm text-secondary italic">No description provided</div>
                    )}
                  </div>
                </div>

                {/* Attachment */}
                {selectedQuote.attachment && (
                  <div>
                    <h4 className="text-xs font-semibold text-secondary uppercase tracking-wider mb-2">Attachment</h4>
                    <div className="flex items-center gap-3 p-3 bg-input rounded-xl border border-theme-strong">
                      <FaFileAlt className="text-amber-400 text-base" />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm text-primary truncate">{selectedQuote.attachment}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Footer - Status Update */}
              <div className="p-6 pt-4 border-t border-white/5">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-secondary">Update Status:</span>
                    <select
                      value={selectedQuote.status || 'pending'}
                      onChange={(e) => {
                        updateStatus(selectedQuote.id, e.target.value);
                        setSelectedQuote(prev => ({ ...prev, status: e.target.value }));
                      }}
                      className="px-3 py-2 bg-input border border-theme-strong rounded-lg text-sm text-primary focus:outline-none focus:border-amber-500/30">
                      <option value="pending">Pending</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                  <div className="flex gap-2">
                    {selectedQuote.status === 'pending' && (
                      <>
                        <button onClick={() => { updateStatus(selectedQuote.id, 'approved'); setSelectedQuote(prev => ({ ...prev, status: 'approved' })); }}
                          className="flex items-center gap-2 px-4 py-2.5 text-sm bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 rounded-xl transition-all duration-300 font-medium">
                          <FaCheck className="text-xs" /> Approve
                        </button>
                        <button onClick={() => { updateStatus(selectedQuote.id, 'rejected'); setSelectedQuote(prev => ({ ...prev, status: 'rejected' })); }}
                          className="flex items-center gap-2 px-4 py-2.5 text-sm bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 rounded-xl transition-all duration-300 font-medium">
                          <FaTimes className="text-xs" /> Reject
                        </button>
                      </>
                    )}
                    <button onClick={() => setSelectedQuote(null)}
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

export default AdminQuotes;