import React from 'react';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import { SEOMeta, BreadcrumbSchema } from '../../contexts/SEOContext';
import { companyInfo } from '../../constants';

const TermsPage = () => {
  const schemaItems = [{ name: 'Home', path: '/' }, { name: 'Terms of Service', path: '/terms' }];
  return (
    <div className="min-h-screen bg-white">
      <SEOMeta title="Terms of Service" description={`Terms of Service for ${companyInfo.name}`} canonical="/terms" />
      <BreadcrumbSchema items={schemaItems} />
      <Header />
      <section className="pt-32 pb-20">
        <div className="container-custom max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold text-[#111111] mb-6">Terms of Service</h1>
          <div className="prose max-w-none text-gray-600 space-y-4">
            <p>Last updated: {new Date().toLocaleDateString()}</p>
            <h2 className="text-xl font-bold text-[#111111] mt-8">1. Acceptance of Terms</h2>
            <p>By using the services of {companyInfo.name}, you agree to these terms and conditions. If you do not agree, please refrain from using our services.</p>
            <h2 className="text-xl font-bold text-[#111111] mt-8">2. Services</h2>
            <p>We provide construction, welding, and fabrication services. All service agreements will be documented in a written contract outlining scope, timeline, and pricing.</p>
            <h2 className="text-xl font-bold text-[#111111] mt-8">3. Quotes and Payments</h2>
            <p>Quotes are valid for 30 days unless otherwise stated. Payment terms will be specified in the service agreement. Late payments may incur additional charges.</p>
            <h2 className="text-xl font-bold text-[#111111] mt-8">4. Warranties</h2>
            <p>We warrant our workmanship for a period specified in the service agreement. This warranty covers defects in workmanship but not damage from misuse, accidents, or normal wear.</p>
            <h2 className="text-xl font-bold text-[#111111] mt-8">5. Limitation of Liability</h2>
            <p>{companyInfo.name} shall not be liable for indirect, incidental, or consequential damages arising from the use of our services.</p>
            <h2 className="text-xl font-bold text-[#111111] mt-8">6. Contact</h2>
            <p>For questions about these terms, contact us at {companyInfo.email} or call {companyInfo.phone}.</p>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default TermsPage;