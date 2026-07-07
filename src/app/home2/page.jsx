"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building2, Shield, TrendingUp, Globe, CheckCircle, Star, ArrowRight, MapPin, Home as HomeIcon, Search, ChevronDown, X, Phone } from 'lucide-react';

const AVAILABLE_PROPERTIES = [
  { id: 1, title: 'Imperial Heights', builder: 'Apex Constructors', location: 'Mumbai, Maharashtra', type: '3 BHK Luxury', price: '$2.5 Cr', yield: '+12% proj. ROI', image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80', status: 'Ready to Move' },
  { id: 3, title: 'Cyber City Lofts', builder: 'City Developers', location: 'Hyderabad, Telangana', type: '2 BHK Smart Home', price: '$1.1 Cr', yield: 'Rental: $45k/mo', image: 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=800&q=80', status: 'Under Construction' },
];

export default function Home2() {
  const router = useRouter();
  const [locationQuery, setLocationQuery] = useState('');
  const [allCities, setAllCities] = useState([]);
  const [filteredCities, setFilteredCities] = useState([]);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [showPropertyDropdown, setShowPropertyDropdown] = useState(false);
  const [showBudgetDropdown, setShowBudgetDropdown] = useState(false);
  const [selectedPropertyType, setSelectedPropertyType] = useState('Flat');
  const [budgetRange, setBudgetRange] = useState('Budget');

  useEffect(() => {
    fetch('https://countriesnow.space/api/v0.1/countries/cities', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ country: 'india' })
    }).then(res => res.json()).then(result => {
      if (!result.error) setAllCities(result.data);
    });
  }, []);

  return (
    <div className="w-full min-h-screen bg-white overflow-x-hidden">
      <Header />
      <section className="relative md:h-[calc(100vh-4rem)] mt-[2rem] md:mt-[4rem] flex items-center justify-center overflow-hidden py-10 md:py-0">
        <div className="absolute inset-0 z-0" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1920&h=1080&fit=crop)', backgroundSize: 'cover' }}>
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-blue-700/90"></div>
        </div>
        <div className="container mx-auto px-4 z-10 text-center text-white">
          <h1 className="text-3xl md:text-7xl font-bold mt-4 leading-tight">Invest in India's<br /><span className="text-orange-400">Premier Real Estate</span></h1>
          <p className="text-lg md:text-xl mb-6 max-w-full mx-auto text-white px-2">Connecting NRI Investors to verified builders and transparent investment opportunities across India</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
            <Button size="lg" className="bg-white text-blue-900 hover:bg-blue-50 px-8 py-6 text-lg font-semibold w-full sm:w-auto">Start Investing Today <ArrowRight className="ml-2 h-5 w-5" /></Button>
            <Button size="lg" variant="outline" onClick={() => router.push('/builder')} className="border-white text-white hover:bg-white hover:text-blue-900 px-8 py-6 text-lg font-semibold w-full sm:w-auto">Builder Portal</Button>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
