"use client";

import React from 'react';
import { ShieldCheck, Globe, Users, Quote } from 'lucide-react';

const PAGE_CONTENT = {
  investor: {
    title: "Leadership & Trust Support",
    roles: [
      "Chairman of the NRI Federation",
      "CEO & Chairman of Valentine Mark Corporation (VTMC)",
      "Co-Founder, Investate India"
    ],
    bio: "Deepak Kavadia is the Chairman of the NRI Federation. He leads the Investate India platform, acting as a trusted bridge connecting global diaspora capital, Indian developers, and compliance experts between the United States and India.",
    subBio: "As CEO and Chairman of Valentine Mark Corporation (VTMC), a U.S. publicly listed company, he drives the strategic vision in global investment, trade, and cross-border financial structuring. With over 35 years of experience, he has built extensive relationships with top political, social, and business leaders in both the U.S. and India, establishing unmatched trust for NRI investors.",
    pillars: [
      {
        title: "Cross-Border Capital Safety",
        desc: "Over 35 years of investment strategy and advisory, ensuring overseas capital is deployed with maximum security, transparent escrow structures, and clear title protections.",
        icon: <ShieldCheck className="w-6 h-6 text-[#D48035]" />
      },
      {
        title: "U.S.–India Capital Flow",
        desc: "Leveraging NRI networks and global distribution to channel capital into high-yield, pre-vetted Indian real estate and financial assets.",
        icon: <Globe className="w-6 h-6 text-[#D48035]" />
      },
      {
        title: "Diaspora Engagement",
        desc: "Strengthening economic ties and active participation of overseas Indians while supporting philanthropy and community development.",
        icon: <Users className="w-6 h-6 text-[#D48035]" />
      }
    ],
    quote: "Deepak Kavadia focuses on absolute transparency and compliance, ensuring that NRI investors can deploy capital into Indian real estate with complete confidence and security.",
    badges: ["NRI Wealth Protection", "FEMA & Tax Compliance", "Real Estate Investment", "Secure Capital Corridors"],
    ventures: ["Nice Jewels", "NRI Federation", "Raj Holdings", "Prestige Developers"]
  },
  builder: {
    title: "Leadership & Structured Capital",
    roles: [
      "Chairman of the NRI Federation",
      "CEO & Chairman of Valentine Mark Corporation (VTMC)",
      "Co-Founder, Investate India"
    ],
    bio: "Deepak Kavadia connects premier Indian developers with global institutional and NRI diaspora capital. With 35+ years of experience, he is dedicated to creating structured finance solutions, cross-border investment corridors, and seamless developer-investor matching.",
    subBio: "As CEO and Chairman of VTMC, a U.S. publicly listed company, he leverages deep international capital networks to provide project-level syndication, developer outreach, and structured exit liquidity to elite developers.",
    pillars: [
      {
        title: "Global Capital Access",
        desc: "Mobilizing global capital pools and institutional distribution to bring foreign investment directly to qualified Indian development projects.",
        icon: <Globe className="w-6 h-6 text-[#D48035]" />
      },
      {
        title: "Structured Finance & Exits",
        desc: "Designing tailored financing mechanisms and exit opportunities to ensure project completion and robust returns for all stakeholders.",
        icon: <ShieldCheck className="w-6 h-6 text-[#D48035]" />
      },
      {
        title: "Strategic Partnerships",
        desc: "Building a bridge between developers and overseas networks, supported by over 35 years of relationships with top business and political leaders.",
        icon: <Users className="w-6 h-6 text-[#D48035]" />
      }
    ],
    quote: "Deepak Kavadia leverages deep global networks to bring institutional-grade capital, project-level syndication, and structured exit liquidity to elite Indian developers.",
    badges: ["Capital Syndication", "Project Finance", "Developer Relations", "International Markets"],
    ventures: ["Nice Jewels", "NRI Federation", "Raj Holdings", "Prestige Developers"]
  },
  serviceProvider: {
    title: "Leadership & Advisory Integration",
    roles: [
      "Chairman of the NRI Federation",
      "CEO & Chairman of Valentine Mark Corporation (VTMC)",
      "Co-Founder, Investate India"
    ],
    bio: "Deepak Kavadia coordinates professional legal, financial, and compliance service providers to serve global NRI markets. With over 35 years of cross-border experience, he champions transparent advisory standards and structural integrity.",
    subBio: "Through Valentine Mark Corporation (VTMC) and Investate India, he fosters a collaborative, high-trust ecosystem that simplifies regulatory bottlenecks, manages FEMA compliance, and ensures transactional pathways for global wealth.",
    pillars: [
      {
        title: "Cross-Border Compliance",
        desc: "Guiding professional legal and tax partners to streamline FEMA compliance, taxation, and international wealth repatriation.",
        icon: <ShieldCheck className="w-6 h-6 text-[#D48035]" />
      },
      {
        title: "High-Trust Partner Network",
        desc: "Uniting certified accountants, legal experts, and advisors into a cohesive network to protect NRI investments.",
        icon: <Users className="w-6 h-6 text-[#D48035]" />
      },
      {
        title: "Trade & Structuring Strategy",
        desc: "Providing cross-border expertise to help service providers scale their outreach to U.S.-based Indian diaspora.",
        icon: <Globe className="w-6 h-6 text-[#D48035]" />
      }
    ],
    quote: "Deepak Kavadia facilitates high-trust service partnerships that secure transactions, simplify regulatory bottlenecks, and build the foundational compliance for international wealth.",
    badges: ["Advisory Ecosystem", "Tax & Law Partners", "FEMA Compliance", "Structural Integrity"],
    ventures: ["Nice Jewels", "NRI Federation", "Raj Holdings", "Prestige Developers"]
  },
  default: {
    title: "Platform Leadership",
    roles: [
      "Chairman of the NRI Federation",
      "CEO & Chairman of Valentine Mark Corporation (VTMC)",
      "Co-Founder, Investate India"
    ],
    bio: "Deepak Kavadia is the Chairman of the NRI Federation. He leads the Investate India platform, connecting global diaspora capital, Indian developers, and compliance experts between the United States and India.",
    subBio: "As the Chief Executive Officer and Chairman of Valentine Mark Corporation (VTMC), a U.S. publicly listed company, he drives strategic vision in global investment, trade, and cross-border financial structuring. Over the past 35 years, he has built extensive relationships with political, social, and business leaders in the U.S. and India, serving as a trusted bridge of support.",
    pillars: [
      {
        title: "Cross-Border Investment Expertise",
        desc: "Focus on U.S.-India capital flows and experience in building diaspora-driven investment platforms with over 35 years of expertise.",
        icon: <ShieldCheck className="w-6 h-6 text-[#D48035]" />
      },
      {
        title: "Driving U.S.–India Corridors",
        desc: "Leveraging NRI networks for capital and deal flow, creating next-generation platforms combining capital, distribution, and exit opportunities.",
        icon: <Globe className="w-6 h-6 text-[#D48035]" />
      },
      {
        title: "Community & Diaspora Engagement",
        desc: "Associated with global NRI initiatives to strengthen economic ties, investment participation of overseas Indians, and community development.",
        icon: <Users className="w-6 h-6 text-[#D48035]" />
      }
    ],
    quote: "Deepak Kavadia brings a unique combination of global capital access, diaspora connectivity, and structured investment expertise—positioning VTMC and Investate India as next-generation cross-border investment platforms.",
    badges: ["NRI Federation", "Global Capital Gateway", "Developer & Investor Relations", "Cross-Border Compliance"],
    ventures: ["Nice Jewels", "NRI Federation", "Raj Holdings", "Prestige Developers"]
  }
};

