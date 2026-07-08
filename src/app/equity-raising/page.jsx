"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { CheckCircle, ArrowRight, Shield, TrendingUp, Users, Globe, Briefcase, Building2, Star, Phone, Mail, MapPin, Compass, Award, Cpu, Link as LinkIcon } from 'lucide-react';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6, delay },
});

const SectionTitle = ({ children, light }) => (
  <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${light ? 'text-white' : 'text-[#111]'}`}>{children}</h2>
);

const Card = ({ children, className = '' }) => (
  <div className={`bg-white rounded-2xl border border-gray-100 shadow-sm p-6 ${className}`}>{children}</div>
);

const OrangeTag = ({ children }) => (
  <span className="inline-block bg-orange-50 text-[#D48035] text-xs font-bold px-3 py-1 rounded-full border border-orange-200 mr-2 mb-2">{children}</span>
);

const Bullet = ({ children, light }) => (
  <li className={`flex items-start gap-2.5 text-[1.05rem] leading-relaxed list-none ${light ? 'text-gray-300' : 'text-gray-600'}`}>
    <CheckCircle className={`w-4 h-4 shrink-0 mt-0.5 text-[#D48035]`} />
    <span>{children}</span>
  </li>
);

export default function EquityRaisingPage() {
  return (
    <div className="theme-builder min-h-screen bg-white text-gray-800 flex flex-col" style={{ fontFamily: "'Inter', sans-serif" }}>
      <Header />

      {/* ── HERO ── */}
      <section
        className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16"
        style={{ background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 55%, #2a2a2a 100%)' }}
      >
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full opacity-[0.08]"
            style={{ background: 'radial-gradient(circle, #D48035 0%, transparent 70%)' }} />
          <div className="absolute bottom-0 left-0 w-full h-32 opacity-20"
            style={{ background: 'linear-gradient(to top, #D48035, transparent)' }} />
        </div>
        <div className="container mx-auto px-4 max-w-5xl text-center relative z-10 py-24">
          <motion.div {...fadeUp()}>
            <span className="inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest text-[#D48035] border border-[#D48035]/30 bg-[#D48035]/10 mb-5">
              Investate India Capital Platform
            </span>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight">
              $1 Billion India<br />
              <span className="text-[#D48035]">Investment Platform</span>
            </h1>
            <p className="text-gray-400 text-lg mb-3 font-medium tracking-wide">Secured · Structured · Scalable</p>
            <p className="text-gray-400 text-base max-w-2xl mx-auto mb-3">Cross-Border Investment Platform (U.S. - India)</p>
            <p className="text-gray-500 text-sm max-w-xl mx-auto mb-10">Real Estate · Infrastructure · Private Credit</p>
            <div className="flex flex-wrap gap-4 justify-center">
              <a href="#contact" className="bg-[#D48035] hover:bg-[#B45309] text-white font-bold px-8 py-4 rounded-full shadow-lg transition-all hover:scale-105 text-sm uppercase tracking-wider">
                Partner with Us
              </a>
              <a href="#ecosystem" className="border border-white/20 hover:border-[#D48035]/70 text-white font-semibold px-8 py-4 rounded-full transition-all text-sm uppercase tracking-wider">
                Explore Ecosystem
              </a>
            </div>
          </motion.div>

          {/* Stat pills */}
          <motion.div {...fadeUp(0.3)} className="mt-16 flex flex-wrap justify-center gap-5">
            {[
              { label: "Platform Target", value: "$1 Billion" },
              { label: "Per Deal Range", value: "$5M - $100M" },
              { label: "Target Returns", value: "16% - 22%" },
              { label: "Investment Horizon", value: "2 - 5 Years" },
              { label: "NRI Diaspora Access", value: "32M+" },
            ].map((s, i) => (
              <div key={i} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl px-6 py-4 text-center min-w-[130px]">
                <div className="text-xl font-bold text-[#D48035]">{s.value}</div>
                <div className="text-xs text-gray-400 uppercase tracking-wide mt-1">{s.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── EXECUTIVE SUMMARY (INVESTATE) ── */}
      <section className="py-24 bg-white border-b border-gray-100">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div {...fadeUp(0.1)} className="space-y-6">
              <SectionTitle>Global Investment Gateway to India</SectionTitle>
              <p className="responsive-paragraph text-gray-600 mb-6">
                Investate India is a technology-enabled investment platform designed to facilitate participation in Indian investment opportunities through a curated ecosystem of investors, opportunity providers, and professional service partners.
              </p>
              <p className="responsive-paragraph text-gray-600 mb-6">
                Through our structured cross-border network, specializing in global finance and investment structuring, we bridge global institutional capital with India's growth sectors.
              </p>
              <div className="flex flex-col gap-4 pt-4">
                <Card className="flex items-center gap-4 px-5 py-3">
                  <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center shrink-0">
                    <Compass className="w-5 h-5 text-[#D48035]" />
                  </div>
                  <div className="space-y-0.5">
                    <h4 className="font-bold text-[#111] text-lg leading-tight">Our Mission</h4>
                    <p className="text-[1.05rem] text-gray-500 leading-normal">To simplify and secure investments into India through technology, transparency, and trusted partnerships.</p>
                  </div>
                </Card>
                <Card className="flex items-center gap-4 px-5 py-3">
                  <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center shrink-0">
                    <Award className="w-5 h-5 text-[#D48035]" />
                  </div>
                  <div className="space-y-0.5">
                    <h4 className="font-bold text-[#111] text-lg leading-tight">Our Vision</h4>
                    <p className="text-[1.05rem] text-gray-500 leading-normal">To become the most trusted global gateway for investments into India.</p>
                  </div>
                </Card>
              </div>
            </motion.div>
            <motion.div {...fadeUp(0.2)} className="bg-[#F8F8F8] border border-gray-100 rounded-3xl p-8 space-y-6">
              <h3 className="text-lg font-bold text-[#111] flex items-center gap-2"><Cpu className="w-5 h-5 text-[#D48035]" /> Platform Capabilities</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  "Investment Discovery",
                  "Real Estate Opportunities",
                  "Equity Investment Opportunities",
                  "Alternative Investments",
                  "Professional Services Integration",
                  "Investor Enablement",
                  "Legal & Financial Enablement",
                  "End-to-End Investment Support",
                  "Import & Export Services",
                  "NRI Services"
                ].map((cap, idx) => (
                  <div key={idx} className="flex items-center gap-2.5 bg-white px-4 py-1.5 rounded-xl border border-gray-100 shadow-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#D48035] shrink-0" />
                    <span className="text-[1.05rem] font-semibold text-gray-700">{cap}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── INVESTMENT THESIS ── */}
      <section className="py-24 bg-[#F8F8F8]">
        <div className="container mx-auto px-4 max-w-6xl">
          <motion.div {...fadeUp()} className="text-center mb-14">
            <SectionTitle>Bridging Global Capital with India's Growth</SectionTitle>
            <p className="section-subtitle max-w-2xl mx-auto">India presents a significant opportunity driven by rapid growth and strong demand for structured capital.</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div {...fadeUp(0.1)}>
              <Card className="h-full">
                <h3 className="text-lg font-bold text-[#111] mb-4 flex items-center gap-2"><Globe className="w-5 h-5 text-[#D48035]" /> India Opportunity</h3>
                <ul className="space-y-3">
                  <Bullet>Rapid economic growth & rising urbanization</Bullet>
                  <Bullet>Strong real estate and infrastructure demand</Bullet>
                  <Bullet>Increasing need for structured financing among developers</Bullet>
                </ul>
              </Card>
            </motion.div>
            <motion.div {...fadeUp(0.2)}>
              <Card className="h-full">
                <h3 className="text-lg font-bold text-[#111] mb-4 flex items-center gap-2"><Briefcase className="w-5 h-5 text-[#D48035]" /> Our Platform Delivers</h3>
                <ul className="space-y-3">
                  <Bullet>Access to global institutional and HNW diaspora capital</Bullet>
                  <Bullet>Structured, risk-mitigated, asset-backed investments</Bullet>
                  <Bullet>Built-in exit & liquidity engine via NRI demand networks</Bullet>
                </ul>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── THREE CORE PILLARS ── */}
      <section className="py-24 bg-white border-b border-gray-100">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "NRI Focused",
                desc: "Designed primarily for the specific compliance, taxation, FEMA regulation, and repatriation needs of Non-Resident Indians.",
                icon: <Users className="w-6 h-6 text-white" />
              },
              {
                title: "Verified Opportunities",
                desc: "Every project undergoes strict multi-tier review, legal due diligence, and financial audits to protect investor capital.",
                icon: <Shield className="w-6 h-6 text-white" />
              },
              {
                title: "End-to-End Support",
                desc: "Complete operational support across legal, financial, advisory, and asset management needs throughout the deal lifecycle.",
                icon: <Award className="w-6 h-6 text-white" />
              }
            ].map((pillar, i) => (
              <motion.div key={i} {...fadeUp(i * 0.1)} className="text-center p-8 bg-[#F8F8F8] border border-gray-100 rounded-3xl">
                <div className="w-12 h-12 rounded-2xl bg-[#1a1a1a] flex items-center justify-center mx-auto mb-5 shadow-md">
                  {pillar.icon}
                </div>
                <h3 className="text-lg font-bold text-[#111] mb-2">{pillar.title}</h3>
                <p className="text-gray-500 text-[1.05rem] leading-relaxed">{pillar.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── THE ECOSYSTEM (VISUAL REPRESENTATION) ── */}
      <section className="py-24 bg-[#1a1a1a] text-white" id="ecosystem">
        <div className="container mx-auto px-4 max-w-6xl">
          <motion.div {...fadeUp()} className="text-center mb-16">
            <SectionTitle light>The Platform Ecosystem</SectionTitle>
            <p className="section-subtitle text-gray-400 max-w-2xl mx-auto" style={{ color: '#9ca3af' }}>Connecting stakeholders through structured channels to simplify and secure cross-border investments.</p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
            {/* Connect */}
            <motion.div {...fadeUp(0.1)} className="bg-white/5 border border-white/10 rounded-3xl p-8 flex flex-col justify-between">
              <div>
                <span className="text-xs uppercase tracking-widest text-[#D48035] font-bold block mb-4">Connect</span>
                <h3 className="text-xl font-bold mb-4">Sourcing & Advisory Channels</h3>
                <p className="text-gray-400 text-[1.05rem] leading-relaxed mb-6">Bringing together the key players to kickstart investment opportunities and scale developer funding corridors.</p>
              </div>
              <div className="space-y-3">
                {["Service Partners", "Developers", "Capital Seekers"].map((item, idx) => (
                  <div key={idx} className="bg-white/5 border border-white/5 px-4 py-3 rounded-xl flex items-center justify-between">
                    <span className="text-xs font-semibold text-gray-300">{item}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#D48035]" />
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Invest */}
            <motion.div {...fadeUp(0.2)} className="bg-white/5 border border-white/10 rounded-3xl p-8 flex flex-col justify-between">
              <div>
                <span className="text-xs uppercase tracking-widest text-[#D48035] font-bold block mb-4">Invest</span>
                <h3 className="text-xl font-bold mb-4">Curated Asset Classes</h3>
                <p className="text-gray-400 text-[1.05rem] leading-relaxed mb-6">Select from verified debt, mezzanine, and equity opportunities designed for downside protection and structured returns.</p>
              </div>
              <div className="space-y-3">
                {["Alternate Investments", "Equity Options", "Real Estate Opportunities"].map((item, idx) => (
                  <div key={idx} className="bg-white/5 border border-white/5 px-4 py-3 rounded-xl flex items-center justify-between">
                    <span className="text-xs font-semibold text-gray-300">{item}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#D48035]" />
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Support */}
            <motion.div {...fadeUp(0.3)} className="bg-white/5 border border-white/10 rounded-3xl p-8 flex flex-col justify-between">
              <div>
                <span className="text-xs uppercase tracking-widest text-[#D48035] font-bold block mb-4">Support</span>
                <h3 className="text-xl font-bold mb-4">Compliance & Enablement</h3>
                <p className="text-gray-400 text-[1.05rem] leading-relaxed mb-6">Providing investor protection through dedicated relationship support, auditing, and structured legal frameworks.</p>
              </div>
              <div className="space-y-3">
                {["Legal Support", "Financial Enablement", "Advisory Services"].map((item, idx) => (
                  <div key={idx} className="bg-white/5 border border-white/5 px-4 py-3 rounded-xl flex items-center justify-between">
                    <span className="text-xs font-semibold text-gray-300">{item}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#D48035]" />
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── PLATFORM MODEL & OVERVIEW ── */}
      <section className="py-24 bg-white" id="platform">
        <div className="container mx-auto px-4 max-w-6xl">
          <motion.div {...fadeUp()} className="text-center mb-14">
            <SectionTitle>Capital + Structuring + Exit Platform Model</SectionTitle>
            <p className="section-subtitle max-w-xl mx-auto">Our platform integrates three key components into a unified investment model.</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {[
              { title: "Capital Access", desc: "Global investor network providing scalable capital deployment across real estate and infrastructure.", icon: <Globe className="w-6 h-6 text-[#D48035]" /> },
              { title: "Structured Investments", desc: "Secured, risk-mitigated deal structures with asset-backed collateral and conservative LTV discipline.", icon: <Shield className="w-6 h-6 text-[#D48035]" /> },
              { title: "NRI Exit & Distribution Engine", desc: "Access to 32M+ global diaspora for pre-sales and secondary exits - enabling faster capital rotation.", icon: <Users className="w-6 h-6 text-[#D48035]" /> },
            ].map((item, i) => (
              <motion.div key={i} {...fadeUp(i * 0.1)}>
                <Card className="h-full text-center">
                  <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center mx-auto mb-4">{item.icon}</div>
                  <h3 className="text-base font-bold text-[#111] mb-2">{item.title}</h3>
                  <p className="text-gray-500 text-[1.05rem] leading-relaxed">{item.desc}</p>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Deal Parameters */}
          <motion.div {...fadeUp(0.2)} className="bg-[#F8F8F8] rounded-2xl border border-gray-100 p-8">
            <h3 className="text-lg font-bold text-[#111] mb-6 text-center">Platform Overview</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              {[
                { label: "Target Size", value: "Up to $1 Billion", note: "Phased deployment" },
                { label: "Per Deal", value: "$5M - $100M", note: "Flexible structure" },
                { label: "Target Returns", value: "16% - 22%", note: "Deal dependent" },
                { label: "Horizon", value: "2 - 5 Years", note: "Per investment" },
              ].map((item, i) => (
                <div key={i} className="text-center bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
                  <div className="text-xl font-bold text-[#D48035]">{item.value}</div>
                  <div className="text-xs font-bold text-[#111] mt-1">{item.label}</div>
                  <div className="text-[11px] text-gray-400 mt-0.5">{item.note}</div>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-5 border-t border-gray-200">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 text-center">Focus Areas</p>
              <div className="flex flex-wrap justify-center gap-2">
                {["Real Estate", "Infrastructure", "Structured Credit", "Special Situations"].map((tag, i) => <OrangeTag key={i}>{tag}</OrangeTag>)}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── WHY NOW SECTION ── */}
      <section className="py-24 bg-[#F8F8F8]">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div {...fadeUp(0.1)} className="space-y-6">
              <SectionTitle>Why Now?</SectionTitle>
              <p className="responsive-paragraph text-gray-600">
                India is experiencing a massive wave of digital adoption, regulatory transparency (post-RERA), and rising NRI wealth. The intersection of these trends creates significant demand for trusted investment gateways.
              </p>
              <div className="space-y-4">
                {[
                  { title: "Digital Enablement", desc: "Digital verification, onboarding, and tracking make remote asset management seamless." },
                  { title: "Transparency post-RERA", desc: "RERA disclosures and strict local oversight protect capital from standard project execution risks." },
                  { title: "Accelerating Wealth Corridors", desc: "India represents one of the world's fastest-growing major economies, attracting record FDI & diaspora capital." }
                ].map((item, i) => (
                  <div key={i} className="flex gap-3">
                    <CheckCircle className="w-5 h-5 text-[#D48035] shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-[#111] text-lg">{item.title}</h4>
                      <p className="text-[1.05rem] text-gray-500 mt-1">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Illustrative Example Card */}
            <motion.div {...fadeUp(0.2)}>
              <div className="bg-[#1a1a1a] text-white rounded-3xl p-8 border border-white/5 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#D48035]/15 rounded-full blur-xl pointer-events-none" />
                <span className="text-xs font-bold uppercase tracking-wider text-[#D48035] bg-orange-400/10 px-3 py-1.5 rounded-full border border-orange-400/20">Illustrative Example</span>
                <h3 className="text-xl font-bold mt-6 mb-2">Deal Structure Preview</h3>
                <p className="text-gray-400 text-xs mb-6">Typical parameters for real estate equity capital rounds.</p>
                <div className="space-y-4 border-t border-white/10 pt-6">
                  {[
                    { label: "Target Investment Size", value: "$20 Million" },
                    { label: "Deal Structure", value: "Secured Mezzanine" },
                    { label: "Asset Coverage Target", value: "~1.7x" },
                    { label: "Target IRR", value: "~20%" },
                    { label: "Exit Strategy Plan", value: "Global Pre-sales & NRI buyer network integration" }
                  ].map((stat, i) => (
                    <div key={i} className="flex justify-between items-start text-xs">
                      <span className="text-gray-400">{stat.label}</span>
                      <span className="font-bold text-white text-right max-w-[180px]">{stat.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── INVESTMENT STRUCTURES ── */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <motion.div {...fadeUp()} className="text-center mb-14">
            <SectionTitle>Flexible Investment Structures</SectionTitle>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: "Secured Debt", bg: "bg-[#1a1a1a]", points: ["Fixed return", "Priority repayment", "Collateral-backed"] },
              { title: "Mezzanine Financing", bg: "bg-[#D48035]", points: ["Hybrid structure", "Equity upside potential", "Flexible deployment"] },
              { title: "Equity Participation", bg: "bg-[#1a1a1a]", points: ["Select high-growth opportunities", "Strategic co-investment", "Long-term value creation"] },
            ].map((item, i) => (
              <motion.div key={i} {...fadeUp(i * 0.1)}>
                <div className={`${item.bg} rounded-2xl p-8 text-white h-full shadow-sm`}>
                  <h3 className="text-xl font-bold mb-5">{item.title}</h3>
                  <ul className="space-y-3">
                    {item.points.map((p, pi) => (
                      <li key={pi} className="flex items-center gap-2.5 text-sm text-gray-300 list-none">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#D48035] shrink-0" />
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Philosophy */}
          <motion.div {...fadeUp(0.2)} className="mt-10 bg-[#F8F8F8] rounded-2xl border border-gray-100 p-8">
            <h3 className="text-lg font-bold text-[#111] mb-5 text-center">Investment Philosophy</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {["Capital preservation first", "Asset-backed investments only", "Strong promoter alignment", "Downside protection through structuring", "Structured returns with asset-backed security"].map((p, i) => (
                <div key={i} className="bg-white border border-gray-100 rounded-xl p-4 text-center shadow-sm">
                  <p className="text-xs font-semibold text-[#111] leading-snug">{p}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── RISK & SECURITY ── */}
      <section className="py-24 bg-[#1a1a1a] text-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <motion.div {...fadeUp()} className="text-center mb-14">
            <SectionTitle light>Built-In Investor Protection</SectionTitle>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: <Shield className="w-8 h-8 text-[#D48035]" />, title: "Asset Coverage", desc: "100% - 200% asset coverage with conservative loan-to-value discipline on all investments." },
              { icon: <CheckCircle className="w-8 h-8 text-[#D48035]" />, title: "Security Package", points: ["Charge on assets", "Project receivables", "Corporate/personal guarantees"] },
              { icon: <Star className="w-8 h-8 text-[#D48035]" />, title: "Independent Controls", points: ["Legal due diligence", "Financial audits", "Third-party valuation"] },
            ].map((item, i) => (
              <motion.div key={i} {...fadeUp(i * 0.1)} className="bg-white/5 border border-white/10 rounded-2xl p-7">
                <div className="mb-4">{item.icon}</div>
                <h3 className="text-base font-bold mb-4">{item.title}</h3>
                {item.desc ? <p className="text-gray-400 text-[1.05rem] leading-relaxed">{item.desc}</p> : (
                  <ul className="space-y-2">
                    {item.points.map((p, pi) => <Bullet key={pi} light>{p}</Bullet>)}
                  </ul>
                )}
              </motion.div>
            ))}
          </div>

          {/* Due Diligence */}
          <motion.div {...fadeUp(0.2)} className="mt-10 bg-white/5 border border-white/10 rounded-2xl p-8">
            <h3 className="text-lg font-bold text-white mb-6 text-center">Due Diligence Process</h3>
            <div className="flex flex-wrap justify-center gap-3">
              {["Initial Screening", "NDA Execution", "Detailed Evaluation", "Financial & Legal Due Diligence", "Site Visits", "Investment Committee Approval"].map((step, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="flex items-center gap-2 bg-white/10 border border-white/10 rounded-full px-4 py-2">
                    <span className="text-[#D48035] text-xs font-bold">{String(i + 1).padStart(2, '0')}</span>
                    <span className="text-xs text-gray-300 font-medium">{step}</span>
                  </div>
                  {i < 5 && <ArrowRight className="w-3 h-3 text-[#D48035] hidden md:block" />}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── NRI EXIT ENGINE ── */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <motion.div {...fadeUp()} className="text-center mb-14">
            <SectionTitle>NRI Exit & Demand Engine</SectionTitle>
            <p className="section-subtitle max-w-xl mx-auto">Direct access to 32M+ global Indian diaspora - our platform's most powerful competitive advantage.</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
            <motion.div {...fadeUp(0.1)}>
              <Card className="h-full">
                <h3 className="text-lg font-bold text-[#111] mb-4">NRI Market Opportunity</h3>
                <div className="flex gap-4 mb-5">
                  <div className="bg-orange-50 border border-orange-100 rounded-xl p-4 flex-1 text-center">
                    <div className="text-xl font-bold text-[#D48035]">$135B+</div>
                    <div className="text-xs text-gray-500 mt-1">Annual Remittances</div>
                  </div>
                  <div className="bg-orange-50 border border-orange-100 rounded-xl p-4 flex-1 text-center">
                    <div className="text-xl font-bold text-[#D48035]">~40%</div>
                    <div className="text-xs text-gray-500 mt-1">Directed to Real Estate</div>
                  </div>
                </div>
                <ul className="space-y-2.5">
                  <Bullet>15 - 20% of housing demand driven by NRIs</Bullet>
                  <Bullet>Expected to grow to 25% of total market</Bullet>
                  <Bullet>Shift toward structured, return-driven investments</Bullet>
                </ul>
              </Card>
            </motion.div>
            <motion.div {...fadeUp(0.2)}>
              <Card className="h-full">
                <h3 className="text-lg font-bold text-[#111] mb-4">Developer Benefits</h3>
                <ul className="space-y-3">
                  <Bullet>Faster inventory sales through global pre-sales</Bullet>
                  <Bullet>Secondary exits to NRI buyers with USD-linked purchasing power</Bullet>
                  <Bullet>Premium pricing potential with international demand</Bullet>
                  <Bullet>Lower holding risk and faster capital rotation</Bullet>
                </ul>
              </Card>
            </motion.div>
          </div>

          {/* Growth Timeline */}
          <motion.div {...fadeUp(0.2)} className="bg-[#F8F8F8] rounded-2xl border border-gray-100 p-8">
            <h3 className="text-lg font-bold text-[#111] mb-6">Historical NRI Investment Growth</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { period: "2015 - 2018", label: "Foundation Phase", desc: "Primarily emotional/residential buying. Limited structured investments." },
                { period: "2019 - 2021", label: "Accelerating Phase", desc: "NRI share grows to 10 - 12% of market. Investments reach ~$13B annually." },
                { period: "2022 - 2024", label: "Growth Phase", desc: "~12% YoY increase (2023 - 24). Shift toward luxury + income-generating assets." },
                { period: "2025 - 2026", label: "Current Phase", desc: "$14B+ annual investment. ~20% market contribution. 35% YoY growth in key segments." },
              ].map((item, i) => (
                <div key={i} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                  <div className="text-xs font-bold text-[#D48035] uppercase tracking-wide mb-1">{item.period}</div>
                  <div className="text-sm font-bold text-[#111] mb-2">{item.label}</div>
                  <p className="text-[0.95rem] text-gray-500 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
            {/* <p className="mt-5 text-center text-sm font-semibold text-[#111] border-t border-gray-200 pt-5">
              Clear Shift: <span className="text-gray-400 font-normal">Emotional buying</span> &rarr; <span className="text-[#D48035]">Structured, return-driven investing</span>
            </p> */}
          </motion.div>
        </div>
      </section>

      {/* ── LEADERSHIP (INVESTATE) ── */}
      <section className="py-24 bg-[#F8F8F8]">
        <div className="container mx-auto px-4 max-w-6xl">
          <motion.div {...fadeUp()} className="text-center mb-16">
            <SectionTitle>Meet the Leadership</SectionTitle>
            <p className="section-subtitle max-w-2xl mx-auto">Connecting global capital access, diaspora connectivity, and structured investment expertise.</p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {[
              {
                name: "Deepak Kavadia",
                role: "Chief Executive Officer & Co-Founder",
                image: "/deepak.png",
                desc: "New York-based entrepreneur and global gemstone authority. Founder of Nice Gems Inc., Nice Jewels Inc., and Prestige Developers LLC, and Founder & Chairman of the NRI Federation, bringing over 35 years of cross-border investment and U.S.-India capital flow corridors."
              },
              {
                name: "Pankaj Gupta",
                role: "Co-Founder",
                image: "/pankaj.png",
                desc: "Has built a strong presence in the diamond and jewellery industry through Murari Cap Pvt. Ltd. and Avik Jewels, and is a recognized name in the Hyderabad real estate market through Swandurga Construction LLP."
              },
              {
                name: "Atish Agarwal",
                role: "Co-Founder",
                image: "/atish.png",
                desc: "Brings diversified entrepreneurial experience across textiles, retail, jewellery, and real estate advisory, with a focus on operations and structuring investment opportunities."
              }
            ].map((leader, i) => (
              <motion.div key={i} {...fadeUp(i * 0.1)} className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm flex flex-col justify-between">
                <div className="p-6 flex flex-col items-center text-center">
                  <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-[#D48035]/60 mb-4 shadow-lg shrink-0">
                    <img src={leader.image} alt={leader.name} className="w-full h-full object-cover object-top" />
                  </div>
                  <h3 className="text-lg font-bold text-[#111]">{leader.name}</h3>
                  <p className="text-[#D48035] text-xs font-semibold mt-1">{leader.role}</p>
                  <p className="text-gray-500 text-[0.95rem] mt-4 leading-relaxed text-left">{leader.desc}</p>
                </div>
                <div className="bg-gray-50 px-6 py-4 border-t border-gray-100">
                  <p className="text-[11px] text-gray-400 uppercase tracking-widest text-center">Investate Executive Leadership</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STRATEGIC ADVANTAGE & COMPETITIVE BENCHMARK ── */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <motion.div {...fadeUp()} className="text-center mb-14">
            <SectionTitle>Why Partner with Us?</SectionTitle>
            <p className="section-subtitle max-w-xl mx-auto">Investate India is not just a fund - it is a cross-border investment and exit platform combining capital, structuring, and liquidity.</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
            {[
              { title: "Access to Global Capital", desc: "Tap into our global institutional and NRI investor network spanning USA, UK, UAE, and beyond." },
              { title: "Flexible Deal Structuring", desc: "Secured debt, mezzanine, or equity - we design the right structure for your project." },
              { title: "Faster Execution", desc: "Streamlined due diligence and investor matching to accelerate time-to-capital." },
              { title: "Transparent Governance", desc: "Standardized disclosures, milestone tracking, and independent audits at every stage." },
              { title: "Long-Term Partnership", desc: "Not a one-time transaction - a lasting strategic relationship focused on mutual growth." },
              { title: "Built-In Exit Platform", desc: "Unique NRI exit engine that reduces developer holding risk and provides liquidity certainty." },
            ].map((item, i) => (
              <motion.div key={i} {...fadeUp(i * 0.07)}>
                <Card className="h-full hover:shadow-md transition-shadow">
                  <h3 className="text-base font-bold text-[#111] mb-2">{item.title}</h3>
                  <p className="text-gray-500 text-[1.05rem] leading-relaxed">{item.desc}</p>
                </Card>
              </motion.div>
            ))}
          </div>
          <motion.div {...fadeUp(0.2)} className="bg-[#1a1a1a] rounded-2xl p-8 text-center text-white">
            <p className="text-xl font-bold mb-2">Capital + Distribution + <span className="text-[#D48035]">Liquidity</span></p>
            <p className="text-gray-400 text-sm">Our unique position as a platform combining global capital deployment, structured finance, and a built-in exit model.</p>
          </motion.div>
        </div>
      </section>

      {/* ── ENGAGEMENT PROCESS ── */}
      <section className="py-24 bg-[#F8F8F8]">
        <div className="container mx-auto px-4 max-w-5xl">
          <motion.div {...fadeUp()} className="text-center mb-14">
            <SectionTitle>How to Partner with Us</SectionTitle>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { num: "01", step: "Proposal Submission" },
              { num: "02", step: "Preliminary Review" },
              { num: "03", step: "Letter of Interest (LOI)" },
              { num: "04", step: "Due Diligence" },
              { num: "05", step: "Structuring & Negotiation" },
              { num: "06", step: "Final Agreement" },
            ].map((item, i) => (
              <motion.div key={i} {...fadeUp(i * 0.07)} className="text-center">
                <div className="w-12 h-12 rounded-2xl bg-[#1a1a1a] text-white font-extrabold text-base flex items-center justify-center mx-auto mb-3 shadow">{item.num}</div>
                <p className="text-xs font-semibold text-[#111] leading-snug">{item.step}</p>
              </motion.div>
            ))}
          </div>
          <motion.div {...fadeUp(0.2)} className="mt-10 bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
            <h3 className="text-lg font-bold text-[#111] mb-5">Proposal Requirements</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {["Company Profile", "Project Details", "Financial Projections", "Capital Requirement", "Security Details", "Exit Strategy"].map((req, i) => (
                <div key={i} className="flex items-center gap-2.5 bg-[#F8F8F8] border border-gray-100 rounded-xl px-4 py-3">
                  <CheckCircle className="w-4 h-4 text-[#D48035] shrink-0" />
                  <span className="text-sm font-medium text-[#111]">{req}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── CONTACT ── */}
      <section className="py-24 bg-[#1a1a1a] text-white" id="contact">
        <div className="container mx-auto px-4 max-w-6xl">
          <motion.div {...fadeUp()} className="text-center mb-14">
            <SectionTitle light>Building the Future of India with Global Capital</SectionTitle>
            <p className="section-subtitle text-gray-400 max-w-xl mx-auto" style={{ color: '#9ca3af' }}>Investate partners with credible businesses to create secure, scalable, and high-value investment opportunities.</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

            {/* US Office */}
            <motion.div {...fadeUp(0.1)} className="bg-white/5 border border-white/10 rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-5">
                <span className="text-xs uppercase tracking-wider font-bold text-[#D48035] border border-[#D48035]/30 bg-[#D48035]/15 px-2.5 py-1 rounded">US</span>
                <h3 className="text-lg font-bold">United States Office</h3>
              </div>
              <div className="space-y-4 text-sm text-gray-300">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-[#D48035] shrink-0 mt-0.5" />
                  <p>55 West 47 Street, 4th Floor<br />New York, NY 10036, USA</p>
                </div>
                <div className="flex items-center gap-3">
                  <Globe className="w-4 h-4 text-[#D48035] shrink-0" />
                  <a href="https://www.investateindia.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#D48035] transition-colors">investateindia.com</a>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-[#D48035] shrink-0" />
                  <a href="mailto:usa.office@investateindia.com" className="hover:text-[#D48035] transition-colors">usa.office@investateindia.com</a>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-[#D48035] shrink-0 mt-0.5" />
                  <div>
                    <a href="tel:+19144731711" className="block hover:text-[#D48035] transition-colors">+1 914-473-1711</a>
                    <a href="tel:+12125756104" className="block hover:text-[#D48035] transition-colors">+1-212-575-6104</a>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* India Mumbai Office */}
            <motion.div {...fadeUp(0.2)} className="bg-white/5 border border-white/10 rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-5">
                <span className="text-xs uppercase tracking-wider font-bold text-[#D48035] border border-[#D48035]/30 bg-[#D48035]/15 px-2.5 py-1 rounded">IN</span>
                <h3 className="text-lg font-bold">Mumbai Office</h3>
              </div>
              <div className="space-y-4 text-sm text-gray-300">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-[#D48035] shrink-0 mt-0.5" />
                  <p>1401 Panchratna Building,<br />Opera House, Mumbai, India</p>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-[#D48035] shrink-0" />
                  <a href="tel:+919137835008" className="hover:text-[#D48035] transition-colors">+91-9137835008</a>
                </div>
              </div>
            </motion.div>

            {/* India Hyderabad Office */}
            <motion.div {...fadeUp(0.3)} className="bg-white/5 border border-white/10 rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-5">
                <span className="text-xs uppercase tracking-wider font-bold text-[#D48035] border border-[#D48035]/30 bg-[#D48035]/15 px-2.5 py-1 rounded">IN</span>
                <h3 className="text-lg font-bold">Hyderabad Corporate</h3>
              </div>
              <div className="space-y-4 text-sm text-gray-300">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-[#D48035] shrink-0 mt-0.5" />
                  <p>5th Floor, Sanghi One, Road no 10,<br />Banjara Hills, Hyderabad, TG.</p>
                </div>
                <div className="flex items-center gap-3">
                  <Globe className="w-4 h-4 text-[#D48035] shrink-0" />
                  <a href="https://www.investateindia.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#D48035] transition-colors">investateindia.com</a>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
