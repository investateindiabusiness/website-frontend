"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import AwardsSection from "@/components/AwardsSection";
import TestimonialsSection from "@/components/TestimonialsSection";
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
    Compass,
    Award,
} from "lucide-react";

const heroSlides = [
    {
        image: "/images/image copy 6.png",
        tag: "Global Investment Gateway",
        title: "INVESTATE INDIA",
        highlight: "Gateway to Indian Opportunities",
        subtitle: "Connecting Investors, Opportunities and Professional Services through a technology-enabled platform.",
    },
    {
        image: "/images/image copy 5.png",
        tag: "Platform Overview",
        title: "Connecting Global Capital with",
        highlight: "Verified Investment Opportunities",
        subtitle: "Designed primarily for Non-Resident Indians (NRIs), simplifying the investment journey by bringing together opportunities, professional services, and trusted partners.",
    },
];

const serviceProviderBenefits = [
    {
        title: "Global Reach & Access",
        desc: "Empowering investors across North America, Europe, Middle East, and Asia-Pacific with direct access to top-tier, handpicked Indian asset classes.",
        image:
            "https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=2070&auto=format&fit=crop",
    },
    {
        title: "Cross-Border Compliance",
        desc: "Simplifying regulatory, taxation, and legal requirements for global transactions including FEMA compliance and repatriation support.",
        image:
            "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2070&auto=format&fit=crop",
    },
    {
        title: "Vetted Opportunities",
        desc: "Every listed investment undergoes rigorous multi-tier institutional due diligence to safeguard overseas capital.",
        image:
            "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop",
    },
    // {
    //     title: "Bespoke Portfolio Support",
    //     desc: "End-to-end guidance from dedicated portfolio managers, enabling global investors to build and manage wealth remotely with absolute ease.",
    //     image:
    //         "https://images.unsplash.com/photo-1579621970795-87facc2f976d?q=80&w=2070&auto=format&fit=crop",
    // },
];

