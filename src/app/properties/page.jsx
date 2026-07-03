"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Building2, MapPin, Search, TrendingUp, CheckCircle,
  Filter, Loader2, ArrowRight, ShieldCheck
} from 'lucide-react';
import AdBanner from '@/components/AdBanner';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/AuthContext';
import { apiRequest } from '@/api';
import { toast } from '@/hooks/use-toast';
import { parseProjectImages } from '@/utils/imageCompressor';

export default function InvestorProperties() {
  const router = useRouter();
  const { user } = useAuth();

  const [properties, setProperties] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(true);

  const [searchQuery, setSearchQuery] = useState('');
  const [locationFilter, setLocationFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, locationFilter, typeFilter]);

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
            totalUnits: p.totalUnits || 'N/A'
          }));

        setProperties(mappedData);
      } catch (error) {
        console.warn('Failed to load properties:', error?.message);
      } finally {
        setLoadingProjects(false);
      }
    };

    loadProjects();
  }, [user]);

  const filteredProperties = properties.filter(prop => {
    const matchesSearch = prop.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prop.builder.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLocation = locationFilter === 'All' || prop.location.includes(locationFilter);
    const matchesType = typeFilter === 'All' || prop.type === typeFilter;

    return matchesSearch && matchesLocation && matchesType;
  });

  const locations = ['All', ...new Set(properties.map(p => p.location.split(',')[0].trim()))];
  const propertyTypes = ['All', ...new Set(properties.map(p => p.type))];

  return (
    <div className="min-h-screen bg-[#F4F5F7] flex flex-col font-sans overflow-x-hidden">

      <main className="flex-grow mt-0 pb-16">
        <div className="container mx-auto px-4 py-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 mb-8 sticky top-[50px] z-30">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-grow relative flex items-center bg-gray-50 rounded-xl border border-gray-200 px-3">
                <Search className="w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by project name or builder..."
                  className="w-full bg-transparent border-none outline-none py-3 px-3 text-sm text-gray-700"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="w-full lg:w-48">
                <select
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-sm text-gray-700 outline-none focus:border-[#0b264f]"
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                >
                  {propertyTypes.map(type => (
                    <option key={type} value={type}>{type === 'All' ? 'All Types' : type}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-100 flex items-center">
              <MapPin className="w-4 h-4 text-gray-400 mr-3 flex-shrink-0" />
              <div className="flex overflow-x-auto gap-2 scrollbar-hide pb-1">
                {locations.map((loc) => (
                  <button
                    key={loc}
                    onClick={() => setLocationFilter(loc)}
                    className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all border ${locationFilter === loc
                      ? 'bg-[#0b264f] text-white border-[#0b264f] shadow-md'
                      : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                      }`}
                  >
                    {loc}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Zone 4 — Search Inline Ad (728x90) */}
          <div className="flex justify-center mb-4">
            <AdBanner zoneId="zone4" />
          </div>

          {loadingProjects ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <Loader2 className="w-10 h-10 text-[#0b264f] animate-spin mb-4" />
              <p className="text-gray-500 font-medium">Fetching verified properties...</p>
            </div>
          ) : filteredProperties.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center bg-white rounded-3xl border border-gray-200 shadow-sm">
              <div className="bg-gray-50 p-6 rounded-full mb-4">
                <Filter className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No Properties Found</h3>
              <p className="text-gray-500 max-w-sm mx-auto mb-6">We couldn't find any projects matching your current filters.</p>
              <Button onClick={() => { setSearchQuery(''); setLocationFilter('All'); setTypeFilter('All'); }} className="bg-[#0b264f] hover:bg-blue-900 text-white">
                Clear All Filters
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
                        className={`h-9 w-9 p-0 rounded-lg text-xs font-bold ${currentPage === page ? 'bg-slate-900 text-white hover:bg-slate-800' : 'hover:bg-slate-100 bg-white'
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
      </main>
    </div>
  );
}
