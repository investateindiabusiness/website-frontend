"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import AwardsSection from "@/components/AwardsSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import DeepakProfileSection from "@/components/DeepakProfileSection";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AdBanner from "@/components/AdBanner";
import InterstitialAdBanner from "@/components/InterstitialAdBanner";
import SlideAdPanel from "@/components/SlideAdPanel";

import {
  ShieldCheck,
  Scale,
  Users,
  FileText,
  Activity,
  Layers,
  Coins,
  Target,
  Compass,
  Award,
  CheckCircle2,
  ChevronRight,
  Play,
  Star,
  MapPin,
  Building2,
  TrendingUp,
  Shield,
  Briefcase,
  Globe,
  ArrowRight,
  Zap,
} from "lucide-react";

const heroSlides = [
  {
    image: "/images/build.png",
    tag: "Global Investment Ecosystem",
    title: "INVESTATE INDIA",
    highlight: "Your Gateway to Indian Growth",
    subtitle:
      "Connecting global investors, trusted builders, businesses, and professional partners through a transparent investment ecosystem.",
  },
  {
    image: "/images/image copy 8.png",
    tag: "Trusted Cross-Border Platform",
    title: "Bridging Global Capital with",
    highlight: "Indian Opportunities",
    subtitle:
      "Explore real estate, capital partnerships, professional services, and growth opportunities through one integrated platform.",
  },
];

const serviceProviderBenefits = [
  {
    title: "Trusted Investment Access",
    desc: "Helping investors discover verified real estate, growth opportunities, and structured investment options across India.",
    image:
      "https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=2070&auto=format&fit=crop",
  },
  {
    title: "Complete Partner Ecosystem",
    desc: "Connecting builders, service professionals, advisors, and investors through one transparent platform.",
    image:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2070&auto=format&fit=crop",
  },
  {
    title: "Long-Term Growth Support",
    desc: "Supporting every stage from discovery and funding to management, compliance, and exit planning.",
    image:
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop",
  },
];
const serviceProviderChallenges = [
  {
    id: "01",
    text: "Investor Access",
    desc: "Helping global investors discover verified Indian real estate, growth opportunities, and professional support through one ecosystem.",
    icon: <Compass className="w-8 h-8 text-white" />,
  },
  {
    id: "02",
    text: "Builder Growth",
    desc: "Connecting trusted developers with NRI investors, capital partners, and global market visibility.",
    icon: <Building2 className="w-8 h-8 text-white" />,
  },
  {
    id: "03",
    text: "Professional Network",
    desc: "Bringing legal, tax, advisory, property, and financial experts together to support complete investment journeys.",
    icon: <Layers className="w-8 h-8 text-white" />,
  },
  {
    id: "04",
    text: "Capital Solutions",
    desc: "Supporting businesses and projects with structured capital access, documentation, security evaluation, and exit planning.",
    icon: <Target className="w-8 h-8 text-white" />,
  },
];

const serviceProviderSteps = [
  {
    id: "1",
    title: "Deepak Kavadia",
    text: "CEO & Co-Founder. New York-based entrepreneur and global gemstone authority. Founder of Nice Gems Inc., Nice Jewels Inc., and Prestige Developers LLC.",
  },
  {
    id: "2",
    title: "Pankaj Gupta",
    text: "Co-Founder. Has built a strong presence in the diamond and jewellery industry and is a recognized name in the Hyderabad real estate market.",
  },
  {
    id: "3",
    title: "Atish Agarwal",
    text: "Co-Founder. Brings diversified entrepreneurial experience across textiles, retail, jewellery, and real estate advisory.",
  },
];

const stepImages = ["/deepak.png", "/pankaj.png", "/atish.png"];

