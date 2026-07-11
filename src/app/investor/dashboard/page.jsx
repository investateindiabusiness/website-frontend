"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Building2, MapPin, Search, TrendingUp, Shield, CheckCircle,
  Loader2, MessageSquare, ArrowRight, Filter, Inbox
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

  // ─── Onboarding status helpers ────────────────────────────────────────────────
  const getOnboardingState = (user) => {
    if (!user) return { isFullyVerified: false, needsForm1: true, needsForm2: false, needsForm2Changes: false, isForm1Pending: false };
    const s = user.onboardingStatus || '';
    const isFullyVerified = s === 'complete' || user.isVerified === true;
    const needsForm1 = !s || s === 'form1_pending' || s === 'form1_changes_requested' || s === 'form1_rejected';
    const isForm1Pending = s === 'form1_pending';
    const needsForm2 = s === 'form1_approved' || s === 'form2_pending';
    const needsForm2Changes = s === 'form2_changes_requested';
    return { isFullyVerified, needsForm1, needsForm2, needsForm2Changes, isForm1Pending };
  };

  const { isFullyVerified, needsForm2Changes } = getOnboardingState(user);
  const isBlocked = !isFullyVerified;
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
      <div className="relative bg-gradient-to-br from-[#0b264f] via-[#1a3e7a] to-[#0b264f] text-white px-4 sm:px-6 pt-8 pb-24 sm:pb-28 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-20 -right-20 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-indigo-400/10 rounded-full blur-2xl" />
        </div>
        <div className="container mx-auto relative z-10">
          <div className="flex flex-col gap-5">
            <div>
              <Badge className={`${isBlocked ? 'bg-amber-400/20 text-amber-200' : 'bg-emerald-400/20 text-emerald-200'} border-none mb-3 px-3 py-1`}>
                {isBlocked ? <Shield className="w-3.5 h-3.5 mr-1.5" /> : <Shield className="w-3.5 h-3.5 mr-1.5" />}
                {isBlocked ? 'Unverified Investor' : 'Verified Investor'}
              </Badge>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold leading-tight">
                Welcome back,<br />
                <span className="text-orange-300">{user?.name || 'Investor'}</span>
              </h1>
              <p className="text-blue-200 text-sm mt-2 opacity-80">Explore India's finest real estate opportunities.</p>
              <div className="flex flex-wrap gap-2 sm:gap-3 mt-4 sm:mt-5">
                <Button
                  onClick={() => router.push('/investor/outreach-inbox')}
                  className="bg-orange-500 hover:bg-orange-600 text-white rounded-xl gap-2 text-sm h-9 sm:h-10"
                >
                  <Inbox className="w-4 h-4" /> SP Inbox
                </Button>
                <Button
                  onClick={() => router.push('/support')}
                  variant="outline"
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20 rounded-xl gap-2 text-sm h-9 sm:h-10"
                >
                  <MessageSquare className="w-4 h-4" /> Helpdesk
                </Button>
              </div>
            </div>
            {/* Stats row */}
            <div className="flex gap-3">
              <div className="bg-white/10 backdrop-blur border border-white/10 rounded-2xl px-5 py-3 text-center flex-1">
                <p className="text-2xl sm:text-3xl font-extrabold">{properties.length}</p>
                <p className="text-xs text-blue-200 uppercase tracking-wider mt-1">Live Projects</p>
              </div>
              <div className="bg-white/10 backdrop-blur border border-white/10 rounded-2xl px-5 py-3 text-center flex-1">
                <p className="text-2xl sm:text-3xl font-extrabold">{new Set(properties.map(p => p.location.split(',')[0].trim())).size}</p>
                <p className="text-xs text-blue-200 uppercase tracking-wider mt-1">Cities</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-3 sm:px-4 md:px-6 -mt-14 relative z-10 space-y-6 sm:space-y-8">
        
        {/* ── Verification Gate Banner ── */}
        {isBlocked && (
          <div className="bg-white/80 backdrop-blur-md border border-amber-200/50 rounded-3xl p-8 sm:p-12 text-center shadow-2xl shadow-amber-900/5 relative overflow-hidden mt-8">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-400 via-orange-500 to-amber-400" />
            <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner border border-amber-100">
              <Shield className="w-10 h-10 text-amber-500" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-4 tracking-tight">
              {needsForm2Changes ? "Action Required: Changes Requested" : "Complete Verification to Unlock Dashboard"}
            </h2>
            <p className="text-gray-500 max-w-lg mx-auto mb-8 leading-relaxed font-semibold">
              {needsForm2Changes ? (
                <>
                  The administrator has requested modifications for your profile verification.
                  {user.adminRequests?.length > 0 && (
                    <span className="block mt-2 font-bold text-orange-600">Please correct: {user.adminRequests.join(', ')}</span>
                  )}
                </>
              ) : (
                "Your account is currently restricted. To access premium property listings and insights, please complete your KYC profile."
              )}
            </p>
            <Button
              onClick={() => router.push('/investor/kyc')}
              className="bg-gray-900 hover:bg-black text-white px-10 py-6 text-base font-black rounded-2xl shadow-xl shadow-black/10 transition-all hover:scale-105 active:scale-95"
            >
              Go to Verification
            </Button>
          </div>
        )}

        <div className={`transition-all duration-500 space-y-6 sm:space-y-8 ${isBlocked ? 'opacity-30 pointer-events-none select-none blur-sm' : ''}`}>
          {/* Search + Filter Bar */}
          <div className="bg-white rounded-2xl sm:rounded-3xl shadow-lg border border-gray-100 p-2.5 sm:p-3 flex flex-col sm:flex-row gap-2 sm:gap-3">
          <div className="relative flex-grow">
            <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search projects, builders, locations…"
              className="w-full pl-10 sm:pl-12 pr-4 py-3 outline-none text-gray-700 placeholder-gray-400 font-medium bg-gray-50 rounded-xl sm:rounded-2xl text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button className="rounded-xl sm:rounded-2xl h-11 px-6 sm:px-8 bg-[#0b264f] hover:bg-blue-900 text-white shadow gap-2 shrink-0 text-sm">
            <Filter className="w-4 h-4" /> Filter
          </Button>
        </div>



        {/* Location Pills */}
        <div>
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900">Explore Opportunities</h2>
            <span className="text-xs sm:text-sm text-gray-400">{filteredProperties.length} found</span>
          </div>
          <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-hide -mx-3 px-3 sm:mx-0 sm:px-0">
            {locations.map((loc) => (
              <button
                key={loc}
                onClick={() => setLocationFilter(loc)}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap transition-all border ${
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
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-10 h-10 text-orange-500 animate-spin mb-4" />
            <p className="text-gray-500 font-medium">Loading verified projects…</p>
          </div>
        ) : filteredProperties.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
            <Building2 className="w-12 h-12 text-gray-200 mb-4" />
            <h3 className="text-lg font-bold text-gray-900">No Properties Found</h3>
            <p className="text-gray-400 text-sm mt-1">Try adjusting your search or filters.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {paginated.map((property, i) => (
                <motion.div
                  key={property.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="group bg-white rounded-[1.5rem] sm:rounded-[2rem] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                    <img
                      src={property.image}
                      alt={property.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80'; }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="absolute top-3 left-3">
                      <span className="bg-white/90 backdrop-blur text-[#0b264f] text-xs font-bold px-2.5 py-1 rounded-full shadow-sm">
                        {property.status}
                      </span>
                    </div>
                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <span className="text-xs font-bold bg-emerald-500 text-white inline-flex items-center px-2 py-1 rounded-md mb-1.5 shadow-sm gap-1">
                        <TrendingUp className="w-3 h-3" />
                        {property.roi}
                      </span>
                      <p className="text-lg sm:text-xl font-extrabold drop-shadow leading-tight">{property.price}</p>
                    </div>
                  </div>
                  <div className="p-4 sm:p-5 flex flex-col flex-grow">
                    <h3 className="font-extrabold text-gray-900 text-base sm:text-lg mb-1 capitalize leading-tight line-clamp-1">{property.title}</h3>
                    <p className="text-sm text-gray-400 mb-3 flex items-center gap-1.5">
                      <Building2 className="w-4 h-4 text-gray-300 shrink-0" />
                      {property.builder}
                    </p>
                    <div className="flex items-center text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-xl mb-3 border border-gray-100">
                      <MapPin className="w-4 h-4 mr-2 text-orange-500 shrink-0" />
                      <span className="truncate">{property.location}</span>
                    </div>
                    <div className="flex gap-2 mb-4">
                      <span className="text-xs font-bold px-2.5 py-1.5 bg-indigo-50 text-indigo-700 rounded-lg border border-indigo-100">{property.type}</span>
                      <span className="text-xs font-bold px-2.5 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg border border-emerald-100 flex items-center gap-1">
                        <CheckCircle className="w-3.5 h-3.5" /> Verified
                      </span>
                    </div>
                    <Button
                      onClick={() => router.push(`/properties/${property.id}`)}
                      className="w-full bg-[#0b264f] hover:bg-blue-900 text-white font-bold py-4 rounded-xl mt-auto gap-2 text-sm"
                    >
                      View Details <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-1.5 sm:gap-2 pt-4 flex-wrap">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="rounded-xl h-9 px-3 text-xs font-bold"
                >
                  Previous
                </Button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    onClick={() => setCurrentPage(page)}
                    className={`rounded-xl h-9 w-9 p-0 text-xs font-bold ${currentPage === page ? 'bg-[#0b264f] hover:bg-blue-900 text-white' : ''}`}
                  >
                    {page}
                  </Button>
                ))}
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="rounded-xl h-9 px-3 text-xs font-bold"
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
        </div>
      </div>
    </div>
  );
}
