"use client";

import React, { useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Shield, Users, Globe, Target, Award, Briefcase, ArrowRight, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AboutUs() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="theme-investor w-full min-h-screen bg-[var(--color-light-bg)] overflow-x-hidden font-sans">
      <Header />

      <section className="relative h-[60vh] md:h-[70vh] flex items-center justify-center overflow-hidden mt-[2rem] md:mt-[4rem]">
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute inset-0 bg-black/60"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10 text-center text-white">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            The Global Conduit for <br />
            <span className="text-orange-400">Premium Indian Real Estate</span>
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto text-gray-200 leading-relaxed">
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
              <h2 className="text-3xl md:text-4xl font-bold text-[#0b264f] mb-6">
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
          <h2 className="text-3xl md:text-4xl font-bold text-[#0b264f] mb-4">Our Core Values</h2>
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
              <h2 className="text-3xl md:text-4xl font-bold text-[#0b264f] mb-6">
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
            <h2 className="text-3xl md:text-4xl font-bold text-[#0b264f] mb-4">Meet The Leadership</h2>
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
              <div className="lg:w-2/5 bg-[#0b264f] p-4 md:p-6 flex items-center justify-center relative overflow-hidden">
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
                <div className="w-12 h-1 bg-[#0b264f] mb-6 rounded-full"></div>
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

      {/* <section className="py-20 bg-[#0b264f] relative overflow-hidden">
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
            <button className="bg-orange-600 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-orange-700 transition-all shadow-lg flex items-center justify-center gap-2">
              <Briefcase className="w-5 h-5" />
              Explore Projects
            </button>
            <button className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-white hover:text-[#0b264f] transition-all flex items-center justify-center gap-2">
              Contact Support <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section> */}

      <Footer />
    </div>
  );
}
