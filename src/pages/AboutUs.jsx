import React, { useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Shield, Users, Globe, Target, Award, Briefcase, ArrowRight, CheckCircle2 } from 'lucide-react';

const AboutUs = () => {

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <div className="w-full min-h-screen bg-white overflow-x-hidden font-sans">
        <Header />

        {/* --- Hero Section --- */}
        <section className="relative h-[60vh] md:h-[70vh] flex items-center justify-center overflow-hidden mt-[2rem] md:mt-[4rem]">
          {/* Background Image with Overlay */}
          <div
            className="absolute inset-0 z-0"
            style={{
              backgroundImage: 'url(https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <div className="absolute inset-0 bg-blue-900/80"></div>
          </div>

          <div className="container mx-auto px-4 relative z-10 text-center text-white">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Bridging Global Investors <br />
              <span className="text-orange-400">to Indian Real Estate</span>
            </h1>
            <p className="text-lg md:text-xl max-w-2xl mx-auto text-gray-200 leading-relaxed">
              We are India's premier property technology platform dedicated exclusively to helping NRIs and international investors navigate the Indian real estate market with confidence and transparency.
            </p>
            {/*  */}
          </div>
        </section>

        {/* --- Our Story & Mission --- */}
        <section className="py-16 md:py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row gap-12 items-center">

              {/* Text Content */}
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
                <p className="text-gray-600 mb-8 leading-relaxed">
                  We built a platform that removes these barriers. By combining technology with on-ground verification, we ensure that every project listed is legally sound, RERA approved, and vetted by experts. We aren't just a listing site; we are your partners in wealth creation.
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

              {/* Image Content */}
              <div className="w-full md:w-1/2 relative">
                <div className="absolute -top-4 -left-4 w-24 h-24 bg-orange-100 rounded-full -z-10"></div>
                <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-blue-100 rounded-full -z-10"></div>
                <img
                  src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1632&q=80"
                  alt="Team meeting in modern office"
                  className="rounded-2xl shadow-2xl w-full h-auto object-cover"
                />
                {/*  */}
              </div>
            </div>
          </div>
        </section>

        {/* --- Stats Counter --- */}
        <section className="py-12 bg-[#0b264f] text-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-blue-800/50">
              <div className="p-4">
                <div className="text-4xl md:text-5xl font-bold text-orange-400 mb-2">50+</div>
                <div className="text-sm md:text-base text-gray-300">Verified Builders</div>
              </div>
              <div className="p-4">
                <div className="text-4xl md:text-5xl font-bold text-orange-400 mb-2">₹500Cr</div>
                <div className="text-sm md:text-base text-gray-300">Assets Managed</div>
              </div>
              <div className="p-4">
                <div className="text-4xl md:text-5xl font-bold text-orange-400 mb-2">12+</div>
                <div className="text-sm md:text-base text-gray-300">Cities Covered</div>
              </div>
              <div className="p-4">
                <div className="text-4xl md:text-5xl font-bold text-orange-400 mb-2">1000+</div>
                <div className="text-sm md:text-base text-gray-300">Happy Families</div>
              </div>
            </div>
          </div>
        </section>

        {/* --- Core Values --- */}
        <section className="py-16 md:py-24 bg-gray-50">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-[#0b264f] mb-4">Our Core Values</h2>
            <p className="text-gray-600 max-w-2xl mx-auto mb-16">
              Principles that guide every decision we make and every partnership we build.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              {/* Value 1 */}
              <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all border-b-4 border-transparent hover:border-orange-500 group">
                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-blue-600 transition-colors">
                  <Shield className="w-8 h-8 text-blue-600 group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Trust & Transparency</h3>
                <p className="text-gray-500 leading-relaxed">
                  We believe in zero hidden costs. Every document, approval, and price component is disclosed upfront.
                </p>
              </div>

              {/* Value 2 */}
              <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all border-b-4 border-transparent hover:border-orange-500 group">
                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-blue-600 transition-colors">
                  <Award className="w-8 h-8 text-blue-600 group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Excellence</h3>
                <p className="text-gray-500 leading-relaxed">
                  We only list top-tier projects (Grade A developers) to ensure your asset appreciates over time.
                </p>
              </div>

              {/* Value 3 */}
              <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all border-b-4 border-transparent hover:border-orange-500 group">
                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-blue-600 transition-colors">
                  <Users className="w-8 h-8 text-blue-600 group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Customer First</h3>
                <p className="text-gray-500 leading-relaxed">
                  From site visits to registration, our dedicated relationship managers are with you at every step.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* --- Why Choose Us (Checklist) --- */}
        <section className="py-16 md:py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="order-2 md:order-1">
                <h2 className="text-3xl md:text-4xl font-bold text-[#0b264f] mb-6">
                  Why Leading Investors <br /> Choose Investate India
                </h2>
                <div className="space-y-4">
                  {[
                    "Strict Due Diligence Process (30+ Checkpoints)",
                    "End-to-End Legal Assistance & Documentation",
                    "Virtual Site Tours & Real-time Construction Updates",
                    "Dedicated Relationship Manager for Every Investor",
                    "Post-Purchase Property Management Support"
                  ].map((item, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-blue-50 transition-colors">
                      <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700 font-medium">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="order-1 md:order-2">
                {/*  */}
                <img
                  src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1073&q=80"
                  alt="Modern Apartment Building"
                  className="rounded-2xl shadow-xl w-full h-[400px] object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* --- Team Section (Modern Editorial Layout) --- */}
        <section className="py-16 md:py-24 bg-gray-50">
          <div className="container mx-auto px-4">

            {/* Section Header */}
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold text-[#0b264f] mb-4">Meet The Leadership</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Driven by passion, guided by experience, and united by a shared commitment to global real estate excellence.
              </p>
            </div>

            <div className="max-w-6xl mx-auto space-y-8">

              {/* --- BLOCK 1: Pankaj & Atish (Light Theme, Image Left) --- */}
              <div className="flex flex-col lg:flex-row bg-white rounded-3xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100 overflow-hidden">

                {/* Profiles Side */}
                <div className="lg:w-2/5 bg-[#FB923C] p-4 md:p-6 flex items-center justify-center relative overflow-hidden">
                  <div className="flex flex-col sm:flex-row gap-8 md:gap-12 w-full justify-center">
                    {/* Founder 1 */}
                    <div className="text-center group">
                      <div className="w-28 h-28 md:w-32 md:h-32 mx-auto rounded-full mb-4 overflow-hidden border-4 border-white shadow-md transition-transform duration-300 group-hover:scale-105">
                        <img src="/pankaj.png" alt="Pankaj Gupta" className="w-full h-full object-cover" />
                      </div>
                      <h3 className="font-bold text-lg text-gray-900 leading-tight">Pankaj <br />Gupta</h3>
                      <p className="text-white text-xs font-bold tracking-widest uppercase mt-2">Partner</p>
                    </div>

                    {/* Founder 2 */}
                    <div className="text-center group">
                      <div className="w-28 h-28 md:w-32 md:h-32 mx-auto rounded-full mb-4 overflow-hidden border-4 border-white shadow-md transition-transform duration-300 group-hover:scale-105">
                        <img src="/atish.png" alt="Atish Agarwal" className="w-full h-full object-cover" />
                      </div>
                      <h3 className="font-bold text-lg text-gray-900 leading-tight">Atish<br />Agarwal</h3>
                      <p className="text-white text-xs font-bold tracking-widest uppercase mt-2">Partner</p>
                    </div>
                  </div>
                </div>

                {/* Text Side */}
                <div className="lg:w-3/5 p-4 md:p-6 flex flex-col justify-center">
                  <div className="w-12 h-1 bg-orange-500 mb-6 rounded-full"></div>
                  <p className="text-gray-600 leading-relaxed text-[1.05rem]">
                    <strong>Pankaj Gupta</strong> has built a strong presence in the diamond and jewellery industry as a manufacturer, wholesaler and retailer through <strong>Murari Cap Pvt. Ltd.</strong> and <strong>Avik Jewels</strong>, operating across the globe. <br /> <br />
                    He is also well known in the <strong>Hyderabad real estate market</strong> and is a partner in <strong>Swandurga Construction LLP</strong>, which has successfully completed multiple real estate developments, with several projects currently ongoing. <br /> <br />
                    <strong>Atish Agarwal</strong> is an entrepreneur with diversified business interests across <strong>textiles, retail, fashion, jewellery, and real estate advisory.</strong> Through ventures such as <strong>Swastik Tex Hub India LLP, S3-Mart, Simone Jewels, Stitch Hub, and Swastik Realty,</strong> he has built businesses focused on operational discipline, market understanding, and long-term growth. <br /> <br />
                    Together, <strong>Atish Agarwal and Pankaj Gupta</strong> are partners in <strong>Istana Realtors.</strong> They have successfully delivered projects such as <strong>Shree IstanaShree Istana</strong> and <strong>Dev Istana,</strong> and are currently developing new projects including <strong>Vann Istana</strong> and <strong>Green Gold Istana.</strong> <br /> <br />
                    They are widely recognized personalities and established brand names in <strong>Hyderabad across the jewellery, textile, and real estate sectors.</strong>

                  </p>
                </div>

              </div>

              {/* --- BLOCK 2: Deepak Kavadia (Dark Premium Theme, Image Right) --- */}
              <div className="flex flex-col lg:flex-row-reverse bg-white rounded-3xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100 overflow-hidden">

                {/* Profile Side (Dark Navy Background) */}
                <div className="lg:w-2/5 bg-[#0b264f] p-4 md:p-6 flex items-center justify-center relative overflow-hidden">
                  {/* Subtle background decoration */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-blue-800 rounded-full opacity-30 -mr-16 -mt-16"></div>

                  <div className="text-center group relative z-10">
                    <div className="w-32 h-32 md:w-40 md:h-40 mx-auto rounded-full mb-6 overflow-hidden border-4 border-blue-800/50 shadow-xl transition-transform duration-300 group-hover:scale-105">
                      <img src="/deepak.png" alt="Deepak Kavadia" className="w-full h-full object-cover" />
                    </div>
                    <h3 className="font-bold text-2xl text-white mb-1">Deepak Kavadia</h3>
                    <p className="text-orange-400 text-xs font-bold tracking-widest uppercase mt-2">Partner</p>
                    <p className="text-blue-200 text-sm mt-3">New York, USA</p>
                  </div>
                </div>

                {/* Text Side */}
                <div className="lg:w-3/5 p-4 md:p-6 flex flex-col justify-center bg-white">
                  <div className="w-12 h-1 bg-[#0b264f] mb-6 rounded-full"></div>
                  <p className="text-gray-600 leading-relaxed text-[1.05rem]">
                    <strong>Deepak Kavadia,</strong> based in <strong>New York,</strong> is an entrepreneur, real estate investor, and internationally respected gemstone authority with over <strong>three decades of leadership in Manhattan’s Diamond District. </strong> <br /> <br />
                    He is the <strong> Founder of Nice Gems Inc., Nice Jewels Inc., and Prestige Developers LLC. </strong> <br /> <br />
                    He is also the <strong>Founder and Chairman of the NRI Federation,</strong> a global diaspora platform dedicated to strengthening connections between Non-Resident Indians and opportunities in India. <br /> <br />
                    Deepak brings an important international perspective to Investate India, helping NRI investors engage with Indian opportunities through a trusted global interface.
                  </p>
                </div>

              </div>

            </div>
          </div>
        </section>


        {/* --- CTA Section --- */}
        <section className="py-20 bg-[#0b264f] relative overflow-hidden">
          {/* Background decorative circles */}
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
        </section>

        <Footer />
      </div>
    </>
  );
};

export default AboutUs;