import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronDown, FaSearch, FaQuestionCircle } from 'react-icons/fa';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import SectionTitle from '../../components/ui/SectionTitle';
import { SEOMeta, BreadcrumbSchema } from '../../contexts/SEOContext';
import { useRealtimeCollection } from '../../hooks/useFirestore';
import { faqs as staticFaqs } from '../../constants';

const FAQPage = () => {
  const [openId, setOpenId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const { data: faqData } = useRealtimeCollection('FAQs', { orderBy: 'createdAt' });
  const faqs = (faqData?.length > 0 ? faqData : staticFaqs);

  const filteredFaqs = faqs.filter(faq =>
    !searchQuery || faq.question?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleFaq = (id) => setOpenId(openId === id ? null : id);

  return (
    <div className="min-h-screen bg-white">
      <SEOMeta title="FAQs" description="Frequently asked questions about BE Construction & Welding Works services" />
      <BreadcrumbSchema items={[{ name: 'Home', path: '/' }, { name: 'FAQs', path: '/faqs' }]} />
      <Header />

      <section className="pt-32 pb-20">
        <div className="container-custom max-w-3xl mx-auto">
          <SectionTitle subtitle="FAQs" title="Frequently Asked Questions" description="Find answers to common questions about our services, process, and policies." />
          
          <div className="relative mb-10">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search FAQs..."
              className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:border-[#FBBF24] focus:outline-none transition-all"
            />
          </div>

          <div className="space-y-3">
            {filteredFaqs.map((faq) => (
              <motion.div
                key={faq.id || faq.question}
                className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:border-[#FBBF24]/30 transition-all"
              >
                <button
                  onClick={() => toggleFaq(faq.id || faq.question)}
                  className="w-full flex items-center justify-between p-5 text-left"
                >
                  <span className="font-semibold text-[#111111] pr-4">{faq.question}</span>
                  <FaChevronDown className={`text-[#FBBF24] transition-transform flex-shrink-0 ${openId === (faq.id || faq.question) ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {openId === (faq.id || faq.question) && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <p className="px-5 pb-5 text-gray-600 leading-relaxed">{faq.answer}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
          {filteredFaqs.length === 0 && (
            <div className="text-center py-12">
              <FaQuestionCircle className="text-5xl text-gray-200 mx-auto mb-4" />
              <p className="text-gray-500">No FAQs match your search.</p>
            </div>
          )}
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default FAQPage;