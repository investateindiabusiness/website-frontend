"use client";

import React, { useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ShieldAlert, SearchCheck, Handshake, FileWarning, TrendingUp } from 'lucide-react';

export default function Disclaimer() {
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
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Disclaimer</h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">Important information regarding the nature of our platform and services.</p>
        </div>
      </div>

      <div className="flex-grow container mx-auto px-4 py-12 -mt-10 relative z-20">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-xl border border-gray-100 p-8 md:p-12">
          <div className="border-b border-gray-100 pb-6 mb-8">
            <p className="text-gray-700 font-medium text-lg leading-relaxed">
              Investate India provides a digital platform to connect investors and builders. <br />
              <span className="text-orange-600 font-bold">We are not a real estate broker, agent, or developer.</span>
            </p>
          </div>

          <section>
            <h2 className={sectionTitleStyle}><FileWarning className="w-6 h-6 text-gray-700" />1. No Investment Advice</h2>
            <p className={paragraphStyle}>Information provided is for general informational purposes only and does not constitute financial or legal advice.</p>
          </section>

          <section>
            <h2 className={sectionTitleStyle}><ShieldAlert className="w-6 h-6 text-red-600" />2. No Guarantees</h2>
            <ul className={listStyle}>
              <li>Financial returns (ROI) or profit.</li>
              <li>Builder reliability or solvency.</li>
              <li>Timely project completion.</li>
            </ul>
          </section>

          <section>
            <h2 className={sectionTitleStyle}><SearchCheck className="w-6 h-6 text-blue-600" />3. Independent Verification Required</h2>
            <p className={paragraphStyle}>It is the sole responsibility of the user to independently verify all details before committing.</p>
          </section>

          <section className="mt-10 bg-orange-50 p-6 rounded-xl border border-orange-100">
            <h2 className="text-xl font-bold text-orange-800 mb-3 flex items-center gap-2"><TrendingUp className="w-6 h-6" />Risk Notice</h2>
            <p className="text-orange-900/80 leading-relaxed">Real estate investments involve inherent risks. Please invest at your own discretion.</p>
          </section>
        </div>
      </div>
      <Footer />
    </div>
  );
}
