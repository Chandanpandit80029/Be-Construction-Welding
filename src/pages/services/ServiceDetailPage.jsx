import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaCheckCircle, FaArrowRight, FaPhone, FaEnvelope, FaQuoteRight } from 'react-icons/fa';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import SectionTitle from '../../components/ui/SectionTitle';
import { SEOMeta, BreadcrumbSchema } from '../../contexts/SEOContext';
import { useDocument } from '../../hooks/useFirestore';
import { services } from '../../constants';
import { getImageUrl } from '../../utils/image';

const ServiceDetailPage = () => {
  const { slug } = useParams();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    // Try to find from static services first
    const found = services.find(s => s.slug === slug);
    if (found) {
      setService(found);
      setLoading(false);
    } else {
      // If not found in static, fetch from Firebase
      import('../../hooks/useFirestore').then(({ getDocuments }) => {
        getDocuments('services', { where: { field: 'slug', operator: '==', value: slug } })
          .then(res => {
            if (res.success && res.data.length > 0) {
              setService(res.data[0]);
            }
            setLoading(false);
          });
      });
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="pt-32 container-custom">
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="h-8 w-32 skeleton" />
            <div className="h-64 skeleton rounded-2xl" />
            <div className="h-10 w-3/4 skeleton" />
            <div className="h-4 w-full skeleton" />
            <div className="h-4 w-5/6 skeleton" />
            <div className="h-4 w-2/3 skeleton" />
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="pt-32 container-custom text-center">
          <div className="max-w-lg mx-auto">
            <div className="text-8xl mb-6">🔧</div>
            <h1 className="text-3xl font-bold text-[#111111] mb-4">Service Not Found</h1>
            <p className="text-gray-500 mb-8">The service you're looking for doesn't exist or has been removed.</p>
            <Link to="/services" className="inline-flex items-center space-x-2 bg-[#FBBF24] text-[#111111] px-6 py-3 rounded-xl font-semibold hover:bg-[#D97706] transition-all">
              <FaArrowLeft className="text-sm" />
              <span>Back to Services</span>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const schemaItems = [
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services' },
    { name: service.title, path: `/services/${slug}` },
  ];

  const features = service.features || [
    'Expert certified professionals',
    'Premium quality materials',
    'On-time project delivery',
    'Competitive pricing',
    'Customized solutions',
    'Safety compliant'
  ];

  const benefits = service.benefits || [
    'Enhanced durability and longevity',
    'Cost-effective solutions',
    'Professional execution',
    'Warranty guaranteed'
  ];

  const processSteps = [
    { step: '01', title: 'Consultation', desc: 'Free consultation to understand your requirements and provide expert advice.' },
    { step: '02', title: 'Planning', desc: 'Detailed project planning with timelines, budgets, and resource allocation.' },
    { step: '03', title: 'Execution', desc: 'Professional execution by our skilled team using modern equipment and techniques.' },
    { step: '04', title: 'Delivery', desc: 'Timely delivery with quality checks and complete customer satisfaction.' },
  ];

  return (
    <div className="min-h-screen bg-white">
      <SEOMeta 
        title={service.title}
        description={service.description || `Professional ${service.title} services by BE Construction & Welding Works`}
        keywords={`${service.title}, construction, welding, ${service.title} services, BE Construction`}
        canonical={`/services/${slug}`}
      />
      <BreadcrumbSchema items={schemaItems} />
      <Header />

      {/* Hero Banner */}
      <section className="relative pt-32 pb-20 bg-[#111111] overflow-hidden">
        <div className="absolute inset-0 pattern-grid opacity-10" />
        <div className="container-custom relative z-10">
          <div className="max-w-4xl mx-auto">
            <Link to="/services" className="inline-flex items-center space-x-2 text-[#FBBF24] hover:text-[#D97706] transition-colors mb-8 group">
              <FaArrowLeft className="text-sm group-hover:-translate-x-1 transition-transform" />
              <span>Back to Services</span>
            </Link>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">{service.title}</h1>
              <p className="text-xl text-gray-300 max-w-3xl">{service.description}</p>
              <div className="flex flex-wrap gap-3 mt-6">
                <Link to="/quote" className="inline-flex items-center space-x-2 bg-[#FBBF24] text-[#111111] px-6 py-3 rounded-xl font-semibold hover:bg-[#D97706] transition-all">
                  <span>Get a Quote</span>
                  <FaArrowRight className="text-sm" />
                </Link>
                <a href="tel:+918002944742" className="inline-flex items-center space-x-2 border border-white/30 text-white px-6 py-3 rounded-xl font-semibold hover:bg-white hover:text-[#111111] transition-all">
                  <FaPhone className="text-sm" />
                  <span>Call Now</span>
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Left - Features & Benefits */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <SectionTitle
                subtitle="What We Offer"
                title={`Our ${service.title} Services`}
                description="We provide comprehensive solutions tailored to your specific needs with unmatched quality and expertise."
                centered={false}
              />
              
              {/* Features */}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-[#111111] mb-4">Key Features</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {features.map((feature, idx) => (
                    <div key={idx} className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                      <FaCheckCircle className="text-[#FBBF24] flex-shrink-0" />
                      <span className="text-[#111111] text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Benefits */}
              <div>
                <h3 className="text-xl font-bold text-[#111111] mb-4">Benefits</h3>
                <div className="space-y-3">
                  {benefits.map((benefit, idx) => (
                    <div key={idx} className="flex items-center space-x-3 p-3 border-l-4 border-[#FBBF24] bg-gray-50 rounded-r-lg">
                      <FaCheckCircle className="text-[#FBBF24] flex-shrink-0" />
                      <span className="text-[#111111] text-sm">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Right - Image & Process */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="rounded-2xl overflow-hidden shadow-xl mb-8">
                <img
                  src={getImageUrl(service.image) || 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=800&h=600&fit=crop'}
                  alt={service.title}
                  className="w-full h-80 object-cover"
                />
              </div>

              {/* Process Steps */}
              <div className="bg-gray-50 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-[#111111] mb-6">Our Process</h3>
                <div className="space-y-4">
                  {processSteps.map((step, idx) => (
                    <div key={idx} className="flex items-start space-x-4">
                      <div className="w-10 h-10 bg-[#FBBF24] rounded-lg flex items-center justify-center text-[#111111] font-bold text-sm flex-shrink-0">
                        {step.step}
                      </div>
                      <div>
                        <h4 className="font-semibold text-[#111111]">{step.title}</h4>
                        <p className="text-gray-500 text-sm">{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-[#111111] relative">
        <div className="container-custom text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Need {service.title} Services?</h2>
          <p className="text-gray-300 text-lg mb-8 max-w-xl mx-auto">Contact us today for a free consultation and quote. Our experts are ready to help.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/quote" className="inline-flex items-center space-x-2 bg-[#FBBF24] text-[#111111] px-8 py-4 rounded-xl font-bold hover:bg-[#D97706] transition-all">
              <FaQuoteRight />
              <span>Request a Quote</span>
            </Link>
            <a href="tel:+918002944742" className="inline-flex items-center space-x-2 border-2 border-white/30 text-white px-8 py-4 rounded-xl font-bold hover:bg-white hover:text-[#111111] transition-all">
              <FaPhone />
              <span>Call +91 80029 44742</span>
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ServiceDetailPage;