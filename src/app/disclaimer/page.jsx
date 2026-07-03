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

      <div className="flex-grow w-full px-6 md:px-16 lg:px-24 py-12">

        <div className="border-b border-gray-200 pb-8 mb-8 text-center">
          <p className="text-sm text-gray-500 italic mb-4">Last Updated: 25 June 2026</p>
          <p className="text-gray-800 font-bold text-lg leading-relaxed">
            Investate India provides a digital platform to connect investors and builders. <br />
            <span className="text-orange-600">We are not a real estate broker, agent, or developer.</span>
          </p>
        </div>

        <section>
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mt-10 mb-6 text-center flex items-center justify-center gap-2">
            <FileWarning className="w-6 h-6 text-gray-700" />1. No Investment Advice
          </h2>
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm max-w-4xl mx-auto">
            <p className="text-gray-600 leading-relaxed text-left">
              Information provided is for general informational purposes only and does not constitute financial or legal advice.
            </p>
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6 text-center flex items-center justify-center gap-2">
            <ShieldAlert className="w-6 h-6 text-red-600" />2. No Guarantees
          </h2>
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm max-w-4xl mx-auto">
            <p className="text-gray-600 mb-3 text-left">We provide no guarantees regarding:</p>
            <ul className="list-disc pl-5 space-y-2 text-gray-600 marker:text-orange-500 text-left">
              <li>Financial returns (ROI) or profit.</li>
              <li>Builder reliability or solvency.</li>
              <li>Timely project completion.</li>
            </ul>
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6 text-center flex items-center justify-center gap-2">
            <SearchCheck className="w-6 h-6 text-blue-600" />3. Independent Verification Required
          </h2>
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm max-w-4xl mx-auto">
            <p className="text-gray-600 leading-relaxed text-left">
              It is the sole responsibility of the user to independently verify all details before committing.
            </p>
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6 text-center flex items-center justify-center gap-2">
            <Handshake className="w-6 h-6 text-orange-600" />4. Limitation of Liability & Investment Funds
          </h2>
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm max-w-4xl mx-auto">
            <p className="text-gray-600 leading-relaxed text-left">
              <strong>Any funds or capital you invest are entirely at your own risk.</strong> Investate India is not responsible for the money you invest, and we assume no liability or responsibility for any loss of capital, investment depreciation, or financial damages resulting from your investment choices. All transactions, agreements, and payments are directly between you and the builder.
            </p>
          </div>
        </section>

        <section className="mt-12 bg-orange-50 p-6 rounded-xl border border-orange-100 max-w-4xl mx-auto">
          <h2 className="text-xl font-bold text-orange-800 mb-3 flex items-center justify-center gap-2">
            <TrendingUp className="w-6 h-6" />Risk Notice
          </h2>
          <p className="text-orange-900/80 leading-relaxed text-center">
            Real estate investments involve inherent risks. Please invest at your own discretion.
          </p>
        </section>
      </div>
      <Footer />
    </div>
  );
}
