import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white text-[#001A72]">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <img src="/logo-big.png" alt="INVESTATE INDIA" className="h-16 w-auto" />
            </div>
            <p className="text-sm">
              Connecting NRI investors to India's growth through verified real estate opportunities.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-[#FB923C] transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-[#FB923C] transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-[#FB923C] transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-[#FB923C] transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-[#001A72]font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="hover:text-[#FB923C] transition-colors text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-[#FB923C] transition-colors text-sm">
                  For Investors
                </Link>
              </li>
              <li>
                <Link to="/partner/register" className="hover:text-[#FB923C] transition-colors text-sm">
                  For Builders
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-[#FB923C] transition-colors text-sm">
                  Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Popular Cities */}
          <div>
            <h3 className="text-[#001A72]font-bold mb-4">Popular Cities</h3>
            <ul className="space-y-2">
              <li className="text-sm hover:text-[#FB923C] transition-colors cursor-pointer">Bangalore</li>
              <li className="text-sm hover:text-[#FB923C] transition-colors cursor-pointer">Gurgaon</li>
              <li className="text-sm hover:text-[#FB923C] transition-colors cursor-pointer">Mumbai</li>
              <li className="text-sm hover:text-[#FB923C] transition-colors cursor-pointer">Pune</li>
              <li className="text-sm hover:text-[#FB923C] transition-colors cursor-pointer">Hyderabad</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-[#001A72]font-bold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-[#001A72] flex-shrink-0 mt-0.5" />
                <span className="text-sm">MG Road, Bangalore, India</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-[#001A72] flex-shrink-0" />
                <span className="text-sm">+91-80-12345678</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-[#001A72] flex-shrink-0" />
                <span className="text-sm">info@investateindia.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm">
              © 2025 INVESTATE INDIA. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <a href="/privacy" className="text-sm hover:text-[#FB923C] transition-colors">
                Privacy Policy
              </a>
              <a href="/terms" className="text-sm hover:text-[#FB923C] transition-colors">
                Terms & Conditions
              </a>
              <a href="/disclaimer" className="text-sm hover:text-[#FB923C] transition-colors">
                Disclaimer
              </a>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-4 text-center md:text-left">
            Disclaimer: INVESTATE INDIA acts as a facilitator between NRI investors and verified real estate builders. All investments are subject to market risks. Please read all documents carefully before investing.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
