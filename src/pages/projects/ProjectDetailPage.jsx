import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaArrowLeft, FaCheckCircle, FaArrowRight, FaPhone, FaCalendar, FaMapMarkerAlt, FaUser, FaTools, FaClock, FaQuoteLeft, FaQuoteRight, FaPlay, FaTimes, FaShareAlt, FaFacebook, FaTwitter, FaLinkedin, FaWhatsapp, FaClipboard, FaExternalLinkAlt, FaStar, FaChevronLeft, FaChevronRight, FaBuilding, FaHardHat, FaUsers, FaCode, FaCogs } from 'react-icons/fa';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import SectionTitle from '../../components/ui/SectionTitle';
import ProjectCard from '../../components/ui/ProjectCard';
import { SEOMeta, BreadcrumbSchema } from '../../contexts/SEOContext';
import { useRealtimeCollection } from '../../hooks/useFirestore';
import { getImageUrl } from '../../utils/image';

const ProjectDetailPage = () => {
  const { slug } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeGalleryIdx, setActiveGalleryIdx] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIdx, setLightboxIdx] = useState(0);
  const [copied, setCopied] = useState(false);
  const { data: allProjects } = useRealtimeCollection('projects', { orderBy: 'createdAt', orderDirection: 'desc' });

  useEffect(() => {
    setLoading(true);
    setProject(null);

    if (!allProjects) {
      // Wait for data to load
      return;
    }

    const found = allProjects.find(p => p.slug === slug);
    if (found) {
      setProject(found);
    }
    setLoading(false);
  }, [slug, allProjects]);

  const galleryImages = [
    ...(project?.thumbnail ? [project.thumbnail] : []),
    ...(project?.galleryImages || project?.images || []),
  ];

  const relatedProjects = (allProjects || [])
    .filter(p => p.slug !== slug && (p.category === project?.category))
    .slice(0, 3);

  const handleShare = (platform) => {
    const url = window.location.href;
    const text = `Check out this project: ${project?.title}`;
    const urls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`,
    };
    window.open(urls[platform], '_blank', 'width=600,height=400');
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="pt-32 container-custom">
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="h-8 w-32 skeleton rounded-lg" />
            <div className="h-96 skeleton rounded-2xl" />
            <div className="h-10 w-3/4 skeleton rounded-lg" />
            <div className="h-4 w-full skeleton rounded-lg" />
            <div className="grid grid-cols-2 gap-4">
              <div className="h-40 skeleton rounded-xl" />
              <div className="h-40 skeleton rounded-xl" />
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="pt-32 container-custom text-center">
          <div className="max-w-lg mx-auto">
            <div className="text-8xl mb-6">🏗️</div>
            <h1 className="text-3xl font-bold text-[#111111] mb-4">Project Not Found</h1>
            <p className="text-gray-500 mb-8">The project you're looking for doesn't exist or has been removed.</p>
            <Link to="/projects" className="inline-flex items-center space-x-2 bg-[#FBBF24] text-[#111111] px-6 py-3 rounded-xl font-semibold hover:bg-[#D97706] transition-all">
              <FaArrowLeft className="text-sm" />
              <span>Back to Projects</span>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const getEmbedUrl = (url) => {
    if (!url) return null;
    const youtubeMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/);
    if (youtubeMatch) return `https://www.youtube.com/embed/${youtubeMatch[1]}`;
    const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
    if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
    return url;
  };

  const schemaItems = [
    { name: 'Home', path: '/' },
    { name: 'Projects', path: '/projects' },
    { name: project.title, path: `/projects/${slug}` },
  ];

  const seoTitle = project.seoTitle || `${project.title} | BE Construction & Welding Works`;

  return (
    <div className="min-h-screen bg-white">
      <SEOMeta 
        title={seoTitle}
        description={project.seoDescription || project.shortDescription || project.description || `Project: ${project.title} by BE Construction & Welding Works`}
        keywords={`${project.title}, ${project.category}, construction project, welding, steel fabrication, ${(project.tags || []).join(', ')}`}
        canonical={`/projects/${slug}`}
      />
      <BreadcrumbSchema items={schemaItems} />
      <Header />

      {/* ============ HERO BANNER ============ */}
      <section className="relative pt-28 pb-24 bg-[#111111] overflow-hidden">
        <div className="absolute inset-0">
          {galleryImages.length > 0 && (
            <img 
              src={getImageUrl(galleryImages[0])} 
              alt={project.title}
              className="w-full h-full object-cover opacity-30"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-[#111111]/80 to-[#111111]/60" />
          <div className="absolute inset-0 pattern-grid opacity-10" />
        </div>
        <div className="container-custom relative z-10">
          <Link to="/projects" className="inline-flex items-center space-x-2 text-[#FBBF24] hover:text-[#D97706] transition-colors mb-6 group">
            <FaArrowLeft className="text-sm group-hover:-translate-x-1 transition-transform" />
            <span>Back to Projects</span>
          </Link>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="flex flex-wrap gap-3 mb-4">
              <span className="px-3 py-1.5 bg-[#FBBF24]/20 text-[#FBBF24] text-xs font-semibold rounded-full border border-[#FBBF24]/30">{project.category}</span>
              <span className={`px-3 py-1.5 text-xs font-semibold rounded-full ${
                project.status === 'Completed' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                project.status === 'Ongoing' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                'bg-gray-500/20 text-gray-400 border border-gray-500/30'
              }`}>{project.status}</span>
              {project.tags?.slice(0, 3).map(tag => (
                <span key={tag} className="px-2.5 py-1 bg-white/5 text-gray-400 text-xs rounded-full border border-white/10">{tag}</span>
              ))}
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">{project.title}</h1>
            <p className="text-lg md:text-xl text-gray-300 max-w-3xl">{project.shortDescription || project.description}</p>
            <div className="flex flex-wrap gap-6 mt-6 text-sm text-gray-400">
              {project.client && <span className="flex items-center gap-2"><FaUser className="text-[#FBBF24]" /> {project.client}</span>}
              {project.location && <span className="flex items-center gap-2"><FaMapMarkerAlt className="text-[#FBBF24]" /> {project.location}</span>}
              {project.completionDate && <span className="flex items-center gap-2"><FaCalendar className="text-[#FBBF24]" /> {new Date(project.completionDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>}
              {project.budget && <span className="flex items-center gap-2"><span className="text-[#FBBF24] font-medium">₹</span> {project.budget}</span>}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ============ MAIN CONTENT ============ */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2 space-y-12">

              {/* Full Description */}
              {(project.fullDescription || project.description) && (
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                  <SectionTitle title="Project Overview" subtitle="Complete project details" />
                  <div className="prose prose-gray max-w-none">
                    <p className="text-gray-600 leading-relaxed text-base md:text-lg whitespace-pre-line">
                      {project.fullDescription || project.description}
                    </p>
                  </div>
                </motion.div>
              )}

              {/* Image Gallery Slider */}
              {galleryImages.length > 1 && (
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                  <SectionTitle title="Project Gallery" subtitle="Visual journey of the project" />
                  <div className="relative rounded-2xl overflow-hidden group">
                    <img
                      src={getImageUrl(galleryImages[activeGalleryIdx])}
                      alt={`${project.title} gallery image ${activeGalleryIdx + 1}`}
                      className="w-full h-[300px] md:h-[450px] object-cover cursor-pointer"
                      onClick={() => { setLightboxOpen(true); setLightboxIdx(activeGalleryIdx); }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <button onClick={() => setLightboxOpen(true)}
                      className="absolute inset-0 w-full h-full hidden group-hover:flex items-center justify-center text-white text-lg font-medium">
                      <FaExternalLinkAlt className="mr-2" /> View Fullscreen
                    </button>
                    {galleryImages.length > 1 && (
                      <>
                        <button onClick={() => setActiveGalleryIdx((prev) => (prev === 0 ? galleryImages.length - 1 : prev - 1))}
                          className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 text-gray-800 rounded-full flex items-center justify-center hover:bg-white transition-all shadow-lg opacity-0 group-hover:opacity-100">
                          <FaChevronLeft />
                        </button>
                        <button onClick={() => setActiveGalleryIdx((prev) => (prev === galleryImages.length - 1 ? 0 : prev + 1))}
                          className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 text-gray-800 rounded-full flex items-center justify-center hover:bg-white transition-all shadow-lg opacity-0 group-hover:opacity-100">
                          <FaChevronRight />
                        </button>
                      </>
                    )}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                      {galleryImages.map((_, idx) => (
                        <button key={idx} onClick={() => setActiveGalleryIdx(idx)}
                          className={`w-2 h-2 rounded-full transition-all ${idx === activeGalleryIdx ? 'bg-[#FBBF24] w-6' : 'bg-white/60 hover:bg-white'}`} />
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 mt-4">
                    {galleryImages.map((img, idx) => (
                      <button key={idx} onClick={() => setActiveGalleryIdx(idx)}
                        className={`rounded-lg overflow-hidden border-2 transition-all ${idx === activeGalleryIdx ? 'border-[#FBBF24] ring-2 ring-[#FBBF24]/30' : 'border-transparent hover:border-gray-300'}`}>
                        <img src={getImageUrl(img)} alt={`Thumb ${idx + 1}`} className="w-full h-16 sm:h-20 object-cover" />
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Features Section */}
              {project.features?.length > 0 && (
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                  <SectionTitle title="Key Features" subtitle="What makes this project stand out" />
                  <div className="grid sm:grid-cols-2 gap-4">
                    {project.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start space-x-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                        <FaCheckCircle className="text-[#FBBF24] mt-1 flex-shrink-0" />
                        <span className="text-gray-700 text-sm md:text-base">{feature}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Challenges & Solutions */}
              {project.challenges?.length > 0 && project.challenges.some(c => c.title || c.solution) && (
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                  <SectionTitle title="Challenges & Solutions" subtitle="How we overcame obstacles" />
                  <div className="space-y-6">
                    {project.challenges.filter(c => c.title || c.solution).map((item, idx) => (
                      <div key={idx} className="relative pl-8 border-l-2 border-[#FBBF24]/30">
                        <div className="absolute -left-[9px] top-0 w-4 h-4 bg-[#FBBF24] rounded-full" />
                        <h4 className="font-bold text-[#111111] mb-2">⚡ {item.title}</h4>
                        {item.solution && <p className="text-gray-600 text-sm">✅ {item.solution}</p>}
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Construction Process Timeline */}
              {project.process?.length > 0 && project.process.some(p => p.step || p.title) && (
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                  <SectionTitle title="Construction Process" subtitle="Step by step breakdown" />
                  <div className="relative">
                    <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#FBBF24] to-[#FBBF24]/20 hidden md:block" />
                    <div className="space-y-8">
                      {project.process.filter(p => p.step || p.title).map((item, idx) => (
                        <motion.div key={idx}
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: idx * 0.1 }}
                          className="relative pl-0 md:pl-20">
                          <div className="hidden md:flex absolute left-4 top-0 w-8 h-8 bg-[#FBBF24] text-[#111111] rounded-full items-center justify-center font-bold text-sm">
                            {item.step || (idx + 1).toString().padStart(2, '0')}
                          </div>
                          <div className="bg-gray-50 p-5 md:p-6 rounded-xl hover:shadow-md transition-shadow">
                            <div className="flex md:hidden items-center gap-3 mb-2">
                              <span className="w-8 h-8 bg-[#FBBF24] text-[#111111] rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                                {item.step || (idx + 1).toString().padStart(2, '0')}
                              </span>
                              <h4 className="font-bold text-[#111111]">{item.title}</h4>
                            </div>
                            <h4 className="font-bold text-[#111111] mb-2 hidden md:block">{item.title}</h4>
                            {item.description && <p className="text-gray-600 text-sm">{item.description}</p>}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Embedded Video */}
              {project.videoUrl && (
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                  <SectionTitle title="Project Video" subtitle="Watch the project in action" />
                  <div className="relative rounded-2xl overflow-hidden bg-black aspect-video">
                    <iframe
                      src={getEmbedUrl(project.videoUrl)}
                      title="Project Video"
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                </motion.div>
              )}

              {/* Technologies Used */}
              {project.technologies?.length > 0 && (
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                  <SectionTitle title="Technologies Used" subtitle="Materials and methods employed" />
                  <div className="flex flex-wrap gap-3">
                    {project.technologies.map((tech, idx) => (
                      <span key={idx} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl text-sm font-medium border border-gray-200 hover:bg-[#FBBF24]/10 hover:border-[#FBBF24]/30 transition-all">
                        <FaCogs className="inline mr-1.5 text-[#FBBF24]" />
                        {tech}
                      </span>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Right Column - Sidebar */}
            <div className="space-y-6">

              {/* Project Details Card */}
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                className="bg-gray-50 rounded-2xl p-6 sticky top-24">
                <h3 className="text-xl font-bold text-[#111111] mb-6 flex items-center gap-2">
                  <FaBuilding className="text-[#FBBF24]" /> Project Details
                </h3>
                <div className="space-y-5">
                  {project.client && (
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-[#FBBF24]/10 rounded-lg flex items-center justify-center">
                        <FaUser className="text-[#FBBF24]" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Client</p>
                        <p className="font-semibold text-[#111111] text-sm">{project.client}</p>
                      </div>
                    </div>
                  )}
                  {project.category && (
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-[#FBBF24]/10 rounded-lg flex items-center justify-center">
                        <FaTools className="text-[#FBBF24]" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Category</p>
                        <p className="font-semibold text-[#111111] text-sm">{project.category}</p>
                      </div>
                    </div>
                  )}
                  {project.location && (
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-[#FBBF24]/10 rounded-lg flex items-center justify-center">
                        <FaMapMarkerAlt className="text-[#FBBF24]" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Location</p>
                        <p className="font-semibold text-[#111111] text-sm">{project.location}</p>
                      </div>
                    </div>
                  )}
                  {project.status && (
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-[#FBBF24]/10 rounded-lg flex items-center justify-center">
                        <FaHardHat className="text-[#FBBF24]" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Status</p>
                        <p className={`font-semibold text-sm ${
                          project.status === 'Completed' ? 'text-green-600' :
                          project.status === 'Ongoing' ? 'text-blue-600' : 'text-gray-600'
                        }`}>{project.status}</p>
                      </div>
                    </div>
                  )}
                  {project.budget && (
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-[#FBBF24]/10 rounded-lg flex items-center justify-center">
                        <span className="text-[#FBBF24] font-medium">₹</span>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Budget</p>
                        <p className="font-semibold text-[#111111] text-sm">{project.budget}</p>
                      </div>
                    </div>
                  )}
                  {project.startDate && (
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-[#FBBF24]/10 rounded-lg flex items-center justify-center">
                        <FaCalendar className="text-[#FBBF24]" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Start Date</p>
                        <p className="font-semibold text-[#111111] text-sm">{new Date(project.startDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                      </div>
                    </div>
                  )}
                  {project.completionDate && (
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-[#FBBF24]/10 rounded-lg flex items-center justify-center">
                        <FaCheckCircle className="text-[#FBBF24]" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Completion</p>
                        <p className="font-semibold text-[#111111] text-sm">{new Date(project.completionDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h4 className="font-semibold text-[#111111] mb-3 flex items-center gap-2"><FaUsers className="text-[#FBBF24]" /> Team Members</h4>
                  {project.teamMembers?.length > 0 ? (
                    <div className="space-y-2">
                      {project.teamMembers.map((member, idx) => (
                        <div key={idx} className="flex items-center gap-3 text-sm">
                          <div className="w-8 h-8 bg-[#FBBF24]/20 rounded-full flex items-center justify-center">
                            <span className="text-xs font-bold text-[#FBBF24]">{member.name?.charAt(0)}</span>
                          </div>
                          <div>
                            <p className="font-medium text-[#111111]">{member.name}</p>
                            {member.role && <p className="text-xs text-gray-500">{member.role}</p>}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-400">No team members listed</p>
                  )}
                </div>
              </motion.div>

              {/* Testimonial */}
              {project.testimonial?.text && (
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                  className="bg-gradient-to-br from-[#FBBF24]/5 to-[#FBBF24]/10 border border-[#FBBF24]/20 rounded-2xl p-6">
                  <FaQuoteLeft className="text-[#FBBF24] text-2xl mb-3" />
                  <p className="text-gray-700 italic leading-relaxed text-sm mb-4">"{project.testimonial.text}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#FBBF24] text-[#111111] rounded-full flex items-center justify-center font-bold">
                      {project.testimonial.author?.charAt(0) || 'C'}
                    </div>
                    <div>
                      <p className="font-semibold text-[#111111] text-sm">{project.testimonial.author || 'Client'}</p>
                      {project.testimonial.role && <p className="text-xs text-gray-500">{project.testimonial.role}</p>}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Share Buttons */}
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                className="bg-gray-50 rounded-2xl p-6">
                <h4 className="font-semibold text-[#111111] mb-4 flex items-center gap-2">
                  <FaShareAlt className="text-[#FBBF24]" /> Share This Project
                </h4>
                <div className="flex flex-wrap gap-2">
                  <button onClick={() => handleShare('facebook')} className="flex-1 min-w-[60px] flex items-center justify-center gap-2 px-3 py-2.5 bg-[#1877F2] text-white rounded-xl text-xs font-medium hover:bg-[#166fe5] transition-all">
                    <FaFacebook /> Facebook
                  </button>
                  <button onClick={() => handleShare('twitter')} className="flex-1 min-w-[60px] flex items-center justify-center gap-2 px-3 py-2.5 bg-[#000000] text-white rounded-xl text-xs font-medium hover:bg-gray-800 transition-all">
                    <FaTwitter /> Twitter
                  </button>
                  <button onClick={() => handleShare('linkedin')} className="flex-1 min-w-[60px] flex items-center justify-center gap-2 px-3 py-2.5 bg-[#0A66C2] text-white rounded-xl text-xs font-medium hover:bg-[#0959a8] transition-all">
                    <FaLinkedin /> LinkedIn
                  </button>
                  <button onClick={() => handleShare('whatsapp')} className="flex-1 min-w-[60px] flex items-center justify-center gap-2 px-3 py-2.5 bg-[#25D366] text-white rounded-xl text-xs font-medium hover:bg-[#20bd59] transition-all">
                    <FaWhatsapp /> WhatsApp
                  </button>
                  <button onClick={copyToClipboard} className="flex-1 min-w-[60px] flex items-center justify-center gap-2 px-3 py-2.5 bg-gray-200 text-gray-700 rounded-xl text-xs font-medium hover:bg-gray-300 transition-all">
                    <FaClipboard /> {copied ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              </motion.div>

              {/* CTA Section */}
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                className="bg-gradient-to-br from-[#111111] to-gray-800 rounded-2xl p-6 text-center">
                <h3 className="font-bold text-white mb-2">Interested in Similar Work?</h3>
                <p className="text-gray-400 text-sm mb-4">Get a free quote for your project today.</p>
                <Link to="/quote" className="inline-flex items-center space-x-2 bg-[#FBBF24] text-[#111111] px-6 py-3 rounded-xl font-semibold hover:bg-[#D97706] transition-all w-full justify-center">
                  <span>Get Free Quote</span>
                  <FaArrowRight className="text-sm" />
                </Link>
                <a href="tel:+1234567890" className="inline-flex items-center justify-center space-x-2 mt-3 text-gray-400 hover:text-white text-sm transition-colors w-full">
                  <FaPhone className="text-[#FBBF24]" />
                  <span>Call us for inquiry</span>
                </a>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ RELATED PROJECTS ============ */}
      {relatedProjects.length > 0 && (
        <section className="section-padding bg-gray-50">
          <div className="container-custom">
            <SectionTitle 
              title="Related Projects" 
              subtitle="Explore more projects in similar categories"
              centered
            />
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
              {relatedProjects.map((relProject, idx) => (
                <ProjectCard key={relProject.id} project={relProject} index={idx} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ============ LIGHTBOX ============ */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 z-[100] flex items-center justify-center"
            onClick={() => setLightboxOpen(false)}>
            <button onClick={() => setLightboxOpen(false)}
              className="absolute top-4 right-4 text-white/80 hover:text-white z-10 p-2">
              <FaTimes className="text-2xl" />
            </button>
            <div className="relative max-w-5xl mx-auto px-4" onClick={e => e.stopPropagation()}>
              <img
                src={getImageUrl(galleryImages[lightboxIdx])}
                alt={`${project.title} lightbox`}
                className="max-h-[85vh] w-auto mx-auto object-contain rounded-lg"
              />
              {galleryImages.length > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <button onClick={() => setLightboxIdx(prev => prev === 0 ? galleryImages.length - 1 : prev - 1)}
                    className="text-white/80 hover:text-white p-2">
                    <FaChevronLeft className="text-2xl" />
                  </button>
                  <span className="text-white/60 text-sm">{lightboxIdx + 1} / {galleryImages.length}</span>
                  <button onClick={() => setLightboxIdx(prev => prev === galleryImages.length - 1 ? 0 : prev + 1)}
                    className="text-white/80 hover:text-white p-2">
                    <FaChevronRight className="text-2xl" />
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
};

export default ProjectDetailPage;