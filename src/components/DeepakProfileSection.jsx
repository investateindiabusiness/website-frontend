"use client";

import React from 'react';
import { Quote, Award } from 'lucide-react';

const PAGE_CONTENT = {
  investor: {
    title: "Leadership & Trust Support",
    roles: [
      "Chairman of the NRI Federation",
      "CEO & Chairman of Valentine Mark Corporation (VTMC)",
      "Co-Founder, Investate India"
    ],
    bio: "Deepak Kavadia is the Chairman of the NRI Federation. With over 35 years of experience building relationships between the U.S. and India, he leads Investate India as a trusted bridge connecting global diaspora capital with verified Indian real estate opportunities.",
    quote: "We focus on absolute transparency and compliance, ensuring that NRI investors can deploy capital into Indian real estate with complete confidence and security."
  },
  builder: {
    title: "Leadership & Structured Capital",
    roles: [
      "Chairman of the NRI Federation",
      "CEO & Chairman of Valentine Mark Corporation (VTMC)",
      "Co-Founder, Investate India"
    ],
    bio: "Deepak Kavadia connects premier Indian developers with global institutional and NRI diaspora capital. Leveraging deep international networks, he is dedicated to facilitating structured finance solutions and seamless developer-investor matching.",
    quote: "Our mission is to bring institutional-grade capital, project-level syndication, and structured exit liquidity to elite Indian developers."
  },
  serviceProvider: {
    title: "Leadership & Advisory Integration",
    roles: [
      "Chairman of the NRI Federation",
      "CEO & Chairman of Valentine Mark Corporation (VTMC)",
      "Co-Founder, Investate India"
    ],
    bio: "Deepak Kavadia coordinates professional legal, financial, and compliance service providers to serve global NRI markets, fostering a high-trust ecosystem that simplifies cross-border transactions and FEMA compliance.",
    quote: "We facilitate high-trust service partnerships that secure transactions, simplify regulatory bottlenecks, and build the foundational compliance for international wealth."
  },
  default: {
    title: "Platform Leadership",
    roles: [
      "Chairman of the NRI Federation",
      "CEO & Chairman of Valentine Mark Corporation (VTMC)",
      "Co-Founder, Investate India"
    ],
    bio: "Deepak Kavadia is the Chairman of the NRI Federation and Co-Founder of Investate India. Over the past 35 years, he has built extensive relationships with political, social, and business leaders in the U.S. and India, serving as a trusted bridge of support.",
    quote: "VTMC and Investate India stand as next-generation cross-border investment platforms combining capital, distribution, and exit opportunities."
  }
};

export default function DeepakProfileSection({ pageType = "default" }) {
  const content = PAGE_CONTENT[pageType] || PAGE_CONTENT.default;

  return (
    <section className="py-16 bg-gray-50 border-y border-gray-100" id="about-ceo">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          
          {/* Left panel - Image card */}
          <div className="md:col-span-4 max-w-sm mx-auto md:mx-0 w-full">
            <div className="relative bg-white rounded-2xl border border-gray-250/10 shadow-md overflow-hidden group">
              <div className="aspect-[4/5] relative bg-gray-100">
                <img 
                  src="/deepak.png" 
                  alt="Deepak Kavadia" 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-5 left-5 right-5">
                  <h3 className="text-xl font-bold text-white tracking-wide">
                    Deepak Kavadia
                  </h3>
                  <p className="text-gray-300 text-xs mt-1">
                    Co-Founder, Investate India
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right panel - Info */}
          <div className="md:col-span-8 flex flex-col gap-5">
            <div>
              <span className="text-[#D48035] text-xs font-bold uppercase tracking-widest block mb-1">
                {content.title}
              </span>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight font-heading">
                The Bridge of Trust
              </h2>
            </div>

            {/* Roles */}
            <div className="flex flex-col gap-1.5 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
              {content.roles.map((role, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-[#D48035] shrink-0" />
                  <span className="text-gray-800 text-sm font-semibold font-body">
                    {role}
                  </span>
                </div>
              ))}
            </div>

            {/* Bio */}
            <p className="text-gray-600 text-sm md:text-base leading-relaxed font-body">
              {content.bio}
            </p>

            {/* Quote Block */}
            <div className="relative bg-[#FFF7ED] border border-orange-100 rounded-xl p-5 flex gap-3.5">
              <div className="text-[#D48035]/60 shrink-0">
                <Quote className="w-6 h-6 rotate-180" />
              </div>
              <p className="text-gray-700 text-sm italic font-body leading-relaxed">
                "{content.quote}"
              </p>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