function NriChallengeCard({ challenge }) {
  const [flipped, setFlipped] = useState(false);
  return (
    <div
      onMouseEnter={() => setFlipped(true)}
      onMouseLeave={() => setFlipped(false)}
      onClick={() => setFlipped((f) => !f)}
      style={{
        background: flipped ? "#fdf6ee" : "#ffffff",
        border: flipped
          ? "1px solid rgba(212,128,53,0.3)"
          : "1px solid rgba(226,232,240,0.9)",
        borderRadius: "1.5rem",
        padding: "1.75rem",
        cursor: "pointer",
        minHeight: "210px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        boxShadow: flipped
          ? "0 4px 16px rgba(212,128,53,0.12)"
          : "0 1px 4px rgba(0,0,0,0.06)",
        transition:
          "background 0.3s ease, border 0.3s ease, box-shadow 0.3s ease",
      }}
    >
      {flipped ? (
        <div
          style={{ display: "flex", flexDirection: "column", gap: "0.65rem" }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: "#61a534",
                flexShrink: 0,
              }}
            />
            <span
              style={{
                fontSize: "10px",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.12em",
                color: "#61a534",
              }}
            >
              Our Solution
            </span>
          </div>
          <h4
            style={{
              fontSize: "0.9375rem",
              fontWeight: 700,
              color: "#D48035",
              lineHeight: 1.35,
              margin: 0,
            }}
          >
            {challenge.title}
          </h4>
          <p
            style={{
              fontSize: "0.8125rem",
              color: "#475569",
              lineHeight: 1.65,
              margin: 0,
            }}
          >
            {challenge.solution}
          </p>
          <span
            style={{
              fontSize: "11px",
              color: "rgba(97,165,52,0.55)",
              alignSelf: "flex-end",
              marginTop: "0.5rem",
            }}
          >
            ✓ Investate India
          </span>
        </div>
      ) : (
        <div
          style={{ display: "flex", flexDirection: "column", gap: "0.65rem" }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: "#f87171",
                flexShrink: 0,
              }}
            />
            <span
              style={{
                fontSize: "10px",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.12em",
                color: "#f87171",
              }}
            >
              The Challenge
            </span>
          </div>
          <h4
            style={{
              fontSize: "0.9375rem",
              fontWeight: 700,
              color: "#1e293b",
              lineHeight: 1.35,
              margin: 0,
            }}
          >
            {challenge.title}
          </h4>
          <p
            style={{
              fontSize: "0.8125rem",
              color: "#94a3b8",
              lineHeight: 1.65,
              margin: 0,
            }}
          >
            {challenge.desc}
          </p>
          <span
            style={{
              fontSize: "11px",
              color: "#e2e8f0",
              alignSelf: "flex-end",
              marginTop: "0.5rem",
            }}
          >
            Hover to see solution →
          </span>
        </div>
      )}
    </div>
  );
}

