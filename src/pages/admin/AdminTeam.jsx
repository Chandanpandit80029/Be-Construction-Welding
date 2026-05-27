import React, { useState } from 'react';
import { FaPlus, FaEdit, FaTrash, FaSave, FaTimes, FaSearch, FaUsers, FaFacebook, FaInstagram, FaLinkedin, FaTwitter, FaImage } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { useCollection, addDocument, updateDocument, deleteDocumentWithAsset } from '../../hooks/useFirestore';
import { getImageUrl } from '../../utils/image';
import AdminLayout from '../../components/admin/AdminLayout';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import ImageUploader from '../../components/shared/ImageUploader';
import { useForm } from 'react-hook-form';

const AdminTeam = () => {
  const [showModal, setShowModal] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [memberImage, setMemberImage] = useState(null);
  const { data: members, loading } = useCollection('teamMembers');
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();

  const filtered = members?.filter(m => m.name?.toLowerCase().includes(searchTerm.toLowerCase()));

  const openModal = (member = null) => {
    if (member) {
      setEditingMember(member);
      setMemberImage(member.image || null);
      setValue('name', member.name);
      setValue('position', member.position);
      setValue('description', member.description);
      setValue('facebook', member.facebook || '');
      setValue('instagram', member.instagram || '');
      setValue('linkedin', member.linkedin || '');
      setValue('twitter', member.twitter || '');
    } else { setEditingMember(null); reset(); setMemberImage(null); }
    setShowModal(true);
  };

  const onSubmit = async (data) => {
    const memberData = { ...data, image: memberImage || '' };
    if (editingMember) await updateDocument('teamMembers', editingMember.id, memberData);
    else await addDocument('teamMembers', memberData);
    setShowModal(false); setEditingMember(null); setMemberImage(null);
  };

  const handleDelete = async (member) => {
    if (!window.confirm('Delete this team member?')) return;

    await deleteDocumentWithAsset('teamMembers', member.id);
  };

  if (loading) return <AdminLayout title="Team"><LoadingSpinner fullScreen /></AdminLayout>;

  return (
    <AdminLayout title="Team Management" subtitle="Manage your team members">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-6">
        <div className="flex-1 relative max-w-md">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 text-xs" />
          <input type="text" placeholder="Search team members..." value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2.5 bg-input border border-theme-strong rounded-xl text-sm text-primary placeholder-gray-500 focus:outline-none focus:border-amber-500/30" />
        </div>
        <button onClick={() => openModal()}
          className="flex items-center gap-2 px-4 py-2.5 bg-white text-gray-800 border border-gray-200 hover:bg-blue-50 hover:shadow-md rounded-xl transition-all duration-300 text-sm font-medium">
          <FaPlus className="text-xs" /> Add Member
        </button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered?.map((member, idx) => (
          <motion.div key={member.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.03 }}
            className="rounded-2xl border border-theme bg-linear-to-br bg-card p-5 text-center hover:border-white/10 transition-all group"
          >
            <div className="w-16 h-16 rounded-full bg-linear-to-br from-amber-500/20 to-amber-500/5 flex items-center justify-center mx-auto mb-3 border border-amber-500/10">
              <span className="text-amber-400 font-bold text-xl">{member.name?.charAt(0)}</span>
            </div>
            <h3 className="text-sm font-semibold text-primary">{member.name}</h3>
            <p className="text-xs text-amber-400 mt-0.5">{member.position}</p>
            <p className="text-xs text-secondary mt-2 line-clamp-2">{member.description}</p>
            <div className="flex items-center justify-center gap-2 mt-3">
              {member.facebook && <a href={member.facebook} target="_blank" className="p-1.5 text-secondary hover:text-blue-400 transition-colors"><FaFacebook className="text-xs" /></a>}
              {member.instagram && <a href={member.instagram} target="_blank" className="p-1.5 text-secondary hover:text-pink-400 transition-colors"><FaInstagram className="text-xs" /></a>}
              {member.linkedin && <a href={member.linkedin} target="_blank" className="p-1.5 text-secondary hover:text-blue-600 transition-colors"><FaLinkedin className="text-xs" /></a>}
              {member.twitter && <a href={member.twitter} target="_blank" className="p-1.5 text-secondary hover:text-sky-400 transition-colors"><FaTwitter className="text-xs" /></a>}
            </div>
            <div className="flex items-center gap-2 mt-4 pt-3 border-t border-white/5">
              <button onClick={() => openModal(member)} className="flex-1 py-2 bg-input rounded-lg text-xs text-gray-400 hover:text-amber-400 hover:bg-amber-500/10 transition-all"><FaEdit className="inline mr-1 text-[10px]" /> Edit</button>
              <button onClick={() => handleDelete(member)} className="flex-1 py-2 bg-input rounded-lg text-xs text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all"><FaTrash className="inline mr-1 text-[10px]" /> Delete</button>
            </div>
          </motion.div>
        ))}
        {(!filtered || filtered.length === 0) && (
          <div className="col-span-full text-center py-20">
            <FaUsers className="text-4xl text-gray-700 mx-auto mb-3" />
            <p className="text-secondary">No team members found</p>
          </div>
        )}
      </div>

      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowModal(false)}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-lg bg-elevated border border-theme-strong rounded-2xl shadow-2xl shadow-black/50 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-primary">{editingMember ? 'Edit Member' : 'Add Member'}</h3>
                <button onClick={() => setShowModal(false)} className="p-2 text-secondary hover:text-primary hover:bg-input rounded-lg"><FaTimes className="text-sm" /></button>
              </div>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <ImageUploader
                  images={memberImage ? [memberImage] : []}
                  onImagesChange={(urls) => setMemberImage(urls?.[0] || null)}
                  maxFiles={1}
                  folder="team"
                  label="Member Photo"
                />
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">Name *</label>
                  <input type="text" {...register('name', { required: 'Name required' })}
                    className="w-full px-4 py-2.5 bg-input border border-theme-strong rounded-xl text-sm text-primary placeholder-gray-500 focus:outline-none focus:border-amber-500/30" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">Position *</label>
                  <input type="text" {...register('position', { required: 'Position required' })}
                    className="w-full px-4 py-2.5 bg-input border border-theme-strong rounded-xl text-sm text-primary placeholder-gray-500 focus:outline-none focus:border-amber-500/30" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">Description</label>
                  <textarea {...register('description')}
                    className="w-full px-4 py-2.5 bg-input border border-theme-strong rounded-xl text-sm text-primary placeholder-gray-500 focus:outline-none focus:border-amber-500/30 h-20 resize-none" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="block text-xs font-medium text-gray-400 mb-1.5"><FaFacebook className="inline mr-1 text-blue-400" /> Facebook</label>
                    <input type="text" {...register('facebook')} className="w-full px-4 py-2.5 bg-input border border-theme-strong rounded-xl text-sm text-primary placeholder-gray-500 focus:outline-none focus:border-amber-500/30" /></div>
                  <div><label className="block text-xs font-medium text-gray-400 mb-1.5"><FaInstagram className="inline mr-1 text-pink-400" /> Instagram</label>
                    <input type="text" {...register('instagram')} className="w-full px-4 py-2.5 bg-input border border-theme-strong rounded-xl text-sm text-primary placeholder-gray-500 focus:outline-none focus:border-amber-500/30" /></div>
                  <div><label className="block text-xs font-medium text-gray-400 mb-1.5"><FaLinkedin className="inline mr-1 text-blue-600" /> LinkedIn</label>
                    <input type="text" {...register('linkedin')} className="w-full px-4 py-2.5 bg-input border border-theme-strong rounded-xl text-sm text-primary placeholder-gray-500 focus:outline-none focus:border-amber-500/30" /></div>
                  <div><label className="block text-xs font-medium text-gray-400 mb-1.5"><FaTwitter className="inline mr-1 text-sky-400" /> Twitter</label>
                    <input type="text" {...register('twitter')} className="w-full px-4 py-2.5 bg-input border border-theme-strong rounded-xl text-sm text-primary placeholder-gray-500 focus:outline-none focus:border-amber-500/30" /></div>
                </div>
                <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
                  <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2.5 text-sm text-gray-500 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:text-gray-700 hover:shadow-sm transition-all duration-300">Cancel</button>
                  <button type="submit" className="flex items-center gap-2 px-4 py-2.5 text-sm bg-white text-gray-800 border border-gray-200 hover:bg-blue-50 hover:shadow-md rounded-xl transition-all duration-300 font-medium">
                    <FaSave className="text-xs" /> {editingMember ? 'Update' : 'Add'}
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

export default AdminTeam;

