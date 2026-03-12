import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Building2, MapPin, Search, TrendingUp, CheckCircle, 
  Filter, Loader2, ArrowRight, ShieldCheck 
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/AuthContext';
import { apiRequest } from '@/api';
import { toast } from '@/hooks/use-toast';

const InvestorProperties = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Real Database States
  const [properties, setProperties] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  
  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [locationFilter, setLocationFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');

  // --- FETCH REAL VERIFIED PROJECTS ---
  useEffect(() => {
    const loadProjects = async () => {
      try {
        setLoadingProjects(true);
        // Using role=investor ensures the backend only sends approved projects
        const data = await apiRequest('/api/projects?role=investor', {
          method: 'GET',
          headers: user?.token ? { 'Authorization': `Bearer ${user.token}` } : undefined
        });
        
        // Map the backend DB structure to match the UI expectations
        const mappedData = data
          .filter(p => p.status === 'approved') // Extra safety check
          .map(p => ({
            id: p.id,
            title: p.projectName || 'Unnamed Project',
            builder: p.builderName || 'Unknown Builder',
            location: p.projectLocation || 'Location TBA',
            type: p.projectType || 'Property',
            price: p.sellingPrice || 'Price on Request',
            yield: p.expectedRent ? `Rent: ${p.expectedRent}` : 'High ROI',
            // Default image if builder didn't upload one
            image: (p.projectImages && p.projectImages.length > 0 && p.projectImages[0].startsWith('http')) 
                   ? p.projectImages[0] 
                   : 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80',
            status: p.currentConstructionStatus || 'Active',
            totalUnits: p.totalUnits || 'N/A'
        }));

        setProperties(mappedData);
      } catch (error) {
        toast({ title: "Error", description: "Failed to load properties.", variant: "destructive" });
      } finally {
        setLoadingProjects(false);
      }
    };

    loadProjects();
  }, [user]);

  // --- FILTER LOGIC ---
  const filteredProperties = properties.filter(prop => {
    const matchesSearch = prop.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          prop.builder.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLocation = locationFilter === 'All' || prop.location.includes(locationFilter);
    const matchesType = typeFilter === 'All' || prop.type === typeFilter;
    
    return matchesSearch && matchesLocation && matchesType;
  });

  // Dynamically generate filter tabs based on actual available properties
  const locations = ['All', ...new Set(properties.map(p => p.location.split(',')[0].trim()))];
  const propertyTypes = ['All', ...new Set(properties.map(p => p.type))];

  return (
    <div className="min-h-screen bg-[#F4F5F7] flex flex-col font-sans overflow-x-hidden">
      <Header />

      <main className="flex-grow mt-[4rem] pb-16">

        <div className="container mx-auto px-4 py-8">
            
            {/* --- SEARCH & FILTERS --- */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 mb-8 sticky top-[4rem] z-30">
                <div className="flex flex-col lg:flex-row gap-4">
                    {/* Search */}
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

                    {/* Type Filter */}
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

                {/* Location Pills */}
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

            {/* --- PROPERTIES GRID --- */}
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {filteredProperties.map((property) => (
                  <div key={property.id} className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-200 flex flex-col h-full">

                    {/* Image Section */}
                    <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                      <img
                        src={property.image}
                        alt={property.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80' }}
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-90"></div>

                      <div className="absolute top-4 left-4 flex gap-2">
                        <Badge className="bg-white/95 backdrop-blur text-[#0b264f] border-none font-bold shadow-sm px-3 py-1">
                          {property.status}
                        </Badge>
                      </div>

                      <div className="absolute bottom-4 left-4 right-4 text-white">
                        <p className="text-xs font-semibold bg-green-500/90 backdrop-blur-md inline-flex items-center px-2.5 py-1 rounded-md mb-2">
                          <TrendingUp className="w-3.5 h-3.5 mr-1" />
                          {property.yield}
                        </p>
                        <h3 className="text-2xl font-bold leading-tight drop-shadow-md">{property.price}</h3>
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className="p-5 flex flex-col flex-grow">
                      <div className="flex-grow">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-bold text-gray-900 text-xl line-clamp-1">{property.title}</h3>
                        </div>
                        <p className="text-sm text-gray-500 mb-4 flex items-center font-medium">
                          <Building2 className="w-4 h-4 mr-1.5 text-gray-400" /> {property.builder}
                        </p>

                        <div className="flex items-center text-xs text-gray-600 bg-gray-50 p-3 rounded-xl mb-5 border border-gray-100">
                          <MapPin className="w-4 h-4 mr-2 text-orange-500 flex-shrink-0" />
                          <span className="truncate">{property.location}</span>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-6">
                          <span className="text-xs font-semibold px-2.5 py-1 bg-blue-50 text-blue-700 rounded-md border border-blue-100">
                            {property.type}
                          </span>
                          <span className="text-xs font-semibold px-2.5 py-1 bg-gray-100 text-gray-700 rounded-md border border-gray-200">
                            {property.totalUnits} Units
                          </span>
                          <span className="text-xs font-semibold px-2.5 py-1 bg-green-50 text-green-700 rounded-md border border-green-100 flex items-center">
                            <CheckCircle className="w-3 h-3 mr-1" /> Verified
                          </span>
                        </div>
                      </div>

                      {/* Action */}
                      <Button
                        onClick={() => navigate(`/project/${property.id}`)}
                        className="w-full bg-[#0b264f] hover:bg-blue-900 text-white rounded-xl h-12 shadow-lg hover:shadow-blue-900/20 text-md"
                      >
                        View Full Details <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default InvestorProperties;