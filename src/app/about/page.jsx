"use client";

import React, { useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Shield, Users, Globe, Target, Award, Briefcase, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function AboutUs() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="w-full min-h-screen bg-white overflow-x-hidden font-sans">
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
            Bridging Global Investors <br />
            <span className="text-orange-400">to Indian Real Estate</span>
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto md:mx-0 text-gray-200 leading-relaxed">
            We are India's premier property technology platform dedicated exclusively to helping NRIs and international investors navigate the Indian real estate market with confidence and transparency.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-12 items-center">
            <div className="w-full md:w-1/2">
              <div className="inline-block bg-blue-50 text-blue-800 px-4 py-1 rounded-full text-sm font-bold mb-4">
                WHO WE ARE
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-[#0b264f] mb-6">
                Redefining Real Estate <br /> Investment for the Global Indian
              </h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Founded in 2023, Investate India was born from a simple observation: NRIs want to invest in their homeland, but the lack of transparency, trust issues, and distance make it difficult.
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
            </div>
            <div className="w-full md:w-1/2 relative">
              <img
                src="https://images.unsplash.com/photo-1570129477492-45c003edd2be?ixlib=rb-4.0.3&auto=format&fit=crop&w=1632&q=80"
                alt="About Us"
                className="rounded-2xl shadow-2xl w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-[#0b264f] mb-4">Our Core Values</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-lg border-b-4 border-transparent hover:border-orange-500 group">
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-blue-600">
                <Shield className="w-8 h-8 text-blue-600 group-hover:text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Trust & Transparency</h3>
              <p className="text-gray-500">We believe in zero hidden costs. Every document, approval, and price component is disclosed upfront.</p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg border-b-4 border-transparent hover:border-orange-500 group">
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-blue-600">
                <Award className="w-8 h-8 text-blue-600 group-hover:text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Excellence</h3>
              <p className="text-gray-500">We only list top-tier projects (Grade A developers) to ensure your asset appreciates over time.</p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg border-b-4 border-transparent hover:border-orange-500 group">
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-blue-600">
                <Users className="w-8 h-8 text-blue-600 group-hover:text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Customer First</h3>
              <p className="text-gray-500">From site visits to registration, our dedicated relationship managers are with you at every step.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-[#0b264f] relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Ready to Start Your Journey?</h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-orange-600 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-orange-700 transition-all flex items-center justify-center gap-2">
              <Briefcase className="w-5 h-5" /> Explore Projects
            </button>
            <button className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-white hover:text-[#0b264f] transition-all flex items-center justify-center gap-2">
              Contact Support <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
