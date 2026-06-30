"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AwardsSection from "@/components/AwardsSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import dynamic from "next/dynamic";
import Header from "@/components/Header";

const LoginDialog = dynamic(() => import("@/components/LoginDialog"), {
  ssr: false,
});
const RegisterDialog = dynamic(() => import("@/components/RegisterDialog"), {
  ssr: false,
});
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
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=2070&auto=format&fit=crop",
    tag: "Institutional Partner Growth",
    title: "Present Your Services to",
    highlight: "Premium Builders & HNW NRI Investors",
    subtitle:
      "The ultimate ecosystem for verified Indian real estate lawyers, chartered accountants, architects, and advisors to expand their reach to top-tier builders and global NRI buyers.",
  },
  {
    image:
      "https://images.unsplash.com/photo-1521791136368-1a8b27503ad7?q=80&w=2070&auto=format&fit=crop",
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
  {
    id: "03",
    text: "Marketing Efficiencies",
    desc: "Sifting out casual inquiries to focus on serious business entities with specific legal/financial needs.",
    icon: <Target className="w-8 h-8 text-white" />,
  },
  {
    id: "04",
    text: "Regulatory Compliance",
    desc: "Ensuring cross-border transactions, RERA rules, and tax compliances are professionally certified.",
    icon: <Scale className="w-8 h-8 text-white" />,
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
    desc: "Admin reviews client inquiries generated from your banners and routes them directly to your liaison.",
  },
];

const stepImages = [
  "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=1000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1507537297725-24a1c029d3ca?q=80&w=1000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=1000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1557200134-90327ee9fafa?q=80&w=1000&auto=format&fit=crop",
];

