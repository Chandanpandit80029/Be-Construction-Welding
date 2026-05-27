import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaSearch, FaArrowRight, FaMapMarkerAlt, FaCalendar, FaHardHat } from 'react-icons/fa';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import SectionTitle from '../../components/ui/SectionTitle';
import ProjectCard from '../../components/ui/ProjectCard';
import { SEOMeta, BreadcrumbSchema } from '../../contexts/SEOContext';
import { useRealtimeCollection } from '../../hooks/useFirestore';

const ProjectsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const { data: projectsData, loading } = useRealtimeCollection('projects', { orderBy: 'createdAt', orderDirection: 'desc' });

  const categories = ['all', ...new Set((projectsData || []).map(p => p.category).filter(Boolean))];
  
  const filteredProjects = (projectsData || []).filter(project => {
    const matchesSearch = !searchQuery || 
      project.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (project.shortDescription || project.description || '')?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'all' || project.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-white">
      <SEOMeta 
        title="Our Projects"
        description="Explore our portfolio of construction, welding, and fabrication projects completed by BE Construction & Welding Works"
        keywords="construction projects, welding projects, steel fabrication projects, BE Construction portfolio"
      />
      <BreadcrumbSchema items={[{ name: 'Home', path: '/' }, { name: 'Projects', path: '/projects' }]} />
      <Header />

      {/* Hero */}
      <section className="relative pt-32 pb-20 bg-[#111111] overflow-hidden">
        <div className="absolute inset-0 pattern-grid opacity-10" />
        <div className="container-custom relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-block px-4 py-2 bg-[#FBBF24]/10 border border-[#FBBF24]/30 rounded-full text-[#FBBF24] text-sm font-semibold mb-4">OUR PORTFOLIO</span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">Our Projects</h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">Discover our work across industrial, residential, and commercial sectors.</p>
          </motion.div>
        </div>
      </section>

      {/* Search & Filter */}
      <section className="py-8 bg-gray-50 border-b">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-96">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search projects..." className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:border-[#FBBF24] focus:outline-none transition-all text-[#111111]" />
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map(cat => (
                <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeCategory === cat ? 'bg-[#FBBF24] text-[#111111]' : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'}`}>
                  {cat === 'all' ? 'All Projects' : cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="section-padding">
        <div className="container-custom">
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1,2,3,4,5,6].map(i => <div key={i} className="space-y-4"><div className="h-52 skeleton rounded-2xl" /><div className="h-6 w-3/4 skeleton" /><div className="h-4 w-full skeleton" /></div>)}
            </div>
          ) : filteredProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProjects.map((project, index) => (
                <ProjectCard key={project.id} project={project} index={index} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <FaHardHat className="text-6xl text-gray-200 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-[#111111] mb-2">No Projects Found</h3>
              <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ProjectsPage;