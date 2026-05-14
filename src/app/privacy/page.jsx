"use client";

import React, { useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Mail } from 'lucide-react';

export default function PrivacyPolicy() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const sectionTitleStyle = "text-xl md:text-2xl font-bold text-gray-900 mt-10 mb-4 flex items-center gap-2";
  const subSectionTitleStyle = "text-lg font-semibold text-gray-800 mt-6 mb-2";
  const paragraphStyle = "text-gray-600 leading-relaxed mb-4";
  const listStyle = "list-disc pl-6 space-y-2 text-gray-600 mb-6 marker:text-orange-500";

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 font-sans">
      <Header />

      <div className="bg-[#2A1B15] text-white py-16 md:py-24 relative overflow-hidden mt-[2rem] md:mt-[4rem]">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-900/40 via-[#2A1B15] to-[#1a100c] z-0"></div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Your privacy is important to us. Learn how we collect, use, and protect your information.
          </p>
        </div>
      </div>

      <div className="flex-grow container mx-auto px-4 py-12 -mt-10 relative z-20">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-xl border border-gray-100 p-8 md:p-12">

          <div className="border-b border-gray-100 pb-6 mb-8">
            <p className="text-sm text-gray-500 italic">
              Last Updated: {new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
            <p className="mt-4 text-gray-700 font-medium text-lg">
              Welcome to Investate India. By accessing or using our platform, you agree to this Privacy Policy.
            </p>
          </div>

          <section>
            <h2 className={sectionTitleStyle}>1. Information We Collect</h2>
            <h3 className={subSectionTitleStyle}>A. Account Information (Investors & Builders)</h3>
            <p className={paragraphStyle}>When you register or log in, we collect:</p>
            <ul className={listStyle}>
              <li>Name, Email address, and Phone/WhatsApp number.</li>
              <li>Country/location.</li>
              <li>Account type (Investor/Builder).</li>
              <li>Company or builder details (for builders).</li>
            </ul>
            <h3 className={subSectionTitleStyle}>B. Property & Listing Data (Builders)</h3>
            <ul className={listStyle}>
              <li>Property details, Pricing, and Project information.</li>
              <li>Images and visual assets.</li>
              <li>Documents submitted for verification purposes.</li>
            </ul>
          </section>

          <section>
            <h2 className={sectionTitleStyle}>2. How We Use Your Information</h2>
            <p className={paragraphStyle}>We use your information to:</p>
            <ul className="grid md:grid-cols-2 gap-x-4 gap-y-2 text-gray-600 mb-6">
              <li className="flex items-start gap-2"><span className="text-orange-500">•</span> Create and manage accounts</li>
              <li className="flex items-start gap-2"><span className="text-orange-500">•</span> Verify builders before publishing</li>
              <li className="flex items-start gap-2"><span className="text-orange-500">•</span> Display property listings</li>
              <li className="flex items-start gap-2"><span className="text-orange-500">•</span> Enable investor-builder communication</li>
            </ul>
          </section>

          <section>
            <h2 className={sectionTitleStyle}>3. Information Sharing</h2>
            <p className={paragraphStyle}>We may share data:</p>
            <ul className={listStyle}>
              <li>Between investors and builders when a specific inquiry is made.</li>
              <li>With trusted service providers (hosting, analytics).</li>
            </ul>
            <p className="font-semibold text-gray-800 border-l-4 border-orange-500 pl-4 py-1 bg-gray-50">
              We never sell your personal data to third parties.
            </p>
          </section>

          <section className="mt-12 bg-orange-50 p-6 rounded-xl border border-orange-100 text-center">
            <h2 className="text-xl font-bold text-gray-900 mb-2 flex items-center justify-center gap-2">
              <Mail className="w-5 h-5" />Contact Us
            </h2>
            <p className="text-gray-600 mb-4">
              If you have any questions about this Privacy Policy, please contact us at:
            </p>
            <a href="mailto:investateindia.business@gmail.com" className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 transition-colors">
              investateindia.business@gmail.com
            </a>
          </section>
        </div>
      </div>

      <Footer />
    </div>
  );
}
