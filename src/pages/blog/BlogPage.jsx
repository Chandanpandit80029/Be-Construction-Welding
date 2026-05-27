import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaCalendar, FaUser, FaArrowRight, FaSearch, FaFolderOpen, FaTags, FaChevronRight } from 'react-icons/fa';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import SectionTitle from '../../components/ui/SectionTitle';
import { SEOMeta, BreadcrumbSchema } from '../../contexts/SEOContext';
import { useRealtimeCollection } from '../../hooks/useFirestore';
import { getImageUrl } from '../../utils/image';

const BlogPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  const { data: posts, loading } = useRealtimeCollection('blogPosts', {
    orderBy: 'createdAt',
    orderDirection: 'desc',
  });

  const categories = ['all', ...new Set((posts || []).map(p => p.category).filter(Boolean))];

  const filteredPosts = (posts || []).filter(post => {
    const matchesSearch = !searchQuery || 
      post.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-white">
      <SEOMeta 
        title="Blog"
        description="Latest construction, welding, and industry insights from BE Construction & Welding Works"
        keywords="construction blog, welding tips, industry insights, BE Construction blog"
      />
      <BreadcrumbSchema items={[{ name: 'Home', path: '/' }, { name: 'Blog', path: '/blog' }]} />
      <Header />

      {/* Hero */}
      <section className="relative pt-32 pb-20 bg-[#111111] overflow-hidden">
        <div className="absolute inset-0 pattern-grid opacity-10" />
        <div className="container-custom relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-block px-4 py-2 bg-[#FBBF24]/10 border border-[#FBBF24]/30 rounded-full text-[#FBBF24] text-sm font-semibold mb-4">
              OUR BLOG
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">Latest Insights</h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">Industry updates, project stories, and expert tips from our team.</p>
          </motion.div>
        </div>
      </section>

      {/* Search & Filter */}
      <section className="py-8 bg-gray-50 border-b">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-96">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search articles..."
                className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:border-[#FBBF24] focus:outline-none transition-all text-[#111111]"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    selectedCategory === cat
                      ? 'bg-[#FBBF24] text-[#111111]'
                      : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  {cat === 'all' ? 'All Posts' : cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Blog Posts */}
      <section className="section-padding">
        <div className="container-custom">
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1,2,3,4,5,6].map(i => (
                <div key={i} className="space-y-4">
                  <div className="h-52 skeleton rounded-2xl" />
                  <div className="h-6 w-3/4 skeleton" />
                  <div className="h-4 w-full skeleton" />
                  <div className="h-4 w-2/3 skeleton" />
                </div>
              ))}
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-2xl font-bold text-[#111111] mb-2">No Posts Found</h3>
              <p className="text-gray-500">No blog posts match your search criteria.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post, index) => (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all group border border-gray-100"
                >
                  <Link to={`/blog/${post.slug}`} className="block">
                    <div className="relative overflow-hidden h-52">
                      <img
                        src={getImageUrl(post.image) || 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=600&h=400&fit=crop'}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      {post.category && (
                        <span className="absolute top-4 left-4 px-3 py-1 bg-[#FBBF24] text-[#111111] text-xs font-semibold rounded-lg">
                          {post.category}
                        </span>
                      )}
                    </div>
                    <div className="p-6">
                      <div className="flex items-center space-x-4 text-xs text-gray-500 mb-3">
                        {post.date && <span className="flex items-center"><FaCalendar className="mr-1" />{post.date}</span>}
                        {post.author && <span className="flex items-center"><FaUser className="mr-1" />{post.author}</span>}
                      </div>
                      <h3 className="text-lg font-bold text-[#111111] mb-2 line-clamp-2 group-hover:text-[#D97706] transition-colors">
                        {post.title}
                      </h3>
                      <p className="text-gray-500 text-sm line-clamp-3">{post.excerpt || post.content?.substring(0, 150)}</p>
                      <div className="mt-4 flex items-center space-x-1 text-[#FBBF24] font-semibold text-sm group/link">
                        <span>Read More</span>
                        <FaArrowRight className="text-xs group-hover/link:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </Link>
                </motion.article>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default BlogPage;