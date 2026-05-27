import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import {
  FaPlus, FaEdit, FaTrash, FaGripVertical, FaEye, FaEyeSlash,
  FaChevronLeft, FaChevronRight, FaImage, FaVideo, FaLink,
  FaSave, FaTimes, FaUpload, FaSort, FaToggleOn, FaToggleOff
} from 'react-icons/fa';
import AdminLayout from '../../components/admin/AdminLayout';
import ImageUploader from '../../components/shared/ImageUploader';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import { useRealtimeCollection, addDocument, updateDocument, deleteDocumentWithAsset } from '../../hooks/useFirestore';
import { getImageUrl } from '../../utils/image';

const AdminHeroSlider = () => {
  const { data: slides, loading } = useRealtimeCollection('heroSlides', { orderBy: 'order', orderDirection: 'asc' });

  const [showForm, setShowForm] = useState(false);
  const [editingSlide, setEditingSlide] = useState(null);
  const [previewIndex, setPreviewIndex] = useState(0);
  const [slideImage, setSlideImage] = useState(null);
  const [formData, setFormData] = useState({
    title: '', subtitle: '', description: '', button1Text: '', button1Link: '',
    button2Text: '', button2Link: '', image: '', video: '', overlay: 0.4, alignment: 'center'
  });

  const activeSlides = (slides || []).filter(s => s.active !== false);

  // Auto-cycle preview
  useEffect(() => {
    if (activeSlides.length <= 1) return;
    const interval = setInterval(() => {
      setPreviewIndex(prev => (prev + 1) % activeSlides.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [activeSlides.length]);

  const handlePrevPreview = () => {
    if (activeSlides.length === 0) return;
    setPreviewIndex(prev => (prev - 1 + activeSlides.length) % activeSlides.length);
  };

  const handleNextPreview = () => {
    if (activeSlides.length === 0) return;
    setPreviewIndex(prev => (prev + 1) % activeSlides.length);
  };

  const handleDragEnd = async (result) => {
    if (!result.destination) return;
    const items = Array.from(slides || []);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    // Update order in Firestore for all affected slides
    const updates = items.map(async (item, idx) => {
      if (item.order !== idx) {
        await updateDocument('heroSlides', item.id, { order: idx });
      }
    });
    await Promise.all(updates);
  };

  const handleAddSlide = () => {
    setEditingSlide(null);
    setFormData({ title: '', subtitle: '', description: '', button1Text: '', button1Link: '', button2Text: '', button2Link: '', image: '', video: '', overlay: 0.4, alignment: 'center' });
    setSlideImage(null);
    setShowForm(true);
  };

  const handleEditSlide = (slide) => {
    setEditingSlide(slide);
    setFormData({
      title: slide.title || '', subtitle: slide.subtitle || '', description: slide.description || '',
      button1Text: slide.button1Text || '', button1Link: slide.button1Link || '',
      button2Text: slide.button2Text || '', button2Link: slide.button2Link || '',
      image: slide.image || '', video: slide.video || '',
      overlay: slide.overlay || 0.4, alignment: slide.alignment || 'center'
    });
    setSlideImage(slide.image || null);
    setShowForm(true);
  };

  const handleDeleteSlide = async (slide) => {
    if (!window.confirm('Are you sure you want to delete this slide?')) return;

    await deleteDocumentWithAsset('heroSlides', slide.id);
  };

  const toggleSlideActive = async (id, currentActive) => {
    await updateDocument('heroSlides', id, { active: !currentActive });
  };

  const handleSaveSlide = async () => {
    const imageUrl = slideImage || formData.image;
    if (!imageUrl) {
      alert('Please upload or provide a slide image.');
      return;
    }
    const data = { ...formData, image: imageUrl, active: editingSlide ? editingSlide.active : true };
    if (editingSlide) {
      await updateDocument('heroSlides', editingSlide.id, data);
    } else {
      const order = slides?.length || 0;
      await addDocument('heroSlides', { ...data, order });
    }
    setShowForm(false);
    setEditingSlide(null);
    setSlideImage(null);
  };

  if (loading) return <AdminLayout title="Hero Slider"><LoadingSpinner fullScreen /></AdminLayout>;

  return (
    <AdminLayout title="Hero Slider Management" subtitle="Manage your homepage hero slideshow">
      {/* Stats Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Slides', value: slides?.length || 0, color: 'blue' },
          { label: 'Active Slides', value: activeSlides.length, color: 'emerald' },
          { label: 'Inactive', value: (slides?.length || 0) - activeSlides.length, color: 'amber' },
          { label: 'Preview Order', value: `${activeSlides.length} slides`, color: 'violet' },
        ].map((stat) => (
          <div key={stat.label} className="rounded-xl border border-theme bg-linear-to-br bg-card p-4">
            <p className="text-2xl font-bold text-primary">{stat.value}</p>
            <p className="text-xs text-secondary mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Preview Carousel */}
      <div className="rounded-2xl border border-theme bg-linear-to-br bg-card p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-primary">Live Preview</h2>
          <div className="flex gap-2">
            <button onClick={handlePrevPreview} className="p-2 text-gray-400 hover:text-primary bg-input rounded-lg hover:bg-white/10 transition-all"><FaChevronLeft className="text-xs" /></button>
            <button onClick={handleNextPreview} className="p-2 text-gray-400 hover:text-primary bg-input rounded-lg hover:bg-white/10 transition-all"><FaChevronRight className="text-xs" /></button>
          </div>
        </div>
        <div className="relative h-48 lg:h-64 rounded-xl overflow-hidden bg-input">
          {activeSlides.length > 0 ? (
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSlides[previewIndex]?.id || 'preview'}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="relative w-full h-full"
              >
                <img src={getImageUrl(activeSlides[previewIndex]?.image)} alt={activeSlides[previewIndex]?.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-linear-to-r from-black/70 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-primary font-bold text-lg">{activeSlides[previewIndex]?.title}</h3>
                  <p className="text-gray-300 text-sm mt-1">{activeSlides[previewIndex]?.subtitle}</p>
                </div>
                {/* Slide indicator dots */}
                {activeSlides.length > 1 && (
                  <div className="absolute top-3 right-3 flex gap-1.5">
                    {activeSlides.map((_, i) => (
                      <span key={i} className={`w-2 h-2 rounded-full transition-all ${i === previewIndex ? 'bg-amber-400 w-4' : 'bg-white/50'}`} />
                    ))}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          ) : (
            <div className="flex items-center justify-center h-full"><p className="text-secondary">No active slides to preview</p></div>
          )}
        </div>
      </div>

      {/* Slides List with Drag & Drop */}
      <div className="rounded-2xl border border-theme bg-linear-to-br bg-card overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-white/5">
          <h2 className="text-base font-bold text-primary">All Slides</h2>
          <button onClick={handleAddSlide}
            className="flex items-center gap-2 px-4 py-2.5 bg-white text-gray-800 border border-gray-200 hover:bg-blue-50 hover:shadow-md rounded-xl transition-all duration-300 text-sm font-medium">
            <FaPlus className="text-xs" /> Add Slide
          </button>
        </div>

        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="slides">
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps} className="p-4 space-y-2">
                {(slides || []).map((slide, index) => (
                  <Draggable key={slide.id} draggableId={String(slide.id)} index={index}>
                    {(provided, snapshot) => (
                      <div ref={provided.innerRef} {...provided.draggableProps}
                        className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${snapshot.isDragging ? 'border-amber-500/30 bg-amber-500/5 shadow-lg shadow-amber-500/10' : 'border-white/5 bg-card-hover hover:bg-hover'}`}>
                        <div {...provided.dragHandleProps} className="cursor-grab text-gray-600 hover:text-amber-400 transition-colors">
                          <FaGripVertical className="text-sm" />
                        </div>
                        <div className="w-16 h-12 rounded-lg overflow-hidden shrink-0 bg-input">
                          <img src={getImageUrl(slide.image)} alt={slide.title} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-primary truncate">{slide.title}</p>
                          <p className="text-xs text-secondary truncate">{slide.subtitle}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 rounded-lg text-[10px] font-medium ${slide.active !== false ? 'bg-emerald-500/10 text-emerald-400' : 'bg-gray-500/10 text-gray-400'}`}>
                            {slide.active !== false ? 'Active' : 'Inactive'}
                          </span>
                          <button onClick={() => toggleSlideActive(slide.id, slide.active !== false)}
                            className={`p-2 rounded-lg transition-all ${slide.active !== false ? 'text-emerald-400 hover:bg-emerald-500/10' : 'text-secondary hover:bg-input'}`}>
                            {slide.active !== false ? <FaToggleOn className="text-sm" /> : <FaToggleOff className="text-sm" />}
                          </button>
                          <button onClick={() => handleEditSlide(slide)}
                            className="p-2 text-secondary hover:text-amber-400 hover:bg-amber-500/10 rounded-lg transition-all">
                            <FaEdit className="text-sm" />
                          </button>
                          <button onClick={() => handleDeleteSlide(slide)}
                            className="p-2 text-secondary hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all">
                            <FaTrash className="text-sm" />
                          </button>
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>

      {/* Add/Edit Slide Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowForm(false)}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-xl bg-elevated border border-theme-strong rounded-2xl shadow-2xl shadow-black/50 overflow-hidden">
              <div className="flex items-center justify-between p-6 border-b border-white/5">
                <h3 className="text-lg font-bold text-primary">{editingSlide ? 'Edit Slide' : 'Add New Slide'}</h3>
                <button onClick={() => setShowForm(false)} className="p-2 text-secondary hover:text-primary hover:bg-input rounded-lg transition-all"><FaTimes className="text-sm" /></button>
              </div>
              <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">Title *</label>
                  <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-2.5 bg-input border border-theme-strong rounded-xl text-sm text-primary placeholder-gray-500 focus:outline-none focus:border-amber-500/30" placeholder="Enter slide title" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">Subtitle</label>
                  <input type="text" value={formData.subtitle} onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                    className="w-full px-4 py-2.5 bg-input border border-theme-strong rounded-xl text-sm text-primary placeholder-gray-500 focus:outline-none focus:border-amber-500/30" placeholder="Enter subtitle" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">Description</label>
                  <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-2.5 bg-input border border-theme-strong rounded-xl text-sm text-primary placeholder-gray-500 focus:outline-none focus:border-amber-500/30 h-20 resize-none" placeholder="Slide description" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1.5">Button 1 Text</label>
                    <input type="text" value={formData.button1Text} onChange={(e) => setFormData({ ...formData, button1Text: e.target.value })}
                      className="w-full px-4 py-2.5 bg-input border border-theme-strong rounded-xl text-sm text-primary placeholder-gray-500 focus:outline-none focus:border-amber-500/30" placeholder="Get Free Quote" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1.5">Button 1 Link</label>
                    <input type="text" value={formData.button1Link} onChange={(e) => setFormData({ ...formData, button1Link: e.target.value })}
                      className="w-full px-4 py-2.5 bg-input border border-theme-strong rounded-xl text-sm text-primary placeholder-gray-500 focus:outline-none focus:border-amber-500/30" placeholder="/quote" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1.5">Button 2 Text</label>
                    <input type="text" value={formData.button2Text} onChange={(e) => setFormData({ ...formData, button2Text: e.target.value })}
                      className="w-full px-4 py-2.5 bg-input border border-theme-strong rounded-xl text-sm text-primary placeholder-gray-500 focus:outline-none focus:border-amber-500/30" placeholder="View Projects" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1.5">Button 2 Link</label>
                    <input type="text" value={formData.button2Link} onChange={(e) => setFormData({ ...formData, button2Link: e.target.value })}
                      className="w-full px-4 py-2.5 bg-input border border-theme-strong rounded-xl text-sm text-primary placeholder-gray-500 focus:outline-none focus:border-amber-500/30" placeholder="/projects" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1.5">Overlay Opacity</label>
                    <input type="range" min="0" max="1" step="0.05" value={formData.overlay}
                      onChange={(e) => setFormData({ ...formData, overlay: parseFloat(e.target.value) })}
                      className="w-full accent-amber-500" />
                    <span className="text-xs text-gray-500">{formData.overlay}</span>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1.5">Text Alignment</label>
                    <select value={formData.alignment} onChange={(e) => setFormData({ ...formData, alignment: e.target.value })}
                      className="w-full px-4 py-2.5 bg-input border border-theme-strong rounded-xl text-sm text-gray-300 focus:outline-none focus:border-amber-500/30">
                      <option value="center">Center</option>
                      <option value="left">Left</option>
                      <option value="right">Right</option>
                    </select>
                  </div>
                </div>
                <ImageUploader images={slideImage ? [slideImage] : []}
                  onImagesChange={(urls) => setSlideImage(urls?.[0] || null)}
                  maxFiles={1} folder="hero-slides" label="Slide Image" />
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">Video URL (optional)</label>
                  <input type="text" value={formData.video} onChange={(e) => setFormData({ ...formData, video: e.target.value })}
                    className="w-full px-4 py-2.5 bg-input border border-theme-strong rounded-xl text-sm text-primary placeholder-gray-500 focus:outline-none focus:border-amber-500/30" placeholder="https://example.com/video.mp4" />
                </div>
              </div>
              <div className="flex justify-end gap-3 p-6 border-t border-white/5">
                <button onClick={() => setShowForm(false)} className="px-4 py-2.5 text-sm text-gray-500 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:text-gray-700 hover:shadow-sm transition-all duration-300">Cancel</button>
                <button onClick={handleSaveSlide}
                  className="flex items-center gap-2 px-4 py-2.5 text-sm bg-white text-gray-800 border border-gray-200 hover:bg-blue-50 hover:shadow-md rounded-xl transition-all duration-300 font-medium">
                  <FaSave className="text-xs" /> {editingSlide ? 'Update Slide' : 'Add Slide'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AdminLayout>
  );
};

export default AdminHeroSlider;