"use client";

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Shield, Users, Globe, Target, Award, Briefcase, ArrowRight, CheckCircle2, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

const whyChooseUs = [
  {
    title: "Trusted Network",
    desc: "A rigorously vetted ecosystem of verified builders, legal advisors, tax experts and service providers you can rely on.",
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
  },
  {
    title: "Professional Expertise",
    desc: "Seasoned professionals with deep domain knowledge in NRI investment, real estate law, taxation and cross-border wealth management.",
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="7"></circle><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline></svg>
  },
  {
    title: "End-to-End Asset Management",
    desc: "From investment discovery to property maintenance, rental collection and succession planning — a single ecosystem for all your needs.",
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>
  },
  {
    title: "Legal & Compliance Support",
    desc: "Navigate FEMA, RERA, property disputes, TDS, DTAA and succession law with expert guidance — all from wherever you are in the world.",
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg>
  },
  {
    title: "Transparent Processes",
    desc: "Standardized disclosures, real-time updates and clear documentation — no hidden fees, no middlemen noise, no surprises.",
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
  },
  {
    title: "Global Accessibility",
    desc: "Built for the NRI lifestyle — access your investment dashboard, advisors and property updates anytime, from any time zone.",
    icon: <Globe className="w-6 h-6" />
  },
  {
    title: "Long-Term Wealth Protection",
    desc: "We're not just about your next investment. We help you build, protect and pass on lasting wealth in India across generations.",
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
  }
];

