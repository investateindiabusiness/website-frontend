"use client";

import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { RefreshCcw, XCircle, Clock, CreditCard, AlertTriangle, Mail, ChevronDown, ChevronUp, CheckCircle } from 'lucide-react';

const SCENARIOS = [
  {
    type: "Full Refund Eligible",
    color: "bg-green-50 border-green-200",
    badge: "bg-green-100 text-green-800",
    icon: <CheckCircle className="w-5 h-5 text-green-600" />,
    items: [
      "Technical failure during payment resulting in a failed transaction, where fees were debited but no access was granted.",
      "Duplicate payment charged due to a system error on our end.",
      "Account registration rejected by our team after payment (builder/service provider verification failure).",
    ],
  },
  {
    type: "Partial Refund (Pro-rata)",
    color: "bg-yellow-50 border-yellow-200",
    badge: "bg-yellow-100 text-yellow-800",
    icon: <RefreshCcw className="w-5 h-5 text-yellow-600" />,
    items: [
      "Cancellation request submitted within the first 7 days of a new annual membership — a pro-rata refund for unused months will be issued, minus any processing fees.",
      "Platform discontinuation initiated by Investate India — unused subscription time will be refunded.",
    ],
  },
  {
    type: "No Refund",
    color: "bg-red-50 border-red-200",
    badge: "bg-red-100 text-red-800",
    icon: <XCircle className="w-5 h-5 text-red-600" />,
    items: [
      "Cancellation requests submitted after 7 days of the membership start date.",
      "Memberships where the user has actively used platform features (dashboard access, builder introductions, project views).",
      "Accounts suspended due to violation of Terms & Conditions.",
      "Change of mind after purchase where the platform has been accessed.",
      "Investments made directly with builders — these are outside our scope entirely.",
    ],
  },
];

const PROCESS_STEPS = [
  { icon: <Mail className="w-5 h-5" />, title: "Submit Request", desc: "Email investateindia.business@gmail.com with your registered email, order reference, and reason for refund." },
  { icon: <Clock className="w-5 h-5" />, title: "Review (3–5 Business Days)", desc: "Our team reviews the request against the refund eligibility criteria outlined in this policy." },
  { icon: <CreditCard className="w-5 h-5" />, title: "Decision Communicated", desc: "You will receive an email confirming approval or rejection of the refund request, with reasons." },
  { icon: <RefreshCcw className="w-5 h-5" />, title: "Refund Processed (7–14 Business Days)", desc: "Approved refunds are processed to the original payment method within 7–14 business days, subject to bank processing times." },
];

