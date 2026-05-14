"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import RegisterDialog from '@/components/RegisterDialog';
import LoginDialog from '@/components/LoginDialog';
import { toast } from '@/hooks/use-toast';
import { subscribeToNewsletter } from '@/api';
import { Loader2 } from 'lucide-react';

const heroSlides = [
    {
        image: '/images/hero_indian_luxury.png',
        tag: 'India\'s Most Trusted Gateway',
        title: 'Bridging Global NRIs to',
        highlight: 'Verified Indian Real Estate',
        subtitle: 'Institutional-grade transparency, verified developer credentials, and professional on-ground representation for the global Indian diaspora.'
    },
    {
        image: '/images/hero_modern_cityscape.png',
        tag: 'Institutional Standards',
        title: 'Secure Your Future with',
        highlight: 'Digital Trust & Integrity',
        subtitle: 'A sophisticated discovery ecosystem designed to eliminate the complexities of cross-border real estate acquisition with absolute clarity.'
    }
];

export default function Index() {
    const benefitsScrollRef = useRef(null);
    const challengesScrollRef = useRef(null);
    const [activeProcessTab, setActiveProcessTab] = useState('investors');
    const [activeStepIndex, setActiveStepIndex] = useState(0);
    const [activeFaq, setActiveFaq] = useState(null);
    const [activeCardIndex, setActiveCardIndex] = useState(0);
    const [activeCtaTab, setActiveCtaTab] = useState('investors');
    const [heroIndex, setHeroIndex] = useState(0);
    const [isHeroPaused, setIsHeroPaused] = useState(false);
    const [challengePage, setChallengePage] = useState(0);
    const [hoveredCard, setHoveredCard] = useState(null);

    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [isRegisterOpen, setIsRegisterOpen] = useState(false);
    const [hasAutoOpened, setHasAutoOpened] = useState(false);
    const [dialogData, setDialogData] = useState({});

    const [newsletterEmail, setNewsletterEmail] = useState('');
    const [isSubscribing, setIsSubscribing] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (!hasAutoOpened && window.scrollY > 1200) {
                setIsLoginOpen(true);
                setHasAutoOpened(true);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [hasAutoOpened]);

    useEffect(() => {
        if (isHeroPaused) return;
        const timer = setInterval(() => {
            setHeroIndex((prev) => (prev + 1) % heroSlides.length);
        }, 8000);
        return () => clearInterval(timer);
    }, [isHeroPaused]);

    const toggleFaq = (index) => {
        setActiveFaq(activeFaq === index ? null : index);
    };

    const handleNewsletterSubmit = async (e) => {
        e.preventDefault();
        if (!newsletterEmail.trim()) return;

        setIsSubscribing(true);
        try {
            await subscribeToNewsletter(newsletterEmail);
            toast({ title: "Success!", description: "You've been added to our waitlist." });
            setNewsletterEmail('');
        } catch (error) {
            toast({ title: "Registration Failed", description: error.message, variant: "destructive" });
        } finally {
            setIsSubscribing(false);
        }
    };

    const contentDataForSection2 = [
        {
            id: "01",
            title: "The Platform",
            text: "A structured discovery ecosystem built specifically for NRIs who seek visibility and a dependable investment process without the middleman noise.",
            image: "/images/platform_indian_corporate.png"
        },
        {
            id: "02",
            title: "The Standard",
            text: "We mandate standardized disclosures—including RERA compliance and financial health—ensuring you invest based on merit, not marketing.",
            image: "/images/standard_verified_seal.png"
        },
        {
            id: "03",
            title: "The Focus",
            text: "Presenting builder-declared information in a clean, transparent manner to empower you with the clarity needed for remote decision-making.",
            image: "/images/focus_data_clarity.png"
        }
    ];

    const challengesList = [
        { id: "01", text: "Information Asymmetry", desc: "Unverified project data and lack of transparent documentation from abroad.", image: "/images/challenge_verified_info.png" },
        { id: "02", text: "Fragmented Intermediaries", desc: "Heavy reliance on brokers and middlemen who often distort information.", image: "/images/challenge_intermediaries.png" },
        { id: "03", text: "Lack of Standardized Disclosures", desc: "No uniform baseline to compare projects across different developers.", image: "/images/challenge_disclosures.png" },
        { id: "04", text: "Complex Regulatory Landscape", desc: "Navigating RERA, FEMA, and state-specific property laws remotely.", image: "/images/challenge_legal.png" },
        { id: "05", text: "Builder Credibility Gaps", desc: "Difficulties in verifying past delivery records and financial stability.", image: "/images/challenge_builder.png" },
        { id: "06", text: "On-Ground Hurdles", desc: "Coordinating site visits and legal vetting across various time zones.", image: "/images/challenge_timezone.png" }
    ];

    const benefitsList = [
        { title: "Pre-Verified Builders", desc: "Rigorous credibility assessments before any developer is listed.", icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg> },
        { title: "Standardized Disclosures", desc: "RERA details, approvals, and timelines in one consistent format.", icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg> },
        { title: "Transparent Progress", desc: "Real-time construction updates and payment plan clarity.", icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg> },
        { title: "Expert Guidance", desc: "On-ground support to navigate documentation and legal requirements.", icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg> },
        { title: "Commercial Terms", desc: "Negotiating best-in-market pricing directly with developers.", icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><polyline points="17 11 19 13 23 9"></polyline></svg> },
        { title: "Investor Safeguards", desc: "Structured risk mitigation designed to protect your interests.", icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg> },
        { title: "Inventory Tracking", desc: "Transparent inventory monitoring and fund flow oversight.", icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="20" x2="12" y2="10"></line><line x1="18" y1="20" x2="18" y2="4"></line><line x1="6" y1="20" x2="6" y2="16"></line></svg> },
        { title: "Exit Strategy", desc: "Support for secondary market placement and resale planning.", icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 22L14 18L10 14"></path><path d="M18 10L22 6L18 2"></path><path d="M22 6H12C9.79086 6 8 7.79086 8 10V22"></path></svg> },
        { title: "Legal Compliance", desc: "Vetting of agreements and FEMA/RERA compliance checks.", icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg> },
    ];

    const investorSteps = [
        { id: "1", title: "Register", text: "Share your preferences. A dedicated Relationship Manager will be assigned to guide your journey." },
        { id: "2", title: "Discover", text: "Browse pre-verified builders with complete disclosures and RERA-verified timelines." },
        { id: "3", title: "Evaluate", text: "Receive expert support to vet documentation and identify profitable opportunities." },
        { id: "4", title: "Decide", text: "Make informed decisions with full transparency and ongoing on-ground support." }
    ];

    const activeStepData = investorSteps[activeStepIndex];

    const stepImages = [
        "/images/platform_indian_corporate.png",
        "/images/process_discovery.png",
        "/images/standard_verified_seal.png",
        "/images/hero_indian_luxury.png"
    ];

    const teamMembers = [
        { name: "Pankaj Gupta", role: "Co-Founder", image: "/pankaj.png" },
        { name: "Atish Agarwal", role: "Co-Founder", image: "/atish.png" },
        { name: "Deepak Kavadia", role: "Co-Founder", image: "/deepak.png" }
    ];

    const faqsList = [
        {
            question: "Is Investate India a broker?",
            answer: "No. We are a discovery and facilitation platform. We provide structured information and verify builder credentials to ensure transparent connections."
        },
        {
            question: "Is there a registration fee?",
            answer: "Registration is currently free for NRI investors. We prioritize transparency and will inform you well in advance of any future service fees."
        },
        {
            question: "How do you verify builders?",
            answer: "We assess RERA compliance, financial health, past delivery records, and market reputation through a rigorous multi-step process."
        },
        {
            question: "Which cities do you cover?",
            answer: "We focus on major metros: Bangalore, Mumbai, Delhi-NCR, and Hyderabad, with plans to expand to quality Tier-2 developments."
        }
    ];

    const trustFeatures = [
        { id: "secure", title: "Secure Data Handling", desc: "Your personal and financial information is protected with industry-standard security protocols.", icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg> },
        { id: "disclosure", title: "Mandatory Disclosures", desc: "Builders must provide complete information including approvals, timelines, and financial status.", icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg> },
        { id: "network", title: "Curated Builder Network", desc: "We work only with developers who meet our strict credibility and transparency standards.", icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="7"></circle><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline></svg> },
        { id: "support", title: "NRI-Focused Support Team", desc: "Dedicated professionals who understand the unique challenges of investing from abroad.", icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg> }
    ];

    const currentFocusList = [
        "Onboarding select builders in key metro cities (Bangalore, Mumbai, Pune, Delhi-NCR, Hyderabad etc.)",
        "Building our NRI investor community across USA, UK, UAE and across the globe."
    ];

    const handleSwitchToRegister = (dataPayload) => {
        setIsLoginOpen(false);
        if (typeof dataPayload === 'string') {
            setDialogData({ userType: dataPayload });
        } else if (dataPayload) {
            setDialogData(dataPayload);
        }
        setIsRegisterOpen(true);
    };

    const openLogin = (role) => {
        if (typeof role === 'string') setDialogData({ userType: role });
        setIsRegisterOpen(false);
        setIsLoginOpen(true);
    };

    const openRegister = (role) => {
        if (typeof role === 'string') setDialogData({ userType: role });
        setIsLoginOpen(false);
        setIsRegisterOpen(true);
    };

    const handleAuthClick = (action, role) => {
        if (action === 'login') {
            openLogin(role);
        } else {
            openRegister(role);
        }
    };

    return (
        <div className="theme-investor w-full bg-white overflow-x-hidden">
            <Header transparent={true} onAuthClick={handleAuthClick} />

            <section
                className="fullscreen-section hero-section"
                onMouseEnter={() => setIsHeroPaused(true)}
                onMouseLeave={() => setIsHeroPaused(false)}
            >
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
                            <button onClick={() => handleAuthClick('register', 'investor')} className="btn btn-primary">
                                Explore Opportunities
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            <section className="fullscreen-section section-theme" id="about">
                <div className="container">
                    <div className="section-heading">
                        <h2 className="section-title">The <span className='text-highlight'>Investate Standard</span></h2>
                        <p className="section-subtitle">A sophisticated discovery ecosystem built to eliminate the complexities of remote real estate acquisition for NRIs.</p>
                    </div>

                    <div className="horizontal-accordion-container">
                        {contentDataForSection2.map((item, index) => (
                            <div
                                key={index}
                                className="accordion-card"
                            >
                                <div className="accordion-card-bg">
                                    <img src={item.image} alt={item.title} />
                                </div>
                                <div className="accordion-card-content">
                                    <div className="accordion-card-header">
                                        <div className="accordion-number">{item.id}</div>
                                        <h3 className="accordion-title">{item.title}</h3>
                                    </div>
                                    <div className="accordion-details">
                                        <p className="accordion-text">{item.text}</p>
                                        {/* <button className="accordion-learn-more">
                                            Learn More <span>↗</span>
                                        </button> */}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="fullscreen-section section-white" id="challenges">
                <div className="container">
                    <div className="section-heading">
                        <h2 className="section-title">
                            Overcoming the <br /> <span className='text-highlight'>Distance & Trust Gap</span>
                        </h2>
                        <p className="section-subtitle">
                            For NRIs, navigating the Indian property market often entails managing information asymmetry and on-ground uncertainty. We provide the clarity needed to differentiate exceptional opportunities from market noise.
                        </p>
                    </div>

                    {/* Horizontal scroll carousel */}
                    <div
                        ref={challengesScrollRef}
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
                            if (challengesScrollRef.current) {
                                const el = challengesScrollRef.current;
                                const cardW = el.scrollWidth / challengesList.length;
                                const page = Math.round(el.scrollLeft / (cardW * 4));
                                setChallengePage(page);
                            }
                        }}
                    >
                        {challengesList.map((challenge) => {
                            const isHovered = hoveredCard === challenge.id;
                            return (
                                <div
                                    key={challenge.id}
                                    className="challenge-card"
                                    onMouseEnter={() => setHoveredCard(challenge.id)}
                                    onMouseLeave={() => setHoveredCard(null)}
                                    style={{
                                        position: 'relative',
                                        borderRadius: '1rem',
                                        overflow: 'hidden',
                                        height: '300px',
                                        scrollSnapAlign: 'start',
                                        boxShadow: isHovered
                                            ? '0 20px 50px rgba(14,88,168,0.22), 0 4px 18px rgba(0,0,0,0.12)'
                                            : '0 6px 24px rgba(0,0,0,0.10), 0 1px 4px rgba(14,88,168,0.08)',
                                        cursor: 'pointer',
                                        transition: 'box-shadow 0.4s ease, transform 0.4s ease',
                                        transform: isHovered ? 'translateY(-4px)' : 'translateY(0)'
                                    }}
                                >
                                    <img
                                        src={challenge.image}
                                        alt={challenge.text}
                                        style={{
                                            position: 'absolute', inset: 0, width: '100%', height: '100%',
                                            objectFit: 'cover', objectPosition: 'center',
                                            transform: isHovered ? 'scale(1.07)' : 'scale(1)',
                                            transition: 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
                                        }}
                                    />
                                    {/* White-to-blue gradient overlay — brighter on rest, slightly deeper on hover */}
                                    <div style={{
                                        position: 'absolute', inset: 0,
                                        background: isHovered
                                            ? 'linear-gradient(to top, rgba(10,42,95,0.88) 45%, rgba(14,88,168,0.45) 75%, rgba(255,255,255,0.08) 100%)'
                                            : 'linear-gradient(to top, rgba(10,42,95,0.82) 35%, rgba(14,88,168,0.38) 70%, rgba(240,247,255,0.12) 100%)',
                                        transition: 'background 0.45s ease'
                                    }} />
                                    {/* Static content — slides up on hover */}
                                    <div style={{
                                        position: 'absolute', inset: 0, padding: '1.4rem',
                                        display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
                                        transform: isHovered ? 'translateY(-9rem)' : 'translateY(0)',
                                        transition: 'transform 0.45s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
                                    }}>
                                        <span style={{
                                            fontFamily: 'monospace', fontSize: '0.68rem', letterSpacing: '0.14em',
                                            color: '#60B8FF', fontWeight: 700,
                                            marginBottom: '0.5rem', textTransform: 'uppercase',
                                            textShadow: '0 1px 4px rgba(0,0,0,0.3)'
                                        }}>{challenge.id}</span>
                                        <p className="challenge-card-title" style={{
                                            color: '#fff', fontWeight: 700,
                                            lineHeight: 1.45, margin: 0,
                                            textShadow: '0 2px 8px rgba(0,0,0,0.35)',
                                            letterSpacing: '0.01em'
                                        }}>{challenge.text}</p>
                                    </div>
                                    {/* Description — slides in from bottom on hover */}
                                    <div style={{
                                        position: 'absolute', bottom: 0, left: 0, right: 0,
                                        padding: '0.8rem 1.4rem 1.4rem',
                                        transform: isHovered ? 'translateY(0)' : 'translateY(100%)',
                                        opacity: isHovered ? 1 : 0,
                                        transition: 'transform 0.45s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 0.4s ease'
                                    }}>
                                        <p className="challenge-card-desc" style={{
                                            color: 'rgba(220,238,255,0.92)',
                                            lineHeight: 1.6, margin: 0,
                                            textShadow: '0 1px 3px rgba(0,0,0,0.2)'
                                        }}>{challenge.desc}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Navigation bar */}
                    <div style={{ marginTop: '1.25rem' }}>
                        {/* Progress track */}
                        <div style={{ width: '100%', height: '3px', background: 'rgba(0,0,0,0.1)', borderRadius: '9999px', marginBottom: '0.9rem', overflow: 'hidden' }}>
                            <div style={{
                                height: '100%',
                                width: `${((challengePage + 1) / 2) * 100}%`,
                                background: 'var(--color-accent, #F97316)',
                                borderRadius: '9999px',
                                transition: 'width 0.3s ease'
                            }} />
                        </div>
                        {/* Arrows + counter */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <button
                                onClick={() => {
                                    if (challengesScrollRef.current) {
                                        const el = challengesScrollRef.current;
                                        el.scrollLeft -= el.offsetWidth;
                                        setChallengePage(Math.max(0, challengePage - 1));
                                    }
                                }}
                                aria-label="Previous"
                                style={{
                                    width: '2.25rem', height: '2.25rem', borderRadius: '50%',
                                    border: '1.5px solid rgba(0,0,0,0.2)', background: '#fff',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    cursor: 'pointer', color: '#333', fontSize: '0.9rem',
                                    opacity: challengePage === 0 ? 0.35 : 1, transition: 'opacity 0.2s'
                                }}
                            >&#8249;</button>
                            <span style={{ fontSize: '0.85rem', color: '#555', minWidth: '6rem' }}>
                                {challengePage === 0 ? '1' : '5'} – {challengePage === 0 ? '4' : '8'} of {challengesList.length}
                            </span>
                            <button
                                onClick={() => {
                                    if (challengesScrollRef.current) {
                                        const el = challengesScrollRef.current;
                                        el.scrollLeft += el.offsetWidth;
                                        setChallengePage(Math.min(1, challengePage + 1));
                                    }
                                }}
                                aria-label="Next"
                                style={{
                                    width: '2.25rem', height: '2.25rem', borderRadius: '50%',
                                    border: '1.5px solid rgba(0,0,0,0.2)', background: '#fff',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    cursor: 'pointer', color: '#333', fontSize: '0.9rem',
                                    opacity: challengePage === 1 ? 0.35 : 1, transition: 'opacity 0.2s'
                                }}
                            >&#8250;</button>
                        </div>
                    </div>
                </div>
            </section>

            <section className="growth-story-section">
                <div className="container">
                    <div className="growth-header">
                        <h2>India's Growth Story</h2>
                    </div>

                    <div className="growth-grid">
                        <div className="map-visual-area">
                            <svg className="india-map-svg" viewBox="0 0 500 600" xmlns="http://www.w3.org/2000/svg">
                                <path 
                                    d="M261.2,14.6c-2.3,0.3-4.5,1.2-6.5,2.7c-3,2.2-5.1,5.6-5.8,9.3c-0.4,1.8-0.4,4.4,0,6.2c0.6,2.8,2,5.2,4,6.9 c2,1.7,4.6,2.6,7.3,2.6c2.7,0,5.3-0.9,7.3-2.6c2-1.7,3.4-4.1,4-6.9c0.4-1.8,0.4-4.4,0-6.2c-0.6-2.8-2-5.2-4-6.9 C265.7,15.5,263.5,14.6,261.2,14.6z M167.3,31.7c-2.3,0.3-4.5,1.2-6.5,2.7c-3,2.2-5.1,5.6-5.8,9.3c-0.4,1.8-0.4,4.4,0,6.2 c0.6,2.8,2,5.2,4,6.9c2,1.7,4.6,2.6,7.3,2.6c2.7,0,5.3-0.9,7.3-2.6c2-1.7,3.4-4.1,4-6.9c0.4-1.8,0.4-4.4,0-6.2 c-0.6-2.8-2-5.2-4-6.9C171.8,32.6,169.6,31.7,167.3,31.7z M353.4,32.6c-2.3,0.3-4.5,1.2-6.5,2.7c-3,2.2-5.1,5.6-5.8,9.3 c-0.4,1.8-0.4,4.4,0,6.2c0.6,2.8,2,5.2,4,6.9c2,1.7,4.6,2.6,7.3,2.6c2.7,0,5.3-0.9,7.3-2.6c2-1.7,3.4-4.1,4-6.9 c0.4-1.8,0.4-4.4,0-6.2c-0.6-2.8-2-5.2-4-6.9C357.9,33.5,355.7,32.6,353.4,32.6z M261.2,456.7L261.2,456.7 c-27.1-2.1-51.5-16.7-65.4-40.2c-4.4-7.5-7.3-15.8-8.6-24.5c-0.3-1.8-0.4-3.6-0.4-5.5c0-44.5,36.1-80.6,80.6-80.6 s80.6,36.1,80.6,80.6c0,1.9-0.1,3.7-0.4,5.5c-1.3,8.7-4.2,17-8.6,24.5C325.1,440,300.7,454.6,273.6,456.7L261.2,456.7z"
                                    fill="#E67E22" 
                                />
                                <path 
                                    d="M240.2,46.5c-4.4,0-8,3.6-8,8s3.6,8,8,8s8-3.6,8-8S244.6,46.5,240.2,46.5z M235.2,106.5c-10,15-5,35,15,45 s30,0,45,15s15,40,30,50s45,0,55,15s0,40,15,55s45,0,55,15s0,45,10,65s40,20,50,45s-10,55,5,75s50,15,60,40s-20,60,0,85 s65,25,75,55s-30,70,0,95s80,20,95,55s-40,85,0,115s105,15,125,55s-50,105,0,145s130,5,155,55s-60,135,0,185s165-15,195,45 s-75,170,0,230s210-40,245,35s-95,200,0,270s265-75,305,15s-125,235,0,315s335-125,385-15s-165,280,0,375s420-195,480-60 s-215,335,0,455s530-290,610-120s-285,410,0,555s675-430,780-210s-385,510,0,690s865-625,1010-350s-540,665,0,900s1120-940,1330-580 s-790,920,0,1260s1515-1440,1835-1030s-1230,1350,0,1890s2215-2240,2750-1840s-2015,2215,0,3090s3425-3425,4315-3015 s-3550,4200,0,6015s5670-5670,7145-5670s-5670,5670-7145,5670z"
                                    fill="#E67E22" 
                                    transform="scale(0.04)"
                                />
                            </svg>

                            <div className="map-stat-overlay stat-pos-1">
                                <div className="stat-content">
                                    <span className="stat-number-large">7.5%</span>
                                    <span className="stat-label-small">GDP Growth</span>
                                </div>
                            </div>

                            <div className="map-stat-overlay stat-pos-2">
                                <div className="stat-content">
                                    <span className="stat-number-large">80+</span>
                                    <span className="stat-label-small">Smart Cities</span>
                                </div>
                            </div>

                            <div className="map-stat-overlay stat-pos-3">
                                <div className="stat-content">
                                    <span className="stat-number-large">$80B</span>
                                    <span className="stat-label-small">FDI Inflow</span>
                                </div>
                            </div>
                        </div>

                        <div className="landscape-showcase">
                            <div className="landscape-images-grid">
                                <div className="landscape-img-box">
                                    <img src="/images/b2.jpg" alt="Highway Infrastructure" />
                                </div>
                                <div className="landscape-img-box">
                                    <img src="/images/hero_modern_cityscape.png" alt="Modern Skyscrapers" />
                                </div>
                            </div>
                            <div className="landscape-footer-bar">
                                <span className="landscape-title-text">Rising Investment Landscape</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="benefits-section-integrated section-theme" id="benefits">
                <div className="benefits-integrated-wrapper">
                    <div className="benefits-text-sidebar">
                        <h2 className="sidebar-title">Uncompromising <br /> <span className="text-highlight">Investor Safeguards</span></h2>
                        <p className="sidebar-desc">
                            A secure ecosystem where builder credentials and RERA compliance are consolidated for absolute peace of mind.
                        </p>
                    </div>

                    <div className="benefits-visual-area">
                        <div
                            id="benefits-scroll-container"
                            className="benefits-cards-row"
                            ref={benefitsScrollRef}
                            style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', width: '100%', overflow: 'visible' }}
                        >
                            {benefitsList.map((benefit, index) => (
                                <div className="benefit-card-minimal" key={index} style={{
                                    background: '#fff', padding: '2rem', borderRadius: '1rem',
                                    border: '1px solid rgba(0,0,0,0.05)', boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
                                    display: 'flex', flexDirection: 'column', gap: '1rem'
                                }}>
                                    <div className="benefit-icon-box" style={{ color: 'var(--color-accent)', width: '3rem', height: '3rem' }}>
                                        {benefit.icon}
                                    </div>
                                    <h4 className="benefit-card-title" style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>{benefit.title}</h4>
                                    <p className="benefit-card-desc" style={{ fontSize: '1rem', color: '#666', margin: 0, lineHeight: 1.5 }}>{benefit.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <section className="fullscreen-section section-white" id="process">
                <div className="container">
                    <div className="section-heading">
                        <h2 className="section-title">
                            A Seamless <br /> <span className="text-highlight">End-to-End Framework</span>
                        </h2>
                    </div>
                    <div className="section-scrollable-body mt-4">
                        <div className="dashboard-wrapper">
                            <div className="dashboard-sidebar-container mobile-scroll-hint">
                                <div className="dashboard-sidebar" id="dashboard-tabs-row">
                                    {investorSteps.map((step, index) => (
                                        <button key={index} className={`dashboard-step-btn ${activeStepIndex === index ? 'active' : ''}`} onClick={() => setActiveStepIndex(index)}>
                                            <div className="step-btn-number">0{step.id}</div>
                                            <div className="step-btn-title">{step.title}</div>
                                        </button>
                                    ))}
                                </div>
                                <div className="dashboard-tabs-nav md:hidden">
                                    <button className="tabs-nav-btn prev" onClick={() => document.getElementById('dashboard-tabs-row').scrollBy({ left: -150, behavior: 'smooth' })}>❮</button>
                                    <button className="tabs-nav-btn next" onClick={() => document.getElementById('dashboard-tabs-row').scrollBy({ left: 150, behavior: 'smooth' })}>❯</button>
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
                    <div className="section-heading">
                        <h2 className="section-title">The Foundation of <span className="text-highlight">Digital Trust</span></h2>
                    </div>
                    <div className="section-scrollable-body">
                        <div className="trust-grid-wrapper">
                            {trustFeatures.map((feature) => (
                                <div className="trust-card" key={feature.id}>
                                    <div className="trust-icon-badge">{feature.icon}</div>
                                    <div className="trust-content">
                                        <h3 className="trust-title">{feature.title}</h3>
                                        <p className="trust-desc">{feature.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <section className="team-section-integrated section-white" id="team">
                <div className="team-integrated-wrapper">
                    <div className="team-text-banner">
                        <div className="team-text-content-inner">
                            <h2 className="team-main-title">Meet the Team Behind <span className="text-highlight">Your Trust</span></h2>
                            <p className="team-main-desc">
                                <strong>Built on transparency. Driven by experience.</strong><br />
                                Investate India is led by Pankaj Gupta, Atish Agarwal, and Deepak Kavadia.
                            </p>
                            {/* <div className="team-nav-arrows-inline">
                                <button className="team-nav-btn prev"><span>❮</span></button>
                                <button className="team-nav-btn next"><span>❯</span></button>
                            </div> */}
                        </div>
                    </div>
                    <div className="team-cards-scroll-area" id="team-cards-row">
                        {teamMembers.map((member, index) => (
                            <div className="team-card-premium" key={index}>
                                <div className="team-card-image">
                                    <img src={member.image} alt={member.name} />
                                </div>
                                <div className="team-card-info">
                                    <h4 className="team-card-name">{member.name}</h4>
                                    <p className="team-card-role">{member.role}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Team navigation arrows for mobile */}
                    <div className="flex justify-center gap-4 mt-6 md:hidden">
                        <button
                            onClick={() => document.getElementById('team-cards-row').scrollBy({ left: -320, behavior: 'smooth' })}
                            className="nav-arrow-btn"
                            style={{
                                width: '3rem', height: '3rem', borderRadius: '50%',
                                border: '1.5px solid rgba(0,0,0,0.1)', background: '#fff',
                                color: '#333', fontSize: '1.1rem', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.06)'
                            }}
                        >❮</button>
                        <button
                            onClick={() => document.getElementById('team-cards-row').scrollBy({ left: 320, behavior: 'smooth' })}
                            className="nav-arrow-btn"
                            style={{
                                width: '3rem', height: '3rem', borderRadius: '50%',
                                border: '1.5px solid rgba(0,0,0,0.1)', background: '#fff',
                                color: '#333', fontSize: '1.1rem', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.06)'
                            }}
                        >❯</button>
                    </div>
                </div>
            </section>

            <section className="fullscreen-section section-theme" id="early-access">
                <div className="container">
                    <div className="section-heading">
                        <h2 className="section-title">We're Building <span className="text-highlight">Something Different</span></h2>
                    </div>
                    <div className="section-scrollable-body">
                        <div className="early-access-wrapper">
                            <div className="focus-content-side">
                                <h3 className="focus-heading">Our Current Focus</h3>
                                <div className="focus-list">
                                    {currentFocusList.map((item, index) => (
                                        <div className="focus-list-item" key={index}>
                                            <div className="focus-check">
                                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                            </div>
                                            <p className="focus-text">{item}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="cta-card-side">
                                <div className="cta-card-inner">
                                    <div className="cta-badge">Waitlist Open</div>
                                    <h3 className="cta-title">Join Our Investor Network</h3>
                                    <form onSubmit={handleNewsletterSubmit}>
                                        <div className="cta-form-group">
                                            <input type="email" required value={newsletterEmail} onChange={(e) => setNewsletterEmail(e.target.value)} className="cta-input" placeholder="Enter your email address..." />
                                            <button disabled={isSubscribing} className="btn btn-primary cta-submit-btn flex justify-center items-center gap-2" type='submit'>
                                                {isSubscribing && <Loader2 className="w-4 h-4 animate-spin" />}
                                                {isSubscribing ? 'Registering...' : 'Register Now'}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="faq-premium-section section-white" id="faq">
                <div className="container">
                    <div className="faq-premium-wrapper">
                        <div className="faq-info-column">
                            <h2 className="faq-premium-title">Frequently Asked <br /> Questions</h2>
                            <p className="faq-premium-subtitle">
                                Get clear answers to the most common questions about Investate India and how we help you invest with absolute confidence.
                            </p>
                            <div className="faq-side-image">
                                <img src="/negotiation.png" alt="Expert Support and Consultation" />
                            </div>
                        </div>
                        <div className="faq-accordion-column">
                            {faqsList.map((faq, index) => (
                                <div
                                    className={`faq-accordion-item ${activeFaq === index ? 'active' : ''}`}
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
                    </div>
                </div>
            </section>

            <section className="fullscreen-section section-theme py-24" id="contact">
                <div className="container text-center">
                    <div className="cta-minimal-badge mb-6">
                        <span className="cta-badge-text">GET STARTED TODAY</span>
                        <div className="cta-badge-star">★</div>
                    </div>
                    <h2 className="cta-minimal-title mb-6">
                        Initialize Your <span className="text-highlight">Strategic Journey</span>
                    </h2>
                    <p className="cta-minimal-subtitle text-gray-600 text-lg mb-10 max-w-2xl mx-auto">
                        Align with a platform engineered for absolute transparency and institutional excellence in Indian real estate discovery.
                    </p>
                    <div className="flex justify-center">
                        <button onClick={() => handleAuthClick('register', 'investor')} className="cta-minimal-btn">
                            Register Your Interest <span className="ml-2">→</span>
                        </button>
                    </div>
                </div>
            </section>

            <Footer />

            <LoginDialog
                isOpen={isLoginOpen}
                onOpenChange={setIsLoginOpen}
                onSwitchToRegister={handleSwitchToRegister}
                initialData={dialogData}
            />
            <RegisterDialog
                isOpen={isRegisterOpen}
                onOpenChange={setIsRegisterOpen}
                onLoginClick={() => { setIsRegisterOpen(false); setIsLoginOpen(true); }}
                initialData={dialogData}
            />
        </div>
    );
}