const serviceProviderChallenges = [
    {
        id: "01",
        text: "NRI Focused",
        desc: "Designed for the needs of global investors, with cross-border compliance, FEMA guidance, and repatriation support.",
        icon: <Layers className="w-8 h-8 text-white" />,
    },
    {
        id: "02",
        text: "Verified Opportunities",
        desc: "Every opportunity is curated and due-diligenced through a multi-tier review process to protect investor capital.",
        icon: <ShieldCheck className="w-8 h-8 text-white" />,
    },
    {
        id: "03",
        text: "End-to-End Support",
        desc: "Complete support across legal, financial, advisory and operational needs — from discovery to investment completion.",
        icon: <Target className="w-8 h-8 text-white" />,
    },
    {
        id: "04",
        text: "Platform Capabilities",
        desc: "Real Estate, Equity, Alternative Investments, Professional Services Integration, Investor Enablement.",
        icon: <Scale className="w-8 h-8 text-white" />,
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

const stepImages = [
    "/deepak.png",
    "/pankaj.png",
    "/atish.png",
];

export default function ServiceProviderHome() {
    const router = useRouter();
    const [activeStepIndex, setActiveStepIndex] = useState(0);
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
            router.push("/service-provider/login");
        } else {
            router.push("/service-provider/register");
        }
    };

    useEffect(() => {
        const timer = setInterval(() => {
            setHeroIndex((prev) => (prev + 1) % heroSlides.length);
        }, 6000);
        return () => clearInterval(timer);
    }, []);

    const activeStepData = serviceProviderSteps[activeStepIndex];

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
                            <button
                                onClick={() => router.push("/contact-us")}
                                className="btn bg-[#D48035] hover:bg-[#B45309] border-none text-white px-8 py-3 rounded-full font-bold shadow-lg transition-transform hover:scale-105 active:scale-95"
                            >
                                Talk to Us
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Executive Summary Section */}
            <section className="py-20" id="executive-summary" style={{ backgroundColor: '#f8f8f8' }}>
                <div className="container mx-auto px-4 md:px-12 max-w-6xl">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">

                        {/* Left Column - Intro & Context */}
                        <div className="lg:col-span-5 flex flex-col gap-8">
                            <div>
                                {/* <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#D48035] mb-3 block">
                                    Executive Summary
                                </span> */}
                                <h3 className="responsive-heading text-left" style={{ color: '#1a1a1a' }}>
                                    Gateway to <br />
                                    <span className="text-[#D48035]">Indian Opportunities</span>
                                </h3>
                                <p className="text-slate-600 text-base md:text-lg leading-relaxed mt-4">
                                    A comprehensive platform connecting global capital with verified investment opportunities across India.
                                </p>
                            </div>

                            {/* Why Now */}
                            <div style={{ borderLeft: '4px solid #D48035', paddingLeft: '1.5rem', margin: '0.5rem 0' }}>
                                <h4 className="text-xs font-bold uppercase tracking-[0.25em] text-[#D48035] mb-2">
                                    Why Now
                                </h4>
                                <p className="text-slate-600 text-sm md:text-base leading-relaxed italic m-0">
                                    "Digital adoption, regulatory transparency and rising NRI wealth are creating significant demand for trusted investment platforms."
                                </p>
                            </div>

                            {/* Market Stats */}
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
                            </div>
                        </div>

                        {/* Right Column - Details & Capabilities */}
                        <div className="lg:col-span-7 flex flex-col gap-10">

                            {/* What Are We */}
                            <div>
                                <div className="flex items-center gap-2 mb-3">
                                    <h4 className="text-lg md:text-xl font-bold text-[#1a1a1a] m-0">What Are We</h4>
                                </div>
                                <p className="text-slate-600 text-sm md:text-base leading-relaxed">
                                    Investate India is a technology-enabled investment platform designed to facilitate participation in Indian investment opportunities through a curated ecosystem of investors, opportunity providers and professional service partners.
                                </p>
                            </div>

                            {/* Mission & Vision Side-by-Side */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div>
                                    <div className="flex items-center gap-2 mb-3">
                                        <Compass className="w-4 h-4 text-[#D48035] shrink-0" />
                                        <h5 className="text-xs font-bold uppercase tracking-widest text-[#1a1a1a] m-0">Mission</h5>
                                    </div>
                                    <p className="text-slate-600 text-sm md:text-base leading-relaxed">
                                        To simplify and secure investments into India through technology, transparency and trusted partnerships.
                                    </p>
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-3">
                                        <Award className="w-4 h-4 text-[#D48035] shrink-0" />
                                        <h5 className="text-xs font-bold uppercase tracking-widest text-[#1a1a1a] m-0">Vision</h5>
                                    </div>
                                    <p className="text-slate-600 text-sm md:text-base leading-relaxed">
                                        To become the most trusted global gateway for investments into India.
                                    </p>
                                </div>
                            </div>

                            {/* Platform Capabilities */}
                            <div style={{ borderTop: '1px solid rgba(0,0,0,0.1)', paddingTop: '2rem' }}>
                                <div className="flex items-center justify-between mb-4">
                                    <h4 className="text-lg md:text-xl font-bold text-[#1a1a1a] m-0">Platform Capabilities</h4>
                                    {/* <span className="text-xs font-bold uppercase tracking-widest text-[#D48035]">8 Services</span> */}
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
                                    {[
                                        "Investment Discovery", "Real Estate Opportunities", "Equity Investment Opportunities",
                                        "Alternative Investments", "Professional Services Integration", "Investor Enablement",
                                        "Legal & Financial Enablement", "End-to-End Investment Support"
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
            <section
                id="challenges"
                className="infra-section py-20 bg-[#f8f8f8]"
            >
                <div className="infra-section-header text-center mb-12">
                    <h2 className="infra-title text-3xl md:text-4xl font-bold text-[#1a1a1a]">
                        Business Model{" "}
                        <span className="infra-title-accent text-[#D48035]">
                            & Focus
                        </span>
                    </h2>
                    <p className="infra-subtitle max-w-2xl mx-auto mt-4 text-slate-600">
                        Investate India is a technology-enabled investment platform that connects global investors with verified investment opportunities in India.
                    </p>
                </div>

                <div className="infra-marquee-wrapper">
                    <div className="infra-marquee-track">
                        {[...serviceProviderChallenges, ...serviceProviderChallenges].map(
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
                                    Connecting <br />
                                    <span style={{ color: "#D48035" }}>
                                        Global Capital
                                    </span>
                                </h2>
                                <p className="responsive-paragraph text-slate-600 mb-8 max-w-lg">
                                    Investate India is structurally designed to connect international investors, Non-Resident Indians (NRIs), and global wealth managers with the high-yield growth potential of Indian markets.
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

            {/* ORGANIZATION / TEAM SECTION */}
            <section className="team-section-integrated section-theme" id="how-it-works">
                <div className="team-integrated-wrapper">
                    <div className="team-text-banner">
                        <div className="team-text-content-inner">
                            <h2 className="team-main-title">Meet the Team Behind <span className="text-highlight">Your Trust</span></h2>
                            <p className="team-main-desc">
                                <strong>Built on transparency. Driven by experience.</strong><br />
                                Investate India is led by Deepak Kavadia, Pankaj Gupta, and Atish Agarwal.
                            </p>
                        </div>
                    </div>
                    <div className="team-cards-scroll-area" id="team-cards-row-home">
                        {[
                            { name: "Deepak Kavadia", role: "CEO & Founder", image: "/deepak.png" },
                            { name: "Pankaj Gupta", role: "Co-Founder", image: "/pankaj.png" },
                            { name: "Atish Agarwal", role: "Co-Founder", image: "/atish.png" }
                        ].map((member, index) => (
                            <div className="team-card-premium" key={index}>
                                <div className="team-card-image">
                                    <img src={member.image} alt={member.name} loading="lazy" decoding="async" />
                                </div>
                                <div className="team-card-info">
                                    <h4 className="team-card-name">{member.name}</h4>
                                    <p className="team-card-role">{member.role}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Mobile scroll arrows */}
                    <div className="flex justify-center gap-4 mt-6 md:hidden">
                        <button
                            onClick={() => document.getElementById('team-cards-row-home').scrollBy({ left: -320, behavior: 'smooth' })}
                            style={{ width: '3rem', height: '3rem', borderRadius: '50%', border: '1.5px solid rgba(0,0,0,0.1)', background: '#fff', color: '#333', fontSize: '1.1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.06)' }}
                        >❮</button>
                        <button
                            onClick={() => document.getElementById('team-cards-row-home').scrollBy({ left: 320, behavior: 'smooth' })}
                            style={{ width: '3rem', height: '3rem', borderRadius: '50%', border: '1.5px solid rgba(0,0,0,0.1)', background: '#fff', color: '#333', fontSize: '1.1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.06)' }}
                        >❯</button>
                    </div>
                </div>
            </section>

            {/* Connecting Global Capital Cards */}
            <section className="py-20 bg-white" id="connecting-global">
                <div className="container mx-auto px-4 max-w-6xl">
                    <div className="text-center mb-14">
                        <h2 className="text-3xl md:text-4xl font-bold text-[#1a1a1a] mb-4">
                            Connecting Global Capital
                        </h2>
                        <p className="text-slate-600 max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
                            Investate India is structurally designed to connect international investors, Non-Resident Indians (NRIs), and global wealth managers with the high-yield growth potential of Indian markets.
                        </p>
                    </div>
                    <div className="flex flex-wrap justify-center gap-6">
                        {serviceProviderBenefits.map((benefit, index) => (
                            <div key={index} className="infra-marquee-card bg-white" style={{ position: 'static', margin: '0' }}>
                                <div className="infra-card-icon-wrapper">
                                    {index === 0 && <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" /></svg>}
                                    {index === 1 && <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>}
                                    {index === 2 && <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>}
                                    {index === 3 && <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>}
                                </div>
                                <h4 className="infra-card-title">{benefit.title}</h4>
                                <p className="infra-card-desc">{benefit.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CONTACT SECTION */}
            <section
                className="fullscreen-section py-20 text-white text-center"
                style={{ backgroundColor: '#1a1a1a' }}
                id="contact"
            >
                <div className="container max-w-3xl mx-auto px-4">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">
                        Connect with our team to explore <br />
                        investment opportunities in India.
                    </h2>
                    <p className="text-slate-400 mb-8 max-w-xl mx-auto text-sm md:text-base leading-relaxed">
                        Get personalized assistance from our relationship managers and navigate your investment path seamlessly.
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
