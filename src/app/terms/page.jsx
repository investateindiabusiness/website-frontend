"use client";

import React, { useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Mail } from 'lucide-react';

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

      <div className="flex-grow w-full px-6 md:px-16 lg:px-24 py-12">

          <div className="border-b border-gray-200 pb-8 mb-8 text-center">
            <p className="text-sm text-gray-500 italic">Last Updated: 25 June 2026</p>
            <p className="mt-4 text-gray-800 font-bold text-lg">
              These Terms govern your use of Investate India. By registering or using the platform, you agree to comply with these Terms.
            </p>
          </div>

          <section>
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mt-10 mb-2 text-center">1. Platform Nature</h2>
            <p className="text-gray-600 mb-6 text-center max-w-4xl mx-auto">
              Investate India is a technology platform only.
            </p>
            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              <div className="bg-green-50 p-6 rounded-xl border border-green-200 shadow-sm text-left">
                <h3 className="font-bold text-green-800 mb-3 text-lg">We Do:</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2"><span className="text-green-600 font-bold">✓</span> Display verified property listings</li>
                  <li className="flex items-start gap-2"><span className="text-green-600 font-bold">✓</span> Provide dashboards for users</li>
                  <li className="flex items-start gap-2"><span className="text-green-600 font-bold">✓</span> Enable direct communication</li>
                </ul>
              </div>
              <div className="bg-red-50 p-6 rounded-xl border border-red-200 shadow-sm text-left">
                <h3 className="font-bold text-red-800 mb-3 text-lg">We DO NOT:</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2"><span className="text-red-600 font-bold">✕</span> Sell properties directly</li>
                  <li className="flex items-start gap-2"><span className="text-red-600 font-bold">✕</span> Act as broker/agent</li>
                  <li className="flex items-start gap-2"><span className="text-red-600 font-bold">✕</span> Handle financial transactions</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="mt-12">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6 text-center">2. User Accounts</h2>
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm max-w-4xl mx-auto">
              <p className="text-gray-600 mb-3 text-left">Users must:</p>
              <ul className="list-disc pl-5 space-y-2 text-gray-600 marker:text-orange-500 text-left">
                <li>Provide accurate information during registration.</li>
                <li>Keep login credentials secure and confidential.</li>
              </ul>
            </div>
          </section>

          <section className="mt-12">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6 text-center">3. Limitation of Liability</h2>
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm max-w-4xl mx-auto">
              <p className="text-gray-600 mb-3 text-left">Investate India is <strong>not liable</strong> for:</p>
              <ul className="list-disc pl-5 space-y-2 text-gray-600 marker:text-orange-500 mb-4 text-left">
                <li>Investment losses.</li>
                <li>Property disputes or legal battles.</li>
                <li>Builder defaults or bankruptcy.</li>
                <li>Construction delays.</li>
              </ul>
              <p className="font-semibold text-gray-800 border-l-4 border-orange-500 pl-4 py-2 bg-gray-50 rounded-r-lg text-left">Your use of the platform is entirely at your own risk.</p>
            </div>
          </section>

          <section className="mt-12 bg-orange-50 p-4 sm:p-6 rounded-xl border border-orange-100 text-center max-w-4xl mx-auto w-full">
            <h2 className="text-xl font-bold text-gray-900 mb-2 flex items-center justify-center gap-2"><Mail className="w-5 h-5" />Contact Us</h2>
            <p className="text-gray-600 mb-4 text-sm sm:text-base">
              If you have any questions about these Terms, please contact us at:
            </p>
            <a href="mailto:investateindia.business@gmail.com" className="inline-flex items-center justify-center px-4 sm:px-6 py-2.5 sm:py-3 border border-transparent text-sm sm:text-base font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 transition-colors max-w-full break-all whitespace-normal">
              investateindia.business@gmail.com
            </a>
          </section>
      </div>

      <Footer />
    </div>
  );
}
