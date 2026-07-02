"use client";

import React, { useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Compass, Award, Users, Briefcase, Network, User, ShieldAlert, ArrowRight, Info, CheckCircle2, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default function BusinessOverview() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="theme-investor w-full min-h-screen overflow-x-hidden font-sans" style={{ backgroundColor: '#e8e3de' }}>
      <Header />

      {/* Section 1: Hero / Cover */}
      <section className="fullscreen-section hero-section">
        <div
          className="absolute inset-0 z-0 hero-split-image"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80)',
            backgroundSize: 'cover',
          }}
        />
        <div className="absolute inset-0 z-[1] hero-split-overlay" />

        <div className="container relative z-[2]">
          <div className="hero-content">
            <h1 className="hero-headline">
              INVESTATE INDIA <br />
              <span className="text-accent">Global Investment Gateway to India</span>
            </h1>
            <p className="hero-subheadline">
              Connecting Investors, Opportunities and Professional Services
            </p>

            <div className="flex flex-wrap gap-2.5 mt-8 items-center justify-center md:justify-start">
              {["NYC", "HYD", "DEL", "BOM"].map((city) => (
                <span key={city} className="px-4 py-1.5 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-full text-xs font-bold uppercase tracking-widest shadow-sm">
                  {city}
                </span>
              ))}
            </div>

            <div className="mt-8 flex justify-center md:justify-start">
              <Link href="/contact-us" className="btn btn-primary flex items-center gap-2">
                Talk to Us <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Executive Summary */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-12 max-w-6xl">

          {/* Section label + heading */}
          <div className="flex flex-col md:flex-row md:items-end gap-6 mb-14">
            <div className="flex-1">
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#D48035] mb-3 block">Executive Summary</span>
              <h3 className="text-4xl md:text-5xl font-bold text-[#1a1a1a] leading-tight">Gateway to<br />Indian Opportunities</h3>
            </div>
            <div className="md:max-w-sm">
              <p className="text-gray-500 text-base leading-relaxed">
                A comprehensive platform connecting global capital with verified investment opportunities across India.
              </p>
            </div>
          </div>

          {/* Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5">

            {/* What Are We — tall left card */}
            <div className="md:col-span-5 bg-[#D48035] rounded-3xl p-8 flex flex-col justify-between min-h-[320px] text-white">
              <div>
                <span className="text-white/60 text-xs font-bold uppercase tracking-widest mb-4 block">01 — About</span>
                <h4 className="text-2xl font-bold mb-4 leading-snug">What Are We</h4>
                <p className="text-white/85 leading-relaxed text-base">
                  Investate India is a technology-enabled investment platform designed to facilitate participation in Indian investment opportunities through a curated ecosystem of investors, opportunity providers and professional service partners.
                </p>
              </div>
              <div className="mt-6 pt-6 border-t border-white/20">
                <span className="text-white/50 text-xs uppercase tracking-widest">Investate India</span>
              </div>
            </div>

            {/* Right column — Mission + Vision stacked */}
            <div className="md:col-span-7 grid grid-rows-2 gap-5">

              {/* Mission */}
              <div className="bg-white rounded-2xl p-7 shadow-sm flex gap-6 items-start">
                <div className="shrink-0">
                  <span className="text-[#D48035] text-4xl font-black opacity-20 leading-none">01</span>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Compass className="w-4 h-4 text-[#D48035]" />
                    <h4 className="font-bold text-sm text-[#1a1a1a] uppercase tracking-widest">Mission</h4>
                  </div>
                  <p className="text-gray-600 text-base leading-relaxed">To simplify and secure investments into India through technology, transparency and trusted partnerships.</p>
                </div>
              </div>

              {/* Vision */}
              <div className="bg-white rounded-2xl p-7 shadow-sm flex gap-6 items-start">
                <div className="shrink-0">
                  <span className="text-[#D48035] text-4xl font-black opacity-20 leading-none">02</span>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Award className="w-4 h-4 text-[#D48035]" />
                    <h4 className="font-bold text-sm text-[#1a1a1a] uppercase tracking-widest">Vision</h4>
                  </div>
                  <p className="text-gray-600 text-base leading-relaxed">To become the most trusted global gateway for investments into India.</p>
                </div>
              </div>
            </div>

            {/* Platform Capabilities — wide bottom card */}
            <div className="md:col-span-8 bg-white rounded-2xl p-7 shadow-sm">
              <div className="flex items-center justify-between mb-5">
                <h4 className="font-bold text-[#1a1a1a] text-base uppercase tracking-widest">Platform Capabilities</h4>
                <span className="text-xs text-[#D48035] font-bold uppercase tracking-widest">8 Services</span>
              </div>
              <div className="flex flex-wrap gap-2.5">
                {[
                  "Investment Discovery",
                  "Real Estate Opportunities",
                  "Equity Investment Opportunities",
                  "Alternative Investments",
                  "Professional Services Integration",
                  "Investor Enablement",
                  "Legal & Financial Enablement",
                  "End-to-End Investment Support"
                ].map((cap, i) => (
                  <span key={i} className="px-4 py-2 bg-[#1a1a1a]/5 text-[#1a1a1a] text-sm font-medium rounded-full border border-[#1a1a1a]/10">
                    {cap}
                  </span>
                ))}
              </div>
            </div>

            {/* Why Now — small accent card */}
            <div className="md:col-span-4 bg-[#D48035] rounded-2xl p-7 shadow-sm flex flex-col justify-between text-white">
              <h4 className="font-bold text-base uppercase tracking-widest mb-3">Why Now</h4>
              <p className="text-white/85 text-sm leading-relaxed">
                Digital adoption, regulatory transparency and rising NRI wealth are creating significant demand for trusted investment platforms.
              </p>
            </div>

            {/* Market Opportunity — 3 stat tiles */}
            <div className="md:col-span-12 grid grid-cols-1 sm:grid-cols-3 gap-5">
              {[
                { stat: "35M+", label: "NRIs Globally", sub: "Addressable investor base" },
                { stat: "Top 5", label: "Fastest Growing Economy", sub: "India's global economic rank" },
                { stat: "Rising", label: "NRI Investment Participation", sub: "Year-on-year growth trend" },
              ].map((item, i) => (
                <div key={i} className="bg-white rounded-2xl p-6 shadow-sm flex items-center gap-5 border-l-4 border-[#D48035]">
                  <div className="shrink-0">
                    <div className="text-3xl font-black text-[#1a1a1a]">{item.stat}</div>
                  </div>
                  <div>
                    <p className="font-bold text-[#1a1a1a] text-sm">{item.label}</p>
                    <p className="text-gray-400 text-xs mt-0.5">{item.sub}</p>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* Section 3: The Organization (Leadership / Team) */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-12 max-w-6xl">

          {/* Section header */}
          <div className="flex flex-col md:flex-row md:items-end gap-6 mb-14">
            <div className="flex-1">
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#D48035] mb-3 block">The Organization</span>
              <h3 className="text-4xl md:text-5xl font-bold text-[#1a1a1a] leading-tight">Global Leadership<br />&amp; Founders</h3>
            </div>
            <div className="md:max-w-sm">
              <p className="text-gray-500 text-base leading-relaxed">
                Experienced leaders with a global perspective and trusted networks across industries.
              </p>
            </div>
          </div>

          {/* 3-column card grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
            {[
              {
                num: "01",
                name: "Deepak Kavadia",
                role: "Chief Executive Officer & Co-Founder",
                desc: "New York-based entrepreneur and global gemstone authority. Founder of Nice Gems Inc., Nice Jewels Inc., and Prestige Developers LLC, and Founder & Chairman of the NRI Federation — bringing a strong global perspective and trusted connect for NRI investors.",
                image: "/deepak.png"
              },
              {
                num: "02",
                name: "Pankaj Gupta",
                role: "Co-Founder",
                desc: "Has built a strong presence in the diamond and jewellery industry through Murari Cap Pvt. Ltd. and Avik Jewels, and is a recognized name in the Hyderabad real estate market through Swandurga Construction LLP.",
                image: "/pankaj.png"
              },
              {
                num: "03",
                name: "Atish Agarwal",
                role: "Co-Founder",
                desc: "Brings diversified entrepreneurial experience across textiles, retail, jewellery, and real estate advisory, with a focus on operations and structuring investment opportunities.",
                image: "/atish.png"
              }
            ].map((member, index) => (
              <div key={index} className="bg-white rounded-3xl overflow-hidden shadow-sm flex flex-col group hover:shadow-md transition-all duration-300">
                {/* Top accent bar + number */}
                <div className="h-2 bg-[#D48035]" />

                {/* Card body */}
                <div className="p-7 flex flex-col flex-1 gap-5">
                  {/* Photo + number row */}
                  <div className="flex items-start justify-between">
                    <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-[#D48035]/20 shadow-sm">
                      <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                    </div>
                    <span className="text-5xl font-black text-[#1a1a1a]/10 leading-none select-none">{member.num}</span>
                  </div>

                  {/* Name + role */}
                  <div>
                    <h4 className="font-bold text-[#1a1a1a] text-xl leading-tight">{member.name}</h4>
                    <p className="text-xs text-[#D48035] font-bold uppercase tracking-widest mt-1.5">{member.role}</p>
                  </div>

                  {/* Divider */}
                  <div className="h-px bg-gray-100" />

                  {/* Bio */}
                  <p className="text-gray-500 text-sm leading-relaxed flex-1">{member.desc}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Section 4: Business Description */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-12 max-w-6xl">

          {/* Section header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-14">
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#D48035] mb-3 block">Platform Overview</span>
              <h3 className="text-4xl md:text-5xl font-bold text-[#1a1a1a] leading-tight">Business Model & Focus</h3>
            </div>
          </div>

          {/* 3 Pillar feature blocks — horizontal */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
            {[
              {
                num: "01",
                title: "NRI Focused",
                desc: "Designed for the needs of global investors, with cross-border compliance, FEMA guidance, and repatriation support.",
                icon: <Users className="w-7 h-7 text-white" />
              },
              {
                num: "02",
                title: "Verified Opportunities",
                desc: "Every opportunity is curated and due-diligenced through a multi-tier review process to protect investor capital.",
                icon: <Briefcase className="w-7 h-7 text-white" />
              },
              {
                num: "03",
                title: "End-to-End Support",
                desc: "Complete support across legal, financial, advisory and operational needs — from discovery to investment completion.",
                icon: <Award className="w-7 h-7 text-white" />
              }
            ].map((pillar, i) => (
              <div key={i} className="bg-white rounded-2xl p-7 shadow-sm flex flex-col gap-5 group hover:shadow-md transition-all">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-[#D48035] flex items-center justify-center">
                    {pillar.icon}
                  </div>
                  <span className="text-4xl font-black text-[#1a1a1a]/5 select-none">{pillar.num}</span>
                </div>
                <div>
                  <h4 className="font-bold text-[#1a1a1a] text-lg mb-2">{pillar.title}</h4>
                  <p className="text-gray-500 text-sm leading-relaxed">{pillar.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Description — full-width white card with left accent + key highlights */}
          <div className="bg-white rounded-3xl shadow-sm overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-12">

              {/* Left accent column with key highlights */}
              <div className="md:col-span-4 bg-[#D48035] p-8 md:p-10 text-white flex flex-col justify-center">
                <h4 className="text-xl font-bold mb-6">Key Highlights</h4>
                <div className="space-y-5">
                  {[
                    "Technology-enabled platform",
                    "Global investor ecosystem",
                    "Real estate & equity",
                    "Verified service partners",
                    "Transparency & due diligence"
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <CheckCircle2 className="w-4 h-4 shrink-0 text-white/80" />
                      <span className="text-sm text-white/90">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right text column */}
              <div className="md:col-span-8 p-8 md:p-10 space-y-5">
                <p className="text-base text-gray-600 leading-relaxed">
                  <strong className="text-[#1a1a1a]">Investate India</strong> is a technology-enabled investment platform that connects global investors with verified investment opportunities in India. Designed primarily for Non-Resident Indians (NRIs), the platform simplifies the investment journey by bringing together opportunities, professional services, and trusted industry partners under one ecosystem.
                </p>
                <p className="text-base text-gray-600 leading-relaxed">
                  Investing in India often requires coordination with multiple stakeholders, including developers, legal professionals, financial institutions, and advisors. Investate India streamlines this process by providing access to curated opportunities along with legal assistance, financial support, and investment guidance through a network of verified partners.
                </p>
                <p className="text-base text-gray-600 leading-relaxed">
                  For developers and project owners, the platform provides access to a global investor audience and a structured channel to showcase opportunities. Through transparency, due diligence, and strategic partnerships, Investate India aims to become a trusted gateway for investments into India.
                </p>
                <p className="text-base text-gray-600 leading-relaxed">
                  Beyond real estate, Investate India is expanding access to private investment opportunities, enabling businesses, project owners and capital seekers to connect with qualified investors through structured equity and secured debt offerings.
                </p>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* Global Investor Targeting Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-12 max-w-6xl">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h3 className="text-3xl md:text-4xl font-bold text-[#1a1a1a]">Connecting Global Capital</h3>
            <p className="text-gray-600 mt-4 leading-relaxed">
              Investate India is structurally designed to connect international investors, Non-Resident Indians (NRIs), and global wealth managers with the high-yield growth potential of Indian markets.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: "Global Reach & Access",
                desc: "Empowering investors across North America, Europe, Middle East, and Asia-Pacific with direct access to top-tier, handpicked Indian asset classes.",
                icon: <Network className="w-8 h-8 text-[#D48035]" />
              },
              {
                title: "Cross-Border Compliance",
                desc: "Simplifying regulatory, taxation, and legal requirements for global transactions including FEMA compliance and repatriation support.",
                icon: <Compass className="w-8 h-8 text-[#D48035]" />
              },
              {
                title: "Vetted Opportunities",
                desc: "Every listed investment undergoes rigorous multi-tier institutional due diligence to safeguard overseas capital.",
                icon: <Briefcase className="w-8 h-8 text-[#D48035]" />
              },
              {
                title: "Bespoke Portfolio Support",
                desc: "End-to-end guidance from dedicated portfolio managers, enabling global investors to build and manage wealth remotely with absolute ease.",
                icon: <Award className="w-8 h-8 text-[#D48035]" />
              }
            ].map((item, index) => (
              <div key={index} className="bg-white border border-gray-150 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
                <div>
                  <div className="p-3 bg-[#D48035]/10 rounded-xl w-14 h-14 flex items-center justify-center mb-6">
                    {item.icon}
                  </div>
                  <h4 className="font-bold text-[#1a1a1a] text-lg mb-3">{item.title}</h4>
                  <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* Section 6: Footer / Closing CTA */}
      <section className="py-16 md:py-20 border-t border-gray-300" style={{ backgroundColor: '#d5d0cb' }}>
        <div className="container mx-auto px-4 md:px-12 max-w-4xl text-center space-y-6">
          <h3 className="text-2xl md:text-3xl font-bold tracking-tight text-[#1a1a1a]">
            Connect with our team to explore investment opportunities in India.
          </h3>
          <p className="text-base text-gray-600 max-w-lg mx-auto">
            Get personalized assistance from our relationship managers and navigate your investment path seamlessly.
          </p>
          <div className="pt-4">
            <Link href="/contact-us" className="inline-flex items-center gap-2 px-8 py-3 bg-[#D48035] hover:bg-[#B45309] text-white font-bold text-sm uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-orange-500/20">
              Talk to Our Team <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {/* <div className="pt-12 border-t border-white/10 text-xs text-gray-400 space-y-1.5">
            <p className="font-bold tracking-widest text-[#D48035] uppercase">Investate India</p>
            <p>5th Floor, Sanghi One, Road No. 10, Banjara Hills, Hyderabad, TG.</p>
            <p>www.investateindia.com</p>
          </div> */}
        </div>
      </section>

      <Footer />
    </div>
  );
}
