"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Building2, MapPin, Search, Users, TrendingUp, MoreVertical, Wallet, HardHat, PieChart as PieChartIcon, Loader2, Plus, MessageSquare } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AdBanner from '@/components/AdBanner';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/AuthContext';
import { fetchBuilderProjects } from '@/api';
import { toast } from '@/hooks/use-toast';

const ANALYTICS_DATA = [
  { name: 'Sep', leads: 0, sales: 0 },
  { name: 'Oct', leads: 0, sales: 0 },
  { name: 'Nov', leads: 0, sales: 0 },
  { name: 'Dec', leads: 0, sales: 0 },
  { name: 'Jan', leads: 0, sales: 0 },
  { name: 'Feb', leads: 0, sales: 0 },
];

export default function BuilderDashboard() {
  const router = useRouter();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  useEffect(() => {
    const loadProjects = async () => {
      if (!user?.uid) return;
      try {
        setIsLoading(true);
        const res = await fetchBuilderProjects(user.uid);
        setProjects(res?.data || res || []);
      } catch (error) {
        toast({ title: "Error", description: "Failed to load your projects.", variant: "destructive" });
      } finally {
        setIsLoading(false);
      }
    };
    loadProjects();
  }, [user]);

  const totalLeads = projects.reduce((acc, curr) => acc + (curr.inquiries || 0), 0);

  const filteredProjects = projects.filter(p =>
    (p.projectName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.projectLocation || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans overflow-x-hidden">
      <Header />
      <div className="flex-grow mt-16 md:mt-[4rem] pb-12">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-[#0b264f] to-[#1a4b8c] text-white pt-6 pb-12 md:pt-10 md:pb-20 px-4 md:px-8 rounded-b-[2rem] shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl pointer-events-none"></div>
          <div className="container mx-auto relative z-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
              <div>
                <Badge className="bg-blue-500/20 text-blue-100 hover:bg-blue-500/30 border-none mb-3 px-3 py-1">
                  <HardHat className="w-3.5 h-3.5 mr-1.5" /> {user?.name || 'Builder'}
                </Badge>
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2">Dashboard Overview</h1>
                <p className="text-sm md:text-base text-blue-100 opacity-90">Track performance, manage inventory, and monitor leads.</p>
                <Button
                  onClick={() => router.push('/support')}
                  variant="outline"
                  className="mt-4 bg-white/10 hover:bg-white/20 text-white border-white/20 backdrop-blur-sm rounded-xl"
                >
                  <MessageSquare className="w-4 h-4 mr-2" /> Support Helpdesk
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mt-8">
              {[
                { label: 'Total Revenue', value: '₹0 Cr', icon: Wallet, color: 'text-green-400' },
                { label: 'Active Leads', value: totalLeads, icon: Users, color: 'text-blue-300' },
                { label: 'Units Sold', value: 0, icon: Building2, color: 'text-orange-300' },
                { label: 'Conversion', value: '0.0%', icon: TrendingUp, color: 'text-purple-300' },
              ].map((stat, idx) => (
                <div key={idx} className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-3 md:p-4 flex flex-col justify-between hover:bg-white/15 transition-all">
                  <div className={`p-1.5 md:p-2 rounded-lg bg-white/10 ${stat.color} w-fit`}><stat.icon className="w-4 h-4 md:w-5 md:h-5" /></div>
                  <div className="mt-3 md:mt-4">
                    <p className="text-lg md:text-2xl font-bold">{stat.value}</p>
                    <p className="text-[10px] md:text-xs text-blue-100 uppercase tracking-wider opacity-80">{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* ── Ad Banner — below hero ── */}
        <div className="container mx-auto px-4 pt-6 flex justify-center">
          <div className="w-full max-w-md">
            <AdBanner zoneId="zone1" variant="card" />
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 mt-6 md:mt-8 relative z-20 space-y-6 md:space-y-8">
          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white rounded-3xl p-4 md:p-6 shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-900 text-lg flex items-center mb-6"><TrendingUp className="w-5 h-5 mr-2 text-[#0b264f]" /> Sales Performance</h3>
              <div className="h-56 md:h-64 w-full">
                <ResponsiveContainer width="100%" height={256}>
                  <AreaChart data={ANALYTICS_DATA}>
                    <defs>
                      <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0b264f" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#0b264f" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} width={30} />
                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                    <Area type="monotone" dataKey="sales" stroke="#0b264f" strokeWidth={3} fillOpacity={1} fill="url(#colorSales)" />
                    <Area type="monotone" dataKey="leads" stroke="#94a3b8" strokeWidth={2} strokeDasharray="5 5" fill="transparent" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="bg-white rounded-3xl p-4 md:p-6 shadow-sm border border-gray-100 flex flex-col">
              <h3 className="font-bold text-gray-900 text-lg mb-4 flex items-center"><PieChartIcon className="w-5 h-5 mr-2 text-orange-500" /> Lead Sources</h3>
              <div className="flex-grow flex flex-col justify-center space-y-4">
                {[
                  { source: 'Total Properties', count: projects.length.toString(), color: 'bg-[#0b264f]' },
                  { source: 'Verified & Live', count: projects.filter(p => p.status === 'approved').length.toString(), color: 'bg-green-500' },
                  { source: 'Total Leads', count: totalLeads.toString(), color: 'bg-orange-500' },
                  { source: 'Pending Review', count: projects.filter(p => p.status === 'pending').length.toString(), color: 'bg-yellow-400' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                      <span className="text-sm font-medium text-gray-600">{item.source}</span>
                    </div>
                    <span className="font-bold text-gray-800">{item.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Projects */}
          <div>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900">Active Projects</h2>
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-1 flex items-center w-full md:w-96">
                <Search className="text-gray-400 w-5 h-5 ml-3" />
                <input type="text" placeholder="Search your projects..." className="flex-grow py-2 px-3 outline-none text-gray-700 bg-transparent text-sm" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
              </div>
            </div>
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <Loader2 className="w-10 h-10 text-orange-600 animate-spin mb-4" />
                <p className="text-gray-500">Loading your projects...</p>
              </div>
            ) : filteredProjects.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-3xl shadow-sm border border-gray-100">
                <Building2 className="w-12 h-12 text-gray-300 mb-4" />
                <h3 className="text-lg font-bold text-gray-900 mb-2">No Projects Found</h3>
                <p className="text-gray-500 max-w-sm mx-auto mb-6">You haven't listed any projects yet.</p>
                <Button onClick={() => router.push('/builder/projects')} className="bg-[#0b264f] hover:bg-blue-900 text-white">
                  <Plus className="w-4 h-4 mr-2" /> Add New Project
                </Button>
              </div>
            ) : (
              <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-50/75 border-b border-gray-200 text-gray-600 text-xs font-bold uppercase tracking-wider">
                        <th className="px-6 py-4">Project</th>
                        <th className="px-6 py-4">Location</th>
                        <th className="px-6 py-4">Type / Units</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredProjects.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE).map((project) => {
                        const fallbackImage = 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80';
                        const coverImage = (project.projectImages?.length > 0 && project.projectImages[0].startsWith('http')) ? project.projectImages[0] : fallbackImage;
                        return (
                          <tr key={project.id} className="hover:bg-gray-50/50 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center space-x-3">
                                <div className="w-16 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-200">
                                  <img
                                    src={coverImage}
                                    alt={project.projectName}
                                    className="w-full h-full object-cover"
                                    onError={(e) => { e.target.src = fallbackImage; }}
                                  />
                                </div>
                                <div>
                                  <div className="text-sm font-bold text-gray-900 capitalize">
                                    {project.projectName}
                                  </div>
                                  <div className="text-xs text-gray-400">
                                    ID: {project.id}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                              <div className="flex items-center gap-1.5">
                                <MapPin className="w-3.5 h-3.5 text-orange-500" />
                                {project.projectLocation || 'No Location'}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">
                                {project.projectType || 'Residential'}
                              </div>
                              <div className="text-xs text-gray-400">
                                {project.totalUnits || 0} Units
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <Badge className={`capitalize border-none py-1 px-3 text-xs font-semibold ${
                                project.status === 'approved' 
                                  ? 'bg-green-100 text-green-700' 
                                  : project.status === 'pending'
                                  ? 'bg-yellow-100 text-yellow-700'
                                  : 'bg-orange-100 text-orange-700'
                              }`}>
                                {project.status === 'approved' ? 'Live' : project.status}
                              </Badge>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <Button 
                                onClick={() => router.push('/builder/projects')} 
                                className="bg-white text-[#0b264f] border border-gray-200 hover:bg-[#0b264f] hover:text-white transition-all shadow-sm rounded-xl text-xs px-4 py-2"
                              >
                                Manage Project
                              </Button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Pagination Controls */}
                {Math.ceil(filteredProjects.length / ITEMS_PER_PAGE) > 1 && (
                  <div className="bg-gray-50 border-t border-gray-200 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, filteredProjects.length)} of {filteredProjects.length} records
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
                      
                      {Array.from({ length: Math.ceil(filteredProjects.length / ITEMS_PER_PAGE) }, (_, i) => i + 1).map((page) => (
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
                        onClick={() => setCurrentPage(prev => Math.min(Math.ceil(filteredProjects.length / ITEMS_PER_PAGE), prev + 1))}
                        disabled={currentPage === Math.ceil(filteredProjects.length / ITEMS_PER_PAGE)}
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
      <Footer />
    </div>
  );
}
