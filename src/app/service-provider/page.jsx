"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import AwardsSection from "@/components/AwardsSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import DeepakProfileSection from "@/components/DeepakProfileSection";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PlayPauseButton from "@/components/PlayPauseButton";
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
    image: "/images/image copy 46.png",
    tag: "Trusted Professional Ecosystem",
    title: "Expand Your Services to",
    highlight: "Global NRIs & Real Estate Networks",
    subtitle:
      "Partner with Investate India to offer legal, financial, property, and advisory services to NRIs, investors, and developers through a trusted platform.",
  },
  {
    image: "/images/image copy 48.png",
    tag: "Professional Growth Network",
    title: "Build Trust Through",
    highlight: "Verified Service Partnerships",
    subtitle:
      "Showcase your expertise, grow your professional reach, and become part of India's global real estate investment ecosystem.",
  },
];
const serviceProviderBenefits = [
  {
    title: "Global Client Access",
    desc: "Connect your professional expertise with NRIs, investors, and developers seeking trusted support.",
  },
  {
    title: "Verified Partner Identity",
    desc: "Build stronger credibility by becoming part of a trusted professional ecosystem.",
  },
  {
    title: "Business Visibility",
    desc: "Showcase your services to relevant audiences through structured platform presence.",
  },
  {
    title: "Long-Term Partnerships",
    desc: "Create ongoing relationships across real estate, investment, and advisory requirements.",
  },
];

const partnerCategories = [
  "Real Estate Lawyers",
  "Chartered Accountants & Tax Advisors",
  "Compliance & Documentation Consultants",
  "Real Estate Agents / Channel Partners",
  "Property Management Companies",
  "Property Valuation Experts",
  "Financial Advisors",
  "Insurance Advisors",
  "Architects & Design Consultants",
  "Interior Designers",
  "Construction Contractors",
  "Immigration & Relocation Consultants",
];
const serviceProviderChallenges = [
  {
    id: "01",
    text: "Limited Global Reach",
    desc: "Many professionals struggle to connect with genuine NRI clients looking for reliable support in India.",
    icon: <Layers className="w-8 h-8 text-white" />,
  },
  {
    id: "02",
    text: "Trust Building",
    desc: "International clients require verified professionals with credibility and transparent service processes.",
    icon: <ShieldCheck className="w-8 h-8 text-white" />,
  },
  {
    id: "03",
    text: "Client Discovery",
    desc: "Finding serious investors and property owners through traditional channels can be inefficient.",
    icon: <Users className="w-8 h-8 text-white" />,
  },
  {
    id: "04",
    text: "Cross-Border Support",
    desc: "NRI requirements often involve documentation, compliance, property, and advisory coordination.",
    icon: <FileText className="w-8 h-8 text-white" />,
  },
];

const serviceProviderSteps = [
  {
    id: "1",
    title: "Apply",
    text: "Create your professional profile, select your service category, and submit your expertise and business details.",
  },
  {
    id: "2",
    title: "Verify",
    text: "Our team reviews your credentials, experience, and service background to maintain a trusted partner ecosystem.",
  },
  {
    id: "3",
    title: "Get Listed",
    text: "Showcase your services inside Investate India and become visible to NRIs, investors, and real estate partners.",
  },
  {
    id: "4",
    title: "Connect",
    text: "Build valuable relationships by supporting clients with legal, financial, property, and advisory requirements.",
  },
];

const stepImages = [
  "/images/image copy 36.png",
  "/images/image copy 37.png",
  "/images/image copy 11.png",
  "/images/image copy 38.png",
];