function AccordionSection({ title, icon, content, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden mb-3 bg-white shadow-sm">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[#D48035]/10 flex items-center justify-center text-[#D48035] flex-shrink-0">
            {icon}
          </div>
          <span className="font-semibold text-gray-900">{title}</span>
        </div>
        {open ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
      </button>
      {open && (
        <div className="px-6 pb-6 border-t border-gray-100 pt-4">
          {content}
        </div>
      )}
    </div>
  );
}

export default function RefundCancellation() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />

      {/* Hero */}
      <div className="bg-[#1F2937] text-white py-16 md:py-24 relative overflow-hidden mt-[2rem] md:mt-[4rem]">
        <div className="absolute inset-0 bg-gradient-to-br from-[#D48035]/20 via-transparent to-[#D48035]/5 pointer-events-none" />
        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 text-white/80 text-xs font-medium px-4 py-1.5 rounded-full mb-6 border border-white/20">
            <RefreshCcw className="w-3.5 h-3.5" /> Legal Document
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Refund & Cancellation Policy</h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Clear guidelines on membership cancellations, refund eligibility, and how to raise a request.
          </p>
          <p className="text-sm text-gray-400 mt-4">Effective date: 25 June 2026 · Applies to all paying members globally</p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-grow container mx-auto px-4 md:px-8 lg:px-16 py-12 max-w-4xl">

        {/* Key commitment */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-8 shadow-sm flex gap-4 items-start">
          <RefreshCcw className="w-7 h-7 text-[#D48035] flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-gray-900 text-lg mb-1">Our Commitment to Fairness</p>
            <p className="text-gray-600 text-sm leading-relaxed">
              Investate India charges membership fees for access to our verified builder network and investment platform tools. This policy outlines the circumstances under which refunds are granted. <strong>All investment amounts paid directly to builders are outside our control and are not refundable through us.</strong>
            </p>
          </div>
        </div>

        {/* Refund Scenarios */}
        <h2 className="text-xl font-bold text-gray-900 mb-4">Refund Eligibility</h2>
        <div className="space-y-4 mb-10">
          {SCENARIOS.map((s, i) => (
            <div key={i} className={`border rounded-2xl p-6 ${s.color}`}>
              <div className="flex items-center gap-3 mb-4">
                {s.icon}
                <span className={`text-xs font-bold px-3 py-1 rounded-full ${s.badge}`}>{s.type}</span>
              </div>
              <ul className="space-y-2 text-sm text-gray-700">
                {s.items.map((item, j) => (
                  <li key={j} className="flex gap-2 items-start">
                    <span className="font-bold mt-0.5 text-gray-500">›</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Cancellation process */}
        <h2 className="text-xl font-bold text-gray-900 mb-4">How to Cancel Your Membership</h2>
        <AccordionSection
          defaultOpen
          title="Cancellation Process"
          icon={<XCircle className="w-5 h-5" />}
          content={
            <div className="text-sm text-gray-600 space-y-4">
              <p>You may cancel your Investate India membership at any time. To cancel:</p>
              <ol className="space-y-3">
                {[
                  "Log into your account dashboard and navigate to Account Settings → Membership.",
                  "Select 'Cancel Membership' and confirm your decision.",
                  "Alternatively, email us at investateindia.business@gmail.com with the subject line 'Membership Cancellation' and your registered email address.",
                  "You will receive a cancellation confirmation within 2 business days.",
                ].map((step, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="w-6 h-6 rounded-full bg-[#D48035]/10 text-[#D48035] font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">{i + 1}</span>
                    {step}
                  </li>
                ))}
              </ol>
              <p className="bg-gray-50 border border-gray-100 rounded-lg p-4">
                <strong>Access after cancellation:</strong> Your account access remains active until the end of your current billing period. After that, your account will revert to a free read-only plan.
              </p>
            </div>
          }
        />

        {/* Refund process */}
        <h2 className="text-xl font-bold text-gray-900 mb-4 mt-8">Refund Request Process</h2>
        <div className="grid sm:grid-cols-2 gap-4 mb-10">
          {PROCESS_STEPS.map((step, i) => (
            <div key={i} className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm flex gap-4 items-start">
              <div className="w-10 h-10 rounded-full bg-[#D48035]/10 flex items-center justify-center text-[#D48035] flex-shrink-0">
                {step.icon}
              </div>
              <div>
                <p className="font-semibold text-gray-900 text-sm mb-1">Step {i + 1}: {step.title}</p>
                <p className="text-gray-600 text-xs leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Additional FAQs */}
        <h2 className="text-xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
        <div className="space-y-3 mb-10">
          <AccordionSection
            title="Can I get a refund if I invested money in a project that underperformed?"
            icon={<AlertTriangle className="w-5 h-5" />}
            content={<p className="text-sm text-gray-600 leading-relaxed">No. Investate India does not facilitate or hold investment funds. All capital is transferred directly between you and the builder. Any disputes regarding investment returns must be resolved directly with the builder. We are not a party to that transaction and cannot process investment-related refunds.</p>}
          />
          <AccordionSection
            title="What if my refund takes longer than 14 business days?"
            icon={<Clock className="w-5 h-5" />}
            content={<p className="text-sm text-gray-600 leading-relaxed">If you have not received your refund within 14 business days of our approval email, please first check with your bank or card issuer — processing times vary. If the issue persists, contact us at investateindia.business@gmail.com with your refund reference number and we will investigate promptly.</p>}
          />
          <AccordionSection
            title="Is there a free trial before I commit to membership?"
            icon={<CheckCircle className="w-5 h-5" />}
            content={<p className="text-sm text-gray-600 leading-relaxed">During our launch phase, all verified users may enjoy a complimentary trial period at our discretion. After the trial expires, a paid membership is required to continue accessing premium platform features. We will notify you in advance before any trial ends.</p>}
          />
          <AccordionSection
            title="How do I get an invoice for my membership payment?"
            icon={<CreditCard className="w-5 h-5" />}
            content={<p className="text-sm text-gray-600 leading-relaxed">A tax invoice is automatically generated and emailed to your registered address upon successful payment. If you did not receive it, please check your spam folder or contact us at investateindia.business@gmail.com and we will resend it within 1 business day.</p>}
          />
        </div>

        {/* Contact */}
        <div className="bg-[#1F2937] text-white rounded-2xl p-8 text-center">
          <Mail className="w-10 h-10 mx-auto mb-3 text-[#D48035]" />
          <h2 className="text-xl font-bold mb-2">Need Help With a Refund?</h2>
          <p className="text-gray-300 text-sm mb-5">
            Our support team responds to all refund enquiries within 3 business days.
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
