"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import RegisterDialog from '@/components/RegisterDialog';

const heroSlides = [
    {
        image: '/images/b2.jpg',
        tag: 'Strategic Partnerships',
        title: 'The Premier Gateway to',
        highlight: 'High-Intent NRI Investors',
        subtitle: 'Orchestrating direct connections between visionary developers and a pre-vetted global network of NRI investors through institutional-grade project presentation.'
    },
    {
        image: '/images/b3.jpg',
        tag: 'Market Authority',
        title: 'Elevate Your Brand to',
        highlight: 'Institutional Standards',
        subtitle: 'Position your developments within a transparency-first ecosystem that reinforces your reputation for corporate governance and delivery excellence.'
    },
    {
        image: '/images/build1.jpg',
        tag: 'Global Growth',
        title: 'Expand Your Reach with',
        highlight: 'Validated Buyer Intent',
        subtitle: 'Eliminate administrative overhead by connecting only with pre-screened investors who meet strict acquisition criteria. Your global sales office, simplified.'
    }
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

    const builderBenefits = [
        { title: "Qualified NRI Leads", desc: "Access to investors who've already shown serious interest and buying intent, not casual browsers.", image: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?q=80&w=2070&auto=format&fit=crop" },
        { title: "Professional Project Presentation", desc: "Your projects showcased in standardized, credible formats that build investor confidence.", image: "https://images.unsplash.com/photo-1512403754473-27835f7b9984?q=80&w=2070&auto=format&fit=crop" },
        { title: "No Junk Inquiries", desc: "We pre-screen investors to ensure you're connecting with genuine buyers, saving your team valuable time.", image: "https://images.unsplash.com/photo-1516156008625-3a9d6067fab5?q=80&w=2070&auto=format&fit=crop" },
        { title: "Long-Term Relationships", desc: "Connect with investors looking for credible partners, not just one-time deals or speculative inquiries.", image: "https://images.unsplash.com/photo-1542621334-a254cf47733d?q=80&w=2070&auto=format&fit=crop" },
        { title: "Enhanced Credibility", desc: "Association with a transparency-focused platform strengthens your brand trust among global investors.", image: "https://images.unsplash.com/photo-1507537297725-24a1c029d3ca?q=80&w=2070&auto=format&fit=crop" },
        { title: "Dedicated Support", desc: "We handle coordination, follow-ups, and investor queries, allowing you to focus on what you do best.", image: "/images/image4.png" },
        { title: "Time-Zone Challenges Solved", desc: "Overcome communication delays and coordination challenges due to international time zones.", image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2070&auto=format&fit=crop" },
        { title: "Creating brand image", desc: "Strengthen your visibility and reputation in international markets, expanding your reach.", image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=2070&auto=format&fit=crop" }
    ];

    const builderChallenges = [
        { id: "01", text: "Connecting with genuine NRI buyers across different time zones", desc: "International buyers operate on different schedules, making real-time coordination and responsive communication extremely difficult without a dedicated platform.", image: "https://images.unsplash.com/photo-1508962914676-134849a727f0?q=80&w=2070&auto=format&fit=crop" },
        { id: "02", text: "Filtering out casual inquiries to focus on serious investors", desc: "Without a screening mechanism, developer sales teams waste hours responding to non-serious leads who have no real buying intent or financial capability.", image: "/images/image2.png" },
        { id: "03", text: "Building trust from thousands of miles away", desc: "Convincing an NRI to invest in a project they cannot physically inspect requires verified credentials, transparent disclosures, and a trusted intermediary.", image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=2070&auto=format&fit=crop" },
        { id: "04", text: "Overcoming the fragmentation of international broker networks", desc: "Overseas broker networks are inconsistent, unregulated, and often pass inaccurate project information — damaging your brand before a buyer even contacts you.", image: "https://images.unsplash.com/photo-1460467820054-c87ab43e9b59?q=80&w=2070&auto=format&fit=crop" },
        { id: "05", text: "Showcasing project credibility and RERA compliance effectively", desc: "NRI investors specifically look for RERA registration, past delivery records, and legal approvals — information that is rarely presented in a clear, standardized format.", image: "/images/image3.png" },
        { id: "06", text: "Managing long sales cycles due to cross-border logistics", desc: "Documentation, payments, and decision-making all take longer across borders, requiring patient coordination and clear communication at every stage.", image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=2070&auto=format&fit=crop" }
    ];

    const builderSteps = [
        { id: "1", title: "Apply", text: "Submit your company profile, past projects, and current development details through our structured application." },
        { id: "2", title: "Get Verified", text: "Our team reviews your credentials, track record, and compliance status to ensure quality standards." },
        { id: "3", title: "Go Live", text: "Your approved projects are professionally presented to our growing NRI investor network in a standardized format." },
        { id: "4", title: "Close Deals", text: "Build lasting relationships with investors based on transparent terms and mutual trust." }
    ];

    const activeStepData = builderSteps[activeStepIndex];

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

    const builderScrollRef = useRef(null);

    return (
        <div className="theme-builder w-full bg-white overflow-x-hidden">
            <Header transparent={true} />

            {/* HERO SECTION */}
            <section className="fullscreen-section hero-section">
                <AnimatePresence mode="sync">
                    <motion.img
                        key={heroIndex}
                        src={heroSlides[heroIndex].image}
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
                                <span className="hero-tag">{heroSlides[heroIndex].tag}</span>
                                <h1 className="hero-headline">
                                    {heroSlides[heroIndex].title} <br />
                                    <span className="text-accent">{heroSlides[heroIndex].highlight}</span>
                                </h1>
                                <p className="hero-subheadline">
                                    {heroSlides[heroIndex].subtitle}
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

            {/* CHALLENGES SECTION */}
            <section className="fullscreen-section section-theme" id="challenges">
                <div className="container">
                    <div className="section-heading">
                        <h2 className="section-title">
                            Why Reaching NRI Buyers <br /> <span className='text-highlight'>Is Challenging</span>
                        </h2>
                        <p className="section-subtitle">
                            Selling to international investors requires overcoming distance, building immense trust, and navigating complex logistics that traditional marketing struggles to solve.
                        </p>
                    </div>

                    {/* Horizontal scroll carousel */}
                    <div
                        ref={builderChallengesScrollRef}
                        style={{
                            display: 'flex',
                            gap: '1rem',
                            overflowX: 'auto',
                            scrollSnapType: 'x mandatory',
                            scrollBehavior: 'smooth',
                            marginTop: '2rem',
                            paddingBottom: '0.5rem',
                            msOverflowStyle: 'none',
                            scrollbarWidth: 'none'
                        }}
                        onScroll={() => {
                            if (builderChallengesScrollRef.current) {
                                const el = builderChallengesScrollRef.current;
                                const cardW = el.scrollWidth / builderChallenges.length;
                                const page = Math.round(el.scrollLeft / (cardW * 3));
                                setBuilderChallengePage(page);
                            }
                        }}
                    >
                        {builderChallenges.map((challenge) => {
                            const isHovered = hoveredBuilderCard === challenge.id;
                            return (
                                <div
                                    key={challenge.id}
                                    className="challenge-card"
                                    onMouseEnter={() => setHoveredBuilderCard(challenge.id)}
                                    onMouseLeave={() => setHoveredBuilderCard(null)}
                                    style={{
                                        position: 'relative',
                                        borderRadius: '0.75rem',
                                        overflow: 'hidden',
                                        height: '300px',
                                        scrollSnapAlign: 'start',
                                        boxShadow: '0 4px 18px rgba(0,0,0,0.18)',
                                        cursor: 'pointer'
                                    }}
                                >
                                    <img
                                        src={challenge.image}
                                        alt={challenge.text}
                                        style={{
                                            position: 'absolute', inset: 0, width: '100%', height: '100%',
                                            objectFit: 'cover',
                                            transform: isHovered ? 'scale(1.05)' : 'scale(1)',
                                            transition: 'transform 0.5s ease'
                                        }}
                                    />
                                    <div style={{
                                        position: 'absolute', inset: 0,
                                        background: isHovered
                                            ? 'linear-gradient(to top, rgba(5,15,35,0.97) 55%, rgba(5,15,35,0.65) 100%)'
                                            : 'linear-gradient(to top, rgba(5,15,35,0.92) 40%, rgba(5,15,35,0.45) 100%)',
                                        transition: 'background 0.4s ease'
                                    }} />
                                    {/* Text slides up on hover */}
                                    <div style={{
                                        position: 'absolute', inset: 0, padding: '1.25rem',
                                        display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
                                        transform: isHovered ? 'translateY(-4.5rem)' : 'translateY(0)',
                                        transition: 'transform 0.4s ease'
                                    }}>
                                        <span style={{
                                            fontFamily: 'monospace', fontSize: '0.7rem', letterSpacing: '0.12em',
                                            color: 'var(--color-accent, #F97316)', fontWeight: 700,
                                            marginBottom: '0.4rem', textTransform: 'uppercase'
                                        }}>{challenge.id}</span>
                                        <p className="challenge-card-title" style={{
                                            color: '#fff', fontWeight: 600,
                                            lineHeight: 1.4, margin: 0
                                        }}>{challenge.text}</p>
                                    </div>
                                    {/* Description slides in from bottom */}
                                    <div style={{
                                        position: 'absolute', bottom: 0, left: 0, right: 0,
                                        padding: '1rem 1.25rem 1.25rem',
                                        transform: isHovered ? 'translateY(0)' : 'translateY(100%)',
                                        opacity: isHovered ? 1 : 0,
                                        transition: 'transform 0.4s ease, opacity 0.35s ease'
                                    }}>
                                        <p className="challenge-card-desc" style={{
                                            color: 'rgba(255,255,255,0.8)',
                                            lineHeight: 1.55, margin: 0
                                        }}>{challenge.desc}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Navigation bar */}
                    <div style={{ marginTop: '1.25rem' }}>
                        <div style={{ width: '100%', height: '3px', background: 'rgba(255,255,255,0.2)', borderRadius: '9999px', marginBottom: '0.9rem', overflow: 'hidden' }}>
                            <div style={{
                                height: '100%',
                                width: `${((builderChallengePage + 1) / 2) * 100}%`,
                                background: 'var(--color-accent, #F97316)',
                                borderRadius: '9999px',
                                transition: 'width 0.3s ease'
                            }} />
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <button
                                onClick={() => {
                                    if (builderChallengesScrollRef.current) {
                                        const el = builderChallengesScrollRef.current;
                                        el.scrollLeft -= el.offsetWidth;
                                        setBuilderChallengePage(Math.max(0, builderChallengePage - 1));
                                    }
                                }}
                                aria-label="Previous"
                                style={{
                                    width: '2.25rem', height: '2.25rem', borderRadius: '50%',
                                    border: '1.5px solid rgba(255,255,255,0.3)', background: 'rgba(255,255,255,0.1)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    cursor: 'pointer', color: '#fff', fontSize: '0.9rem',
                                    opacity: builderChallengePage === 0 ? 0.35 : 1, transition: 'opacity 0.2s'
                                }}
                            >&#8249;</button>
                            <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)', minWidth: '6rem' }}>
                                {builderChallengePage === 0 ? '1' : '4'} – {builderChallengePage === 0 ? '3' : '6'} of {builderChallenges.length}
                            </span>
                            <button
                                onClick={() => {
                                    if (builderChallengesScrollRef.current) {
                                        const el = builderChallengesScrollRef.current;
                                        el.scrollLeft += el.offsetWidth;
                                        setBuilderChallengePage(Math.min(1, builderChallengePage + 1));
                                    }
                                }}
                                aria-label="Next"
                                style={{
                                    width: '2.25rem', height: '2.25rem', borderRadius: '50%',
                                    border: '1.5px solid rgba(255,255,255,0.3)', background: 'rgba(255,255,255,0.1)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    cursor: 'pointer', color: '#fff', fontSize: '0.9rem',
                                    opacity: builderChallengePage === 1 ? 0.35 : 1, transition: 'opacity 0.2s'
                                }}
                            >&#8250;</button>
                        </div>
                    </div>
                </div>
            </section>

            {/* BENEFITS SECTION - Integrated Carousel */}
            <section className="benefits-section-integrated" id="benefits">
                <div className="benefits-integrated-wrapper">
                    <div className="benefits-text-sidebar">
                        <h2 className="sidebar-title">A Serious Platform for <br /><span className="text-highlight">Serious Developers</span></h2>
                        <p className="sidebar-desc">
                            We work with builders who value transparency, disclosures, and long-term brand trust over short-term visibility or volume-based marketing.
                        </p>
                    </div>

                    <div className="benefits-visual-area">
                        <div className="benefits-bg-banner">
                            <img src="https://images.unsplash.com/photo-1567157577867-05ccb1388e66?q=80&w=2000&auto=format&fit=crop" alt="Premium Development" />
                        </div>
                        <div
                            id="builder-scroll-container"
                            className="benefits-cards-row"
                            ref={builderScrollRef}
                        >
                            {builderBenefits.map((benefit, index) => (
                                <div className="benefit-card-premium" key={index}>
                                    <div className="benefit-card-bg">
                                        <img src={benefit.image} alt={benefit.title} />
                                    </div>
                                    <div className="benefit-card-header">
                                        <div className="benefit-icon-box">
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                        </div>
                                        <div className="benefit-card-number">0{index + 1}</div>
                                    </div>
                                    <div className="benefit-card-body">
                                        <h4 className="benefit-card-title">{benefit.title}</h4>
                                        <p className="benefit-card-desc">{benefit.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="benefits-navigation-footer">
                    <div className="benefits-nav-btns">
                        <button className="nav-arrow-btn prev" onClick={() => {
                            const container = document.getElementById('builder-scroll-container');
                            if (container) container.scrollLeft -= 410;
                        }}>❮</button>
                        <button className="nav-arrow-btn next" onClick={() => {
                            const container = document.getElementById('builder-scroll-container');
                            if (container) container.scrollLeft += 410;
                        }}>❯</button>
                    </div>
                </div>
            </section>

            {/* HOW IT WORKS SECTION */}
            <section className="fullscreen-section section-white" id="how-it-works">
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
                                    <button className="tabs-nav-btn prev" onClick={() => document.getElementById('builder-tabs-row').scrollBy({left: -150, behavior: 'smooth'})}>❮</button>
                                    <button className="tabs-nav-btn next" onClick={() => document.getElementById('builder-tabs-row').scrollBy({left: 150, behavior: 'smooth'})}>❯</button>
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
            <section className="fullscreen-section section-white py-24" id="contact">
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
