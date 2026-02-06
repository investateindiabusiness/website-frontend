import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Building2, 
  MapPin, 
  Search, 
  Users, 
  TrendingUp, 
  MoreVertical,
  Wallet,
  HardHat,
  PieChart as PieChartIcon
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer
} from 'recharts';
import Header from '@/components/Header'; 
import Footer from '@/components/Footer'; 
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

// --- MOCK DATA (Unchanged) ---
const ANALYTICS_DATA = [
  { name: 'Sep', leads: 40, sales: 24 },
  { name: 'Oct', leads: 30, sales: 13 },
  { name: 'Nov', leads: 60, sales: 38 },
  { name: 'Dec', leads: 90, sales: 55 },
  { name: 'Jan', leads: 65, sales: 40 },
  { name: 'Feb', leads: 85, sales: 68 },
];

const MY_PROJECTS = [
  { 
    id: 1, 
    title: 'Imperial Heights', 
    location: 'Mumbai, Maharashtra', 
    type: 'Luxury Residential', 
    totalUnits: 120,
    soldUnits: 85,
    revenue: '₹212 Cr',
    leads: 145,
    progress: 100, 
    status: 'Ready to Move',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80',
    recentActivity: '+2 Sales this week'
  },
  { 
    id: 2, 
    title: 'Cyber City Lofts', 
    location: 'Hyderabad, Telangana', 
    type: 'Smart Homes', 
    totalUnits: 200,
    soldUnits: 45,
    revenue: '₹49.5 Cr',
    leads: 312,
    progress: 65,
    status: 'Under Construction',
    image: 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=800&q=80',
    recentActivity: 'Foundation complete'
  },
  { 
    id: 3, 
    title: 'Green Valley Villas', 
    location: 'Bangalore, Karnataka', 
    type: 'Gated Community', 
    totalUnits: 50,
    soldUnits: 12,
    revenue: '₹18 Cr',
    leads: 89,
    progress: 15,
    status: 'New Launch',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80',
    recentActivity: 'Brochure released'
  },
];

