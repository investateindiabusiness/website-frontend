"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SlideAdPanel from "@/components/SlideAdPanel";
import PlayPauseButton from "@/components/PlayPauseButton";
import Head from "next/head";
import {
  CheckCircle,
  ArrowRight,
  Shield,
  FileText,
  Users,
  Building2,
  ChevronDown,
  ChevronUp,
  Phone,
  Mail,
  MapPin,
  Lock,
  Handshake,
  ClipboardList,
  BadgeCheck,
  Rocket,
  Briefcase,
  LineChart,
  Layers,
} from "lucide-react";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.55, delay, ease: "easeOut" },
});
const heroSlides = [
  {
    image: "/images/image copy 35.png",
    tag: "Structured Capital Support",
    title: "Unlock Growth Capital with",
    highlight: "Strategic Investment Solutions",
    subtitle:
      "Supporting infrastructure projects, real estate developers and businesses through structured capital solutions backed by evaluation, security, collateral, and clear exit planning.",
  },
  {
    image: "/images/equity2.png",
    tag: "Capital Partnership Evaluation",
    title: "Connecting Opportunities with",
    highlight: "Reliable Funding Networks",
    subtitle:
      "We assess project strength, financial feasibility, security structures, and repayment or exit strategies before facilitating capital partnerships.",
  },
];
const evaluationFocus = [
  {
    id: "01",
    icon: "LineChart",
    title: "Financial Strength & Returns",
    desc: "We review financial performance, projected returns, capital requirements, and repayment or exit strategies.",
  },
  {
    id: "02",
    icon: "Users",
    title: "Promoter Track Record",
    desc: "We evaluate leadership experience, previous project delivery, business credibility, and execution capability.",
  },
  {
    id: "03",
    icon: "FileText",
    title: "Collateral & Legal Readiness",
    desc: "Projects are reviewed based on available security, ownership documents, approvals, and compliance requirements.",
  },
  {
    id: "04",
    icon: "Layers",
    title: "Market Demand & Exit Plan",
    desc: "We analyze sales potential, pre-sale opportunities, market positioning, and planned investor exit timelines.",
  },
];
const proposalItems = [
  "Company profile and promoter background",
  "Financial statements and current performance details",
  "Project plan, business model, or growth strategy",
  "Capital requirement and utilization details",
  "Collateral, security, or asset backing information",
  "Expected returns and clear investor exit plan",
  "Legal approvals and ownership documents",
];

const compliancePoints = [
  {
    icon: "Shield",
    title: "Collateral & Security Validation",
    desc: "We review asset backing, collateral structure, ownership details, and available security before capital consideration.",
  },
  {
    icon: "FileText",
    title: "Legal Documentation Review",
    desc: "Projects must provide required approvals, ownership documents, agreements, and compliance information for verification.",
  },
  {
    icon: "LineChart",
    title: "Returns & Exit Planning",
    desc: "We evaluate expected returns, repayment strategy, project timelines, and clear investor exit opportunities.",
  },
  {
    icon: "Handshake",
    title: "Structured Capital Execution",
    desc: "Capital partnerships are structured with transparent terms, defined responsibilities, and protection mechanisms.",
  },
];
const faqs = [
  {
    q: "Who can apply for capital support?",
    a: "Real estate developers, infrastructure companies, and eligible businesses seeking structured capital, pre-sale support, or growth funding can submit their profile for evaluation.",
  },
  // {
  //   q: "Is there a fee for assessment?",
  //   a: "Yes. A professional assessment fee applies because our dedicated team performs financial review, project evaluation, documentation checks, and feasibility analysis.",
  // },
  {
    q: "How long does the evaluation process take?",
    a: "Total evaluation process usually takes 60 to 90 days depending on project complexity, documentation availability, and verification requirements.",
  },
  {
    q: "What requirements should my project meet?",
    a: "Projects must have clear documentation, legal compliance, financial visibility, security or collateral structure, and a defined return or exit plan.",
  },
  {
    q: "How does real estate capital support work?",
    a: "For real estate projects, support may include capital partnerships, pre-sale opportunities, investor connections, and structured exit planning based on evaluation.",
  },
  {
    q: "Is approval guaranteed after assessment?",
    a: "No. Capital support depends on evaluation results, investor alignment, risk review, collateral strength, and compliance approval.",
  },
];
const IconMap = {
  ClipboardList: ClipboardList,
  BadgeCheck: BadgeCheck,
  Handshake: Handshake,
  Lock: Lock,
  Building2: Building2,
  FileText: FileText,
  Shield: Shield,
  Users: Users,
  Rocket: Rocket,
  Briefcase: Briefcase,
  LineChart: LineChart,
  Layers: Layers,
};

