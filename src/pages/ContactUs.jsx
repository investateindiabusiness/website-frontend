import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Phone, Mail, MapPin, Send, Globe, CheckCircle } from 'lucide-react';

const ContactUs = () => {

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate API call
    setTimeout(() => {
      setIsSubmitted(true);
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    }, 1000);
  };

  return (
    <>
      <div className="w-full min-h-screen bg-white overflow-x-hidden font-sans">
        <Header />

        {/* --- Hero Section --- */}
        <section className="relative h-auto flex items-center justify-center overflow-hidden mt-[3rem] md:mt-[5rem] py-16">
          <div 
            className="absolute inset-0 z-0"
            style={{
              backgroundImage: 'url(https://images.unsplash.com/photo-1423666639041-f142fcb9446f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2074&q=80)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <div className="absolute inset-0 bg-[#0b264f]/85"></div>
          </div>

          <div className="container mx-auto px-4 relative z-10 text-center text-white">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">Get in Touch</h1>
            <p className="text-lg md:text-xl max-w-2xl mx-auto text-gray-300">
              Have questions about investing in India? Our expert team is here to guide you through every step.
            </p>
          </div>
        </section>

        {/* --- Main Content --- */}
        <section className="py-16 bg-gray-50 relative z-20">
          <div className="container mx-auto px-4">
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
              <div className="grid grid-cols-1 lg:grid-cols-2">

                {/* Left Side: Contact Info */}
                <div className="bg-[#0b264f] p-10 md:p-14 text-white flex flex-col justify-between relative overflow-hidden">
                  {/* Decorative Circles */}
                  <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-16 -mt-16 pointer-events-none"></div>
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full mr-40 mt-40 pointer-events-none"></div>
                  <div className="absolute bottom-0 left-0 w-40 h-40 bg-orange-500/10 rounded-full -ml-10 -mb-10 pointer-events-none"></div>
                  <div className="absolute bottom-0 left-0 w-20 h-20 bg-orange-500/10 rounded-full ml-24 mb-24 pointer-events-none"></div>

                  <div>
                    <h2 className="text-3xl font-bold mb-6">Contact Information</h2>
                    <p className="text-blue-100 mb-10 leading-relaxed">
                      Whether you are an investor looking for opportunities or a builder wanting to list with us, we are just a message away.
                    </p>

                    <div className="space-y-8">
                      {/* Phone */}
                      <div className="flex items-start gap-4">
                        <div className="bg-white/10 p-3 rounded-lg text-orange-400">
                          <Phone className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="text-xs text-blue-200 uppercase tracking-wider font-semibold mb-1">Call Us</p>
                          <p className="text-lg font-medium">+91 98765 43210</p>
                          <p className="text-sm text-blue-200">Mon-Sat, 9am - 7pm IST</p>
                        </div>
                      </div>

                      {/* Email */}
                      <div className="flex items-start gap-4">
                        <div className="bg-white/10 p-3 rounded-lg text-orange-400">
                          <Mail className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="text-xs text-blue-200 uppercase tracking-wider font-semibold mb-1">Email Us</p>
                          <p className="text-lg font-medium">info@investateindia.com</p>
                        </div>
                      </div>

                      {/* Address */}
                      <div className="flex items-start gap-4">
                        <div className="bg-white/10 p-3 rounded-lg text-orange-400">
                          <MapPin className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="text-xs text-blue-200 uppercase tracking-wider font-semibold mb-1">Head Office</p>
                          <p className="text-lg font-medium leading-snug">
                            Investate Tech Park, Sector 42,<br />
                            Gurugram, Haryana, India - 122002
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-12 pt-8 border-t border-white/10 flex gap-4">
                    <Globe className="w-5 h-5 text-gray-400" />
                    <span className="text-sm text-gray-400">Serving Investors in 15+ Countries</span>
                  </div>
                </div>

                {/* Right Side: Contact Form */}
                <div className="p-10 md:p-14 bg-white">
                  {isSubmitted ? (
                    <div className="h-full flex flex-col items-center justify-center text-center py-10">
                      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                        <CheckCircle className="w-10 h-10 text-green-600" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">Message Sent!</h3>
                      <p className="text-gray-500 max-w-xs mx-auto">
                        Thank you for reaching out. Our team will get back to you within 24 hours.
                      </p>
                      <button 
                        onClick={() => setIsSubmitted(false)}
                        className="mt-8 text-orange-600 font-semibold hover:underline"
                      >
                        Send another message
                      </button>
                    </div>
                  ) : (
                    <>
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">Send us a Message</h2>
                      <p className="text-gray-500 mb-8">Fill out the form below and we'll start the conversation.</p>
                      
                      <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Full Name</label>
                            <input 
                              required
                              type="text" 
                              name="name"
                              value={formData.name}
                              onChange={handleChange}
                              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all bg-gray-50 focus:bg-white"
                              placeholder="John Doe"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Phone Number</label>
                            <input 
                              required
                              type="tel" 
                              name="phone"
                              value={formData.phone}
                              onChange={handleChange}
                              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all bg-gray-50 focus:bg-white"
                              placeholder="+91 ..."
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">Email Address</label>
                          <input 
                            required
                            type="email" 
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all bg-gray-50 focus:bg-white"
                            placeholder="john@example.com"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">I am interested in</label>
                          <select 
                            name="subject"
                            value={formData.subject}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all bg-gray-50 focus:bg-white text-gray-600"
                          >
                            <option value="">Select an option</option>
                            <option value="buy">Buying Property</option>
                            <option value="partner">Partnering with Investate</option>
                            <option value="support">Existing Investment Support</option>
                            <option value="other">Other Inquiry</option>
                          </select>
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">Message</label>
                          <textarea 
                            required
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            rows="4"
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all bg-gray-50 focus:bg-white resize-none"
                            placeholder="Tell us more about your requirements..."
                          ></textarea>
                        </div>

                        <button 
                          type="submit"
                          className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-4 rounded-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
                        >
                          <Send className="w-5 h-5" />
                          Send Message
                        </button>
                      </form>
                    </>
                  )}
                </div>

              </div>
            </div>
          </div>
        </section>

        {/* --- Map Section --- */}
        <section className="h-96 w-full bg-gray-200 relative">
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d3671.9119536680055!2d72.486191!3d23.0270048!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14070c84bcea07e3%3A0xe5d0914702127182!2sFibre2Fashion!5e0!3m2!1sen!2sin!4v1770813929820!5m2!1sen!2sin" 
            width="100%" 
            height="100%" 
            style={{ border: 0 }} 
            allowFullScreen="" 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
            title="Investate Office Location"
          ></iframe>
          
          {/* Map Overlay Card */}
          <div className="absolute bottom-4 left-4 md:bottom-10 md:left-10 bg-white p-4 rounded-lg shadow-lg max-w-xs hidden sm:block">
            <p className="font-bold text-gray-900 text-sm">Investate India HQ</p>
            <p className="text-xs text-gray-500 mt-1">Visit us for a coffee and discuss your portfolio.</p>
            <a 
              href="https://maps.google.com" 
              target="_blank" 
              rel="noreferrer"
              className="text-xs text-orange-600 font-bold mt-2 inline-block hover:underline"
            >
              Get Directions
            </a>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default ContactUs;