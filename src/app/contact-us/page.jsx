"use client";

import React, { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Phone, Mail, MapPin, Send, CheckCircle, Loader2 } from "lucide-react";
import { submitContactInquiry } from "@/api";
import { toast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

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

      <section className="relative mt-[2rem] flex items-center justify-center overflow-hidden bg-[#1F2937] py-14 md:mt-[4rem] md:py-16">
        <div
          className="absolute inset-0 z-0 opacity-20 mix-blend-overlay"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1423666639041-f142fcb9446f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2074&q=80)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        ></div>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#D48035]/20 via-transparent to-[#D48035]/5" />

        <div className="container relative z-10 px-4 text-center text-white">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-4 font-heading text-4xl font-bold text-white drop-shadow-lg md:text-5xl"
          >
            Get in Touch
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mx-auto max-w-3xl font-body text-lg text-gray-300 drop-shadow-md md:text-xl"
          >
            Connect with our team for investment opportunities, builder
            partnerships, professional services, and structured capital
            solutions.
          </motion.p>
        </div>
      </section>

      <section className="relative z-20 bg-[#F8F8F8] py-10 md:py-14">
        <div className="container mx-auto max-w-7xl px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]"
          >
            <div className="rounded-[2rem] border border-gray-200 bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.06)] md:p-8">
              {isSubmitted ? (
                <div className="flex flex-col items-center justify-center rounded-[1.5rem] border border-gray-200 bg-[#F8F8F8] p-10 text-center">
                  <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-50">
                    <CheckCircle className="h-10 w-10 text-green-600" />
                  </div>
                  <h3 className="mb-2 font-heading text-2xl font-bold text-gray-900">
                    Message Sent!
                  </h3>
                  <p className="mx-auto max-w-xs font-body text-gray-500">
                    Thank you for reaching out. Our team will get back to you
                    within 24 hours.
                  </p>
                  <button
                    onClick={() => setIsSubmitted(false)}
                    className="mt-8 font-semibold text-[#D48035] hover:underline font-body"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <span className="text-xs font-bold uppercase tracking-[0.3em] text-[#D48035]">
                      Contact Form
                    </span>
                    <h2 className="font-heading text-3xl font-bold text-[#1F2937] md:text-4xl">
                      Let’s Start a Conversation
                    </h2>
                    <p className="text-sm font-body text-gray-600 md:text-base">
                      Connect with our team for investments, partnerships,
                      capital support, or professional services.
                    </p>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2 md:gap-6">
                    <input
                      required
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-gray-200 bg-[#F8F8F8] px-5 py-4 font-body text-gray-700 placeholder-gray-400 outline-none transition-all focus:border-[#D48035] focus:ring-1 focus:ring-[#D48035]"
                      placeholder="Name"
                    />
                    <input
                      required
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-gray-200 bg-[#F8F8F8] px-5 py-4 font-body text-gray-700 placeholder-gray-400 outline-none transition-all focus:border-[#D48035] focus:ring-1 focus:ring-[#D48035]"
                      placeholder="Email"
                    />
                  </div>

                  <div className="grid gap-4 md:grid-cols-2 md:gap-6">
                    <input
                      required
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-gray-200 bg-[#F8F8F8] px-5 py-4 font-body text-gray-700 placeholder-gray-400 outline-none transition-all focus:border-[#D48035] focus:ring-1 focus:ring-[#D48035]"
                      placeholder="Phone"
                    />
                    <div className="relative">
                      <select
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        className="w-full cursor-pointer appearance-none rounded-xl border border-gray-200 bg-[#F8F8F8] px-5 py-4 font-body text-gray-500 outline-none transition-all focus:border-[#D48035] focus:ring-1 focus:ring-[#D48035]"
                      >
                        <option value="">Select a topic</option>
                        <option value="Investor Inquiry">
                          Investor Inquiry
                        </option>
                        <option value="Builder Partnership">
                          Builder Partnership
                        </option>
                        <option value="Service Provider Partnership">
                          Service Provider Partnership
                        </option>
                        <option value="Capital Sourcing">
                          Capital Sourcing
                        </option>
                        <option value="Existing Investment Support">
                          Existing Investment Support
                        </option>
                        <option value="General Inquiry">General Inquiry</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
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

                  <textarea
                    required
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows="6"
                    className="w-full resize-none rounded-xl border border-gray-200 bg-[#F8F8F8] px-5 py-4 font-body text-gray-700 placeholder-gray-400 outline-none transition-all focus:border-[#D48035] focus:ring-1 focus:ring-[#D48035]"
                    placeholder="Your message here"
                  ></textarea>

                  <div className="flex justify-start">
                    <button
                      type="submit"
                      disabled={isLoading || !isFormValid}
                      className="flex items-center justify-center gap-2 rounded-xl bg-[#1F2937] px-8 py-3.5 text-sm font-bold uppercase tracking-[0.2em] text-white shadow-md transition-all duration-300 hover:bg-[#D48035] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {isLoading ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <Send className="h-4 w-4" />
                      )}
                      {isLoading ? "Sending..." : "Send Message"}
                    </button>
                  </div>
                </form>
              )}
            </div>

            <div className="space-y-6">
              <div className="rounded-[2rem] bg-[#1F2937] p-6 text-white shadow-[0_20px_60px_rgba(15,23,42,0.12)] md:p-8">
                <p className="mb-4 text-xs font-bold uppercase tracking-[0.3em] text-[#D48035]">
                  Reach Our Team
                </p>
                <div className="space-y-5">
                  <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
                    <Mail className="mt-0.5 h-5 w-5 text-[#D48035]" />
                    <div>
                      <p className="text-sm text-gray-300">Email</p>
                      <a
                        href="mailto:investateindia.business@gmail.com"
                        className="text-sm font-semibold text-white transition-colors hover:text-[#D48035]"
                      >
                        investigateindia.business@gmail.com
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
                    <Phone className="mt-0.5 h-5 w-5 text-[#D48035]" />
                    <div>
                      <p className="text-sm text-gray-300">Phone</p>
                      <a
                        href="tel:+914048293000"
                        className="text-sm font-semibold text-white transition-colors hover:text-[#D48035]"
                      >
                        +91 40 4829 3000
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-[2rem] border border-gray-200 bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.06)] md:p-8">
                <h3 className="font-heading text-2xl font-bold text-[#1F2937]">
                  Global Investment Ecosystem
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-gray-600 font-body">
                  Supporting NRIs, investors, builders, businesses, and
                  professional partners across India and international markets.
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-12 md:mt-14"
          >
            <div className="mb-6">
              <span className="text-xs font-bold uppercase tracking-[0.3em] text-[#D48035]">
                Global Office Locations
              </span>
              <h2 className="mt-2 font-heading text-3xl font-bold text-[#1F2937] md:text-4xl">
                Connect with our regional teams
              </h2>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {[
                {
                  title: "Corporate Office (India)",
                  address:
                    "Jubilee Hills, Road No. 36, Hyderabad, Telangana 500033, India",
                  phone: "+91 40 4829 3000",
                  email: "india.office@investateindia.com",
                },
                {
                  title: "United States Office",
                  address:
                    "Valentine Mark Corporation, 55 West 47 Street Suite 425, New York, NY 10036, USA",
                  phone: "+1 212 901 3290",
                  email: "usa.office@investateindia.com",
                },
                {
                  title: "United Kingdom Office",
                  address:
                    "Valentine Mark Ltd, 128 City Road, London, EC1V 2NX, United Kingdom",
                  phone: "+44 20 7946 0958",
                  email: "uk.office@investateindia.com",
                },
                {
                  title: "Middle East Office (UAE)",
                  address:
                    "Valentine Mark DMCC, Marina Plaza, Level 29, Dubai Marina, Dubai, UAE",
                  phone: "+971 4 563 9200",
                  email: "uae.office@investateindia.com",
                },
              ].map((loc, i) => (
                <div
                  key={i}
                  className="flex flex-col justify-between rounded-[1.5rem] border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md"
                >
                  <div>
                    <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-full bg-[#FFF7ED] text-[#D48035]">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <h3 className="mb-3 font-heading text-lg font-bold text-[#1F2937]">
                      {loc.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-gray-600 font-body">
                      {loc.address}
                    </p>
                  </div>
                  <div className="mt-6 border-t border-gray-200 pt-4 text-sm text-gray-500 space-y-1 font-body">
                    <div>
                      <span className="font-semibold text-gray-600">
                        Phone:
                      </span>{" "}
                      {loc.phone}
                    </div>
                    <div>
                      <span className="font-semibold text-gray-600">
                        Email:
                      </span>{" "}
                      {loc.email}
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
