import React, { useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ScrollText, Shield, AlertCircle, Scale } from 'lucide-react';

const TearmsAndCondition = () => {

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const sectionTitleStyle = "text-xl md:text-2xl font-bold text-gray-900 mt-10 mb-4 flex items-center gap-2";
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
             <ScrollText className="h-8 w-8" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Terms and Conditions</h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Please read these terms carefully before using the Investate India platform.
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
              These Terms govern your use of Investate India. By registering or using the platform, you agree to comply with these Terms.
            </p>
          </div>

          {/* 1. Platform Nature */}
          <section>
            <h2 className={sectionTitleStyle}>1. Platform Nature</h2>
            <p className={paragraphStyle}>
              Investate India is a technology platform only.
            </p>
            
            <div className="grid md:grid-cols-2 gap-6 my-6">
              <div className="bg-green-50 p-6 rounded-lg border border-green-100">
                <h3 className="font-bold text-green-800 mb-3">We Do:</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2"><span className="text-green-600 font-bold">✓</span> Display verified property listings</li>
                  <li className="flex items-start gap-2"><span className="text-green-600 font-bold">✓</span> Provide dashboards for investors and builders</li>
                  <li className="flex items-start gap-2"><span className="text-green-600 font-bold">✓</span> Enable direct communication</li>
                </ul>
              </div>
              <div className="bg-red-50 p-6 rounded-lg border border-red-100">
                <h3 className="font-bold text-red-800 mb-3">We DO NOT:</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2"><span className="text-red-600 font-bold">✕</span> Sell properties directly</li>
                  <li className="flex items-start gap-2"><span className="text-red-600 font-bold">✕</span> Act as broker/agent</li>
                  <li className="flex items-start gap-2"><span className="text-red-600 font-bold">✕</span> Handle financial transactions</li>
                  <li className="flex items-start gap-2"><span className="text-red-600 font-bold">✕</span> Guarantee investments</li>
                </ul>
              </div>
            </div>
            <p className="text-sm text-gray-500 italic border-l-4 border-orange-500 pl-4 py-1 bg-gray-50">
              All dealings occur directly between investors and builders.
            </p>
          </section>

          {/* 2. User Accounts */}
          <section>
            <h2 className={sectionTitleStyle}>2. User Accounts</h2>
            <p className={paragraphStyle}>Users must:</p>
            <ul className={listStyle}>
              <li>Provide accurate information during registration.</li>
              <li>Keep login credentials secure and confidential.</li>
              <li>Not impersonate others or create fake profiles.</li>
            </ul>
            <p className={paragraphStyle}>We may suspend accounts for misuse at our discretion.</p>
          </section>

          {/* 3. Builder Responsibilities */}
          <section>
            <h2 className={sectionTitleStyle}>3. Builder Responsibilities</h2>
            <p className={paragraphStyle}>Builders agree to:</p>
            <ul className={listStyle}>
              <li>Provide true and accurate property information.</li>
              <li>Upload only authorized listings they own or represent.</li>
              <li>Comply with Indian real estate laws (RERA, etc.).</li>
              <li>Avoid misleading claims regarding returns or completion dates.</li>
            </ul>
            <p className={paragraphStyle}>Investate India reserves the right to remove listings that violate policies.</p>
          </section>

          {/* 4. Investor Responsibilities */}
          <section>
            <h2 className={sectionTitleStyle}>4. Investor Responsibilities</h2>
            <p className={paragraphStyle}>Investors agree to:</p>
            <ul className={listStyle}>
              <li>Conduct independent due diligence before investing.</li>
              <li>Verify legal documents, titles, and approvals.</li>
              <li>Consult legal/financial advisors for compliance and risk assessment.</li>
            </ul>
          </section>

          {/* 5. Verification Disclaimer */}
          <section>
            <h2 className={sectionTitleStyle}>
              5. Verification Disclaimer
            </h2>
            <p className={paragraphStyle}>
              While we may perform basic builder verification, <strong>we do not guarantee:</strong>
            </p>
            <ul className={listStyle}>
              <li>Legality of projects.</li>
              <li>Government approvals or clearances.</li>
              <li>Financial returns (ROI).</li>
              <li>Completion timelines.</li>
              <li>Builder performance or solvency.</li>
            </ul>
          </section>

          {/* 6. Communication Tools */}
          <section>
            <h2 className={sectionTitleStyle}>6. Communication Tools</h2>
            <p className={paragraphStyle}>
              Chat, email, or WhatsApp communication integration is provided for convenience only. We are not responsible for:
            </p>
            <ul className={listStyle}>
              <li>Miscommunication between parties.</li>
              <li>Agreements made privately outside the platform.</li>
              <li>Off-platform transactions or payments.</li>
            </ul>
          </section>

          {/* 7. Fees & Future Charges */}
          <section>
            <h2 className={sectionTitleStyle}>7. Fees & Future Charges</h2>
            <p className={paragraphStyle}>
              Currently, the platform is free. However, Investate India reserves the right to introduce:
            </p>
            <ul className={listStyle}>
              <li>Listing fees for builders.</li>
              <li>Subscription plans for premium features.</li>
              <li>Commissions or success fees.</li>
            </ul>
            <p className={paragraphStyle}>Any such changes will be implemented with prior notice.</p>
          </section>

          {/* 8. Intellectual Property */}
          <section>
            <h2 className={sectionTitleStyle}>8. Intellectual Property</h2>
            <p className={paragraphStyle}>
              All website content, branding, logos, code, and software belong to <strong>Investate India</strong>. Unauthorized use, reproduction, or redistribution is strictly prohibited.
            </p>
          </section>

          {/* 9. Limitation of Liability */}
          <section>
            <h2 className={sectionTitleStyle}>
              9. Limitation of Liability
            </h2>
            <p className={paragraphStyle}>Investate India is <strong>not liable</strong> for:</p>
            <ul className={listStyle}>
              <li>Investment losses.</li>
              <li>Property disputes or legal battles.</li>
              <li>Builder defaults or bankruptcy.</li>
              <li>Construction delays.</li>
              <li>Fraud committed by third parties.</li>
              <li>Any indirect or consequential damages.</li>
            </ul>
            <p className="font-semibold text-gray-800">Your use of the platform is entirely at your own risk.</p>
          </section>

          {/* 10. Termination */}
          <section>
            <h2 className={sectionTitleStyle}>10. Termination</h2>
            <p className={paragraphStyle}>
              We may suspend or terminate accounts immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
            </p>
          </section>

          {/* 11. Governing Law */}
          <section>
            <h2 className={sectionTitleStyle}>
              11. Governing Law
            </h2>
            <p className={paragraphStyle}>
              These Terms are governed by the laws of India. Any disputes arising out of or related to these Terms shall be subject to the exclusive jurisdiction of the courts in India.
            </p>
          </section>

          {/* 12. Contact */}
          <section className="mt-12 bg-orange-50 p-6 rounded-xl border border-orange-100 text-center">
            <h2 className="text-xl font-bold text-gray-900 mb-2">12. Contact Us</h2>
            <p className="text-gray-600 mb-4">
              If you have any questions about these Terms, please contact us at:
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

export default TearmsAndCondition;