const BuilderDashboard = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const totalRevenue = "₹279.5 Cr";
  const totalLeads = MY_PROJECTS.reduce((acc, curr) => acc + curr.leads, 0);
  const totalUnitsSold = MY_PROJECTS.reduce((acc, curr) => acc + curr.soldUnits, 0);

  const filteredProjects = MY_PROJECTS.filter(p => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    // FIX 1: Added overflow-x-hidden to prevent horizontal scroll on mobile
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans overflow-x-hidden">
      <Header />

      <div className="flex-grow mt-16 pb-12">
        
        {/* --- HERO SECTION --- */}
        {/* FIX 2: Adjusted padding (pt-6 vs pt-10) and rounded corners for mobile */}
        <div className="bg-gradient-to-r from-[#0b264f] to-[#1a4b8c] text-white pt-6 pb-12 md:pt-10 md:pb-20 px-4 md:px-8 rounded-b-[2rem] md:rounded-b-[2.5rem] shadow-xl relative overflow-hidden">
          
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl pointer-events-none"></div>
          
          <div className="container mx-auto relative z-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
              
              {/* Greeting & Profile */}
              <div className="w-full md:w-auto">
                <Badge className="bg-blue-500/20 text-blue-100 hover:bg-blue-500/30 border-none mb-3 backdrop-blur-sm px-3 py-1">
                  <HardHat className="w-3.5 h-3.5 mr-1.5" /> Apex Constructors
                </Badge>
                {/* FIX 3: Responsive text sizing */}
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2">Dashboard Overview</h1>
                <p className="text-sm md:text-base text-blue-100 opacity-90">Track performance, manage inventory, and monitor leads.</p>
              </div>
            </div>

            {/* Top Level Stats Grid */}
            {/* FIX 4: Grid gap adjusted (gap-3 vs gap-4) and columns set for mobile */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mt-8">
              {[
                { label: 'Total Revenue', value: totalRevenue, icon: Wallet, color: 'text-green-400' },
                { label: 'Active Leads', value: totalLeads, icon: Users, color: 'text-blue-300' },
                { label: 'Units Sold', value: totalUnitsSold, icon: Building2, color: 'text-orange-300' },
                { label: 'Conversion', value: '4.2%', icon: TrendingUp, color: 'text-purple-300' },
              ].map((stat, idx) => (
                <div key={idx} className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-3 md:p-4 flex flex-col justify-between hover:bg-white/15 transition-all cursor-pointer">
                  <div className="flex justify-between items-start">
                    <div className={`p-1.5 md:p-2 rounded-lg bg-white/10 ${stat.color}`}>
                      <stat.icon className="w-4 h-4 md:w-5 md:h-5" />
                    </div>
                    {idx === 0 && <span className="text-[10px] bg-green-500 text-white px-1.5 py-0.5 rounded">+12%</span>}
                  </div>
                  <div className="mt-3 md:mt-4">
                    {/* FIX 5: Smaller text on mobile to prevent wrapping issues */}
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
              {/* FIX 6: Flex-col on mobile so dropdown doesn't squish title */}
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
                        <stop offset="5%" stopColor="#0b264f" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#0b264f" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} width={30} />
                    <Tooltip 
                      contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}}
                    />
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
                  { source: 'Total Properties', count: '45%', color: 'bg-[#0b264f]' },
                  { source: 'Sold Properties', count: '30%', color: 'bg-blue-500' },
                  { source: 'Leads', count: '15%', color: 'bg-orange-500' },
                  { source: 'Social Media', count: '10%', color: 'bg-gray-300' },
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
                  placeholder="Search projects..." 
                  className="flex-grow py-2 px-3 outline-none text-gray-700 bg-transparent text-sm w-full min-w-0" // Added min-w-0
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Projects Grid */}
            {/* FIX 7: Switched to single column on mobile, 2 on tablet, 3 on desktop */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project) => (
                <div key={project.id} className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-lg transition-all border border-gray-100 flex flex-col group">
                  
                  {/* Image Header */}
                  <div className="h-48 md:h-40 relative overflow-hidden">
                     <img 
                       src={project.image} 
                       alt={project.title} 
                       className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                     />
                     <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                     <div className="absolute bottom-3 left-4 right-4 flex justify-between items-end text-white">
                       <div className="min-w-0 flex-1 mr-2"> {/* min-w-0 enables truncate */}
                         <h3 className="font-bold text-lg leading-tight mb-1 truncate">{project.title}</h3>
                         <p className="text-xs text-gray-300 flex items-center truncate">
                           <MapPin className="w-3 h-3 mr-1 flex-shrink-0" /> <span className="truncate">{project.location}</span>
                         </p>
                       </div>
                       <Badge className={`
                         ${project.status === 'Ready to Move' ? 'bg-green-500' : 'bg-orange-500'} 
                         border-none text-[10px] px-2 py-0.5 h-6 whitespace-nowrap`
                       }>
                         {project.status}
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
                             <span className="text-lg md:text-xl font-bold text-[#0b264f]">{project.soldUnits}</span>
                             <span className="text-xs text-gray-400 mb-1">/ {project.totalUnits}</span>
                          </div>
                          {/* Mini Progress Bar */}
                          <div className="h-1.5 w-full bg-blue-200 rounded-full mt-2 overflow-hidden">
                             <div 
                               className="h-full bg-blue-600 rounded-full" 
                               style={{ width: `${(project.soldUnits / project.totalUnits) * 100}%` }}
                             ></div>
                          </div>
                       </div>
                       <div className="bg-green-50 rounded-xl p-3">
                          <p className="text-xs text-green-600 font-semibold mb-1">Revenue</p>
                          <p className="text-lg md:text-xl font-bold text-green-800">{project.revenue}</p>
                          <p className="text-[10px] text-green-600 mt-1 flex items-center">
                             <TrendingUp className="w-3 h-3 mr-1" /> On Track
                          </p>
                       </div>
                    </div>

                    {/* Lower Details */}
                    <div className="space-y-3">
                       <div className="flex justify-between text-sm">
                          <span className="text-gray-500 flex items-center">
                             <Users className="w-4 h-4 mr-2 text-gray-400" /> Active Leads
                          </span>
                          <span className="font-bold text-gray-900">{project.leads}</span>
                       </div>
                       
                       <div className="flex justify-between text-sm">
                          <span className="text-gray-500 flex items-center">
                             <HardHat className="w-4 h-4 mr-2 text-gray-400" /> Construction
                          </span>
                          <span className="font-bold text-gray-900">{project.progress}%</span>
                       </div>
                       <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                          <div className="bg-orange-400 h-full rounded-full" style={{ width: `${project.progress}%` }}></div>
                       </div>
                    </div>

                    {/* Action */}
                    <Button className="w-full mt-2 bg-white text-[#0b264f] border border-gray-200 hover:bg-[#0b264f] hover:text-white transition-all shadow-sm group-hover:border-[#0b264f]">
                      Manage Project
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
      <Footer />
    </div>
  );
};

export default BuilderDashboard;