import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  FaSave, FaGlobe, FaPhone, FaEnvelope, FaMapMarkerAlt,
  FaFacebook, FaInstagram, FaTwitter, FaLinkedin, FaYoutube,
  FaClock, FaCog, FaPalette, FaImage, FaCheck, FaSpinner
} from 'react-icons/fa';
import AdminLayout from '../../components/admin/AdminLayout';
import ImageUploader from '../../components/shared/ImageUploader';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import { useDocument, addDocument, updateDocument } from '../../hooks/useFirestore';

const AdminSettings = () => {
  const { data: settings, loading } = useDocument('websiteSettings', 'general');
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  const [logo, setLogo] = useState(settings?.logo || '');
  const [favicon, setFavicon] = useState(settings?.favicon || '');
  const [formData, setFormData] = useState({
    companyName: '', shortName: '', tagline: '', description: '', established: '',
    email: '', phone: '', whatsapp: '', address: '', city: '', state: '', zipCode: '', country: '',
    facebook: '', instagram: '', twitter: '', linkedin: '', youtube: '',
    primaryColor: '#FBBF24', secondaryColor: '#111111', footer: '',
  });

  useEffect(() => {
    if (settings) {
      setFormData({
        companyName: settings.companyName || '',
        shortName: settings.shortName || '',
        tagline: settings.tagline || '',
        description: settings.description || '',
        established: settings.established || '',
        email: settings.email || '',
        phone: settings.phone || '',
        whatsapp: settings.whatsapp || '',
        address: settings.address || '',
        city: settings.city || '',
        state: settings.state || '',
        zipCode: settings.zipCode || '',
        country: settings.country || '',
        facebook: settings.facebook || '',
        instagram: settings.instagram || '',
        twitter: settings.twitter || '',
        linkedin: settings.linkedin || '',
        youtube: settings.youtube || '',
        primaryColor: settings.primaryColor || '#FBBF24',
        secondaryColor: settings.secondaryColor || '#111111',
        footer: settings.footer || '',
      });
      setLogo(settings.logo || '');
      setFavicon(settings.favicon || '');
    }
  }, [settings]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const data = { ...formData, logo, favicon };
    if (settings?.id) {
      await updateDocument('websiteSettings', settings.id, data);
    } else {
      await addDocument('websiteSettings', { ...data, key: 'general' });
    }
    setSaved(true);
    setSaving(false);
    setTimeout(() => setSaved(false), 3000);
  };

  const tabs = [
    { id: 'general', label: 'General', icon: FaGlobe },
    { id: 'contact', label: 'Contact', icon: FaEnvelope },
    { id: 'social', label: 'Social Media', icon: FaFacebook },
    { id: 'appearance', label: 'Appearance', icon: FaPalette },
    { id: 'footer', label: 'Footer', icon: FaCog },
  ];

  if (loading) return <AdminLayout title="Settings"><LoadingSpinner fullScreen /></AdminLayout>;

  return (
    <AdminLayout title="Website Settings" subtitle="Manage your website configuration">
      {saved && (
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
          className="mb-6 flex items-center gap-2 px-4 py-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl">
          <FaCheck className="text-sm" />
          <span className="text-sm font-medium">Settings saved successfully!</span>
        </motion.div>
      )}

      <div className="flex flex-wrap gap-2 mb-6">
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
              activeTab === tab.id ? 'bg-amber-500/10 border border-amber-500/20 text-amber-400' : 'bg-input border border-theme-strong text-gray-400 hover:text-primary hover:bg-white/10'
            }`}>
            <tab.icon className="text-xs" /> {tab.label}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit}>
        {activeTab === 'general' && (
          <div className="rounded-2xl border border-theme bg-linear-to-br bg-card p-6 space-y-4">
            <h2 className="text-base font-bold text-primary mb-4">General Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">Company Name</label>
                <input type="text" name="companyName" value={formData.companyName} onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-input border border-theme-strong rounded-xl text-sm text-primary placeholder-gray-500 focus:outline-none focus:border-amber-500/30" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">Short Name</label>
                <input type="text" name="shortName" value={formData.shortName} onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-input border border-theme-strong rounded-xl text-sm text-primary placeholder-gray-500 focus:outline-none focus:border-amber-500/30" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">Tagline</label>
                <input type="text" name="tagline" value={formData.tagline} onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-input border border-theme-strong rounded-xl text-sm text-primary placeholder-gray-500 focus:outline-none focus:border-amber-500/30" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">Established Year</label>
                <input type="text" name="established" value={formData.established} onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-input border border-theme-strong rounded-xl text-sm text-primary placeholder-gray-500 focus:outline-none focus:border-amber-500/30" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-gray-400 mb-1.5">Description</label>
                <textarea name="description" value={formData.description} onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-input border border-theme-strong rounded-xl text-sm text-primary placeholder-gray-500 focus:outline-none focus:border-amber-500/30 h-24 resize-none" />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'contact' && (
          <div className="rounded-2xl border border-theme bg-linear-to-br bg-card p-6 space-y-4">
            <h2 className="text-base font-bold text-primary mb-4">Contact Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">Email</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full px-4 py-2.5 bg-input border border-theme-strong rounded-xl text-sm text-primary placeholder-gray-500 focus:outline-none focus:border-amber-500/30" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">Phone</label>
                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full px-4 py-2.5 bg-input border border-theme-strong rounded-xl text-sm text-primary placeholder-gray-500 focus:outline-none focus:border-amber-500/30" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">WhatsApp</label>
                <input type="tel" name="whatsapp" value={formData.whatsapp} onChange={handleChange} className="w-full px-4 py-2.5 bg-input border border-theme-strong rounded-xl text-sm text-primary placeholder-gray-500 focus:outline-none focus:border-amber-500/30" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">Address</label>
                <input type="text" name="address" value={formData.address} onChange={handleChange} className="w-full px-4 py-2.5 bg-input border border-theme-strong rounded-xl text-sm text-primary placeholder-gray-500 focus:outline-none focus:border-amber-500/30" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">City</label>
                <input type="text" name="city" value={formData.city} onChange={handleChange} className="w-full px-4 py-2.5 bg-input border border-theme-strong rounded-xl text-sm text-primary placeholder-gray-500 focus:outline-none focus:border-amber-500/30" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">State</label>
                <input type="text" name="state" value={formData.state} onChange={handleChange} className="w-full px-4 py-2.5 bg-input border border-theme-strong rounded-xl text-sm text-primary placeholder-gray-500 focus:outline-none focus:border-amber-500/30" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">ZIP Code</label>
                <input type="text" name="zipCode" value={formData.zipCode} onChange={handleChange} className="w-full px-4 py-2.5 bg-input border border-theme-strong rounded-xl text-sm text-primary placeholder-gray-500 focus:outline-none focus:border-amber-500/30" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">Country</label>
                <input type="text" name="country" value={formData.country} onChange={handleChange} className="w-full px-4 py-2.5 bg-input border border-theme-strong rounded-xl text-sm text-primary placeholder-gray-500 focus:outline-none focus:border-amber-500/30" />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'social' && (
          <div className="rounded-2xl border border-theme bg-linear-to-br bg-card p-6 space-y-4">
            <h2 className="text-base font-bold text-primary mb-4">Social Media Links</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="flex items-center gap-2 text-xs font-medium text-gray-400 mb-1.5"><FaFacebook className="text-blue-400" /> Facebook URL</label>
                <input type="url" name="facebook" value={formData.facebook} onChange={handleChange} className="w-full px-4 py-2.5 bg-input border border-theme-strong rounded-xl text-sm text-primary placeholder-gray-500 focus:outline-none focus:border-amber-500/30" />
              </div>
              <div>
                <label className="flex items-center gap-2 text-xs font-medium text-gray-400 mb-1.5"><FaInstagram className="text-pink-400" /> Instagram URL</label>
                <input type="url" name="instagram" value={formData.instagram} onChange={handleChange} className="w-full px-4 py-2.5 bg-input border border-theme-strong rounded-xl text-sm text-primary placeholder-gray-500 focus:outline-none focus:border-amber-500/30" />
              </div>
              <div>
                <label className="flex items-center gap-2 text-xs font-medium text-gray-400 mb-1.5"><FaTwitter className="text-sky-400" /> Twitter URL</label>
                <input type="url" name="twitter" value={formData.twitter} onChange={handleChange} className="w-full px-4 py-2.5 bg-input border border-theme-strong rounded-xl text-sm text-primary placeholder-gray-500 focus:outline-none focus:border-amber-500/30" />
              </div>
              <div>
                <label className="flex items-center gap-2 text-xs font-medium text-gray-400 mb-1.5"><FaLinkedin className="text-blue-600" /> LinkedIn URL</label>
                <input type="url" name="linkedin" value={formData.linkedin} onChange={handleChange} className="w-full px-4 py-2.5 bg-input border border-theme-strong rounded-xl text-sm text-primary placeholder-gray-500 focus:outline-none focus:border-amber-500/30" />
              </div>
              <div>
                <label className="flex items-center gap-2 text-xs font-medium text-gray-400 mb-1.5"><FaYoutube className="text-red-500" /> YouTube URL</label>
                <input type="url" name="youtube" value={formData.youtube} onChange={handleChange} className="w-full px-4 py-2.5 bg-input border border-theme-strong rounded-xl text-sm text-primary placeholder-gray-500 focus:outline-none focus:border-amber-500/30" />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'appearance' && (
          <div className="rounded-2xl border border-theme bg-linear-to-br bg-card p-6 space-y-4">
            <h2 className="text-base font-bold text-primary mb-4">Appearance & Branding</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ImageUploader images={logo ? [logo] : []} onImagesChange={(urls) => setLogo(urls?.[0] || null)} maxFiles={1} folder="branding" label="Logo" />
              <ImageUploader images={favicon ? [favicon] : []} onImagesChange={(urls) => setFavicon(urls?.[0] || null)} maxFiles={1} folder="branding" label="Favicon" accept="image/*,.ico" />
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">Primary Color</label>
                <div className="flex gap-2 items-center">
                  <input type="color" name="primaryColor" value={formData.primaryColor} onChange={handleChange} className="w-12 h-10 rounded-lg bg-input border border-theme-strong cursor-pointer" />
                  <input type="text" value={formData.primaryColor} readOnly className="flex-1 px-4 py-2.5 bg-input border border-theme-strong rounded-xl text-sm text-gray-400" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">Secondary Color</label>
                <div className="flex gap-2 items-center">
                  <input type="color" name="secondaryColor" value={formData.secondaryColor} onChange={handleChange} className="w-12 h-10 rounded-lg bg-input border border-theme-strong cursor-pointer" />
                  <input type="text" value={formData.secondaryColor} readOnly className="flex-1 px-4 py-2.5 bg-input border border-theme-strong rounded-xl text-sm text-gray-400" />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'footer' && (
          <div className="rounded-2xl border border-theme bg-linear-to-br bg-card p-6 space-y-4">
            <h2 className="text-base font-bold text-primary mb-4">Footer Settings</h2>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">Footer Text</label>
              <textarea name="footer" value={formData.footer} onChange={handleChange} className="w-full px-4 py-2.5 bg-input border border-theme-strong rounded-xl text-sm text-primary placeholder-gray-500 focus:outline-none focus:border-amber-500/30 h-20 resize-none" />
            </div>
            <div className="text-xs text-gray-600">Available placeholders: © {new Date().getFullYear()}, [company_name]</div>
          </div>
        )}

        <div className="flex justify-end mt-6">
          <button type="submit" disabled={saving}
            className="flex items-center gap-2 px-6 py-3 bg-white text-gray-800 border border-gray-200 hover:bg-blue-50 hover:shadow-md rounded-xl transition-all duration-300 text-sm font-medium disabled:opacity-50">
            {saving ? <FaSpinner className="animate-spin text-xs" /> : <FaSave className="text-xs" />}
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </form>
    </AdminLayout>
  );
};

export default AdminSettings;