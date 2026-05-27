import React, { useState } from 'react';
import { FaCheck, FaTimes, FaEdit, FaTrash, FaStar, FaSearch, FaFilter } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useCollection, updateDocument, deleteDocument } from '../../hooks/useFirestore';
import AdminLayout from '../../components/admin/AdminLayout';
import LoadingSpinner from '../../components/shared/LoadingSpinner';

const AdminTestimonials = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const { data: testimonials, loading } = useCollection('testimonials');

  const filtered = testimonials?.filter(t => {
    const matchSearch = t.name?.toLowerCase().includes(searchTerm.toLowerCase()) || t.comment?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = filterStatus === 'all' || t.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const handleApprove = async (id) => {
    await updateDocument('testimonials', id, { status: 'approved' });
  };

  const handleReject = async (id) => {
    await updateDocument('testimonials', id, { status: 'rejected' });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this testimonial?')) await deleteDocument('testimonials', id);
  };

  if (loading) return <AdminLayout title="Testimonials"><LoadingSpinner fullScreen /></AdminLayout>;

  const approved = testimonials?.filter(t => t.status === 'approved').length || 0;

  return (
    <AdminLayout title="Testimonials Management" subtitle="Manage client testimonials and reviews">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total', value: testimonials?.length || 0, color: 'blue' },
          { label: 'Approved', value: approved, color: 'emerald' },
          { label: 'Pending', value: (testimonials?.length || 0) - approved, color: 'amber' },
          { label: 'Avg Rating', value: '4.8 ★', color: 'violet' },
        ].map(s => (
          <div key={s.label} className="rounded-xl border border-theme bg-linear-to-br bg-card p-4">
            <p className="text-2xl font-bold text-primary">{s.value}</p>
            <p className="text-xs text-secondary mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-col lg:flex-row gap-3 mb-6">
        <div className="flex-1 relative">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 text-xs" />
          <input type="text" placeholder="Search testimonials..." value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2.5 bg-input border border-theme-strong rounded-xl text-sm text-primary placeholder-gray-500 focus:outline-none focus:border-amber-500/30" />
        </div>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2.5 bg-input border border-theme-strong rounded-xl text-sm text-gray-300 focus:outline-none focus:border-amber-500/30">
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {filtered?.map((item, idx) => (
          <motion.div key={item.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.03 }}
            className="rounded-2xl border border-theme bg-linear-to-br bg-card p-5 hover:border-white/10 transition-all"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-linear-to-br from-amber-500/20 to-amber-500/5 flex items-center justify-center border border-amber-500/10 text-amber-400 font-bold text-sm">
                  {item.name?.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-semibold text-primary">{item.name}</p>
                  <p className="text-xs text-secondary">{item.company}</p>
                </div>
              </div>
              <span className={`px-2 py-1 rounded-lg text-[10px] font-medium ${
                item.status === 'approved' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                item.status === 'rejected' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                'bg-amber-500/10 text-amber-400 border border-amber-500/20'
              }`}>{item.status || 'pending'}</span>
            </div>
            <div className="flex gap-0.5 mb-2">
              {[1,2,3,4,5].map(s => <FaStar key={s} className={`text-[10px] ${s <= (item.rating || 5) ? 'text-amber-400' : 'text-gray-600'}`} />)}
              <span className="text-xs text-secondary ml-2">{item.project}</span>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed mb-3">"{item.comment}"</p>
            <div className="flex items-center gap-2">
              {item.status !== 'approved' && <button onClick={() => handleApprove(item.id)} className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg text-xs hover:bg-emerald-500/20 transition-all"><FaCheck className="text-[10px]" /> Approve</button>}
              {item.status !== 'rejected' && <button onClick={() => handleReject(item.id)} className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-xs hover:bg-red-500/20 transition-all"><FaTimes className="text-[10px]" /> Reject</button>}
              <button onClick={() => handleDelete(item.id)} className="p-2 text-secondary hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"><FaTrash className="text-xs" /></button>
            </div>
          </motion.div>
        ))}
        {(!filtered || filtered.length === 0) && (
          <div className="col-span-full text-center py-20">
            <FaStar className="text-4xl text-gray-700 mx-auto mb-3" />
            <p className="text-secondary">No testimonials found</p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminTestimonials;

