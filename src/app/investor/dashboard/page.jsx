"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Building2, MapPin, Search, TrendingUp, Shield, CheckCircle,
  Loader2, MessageSquare, Star, ArrowRight, Filter, Inbox
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/AuthContext';
import { apiRequest } from '@/api';
import { parseProjectImages } from '@/utils/imageCompressor';

export default function InvestorDashboard() {
  const router = useRouter();
  const { user } = useAuth();

  const [properties, setProperties] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [locationFilter, setLocationFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 9;

  useEffect(() => { setCurrentPage(1); }, [searchQuery, locationFilter]);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        setLoadingProjects(true);
        const data = await apiRequest('/api/projects?role=investor', { method: 'GET' });
        const projectsArray = data.data || [];
        const mappedData = projectsArray
          .filter(p => p.status === 'approved')
          .map(p => ({
            id: p.id,
            title: p.projectName || 'Unnamed Project',
            builder: p.builderName || 'Unknown Builder',
            location: p.projectLocation || 'Location TBA',
            type: p.projectType || 'Property',
            price: p.sellingPrice || 'Price on Request',
            roi: p.expectedRent ? `Rent: ${p.expectedRent}` : 'High ROI',
            image: parseProjectImages(p.projectImages)[0],
            status: p.currentConstructionStatus || 'Active',
          }));
        setProperties(mappedData);
      } catch (error) {
        console.warn('Failed to load properties:', error?.message);
      } finally {
        setLoadingProjects(false);
      }
    };
    if (user) loadProjects();
  }, [user]);

  const filteredProperties = properties.filter(prop => {
    const matchesSearch =
      prop.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prop.builder.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLocation = locationFilter === 'All' || prop.location.includes(locationFilter);
    return matchesSearch && matchesLocation;
  });

  const locations = ['All', ...new Set(properties.map(p => p.location.split(',')[0].trim()))];
  const paginated = filteredProperties.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
  const totalPages = Math.ceil(filteredProperties.length / ITEMS_PER_PAGE);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#f5f6fa] font-sans pb-16 overflow-x-hidden">
      {/* Hero */}
      <div className="relative bg-gradient-to-br from-[#0b264f] via-[#1a3e7a] to-[#0b264f] text-white px-6 pt-10 pb-28 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-20 -right-20 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-indigo-400/10 rounded-full blur-2xl" />
        </div>
        <div className="container mx-auto relative z-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <Badge className="bg-orange-500/20 text-orange-200 border-none mb-3 px-3 py-1">
                <Shield className="w-3.5 h-3.5 mr-1.5" /> Verified Investor
              </Badge>
              <h1 className="text-3xl md:text-4xl font-extrabold leading-tight">
                Welcome back,<br />
                <span className="text-orange-300">{user?.name || 'Investor'}</span>
              </h1>
              <p className="text-blue-200 text-sm mt-2 opacity-80">Explore India's finest real estate opportunities.</p>
              <div className="flex flex-wrap gap-3 mt-5">
                <Button
                  onClick={() => router.push('/investor/outreach-inbox')}
                  className="bg-orange-500 hover:bg-orange-600 text-white rounded-xl gap-2"
                >
                  <Inbox className="w-4 h-4" /> SP Inbox
                </Button>
                <Button
                  onClick={() => router.push('/support')}
                  variant="outline"
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20 rounded-xl gap-2"
                >
                  <MessageSquare className="w-4 h-4" /> Helpdesk
                </Button>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="bg-white/10 backdrop-blur border border-white/10 rounded-3xl px-6 py-4 text-center min-w-[100px]">
                <p className="text-3xl font-extrabold">{properties.length}</p>
                <p className="text-xs text-blue-200 uppercase tracking-wider mt-1">Live Projects</p>
              </div>
              <div className="bg-white/10 backdrop-blur border border-white/10 rounded-3xl px-6 py-4 text-center min-w-[100px]">
                <p className="text-3xl font-extrabold">{new Set(properties.map(p => p.location.split(',')[0].trim())).size}</p>
                <p className="text-xs text-blue-200 uppercase tracking-wider mt-1">Cities</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 -mt-14 relative z-10 space-y-8">
        {/* Search + Filter Bar */}
        <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-3 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-grow">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search projects, builders, locations…"
              className="w-full pl-12 pr-4 py-3.5 outline-none text-gray-700 placeholder-gray-400 font-medium bg-gray-50 rounded-2xl text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button className="rounded-2xl h-12 px-8 bg-[#0b264f] hover:bg-blue-900 text-white shadow gap-2 shrink-0">
            <Filter className="w-4 h-4" /> Filter
          </Button>
        </div>

        {/* Ad Banner Removed as per requirements */}

        {/* Location Pills */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Explore Opportunities</h2>
            <span className="text-sm text-gray-400">{filteredProperties.length} projects found</span>
          </div>
          <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
            {locations.map((loc) => (
              <button
                key={loc}
                onClick={() => setLocationFilter(loc)}
                className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all border ${
                  locationFilter === loc
                    ? 'bg-[#0b264f] text-white border-[#0b264f] shadow-md'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                }`}
              >
                {loc}
              </button>
            ))}
          </div>
        </div>

        {/* Property Cards */}
        {loadingProjects ? (
          <div className="flex flex-col items-center justify-center py-24">
            <Loader2 className="w-10 h-10 text-orange-500 animate-spin mb-4" />
            <p className="text-gray-500 font-medium">Loading verified projects…</p>
          </div>
        ) : filteredProperties.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 bg-white rounded-3xl border border-gray-100 shadow-sm">
            <Building2 className="w-12 h-12 text-gray-200 mb-4" />
            <h3 className="text-lg font-bold text-gray-900">No Properties Found</h3>
            <p className="text-gray-400 text-sm mt-1">Try adjusting your search or filters.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginated.map((property, i) => (
                <motion.div
                  key={property.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="group bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                    <img
                      src={property.image}
                      alt={property.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80'; }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="absolute top-4 left-4">
                      <span className="bg-white/90 backdrop-blur text-[#0b264f] text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
                        {property.status}
                      </span>
                    </div>
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <span className="text-xs font-bold bg-emerald-500 text-white inline-flex items-center px-2.5 py-1 rounded-md mb-2 shadow-sm gap-1">
                        <TrendingUp className="w-3.5 h-3.5" />
                        {property.roi}
                      </span>
                      <p className="text-xl font-extrabold drop-shadow leading-tight">{property.price}</p>
                    </div>
                  </div>
                  <div className="p-5 flex flex-col flex-grow">
                    <h3 className="font-extrabold text-gray-900 text-lg mb-1 capitalize leading-tight line-clamp-1">{property.title}</h3>
                    <p className="text-sm text-gray-400 mb-3 flex items-center gap-1.5">
                      <Building2 className="w-4 h-4 text-gray-300 shrink-0" />
                      {property.builder}
                    </p>
                    <div className="flex items-center text-sm text-gray-600 bg-gray-50 px-4 py-2.5 rounded-2xl mb-4 border border-gray-100">
                      <MapPin className="w-4 h-4 mr-2 text-orange-500 shrink-0" />
                      <span className="truncate">{property.location}</span>
                    </div>
                    <div className="flex gap-2 mb-5">
                      <span className="text-xs font-bold px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-lg border border-indigo-100">{property.type}</span>
                      <span className="text-xs font-bold px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg border border-emerald-100 flex items-center gap-1">
                        <CheckCircle className="w-3.5 h-3.5" /> Verified
                      </span>
                    </div>
                    <Button
                      onClick={() => router.push(`/project/${property.id}`)}
                      className="w-full bg-[#0b264f] hover:bg-blue-900 text-white font-bold py-5 rounded-[1.25rem] mt-auto gap-2"
                    >
                      View Details <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="rounded-xl h-10 px-4 text-xs font-bold"
                >
                  Previous
                </Button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <Button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    variant={currentPage === page ? 'default' : 'outline'}
                    className={`h-10 w-10 rounded-xl text-xs font-bold ${currentPage === page ? 'bg-[#0b264f] text-white' : ''}`}
                  >
                    {page}
                  </Button>
                ))}
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="rounded-xl h-10 px-4 text-xs font-bold"
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
