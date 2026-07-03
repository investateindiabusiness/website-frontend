"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AwardsSection from '@/components/AwardsSection';
import TestimonialsSection from '@/components/TestimonialsSection';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import AdBanner from '@/components/AdBanner';


import { toast } from '@/hooks/use-toast';
import { subscribeToNewsletter } from '@/api';
import { Loader2, Search, Users, FileText, Gavel, ShieldCheck, Globe } from 'lucide-react';

const heroSlides = [
    {
        image: '/images/hero_indian_luxury.png',
        tag: 'India\'s Most Trusted NRI Platform',
        title: 'You Built Your Future Abroad.',
        highlight: 'We Protect & Grow Your Wealth in India.',
        subtitle: "We don't just help NRIs invest in India. We help them protect, manage, and grow their wealth with absolute confidence."
    },
    {
        image: '/images/hero_modern_cityscape.png',
        tag: 'End-to-End NRI Wealth Management',
        title: 'Beyond Investment —',
        highlight: 'Complete NRI Asset Protection',
        subtitle: 'From real estate investment to legal support, rental management, tax planning and succession advisory — all in one trusted ecosystem.'
    },
    {
        image: '/images/hero_indian_luxury.png',
        tag: 'Institutional Standards',
        title: 'Bridging Global NRIs to',
        highlight: 'Verified Indian Real Estate',
        subtitle: 'Institutional-grade transparency, verified developer credentials, and professional on-ground representation for the global Indian diaspora.'
    }
];

const contentDataForSection2 = [
    {
        id: "01",
        title: "Investment Opportunities",
        text: "Curated, pre-verified real estate projects with standardized RERA disclosures and performance tracking — so you invest based on merit, not marketing.",
        image: "/images/media1.png"
    },
    {
        id: "02",
        title: "Asset Protection",
        text: "Remote monitoring of your properties against illegal occupation, encroachment, forged documents, and misuse of Power of Attorney.",
        image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=1000&auto=format&fit=crop"
    },
    {
        id: "03",
        title: "Legal & Tax Advisory",
        text: "A trusted network of legal partners and tax advisors helping you navigate FEMA, TDS, DTAA, capital gains, and property disputes from abroad.",
        image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1000&auto=format&fit=crop"
    },
    // {
    //     id: "04",
    //     title: "Rental & Estate Management",
    //     text: "End-to-end rental income management, tenant vetting, maintenance coordination, and succession planning — protecting your wealth across generations.",
    //     image: "https://images.unsplash.com/photo-1560520653-9e0e4c89df11?q=80&w=1000&auto=format&fit=crop"
    // }
];

const challengesList = [
    {
        id: "01",
        text: "Currency Devaluation",
        desc: "Exchange rate fluctuations reduce the effective value of Indian investments and impact returns when funds are repatriated.",
        opportunity: "Diversified investment guidance, long-term wealth planning & portfolio monitoring.",
        icon: <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
    },
    {
        id: "02",
        text: "Returns on Investment",
        desc: "Underperforming assets, vacancy periods, poor property management and delayed project completion erode NRI returns.",
        opportunity: "Curated investment opportunities, performance tracking & market intelligence.",
        icon: <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="20" x2="12" y2="10"></line><line x1="18" y1="20" x2="18" y2="4"></line><line x1="6" y1="20" x2="6" y2="16"></line></svg>
    },
    {
        id: "03",
        text: "Asset Safety & Protection",
        desc: "Illegal occupation, land encroachment, forged documents, misuse of Power of Attorney and unauthorized transactions.",
        opportunity: "Asset monitoring, documentation management, property verification & trusted local network.",
        icon: <ShieldCheck className="w-8 h-8 text-white" />
    },
    {
        id: "04",
        text: "Legal System Challenges",
        desc: "Property disputes, civil litigation, fraudulent claims and delayed court proceedings are hard to manage from abroad.",
        opportunity: "Legal advisory network, documentation support, case coordination & trusted legal partners.",
        icon: <Gavel className="w-8 h-8 text-white" />
    },
    {
        id: "05",
        text: "Rental Income Management",
        desc: "Non-paying tenants, long vacancy periods, property damage, delayed evictions and unauthorized subletting.",
        opportunity: "Tenant management, rental monitoring, collection support & property inspections.",
        icon: <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
    },
    {
        id: "06",
        text: "Tax Planning & Compliance",
        desc: "Income tax compliance, capital gains taxation, TDS deductions, DTAA regulations and repatriation procedures across multiple frameworks.",
        opportunity: "Tax consultation, compliance support & investment structuring.",
        icon: <FileText className="w-8 h-8 text-white" />
    },
    {
        id: "07",
        text: "Inheritance & Succession",
        desc: "Multiple heir disputes, probate delays, unregistered wills, partition claims and asset transfer complications across generations.",
        opportunity: "Estate planning support, succession advisory & documentation assistance.",
        icon: <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
    },
    {
        id: "08",
        text: "Repairs & Maintenance",
        desc: "Contractor overcharging, incomplete work, lack of supervision, maintenance delays and society management issues without on-ground presence.",
        opportunity: "Verified service providers, maintenance monitoring, periodic inspections & digital reporting.",
        icon: <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path></svg>
    }
];



