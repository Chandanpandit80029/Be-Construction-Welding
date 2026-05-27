import React, { useState } from 'react';
import SafeImage from '../../components/shared/SafeImage';
import { FaTrash, FaPlus, FaTimes, FaImages, FaSearch } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { useCollection, addDocument, deleteDocumentWithAsset } from '../../hooks/useFirestore';
import AdminLayout from '../../components/admin/AdminLayout';
import { getImageUrl } from '../../utils/image';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import ImageUploader from '../../components/shared/ImageUploader';

const AdminGallery = () => {
  const [showModal, setShowModal] = useState(false);
  const [imageUrls, setImageUrls] = useState([]);
  const [category, setCategory] = useState('Construction');
  const [title, setTitle] = useState('');
  const [filterCat, setFilterCat] = useState('all');
  const { data: galleryItems, loading } = useCollection('gallery', { orderBy: 'createdAt', orderDirection: 'desc' });

  const categories = ['Welding', 'Construction', 'Fabrication', 'Industrial'];

  const filtered = filterCat === 'all' ? galleryItems : galleryItems?.filter(i => i.category === filterCat);

  const handleAdd = async () => {
    if ((!imageUrls || imageUrls.length === 0) || !title) return;
    // store the uploaded object (contains url and public_id) for reliable deletion later
    await addDocument('gallery', { src: imageUrls[0], title, category });
    setImageUrls([]); setTitle(''); setShowModal(false);
  };

  const handleDelete = async (item) => {
    if (!window.confirm('Delete this image?')) return;

    await deleteDocumentWithAsset('gallery', item.id);
  };

  if (loading) return <AdminLayout title="Gallery"><LoadingSpinner fullScreen /></AdminLayout>;

  return (
    <AdminLayout title="Gallery Management" subtitle="Manage your media gallery">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-6">
        <div className="flex gap-2">
          {['all', ...categories].map(c => (
            <button key={c} onClick={() => setFilterCat(c)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all ${
                filterCat === c ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'bg-input text-gray-400 border border-theme-strong hover:text-primary'
              }`}>{c}</button>
          ))}
        </div>
        <button onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-white text-gray-800 border border-gray-200 hover:bg-blue-50 hover:shadow-md rounded-xl transition-all duration-300 text-sm font-medium">
          <FaPlus className="text-xs" /> Add Image
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filtered?.map((item) => (
          <motion.div key={item.id} layout className="group relative rounded-xl overflow-hidden border border-theme bg-input">
            <SafeImage
              src={getImageUrl(item.src) || item.src}
              alt={item.title}
              className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
              <div className="w-full">
                <p className="text-primary font-semibold text-sm">{item.title}</p>
                <p className="text-gray-300 text-xs">{item.category}</p>
                <button onClick={() => handleDelete(item)} className="mt-2 px-3 py-1.5 bg-red-500/20 border border-red-500/30 text-red-400 rounded-lg text-xs hover:bg-red-500/30 transition-all">
                  <FaTrash className="inline mr-1 text-[10px]" /> Delete
                </button>
              </div>
            </div>
          </motion.div>
        ))}
        {(!filtered || filtered.length === 0) && (
          <div className="col-span-full text-center py-20">
            <FaImages className="text-4xl text-gray-700 mx-auto mb-3" />
            <p className="text-secondary">No images found</p>
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
              className="w-full max-w-md bg-elevated border border-theme-strong rounded-2xl shadow-2xl shadow-black/50 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-primary">Add Image</h3>
                <button onClick={() => setShowModal(false)} className="p-2 text-secondary hover:text-primary hover:bg-input rounded-lg"><FaTimes className="text-sm" /></button>
              </div>
              <div className="space-y-4">
                <ImageUploader images={imageUrls} onImagesChange={setImageUrls} maxFiles={1} folder="gallery" label="Gallery Image" />
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">Title <span className="text-red-400">*</span></label>
                  <input type="text" value={title} onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-2.5 bg-input border border-theme-strong rounded-xl text-sm text-primary placeholder-gray-500 focus:outline-none focus:border-amber-500/30"
                    placeholder="Image title" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">Category</label>
                  <select value={category} onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-2.5 bg-input border border-theme-strong rounded-xl text-sm text-gray-300 focus:outline-none focus:border-amber-500/30">
                    {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>
                <button onClick={handleAdd}
                  className="w-full py-2.5 bg-white text-gray-800 border border-gray-200 hover:bg-blue-50 hover:shadow-md rounded-xl transition-all duration-300 text-sm font-medium">
                  Add to Gallery
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AdminLayout>
  );
};

export default AdminGallery;