export default function ServiceProviderHome() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [dialogData, setDialogData] = useState({});
  const [heroIndex, setHeroIndex] = useState(0);
  const [benefitsPage, setBenefitsPage] = useState(0);
  const benefitsPerPage = 2;
  const totalBenefitsPages = Math.ceil(
    serviceProviderBenefits.length / benefitsPerPage,
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
      setIsRegisterOpen(false);
      if (typeof role === "string") setDialogData({ userType: role });
      setIsLoginOpen(true);
    } else {
      setIsLoginOpen(false);
      if (typeof role === "string") setDialogData({ userType: role });
      setIsRegisterOpen(true);
    }
  };

  const handleSwitchToRegister = (dataPayload) => {
    setIsLoginOpen(false);
    if (typeof dataPayload === "string") {
      setDialogData({ userType: dataPayload });
    } else if (dataPayload) {
      setDialogData(dataPayload);
    }
    setIsRegisterOpen(true);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const activeStepData = serviceProviderSteps[activeStepIndex];

  return (
    <div className="theme-builder w-full bg-[var(--color-light-bg)] overflow-x-hidden">
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
              className="absolute inset-0 w-full h-full object-cover z-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2, ease: "easeInOut" }}
              style={{ objectPosition: "center" }}
              loading="eager"
              fetchPriority="high"
            />
          </picture>
        </AnimatePresence>
        <div
          className="absolute inset-0 z-[1]"
          style={{ background: "rgba(0,0,0,0.3)" }}
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
                  <span className="text-[#D48035]">
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
                onClick={() => handleAuthClick("login", "serviceProvider")}
                className="btn bg-white/10 hover:bg-white/20 border border-white/30 text-white px-8 py-3 rounded-full font-bold shadow-lg transition-transform hover:scale-105 active:scale-95"
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
        className="infra-section py-20 bg-slate-900 text-white"
      >
        <div className="infra-section-header text-center mb-12">
          <h2 className="infra-title text-3xl md:text-4xl font-bold">
            Friction in{" "}
            <span className="infra-title-accent text-[#D48035]">
              Corporate Lead Generation
            </span>
          </h2>
          <p className="infra-subtitle max-w-2xl mx-auto mt-4 text-slate-400">
            Acquiring premium builder and NRI clients is often unstructured and
            lacks transparency. We provide professional integration to verify
            and highlight your capabilities.
          </p>
        </div>

        <div className="infra-marquee-wrapper">
          <div className="infra-marquee-track">
            {[...serviceProviderChallenges, ...serviceProviderChallenges].map(
              (challenge, i) => (
                <div
                  key={i}
                  className="infra-marquee-card bg-slate-800 border-slate-700 p-6 rounded-2xl w-80 shrink-0 mx-4"
                >
                  <div className="infra-card-icon-wrapper bg-[#D48035] p-3 rounded-xl w-14 h-14 flex items-center justify-center mb-4">
                    {challenge.icon}
                  </div>
                  <h3 className="infra-card-title text-lg font-bold text-white mb-2">
                    {challenge.text}
                  </h3>
                  <p className="infra-card-desc text-xs text-slate-400 leading-relaxed">
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
        className="fullscreen-section section-theme py-20 bg-slate-50"
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

                <div className="relative min-h-[220px]">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={benefitsPage}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                      className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10"
                    >
                      {serviceProviderBenefits
                        .slice(
                          benefitsPage * benefitsPerPage,
                          (benefitsPage + 1) * benefitsPerPage,
                        )
                        .map((benefit, index) => (
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
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Pagination Controls */}
                <div className="benefits-pagination flex gap-4 mt-8 items-center">
                  <button
                    onClick={prevBenefits}
                    className="w-10 h-10 rounded-full border border-slate-200 bg-white hover:bg-slate-100 flex items-center justify-center cursor-pointer transition-colors"
                  >
                    ❮
                  </button>
                  <div className="text-xs text-slate-500 font-bold">
                    {benefitsPage + 1} / {totalBenefitsPages}
                  </div>
                  <button
                    onClick={nextBenefits}
                    className="w-10 h-10 rounded-full border border-slate-200 bg-white hover:bg-slate-100 flex items-center justify-center cursor-pointer transition-colors"
                  >
                    ❯
                  </button>
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
                  src="https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?q=80&w=2070&auto=format&fit=crop"
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
      <section
        className="fullscreen-section section-light py-20 bg-white"
        id="how-it-works"
      >
        <div className="container">
          <div className="section-heading text-center mb-12">
            <h2 className="section-title text-3xl font-bold">
              Onboarding & Booking{" "}
              <span className="text-[#D48035]">Workflow</span>
            </h2>
          </div>
          <div className="section-scrollable-body mt-4">
            <div className="dashboard-wrapper flex flex-col lg:flex-row gap-8 bg-slate-50 p-6 rounded-3xl border border-slate-100">
              <div className="dashboard-sidebar-container w-full lg:w-1/3 flex flex-col justify-center">
                <div className="dashboard-sidebar flex flex-col gap-3">
                  {serviceProviderSteps.map((step, index) => (
                    <button
                      key={index}
                      className={`w-full text-left p-4 rounded-2xl flex items-center gap-4 transition-all ${
                        activeStepIndex === index
                          ? "bg-slate-900 text-white shadow-lg"
                          : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-100"
                      }`}
                      onClick={() => setActiveStepIndex(index)}
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${activeStepIndex === index ? "bg-[#D48035] text-white" : "bg-slate-100 text-slate-800"}`}
                      >
                        0{step.id}
                      </div>
                      <div className="font-bold text-sm">{step.title}</div>
                    </button>
                  ))}
                </div>
              </div>
              <div className="dashboard-display-window w-full lg:w-2/3 bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col md:flex-row gap-6">
                <div className="display-image-box w-full md:w-1/2 h-56 rounded-xl overflow-hidden">
                  <img
                    src={stepImages[activeStepIndex]}
                    alt={`Step ${activeStepData.id}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="display-text-box w-full md:w-1/2 flex flex-col justify-center">
                  <div className="text-xs font-bold text-[#D48035] uppercase mb-2">
                    Step {activeStepData.id}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">
                    {activeStepData.title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {activeStepData.text}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <TestimonialsSection />

      {/* CONTACT SECTION */}
      <section
        className="fullscreen-section py-20 bg-slate-950 text-white text-center"
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

      <LoginDialog
        isOpen={isLoginOpen}
        onOpenChange={setIsLoginOpen}
        onSwitchToRegister={handleSwitchToRegister}
        initialData={dialogData}
      />
      <RegisterDialog
        isOpen={isRegisterOpen}
        onOpenChange={setIsRegisterOpen}
        onLoginClick={() => {
          setIsRegisterOpen(false);
          setIsLoginOpen(true);
        }}
        initialData={dialogData}
      />
    </div>
  );
}
