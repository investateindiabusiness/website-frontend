"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import AwardsSection from "@/components/AwardsSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import DeepakProfileSection from "@/components/DeepakProfileSection";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  ShieldCheck,
  Scale,
  Users,
  FileText,
  Activity,
  Layers,
  Coins,
  Target,
} from "lucide-react";

const heroSlides = [
  {
    image:
      "/images/image copy 20.png",
    tag: "Institutional Partner Growth",
    title: "Present Your Services to",
    highlight: "Premium Builders & HNW NRI Investors",
    subtitle:
      "The ultimate ecosystem for verified real estate agents, brokers, lawyers, chartered accountants, tax consultants, and property service professionals to expand their reach to top-tier builders and global NRI buyers.",
  },
  {
    image: "/images/challenge_intermediaries.png",
    tag: "Trust & Governance",
    title: "Accelerate Client Acquisition with",
    highlight: "Verified Professional Credibility",
    subtitle:
      "Position your business in a transparency-first marketplace. Build lasting relationships with active builders and sophisticated NRI investors seeking expert execution.",
  },
];

const serviceProviderBenefits = [
  {
    title: "Direct Lead Routing",
    desc: "Receive targeted inquiries from active builders and NRI investors through a secure, admin-managed pipeline.",
    image:
      "https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=2070&auto=format&fit=crop",
  },
  {
    title: "Targeted Ad Campaigns",
    desc: "Display banner and text ads inside builder and investor dashboard panels for premium visibility.",
    image:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2070&auto=format&fit=crop",
  },
  {
    title: "Verified Network Integration",
    desc: "Become an official partner listed inside our ecosystem, solving distance trust gaps.",
    image:
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop",
  },
  {
    title: "Launch Rewards & Credits",
    desc: "Gain complimentary advertisement credits as an early adopter to boost initial visibility.",
    image:
      "https://images.unsplash.com/photo-1579621970795-87facc2f976d?q=80&w=2070&auto=format&fit=crop",
  },
];

const serviceProviderChallenges = [
  {
    id: "01",
    text: "Client Fragmentation",
    desc: "Connecting directly with verified developers or high-intent NRI buyers is highly unstructured.",
    icon: <Layers className="w-8 h-8 text-white" />,
  },
  {
    id: "02",
    text: "Trust Verification",
    desc: "Overcoming geographical separation requires structured credentials and transparent verification.",
    icon: <ShieldCheck className="w-8 h-8 text-white" />,
  },
];

const serviceProviderSteps = [
  {
    id: "1",
    title: "Apply Online",
    text: "Create your credentials, choose your service category, and submit your business track record details.",
  },
  {
    id: "2",
    title: "Admin Review",
    text: "Our administrative team reviews your profile, certifications, and RERA compliance to activate your membership.",
  },
  {
    id: "3",
    title: "Configure Campaigns",
    text: "Book slots in targeted advertisement zones (Builder / Investor dashboards) and deploy your campaigns.",
  },
  {
    id: "4",
    title: "Receive Vetted Leads",
    text: "Admin reviews client inquiries generated from your banners and routes them directly to your liaison.",
  },
];

const stepImages = [
  "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=1000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1507537297725-24a1c029d3ca?q=80&w=1000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=1000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=1000&auto=format&fit=crop",
];

const faqsList = [
  {
    question: "Who can register as a Service Provider?",
    answer: "Professionals and companies offering real-estate related services."
  },
  {
    question: "How do I receive enquiries?",
    answer: "Through your registered profile."
  },
  {
    question: "Can I manage my profile?",
    answer: "Yes, anytime."
  },
  {
    question: "What services can I offer?",
    answer: "Legal, financial, valuation, marketing and related services."
  },
  {
    question: "How do clients contact me?",
    answer: "Using the platform contact options."
  }
];

