import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock, FaPaperPlane, FaCheckCircle, FaWhatsapp } from 'react-icons/fa';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import SectionTitle from '../../components/ui/SectionTitle';
import { SEOMeta, BreadcrumbSchema, LocalBusinessSchema } from '../../contexts/SEOContext';
import { companyInfo } from '../../constants';
import { addDocument } from '../../hooks/useFirestore';

const ContactPage = () => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      setError('Please fill in all required fields.');
      return;
    }
    setSubmitting(true);
    setError('');
    console.log('[ContactPage] Submitting inquiry to Firestore...', {
      collection: 'inquiries',
      name: formData.name,
      subject: formData.subject,
    });
    try {
      // Save to inquiries collection with all required fields
      const result = await addDocument('inquiries', {
        name: formData.name,
        email: formData.email,
        phone: formData.phone || '',
        subject: formData.subject || 'General Inquiry',
        description: formData.message,
        source: 'contact_page',
        status: 'new',
      });
      if (result.success) {
        console.log('[ContactPage] ✅ Inquiry saved successfully! ID:', result.id);
        setSubmitted(true);
        setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
        setTimeout(() => setSubmitted(false), 5000);
      } else {
        console.error('[ContactPage] ❌ Failed to save inquiry:', result.error);
        setError(result.error || 'Failed to send message. Please try again.');
      }
    } catch (err) {
      console.error('[ContactPage] ❌ Submission error:', err.message);
      setError('Failed to send message. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const contactMethods = [
    { icon: FaPhone, title: 'Phone', details: [companyInfo.phone], href: `tel:${companyInfo.phone}`, action: 'Call Now' },
    { icon: FaEnvelope, title: 'Email', details: [companyInfo.email], href: `mailto:${companyInfo.email}`, action: 'Send Email' },
    { icon: FaMapMarkerAlt, title: 'Office Address', details: [companyInfo.address.street, `${companyInfo.address.city}, ${companyInfo.address.state} ${companyInfo.address.zipCode}`], action: 'Get Directions' },
    { icon: FaClock, title: 'Working Hours', details: [companyInfo.workingHours.weekdays, companyInfo.workingHours.saturday, companyInfo.workingHours.sunday], action: '' },
  ];

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <SEOMeta title="Contact Us" description={`Get in touch with ${companyInfo.name}. Call us at ${companyInfo.phone} or email ${companyInfo.email}`} keywords="contact BE Construction, construction company contact, welding services contact" />
      <BreadcrumbSchema items={[{ name: 'Home', path: '/' }, { name: 'Contact', path: '/contact' }]} />
      <LocalBusinessSchema />
      <Header />

      {/* Page Header - Mobile optimized */}
      <section className="relative pt-28 sm:pt-32 pb-16 sm:pb-20 bg-[#111111] overflow-hidden">
        <div className="absolute inset-0 pattern-grid opacity-10" />
        <div className="container-custom relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span className="inline-block px-3 sm:px-4 py-1.5 sm:py-2 bg-[#FBBF24]/10 border border-[#FBBF24]/30 rounded-full text-[#FBBF24] text-xs sm:text-sm font-semibold mb-3 sm:mb-4">GET IN TOUCH</span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-3 sm:mb-4">Contact Us</h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-300 max-w-2xl mx-auto px-4 sm:px-0">Have a project in mind? We'd love to hear from you. Get in touch with our team.</p>
          </motion.div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12">
            {/* Contact Info */}
            <motion.div initial={{ opacity: 0, x: -15 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <SectionTitle subtitle="Contact Information" title="Let's Discuss Your Project" description="Reach out through any of the following channels and our team will get back to you promptly." centered={false} />
              
              <div className="space-y-3 sm:space-y-4 mt-6 sm:mt-8">
                {contactMethods.map((method, idx) => (
                  <div key={idx} className="flex items-start space-x-3 sm:space-x-4 p-3 sm:p-4 bg-gray-50 rounded-xl hover:bg-[#FBBF24]/5 transition-all border border-transparent hover:border-[#FBBF24]/20 group">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#FBBF24]/10 rounded-xl flex items-center justify-center group-hover:bg-[#FBBF24] transition-all flex-shrink-0">
                      <method.icon className="text-[#FBBF24] group-hover:text-white text-lg sm:text-xl transition-colors" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-[#111111] text-sm sm:text-base">{method.title}</h3>
                      {method.details.map((detail, i) => (
                        <p key={i} className="text-gray-600 text-xs sm:text-sm truncate">{detail}</p>
                      ))}
                      {method.href && (
                        <a href={method.href} className="text-[#FBBF24] text-xs sm:text-sm font-semibold hover:text-[#D97706] transition-colors mt-1 inline-block">
                          {method.action} →
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* WhatsApp Button */}
              <a
                href={`https://wa.me/${companyInfo.whatsapp?.replace(/[^0-9]/g, '') || companyInfo.phone?.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center space-x-2 mt-4 sm:mt-6 bg-[#25D366] text-white px-5 sm:px-6 py-3 sm:py-4 rounded-xl font-bold text-sm sm:text-base hover:bg-[#1DA851] transition-all"
              >
                <FaWhatsapp className="text-lg sm:text-xl" />
                <span>Chat on WhatsApp</span>
              </a>
            </motion.div>

            {/* Contact Form - Mobile optimized */}
            <motion.div initial={{ opacity: 0, x: 15 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <div className="bg-gray-50 rounded-2xl p-4 sm:p-6 md:p-8 border border-gray-100">
                <h2 className="text-xl sm:text-2xl font-bold text-[#111111] mb-4 sm:mb-6">Send Us a Message</h2>
                
                {submitted ? (
                  <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-6 sm:py-8">
                    <FaCheckCircle className="text-4xl sm:text-5xl text-green-500 mx-auto mb-3 sm:mb-4" />
                    <h3 className="text-lg sm:text-xl font-bold text-[#111111] mb-2">Message Sent Successfully!</h3>
                    <p className="text-gray-500 text-sm">We'll get back to you within 24 hours.</p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                    {error && <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">{error}</div>}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <div>
                        <label className="form-label text-xs sm:text-sm">Name *</label>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} className="form-input text-sm" placeholder="Your name" required />
                      </div>
                      <div>
                        <label className="form-label text-xs sm:text-sm">Email *</label>
                        <input type="email" name="email" value={formData.email} onChange={handleChange} className="form-input text-sm" placeholder="Your email" required />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <div>
                        <label className="form-label text-xs sm:text-sm">Phone</label>
                        <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="form-input text-sm" placeholder="Your phone" />
                      </div>
                      <div>
                        <label className="form-label text-xs sm:text-sm">Subject</label>
                        <input type="text" name="subject" value={formData.subject} onChange={handleChange} className="form-input text-sm" placeholder="Subject" />
                      </div>
                    </div>
                    <div>
                      <label className="form-label text-xs sm:text-sm">Message / Description *</label>
                      <textarea name="message" value={formData.message} onChange={handleChange} rows={4} className="form-input text-sm resize-none" placeholder="Tell us about your project in detail..." required />
                    </div>
                    <button type="submit" disabled={submitting} className="w-full btn-primary justify-center text-sm sm:text-base min-h-[44px]">
                      {submitting ? (
                        <span className="flex items-center"><div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-[#111111] border-t-transparent rounded-full animate-spin mr-2" /> Sending...</span>
                      ) : (
                        <span className="flex items-center"><FaPaperPlane className="mr-2" /> Send Message</span>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Map - Mobile height adjusted */}
      <section className="h-60 sm:h-80 bg-gray-200 relative">
        <iframe
          src={`https://www.google.com/maps?q=${companyInfo.location?.lat || 0},${companyInfo.location?.lng || 0}&output=embed&z=15`}
          className="w-full h-full"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Office Location"
        />
      </section>

      <Footer />
    </div>
  );
};

export default ContactPage;