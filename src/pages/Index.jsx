import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
// import './index-page.css';

const Index = () => {
    const [activeIndex, setActiveIndex] = useState(0);

    // The Content Data
    const contentDataForSection2 = [
        {
            id: "01",
            title: "The Platform",
            text: "Investate India is not a traditional property listing portal or a marketplace. We are a structured discovery and facilitation platform built specifically for Non-Resident Indians who want better visibility, clearer information, and a more dependable process when evaluating Indian real estate opportunities."
        },
        {
            id: "02",
            title: "The Standard",
            text: "Unlike traditional portals where anyone can list anything, we pre-screen builders and mandate standardized disclosures including RERA compliance, project approvals, financial health indicators, and timeline transparency."
        },
        {
            id: "03",
            title: "The Focus",
            text: "Our platform focuses on presenting standardized, builder-declared information in a clean and consistent manner, allowing investors to understand projects on merit rather than marketing noise. We work closely with selected developers to ensure alignment with long-term investor interests."
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
        { title: "Single Point of Contact", desc: "One dedicated team coordinates everything from discovery to documentation, bridging the distance." },
        { title: "Strategic Negotiation", desc: "Negotiating the best commercial terms and pricing directly with the builders on your behalf." }
    ];

    return (
        <>
            <div className="w-full min-h-screen bg-white overflow-x-hidden">
                <Header transparent={true} />

                <section className="hero-section">
                    <div className="hero-content">

                        {/* Optional: Adds a premium, established feel */}
                        <span className="hero-badge">Investate India</span>

                        <h1 className="hero-headline">
                            Your Trusted Bridge to Transparent <br />
                            <span className="text-accent"> Indian Real Estate Investments</span>
                        </h1>

                        <p className="hero-subheadline">
                            Helping NRI investors discover credible Indian real estate opportunities through standardized information, verified builders, and transparent disclosures.
                        </p>

                        <div className="hero-cta-group">
                            <a href="#investors" className="btn btn-primary">Explore Opportunities</a>
                            <a href="#builders" className="btn btn-secondary">Become a Partner</a>
                        </div>

                    </div>
                </section>

                <section className="interactive-canvas-section" id="about">
                    {/* Premium Textured Background */}
                    <div className="canvas-texture"></div>

                    <div className="canvas-container">

                        {/* NEW: Centered, Massive Orange Title */}
                        <div className="challenges-header-centered" style={{ margin: "0 auto 4vh auto" }}>
                            <h2 className="massive-centered-headline">
                                What Is Investate <span className="text-orange">India?</span>
                            </h2>
                            <p className="challenges-lead-centered">
                                A specialized platform designed to simplify property investments and bring complete transparency and peace of mind to Non-Resident Indians.
                            </p>
                        </div>

                        {/* The Split Content Area */}
                        <div className="canvas-split">

                            {/* LEFT COLUMN: Menu */}
                            <div className="canvas-menu">
                                <h3 className="canvas-headline">
                                    A Smarter Way to <br />
                                    <span className="text-lavender">Discover Real Estate</span>
                                </h3>

                                <div className="menu-list">
                                    {contentDataForSection2.map((item, index) => (
                                        <div
                                            key={item.id}
                                            className={`menu-item ${activeIndex === index ? 'active' : ''}`}
                                            onMouseEnter={() => setActiveIndex(index)}
                                            onClick={() => setActiveIndex(index)}
                                        >
                                            {/* Header (Always Visible) */}
                                            <div className="menu-item-header">
                                                <span className="menu-id">{item.id}</span>
                                                <span className="menu-title">{item.title}</span>
                                            </div>

                                            {/* Accordion Body (Only visible on mobile) */}
                                            <div className="mobile-accordion-body">
                                                <p className="mobile-accordion-text">{item.text}</p>
                                            </div>

                                            <div className="active-indicator"></div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* RIGHT COLUMN: Cinematic Display */}
                            <div className="canvas-display">
                                <div className="display-box">
                                    <div className="display-bg-number" key={`bg-${activeIndex}`}>
                                        {contentDataForSection2[activeIndex].id}
                                    </div>
                                    <p className="display-text" key={`text-${activeIndex}`}>
                                        {contentDataForSection2[activeIndex].text}
                                    </p>
                                </div>
                            </div>

                        </div>
                    </div>
                </section>

                <section className="challenges-section" id="challenges">

                    {/* Background Layers matching Section 2 */}
                    <div className="challenges-bg-image"></div>
                    <div className="challenges-texture"></div>

                    <div className="challenges-container">

                        {/* TOP ROW: Centered & Attractive Header */}
                        <div className="challenges-header-centered">
                            <h2 className="massive-centered-headline">
                                Why Indian Real Estate Feels <br />
                                <span className="text-orange"> Difficult for NRIs</span>
                            </h2>

                            <p className="challenges-lead-centered">
                                For NRIs, investing in Indian real estate often comes with uncertainty. Distance, information overload, and lack of on-ground visibility make it difficult to differentiate credible opportunities from risky ones.
                            </p>
                        </div>

                        {/* BOTTOM ROW: The 9-Point (3x3) Glass Grid */}
                        <div className="challenges-grid">
                            {challengesList.map((challenge, index) => (
                                <div className="challenge-card" key={index} style={{ animationDelay: `${index * 0.05}s` }}>
                                    <div className="challenge-card-header">
                                        <span className="challenge-number">{challenge.id}</span>
                                        <p className="challenge-text">{challenge.text}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                    </div>
                </section>

                <section className="benefits-section" id="benefits">

                    {/* 1. NEW: Pure CSS Contextual Background */}
                    <div className="benefits-context-bg"></div>

                    <div className="benefits-container">

                        {/* TOP: Centered Header (Compact) */}
                        <div className="challenges-header-centered">
                            <h2 className="massive-centered-headline">
                                What You Get as an <span className="text-orange">Investate Investor</span>
                            </h2>
                            <p className="challenges-lead-centered">
                                Imagine having all builder credentials, RERA approvals, and payment terms in one place—no hunting across emails, no contradictory information. That's what we provide.
                            </p>
                        </div>
                        {/* MIDDLE: Split Layout */}
                        <div className="benefits-body">

                            {/* Left Side: 2. NEW: Stylish 3D Image Wrapper */}
                            <div className="benefits-image-wrapper">
                                {/* Soft ambient backlight (matches your reference image) */}
                                <div className="image-ambient-glow"></div>

                                <img
                                    src="/benefits-image.png"
                                    alt="Investate Document Verification"
                                    className="benefits-floating-illustration"
                                />
                            </div>

                            {/* Right Side: 4. NEW: Edge-Lit Interactive List */}
                            <div className="benefits-list">
                                {benefitsList.map((benefit, index) => (
                                    <div className="edge-list-item" key={index} style={{ animationDelay: `${index * 0.08}s` }}>

                                        <div className="edge-check">
                                            <svg viewBox="0 0 24 24" fill="none" stroke="var(--color-orange)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                                <polyline points="20 6 9 17 4 12"></polyline>
                                            </svg>
                                        </div>

                                        <div className="edge-text">
                                            <span className="edge-title-inline">{benefit.title}: </span>
                                            <span className="edge-desc-inline">{benefit.desc}</span>
                                        </div>

                                    </div>
                                ))}
                            </div>

                        </div>

                    </div>
                </section>


                <Footer />
            </div>
        </>
    );
};

export default Index;