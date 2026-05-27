import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaPlus, FaEdit, FaTrash, FaSearch, FaFilter,
  FaSave, FaTimes, FaEye, FaClock, FaUser,
  FaTags, FaFolder, FaCheck, FaImage, FaCalendarAlt, FaNewspaper
} from 'react-icons/fa';
import AdminLayout from '../../components/admin/AdminLayout';
import { getImageUrl } from '../../utils/image';
import ImageUploader from '../../components/shared/ImageUploader';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import { useCollection, addDocument, updateDocument, deleteDocumentWithAsset } from '../../hooks/useFirestore';

const AdminBlog = () => {
  const { data: posts, loading } = useCollection('blogPosts', { orderBy: 'createdAt', orderDirection: 'desc' });

  const [showForm, setShowForm] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [featuredImage, setFeaturedImage] = useState(null);
  const [formData, setFormData] = useState({
    title: '', content: '', category: '', tags: '', status: 'draft', image: '', excerpt: '', slug: ''
  });

  const categories = ['Welding', 'Fabrication', 'Safety', 'Construction', 'Metal Works', 'Industry News'];

  const filteredPosts = (posts || []).filter(post => {
    const matchesSearch = post.title?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || post.status === filterStatus;
    const matchesCategory = filterCategory === 'all' || post.category === filterCategory;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const handleAdd = () => {
    setEditingPost(null);
    setFormData({ title: '', content: '', category: '', tags: '', status: 'draft', image: '', excerpt: '', slug: '' });
    setFeaturedImage(null);
    setShowForm(true);
  };

  const handleEdit = (post) => {
    setEditingPost(post);
    setFormData({
      title: post.title || '',
      content: post.content || '',
      category: post.category || '',
      tags: post.tags?.join(', ') || '',
      status: post.status || 'draft',
      image: post.image || '',
      excerpt: post.excerpt || '',
      slug: post.slug || ''
    });
    setFeaturedImage(post.image);
    setShowForm(true);
  };

  const handleDelete = async (post) => {
    if (!window.confirm('Delete this blog post?')) return;

    await deleteDocumentWithAsset('blogPosts', post.id);
  };

  const togglePublish = async (post) => {
    const newStatus = post.status === 'published' ? 'draft' : 'published';
    await updateDocument('blogPosts', post.id, { status: newStatus });
  };

  const generateSlug = (title) => {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  };

  const handleSave = async () => {
    const slug = formData.slug || generateSlug(formData.title);
    const postData = {
      ...formData,
      slug,
      image: featuredImage || formData.image,
      tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
      author: 'Admin',
    };
    
    if (editingPost) {
      await updateDocument('blogPosts', editingPost.id, postData);
    } else {
      await addDocument('blogPosts', postData);
    }
    setShowForm(false);
    setEditingPost(null);
    setFeaturedImage(null);
  };

  const published = posts?.filter(p => p.status === 'published').length || 0;
  const drafts = posts?.filter(p => p.status === 'draft').length || 0;

  if (loading) return <AdminLayout title="Blog Management"><LoadingSpinner fullScreen /></AdminLayout>;

  return (
    <AdminLayout title="Blog Management" subtitle="Create and manage blog posts">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Posts', value: posts?.length || 0, color: 'blue' },
          { label: 'Published', value: published, color: 'emerald' },
          { label: 'Drafts', value: drafts, color: 'amber' },
          { label: 'Total Views', value: posts?.reduce((a, b) => a + (b.views || 0), 0) || 0, color: 'violet' },
        ].map(stat => (
          <div key={stat.label} className="rounded-xl border border-theme bg-linear-to-br bg-card p-4">
            <p className="text-2xl font-bold text-primary">{stat.value}</p>
            <p className="text-xs text-secondary mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Filters & Search */}
      <div className="rounded-2xl border border-theme bg-linear-to-br bg-card p-4 mb-6">
        <div className="flex flex-col lg:flex-row gap-3">
          <div className="flex-1 relative">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 text-xs" />
            <input type="text" placeholder="Search posts..." value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 bg-input border border-theme-strong rounded-xl text-sm text-primary placeholder-gray-500 focus:outline-none focus:border-amber-500/30" />
          </div>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2.5 bg-input border border-theme-strong rounded-xl text-sm text-gray-300 focus:outline-none focus:border-amber-500/30">
            <option value="all">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
          <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-2.5 bg-input border border-theme-strong rounded-xl text-sm text-gray-300 focus:outline-none focus:border-amber-500/30">
            <option value="all">All Categories</option>
            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
          <button onClick={handleAdd}
            className="flex items-center gap-2 px-4 py-2.5 bg-white text-gray-800 border border-gray-200 hover:bg-blue-50 hover:shadow-md rounded-xl transition-all duration-300 text-sm font-medium">
            <FaPlus className="text-xs" /> New Post
          </button>
        </div>
      </div>

      {/* Posts Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPosts.map((post, idx) => (
          <motion.div key={post.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}
            className="group rounded-2xl border border-theme bg-linear-to-br bg-card overflow-hidden hover:border-white/10 transition-all">
            <div className="h-40 relative overflow-hidden bg-input">
              {post.image ? (
                <img src={getImageUrl(post.image)} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              ) : (
                <div className="flex items-center justify-center h-full"><FaImage className="text-3xl text-gray-700" /></div>
              )}
              <div className="absolute top-3 right-3">
                <span className={`px-2 py-1 rounded-lg text-[10px] font-medium ${post.status === 'published' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'}`}>
                  {post.status}
                </span>
              </div>
            </div>
            <div className="p-4">
              <h3 className="text-sm font-semibold text-primary line-clamp-2 mb-2">{post.title}</h3>
              <p className="text-[10px] text-secondary line-clamp-2 mb-3">{post.excerpt || post.content}</p>
              <div className="flex items-center gap-3 text-[10px] text-gray-600 mb-3">
                <span className="flex items-center gap-1"><FaCalendarAlt /> {post.createdAt?.toDate?.()?.toLocaleDateString?.() || post.date || 'N/A'}</span>
                <span className="flex items-center gap-1"><FaEye /> {post.views || 0}</span>
                <span className="flex items-center gap-1"><FaFolder /> {post.category}</span>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => togglePublish(post)} className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs transition-all ${post.status === 'published' ? 'bg-amber-500/10 text-amber-400 hover:bg-amber-500/20' : 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'}`}>
                  <FaCheck className="text-[10px]" /> {post.status === 'published' ? 'Unpublish' : 'Publish'}
                </button>
                <button onClick={() => handleEdit(post)} className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-input rounded-lg text-xs text-gray-400 hover:text-amber-400 hover:bg-amber-500/10 transition-all">
                  <FaEdit className="text-[10px]" /> Edit
                </button>
                <button onClick={() => handleDelete(post)} className="p-2 bg-input rounded-lg text-xs text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all">
                  <FaTrash className="text-xs" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
        {(!filteredPosts || filteredPosts.length === 0) && (
          <div className="col-span-full text-center py-20">
            <FaNewspaper className="text-4xl text-gray-700 mx-auto mb-3" />
            <p className="text-secondary">No posts found</p>
          </div>
        )}
      </div>

      {/* Blog Post Form Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowForm(false)}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-2xl bg-elevated border border-theme-strong rounded-2xl shadow-2xl shadow-black/50 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-6 border-b border-white/5 sticky top-0 bg-elevated z-10">
                <h3 className="text-lg font-bold text-primary">{editingPost ? 'Edit Post' : 'New Blog Post'}</h3>
                <button onClick={() => setShowForm(false)} className="p-2 text-secondary hover:text-primary hover:bg-input rounded-lg transition-all"><FaTimes className="text-sm" /></button>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">Title *</label>
                  <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value, slug: editingPost ? formData.slug : generateSlug(e.target.value) })}
                    className="w-full px-4 py-2.5 bg-input border border-theme-strong rounded-xl text-sm text-primary placeholder-gray-500 focus:outline-none focus:border-amber-500/30"
                    placeholder="Enter post title" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">Slug *</label>
                  <input type="text" value={formData.slug} onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full px-4 py-2.5 bg-input border border-theme-strong rounded-xl text-sm text-primary placeholder-gray-500 focus:outline-none focus:border-amber-500/30"
                    placeholder="post-url-slug" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">Excerpt</label>
                  <textarea value={formData.excerpt} onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                    className="w-full px-4 py-2.5 bg-input border border-theme-strong rounded-xl text-sm text-primary placeholder-gray-500 focus:outline-none focus:border-amber-500/30 h-20 resize-none"
                    placeholder="Brief description for cards" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">Content *</label>
                  <textarea value={formData.content} onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    className="w-full px-4 py-2.5 bg-input border border-theme-strong rounded-xl text-sm text-primary placeholder-gray-500 focus:outline-none focus:border-amber-500/30 h-40 resize-none font-mono"
                    placeholder="Write your blog content here..." />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1.5">Category</label>
                    <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-4 py-2.5 bg-input border border-theme-strong rounded-xl text-sm text-gray-300 focus:outline-none focus:border-amber-500/30">
                      <option value="">Select category</option>
                      {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1.5">Status</label>
                    <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-full px-4 py-2.5 bg-input border border-theme-strong rounded-xl text-sm text-gray-300 focus:outline-none focus:border-amber-500/30">
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">Tags (comma separated)</label>
                  <input type="text" value={formData.tags} onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    className="w-full px-4 py-2.5 bg-input border border-theme-strong rounded-xl text-sm text-primary placeholder-gray-500 focus:outline-none focus:border-amber-500/30"
                    placeholder="welding, construction, steel" />
                </div>
                <ImageUploader images={featuredImage ? [featuredImage] : []}
                  onImagesChange={(urls) => setFeaturedImage(urls?.[0] || null)}
                  maxFiles={1} folder="blog" label="Featured Image" />
              </div>
              <div className="flex justify-end gap-3 p-6 border-t border-white/5">
                <button onClick={() => setShowForm(false)} className="px-4 py-2.5 text-sm text-gray-500 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:text-gray-700 hover:shadow-sm transition-all duration-300">Cancel</button>
                <button onClick={handleSave} className="flex items-center gap-2 px-4 py-2.5 text-sm bg-white text-gray-800 border border-gray-200 hover:bg-blue-50 hover:shadow-md rounded-xl transition-all duration-300 font-medium">
                  <FaSave className="text-xs" /> {editingPost ? 'Update' : 'Publish'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AdminLayout>
  );
};

export default AdminBlog;