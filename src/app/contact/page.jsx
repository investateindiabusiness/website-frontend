"use client";

import React, { useEffect, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Mail, MapPin, Send, CheckCircle, Loader2 } from 'lucide-react';
import { submitContactInquiry } from '@/api';
import { toast } from '@/hooks/use-toast';

export default function ContactUs() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', subject: '', message: ''
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const isFormValid = formData.name.trim() !== '' && formData.phone.trim() !== '' && formData.email.trim() !== '' && formData.subject !== '' && formData.message.trim() !== '';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await submitContactInquiry(formData);
      setIsSubmitted(true);
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (error) {
      toast({ title: "Error", description: error.message || "Failed to send message.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-white overflow-x-hidden font-sans">
      <Header />
      <section className="relative h-auto flex items-center justify-center bg-[#d9d4d0] overflow-hidden mt-[2rem] md:mt-[4rem] py-16">
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1423666639041-f142fcb9446f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2074&q=80)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        ></div>
        <div className="container mx-auto px-4 relative z-10 text-center text-white">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 text-[#1f2937]">Get in Touch</h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto text-[#4b5563]">Have questions about investing in India? Our expert team is here to guide you.</p>
        </div>
      </section>

      <section className="p-2 md:p-16 bg-[#e1dcd9] relative z-20">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="bg-[#1f2937] p-10 md:p-14 text-white flex flex-col justify-between relative overflow-hidden">
                <div>
                  <h2 className="text-3xl font-bold mb-6">Contact Information</h2>
                  <div className="space-y-8">
                    <div className="flex items-start gap-4">
                      <div className="bg-white/10 p-3 rounded-lg text-orange-400"><Mail className="w-6 h-6" /></div>
                      <div>
                        <p className="text-xs text-blue-200 uppercase font-semibold mb-1">Email Us</p>
                        <a href="mailto:investateindia.business@gmail.com" className="text-[14px] min-[375px]:text-base md:text-lg font-medium hover:text-orange-400 transition-colors whitespace-nowrap">
                          investateindia.business@gmail.com
                        </a>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="bg-white/10 p-3 rounded-lg text-orange-400"><MapPin className="w-6 h-6" /></div>
                      <div>
                        <p className="text-xs text-blue-200 uppercase font-semibold mb-1">Head Office</p>
                        <p className="text-lg font-medium leading-snug">Hyderabad, India <br /> New York, USA</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-10 md:p-14 bg-white">
                {isSubmitted ? (
                  <div className="text-center py-10">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6 mx-auto"><CheckCircle className="w-10 h-10 text-green-600" /></div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Message Sent!</h3>
                    <p className="text-gray-500">Our team will get back to you within 24 hours.</p>
                    <button onClick={() => setIsSubmitted(false)} className="mt-8 text-orange-600 font-semibold hover:underline">Send another message</button>
                  </div>
                ) : (
                  <>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Send us a Message</h2>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <input required name="name" value={formData.name} onChange={handleChange} className="w-full px-4 py-3 rounded-lg border bg-gray-50 outline-none" placeholder="Full Name" />
                        <input required name="phone" value={formData.phone} onChange={handleChange} className="w-full px-4 py-3 rounded-lg border bg-gray-50 outline-none" placeholder="Phone Number" />
                      </div>
                      <input required type="email" name="email" value={formData.email} onChange={handleChange} className="w-full px-4 py-3 rounded-lg border bg-gray-50 outline-none" placeholder="Email Address" />
                      <select name="subject" value={formData.subject} onChange={handleChange} className="w-full px-4 py-3 rounded-lg border bg-gray-50 outline-none text-gray-600">
                        <option value="">Select an option</option>
                        <option value="Buying Property">Buying Property</option>
                        <option value="Listing as Builder">Listing as Builder</option>
                        <option value="Other Inquiry">Other Inquiry</option>
                      </select>
                      <textarea required name="message" value={formData.message} onChange={handleChange} rows="4" className="w-full px-4 py-3 rounded-lg border bg-gray-50 outline-none resize-none" placeholder="Message"></textarea>
                      <button type="submit" disabled={isLoading || !isFormValid} className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-4 rounded-lg flex items-center justify-center gap-2 disabled:opacity-50">
                        {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                        {isLoading ? 'Sending...' : 'Send Message'}
                      </button>
                    </form>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
