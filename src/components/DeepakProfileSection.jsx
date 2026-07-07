"use client";

import React from 'react';
import { CheckCircle2 } from 'lucide-react';

const PAGE_CONTENT = {
  investor: {
    bio: "Deepak Kavadia is a seasoned entrepreneur and real estate investor who bridges the gap between global diaspora capital and vetted Indian property assets. With over 35 years of experience, he leads international capital access platforms and helps NRI wealth navigate the market with absolute security and institutional compliance.",
    expertise: [
      "35+ years of NRI investment advisory",
      "Frictionless cross-border capital safety",
      "Institutional-grade asset due diligence"
    ],
    vision: [
      "FEMA & tax compliance automation",
      "Transparent escrow & title protections",
      "Predictable NRI wealth expansion corridors"
    ],
    quote: "Deepak Kavadia focuses on absolute transparency and compliance, ensuring that NRI investors can deploy capital into Indian real estate with complete confidence and security.",
    badges: ["NRI Wealth Protection", "Capital Corridors", "Real Estate Investor", "Gemstone Authority"]
  },
  builder: {
    bio: "Deepak Kavadia is an international investment leader connecting premier Indian developers with global institutional and NRI diaspora capital. With 35+ years of experience, he is dedicated to creating structured finance solutions, cross-border investment corridors, and seamless developer-investor matching.",
    expertise: [
      "Structured finance & exit strategies",
      "Global diaspora capital mobilization",
      "Developer-investor relationship networks"
    ],
    vision: [
      "Bespoke capital syndication channels",
      "Seamless international liquidity pools",
      "Premium developer branding & outreach"
    ],
    quote: "Deepak Kavadia leverages deep global networks to bring institutional-grade capital, project-level syndication, and structured exit liquidity to elite Indian developers.",
    badges: ["Capital Syndication", "Project Finance", "Developer Relations", "International Markets"]
  },
  serviceProvider: {
    bio: "Deepak Kavadia is an entrepreneur and international trade strategist who guides professional legal, financial, and compliance service providers in serving global NRI markets. With over 35 years of experience in cross-border ecosystems, he champions transparent advisory standards and structural integrity.",
    expertise: [
      "Cross-border advisory & coordination",
      "NRI legal & tax partner networks",
      "FEMA & investment structuring compliance"
    ],
    vision: [
      "Interconnected professional network",
      "Frictionless transactional pathways",
      "High-trust client engagement standards"
    ],
    quote: "Deepak Kavadia facilitates high-trust service partnerships that secure transactions, simplify regulatory bottlenecks, and build the foundational compliance for international wealth.",
    badges: ["Advisory Ecosystem", "Tax & Law Partners", "FEMA Compliance", "Structural Integrity"]
  },
  default: {
    bio: "Deepak Kavadia is an entrepreneur and real estate investor who leads international capital platforms connecting the United States and India. With over 35 years of expertise, he focuses on cross-border investment, structured finance, and global trade corridors.",
    expertise: [
      "35+ years of cross-border investment expertise",
      "Focus on U.S. - India capital flows",
      "Diaspora-driven investment platforms"
    ],
    vision: [
      "U.S. - India investment corridors",
      "NRI diaspora capital & deal flow",
      "Capital + Distribution + Exit platforms"
    ],
    quote: "Deepak Kavadia brings a unique combination of global capital access, diaspora connectivity, and structured investment expertise — positioning our platform as a next-generation cross-border investment gateway.",
    badges: ["Nice Jewels", "NRI Federation", "Raj Holdings", "Prestige Developers"]
  }
};

export default function DeepakProfileSection({ pageType = "default" }) {
  const content = PAGE_CONTENT[pageType] || PAGE_CONTENT.default;

  return (
    <section className="py-12 bg-[#FEFEFE] dark:bg-[#111] overflow-hidden" id="about-ceo">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="bg-[#FAFBFD] dark:bg-[#1a1a1a] rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-xl overflow-hidden flex flex-col md:flex-row">
          
          {/* Left panel - Dark profile card */}
          <div className="w-full md:w-1/3 bg-[#141416] p-6 md:p-8 flex flex-col items-center justify-center text-center">
            <div className="relative mb-4">
              <div className="w-28 h-28 md:w-32 md:h-32 rounded-full overflow-hidden border-2 border-[#D48035] p-1 bg-gradient-to-tr from-[#D48035] to-amber-500">
                <img 
                  src="/deepak.png" 
                  alt="Deepak Kavadia" 
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
            </div>
            
            <h3 className="text-2xl font-bold text-white tracking-wide mb-1">
              Deepak Kavadia
            </h3>
            <p className="text-[#D48035] text-sm font-semibold tracking-wider uppercase">
              CEO & Chairman
            </p>
          </div>

          {/* Right panel - Content */}
          <div className="w-full md:w-2/3 p-6 md:p-8 flex flex-col justify-between">
            <div>
              {/* Profile Description */}
              <p className="text-gray-600 dark:text-gray-300 text-base md:text-lg leading-relaxed mb-5">
                {content.bio}
              </p>

              {/* Grid: Expertise & Global Vision */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-5">
                {/* Expertise */}
                <div>
                  <h4 className="text-[#D48035] font-bold text-xs tracking-widest uppercase mb-2">
                    EXPERTISE
                  </h4>
                  <ul className="space-y-1.5">
                    {content.expertise.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-300">
                        <CheckCircle2 className="w-5 h-5 text-[#D48035] shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Global Vision */}
                <div>
                  <h4 className="text-[#D48035] font-bold text-xs tracking-widest uppercase mb-2">
                    GLOBAL VISION
                  </h4>
                  <ul className="space-y-1.5">
                    {content.vision.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-300">
                        <CheckCircle2 className="w-5 h-5 text-[#D48035] shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Quote Block */}
              <div className="bg-amber-50/50 dark:bg-amber-950/10 border border-amber-100 dark:border-amber-900/30 rounded-2xl py-3 px-4 mb-5">
                <p className="text-amber-800 dark:text-amber-300 text-sm md:text-base italic font-light leading-relaxed">
                  "{content.quote}"
                </p>
              </div>
            </div>

            {/* Badges and Footer */}
            <div>
              <div className="flex flex-wrap gap-2.5 mb-4">
                {content.badges.map((badge, idx) => (
                  <span 
                    key={idx} 
                    className="px-4 py-1.5 rounded-full border border-amber-200 dark:border-amber-900/40 bg-amber-50/30 dark:bg-amber-950/5 text-amber-700 dark:text-amber-400 text-xs md:text-sm font-medium tracking-wide"
                  >
                    {badge}
                  </span>
                ))}
              </div>

              <div className="border-t border-gray-100 dark:border-gray-800 pt-3">
                <p className="text-gray-500 dark:text-gray-400 text-xs md:text-sm">
                  35+ years connected to top Political, Social & Business Leaders in USA & India
                </p>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
