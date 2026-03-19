import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Phone, Mail, MapPin, Send, Globe, CheckCircle, Loader2 } from 'lucide-react';
import { submitContactInquiry } from '@/api'; // <-- Import the API
import { toast } from '@/hooks/use-toast';

const ContactUs = () => {

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

  // Wired up to the real backend API
  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. Check for missing fields
    const missingFields = [];
    if (!formData.name.trim()) missingFields.push("Full Name");
    if (!formData.phone.trim()) missingFields.push("Phone Number");
    if (!formData.email.trim()) missingFields.push("Email Address");
    if (!formData.subject) missingFields.push("I am interested in");
    if (!formData.message.trim()) missingFields.push("Message");

    // 2. If any fields are missing, show a toast error and stop submission
    if (missingFields.length > 0) {
      toast({
        title: "Validation Error",
        description: `Please fill in the required fields: ${missingFields.join(', ')}`,
        variant: "destructive"
      });
      return; // Stop here, do not submit
    }

    // 3. Proceed with API call if all fields are valid
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
    <>
      <div className="w-full min-h-screen bg-white overflow-x-hidden font-sans">
        <Header />

        {/* --- Hero Section --- */}
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
            <p className="text-lg md:text-xl max-w-2xl mx-auto text-[#4b5563]">
              Have questions about investing in India? Our expert team is here to guide you through every step.
            </p>
          </div>
        </section>

        {/* --- Main Content --- */}
        <section className="p-16 bg-[#e1dcd9] relative z-20">
          <div className="container mx-auto px-4">
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
              <div className="grid grid-cols-1 lg:grid-cols-2">

                {/* Left Side: Contact Info */}
                <div className="bg-[#1f2937] p-10 md:p-14 text-white flex flex-col justify-between relative overflow-hidden">
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
                      {/* Email */}
                      <div className="flex items-start gap-4">
                        <div className="bg-white/10 p-3 rounded-lg text-orange-400">
                          <Mail className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="text-xs text-blue-200 uppercase tracking-wider font-semibold mb-1">Email Us</p>
                          <p className="text-lg font-medium">investateindia.business@gmail.com</p>
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
                            Hyderabad, India < br />
                            New York, USA
                          </p>
                        </div>
                      </div>
                    </div>
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
                              placeholder="+91 98765 43210"
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
                            <option value="Buying Property">Buying Property</option>
                            <option value="Partnering with Investate">Partnering with Investate</option>
                            <option value="Existing Investment Support">Existing Investment Support</option>
                            <option value="Other Inquiry">Other Inquiry</option>
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
                          disabled={isLoading || !isFormValid}
                          className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-4 rounded-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-orange-600 disabled:hover:shadow-lg"
                        >
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
    </>
  );
};

export default ContactUs;