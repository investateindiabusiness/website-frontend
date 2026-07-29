"use client";

import React from "react";
import { Quote, Award } from "lucide-react";

const PAGE_CONTENT = {
  investor: {
    title: "Leadership & Trust",
    bio1: "Co-Founder Deepak Kavadia brings decades of experience connecting the global Indian community across the USA and India. Through Investate India, he helps build a trusted relationship network, bridging the gap between NRI investors and vetted opportunities.",
    bio2: "Co-Founders Pankaj Gupta and Atish Agarwal lead local operations in India, overseeing developer relations, project curation, and regulatory compliance to ensure every opportunity meets our highest standards.",
    quote:
      "Our focus is simple — build trust, transparency, and confidence by bridging global Indians with verified opportunities on the ground in India.",
  },

  builder: {
    title: "Global Network Leadership",
    bio1: "Co-Founder Deepak Kavadia helps premium Indian developers expand their global reach by connecting credible real estate projects directly with international NRI networks and strategic relationships in the USA.",
    bio2: "Based in India, Co-Founders Pankaj Gupta and Atish Agarwal run local operations, coordinating directly with developers and handling project acquisition, compliance auditing, and strategic structuring to ensure reliable delivery.",
    quote:
      "Connecting quality developers with global opportunities through verified ground support and international trust.",
  },

  serviceProvider: {
    title: "Trusted Partnership Network",
    bio1: "Co-Founder Deepak Kavadia leads the international outreach, building a reliable cross-border ecosystem of professional partners, compliance experts, and NRI clients.",
    bio2: "On the ground in India, Co-Founders Pankaj Gupta and Atish Agarwal collaborate with local legal, financial, and administrative service providers to oversee execution and project verification, ensuring hassle-free compliance for all stakeholders.",
    quote:
      "Strong cross-border partnerships combined with verified ground operations create secure, successful investment experiences.",
  },

  default: {
    title: "Leadership Vision",
    bio1: "Co-Founder Deepak Kavadia, Chairman of the NRI Federation, spearheads global relations and strategic international growth, bridging the gap between global Indian diaspora and verified opportunities.",
    bio2: "Co-Founders Pankaj Gupta and Atish Agarwal run local operations in India. They drive project curation, builder relations, and regulatory compliance to ensure stability, growth, and security.",
    quote:
      "Building a trusted gateway connecting global Indians with India's growth story through local expertise.",
  },
};

export default function DeepakProfileSection({ pageType = "default" }) {
  const content = PAGE_CONTENT[pageType] || PAGE_CONTENT.default;

  return (
    <section className="py-12 bg-gray-50 border-y border-gray-100">
      <div className="container mx-auto px-4 max-w-4xl flex flex-col gap-8">

        {/* Header */}
        <div className="text-center md:text-left">
          <span className="text-[#D48035] uppercase tracking-widest text-xs font-bold">
            {content.title}
          </span>
          <h2 className="text-3xl font-extrabold text-gray-900 mt-1">
            Founding Leadership
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            A powerful alliance bridging global networks with prime Indian real estate opportunities.
          </p>
        </div>

        {/* Row 1: Deepak Kavadia (Image & Text) */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-8 flex flex-col md:flex-row gap-6 md:gap-8 items-start">
          <div className="shrink-0 flex flex-col items-center md:items-start text-center md:text-left w-full md:w-40">
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl overflow-hidden shadow-md border-2 border-white">
              <img
                src="/deepak.png"
                alt="Deepak Kavadia"
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="text-sm font-bold text-gray-900 mt-3">Deepak Kavadia</h3>
            <span className="text-[11px] text-[#D48035] font-semibold leading-none mt-1">
              CEO & Co-Founder (USA)
            </span>
          </div>
          <div className="flex-1 mt-2 md:mt-0">
            <h4 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Award className="w-4 h-4 shrink-0 text-[#D48035]" />
              Global Vision & Strategic Relations
            </h4>
            <span className="text-xs text-gray-500 font-medium">Chairman of the NRI Federation</span>
            <p className="text-gray-600 text-sm md:text-base leading-relaxed mt-3">
              {content.bio1}
            </p>
          </div>
        </div>

        {/* Row 2: Pankaj Gupta & Atish Agarwal (Images & Text) */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-8 flex flex-col md:flex-row gap-6 md:gap-8 items-start">
          <div className="shrink-0 flex flex-col items-center md:items-start text-center md:text-left w-full md:w-56">
            <div className="flex gap-3 justify-center md:justify-start">
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl overflow-hidden shadow-md border-2 border-white">
                <img
                  src="/pankaj.png"
                  alt="Pankaj Gupta"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl overflow-hidden shadow-md border-2 border-white">
                <img
                  src="/atish.png"
                  alt="Atish Agarwal"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <h3 className="text-sm font-bold text-gray-900 mt-3">Pankaj Gupta & Atish Agarwal</h3>
            <span className="text-[11px] text-gray-500 font-semibold leading-none mt-1">
              Co-Founders (India)
            </span>
          </div>
          <div className="flex-1 mt-2 md:mt-0">
            <h4 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Award className="w-4 h-4 shrink-0 text-blue-600" />
              Strategic Curation & Local Operations
            </h4>
            <span className="text-xs text-gray-500 font-medium">Partners, Kuber Esthana Group • Developers & Advisors</span>
            <p className="text-gray-600 text-sm md:text-base leading-relaxed mt-3">
              {content.bio2}
            </p>
          </div>
        </div>

        {/* Unified Quote Block */}
        <div className="flex gap-3 bg-[#FFF7ED] rounded-2xl p-5 border border-orange-100/50 max-w-2xl mx-auto w-full">
          <Quote className="w-5 h-5 text-[#D48035] rotate-180 shrink-0 mt-0.5" />
          <p className="text-gray-700 italic text-sm md:text-base leading-relaxed">
            "{content.quote}"
          </p>
        </div>

      </div>
    </section>
  );
}
