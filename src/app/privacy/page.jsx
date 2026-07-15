"use client";

import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Shield, Eye, Share2, Lock, UserCheck, Globe, Mail, ChevronDown, ChevronUp } from 'lucide-react';

const SECTIONS = [
  {
    id: 1,
    icon: <Eye className="w-5 h-5" />,
    title: "Information We Collect",
    content: (
      <div className="space-y-6">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
            <h4 className="font-semibold text-gray-800 mb-3">Personal Identification</h4>
            <ul className="space-y-2 text-gray-600 text-sm">
              <li className="flex gap-2"><span className="text-[#D48035] font-bold mt-0.5">›</span>Full name, email address, and contact number</li>
              <li className="flex gap-2"><span className="text-[#D48035] font-bold mt-0.5">›</span>Country of residence and nationality</li>
              <li className="flex gap-2"><span className="text-[#D48035] font-bold mt-0.5">›</span>Government-issued identification (for KYC)</li>
              <li className="flex gap-2"><span className="text-[#D48035] font-bold mt-0.5">›</span>Account type (Investor / Builder / Service Provider)</li>
            </ul>
          </div>
          <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
            <h4 className="font-semibold text-gray-800 mb-3">Platform & Technical Data</h4>
            <ul className="space-y-2 text-gray-600 text-sm">
              <li className="flex gap-2"><span className="text-[#D48035] font-bold mt-0.5">›</span>IP address, browser type, and device information</li>
              <li className="flex gap-2"><span className="text-[#D48035] font-bold mt-0.5">›</span>Pages visited and time spent on the platform</li>
              <li className="flex gap-2"><span className="text-[#D48035] font-bold mt-0.5">›</span>Cookies and session identifiers</li>
              <li className="flex gap-2"><span className="text-[#D48035] font-bold mt-0.5">›</span>Log data and activity timestamps</li>
            </ul>
          </div>
          <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
            <h4 className="font-semibold text-gray-800 mb-3">Financial & Professional Information</h4>
            <ul className="space-y-2 text-gray-600 text-sm">
              <li className="flex gap-2"><span className="text-[#D48035] font-bold mt-0.5">›</span>Investment preferences and financial capacity range</li>
              <li className="flex gap-2"><span className="text-[#D48035] font-bold mt-0.5">›</span>Occupation and source of funds (for compliance)</li>
              <li className="flex gap-2"><span className="text-[#D48035] font-bold mt-0.5">›</span>Builder credentials, certifications, and project portfolios</li>
            </ul>
          </div>
          <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
            <h4 className="font-semibold text-gray-800 mb-3">Communications</h4>
            <ul className="space-y-2 text-gray-600 text-sm">
              <li className="flex gap-2"><span className="text-[#D48035] font-bold mt-0.5">›</span>Messages sent through the platform</li>
              <li className="flex gap-2"><span className="text-[#D48035] font-bold mt-0.5">›</span>Support queries and feedback submissions</li>
              <li className="flex gap-2"><span className="text-[#D48035] font-bold mt-0.5">›</span>Email correspondence related to your account</li>
            </ul>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 2,
    icon: <UserCheck className="w-5 h-5" />,
    title: "How We Use Your Information",
    content: (
      <div className="space-y-4 text-gray-600">
        <p>We process your personal data only for legitimate purposes directly related to the operation of our platform:</p>
        <div className="grid sm:grid-cols-2 gap-3">
          {[
            "Create, verify, and manage your account",
            "Conduct KYC/AML checks as required by applicable law",
            "Connect global investors with verified builders",
            "Process membership subscriptions and platform fees",
            "Send transactional communications (account alerts, document updates)",
            "Improve platform functionality through anonymised analytics",
            "Comply with legal obligations and respond to regulatory requests",
            "Detect and prevent fraudulent or unauthorised activity",
          ].map((item, i) => (
            <div key={i} className="flex gap-3 bg-gray-50 rounded-lg p-3 border border-gray-100">
              <span className="text-[#D48035] font-bold text-lg leading-none mt-0.5">›</span>
              <span className="text-sm">{item}</span>
            </div>
          ))}
        </div>
        <p className="text-sm bg-blue-50 border border-blue-100 rounded-lg p-4 mt-2">
          <strong>Legal basis (GDPR Art. 6):</strong> Contract performance, legal obligation, legitimate interests, and — where required — explicit consent.
        </p>
      </div>
    ),
  },
  {
    id: 3,
    icon: <Share2 className="w-5 h-5" />,
    title: "Information Sharing & Disclosure",
    content: (
      <div className="space-y-4 text-gray-600">
        <p>We do not sell, rent, or trade your personal information. We may share data only in the following circumstances:</p>
        <div className="space-y-3">
          {[
            { label: "Between platform participants", desc: "Contact details are shared between investors and builders only upon a mutual, confirmed expression of interest." },
            { label: "Service providers", desc: "Trusted third-party vendors (cloud hosting, payment processors, analytics) under strict data processing agreements." },
            { label: "Legal compliance", desc: "When required by applicable law, court order, or regulatory authority (e.g., FEMA, RBI, SEBI guidelines for NRI investments)." },
            { label: "Business transfers", desc: "In the event of a merger, acquisition, or asset sale, user data may be transferred subject to equivalent privacy protections." },
          ].map((item, i) => (
            <div key={i} className="flex gap-4 p-4 border border-gray-200 rounded-xl bg-white">
              <div className="w-8 h-8 rounded-full bg-[#D48035]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-[#D48035] font-bold text-sm">{i + 1}</span>
              </div>
              <div>
                <p className="font-semibold text-gray-800 mb-1">{item.label}</p>
                <p className="text-sm">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="bg-[#1F2937] text-white rounded-xl p-4 text-sm font-medium">
          We never sell your personal data to advertisers, data brokers, or unrelated third parties.
        </div>
      </div>
    ),
  },
  {
    id: 4,
    icon: <Lock className="w-5 h-5" />,
    title: "Data Security",
    content: (
      <div className="space-y-4 text-gray-600 text-sm">
        <p>We implement industry-standard technical and organisational measures to protect your data:</p>
        <div className="grid sm:grid-cols-3 gap-3">
          {[
            { t: "Encryption", d: "All data in transit is protected via TLS 1.2+. Sensitive data at rest is encrypted." },
            { t: "Access Control", d: "Role-based access ensures staff see only what is necessary for their function." },
            { t: "Firebase Auth", d: "Authentication is handled by Google Firebase — industry-leading identity management." },
          ].map((c, i) => (
            <div key={i} className="bg-gray-50 border border-gray-100 rounded-xl p-4">
              <p className="font-semibold text-gray-800 mb-1">{c.t}</p>
              <p>{c.d}</p>
            </div>
          ))}
        </div>
        <p>While we take every reasonable precaution, no internet transmission is 100% secure. You are responsible for maintaining the confidentiality of your login credentials.</p>
      </div>
    ),
  },
  {
    id: 5,
    icon: <Globe className="w-5 h-5" />,
    title: "International Data Transfers",
    content: (
      <p className="text-gray-600 text-sm leading-relaxed">
        Investate India serves a global NRI audience. Your data may be stored and processed in India, the United States, or other countries where our service providers operate. Wherever data is transferred, we ensure adequate safeguards — including Standard Contractual Clauses or equivalent mechanisms — are in place in compliance with applicable data protection laws.
      </p>
    ),
  },
  {
    id: 6,
    icon: <UserCheck className="w-5 h-5" />,
    title: "Your Rights",
    content: (
      <div className="space-y-4 text-gray-600">
        <p className="text-sm">Depending on your jurisdiction, you may have the following rights regarding your personal data:</p>
        <div className="grid sm:grid-cols-2 gap-3 text-sm">
          {[
            { r: "Right of Access", d: "Request a copy of the personal data we hold about you." },
            { r: "Right to Rectification", d: "Request correction of inaccurate or incomplete data." },
            { r: "Right to Erasure", d: "Request deletion of your data where legally permissible." },
            { r: "Right to Portability", d: "Receive your data in a structured, machine-readable format." },
            { r: "Right to Object", d: "Object to processing based on legitimate interests." },
            { r: "Right to Withdraw Consent", d: "Where processing is based on consent, you may withdraw it at any time." },
          ].map((item, i) => (
            <div key={i} className="p-4 border border-gray-200 rounded-xl bg-white">
              <p className="font-semibold text-gray-800 mb-1">{item.r}</p>
              <p>{item.d}</p>
            </div>
          ))}
        </div>
        <p className="text-sm">To exercise any right, contact us at <a href="mailto:investateindia.business@gmail.com" className="text-[#D48035] hover:underline font-medium">investateindia.business@gmail.com</a>. We will respond within 30 days.</p>
      </div>
    ),
  },
  {
    id: 7,
    icon: <Shield className="w-5 h-5" />,
    title: "Cookies & Tracking",
    content: (
      <div className="text-gray-600 text-sm space-y-3">
        <p>We use cookies and similar tracking technologies to operate and improve the platform. Types include:</p>
        <div className="grid sm:grid-cols-3 gap-3">
          {[
            { t: "Essential", d: "Required for login, session management, and security." },
            { t: "Functional", d: "Remember your preferences and settings." },
            { t: "Analytics", d: "Understand how users interact with the platform (anonymised)." },
          ].map((c, i) => (
            <div key={i} className="bg-gray-50 border border-gray-100 rounded-xl p-4">
              <p className="font-semibold text-gray-800 mb-1">{c.t}</p>
              <p>{c.d}</p>
            </div>
          ))}
        </div>
        <p>You can control cookies through your browser settings. Disabling essential cookies may impair platform functionality.</p>
      </div>
    ),
  },
  {
    id: 8,
    icon: <Shield className="w-5 h-5" />,
    title: "Data Retention",
    content: (
      <p className="text-gray-600 text-sm leading-relaxed">
        We retain personal data for as long as your account is active or as needed to provide services. After account closure, data may be retained for up to <strong>7 years</strong> for legal, regulatory, and audit purposes. When data is no longer required, it is securely deleted or anonymised.
      </p>
    ),
  },
  {
    id: 9,
    icon: <Shield className="w-5 h-5" />,
    title: "Children's Privacy",
    content: (
      <p className="text-gray-600 text-sm leading-relaxed">
        Investate India is not intended for individuals under the age of 18. We do not knowingly collect personal data from minors. If we become aware that a minor has registered, we will promptly delete their account and associated data.
      </p>
    ),
  },
  {
    id: 10,
    icon: <Shield className="w-5 h-5" />,
    title: "Changes to This Policy",
    content: (
      <p className="text-gray-600 text-sm leading-relaxed">
        We may update this Privacy Policy periodically to reflect changes in our practices, technology, or legal requirements. We will notify registered users of material changes via email or an in-platform notification. Continued use of the platform after such notification constitutes acceptance of the revised Policy.
      </p>
    ),
  },
];

function AccordionSection({ section }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden mb-3 bg-white shadow-sm">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[#D48035]/10 flex items-center justify-center text-[#D48035] flex-shrink-0">
            {section.icon}
          </div>
          <span className="font-semibold text-gray-900">
            <span className="text-[#D48035] mr-2">{section.id}.</span>
            {section.title}
          </span>
        </div>
        {open ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
      </button>
      {open && (
        <div className="px-6 pb-6 border-t border-gray-100 pt-4">
          {section.content}
        </div>
      )}
    </div>
  );
}

export default function PrivacyPolicy() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />

      {/* Hero */}
      <div className="bg-[#1F2937] text-white py-16 md:py-24 relative overflow-hidden mt-[2rem] md:mt-[4rem]">
        <div className="absolute inset-0 bg-gradient-to-br from-[#D48035]/20 via-transparent to-[#D48035]/5 pointer-events-none" />
        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 text-white/80 text-xs font-medium px-4 py-1.5 rounded-full mb-6 border border-white/20">
            <Shield className="w-3.5 h-3.5" /> Legal Document
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            How Investate India collects, uses, and protects your personal information across our global platform.
          </p>
          <p className="text-sm text-gray-400 mt-4">Effective date: 25 June 2026 · Applies to all users globally</p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-grow container mx-auto px-4 md:px-8 lg:px-16 py-12 max-w-4xl">

        {/* Intro */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-8 shadow-sm">
          <p className="text-gray-700 leading-relaxed">
            Investate India ("<strong>we</strong>", "<strong>us</strong>", or "<strong>our</strong>") is a global digital platform connecting NRI investors with verified real estate builders and service providers in India. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform. Please read it carefully. If you do not agree with the terms of this policy, please do not access the platform.
          </p>
        </div>

        {/* Accordion */}
        <div>
          {SECTIONS.map((s) => (
            <AccordionSection key={s.id} section={s} />
          ))}
        </div>

        {/* Contact */}
        <div className="mt-10 bg-[#1F2937] text-white rounded-2xl p-8 text-center">
          <Mail className="w-10 h-10 mx-auto mb-3 text-[#D48035]" />
          <h2 className="text-xl font-bold mb-2">Privacy Questions?</h2>
          <p className="text-gray-300 text-sm mb-5">
            Contact our Data Protection team and we will respond within 30 business days.
          </p>
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
