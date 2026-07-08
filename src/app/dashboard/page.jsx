"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Building2, MapPin, Search, TrendingUp, Shield, CheckCircle, Filter, PieChart as PieChartIcon, BarChart as BarChartIcon, Loader2, MessageSquare } from 'lucide-react';


import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/AuthContext';
import { apiRequest } from '@/api';
import { toast } from '@/hooks/use-toast';
import { parseProjectImages } from '@/utils/imageCompressor';

const MARKET_TRENDS = [
  { name: 'Q1', price: 1.2, yield: 4.5 },
  { name: 'Q2', price: 1.4, yield: 4.8 },
  { name: 'Q3', price: 1.3, yield: 5.1 },
  { name: 'Q4', price: 1.8, yield: 5.5 },
  { name: 'Q1', price: 2.1, yield: 6.0 },
  { name: 'Q2', price: 2.4, yield: 6.2 },
];

const MY_INQUIRIES = [
  { id: 101, property: 'Serene Meadows', builder: 'Eco Homes', date: '2 days ago', status: 'Pending', message: 'Waiting for brochure' },
  { id: 102, property: 'Imperial Heights', builder: 'Apex Constructors', date: '1 week ago', status: 'Replied', message: 'Builder sent floor plans' },
];

const PORTFOLIO_GROWTH = [
  { year: '2020', invested: 0, value: 0 },
  { year: '2021', invested: 0, value: 0 },
  { year: '2022', invested: 0, value: 0 },
  { year: '2023', invested: 0, value: 0 },
  { year: '2024', invested: 0, value: 0 },
  { year: '2025', invested: 0, value: 0 },
];

const CITY_PERFORMANCE = [
  { city: 'Hyderabad', appreciation: 12.5, rental: 3.8 },
  { city: 'Bangalore', appreciation: 9.2, rental: 5.1 },
  { city: 'Mumbai', appreciation: 6.5, rental: 2.9 },
  { city: 'Gurugram', appreciation: 10.8, rental: 3.5 },
];

