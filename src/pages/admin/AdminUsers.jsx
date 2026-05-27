import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaPlus, FaEdit, FaTrash, FaSearch, FaUserShield, FaUser,
  FaUserTie, FaUserGraduate, FaSave, FaTimes, FaEnvelope,
  FaKey, FaCheck, FaShieldAlt, FaCrown, FaUserCog,
  FaUsers, FaUserCheck, FaUserTimes, FaSpinner
} from 'react-icons/fa';
import AdminLayout from '../../components/admin/AdminLayout';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import { useRealtimeCollection, addDocument, updateDocument, deleteDocument } from '../../hooks/useFirestore';

const AdminUsers = () => {
  const { data: users, loading } = useRealtimeCollection('users', { orderBy: 'createdAt', orderDirection: 'desc' });

  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', role: 'editor', status: 'active'
  });

  const roles = [
    { value: 'super_admin', label: 'Super Admin', icon: FaCrown, color: 'amber' },
    { value: 'admin', label: 'Admin', icon: FaUserShield, color: 'blue' },
    { value: 'editor', label: 'Editor', icon: FaUserGraduate, color: 'emerald' },
    { value: 'manager', label: 'Manager', icon: FaUserTie, color: 'violet' },
  ];

  const getRoleIcon = (role) => {
    const r = roles.find(r => r.value === role);
    return r ? r.icon : FaUser;
  };

  const getRoleColor = (role) => {
    const r = roles.find(r => r.value === role);
    return r ? r.color : 'gray';
  };

  const getRoleLabel = (role) => {
    const r = roles.find(r => r.value === role);
    return r ? r.label : role;
  };

  const filteredUsers = (users || []).filter(user => {
    const matchesSearch = (user.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (user.email || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const handleAdd = () => {
    setEditingUser(null);
    setFormData({ name: '', email: '', password: '', role: 'editor', status: 'active' });
    setShowForm(true);
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({ name: user.name || '', email: user.email || '', password: '', role: user.role || 'editor', status: user.status || 'active' });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this user?')) {
      await deleteDocument('users', id);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    const userData = {
      name: formData.name,
      email: formData.email,
      role: formData.role,
      status: formData.status,
    };
    
    if (editingUser) {
      await updateDocument('users', editingUser.id, userData);
    } else {
      // For new users, include initial password hint (actual auth creation must be done in Firebase Console)
      await addDocument('users', { ...userData, uid: `pending-${Date.now()}` });
    }
    
    setSaving(false);
    setShowForm(false);
    setEditingUser(null);
  };

  const activeUsers = (users || []).filter(u => u.status === 'active').length;

  if (loading) return <AdminLayout title="Users"><LoadingSpinner fullScreen /></AdminLayout>;

  return (
    <AdminLayout title="User Management" subtitle="Manage admin users and permissions">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Users', value: users?.length || 0, icon: FaUsers, color: 'blue' },
          { label: 'Active Users', value: activeUsers, icon: FaUserCheck, color: 'emerald' },
          { label: 'Inactive', value: (users?.length || 0) - activeUsers, icon: FaUserTimes, color: 'amber' },
          { label: 'Super Admins', value: (users || []).filter(u => u.role === 'super_admin').length, icon: FaCrown, color: 'violet' },
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
      <div className="rounded-2xl border border-theme bg-linear-to-br bg-card p-4 mb-6">
        <div className="flex flex-col lg:flex-row gap-3">
          <div className="flex-1 relative">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 text-xs" />
            <input type="text" placeholder="Search users..." value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 bg-input border border-theme-strong rounded-xl text-sm text-primary placeholder-gray-500 focus:outline-none focus:border-amber-500/30" />
          </div>
          <select value={filterRole} onChange={(e) => setFilterRole(e.target.value)}
            className="px-4 py-2.5 bg-input border border-theme-strong rounded-xl text-sm text-gray-300 focus:outline-none focus:border-amber-500/30">
            <option value="all">All Roles</option>
            {roles.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
          </select>
          <button onClick={handleAdd} className="flex items-center gap-2 px-4 py-2.5 bg-white text-gray-800 border border-gray-200 hover:bg-blue-50 hover:shadow-md rounded-xl transition-all duration-300 text-sm font-medium">
            <FaPlus className="text-xs" /> Add User
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="rounded-2xl border border-theme bg-linear-to-br bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left px-4 py-4 text-xs font-semibold text-secondary uppercase tracking-wider">User</th>
                <th className="text-left px-4 py-4 text-xs font-semibold text-secondary uppercase tracking-wider">Email</th>
                <th className="text-left px-4 py-4 text-xs font-semibold text-secondary uppercase tracking-wider">Role</th>
                <th className="text-left px-4 py-4 text-xs font-semibold text-secondary uppercase tracking-wider">Status</th>
                <th className="text-left px-4 py-4 text-xs font-semibold text-secondary uppercase tracking-wider">Created</th>
                <th className="text-right px-4 py-4 text-xs font-semibold text-secondary uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredUsers.map((user) => {
                const RoleIcon = getRoleIcon(user.role);
                const roleColor = getRoleColor(user.role);
                return (
                  <tr key={user.id} className="hover:bg-card-hover transition-colors">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-lg bg-linear-to-br from-${roleColor}-500/20 to-${roleColor}-500/5 flex items-center justify-center border border-${roleColor}-500/10`}>
                          <RoleIcon className={`text-${roleColor}-400 text-xs`} />
                        </div>
                        <span className="text-sm font-medium text-primary">{user.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-400">{user.email}</td>
                    <td className="px-4 py-4">
                      <span className={`px-2.5 py-1 rounded-lg text-[10px] font-medium bg-${roleColor}-500/10 text-${roleColor}-400 border border-${roleColor}-500/20`}>
                        {getRoleLabel(user.role)}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`flex items-center gap-1.5 text-xs ${user.status === 'active' ? 'text-emerald-400' : 'text-secondary'}`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${user.status === 'active' ? 'bg-emerald-400' : 'bg-gray-500'}`} />
                        {user.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-sm text-secondary">
                      {user.createdAt?.toDate?.()?.toLocaleDateString?.() || 'N/A'}
                    </td>
                    <td className="px-4 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => handleEdit(user)} className="p-2 text-secondary hover:text-amber-400 hover:bg-amber-500/10 rounded-lg transition-all">
                          <FaEdit className="text-xs" />
                        </button>
                        <button onClick={() => handleDelete(user.id)} className="p-2 text-secondary hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all">
                          <FaTrash className="text-xs" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {(filteredUsers.length === 0) && (
          <div className="text-center py-12">
            <FaUsers className="text-3xl text-gray-700 mx-auto mb-3" />
            <p className="text-secondary">No users found</p>
          </div>
        )}
      </div>

      {/* User Form Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowForm(false)}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-lg bg-elevated border border-theme-strong rounded-2xl shadow-2xl shadow-black/50">
              <div className="flex items-center justify-between p-6 border-b border-white/5">
                <h3 className="text-lg font-bold text-primary">{editingUser ? 'Edit User' : 'Add New User'}</h3>
                <button onClick={() => setShowForm(false)} className="p-2 text-secondary hover:text-primary hover:bg-input rounded-lg transition-all"><FaTimes className="text-sm" /></button>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">Full Name *</label>
                  <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2.5 bg-input border border-theme-strong rounded-xl text-sm text-primary placeholder-gray-500 focus:outline-none focus:border-amber-500/30"
                    placeholder="Enter full name" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">Email *</label>
                  <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2.5 bg-input border border-theme-strong rounded-xl text-sm text-primary placeholder-gray-500 focus:outline-none focus:border-amber-500/30"
                    placeholder="email@example.com" />
                </div>
                {!editingUser && (
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1.5">Password *</label>
                    <input type="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full px-4 py-2.5 bg-input border border-theme-strong rounded-xl text-sm text-primary placeholder-gray-500 focus:outline-none focus:border-amber-500/30"
                      placeholder="Enter password" />
                    <p className="text-[10px] text-gray-600 mt-1">Note: Create the user in Firebase Authentication first, then add their details here.</p>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1.5">Role</label>
                    <select value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      className="w-full px-4 py-2.5 bg-input border border-theme-strong rounded-xl text-sm text-gray-300 focus:outline-none focus:border-amber-500/30">
                      {roles.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1.5">Status</label>
                    <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-full px-4 py-2.5 bg-input border border-theme-strong rounded-xl text-sm text-gray-300 focus:outline-none focus:border-amber-500/30">
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-3 p-6 border-t border-white/5">
                <button onClick={() => setShowForm(false)} className="px-4 py-2.5 text-sm text-gray-500 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:text-gray-700 hover:shadow-sm transition-all duration-300">Cancel</button>
                <button onClick={handleSave} disabled={saving}
                  className="flex items-center gap-2 px-4 py-2.5 text-sm bg-white text-gray-800 border border-gray-200 hover:bg-blue-50 hover:shadow-md rounded-xl transition-all duration-300 font-medium disabled:opacity-50">
                  {saving ? <FaSpinner className="animate-spin text-xs" /> : <FaSave className="text-xs" />}
                  {saving ? 'Saving...' : (editingUser ? 'Update' : 'Add User')}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AdminLayout>
  );
};

export default AdminUsers;