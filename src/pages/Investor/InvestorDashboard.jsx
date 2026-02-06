import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Building2,
  MapPin,
  Search,
  Heart,
  Phone,
  ArrowUpRight,
  TrendingUp,
  Shield,
  CheckCircle,
  Filter,
  Star,
  Trophy,
  PieChart as PieChartIcon,
  BarChart as BarChartIcon
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

// --- MOCK DATA ---

// Chart Data: Market Trends
const MARKET_TRENDS = [
  { name: 'Q1', price: 1.2, yield: 4.5 },
  { name: 'Q2', price: 1.4, yield: 4.8 },
  { name: 'Q3', price: 1.3, yield: 5.1 },
  { name: 'Q4', price: 1.8, yield: 5.5 },
  { name: 'Q1', price: 2.1, yield: 6.0 },
  { name: 'Q2', price: 2.4, yield: 6.2 },
];

const AVAILABLE_PROPERTIES = [
  {
    id: 1,
    title: 'Imperial Heights',
    builder: 'Apex Constructors',
    location: 'Mumbai, Maharashtra',
    type: '3 BHK Luxury',
    price: '₹2.5 Cr',
    yield: '+12% proj. ROI',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80',
    status: 'Ready to Move',
    isShortlisted: true
  },
  {
    id: 3,
    title: 'Cyber City Lofts',
    builder: 'City Developers',
    location: 'Hyderabad, Telangana',
    type: '2 BHK Smart Home',
    price: '₹1.1 Cr',
    yield: 'Rental: ₹45k/mo',
    image: 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=800&q=80',
    status: 'Under Construction',
    isShortlisted: true
  },
  {
    id: 4,
    title: 'Coastal Breeze',
    builder: 'Coastal Living',
    location: 'Kochi, Kerala',
    type: '4 BHK Sea View',
    price: '₹3.2 Cr',
    yield: 'Premium Segment',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80',
    status: 'Ready to Move',
    isShortlisted: false
  },
];

const MY_INQUIRIES = [
  { id: 101, property: 'Serene Meadows', builder: 'Eco Homes', date: '2 days ago', status: 'Pending', message: 'Waiting for brochure' },
  { id: 102, property: 'Imperial Heights', builder: 'Apex Constructors', date: '1 week ago', status: 'Replied', message: 'Builder sent floor plans' },
];

const PORTFOLIO_GROWTH = [
  { year: '2020', invested: 1.0, value: 1.0 },
  { year: '2021', invested: 1.0, value: 1.15 },
  { year: '2022', invested: 1.5, value: 1.8 },
  { year: '2023', invested: 1.5, value: 2.1 },
  { year: '2024', invested: 2.2, value: 3.4 }, // Current
  { year: '2025', invested: 2.2, value: 3.9 }, // Projected
];

// Chart 2: Top Performing Indian Cities (Appreciation + Rental)
const CITY_PERFORMANCE = [
  { city: 'Hyderabad', appreciation: 12.5, rental: 3.8 },
  { city: 'Bangalore', appreciation: 9.2, rental: 5.1 },
  { city: 'Mumbai', appreciation: 6.5, rental: 2.9 },
  { city: 'Gurugram', appreciation: 10.8, rental: 3.5 },
];