const faqsList = [
  {
    question: "Who can become an Investate India service partner?",
    answer:
      "Professionals including lawyers, chartered accountants, advisors, property experts, designers, contractors, and other real estate support providers can apply to join our network.",
  },
  {
    question: "How does Investate India help service providers?",
    answer:
      "We help professionals increase visibility and connect their expertise with NRIs, investors, builders, and clients looking for trusted services.",
  },
  {
    question: "How does the verification process work?",
    answer:
      "Our team reviews professional details, experience, credentials, and service background before approving partner profiles.",
  },
  {
    question: "What services can I offer on the platform?",
    answer:
      "Partners can offer legal, taxation, compliance, property management, advisory, valuation, design, construction, and other specialized services.",
  },
  {
    question: "How will clients connect with me?",
    answer:
      "Interested clients can reach verified service partners through Investate India's structured connection process.",
  },
  {
    question: "Can companies register as service providers?",
    answer:
      "Yes. Both individual professionals and companies offering relevant services can become Investate India partners.",
  },
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

        <PlayPauseButton
          isPaused={isHeroPaused}
          onClick={() => setIsHeroPaused((prev) => !prev)}
          onMouseEnter={() => setIsPauseButtonHovered(true)}
          onMouseLeave={() => setIsPauseButtonHovered(false)}
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
      <section id="challenges" className="infra-section py-10 bg-[#f8f8f8]">
        <div className="infra-section-header text-center">
          <h2 className="infra-title text-3xl md:text-4xl font-bold text-[#1a1a1a]">
            Friction in{" "}
            <span className="infra-title-accent text-[#D48035]">
              Corporate Lead Generation
            </span>
          </h2>
          <p className="infra-subtitle max-w-2xl mx-auto mt-4 text-slate-600">
            We provide professional integration to verify and highlight your
            capabilities.
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

      <section className="py-20 bg-white" id="professional-network">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-14">
            <h2
              className="
        text-3xl 
        md:text-4xl 
        font-bold 
        text-[#1a1a1a]
      "
            >
              Join Our Trusted <br />
              <span className="text-[#D48035]">Professional Network</span>
            </h2>

            <p
              className="
        mt-5 
        text-slate-600 
        text-base 
        md:text-lg 
        leading-relaxed
      "
            >
              Partner with Investate India to support global NRIs, investors,
              and developers with specialized services throughout their real
              estate and investment journey.
            </p>
          </div>

          {/* Cards */}
          <div
            className="
      grid 
      grid-cols-1 
      sm:grid-cols-2 
      lg:grid-cols-3 
      xl:grid-cols-4
      gap-5
      max-w-6xl
      mx-auto
    "
          >
            {partnerCategories.map((category, index) => (
              <div
                key={index}
                className="bg-[#f8f8f8] border border-slate-200/80 p-6 rounded-2xl flex flex-col items-center justify-center text-center shadow-sm hover:shadow-lg transition-shadow duration-300"
              >
                <h3
                  className="
            text-slate-900
            font-bold
            text-base
            leading-snug
          "
                >
                  {category}
                </h3>
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
              Onboarding & Booking{" "}
              <span className="text-highlight">Workflow</span>
            </h2>
          </div>
          <div className="section-scrollable-body mt-4">
            <div className="dashboard-wrapper">
              <div className="dashboard-sidebar-container mobile-scroll-hint">
                <div
                  className="dashboard-sidebar"
                  id="service-provider-tabs-row"
                >
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
            <h2 className="faq-premium-title">
              Frequently Asked <span className="text-highlight">Questions</span>
            </h2>
            <p className="faq-premium-subtitle mx-auto">
              Get clear answers to the most common questions about offering your
              services on Investate India.
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
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
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

      {/* <DeepakProfileSection pageType="serviceProvider" /> */}

      {/* CONTACT SECTION */}
      <section
        className="fullscreen-section py-20 text-white text-center"
        style={{ backgroundColor: "#1a1a1a" }}
        id="contact"
      >
        <div className="container max-w-3xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Join India's Global Investment Ecosystem?
          </h2>
          <p className="text-slate-400 mb-8 max-w-xl mx-auto text-sm md:text-base leading-relaxed">
            Partner with Investate India and connect your professional expertise
            with NRIs, investors, and developers worldwide.
          </p>
          <div className="flex justify-center">
            <button
              onClick={() => handleAuthClick("register", "serviceProvider")}
              className="bg-[#D48035] hover:bg-[#b06725] text-white font-bold px-10 py-4 rounded-full transition-transform hover:scale-105 shadow-xl"
            >
              Apply as Service Partner
            </button>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
