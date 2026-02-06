import React, { useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { 
  Lock, 
  Eye, 
  Share2, 
  Cookie, 
  ShieldCheck, 
  Globe, 
  UserCheck, 
  ExternalLink,
  Mail
} from 'lucide-react';

const PrivacyPolicy = () => {

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Shared Styles (Matching T&C Page)
  const sectionTitleStyle = "text-xl md:text-2xl font-bold text-gray-900 mt-10 mb-4 flex items-center gap-2";
  const subSectionTitleStyle = "text-lg font-semibold text-gray-800 mt-6 mb-2";
  const paragraphStyle = "text-gray-600 leading-relaxed mb-4";
  const listStyle = "list-disc pl-6 space-y-2 text-gray-600 mb-6 marker:text-orange-500";

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 font-sans">
      <Header />

      {/* Page Header */}
      <div className="bg-[#2A1B15] text-white py-16 md:py-24 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-900/40 via-[#2A1B15] to-[#1a100c] z-0"></div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-orange-500/20 mb-6 text-orange-500">
             <Lock className="h-8 w-8" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Your privacy is important to us. Learn how we collect, use, and protect your information.
          </p>
        </div>
      </div>

      {/* Content Container */}
      <div className="flex-grow container mx-auto px-4 py-12 -mt-10 relative z-20">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-xl border border-gray-100 p-8 md:p-12">
          
          <div className="border-b border-gray-100 pb-6 mb-8">
            <p className="text-sm text-gray-500 italic">
              Last Updated: {new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
            <p className="mt-4 text-gray-700 font-medium text-lg">
              Welcome to Investate India. By accessing or using our platform, you agree to this Privacy Policy.
            </p>
          </div>

          {/* 1. Information We Collect */}
          <section>
            <h2 className={sectionTitleStyle}>1. Information We Collect</h2>
            
            <h3 className={subSectionTitleStyle}>A. Account Information (Investors & Builders)</h3>
            <p className={paragraphStyle}>When you register or log in, we collect:</p>
            <ul className={listStyle}>
              <li>Name, Email address, and Phone/WhatsApp number.</li>
              <li>Country/location.</li>
              <li>Account type (Investor/Builder).</li>
              <li>Company or builder details (for builders).</li>
            </ul>

            <h3 className={subSectionTitleStyle}>B. Property & Listing Data (Builders)</h3>
            <ul className={listStyle}>
              <li>Property details, Pricing, and Project information.</li>
              <li>Images and visual assets.</li>
              <li>Documents submitted for verification purposes.</li>
            </ul>

            <h3 className={subSectionTitleStyle}>C. Communication Data</h3>
            <p className={paragraphStyle}>
              When you use website chat, contact forms, or Email/WhatsApp links, we may store messages, inquiries, and conversation history for service quality and dispute resolution.
            </p>

            <h3 className={subSectionTitleStyle}>D. Technical & Usage Data</h3>
            <p className={paragraphStyle}>
              We collect IP address, browser/device information, cookies, pages visited, and interaction behavior to improve user experience.
            </p>
          </section>

          {/* 2. How We Use Your Information */}
          <section>
            <h2 className={sectionTitleStyle}>
              2. How We Use Your Information
            </h2>
            <p className={paragraphStyle}>We use your information to:</p>
            <ul className="grid md:grid-cols-2 gap-x-4 gap-y-2 text-gray-600 mb-6">
              <li className="flex items-start gap-2"><span className="text-orange-500">•</span> Create and manage accounts</li>
              <li className="flex items-start gap-2"><span className="text-orange-500">•</span> Verify builders before publishing</li>
              <li className="flex items-start gap-2"><span className="text-orange-500">•</span> Display property listings</li>
              <li className="flex items-start gap-2"><span className="text-orange-500">•</span> Enable investor-builder chat</li>
              <li className="flex items-start gap-2"><span className="text-orange-500">•</span> Respond to inquiries</li>
              <li className="flex items-start gap-2"><span className="text-orange-500">•</span> Prevent fraud or misuse</li>
              <li className="flex items-start gap-2"><span className="text-orange-500">•</span> Send important service updates</li>
              <li className="flex items-start gap-2"><span className="text-orange-500">•</span> Comply with legal requirements</li>
            </ul>
          </section>

          {/* 3. Information Sharing */}
          <section>
            <h2 className={sectionTitleStyle}>
              3. Information Sharing
            </h2>
            <p className={paragraphStyle}>We may share data:</p>
            <ul className={listStyle}>
              <li>Between investors and builders when a specific inquiry is made.</li>
              <li>With trusted service providers (hosting, analytics, email tools).</li>
              <li>With authorities if legally required.</li>
            </ul>
            <p className="font-semibold text-gray-800 border-l-4 border-orange-500 pl-4 py-1 bg-gray-50">
              We never sell your personal data to third parties.
            </p>
          </section>

          {/* 4. Cookies & Tracking */}
          <section>
            <h2 className={sectionTitleStyle}>
              4. Cookies & Tracking
            </h2>
            <p className={paragraphStyle}>
              We use cookies to remember login sessions, improve performance, and analyze traffic. You may disable cookies in your browser settings at any time.
            </p>
          </section>

          {/* 5. Data Security */}
          <section>
            <h2 className={sectionTitleStyle}>
              5. Data Security
            </h2>
            <p className={paragraphStyle}>
              We use reasonable administrative and technical safeguards to protect data. However, please note that no internet system is completely secure.
            </p>
          </section>

          {/* 6. International Users */}
          <section>
            <h2 className={sectionTitleStyle}>
              6. International Users
            </h2>
            <p className={paragraphStyle}>
              As our platform serves international investors, your data may be processed or stored in India or other countries where our services operate. By using the platform, you consent to this transfer.
            </p>
          </section>

          {/* 7. Your Rights */}
          <section>
            <h2 className={sectionTitleStyle}>
              7. Your Rights
            </h2>
            <p className={paragraphStyle}>You may request to:</p>
            <ul className={listStyle}>
              <li>Access your personal data.</li>
              <li>Update or correct inaccurate information.</li>
              <li>Delete your account completely.</li>
              <li>Opt-out of marketing communications.</li>
            </ul>
          </section>

          {/* 8. Third-Party Links */}
          <section>
            <h2 className={sectionTitleStyle}>
              8. Third-Party Links
            </h2>
            <p className={paragraphStyle}>
              We may provide links to WhatsApp, email providers, or external sites. We are not responsible for the privacy practices or content of these third-party services.
            </p>
          </section>

          {/* 9. Updates */}
          <section>
            <h2 className={sectionTitleStyle}>9. Updates to Policy</h2>
            <p className={paragraphStyle}>
              We may update this policy at any time. The "Last Updated" date at the top of this page will reflect the most recent revisions. Continued use of the platform signifies your acceptance of these changes.
            </p>
          </section>

          {/* 10. Contact */}
          <section className="mt-12 bg-orange-50 p-6 rounded-xl border border-orange-100 text-center">
            <h2 className="text-xl font-bold text-gray-900 mb-2 flex items-center justify-center gap-2">
              <Mail className="w-5 h-5" />Contact Us
            </h2>
            <p className="text-gray-600 mb-4">
              If you have any questions about this Privacy Policy, please contact us at:
            </p>
            <a href="mailto:info@investateindia.com" className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 transition-colors">
              info@investateindia.com
            </a>
          </section>

        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PrivacyPolicy;