const benefitsList = [
    { title: "Pre-Verified Builders", desc: "Rigorous credibility assessments before any developer is listed.", icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg> },
    { title: "Standardized Disclosures", desc: "RERA details, approvals, and timelines in one consistent format.", icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg> },
    { title: "Transparent Progress", desc: "Real-time construction updates and payment plan clarity.", icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg> },
    { title: "Expert Guidance", desc: "On-ground support to navigate documentation and legal requirements.", icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg> },
    { title: "Commercial Terms", desc: "Negotiating best-in-market pricing directly with developers.", icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><polyline points="17 11 19 13 23 9"></polyline></svg> },
    { title: "Investor Safeguards", desc: "Structured risk mitigation designed to protect your interests.", icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg> },
    { title: "Inventory Tracking", desc: "Transparent inventory monitoring and fund flow oversight.", icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="20" x2="12" y2="10"></line><line x1="18" y1="20" x2="18" y2="4"></line><line x1="6" y1="20" x2="6" y2="16"></line></svg> },
    { title: "Exit Strategy", desc: "Support for secondary market placement and resale planning.", icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 22L14 18L10 14"></path><path d="M18 10L22 6L18 2"></path><path d="M22 6H12C9.79086 6 8 7.79086 8 10V22"></path></svg> }
];

const investorSteps = [
    { id: "1", title: "Register", text: "Share your preferences. A dedicated Relationship Manager will be assigned to guide your journey." },
    { id: "2", title: "Discover", text: "Browse pre-verified builders with complete disclosures and RERA-verified timelines." },
    { id: "3", title: "Evaluate", text: "Receive expert support to vet documentation and identify profitable opportunities." },
    { id: "4", title: "Decide", text: "Make informed decisions with full transparency and ongoing on-ground support." }
];

const stepImages = [
    "/images/register_optimized.jpg",   /* Step 1 (Register) */
    "/images/process_discovery.png",    /* Step 2 (Discover) */
    "/images/image_optimized.jpg",      /* Step 3 (Evaluate) */
    "/images/image3.png"                /* Step 4 (Decide) */
];

const teamMembers = [
    { name: "Deepak Kavadia", role: "CEO & Founder", image: "/deepak.png" },
    { name: "Pankaj Gupta", role: "Co-Founder", image: "/pankaj.png" },
    { name: "Atish Agarwal", role: "Co-Founder", image: "/atish.png" }
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


export default function Index() {
    const router = useRouter();
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
    const [benefitsPage, setBenefitsPage] = useState(0);
    const benefitsPerPage = 4;
    const totalBenefitsPages = Math.ceil(benefitsList.length / benefitsPerPage);

    const nextBenefits = () => {
        setBenefitsPage((prev) => (prev + 1) % totalBenefitsPages);
    };

    const prevBenefits = () => {
        setBenefitsPage((prev) => (prev - 1 + totalBenefitsPages) % totalBenefitsPages);
    };
    const [hoveredCard, setHoveredCard] = useState(null);



    const [newsletterEmail, setNewsletterEmail] = useState('');
    const [isSubscribing, setIsSubscribing] = useState(false);



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

    const activeStepData = investorSteps[activeStepIndex];

    const handleAuthClick = (action, role) => {
        if (action === 'login') {
            router.push(role === 'builder' ? '/builder/login' : '/investor/login');
        } else {
            router.push(role === 'builder' ? '/builder/register' : '/investor/register');
        }
    };

    return (
        <div className="theme-investor w-full bg-[var(--color-light-bg)] overflow-x-hidden">
            <Header transparent={true} onAuthClick={handleAuthClick} />

            <section
                className="fullscreen-section hero-section"
                onMouseEnter={() => setIsHeroPaused(true)}
                onMouseLeave={() => setIsHeroPaused(false)}
            >
                <AnimatePresence mode="sync">
                    <picture key={heroIndex} className="absolute inset-0 w-full h-full z-0">
                        <source media="(max-width: 768px)" srcSet={heroSlides[heroIndex].image.replace('.png', '_mobile.jpg')} />
                        <motion.img
                            src={heroSlides[heroIndex].image}
                            alt="Hero background"
                            className="absolute inset-0 w-full h-full object-cover z-0 hero-split-image"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 1.2, ease: 'easeInOut' }}
                            loading="eager"
                            fetchPriority="high"
                        />
                    </picture>
                </AnimatePresence>
                <div className="absolute inset-0 z-[1] hero-split-overlay" />

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

            {/* Zone 5 — Landing Page Hero Spotlight Ad */}
            <div className="w-full flex justify-center bg-[var(--color-light-bg)] pt-8 pb-4">
               <div className="container mx-auto px-4 max-w-5xl">
                 <AdBanner zoneId="zone5" variant="spotlight" />
               </div>
            </div>



            <section className="fullscreen-section section-light" id="about">
                <div className="container">
                    <div className="section-heading">
                        <h2 className="section-title">Our <span className='text-highlight'>End-to-End Platform</span></h2>
                        <p className="section-subtitle">Beyond investment discovery — a comprehensive ecosystem protecting, managing and growing your Indian wealth from wherever you are in the world.</p>
                    </div>

                    <div className="horizontal-accordion-container">
                        {contentDataForSection2.map((item, index) => (
                            <div
                                key={index}
                                className="accordion-card"
                            >
                                <div className="accordion-card-bg">
                                    <img src={item.image} alt={item.title} loading="lazy" decoding="async" />
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

            {/* ── NRI Challenges Marquee Section ── */}
            <section id="challenges" className="infra-section py-20 bg-[#f8f8f8]">
                <div className="infra-section-header">
                    <h2 className="infra-title text-[#1a1a1a]">
                        Real Challenges <span className="infra-title-accent text-[#D48035]">Faced by NRIs</span>
                    </h2>
                </div>

                <p className="infra-subtitle text-slate-600">
                    Distance creates far more than an investment gap. NRIs face complex legal, financial, operational and safety challenges in protecting their Indian assets. We address every one of them.
                </p>

                {/* ── Infinite Marquee ── */}
                <div className="infra-marquee-wrapper">
                    <div className="infra-marquee-track">
                        {[...challengesList, ...challengesList].map((challenge, i) => (
                            <div key={i} className="infra-marquee-card">
                                <div className="infra-card-icon-wrapper">
                                    {challenge.icon}
                                </div>
                                <h3 className="infra-card-title">{challenge.text}</h3>
                                <p className="infra-card-desc">{challenge.desc}</p>
                                {challenge.opportunity && (
                                    <p style={{ fontSize: '0.78rem', color: '#C88A58', marginTop: '0.6rem', fontWeight: 600, lineHeight: 1.4 }}>
                                        ✦ {challenge.opportunity}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>



            <section className="fullscreen-section section-light" id="benefits" style={{ paddingTop: '60px', paddingBottom: '60px', overflow: 'hidden' }}>
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
                                    | Investor Safeguards
                                </div> */}
                                <h2 className="responsive-heading text-[#111] mb-6">
                                    Uncompromising <br />
                                    <span className="text-[#D48035]">Investor Safeguards</span>
                                </h2>
                                <p className="responsive-paragraph text-[#555] mb-10">
                                    A secure ecosystem where builder credentials and RERA compliance are consolidated for absolute peace of mind. We eliminate the distance gap through rigorous verification.
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
                                            {benefitsList.slice(benefitsPage * benefitsPerPage, (benefitsPage + 1) * benefitsPerPage).map((benefit, index) => (
                                                <div key={index} className="border-l-4 border-[#D48035] pl-5">
                                                    <h4 className="text-[1.2rem] font-bold text-[#111] mb-2">
                                                        {benefit.title}
                                                    </h4>
                                                    <p className="text-[1.05rem] text-[#666] leading-[1.6]">
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
                            <div className="w-[85%] h-[85%] rounded-[1.5rem] overflow-hidden relative -translate-x-[10%] shadow-[0_20px_40px_rgba(0,0,0,0.1)]">
                                <Image
                                    src="/images/image_optimized.jpg"
                                    alt="Global NRI Reach Map"
                                    width={800}
                                    height={600}
                                    className="w-full h-full object-cover"
                                    loading="lazy"
                                />
                            </div>
                            {/* Overlapping Image (Small) */}
                            <div className="absolute right-0 bottom-[5%] w-[65%] h-[55%] rounded-[1.5rem] border-[12px] border-white overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.15)] z-10">
                                <Image
                                    src="/images/imagecopy_optimized.jpg"
                                    alt="Secure Premium Real Estate Asset"
                                    width={800}
                                    height={600}
                                    className="w-full h-full object-cover"
                                    loading="lazy"
                                />
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>
            <AwardsSection />

            <section className="fullscreen-section section-theme" id="process">
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
                                        <img src={stepImages[activeStepIndex]} alt={`Step ${activeStepData.id}`} loading="lazy" decoding="async" />
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

            <TestimonialsSection />

            <section
                className="fullscreen-section section-light relative overflow-hidden"
                id="trust"
            >
                {/* Lazy-loaded optimized absolute background image */}
                <div className="absolute inset-0 z-0">
                    <img
                        src="/images/image2_optimized.jpg"
                        alt="Digital Trust Background"
                        className="w-full h-full object-cover"
                        loading="lazy"
                        width={1200}
                        height={800}
                    />
                    <div className="absolute inset-0 bg-black/40" />
                </div>

                <div className="container relative z-[2]">
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

            <section className="team-section-integrated section-theme" id="team">
                <div className="team-integrated-wrapper">
                    <div className="team-text-banner">
                        <div className="team-text-content-inner">
                            <h2 className="team-main-title">Meet the Team Behind <span className="text-highlight">Your Trust</span></h2>
                            <p className="team-main-desc">
                                <strong>Built on transparency. Driven by experience.</strong><br />
                                Investate India is led by Deepak Kavadia, Pankaj Gupta, and Atish Agarwal.
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
                                    <img src={member.image} alt={member.name} loading="lazy" decoding="async" />
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


            <section className="fullscreen-section section-light" id="early-access">
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

            <section className="faq-premium-section section-theme" id="faq">
                <div className="container">
                    <div className="faq-header-full text-center mb-16">
                        <h2 className="faq-premium-title">Frequently Asked <span className="text-highlight">Questions</span></h2>
                        <p className="faq-premium-subtitle mx-auto">
                            Get clear answers to the most common questions about Investate India and how we help you invest with absolute confidence.
                        </p>
                    </div>
                    <div className="faq-premium-grid">
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
                        <div className="faq-image-column">
                            <div className="faq-side-image-premium">
                                <img
                                    src="/images/hero_modern_cityscape_mobile.jpg"
                                    alt="Modern Indian Cityscape"
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

            <section className="fullscreen-section py-20 text-white text-center" id="contact" style={{ backgroundColor: '#1a1a1a' }}>
                <div className="container text-center">
                    <div className="cta-minimal-badge mb-6" style={{ borderColor: 'rgba(255,255,255,0.2)' }}>
                        <span className="cta-badge-text text-white">GET STARTED TODAY</span>
                        <div className="cta-badge-star text-[#D48035]">★</div>
                    </div>
                    <h2 className="cta-minimal-title mb-6 text-white">
                        Initialize Your <span className="text-[#D48035]">Strategic Journey</span>
                    </h2>
                    <p className="cta-minimal-subtitle text-slate-300 text-lg mb-10 max-w-2xl mx-auto">
                        Align with a platform engineered for absolute transparency and institutional excellence in Indian real estate discovery.
                    </p>
                    <div className="flex justify-center">
                        <button onClick={() => handleAuthClick('register', 'investor')} className="cta-minimal-btn bg-[#D48035] hover:bg-[#b06725] text-white border-none shadow-xl">
                            Register Your Interest <span className="ml-2">→</span>
                        </button>
                    </div>
                </div>
            </section>

            {/* 
            <section className="fullscreen-section section-light py-20 border-t border-gray-100" id="nri-guide">
                <div className="container max-w-4xl mx-auto">
                    <div className="section-heading text-center mb-12">
                        <h2 className="section-title text-3xl font-bold text-gray-900">
                            Comprehensive Guide to <span className="text-highlight">NRI Real Estate Investment in India</span>
                        </h2>
                        <p className="section-subtitle text-gray-600 mt-4">
                            Crucial insights, regulatory frameworks, and key considerations for global Indians investing in Indian property.
                        </p>
                    </div>

                    <div className="prose prose-lg text-gray-700 space-y-8 leading-relaxed text-left">
                        <div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-3">Understanding the FEMA Framework for NRI Investments</h3>
                            <p>
                                Under the Foreign Exchange Management Act (FEMA), Non-Resident Indians (NRIs) and Persons of Indian Origin (PIOs) have general permission from the Reserve Bank of India (RBI) to acquire residential and commercial properties in India. There is no limit on the number of residential or commercial properties an NRI can own. However, purchasing agricultural land, plantation property, or farmhouse land is generally restricted unless specific permission is obtained from the authorities.
                            </p>
                        </div>

                        <div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-3">The Crucial Role of RERA (Real Estate Regulatory Authority)</h3>
                            <p>
                                The introduction of the Real Estate (Regulation and Development) Act, 2016 (RERA) has revolutionized the Indian property market, bringing unprecedented transparency and accountability. Every project listed on Investate India is cross-referenced with state RERA registries to verify project completion timelines, financial escrow compliance, builder credentials, and sanction plans. This helps eliminate the historical risk of project delays and builder defaults.
                            </p>
                        </div>

                        <div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-3">Tax Implications: TDS, Capital Gains, and Repatriation</h3>
                            <p>
                                When purchasing a property, NRIs should be aware of Tax Deducted at Source (TDS) regulations. For secondary market transactions, the buyer must deduct TDS at the rate of 20% (plus applicable surcharges) for long-term capital gains, or 30% for short-term capital gains, unless a lower tax deduction certificate is obtained by the seller. Repatriation of sales proceeds is permitted up to USD 1 million per financial year out of NRO accounts, subject to documentation and payment of applicable taxes.
                            </p>
                        </div>

                        <div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-3">Key Growth Metros for NRI Property Investment</h3>
                            <p>
                                India's primary metropolitan areas continue to drive high capital appreciation and rental yields:
                            </p>
                            <ul className="list-disc pl-6 space-y-2 mt-2">
                                <li><strong>Bangalore (Bengaluru):</strong> The Silicon Valley of India, known for robust IT/ITeS sector growth, premium tech parks, and high demand for luxury villa communities and micro-markets like Whitefield and Sarjapur.</li>
                                <li><strong>Hyderabad:</strong> Featuring state-of-the-art infrastructure, rapid growth in the IT corridor (Gachibowli, HITEC City), and highly competitive pricing per square foot compared to other Tier-1 cities.</li>
                                <li><strong>Mumbai Metropolitan Region (MMR):</strong> The financial capital, commanding premium valuations and offering high rental yields, especially in redevelopment projects and new trans-harbor link corridors.</li>
                                <li><strong>Delhi-NCR (Gurgaon & Noida):</strong> Commercial hubs with premium residential skyscrapers, expressways, and high-end lifestyle amenities preferred by the diaspora.</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>
            */}


            <Footer />

        </div>
    );
}
