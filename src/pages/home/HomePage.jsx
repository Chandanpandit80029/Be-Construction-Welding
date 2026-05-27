import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FaChevronRight, FaPlay, FaPhone, FaEnvelope, FaClock, 
  FaCheckCircle, FaArrowRight, FaStar, FaHardHat, FaBuilding,
  FaUsers, FaProjectDiagram, FaQuoteRight, FaShieldAlt,
  FaToolbox, FaAward, FaHammer, FaCogs, FaUserTie
} from 'react-icons/fa';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import HeroSlider from '../../components/home/HeroSlider';
import SectionTitle from '../../components/ui/SectionTitle';
import ServiceCard from '../../components/ui/ServiceCard';
import ProjectCard from '../../components/ui/ProjectCard';
import TestimonialCard from '../../components/ui/TestimonialCard';
import { SEOMeta, OrganizationSchema, LocalBusinessSchema } from '../../contexts/SEOContext';
import { useRealtimeCollection } from '../../hooks/useFirestore';
import { services, testimonials, statistics, companyInfo, navLinks } from '../../constants';
import { getImageUrl } from '../../utils/image';

const HomePage = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [counters, setCounters] = useState({});
  const statsRef = useRef(null);

  const { data: servicesData } = useRealtimeCollection('services', { orderBy: 'createdAt' });
  const { data: projectsData } = useRealtimeCollection('projects', { orderBy: 'createdAt', orderDirection: 'desc' });
  const { data: testimonialsData } = useRealtimeCollection('testimonials', { orderBy: 'createdAt', orderDirection: 'desc' });
  const { data: teamData } = useRealtimeCollection('teamMembers', { orderBy: 'createdAt' });
  const { data: settingsData } = useRealtimeCollection('websiteSettings', { orderBy: 'createdAt' });

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Animated counter effect
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          const displayStats = statistics;
          displayStats.forEach((stat, index) => {
            setTimeout(() => {
              animateCounter(stat.id, stat.value);
            }, index * 200);
          });
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const animateCounter = (id, target) => {
    let current = 0;
    const step = Math.ceil(target / 30);
    const interval = setInterval(() => {
      current += step;
      if (current >= target) {
        current = target;
        clearInterval(interval);
      }
      setCounters(prev => ({ ...prev, [id]: current }));
    }, 30);
  };

  const featuredProjects = (projectsData || []).slice(0, 3);
  const displayTestimonials = (testimonialsData || []).slice(0, 3);
  const displayTeam = (teamData || []).slice(0, 4);
  const displayServices = (servicesData && servicesData.length > 0 ? servicesData : services).slice(0, 6);
  const displayStats = settingsData?.[0]?.statistics || statistics;

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.5 },
  };

  const staggerChildren = {
    initial: { opacity: 0 },
    whileInView: { opacity: 1 },
    viewport: { once: true },
    transition: { staggerChildren: 0.08 },
  };

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <SEOMeta />
      <OrganizationSchema />
      <LocalBusinessSchema />
      <Header />

      {/* Hero Slider */}
      <HeroSlider />

      {/* Quick Contact Bar - Mobile optimized */}
      <section className="bg-white py-6 sm:py-8 border-b border-[#FBBF24]/20 shadow-sm relative z-10">
        <div className="container-custom">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
            <motion.a
              href={`tel:${companyInfo.phone}`}
              whileHover={{ scale: 1.02 }}
              className="flex items-center space-x-3 sm:space-x-4 p-3 sm:p-4 bg-gray-50 rounded-xl hover:bg-[#FBBF24]/5 transition-all border border-transparent hover:border-[#FBBF24]/20 group"
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#FBBF24]/10 rounded-xl flex items-center justify-center group-hover:bg-[#FBBF24] transition-all duration-300 flex-shrink-0">
                <FaPhone className="text-[#FBBF24] group-hover:text-white text-lg sm:text-xl transition-colors" />
              </div>
              <div className="min-w-0">
                <p className="text-gray-500 text-xs sm:text-sm">Call Us 24/7</p>
                <p className="text-[#111111] font-semibold text-sm sm:text-base truncate">{companyInfo.phone}</p>
              </div>
            </motion.a>
            <motion.a
              href={`mailto:${companyInfo.email}`}
              whileHover={{ scale: 1.02 }}
              className="flex items-center space-x-3 sm:space-x-4 p-3 sm:p-4 bg-gray-50 rounded-xl hover:bg-[#FBBF24]/5 transition-all border border-transparent hover:border-[#FBBF24]/20 group"
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#FBBF24]/10 rounded-xl flex items-center justify-center group-hover:bg-[#FBBF24] transition-all duration-300 flex-shrink-0">
                <FaEnvelope className="text-[#FBBF24] group-hover:text-white text-lg sm:text-xl transition-colors" />
              </div>
              <div className="min-w-0">
                <p className="text-gray-500 text-xs sm:text-sm">Email Us</p>
                <p className="text-[#111111] font-semibold text-sm sm:text-base truncate">{companyInfo.email}</p>
              </div>
            </motion.a>
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="sm:col-span-2 md:col-span-1 flex items-center space-x-3 sm:space-x-4 p-3 sm:p-4 bg-gray-50 rounded-xl hover:bg-[#FBBF24]/5 transition-all border border-transparent hover:border-[#FBBF24]/20 group"
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#FBBF24]/10 rounded-xl flex items-center justify-center group-hover:bg-[#FBBF24] transition-all duration-300 flex-shrink-0">
                <FaClock className="text-[#FBBF24] group-hover:text-white text-lg sm:text-xl transition-colors" />
              </div>
              <div>
                <p className="text-gray-500 text-xs sm:text-sm">Working Hours</p>
                <p className="text-[#111111] font-semibold text-sm sm:text-base">Mon - Sat: 8AM - 6PM</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* About Preview Section - Mobile optimized */}
      <section className="section-padding bg-white relative overflow-hidden">
        <div className="absolute inset-0 pattern-dots opacity-30" />
        <div className="container-custom relative z-10">
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <SectionTitle
                subtitle="About Us"
                title="Building Excellence Since 2008"
                description={companyInfo.description}
                centered={false}
              />
              <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                {[
                  "Licensed and insured contractors",
                  "Certified welding professionals",
                  "On-time project delivery guarantee",
                  "Competitive pricing with quality assurance",
                  "350+ satisfied clients across India",
                  "Advanced equipment and technology"
                ].map((item, idx) => (
                  <motion.div 
                    key={idx} 
                    className="flex items-center space-x-3"
                    initial={{ opacity: 0, x: -15 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.08 }}
                  >
                    <div className="w-5 h-5 sm:w-6 sm:h-6 bg-[#FBBF24]/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <FaCheckCircle className="text-[#FBBF24] text-xs" />
                    </div>
                    <span className="text-[#111111] text-sm sm:text-base">{item}</span>
                  </motion.div>
                ))}
              </div>
              <Link
                to="/about"
                className="group inline-flex items-center space-x-2 text-[#FBBF24] font-semibold hover:text-[#D97706] transition-colors text-sm sm:text-base"
              >
                <span>Learn More About Us</span>
                <FaArrowRight className="text-xs sm:text-sm group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="relative mt-8 sm:mt-0"
            >
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop"
                  alt="Construction worker"
                  className="w-full h-[250px] sm:h-[350px] md:h-[400px] object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              </div>
              {/* Experience Badge - Mobile adjusted */}
              <motion.div 
                className="absolute -bottom-4 sm:-bottom-6 left-2 sm:-left-6 w-28 h-28 sm:w-36 sm:h-36 bg-gradient-to-br from-[#FBBF24] to-[#D97706] rounded-2xl flex flex-col items-center justify-center text-[#111111] shadow-xl"
                whileHover={{ scale: 1.05 }}
              >
                <span className="text-2xl sm:text-4xl font-black">15+</span>
                <span className="text-[10px] sm:text-sm font-semibold text-center px-1">Years Experience</span>
              </motion.div>
              {/* Floating stat card - Mobile adjusted */}
              <motion.div 
                className="absolute -top-3 sm:-top-4 right-2 sm:-right-4 w-24 h-24 sm:w-28 sm:h-28 bg-white rounded-2xl shadow-xl flex flex-col items-center justify-center border border-gray-100"
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                <FaAward className="text-[#FBBF24] text-xl sm:text-2xl mb-1" />
                <span className="text-[#111111] font-bold text-base sm:text-lg">500+</span>
                <span className="text-gray-500 text-[10px] sm:text-xs">Projects</span>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Section - Mobile optimized */}
      <section className="section-padding bg-gray-50 relative overflow-hidden">
        <div className="absolute inset-0 pattern-hex opacity-10" />
        <div className="container-custom relative z-10">
          <SectionTitle
            subtitle="Our Services"
            title="What We Offer"
            description="We provide comprehensive construction and welding services tailored to meet your specific needs."
          />
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8"
            variants={staggerChildren}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
          >
            {displayServices.map((service, index) => (
              <ServiceCard key={service.id || index} service={service} index={index} />
            ))}
          </motion.div>
          <div className="text-center mt-8 sm:mt-12">
            <Link
              to="/services"
              className="group inline-flex items-center space-x-2 bg-[#FBBF24] text-[#111111] px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold text-sm sm:text-base hover:bg-[#D97706] transition-all duration-300 transform hover:scale-105 shadow-lg shadow-[#FBBF24]/25"
            >
              <span>View All Services</span>
              <FaArrowRight className="text-xs sm:text-sm group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section - Mobile optimized */}
      <section className="section-padding bg-white relative overflow-hidden">
        <div className="container-custom">
          <SectionTitle
            subtitle="Why Choose Us"
            title="Built on Trust & Quality"
            description="We combine years of experience with modern technology to deliver exceptional results."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mt-8 sm:mt-12">
            {[
              { icon: FaShieldAlt, title: 'Safety First', desc: 'Strict safety protocols and trained professionals for every project.' },
              { icon: FaAward, title: 'Quality Guaranteed', desc: 'Premium materials and certified workmanship on all projects.' },
              { icon: FaUsers, title: 'Expert Team', desc: 'Skilled engineers, welders, and construction professionals.' },
              { icon: FaClock, title: 'On-Time Delivery', desc: 'Projects completed within deadline with milestone tracking.' },
              { icon: FaToolbox, title: 'Modern Equipment', desc: 'Latest machinery and tools for precision work.' },
              { icon: FaHammer, title: 'Custom Solutions', desc: 'Tailored approach to meet unique project requirements.' },
              { icon: FaCogs, title: 'End-to-End Service', desc: 'From design to completion, we handle everything.' },
              { icon: FaUserTie, title: '24/7 Support', desc: 'Dedicated project managers available round the clock.' },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.06 }}
                className="card-industrial p-4 sm:p-6 rounded-xl"
              >
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-[#FBBF24]/10 rounded-xl flex items-center justify-center mb-3 sm:mb-4">
                  <item.icon className="text-[#FBBF24] text-xl sm:text-2xl" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-[#111111] mb-1 sm:mb-2">{item.title}</h3>
                <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics Section - Mobile optimized */}
      <section ref={statsRef} className="py-16 sm:py-20 bg-[#111111] relative overflow-hidden">
        <div className="absolute inset-0 pattern-grid opacity-10" />
        <div className="container-custom relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            {statistics.map((stat, index) => (
              <motion.div
                key={stat.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
                className="text-center"
              >
                <div className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-[#FBBF24] mb-1 sm:mb-2">
                  {counters[stat.id] || 0}{stat.suffix}
                </div>
                <p className="text-gray-300 text-sm sm:text-base md:text-lg font-medium">{stat.label}</p>
                <div className="w-10 sm:w-12 h-0.5 bg-[#FBBF24]/50 mx-auto mt-2 sm:mt-3" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Projects Section - Mobile optimized */}
      <section className="section-padding bg-gray-50 relative">
        <div className="container-custom">
          <SectionTitle
            subtitle="Our Portfolio"
            title="Featured Projects"
            description="Explore our portfolio of successfully completed projects across various sectors."
          />
          {featuredProjects.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
              {featuredProjects.map((project, index) => (
                <ProjectCard key={project.id} project={project} index={index} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
              {[1, 2, 3].map((_, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.08 }}
                  className="bg-white rounded-2xl overflow-hidden shadow-lg"
                >
                  <div className="h-48 sm:h-56 skeleton" />
                  <div className="p-4 sm:p-6 space-y-2 sm:space-y-3">
                    <div className="h-5 sm:h-6 w-3/4 skeleton" />
                    <div className="h-3 sm:h-4 w-full skeleton" />
                    <div className="h-3 sm:h-4 w-1/2 skeleton" />
                  </div>
                </motion.div>
              ))}
            </div>
          )}
          <div className="text-center mt-8 sm:mt-12">
            <Link
              to="/projects"
              className="group inline-flex items-center space-x-2 bg-[#FBBF24] text-[#111111] px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold text-sm sm:text-base hover:bg-[#D97706] transition-all duration-300 transform hover:scale-105 shadow-lg shadow-[#FBBF24]/25"
            >
              <span>View All Projects</span>
              <FaArrowRight className="text-xs sm:text-sm group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section - Mobile optimized */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <SectionTitle
            subtitle="Testimonials"
            title="What Our Clients Say"
            description="We take pride in our work and our clients' satisfaction is our top priority."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {(displayTestimonials.length > 0 ? displayTestimonials : testimonials).slice(0, 3).map((testimonial, index) => (
              <TestimonialCard key={testimonial.id || index} testimonial={testimonial} index={index} />
            ))}
          </div>
          <div className="text-center mt-8 sm:mt-10">
            <Link
              to="/testimonials"
              className="text-[#FBBF24] font-semibold hover:text-[#D97706] transition-colors inline-flex items-center space-x-1 text-sm sm:text-base"
            >
              <span>Read All Reviews</span>
              <FaArrowRight className="text-xs sm:text-sm" />
            </Link>
          </div>
        </div>
      </section>

      {/* Team Section - Mobile optimized */}
      {displayTeam.length > 0 && (
        <section className="section-padding bg-gray-50">
          <div className="container-custom">
            <SectionTitle
              subtitle="Our Team"
              title="Meet Our Experts"
              description="Skilled professionals dedicated to delivering excellence in every project."
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
              {displayTeam.map((member, index) => (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08 }}
                  className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all group"
                >
                  <div className="relative overflow-hidden h-48 sm:h-56 md:h-64">
                    <img
                      src={getImageUrl(member.image) || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop'}
                      alt={member.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute bottom-4 left-4 right-4 flex justify-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      {member.facebook && (
                        <a href={member.facebook} className="w-8 h-8 bg-[#FBBF24] rounded-full flex items-center justify-center text-[#111111] text-xs font-bold hover:scale-110 transition-transform">f</a>
                      )}
                      {member.linkedin && (
                        <a href={member.linkedin} className="w-8 h-8 bg-[#FBBF24] rounded-full flex items-center justify-center text-[#111111] text-xs font-bold hover:scale-110 transition-transform">in</a>
                      )}
                    </div>
                  </div>
                  <div className="p-4 sm:p-5 text-center">
                    <h3 className="font-bold text-[#111111] text-base sm:text-lg">{member.name}</h3>
                    <p className="text-[#FBBF24] font-medium text-xs sm:text-sm">{member.role}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Banner - Mobile optimized */}
      <section className="relative py-16 sm:py-24 overflow-hidden bg-[#111111]">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1541888946425-d81bb51b6c79?w=1920&h=600&fit=crop"
            alt="Construction background"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#111111]/95 via-[#111111]/90 to-[#111111]/95" />
          <div className="absolute inset-0 pattern-grid opacity-10" />
        </div>
        <div className="container-custom relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="inline-block px-3 sm:px-4 py-1.5 sm:py-2 bg-[#FBBF24]/10 border border-[#FBBF24]/30 rounded-full text-[#FBBF24] text-xs sm:text-sm font-semibold mb-4 sm:mb-6">
              START YOUR PROJECT
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 sm:mb-4 max-w-3xl mx-auto leading-tight px-4 sm:px-0">
              Ready to Build Something <span className="text-[#FBBF24]">Amazing</span>?
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-400 mb-6 sm:mb-10 max-w-2xl mx-auto px-4 sm:px-0">
              Contact us today for a free consultation and quote. Our team is ready to bring your vision to life.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 px-4 sm:px-0">
              <Link
                to="/quote"
                className="group inline-flex items-center justify-center space-x-2 bg-[#FBBF24] text-[#111111] px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold text-sm sm:text-base md:text-lg hover:bg-[#D97706] transition-all duration-300 transform hover:scale-105 shadow-lg shadow-[#FBBF24]/30 w-full sm:w-auto"
              >
                <span>Get Free Quote</span>
                <FaArrowRight className="text-xs sm:text-sm group-hover:translate-x-1 transition-transform" />
              </Link>
              <a
                href={`tel:${companyInfo.phone}`}
                className="inline-flex items-center justify-center space-x-2 border-2 border-white/30 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold text-sm sm:text-base md:text-lg hover:bg-white hover:text-[#111111] transition-all duration-300 w-full sm:w-auto"
              >
                <FaPhone className="text-xs sm:text-sm" />
                <span>Call Now</span>
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HomePage;