import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import {
  MapPin, Building2, Calendar, FileCheck,
  Ruler, Layers, TrendingUp, Phone,
  AlertCircle, CheckCircle, Mail,
  Download, ArrowRight, ShieldCheck, Loader2
} from 'lucide-react';
import { apiRequest } from '@/api';
import { useAuth } from '@/hooks/AuthContext';
import { toast } from '@/hooks/use-toast';
import { submitProjectLead } from '@/api'; // <-- Import new API function

// Mock data kept for bottom similar properties section
const SIMILAR_PROPERTIES = [
  { id: 101, title: 'Skyline Towers', location: 'Worli, Mumbai', price: '₹3.2 Cr', type: '3 BHK Luxury', image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80', status: 'Under Construction' },
  { id: 102, title: 'Oceanic View', location: 'Bandra West, Mumbai', price: '₹4.5 Cr', type: '4 BHK Sea View', image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80', status: 'Ready to Move' },
  { id: 103, title: 'Green Valley', location: 'Thane, Mumbai', price: '₹1.8 Cr', type: '2 BHK Eco-Friendly', image: 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=800&q=80', status: 'New Launch' }
];

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasSubmittedLead, setHasSubmittedLead] = useState(false);

  // --- AUTH & LEAD STATES ---
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [inquiryMessage, setInquiryMessage] = useState('');
  const [isSubmittingLead, setIsSubmittingLead] = useState(false);

  useEffect(() => {
    if (user) setIsLoggedIn(true);

    const fetchProjectData = async () => {
      try {
        setLoading(true);
        const data = await apiRequest(`/api/projects/${id}`);

        // <-- NEW: Check if user already submitted a lead
        if (user && user.uid) {
          const leadStatus = await apiRequest(`/api/projects/${id}/lead-status?uid=${user.uid}`);
          setHasSubmittedLead(leadStatus.hasSubmitted);
        }

        setProject({
          id: data.id,
          title: data.projectName || 'Unnamed Project',
          location: data.projectLocation || 'Location TBA',
          address: data.projectLocation || 'Address TBA',
          type: data.projectType || 'Residential',
          priceRange: data.sellingPrice || 'Price on Request',
          yield: data.expectedRent ? `Rent: ${data.expectedRent}` : 'High ROI',
          images: (data.projectImages && data.projectImages.length > 0 && data.projectImages[0].startsWith('http'))
            ? data.projectImages
            : ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&q=80'],
          status: data.currentConstructionStatus || 'Active',
          rerId: data.reraRegistrationNumber || 'Pending',

          details: {
            landArea: data.totalLandArea || 'N/A',
            builtUpArea: data.totalBuiltUpArea || 'N/A',
            totalUnits: data.totalUnits || 'N/A',
            completionDate: data.expectedCompletionDate || 'N/A',
            projectCost: data.projectCost || 'N/A',
            pricingOffered: data.pricingOffered || 'N/A',
            securityOffered: data.securityOffered || 'N/A',
            govtApprovals: data.governmentApprovalsObtained || 'N/A',
            bankApprovals: data.bankApprovals === 'Yes' ? `Yes (${data.bankApprovalsName})` : 'No',
            borrowings: data.existingBorrowings === 'Yes' ? `Yes - ${data.existingBorrowingsAmount} (${data.existingBorrowingsPurpose})` : 'No',
            lockIn: data.lockInPeriod || 'N/A',
            buybackGuarantee: data.buybackGuarantee === 'Yes' ? `Yes - ${data.buybackGuaranteeDetails}` : 'No',
            exitFramework: data.exitResaleFramework || 'N/A',
            marketingResponsibility: data.marketingResponsibility || 'N/A',
            projectOverview: data.projectOverview || 'No overview provided.',
            disclosures: data.additionalDisclosures || ''
          },

          platformInfo: {
            name: 'Investate India',
            contactName: 'Relationship Manager',
            phone: '+91 80000 12345',
            email: 'invest@investate.in',
            logo: 'https://ui-avatars.com/api/?name=Investate+India&background=0b264f&color=fff',
          }
        });
      } catch (error) {
        toast({ title: "Error", description: "Failed to load project details.", variant: "destructive" });
        navigate('/dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchProjectData();
  }, [id, user, navigate]);

  const getMaskedPhone = (phone) => {
    if (!phone) return 'N/A';
    if (isLoggedIn) return phone;
    return phone.substring(0, 4) + ' XX XXXX';
  };

  const getMaskedEmail = (email) => {
    if (!email) return 'N/A';
    if (isLoggedIn) return email;
    const parts = email.split('@');
    if (parts.length < 2) return email;
    return parts[0].substring(0, 3) + '****@' + parts[1];
  };

  const handleRevealContact = () => {
    if (!user) {
      toast({ title: "Login Required", description: "Please log in to view platform contact details." });
    }
  };

  // --- HANDLE LEAD GENERATION ---
  const handleInquirySubmit = async (e, isDirectCall = false) => {
    if (e) e.preventDefault();
    if (!user) return toast({ title: "Login Required", description: "Please login to submit an inquiry.", variant: "destructive" });
    if (hasSubmittedLead) return toast({ title: "Already Submitted", description: "You have already inquired about this project." });

    try {
      setIsSubmittingLead(true);
      const payload = {
        uid: user.uid,
        message: isDirectCall ? 'Investor requested a direct call back.' : inquiryMessage
      };

      await submitProjectLead(project.id, payload);
      toast({ title: "Success!", description: "Your request has been sent. An advisor will contact you shortly." });
      setInquiryMessage('');
      setHasSubmittedLead(true); // <-- NEW: Lock the UI immediately
    } catch (error) {
      toast({ title: "Error", description: error.message || "Failed to submit request.", variant: "destructive" });
    } finally {
      setIsSubmittingLead(false);
    }
  };

  if (loading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-[#0b264f] h-10 w-10" /></div>;
  if (!project) return null;

  return (
    <div className="min-h-screen bg-[#F4F5F7] font-sans pb-10">
      <Header />

      <main className="container mx-auto px-4 py-4 md:py-6 mt-[2rem] md:mt-[4rem]">

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* --- LEFT COLUMN (DETAILS) --- */}
          <div className="lg:col-span-2 space-y-6">

            {/* --- HERO SECTION --- */}
            <div className="bg-white p-4 md:p-6 rounded-xl border border-gray-200 shadow-sm mb-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h1 className="text-xl md:text-3xl font-bold text-gray-900 leading-tight">{project.title}</h1>
                    <Badge className="bg-green-100 text-green-800 border-green-200 whitespace-nowrap"><ShieldCheck className="w-3 h-3 mr-1" /> Verified Project</Badge>
                  </div>
                  <p className="text-gray-500 flex items-start md:items-center text-sm mt-2">
                    <MapPin className="h-3.5 w-3.5 mr-1 mt-1 md:mt-0 text-gray-400 flex-shrink-0" /> {project.address}
                  </p>
                </div>
                <div className="text-left md:text-right w-full md:w-auto bg-gray-50 md:bg-transparent p-3 md:p-0 rounded-lg">
                  <p className="text-2xl font-bold text-[#0b264f]">{project.priceRange}</p>
                  <p className="text-xs md:text-sm text-green-600 font-semibold mt-1">Status: {project.status}</p>
                </div>
              </div>

              {/* Image Container */}
              <div className="relative h-[250px] md:h-[400px] rounded-xl overflow-hidden group">
                <img src={project.images[0]} alt={project.title} className="w-full h-full object-cover" />
                <div className="absolute bottom-4 left-4 flex gap-2">
                  <Button variant="secondary" size="sm" className="bg-white/90 text-black hover:bg-white text-xs h-8">
                    <Layers className="w-3 h-3 mr-1" /> Photos ({project.images.length})
                  </Button>
                </div>
              </div>
            </div>

            {/* 1. KEY OVERVIEW */}
            <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-gray-200">
              <h2 className="text-lg font-bold text-gray-800 mb-4">Property Overview</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-y-6 gap-x-4">
                <DetailItem label="Project Type" value={project.type} icon={<Building2 className="w-4 h-4" />} />
                <DetailItem label="Total Units" value={project.details.totalUnits} icon={<Layers className="w-4 h-4" />} />
                <DetailItem label="Land Area" value={project.details.landArea} icon={<Ruler className="w-4 h-4" />} />
                <DetailItem label="Built-up Area" value={project.details.builtUpArea} icon={<Building2 className="w-4 h-4" />} />
                <DetailItem label="RERA ID" value={project.rerId} icon={<CheckCircle className="w-4 h-4" />} />
                <DetailItem label="Completion" value={project.details.completionDate} icon={<Calendar className="w-4 h-4" />} />
                <DetailItem label="Expected Yield" value={project.yield} highlight icon={<TrendingUp className="w-4 h-4" />} />
              </div>
            </div>

            {/* 2. INVESTMENT DUE DILIGENCE */}
            <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-2">
                <h2 className="text-lg font-bold text-[#0b264f]">Financial & Legal Due Diligence</h2>
                <Badge variant="outline" className="border-orange-200 bg-orange-50 text-orange-700">Verified Data</Badge>
              </div>

              <div className="divide-y divide-gray-100">
                <RowItem label="Project Cost (Approx)" value={project.details.projectCost} />
                <RowItem label="Pricing Offered" value={project.details.pricingOffered} />
                <RowItem label="Security Against Investment" value={project.details.securityOffered} />
                <RowItem label="Govt. Approvals" value={project.details.govtApprovals} />
                <RowItem label="Bank Approvals" value={project.details.bankApprovals} />
                <RowItem label="Existing Borrowings" value={project.details.borrowings} />
                <RowItem label="Lock-in Period" value={project.details.lockIn} />
                <RowItem label="Buyback Guarantee" value={project.details.buybackGuarantee} />
                <RowItem label="Exit & Resale Framework" value={project.details.exitFramework} />
                <RowItem label="Marketing Responsibility" value={project.details.marketingResponsibility} />
              </div>
            </div>

            {/* 3. PROJECT OVERVIEW */}
            <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-gray-200">
              <h2 className="text-lg font-bold text-gray-800 mb-4">Project Overview</h2>

              <div className="bg-blue-50 p-5 rounded-lg mb-4 border border-blue-100">
                <p className="text-sm text-blue-900 leading-relaxed whitespace-pre-wrap">{project.details.projectOverview}</p>
              </div>

              {project.details.disclosures && (
                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100 mt-4">
                  <div className="flex gap-2">
                    <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="text-sm font-bold text-yellow-800">Additional Disclosures</h4>
                      <p className="text-xs text-yellow-700 mt-1 leading-relaxed whitespace-pre-wrap">{project.details.disclosures}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 4. DOWNLOADS */}
            {/* <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="outline" className="flex-1 bg-white border-gray-300 h-12 w-full text-gray-700 hover:text-[#0b264f] hover:bg-blue-50">
                <Download className="w-4 h-4 mr-2" /> Download Project Pitchbook
              </Button>
              <Button variant="outline" className="flex-1 bg-white border-gray-300 h-12 w-full text-gray-700 hover:text-[#0b264f] hover:bg-blue-50">
                <FileCheck className="w-4 h-4 mr-2" /> View Legal Clearances
              </Button>
            </div> */}
          </div>

          {/* --- RIGHT SIDEBAR (STICKY ON DESKTOP, STACKED ON MOBILE) --- */}
          <div className="lg:col-span-1 mt-4 lg:mt-0">
            <div className="static lg:sticky lg:top-24 space-y-4">

              {/* PLATFORM CONTACT CARD */}
              <Card className="border-t-4 border-t-[#0b264f] shadow-lg">
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">Connect with Advisor</h3>
                  <p className="text-xs text-gray-500 mb-6">Investate India manages all interactions to ensure transparency and protect investor interests.</p>

                  {/* <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-xl font-bold text-[#0b264f] shrink-0 border border-blue-100 overflow-hidden">
                       <img src={project.platformInfo.logo} alt="Investate Logo" />
                    </div>
                    <div className="overflow-hidden">
                      <p className="font-bold text-gray-900 truncate">{project.platformInfo.name}</p>
                      <p className="text-xs text-gray-500 truncate">{project.platformInfo.contactName}</p>
                    </div>
                  </div> */}

                  {/* <div className="space-y-3 mb-6">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                      <div className="flex items-center gap-2 text-gray-700 font-medium">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <span className="font-mono">{getMaskedPhone(project.platformInfo.phone)}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                      <div className="flex items-center gap-2 text-gray-700 font-medium text-sm truncate">
                        <Mail className="w-4 h-4 text-gray-400 shrink-0" />
                        <span className="font-mono truncate">{getMaskedEmail(project.platformInfo.email)}</span>
                      </div>
                    </div>
                  </div> */}

                  {!isLoggedIn ? (
                    <div className="text-center">
                      <p className="text-xs text-[#08294F] mb-2 font-medium">Contact details hidden for privacy</p>
                      <Button onClick={handleRevealContact} className="w-full bg-[#08294F] hover:bg-[#08294F] text-white font-bold h-12 shadow-md">
                        Login to View Contact
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Button
                        onClick={(e) => handleInquirySubmit(e, true)}
                        disabled={isSubmittingLead || hasSubmittedLead}
                        className={`w-full font-bold h-12 shadow-md ${hasSubmittedLead ? 'bg-gray-300 text-gray-600' : 'bg-green-600 hover:bg-green-700 text-white'}`}
                      >
                        {isSubmittingLead ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : (hasSubmittedLead ? <CheckCircle className="w-4 h-4 mr-2" /> : <Phone className="w-4 h-4 mr-2" />)}
                        {hasSubmittedLead ? 'Request Already Sent' : isSubmittingLead ? 'Sending Request...' : 'Request a Call Back'}
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* INQUIRY FORM */}
              {/* <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                <h3 className="text-sm font-bold text-gray-800 mb-1">Send Inquiry</h3>
                {hasSubmittedLead ? (
                    <div className="bg-green-50 text-green-800 p-4 rounded-lg border border-green-200 text-center mt-3">
                        <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-600" />
                        <p className="text-sm font-semibold">Inquiry Received!</p>
                        <p className="text-xs mt-1">Our advisor will contact you soon.</p>
                    </div>
                ) : (
                    <>
                        <p className="text-xs text-gray-500 mb-4">We will use your registered profile details to contact you.</p>
                        <form onSubmit={(e) => handleInquirySubmit(e, false)} className="space-y-3">
                        <textarea 
                            value={inquiryMessage}
                            onChange={(e) => setInquiryMessage(e.target.value)}
                            placeholder={`I'm interested in ${project.title}...`} 
                            rows="3" 
                            required
                            className="w-full p-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-[#0b264f] resize-none"
                        ></textarea>
                        <Button type="submit" disabled={isSubmittingLead} className="w-full bg-[#0b264f] hover:bg-blue-900 text-white font-semibold">
                            {isSubmittingLead ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : 'Submit Request'}
                        </Button>
                        </form>
                    </>
                )}
              </div> */}

            </div>
          </div>
        </div>

        {/* --- SIMILAR PROPERTIES (MOCK) --- */}
        {/* <div className="mt-12">
          <div className="flex justify-between items-end mb-6">
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-gray-900">Similar Properties</h2>
              <p className="text-sm text-gray-500 mt-1">Other projects in your preferred area</p>
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
        </div> */}

      </main>
      <Footer />
    </div>
  );
};

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
  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start py-3">
    <span className="text-sm text-gray-500 font-medium mb-1 sm:mb-0 w-full sm:w-1/3">{label}</span>
    <span className="text-sm font-semibold text-gray-900 sm:text-right w-full sm:w-2/3 break-words whitespace-pre-wrap">{value || 'N/A'}</span>
  </div>
);

export default ProjectDetail;