import React from 'react';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import { SEOMeta, BreadcrumbSchema } from '../../contexts/SEOContext';
import { companyInfo } from '../../constants';

const PrivacyPage = () => {
  const schemaItems = [{ name: 'Home', path: '/' }, { name: 'Privacy Policy', path: '/privacy' }];
  return (
    <div className="min-h-screen bg-white">
      <SEOMeta title="Privacy Policy" description={`Privacy Policy of ${companyInfo.name}`} canonical="/privacy" />
      <BreadcrumbSchema items={schemaItems} />
      <Header />
      <section className="pt-32 pb-20">
        <div className="container-custom max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold text-[#111111] mb-6">Privacy Policy</h1>
          <div className="prose max-w-none text-gray-600 space-y-4">
            <p>Last updated: {new Date().toLocaleDateString()}</p>
            <h2 className="text-xl font-bold text-[#111111] mt-8">1. Information We Collect</h2>
            <p>We collect information you provide directly to us, including name, email address, phone number, and project details when you fill out forms on our website.</p>
            <h2 className="text-xl font-bold text-[#111111] mt-8">2. How We Use Your Information</h2>
            <p>We use the information to respond to inquiries, provide quotes, process service requests, and improve our website and services.</p>
            <h2 className="text-xl font-bold text-[#111111] mt-8">3. Information Sharing</h2>
            <p>We do not sell, trade, or transfer your personal information to third parties without your consent, except as required by law.</p>
            <h2 className="text-xl font-bold text-[#111111] mt-8">4. Data Security</h2>
            <p>We implement appropriate security measures to protect your personal information from unauthorized access, alteration, or disclosure.</p>
            <h2 className="text-xl font-bold text-[#111111] mt-8">5. Contact Us</h2>
            <p>If you have questions about this privacy policy, contact us at {companyInfo.email} or call {companyInfo.phone}.</p>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default PrivacyPage;