const InvestorDashboard = () => {
  const navigate = useNavigate();
  const [properties, setProperties] = useState(AVAILABLE_PROPERTIES);
  const [searchQuery, setSearchQuery] = useState('');
  const [locationFilter, setLocationFilter] = useState('All');

  // Toggle Shortlist
  const toggleShortlist = (id) => {
    setProperties(properties.map(prop =>
      prop.id === id ? { ...prop, isShortlisted: !prop.isShortlisted } : prop
    ));
  };

  // Filter Logic
  const filteredProperties = properties.filter(prop => {
    const matchesSearch = prop.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prop.builder.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLocation = locationFilter === 'All' || prop.location.includes(locationFilter);
    return matchesSearch && matchesLocation;
  });

  const locations = ['All', ...new Set(AVAILABLE_PROPERTIES.map(p => p.location.split(',')[0]))];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans overflow-x-hidden">
      <Header />

      <div className="flex-grow mt-16 pb-12">

        {/* --- HERO SECTION --- */}
        <div className="bg-gradient-to-r from-[#0b264f] to-[#1a4b8c] text-white pt-6 pb-12 md:pt-10 md:pb-16 px-4 md:px-8 rounded-b-[2rem] md:rounded-b-[2.5rem] shadow-xl relative overflow-hidden">
          {/* Background Decorative Circles */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-16 -mt-16 blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/5 rounded-full -ml-10 -mb-10 blur-2xl pointer-events-none"></div>

          <div className="container mx-auto relative z-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <Badge className="bg-orange-500/20 text-orange-200 hover:bg-orange-500/30 border-none mb-2 backdrop-blur-sm">
                  <Shield className="w-3 h-3 mr-1" /> Verified Investor
                </Badge>
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-1">Welcome, Rahul</h1>
                <p className="text-blue-100 text-sm md:text-base opacity-90">Manage your portfolio and discover India's top realty.</p>
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

        {/* --- MAIN CONTAINER --- */}
        <div className="container mx-auto px-4 -mt-6 md:-mt-8 relative z-20 space-y-6 md:space-y-10">

          {/* --- NEW SECTION: ANALYTICS CHARTS --- */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Chart 1: Portfolio Growth (ROI Focus) */}
            <div className="lg:col-span-2 bg-white rounded-3xl p-5 shadow-sm border border-gray-100">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-2 sm:gap-0">
                <div>
                  <h3 className="font-bold text-gray-900 text-lg flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2 text-[#0b264f]" /> Portfolio Growth
                  </h3>
                  <p className="text-xs text-gray-500">Invested Amount vs. Market Value (₹ Cr)</p>
                </div>
              </div>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={PORTFOLIO_GROWTH} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorInvested" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="#94a3b8" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
                    <Tooltip
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                      formatter={(value, name) => [`₹${value} Cr`, name === 'value' ? 'Market Value' : 'Invested']}
                    />
                    <Area type="monotone" dataKey="value" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
                    <Area type="monotone" dataKey="invested" stroke="#94a3b8" strokeWidth={2} strokeDasharray="5 5" fill="url(#colorInvested)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 2: High Growth Hubs (Decision Making) */}
            <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 flex flex-col">
              <h3 className="font-bold text-gray-900 text-lg mb-2 flex items-center">
                <BarChartIcon className="w-5 h-5 mr-2 text-orange-500" /> High Growth Hubs
              </h3>
              <p className="text-xs text-gray-500 mb-4">Top Indian cities by annual appreciation</p>

              <div className="h-56 md:h-full w-full min-h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={CITY_PERFORMANCE} layout="vertical" margin={{ top: 0, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f0f0f0" />
                    <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 10 }} />
                    <YAxis dataKey="city" type="category" axisLine={false} tickLine={false} tick={{ fill: '#4b5563', fontSize: 12, fontWeight: 500 }} width={70} />
                    <Tooltip
                      cursor={{ fill: '#f9fafb' }}
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                    />
                    <Bar dataKey="appreciation" name="Appreciation %" fill="#0b264f" radius={[0, 4, 4, 0]} barSize={20} />
                    <Bar dataKey="rental" name="Rental Yield %" fill="#f97316" radius={[0, 4, 4, 0]} barSize={20} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-4 flex justify-center gap-4 text-[10px] text-gray-500">
                <div className="flex items-center"><div className="w-2 h-2 rounded-full bg-[#0b264f] mr-1"></div> Appreciation</div>
                <div className="flex items-center"><div className="w-2 h-2 rounded-full bg-orange-500 mr-1"></div> Rental Yield</div>
              </div>
            </div>
          </div>

          {/* --- SEARCH BAR (Responsive) --- */}
          <div className="bg-white rounded-2xl shadow-lg p-2 flex flex-col sm:flex-row items-center gap-2 max-w-3xl mx-auto border border-gray-100">
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

          {/* --- SECTION 2: EXPLORE PROPERTIES --- */}
          <div>
            <div className="mb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <h2 className="text-xl font-bold text-gray-900">Explore Opportunities</h2>

              {/* Location Pills - Scrollable */}
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

            {/* Property Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {filteredProperties.map((property) => (
                <div key={property.id} className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col h-full">

                  {/* Image Section */}
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                      src={property.image}
                      alt={property.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />

                    {/* Overlay Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-80"></div>

                    {/* Top Badges */}
                    <div className="absolute top-4 left-4 flex gap-2">
                      <Badge className="bg-white/90 backdrop-blur text-[#0b264f] border-none font-bold shadow-sm">
                        {property.status}
                      </Badge>
                    </div>

                    {/* Like Button */}
                    <button
                      onClick={() => toggleShortlist(property.id)}
                      className="absolute top-4 right-4 p-2.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 hover:bg-white transition-all group-active:scale-95"
                    >
                      <Heart className={`w-5 h-5 ${property.isShortlisted ? 'fill-red-500 text-red-500' : 'text-white group-hover:text-red-500'}`} />
                    </button>

                    {/* Bottom Info on Image */}
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <p className="text-xs font-medium bg-green-500/90 backdrop-blur-md inline-flex items-center px-2 py-0.5 rounded-md mb-2">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        {property.yield}
                      </p>
                      <h3 className="text-xl font-bold leading-tight drop-shadow-md">{property.price}</h3>
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="p-4 md:p-5 flex flex-col flex-grow">
                    <div className="flex-grow">
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="font-bold text-gray-900 text-lg line-clamp-1">{property.title}</h3>
                      </div>
                      <p className="text-sm text-gray-500 mb-3 flex items-center">
                        <Building2 className="w-3.5 h-3.5 mr-1" /> {property.builder}
                      </p>

                      <div className="flex items-center text-xs text-gray-500 bg-gray-50 p-2.5 rounded-xl mb-4 w-full">
                        <MapPin className="w-4 h-4 mr-2 text-orange-500 flex-shrink-0" />
                        <span className="truncate">{property.location}</span>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-4">
                        <span className="text-xs font-semibold px-2 py-1 bg-blue-50 text-blue-700 rounded-md border border-blue-100">
                          {property.type}
                        </span>
                        <span className="text-xs font-semibold px-2 py-1 bg-green-50 text-green-700 rounded-md border border-green-100 flex items-center">
                          <CheckCircle className="w-3 h-3 mr-1" /> RERA
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="grid grid-cols-5 gap-2 mt-auto">
                      <Button
                        onClick={() => alert(`Contacting ${property.builder}`)}
                        className="col-span-4 bg-[#0b264f] hover:bg-blue-900 text-white rounded-xl h-10 md:h-12 shadow-lg hover:shadow-blue-900/20"
                      >
                        <Phone className="w-4 h-4 mr-2" /> Contact
                      </Button>
                      <Button variant="outline" className="col-span-1 rounded-xl h-10 md:h-12 border-gray-200 hover:bg-gray-50 p-0 flex items-center justify-center">
                        <ArrowUpRight className="w-5 h-5 text-gray-600" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-8 pb-4">
            <div className="flex items-center justify-between px-1 mb-6">
              <h2 className="text-xl font-bold text-gray-900">Top Rated Developers</h2>
              <button className="text-sm font-semibold text-[#0b264f] hover:underline flex items-center">
                View All <ArrowUpRight className="w-4 h-4 ml-1" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {[
                {
                  id: 1,
                  name: 'Apex Constructors',
                  location: 'Mumbai, MH',
                  projects: '12 Active',
                  exp: '15+ Years',
                  rating: 4.8,
                  logo: 'https://ui-avatars.com/api/?name=Apex+Constructors&background=0b264f&color=fff',
                  cover: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80'
                },
                {
                  id: 2,
                  name: 'Eco Homes',
                  location: 'Bangalore, KA',
                  projects: '8 Active',
                  exp: '9 Years',
                  rating: 4.6,
                  logo: 'https://ui-avatars.com/api/?name=Eco+Homes&background=10b981&color=fff',
                  cover: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=800&q=80'
                },
                {
                  id: 3,
                  name: 'City Developers',
                  location: 'Hyderabad, TS',
                  projects: '22 Active',
                  exp: '25+ Years',
                  rating: 4.9,
                  logo: 'https://ui-avatars.com/api/?name=City+Devs&background=f97316&color=fff',
                  cover: 'https://images.unsplash.com/photo-1460317442991-0ec209397118?w=800&q=80'
                },
              ].map((builder) => (
                <div key={builder.id} className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 relative">

                  {/* Cover Image */}
                  <div className="h-32 w-full overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10"></div>
                    <img
                      src={builder.cover}
                      alt="Cover"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>

                  {/* Profile Content */}
                  <div className="px-5 md:px-6 pb-6 relative z-20">
                    {/* Logo - Floating up */}
                    <div className="flex justify-between items-end -mt-10 mb-3">
                      <div className="h-20 w-20 rounded-2xl border-4 border-white bg-white shadow-md overflow-hidden">
                        <img src={builder.logo} alt={builder.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="mb-1 flex items-center bg-yellow-50 text-yellow-700 px-2 py-1 rounded-lg border border-yellow-100">
                        <Star className="w-3.5 h-3.5 fill-yellow-500 text-yellow-500 mr-1" />
                        <span className="text-xs font-bold">{builder.rating}</span>
                      </div>
                    </div>

                    {/* Text Info */}
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 leading-tight">{builder.name}</h3>
                      <p className="text-xs text-gray-500 flex items-center mt-1">
                        <MapPin className="w-3 h-3 mr-1" /> {builder.location}
                      </p>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-3 mt-5 mb-5">
                      <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 text-center group-hover:bg-blue-50/50 transition-colors">
                        <p className="text-xs text-gray-400 uppercase tracking-wider font-bold">Projects</p>
                        <p className="text-sm font-bold text-[#0b264f] flex items-center justify-center gap-1">
                          <Building2 className="w-3 h-3" /> {builder.projects}
                        </p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 text-center group-hover:bg-blue-50/50 transition-colors">
                        <p className="text-xs text-gray-400 uppercase tracking-wider font-bold">Exp</p>
                        <p className="text-sm font-bold text-[#0b264f] flex items-center justify-center gap-1">
                          <Trophy className="w-3 h-3" /> {builder.exp}
                        </p>
                      </div>
                    </div>

                    {/* Action Button */}
                    <Button className="w-full bg-white text-[#0b264f] border border-gray-200 hover:bg-[#0b264f] hover:text-white hover:border-[#0b264f] rounded-xl transition-all shadow-sm">
                      View Profile
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Empty State */}
          {filteredProperties.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="bg-gray-100 p-6 rounded-full mb-4">
                <Filter className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">No Properties Found</h3>
              <p className="text-gray-500 max-w-xs mx-auto">Try adjusting your search or filters to find what you're looking for.</p>
              <Button
                onClick={() => { setSearchQuery(''); setLocationFilter('All'); }}
                variant="link"
                className="text-orange-600 font-bold mt-2"
              >
                Clear Filters
              </Button>
            </div>
          )}

        </div>
      </div>
      <Footer />
    </div>
  );
};

export default InvestorDashboard;