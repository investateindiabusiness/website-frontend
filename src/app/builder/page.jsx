"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import RegisterDialog from '@/components/RegisterDialog';
import { Globe, Search, ShieldCheck, Users, FileText, Activity } from 'lucide-react';

const heroSlides = [
    {
        image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop',
        tag: 'Institutional Capital Access',
        title: 'Direct Connectivity to',
        highlight: 'High-Net-Worth NRI Capital',
        subtitle: 'The definitive institutional-grade platform for visionary Indian developers to engage directly with a pre-vetted global network of sophisticated NRI investors.'
    },
    {
        image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=2070&auto=format&fit=crop',
        tag: 'Global Reach & Trust',
        title: 'Elevate Your Brand with',
        highlight: 'Verified Institutional Credibility',
        subtitle: 'Position your developments within a transparency-first ecosystem that reinforces your reputation for corporate governance and delivery excellence to a global audience.'
    },
    /* {
        image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070&auto=format&fit=crop',
        tag: 'Sales Acceleration',
        title: 'Transform Your Reach with',
        highlight: 'Precision-Vetted Buyer Intent',
        subtitle: 'Eliminate administrative friction and connect with high-intent investors who meet strict acquisition criteria. Your global sales expansion, simplified.'
    } */
];

const builderBenefits = [
    { title: "Qualified NRI Leads", desc: "Access to investors who've already shown serious interest and buying intent, not casual browsers.", image: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?q=80&w=2070&auto=format&fit=crop" },
    { title: "Professional Presentation", desc: "Your projects showcased in standardized, credible formats that build investor confidence.", image: "https://images.unsplash.com/photo-1512403754473-27835f7b9984?q=80&w=2070&auto=format&fit=crop" },
    { title: "No Junk Inquiries", desc: "We pre-screen investors to ensure you're connecting with genuine buyers, saving your team time.", image: "https://images.unsplash.com/photo-1516156008625-3a9d6067fab5?q=80&w=2070&auto=format&fit=crop" },
    { title: "Long-Term Relationships", desc: "Connect with investors looking for credible partners, not just one-time speculative deals.", image: "https://images.unsplash.com/photo-1542621334-a254cf47733d?q=80&w=2070&auto=format&fit=crop" },
    { title: "Enhanced Credibility", desc: "Association with a transparency-focused platform strengthens your brand trust among global investors.", image: "https://images.unsplash.com/photo-1507537297725-24a1c029d3ca?q=80&w=2070&auto=format&fit=crop" },
    { title: "Dedicated Support", desc: "We handle coordination and follow-ups, allowing you to focus on development excellence.", image: "/images/image4.png" },
    { title: "Global Logistics Solved", desc: "Overcome communication delays and coordination challenges due to international time zones.", image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2070&auto=format&fit=crop" },
    { title: "Brand Visibility", desc: "Strengthen your reputation in international markets, expanding your reach to the global Indian diaspora.", image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=2070&auto=format&fit=crop" }
];

const builderChallenges = [
    { id: "01", text: "Global Coordination", desc: "Connecting with genuine NRI buyers across different time zones remains extremely difficult.", icon: <Globe className="w-8 h-8 text-white" /> },
    { id: "02", text: "Lead Quality", desc: "Filtering out casual inquiries to focus on serious investors with real buying intent.", icon: <Search className="w-8 h-8 text-white" /> },
    { id: "03", text: "Distance Trust Gap", desc: "Building trust from thousands of miles away requires verified credentials and transparency.", icon: <ShieldCheck className="w-8 h-8 text-white" /> },
    { id: "04", text: "Broker Fragmentation", desc: "Overseas broker networks are often unregulated and pass inaccurate project information.", icon: <Users className="w-8 h-8 text-white" /> },
    { id: "05", text: "Credibility Proof", desc: "Showcasing project credibility and RERA compliance effectively to a remote audience.", icon: <FileText className="w-8 h-8 text-white" /> },
    { id: "06", text: "Logistical Friction", desc: "Managing long sales cycles due to cross-border documentation and payment logistics.", icon: <Activity className="w-8 h-8 text-white" /> }
];

const builderSteps = [
    { id: "1", title: "Apply", text: "Submit your company profile, past projects, and current development details through our structured application." },
    { id: "2", title: "Get Verified", text: "Our team reviews your credentials, track record, and compliance status to ensure quality standards." },
    { id: "3", title: "Go Live", text: "Your approved projects are professionally presented to our growing NRI investor network in a standardized format." },
    { id: "4", title: "Close Deals", text: "Build lasting relationships with investors based on transparent terms and mutual trust." }
];

const stepImages = [
    "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1573164713988-8665fc963095?q=80&w=1000&auto=format&fit=crop"
];

const trustFeatures = [
    { id: "secure", title: "Verified Network", desc: "We ensure both buyers and builders on our platform meet high standards of credibility.", icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg> },
    { id: "disclosure", title: "Global Reach", desc: "Gain immediate visibility among a concentrated pool of Non-Resident Indians seeking properties.", icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg> },
    { id: "support", title: "Dedicated Coordinators", desc: "Our team handles the heavy lifting of communication and scheduling to save you time.", icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg> }
];


export default function BuilderHome() {
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [isRegisterOpen, setIsRegisterOpen] = useState(false);
    const [activeStepIndex, setActiveStepIndex] = useState(0);
    const [dialogData, setDialogData] = useState({});
    const [heroIndex, setHeroIndex] = useState(0);
    const [hoveredBuilderCard, setHoveredBuilderCard] = useState(null);
    const [builderChallengePage, setBuilderChallengePage] = useState(0);
    const builderChallengesScrollRef = useRef(null);

    const [benefitsPage, setBenefitsPage] = useState(0);
    const benefitsPerPage = 4;
    const totalBenefitsPages = Math.ceil(builderBenefits.length / benefitsPerPage);

    const nextBenefits = () => {
        setBenefitsPage((prev) => (prev + 1) % totalBenefitsPages);
    };

    const prevBenefits = () => {
        setBenefitsPage((prev) => (prev - 1 + totalBenefitsPages) % totalBenefitsPages);
    };

    const handleAuthClick = (action, role) => {
        if (action === 'login') {
            setIsRegisterOpen(false);
            if (typeof role === 'string') setDialogData({ userType: role });
            setIsLoginOpen(true);
        } else {
            setIsLoginOpen(false);
            if (typeof role === 'string') setDialogData({ userType: role });
            setIsRegisterOpen(true);
        }
    };

    useEffect(() => {
        const timer = setInterval(() => {
            setHeroIndex((prev) => (prev + 1) % heroSlides.length);
        }, 6000);
        return () => clearInterval(timer);
    }, []);


    const activeStepData = builderSteps[activeStepIndex];

    return (
        <div className="theme-builder w-full bg-[var(--color-light-bg)] overflow-x-hidden">
            <Header transparent={true} />

            {/* HERO SECTION */}
            <section className="fullscreen-section hero-section">
                <AnimatePresence mode="sync">
                    <motion.img
                        key={heroIndex}
                        src={heroSlides[heroIndex]?.image}
                        alt="Hero background"
                        className="absolute inset-0 w-full h-full object-cover z-0"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1.2, ease: 'easeInOut' }}
                        style={{ objectPosition: 'center' }}
                    />
                </AnimatePresence>
                <div className="absolute inset-0 z-[1]" style={{ background: 'rgba(0,0,0,0.22)' }} />

                {/* Prev / Next buttons */}
                <button
                    onClick={() => setHeroIndex((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)}
                    aria-label="Previous image"
                    style={{
                        position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)',
                        zIndex: 10, background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(6px)',
                        border: '1px solid rgba(255,255,255,0.3)', borderRadius: '50%',
                        width: '2.75rem', height: '2.75rem', display: 'flex', alignItems: 'center',
                        justifyContent: 'center', cursor: 'pointer', color: '#fff', fontSize: '1.1rem',
                        transition: 'background 0.2s'
                    }}
                >❮</button>
                <button
                    onClick={() => setHeroIndex((prev) => (prev + 1) % heroSlides.length)}
                    aria-label="Next image"
                    style={{
                        position: 'absolute', right: '1.25rem', top: '50%', transform: 'translateY(-50%)',
                        zIndex: 10, background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(6px)',
                        border: '1px solid rgba(255,255,255,0.3)', borderRadius: '50%',
                        width: '2.75rem', height: '2.75rem', display: 'flex', alignItems: 'center',
                        justifyContent: 'center', cursor: 'pointer', color: '#fff', fontSize: '1.1rem',
                        transition: 'background 0.2s'
                    }}
                >❯</button>

                {/* Dot indicators */}
                <div style={{ position: 'absolute', bottom: '1.5rem', left: '50%', transform: 'translateX(-50%)', zIndex: 10, display: 'flex', gap: '0.5rem' }}>
                    {heroSlides.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setHeroIndex(i)}
                            aria-label={`Go to slide ${i + 1}`}
                            style={{
                                width: i === heroIndex ? '1.5rem' : '0.5rem',
                                height: '0.5rem',
                                borderRadius: '9999px',
                                background: i === heroIndex ? '#fff' : 'rgba(255,255,255,0.45)',
                                border: 'none', cursor: 'pointer',
                                transition: 'all 0.3s ease', padding: 0
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
                                    <span className="text-accent">{heroSlides[heroIndex]?.highlight}</span>
                                </h1>
                                <p className="hero-subheadline">
                                    {heroSlides[heroIndex]?.subtitle}
                                </p>
                            </motion.div>
                        </AnimatePresence>
                        <div className="hero-cta-group">
                            <button onClick={() => handleAuthClick('register', 'builder')} className="btn btn-primary">
                                Apply for Partnership
                            </button>
                            <button onClick={() => handleAuthClick('login', 'builder')} className="btn btn-secondary">
                                Partner Login
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Infrastructure-style Marquee Section ── */}
            <section id="challenges" className="infra-section">
                {/* ── Develite-style Header ── */}
                <div className="infra-section-header">
                    <h2 className="infra-title">
                        Overcoming <span className="infra-title-accent">Market Friction</span>
                    </h2>
                </div>

                <p className="infra-subtitle">
                    Connecting with international investors requires more than traditional marketing. We solve the specific trust and logistical challenges that prevent visionary developers from reaching the global Indian diaspora.
                </p>

                {/* ── Infinite Marquee with Original White Cards ── */}
                <div className="infra-marquee-wrapper">
                    <div className="infra-marquee-track">
                        {/* Render twice for seamless loop */}
                        {[...builderChallenges, ...builderChallenges].map((challenge, i) => (
                            <div key={i} className="infra-marquee-card">
                                <div className="infra-card-icon-wrapper">
                                    {challenge.icon}
                                </div>
                                <h3 className="infra-card-title">{challenge.text}</h3>
                                <p className="infra-card-desc">{challenge.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="fullscreen-section section-theme" id="benefits" style={{ padding: '60px 0', overflow: 'hidden' }}>
                <div className="container">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
                        {/* Left Side: Content */}
                        <motion.div
                            className="flex flex-col gap-10"
                            initial={{ x: -60, opacity: 0 }}
                            whileInView={{ x: 0, opacity: 1 }}
                            viewport={{ once: true, amount: 0.2 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                        >
                            <div>
                                {/* <div style={{
                                    display: 'inline-block',
                                    background: '#FFF0E6',
                                    color: '#EA580C',
                                    padding: '4px 12px',
                                    borderRadius: '4px',
                                    fontSize: '0.85rem',
                                    fontWeight: 700,
                                    marginBottom: '1.5rem',
                                    borderLeft: '3px solid #EA580C'
                                }}>
                                    | Strategic Advantages
                                </div> */}
                                <h2 className="responsive-heading" style={{ color: '#111', marginBottom: '1.5rem' }}>
                                    Elevate Your <br />
                                    <span style={{ color: '#EA580C' }}>Global Presence</span>
                                </h2>
                                <p className="responsive-paragraph" style={{ color: '#555', marginBottom: '2.5rem' }}>
                                    Position your developments within a transparency-first ecosystem that reinforces your reputation for corporate governance and delivery excellence.
                                </p>

                                <div className="relative min-h-[300px]">
                                    <AnimatePresence mode="wait">
                                        <motion.div
                                            key={benefitsPage}
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                            transition={{ duration: 0.3 }}
                                            className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10"
                                        >
                                            {builderBenefits.slice(benefitsPage * benefitsPerPage, (benefitsPage + 1) * benefitsPerPage).map((benefit, index) => (
                                                <div key={index} style={{ borderLeft: '4px solid #EA580C', paddingLeft: '1.25rem' }}>
                                                    <h4 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#111', marginBottom: '0.6rem' }}>
                                                        {benefit.title}
                                                    </h4>
                                                    <p style={{ fontSize: '1.05rem', color: '#666', lineHeight: 1.6 }}>
                                                        {benefit.desc}
                                                    </p>
                                                </div>
                                            ))}
                                        </motion.div>
                                    </AnimatePresence>
                                </div>

                                {/* Pagination Controls */}
                                <div className="benefits-pagination">
                                    <button
                                        onClick={prevBenefits}
                                        style={{
                                            background: '#f5f5f5',
                                            border: 'none',
                                            width: '40px',
                                            height: '40px',
                                            borderRadius: '50%',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: '#333',
                                            transition: 'all 0.2s'
                                        }}
                                        onMouseEnter={(e) => e.currentTarget.style.background = '#e5e5e5'}
                                        onMouseLeave={(e) => e.currentTarget.style.background = '#f5f5f5'}
                                    >
                                        ❮
                                    </button>
                                    <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#888' }}>
                                        {benefitsPage + 1} / {totalBenefitsPages}
                                    </div>
                                    <button
                                        onClick={nextBenefits}
                                        style={{
                                            background: '#f5f5f5',
                                            border: 'none',
                                            width: '40px',
                                            height: '40px',
                                            borderRadius: '50%',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: '#333',
                                            transition: 'all 0.2s'
                                        }}
                                        onMouseEnter={(e) => e.currentTarget.style.background = '#e5e5e5'}
                                        onMouseLeave={(e) => e.currentTarget.style.background = '#f5f5f5'}
                                    >
                                        ❯
                                    </button>
                                </div>
                            </div>
                        </motion.div>

                        {/* Right Side: Staggered Images */}
                        <motion.div
                            className="relative h-[350px] md:h-[450px] flex items-center justify-center mt-0 lg:mt-6 sticky top-24"
                            initial={{ x: 60, opacity: 0 }}
                            whileInView={{ x: 0, opacity: 1 }}
                            viewport={{ once: true, amount: 0.2 }}
                            transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
                        >
                            {/* Background Image (Large) */}
                            <div style={{
                                width: '85%',
                                height: '85%',
                                borderRadius: '1.5rem',
                                overflow: 'hidden',
                                position: 'relative',
                                transform: 'translateX(-10%)',
                                boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
                            }}>
                                <img
                                    src="/images/hero_modern_cityscape.png"
                                    alt="Modern Cityscape"
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                            </div>
                            {/* Overlapping Image (Small) */}
                            <div style={{
                                position: 'absolute',
                                right: '0',
                                bottom: '5%',
                                width: '65%',
                                height: '55%',
                                borderRadius: '1.5rem',
                                border: '12px solid #fff',
                                overflow: 'hidden',
                                boxShadow: '0 30px 60px rgba(0,0,0,0.15)',
                                zIndex: 10
                            }}>
                                <img
                                    src="/images/standard_verified_seal.png"
                                    alt="Verified Seal"
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* HOW IT WORKS SECTION */}
            <section className="fullscreen-section section-light" id="how-it-works">
                <div className="container">
                    <div className="section-heading">
                        <h2 className="section-title">
                            How Partnering <span className="text-highlight">Works</span>
                        </h2>
                    </div>
                    <div className="section-scrollable-body mt-4">
                        <div className="dashboard-wrapper">
                            <div className="dashboard-sidebar-container mobile-scroll-hint">
                                <div className="dashboard-sidebar" id="builder-tabs-row">
                                    {builderSteps.map((step, index) => (
                                        <button key={index} className={`dashboard-step-btn ${activeStepIndex === index ? 'active' : ''}`} onClick={() => setActiveStepIndex(index)}>
                                            <div className="step-btn-number">0{step.id}</div>
                                            <div className="step-btn-title">{step.title}</div>
                                        </button>
                                    ))}
                                </div>
                                <div className="dashboard-tabs-nav md:hidden">
                                    <button className="tabs-nav-btn prev" onClick={() => document.getElementById('builder-tabs-row').scrollBy({ left: -150, behavior: 'smooth' })}>❮</button>
                                    <button className="tabs-nav-btn next" onClick={() => document.getElementById('builder-tabs-row').scrollBy({ left: 150, behavior: 'smooth' })}>❯</button>
                                </div>
                            </div>
                            <div className="dashboard-display-window">
                                <div className="display-content">
                                    <div className="display-image-box">
                                        <img src={stepImages[activeStepIndex]} alt={`Step ${activeStepData.id}`} />
                                    </div>
                                    <div className="display-text-box">
                                        <div className="display-step-badge">Step {activeStepData.id}</div>
                                        <h3 className="display-title">{activeStepData.title}</h3>
                                        <p className="display-desc">{activeStepData.text}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="fullscreen-section section-theme" id="trust">
                <div className="container">
                    <div className="trust-split-wrapper">
                        <div className="trust-info-side">
                            <h2 className="trust-main-title">Why Developers <br /><span className="text-highlight">Choose Us</span></h2>
                            <p className="trust-main-desc">
                                We've built Investate India to solve the specific trust and distance challenges that developers face when connecting with global NRI investors.
                            </p>
                            <button onClick={() => handleAuthClick('register', 'builder')} className="trust-cta-btn">
                                <div className="cta-icon-circle">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                                </div>
                                <span className="cta-text">Apply for Partnership</span>
                            </button>
                        </div>
                        <div className="trust-cards-side">
                            {trustFeatures.map((feature, idx) => (
                                <div className="trust-feature-card" key={feature.id}>
                                    <div className="trust-feature-image">
                                        <img src={idx === 0 ? "/verified-network.png" : idx === 1 ? "/global-reach.jpg" : "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1000&auto=format&fit=crop"} alt={feature.title} />
                                    </div>
                                    <h3 className="trust-feature-title">{feature.title}</h3>
                                    <p className="trust-feature-desc">{feature.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* CONTACT SECTION */}
            <section className="fullscreen-section section-theme py-24" id="contact">
                <div className="container text-center">
                    <div className="cta-minimal-badge mb-6">
                        <span className="cta-badge-text">GET STARTED TODAY</span>
                        <div className="cta-badge-star">★</div>
                    </div>
                    <h2 className="cta-minimal-title mb-6">
                        Ready to Expand Your <span className="text-highlight">Reach?</span>
                    </h2>
                    <p className="cta-minimal-subtitle text-gray-600 text-lg mb-10 max-w-2xl mx-auto">
                        Join an exclusive network of top-tier Indian developers connecting directly with serious NRI investors.
                    </p>
                    <div className="flex justify-center">
                        <button onClick={() => handleAuthClick('register', 'builder')} className="cta-minimal-btn">
                            Apply for Partnership <span className="ml-2">→</span>
                        </button>
                    </div>
                </div>
            </section>

            <Footer />

            <RegisterDialog
                isOpen={isRegisterOpen}
                onOpenChange={setIsRegisterOpen}
                onLoginClick={() => { setIsRegisterOpen(false); setIsLoginOpen(true); }}
                initialData={dialogData}
            />
        </div>
    );
}
