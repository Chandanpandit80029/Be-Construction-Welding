import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaCalendar, FaUser, FaArrowRight, FaFacebookF, FaTwitter, FaLinkedinIn, FaWhatsapp } from 'react-icons/fa';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import { SEOMeta, BreadcrumbSchema } from '../../contexts/SEOContext';
import { useRealtimeCollection } from '../../hooks/useFirestore';
import { getImageUrl } from '../../utils/image';

const BlogPostPage = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  const { data: allPosts } = useRealtimeCollection('blogPosts', { orderBy: 'createdAt', orderDirection: 'desc' });

  useEffect(() => {
    setLoading(true);
    import('../../hooks/useFirestore').then(({ getDocuments }) => {
      getDocuments('blogPosts', { where: { field: 'slug', operator: '==', value: slug } })
        .then(res => {
          if (res.success && res.data.length > 0) setPost(res.data[0]);
          setLoading(false);
        });
    });
  }, [slug]);

  const relatedPosts = (allPosts || []).filter(p => p.id !== post?.id && p.category === post?.category).slice(0, 3);
  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

  if (loading) {
    return (
      <div className="min-h-screen bg-white"><Header />
        <div className="pt-32 container-custom max-w-3xl mx-auto space-y-4">
          <div className="h-6 w-24 skeleton" /><div className="h-72 skeleton rounded-2xl" />
          <div className="h-8 w-3/4 skeleton" /><div className="h-4 w-full skeleton" /><div className="h-4 w-5/6 skeleton" />
        </div>
      <Footer /></div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-white"><Header />
        <div className="pt-32 container-custom text-center">
          <div className="text-6xl mb-4">📄</div>
          <h1 className="text-3xl font-bold mb-4">Post Not Found</h1>
          <Link to="/blog" className="inline-flex items-center space-x-2 bg-[#FBBF24] text-[#111111] px-6 py-3 rounded-xl font-semibold"><FaArrowLeft /><span>Back to Blog</span></Link>
        </div>
      <Footer /></div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <SEOMeta title={post.title} description={post.excerpt || post.content?.substring(0, 160)} keywords={`${post.title}, ${post.category || ''}, construction blog`} canonical={`/blog/${slug}`} />
      <BreadcrumbSchema items={[{ name: 'Home', path: '/' }, { name: 'Blog', path: '/blog' }, { name: post.title, path: `/blog/${slug}` }]} />
      <Header />

      <article className="pt-32 pb-16">
        <div className="container-custom max-w-3xl mx-auto">
          <Link to="/blog" className="inline-flex items-center space-x-2 text-[#FBBF24] hover:text-[#D97706] mb-8 group">
            <FaArrowLeft className="text-sm group-hover:-translate-x-1 transition-transform" /><span>Back to Blog</span>
          </Link>
          {post.category && (
            <span className="inline-block px-3 py-1 bg-[#FBBF24]/10 text-[#FBBF24] text-xs font-semibold rounded-lg mb-4">{post.category}</span>
          )}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#111111] mb-4">{post.title}</h1>
          <div className="flex items-center space-x-4 text-sm text-gray-500 mb-8">
            {post.date && <span className="flex items-center"><FaCalendar className="mr-2" />{post.date}</span>}
            {post.author && <span className="flex items-center"><FaUser className="mr-2" />{post.author}</span>}
          </div>
          <img src={getImageUrl(post.image) || 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=1200&h=600&fit=crop'} alt={post.title} className="w-full h-72 md:h-96 object-cover rounded-2xl mb-10" />
          
          <div className="prose max-w-none text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: post.content || '' }} />
          
          {/* Share */}
          <div className="mt-12 pt-8 border-t flex items-center space-x-4">
            <span className="font-semibold text-[#111111]">Share:</span>
            {[
              { icon: FaFacebookF, url: `https://facebook.com/sharer.php?u=${shareUrl}`, color: 'hover:bg-[#1877F2]' },
              { icon: FaTwitter, url: `https://twitter.com/intent/tweet?url=${shareUrl}`, color: 'hover:bg-[#1DA1F2]' },
              { icon: FaLinkedinIn, url: `https://linkedin.com/sharing/share-offsite/?url=${shareUrl}`, color: 'hover:bg-[#0A66C2]' },
              { icon: FaWhatsapp, url: `https://wa.me/?text=${shareUrl}`, color: 'hover:bg-[#25D366]' },
            ].map((s, i) => (
              <a key={i} href={s.url} target="_blank" rel="noopener noreferrer" className={`w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-gray-600 ${s.color} hover:text-white transition-all`}>
                <s.icon className="text-sm" />
              </a>
            ))}
          </div>
        </div>
      </article>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="pb-16">
          <div className="container-custom">
            <h2 className="text-2xl font-bold text-[#111111] mb-8">Related Posts</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {relatedPosts.map(rp => (
                <Link key={rp.id} to={`/blog/${rp.slug}`} className="bg-white rounded-xl overflow-hidden shadow hover:shadow-lg transition-all group border">
                  <img src={getImageUrl(rp.image) || 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=400&h=250&fit=crop'} alt={rp.title} className="h-40 w-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="p-4">
                    <h3 className="font-bold text-[#111111] text-sm line-clamp-2 group-hover:text-[#D97706] transition-colors">{rp.title}</h3>
                    <p className="text-xs text-gray-500 mt-1">{rp.date}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
};

export default BlogPostPage;