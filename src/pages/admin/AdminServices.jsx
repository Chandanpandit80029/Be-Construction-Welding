import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlus, FaEdit, FaTrash, FaTimes, FaSave, FaTools, FaSearch, FaCog, FaWrench, FaHammer } from 'react-icons/fa';
import { useForm } from 'react-hook-form';
import { useCollection, addDocument, updateDocument, deleteDocument } from '../../hooks/useFirestore';
import { logActivity, createNotification } from '../../hooks/useActivityLog';
import { useAuth } from '../../contexts/AuthContext';
import AdminLayout from '../../components/admin/AdminLayout';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import { services as defaultServices } from '../../constants';

const AdminServices = () => {
  const [showModal, setShowModal] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { data: services, loading } = useCollection('services');
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();
  const { currentUser, userData } = useAuth();

  const allServices = [...defaultServices, ...(services || [])].filter(s =>
    s.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openModal = (service = null) => {
    if (service) {
      setEditingService(service);
      setValue('title', service.title);
      setValue('description', service.description);
      setValue('icon', service.icon);
    } else { setEditingService(null); reset(); }
    setShowModal(true);
  };

  const closeModal = () => { setShowModal(false); setEditingService(null); reset(); };

  const onSubmit = async (data) => {
    let result;
    if (editingService && editingService.id > 9) {
      result = await updateDocument('services', editingService.id, data);
      logActivity({ action: 'update', resource: 'service', resourceId: editingService.id, description: `Updated service: ${data.title}`, user: currentUser });
      createNotification({ type: 'system', title: 'Service Updated', message: `Service "${data.title}" was updated.` });
    } else {
      result = await addDocument('services', data);
      logActivity({ action: 'create', resource: 'service', resourceId: result.id, description: `Created new service: ${data.title}`, user: currentUser });
      createNotification({ type: 'system', title: 'Service Created', message: `New service "${data.title}" was added.` });
    }
    closeModal();
  };

  const handleDelete = async (id) => {
    if (id > 9 && window.confirm('Delete this service?')) {
      await deleteDocument('services', id);
      logActivity({ action: 'delete', resource: 'service', resourceId: id, description: `Deleted service`, user: currentUser });
      createNotification({ type: 'system', title: 'Service Deleted', message: `A service was deleted.` });
    }
  };

  if (loading) return <AdminLayout title="Services"><LoadingSpinner fullScreen text="Loading..." /></AdminLayout>;

  return (
    <AdminLayout title="Services Management" subtitle="Manage your construction services">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-6">
        <div className="flex-1 relative max-w-md">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 text-xs" />
          <input type="text" placeholder="Search services..." value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2.5 bg-input border border-theme-strong rounded-xl text-sm text-primary placeholder-gray-500 focus:outline-none focus:border-amber-500/30" />
        </div>
        <button onClick={() => openModal()} className="flex items-center gap-2 px-4 py-2.5 bg-white text-gray-800 border border-gray-200 hover:bg-blue-50 hover:shadow-md rounded-xl transition-all duration-300 text-sm font-medium">
          <FaPlus className="text-xs" /> Add Service
        </button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {allServices.map((service) => (
          <motion.div key={service.id} layout
            className="rounded-2xl border border-theme bg-linear-to-br bg-card p-5 hover:border-white/10 transition-all group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-linear-to-br from-amber-500/20 to-amber-500/5 flex items-center justify-center border border-amber-500/10">
                <FaTools className="text-amber-400 text-lg" />
              </div>
              <div className="flex gap-1">
                <button onClick={() => openModal(service)} className="p-2 text-secondary hover:text-amber-400 hover:bg-amber-500/10 rounded-lg transition-all"><FaEdit className="text-xs" /></button>
                {service.id > 9 && <button onClick={() => handleDelete(service.id)} className="p-2 text-secondary hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"><FaTrash className="text-xs" /></button>}
              </div>
            </div>
            <h3 className="text-sm font-semibold text-primary mb-1">{service.title}</h3>
            <p className="text-xs text-secondary line-clamp-3">{service.description}</p>
            {service.features && (
              <div className="flex flex-wrap gap-1.5 mt-3">
                {service.features.slice(0, 3).map((f, i) => <span key={i} className="px-2 py-0.5 bg-input rounded-lg text-[10px] text-gray-400">{f}</span>)}
                {service.features.length > 3 && <span className="px-2 py-0.5 bg-amber-500/10 rounded-lg text-[10px] text-amber-400">+{service.features.length - 3}</span>}
              </div>
            )}
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={closeModal}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-lg bg-elevated border border-theme-strong rounded-2xl shadow-2xl shadow-black/50">
              <div className="flex items-center justify-between p-6 border-b border-white/5">
                <h3 className="text-lg font-bold text-primary">{editingService ? 'Edit Service' : 'Add Service'}</h3>
                <button onClick={closeModal} className="p-2 text-secondary hover:text-primary hover:bg-input rounded-lg"><FaTimes className="text-sm" /></button>
              </div>
              <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">Service Title *</label>
                  <input type="text" {...register('title', { required: true })}
                    className="w-full px-4 py-2.5 bg-input border border-theme-strong rounded-xl text-sm text-primary placeholder-gray-500 focus:outline-none focus:border-amber-500/30" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">Description *</label>
                  <textarea {...register('description', { required: true })}
                    className="w-full px-4 py-2.5 bg-input border border-theme-strong rounded-xl text-sm text-primary placeholder-gray-500 focus:outline-none focus:border-amber-500/30 h-24 resize-none" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">Icon</label>
                  <input type="text" {...register('icon')}
                    className="w-full px-4 py-2.5 bg-input border border-theme-strong rounded-xl text-sm text-primary placeholder-gray-500 focus:outline-none focus:border-amber-500/30"
                    placeholder="FaTools" />
                </div>
                <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
                  <button type="button" onClick={closeModal} className="px-4 py-2.5 text-sm text-gray-500 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:text-gray-700 hover:shadow-sm transition-all duration-300">Cancel</button>
                  <button type="submit" className="flex items-center gap-2 px-4 py-2.5 text-sm bg-white text-gray-800 border border-gray-200 hover:bg-blue-50 hover:shadow-md rounded-xl transition-all duration-300 font-medium">
                    <FaSave className="text-xs" /> {editingService ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AdminLayout>
  );
};

export default AdminServices;

