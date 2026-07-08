import React from 'react';
import Link from 'next/link';
import { Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram, Star } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#232325] border-t border-gray-800 text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <img src="/logo-big.png" alt="INVESTATE INDIA" className="h-16 w-auto object-contain" />
            </div>
            <p className="text-sm text-gray-400">
              Investate India is the trusted gateway for Global NRI investments in Indian real estate, offering verified properties and absolute transparency.
            </p>
            <ul className="flex space-x-4 pt-2">
              <li>
                <a href="https://www.instagram.com/investateindia/" target="_blank" rel="noopener noreferrer" className="flex items-center group">
                  <Instagram className="h-5 w-5 text-[#C88A58] group-hover:text-[var(--color-accent,#D48035)] transition-colors" />
                </a>
              </li>
              <li>
                <a href="https://www.facebook.com/investateindiaofficial" target="_blank" rel="noopener noreferrer" className="flex items-center group">
                  <Facebook className="h-5 w-5 text-[#C88A58] group-hover:text-[var(--color-accent,#D48035)] transition-colors" />
                </a>
              </li>
              <li>
                <a href="https://www.linkedin.com/company/investateindiaofficial/" target="_blank" rel="noopener noreferrer" className="flex items-center group">
                  <Linkedin className="h-5 w-5 text-[#C88A58] group-hover:text-[var(--color-accent,#D48035)] transition-colors" />
                </a>
              </li>
              <li>
                <a href="https://x.com/investate_india" target="_blank" rel="noopener noreferrer" className="flex items-center group">
                  <Twitter className="h-5 w-5 text-[#C88A58] group-hover:text-[var(--color-accent,#D48035)] transition-colors" />
                </a>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-400 hover:text-[var(--color-accent,#D48035)] transition-colors text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/investor" className="text-gray-400 hover:text-[var(--color-accent,#D48035)] transition-colors text-sm">
                  Investor
                </Link>
              </li>
              <li>
                <Link href="/builder" className="text-gray-400 hover:text-[var(--color-accent,#D48035)] transition-colors text-sm">
                  Builder
                </Link>
              </li>
              <li>
                <Link href="/about-us" className="text-gray-400 hover:text-[var(--color-accent,#D48035)] transition-colors text-sm">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact-us" className="text-gray-400 hover:text-[var(--color-accent,#D48035)] transition-colors text-sm">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="text-gray-400 hover:text-[var(--color-accent,#D48035)] transition-colors text-sm">
                  Gallery
                </Link>
              </li>
              <li>
                <a href="https://g.page/r/CTZ78wVQdv2HEAI/review" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-gray-400 hover:text-[#D48035] transition-colors text-sm font-medium mt-1">
                  <Star className="w-4 h-4 fill-current text-yellow-500" /> Write a Google Review
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-bold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-[#C88A58] flex-shrink-0 mt-0.5" />
                <span className="text-sm text-gray-400">Hyderabad (IN) & New York (USA)</span>
              </li>
              <li className="flex items-center space-x-3 min-w-0">
                <Mail className="h-5 w-5 text-[#C88A58] flex-shrink-0" />
                <Link href="/contact-us" className="text-xs sm:text-sm text-gray-400 hover:text-[var(--color-accent,#D48035)] transition-colors whitespace-nowrap">
                  Contact Support
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-gray-400 text-center md:text-left leading-relaxed">
              © 2026 INVESTATE INDIA. All rights reserved.
            </p>
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
              <a href="/privacy" className="text-sm text-gray-400 hover:text-[var(--color-accent,#D48035)] transition-colors">
                Privacy Policy
              </a>
              <a href="/terms" className="text-sm text-gray-400 hover:text-[var(--color-accent,#D48035)] transition-colors">
                Terms & Conditions
              </a>
              <a href="/refund-cancellation" className="text-sm text-gray-400 hover:text-[var(--color-accent,#D48035)] transition-colors">
                Refund & Cancellation Policy
              </a>
              <a href="/disclaimer" className="text-sm text-gray-400 hover:text-[var(--color-accent,#D48035)] transition-colors">
                Disclaimer
              </a>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-4 text-center md:text-left leading-relaxed">
            Disclaimer: INVESTATE INDIA acts as a facilitator between NRI investors and verified real estate builders. All investments are subject to market risks. Please read all documents carefully before investing.
          </p>
          <p className="text-xs text-gray-300 mt-3 text-center">
            Designed and Maintained by <a href="https://brvteck.ai/" target="_blank" rel="noopener noreferrer" className="text-white hover:text-[var(--color-accent,#D48035)] transition-colors underline font-medium">BRV Technologies</a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
