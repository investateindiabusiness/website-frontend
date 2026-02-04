import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import {
  Building2,
  Shield,
  TrendingUp,
  Globe,
  CheckCircle,
  Star,
  ArrowRight,
  MapPin,
  Home as HomeIcon,
  Search,
  ChevronDown,
  X,
  Briefcase
} from 'lucide-react';
import { projects, cities, testimonials, developers } from '../mockData';

const Home = () => {
  const navigate = useNavigate();
  const featuredProjects = projects.filter(p => p.featured).slice(0, 3);

  // --- Search Bar States ---
  const [activeTab, setActiveTab] = useState('buy'); // buy, rent, plots
  const [locationQuery, setLocationQuery] = useState('');
  const [allCities, setAllCities] = useState([]);
  const [filteredCities, setFilteredCities] = useState([]);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [showPropertyDropdown, setShowPropertyDropdown] = useState(false);
  const [showBudgetDropdown, setShowBudgetDropdown] = useState(false);

  // Selection States
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedPropertyType, setSelectedPropertyType] = useState('Flat');
  const [budgetRange, setBudgetRange] = useState('Budget');

  const locationRef = useRef(null);
  const propertyRef = useRef(null);
  const budgetRef = useRef(null);

  // --- API Call for Cities ---
  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await fetch('https://countriesnow.space/api/v0.1/countries/cities', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ country: 'india' })
        });
        const result = await response.json();
        if (!result.error) {
          setAllCities(result.data);
        }
      } catch (error) {
        console.error("Failed to fetch cities:", error);
      }
    };
    fetchCities();
  }, []);

  // Filter cities based on input
  useEffect(() => {
    if (locationQuery.length > 0) {
      const filtered = allCities.filter(city =>
        city.toLowerCase().startsWith(locationQuery.toLowerCase())
      ).slice(0, 10); // Limit to top 10 results for performance
      setFilteredCities(filtered);
    } else {
      setFilteredCities([]);
    }
  }, [locationQuery, allCities]);

  // Click Outside Handler
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (locationRef.current && !locationRef.current.contains(event.target)) setShowLocationDropdown(false);
      if (propertyRef.current && !propertyRef.current.contains(event.target)) setShowPropertyDropdown(false);
      if (budgetRef.current && !budgetRef.current.contains(event.target)) setShowBudgetDropdown(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCitySelect = (city) => {
    setSelectedCity(city);
    setLocationQuery(city);
    setShowLocationDropdown(false);
  };

  return (
    <>
      <div className="max-w-[100vw] min-h-screen bg-white overflow-x-hidden">
        <Header />

        {/* Hero Section - Fixed for mobile height */}
        <section className="relative min-h-[100vh] md:h-[calc(100vh-4rem)] mt-16 flex items-center justify-center overflow-hidden py-10 md:py-0">
          <div
            className="absolute inset-0 z-0"
            style={{
              backgroundImage:
                'url(https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1920&h=1080&fit=crop)',
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-blue-700/90"></div>
          </div>

          <div className="container mx-auto px-4 z-10 text-center text-white relative">
            <Badge className="bg-white/20 text-white border-white/30 px-4 py-2 text-sm">
              Trusted by 500+ NRI Investors
            </Badge>
            <h1 className="text-3xl md:text-7xl font-bold mt-4 leading-tight">
              Invest in India's<br />
              <span className="text-orange-400">Premier Real Estate</span>
            </h1>
            <p className="text-lg md:text-xl mb-6 max-w-full mx-auto text-white px-2">
              Connecting NRI Investors to verified builders and transparent investment opportunities across India
            </p>

            {/* --- SEARCH BAR SECTION START --- */}
            <div className="max-w-5xl mx-auto mb-4 relative text-left">

              {/* Main Search Container - Added flex-col for mobile */}
              <div className="bg-white rounded-xl md:rounded-full p-2 shadow-2xl flex flex-col md:flex-row items-center divide-y md:divide-y-0 md:divide-x divide-gray-200">

                {/* 1. Location Input */}
                <div className="relative w-full md:w-[40%] px-6 py-4 md:py-2" ref={locationRef}>
                  <div
                    className="flex items-center gap-3 cursor-pointer"
                    onClick={() => setShowLocationDropdown(true)}
                  >
                    <MapPin className="text-orange-400 w-5 h-5 flex-shrink-0" />
                    <div className="w-full">
                      <div className="text-xs font-bold text-gray-500 uppercase tracking-wide">Location</div>
                      <input
                        type="text"
                        className="w-full outline-none text-gray-900 font-medium placeholder-gray-400 bg-transparent truncate"
                        placeholder="Enter City, State"
                        value={locationQuery}
                        onChange={(e) => {
                          setLocationQuery(e.target.value);
                          setShowLocationDropdown(true);
                          setSelectedCity('');
                        }}
                      />
                    </div>
                    {locationQuery && (
                      <X
                        className="w-4 h-4 text-gray-400 hover:text-gray-600 cursor-pointer"
                        onClick={(e) => { e.stopPropagation(); setLocationQuery(''); }}
                      />
                    )}
                  </div>

                  {/* Location Dropdown */}
                  {showLocationDropdown && (
                    <div className="absolute top-full left-0 w-full md:w-[350px] bg-white rounded-xl shadow-xl border border-gray-100 mt-2 p-2 z-[100] max-h-80 overflow-y-auto">
                      <div className="text-xs font-semibold text-gray-400 px-3 py-2">SUGGESTIONS</div>
                      {filteredCities.length > 0 ? (
                        filteredCities.map((city, idx) => (
                          <div
                            key={idx}
                            className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
                            onClick={() => handleCitySelect(city)}
                          >
                            <div className="bg-gray-100 p-2 rounded-full"><MapPin className="w-4 h-4 text-gray-500" /></div>
                            <div>
                              <div className="text-gray-800 font-medium">{city}</div>
                              <div className="text-xs text-gray-500">City in India</div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="p-4 text-center text-gray-500">
                          {locationQuery.length > 0 ? "No cities found" : "Type to search cities in India..."}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* 2. Property Type */}
                <div className="relative w-full md:w-[30%] px-6 py-4 md:py-2" ref={propertyRef}>
                  <div
                    className="flex items-center gap-3 cursor-pointer"
                    onClick={() => setShowPropertyDropdown(!showPropertyDropdown)}
                  >
                    <HomeIcon className="text-orange-400 w-5 h-5 flex-shrink-0" />
                    <div className="w-full">
                      <div className="flex items-center gap-2">
                        <div className="text-xs font-bold text-gray-500 uppercase tracking-wide">Property Type</div>
                        <ChevronDown className="w-3 h-3 text-gray-400" />
                      </div>
                      <div className="text-gray-900 font-medium truncate">{selectedPropertyType}</div>
                    </div>
                  </div>

                  {/* Property Dropdown */}
                  {showPropertyDropdown && (
                    <div className="absolute top-full left-0 md:-left-12 w-full md:w-[450px] bg-white rounded-xl shadow-xl border border-gray-100 mt-2 p-4 z-[100]">

                      {/* Residential Section */}
                      <div className="mb-4">
                        <div className="text-xs font-bold text-gray-400 mb-3 uppercase">Residential</div>

                        {/* Property Types */}
                        <div className="flex flex-wrap gap-2">
                          {['Flat', 'House/Villa', 'Plot'].map(type => (
                            <div
                              key={type}
                              onClick={() => setSelectedPropertyType(type)} // Clicking a type resets the selection to just that type
                              className={`px-4 py-2 rounded-full text-sm border cursor-pointer transition-colors ${selectedPropertyType.includes(type)
                                ? 'bg-red-50 border-red-200 text-red-600'
                                : 'border-gray-200 text-gray-600 hover:bg-red-50 hover:border-red-200 hover:text-red-600'
                                }`}
                            >
                              {type}
                            </div>
                          ))}
                        </div>

                        {/* BHK Options - Only show if Plot is NOT selected */}
                        {!selectedPropertyType.includes('Plot') && !selectedPropertyType.includes('Office') && !selectedPropertyType.includes('Shop') && (
                          <div className="flex flex-wrap gap-2 mt-3">
                            {['1 BHK', '2 BHK', '3 BHK', '4 BHK', '5 BHK'].map(bhk => (
                              <div
                                key={bhk}
                                className={`px-3 py-1 rounded-full text-xs border cursor-pointer transition-colors ${selectedPropertyType.includes(bhk)
                                  ? 'bg-red-50 border-red-200 text-red-600'
                                  : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                                  }`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  // If a main type isn't selected, default to Flat
                                  const currentType = ['Flat', 'House/Villa'].find(t => selectedPropertyType.includes(t)) || 'Flat';
                                  setSelectedPropertyType(`${currentType}, ${bhk}`);
                                }}
                              >
                                {bhk}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Commercial Section */}
                      <div className="border-t pt-4">
                        <div className="text-xs font-bold text-gray-400 mb-3 uppercase">Commercial</div>
                        <div className="flex flex-wrap gap-2">
                          {['Office Space', 'Shop', 'Showroom'].map(type => (
                            <div
                              key={type}
                              className={`px-3 py-1 rounded-full text-xs border cursor-pointer transition-colors ${selectedPropertyType === type
                                ? 'bg-red-50 border-red-200 text-red-600'
                                : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                                }`}
                              onClick={() => setSelectedPropertyType(type)} // Simply set the type
                            >
                              {type}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* 3. Budget */}
                <div className="relative w-full md:w-[20%] px-6 py-4 md:py-2" ref={budgetRef}>
                  <div
                    className="flex items-center gap-3 cursor-pointer"
                    onClick={() => setShowBudgetDropdown(!showBudgetDropdown)}
                  >
                    <div className="bg-orange-100 text-orange-400 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold flex-shrink-0">₹</div>
                    <div className="w-full">
                      <div className="flex items-center gap-2">
                        <div className="text-xs font-bold text-gray-500 uppercase tracking-wide">Budget</div>
                        <ChevronDown className="w-3 h-3 text-gray-400" />
                      </div>
                      <div className="text-gray-900 font-medium truncate">{budgetRange}</div>
                    </div>
                  </div>

                  {/* Budget Dropdown */}
                  {showBudgetDropdown && (
                    <div className="absolute top-full right-0 w-full md:w-[300px] bg-white rounded-xl shadow-xl border border-gray-100 mt-2 p-4 z-[100]">
                      <div className="max-h-48 overflow-y-auto space-y-2">
                        {['₹5 Lac', '₹10 Lac', '₹20 Lac', '₹50 Lac', '₹1 Cr', '₹2 Cr', '₹5 Cr+'].map((price) => (
                          <div
                            key={price}
                            className="px-3 py-2 hover:bg-gray-50 rounded cursor-pointer text-sm text-gray-700"
                            onClick={() => {
                              setBudgetRange(price);
                              setShowBudgetDropdown(false);
                            }}
                          >
                            {price}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* 4. Search Button */}
                <div className="p-1 w-full md:w-auto">
                  <Button
                    className="w-full md:w-auto h-12 rounded-2xl md:rounded-full bg-orange-600 hover:bg-orange-700 text-white px-8 font-bold text-lg shadow-lg flex items-center justify-center gap-2"
                  >
                    <Search className="w-5 h-5" />
                    Search
                  </Button>
                </div>

              </div>
            </div>
            {/* --- SEARCH BAR SECTION END --- */}

            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
              <Button
                onClick={() => navigate('/register')}
                size="lg"
                className="bg-white text-blue-900 hover:bg-blue-50 px-8 py-6 text-lg font-semibold w-full sm:w-auto"
              >
                Start Investing Today
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                onClick={() => navigate('/partner/register')}
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-blue-900 px-8 py-6 text-lg font-semibold w-full sm:w-auto"
              >
                Partner with Us
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-10 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold mb-2">500+</div>
                <div className="text-white text-sm">Happy Investors</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold mb-2">50+</div>
                <div className="text-white text-sm">Verified Builders</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold mb-2">250+</div>
                <div className="text-white text-sm">Premium Projects</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold mb-2">₹500Cr+</div>
                <div className="text-white text-sm">Investments Facilitated</div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Projects Preview */}
        <section className="py-10 pt-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold text-[#08294F] mb-4">Featured Investment Opportunities</h2>
            </div>

            {/* First Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-2">
              {featuredProjects.map((project) => (
                <Card key={project.id} className="overflow-hidden bg-white border-none shadow-sm hover:shadow-md transition-all">
                  {/* Image Container */}
                  <div className="relative h-64 overflow-hidden rounded-2xl m-2">
                    <img
                      src={project.images[0]}
                      alt={project.title}
                      className="w-full h-full object-cover"
                    />
                    {/* Yellow Circular Badge */}
                    {project.isNewlyLaunched && (
                      <div className="absolute bottom-4 right-4 bg-yellow-400 text-black font-bold text-[10px] leading-tight flex items-center justify-center text-center w-14 h-14 rounded-full border-2 border-white shadow-lg uppercase px-1">
                        Newly Launched
                      </div>
                    )}
                  </div>

                  <CardContent className="p-4 pt-2">
                    <div className="flex justify-between items-start">
                      {/* Left Side: Title and Config */}
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-gray-900 leading-tight">
                          {project.title}
                        </h3>
                        <p className="text-gray-500 text-sm mt-1">
                          {project.configurations}
                        </p>
                      </div>

                      {/* Right Side: Pricing */}
                      <div className="text-right">
                        <p className="text-gray-400 text-xs">Starts from</p>
                        <p className="text-xl font-bold text-gray-900">
                          ₹ {project.priceRange}
                        </p>
                      </div>
                    </div>

                    {/* Footer: Location */}
                    <div className="mt-4 flex items-center text-gray-600">
                      <MapPin className="h-4 w-4 mr-1 text-gray-400" />
                      <span className="text-sm font-medium">{project.location}</span>
                    </div>

                    <Button
                      onClick={() => navigate('/register')}
                      className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-2"
                    >
                      Register to View Details
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Second Duplicate Grid as per original code */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-10">
              {featuredProjects.map((project) => (
                <Card key={project.id + '-dup'} className="overflow-hidden bg-white border-none shadow-sm hover:shadow-md transition-all">
                  <div className="relative h-64 overflow-hidden rounded-2xl m-2">
                    <img
                      src={project.images[0]}
                      alt={project.title}
                      className="w-full h-full object-cover"
                    />
                    {project.isNewlyLaunched && (
                      <div className="absolute bottom-4 right-4 bg-yellow-400 text-black font-bold text-[10px] leading-tight flex items-center justify-center text-center w-14 h-14 rounded-full border-2 border-white shadow-lg uppercase px-1">
                        Newly Launched
                      </div>
                    )}
                  </div>

                  <CardContent className="p-4 pt-2">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-gray-900 leading-tight">
                          {project.title}
                        </h3>
                        <p className="text-gray-500 text-sm mt-1">
                          {project.configurations}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-gray-400 text-xs">Starts from</p>
                        <p className="text-xl font-bold text-gray-900">
                          ₹ {project.priceRange}
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center text-gray-600">
                      <MapPin className="h-4 w-4 mr-1 text-gray-400" />
                      <span className="text-sm font-medium">{project.location}</span>
                    </div>
                    <Button
                      onClick={() => navigate('/register')}
                      className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-2"
                    >
                      Register to View Details
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-10 bg-gray-50 ">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why INVESTATE INDIA?</h2>
              <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
                Your trusted partner for secure and transparent real estate investments in India
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              <Card className="border-none shadow-lg hover:shadow-xl transition-shadow bg-white">
                <CardContent className="p-8 text-center">
                  <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Shield className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Verified Builders</h3>
                  <p className="text-gray-600">
                    Only RERA-approved and due-diligence verified builders on our platform
                  </p>
                </CardContent>
              </Card>

              <Card className="border-none shadow-lg hover:shadow-xl transition-shadow bg-white">
                <CardContent className="p-8 text-center">
                  <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <TrendingUp className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">High Returns</h3>
                  <p className="text-gray-600">
                    Projects with 8-12% expected annual yields and strong appreciation potential
                  </p>
                </CardContent>
              </Card>

              <Card className="border-none shadow-lg hover:shadow-xl transition-shadow bg-white">
                <CardContent className="p-8 text-center">
                  <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Globe className="h-8 w-8 text-orange-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">NRI Focused</h3>
                  <p className="text-gray-600">
                    Specialized assistance for overseas investors with documentation support
                  </p>
                </CardContent>
              </Card>

              <Card className="border-none shadow-lg hover:shadow-xl transition-shadow bg-white">
                <CardContent className="p-8 text-center">
                  <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="h-8 w-8 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Transparent Process</h3>
                  <p className="text-gray-600">
                    Complete disclosure of project details, legal documentation, and pricing
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Popular Cities and Developers */}
        <section className="relative overflow-hidden">
          {/* Split Background Layer - Hidden on mobile, shown on large screens */}
          <div className="absolute inset-0 hidden lg:flex">
            <div className="w-1/2 bg-white"></div>
            <div className="w-1/2 bg-[#F0F7FF]"></div>
          </div>

          <div className="container mx-auto px-6 py-10 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">

              {/* LEFT SIDE: DEVELOPERS */}
              <div className="bg-white lg:bg-transparent">
                <h2 className="text-2xl md:text-3xl font-bold text-[#001A72] mb-8 leading-tight">
                  Properties by <br /> Leading Real-estate Developers
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                  {developers.map((dev, idx) => (
                    <div key={idx} className="bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center h-28 md:h-32 hover:shadow-md transition-shadow">
                      <img src={dev.logo} alt={dev.name} className="max-h-full max-w-full transition-all p-2" />
                    </div>
                  ))}
                </div>
                <button className="w-full sm:w-auto border-2 border-[#001A72] text-[#001A72] px-8 py-2 rounded-lg font-semibold hover:bg-[#001A72] hover:text-white transition-colors">
                  All Developers
                </button>
              </div>

              {/* RIGHT SIDE: CITIES */}
              <div className="bg-[#F0F7FF] lg:bg-transparent p-6 lg:p-0 rounded-3xl lg:rounded-none">
                <h2 className="text-2xl md:text-3xl font-bold text-[#001A72] mb-8 leading-tight">
                  Properties in <br /> India's Fastest Growing Cities
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                  {cities.map((city, idx) => (
                    <div key={idx} className="relative group overflow-hidden rounded-2xl h-28 md:h-32 cursor-pointer">
                      <img
                        src={city.image}
                        alt={city.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                      <div className="absolute inset-0 flex items-end justify-center pb-3">
                        <span className="text-white font-bold text-sm text-center px-2">{city.name}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <button className="w-full sm:w-auto border-2 border-[#001A72] text-[#001A72] px-8 py-2 rounded-lg font-semibold hover:bg-[#001A72] hover:text-white transition-colors">
                  All Cities
                </button>
              </div>

            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-10 bg-gray-50 ">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-[#08294F] mb-4">What Our Investors Say</h2>
              <p className="text-lg md:text-xl text-[#08294F">
                Trusted by NRIs worldwide for their India real estate investments
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial) => (
                <Card key={testimonial.id} className="border-none shadow-lg bg-white">
                  <CardContent className="p-8">
                    <div className="flex items-center mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <p className="text-gray-700 mt-4 italic mb-6">"{testimonial.text}"</p>
                    <div className="flex items-center">
                      <img
                        src={testimonial.image}
                        alt={testimonial.name}
                        className="w-12 h-12 rounded-full object-cover mr-4"
                      />
                      <div>
                        <div className="font-semibold text-gray-900">{testimonial.name}</div>
                        <div className="text-sm text-gray-500">{testimonial.country}</div>
                        <div className="text-xs text-gray-400 mt-1">{testimonial.project}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-10  bg-white text-[#08294F]">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
              <p className="text-lg md:text-xl text-[#08294F]">
                Simple, secure, and transparent investment process
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="bg-[#08294F] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl text-white font-bold">
                  1
                </div>
                <h3 className="text-xl font-semibold mb-2">Register</h3>
                <p className="text-[#08294F]">
                  Sign up and complete a quick verification process
                </p>
              </div>

              <div className="text-center">
                <div className="bg-[#08294F] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl text-white font-bold">
                  2
                </div>
                <h3 className="text-xl font-semibold mb-2">Explore</h3>
                <p className="text-[#08294F]">
                  Browse verified projects with detailed information
                </p>
              </div>

              <div className="text-center">
                <div className="bg-[#08294F] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl text-white font-bold">
                  3
                </div>
                <h3 className="text-xl font-semibold mb-2">Connect</h3>
                <p className="text-[#08294F]">
                  Get in touch with builders and schedule visits
                </p>
              </div>

              <div className="text-center">
                <div className="bg-[#08294F] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl text-white font-bold">
                  4
                </div>
                <h3 className="text-xl font-semibold mb-2">Invest</h3>
                <p className="text-[#08294F]">
                  Complete your investment with full legal support
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-10 bg-gray-50 text-[#08294F]">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold">Ready to Start Your Investment Journey?</h2>
            <p className="text-lg md:text-xl mb-8 text-[#08294F] max-w-2xl mx-auto mt-4">
              Join hundreds of NRI investors who have successfully invested in India's premier real estate projects
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => navigate('/register')}
                size="lg"
                className="bg-white bg-white text-[#08294F] hover:bg-[#08294F] hover:text-white px-8 py-6 text-lg font-semibold w-full sm:w-auto"
              >
                Contact Now - Start Investing
              </Button>
              <Button
                onClick={() => navigate('/partner/register')}
                size="lg"
                variant="outline"
                className="border-white hover:bg-[#08294F] bg-[#08294F] text-white hover:text-white px-8 py-6 text-lg font-semibold w-full sm:w-auto"
              >
                Register as Partner
              </Button>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default Home;