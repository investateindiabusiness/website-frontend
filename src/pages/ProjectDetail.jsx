import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import {
  ArrowLeft, MapPin, Building2, Calendar, FileCheck,
  Ruler, Layers, TrendingUp, Phone,
  AlertCircle, CheckCircle, Mail,
  Download, Share2, Heart,
  ArrowRight
} from 'lucide-react';

// --- MOCK DATA ---
const MOCK_PROJECT_DATA = {
  id: 1,
  title: 'Imperial Heights',
  builderName: 'Apex Constructors',
  location: 'Mumbai, Maharashtra',
  address: 'Plot 45, Sector 12, Palm Beach Road, Mumbai',
  type: 'Residential (Luxury)',
  priceRange: '₹2.5 Cr - ₹4.5 Cr',
  yield: '+12% proj. ROI',
  images: [
    'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&q=80',
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80',
    'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=800&q=80'
  ],
  status: 'Ready to Move',
  rerId: 'P51800001234',

  details: {
    landArea: '5.2 Acres',
    builtUpArea: '12,50,000 Sq. Ft.',
    totalUnits: '450 Units',
    constructionStatus: '95% Completed',
    completionDate: 'December 2025',
    govtApprovals: 'Approved (Municipal Corp)',
    bankApprovals: 'Yes (HDFC, SBI, ICICI)',
    projectCost: '₹850 Cr (Approx)',
    borrowings: 'Yes - ₹120 Cr (SBI)',
    lockIn: '1 Year from Possession',
    exitFramework: 'Resale assistance after 24 months',
    marketingResponsibility: 'Managed by Investate India',
    locationAdvantages: [
      '5 mins from Proposed Metro Station',
      'Direct access to Coastal Road',
      'Proximity to International Airport (20 mins)'
    ],
    futureProspects: 'Area expected to appreciate by 15-18% post Metro completion in 2026.',
    disclosures: 'The adjacent plot is earmarked for a public park, ensuring permanent open views for Tower A.'
  },

  builderInfo: {
    name: 'Apex Constructors',
    contactName: 'Rishikesh Deshmukh',
    phone: '+91 9876543210',
    email: 'sales@apexconstructors.com',
    logo: 'https://ui-avatars.com/api/?name=Apex+Constructors&background=0b264f&color=fff',
  }
};

const SIMILAR_PROPERTIES = [
  {
    id: 101,
    title: 'Skyline Towers',
    location: 'Worli, Mumbai',
    price: '₹3.2 Cr',
    type: '3 BHK Luxury',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80',
    status: 'Under Construction'
  },
  {
    id: 102,
    title: 'Oceanic View',
    location: 'Bandra West, Mumbai',
    price: '₹4.5 Cr',
    type: '4 BHK Sea View',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80',
    status: 'Ready to Move'
  },
  {
    id: 103,
    title: 'Green Valley',
    location: 'Thane, Mumbai',
    price: '₹1.8 Cr',
    type: '2 BHK Eco-Friendly',
    image: 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=800&q=80',
    status: 'New Launch'
  }
];

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  // --- AUTH STATE ---
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Simulate API Call
    setTimeout(() => {
      setProject(MOCK_PROJECT_DATA);
      setLoading(false);
    }, 500);
  }, [id]);

  // --- SAFE MASKING FUNCTIONS (Fix for "undefined" error) ---
  const getMaskedPhone = (phone) => {
    if (!phone) return 'N/A'; // Safety check
    if (isLoggedIn) return phone;
    // Keep first 3 chars, mask the rest
    return phone.substring(0, 4) + ' XX XXXX';
  };

  const getMaskedEmail = (email) => {
    if (!email) return 'N/A'; // Safety check
    if (isLoggedIn) return email;
    const parts = email.split('@');
    if (parts.length < 2) return email;
    // Return first 3 chars of name + **** + domain
    return parts[0].substring(0, 3) + '****@' + parts[1];
  };

  const handleRevealContact = () => {
    // In a real app, this would redirect to login page or open a modal
    // For this demo, we simply toggle state to show it works
    const confirmLogin = window.confirm("This requires logging in. Simulate login now?");
    if (confirmLogin) setIsLoggedIn(true);
  };

  if (loading) return <div className="h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900"></div></div>;

  if (!project) return <div>Project not found</div>;

  return (
    <div className="min-h-screen bg-[#F4F5F7] font-sans pb-10">
      <Header />

      <main className="container mx-auto px-4 py-4 md:py-6 mt-[3rem] md:mt-[5rem]">

        {/* --- MAIN CONTENT GRID --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* --- LEFT COLUMN (DETAILS) --- */}
          <div className="lg:col-span-2 space-y-6">

            {/* --- HERO SECTION --- */}
            <div className="bg-white p-4 md:p-6 rounded-xl border border-gray-200 shadow-sm mb-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h1 className="text-xl md:text-3xl font-bold text-gray-900 leading-tight">{project.title}</h1>
                    <Badge className="bg-green-100 text-green-800 border-green-200 whitespace-nowrap">RERA: {project.rerId}</Badge>
                  </div>
                  <p className="text-gray-500 flex items-start md:items-center text-sm">
                    <MapPin className="h-3.5 w-3.5 mr-1 mt-1 md:mt-0 text-gray-400 flex-shrink-0" /> {project.address}
                  </p>
                </div>
                <div className="text-left md:text-right w-full md:w-auto bg-gray-50 md:bg-transparent p-3 md:p-0 rounded-lg">
                  <p className="text-2xl font-bold text-[#0b264f]">{project.priceRange}</p>
                  <p className="text-xs md:text-sm text-gray-500">Estimated EMI: ₹1.2L/mo</p>
                </div>
              </div>

              {/* Image Container - Responsive Height */}
              <div className="relative h-[250px] md:h-[400px] rounded-xl overflow-hidden group">
                <img src={project.images[0]} alt={project.title} className="w-full h-full object-cover" />
                <div className="absolute bottom-4 left-4 flex gap-2">
                  <Button variant="secondary" size="sm" className="bg-white/90 text-black hover:bg-white text-xs h-8">
                    <Layers className="w-3 h-3 mr-1" /> Photos (12)
                  </Button>
                </div>
              </div>
            </div>

            {/* 1. KEY OVERVIEW */}
            <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-gray-200">
              <h2 className="text-lg font-bold text-gray-800 mb-4">Property Overview</h2>
              {/* Grid cols-2 on mobile, cols-4 on desktop */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-y-6 gap-x-4">
                <DetailItem label="Project Type" value={project.type} icon={<Building2 className="w-4 h-4" />} />
                <DetailItem label="Units" value={project.details.totalUnits} icon={<Layers className="w-4 h-4" />} />
                <DetailItem label="Area" value={project.details.landArea} icon={<Ruler className="w-4 h-4" />} />
                <DetailItem label="Status" value={project.status} icon={<CheckCircle className="w-4 h-4" />} />
                <DetailItem label="Completion" value={project.details.completionDate} icon={<Calendar className="w-4 h-4" />} />
                <DetailItem label="Yield" value={project.yield} highlight icon={<TrendingUp className="w-4 h-4" />} />
              </div>
            </div>

            {/* 2. INVESTMENT DUE DILIGENCE */}
            <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-2">
                <h2 className="text-lg font-bold text-[#0b264f]">Financial & Legal Due Diligence</h2>
                <Badge variant="outline" className="border-orange-200 bg-orange-50 text-orange-700">Investor Focused</Badge>
              </div>

              <div className="divide-y divide-gray-100">
                <RowItem label="Project Cost" value={project.details.projectCost} />
                <RowItem label="Bank Approvals" value={project.details.bankApprovals} />
                <RowItem label="Borrowings" value={project.details.borrowings} />
                <RowItem label="Govt. Approvals" value={project.details.govtApprovals} />
                <RowItem label="Lock-in Period" value={project.details.lockIn} />
                <RowItem label="Exit Strategy" value={project.details.exitFramework} />
                <RowItem label="Marketing" value={project.details.marketingResponsibility} />
              </div>
            </div>

            {/* 3. LOCATION */}
            <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-gray-200">
              <h2 className="text-lg font-bold text-gray-800 mb-4">Location Potential</h2>

              <div className="bg-blue-50 p-4 rounded-lg mb-4 border border-blue-100">
                <h3 className="text-sm font-bold text-blue-900 mb-2">Future Prospects</h3>
                <p className="text-sm text-blue-800 leading-relaxed">{project.details.futureProspects}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-semibold text-gray-500 mb-3">Key Advantages</h4>
                  <ul className="space-y-2">
                    {project.details.locationAdvantages.map((adv, i) => (
                      <li key={i} className="flex items-start text-sm text-gray-700">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span>{adv}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                {project.details.disclosures && (
                  <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100 h-fit">
                    <div className="flex gap-2">
                      <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="text-sm font-bold text-yellow-800">Disclosure</h4>
                        <p className="text-xs text-yellow-700 mt-1 leading-relaxed">{project.details.disclosures}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* 4. DOWNLOADS */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="outline" className="flex-1 bg-white border-gray-300 h-12 w-full">
                <Download className="w-4 h-4 mr-2" /> Download Brochure
              </Button>
              <Button variant="outline" className="flex-1 bg-white border-gray-300 h-12 w-full">
                <FileCheck className="w-4 h-4 mr-2" /> Legal Report
              </Button>
            </div>
          </div>

          {/* --- RIGHT SIDEBAR (STICKY ON DESKTOP, STACKED ON MOBILE) --- */}
          <div className="lg:col-span-1 mt-4 lg:mt-0">
            <div className="static lg:sticky lg:top-12 space-y-4">

              {/* CONTACT OWNER CARD */}
              <Card className="border-t-4 border-t-[#0b264f] shadow-lg">
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">Contact Developer</h3>

                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-xl font-bold text-[#0b264f] shrink-0">
                      {project.builderInfo.name.charAt(0)}
                    </div>
                    <div className="overflow-hidden">
                      <p className="font-bold text-gray-900 truncate">{project.builderInfo.contactName}</p>
                      <p className="text-xs text-gray-500 truncate">Sales Head, {project.builderInfo.name}</p>
                    </div>
                  </div>

                  <div className="space-y-3 mb-6">
                    {/* Phone Display */}
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                      <div className="flex items-center gap-2 text-gray-700 font-medium">
                        <Phone className="w-4 h-4 text-gray-400" />
                        {/* CALL MASKING FUNCTION */}
                        <span className="font-mono">{getMaskedPhone(project.builderInfo.phone)}</span>
                      </div>
                    </div>

                    {/* Email Display */}
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                      <div className="flex items-center gap-2 text-gray-700 font-medium text-sm truncate">
                        <Mail className="w-4 h-4 text-gray-400 shrink-0" />
                        {/* CALL MASKING FUNCTION */}
                        <span className="font-mono truncate">{getMaskedEmail(project.builderInfo.email)}</span>
                      </div>
                    </div>
                  </div>

                  {!isLoggedIn ? (
                    <div className="text-center">
                      <p className="text-xs text-[#08294F] mb-2 font-medium">Contact details hidden for privacy</p>
                      <Button
                        onClick={handleRevealContact}
                        className="w-full bg-[#08294F] hover:bg-[#08294F] text-white font-bold h-12 shadow-md"
                      >
                        Get Phone No.
                      </Button>
                      <p className="text-[10px] text-gray-400 mt-2">Click to simulate Login/Reveal</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Button className="w-full bg-green-600 hover:bg-green-700 text-white font-bold h-12 shadow-md">
                        <Phone className="w-4 h-4 mr-2" /> Call Now
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* INQUIRY FORM */}
              <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                <h3 className="text-sm font-bold text-gray-800 mb-3">Send Inquiry</h3>
                <form className="space-y-3">
                  <input type="text" placeholder="Name" className="w-full p-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-[#0b264f]" />
                  <input type="email" placeholder="Email" className="w-full p-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-[#0b264f]" />
                  <input type="tel" placeholder="Mobile" className="w-full p-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-[#0b264f]" />
                  <textarea placeholder="I'm interested in this project..." rows="3" className="w-full p-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-[#0b264f]"></textarea>
                  <Button className="w-full bg-[#0b264f] hover:bg-blue-900 text-white font-semibold">
                    Submit Request
                  </Button>
                </form>
              </div>

            </div>
          </div>
        </div>
        <div className="mt-12">
          <div className="flex justify-between items-end mb-6">
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-gray-900">Similar Properties</h2>
              <p className="text-sm text-gray-500 mt-1">Other projects in {project.location}</p>
            </div>
            <Button variant="ghost" className="text-[#0b264f] hover:bg-blue-50 font-semibold hidden md:flex">
              View All <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {SIMILAR_PROPERTIES.map((prop) => (
              <div
                key={prop.id}
                className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => navigate(`/project/${prop.id}`)}
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={prop.image}
                    alt={prop.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-3 left-3">
                    <Badge className="bg-white/90 text-gray-800 hover:bg-white text-xs font-semibold shadow-sm backdrop-blur-sm">
                      {prop.status}
                    </Badge>
                  </div>
                  <div className="absolute bottom-3 right-3">
                    <div className="bg-[#0b264f]/90 text-white text-xs px-2 py-1 rounded shadow-md backdrop-blur-sm">
                      {prop.price}
                    </div>
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="font-bold text-gray-900 text-lg mb-1 truncate group-hover:text-[#0b264f] transition-colors">
                    {prop.title}
                  </h3>
                  <div className="flex items-center text-sm text-gray-500 mb-3">
                    <MapPin className="w-3.5 h-3.5 mr-1" />
                    {prop.location}
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <span className="text-xs font-semibold px-2 py-1 bg-blue-50 text-blue-700 rounded border border-blue-100">
                      {prop.type}
                    </span>
                    <span className="text-xs text-gray-400 font-medium hover:text-[#0b264f]">
                      View Details &rarr;
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Button variant="outline" className="w-full mt-6 md:hidden text-[#0b264f] border-gray-300">
            View All Similar Properties
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  );
};

// --- REUSABLE COMPONENTS ---

const DetailItem = ({ label, value, icon, highlight }) => (
  <div className="flex flex-col gap-1">
    <div className="flex items-center gap-1.5 text-gray-500 mb-1">
      {React.cloneElement(icon, { className: "w-3.5 h-3.5" })}
      <span className="text-[10px] md:text-xs uppercase font-semibold tracking-wide">{label}</span>
    </div>
    <div className={`text-sm md:text-base font-medium truncate ${highlight ? 'text-green-600 font-bold' : 'text-gray-900'}`}>
      {value || 'N/A'}
    </div>
  </div>
);

const RowItem = ({ label, value }) => (
  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-3">
    <span className="text-sm text-gray-500 font-medium mb-1 sm:mb-0 w-full sm:w-1/3">{label}</span>
    <span className="text-sm font-semibold text-gray-900 sm:text-right w-full sm:w-2/3 break-words">{value || 'N/A'}</span>
  </div>
);

export default ProjectDetail;