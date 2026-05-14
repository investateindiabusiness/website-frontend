"use client";

import React, { useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function TermsAndConditions() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const sectionTitleStyle = "text-xl md:text-2xl font-bold text-gray-900 mt-10 mb-4 flex items-center gap-2";
  const paragraphStyle = "text-gray-600 leading-relaxed mb-4";
  const listStyle = "list-disc pl-6 space-y-2 text-gray-600 mb-6 marker:text-orange-500";

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 font-sans">
      <Header />

      <div className="bg-[#2A1B15] text-white py-16 md:py-24 relative overflow-hidden mt-[2rem] md:mt-[4rem]">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-900/40 via-[#2A1B15] to-[#1a100c] z-0"></div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Terms and Conditions</h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Please read these terms carefully before using the Investate India platform.
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
              These Terms govern your use of Investate India. By registering or using the platform, you agree to comply with these Terms.
            </p>
          </div>

          <section>
            <h2 className={sectionTitleStyle}>1. Platform Nature</h2>
            <p className={paragraphStyle}>
              Investate India is a technology platform only.
            </p>

            <div className="grid md:grid-cols-2 gap-6 my-6">
              <div className="bg-green-50 p-6 rounded-lg border border-green-100">
                <h3 className="font-bold text-green-800 mb-3">We Do:</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2"><span className="text-green-600 font-bold">✓</span> Display verified property listings</li>
                  <li className="flex items-start gap-2"><span className="text-green-600 font-bold">✓</span> Provide dashboards for users</li>
                  <li className="flex items-start gap-2"><span className="text-green-600 font-bold">✓</span> Enable direct communication</li>
                </ul>
              </div>
              <div className="bg-red-50 p-6 rounded-lg border border-red-100">
                <h3 className="font-bold text-red-800 mb-3">We DO NOT:</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2"><span className="text-red-600 font-bold">✕</span> Sell properties directly</li>
                  <li className="flex items-start gap-2"><span className="text-red-600 font-bold">✕</span> Act as broker/agent</li>
                  <li className="flex items-start gap-2"><span className="text-red-600 font-bold">✕</span> Handle financial transactions</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className={sectionTitleStyle}>2. User Accounts</h2>
            <p className={paragraphStyle}>Users must:</p>
            <ul className={listStyle}>
              <li>Provide accurate information during registration.</li>
              <li>Keep login credentials secure and confidential.</li>
            </ul>
          </section>

          <section>
            <h2 className={sectionTitleStyle}>3. Limitation of Liability</h2>
            <p className={paragraphStyle}>Investate India is <strong>not liable</strong> for:</p>
            <ul className={listStyle}>
              <li>Investment losses.</li>
              <li>Property disputes or legal battles.</li>
              <li>Builder defaults or bankruptcy.</li>
              <li>Construction delays.</li>
            </ul>
            <p className="font-semibold text-gray-800">Your use of the platform is entirely at your own risk.</p>
          </section>

          <section className="mt-12 bg-orange-50 p-6 rounded-xl border border-orange-100 text-center">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Contact Us</h2>
            <p className="text-gray-600 mb-4">
              If you have any questions about these Terms, please contact us at:
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
