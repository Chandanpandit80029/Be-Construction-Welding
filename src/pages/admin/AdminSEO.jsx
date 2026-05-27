import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  FaSave, FaSearch, FaGlobe, FaFacebook, FaTwitter,
  FaImage, FaLink, FaPlus, FaTimes, FaCheck, FaInfoCircle, FaSpinner
} from 'react-icons/fa';
import AdminLayout from '../../components/admin/AdminLayout';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import { useRealtimeCollection, addDocument, updateDocument } from '../../hooks/useFirestore';

const AdminSEO = () => {
  const { data: seoPages, loading } = useRealtimeCollection('seoSettings', { orderBy: 'page', orderDirection: 'asc' });

  const [activePage, setActivePage] = useState('home');
  const [showToast, setShowToast] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({ title: '', description: '', keywords: '', ogImage: '' });
  const [sitemap, setSitemap] = useState([
    { path: '/', priority: '1.0', changefreq: 'daily' },
    { path: '/about', priority: '0.8', changefreq: 'monthly' },
    { path: '/services', priority: '0.9', changefreq: 'weekly' },
    { path: '/projects', priority: '0.9', changefreq: 'weekly' },
    { path: '/gallery', priority: '0.7', changefreq: 'weekly' },
    { path: '/testimonials', priority: '0.6', changefreq: 'monthly' },
    { path: '/contact', priority: '0.8', changefreq: 'monthly' },
    { path: '/quote', priority: '0.8', changefreq: 'monthly' },
  ]);

  // Load existing SEO data when page changes or data loads
  useEffect(() => {
    const existing = (seoPages || []).find(p => p.page === activePage);
    if (existing) {
      setFormData({
        title: existing.title || '',
        description: existing.description || '',
        keywords: existing.keywords || '',
        ogImage: existing.ogImage || ''
      });
    } else {
      setFormData({ title: '', description: '', keywords: '', ogImage: '' });
    }
  }, [activePage, seoPages]);

  const pages = ['home', 'about', 'services', 'projects', 'contact', 'blog', 'gallery', 'testimonials'];

  const updateSetting = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    const existing = (seoPages || []).find(p => p.page === activePage);
    const data = { ...formData, page: activePage };
    
    if (existing?.id) {
      await updateDocument('seoSettings', existing.id, data);
    } else {
      await addDocument('seoSettings', data);
    }
    
    setShowToast(true);
    setSaving(false);
    setTimeout(() => setShowToast(false), 3000);
  };

  if (loading) return <AdminLayout title="SEO"><LoadingSpinner fullScreen /></AdminLayout>;

  return (
    <AdminLayout title="SEO Settings" subtitle="Optimize your website for search engines">
      {showToast && (
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
          className="fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl shadow-lg shadow-emerald-500/10">
          <FaCheck className="text-sm" />
          <span className="text-sm font-medium">Settings saved successfully!</span>
        </motion.div>
      )}

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-2">
          {pages.map(page => (
            <button key={page} onClick={() => setActivePage(page)}
              className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all capitalize ${
                activePage === page ? 'bg-amber-500/10 border border-amber-500/20 text-amber-400' : 'bg-input border border-theme-strong text-gray-400 hover:text-primary hover:bg-white/10'
              }`}>
              {page === 'home' ? 'Home Page' : page.charAt(0).toUpperCase() + page.slice(1)}
            </button>
          ))}
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Meta Tags */}
          <div className="rounded-2xl border border-theme bg-linear-to-br bg-card p-6">
            <h2 className="text-base font-bold text-primary mb-6 flex items-center gap-2">
              <FaSearch className="text-amber-400" />
              Meta Tags - {activePage.charAt(0).toUpperCase() + activePage.slice(1)}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">Meta Title</label>
                <input type="text" value={formData.title}
                  onChange={(e) => updateSetting('title', e.target.value)}
                  className="w-full px-4 py-2.5 bg-input border border-theme-strong rounded-xl text-sm text-primary placeholder-gray-500 focus:outline-none focus:border-amber-500/30" />
                <p className="text-[10px] text-gray-600 mt-1">{formData.title.length} / 60 characters recommended</p>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">Meta Description</label>
                <textarea value={formData.description}
                  onChange={(e) => updateSetting('description', e.target.value)}
                  className="w-full px-4 py-2.5 bg-input border border-theme-strong rounded-xl text-sm text-primary placeholder-gray-500 focus:outline-none focus:border-amber-500/30 h-24 resize-none" />
                <p className="text-[10px] text-gray-600 mt-1">{formData.description.length} / 160 characters recommended</p>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">Keywords (comma separated)</label>
                <input type="text" value={formData.keywords}
                  onChange={(e) => updateSetting('keywords', e.target.value)}
                  className="w-full px-4 py-2.5 bg-input border border-theme-strong rounded-xl text-sm text-primary placeholder-gray-500 focus:outline-none focus:border-amber-500/30" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">OG Image URL</label>
                <input type="text" value={formData.ogImage}
                  onChange={(e) => updateSetting('ogImage', e.target.value)}
                  className="w-full px-4 py-2.5 bg-input border border-theme-strong rounded-xl text-sm text-primary placeholder-gray-500 focus:outline-none focus:border-amber-500/30"
                  placeholder="https://example.com/og-image.jpg" />
              </div>
            </div>
          </div>

          {/* Sitemap */}
          <div className="rounded-2xl border border-theme bg-linear-to-br bg-card p-6">
            <h2 className="text-base font-bold text-primary mb-6 flex items-center gap-2">
              <FaGlobe className="text-amber-400" />
              Sitemap Configuration
            </h2>
            <div className="space-y-3">
              {sitemap.map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 p-3 rounded-xl bg-card-hover border border-theme">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-primary">{item.path}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <select value={item.priority}
                      onChange={(e) => { const ns = [...sitemap]; ns[idx].priority = e.target.value; setSitemap(ns); }}
                      className="px-2 py-1.5 bg-input border border-theme-strong rounded-lg text-xs text-gray-300 focus:outline-none focus:border-amber-500/30">
                      {['1.0','0.9','0.8','0.7','0.6','0.5'].map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                    <select value={item.changefreq}
                      onChange={(e) => { const ns = [...sitemap]; ns[idx].changefreq = e.target.value; setSitemap(ns); }}
                      className="px-2 py-1.5 bg-input border border-theme-strong rounded-lg text-xs text-gray-300 focus:outline-none focus:border-amber-500/30">
                      {['always','hourly','daily','weekly','monthly','yearly','never'].map(f => <option key={f} value={f}>{f}</option>)}
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <button onClick={handleSave} disabled={saving}
              className="flex items-center gap-2 px-6 py-3 bg-white text-gray-800 border border-gray-200 hover:bg-blue-50 hover:shadow-md rounded-xl transition-all duration-300 text-sm font-medium disabled:opacity-50">
              {saving ? <FaSpinner className="animate-spin text-xs" /> : <FaSave className="text-xs" />}
              {saving ? 'Saving...' : 'Save SEO Settings'}
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminSEO;