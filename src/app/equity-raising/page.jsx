"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useRouter } from "next/navigation";
import Head from "next/head";
import {
  CheckCircle,
  ArrowRight,
  Shield,
  FileText,
  Users,
  Building2,
  ChevronDown,
  ChevronUp,
  Phone,
  Mail,
  MapPin,
  Lock,
  Handshake,
  ClipboardList,
  BadgeCheck,
} from "lucide-react";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.55, delay, ease: "easeOut" },
});

const steps = [
  {
    id: "01",
    icon: "ClipboardList",
    title: "Share Your Proposal",
    desc: "Tell us about your company, what you are building, and how much capital you are looking to raise. A brief overview of your business and current stage is enough to get started.",
  },
  {
    id: "02",
    icon: "BadgeCheck",
    title: "Review & Verification",
    desc: "Our team will review your submission and evaluate the basics - your business model, revenue potential, and the kind of security you can offer. We keep this process straightforward.",
  },
  {
    id: "03",
    icon: "Handshake",
    title: "Investor Conversation",
    desc: "If there is a fit, we connect you with the right investors from our network. They will want to understand your projections, collateral, and growth roadmap before any commitment is made.",
  },
  {
    id: "04",
    icon: "Lock",
    title: "Structuring & Agreement",
    desc: "Once both sides agree, a formal investment structure is drawn up - with clear terms around capital, repayment timeline, and security. Everything is legally documented.",
  },
];

const proposalItems = [
  "Company profile and background",
  "What the funds will be used for",
  "Your revenue projections and business plan",
  "Collateral or assets you can offer as security",
  "Estimated project or business timeline",
  "Your expected capital requirement",
];

const securityPoints = [
  {
    icon: "Building2",
    title: "Asset-Backed Security",
    desc: "Investors do not just take your word for it. Before funds are released, a charge is placed on your assets - similar to what a bank would require as collateral.",
  },
  {
    icon: "FileText",
    title: "Legal Documentation",
    desc: "Every investment is backed by a formal legal agreement. This covers the capital amount, repayment terms, timeline, and what happens if either side does not follow through.",
  },
  {
    icon: "Shield",
    title: "Independent Due Diligence",
    desc: "Third-party legal and financial checks are carried out before any money moves. This protects everyone - the investor and you.",
  },
  {
    icon: "Users",
    title: "Project Receivables",
    desc: "In many cases, the future revenue or receivables of your project are also included as a security layer - giving investors added confidence in the deal.",
  },
];

const faqs = [
  {
    q: "What is the minimum amount I can raise through this program?",
    a: "We do not have a strict minimum, but equity raising through our platform is generally suited for businesses looking to raise meaningful capital - enough to make a real difference to your growth. If you are unsure, just reach out and we will give you an honest answer.",
  },
  {
    q: "Do I have to pay anything upfront like a bank EMI?",
    a: "No. That is exactly what makes this different from a bank loan. There are no monthly repayments from day one. You and the investor agree on a timeline - say, after your project is completed - and that is when the repayment happens, as per the terms you both signed.",
  },
  {
    q: "What kind of security do investors typically ask for?",
    a: "Most investors will want a charge on your physical assets - land, property, equipment - and may also ask for corporate or personal guarantees depending on the deal size and structure.",
  },
  {
    q: "Will my business details be kept confidential?",
    a: "Yes. Before any detailed information is shared with investors, an NDA is signed. Your data is handled with full confidentiality throughout the process.",
  },
  {
    q: "How long does the process usually take?",
    a: "It depends on the complexity of your business and how prepared your documentation is. Simpler, well-documented proposals move faster. Once an investor expresses interest, the formal structuring and agreements typically take a few weeks.",
  },
];

const IconMap = {
  ClipboardList: ClipboardList,
  BadgeCheck: BadgeCheck,
  Handshake: Handshake,
  Lock: Lock,
  Building2: Building2,
  FileText: FileText,
  Shield: Shield,
  Users: Users,
};

