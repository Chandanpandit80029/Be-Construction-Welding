import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaSearch, FaArrowRight, FaHardHat, FaTools, FaNewspaper } from 'react-icons/fa';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import { SEOMeta } from '../../contexts/SEOContext';
import { useRealtimeCollection } from '../../hooks/useFirestore';

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState({ services: [], projects: [], blog: [] });
  const [loading, setLoading] = useState(true);

  const { data: services } = useRealtimeCollection('services');
  const { data: projects } = useRealtimeCollection('projects');
  const { data: blogPosts } = useRealtimeCollection('blogPosts');

  useEffect(() => {
    if (!query) { setLoading(false); return; }
    setLoading(true);
    const q = query.toLowerCase();
    
    setResults({
      services: (services || []).filter(s => 
        s.title?.toLowerCase().includes(q) || s.description?.toLowerCase().includes(q)
      ),
      projects: (projects || []).filter(p => 
        p.title?.toLowerCase().includes(q) || p.description?.toLowerCase().includes(q)
      ),
      blog: (blogPosts || []).filter(b => 
        b.title?.toLowerCase().includes(q) || b.content?.toLowerCase().includes(q)
      ),
    });
    setLoading(false);
  }, [query, services, projects, blogPosts]);

  const totalResults = results.services.length + results.projects.length + results.blog.length;

  return (
    <div className="min-h-screen bg-white">
      <SEOMeta title={`Search: ${query}`} description={`Search results for "${query}" on BE Construction & Welding Works`} />
      <Header />

      <section className="pt-32 pb-16">
        <div className="container-custom">
          <h1 className="text-3xl md:text-4xl font-bold text-[#111111] mb-2">Search Results</h1>
          <p className="text-gray-500 mb-8">Showing results for: <span className="font-semibold text-[#FBBF24]">"{query}"</span> ({totalResults} found)</p>

          {loading ? (
            <div className="space-y-4">{[1,2,3].map(i => <div key={i} className="h-24 skeleton rounded-xl" />)}</div>
          ) : totalResults === 0 ? (
            <div className="text-center py-20">
              <FaSearch className="text-6xl text-gray-200 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-[#111111] mb-2">No Results Found</h2>
              <p className="text-gray-500">Try different keywords or browse our services.</p>
              <Link to="/services" className="inline-flex items-center space-x-2 mt-6 bg-[#FBBF24] text-[#111111] px-6 py-3 rounded-xl font-semibold">Browse Services</Link>
            </div>
          ) : (
            <div className="space-y-8">
              {results.services.length > 0 && (
                <div>
                  <h2 className="text-xl font-bold text-[#111111] mb-4 flex items-center"><FaHardHat className="mr-2 text-[#FBBF24]" />Services ({results.services.length})</h2>
                  <div className="space-y-3">
                    {results.services.map(s => (
                      <Link key={s.id} to={`/services/${s.slug}`} className="block p-4 bg-gray-50 rounded-xl hover:bg-[#FBBF24]/5 transition-all border border-transparent hover:border-[#FBBF24]/20 group">
                        <h3 className="font-semibold text-[#111111] group-hover:text-[#D97706]">{s.title}</h3>
                        <p className="text-sm text-gray-500">{s.description?.substring(0, 120)}</p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
              {results.projects.length > 0 && (
                <div>
                  <h2 className="text-xl font-bold text-[#111111] mb-4 flex items-center"><FaHardHat className="mr-2 text-[#FBBF24]" />Projects ({results.projects.length})</h2>
                  <div className="space-y-3">
                    {results.projects.map(p => (
                      <Link key={p.id} to={`/projects/${p.slug}`} className="block p-4 bg-gray-50 rounded-xl hover:bg-[#FBBF24]/5 transition-all border border-transparent hover:border-[#FBBF24]/20 group">
                        <h3 className="font-semibold text-[#111111] group-hover:text-[#D97706]">{p.title}</h3>
                        <p className="text-sm text-gray-500">{p.description?.substring(0, 120)}</p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
              {results.blog.length > 0 && (
                <div>
                  <h2 className="text-xl font-bold text-[#111111] mb-4 flex items-center"><FaNewspaper className="mr-2 text-[#FBBF24]" />Blog Posts ({results.blog.length})</h2>
                  <div className="space-y-3">
                    {results.blog.map(b => (
                      <Link key={b.id} to={`/blog/${b.slug}`} className="block p-4 bg-gray-50 rounded-xl hover:bg-[#FBBF24]/5 transition-all border border-transparent hover:border-[#FBBF24]/20 group">
                        <h3 className="font-semibold text-[#111111] group-hover:text-[#D97706]">{b.title}</h3>
                        <p className="text-sm text-gray-500">{b.excerpt || b.content?.substring(0, 120)}</p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default SearchPage;