export default function InvestorDashboard() {
  const router = useRouter();
  const { user } = useAuth();

  const [properties, setProperties] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(true);

  const [searchQuery, setSearchQuery] = useState('');
  const [locationFilter, setLocationFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, locationFilter]);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        setLoadingProjects(true);
        const data = await apiRequest('/api/projects?role=investor', {
          method: 'GET',
        });

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
            yield: p.expectedRent ? `Rent: ${p.expectedRent}` : 'High ROI',
            image: parseProjectImages(p.projectImages)[0],
            status: p.currentConstructionStatus || 'Active',
            isShortlisted: false
          }));

        setProperties(mappedData);
      } catch (error) {
        console.warn('Failed to load properties:', error?.message);
      } finally {
        setLoadingProjects(false);
      }
    };

    if (user) {
      loadProjects();
    }
  }, [user]);

  const filteredProperties = properties.filter(prop => {
    const matchesSearch = prop.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prop.builder.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLocation = locationFilter === 'All' || prop.location.includes(locationFilter);
    return matchesSearch && matchesLocation;
  });

  const locations = ['All', ...new Set(properties.map(p => p.location.split(',')[0].trim()))];

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans overflow-x-hidden">

      <div className="flex-grow pb-12">

        <div className="bg-gradient-to-r from-[#0b264f] to-[#1a4b8c] text-white pt-6 pb-12 md:pt-10 md:pb-16 px-4 md:px-8 rounded-b-[2rem] md:rounded-b-[2.5rem] shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-16 -mt-16 blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/5 rounded-full -ml-10 -mb-10 blur-2xl pointer-events-none"></div>

          <div className="container mx-auto relative z-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <Badge className="bg-orange-500/20 text-orange-200 hover:bg-orange-500/30 border-none mb-2 backdrop-blur-sm">
                  <Shield className="w-3 h-3 mr-1" /> Verified Investor
                </Badge>
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-1">Welcome, {user?.name || 'Investor'}</h1>
                <p className="text-blue-100 text-sm md:text-base opacity-90">Manage your portfolio and discover India's top realty.</p>
                <Button
                  onClick={() => router.push('/support')}
                  variant="outline"
                  className="mt-4 bg-white/10 hover:bg-white/20 text-white border-white/20 backdrop-blur-sm rounded-xl"
                >
                  <MessageSquare className="w-4 h-4 mr-2" /> Support Helpdesk
                </Button>
              </div>

              <div className="bg-white/10 backdrop-blur-md p-3 md:p-4 rounded-2xl flex items-center gap-4 border border-white/10 w-full md:w-auto justify-center md:justify-start">
                <div className="text-center px-2">
                  <p className="text-xl md:text-2xl font-bold text-white">{properties.filter(p => p.isShortlisted).length}</p>
                  <p className="text-[10px] md:text-xs text-blue-200 uppercase tracking-wider">Saved</p>
                </div>
                <div className="h-8 w-px bg-white/20"></div>
                <div className="text-center px-2">
                  <p className="text-xl md:text-2xl font-bold text-white">{MY_INQUIRIES.length}</p>
                  <p className="text-[10px] md:text-xs text-blue-200 uppercase tracking-wider">Visited</p>
                </div>
              </div>
            </div>
          </div>
        </div>



        <div className="container mx-auto px-4 mt-6 md:mt-8 relative z-20 space-y-6 md:space-y-10">

          <div className="bg-white rounded-2xl !mt-0 shadow-lg p-2 flex flex-col sm:flex-row items-center gap-2 max-w-3xl mx-auto border border-gray-100">
            <div className="pl-4 hidden sm:block">
              <Search className="text-gray-400 w-5 h-5" />
            </div>
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
                <div className="bg-gray-100 p-6 rounded-full mb-4">
                  <Filter className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">No Properties Found</h3>
                <p className="text-gray-500 max-w-xs mx-auto">Try adjusting your search or filters to find what you're looking for.</p>
                <Button onClick={() => { setSearchQuery(''); setLocationFilter('All'); }} variant="link" className="text-orange-600 font-bold mt-2">
                  Clear Filters
                </Button>
              </div>
            ) : (
              <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-50/75 border-b border-gray-200 text-gray-600 text-xs font-bold uppercase tracking-wider">
                        <th className="px-6 py-4">Property</th>
                        <th className="px-6 py-4">Builder</th>
                        <th className="px-6 py-4">Location</th>
                        <th className="px-6 py-4">Yield / ROI</th>
                        <th className="px-6 py-4">Price</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredProperties.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE).map((property) => {
                        return (
                          <tr key={property.id} className="hover:bg-gray-50/50 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center space-x-3">
                                <div className="w-16 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-200">
                                  <img
                                    src={property.image}
                                    alt={property.title}
                                    className="w-full h-full object-cover"
                                    onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80'; }}
                                  />
                                </div>
                                <div>
                                  <div className="text-sm font-bold text-gray-900 capitalize">
                                    {property.title}
                                  </div>
                                  <div className="text-xs text-[#4F46E5] font-semibold">
                                    {property.type}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                              {property.builder}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                              <div className="flex items-center gap-1.5">
                                <MapPin className="w-3.5 h-3.5 text-orange-500" />
                                {property.location}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="text-xs font-bold bg-[#ECFDF5] text-[#059669] border border-[#D1FAE5] inline-flex items-center px-2.5 py-1 rounded-md shadow-sm">
                                <TrendingUp className="w-3.5 h-3.5 mr-1" />
                                {property.yield}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                              {property.price}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <Button 
                                onClick={() => router.push(`/project/${property.id}`)} 
                                className="bg-[#0b264f] hover:bg-blue-900 text-white rounded-xl text-xs px-4 py-2"
                              >
                                View Details
                              </Button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Pagination Controls */}
                {Math.ceil(filteredProperties.length / ITEMS_PER_PAGE) > 1 && (
                  <div className="bg-gray-50 border-t border-gray-200 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, filteredProperties.length)} of {filteredProperties.length} records
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Button
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                        variant="outline"
                        className="h-9 px-3 rounded-lg text-xs font-bold hover:bg-slate-100 bg-white"
                      >
                        Previous
                      </Button>
                      
                      {Array.from({ length: Math.ceil(filteredProperties.length / ITEMS_PER_PAGE) }, (_, i) => i + 1).map((page) => (
                        <Button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          variant={currentPage === page ? 'default' : 'outline'}
                          className={`h-9 w-9 p-0 rounded-lg text-xs font-bold ${
                            currentPage === page ? 'bg-slate-900 text-white hover:bg-slate-800' : 'hover:bg-slate-100 bg-white'
                          }`}
                        >
                          {page}
                        </Button>
                      ))}

                      <Button
                        onClick={() => setCurrentPage(prev => Math.min(Math.ceil(filteredProperties.length / ITEMS_PER_PAGE), prev + 1))}
                        disabled={currentPage === Math.ceil(filteredProperties.length / ITEMS_PER_PAGE)}
                        variant="outline"
                        className="h-9 px-3 rounded-lg text-xs font-bold hover:bg-slate-100 bg-white"
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
