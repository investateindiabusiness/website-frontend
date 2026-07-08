"use client";

import React, { useEffect, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Phone, Mail, MapPin, Send, CheckCircle, Loader2 } from 'lucide-react';
import { submitContactInquiry } from '@/api';
import { toast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';

export default function ContactUs() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const isFormValid =
    formData.name.trim() !== '' &&
    formData.phone.trim() !== '' &&
    formData.email.trim() !== '' &&
    formData.subject !== '' &&
    formData.message.trim() !== '';

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
        description: `Please fill in the required fields: ${missingFields.join(', ')}`,
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      await submitContactInquiry(formData);
      setIsSubmitted(true);
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to send message.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#F8F8F8] overflow-x-hidden font-sans">
      <Header />

      {/* Hero Section */}
      <section className="relative h-auto flex items-center justify-center bg-[#1F2937] overflow-hidden mt-[2rem] md:mt-[4rem] py-20">
        <div
          className="absolute inset-0 z-0 opacity-20 mix-blend-overlay"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1423666639041-f142fcb9446f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2074&q=80)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-br from-[#D48035]/20 via-transparent to-[#D48035]/5 pointer-events-none" />

        <div className="container mx-auto px-4 relative z-10 text-center text-white">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-6xl font-bold mb-4 text-white drop-shadow-lg font-heading"
          >
            Get in Touch
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl max-w-2xl mx-auto text-gray-300 drop-shadow-md font-body"
          >
            Have questions about investing in India? Our expert team is here to guide you through every step.
          </motion.p>
        </div>
      </section>

      {/* Contact Content Section */}
      <section className="py-20 bg-white relative z-20">
        <div className="container mx-auto px-4 max-w-6xl">
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center text-center mb-8"
          >
            <div className="flex flex-col items-center mb-6">
              <span className="text-xs uppercase tracking-widest text-[#D48035] font-bold mb-2">QUICK CONTACT</span>
              <div className="w-12 h-[2px] bg-[#D48035]"></div>
            </div>

            <h2 className="text-4xl md:text-5xl font-bold text-[#1F2937] mb-6 leading-tight tracking-tight font-heading">
              Have Questions?<br />
              Don't Hesitate to Contact Us
            </h2>

            <p className="text-gray-500 mb-12 leading-relaxed text-base max-w-3xl font-body">
              Investate India is here to guide you through every step of your international journey.
              Whether you are looking for high-yield property investments, legal guidance, or developer partnerships, our experts are ready to assist you.
            </p>

            {/* Email and Phone side-by-side */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full text-left pt-10 border-t border-gray-100">
              <div className="flex items-start gap-6 bg-[#F8F8F8] p-6 rounded-2xl border border-gray-200 hover:shadow-md transition-all duration-300">
                <div className="text-[#D48035] mt-1 flex-shrink-0">
                  <Mail className="w-10 h-10 stroke-[1.25]" />
                </div>
                <div className="border-l border-[#D48035]/30 pl-6">
                  <h3 className="text-lg font-bold text-[#1F2937] mb-1 font-heading">Email Us</h3>
                  <p className="text-gray-500 mb-2 text-xs font-body">For partnerships & general inquiries:</p>
                  <a
                    href="mailto:investateindia.business@gmail.com"
                    className="text-gray-700 text-sm font-semibold hover:text-[#D48035] transition-colors duration-200 break-all font-body"
                  >
                    investateindia.business@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-6 bg-[#F8F8F8] p-6 rounded-2xl border border-gray-200 hover:shadow-md transition-all duration-300">
                <div className="text-[#D48035] mt-1 flex-shrink-0">
                  <Phone className="w-10 h-10 stroke-[1.25]" />
                </div>
                <div className="border-l border-[#D48035]/30 pl-6">
                  <h3 className="text-lg font-bold text-[#1F2937] mb-1 font-heading">Call Us</h3>
                  <p className="text-gray-500 mb-2 text-xs font-body">Speak with our relationships manager:</p>
                  <a
                    href="tel:+914048293000"
                    className="text-gray-700 text-sm font-semibold hover:text-[#D48035] transition-colors duration-200 font-body"
                  >
                    +91 40 4829 3000
                  </a>
                </div>
              </div>
            </div>
          </motion.div>

          <hr className="border-gray-100 my-8" />

          {/* Centered Global Office Locations */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-full mb-16"
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-5xl font-bold text-[#1F2937] mb-4 font-heading">
                Global Office Locations
              </h2>
              <p className="text-gray-500 max-w-xl mx-auto text-sm md:text-base font-body">
                Visit our offices or connect with our regional teams across the globe for specialized assistance.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  title: "Corporate Office (India)",
                  address: "Jubilee Hills, Road No. 36, Hyderabad, Telangana 500033, India",
                  phone: "+91 40 4829 3000",
                  email: "india.office@investateindia.com",
                },
                {
                  title: "United States Office",
                  address: "Valentine Mark Corporation, 55 West 47 Street Suite 425, New York, NY 10036, USA",
                  phone: "+1 212 901 3290",
                  email: "usa.office@investateindia.com",
                },
                {
                  title: "United Kingdom Office",
                  address: "Valentine Mark Ltd, 128 City Road, London, EC1V 2NX, United Kingdom",
                  phone: "+44 20 7946 0958",
                  email: "uk.office@investateindia.com",
                },
                {
                  title: "Middle East Office (UAE)",
                  address: "Valentine Mark DMCC, Marina Plaza, Level 29, Dubai Marina, Dubai, UAE",
                  phone: "+971 4 563 9200",
                  email: "uae.office@investateindia.com",
                }
              ].map((loc, i) => (
                <div key={i} className="bg-[#F8F8F8] rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
                  <div>
                    <div className="w-10 h-10 rounded-full bg-[#FFF7ED] flex items-center justify-center text-[#D48035] mb-6">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <h3 className="text-lg font-bold text-[#1F2937] mb-3 font-heading">{loc.title}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed mb-6 font-body">{loc.address}</p>
                  </div>
                  <div className="pt-4 border-t border-gray-200 text-xs text-gray-400 space-y-1 font-body">
                    <div><span className="font-semibold text-gray-500">Phone:</span> {loc.phone}</div>
                    <div><span className="font-semibold text-gray-500">Email:</span> {loc.email}</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <hr className="border-gray-100 my-16" />

          {/* Centered Message Form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-col items-center w-full max-w-2xl mx-auto"
          >
            <div className="flex flex-col items-center mb-6">
              <span className="text-xs uppercase tracking-widest text-[#D48035] font-bold mb-2">LET'S CONNECT</span>
              <div className="w-12 h-[2px] bg-[#D48035]"></div>
            </div>

            <h2 className="text-3xl md:text-4xl font-bold text-[#1F2937] mb-6 leading-tight tracking-tight text-center font-heading">
              Send Your Message
            </h2>

            <p className="text-gray-500 mb-10 leading-relaxed text-sm md:text-base text-center max-w-lg font-body">
              Have a specific query? Send us a message and our team will get back to you within 24 hours.
            </p>

            <div className="w-full">
              {isSubmitted ? (
                <div className="bg-[#F8F8F8] rounded-2xl p-10 flex flex-col items-center justify-center text-center border border-gray-200 shadow-sm">
                  <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle className="w-10 h-10 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2 font-heading">Message Sent!</h3>
                  <p className="text-gray-500 max-w-xs mx-auto font-body">
                    Thank you for reaching out. Our team will get back to you within 24 hours.
                  </p>
                  <button
                    onClick={() => setIsSubmitted(false)}
                    className="mt-8 text-[#D48035] font-semibold hover:underline font-body"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6 w-full">
                  <div className="grid md:grid-cols-2 gap-6">
                    <input
                      required
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-6 py-4 bg-[#F8F8F8] border border-transparent outline-none focus:border-[#D48035] focus:ring-1 focus:ring-[#D48035] text-gray-700 placeholder-gray-400 transition-all rounded-lg font-body"
                      placeholder="Name"
                    />
                    <input
                      required
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-6 py-4 bg-[#F8F8F8] border border-transparent outline-none focus:border-[#D48035] focus:ring-1 focus:ring-[#D48035] text-gray-700 placeholder-gray-400 transition-all rounded-lg font-body"
                      placeholder="Email"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <input
                      required
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-6 py-4 bg-[#F8F8F8] border border-transparent outline-none focus:border-[#D48035] focus:ring-1 focus:ring-[#D48035] text-gray-700 placeholder-gray-400 transition-all rounded-lg font-body"
                      placeholder="Phone"
                    />
                    <div className="relative">
                      <select
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        className="w-full px-6 py-4 bg-[#F8F8F8] border border-transparent outline-none focus:border-[#D48035] focus:ring-1 focus:ring-[#D48035] text-gray-500 transition-all rounded-lg appearance-none cursor-pointer font-body"
                      >
                        <option value="">Subject</option>
                        <option value="Buying Property">Buying Property</option>
                        <option value="Listing as Builder">Listing as Builder</option>
                        <option value="Existing Investment Support">Existing Investment Support</option>
                        <option value="Other Inquiry">Other Inquiry</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
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
                    className="w-full px-6 py-4 bg-[#F8F8F8] border border-transparent outline-none focus:border-[#D48035] focus:ring-1 focus:ring-[#D48035] text-gray-700 placeholder-gray-400 transition-all resize-none rounded-lg font-body"
                    placeholder="Your message here"
                  ></textarea>

                  <div className="flex justify-center">
                    <button
                      type="submit"
                      disabled={isLoading || !isFormValid}
                      className="bg-[#1F2937] hover:bg-[#D48035] text-white font-bold py-4 px-10 transition-all duration-300 flex items-center justify-center gap-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider text-sm shadow-md font-body"
                    >
                      {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-4 h-4" />}
                      {isLoading ? 'Sending...' : 'Send Message'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </motion.div>

        </div>
      </section>

      <Footer />
    </div>
  );
}
