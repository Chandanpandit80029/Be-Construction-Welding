import React, { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FaCheckCircle, FaArrowRight, FaPhone, FaAward, FaShieldAlt,
  FaUsers, FaHardHat, FaBuilding, FaStar, FaBullseye, FaEye
} from 'react-icons/fa';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import SectionTitle from '../../components/ui/SectionTitle';
import { SEOMeta, BreadcrumbSchema } from '../../contexts/SEOContext';
import { useRealtimeCollection } from '../../hooks/useFirestore';
import { companyInfo, statistics } from '../../constants';
import { getImageUrl } from '../../utils/image';

const AboutPage = () => {
  const [counters, setCounters] = useState({});
  const statsRef = useRef(null);
  const { data: teamData } = useRealtimeCollection('teamMembers', { orderBy: 'createdAt' });
  const { data: testimonialsData } = useRealtimeCollection('testimonials', { orderBy: 'createdAt', orderDirection: 'desc' });

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          statistics.forEach((stat, index) => {
            setTimeout(() => {
              let current = 0;
              const step = Math.ceil(stat.value / 40);
              const interval = setInterval(() => {
                current += step;
                if (current >= stat.value) { current = stat.value; clearInterval(interval); }
                setCounters(prev => ({ ...prev, [stat.id]: current }));
              }, 30);
            }, index * 200);
          });
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  const displayTeam = teamData?.slice(0, 4) || [];
  const displayTestimonials = testimonialsData?.slice(0, 2) || [];

  const timeline = [
    { year: '2008', title: 'Company Founded', desc: 'BE Construction & Welding Works was established with a vision to deliver quality construction services.' },
    { year: '2012', title: 'Expanded Operations', desc: 'Expanded team and equipment to handle larger industrial projects.' },
    { year: '2015', title: '500+ Projects Milestone', desc: 'Completed over 500 successful projects across residential and industrial sectors.' },
    { year: '2018', title: 'Modernization', desc: 'Invested in advanced welding and fabrication equipment for precision work.' },
    { year: '2020', title: 'Digital Transformation', desc: 'Launched digital platform for better client communication and project management.' },
    { year: '2024+', title: 'Future Growth', desc: 'Continuing to expand services and reach new markets with innovative solutions.' },
  ];

  return (
    <div className="min-h-screen bg-white">
      <SEOMeta 
        title="About Us"
        description={`Learn about ${companyInfo.name} - ${companyInfo.description}`}
        keywords="about BE Construction, welding company, construction company India"
      />
      <BreadcrumbSchema items={[{ name: 'Home', path: '/' }, { name: 'About', path: '/about' }]} />
      <Header />

      {/* Hero */}
      <section className="relative pt-32 pb-20 bg-[#111111] overflow-hidden">
        <div className="absolute inset-0 pattern-grid opacity-10" />
        <div className="container-custom relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-block px-4 py-2 bg-[#FBBF24]/10 border border-[#FBBF24]/30 rounded-full text-[#FBBF24] text-sm font-semibold mb-4">ABOUT US</span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">Building Dreams Since 2008</h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">{companyInfo.description}</p>
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-8">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="p-8 bg-gray-50 rounded-2xl border-l-4 border-[#FBBF24]">
              <FaBullseye className="text-[#FBBF24] text-3xl mb-4" />
              <h3 className="text-2xl font-bold text-[#111111] mb-3">Our Mission</h3>
              <p className="text-gray-600">To provide exceptional construction and welding services that exceed client expectations, delivered with integrity, safety, and precision.</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="p-8 bg-gray-50 rounded-2xl border-l-4 border-[#FBBF24]">
              <FaEye className="text-[#FBBF24] text-3xl mb-4" />
              <h3 className="text-2xl font-bold text-[#111111] mb-3">Our Vision</h3>
              <p className="text-gray-600">To be India's most trusted construction and welding partner, known for innovation, quality, and customer satisfaction.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <SectionTitle subtitle="Our Journey" title="Company Timeline" description="From our founding in 2008 to becoming a trusted industry leader." />
          <div className="relative">
            <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-linear-to-b from-[#FBBF24] to-transparent" />
            {timeline.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: idx % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className={`relative flex items-center mb-12 ${idx % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
              >
                <div className={`flex-1 ${idx % 2 === 0 ? 'md:text-right md:pr-12' : 'md:text-left md:pl-12'}`}>
                  <div className={`p-6 bg-white rounded-2xl shadow-lg border border-gray-100 ${idx % 2 === 0 ? 'md:mr-8' : 'md:ml-8'}`}>
                    <span className="text-[#FBBF24] font-black text-xl">{item.year}</span>
                    <h3 className="text-lg font-bold text-[#111111] mt-1">{item.title}</h3>
                    <p className="text-gray-500 text-sm mt-2">{item.desc}</p>
                  </div>
                </div>
                <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 w-8 h-8 bg-[#FBBF24] rounded-full items-center justify-center z-10 shadow-lg shadow-[#FBBF24]/30">
                  <div className="w-3 h-3 bg-white rounded-full" />
                </div>
                <div className="flex-1 hidden md:block" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section ref={statsRef} className="py-20 bg-[#111111] relative">
        <div className="absolute inset-0 pattern-grid opacity-10" />
        <div className="container-custom relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {statistics.map((stat, index) => (
              <motion.div key={stat.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} className="text-center">
                <div className="text-5xl md:text-6xl font-black text-[#FBBF24] mb-2">{counters[stat.id] || 0}{stat.suffix}</div>
                <p className="text-gray-300 text-lg font-medium">{stat.label}</p>
                <div className="w-12 h-0.5 bg-[#FBBF24]/50 mx-auto mt-3" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      {displayTeam.length > 0 && (
        <section className="section-padding">
          <div className="container-custom">
            <SectionTitle subtitle="Our Team" title="Meet Our Experts" description="Skilled professionals dedicated to excellence." />
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {displayTeam.map((member, idx) => (
                <motion.div key={member.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.1 }} className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all group">
                  <div className="h-64 overflow-hidden">
                    <img src={getImageUrl(member.image) || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop'} alt={member.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="p-5 text-center">
                    <h3 className="font-bold text-[#111111] text-lg">{member.name}</h3>
                    <p className="text-[#FBBF24] font-medium text-sm">{member.role}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-16 bg-[#111111]">
        <div className="container-custom text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Want to Work With Us?</h2>
          <p className="text-gray-300 mb-8 max-w-lg mx-auto">Let's discuss your project and find the best solution together.</p>
          <Link to="/contact" className="inline-flex items-center space-x-2 bg-[#FBBF24] text-[#111111] px-8 py-4 rounded-xl font-bold hover:bg-[#D97706] transition-all">
            <span>Get in Touch</span><FaArrowRight className="text-sm" />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AboutPage;