import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaStar, FaQuoteRight, FaUser, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import SectionTitle from '../../components/ui/SectionTitle';
import TestimonialCard from '../../components/ui/TestimonialCard';
import { SEOMeta, BreadcrumbSchema } from '../../contexts/SEOContext';
import { useRealtimeCollection } from '../../hooks/useFirestore';
import { testimonials as fallbackTestimonials } from '../../constants';

const TestimonialsPage = () => {
  const { data: testimonialsData, loading } = useRealtimeCollection('testimonials', { orderBy: 'createdAt', orderDirection: 'desc' });
  const displayTestimonials = (testimonialsData?.length > 0 ? testimonialsData : fallbackTestimonials);

  return (
    <div className="min-h-screen bg-white">
      <SEOMeta title="Testimonials" description="Read what our clients say about BE Construction & Welding Works - 350+ satisfied clients" keywords="testimonials, client reviews, construction reviews, BE Construction" />
      <BreadcrumbSchema items={[{ name: 'Home', path: '/' }, { name: 'Testimonials', path: '/testimonials' }]} />
      <Header />

      <section className="relative pt-32 pb-20 bg-[#111111] overflow-hidden">
        <div className="absolute inset-0 pattern-grid opacity-10" />
        <div className="container-custom relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-block px-4 py-2 bg-[#FBBF24]/10 border border-[#FBBF24]/30 rounded-full text-[#FBBF24] text-sm font-semibold mb-4">CLIENT REVIEWS</span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">What Our Clients Say</h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">Hear from our 350+ satisfied clients about their experience working with us.</p>
          </motion.div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom">
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1,2,3,4,5,6].map(i => <div key={i} className="space-y-4"><div className="h-32 skeleton rounded-2xl" /><div className="h-6 w-1/2 skeleton" /></div>)}
            </div>
          ) : displayTestimonials.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {displayTestimonials.map((testimonial, index) => (
                <TestimonialCard key={testimonial.id || index} testimonial={testimonial} index={index} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <FaQuoteRight className="text-6xl text-gray-200 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-[#111111] mb-2">No Reviews Yet</h3>
              <p className="text-gray-500">Testimonials will appear here when added from the admin dashboard.</p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default TestimonialsPage;