"use client";

import React, { useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ShieldAlert, TrendingUp, SearchCheck, Handshake, FileWarning, Globe, Scale, Mail } from 'lucide-react';

const CARDS = [
  {
    icon: <FileWarning className="w-6 h-6" />,
    color: "text-orange-600 bg-orange-50 border-orange-100",
    title: "No Investment Advice",
    body: "All information, project listings, builder profiles, and data available on Investate India are provided for general informational purposes only. Nothing on this platform constitutes financial, legal, tax, or investment advice. You should consult a qualified independent financial adviser before making any investment decision.",
  },
  {
    icon: <ShieldAlert className="w-6 h-6" />,
    color: "text-red-600 bg-red-50 border-red-100",
    title: "No Guarantees or Warranties",
    body: "Investate India makes no representations or warranties of any kind, express or implied, regarding the accuracy, completeness, or reliability of any information on the platform, including project details, pricing, timelines, or builder credentials. We do not guarantee any financial return, rental yield, capital appreciation, or project delivery.",
  },
  {
    icon: <SearchCheck className="w-6 h-6" />,
    color: "text-blue-600 bg-blue-50 border-blue-100",
    title: "Independent Verification Required",
    body: "While we conduct a verification process for listed builders, this verification does not constitute an audit, endorsement, or guarantee. It is the sole responsibility of each user to conduct independent due diligence — including legal, financial, and technical review — before committing to any investment or agreement.",
  },
  {
    icon: <Handshake className="w-6 h-6" />,
    color: "text-[#D48035] bg-[#FFF7ED] border-[#FFB068]/30",
    title: "Facilitator Role Only",
    body: "Investate India acts solely as a digital facilitator connecting investors with builders. We are not a party to any transaction, agreement, or contract between users. All negotiations, contracts, and fund transfers occur directly between the investor and the builder, without our involvement.",
  },
  {
    icon: <TrendingUp className="w-6 h-6" />,
    color: "text-purple-600 bg-purple-50 border-purple-100",
    title: "Investment Risk",
    body: "Real estate investment involves inherent risks including, but not limited to, market fluctuations, regulatory changes, liquidity constraints, builder insolvency, construction delays, and legal encumbrances. Past performance of any builder or project does not guarantee future results. You may lose part or all of your invested capital.",
  },
  {
    icon: <Globe className="w-6 h-6" />,
    color: "text-teal-600 bg-teal-50 border-teal-100",
    title: "Regulatory Compliance (NRI Investors)",
    body: "NRI investors are responsible for ensuring their investments comply with all applicable laws in their country of residence and in India, including FEMA, RBI guidelines, and any tax reporting obligations. Investate India does not provide legal, tax, or regulatory advice for cross-border investments.",
  },
  {
    icon: <Scale className="w-6 h-6" />,
    color: "text-gray-700 bg-gray-50 border-gray-200",
    title: "Limitation of Liability",
    body: "To the maximum extent permitted by law, Investate India, its affiliates, officers, and employees shall not be liable for any direct, indirect, incidental, consequential, or punitive damages arising from your use of the platform, any investment decision made, or any failure or default by a builder or service provider listed on the platform.",
  },
  {
    icon: <ShieldAlert className="w-6 h-6" />,
    color: "text-indigo-600 bg-indigo-50 border-indigo-100",
    title: "Third-Party Links & Content",
    body: "Our platform may contain links to third-party websites, reports, or resources. These are provided for convenience only. Investate India does not control or endorse such third-party content and is not responsible for any loss or damage that may arise from your access to or reliance on such external sources.",
  },
];

export default function Disclaimer() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />

      {/* Hero */}
      <div className="bg-[#1F2937] text-white py-16 md:py-24 relative overflow-hidden mt-[2rem] md:mt-[4rem]">
        <div className="absolute inset-0 bg-gradient-to-br from-[#D48035]/20 via-transparent to-[#D48035]/5 pointer-events-none" />
        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 text-white/80 text-xs font-medium px-4 py-1.5 rounded-full mb-6 border border-white/20">
            <ShieldAlert className="w-3.5 h-3.5" /> Legal Document
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Disclaimer</h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Important disclosures regarding the nature of Investate India's platform, services, and the risks associated with real estate investment.
          </p>
          <p className="text-sm text-gray-400 mt-4">Effective date: 25 June 2026 · Applies to all users globally</p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-grow container mx-auto px-4 md:px-8 lg:px-16 py-12 max-w-5xl">

        {/* Summary banner */}
        <div className="bg-white border-l-4 border-[#D48035] rounded-r-2xl p-6 mb-10 shadow-sm flex gap-4 items-start">
          <ShieldAlert className="w-7 h-7 text-[#D48035] flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-gray-900 text-lg mb-1">Platform Nature</p>
            <p className="text-gray-600 text-sm leading-relaxed">
              Investate India is a <strong>technology-enabled marketplace</strong>, not a real estate broker, financial institution, investment adviser, or developer. We connect verified builders with global NRI investors. We do not hold funds, execute transactions, or provide investment recommendations.
            </p>
          </div>
        </div>

        {/* Grid of cards */}
        <div className="grid md:grid-cols-2 gap-5 mb-10">
          {CARDS.map((card, i) => (
            <div key={i} className={`border rounded-2xl p-6 ${card.color.split(' ').slice(1).join(' ')}`}>
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${card.color.split(' ')[1]} border ${card.color.split(' ')[2]}`}>
                <span className={card.color.split(' ')[0]}>{card.icon}</span>
              </div>
              <h3 className="font-bold text-gray-900 text-base mb-2">{card.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{card.body}</p>
            </div>
          ))}
        </div>

        {/* Risk Notice */}
        <div className="bg-[#1F2937] text-white rounded-2xl p-8 mb-10">
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="w-6 h-6 text-[#D48035]" />
            <h2 className="text-xl font-bold">Risk Notice</h2>
          </div>
          <p className="text-gray-300 text-sm leading-relaxed mb-4">
            Real estate investment, particularly in cross-border markets, carries significant risks. By using Investate India, you acknowledge and accept that:
          </p>
          <ul className="space-y-2 text-sm text-gray-300">
            {[
              "You have read and understood this Disclaimer in full.",
              "Investment decisions are made entirely at your own discretion and risk.",
              "You will seek independent professional advice before investing.",
              "Investate India bears no responsibility for the outcome of any investment.",
              "Market conditions, regulations, and builder circumstances can change without notice.",
            ].map((item, i) => (
              <li key={i} className="flex gap-2 items-start">
                <span className="text-[#D48035] font-bold mt-0.5">›</span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div className="bg-white border border-gray-200 rounded-2xl p-8 text-center shadow-sm">
          <Mail className="w-10 h-10 mx-auto mb-3 text-[#D48035]" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Questions About This Disclaimer?</h2>
          <p className="text-gray-500 text-sm mb-5">Contact us and our team will respond within 5 business days.</p>
          <a
            href="mailto:investateindia.business@gmail.com"
            className="inline-block bg-[#D48035] hover:bg-[#B45309] text-white font-semibold px-8 py-3 rounded-xl transition-colors"
          >
            investateindia.business@gmail.com
          </a>
        </div>
      </div>

      <Footer />
    </div>
  );
}
