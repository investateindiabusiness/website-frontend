"use client";

import React, { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  Phone,
  Mail,
  MapPin,
  Send,
  CheckCircle,
  Loader2,
  ExternalLink,
  ArrowUpRight,
} from "lucide-react";
import { submitContactInquiry } from "@/api";
import { toast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { officeLocations, contactDetails } from "@/data/contactInfo";

export default function ContactUs() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const isFormValid =
    formData.name.trim() !== "" &&
    formData.phone.trim() !== "" &&
    formData.email.trim() !== "" &&
    formData.subject !== "" &&
    formData.message.trim() !== "";

  const handleSubmit = async (e) => {
    e.preventDefault();

    const missingFields = [];
    if (!formData.name.trim()) missingFields.push("Name");
    if (!formData.phone.trim()) missingFields.push("Phone");
    if (!formData.email.trim()) missingFields.push("Email");
    if (!formData.subject) missingFields.push("Subject");
    if (!formData.message.trim()) missingFields.push("Message");

    if (missingFields.length > 0) {
      toast({
        title: "Validation Error",
        description: `Please fill in the required fields: ${missingFields.join(", ")}`,
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      await submitContactInquiry(formData);
      setIsSubmitted(true);
      setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to send message.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen overflow-x-hidden bg-[#F8F8F8] font-sans">
      <Header />

      {/* Hero Section */}
      <section className="relative mt-16 flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-zinc-950 py-16 md:py-24">
        {/* Background Image with overlay */}
        <div
          className="absolute inset-0 z-0 opacity-15 mix-blend-overlay"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1423666639041-f142fcb9446f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2074&q=80)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        ></div>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-[#D48035]/15 via-transparent to-[#D48035]/5" />

        <div className="container relative z-10 mx-auto px-6 text-center text-white max-w-5xl">
          {/* Breadcrumb */}
          <nav className="mb-4 flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
            <span className="hover:text-white transition">Home</span>
            <span>/</span>
            <span className="text-[#D48035]">Contact Us</span>
          </nav>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-4 font-heading text-4xl font-extrabold tracking-tight md:text-5xl lg:text-6xl"
          >
            Get in{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-orange-100 to-[#D48035]">
              Touch
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="mx-auto max-w-2xl font-body text-base text-gray-300 leading-relaxed md:text-lg"
          >
            Connect with our global teams for premium investment opportunities, builder
            partnerships, professional service networks, and structured capital support.
          </motion.p>
        </div>
      </section>

      {/* Main Content Grid Section */}
      <section className="relative z-20 bg-[#F8F8F8] py-14 md:py-20">
        <div className="container mx-auto max-w-7xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="grid gap-8 lg:grid-cols-[1.25fr_0.75fr]"
          >
            {/* Form Column */}
            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-xl shadow-slate-100 md:p-10 transition-shadow hover:shadow-2xl duration-500">
              {isSubmitted ? (
                <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-slate-50 p-12 text-center">
                  <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-50 shadow-inner">
                    <CheckCircle className="h-10 w-10 text-green-600" />
                  </div>
                  <h3 className="mb-2 font-heading text-2xl font-bold text-gray-900">
                    Message Sent!
                  </h3>
                  <p className="mx-auto max-w-xs font-body text-sm text-gray-500 leading-relaxed">
                    Thank you for reaching out. A dedicated account partner will connect with you within 24 hours.
                  </p>
                  <button
                    onClick={() => setIsSubmitted(false)}
                    className="mt-8 font-semibold text-[#D48035] hover:text-[#B45309] hover:underline font-body transition-colors"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#D48035]">
                      Direct Form
                    </span>
                    <h2 className="font-heading text-3xl font-extrabold text-[#1F2937] tracking-tight">
                      Let’s Start a Conversation
                    </h2>
                    <p className="text-sm font-body text-gray-500 max-w-lg leading-relaxed">
                      Select your topic and submit the request. Our relations managers will route it to the appropriate regional office.
                    </p>
                  </div>

                  <div className="grid gap-5 md:grid-cols-2">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Name</label>
                      <input
                        required
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full rounded-xl border border-gray-200 bg-slate-50 px-5 py-3.5 font-body text-gray-700 placeholder-gray-400 outline-none transition-all duration-300 focus:bg-white focus:border-[#D48035] focus:ring-4 focus:ring-[#D48035]/10"
                        placeholder="Your full name"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Email</label>
                      <input
                        required
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full rounded-xl border border-gray-200 bg-slate-50 px-5 py-3.5 font-body text-gray-700 placeholder-gray-400 outline-none transition-all duration-300 focus:bg-white focus:border-[#D48035] focus:ring-4 focus:ring-[#D48035]/10"
                        placeholder="Your email address"
                      />
                    </div>
                  </div>

                  <div className="grid gap-5 md:grid-cols-2">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Phone</label>
                      <input
                        required
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full rounded-xl border border-gray-200 bg-slate-50 px-5 py-3.5 font-body text-gray-700 placeholder-gray-400 outline-none transition-all duration-300 focus:bg-white focus:border-[#D48035] focus:ring-4 focus:ring-[#D48035]/10"
                        placeholder="Contact number"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Inquiry Topic</label>
                      <div className="relative">
                        <select
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          className="w-full cursor-pointer appearance-none rounded-xl border border-gray-200 bg-slate-50 px-5 py-3.5 font-body text-gray-500 outline-none transition-all duration-300 focus:bg-white focus:border-[#D48035] focus:ring-4 focus:ring-[#D48035]/10"
                        >
                          <option value="">Select a topic</option>
                          <option value="Investor Inquiry">Investor Inquiry</option>
                          <option value="Builder Partnership">Builder Partnership</option>
                          <option value="Service Provider Partnership">Service Provider Partnership</option>
                          <option value="Capital Sourcing">Capital Sourcing</option>
                          <option value="Existing Investment Support">Existing Investment Support</option>
                          <option value="General Inquiry">General Inquiry</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-400">
                          <svg
                            className="h-4 w-4 fill-current"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Message</label>
                    <textarea
                      required
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows="5"
                      className="w-full resize-none rounded-xl border border-gray-200 bg-slate-50 px-5 py-3.5 font-body text-gray-700 placeholder-gray-400 outline-none transition-all duration-300 focus:bg-white focus:border-[#D48035] focus:ring-4 focus:ring-[#D48035]/10"
                      placeholder="Write your query here..."
                    ></textarea>
                  </div>

                  <div className="flex justify-start pt-2">
                    <button
                      type="submit"
                      disabled={isLoading || !isFormValid}
                      className="flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-8 py-4 text-xs font-bold uppercase tracking-wider text-white shadow-lg hover:shadow-orange-500/10 hover:bg-[#D48035] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Send className="h-4 w-4" />
                      )}
                      {isLoading ? "Sending Inquiry..." : "Send Inquiry"}
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Sidebar Column */}
            <div className="space-y-6">
              {/* Reach Our Team Card */}
              <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-zinc-950 p-6 text-white shadow-xl md:p-8">
                <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#D48035]">
                  Reach Our Team
                </span>
                <h3 className="mt-1 font-heading text-2xl font-bold text-white tracking-tight">
                  Direct Contacts
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-400 font-body">
                  Connect with our central client relations team directly for immediate assistance.
                </p>

                <div className="space-y-4 pt-6">
                  {/* Email contact block */}
                  <a
                    href={`mailto:${contactDetails.emailRaw}`}
                    className="group flex items-start gap-4 p-4 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/10 transition-all duration-300"
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#D48035]/10 text-[#D48035] transition-all group-hover:scale-110 group-hover:bg-[#D48035] group-hover:text-white">
                      <Mail className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Email Us</p>
                      <p className="text-sm font-semibold text-white mt-1 group-hover:text-[#D48035] transition-colors break-all">
                        {contactDetails.email}
                      </p>
                    </div>
                  </a>

                  {/* Phone contact block */}
                  <a
                    href={`tel:${contactDetails.phoneRaw}`}
                    className="group flex items-start gap-4 p-4 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/10 transition-all duration-300"
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#D48035]/10 text-[#D48035] transition-all group-hover:scale-110 group-hover:bg-[#D48035] group-hover:text-white">
                      <Phone className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Call Us</p>
                      <p className="text-sm font-semibold text-white mt-1 group-hover:text-[#D48035] transition-colors">
                        {contactDetails.phone}
                      </p>
                    </div>
                  </a>
                </div>
              </div>

              {/* Info Card */}
              <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-md md:p-8">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-50 text-[#D48035] mb-4">
                  <ArrowUpRight className="h-5 w-5" />
                </div>
                <h4 className="font-heading text-lg font-bold text-[#1F2937] tracking-tight">
                  Global Investment Ecosystem
                </h4>
                <p className="mt-3 text-sm leading-relaxed text-gray-500 font-body">
                  Supporting NRIs, capital providers, builders, businesses, and professional services networks across India and major global markets (US, Middle East, Europe).
                </p>
              </div>
            </div>
          </motion.div>

          {/* Regional Offices Grid */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="mt-16 md:mt-24"
          >
            <div className="mb-8 text-center md:text-left">
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#D48035]">
                Global Office Locations
              </span>
              <h2 className="mt-2 font-heading text-3xl font-extrabold text-[#1F2937] tracking-tight md:text-4xl">
                Connect with our regional teams
              </h2>
              <p className="text-sm text-gray-500 mt-2 font-body max-w-xl">
                Reach specific departments or schedule an in-person meeting at our regional hubs.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {officeLocations.map((loc, i) => (
                <div
                  key={i}
                  className="group flex flex-col justify-between rounded-3xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-xl hover:border-gray-300 transition-all duration-300 hover:-translate-y-1"
                >
                  <div>
                    <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-2xl bg-[#FFF7ED] text-[#D48035] group-hover:bg-[#D48035] group-hover:text-white transition-all duration-300 shadow-inner">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <h3 className="mb-3 font-heading text-lg font-bold text-[#1F2937]">
                      {loc.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-gray-500 font-body min-h-[60px]">
                      {loc.address}
                    </p>
                  </div>

                  <div className="mt-6 border-t border-gray-100 pt-5">
                    {/* Inner office contacts info */}
                    <div className="text-xs font-body space-y-2 text-gray-500 mb-5">
                      {loc.phone && (
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold text-gray-700">Tel:</span>
                          <a href={`tel:${loc.phone.replace(/[^0-9+]/g, "")}`} className="hover:text-[#D48035] hover:underline">
                            {loc.phone}
                          </a>
                        </div>
                      )}
                      {loc.email && (
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold text-gray-700">Email:</span>
                          <a href={`mailto:${loc.email}`} className="hover:text-[#D48035] hover:underline truncate">
                            {loc.email}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