export default function DeepakProfileSection({ pageType = "default" }) {
  const content = PAGE_CONTENT[pageType] || PAGE_CONTENT.default;

  return (
    <section className="py-20 bg-slate-50/50 dark:bg-[#0c0c0e] overflow-hidden border-t border-slate-100 dark:border-slate-900" id="about-ceo">
      <div className="container mx-auto px-4 max-w-7xl">
        
        {/* Header Label */}
        <div className="mb-10 text-center lg:text-left">
          <span className="text-[#D48035] text-xs font-bold uppercase tracking-[0.25em] block mb-2">
            {content.title}
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#111] dark:text-white tracking-tight">
            The Bridge of Trust
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left panel - Image card & Key Ventures */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800/80 shadow-lg overflow-hidden group">
              {/* Photo */}
              <div className="w-full aspect-[4/5] relative overflow-hidden bg-slate-100 dark:bg-slate-800">
                <img 
                  src="/deepak.png" 
                  alt="Deepak Kavadia" 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
                
                {/* Float Badge */}
                <div className="absolute bottom-6 left-6 right-6">
                  <span className="inline-block bg-[#D48035] text-white text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-full mb-2">
                    Established Trust
                  </span>
                  <h3 className="text-2xl font-bold text-white tracking-wide">
                    Deepak Kavadia
                  </h3>
                  <p className="text-slate-200 text-xs mt-1">
                    CEO & Chairman
                  </p>
                </div>
              </div>
            </div>

            {/* Badges/Credentials */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800/80 shadow-md p-6">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
                Core Focus
              </h4>
              <div className="flex flex-wrap gap-2">
                {content.badges.map((badge, idx) => (
                  <span 
                    key={idx} 
                    className="px-3.5 py-1.5 rounded-full border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300 text-xs font-medium"
                  >
                    {badge}
                  </span>
                ))}
              </div>
            </div>
            
            {/* Ventures */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800/80 shadow-md p-6">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
                Associated Ventures
              </h4>
              <div className="flex flex-wrap gap-2">
                {content.ventures.map((venture, idx) => (
                  <span 
                    key={idx} 
                    className="px-3 py-1 rounded-lg bg-amber-50/50 dark:bg-amber-950/20 border border-amber-100/50 dark:border-amber-900/30 text-amber-800 dark:text-amber-300 text-xs font-semibold"
                  >
                    {venture}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right panel - Bios, Pillars & Quote */}
          <div className="lg:col-span-8 flex flex-col gap-8">
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800/80 shadow-lg p-6 md:p-8 flex flex-col gap-6">
              {/* Header roles */}
              <div className="flex flex-col gap-2">
                {content.roles.map((role, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <span className="w-1.5 h-1.5 bg-[#D48035] rounded-full shrink-0" />
                    <span className="text-slate-800 dark:text-slate-200 text-sm md:text-base font-semibold">
                      {role}
                    </span>
                  </div>
                ))}
              </div>
              
              <hr className="border-slate-100 dark:border-slate-800" />

              {/* Bio & SubBio */}
              <div className="flex flex-col gap-4">
                <p className="text-slate-700 dark:text-slate-300 text-[1.05rem] md:text-[1.1rem] leading-relaxed font-medium">
                  {content.bio}
                </p>
                <p className="text-slate-600 dark:text-slate-400 text-sm md:text-base leading-relaxed">
                  {content.subBio}
                </p>
              </div>

              {/* Quote Block */}
              <div className="relative bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 rounded-2xl p-6 flex gap-4 mt-2">
                <div className="text-slate-300 dark:text-slate-600 shrink-0">
                  <Quote className="w-8 h-8 rotate-180" />
                </div>
                <p className="text-slate-700 dark:text-slate-300 text-sm md:text-base italic font-light leading-relaxed">
                  "{content.quote}"
                </p>
              </div>
            </div>

            {/* Pillars Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {content.pillars.map((pillar, idx) => (
                <div 
                  key={idx} 
                  className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-3xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col gap-4"
                >
                  <div className="bg-amber-50 dark:bg-amber-950/20 w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border border-amber-100/50 dark:border-amber-900/30">
                    {pillar.icon}
                  </div>
                  <div>
                    <h4 className="text-slate-950 dark:text-white font-bold text-base mb-2">
                      {pillar.title}
                    </h4>
                    <p className="text-slate-600 dark:text-slate-400 text-xs md:text-sm leading-relaxed">
                      {pillar.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
