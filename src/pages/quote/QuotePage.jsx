import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaPaperPlane, FaCheckCircle, FaHardHat, FaArrowRight, FaPhone, FaWhatsapp } from 'react-icons/fa';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import SectionTitle from '../../components/ui/SectionTitle';
import { SEOMeta, BreadcrumbSchema } from '../../contexts/SEOContext';
import { useRealtimeCollection } from '../../hooks/useFirestore';
import { addDocument } from '../../hooks/useFirestore';
import { companyInfo, services as staticServices } from '../../constants';

const QuotePage = () => {
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', company: '',
    serviceType: '', budget: '', timeline: '', location: '',
    subject: '', projectDetails: '', file: null,
  });

  const { data: servicesData } = useRealtimeCollection('services', { orderBy: 'createdAt' });
  const services = servicesData?.length > 0 ? servicesData : staticServices;

  const budgets = ['Under ₹50,000', '₹50,000 - ₹1,00,000', '₹1,00,000 - ₹5,00,000', '₹5,00,000 - ₹10,00,000', 'Above ₹10,00,000'];
  const timelines = ['ASAP', 'Within 1 month', '1-3 months', '3-6 months', '6+ months', 'Not sure'];

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData(prev => ({ ...prev, [name]: files ? files[0] : value }));
  };

  const validateStep1 = () => {
    if (!formData.name || !formData.email || !formData.phone) {
      setError('Please fill in your name, email, and phone number.');
      return false;
    }
    setError('');
    return true;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) setStep(2);
    else if (step === 2) setStep(3);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.serviceType || !formData.projectDetails) {
      setError('Please select a service type and provide project details.');
      return;
    }
    setSubmitting(true);
    setError('');
    console.log('[QuotePage] Submitting quote request to Firestore...', {
      collection: 'quoteRequests',
      name: formData.name,
      service: formData.serviceType,
    });
    try {
      // Save to quoteRequests collection with all required fields
      const result = await addDocument('quoteRequests', {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        service: formData.serviceType,
        budget: formData.budget,
        location: formData.location,
        subject: formData.subject || `Quote Request - ${formData.serviceType}`,
        description: formData.projectDetails,
        attachment: formData.file ? formData.file.name : null,
        status: 'new',
      });
      if (result.success) {
        console.log('[QuotePage] ✅ Quote request saved successfully! ID:', result.id);
        setSubmitted(true);
      } else {
        console.error('[QuotePage] ❌ Failed to save quote request:', result.error);
        setError(result.error || 'Failed to submit quote request. Please try again.');
      }
    } catch (err) {
      console.error('[QuotePage] ❌ Submission error:', err.message);
      setError('Failed to submit quote request. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass = "w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:border-[#FBBF24] focus:outline-none transition-all text-[#111111] text-sm";
  const labelClass = "block text-sm font-semibold text-[#111111] mb-1.5";

  if (submitted) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="pt-32 pb-20">
          <div className="container-custom max-w-lg mx-auto text-center">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 0.95 }}>
              <FaCheckCircle className="text-6xl text-green-500 mx-auto mb-6" />
              <h1 className="text-3xl font-bold text-[#111111] mb-4">Quote Request Submitted!</h1>
              <p className="text-gray-500 mb-8">Thank you for your interest. Our team will review your requirements and get back to you within 24 hours with a detailed quote.</p>
              <a href={`tel:${companyInfo.phone}`} className="inline-flex items-center space-x-2 bg-[#FBBF24] text-[#111111] px-6 py-3 rounded-xl font-semibold hover:bg-[#D97706] transition-all">
                <FaPhone /><span>Call {companyInfo.phone}</span>
              </a>
            </motion.div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <SEOMeta title="Get a Quote" description={`Request a free quote from ${companyInfo.name} for construction, welding, and fabrication services`} keywords="free quote, construction quote, welding quote, BE Construction quote" />
      <BreadcrumbSchema items={[{ name: 'Home', path: '/' }, { name: 'Get a Quote', path: '/quote' }]} />
      <Header />

      <section className="relative pt-32 pb-20 bg-[#111111] overflow-hidden">
        <div className="absolute inset-0 pattern-grid opacity-10" />
        <div className="container-custom relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-block px-4 py-2 bg-[#FBBF24]/10 border border-[#FBBF24]/30 rounded-full text-[#FBBF24] text-sm font-semibold mb-4">GET A QUOTE</span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">Request a Free Quote</h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">Tell us about your project and we'll provide a detailed, no-obligation quote within 24 hours.</p>
          </motion.div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom max-w-2xl mx-auto">
          {/* Progress Steps */}
          <div className="flex items-center justify-center mb-10 space-x-4">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${step >= s ? 'bg-[#FBBF24] text-[#111111]' : 'bg-gray-200 text-gray-500'}`}>
                  {s}
                </div>
                {s < 3 && <div className={`w-16 h-1 mx-2 rounded transition-all ${step > s ? 'bg-[#FBBF24]' : 'bg-gray-200'}`} />}
              </div>
            ))}
          </div>

          <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100">
            {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">{error}</div>}

            <form onSubmit={step === 3 ? handleSubmit : (e) => e.preventDefault()}>
              {/* Step 1: Personal Info */}
              {step === 1 && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                  <h2 className="text-2xl font-bold text-[#111111] mb-6">Personal Information</h2>
                  <div className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className={labelClass}>Full Name *</label>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} className={inputClass} placeholder="Your full name" required />
                      </div>
                      <div>
                        <label className={labelClass}>Company Name</label>
                        <input type="text" name="company" value={formData.company} onChange={handleChange} className={inputClass} placeholder="Company name (optional)" />
                      </div>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className={labelClass}>Email *</label>
                        <input type="email" name="email" value={formData.email} onChange={handleChange} className={inputClass} placeholder="Your email" required />
                      </div>
                      <div>
                        <label className={labelClass}>Phone *</label>
                        <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className={inputClass} placeholder="Your phone number" required />
                      </div>
                    </div>
                    <div>
                      <label className={labelClass}>Location</label>
                      <input type="text" name="location" value={formData.location} onChange={handleChange} className={inputClass} placeholder="Project location (city/area)" />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Project Details */}
              {step === 2 && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                  <h2 className="text-2xl font-bold text-[#111111] mb-6">Project Details</h2>
                  <div className="space-y-4">
                    <div>
                      <label className={labelClass}>Service Type *</label>
                      <select name="serviceType" value={formData.serviceType} onChange={handleChange} className={inputClass} required>
                        <option value="">Select a service...</option>
                        {services.map(s => (
                          <option key={s.id || s.slug} value={s.title}>{s.title}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className={labelClass}>Subject</label>
                      <input type="text" name="subject" value={formData.subject} onChange={handleChange} className={inputClass} placeholder="Brief subject for your request" />
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className={labelClass}>Budget Range</label>
                        <select name="budget" value={formData.budget} onChange={handleChange} className={inputClass}>
                          <option value="">Select budget...</option>
                          {budgets.map(b => <option key={b} value={b}>{b}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className={labelClass}>Timeline</label>
                        <select name="timeline" value={formData.timeline} onChange={handleChange} className={inputClass}>
                          <option value="">Select timeline...</option>
                          {timelines.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className={labelClass}>Full Description / Message *</label>
                      <textarea name="projectDetails" value={formData.projectDetails} onChange={handleChange} rows={6} className={`${inputClass} resize-none`} placeholder="Describe your project in detail - include scope, materials, dimensions, timeline expectations, or any special requirements..." required />
                      <p className="text-xs text-gray-500 mt-1">Be as detailed as possible so we can provide an accurate quote.</p>
                    </div>
                    <div>
                      <label className={labelClass}>Upload Document (optional)</label>
                      <input type="file" name="file" onChange={handleChange} className={inputClass} accept=".pdf,.doc,.docx,.jpg,.png" />
                      <p className="text-xs text-gray-500 mt-1">Upload drawings, specifications, or reference images (max 10MB)</p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Review & Submit */}
              {step === 3 && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                  <h2 className="text-2xl font-bold text-[#111111] mb-6">Review & Submit</h2>
                  <div className="space-y-3">
                    <div className="p-4 bg-white rounded-xl border border-gray-200">
                      <p className="text-xs text-gray-500 uppercase tracking-wider">Your Information</p>
                      <p className="font-semibold text-[#111111]">{formData.name} {formData.company ? `- ${formData.company}` : ''}</p>
                      <p className="text-sm text-gray-600">{formData.email} | {formData.phone}</p>
                      {formData.location && <p className="text-sm text-gray-600">📍 {formData.location}</p>}
                    </div>
                    <div className="p-4 bg-white rounded-xl border border-gray-200">
                      <p className="text-xs text-gray-500 uppercase tracking-wider">Project Details</p>
                      <p className="font-semibold text-[#111111]">Service: {formData.serviceType}</p>
                      {formData.subject && <p className="text-sm text-gray-600">Subject: {formData.subject}</p>}
                      {formData.budget && <p className="text-sm text-gray-600">Budget: {formData.budget}</p>}
                      {formData.timeline && <p className="text-sm text-gray-600">Timeline: {formData.timeline}</p>}
                      {formData.projectDetails && (
                        <div className="mt-2">
                          <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Description</p>
                          <div className="text-sm text-gray-700 bg-gray-100 p-3 rounded-xl whitespace-pre-wrap break-words max-h-60 overflow-y-auto">
                            {formData.projectDetails}
                          </div>
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-gray-400">By submitting, you agree to our privacy policy and terms of service.</p>
                  </div>
                </motion.div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
                {step > 1 ? (
                  <button type="button" onClick={() => setStep(step - 1)} className="px-6 py-3 border border-gray-200 rounded-xl font-semibold text-[#111111] hover:bg-gray-100 transition-all">
                    ← Back
                  </button>
                ) : <div />}
                
                {step < 3 ? (
                  <button type="button" onClick={handleNext} className="px-8 py-3 bg-[#FBBF24] text-[#111111] rounded-xl font-semibold hover:bg-[#D97706] transition-all flex items-center space-x-2">
                    <span>Next Step</span>
                    <FaArrowRight className="text-sm" />
                  </button>
                ) : (
                  <button type="submit" disabled={submitting} className="px-8 py-3 bg-[#FBBF24] text-[#111111] rounded-xl font-semibold hover:bg-[#D97706] transition-all flex items-center space-x-2 disabled:opacity-50">
                    {submitting ? (
                      <span className="flex items-center"><div className="w-5 h-5 border-2 border-[#111111] border-t-transparent rounded-full animate-spin mr-2" /> Submitting...</span>
                    ) : (
                      <span className="flex items-center"><FaPaperPlane className="mr-2" /> Submit Request</span>
                    )}
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* WhatsApp CTA */}
          <div className="text-center mt-8">
            <p className="text-gray-500 mb-3">Prefer to talk? Reach us directly:</p>
            <div className="flex justify-center gap-4">
              <a href={`tel:${companyInfo.phone}`} className="inline-flex items-center space-x-2 border border-gray-200 text-[#111111] px-5 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-all">
                <FaPhone className="text-[#FBBF24]" /><span>Call Us</span>
              </a>
              <a href={`https://wa.me/${companyInfo.whatsapp.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center space-x-2 bg-[#25D366] text-white px-5 py-3 rounded-xl font-semibold hover:bg-[#1DA851] transition-all">
                <FaWhatsapp className="text-lg" /><span>WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default QuotePage;