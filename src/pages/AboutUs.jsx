import React, { useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { 
  Shield, 
  Users, 
  Globe, 
  Target, 
  Award, 
  Briefcase, 
  ArrowRight, 
  CheckCircle2 
} from 'lucide-react';

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
        <section className="relative h-[60vh] md:h-[70vh] flex items-center justify-center overflow-hidden mt-16">
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

        {/* --- Team Section (Optional) --- */}
        <section className="py-16 bg-gray-50">
           <div className="container mx-auto px-4 text-center">
            <div className="text-center mb-12">
               <h2 className="text-3xl md:text-4xl font-bold text-[#0b264f] mb-4">Meet The Leadership</h2>
               <p className="text-gray-600">Driven by passion, guided by experience.</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {/* Member 1 */}
              <div className="bg-white p-6 rounded-xl shadow-md text-center">
                <div className="w-24 h-24 mx-auto bg-gray-200 rounded-full mb-4 overflow-hidden">
                  <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="CEO" className="w-full h-full object-cover" />
                </div>
                <h3 className="font-bold text-lg text-gray-900">Rajesh Verma</h3>
                <p className="text-orange-600 text-sm font-medium mb-2">Founder & CEO</p>
                <p className="text-gray-500 text-sm">Ex-Investment Banker with 15 years in Real Estate.</p>
              </div>

              {/* Member 2 */}
              <div className="bg-white p-6 rounded-xl shadow-md text-center">
                <div className="w-24 h-24 mx-auto bg-gray-200 rounded-full mb-4 overflow-hidden">
                  <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="CTO" className="w-full h-full object-cover" />
                </div>
                <h3 className="font-bold text-lg text-gray-900">Priya Sharma</h3>
                <p className="text-orange-600 text-sm font-medium mb-2">Head of Operations</p>
                <p className="text-gray-500 text-sm">Expert in Legal Compliance and NRI Frameworks.</p>
              </div>

              {/* Member 3 */}
              <div className="bg-white p-6 rounded-xl shadow-md text-center">
                <div className="w-24 h-24 mx-auto bg-gray-200 rounded-full mb-4 overflow-hidden">
                  <img src="https://randomuser.me/api/portraits/men/85.jpg" alt="COO" className="w-full h-full object-cover" />
                </div>
                <h3 className="font-bold text-lg text-gray-900">Amit Patel</h3>
                <p className="text-orange-600 text-sm font-medium mb-2">Head of Sales</p>
                <p className="text-gray-500 text-sm">Helping 500+ families find their dream homes.</p>
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