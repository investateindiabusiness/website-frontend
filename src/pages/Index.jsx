import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import RegisterDialog from '../components/RegisterDialog';
import LoginDialog from '../components/LoginDialog';

const Index = () => {

    const [activeProcessTab, setActiveProcessTab] = useState('investors');
    const [activeStepIndex, setActiveStepIndex] = useState(0);
    const [activeFaq, setActiveFaq] = useState(null);
    const [activeCardIndex, setActiveCardIndex] = useState(0);
    const [activeCtaTab, setActiveCtaTab] = useState('investors');

    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [isRegisterOpen, setIsRegisterOpen] = useState(false);
    const [hasAutoOpened, setHasAutoOpened] = useState(false);
    const [registerInitialData, setRegisterInitialData] = useState({});

    const openLogin = () => {
        setIsRegisterOpen(false);
        setTimeout(() => setIsLoginOpen(true), 150);
    };

    const openRegister = (data = {}) => {
        setRegisterInitialData(data);
        setIsLoginOpen(false);
        setTimeout(() => setIsRegisterOpen(true), 150);
    };

    useEffect(() => {
        const handleScroll = () => {
            if (!hasAutoOpened && window.scrollY > 600) {
                setIsLoginOpen(true); // Open Login instead of Register
                setHasAutoOpened(true);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [hasAutoOpened]);

    const toggleFaq = (index) => {
        // If clicking the already open FAQ, close it. Otherwise, open the new one.
        setActiveFaq(activeFaq === index ? null : index);
    };

    const contentDataForSection2 = [
        {
            id: "01",
            title: "The Platform",
            text: "Investate India is not a traditional property listing portal. We are a structured discovery and facilitation platform built specifically for Non-Resident Indians who want better visibility and a dependable process."
        },
        {
            id: "02",
            title: "The Standard",
            text: "Unlike traditional portals where anyone can list anything, we pre-screen builders and mandate standardized disclosures including RERA compliance, financial health indicators, and timeline transparency."
        },
        {
            id: "03",
            title: "The Focus",
            text: "Our platform focuses on presenting standardized, builder-declared information in a clean manner, allowing investors to understand projects on merit rather than marketing noise."
        }
    ];

    const challengesList = [
        { id: "01", text: "Unverified or inconsistent project information" },
        { id: "02", text: "Difficulty assessing builder credibility from abroad" },
        { id: "03", text: "Lack of standardized disclosures across projects" },
        { id: "04", text: "Unclear legal, regulatory, and compliance processes" },
        { id: "05", text: "Dependence on fragmented intermediaries" },
        { id: "06", text: "Time zone barriers and lack of on-ground representation" },
        { id: "07", text: "Difficulty conducting accurate, independent on-site property valuations" },
        { id: "08", text: "Complexities with cross-border taxation, capital repatriation, and FEMA compliance" },
        { id: "09", text: "Concerns over the security of funds and protection against misappropriation" }
    ];

    const benefitsList = [
        { title: "Pre-Verified Builders Only", desc: "Every developer undergoes our credibility assessment before being listed on the platform." },
        { title: "Standardized Project Information", desc: "RERA details, approvals, timelines, and builder track record presented in one consistent format." },
        { title: "Transparent Disclosures", desc: "Clear information on legal status, payment plans, construction progress, and potential project risks." },
        { title: "Expert Guidance", desc: "Support in understanding projects, documentation requirements, and next steps throughout your journey." },
        { title: "Negotiation", desc: "Negotiating the best commercial terms and pricing directly with the builders on your behalf." },
        { title: "Enhanced Safety Mechanisom with security for Investors", desc: "Structured safeguards, risk-mitigation processes, and compliance checks designed to protect investor interests at every stage." },
        { title: "Fund Management & Inventory tracking", desc: "Transparent fund flow monitoring and real-time inventory tracking to ensure accountability and informed decision-making." },
        { title: "Assitance in Resale & Exit", desc: "Strategic support for resale, secondary market placement, and structured exit planning to maximize returns." },
        { title: "Legal", desc: "Comprehensive legal assistance including document review, agreement vetting, compliance checks, and transaction support." },
    ];

    const builderBenefits = [
        { title: "Qualified NRI Leads", desc: "Access to investors who've already shown serious interest and buying intent, not casual browsers." },
        { title: "Professional Project Presentation", desc: "Your projects showcased in standardized, credible formats that build investor confidence." },
        { title: "No Junk Inquiries", desc: "We pre-screen investors to ensure you're connecting with genuine buyers, saving your team valuable time." },
        { title: "Long-Term Relationships", desc: "Connect with investors looking for credible partners, not just one-time deals or speculative inquiries." },
        { title: "Enhanced Credibility", desc: "Association with a transparency-focused platform strengthens your brand trust among global investors." },
        { title: "Dedicated Support", desc: "We handle coordination, follow-ups, and investor queries, allowing you to focus on what you do best." },
        { title: "Time-Zone Challenges Solved", desc: "Overcome communication delays and coordination challenges due to international time zones." },
        { title: "Creating brand image & presence in international market", desc: "Strengthen your visibility and reputation in international markets, expanding your reach among NRI and overseas investors." }
    ];

    const investorSteps = [
        { id: "1", title: "Register", text: "Share your investment preferences, budget range, and location interests through our simple online form & one Relationship Manager will be assigned to you to take you through entire journey." },
        { id: "2", title: "Discover", text: "Browse pre-verified builders and projects with complete disclosures, RERA details, and transparent timelines." },
        { id: "3", title: "Evaluate", text: "Get expert support to understand projects, documentation requirements, and legal considerations & Evaluate best suitable investment & profitable oppotunities" },
        { id: "4", title: "Connect", text: "We facilitate direct introductions with builders and coordinate meetings, site visits, or virtual tours." },
        { id: "5", title: "Decide", text: "Make informed decisions with complete transparency and ongoing support throughout the process." }
    ];

    const builderSteps = [
        { id: "1", title: "Apply", text: "Submit your company profile, past projects, and current development details through our structured application." },
        { id: "2", title: "Get Verified", text: "Our team reviews your credentials, track record, and compliance status to ensure quality standards." },
        { id: "3", title: "Go Live", text: "Your approved projects are professionally presented to our growing NRI investor network in a standardized format." },
        { id: "4", title: "Engage", text: "We coordinate with serious, pre-qualified investors and manage initial inquiries on your behalf." },
        { id: "5", title: "Close Deals", text: "Build lasting relationships with investors based on transparent terms and mutual trust." }
    ];

    const currentSteps = activeProcessTab === 'investors' ? investorSteps : builderSteps;
    const activeStepData = currentSteps[activeStepIndex];

    const stepImages = [
        "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=1000&auto=format&fit=crop", // Step 1
        "https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1000&auto=format&fit=crop", // Step 2
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1000&auto=format&fit=crop", // Step 3
        "https://images.unsplash.com/photo-1573164713988-8665fc963095?q=80&w=1000&auto=format&fit=crop", // Step 4
        "https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=1000&auto=format&fit=crop"  // Step 5
    ];

    const teamMembers = [
        { 
            name: "[Founder Name 1]", 
            role: "Co-Founder", 
            exp: "[X] Years Experience", 
            image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=800&auto=format&fit=crop",
            linkedin: "#"
        },
        { 
            name: "[Founder Name 2]", 
            role: "Co-Founder", 
            exp: "[X] Years Experience", 
            image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&auto=format&fit=crop",
            linkedin: "#"
        }
    ];

    const faqsList = [
        {
            question: "Is Investate India a broker or agent?",
            answer: "No. We are a discovery and facilitation platform, not a traditional broker. Our role is to provide structured information, verify builder credentials, and facilitate transparent connections."
        },
        {
            question: "Do you charge investors any fees?",
            answer: "Currently, registration and access to our platform is free for NRI investors. We believe in transparency from the start. We will be introducing service fees in the future and you'll be informed well in advance."
        },
        {
            question: "How do you verify builders?",
            answer: "We conduct a multi-step verification process including: checking RERA registration and compliance status, reviewing past project track records and completion timelines, assessing financial stability and legal standing, and evaluating customer feedback and reputation in the market."
        },
        {
            question: "What locations/cities do you cover?",
            answer: "We are initially focusing on major metro cities including Bangalore, Mumbai, Delhi-NCR, and Hyderabad. We plan to expand to Tier-2 cities based on demand and builder quality."
        },
        {
            question: "Can I visit properties through you?",
            answer: "Yes. We can coordinate site visits, arrange virtual tours, and provide on-ground support through our network. We understand the challenges of evaluating properties from abroad and work to make the process as seamless as possible."
        },
        {
            question: "How is this different from any existing marketplace?",
            answer: "Unlike general listing portals, we are specifically designed for NRIs with a focus on verification and transparency. Every builder is pre-screened, all information is standardized and includes mandatory disclosures, and we provide dedicated support throughout your journey. We prioritize quality over quantity."
        },
        {
            question: "How do I stay updated?",
            answer: "Register your interest on our website, and we'll keep you informed about new projects, builder partnerships, and platform updates via email. You can also follow us on [LinkedIn/Social Media] for industry insights and company news."
        }
    ];

    const trustFeatures = [
        { 
            id: "secure",
            title: "Secure Data Handling", 
            desc: "Your personal and financial information is protected with industry-standard security protocols.",
            icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
            )
        },
        { 
            id: "disclosure",
            title: "Mandatory Disclosures", 
            desc: "Builders must provide complete information including approvals, timelines, and financial status.",
            icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                    <line x1="16" y1="13" x2="8" y2="13"></line>
                    <line x1="16" y1="17" x2="8" y2="17"></line>
                    <polyline points="10 9 9 9 8 9"></polyline>
                </svg>
            )
        },
        { 
            id: "network",
            title: "Curated Builder Network", 
            desc: "We work only with developers who meet our strict credibility and transparency standards.",
            icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="8" r="7"></circle>
                    <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline>
                </svg>
            )
        },
        { 
            id: "support",
            title: "NRI-Focused Support Team", 
            desc: "Dedicated professionals who understand the unique challenges of investing from abroad.",
            icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="2" y1="12" x2="22" y2="12"></line>
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                </svg>
            )
        }
    ];

    const currentFocusList = [
        "Onboarding select builders in key metro cities (Bangalore, Mumbai, Pune, Delhi-NCR, Hyderabad etc.)",
        "Building our NRI investor community across USA, UK, UAE and across the globe."
    ];

    return (
        <>
            <div className="w-full bg-white overflow-x-hidden">
                <Header transparent={true} /> {/* Transparent Header for Dark Hero */}

                {/* --- SECTION 1: HERO (Dark, 100vh) --- */}
                <section className="fullscreen-section hero-section">
                    <div className="container">
                        <div className="hero-content">
                            <span className="hero-tag">Investate India</span>
                            <h1 className="hero-headline">
                                Your Trusted Bridge to Transparent <br />
                                <span className="text-accent"> Indian Real Estate Investments</span>
                            </h1>
                            <p className="hero-subheadline">
                                Helping NRI investors discover credible Indian real estate opportunities through standardized information, verified builders, and transparent disclosures.
                            </p>
                            <div className="hero-cta-group">
                                {/* UPDATE: You can also hook these buttons up to open the dialog manually */}
                                <button onClick={() => setIsRegisterOpen(true)} className="btn btn-primary">
                                    Explore Opportunities
                                </button>
                                <a href="#properties" className="btn btn-secondary">Become a Partner</a>
                            </div>
                        </div>
                    </div>
                </section>

                {/* --- SECTION 2: WHY CHOOSE US (Light, 100vh) --- */}
                <section className="fullscreen-section section-light" id="about">
                    <div className="container">
                        <div className="section-heading">
                            <h2 className="section-title">What Is <span className='text-highlight'>Investate India?</span></h2>
                            <p className="section-subtitle">A specialized platform designed to simplify property investments and bring complete transparency and peace of mind to Non-Resident Indians.</p>
                        </div>

                        <div className="cards-grid-3">
                            {contentDataForSection2.map((item, index) => {
                                const isOpen = activeCardIndex === index;
                                
                                return (
                                    <div 
                                        key={index} 
                                        className={`info-card ${isOpen ? 'open' : ''}`}
                                        onClick={() => setActiveCardIndex(index)}
                                    >
                                        <div className="card-header-wrapper">
                                            <div className="card-header-left">
                                                <div className="card-number">{item.id}</div>
                                                <h3 className="card-title">{item.title}</h3>
                                            </div>
                                            {/* Mobile-only chevron icon */}
                                            <div className="mobile-toggle-icon">
                                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <polyline points="6 9 12 15 18 9"></polyline>
                                                </svg>
                                            </div>
                                        </div>
                                        
                                        {/* Smooth Accordion Body */}
                                        <div className="card-text-wrapper">
                                            <div className="card-text-inner">
                                                <p className="card-text">{item.text}</p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>

                {/* --- SECTION 3: CHALLENGES (White, 100vh) --- */}
                <section className="fullscreen-section section-white" id="challenges">
                    <div className="container">
                        <div className="section-heading">
                            <h2 className="section-title">
                                Why Indian Real Estate Feels <br /> <span className='text-highlight'>Difficult for NRIs</span>
                            </h2>
                            <p className="section-subtitle">
                                For NRIs, investing in Indian real estate often comes with uncertainty. Distance, information overload, and lack of on-ground visibility make it difficult to differentiate credible opportunities from risky ones.
                            </p>
                        </div>

                        <div className="challenges-grid">
                            {challengesList.map((challenge, index) => (
                                <div className="challenge-item" key={index}>
                                    <div className="challenge-icon">{challenge.id}</div>
                                    <p className="challenge-text">{challenge.text}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* --- SECTION 4: BENEFITS (Light, 100vh) --- */}
                <section className="fullscreen-section section-light" id="benefits">
                    <div className="container">

                        {/* 1. FIXED HEADER */}
                        <div className="section-heading">
                            <h2 className="section-title">What You Get as an <span className='text-highlight'> Investate Investor</span></h2>
                            <p className="section-subtitle">Imagine having all builder credentials, RERA approvals, and payment terms in one place—no hunting across emails, no contradictory information. That's what we provide.</p>
                        </div>

                        {/* 2. SCROLLABLE BODY */}
                        <div className="section-scrollable-body">
                            <div className="benefits-wrapper">

                                {/* Left Image (Vertical & Sticky) */}
                                <div className="benefits-image-clean">
                                    <img
                                        src="https://images.unsplash.com/photo-1519501025264-65ba15a82390?q=80&w=2064&auto=format&fit=crop"
                                        alt="Benefits Illustration"
                                    />
                                </div>

                                {/* Right List (Scrollable) */}
                                <div className="benefits-list-clean">
                                    {benefitsList.map((benefit, index) => (
                                        <div className="benefit-row" key={index}>
                                            <div className="check-mark">✓</div>
                                            <div className="benefit-content">
                                                <h4 className='text-highlight'>{benefit.title}</h4>
                                                <p>{benefit.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                            </div>
                        </div>

                    </div>
                </section>

                <section className="fullscreen-section section-white" id="builders">
                    <div className="container">

                        {/* 1. FIXED HEADER */}
                        <div className="section-heading">
                            <h2 className="section-title">
                                A Serious Platform for <span className="text-highlight">Serious Developers</span>
                            </h2>
                            <p className="section-subtitle">
                                For developers, reaching genuine NRI buyers often requires more than marketing spend. It requires credibility, structured presentation, and access to investors who are actively evaluating opportunities.
                            </p>
                        </div>

                        {/* 2. SCROLLABLE BODY */}
                        <div className="section-scrollable-body">
                            <div className="builders-wrapper">

                                {/* Left Side: Long List (Will Scroll) */}
                                <div className="builders-list-container">
                                    {builderBenefits.map((benefit, i) => (
                                        <div className="builder-row" key={i}>
                                            <div className="builder-check">
                                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                                    <polyline points="20 6 9 17 4 12"></polyline>
                                                </svg>
                                            </div>
                                            <div className="builder-benefit-content">
                                                <span className="builder-title-inline">{benefit.title}: </span>
                                                <span className="builder-desc-inline">{benefit.desc}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Right Side: Visual & Closing Box (Sticky Position) */}
                                <div className="builders-visual-side">
                                    <div className="builders-image-clean">
                                        <img
                                            src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=1000&auto=format&fit=crop"
                                            alt="Modern Architecture Construction"
                                        />
                                    </div>
                                    <div className="builders-closing-box">
                                        <p>We work with builders who value transparency, disclosures, and long-term brand trust over short-term visibility or volume-based marketing.</p>
                                    </div>
                                </div>

                            </div>
                        </div>

                    </div>
                </section>

                {/* --- SECTION 6: THE PROCESS (Premium Dashboard Split-View) --- */}
                <section className="fullscreen-section section-light" id="process">
                    <div className="container">

                        {/* 1. FIXED HEADER */}
                        <div className="section-heading">
                            <h2 className="section-title">
                                From Discovery to Documentation — <span className="text-highlight">We're With You</span>
                            </h2>
                            <p className="section-subtitle">
                                Whether you are an NRI looking to invest or a builder looking to connect with genuine buyers, our structured process ensures transparency and efficiency.
                            </p>
                        </div>

                        {/* 2. THE TAB TOGGLE (Moved OUTSIDE the sidebar to fix mobile!) */}
                        <div className="process-tabs-container">
                            <div className="process-tabs">
                                <button
                                    className={`process-tab ${activeProcessTab === 'investors' ? 'active' : ''}`}
                                    onClick={() => { setActiveProcessTab('investors'); setActiveStepIndex(0); }}
                                >
                                    For Investors
                                </button>
                                <button
                                    className={`process-tab ${activeProcessTab === 'builders' ? 'active' : ''}`}
                                    onClick={() => { setActiveProcessTab('builders'); setActiveStepIndex(0); }}
                                >
                                    For Builders
                                </button>
                            </div>
                        </div>

                        {/* 3. DASHBOARD INTERFACE */}
                        <div className="section-scrollable-body">
                            <div className="dashboard-wrapper fade-in" key={activeProcessTab}>

                                {/* Left Side: Horizontal Swipe Menu on Mobile */}
                                <div className="dashboard-sidebar">
                                    {currentSteps.map((step, index) => (
                                        <button
                                            key={index}
                                            className={`dashboard-step-btn ${activeStepIndex === index ? 'active' : ''}`}
                                            onClick={() => setActiveStepIndex(index)}
                                        >
                                            <div className="step-btn-number">0{step.id}</div>
                                            <div className="step-btn-title">{step.title}</div>
                                        </button>
                                    ))}
                                </div>

                                {/* Right Side: The Presentation Window */}
                                <div className="dashboard-display-window">
                                    {/* The key forces a smooth re-render animation when the step changes */}
                                    <div className="display-content fade-in-up" key={`${activeProcessTab}-${activeStepIndex}`}>

                                        <div className="display-image-box">
                                            <img
                                                src={stepImages[activeStepIndex]}
                                                alt={`Step ${activeStepData.id}`}
                                            />
                                            <div className="image-inner-shadow"></div>
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

                {/* --- SECTION 7: TRUST & SECURITY (White, 100vh) --- */}
                <section className="fullscreen-section section-white" id="trust">
                    <div className="container">
                        
                        {/* 1. FIXED HEADER */}
                        <div className="section-heading">
                            <h2 className="section-title">
                                Why You Can Trust <span className="text-highlight">Investate India</span>
                            </h2>
                            <p className="section-subtitle">
                                We are building the most dependable and transparent ecosystem for cross-border real estate investments. Your peace of mind is our foundation.
                            </p>
                        </div>

                        {/* 2. SCROLLABLE BODY */}
                        <div className="section-scrollable-body">
                            <div className="trust-grid-wrapper">
                                {trustFeatures.map((feature) => (
                                    <div className="trust-card" key={feature.id}>
                                        
                                        <div className="trust-icon-badge">
                                            {feature.icon}
                                        </div>
                                        
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

                {/* --- SECTION 8: THE TEAM (Founder Story & Profiles) --- */}
                <section className="fullscreen-section section-light" id="team">
                    <div className="container">
                        
                        {/* 1. FIXED HEADER */}
                        <div className="section-heading">
                            <h2 className="section-title">
                                Meet the Team Behind <span className="text-highlight">Your Trust</span>
                            </h2>
                            <p className="section-subtitle">
                                We are bridging the gap between NRI investors and Indian real estate through experience, strict compliance, and total transparency.
                            </p>
                        </div>

                        {/* 2. SCROLLABLE BODY */}
                        <div className="section-scrollable-body">
                            <div className="team-wrapper fade-in">
                                
                                {/* Left Side: The Founding Story */}
                                <div className="team-story-side">
                                    <div className="story-badge">Our Story</div>
                                    <h3 className="story-headline">Built on transparency. Driven by experience.</h3>
                                    
                                    <div className="story-text-content">
                                        <p>
                                            Investate India is founded by <strong>[Name]</strong> and <strong>[Name]</strong>, professionals with over <strong>[X]</strong> years of combined experience in Indian real estate, NRI investment facilitation, and compliance management.
                                        </p>
                                        <p>
                                            Having witnessed firsthand the challenges NRIs face—and the reputation risks developers encounter—we built Investate India to create a more transparent, structured, and trustworthy marketplace.
                                        </p>
                                    </div>

                                    {/* Premium Blockquote for the Mission */}
                                    <blockquote className="mission-quote">
                                        "Our mission is simple: Bridge the trust gap through information clarity."
                                    </blockquote>
                                </div>

                                {/* Right Side: Founder Profile Cards */}
                                <div className="team-cards-side">
                                    {teamMembers.map((member, index) => (
                                        <div className="team-profile-card" key={index}>
                                            <div className="profile-image-wrapper">
                                                <img src={member.image} alt={member.name} />
                                                {/* Sleek LinkedIn Overlay Button */}
                                                <a href={member.linkedin} className="linkedin-btn" aria-label="LinkedIn Profile">
                                                    <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                                                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                                                    </svg>
                                                </a>
                                            </div>
                                            <div className="profile-info">
                                                <h4 className="profile-name">{member.name}</h4>
                                                <p className="profile-role">{member.role}</p>
                                                <div className="profile-divider"></div>
                                                <p className="profile-exp">{member.exp}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                            </div>
                        </div>

                    </div>
                </section>

                {/* --- SECTION 9: EARLY ACCESS & CTA (Light Theme with Dark Card) --- */}
                <section className="fullscreen-section section-white" id="early-access">
                    <div className="container">
                        
                        {/* 1. FIXED HEADER */}
                        <div className="section-heading">
                            <h2 className="section-title">
                                We're Building <span className="text-highlight">Something Different</span>
                            </h2>
                            <p className="section-subtitle">
                                Investate India is currently in its early phase. We are actively working to bring you a curated selection of verified opportunities and building a community of informed investors.
                            </p>
                        </div>

                        {/* 2. SCROLLABLE BODY */}
                        <div className="section-scrollable-body">
                            <div className="early-access-wrapper">

                                {/* Left Side: Current Focus */}
                                <div className="focus-content-side">
                                    <h3 className="focus-heading">Our Current Focus</h3>
                                    <div className="focus-list">
                                        {currentFocusList.map((item, index) => (
                                            <div className="focus-list-item" key={index}>
                                                <div className="focus-check">
                                                    {/* Glowing pulse animation applied to this SVG via CSS */}
                                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                                        <polyline points="20 6 9 17 4 12"></polyline>
                                                    </svg>
                                                </div>
                                                <p className="focus-text">{item}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Right Side: Premium Dark CTA Card */}
                                <div className="cta-card-side">
                                    <div className="cta-card-inner">
                                        <div className="cta-badge">Waitlist Open</div>
                                        <h3 className="cta-title">Join Our Investor Network</h3>
                                      
                                        {/* Mock Email Capture Form */}
                                        <div className="cta-form-group">
                                            <input 
                                                type="email" 
                                                className="cta-input" 
                                                placeholder="Enter your email address..." 
                                            />
                                            <button className="btn btn-primary cta-submit-btn">
                                                Register Now
                                            </button>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>

                    </div>
                </section>

                {/* --- SECTION 10: FAQ (White Theme, Accordion) --- */}
                <section className="fullscreen-section section-light" id="faq">
                    <div className="container">
                        
                        {/* 1. FIXED HEADER */}
                        <div className="section-heading">
                            <h2 className="section-title">
                                Your Questions, <span className="text-highlight">Answered</span>
                            </h2>
                            <p className="section-subtitle">
                                Everything you need to know about how Investate India works, our verification process, and how we support your investment journey.
                            </p>
                        </div>

                        {/* 2. SCROLLABLE BODY */}
                        <div className="section-scrollable-body">
                            <div className="faq-wrapper">
                                {faqsList.map((faq, index) => {
                                    const isOpen = activeFaq === index;
                                    
                                    return (
                                        <div className={`faq-item ${isOpen ? 'open' : ''}`} key={index}>
                                            <button 
                                                className="faq-question-btn" 
                                                onClick={() => toggleFaq(index)}
                                            >
                                                <span className="faq-question-text">{faq.question}</span>
                                                <div className="faq-icon-wrapper">
                                                    {/* Plus/Minus Icon that animates based on state */}
                                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="faq-icon">
                                                        <line x1="12" y1="5" x2="12" y2="19" className="icon-vertical"></line>
                                                        <line x1="5" y1="12" x2="19" y2="12"></line>
                                                    </svg>
                                                </div>
                                            </button>
                                            
                                            {/* Modern CSS Grid trick for smooth height animation */}
                                            <div className="faq-answer-container">
                                                <div className="faq-answer-inner">
                                                    <p>{faq.answer}</p>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                    </div>
                </section>

                {/* --- SECTION 11: FINAL CTA (Dual Desktop, Tabbed Mobile) --- */}
                <section className="fullscreen-section section-white" id="contact">
                    <div className="container">
                        
                        {/* 1. FIXED HEADER */}
                        <div className="section-heading">
                            <h2 className="section-title">
                                Ready to Explore or <span className="text-highlight">Partner?</span>
                            </h2>
                            <p className="section-subtitle">
                                Join the platform that is bringing true transparency and structure to cross-border real estate investments in India.
                            </p>
                        </div>

                        {/* 2. THE TAB TOGGLE (Hidden on Desktop, Visible on Mobile) */}
                        <div className="process-tabs-container mobile-cta-tabs">
                            <div className="process-tabs">
                                <button
                                    className={`process-tab ${activeCtaTab === 'investors' ? 'active' : ''}`}
                                    onClick={() => setActiveCtaTab('investors')}
                                >
                                    For Investors
                                </button>
                                <button
                                    className={`process-tab ${activeCtaTab === 'builders' ? 'active' : ''}`}
                                    onClick={() => setActiveCtaTab('builders')}
                                >
                                    For Builders
                                </button>
                            </div>
                        </div>

                        {/* 3. SCROLLABLE BODY */}
                        <div className="section-scrollable-body">
                            <div className="final-cta-wrapper fade-in">
                                
                                {/* Card 1: For Investors */}
                                <div className={`final-cta-card investor-card ${activeCtaTab === 'investors' ? 'mobile-active' : 'mobile-hidden'}`}>
                                    <div className="cta-card-icon">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <circle cx="12" cy="12" r="10"></circle>
                                            <line x1="2" y1="12" x2="22" y2="12"></line>
                                            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                                        </svg>
                                    </div>
                                    <h3 className="cta-card-title">For Investors</h3>
                                    <p className="cta-card-text">
                                        Interested in transparent, verified real estate opportunities in India? 
                                    </p>
                                    <a href="#register" className="btn btn-primary cta-action-btn">
                                        Register Your Interest
                                    </a>
                                    <p className="cta-card-footer">
                                        We'll keep you updated as we onboard builders and projects.
                                    </p>
                                </div>

                                {/* Card 2: For Builders */}
                                <div className={`final-cta-card builder-card ${activeCtaTab === 'builders' ? 'mobile-active' : 'mobile-hidden'}`}>
                                    <div className="cta-card-icon">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect>
                                            <path d="M9 22v-4h6v4"></path>
                                            <path d="M8 6h.01"></path>
                                            <path d="M16 6h.01"></path>
                                            <path d="M12 6h.01"></path>
                                            <path d="M12 10h.01"></path>
                                            <path d="M12 14h.01"></path>
                                            <path d="M16 10h.01"></path>
                                            <path d="M16 14h.01"></path>
                                            <path d="M8 10h.01"></path>
                                            <path d="M8 14h.01"></path>
                                        </svg>
                                    </div>
                                    <h3 className="cta-card-title">For Builders</h3>
                                    <p className="cta-card-text">
                                        Want to reach serious investors through a credible, structured platform?
                                    </p>
                                    <a href="#apply" className="btn btn-outline cta-action-btn">
                                        Apply for Partnership
                                    </a>
                                    <p className="cta-card-footer">
                                        Let's discuss how we can showcase your projects.
                                    </p>
                                </div>

                            </div>
                        </div>

                    </div>
                </section>

                <Footer />
            </div>

            <LoginDialog 
                isOpen={isLoginOpen} 
                onOpenChange={setIsLoginOpen} 
                onSwitchToRegister={openRegister} 
            />

            <RegisterDialog 
                isOpen={isRegisterOpen} 
                onOpenChange={setIsRegisterOpen} 
                onLoginClick={openLogin}
                initialData={registerInitialData}
            />
        </>
    );
};

export default Index;