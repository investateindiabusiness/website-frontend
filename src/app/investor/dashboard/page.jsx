"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Building2, MapPin, Search, TrendingUp, Shield, CheckCircle, Filter, Loader2 } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AdBanner from '@/components/AdBanner';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/AuthContext';
import { apiRequest } from '@/api';
import { toast } from '@/hooks/use-toast';
import { parseProjectImages } from '@/utils/imageCompressor';

export default function InvestorDashboard() {
  const router = useRouter();
  const { user } = useAuth();

  const [properties, setProperties] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [locationFilter, setLocationFilter] = useState('All');

  useEffect(() => {
    const loadProjects = async () => {
      try {
        setLoadingProjects(true);
        const data = await apiRequest('/api/projects?role=investor', {
          method: 'GET',
          headers: { 'Authorization': `Bearer ${user?.token}` }
        });

        const mappedData = data
          .filter(p => p.status === 'approved')
          .map(p => ({
            id: p.id,
            title: p.projectName || 'Unnamed Project',
            builder: p.builderName || 'Unknown Builder',
            location: p.projectLocation || 'Location TBA',
            type: p.projectType || 'Property',
            price: p.sellingPrice || 'Price on Request',
            yield: p.expectedRent ? `Rent: ${p.expectedRent}` : 'High ROI',
            image: parseProjectImages(p.projectImages)[0],
            status: p.currentConstructionStatus || 'Active',
            isShortlisted: false
          }));

        setProperties(mappedData);
      } catch (error) {
        toast({ title: "Error", description: "Failed to load properties.", variant: "destructive" });
      } finally {
        setLoadingProjects(false);
      }
    };

    if (user) loadProjects();
  }, [user]);

  const filteredProperties = properties.filter(prop => {
    const matchesSearch = prop.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prop.builder.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLocation = locationFilter === 'All' || prop.location.includes(locationFilter);
    return matchesSearch && matchesLocation;
  });

  const locations = ['All', ...new Set(properties.map(p => p.location.split(',')[0].trim()))];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans overflow-x-hidden">
      <Header />

      <div className="flex-grow mt-16 md:mt-[4rem] pb-12">
        <div className="bg-gradient-to-r from-[#0b264f] to-[#1a4b8c] text-white pt-6 pb-12 md:pt-10 md:pb-16 px-4 md:px-8 rounded-b-[2rem] md:rounded-b-[2.5rem] shadow-xl relative overflow-hidden">
          <div className="container mx-auto relative z-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <Badge className="bg-orange-500/20 text-orange-200 hover:bg-orange-500/30 border-none mb-2 backdrop-blur-sm">
                  <Shield className="w-3 h-3 mr-1" /> Verified Investor
                </Badge>
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-1">Welcome, {user?.name || 'Investor'}</h1>
                <p className="text-blue-100 text-sm md:text-base opacity-90">Manage your portfolio and discover India's top realty.</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Ad Banner — below hero ── */}
        <div className="container mx-auto px-4 pt-6 flex justify-center">
          <div className="w-full max-w-md">
            <AdBanner zoneId="zone2" variant="card" />
          </div>
        </div>

        <div className="container mx-auto px-4 -mt-6 md:-mt-8 relative z-20 space-y-6 md:space-y-10">
          <div className="bg-white rounded-2xl !mt-0 shadow-lg p-2 flex flex-col sm:flex-row items-center gap-2 max-w-3xl mx-auto border border-gray-100">
            <input
              type="text"
              placeholder="Search projects, builders..."
              className="flex-grow py-3 px-4 sm:px-2 outline-none text-gray-700 placeholder-gray-400 font-medium bg-transparent w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button className="w-full sm:w-auto rounded-xl h-12 px-6 bg-[#0b264f] hover:bg-blue-900 text-white shadow-md transition-all">
              Search
            </Button>
          </div>

          <div>
            <div className="mb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <h2 className="text-xl font-bold text-gray-900">Explore Opportunities</h2>
              <div className="flex overflow-x-auto gap-2 pb-2 md:pb-0 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
                {locations.map((loc) => (
                  <button
                    key={loc}
                    onClick={() => setLocationFilter(loc)}
                    className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all border ${locationFilter === loc
                      ? 'bg-[#0b264f] text-white border-[#0b264f] shadow-md'
                      : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                      }`}
                  >
                    {loc}
                  </button>
                ))}
              </div>
            </div>

            {loadingProjects ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <Loader2 className="w-10 h-10 text-orange-600 animate-spin mb-4" />
                <p className="text-gray-500">Loading verified projects...</p>
              </div>
            ) : filteredProperties.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-3xl border border-gray-100 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900">No Properties Found</h3>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {filteredProperties.map((property) => (
                  <div key={property.id} className="group bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col h-full">
                    <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                      <img
                        src={property.image}
                        alt={property.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80' }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-90"></div>
                      <div className="absolute top-4 left-4">
                        <span className="bg-[#EAF0F6] text-[#0b264f] text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm">
                          {property.status === 'approved' ? 'Under Construction' : property.status}
                        </span>
                      </div>
                      <div className="absolute bottom-4 left-4 right-4 text-white">
                        <span className="text-xs font-bold bg-[#10B981] text-white inline-flex items-center px-2.5 py-1 rounded-md mb-1 shadow-sm">
                          <TrendingUp className="w-3.5 h-3.5 mr-1" />
                          {property.yield}
                        </span>
                        <h3 className="text-2xl font-bold leading-tight tracking-tight mt-1 drop-shadow-md">
                          {property.price}
                        </h3>
                      </div>
                    </div>

                    <div className="p-6 flex flex-col flex-grow">
                      <div className="flex-grow">
                        <h3 className="font-extrabold text-gray-900 text-2xl mb-1.5 capitalize tracking-tight">
                          {property.title}
                        </h3>
                        <p className="text-sm text-gray-400 mb-4 flex items-center font-medium">
                          <Building2 className="w-4 h-4 mr-2 text-gray-400 stroke-[2]" /> {property.builder}
                        </p>
                        <div className="flex items-center text-sm text-gray-600 bg-gray-50/80 px-4 py-2.5 rounded-2xl mb-5 border border-gray-100/50">
                          <MapPin className="w-4.5 h-4.5 mr-2 text-orange-500 flex-shrink-0" />
                          <span className="truncate">{property.location}</span>
                        </div>
                        <div className="flex flex-wrap gap-2 mb-6">
                          <span className="text-xs font-bold px-3 py-1.5 bg-[#EEF2FF] text-[#4F46E5] rounded-lg border border-[#E0E7FF]">
                            {property.type}
                          </span>
                          <span className="text-xs font-bold px-3 py-1.5 bg-[#ECFDF5] text-[#059669] rounded-lg border border-[#D1FAE5] flex items-center gap-1">
                            <CheckCircle className="w-3.5 h-3.5 text-[#059669]" /> Verified
                          </span>
                        </div>
                      </div>
                      <Button
                        onClick={() => router.push(`/project/${property.id}`)}
                        className="w-full bg-[#0b264f] hover:bg-blue-900 text-white font-bold py-4 rounded-[1.25rem] transition-all duration-300 h-13 text-sm tracking-wide"
                      >
                        View Full Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