export default function EquityRaisingPage() {
  const [openFaq, setOpenFaq] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      </Head>
      <div className="min-h-screen bg-white text-gray-800 flex flex-col" style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>
      <Header />

      {/* HERO */}
      <section
        className="relative flex items-center justify-center overflow-hidden pt-20 pb-28"
        style={{ background: "linear-gradient(135deg, #0d0d0d 0%, #1c1c1c 60%, #242424 100%)", minHeight: "90vh" }}
      >
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full opacity-[0.07]"
            style={{ background: "radial-gradient(circle, #D48035 0%, transparent 70%)" }} />
          <div className="absolute bottom-0 left-0 w-full h-28 opacity-10"
            style={{ background: "linear-gradient(to top, #D48035, transparent)" }} />
        </div>
        <div className="container mx-auto px-4 max-w-4xl text-center relative z-10">
          <motion.div {...fadeUp()}>
            <span className="inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest text-[#D48035] border border-[#D48035]/30 bg-[#D48035]/10 mb-6">
              Investate India · Capital Program
            </span>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Equity Raising<br />
              <span className="text-[#D48035]">For Growing Businesses</span>
            </h1>
            <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-3 leading-relaxed">
              If your business needs capital to grow, we connect you with serious investors - structured properly, secured clearly, and on terms that make sense for your timeline.
            </p>
            <p className="text-gray-500 text-lg max-w-xl mx-auto mb-10">
              No upfront EMIs. No monthly interest. Just a clear agreement between you and an investor who believes in what you are building.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <a href="#how-it-works" className="bg-[#D48035] hover:bg-[#B45309] text-white font-bold px-8 py-4 rounded-full shadow-lg transition-all hover:scale-105 text-sm uppercase tracking-wider">
                How It Works
              </a>
              <a href="#connect" className="border border-white/20 hover:border-[#D48035]/60 text-white font-semibold px-8 py-4 rounded-full transition-all text-sm uppercase tracking-wider">
                Talk to Us
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* WHAT IS THIS */}
      <section className="py-20 bg-white" id="what-is-this">
        <div className="container mx-auto px-4 max-w-5xl">
          <motion.div {...fadeUp()} className="text-center mb-14">
            <span className="inline-block bg-orange-50 text-[#D48035] text-xs font-bold px-3 py-1 rounded-full border border-orange-200 mb-4">
              Understanding the Program
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-[#111] mb-4">What Is Equity Raising?</h2>
            <p className="text-gray-500 text-lg max-w-3xl mx-auto leading-relaxed">
              Think of it this way - your business needs capital. You could go to a bank, but banks charge interest from day one and expect monthly repayments whether your project is done or not.
            </p>
          </motion.div>
          <div className="grid md:grid-cols-2 gap-8 items-start">
            <motion.div {...fadeUp(0.1)} className="bg-gray-50 rounded-2xl p-8 border border-gray-100">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-red-400" />
                </div>
                <h3 className="font-bold text-lg text-[#111]">The Bank Route</h3>
              </div>
              <ul className="space-y-3 text-gray-600 text-base leading-relaxed">
                <li className="flex gap-2.5"><span className="text-red-400 mt-1">x</span> Fixed interest from the first month</li>
                <li className="flex gap-2.5"><span className="text-red-400 mt-1">x</span> Monthly EMI regardless of where your project stands</li>
                <li className="flex gap-2.5"><span className="text-red-400 mt-1">x</span> Rigid terms, limited flexibility</li>
                <li className="flex gap-2.5"><span className="text-red-400 mt-1">x</span> Collateral required, with fixed pressure on repayment</li>
              </ul>
            </motion.div>
            <motion.div {...fadeUp(0.2)} className="bg-[#D48035]/5 rounded-2xl p-8 border border-[#D48035]/20">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-[#D48035]/10 flex items-center justify-center">
                  <Handshake className="w-5 h-5 text-[#D48035]" />
                </div>
                <h3 className="font-bold text-lg text-[#111]">The Equity Route</h3>
              </div>
              <ul className="space-y-3 text-gray-600 text-base leading-relaxed">
                <li className="flex gap-2.5"><CheckCircle className="w-4 h-4 text-[#D48035] shrink-0 mt-1" /> Investor puts in the capital you need</li>
                <li className="flex gap-2.5"><CheckCircle className="w-4 h-4 text-[#D48035] shrink-0 mt-1" /> You provide collateral, just like with a bank</li>
                <li className="flex gap-2.5"><CheckCircle className="w-4 h-4 text-[#D48035] shrink-0 mt-1" /> No monthly payments - repayment starts after your agreed timeline</li>
                <li className="flex gap-2.5"><CheckCircle className="w-4 h-4 text-[#D48035] shrink-0 mt-1" /> Terms are discussed and agreed upon - not imposed</li>
              </ul>
            </motion.div>
          </div>
          <motion.div {...fadeUp(0.3)} className="mt-10 bg-[#111] rounded-2xl p-8 text-center">
            <p className="text-white text-lg leading-relaxed max-w-2xl mx-auto">
              In simple terms - if your project completes in three years, you and the investor agree that repayment happens at that point. You focus on building. They wait for the returns. Both sides benefit, with a proper legal agreement protecting everyone.
            </p>
          </motion.div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-20 bg-gray-50" id="how-it-works">
        <div className="container mx-auto px-4 max-w-5xl">
          <motion.div {...fadeUp()} className="text-center mb-14">
            <span className="inline-block bg-orange-50 text-[#D48035] text-xs font-bold px-3 py-1 rounded-full border border-orange-200 mb-4">
              The Process
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-[#111] mb-4">How It Works</h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">
              We have kept the process straightforward. You do not need to figure out the entire journey on your own - our team walks you through it.
            </p>
          </motion.div>
          <div className="grid md:grid-cols-2 gap-6">
            {steps.map((step, idx) => {
              const IconComp = IconMap[step.icon];
              return (
                <motion.div key={step.id} {...fadeUp(idx * 0.1)} className="bg-white rounded-2xl p-7 border border-gray-100 shadow-sm hover:shadow-md hover:border-[#D48035]/20 transition-all duration-300">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center shrink-0">
                      {IconComp && <IconComp className="w-6 h-6 text-[#D48035]" />}
                    </div>
                    <div>
                      <h3 className="font-bold text-[1.1rem] text-[#111] mb-2">{step.title}</h3>
                      <p className="text-gray-500 text-base leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECURITY */}
      <section className="py-20 bg-white" id="security">
        <div className="container mx-auto px-4 max-w-5xl">
          <motion.div {...fadeUp()} className="text-center mb-14">
            <span className="inline-block bg-orange-50 text-[#D48035] text-xs font-bold px-3 py-1 rounded-full border border-orange-200 mb-4">
              Security & Agreements
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-[#111] mb-4">What Protects Everyone</h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">
              This is not a handshake deal. Every investment goes through proper legal structuring and independent checks.
            </p>
          </motion.div>
          <div className="grid md:grid-cols-2 gap-6">
            {securityPoints.map((point, idx) => {
              const IconComp = IconMap[point.icon];
              return (
                <motion.div key={idx} {...fadeUp(idx * 0.1)} className="flex gap-5 bg-gray-50 rounded-2xl p-7 border border-gray-100 hover:border-[#D48035]/20 transition-all">
                  <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center shrink-0">
                    {IconComp && <IconComp className="w-6 h-6 text-[#D48035]" />}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-[#111] mb-2">{point.title}</h3>
                    <p className="text-gray-500 text-base leading-relaxed">{point.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
          <motion.div {...fadeUp(0.4)} className="mt-10 rounded-2xl overflow-hidden border border-[#D48035]/20">
            <div className="bg-[#D48035] px-8 py-5">
              <h3 className="text-white font-bold text-lg">One thing we always say</h3>
            </div>
            <div className="bg-[#D48035]/5 px-8 py-6">
              <p className="text-gray-700 text-lg leading-relaxed">
                We do not encourage anyone to put money into a deal they have not fully understood. Before any agreement is signed, you will know exactly what is expected of you, what you are getting, and what happens on both sides if things go differently than planned. Transparency is not optional here - it is the foundation.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* PROPOSAL */}
      <section className="py-20" style={{ background: "linear-gradient(135deg, #111 0%, #1e1e1e 100%)" }} id="proposal">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div {...fadeUp()} className="text-center mb-12">
            <span className="inline-block bg-[#D48035]/10 text-[#D48035] text-xs font-bold px-3 py-1 rounded-full border border-[#D48035]/30 mb-4">
              Getting Started
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">What You Will Need to Share</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              To evaluate your proposal, our team and potential investors will need some basic information. There is no exact template - but here is what typically matters.
            </p>
          </motion.div>
          <motion.div {...fadeUp(0.15)} className="bg-white/5 border border-white/10 rounded-2xl p-8 md:p-10 max-w-3xl mx-auto">
            <div className="grid md:grid-cols-2 gap-x-8 gap-y-5 px-2 md:px-4">
              {proposalItems.map((item, idx) => (
                <div key={idx} className="flex items-start gap-3.5 text-gray-300 text-base leading-relaxed">
                  <CheckCircle className="w-5 h-5 text-[#D48035] shrink-0 mt-0.5" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
            <div className="mt-8 pt-8 border-t border-white/10">
              <p className="text-gray-400 text-base text-center">
                Do not worry if you do not have everything ready. <span className="text-[#D48035] font-semibold">Reach out first</span> - our team will tell you exactly what you need.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-20 bg-gray-50" id="faq">
        <div className="container mx-auto px-4 max-w-3xl">
          <motion.div {...fadeUp()} className="text-center mb-12">
            <span className="inline-block bg-orange-50 text-[#D48035] text-xs font-bold px-3 py-1 rounded-full border border-orange-200 mb-4">
              Common Questions
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-[#111] mb-4">Things People Usually Ask</h2>
          </motion.div>
          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <motion.div key={idx} {...fadeUp(idx * 0.07)} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <button onClick={() => setOpenFaq(openFaq === idx ? null : idx)} className="w-full flex items-center justify-between px-6 py-5 text-left gap-4">
                  <span className="font-semibold text-[#111] text-base leading-snug">{faq.q}</span>
                  {openFaq === idx
                    ? <ChevronUp className="w-5 h-5 text-[#D48035] shrink-0" />
                    : <ChevronDown className="w-5 h-5 text-gray-400 shrink-0" />}
                </button>
                {openFaq === idx && (
                  <div className="px-6 pb-5 text-gray-500 text-base leading-relaxed border-t border-gray-50 pt-4">
                    {faq.a}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CONNECT */}
      <section className="py-20 bg-white" id="connect">
        <div className="container mx-auto px-4 max-w-5xl">
          <motion.div {...fadeUp()} className="text-center mb-12">
            <span className="inline-block bg-orange-50 text-[#D48035] text-xs font-bold px-3 py-1 rounded-full border border-orange-200 mb-4">
              Let us Talk
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-[#111] mb-4">Interested? Start Here.</h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">
              If you think your business is a good fit, reach out. There is no commitment at this stage - just a conversation to see if it makes sense.
            </p>
          </motion.div>
          <div className="grid md:grid-cols-2 gap-8 items-start">
            <motion.div {...fadeUp(0.1)} className="space-y-5">
              <div className="bg-gray-50 rounded-2xl p-7 border border-gray-100">
                <h3 className="font-bold text-[1.1rem] text-[#111] mb-5">Get in Touch</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-[#D48035] shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-sm text-[#111]">New York, USA</p>
                      <p className="text-gray-500 text-sm">55 West 47 Street, 4th Floor, New York, NY 10036</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-[#D48035] shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-sm text-[#111]">Hyderabad, India</p>
                      <p className="text-gray-500 text-sm">5th Floor, Sanghi One, Road No 10, Banjara Hills</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-[#D48035] shrink-0" />
                    <a href="mailto:info@investateindia.com" className="text-gray-600 text-sm hover:text-[#D48035] transition-colors">info@investateindia.com</a>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-[#D48035] shrink-0" />
                    <a href="tel:+19144731711" className="text-gray-600 text-sm hover:text-[#D48035] transition-colors">+1 914-473-1711</a>
                  </div>
                </div>
              </div>
              <div className="bg-[#D48035] rounded-2xl p-7 text-white">
                <h3 className="font-bold text-lg mb-2">Not Sure If You Qualify?</h3>
                <p className="text-white/80 text-sm leading-relaxed mb-4">
                  Just reach out with a short description of your business. We will come back to you honestly - even if this program is not the right fit right now.
                </p>
                <a href="/contact-us" className="inline-flex items-center gap-2 bg-white text-[#D48035] font-bold px-5 py-2.5 rounded-full text-sm hover:bg-orange-50 transition-colors">
                  Contact Us <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </motion.div>
            <motion.div {...fadeUp(0.2)}>
              <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100 shadow-sm">
                <h3 className="font-bold text-[1.1rem] text-[#111] mb-2">Submit a Quick Inquiry</h3>
                <p className="text-gray-500 text-sm mb-6">We will review it and get back to you within 2 business days.</p>
                <form onSubmit={(e) => { e.preventDefault(); window.location.href = "/contact-us"; }} className="space-y-4">
                  <input type="text" placeholder="Your Name" required className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#D48035] bg-white" />
                  <input type="email" placeholder="Email Address" required className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#D48035] bg-white" />
                  <input type="text" placeholder="Company / Business Name" required className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#D48035] bg-white" />
                  <input type="text" placeholder="Capital Requirement (approximate)" className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#D48035] bg-white" />
                  <textarea rows={3} placeholder="Briefly describe your business and what you are looking for..." className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#D48035] bg-white resize-none" />
                  <button type="submit" className="w-full bg-[#D48035] hover:bg-[#B45309] text-white font-bold py-3.5 rounded-xl transition-all hover:scale-[1.02] text-sm uppercase tracking-wider">
                    Send Inquiry
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
    </>
  );
}

