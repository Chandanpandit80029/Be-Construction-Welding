import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlus, FaEdit, FaTrash, FaSearch, FaTimes, FaSave, FaImages, FaFilter, FaFolder, FaCheckCircle, FaSpinner, FaMapMarkerAlt, FaCalendarAlt, FaUser, FaTags, FaVideo, FaList, FaCode, FaUsers, FaQuoteRight, FaGlobe, FaArrowUp, FaRegImages } from 'react-icons/fa';
import { useForm } from 'react-hook-form';
import { useCollection, addDocument, updateDocument, deleteDocumentWithAsset } from '../../hooks/useFirestore';
import AdminLayout from '../../components/admin/AdminLayout';
import { getImageUrl } from '../../utils/image';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import ImageUploader from '../../components/shared/ImageUploader';

const AdminProjects = () => {
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [thumbnail, setThumbnail] = useState(null);
  const [galleryImages, setGalleryImages] = useState([]);
  const [featuresList, setFeaturesList] = useState([]);
  const [newFeature, setNewFeature] = useState('');
  const [challengesList, setChallengesList] = useState([{ title: '', solution: '' }]);
  const [processList, setProcessList] = useState([{ step: '', title: '', description: '' }]);
  const [teamMembersList, setTeamMembersList] = useState([{ name: '', role: '' }]);
  const [tagsList, setTagsList] = useState([]);
  const [newTag, setNewTag] = useState('');
  const [saving, setSaving] = useState(false);
  const { data: projects, loading } = useCollection('projects', { orderBy: 'createdAt', orderDirection: 'desc' });

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm();

  const categories = ['Industrial', 'Residential', 'Commercial', 'Fabrication', 'Infrastructure', 'Renovation', 'Custom'];
  const statuses = ['Completed', 'Ongoing', 'Planned'];

  // Auto-generate slug from title
  const title = watch('title');
  const generateSlug = useCallback((text) => {
    return text
      ?.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') || '';
  }, []);

  const openModal = (project = null) => {
    if (project) {
      setEditingProject(project);
      setValue('title', project.title);
      setValue('slug', project.slug);
      setValue('shortDescription', project.shortDescription);
      setValue('fullDescription', project.fullDescription);
      setValue('description', project.description);
      setValue('category', project.category);
      setValue('client', project.client);
      setValue('location', project.location);
      setValue('budget', project.budget);
      setValue('startDate', project.startDate?.split('T')[0] || '');
      setValue('completionDate', project.completionDate?.split('T')[0] || '');
      setValue('status', project.status);
      setValue('technologies', project.technologies?.join(', ') || '');
      setValue('videoUrl', project.videoUrl || '');
      setValue('testimonial', project.testimonial?.text || '');
      setValue('testimonialAuthor', project.testimonial?.author || '');
      setValue('testimonialRole', project.testimonial?.role || '');
      setValue('seoTitle', project.seoTitle || '');
      setValue('seoDescription', project.seoDescription || '');
      setThumbnail(project.thumbnail || project.image || null);
      setGalleryImages(project.galleryImages || project.images || []);
      setFeaturesList(project.features || []);
      setChallengesList(project.challenges?.length > 0 ? project.challenges : [{ title: '', solution: '' }]);
      setProcessList(project.process?.length > 0 ? project.process : [{ step: '', title: '', description: '' }]);
      setTeamMembersList(project.teamMembers?.length > 0 ? project.teamMembers : [{ name: '', role: '' }]);
      setTagsList(project.tags || []);
    } else {
      setEditingProject(null);
      setThumbnail(null);
      setGalleryImages([]);
      setFeaturesList([]);
      setChallengesList([{ title: '', solution: '' }]);
      setProcessList([{ step: '', title: '', description: '' }]);
      setTeamMembersList([{ name: '', role: '' }]);
      setTagsList([]);
      reset();
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingProject(null);
    setThumbnail(null);
    setGalleryImages([]);
    setFeaturesList([]);
    setChallengesList([{ title: '', solution: '' }]);
    setProcessList([{ step: '', title: '', description: '' }]);
    setTeamMembersList([{ name: '', role: '' }]);
    setTagsList([]);
    setNewFeature('');
    setNewTag('');
    reset();
  };

  const onSubmit = async (data) => {
    setSaving(true);
    const slug = data.slug || generateSlug(data.title);
    const projectData = {
      id: editingProject?.id || slug,
      slug,
      title: data.title,
      shortDescription: data.shortDescription || '',
      fullDescription: data.fullDescription || '',
      description: data.description || data.shortDescription || '',
      category: data.category,
      client: data.client || '',
      location: data.location || '',
      budget: data.budget || '',
      startDate: data.startDate || '',
      completionDate: data.completionDate || '',
      status: data.status,
      technologies: data.technologies ? data.technologies.split(',').map(t => t.trim()).filter(Boolean) : [],
      thumbnail: thumbnail,
      image: thumbnail, // keep backward compatibility
      galleryImages: galleryImages,
      images: galleryImages, // keep backward compatibility
      videoUrl: data.videoUrl || '',
      features: featuresList,
      challenges: challengesList.filter(c => c.title || c.solution),
      process: processList.filter(p => p.step || p.title),
      teamMembers: teamMembersList.filter(m => m.name || m.role),
      testimonial: data.testimonial ? {
        text: data.testimonial,
        author: data.testimonialAuthor || '',
        role: data.testimonialRole || ''
      } : null,
      tags: tagsList,
      seoTitle: data.seoTitle || '',
      seoDescription: data.seoDescription || '',
    };

    if (editingProject) {
      await updateDocument('projects', editingProject.id, projectData);
    } else {
      await addDocument('projects', projectData);
    }
    setSaving(false);
    closeModal();
  };

  const handleDelete = async (project) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;
    await deleteDocumentWithAsset('projects', project.id);
  };

  const addFeature = () => {
    if (newFeature.trim()) {
      setFeaturesList([...featuresList, newFeature.trim()]);
      setNewFeature('');
    }
  };

  const removeFeature = (idx) => {
    setFeaturesList(featuresList.filter((_, i) => i !== idx));
  };

  const addTag = () => {
    if (newTag.trim() && !tagsList.includes(newTag.trim())) {
      setTagsList([...tagsList, newTag.trim()]);
      setNewTag('');
    }
  };

  const removeTag = (idx) => {
    setTagsList(tagsList.filter((_, i) => i !== idx));
  };

  const filteredProjects = projects?.filter(project => {
    const matchesSearch = project.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.client?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || project.category === filterCategory;
    const matchesStatus = filterStatus === 'all' || project.status === filterStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const completed = projects?.filter(p => p.status === 'Completed').length || 0;
  const ongoing = projects?.filter(p => p.status === 'Ongoing').length || 0;

  if (loading) {
    return (
      <AdminLayout title="Projects Management" subtitle="Manage your complete project portfolio">
        <LoadingSpinner fullScreen text="Loading projects..." />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Projects Management" subtitle="Manage your complete project portfolio">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Projects', value: projects?.length || 0, icon: FaFolder, color: 'blue' },
          { label: 'Completed', value: completed, icon: FaCheckCircle, color: 'emerald' },
          { label: 'Ongoing', value: ongoing, icon: FaSpinner, color: 'amber' },
          { label: 'Categories', value: categories.length, icon: FaFilter, color: 'violet' },
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
            <input type="text" placeholder="Search projects..." value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 bg-input border border-theme-strong rounded-xl text-sm text-primary placeholder-gray-500 focus:outline-none focus:border-amber-500/30" />
          </div>
          <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-2.5 bg-input border border-theme-strong rounded-xl text-sm text-gray-300 focus:outline-none focus:border-amber-500/30">
            <option value="all">All Categories</option>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2.5 bg-input border border-theme-strong rounded-xl text-sm text-gray-300 focus:outline-none focus:border-amber-500/30">
            <option value="all">All Status</option>
            {statuses.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <button onClick={() => openModal()}
            className="flex items-center gap-2 px-4 py-2.5 bg-white text-gray-800 border border-gray-200 hover:bg-blue-50 hover:shadow-md rounded-xl transition-all duration-300 text-sm font-medium">
            <FaPlus className="text-xs" /> Add Project
          </button>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProjects?.map((project, idx) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.03 }}
            className="group rounded-2xl border border-theme bg-linear-to-br bg-card overflow-hidden hover:border-white/10 transition-all"
          >
            <div className="h-40 relative overflow-hidden bg-input">
              {(project.thumbnail || project.image) ? (
                <img src={getImageUrl(project.thumbnail || project.image)} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              ) : (
                <div className="flex items-center justify-center h-full"><FaImages className="text-3xl text-gray-700" /></div>
              )}
              <div className="absolute top-3 right-3">
                <span className={`px-2 py-1 rounded-lg text-[10px] font-medium ${
                  project.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                  project.status === 'Ongoing' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                  'bg-input text-gray-400 border border-theme-strong'
                }`}>{project.status}</span>
              </div>
              <div className="absolute top-3 left-3">
                <span className="px-2 py-1 rounded-lg text-[10px] font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">{project.category}</span>
              </div>
            </div>
            <div className="p-4">
              <h3 className="text-sm font-semibold text-primary mb-1">{project.title}</h3>
              <p className="text-xs text-secondary line-clamp-2 mb-3">{project.shortDescription || project.description}</p>
              <div className="flex items-center gap-3 text-[10px] text-gray-600 mb-3 flex-wrap">
                {project.location && <span className="flex items-center gap-1"><FaMapMarkerAlt /> {project.location}</span>}
                {project.client && <span className="flex items-center gap-1"><FaUser /> {project.client}</span>}
                {project.budget && <span className="flex items-center gap-1"><span className="text-[10px]">₹</span> {project.budget}</span>}
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => openModal(project)} className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-input rounded-lg text-xs text-gray-400 hover:text-amber-400 hover:bg-amber-500/10 transition-all">
                  <FaEdit className="text-[10px]" /> Edit
                </button>
                <button onClick={() => handleDelete(project)} className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-input rounded-lg text-xs text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all">
                  <FaTrash className="text-[10px]" /> Delete
                </button>
              </div>
            </div>
          </motion.div>
        ))}
        {(!filteredProjects || filteredProjects.length === 0) && (
          <div className="col-span-full text-center py-20">
            <FaImages className="text-4xl text-gray-700 mx-auto mb-3" />
            <p className="text-secondary">No projects found</p>
          </div>
        )}
      </div>

      {/* Project Form Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={closeModal}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-3xl bg-elevated border border-theme-strong rounded-2xl shadow-2xl shadow-black/50 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-6 border-b border-white/5 sticky top-0 bg-elevated z-10">
                <h3 className="text-lg font-bold text-primary">{editingProject ? 'Edit Project' : 'Add New Project'}</h3>
                <button onClick={closeModal} className="p-2 text-secondary hover:text-primary hover:bg-input rounded-lg transition-all">
                  <FaTimes className="text-sm" />
                </button>
              </div>
              <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
                {/* Basic Information */}
                <div>
                  <h4 className="text-sm font-semibold text-primary mb-4 flex items-center gap-2"><FaFolder /> Basic Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-xs font-medium text-gray-400 mb-1.5">Project Title *</label>
                      <input type="text" {...register('title', { required: 'Title is required' })}
                        className="w-full px-4 py-2.5 bg-input border border-theme-strong rounded-xl text-sm text-primary placeholder-gray-500 focus:outline-none focus:border-amber-500/30"
                        placeholder="Enter project title" />
                      {errors.title && <p className="text-red-400 text-xs mt-1">{errors.title.message}</p>}
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-medium text-gray-400 mb-1.5">
                        Slug <span className="text-gray-600">(auto-generated from title)</span>
                      </label>
                      <input type="text" {...register('slug')}
                        onChange={(e) => setValue('slug', generateSlug(e.target.value))}
                        defaultValue={generateSlug(title || '')}
                        className="w-full px-4 py-2.5 bg-input border border-theme-strong rounded-xl text-sm text-primary placeholder-gray-500 focus:outline-none focus:border-amber-500/30"
                        placeholder="project-url-slug" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-medium text-gray-400 mb-1.5">Short Description</label>
                      <textarea {...register('shortDescription')}
                        className="w-full px-4 py-2.5 bg-input border border-theme-strong rounded-xl text-sm text-primary placeholder-gray-500 focus:outline-none focus:border-amber-500/30 h-20 resize-none"
                        placeholder="Brief summary for project cards" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-medium text-gray-400 mb-1.5">Full Detailed Description</label>
                      <textarea {...register('fullDescription')}
                        className="w-full px-4 py-2.5 bg-input border border-theme-strong rounded-xl text-sm text-primary placeholder-gray-500 focus:outline-none focus:border-amber-500/30 h-32 resize-none"
                        placeholder="Complete project description with all details" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-1.5">Category *</label>
                      <select {...register('category', { required: 'Category is required' })}
                        className="w-full px-4 py-2.5 bg-input border border-theme-strong rounded-xl text-sm text-gray-300 focus:outline-none focus:border-amber-500/30">
                        <option value="">Select category</option>
                        {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-1.5">Status *</label>
                      <select {...register('status', { required: 'Status is required' })}
                        className="w-full px-4 py-2.5 bg-input border border-theme-strong rounded-xl text-sm text-gray-300 focus:outline-none focus:border-amber-500/30">
                        <option value="">Select status</option>
                        {statuses.map(status => <option key={status} value={status}>{status}</option>)}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Client & Budget */}
                <div>
                  <h4 className="text-sm font-semibold text-primary mb-4 flex items-center gap-2"><span className="text-xs">₹</span> Client & Budget</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-1.5"><FaUser className="inline mr-1" /> Client Name</label>
                      <input type="text" {...register('client')}
                        className="w-full px-4 py-2.5 bg-input border border-theme-strong rounded-xl text-sm text-primary placeholder-gray-500 focus:outline-none focus:border-amber-500/30"
                        placeholder="Client name" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-1.5"><FaMapMarkerAlt className="inline mr-1" /> Location</label>
                      <input type="text" {...register('location')}
                        className="w-full px-4 py-2.5 bg-input border border-theme-strong rounded-xl text-sm text-primary placeholder-gray-500 focus:outline-none focus:border-amber-500/30"
                        placeholder="Project location" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-1.5"><span className="inline mr-1 text-amber-400">₹</span> Budget (INR)</label>
                      <input type="text" {...register('budget')}
                        className="w-full px-4 py-2.5 bg-input border border-theme-strong rounded-xl text-sm text-primary placeholder-gray-500 focus:outline-none focus:border-amber-500/30"
                        placeholder="e.g. ₹5,00,000" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-1.5"><FaCalendarAlt className="inline mr-1" /> Start Date</label>
                      <input type="date" {...register('startDate')}
                        className="w-full px-4 py-2.5 bg-input border border-theme-strong rounded-xl text-sm text-primary focus:outline-none focus:border-amber-500/30" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-1.5"><FaCalendarAlt className="inline mr-1" /> Completion Date</label>
                      <input type="date" {...register('completionDate')}
                        className="w-full px-4 py-2.5 bg-input border border-theme-strong rounded-xl text-sm text-primary focus:outline-none focus:border-amber-500/30" />
                    </div>
                  </div>
                </div>

                {/* Images */}
                <div>
                  <h4 className="text-sm font-semibold text-primary mb-4 flex items-center gap-2"><FaRegImages /> Images</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-1.5">Main Thumbnail Image</label>
                      <ImageUploader
                        images={thumbnail ? [thumbnail] : []}
                        onImagesChange={(urls) => setThumbnail(urls?.[0] || null)}
                        maxFiles={1}
                        folder="projects/thumbnails"
                        label="Upload Thumbnail"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-1.5">Multiple Gallery Images</label>
                      <ImageUploader
                        images={galleryImages}
                        onImagesChange={setGalleryImages}
                        maxFiles={20}
                        folder="projects/gallery"
                        label="Upload Gallery Images"
                      />
                    </div>
                  </div>
                </div>

                {/* Video */}
                <div>
                  <h4 className="text-sm font-semibold text-primary mb-4 flex items-center gap-2"><FaVideo /> Video</h4>
                  <input type="text" {...register('videoUrl')}
                    className="w-full px-4 py-2.5 bg-input border border-theme-strong rounded-xl text-sm text-primary placeholder-gray-500 focus:outline-none focus:border-amber-500/30"
                    placeholder="YouTube or Vimeo embed URL" />
                </div>

                {/* Technologies */}
                <div>
                  <h4 className="text-sm font-semibold text-primary mb-4 flex items-center gap-2"><FaCode /> Technologies Used</h4>
                  <input type="text" {...register('technologies')}
                    className="w-full px-4 py-2.5 bg-input border border-theme-strong rounded-xl text-sm text-primary placeholder-gray-500 focus:outline-none focus:border-amber-500/30"
                    placeholder="Comma separated: Steel, Concrete, Glass, etc." />
                </div>

                {/* Features List */}
                <div>
                  <h4 className="text-sm font-semibold text-primary mb-4 flex items-center gap-2"><FaList /> Features List</h4>
                  <div className="flex gap-2 mb-3">
                    <input type="text" value={newFeature} onChange={(e) => setNewFeature(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                      className="flex-1 px-4 py-2 bg-input border border-theme-strong rounded-xl text-sm text-primary placeholder-gray-500 focus:outline-none focus:border-amber-500/30"
                      placeholder="Add a feature..." />
                    <button type="button" onClick={addFeature}
                      className="px-3 py-2 bg-white text-gray-800 rounded-xl text-xs font-medium hover:bg-blue-50 transition-all">Add</button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {featuresList.map((feature, idx) => (
                      <span key={idx} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white text-gray-700 rounded-lg text-xs font-medium border border-gray-200">
                        {feature}
                        <button type="button" onClick={() => removeFeature(idx)} className="text-red-400 hover:text-red-600"><FaTimes /></button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Challenges & Solutions */}
                <div>
                  <h4 className="text-sm font-semibold text-primary mb-4 flex items-center gap-2">⚡ Challenges & Solutions</h4>
                  {challengesList.map((item, idx) => (
                    <div key={idx} className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3 p-3 bg-white border border-gray-100 rounded-xl">
                      <div>
                        <label className="block text-xs text-gray-400 mb-1">Challenge</label>
                        <input type="text" value={item.title}
                          onChange={(e) => {
                            const updated = [...challengesList];
                            updated[idx].title = e.target.value;
                            setChallengesList(updated);
                          }}
                          className="w-full px-3 py-2 bg-input border border-theme-strong rounded-lg text-sm text-primary focus:outline-none focus:border-amber-500/30"
                          placeholder="Describe the challenge" />
                      </div>
                      <div className="relative">
                        <label className="block text-xs text-gray-400 mb-1">Solution</label>
                        <input type="text" value={item.solution}
                          onChange={(e) => {
                            const updated = [...challengesList];
                            updated[idx].solution = e.target.value;
                            setChallengesList(updated);
                          }}
                          className="w-full px-3 py-2 bg-input border border-theme-strong rounded-lg text-sm text-primary focus:outline-none focus:border-amber-500/30"
                          placeholder="How was it solved?" />
                        {challengesList.length > 1 && (
                          <button type="button" onClick={() => setChallengesList(challengesList.filter((_, i) => i !== idx))}
                            className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600">
                            <FaTimes />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                  <button type="button" onClick={() => setChallengesList([...challengesList, { title: '', solution: '' }])}
                    className="text-xs text-amber-400 hover:text-amber-300 transition-colors">+ Add Challenge</button>
                </div>

                {/* Construction Process */}
                <div>
                  <h4 className="text-sm font-semibold text-primary mb-4 flex items-center gap-2">🏗️ Construction Process</h4>
                  {processList.map((item, idx) => (
                    <div key={idx} className="grid grid-cols-3 gap-3 mb-3 p-3 bg-white border border-gray-100 rounded-xl relative">
                      <div>
                        <label className="block text-xs text-gray-400 mb-1">Step #</label>
                        <input type="text" value={item.step}
                          onChange={(e) => {
                            const updated = [...processList];
                            updated[idx].step = e.target.value;
                            setProcessList(updated);
                          }}
                          className="w-full px-3 py-2 bg-input border border-theme-strong rounded-lg text-sm text-primary focus:outline-none focus:border-amber-500/30"
                          placeholder="e.g. 01" />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-400 mb-1">Title</label>
                        <input type="text" value={item.title}
                          onChange={(e) => {
                            const updated = [...processList];
                            updated[idx].title = e.target.value;
                            setProcessList(updated);
                          }}
                          className="w-full px-3 py-2 bg-input border border-theme-strong rounded-lg text-sm text-primary focus:outline-none focus:border-amber-500/30"
                          placeholder="Step title" />
                      </div>
                      <div className="relative">
                        <label className="block text-xs text-gray-400 mb-1">Description</label>
                        <input type="text" value={item.description}
                          onChange={(e) => {
                            const updated = [...processList];
                            updated[idx].description = e.target.value;
                            setProcessList(updated);
                          }}
                          className="w-full px-3 py-2 bg-input border border-theme-strong rounded-lg text-sm text-primary focus:outline-none focus:border-amber-500/30"
                          placeholder="Step description" />
                        {processList.length > 1 && (
                          <button type="button" onClick={() => setProcessList(processList.filter((_, i) => i !== idx))}
                            className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600">
                            <FaTimes />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                  <button type="button" onClick={() => setProcessList([...processList, { step: '', title: '', description: '' }])}
                    className="text-xs text-amber-400 hover:text-amber-300 transition-colors">+ Add Process Step</button>
                </div>

                {/* Team Members */}
                <div>
                  <h4 className="text-sm font-semibold text-primary mb-4 flex items-center gap-2"><FaUsers /> Team Members</h4>
                  {teamMembersList.map((item, idx) => (
                    <div key={idx} className="grid grid-cols-2 gap-3 mb-3 p-3 bg-white border border-gray-100 rounded-xl relative">
                      <div>
                        <label className="block text-xs text-gray-400 mb-1">Name</label>
                        <input type="text" value={item.name}
                          onChange={(e) => {
                            const updated = [...teamMembersList];
                            updated[idx].name = e.target.value;
                            setTeamMembersList(updated);
                          }}
                          className="w-full px-3 py-2 bg-input border border-theme-strong rounded-lg text-sm text-primary focus:outline-none focus:border-amber-500/30"
                          placeholder="Team member name" />
                      </div>
                      <div className="relative">
                        <label className="block text-xs text-gray-400 mb-1">Role</label>
                        <input type="text" value={item.role}
                          onChange={(e) => {
                            const updated = [...teamMembersList];
                            updated[idx].role = e.target.value;
                            setTeamMembersList(updated);
                          }}
                          className="w-full px-3 py-2 bg-input border border-theme-strong rounded-lg text-sm text-primary focus:outline-none focus:border-amber-500/30"
                          placeholder="Their role" />
                        {teamMembersList.length > 1 && (
                          <button type="button" onClick={() => setTeamMembersList(teamMembersList.filter((_, i) => i !== idx))}
                            className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600">
                            <FaTimes />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                  <button type="button" onClick={() => setTeamMembersList([...teamMembersList, { name: '', role: '' }])}
                    className="text-xs text-amber-400 hover:text-amber-300 transition-colors">+ Add Member</button>
                </div>

                {/* Testimonial */}
                <div>
                  <h4 className="text-sm font-semibold text-primary mb-4 flex items-center gap-2"><FaQuoteRight /> Testimonial</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <textarea {...register('testimonial')}
                        className="w-full px-4 py-2.5 bg-input border border-theme-strong rounded-xl text-sm text-primary placeholder-gray-500 focus:outline-none focus:border-amber-500/30 h-20 resize-none"
                        placeholder="Client testimonial text..." />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-1.5">Author</label>
                      <input type="text" {...register('testimonialAuthor')}
                        className="w-full px-4 py-2.5 bg-input border border-theme-strong rounded-xl text-sm text-primary placeholder-gray-500 focus:outline-none focus:border-amber-500/30"
                        placeholder="Client name" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-1.5">Role</label>
                      <input type="text" {...register('testimonialRole')}
                        className="w-full px-4 py-2.5 bg-input border border-theme-strong rounded-xl text-sm text-primary placeholder-gray-500 focus:outline-none focus:border-amber-500/30"
                        placeholder="e.g. CEO, ABC Corp" />
                    </div>
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <h4 className="text-sm font-semibold text-primary mb-4 flex items-center gap-2"><FaTags /> Tags</h4>
                  <div className="flex gap-2 mb-3">
                    <input type="text" value={newTag} onChange={(e) => setNewTag(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                      className="flex-1 px-4 py-2 bg-input border border-theme-strong rounded-xl text-sm text-primary placeholder-gray-500 focus:outline-none focus:border-amber-500/30"
                      placeholder="Add a tag..." />
                    <button type="button" onClick={addTag}
                      className="px-3 py-2 bg-white text-gray-800 rounded-xl text-xs font-medium hover:bg-blue-50 transition-all">Add</button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {tagsList.map((tag, idx) => (
                      <span key={idx} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-700 rounded-lg text-xs font-medium border border-amber-200">
                        {tag}
                        <button type="button" onClick={() => removeTag(idx)} className="text-amber-400 hover:text-red-500"><FaTimes /></button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* SEO */}
                <div>
                  <h4 className="text-sm font-semibold text-primary mb-4 flex items-center gap-2"><FaGlobe /> SEO Settings</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-xs font-medium text-gray-400 mb-1.5">SEO Title</label>
                      <input type="text" {...register('seoTitle')}
                        className="w-full px-4 py-2.5 bg-input border border-theme-strong rounded-xl text-sm text-primary placeholder-gray-500 focus:outline-none focus:border-amber-500/30"
                        placeholder="Custom SEO title (leave empty to use project title)" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-medium text-gray-400 mb-1.5">SEO Description</label>
                      <textarea {...register('seoDescription')}
                        className="w-full px-4 py-2.5 bg-input border border-theme-strong rounded-xl text-sm text-primary placeholder-gray-500 focus:outline-none focus:border-amber-500/30 h-16 resize-none"
                        placeholder="Meta description for search engines" />
                    </div>
                  </div>
                </div>

                {/* Submit */}
                <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
                  <button type="button" onClick={closeModal} className="px-4 py-2.5 text-sm text-gray-500 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:text-gray-700 hover:shadow-sm transition-all duration-300">Cancel</button>
                  <button type="submit" disabled={saving}
                    className={`flex items-center gap-2 px-6 py-2.5 text-sm bg-white text-gray-800 border border-gray-200 hover:bg-blue-50 hover:shadow-md rounded-xl transition-all duration-300 font-medium ${saving ? 'opacity-50 cursor-not-allowed' : ''}`}>
                    {saving ? <FaSpinner className="animate-spin" /> : <FaSave className="text-xs" />}
                    {saving ? 'Saving...' : (editingProject ? 'Update Project' : 'Create Project')}
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

export default AdminProjects;