export default function ServiceProviderHome() {
  const router = useRouter();
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [activeFaq, setActiveFaq] = useState(null);
  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };
  const [heroIndex, setHeroIndex] = useState(0);
  const [isHeroPaused, setIsHeroPaused] = useState(false);


  const handleAuthClick = (action, role) => {
    if (action === "login") {
      router.push("/service-provider/login");
    } else {
      router.push("/service-provider/register");
    }
  };

  useEffect(() => {
    if (isHeroPaused) return;
    const timer = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % heroSlides.length);
    }, 8000);
    return () => clearInterval(timer);
  }, [isHeroPaused]);

  const activeStepData = serviceProviderSteps[activeStepIndex];

  return (
    <div className="theme-builder w-full bg-[var(--color-light-bg)] overflow-x-hidden">
      <Header transparent={true} />

      <section
        className="fullscreen-section hero-section"
        onMouseEnter={() => setIsHeroPaused(true)}
        onMouseLeave={() => setIsHeroPaused(false)}
      >
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
        <div
          className="absolute inset-0 z-[1] hero-split-overlay"
        />

        {/* Prev / Next buttons */}
        <button
          onClick={() =>
            setHeroIndex(
              (prev) => (prev - 1 + heroSlides.length) % heroSlides.length,
            )
          }
          aria-label="Previous image"
          className="absolute left-5 top-1/2 -translate-y-1/2 z-10 bg-white/10 backdrop-blur-md border border-white/20 rounded-full w-11 h-11 flex items-center justify-center cursor-pointer text-white hover:bg-white/25 transition-colors"
        >
          ❮
        </button>
        <button
          onClick={() => setHeroIndex((prev) => (prev + 1) % heroSlides.length)}
          aria-label="Next image"
          className="absolute right-5 top-1/2 -translate-y-1/2 z-10 bg-white/10 backdrop-blur-md border border-white/20 rounded-full w-11 h-11 flex items-center justify-center cursor-pointer text-white hover:bg-white/25 transition-colors"
        >
          ❯
        </button>

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
              </motion.div>
            </AnimatePresence>
            <div className="hero-cta-group flex gap-4">
              {/* <button
                onClick={() => handleAuthClick("register", "serviceProvider")}
                className="btn bg-[#D48035] hover:bg-[#b06725] border-none text-white px-8 py-3 rounded-full font-bold shadow-lg transition-transform hover:scale-105 active:scale-95"
              >
                Register Professional Profile
              </button> */}
              <button
                onClick={() => handleAuthClick("register", "serviceProvider")}
                className="btn bg-[#D48035] hover:bg-[#B45309] border-none text-white px-8 py-3 rounded-full font-bold shadow-lg transition-transform hover:scale-105 active:scale-95"
              >
                Partner Sign In
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Market Challenges Section */}
      <section
        id="challenges"
        className="infra-section py-20 bg-[#f8f8f8]"
      >
        <div className="infra-section-header text-center mb-12">
          <h2 className="infra-title text-3xl md:text-4xl font-bold text-[#1a1a1a]">
            Friction in{" "}
            <span className="infra-title-accent text-[#D48035]">
              Corporate Lead Generation
            </span>
          </h2>
          <p className="infra-subtitle max-w-2xl mx-auto mt-4 text-slate-600">
            Acquiring premium builder and NRI clients is often unstructured and
            lacks transparency. We provide professional integration to verify
            and highlight your capabilities.
          </p>
        </div>

        <div className="infra-marquee-wrapper">
          <div className="infra-marquee-track">
            {[...serviceProviderChallenges, ...serviceProviderChallenges, ...serviceProviderChallenges, ...serviceProviderChallenges].map(
              (challenge, i) => (
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
              ),
            )}
          </div>
        </div>
      </section>

      {/* Strategic Advantages (Benefits) */}
      <section
        className="fullscreen-section section-theme py-20"
        style={{ backgroundColor: '#ffffff' }}
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
                  Build High-Value <br />
                  <span style={{ color: "#D48035" }}>
                    Professional Relationships
                  </span>
                </h2>
                <p className="responsive-paragraph text-slate-600 mb-8 max-w-lg">
                  Leverage dashboard display marketing and pre-routed
                  administrative leads to build trust and scale your operations
                  within an exclusive builder-investor ecosystem.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
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
                  src="/images/image copy 25.png"
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

      <AwardsSection />

      {/* HOW IT WORKS SECTION */}
      <section className="fullscreen-section section-light" id="how-it-works">
        <div className="container">
          <div className="section-heading">
            <h2 className="section-title">
              Onboarding & Booking <span className="text-highlight">Workflow</span>
            </h2>
          </div>
          <div className="section-scrollable-body mt-4">
            <div className="dashboard-wrapper">
              <div className="dashboard-sidebar-container mobile-scroll-hint">
                <div className="dashboard-sidebar" id="service-provider-tabs-row">
                  {serviceProviderSteps.map((step, index) => (
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
                        .getElementById("service-provider-tabs-row")
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
                        .getElementById("service-provider-tabs-row")
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
            <h2 className="faq-premium-title">Frequently Asked <span className="text-highlight">Questions</span></h2>
            <p className="faq-premium-subtitle mx-auto">
              Get clear answers to the most common questions about offering your services on Investate India.
            </p>
          </div>
          <div className="faq-premium-grid">
            <div className="faq-accordion-column">
              {faqsList.map((faq, index) => (
                <div
                  className={`faq-accordion-item ${activeFaq === index ? "active" : ""}`}
                  key={index}
                  onClick={() => toggleFaq(index)}
                >
                  <div className="faq-accordion-header">
                    <h4 className="faq-accordion-question">{faq.question}</h4>
                    <div className="faq-accordion-arrow">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="18 15 12 9 6 15"></polyline>
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
            <div className="faq-image-column">
              <div className="faq-side-image-premium">
                <img
                  src="/images/skyscraper_night.png"
                  alt="Modern Indian Skyscrapers"
                  loading="lazy"
                  decoding="async"
                  width={600}
                  height={400}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <DeepakProfileSection pageType="serviceProvider" />

      {/* CONTACT SECTION */}
      <section
        className="fullscreen-section py-20 text-white text-center"
        style={{ backgroundColor: '#1a1a1a' }}
        id="contact"
      >
        <div className="container max-w-3xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Market Your Services <br />
            to India's Elite Developers?
          </h2>
          <p className="text-slate-400 mb-8 max-w-xl mx-auto text-sm md:text-base leading-relaxed">
            Register today to request administrative verification, list your
            company, and deploy high-visibility campaigns inside active
            dashboard modules.
          </p>
          <div className="flex justify-center">
            <button
              onClick={() => handleAuthClick("register", "serviceProvider")}
              className="bg-[#D48035] hover:bg-[#b06725] text-white font-bold px-10 py-4 rounded-full transition-transform hover:scale-105 shadow-xl"
            >
              Apply as Service Provider Now
            </button>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
