import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, MapPin, Search, Users, TrendingUp, MoreVertical, Wallet, HardHat, PieChart as PieChartIcon, Loader2 } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/AuthContext';
import { fetchBuilderProjects } from '@/api';
import { toast } from '@/hooks/use-toast';

// --- MOCK DATA (Analytics kept mock until DB supports historical sales data) ---
const ANALYTICS_DATA = [
  { name: 'Sep', leads: 40, sales: 24 },
  { name: 'Oct', leads: 30, sales: 13 },
  { name: 'Nov', leads: 60, sales: 38 },
  { name: 'Dec', leads: 90, sales: 55 },
  { name: 'Jan', leads: 65, sales: 40 },
  { name: 'Feb', leads: 85, sales: 68 },
];

const BuilderDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // --- FETCH REAL BUILDER PROJECTS ---
  useEffect(() => {
    const loadProjects = async () => {
      if (!user || !user.uid) return;
      try {
        setIsLoading(true);
        const data = await fetchBuilderProjects(user.uid);
        setProjects(data);
      } catch (error) {
        toast({ title: "Error", description: "Failed to load your projects.", variant: "destructive" });
      } finally {
        setIsLoading(false);
      }
    };

    loadProjects();
  }, [user]);

  // --- DYNAMIC STATS CALCULATION ---
  // Revenue & Sold Units are mocked/defaulted to 0 since they aren't in the DB schema yet.
  const totalRevenue = "₹0 Cr"; 
  const totalUnitsSold = 0; 
  const totalLeads = projects.reduce((acc, curr) => acc + (curr.inquiries || 0), 0);

  const filteredProjects = projects.filter(p =>
    (p.projectName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.projectLocation || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans overflow-x-hidden">
      <Header />

      <div className="flex-grow mt-[2rem] md:mt-[4rem] pb-12">

        {/* --- HERO SECTION --- */}
        <div className="bg-gradient-to-r from-[#0b264f] to-[#1a4b8c] text-white pt-6 pb-12 md:pt-10 md:pb-20 px-4 md:px-8 rounded-b-[2rem] md:rounded-b-[2.5rem] shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl pointer-events-none"></div>

          <div className="container mx-auto relative z-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">

              {/* Greeting & Profile */}
              <div className="w-full md:w-auto">
                <Badge className="bg-blue-500/20 text-blue-100 hover:bg-blue-500/30 border-none mb-3 backdrop-blur-sm px-3 py-1">
                  <HardHat className="w-3.5 h-3.5 mr-1.5" /> {user?.name || 'Builder Partner'}
                </Badge>
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2">Dashboard Overview</h1>
                <p className="text-sm md:text-base text-blue-100 opacity-90">Track performance, manage inventory, and monitor leads.</p>
              </div>
            </div>

            {/* Top Level Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mt-8">
              {[
                { label: 'Total Revenue', value: totalRevenue, icon: Wallet, color: 'text-green-400' },
                { label: 'Active Leads', value: totalLeads, icon: Users, color: 'text-blue-300' },
                { label: 'Units Sold', value: totalUnitsSold, icon: Building2, color: 'text-orange-300' },
                { label: 'Conversion', value: '0.0%', icon: TrendingUp, color: 'text-purple-300' },
              ].map((stat, idx) => (
                <div key={idx} className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-3 md:p-4 flex flex-col justify-between hover:bg-white/15 transition-all cursor-pointer">
                  <div className="flex justify-between items-start">
                    <div className={`p-1.5 md:p-2 rounded-lg bg-white/10 ${stat.color}`}>
                      <stat.icon className="w-4 h-4 md:w-5 md:h-5" />
                    </div>
                    {idx === 0 && <span className="text-[10px] bg-green-500 text-white px-1.5 py-0.5 rounded">Tracking</span>}
                  </div>
                  <div className="mt-3 md:mt-4">
                    <p className="text-lg md:text-2xl font-bold truncate">{stat.value}</p>
                    <p className="text-[10px] md:text-xs text-blue-100 uppercase tracking-wider opacity-80">{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* --- MAIN CONTENT --- */}
        <div className="container mx-auto px-4 -mt-4 md:-mt-8 relative z-20 space-y-6 md:space-y-8">

          {/* SECTION 1: ANALYTICS CHARTS */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Sales Trend Chart */}
            <div className="lg:col-span-2 bg-white rounded-3xl p-4 md:p-6 shadow-sm border border-gray-100">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3 sm:gap-0">
                <h3 className="font-bold text-gray-900 text-lg flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-[#0b264f]" /> Sales Performance
                </h3>
                <select className="bg-gray-50 border-none text-sm font-medium text-gray-600 rounded-lg p-2 cursor-pointer outline-none w-full sm:w-auto">
                  <option>Last 6 Months</option>
                  <option>This Year</option>
                </select>
              </div>
              <div className="h-56 md:h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
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

            {/* Inquiry Sources */}
            <div className="bg-white rounded-3xl p-4 md:p-6 shadow-sm border border-gray-100 flex flex-col">
              <h3 className="font-bold text-gray-900 text-lg mb-4 flex items-center">
                <PieChartIcon className="w-5 h-5 mr-2 text-orange-500" /> Lead Sources
              </h3>

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

              <div className="mt-6 pt-6 border-t border-gray-100">
                <Button variant="outline" className="w-full border-dashed border-gray-300 text-gray-500 hover:text-[#0b264f] hover:border-[#0b264f]">
                  View Detailed Report
                </Button>
              </div>
            </div>
          </div>

          {/* SECTION 2: PROJECTS MANAGEMENT */}
          <div>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900">Active Projects</h2>

              {/* Search Bar */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-1 flex items-center w-full md:w-96">
                <Search className="text-gray-400 w-5 h-5 ml-3" />
                <input
                  type="text"
                  placeholder="Search your projects..."
                  className="flex-grow py-2 px-3 outline-none text-gray-700 bg-transparent text-sm w-full min-w-0" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Projects Grid */}
            {isLoading ? (
               <div className="flex flex-col items-center justify-center py-20 text-center">
                  <Loader2 className="w-10 h-10 text-orange-600 animate-spin mb-4" />
                  <p className="text-gray-500">Loading your projects...</p>
               </div>
            ) : filteredProjects.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-3xl shadow-sm border border-gray-100">
                    <Building2 className="w-12 h-12 text-gray-300 mb-4" />
                    <h3 className="text-lg font-bold text-gray-900 mb-2">No Projects Found</h3>
                    <p className="text-gray-500 max-w-sm mx-auto mb-6">You haven't listed any projects yet, or none match your search.</p>
                    <Button onClick={() => navigate('/partner/projects')} className="bg-[#0b264f] hover:bg-blue-900 text-white">
                        <Plus className="w-4 h-4 mr-2" /> Add New Project
                    </Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProjects.map((project) => {
                    const fallbackImage = 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80';
                    const coverImage = (project.projectImages && project.projectImages.length > 0 && project.projectImages[0].startsWith('http')) 
                                        ? project.projectImages[0] 
                                        : fallbackImage;

                    // Fake progress percentage for UI (0 if totalUnits is missing)
                    const progress = 0; 
                    const soldUnits = 0;

                    return (
                        <div key={project.id} className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-lg transition-all border border-gray-100 flex flex-col group">
                        {/* Image Header */}
                        <div className="h-48 md:h-40 relative overflow-hidden bg-gray-100">
                            <img
                            src={coverImage}
                            alt={project.projectName}
                            onError={(e) => { e.target.src = fallbackImage; }}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                            <div className="absolute bottom-3 left-4 right-4 flex justify-between items-end text-white">
                            <div className="min-w-0 flex-1 mr-2"> 
                                <h3 className="font-bold text-lg leading-tight mb-1 truncate">{project.projectName}</h3>
                                <p className="text-xs text-gray-300 flex items-center truncate">
                                <MapPin className="w-3 h-3 mr-1 flex-shrink-0" /> <span className="truncate">{project.projectLocation || 'No location'}</span>
                                </p>
                            </div>
                            <Badge className={`
                                ${project.status === 'approved' ? 'bg-green-500' : project.status === 'pending' ? 'bg-yellow-500' : project.status === 'rejected' ? 'bg-red-500' : 'bg-orange-500'} 
                                border-none text-[10px] px-2 py-0.5 h-6 whitespace-nowrap capitalize`
                            }>
                                {project.status === 'approved' ? 'Live' : project.status}
                            </Badge>
                            </div>

                            <button className="absolute top-3 right-3 p-1.5 bg-white/20 backdrop-blur rounded-full hover:bg-white text-white hover:text-[#0b264f] transition-colors">
                            <MoreVertical className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="p-4 md:p-5 flex flex-col flex-grow gap-4">

                            {/* Inventory Grid */}
                            <div className="grid grid-cols-2 gap-3 pb-4 border-b border-gray-100">
                            <div className="bg-blue-50 rounded-xl p-3">
                                <p className="text-xs text-blue-600 font-semibold mb-1">Sold</p>
                                <div className="flex items-end gap-1">
                                <span className="text-lg md:text-xl font-bold text-[#0b264f]">{soldUnits}</span>
                                <span className="text-xs text-gray-400 mb-1">/ {project.totalUnits || 0}</span>
                                </div>
                                {/* Mini Progress Bar */}
                                <div className="h-1.5 w-full bg-blue-200 rounded-full mt-2 overflow-hidden">
                                <div className="h-full bg-blue-600 rounded-full" style={{ width: `${progress}%` }}></div>
                                </div>
                            </div>
                            <div className="bg-green-50 rounded-xl p-3">
                                <p className="text-xs text-green-600 font-semibold mb-1">Type</p>
                                <p className="text-sm font-bold text-green-800 mt-1">{project.projectType || 'Residential'}</p>
                            </div>
                            </div>

                            {/* Lower Details */}
                            <div className="space-y-3">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500 flex items-center">
                                <Users className="w-4 h-4 mr-2 text-gray-400" /> Active Leads
                                </span>
                                <span className="font-bold text-gray-900">{project.inquiries || 0}</span>
                            </div>

                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500 flex items-center">
                                <HardHat className="w-4 h-4 mr-2 text-gray-400" /> Phase
                                </span>
                                <span className="font-bold text-gray-900 truncate pl-2">{project.currentConstructionStatus || 'N/A'}</span>
                            </div>
                            </div>

                            {/* Action */}
                            <Button 
                                onClick={() => navigate('/partner/projects')} 
                                className="w-full mt-2 bg-white text-[#0b264f] border border-gray-200 hover:bg-[#0b264f] hover:text-white transition-all shadow-sm group-hover:border-[#0b264f]"
                            >
                            Manage Project
                            </Button>
                        </div>
                        </div>
                    );
                })}
                </div>
            )}
          </div>

        </div>
      </div>
      <Footer />
    </div>
  );
};

export default BuilderDashboard;