export default function ServiceProviderHome() {
  const router = useRouter();
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [heroIndex, setHeroIndex] = useState(0);
  const [isHeroPaused, setIsHeroPaused] = useState(false);
  const [isPauseButtonHovered, setIsPauseButtonHovered] = useState(false);

  const handleAuthClick = (action, role) => {
    if (action === "login") {
      router.push("/service-provider/login");
    } else {
      router.push("/service-provider/register");
    }
  };

  useEffect(() => {
    if (isHeroPaused || isPauseButtonHovered) return;
    const timer = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % heroSlides.length);
    }, 8000);
    return () => clearInterval(timer);
  }, [isHeroPaused, isPauseButtonHovered]);

  const activeStepData = serviceProviderSteps[activeStepIndex];
  const totalSlides = heroSlides.length;

  return (
    <div className="theme-builder w-full bg-white overflow-x-hidden">
      <Header transparent={true} />

      {/* HERO SECTION */}
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

        <button
          type="button"
          onClick={() => setIsHeroPaused((prev) => !prev)}
          onMouseEnter={() => setIsPauseButtonHovered(true)}
          onMouseLeave={() => setIsPauseButtonHovered(false)}
          onFocus={() => setIsPauseButtonHovered(true)}
          onBlur={() => setIsPauseButtonHovered(false)}
          aria-label={
            isHeroPaused ? "Resume auto-rotation" : "Pause auto-rotation"
          }
          className="absolute bottom-16 left-1/2 -translate-x-1/2 z-[30] flex min-w-[112px] items-center justify-center gap-2 rounded-full border border-white/40 bg-slate-950/80 px-4 py-3 text-[12px] font-semibold uppercase tracking-[0.3em] text-white shadow-xl shadow-black/35 backdrop-blur-md transition-all duration-200 hover:bg-slate-800/90"
        >
          <span className="text-base leading-none">
            {isHeroPaused ? "▶" : "⏸"}
          </span>
          {isHeroPaused ? "Play" : "Pause"}
        </button>

        {/* Prev / Next buttons */}
        <button
          onClick={() =>
            setHeroIndex((prev) => (prev - 1 + totalSlides) % totalSlides)
          }
          aria-label="Previous image"
          className="absolute left-5 top-1/2 -translate-y-1/2 z-[20] bg-white/10 backdrop-blur-md border border-white/20 rounded-full w-11 h-11 flex items-center justify-center cursor-pointer text-white hover:bg-white/25 transition-colors"
        >
          ❮
        </button>
        <button
          onClick={() => setHeroIndex((prev) => (prev + 1) % totalSlides)}
          aria-label="Next image"
          className="absolute right-5 top-1/2 -translate-y-1/2 z-[20] bg-white/10 backdrop-blur-md border border-white/20 rounded-full w-11 h-11 flex items-center justify-center cursor-pointer text-white hover:bg-white/25 transition-colors"
        >
          ❯
        </button>

        {/* Slide dots */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[20] flex gap-2">
          {Array.from({ length: totalSlides }).map((_, i) => (
            <button
              key={i}
              onClick={() => setHeroIndex(i)}
              aria-label={`Go to slide ${i + 1}`}
              style={{
                width: i === heroIndex ? "1.5rem" : "0.5rem",
                height: "0.5rem",
                borderRadius: "9999px",
                background: i === heroIndex ? "#fff" : "rgba(255,255,255,0.45)",
                border: "none",
                cursor: "pointer",
                transition: "all 0.3s ease",
                padding: 0,
              }}
            />
          ))}
        </div>

        {/* Slide content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`slide-${heroIndex}`}
            className="absolute inset-0 z-[2] container flex flex-col justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <div className="hero-content">
              <span className="hero-tag bg-slate-700/80 text-blue-200 border-none">
                {heroSlides[heroIndex]?.tag}
              </span>
              <h1 className="hero-headline">
                {heroSlides[heroIndex]?.title} <br />
                <span className="text-white">
                  {heroSlides[heroIndex]?.highlight}
                </span>
              </h1>
              <p className="hero-subheadline">
                {heroSlides[heroIndex]?.subtitle}
              </p>
              <div className="hero-cta-group flex gap-4">
                <button
                  onClick={() => router.push("/contact-us")}
                  className="btn bg-[#D48035] hover:bg-[#B45309] border-none text-white px-8 py-3 rounded-full font-bold shadow-lg transition-transform hover:scale-105 active:scale-95"
                >
                  Talk to Us
                </button>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </section>

      {/* Zone 1 — Homepage Hero Leaderboard: fixed right-side panel, opens by default */}
      <SlideAdPanel zoneId="zone1" forceRole="service-provider" />

      {/* Executive Summary Section */}
      <section
        className="py-20"
        id="executive-summary"
        style={{ backgroundColor: "#f8f8f8" }}
      >
        <div className="container mx-auto px-4 md:px-12 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            {/* Left Column - Intro & Context */}
            <div className="lg:col-span-5 flex flex-col gap-8">
              <div>
                {/* <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#D48035] mb-3 block">
                                    Executive Summary
                                </span> */}
                <h3
                  className="responsive-heading text-left"
                  style={{ color: "#1a1a1a" }}
                >
                  Gateway to <br />
                  <span className="text-[#D48035]">Indian Opportunities</span>
                </h3>
                <p className="text-slate-600 text-base md:text-lg leading-relaxed mt-4">
                  A comprehensive platform connecting global capital with
                  verified investment opportunities across India.
                </p>
              </div>

              {/* Why Now */}
              <div
                style={{
                  borderLeft: "4px solid #D48035",
                  paddingLeft: "1.5rem",
                  margin: "1.5rem 0",
                }}
              >
                <h4 className="text-xs font-bold uppercase tracking-[0.25em] text-[#D48035] mb-2">
                  Why Now
                </h4>
                <p className="text-slate-600 text-sm md:text-base leading-relaxed italic mb-4">
                  "Digital adoption, regulatory transparency and rising NRI
                  wealth are creating significant demand for trusted investment
                  platforms."
                </p>
                <h5 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-3">
                  Key NRI Challenges:
                </h5>
                <ul className="text-slate-600 text-xs md:text-sm leading-relaxed space-y-2 list-none p-0 m-0">
                  <li className="flex items-start gap-2">
                    <span className="text-[#D48035] font-bold">•</span>
                    <span>
                      <strong>Lack of Trust & Transparency:</strong> Remote
                      property selection is plagued by unverified details and
                      lacks institutional due diligence.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#D48035] font-bold">•</span>
                    <span>
                      <strong>Compliance & Taxation Hurdles:</strong> Navigating
                      FEMA regulations, PAN/TAN setups, and complex TDS or
                      repatriation compliance.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#D48035] font-bold">•</span>
                    <span>
                      <strong>Distance Management:</strong> Managing properties,
                      renting out, or resolving legal disputes from overseas
                      without a trusted local interface.
                    </span>
                  </li>
                </ul>
              </div>

              {/* Market Stats
                            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-300">
                                {[
                                    { stat: "35M+", label: "NRIs Globally" },
                                    { stat: "Top 5", label: "Global Economy" },
                                    { stat: "Rising", label: "NRI Participation" }
                                ].map((item, i) => (
                                    <div key={i}>
                                        <div className="text-2xl md:text-3xl font-bold text-[#1a1a1a] leading-none">{item.stat}</div>
                                        <p className="text-xs font-semibold text-slate-500 mt-1.5 leading-tight">{item.label}</p>
                                    </div>
                                ))}
                            </div> */}
            </div>

            {/* Right Column - Details & Capabilities */}
            <div className="lg:col-span-7 flex flex-col gap-10">
              {/* What Are We */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <h4 className="text-lg md:text-xl font-bold text-[#1a1a1a] m-0">
                    What Are We
                  </h4>
                </div>
                <p className="text-slate-600 text-sm md:text-base leading-relaxed">
                  Investate India is a global investment gateway connecting
                  Global Investors with verified Indian opportunities through
                  trusted partners, technology, and end-to-end support.{" "}
                </p>
              </div>

              {/* Mission & Vision Side-by-Side */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Compass className="w-4 h-4 text-[#D48035] shrink-0" />
                    <h5 className="text-xs font-bold uppercase tracking-widest text-[#1a1a1a] m-0">
                      Mission
                    </h5>
                  </div>
                  <p className="text-slate-600 text-sm md:text-base leading-relaxed">
                    To simplify and secure investments into India through
                    technology, transparency and trusted partnerships.
                  </p>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Award className="w-4 h-4 text-[#D48035] shrink-0" />
                    <h5 className="text-xs font-bold uppercase tracking-widest text-[#1a1a1a] m-0">
                      Vision
                    </h5>
                  </div>
                  <p className="text-slate-600 text-sm md:text-base leading-relaxed">
                    To become the most trusted global gateway for investments
                    into India.
                  </p>
                </div>
              </div>

              {/* Platform Capabilities */}
              <div
                style={{
                  borderTop: "1px solid rgba(0,0,0,0.1)",
                  paddingTop: "2rem",
                }}
              >
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg md:text-xl font-bold text-[#1a1a1a] m-0">
                    Platform Capabilities
                  </h4>
                  {/* <span className="text-xs font-bold uppercase tracking-widest text-[#D48035]">8 Services</span> */}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
                  {[
                    "Verified Real Estate Opportunities",
                    "Pre-Launch & Growth Projects",
                    "Builder Partnership Network",
                    "Capital Sourcing Support",
                    "Professional Service Marketplace",
                    "Legal & Compliance Assistance",
                    "Property Management Support",
                    "Exit Planning & Investment Support",
                    // "Import & Export Services",
                    // "NRI Services",
                  ].map((cap, i) => (
                    <div key={i} className="flex items-center gap-2.5">
                      <span className="w-1.5 h-1.5 bg-[#D48035] rounded-full shrink-0" />
                      <span className="text-slate-600 text-sm md:text-base leading-relaxed">
                        {cap}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Market Challenges Section */}
      <section id="challenges" className="infra-section py-20 bg-[#f8f8f8]">
        <div className="infra-section-header text-center mb-12">
          <h2 className="infra-title text-3xl md:text-4xl font-bold text-[#1a1a1a]">
            One Platform.{" "}
            <span className="infra-title-accent text-[#D48035]">
              Complete Investment Ecosystem.
            </span>
          </h2>
          <p className="infra-subtitle max-w-2xl mx-auto mt-4 text-slate-600">
            Investate India connects investors, builders, businesses, and
            professional partners through a trusted cross-border ecosystem built
            on transparency, verification, and long-term relationships.
          </p>
        </div>

        <div className="infra-marquee-wrapper">
          <div className="infra-marquee-track">
            {[
              ...serviceProviderChallenges,
              ...serviceProviderChallenges,
              ...serviceProviderChallenges,
              ...serviceProviderChallenges,
            ].map((challenge, i) => (
              <div
                key={i}
                className="infra-marquee-card bg-white border border-slate-200/80 p-6 rounded-2xl w-80 shrink-0 mx-4 shadow-sm"
              >
                <div className="infra-card-icon-wrapper bg-[#D48035] p-3 rounded-xl w-14 h-14 flex items-center justify-center mb-4 text-white">
                  {challenge.icon}
                </div>
                <h3 className="infra-card-title text-lg font-bold text-[#1a1a1a] mb-2">
                  {challenge.text}
                </h3>
                <p className="infra-card-desc text-xs text-slate-600 leading-relaxed">
                  {challenge.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Strategic Advantages (Benefits) */}
      <section
        className="fullscreen-section section-theme py-20"
        style={{ backgroundColor: "#ffffff" }}
        id="benefits"
      >
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              className="flex flex-col gap-10"
              initial={{ x: -60, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <div>
                <h2
                  className="responsive-heading text-3xl md:text-4xl font-bold mb-4"
                  style={{ color: "#111" }}
                >
                  Building India's Global <br />
                  <span style={{ color: "#D48035" }}>Investment Ecosystem</span>
                </h2>
                <p className="responsive-paragraph text-slate-600 mb-8 max-w-lg">
                  A unified platform where investors, builders, businesses, and
                  professional experts collaborate through trust, transparency,
                  and structured support.
                </p>

                <div className="flex flex-col gap-8">
                  {serviceProviderBenefits.map((benefit, index) => (
                    <div
                      key={index}
                      className="border-l-4 border-[#D48035] pl-5"
                    >
                      <h4 className="text-lg font-bold text-slate-900 mb-2">
                        {benefit.title}
                      </h4>
                      <p className="text-sm text-slate-600 leading-relaxed">
                        {benefit.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            <motion.div
              className="relative h-[300px] md:h-[400px] flex items-center justify-center"
              initial={{ x: 60, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
            >
              <div className="w-[85%] h-[85%] rounded-3xl overflow-hidden shadow-lg border border-slate-100">
                <img
                  src="/images/image copy 22.png"
                  alt="Professional Consultations"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="absolute right-0 bottom-5 w-[60%] h-[55%] rounded-3xl border-8 border-white overflow-hidden shadow-2xl z-10">
                <img
                  src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=1000&auto=format&fit=crop"
                  alt="Legal Trust Contract Signing"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Zone 2 — Homepage Mid-Page Banner: dismissible interstitial between sections */}
      <InterstitialAdBanner zoneId="zone2" />

      <AwardsSection />

      {/* ORGANIZATION / TEAM SECTION */}
      <section
        className="team-section-integrated section-theme py-16"
        id="how-it-works"
      >
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Meet the Team Behind{" "}
              <span className="text-highlight">Your Trust</span>
            </h2>
            <p className="text-slate-600 dark:text-slate-300 max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
              <strong>Built on transparency. Driven by experience.</strong>
              <br />
              Investate India is led by Deepak Kavadia, Pankaj Gupta and Atish
              Agarwal.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-8">
            {[
              {
                name: "Deepak Kavadia",
                role: "CEO & Founder",
                image: "/deepak.png",
              },
              {
                name: "Pankaj Gupta",
                role: "Co-Founder",
                image: "/pankaj.png",
              },
              {
                name: "Atish Agarwal",
                role: "Co-Founder",
                image: "/atish.png",
              },
            ].map((member, index) => (
              <div className="team-card-premium" key={index}>
                <div className="team-card-image">
                  <img
                    src={member.image}
                    alt={member.name}
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <div className="team-card-info">
                  <h4 className="team-card-name">{member.name}</h4>
                  <p className="team-card-role">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Connecting Global Capital Section (Redesigned as NRI Challenges) */}
      <section
        className="py-24 bg-[#F8F8F8] dark:bg-[#111]"
        id="connecting-global"
      >
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Centered Heading at the Top */}
          <div className="text-center mb-16">
            <span className="text-[#D48035] text-xs font-bold uppercase tracking-[0.25em] block mb-3">
              NRI Investor Hurdles
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-white leading-tight mb-4">
              Key Challenges &{" "}
              <span className="text-[#D48035]">Our Solutions</span>
            </h2>
            <p className="text-slate-600 dark:text-slate-300 max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
              We understand the real hurdles NRIs face — and we&apos;ve built
              dedicated solutions for every one of them.
            </p>
          </div>

          {/* Hint text */}
          <p className="text-center text-xs text-slate-400 dark:text-slate-500 mb-8 -mt-8 italic">
            Hover over a card to see how we solve it
          </p>

          {/* Flip Card Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                title: "Lack of Trust & Transparency",
                desc: "Unverified listings, unknown developers, no visibility on project progress.",
                solution:
                  "End-to-end verified listings, due diligence reports & real-time project updates — invest with total confidence.",
              },
              {
                title: "Compliance & Taxation",
                desc: "FEMA, TDS, capital gains tax, and repatriation rules are complex without expert help.",
                solution:
                  "Our legal & tax experts handle every compliance step — from FEMA to penalty-free repatriation.",
              },
              {
                title: "Remote Property Management",
                desc: "Tenant issues, maintenance & legal disputes are nearly impossible to manage from abroad.",
                solution:
                  "We are your trusted on-ground partner — tenants, maintenance & legal support, handled for you.",
              },
              {
                title: "Limited Investment Access",
                desc: "NRIs often miss access to verified pre-launch projects, premium developments, rental assets, and structured investment opportunities.",
                solution:
                  "Access a curated portfolio including RERA projects, pre-launch opportunities, rental income assets, equity options, and professionally evaluated investments.",
              },
              {
                title: "Investment Lifecycle Challenges",
                desc: "Buying is only one stage — managing documents, tracking progress, optimizing returns, and planning exits requires continuous support.",
                solution:
                  "From discovery to ownership, portfolio monitoring, rental strategy, resale planning, and exit assistance — we support the complete investment journey.",
              },
              {
                title: "Reliable Local Network Gap",
                desc: "Finding trusted lawyers, tax consultants, property managers, and financial advisors from overseas is difficult.",
                solution:
                  "Connect with verified service providers for legal, taxation, compliance, documentation, property care, and advisory services through one ecosystem.",
              },
            ].map((challenge, i) => (
              <NriChallengeCard key={i} challenge={challenge} />
            ))}
          </div>
        </div>
      </section>

      <TestimonialsSection />

      {/* <DeepakProfileSection /> */}

      {/* CONTACT SECTION */}
      <section
        className="fullscreen-section py-20 text-white text-center"
        style={{ backgroundColor: "#1a1a1a" }}
        id="contact"
      >
        <div className="container max-w-3xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Connect with our team to explore <br />
            investment opportunities in India.
          </h2>
          <p className="text-slate-400 mb-8 max-w-xl mx-auto text-sm md:text-base leading-relaxed">
            Get personalized assistance from our relationship managers and
            navigate your investment path seamlessly.
          </p>
          <div className="flex justify-center">
            <button
              onClick={() => router.push("/contact-us")}
              className="bg-[#D48035] hover:bg-[#b06725] text-white font-bold px-10 py-4 rounded-full transition-transform hover:scale-105 shadow-xl"
            >
              Talk to Our Team
            </button>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
