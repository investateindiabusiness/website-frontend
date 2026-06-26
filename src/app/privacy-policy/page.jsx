"use client";

import React, { useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Mail, Lock } from 'lucide-react';

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
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-orange-500/20 mb-6 text-orange-500">
             <Lock className="h-8 w-8" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">Learn how we collect, use, and protect your information.</p>
        </div>
      </div>

      <div className="flex-grow w-full px-6 md:px-16 lg:px-24 py-12">
          <div className="border-b border-gray-200 pb-8 mb-8 text-center">
            <p className="text-sm text-gray-500 italic">Last Updated: 25 June 2026</p>
          </div>

          <section>
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mt-10 mb-6 text-center">1. Information We Collect</h2>
            <div className="grid md:grid-cols-1 gap-6">

              {/* Card A */}
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">A. Account Information</h3>
                <p className="text-gray-600 mb-3">When you register or log in, we collect:</p>
                <ul className="list-disc pl-5 space-y-2 text-gray-600 marker:text-orange-500">
                  <li>Name, Email address, and Phone/WhatsApp number.</li>
                  <li>Country/location.</li>
                  <li>Account type (Investor/Builder).</li>
                </ul>
              </div>

            </div>
          </section>

          <section className="mt-12">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6 text-center">2. How We Use Your Information</h2>
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm max-w-4xl mx-auto">
              <p className="text-gray-600 mb-4 text-left">We use your information to:</p>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start gap-2"><span className="text-orange-500">•</span> Create and manage accounts</li>
                <li className="flex items-start gap-2"><span className="text-orange-500">•</span> Verify builders before publishing</li>
                <li className="flex items-start gap-2"><span className="text-orange-500">•</span> Respond to inquiries</li>
              </ul>
            </div>
          </section>

          <section className="mt-12 bg-orange-50 p-4 sm:p-6 rounded-xl border border-orange-100 text-center max-w-4xl mx-auto w-full">
            <h2 className="text-xl font-bold text-gray-900 mb-2 flex items-center justify-center gap-2"><Mail className="w-5 h-5" />Contact Us</h2>
            <p className="text-gray-600 mb-4 text-sm sm:text-base">If you have any questions, please contact us at:</p>
            <a href="mailto:investateindia.business@gmail.com" className="inline-flex items-center justify-center px-4 sm:px-6 py-2.5 sm:py-3 border border-transparent text-sm sm:text-base font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 transition-colors max-w-full break-all whitespace-normal">investateindia.business@gmail.com</a>
          </section>
      </div>
      <Footer />
    </div>
  );
}
