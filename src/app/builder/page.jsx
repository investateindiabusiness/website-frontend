"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AwardsSection from "@/components/AwardsSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import DeepakProfileSection from "@/components/DeepakProfileSection";
import {
  Globe,
  Search,
  ShieldCheck,
  Users,
  FileText,
  Activity,
  Award,
  TrendingUp,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
const heroSlides = [
  {
    image: "/images/image (2).png",
    tag: "Institutional Capital Access",
    title: "Direct Connectivity to",
    highlight: "High-Net-Worth NRI Capital",
    subtitle:
      "The definitive institutional-grade platform for visionary Indian developers to engage directly with a pre-vetted global network of sophisticated NRI investors.",
  },
  {
    image: "/images/buil-hero.png",
    tag: "Global Reach & Trust",
    title: "Elevate Your Brand with",
    highlight: "Verified Institutional Credibility",
    subtitle:
      "Position your developments within a transparency-first ecosystem that reinforces your reputation for corporate governance and delivery excellence to a global audience.",
  },
];

const builderBenefits = [
  {
    title: "Qualified NRI Leads",
    desc: "Access to investors who've already shown serious interest and buying intent, not casual browsers.",
    image:
      "https://images.unsplash.com/photo-1570129477492-45c003edd2be?q=80&w=2070&auto=format&fit=crop",
  },
  {
    title: "Professional Presentation",
    desc: "Your projects showcased in standardized, credible formats that build investor confidence.",
    image:
      "https://images.unsplash.com/photo-1512403754473-27835f7b9984?q=80&w=2070&auto=format&fit=crop",
  },
  {
    title: "No Junk Inquiries",
    desc: "We pre-screen investors to ensure you're connecting with genuine buyers, saving your team time.",
    image:
      "https://images.unsplash.com/photo-1516156008625-3a9d6067fab5?q=80&w=2070&auto=format&fit=crop",
  },
  {
    title: "Long-Term Relationships",
    desc: "Connect with investors looking for credible partners, not just one-time speculative deals.",
    image:
      "https://images.unsplash.com/photo-1542621334-a254cf47733d?q=80&w=2070&auto=format&fit=crop",
  },
  {
    title: "Enhanced Credibility",
    desc: "Association with a transparency-focused platform strengthens your brand trust among global investors.",
    image:
      "https://images.unsplash.com/photo-1507537297725-24a1c029d3ca?q=80&w=2070&auto=format&fit=crop",
  },
  {
    title: "Dedicated Support",
    desc: "We handle coordination and follow-ups, allowing you to focus on development excellence.",
    image: "/images/image4.png",
  },
  {
    title: "Global Logistics Solved",
    desc: "Overcome communication delays and coordination challenges due to international time zones.",
    image:
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2070&auto=format&fit=crop",
  },
  {
    title: "Brand Visibility",
    desc: "Strengthen your reputation in international markets, expanding your reach to the global Indian diaspora.",
    image:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=2070&auto=format&fit=crop",
  },
];

const builderChallenges = [
  {
    id: "01",
    text: "Global Investor Reach",
    desc: "Reaching genuine NRI buyers and investors across international markets requires strong networks and trust.",
    icon: <Globe className="w-8 h-8 text-white" />,
  },
  {
    id: "02",
    text: "Quality Lead Access",
    desc: "Finding serious investors with genuine interest is challenging through traditional marketing channels.",
    icon: <Search className="w-8 h-8 text-white" />,
  },
  {
    id: "03",
    text: "Distance Trust Gap",
    desc: "Overseas investors need confidence through transparent project information and reliable communication.",
    icon: <ShieldCheck className="w-8 h-8 text-white" />,
  },
  {
    id: "04",
    text: "Global Visibility",
    desc: "Many quality developers lack international exposure despite having strong projects and delivery history.",
    icon: <Users className="w-8 h-8 text-white" />,
  },
  {
    id: "05",
    text: "Project Credibility",
    desc: "Present your developments with structured information, documentation, and professional investor-ready profiles.",
    icon: <FileText className="w-8 h-8 text-white" />,
  },
  {
    id: "06",
    text: "Cross-Border Process",
    desc: "Simplify investor communication, documentation coordination, and international engagement workflows.",
    icon: <Activity className="w-8 h-8 text-white" />,
  },
  {
    id: "07",
    text: "Brand Expansion",
    desc: "Promote your developer brand among global Indian communities and international investment networks.",
    icon: <Award className="w-8 h-8 text-white" />,
  },
  {
    id: "08",
    text: "You Build, We Connect",
    desc: "Focus on creating quality developments while Investate India helps connect you with global opportunities.",
    icon: <TrendingUp className="w-8 h-8 text-white" />,
  },
];

const builderSteps = [
  {
    id: "1",
    title: "Apply",
    text: "Submit your company profile, past projects, and current development details through our structured application.",
  },
  {
    id: "2",
    title: "Get Verified",
    text: "Our team reviews your credentials, track record, and compliance status to ensure quality standards.",
  },
  {
    id: "3",
    title: "Go Live",
    text: "Your approved projects are professionally presented to our growing NRI investor network in a standardized format.",
  },
  {
    id: "4",
    title: "Close Deals",
    text: "Build lasting relationships with investors based on transparent terms and mutual trust.",
  },
];

const stepImages = [
  "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=1000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1573164713988-8665fc963095?q=80&w=1000&auto=format&fit=crop",
];

const trustFeatures = [
  {
    id: "global",
    title: "Global Investor Access",
    desc: "Present your developments to NRI investors and overseas Indian communities looking for quality opportunities.",
    image: "/images/global_globe.jpg",
  },
  {
    id: "showcase",
    title: "Premium Project Showcase",
    desc: "Highlight residential, commercial, villa, and upcoming projects through a professional digital presentation.",
    image:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1000&auto=format&fit=crop",
  },
  {
    id: "capital",
    title: "Capital Growth Network",
    desc: "Explore connections with global investors, strategic partners, and capital opportunities for expansion.",
    image:
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=1000&auto=format&fit=crop",
  },
  {
    id: "ecosystem",
    title: "Complete Support Ecosystem",
    desc: "Access structured coordination, professional networks, and long-term support beyond project listing.",
    image:
      "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=1000&auto=format&fit=crop",
  },
];

const faqsList = [
  {
    question: "Who can register as a Builder?",
    answer:
      "Real estate developers with residential, commercial, villa, township, or upcoming projects can apply to showcase opportunities through Investate India.",
  },
  {
    question: "How does Investate India help builders?",
    answer:
      "We help builders expand beyond local markets by creating visibility among global NRIs, investors, and strategic partners.",
  },
  {
    question: "What type of projects can I showcase?",
    answer:
      "Builders can showcase ready projects, ongoing developments, new launches, pre-launch opportunities, premium communities, and large-scale developments.",
  },
  {
    question: "How are investor connections managed?",
    answer:
      "Investor interest is handled through a structured process to create meaningful connections and reduce unnecessary communication gaps.",
  },
  {
    question: "Can Investate India support capital requirements?",
    answer:
      "Yes. Eligible developers can explore capital sourcing opportunities through global investor networks and strategic partnerships.",
  },
  {
    question: "Can I manage multiple projects?",
    answer:
      "Yes. Builders can manage multiple developments, update project information, and maintain visibility through their dashboard.",
  },
];
export default function BuilderHome() {
  const router = useRouter();
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [heroIndex, setHeroIndex] = useState(0);
  const [activeFaq, setActiveFaq] = useState(null);
  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };
  const [isHeroPaused, setIsHeroPaused] = useState(false);
  const [isPauseButtonHovered, setIsPauseButtonHovered] = useState(false);
  const [hoveredBuilderCard, setHoveredBuilderCard] = useState(null);
  const [builderChallengePage, setBuilderChallengePage] = useState(0);
  const builderChallengesScrollRef = useRef(null);

  const [benefitsPage, setBenefitsPage] = useState(0);
  const benefitsPerPage = 4;
  const totalBenefitsPages = Math.ceil(
    builderBenefits.length / benefitsPerPage,
  );

  const nextBenefits = () => {
    setBenefitsPage((prev) => (prev + 1) % totalBenefitsPages);
  };

  const prevBenefits = () => {
    setBenefitsPage(
      (prev) => (prev - 1 + totalBenefitsPages) % totalBenefitsPages,
    );
  };

  const handleAuthClick = (action, role) => {
    if (action === "login") {
      router.push(role === "builder" ? "/builder/login" : "/investor/login");
    } else {
      router.push(
        role === "builder" ? "/builder/register" : "/investor/register",
      );
    }
  };

  useEffect(() => {
    if (isHeroPaused || isPauseButtonHovered) return;
    const timer = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % heroSlides.length);
    }, 8000);
    return () => clearInterval(timer);
  }, [isHeroPaused, isPauseButtonHovered]);

  const activeStepData = builderSteps[activeStepIndex];

  return (
    <div className="theme-builder w-full bg-[var(--color-light-bg)] overflow-x-hidden">
      <Header transparent={true} />

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
            setHeroIndex(
              (prev) => (prev - 1 + heroSlides.length) % heroSlides.length,
            )
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
          onClick={() => setHeroIndex((prev) => (prev + 1) % heroSlides.length)}
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
                background: i === heroIndex ? "#fff" : "rgba(255,255,255,0.45)",
                border: "none",
                cursor: "pointer",
                transition: "all 0.3s ease",
                padding: 0,
              }}
            />
          ))}
        </div>

        {/* Floating Login Button - highlighted with pulse glow */}
        <style>{`
          @keyframes loginPulseRing {
            0%   { box-shadow: 0 0 0 0 rgba(212,128,53,0.7), 0 8px 32px rgba(0,0,0,0.3); }
            60%  { box-shadow: 0 0 0 12px rgba(212,128,53,0), 0 8px 32px rgba(0,0,0,0.3); }
            100% { box-shadow: 0 0 0 0 rgba(212,128,53,0), 0 8px 32px rgba(0,0,0,0.3); }
          }
        `}</style>
        <motion.button
          onClick={() => handleAuthClick("login", "builder")}
          aria-label="Builder Login"
          initial={{ opacity: 0, y: 60, scale: 0.85 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{
            delay: 0.8,
            duration: 0.5,
            type: "spring",
            stiffness: 200,
            damping: 18,
          }}
          whileHover={{ scale: 1.07 }}
          whileTap={{ scale: 0.96 }}
          style={{
            position: "absolute",
            bottom: "4.5rem",
            right: "2rem",
            zIndex: 30,
            background: "#D48035",
            borderRadius: "999px",
            padding: "0.7rem 1.8rem",
            color: "#fff",
            fontWeight: 700,
            fontSize: "0.95rem",
            letterSpacing: "0.04em",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            border: "2px solid rgba(255,255,255,0.5)",
            animation: "loginPulseRing 2s ease-out infinite",
            textShadow: "0 1px 3px rgba(0,0,0,0.2)",
          }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M15 3h6v18h-6" />
            <polyline points="10 17 15 12 10 7" />
            <line x1="15" y1="12" x2="3" y2="12" />
          </svg>
          Login
        </motion.button>

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
              <button
                onClick={() => handleAuthClick("register", "builder")}
                className="btn btn-primary"
              >
                Explore Opportunities
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* â”€â”€ Infrastructure-style Marquee Section â”€â”€ */}
      <section id="challenges" className="infra-section py-20 bg-[#f8f8f8]">
        {/* â”€â”€ Develite-style Header â”€â”€ */}
        <div className="infra-section-header">
          <h2 className="infra-title text-[#1a1a1a]">
            Overcoming{" "}
            <span className="infra-title-accent text-[#D48035]">
              Market Friction
            </span>
          </h2>
        </div>

        <p className="infra-subtitle text-slate-600">
          Connecting with international investors requires more than traditional
          marketing. We solve the specific trust and logistical challenges that
          prevent visionary developers from reaching the global diaspora.
        </p>

        {/* â”€â”€ Infinite Marquee with Original White Cards â”€â”€ */}
        <div className="infra-marquee-wrapper">
          <div className="infra-marquee-track">
            {/* Render twice for seamless loop */}
            {[
              ...builderChallenges,
              ...builderChallenges,
              ...builderChallenges,
              ...builderChallenges,
            ].map((challenge, i) => (
              <div key={i} className="infra-marquee-card">
                <div className="infra-card-icon-wrapper">{challenge.icon}</div>
                <h3 className="infra-card-title">{challenge.text}</h3>
                <p className="infra-card-desc">{challenge.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="fullscreen-section section-theme" id="trust">
        <div className="container">
          <div className="trust-split-wrapper">
            <div className="trust-info-side">
              <h2 className="trust-main-title">
                Expand Beyond <br />
                <span className="text-highlight">Traditional Markets</span>
              </h2>

              <p className="trust-main-desc">
                Investate India helps credible developers increase global
                visibility, connect with NRI investors, and unlock new growth
                opportunities.
              </p>
              <button
                onClick={() => handleAuthClick("register", "builder")}
                className="trust-cta-btn"
              >
                <div className="cta-icon-circle">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </div>
                <span className="cta-text">Apply as Builder</span>
              </button>
            </div>
            <div className="trust-cards-side">
              {trustFeatures.map((feature) => (
                <div className="trust-feature-card" key={feature.id}>
                  <div className="trust-feature-image">
                    <img
                      src={feature.image}
                      alt={feature.title}
                      loading="lazy"
                    />
                  </div>
                  <h3 className="trust-feature-title">{feature.title}</h3>
                  <p className="trust-feature-desc">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <AwardsSection />

      {/* HOW IT WORKS SECTION */}
      <section className="fullscreen-section section-light" id="how-it-works">
        <div className="container">
          <div className="section-heading">
            <h2 className="section-title">
              How Onboarding <span className="text-highlight">Works</span>
            </h2>
          </div>
          <div className="section-scrollable-body mt-4">
            <div className="dashboard-wrapper">
              <div className="dashboard-sidebar-container mobile-scroll-hint">
                <div className="dashboard-sidebar" id="builder-tabs-row">
                  {builderSteps.map((step, index) => (
                    <button
                      key={index}
                      className={`dashboard-step-btn ${activeStepIndex === index ? "active" : ""}`}
                      onClick={() => setActiveStepIndex(index)}
                    >
                      <div className="step-btn-number">0{step.id}</div>
                      <div className="step-btn-title">{step.title}</div>
                    </button>
                  ))}
                </div>
                <div className="dashboard-tabs-nav md:hidden">
                  <button
                    className="tabs-nav-btn prev"
                    aria-label="Scroll steps left"
                    onClick={() =>
                      document
                        .getElementById("builder-tabs-row")
                        .scrollBy({ left: -150, behavior: "smooth" })
                    }
                  >
                    ❮
                  </button>
                  <button
                    className="tabs-nav-btn next"
                    aria-label="Scroll steps right"
                    onClick={() =>
                      document
                        .getElementById("builder-tabs-row")
                        .scrollBy({ left: 150, behavior: "smooth" })
                    }
                  >
                    ❯
                  </button>
                </div>
              </div>
              <div className="dashboard-display-window">
                <div className="display-content">
                  <div className="display-image-box">
                    <img
                      src={stepImages[activeStepIndex]}
                      alt={`Step ${activeStepData.id}`}
                      loading="lazy"
                    />
                  </div>
                  <div className="display-text-box">
                    <div className="display-step-badge">
                      Step {activeStepData.id}
                    </div>
                    <h3 className="display-title">{activeStepData.title}</h3>
                    <p className="display-desc">{activeStepData.text}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="faq-premium-section section-theme" id="faq">
        <div className="container">
          <div className="faq-header-full text-center mb-16">
            <h2 className="faq-premium-title">
              Frequently Asked <span className="text-highlight">Questions</span>
            </h2>

            <p className="faq-premium-subtitle mx-auto">
              Learn how Investate India helps developers expand their reach,
              showcase projects, and connect with global NRI opportunities.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Left FAQs */}
            <div className="space-y-5">
              {faqsList
                .slice(0, Math.ceil(faqsList.length / 2))
                .map((faq, index) => (
                  <div
                    className={`faq-accordion-item ${
                      activeFaq === index ? "active" : ""
                    }`}
                    key={index}
                    onClick={() => toggleFaq(index)}
                  >
                    <div className="faq-accordion-header">
                      <h4 className="faq-accordion-question">{faq.question}</h4>

                      <div className="faq-accordion-arrow">
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="18 15 12 9 6 15" />
                        </svg>
                      </div>
                    </div>

                    {activeFaq === index && (
                      <div className="faq-accordion-content">
                        <p>{faq.answer}</p>
                      </div>
                    )}
                  </div>
                ))}
            </div>

            {/* Right FAQs */}
            <div className="space-y-5">
              {faqsList.slice(Math.ceil(faqsList.length / 2)).map((faq, i) => {
                const index = i + Math.ceil(faqsList.length / 2);

                return (
                  <div
                    className={`faq-accordion-item ${
                      activeFaq === index ? "active" : ""
                    }`}
                    key={index}
                    onClick={() => toggleFaq(index)}
                  >
                    <div className="faq-accordion-header">
                      <h4 className="faq-accordion-question">{faq.question}</h4>

                      <div className="faq-accordion-arrow">
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="18 15 12 9 6 15" />
                        </svg>
                      </div>
                    </div>

                    {activeFaq === index && (
                      <div className="faq-accordion-content">
                        <p>{faq.answer}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <DeepakProfileSection pageType="builder" />

      {/* CONTACT SECTION */}
      <section
        className="fullscreen-section py-20 text-white text-center"
        id="contact"
        style={{ backgroundColor: "#1a1a1a" }}
      >
        <div className="container text-center">
          <div
            className="cta-minimal-badge mb-6"
            style={{ borderColor: "rgba(255,255,255,0.2)" }}
          >
            <span className="cta-badge-text text-white">GET STARTED TODAY</span>
            <div className="cta-badge-star text-[#D48035]">★</div>
          </div>
          <h2 className="cta-minimal-title mb-6 text-white">
            Ready to Expand Your <span className="text-[#D48035]">Reach?</span>
          </h2>
          <p className="cta-minimal-subtitle text-slate-300 text-lg mb-10 max-w-2xl mx-auto">
            Join an exclusive network of top-tier Indian developers connecting
            directly with serious NRI investors.
          </p>
          <div className="flex justify-center">
            <button
              onClick={() => handleAuthClick("register", "builder")}
              className="cta-minimal-btn bg-[#D48035] hover:bg-[#b06725] text-white border-none shadow-xl"
            >
              Apply as Builder <span className="ml-2">→</span>
            </button>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