export default function EquityRaisingPage() {
  const [openFaq, setOpenFaq] = useState(null);
  const [heroIndex, setHeroIndex] = useState(0);
  const [isHeroPaused, setIsHeroPaused] = useState(false);
  const [isPauseButtonHovered, setIsPauseButtonHovered] = useState(false);
  const totalSlides = heroSlides.length;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (isHeroPaused || isPauseButtonHovered) return;
    const timer = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % totalSlides);
    }, 8000);
    return () => clearInterval(timer);
  }, [isHeroPaused, isPauseButtonHovered, totalSlides]);

  return (
    <>
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </Head>
      <div
        className="theme-builder min-h-screen bg-white text-gray-800 flex flex-col"
        style={{
          fontFamily:
            "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        }}
      >
        <Header transparent={true} />

        {/* HERO */}
        <section className="fullscreen-section hero-section">
          <AnimatePresence mode="sync">
            <picture
              key={heroIndex}
              className="absolute inset-0 w-full h-full z-0"
            >
              <source
                media="(max-width: 768px)"
                srcSet={heroSlides[heroIndex]?.image.replace(
                  "w=2070",
                  "w=600&q=70",
                )}
              />
              <motion.img
                src={heroSlides[heroIndex]?.image.replace(
                  "w=2070",
                  "w=1200&q=75",
                )}
                alt="Hero background"
                className="absolute inset-0 w-full h-full object-cover z-0 hero-split-image"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.2, ease: "easeInOut" }}
                loading="eager"
                fetchPriority="high"
              />
            </picture>
          </AnimatePresence>
          <div className="absolute inset-0 z-[1] hero-split-overlay" />

          <PlayPauseButton
            isPaused={isHeroPaused}
            onClick={() => setIsHeroPaused((prev) => !prev)}
            onMouseEnter={() => setIsPauseButtonHovered(true)}
            onMouseLeave={() => setIsPauseButtonHovered(false)}
          />

          {/* Prev / Next buttons */}
          <button
            onClick={() =>
              setHeroIndex((prev) => (prev - 1 + totalSlides) % totalSlides)
            }
            aria-label="Previous image"
            style={{
              position: "absolute",
              left: "1.25rem",
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: 10,
              background: "rgba(255,255,255,0.15)",
              backdropFilter: "blur(6px)",
              border: "1px solid rgba(255,255,255,0.3)",
              borderRadius: "50%",
              width: "2.75rem",
              height: "2.75rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: "#fff",
              fontSize: "1.1rem",
              transition: "background 0.2s",
            }}
          >
            ❮
          </button>
          <button
            onClick={() => setHeroIndex((prev) => (prev + 1) % totalSlides)}
            aria-label="Next image"
            style={{
              position: "absolute",
              right: "1.25rem",
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: 10,
              background: "rgba(255,255,255,0.15)",
              backdropFilter: "blur(6px)",
              border: "1px solid rgba(255,255,255,0.3)",
              borderRadius: "50%",
              width: "2.75rem",
              height: "2.75rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: "#fff",
              fontSize: "1.1rem",
              transition: "background 0.2s",
            }}
          >
            ❯
          </button>

          {/* Dot indicators */}
          <div
            style={{
              position: "absolute",
              bottom: "1.5rem",
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 10,
              display: "flex",
              gap: "0.5rem",
            }}
          >
            {heroSlides.map((_, i) => (
              <button
                key={i}
                onClick={() => setHeroIndex(i)}
                aria-label={`Go to slide ${i + 1}`}
                style={{
                  width: i === heroIndex ? "1.5rem" : "0.5rem",
                  height: "0.5rem",
                  borderRadius: "9999px",
                  background:
                    i === heroIndex ? "#fff" : "rgba(255,255,255,0.45)",
                  border: "none",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  padding: 0,
                }}
              />
            ))}
          </div>

          <div className="container relative z-[2]">
            <div className="hero-content">
              <AnimatePresence mode="wait">
                <motion.div
                  key={heroIndex}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                >
                  <span className="hero-tag">{heroSlides[heroIndex]?.tag}</span>
                  <h1 className="hero-headline">
                    {heroSlides[heroIndex]?.title} <br />
                    <span className="text-accent">
                      {heroSlides[heroIndex]?.highlight}
                    </span>
                  </h1>
                  <p className="hero-subheadline">
                    {heroSlides[heroIndex]?.subtitle}
                  </p>
                </motion.div>
              </AnimatePresence>
              <div className="hero-cta-group">
                <a href="/contact-us" className="btn btn-primary">
                  Contact Us
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* DIVERSE PROFILES WE SUPPORT */}
        <section
          className="fullscreen-section my-20 py-20 bg-white"
          id="profiles"
        >
          <div className="container">
            <motion.div {...fadeUp()} className="text-center mb-14">
              <span className="inline-block bg-orange-50 text-[#D48035] text-sm font-bold px-3 py-1 rounded-full border border-orange-200 mb-4">
                Sourcing Scope
              </span>
              <h2 className="text-4xl md:text-5xl font-bold text-[#111] mb-4">
                Supported Venture Profiles
              </h2>
              <p className="text-gray-500 text-xl max-w-3xl mx-auto leading-relaxed">
                We evaluate and onboard ventures across multiple industries and
                growth stages, matching their capital requirements with global
                investment groups.
              </p>
            </motion.div>
            <div className="grid md:grid-cols-3 gap-8 items-stretch">
              <motion.div
                {...fadeUp(0.1)}
                className="bg-gray-50 rounded-2xl p-8 border border-gray-100 flex flex-col justify-between hover:shadow-lg transition-all"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center mb-6">
                    <Building2 className="w-6 h-6 text-[#D48035]" />
                  </div>
                  <h3 className="font-bold text-xl text-[#111] mb-3">
                    Real Estate & Infrastructure
                  </h3>
                  <p className="text-gray-500 text-base leading-relaxed">
                    Premium residential, commercial, and township developments
                    seeking equity matching or structured capital partnerships.
                  </p>
                </div>
              </motion.div>
              <motion.div
                {...fadeUp(0.2)}
                className="bg-gray-50 rounded-2xl p-8 border border-gray-100 flex flex-col justify-between hover:shadow-lg transition-all"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center mb-6">
                    <Rocket className="w-6 h-6 text-[#D48035]" />
                  </div>
                  <h3 className="font-bold text-xl text-[#111] mb-3">
                    Startups & Growth Ventures
                  </h3>
                  <p className="text-gray-500 text-base leading-relaxed">
                    High-growth enterprises and innovative startups with
                    validated metrics seeking early-stage or expansion venture
                    capital.
                  </p>
                </div>
              </motion.div>
              <motion.div
                {...fadeUp(0.3)}
                className="bg-gray-50 rounded-2xl p-8 border border-gray-100 flex flex-col justify-between hover:shadow-lg transition-all"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center mb-6">
                    <Briefcase className="w-6 h-6 text-[#D48035]" />
                  </div>
                  <h3 className="font-bold text-xl text-[#111] mb-3">
                    Corporate Enterprises
                  </h3>
                  <p className="text-gray-500 text-base leading-relaxed">
                    Established firms seeking growth capital, asset-backed
                    refinancing, or structured joint-venture syndication.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* EVALUATION FOCUS */}
        <section
          className="fullscreen-section py-20 bg-gray-50"
          id="evaluation"
        >
          <div className="container">
            <motion.div {...fadeUp()} className="text-center mb-14">
              <span className="inline-block bg-orange-50 text-[#D48035] text-sm font-bold px-3 py-1 rounded-full border border-orange-200 mb-4">
                Assessment Metrics
              </span>
              <h2 className="text-4xl md:text-5xl font-bold text-[#111] mb-4">
                Intake Assessment & Core Metrics
              </h2>
              <p className="text-gray-500 text-xl max-w-2xl mx-auto">
                Every profile undergoes a standardized evaluation of key
                statistics to ensure complete alignment with global investment
                standards.
              </p>
            </motion.div>
            <div className="grid md:grid-cols-2 gap-6">
              {evaluationFocus.map((focus, idx) => {
                const IconComp = IconMap[focus.icon];
                return (
                  <motion.div
                    key={focus.id}
                    {...fadeUp(idx * 0.1)}
                    className="bg-white rounded-2xl p-7 border border-gray-100 shadow-sm hover:shadow-md hover:border-[#D48035]/20 transition-all duration-300"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center shrink-0">
                        {IconComp && (
                          <IconComp className="w-6 h-6 text-[#D48035]" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-bold text-xl text-[#111] mb-2">
                          {focus.title}
                        </h3>
                        <p className="text-gray-500 text-lg leading-relaxed">
                          {focus.desc}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* GLOBAL STANDARDS */}
        <section
          className="fullscreen-section py-20 my-20 bg-white"
          id="compliance"
        >
          <div className="container">
            <motion.div {...fadeUp()} className="text-center mb-14">
              <span className="inline-block bg-orange-50 text-[#D48035] text-sm font-bold px-3 py-1 rounded-full border border-orange-200 mb-4">
                Capital Protection Framework{" "}
              </span>
              <h2 className="text-4xl md:text-5xl font-bold text-[#111] mb-4">
                Secure & Structured Investment Process{" "}
              </h2>
              <p className="text-gray-500 text-xl max-w-2xl mx-auto">
                Every opportunity goes through financial, legal, collateral, and
                exit strategy evaluation to create secure and transparent
                capital partnerships.
              </p>
            </motion.div>
            <div className="grid md:grid-cols-2 gap-6">
              {compliancePoints.map((point, idx) => {
                const IconComp = IconMap[point.icon];
                return (
                  <motion.div
                    key={idx}
                    {...fadeUp(idx * 0.1)}
                    className="flex gap-5 bg-gray-50 rounded-2xl p-7 border border-gray-100 hover:border-[#D48035]/20 transition-all"
                  >
                    <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center shrink-0">
                      {IconComp && (
                        <IconComp className="w-6 h-6 text-[#D48035]" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold text-xl text-[#111] mb-2">
                        {point.title}
                      </h3>
                      <p className="text-gray-500 text-base leading-relaxed">
                        {point.desc}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
            {/* <motion.div
              {...fadeUp(0.4)}
              className="mt-10 rounded-2xl overflow-hidden border border-[#D48035]/20"
            >
              <div className="bg-[#D48035] px-8 py-5">
                <h3 className="text-white font-bold text-xl">
                  Security-Backed Capital Approach{" "}
                </h3>
              </div>
              <div className="bg-[#D48035]/5 px-8 py-6">
                <p className="text-gray-700 text-lg leading-relaxed">
                  Every capital opportunity is structured around transparency,
                  asset security, legal readiness, and defined exit planning.
                  Our process helps align businesses and investors through
                  proper evaluation, documentation, and mutually agreed
                  investment structures.
                </p>
              </div>
            </motion.div>a */}
          </div>
        </section>

        {/* REQUIRED INFORMATION */}
        <section
          className="fullscreen-section py-20"
          style={{
            background: "linear-gradient(135deg, #111 0%, #1e1e1e 100%)",
          }}
          id="proposal"
        >
          <div className="container">
            <motion.div {...fadeUp()} className="text-center mb-12">
              <span className="inline-block bg-[#D48035]/10 text-[#D48035] text-sm font-bold px-3 py-1 rounded-full border border-[#D48035]/30 mb-4">
                Prerequisites
              </span>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Vetting Prerequisites & Onboarding Requirements
              </h2>
              <p className="text-gray-400 text-xl max-w-2xl mx-auto">
                To evaluate capital eligibility, our team reviews business
                strength, financial details, collateral support, legal
                readiness, and planned return structures.
              </p>
            </motion.div>
            <motion.div
              {...fadeUp(0.15)}
              className="bg-white/5 border border-white/10 rounded-2xl p-8 md:p-10 max-w-3xl mx-auto w-full"
            >
              <div className="grid md:grid-cols-2 gap-x-8 gap-y-5 px-2 md:px-4">
                {proposalItems.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3.5 text-gray-300 text-lg leading-relaxed"
                  >
                    <CheckCircle className="w-5 h-5 text-[#D48035] shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
              <div className="mt-8 pt-8 border-t border-white/10">
                <p className="text-gray-400 text-lg text-center">
                  Need guidance?{" "}
                  <span className="text-[#D48035] font-semibold">
                    Reach out to us
                  </span>{" "}
                  – our analysts will guide you on the key statistics required
                  for assessment.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* FAQs */}
        <section className="fullscreen-section py-20 bg-gray-50" id="faq">
          <div className="container my-20">
            <motion.div {...fadeUp()} className="text-center mb-12">
              <span className="inline-block bg-orange-50 text-[#D48035] text-sm font-bold px-3 py-1 rounded-full border border-orange-200 mb-4">
                Information Desk
              </span>
              <h2 className="text-4xl md:text-5xl font-bold text-[#111] mb-4">
                Capital Sourcing Information & FAQ
              </h2>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
              {/* Left Column */}
              <div className="space-y-5">
                {faqs.slice(0, Math.ceil(faqs.length / 2)).map((faq, idx) => (
                  <motion.div
                    key={idx}
                    {...fadeUp(idx * 0.07)}
                    className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden"
                  >
                    <button
                      onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                      className="w-full flex items-center justify-between px-6 py-5 text-left gap-4"
                    >
                      <span className="font-semibold text-[#111] text-lg leading-snug">
                        {faq.q}
                      </span>

                      {openFaq === idx ? (
                        <ChevronUp className="w-5 h-5 text-[#D48035]" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      )}
                    </button>

                    {openFaq === idx && (
                      <div className="px-6 pb-5 text-gray-500 text-lg leading-relaxed border-t border-gray-50 pt-4">
                        {faq.a}
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>

              {/* Right Column */}
              <div className="space-y-5">
                {faqs.slice(Math.ceil(faqs.length / 2)).map((faq, i) => {
                  const idx = i + Math.ceil(faqs.length / 2);

                  return (
                    <motion.div
                      key={idx}
                      {...fadeUp(idx * 0.07)}
                      className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden"
                    >
                      <button
                        onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                        className="w-full flex items-center justify-between px-6 py-5 text-left gap-4"
                      >
                        <span className="font-semibold text-[#111] text-lg leading-snug">
                          {faq.q}
                        </span>

                        {openFaq === idx ? (
                          <ChevronUp className="w-5 h-5 text-[#D48035]" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-400" />
                        )}
                      </button>

                      {openFaq === idx && (
                        <div className="px-6 pb-5 text-gray-500 text-lg leading-relaxed border-t border-gray-50 pt-4">
                          {faq.a}
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        <SlideAdPanel zoneId="zone1" forceRole="service-provider" />

        <Footer />
      </div>
    </>
  );
}