export default function AboutUs() {
  const router = useRouter();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="theme-investor w-full min-h-screen bg-[var(--color-light-bg)] overflow-x-hidden font-sans">
      <Header />

      <section className="relative h-[60vh] md:h-[70vh] flex items-center justify-center md:justify-start overflow-hidden mt-[2rem] md:mt-[4rem]">
        <div
          className="absolute inset-0 z-0 hero-split-image"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80)',
            backgroundSize: 'cover',
          }}
        >
          <div className="absolute inset-0 z-[1] hero-split-overlay"></div>
        </div>

        <div className="container mx-auto px-4 md:px-12 relative z-10 text-center md:text-left text-white max-w-4xl">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            The Global Conduit for <br />
            <span className="text-orange-400">Premium Indian Real Estate</span>
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto md:mx-0 text-gray-200 leading-relaxed">
            The definitive Prop-Tech ecosystem dedicated to empowering international investors with on-ground transparency and institutional-grade security across the Indian landscape.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-transparent">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="w-full md:w-1/2"
            >
              <motion.div
                animate={{ y: [0, -30, 0] }}
                transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                className="inline-block bg-blue-50 text-blue-800 px-4 py-1 rounded-full text-sm font-bold mb-4"
              >
                WHO WE ARE
              </motion.div>
              <h2 className="text-3xl md:text-4xl font-bold text-[#1a1a1a] mb-6">
                Pioneering Strategic Investment <br /> for the Global Diaspora
              </h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Founded in 2023, Investate India was conceived to resolve the fundamental asymmetries in cross-border real estate—addressing the trust gap that has historically hindered international capital.
              </p>
              <p className="text-gray-600 mb-8 leading-relaxed">
                We have engineered a platform that transcends physical distance. By merging cutting-edge technology with rigorous on-ground verification, we ensure every listed development is legally fortified, RERA-compliant, and vetted by industry experts. We are your strategic partners in wealth preservation and growth.
              </p>

              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="bg-orange-100 p-2 rounded-lg mt-1">
                    <Target className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-gray-900">Our Mission</h4>
                    <p className="text-gray-500 text-sm">To provide a safe, transparent, and high-yield investment ecosystem for 10 million+ Global Indians.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-blue-100 p-2 rounded-lg mt-1">
                    <Globe className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-gray-900">Our Vision</h4>
                    <p className="text-gray-500 text-sm">To be the world's most trusted bridge between international capital and India's infrastructure growth.</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
              className="w-full md:w-1/2 relative"
            >
              <div className="absolute -top-4 -left-4 w-24 h-24 bg-orange-100 rounded-full -z-10"></div>
              <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-blue-100 rounded-full -z-10"></div>
              <img
                src="/about-us.jpeg"
                alt="Team meeting in modern office"
                className="rounded-2xl shadow-2xl w-full h-auto object-cover"
              />
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-[rgba(0,0,0,0.02)]">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-[#1a1a1a] mb-4">Our Core Values</h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-16">
            Principles that guide every decision we make and every partnership we build.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            <motion.div
              animate={{ y: [0, -30, 0] }}
              transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut", delay: 0 }}
              className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all border-b-4 border-transparent hover:border-orange-500 group"
            >
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-blue-600 transition-colors">
                <Shield className="w-8 h-8 text-blue-600 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Trust & Transparency</h3>
              <p className="text-gray-500 leading-relaxed">
                We believe in zero hidden costs. Every document, approval, and price component is disclosed upfront.
              </p>
            </motion.div>

            <motion.div
              animate={{ y: [0, -30, 0] }}
              transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut", delay: 0.2 }}
              className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all border-b-4 border-transparent hover:border-orange-500 group"
            >
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-blue-600 transition-colors">
                <Award className="w-8 h-8 text-blue-600 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Excellence</h3>
              <p className="text-gray-500 leading-relaxed">
                We only list top-tier projects (Grade A developers) to ensure your asset appreciates over time.
              </p>
            </motion.div>

            <motion.div
              animate={{ y: [0, -30, 0] }}
              transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut", delay: 0.4 }}
              className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all border-b-4 border-transparent hover:border-orange-500 group"
            >
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-blue-600 transition-colors">
                <Users className="w-8 h-8 text-blue-600 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Customer First</h3>
              <p className="text-gray-500 leading-relaxed">
                From site visits to registration, our dedicated relationship managers are with you at every step.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-transparent">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <h2 className="text-3xl md:text-4xl font-bold text-[#1a1a1a] mb-6">
                Why Visionary Investors <br /> Choose Investate India
              </h2>
              <div className="space-y-4">
                {[
                  "Rigorous Due Diligence (30+ Proprietary Checkpoints)",
                  "Institutional-Grade Legal & Documentation Support",
                  "Immersive Virtual Tours & Real-time Construction Oversight",
                  "Personalized Wealth Advisory for Every Investor",
                  "Comprehensive Post-Acquisition Asset Management"
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-blue-50 transition-colors">
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700 font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="order-1 md:order-2">
              <img
                src="/about-us2.jpg"
                alt="Modern Apartment Building"
                className="rounded-2xl shadow-xl w-full h-[400px] object-cover"
              />
            </div>
          </div>

          <div className="mt-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-[#1a1a1a] mb-4">
                Why NRIs <span className="text-orange-500">Choose Us</span>
              </h2>
              <p className="text-gray-500 max-w-2xl mx-auto leading-relaxed">
                We built Investate India to solve the real problems NRIs face — not just to list properties. Here is what sets us apart.
              </p>
            </div>

            <div className="relative">
              <button
                onClick={() => { const el = document.getElementById('why-choose-scroll'); el.scrollBy({ left: -el.clientWidth, behavior: 'smooth' }); }}
                className="absolute left-0 top-1/2 -translate-y-1/2 -ml-4 md:-ml-6 z-10 bg-white shadow-[0_4px_20px_rgba(0,0,0,0.12)] rounded-full p-2 md:p-3 text-orange-500 hover:text-white hover:bg-orange-500 transition-all border border-gray-100 flex"
              >
                <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
              </button>

              <div
                id="why-choose-scroll"
                className="flex overflow-x-auto gap-6 pb-8 snap-x snap-mandatory px-4 -mx-4 scroll-smooth"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {whyChooseUs.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.15 }}
                    transition={{ duration: 0.5, delay: index * 0.05 }}
                    className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border-t-4 border-orange-400 flex flex-col gap-4 cursor-pointer w-[85vw] sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] shrink-0 snap-center sm:snap-start"
                    style={{ transform: 'translateY(0)' }}
                    whileHover={{ y: -6 }}
                  >
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center text-white flex-shrink-0"
                      style={{ background: 'linear-gradient(135deg, #F97316, #D48035)' }}>
                      {item.icon}
                    </div>
                    <h4 className="text-base font-bold text-[#1a1a1a] leading-snug">{item.title}</h4>
                    <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
                  </motion.div>
                ))}
              </div>

              <button
                onClick={() => { const el = document.getElementById('why-choose-scroll'); el.scrollBy({ left: el.clientWidth, behavior: 'smooth' }); }}
                className="absolute right-0 top-1/2 -translate-y-1/2 -mr-4 md:-mr-6 z-10 bg-white shadow-[0_4px_20px_rgba(0,0,0,0.12)] rounded-full p-2 md:p-3 text-orange-500 hover:text-white hover:bg-orange-500 transition-all border border-gray-100 flex"
              >
                <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-[rgba(0,0,0,0.02)]">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-center mb-8"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-[#1a1a1a] mb-4">Meet The Leadership</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Driven by passion, guided by experience, and united by a shared commitment to global real estate excellence.
            </p>
          </motion.div>

          <div className="max-w-6xl mx-auto space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="flex flex-col lg:flex-row-reverse bg-white rounded-3xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100 overflow-hidden"
            >
              <div className="lg:w-2/5 bg-[#1a1a1a] p-4 md:p-6 flex items-center justify-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-800 rounded-full opacity-30 -mr-16 -mt-16"></div>
                <div className="text-center group relative z-10">
                  <div className="w-32 h-32 md:w-40 md:h-40 mx-auto rounded-2xl mb-6 overflow-hidden border-4 border-blue-800/50 shadow-xl transition-transform duration-300 group-hover:scale-105">
                    <img src="/deepak.png" alt="Deepak Kavadia" className="w-full h-full object-cover" />
                  </div>
                  <h3 className="font-bold text-2xl text-white mb-1">Deepak Kavadia</h3>
                  <p className="text-orange-400 text-xs font-bold tracking-widest uppercase mt-2">Partner</p>
                  <p className="text-blue-200 text-sm mt-3">New York, USA</p>
                </div>
              </div>
              <div className="lg:w-3/5 p-4 md:p-6 flex flex-col justify-center bg-white">
                <div className="w-12 h-1 bg-[#D48035] mb-6 rounded-full"></div>
                <p className="text-gray-600 leading-relaxed text-[1.05rem]">
                  <strong>Deepak,</strong> based in New York, is an entrepreneur, real estate investor, and internationally respected gemstone authority. <br /> <br />
                  He is the Founder and Chairman of the <strong>NRI Federation</strong>, a global diaspora platform dedicated to strengthening connections between Non-Resident Indians and opportunities in India. <br /> <br />
                  Deepak brings an important international perspective to Investate India, helping NRI investors engage with Indian opportunities through a trusted global interface.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
              className="flex flex-col lg:flex-row bg-white rounded-3xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100 overflow-hidden"
            >
              <div className="lg:w-2/5 bg-[#FB923C] p-4 md:p-6 flex items-center justify-center relative overflow-hidden">
                <div className="flex flex-col sm:flex-row gap-8 md:gap-12 w-full justify-center">
                  <div className="text-center group">
                    <div className="w-28 h-28 md:w-32 md:h-32 mx-auto rounded-2xl mb-4 overflow-hidden border-4 border-white shadow-md transition-transform duration-300 group-hover:scale-105">
                      <img src="/pankaj.png" alt="Pankaj Gupta" className="w-full h-full object-cover" />
                    </div>
                    <h3 className="font-bold text-lg text-gray-900 leading-tight">Pankaj <br />Gupta</h3>
                    <p className="text-white text-xs font-bold tracking-widest uppercase mt-2">Partner</p>
                  </div>
                  <div className="text-center group">
                    <div className="w-28 h-28 md:w-32 md:h-32 mx-auto rounded-2xl mb-4 overflow-hidden border-4 border-white shadow-md transition-transform duration-300 group-hover:scale-105">
                      <img src="/atish.png" alt="Atish Agarwal" className="w-full h-full object-cover" />
                    </div>
                    <h3 className="font-bold text-lg text-gray-900 leading-tight">Atish<br />Agarwal</h3>
                    <p className="text-white text-xs font-bold tracking-widest uppercase mt-2">Partner</p>
                  </div>
                </div>
              </div>
              <div className="lg:w-3/5 p-4 md:p-6 flex flex-col justify-center">
                <div className="w-12 h-1 bg-orange-500 mb-6 rounded-full"></div>
                <p className="text-gray-600 leading-relaxed text-[1.05rem]">
                  <strong>Pankaj Gupta</strong> has built a strong presence in the diamond and jewellery industry as a manufacturer, wholesaler and retailer. He is also well known in the Hyderabad real estate market. <br /> <br />
                  <strong>Atish Agarwal</strong> is an entrepreneur with diversified business interests across textiles, retail, fashion, jewellery, and real estate advisory. <br /> <br />
                  Together, they are partners in <strong>Istana Realtors.</strong> They have successfully delivered multiple projects and are widely recognized personalities in Hyderabad.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-[#1a1a1a] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-800 rounded-full opacity-20 -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-orange-600 rounded-full opacity-10 -ml-32 -mb-32"></div>

        <div className="container mx-auto px-4 relative z-10 text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Ready to Start Your Journey?
          </h2>
          <p className="text-blue-100 text-lg md:text-xl max-w-2xl mx-auto mb-10">
            Join our exclusive network of investors and get early access to pre-launch offers in India's top metro cities.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {/* <button className="bg-orange-600 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-orange-700 transition-all shadow-lg flex items-center justify-center gap-2">
              <Briefcase className="w-5 h-5" />
              Explore Projects
            </button> */}
            <button onClick={() => router.push('/contact-us')} className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-white hover:text-[#1a1a1a] transition-all flex items-center justify-center gap-2">
              Contact Support <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
