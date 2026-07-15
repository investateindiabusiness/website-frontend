"use client";

import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { FileText, Users, Ban, AlertTriangle, Scale, Globe, ChevronDown, ChevronUp, Mail, ShieldCheck } from 'lucide-react';

const SECTIONS = [
  {
    id: 1,
    icon: <Globe className="w-5 h-5" />,
    title: "About the Platform",
    content: (
      <div className="space-y-4 text-sm text-gray-600">
        <p>Investate India is a global technology platform that facilitates connections between NRI investors and verified real estate developers, builders, and service providers in India. We operate as a <strong>marketplace and information intermediary</strong> — not as a real estate broker, financial adviser, or developer.</p>
        <div className="grid sm:grid-cols-2 gap-4 mt-4">
          <div className="bg-green-50 border border-green-200 rounded-xl p-5">
            <p className="font-bold text-green-800 mb-3 text-base">We Do:</p>
            <ul className="space-y-2 text-gray-700">
              {["Maintain a curated directory of verified builders", "Provide a dashboard for investors to discover opportunities", "Enable verified introductions between parties", "Offer tools for document submission and profile management"].map((i, k) => (
                <li key={k} className="flex gap-2"><span className="text-green-600 font-bold">✓</span>{i}</li>
              ))}
            </ul>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-xl p-5">
            <p className="font-bold text-red-800 mb-3 text-base">We Do NOT:</p>
            <ul className="space-y-2 text-gray-700">
              {["Sell, develop, or co-own properties", "Act as a registered broker or financial adviser", "Hold or transfer investment funds", "Guarantee returns, project timelines, or builder performance"].map((i, k) => (
                <li key={k} className="flex gap-2"><span className="text-red-600 font-bold">✕</span>{i}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 2,
    icon: <Users className="w-5 h-5" />,
    title: "Eligibility & Account Registration",
    content: (
      <div className="space-y-3 text-sm text-gray-600">
        <p>By registering, you represent and warrant that:</p>
        <ul className="space-y-2">
          {[
            "You are at least 18 years of age.",
            "You have the legal capacity to enter into a binding agreement.",
            "All information provided during registration is accurate, current, and complete.",
            "You will promptly update your information if it changes.",
            "You will not share your login credentials with any third party.",
            "You are not prohibited from accessing real estate investment platforms under the laws of your jurisdiction.",
          ].map((i, k) => (
            <li key={k} className="flex gap-2 bg-gray-50 rounded-lg p-3 border border-gray-100"><span className="text-[#D48035] font-bold">›</span>{i}</li>
          ))}
        </ul>
        <p className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-2"><strong>Note:</strong> We reserve the right to suspend or terminate any account found to contain false or misleading information.</p>
      </div>
    ),
  },
  {
    id: 3,
    icon: <FileText className="w-5 h-5" />,
    title: "Membership & Subscription",
    content: (
      <div className="space-y-3 text-sm text-gray-600">
        <p>Access to certain features of the platform requires an active paid membership. By subscribing:</p>
        <ul className="space-y-2">
          {[
            "You agree to pay the applicable membership fee at the time of purchase.",
            "Membership fees are billed in advance on an annual or such other period as designated.",
            "Membership is non-transferable and for your sole personal use.",
            "We reserve the right to modify membership pricing with reasonable prior notice.",
          ].map((i, k) => (
            <li key={k} className="flex gap-2 bg-gray-50 rounded-lg p-3 border border-gray-100"><span className="text-[#D48035] font-bold">›</span>{i}</li>
          ))}
        </ul>
        <p>Please refer to our <a href="/refund-cancellation" className="text-[#D48035] hover:underline font-medium">Refund & Cancellation Policy</a> for details on cancellations and refunds.</p>
      </div>
    ),
  },
  {
    id: 4,
    icon: <ShieldCheck className="w-5 h-5" />,
    title: "Builder Verification & Listings",
    content: (
      <div className="space-y-3 text-sm text-gray-600">
        <p>Builders who list on Investate India undergo a multi-step verification process. However:</p>
        <ul className="space-y-2">
          {[
            "Verification confirms identity and documentation at a point in time — it is not a continuous audit.",
            "We do not independently verify the accuracy of every project specification, pricing, or delivery timeline.",
            "Investate India does not endorse any specific builder or investment opportunity.",
            "Users must conduct their own due diligence before committing to any investment.",
          ].map((i, k) => (
            <li key={k} className="flex gap-2 bg-gray-50 rounded-lg p-3 border border-gray-100"><span className="text-[#D48035] font-bold">›</span>{i}</li>
          ))}
        </ul>
      </div>
    ),
  },
  {
    id: 5,
    icon: <Ban className="w-5 h-5" />,
    title: "Prohibited Conduct",
    content: (
      <div className="space-y-3 text-sm text-gray-600">
        <p>Users must not engage in the following on or through the platform:</p>
        <div className="grid sm:grid-cols-2 gap-3">
          {[
            "Posting false, misleading, or fraudulent information",
            "Impersonating any person or entity",
            "Circumventing the platform to arrange transactions offline to avoid fees",
            "Harassing, threatening, or abusing other users",
            "Uploading malicious code, spam, or automated bots",
            "Scraping platform data without written permission",
            "Using the platform for money laundering or unlawful activities",
            "Violating any applicable laws or regulations",
          ].map((i, k) => (
            <div key={k} className="flex gap-2 bg-red-50 border border-red-100 rounded-lg p-3">
              <span className="text-red-500 font-bold">✕</span>
              <span>{i}</span>
            </div>
          ))}
        </div>
        <p className="bg-[#1F2937] text-white rounded-lg p-4 mt-2">Violation of these prohibitions may result in immediate account suspension and legal action.</p>
      </div>
    ),
  },
  {
    id: 6,
    icon: <AlertTriangle className="w-5 h-5" />,
    title: "Limitation of Liability",
    content: (
      <div className="space-y-3 text-sm text-gray-600">
        <p>To the fullest extent permitted by applicable law, Investate India, its affiliates, officers, directors, employees, and agents shall not be liable for:</p>
        <ul className="space-y-2">
          {[
            "Any investment loss, capital depreciation, or financial damage arising from use of the platform.",
            "Builder defaults, insolvencies, project delays, or legal disputes.",
            "Inaccuracies in builder-provided project information.",
            "Indirect, incidental, consequential, or punitive damages of any kind.",
            "Interruption, suspension, or termination of platform services.",
            "Unauthorised access to your account if caused by your own negligence.",
          ].map((i, k) => (
            <li key={k} className="flex gap-2 bg-gray-50 rounded-lg p-3 border border-gray-100"><span className="text-[#D48035] font-bold">›</span>{i}</li>
          ))}
        </ul>
        <div className="bg-yellow-50 border-l-4 border-yellow-400 rounded-r-xl p-4 mt-2">
          <p className="font-semibold text-yellow-900">Your use of this platform and any investment decisions made are entirely at your own risk.</p>
        </div>
      </div>
    ),
  },
  {
    id: 7,
    icon: <FileText className="w-5 h-5" />,
    title: "Intellectual Property",
    content: (
      <p className="text-sm text-gray-600 leading-relaxed">
        All content on the Investate India platform — including but not limited to text, graphics, logos, icons, images, audio clips, and software — is the property of Investate India or its content suppliers and is protected by applicable intellectual property laws. You may not reproduce, distribute, modify, or create derivative works without our express written consent. Builder-submitted content remains the property of the respective builder, who grants Investate India a limited licence to display it on the platform.
      </p>
    ),
  },
  {
    id: 8,
    icon: <Scale className="w-5 h-5" />,
    title: "Governing Law & Dispute Resolution",
    content: (
      <div className="space-y-3 text-sm text-gray-600">
        <p>These Terms are governed by and construed in accordance with the laws of India. Any dispute arising out of or relating to these Terms shall be subject to the exclusive jurisdiction of the courts in Hyderabad, Telangana, India.</p>
        <p>Before initiating legal proceedings, you agree to attempt resolution through good-faith negotiation. If unresolved within 30 days, disputes may be referred to arbitration under the Arbitration and Conciliation Act, 1996.</p>
        <div className="bg-gray-50 border border-gray-100 rounded-xl p-4">
          <p className="font-semibold text-gray-800 mb-1">For NRI Users</p>
          <p>This platform facilitates investment under applicable FEMA and RBI guidelines. Users are responsible for ensuring their investment activities comply with the laws of their country of residence.</p>
        </div>
      </div>
    ),
  },
  {
    id: 9,
    icon: <FileText className="w-5 h-5" />,
    title: "Termination",
    content: (
      <p className="text-sm text-gray-600 leading-relaxed">
        Investate India reserves the right to suspend or permanently terminate any user account, at its sole discretion, for violation of these Terms, non-payment of membership fees, fraudulent activity, or any conduct detrimental to the platform or its community. Upon termination, your right to access the platform ceases immediately. Provisions relating to intellectual property, limitation of liability, and governing law shall survive termination.
      </p>
    ),
  },
  {
    id: 10,
    icon: <FileText className="w-5 h-5" />,
    title: "Modifications to Terms",
    content: (
      <p className="text-sm text-gray-600 leading-relaxed">
        We reserve the right to modify these Terms at any time. We will provide notice of material changes via email or a prominent notice on the platform at least 14 days before the changes take effect. Your continued use of the platform after the effective date constitutes acceptance of the revised Terms. If you do not agree to the revised Terms, you must cease using the platform and may request account closure.
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

export default function TermsAndConditions() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />

      {/* Hero */}
      <div className="bg-[#1F2937] text-white py-16 md:py-24 relative overflow-hidden mt-[2rem] md:mt-[4rem]">
        <div className="absolute inset-0 bg-gradient-to-br from-[#D48035]/20 via-transparent to-[#D48035]/5 pointer-events-none" />
        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 text-white/80 text-xs font-medium px-4 py-1.5 rounded-full mb-6 border border-white/20">
            <FileText className="w-3.5 h-3.5" /> Legal Document
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Terms & Conditions</h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            The agreement governing your use of the Investate India platform. Please read carefully before registering.
          </p>
          <p className="text-sm text-gray-400 mt-4">Effective date: 25 June 2026 · Applies to all users globally</p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-grow container mx-auto px-4 md:px-8 lg:px-16 py-12 max-w-4xl">

        {/* Intro */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-8 shadow-sm">
          <p className="text-gray-700 leading-relaxed text-sm">
            These Terms and Conditions ("<strong>Terms</strong>") constitute a legally binding agreement between you and Investate India (operated by BRV Technologies). By accessing, registering on, or using the platform in any way, you confirm that you have read, understood, and agree to be bound by these Terms and our <a href="/privacy" className="text-[#D48035] hover:underline">Privacy Policy</a>. If you do not agree, you must not use this platform.
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
          <h2 className="text-xl font-bold mb-2">Questions About These Terms?</h2>
          <p className="text-gray-300 text-sm mb-5">
            Our team is happy to clarify any aspect of this agreement.
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
