"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/hooks/AuthContext';
import { apiRequest, approveProject, verifyProjectStatus } from '@/api';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { 
  Building2, ShieldCheck, CheckCircle, XCircle, MapPin, 
  FileText, Download, ArrowLeft, ChevronLeft, ChevronRight, 
  Loader2, Phone, Mail, Ruler, Layers, TrendingUp, 
  Calendar, DollarSign, Landmark, Globe, Link2, Eye 
} from 'lucide-react';

const DetailBlock = ({ label, value, isFullWidth = false, isLink = false }) => {
  if (!value) return null;
  return (
    <div className={`bg-white rounded-xl p-4 border border-gray-100 shadow-sm transition-all hover:shadow-md ${isFullWidth ? 'col-span-full' : ''}`}>
      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">{label}</span>
      {isLink ? (
        <a href={value.startsWith('http') ? value : `https://${value}`} target="_blank" rel="noopener noreferrer" className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1.5 break-all">
          <Link2 className="w-3.5 h-3.5 flex-shrink-0" /> {value}
        </a>
      ) : (
        <p className="text-xs font-semibold text-gray-800 whitespace-pre-wrap leading-relaxed">{value}</p>
      )}
    </div>
  );
};

export default function AdminProjectDetail() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (!user) return;
    
    const fetchProjectDetails = async () => {
      try {
        setLoading(true);
        const data = await apiRequest(`/api/projects/${id}`);
        setProject(data);
      } catch (error) {
        console.error("Failed to load project details:", error);
        toast({ title: 'Error', description: 'Failed to fetch project details.', variant: 'destructive' });
      } finally {
        setLoading(false);
      }
    };
    
    fetchProjectDetails();
  }, [user, id]);

  const handleApprove = async () => {
    try {
      setActionLoading(true);
      await approveProject(id, []);
      toast({ title: "Approved", description: "Project has been approved and is now live." });
      setProject(prev => prev ? { ...prev, status: 'approved' } : null);
    } catch (error) {
      toast({ title: "Error", description: error.message || "Failed to approve project.", variant: "destructive" });
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    try {
      setActionLoading(true);
      await verifyProjectStatus(id, false);
      toast({ title: "Rejected", description: "Project has been rejected." });
      setProject(prev => prev ? { ...prev, status: 'rejected' } : null);
    } catch (error) {
      toast({ title: "Error", description: error.message || "Failed to reject project.", variant: "destructive" });
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusColor = (status) => {
    if (status === 'approved') return 'bg-green-100 text-green-800 border-green-200';
    if (status === 'rejected') return 'bg-red-100 text-red-800 border-red-200';
    return 'bg-yellow-100 text-yellow-800 border-yellow-200';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <Loader2 className="w-12 h-12 text-[#D48035] animate-spin mb-4" />
        <p className="text-gray-500 animate-pulse font-medium">Fetching project details...</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
        <AlertTriangle className="w-16 h-16 text-yellow-500 mb-4" />
        <h2 className="text-xl font-bold text-gray-900 mb-2">Project Not Found</h2>
        <p className="text-gray-500 mb-6 text-center max-w-md">The project details couldn't be loaded. It may have been deleted or you do not have permission to view it.</p>
        <Button onClick={() => router.push('/admin/projects')} className="bg-[#0b264f] hover:bg-blue-900 text-white rounded-xl">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Projects
        </Button>
      </div>
    );
  }

  const images = project.projectImages?.length > 0
    ? project.projectImages
    : ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&q=80'];

  return (
    <div className="min-h-screen bg-gray-50/50 pb-16 font-sans">
      <div className="max-w-7xl mx-auto px-4 py-8">
        
        {/* Header navigation bar */}
        <div className="mb-6 flex items-center justify-between">
          <Button 
            variant="ghost" 
            onClick={() => router.push('/admin/projects')}
            className="text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-xl"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Projects
          </Button>
          <div className="text-xs text-gray-400 font-mono">
            Project ID: {project.id}
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Columns - Details */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Project title block */}
            <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
              <div className="flex flex-wrap items-center gap-3 mb-3">
                <Badge variant="outline" className={`capitalize text-xs font-bold px-3 py-1 ${getStatusColor(project.status)}`}>
                  {project.status}
                </Badge>
                {project.hasPendingEdits && (
                  <Badge className="bg-purple-100 text-purple-800 text-xs px-3 py-1 font-bold">Edits Pending</Badge>
                )}
                {project.projectType && (
                  <Badge variant="secondary" className="text-xs font-bold px-3 py-1">{project.projectType}</Badge>
                )}
              </div>
              <h1 className="text-3xl font-bold text-gray-900 leading-tight mb-2">
                {project.projectName}
              </h1>
              <p className="text-gray-500 flex items-center gap-1.5 text-sm">
                <MapPin className="w-4 h-4 text-gray-400" /> {project.projectLocation}
              </p>
            </div>

            {/* Image Slider */}
            {images.length > 0 && (
              <div className="relative h-96 rounded-3xl overflow-hidden bg-gray-100 border border-gray-200 shadow-sm group">
                <img
                  src={images[currentImageIndex]}
                  alt={`Project image ${currentImageIndex + 1}`}
                  className="w-full h-full object-cover"
                  onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&q=80'; }}
                />
                {images.length > 1 && (
                  <>
                    <button
                      onClick={() => setCurrentImageIndex(i => (i - 1 + images.length) % images.length)}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white rounded-full p-2.5 transition-all opacity-0 group-hover:opacity-100 shadow-md"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setCurrentImageIndex(i => (i + 1) % images.length)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white rounded-full p-2.5 transition-all opacity-0 group-hover:opacity-100 shadow-md"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                      {images.map((_, idx) => (
                        <button key={idx} onClick={() => setCurrentImageIndex(idx)}
                          className={`w-2 h-2 rounded-full transition-all ${idx === currentImageIndex ? 'bg-white scale-125' : 'bg-white/50'}`}
                        />
                      ))}
                    </div>
                    <div className="absolute top-4 right-4 bg-black/60 text-white text-xs px-3 py-1.5 rounded-full font-bold">
                      {currentImageIndex + 1} / {images.length}
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Sections */}
            
            {/* Section 1: Basic Information */}
            <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm space-y-4">
              <h3 className="text-base font-bold text-gray-900 flex items-center gap-2 pb-3 border-b border-gray-100">
                <Building2 className="w-5 h-5 text-blue-600" /> Basic Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <DetailBlock label="Project Name" value={project.projectName} />
                <DetailBlock label="Builder Name" value={project.builderName} />
                <DetailBlock label="Project Location" value={project.projectLocation} />
                <DetailBlock label="Current Construction Status" value={project.currentConstructionStatus} />
                <DetailBlock label="Expected Completion Date" value={project.expectedCompletionDate} />
                <DetailBlock label="Project Categories" value={Array.isArray(project.projectCategories) ? project.projectCategories.join(', ') : project.projectCategories} />
                <DetailBlock label="Project Types" value={Array.isArray(project.projectType) ? project.projectType.join(', ') : project.projectType} />
              </div>
            </div>

            {/* Section 2: Land, Inventory & Configuration */}
            <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm space-y-4">
              <h3 className="text-base font-bold text-gray-900 flex items-center gap-2 pb-3 border-b border-gray-100">
                <Layers className="w-5 h-5 text-purple-600" /> Land, Inventory & Configuration
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <DetailBlock label="Total Land Area" value={project.totalLandArea} />
                <DetailBlock label="Total Built-up Area" value={project.totalBuiltUpArea} />
                <DetailBlock label="Total Units" value={project.totalUnits} />
                <DetailBlock label="Unit Sizes / Configurations" value={project.area} isFullWidth />
                <DetailBlock label="Unit Mix" value={project.inventory} isFullWidth />
                <DetailBlock label="Undivided Share (UDS) / Land Share" value={project.undividedShare} isFullWidth />
                <DetailBlock label="Other Unit Information" value={project.otherUnitInformation} isFullWidth />
              </div>
            </div>

            {/* Section 3: Approvals & Compliance */}
            <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm space-y-4">
              <h3 className="text-base font-bold text-gray-900 flex items-center gap-2 pb-3 border-b border-gray-100">
                <ShieldCheck className="w-5 h-5 text-green-600" /> Approvals & Compliance
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <DetailBlock label="Project State" value={project.projectState} />
                <DetailBlock label="Government Construction Approvals" value={Array.isArray(project.governmentApprovalsObtained) ? project.governmentApprovalsObtained.join(', ') : project.governmentApprovalsObtained} />
                {project.governmentApprovalsObtained?.includes("Other") && (
                  <DetailBlock label="Other Government Approvals" value={project.otherGovernmentApprovals} isFullWidth />
                )}
                <DetailBlock label="RERA Registration Number" value={project.reraRegistrationNumber} />
                <DetailBlock label="Bank Approvals" value={project.bankApprovals} />
                {project.bankApprovals === 'Yes' && (
                  <DetailBlock label="Names of Approved Banks" value={project.bankApprovalsName} isFullWidth />
                )}
                <DetailBlock label="Existing Borrowings" value={project.existingBorrowings} />
                {project.existingBorrowings === 'Yes' && (
                  <>
                    <DetailBlock label="Borrowing Amount" value={project.existingBorrowingsAmount} />
                    <DetailBlock label="Purpose of Borrowing" value={project.existingBorrowingsPurpose} />
                  </>
                )}
              </div>
            </div>

            {/* Section 4: Project Financials */}
            <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm space-y-4">
              <h3 className="text-base font-bold text-gray-900 flex items-center gap-2 pb-3 border-b border-gray-100">
                <DollarSign className="w-5 h-5 text-emerald-600" /> Project Financials
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <DetailBlock label="Estimated Project Value" value={project.projectCost} />
                <DetailBlock label="Selling Price" value={project.sellingPrice} />
                <DetailBlock label="Pricing Offered" value={project.pricingOffered} />
              </div>
            </div>

            {/* Section 5: Investment Opportunity */}
            <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm space-y-4">
              <h3 className="text-base font-bold text-gray-900 flex items-center gap-2 pb-3 border-b border-gray-100">
                <TrendingUp className="w-5 h-5 text-teal-600" /> Investment Opportunity
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <DetailBlock label="Security Offered" value={project.securityOffered} />
                <DetailBlock label="Lock-in Period" value={project.lockInPeriod} />
                <DetailBlock label="Buyback Guarantee" value={project.buybackGuarantee} />
                {project.buybackGuarantee === 'Yes' && (
                  <DetailBlock label="Guarantee Details" value={project.buybackGuaranteeDetails} />
                )}
                <DetailBlock label="Rental Opportunity Available" value={project.availableForRent} />
                {project.availableForRent === 'Yes' && (
                  <DetailBlock label="Expected Rent" value={project.expectedRent} />
                )}
                <DetailBlock label="Exit & Resale Framework" value={project.exitResaleFramework} isFullWidth />
                <DetailBlock label="Marketing Responsibility" value={project.marketingResponsibility} isFullWidth />
                <DetailBlock label="Additional Disclosures" value={project.additionalDisclosures} isFullWidth />
              </div>
            </div>

            {/* Section 6: Live Project CCTV Monitoring */}
            {project.liveCctvAvailable === 'Yes' && (
              <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm space-y-4">
                <h3 className="text-base font-bold text-gray-900 flex items-center gap-2 pb-3 border-b border-gray-100">
                  <Eye className="w-5 h-5 text-amber-600" /> Live Project Monitoring
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <DetailBlock label="Live Camera URL" value={project.liveCameraUrl} isFullWidth />
                  <DetailBlock label="Camera Username" value={project.cameraUsername} />
                  <DetailBlock label="Camera Password" value={project.cameraPassword ? '********' : 'N/A'} />
                  <DetailBlock label="Viewer Instructions" value={project.viewerInstructions} isFullWidth />
                </div>
              </div>
            )}

            {/* Section 7: Additional Project Information */}
            <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm space-y-4">
              <h3 className="text-base font-bold text-gray-900 flex items-center gap-2 pb-3 border-b border-gray-100">
                <Building2 className="w-5 h-5 text-indigo-600" /> Additional Project Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <DetailBlock label="Land Ownership Type" value={project.landType === 'Other' ? project.landTypeOther : project.landType} />
                <DetailBlock label="Google Maps Location" value={project.googleMapsLocation} isLink />
              </div>
            </div>

            {/* Project Overview */}
            {project.projectOverview && (
              <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
                <h3 className="text-base font-bold text-gray-900 mb-3 pb-3 border-b border-gray-100">Project Overview</h3>
                <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">{project.projectOverview}</p>
              </div>
            )}

            {/* Amenities */}
            {project.amenities?.length > 0 && (
              <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
                <h3 className="text-base font-bold text-gray-900 mb-4 pb-3 border-b border-gray-100">Amenities</h3>
                <div className="flex flex-wrap gap-2.5">
                  {project.amenities.map((a, i) => (
                    <span key={i} className="text-xs bg-green-50 text-green-700 border border-green-100 px-3.5 py-1.5 rounded-full font-semibold flex items-center shadow-sm">
                      <CheckCircle className="w-3.5 h-3.5 mr-1 text-green-600" />{a}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Product Brochure */}
            {project.projectBrochureUrl && (
              <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
                <h3 className="text-base font-bold text-gray-900 mb-3 pb-3 border-b border-gray-100 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-orange-500" /> Product Brochure
                </h3>
                <div className="flex items-center justify-between bg-orange-50/60 rounded-2xl px-4 py-3 border border-orange-100">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <FileText className="w-5 h-5 text-orange-400 flex-shrink-0" />
                    <span className="text-sm text-orange-950 truncate font-semibold">{project.projectBrochureUrl.split('/').pop()}</span>
                  </div>
                  <a href={project.projectBrochureUrl} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-xs bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded-xl transition-colors shadow-lg shadow-orange-500/10 flex-shrink-0">
                    <Download className="w-3.5 h-3.5" /> Download Brochure
                  </a>
                </div>
              </div>
            )}

            {/* Documents */}
            {project.projectDocuments?.length > 0 && (
              <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
                <h3 className="text-base font-bold text-gray-900 mb-4 pb-3 border-b border-gray-100 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-gray-600" /> Project Documents
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {project.projectDocuments.map((doc, i) => (
                    <div key={i} className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3 border border-gray-100">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <FileText className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        <span className="text-sm text-gray-700 truncate font-medium">{doc.name || `Document ${i + 1}`}</span>
                      </div>
                      {doc.url && (
                        <a href={doc.url} target="_blank" rel="noopener noreferrer"
                          className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 font-bold ml-2 flex-shrink-0">
                          <Download className="w-3.5 h-3.5" /> Download
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* Right Column - Status & Actions Card */}
          <div className="space-y-6">
            
            {/* Sticky Actions Container */}
            <div className="sticky top-20 space-y-6">
              
              {/* verification card */}
              <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm space-y-5">
                <h3 className="text-base font-bold text-gray-900 pb-3 border-b border-gray-100">Verification Status</h3>
                
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-gray-500">Status:</span>
                  <Badge className={`capitalize text-xs font-bold px-3 py-1 ${getStatusColor(project.status)}`}>
                    {project.status}
                  </Badge>
                </div>
                
                {project.hasPendingEdits && (
                  <div className="bg-purple-50 text-purple-950 p-4 rounded-xl border border-purple-100 text-xs font-medium leading-relaxed">
                    The builder has submitted modifications that are pending your review.
                  </div>
                )}

                {/* Approve/Reject actions */}
                {project.status !== 'approved' && (
                  <div className="flex flex-col gap-2.5">
                    <Button
                      onClick={handleApprove}
                      disabled={actionLoading}
                      className="w-full bg-green-600 hover:bg-green-700 text-white rounded-xl gap-2 h-11 font-bold shadow-lg shadow-green-600/10"
                    >
                      {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4.5 h-4.5" />}
                      Approve Project
                    </Button>
                    <Button
                      onClick={handleReject}
                      disabled={actionLoading}
                      variant="destructive"
                      className="w-full rounded-xl gap-2 h-11 font-bold shadow-lg shadow-red-600/10"
                    >
                      {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4.5 h-4.5" />}
                      Reject Project
                    </Button>
                  </div>
                )}

                {project.status === 'approved' && (
                  <Button
                    onClick={handleReject}
                    disabled={actionLoading}
                    variant="destructive"
                    className="w-full rounded-xl gap-2 h-11 font-bold shadow-lg shadow-red-600/10"
                  >
                    <XCircle className="w-4.5 h-4.5" /> Revoke Approval
                  </Button>
                )}
              </div>

              {/* Builder Info card */}
              {(project.builderName || project.builderEmail || project.builderPhone) && (
                <div className="bg-[#f0f7ff] border border-blue-100/50 rounded-3xl p-6 shadow-sm space-y-4">
                  <h3 className="text-base font-bold text-blue-900 pb-3 border-b border-blue-200/40 flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-blue-700" /> Builder Details
                  </h3>
                  
                  <div className="space-y-4">
                    {project.builderName && (
                      <div>
                        <p className="text-[10px] text-blue-600/80 font-bold uppercase tracking-wider mb-1">Company / Builder Name</p>
                        <p className="text-sm font-semibold text-gray-800">{project.builderName}</p>
                      </div>
                    )}
                    {project.builderEmail && (
                      <div>
                        <p className="text-[10px] text-blue-600/80 font-bold uppercase tracking-wider mb-1">Email Address</p>
                        <a href={`mailto:${project.builderEmail}`} className="text-sm font-semibold text-blue-700 hover:underline flex items-center gap-1.5 break-all">
                          <Mail className="w-4 h-4 flex-shrink-0" /> {project.builderEmail}
                        </a>
                      </div>
                    )}
                    {project.builderPhone && (
                      <div>
                        <p className="text-[10px] text-blue-600/80 font-bold uppercase tracking-wider mb-1">Phone Number</p>
                        <a href={`tel:${project.builderPhone}`} className="text-sm font-semibold text-blue-700 hover:underline flex items-center gap-1.5">
                          <Phone className="w-4 h-4 flex-shrink-0" /> {project.builderPhone}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              )}

            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
