import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaSearch, FaTimes, FaExpand, FaVideo, FaImage } from 'react-icons/fa';
import { PhotoProvider, PhotoView } from 'react-photo-view';
import 'react-photo-view/dist/react-photo-view.css';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import SectionTitle from '../../components/ui/SectionTitle';
import { SEOMeta, BreadcrumbSchema } from '../../contexts/SEOContext';
import { useRealtimeCollection } from '../../hooks/useFirestore';

const GalleryPage = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedMedia, setSelectedMedia] = useState(null);
  const { data: galleryData, loading } = useRealtimeCollection('gallery', { orderBy: 'createdAt', orderDirection: 'desc' });

  const categories = ['all', ...new Set((galleryData || []).map(g => g.category).filter(Boolean))];
  const filteredMedia = galleryData?.filter(m => activeCategory === 'all' || m.category === activeCategory) || [];

  return (
    <div className="min-h-screen bg-white">
      <SEOMeta title="Gallery" description="Photo and video gallery of construction, welding, and fabrication projects by BE Construction & Welding Works" keywords="construction gallery, welding photos, project gallery, BE Construction" />
      <BreadcrumbSchema items={[{ name: 'Home', path: '/' }, { name: 'Gallery', path: '/gallery' }]} />
      <Header />

      <section className="relative pt-32 pb-20 bg-[#111111] overflow-hidden">
        <div className="absolute inset-0 pattern-grid opacity-10" />
        <div className="container-custom relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-block px-4 py-2 bg-[#FBBF24]/10 border border-[#FBBF24]/30 rounded-full text-[#FBBF24] text-sm font-semibold mb-4">OUR GALLERY</span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">Gallery</h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">A visual journey of our projects, team, and craftsmanship.</p>
          </motion.div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 bg-gray-50 border-b">
        <div className="container-custom">
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map(cat => (
              <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${activeCategory === cat ? 'bg-[#FBBF24] text-[#111111]' : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'}`}>
                {cat === 'all' ? 'All Media' : cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="section-padding">
        <div className="container-custom">
          {loading ? (
            <div className="masonry-grid">
              {[1,2,3,4,5,6,7,8,9].map(i => <div key={i} className="masonry-item"><div className={`skeleton rounded-2xl ${i % 3 === 0 ? 'h-72' : 'h-52'}`} /></div>)}
            </div>
          ) : filteredMedia.length > 0 ? (
            <PhotoProvider bannerVisible={false} maskOpacity={0.95}>
              <div className="masonry-grid">
                {filteredMedia.map((media, idx) => (
                  <motion.div
                    key={media.id || idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="masonry-item"
                  >
                    <div className="relative group rounded-2xl overflow-hidden cursor-pointer">
                      {media.type === 'video' ? (
                        <PhotoView src={media.url}>
                          <div className="relative">
                            <img src={media.thumbnail || media.url} alt={media.title || 'Gallery'} className="w-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                              <div className="w-16 h-16 bg-[#FBBF24] rounded-full flex items-center justify-center">
                                <FaVideo className="text-[#111111] text-xl ml-1" />
                              </div>
                            </div>
                          </div>
                        </PhotoView>
                      ) : (
                        <PhotoView src={media.url}>
                          <img src={media.url} alt={media.title || 'Gallery image'} className="w-full object-cover group-hover:scale-105 transition-transform duration-500 cursor-pointer" loading="lazy" />
                        </PhotoView>
                      )}
                      <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                        {media.title && <p className="text-white font-semibold text-sm">{media.title}</p>}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </PhotoProvider>
          ) : (
            <div className="text-center py-20">
              <FaImage className="text-6xl text-gray-200 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-[#111111] mb-2">No Media Found</h3>
              <p className="text-gray-500">Gallery content will appear here when added from the admin dashboard.</p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default GalleryPage;