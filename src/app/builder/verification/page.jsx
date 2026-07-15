"use client";

import React, { useState } from 'react';
import { useAuth } from '@/hooks/AuthContext';
import { uploadFile, apiRequest } from '@/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import {
  Upload, CheckCircle2,
  Loader2, FileCheck, ArrowRight, ShieldAlert as AlertIcon, ClipboardList
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import MultiSelect from '@/components/ui/MultiSelect';

const PROJECT_CATEGORY_TYPES = {
  "Residential": ["Apartments", "Villas", "Luxury Homes", "Senior Living", "Holiday & Farm Houses"],
  "Commercial": ["Office Spaces", "Retail Shops", "Shopping Malls", "Co-working Spaces", "IT Parks"],
  "Land & Plots": ["Residential Plots", "Villa Plots", "Farm Plots", "Commercial Plots", "Agricultural Land"],
  "Industrial & Warehousing": ["Warehouses", "Industrial Parks", "Industrial Plots", "Cold Storage"],
  "Hospitality": ["Hotels & Resorts"]
};
const PROJECT_STAGES = ["Pre-Launch", "New Launch", "Under Construction", "Ready to Move", "Rental Income", "Resale"];
const CAPITAL_REQUIREMENTS = ["Equity Investment", "Debt Funding", "Joint Venture", "Revenue Sharing", "Construction Finance", "Land Acquisition Finance", "NRI Capital", "Institutional Funding"];

export default function BuilderVerificationPage() {
  const { user, refreshUser } = useAuth();
  const router = useRouter();

  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const [bldForm2, setBldForm2] = useState({
    yearOfIncorporation: '',
    // Delivery volume
    deliveryVolumeType: '',      // 'sqft' | 'sqyd' | 'both'
    deliverySqft: '',
    deliverySqyd: '',
    // Projects
    namesOfProjects: '',
    // Governance group (5, 6, 7, 12)
    typeOfFirm: '',
    typeOfFirmOther: '',
    totalPartners: '',
    managingPartnerName: '',
    majorStakeholderName: '',
    tradeOrganizationMembership: [],
    tradeOrganizationOther: '',
    // Company overview (8)
    companyOverview: '',
    // Litigation (9)
    declaredLitigationDisputes: '',
    // Banking + Revenue (10)
    bankingPartners: '',
    totalRevenue: '',
    revenueInLastYear: '',
    // Existing fields
    experienceWithNriInvestors: '',
    majorCompletedProjects: '',
    outstandingDebt: '',
    financialOfCompany: '',
    // Property Form Fields
    projectType: '',
    projectSubType: '',
    propertyLandType: '', // 'own' | 'development'
    propertyLandDetails: '',
    projectSpecifications: '',
    // Project & Capital Preferences (moved from Form 1)
    projectCategories: [],
    projectTypes: [],
    projectStages: [],
    capitalRequirements: [],
    ongoingProjects: '',
    projectsCompleted: '',
  });

  const kycStatus = user?.kycStatus || 'not_started';
  const isVerified = user?.isVerified || false;

  // Always refresh user data from server on mount so we get latest
  // onboardingStatus (e.g. form2_changes_requested) set by the admin
  React.useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  // Hydrate form if user data exists
  React.useEffect(() => {
    if (user) {
      setBldForm2(prev => ({
        ...prev,
        yearOfIncorporation: user.yearOfIncorporation || '',
        deliveryVolumeType: user.deliveryVolumeType || '',
        deliverySqft: user.deliverySqft || '',
        deliverySqyd: user.deliverySqyd || '',
        namesOfProjects: user.namesOfProjects || '',
        typeOfFirm: user.typeOfFirm || '',
        typeOfFirmOther: user.typeOfFirmOther || '',
        totalPartners: user.totalPartners || '',
        managingPartnerName: user.managingPartnerName || '',
        majorStakeholderName: user.majorStakeholderName || '',
        tradeOrganizationMembership: user.tradeOrganizationMembership || [],
        tradeOrganizationOther: user.tradeOrganizationOther || '',
        companyOverview: user.companyOverview || '',
        declaredLitigationDisputes: user.declaredLitigationDisputes || '',
        bankingPartners: user.bankingPartners || '',
        totalRevenue: user.totalRevenue || '',
        revenueInLastYear: user.revenueInLastYear || '',
        experienceWithNriInvestors: user.experienceWithNriInvestors || '',
        majorCompletedProjects: user.majorCompletedProjects || '',
        outstandingDebt: user.outstandingDebt || '',
        financialOfCompany: user.financialOfCompany || '',
        projectCategories: user.projectCategories || [],
        projectTypes: user.projectTypes || [],
        projectStages: user.projectStages || [],
        capitalRequirements: user.capitalRequirements || [],
        ongoingProjects: user.ongoingProjects || '',
        projectsCompleted: user.projectsCompleted || '',
      }));
    }
  }, [user]);

  const handleTradeToggle = (type) => {
    setBldForm2(prev => {
      const current = prev.tradeOrganizationMembership || [];
      return {
        ...prev,
        tradeOrganizationMembership: current.includes(type)
          ? current.filter(t => t !== type)
          : [...current, type]
      };
    });
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const f = e.target.files[0];
      if (f.size > 10 * 1024 * 1024) {
        return toast({ title: "File Too Large", description: "Upload a document under 10MB.", variant: "destructive" });
      }
      setFile(f);
    }
  };

  const isForm2Valid = () => {
    const deliveryOk =
      bldForm2.deliveryVolumeType === 'sqft' ? bldForm2.deliverySqft.trim() !== '' :
      bldForm2.deliveryVolumeType === 'sqyd' ? bldForm2.deliverySqyd.trim() !== '' :
      bldForm2.deliveryVolumeType === 'both' ? bldForm2.deliverySqft.trim() !== '' && bldForm2.deliverySqyd.trim() !== '' :
      false;

    const firmOk = bldForm2.typeOfFirm.trim() !== '' && (bldForm2.typeOfFirm !== 'Other' || bldForm2.typeOfFirmOther.trim() !== '');

    return (
      bldForm2.yearOfIncorporation.trim() !== '' &&
      deliveryOk &&
      bldForm2.namesOfProjects.trim() !== '' &&
      firmOk &&
      bldForm2.totalPartners.trim() !== '' &&
      bldForm2.managingPartnerName.trim() !== '' &&
      bldForm2.companyOverview.trim() !== '' &&
      bldForm2.totalRevenue.trim() !== '' &&
      bldForm2.revenueInLastYear.trim() !== '' &&
      bldForm2.experienceWithNriInvestors !== ''
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setUploading(true);
      let payload = { ...bldForm2 };

      if (file) {
        const uploadRes = await uploadFile(file, 'builder_documents');
        if (uploadRes.success && uploadRes.url) {
          payload.projectBrochureUrl = uploadRes.url;
        }
      }

      await apiRequest('/api/builders/submit-verification', {
        method: 'POST',
        body: JSON.stringify(payload)
      });

      toast({ title: "Verification Submitted", description: "Your details have been sent for admin review." });
      await refreshUser();
      setFile(null);
    } catch (err) {
      toast({ title: "Submission Failed", description: err.message || "Please try again.", variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  const lbl = "text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block";
  const inp = "w-full h-12 bg-gray-50 border-gray-200 rounded-xl px-4 font-semibold text-gray-900 focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all";
  const sel = "w-full h-12 bg-gray-50 border border-gray-200 rounded-xl px-4 font-semibold text-gray-900 focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all outline-none appearance-none";
  const txta = "w-full bg-gray-50 border-gray-200 rounded-xl px-4 py-3 font-semibold text-gray-900 focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all min-h-[100px] resize-y";
  const ro = "w-full h-12 bg-gray-100 border-transparent rounded-xl px-4 font-bold text-gray-500 select-none";
  const sectionHead = "text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4 block border-b border-gray-100 pb-2";

  return (
    <div className="min-h-screen bg-[#f5f6fa] flex items-center justify-center p-4 md:p-8">
      <div className="max-w-2xl w-full bg-white rounded-[2rem] border border-gray-100 p-8 shadow-xl shadow-gray-200/50">

        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Builder</h1>
          <p className="text-xs text-gray-400 font-bold tracking-wide uppercase mt-1">Step 03</p>
        </div>

        {/* ── Approved ── */}
        {isVerified && (
          <div className="text-center flex flex-col items-center py-6 animate-in fade-in zoom-in-95 duration-300">
            <div className="w-20 h-20 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mb-6 shadow-inner border border-emerald-100">
              <CheckCircle2 className="w-10 h-10 animate-bounce" />
            </div>
            <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight mb-2">Profile Verified</h3>
            <p className="text-sm text-gray-500 font-semibold leading-relaxed mb-8 px-4 max-w-lg mx-auto">
              Your builder profile is fully verified. You have unrestricted access to publish projects and manage leads.
            </p>
            <Button onClick={() => router.push('/builder/dashboard')} className="bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs uppercase tracking-wider px-8 py-4 rounded-xl h-auto transition-all hover:scale-[1.02]">
              Go to Dashboard <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        )}

        {/* ── Pending ── */}
        {!isVerified && kycStatus === 'pending' && user?.onboardingStatus !== 'form2_changes_requested' && (
          <div className="text-center flex flex-col items-center py-6 animate-in fade-in zoom-in-95 duration-300">
            <div className="w-20 h-20 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600 mb-6 shadow-inner border border-amber-100">
              <FileCheck className="w-10 h-10 animate-pulse" />
            </div>
            <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight mb-2">Verification In Progress</h3>
            <p className="text-sm text-gray-500 font-semibold leading-relaxed mb-6 px-4 max-w-lg mx-auto">
              Your details are under review. This usually takes less than 24 hours.
            </p>
            <Button onClick={() => router.push('/builder/dashboard')} variant="outline" className="mt-4 font-black text-xs uppercase tracking-wider px-8 py-4 rounded-xl h-auto">
              Return to Dashboard
            </Button>
          </div>
        )}

        {/* ── Not Started / Rejected / Changes Requested ── */}
        {!isVerified && (kycStatus === 'not_started' || kycStatus === 'rejected' || user?.onboardingStatus === 'form2_changes_requested') && (
          <div className="animate-in fade-in duration-300">
            {user?.onboardingStatus === 'form2_changes_requested' && (
              <div className="mb-8 p-4 bg-orange-50 border border-orange-100 text-orange-700 rounded-2xl text-xs font-bold flex items-start gap-3.5 animate-in slide-in-from-top-2 duration-300">
                <AlertIcon className="w-5 h-5 shrink-0 text-orange-500 mt-0.5" />
                <div>
                  <span className="block font-black uppercase tracking-tight mb-0.5">Changes Requested by Admin</span>
                  <span className="font-semibold text-gray-600 leading-normal">
                    The admin has requested corrections to your submission.
                    {user?.adminRequests && user.adminRequests.length > 0 && (
                      <span> Please update: <span className="text-orange-800 underline font-black">{user.adminRequests.join(', ')}</span>.</span>
                    )}
                  </span>
                </div>
              </div>
            )}

            {kycStatus === 'rejected' && (
              <div className="mb-8 p-4 bg-rose-50 border border-rose-100 text-rose-700 rounded-2xl text-xs font-bold flex items-start gap-3.5">
                <AlertIcon className="w-5 h-5 shrink-0 text-rose-500 mt-0.5" />
                <div>
                  <span className="block font-black uppercase tracking-tight mb-0.5">Verification Rejected</span>
                  <span className="font-semibold text-gray-600">Please review and re-submit your details.</span>
                </div>
              </div>
            )}

            <div className="p-6 bg-blue-50 border border-blue-100 rounded-2xl flex gap-5 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                <ClipboardList className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="font-black text-blue-900 text-sm uppercase tracking-wider">Final Step</p>
                <p className="text-sm text-blue-700 mt-1 font-medium">Please provide these details to complete your builder profile verification.</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-10">

              {/* ── Auto-filled from Form 1 ── */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-gray-50 rounded-2xl border border-gray-100">
                <div>
                  <Label className={lbl}>Entity Name</Label>
                  <input readOnly value={user?.companyName || ''} className={ro} />
                </div>
                <div>
                  <Label className={lbl}>Location</Label>
                  <input readOnly value={[user?.city, user?.state, user?.country].filter(Boolean).join(', ') || ''} className={ro} placeholder="—" />
                </div>
              </div>

              {/* ── Section 1: Company Profile & Governance ── */}
              <div className="p-6 bg-gray-50/50 border border-gray-100 rounded-2xl space-y-6">
                <div>
                  <span className={sectionHead}>Company Profile &amp; Governance</span>
                  <p className="text-xs text-gray-400 font-bold tracking-wide uppercase mt-1">Provide your general company info and structure.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Years of Experience */}
                  <div>
                    <Label className={lbl}>Years of Experience *</Label>
                    <Input
                      required
                      value={bldForm2.yearOfIncorporation}
                      onChange={(e) => setBldForm2({ ...bldForm2, yearOfIncorporation: e.target.value.replace(/\D/g, '').slice(0, 2) })}
                      className={inp}
                      placeholder="e.g. 10"
                      maxLength={2}
                    />
                  </div>

                  {/* NRI Client Exposure */}
                  <div>
                    <Label className={lbl}>NRI Client Exposure *</Label>
                    <select required className={sel} value={bldForm2.experienceWithNriInvestors} onChange={(e) => setBldForm2({ ...bldForm2, experienceWithNriInvestors: e.target.value })}>
                      <option value="">Select Option</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>
                </div>

                {/* Company Overview */}
                <div>
                  <Label className={lbl}>Company Overview *</Label>
                  <Textarea
                    required
                    value={bldForm2.companyOverview}
                    onChange={(e) => setBldForm2({ ...bldForm2, companyOverview: e.target.value })}
                    className={txta}
                    placeholder="Write about your company in your own words — vision, mission, what makes you stand out..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Type of Firm */}
                  <div>
                    <Label className={lbl}>Type of Firm *</Label>
                    <select required className={sel} value={bldForm2.typeOfFirm} onChange={(e) => setBldForm2({ ...bldForm2, typeOfFirm: e.target.value })}>
                      <option value="">Select Type</option>
                      <option value="LLC">LLC (Limited Liability Company)</option>
                      <option value="Pvt">Pvt (Private Limited)</option>
                      <option value="LLP">LLP</option>
                      <option value="Public Limited">Public Limited</option>
                      <option value="Partnership">Partnership</option>
                      <option value="Sole Proprietorship">Sole Proprietorship</option>
                      <option value="Other">Other</option>
                    </select>
                    {bldForm2.typeOfFirm === 'Other' && (
                      <div className="mt-3 animate-in slide-in-from-top-2 duration-300">
                        <Input
                          required
                          value={bldForm2.typeOfFirmOther}
                          onChange={(e) => setBldForm2({ ...bldForm2, typeOfFirmOther: e.target.value })}
                          className={inp}
                          placeholder="Please specify"
                        />
                      </div>
                    )}
                  </div>

                  {/* Total No. of Partners */}
                  <div>
                    <Label className={lbl}>Total No. of Partners *</Label>
                    <Input
                      required
                      type="text"
                      value={bldForm2.totalPartners}
                      onChange={(e) => setBldForm2({ ...bldForm2, totalPartners: e.target.value.replace(/\D/g, '') })}
                      className={inp}
                      placeholder="e.g. 3"
                    />
                  </div>

                  {/* Managing Partner Name */}
                  <div className="md:col-span-2">
                    <Label className={lbl}>Managing Partner Name *</Label>
                    <Input
                      required
                      value={bldForm2.managingPartnerName}
                      onChange={(e) => setBldForm2({ ...bldForm2, managingPartnerName: e.target.value })}
                      className={inp}
                      placeholder="Full name"
                    />
                  </div>
                </div>

                {/* Association with Trade Organizations */}
                <div>
                  <Label className={lbl}>Association with Trade Organizations / Membership</Label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-2 p-4 border border-gray-100 rounded-xl bg-white">
                    {['CREDAI', 'FAPCCI', 'CRUPPI', 'Others'].map((type) => (
                      <div key={type} className="flex items-center space-x-3">
                        <Checkbox
                          id={`trade-${type}`}
                          checked={bldForm2.tradeOrganizationMembership?.includes(type)}
                          onCheckedChange={() => handleTradeToggle(type)}
                          className="data-[state=checked]:bg-orange-600 border-gray-300 w-5 h-5"
                        />
                        <Label htmlFor={`trade-${type}`} className="text-sm font-semibold text-gray-700 cursor-pointer">{type}</Label>
                      </div>
                    ))}
                  </div>
                  {bldForm2.tradeOrganizationMembership?.includes('Others') && (
                    <div className="mt-3 animate-in slide-in-from-top-2 duration-300">
                      <Input
                        required
                        value={bldForm2.tradeOrganizationOther}
                        onChange={(e) => setBldForm2({ ...bldForm2, tradeOrganizationOther: e.target.value })}
                        className={inp}
                        placeholder="Please specify organization(s)"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* ── Section 2: Project Specializations & Track Record ── */}
              <div className="p-6 bg-gray-50/50 border border-gray-100 rounded-2xl space-y-6">
                <div>
                  <span className={sectionHead}>Project Specializations &amp; Track Record</span>
                  <p className="text-xs text-gray-400 font-bold tracking-wide uppercase mt-1">Specify your project specializations and delivery record.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Project Category */}
                  <div>
                    <Label className={lbl}>Project Category *</Label>
                    <MultiSelect
                      options={Object.keys(PROJECT_CATEGORY_TYPES)}
                      selected={bldForm2.projectCategories || []}
                      onChange={(val) => {
                        const validTypes = val.reduce((acc, cat) => [...acc, ...(PROJECT_CATEGORY_TYPES[cat] || [])], []);
                        const filteredTypes = (bldForm2.projectTypes || []).filter(t => validTypes.includes(t));
                        setBldForm2(prev => ({ ...prev, projectCategories: val, projectTypes: filteredTypes }));
                      }}
                      placeholder="Select project categories"
                    />
                  </div>

                  {/* Project Type */}
                  <div>
                    <Label className={lbl}>Project Type *</Label>
                    <MultiSelect
                      options={bldForm2.projectCategories.reduce((acc, cat) => [...acc, ...(PROJECT_CATEGORY_TYPES[cat] || [])], [])}
                      selected={bldForm2.projectTypes || []}
                      onChange={(val) => setBldForm2(prev => ({ ...prev, projectTypes: val }))}
                      placeholder={bldForm2.projectCategories.length === 0 ? 'Select categories first' : 'Select project types'}
                      emptyMessage={bldForm2.projectCategories.length === 0 ? 'Please select a category first.' : 'No types found.'}
                    />
                  </div>

                  {/* Active Projects */}
                  <div>
                    <Label className={lbl}>Active Projects</Label>
                    <Input
                      type="text"
                      value={bldForm2.ongoingProjects}
                      onChange={(e) => setBldForm2({ ...bldForm2, ongoingProjects: e.target.value })}
                      className={inp}
                      placeholder="e.g. 3 active projects"
                    />
                  </div>

                  {/* Total Deliveries */}
                  <div>
                    <Label className={lbl}>Total Deliveries</Label>
                    <Input
                      type="text"
                      value={bldForm2.projectsCompleted}
                      onChange={(e) => setBldForm2({ ...bldForm2, projectsCompleted: e.target.value })}
                      className={inp}
                      placeholder="e.g. 15 projects completed"
                    />
                  </div>
                </div>

                {/* Names of Projects (Best Projects) */}
                <div>
                  <Label className={lbl}>Names of Projects (Best Projects) *</Label>
                  <Textarea
                    required
                    value={bldForm2.namesOfProjects}
                    onChange={(e) => setBldForm2({ ...bldForm2, namesOfProjects: e.target.value })}
                    className={txta}
                    placeholder="List your best / flagship projects..."
                  />
                </div>

                {/* Key Portfolio Highlights */}
                <div>
                  <Label className={lbl}>Key Portfolio Highlights (Optional)</Label>
                  <Textarea
                    value={bldForm2.majorCompletedProjects}
                    onChange={(e) => setBldForm2({ ...bldForm2, majorCompletedProjects: e.target.value })}
                    className={txta}
                    placeholder="Brief descriptions of major completed projects..."
                  />
                </div>

                {/* Total Delivery Volume (Sqft / Sqyd / Both) */}
                <div>
                  <Label className={lbl}>Total Delivery Volume *</Label>
                  <div className="flex gap-6 p-4 bg-white border border-gray-100 rounded-2xl mb-4">
                    {[
                      { val: 'sqft', label: 'Square Feet (Sqft)' },
                      { val: 'sqyd', label: 'Square Yard (Sqyd)' },
                      { val: 'both', label: 'Both' },
                    ].map(opt => (
                      <label key={opt.val} className="flex items-center gap-2.5 cursor-pointer">
                        <input
                          type="radio"
                          name="deliveryVolumeType"
                          value={opt.val}
                          checked={bldForm2.deliveryVolumeType === opt.val}
                          onChange={(e) => setBldForm2({ ...bldForm2, deliveryVolumeType: e.target.value, deliverySqft: '', deliverySqyd: '' })}
                          className="w-4 h-4 text-orange-600 border-gray-300 focus:ring-orange-500"
                        />
                        <span className="text-sm font-semibold text-gray-700">{opt.label}</span>
                      </label>
                    ))}
                  </div>
                  {(bldForm2.deliveryVolumeType === 'sqft' || bldForm2.deliveryVolumeType === 'both') && (
                    <div className={bldForm2.deliveryVolumeType === 'both' ? 'grid grid-cols-2 gap-4 animate-in slide-in-from-top-2 duration-200' : 'animate-in slide-in-from-top-2 duration-200'}>
                      <div>
                        <Label className={lbl}>Total Sqft *</Label>
                        <Input
                          required
                          value={bldForm2.deliverySqft}
                          onChange={(e) => setBldForm2({ ...bldForm2, deliverySqft: e.target.value.replace(/\D/g, '') })}
                          className={inp}
                          placeholder="e.g. 500000"
                        />
                      </div>
                      {bldForm2.deliveryVolumeType === 'both' && (
                        <div className="animate-in slide-in-from-top-2 duration-200">
                          <Label className={lbl}>Total Sqyd *</Label>
                          <Input
                            required
                            value={bldForm2.deliverySqyd}
                            onChange={(e) => setBldForm2({ ...bldForm2, deliverySqyd: e.target.value.replace(/\D/g, '') })}
                            className={inp}
                            placeholder="e.g. 55000"
                          />
                        </div>
                      )}
                    </div>
                  )}
                  {bldForm2.deliveryVolumeType === 'sqyd' && (
                    <div className="animate-in slide-in-from-top-2 duration-200">
                      <Label className={lbl}>Total Sqyd *</Label>
                      <Input
                        required
                        value={bldForm2.deliverySqyd}
                        onChange={(e) => setBldForm2({ ...bldForm2, deliverySqyd: e.target.value.replace(/\D/g, '') })}
                        className={inp}
                        placeholder="e.g. 55000"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* ── Section 3: Financial Overview ── */}
              <div className="p-6 bg-gray-50/50 border border-gray-100 rounded-2xl space-y-6">
                <div>
                  <span className={sectionHead}>Financial Overview</span>
                  <p className="text-xs text-gray-400 font-bold tracking-wide uppercase mt-1">Provide key revenue stats for your entity.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Total Revenue */}
                  <div>
                    <Label className={lbl}>Total Revenue *</Label>
                    <Input
                      required
                      type="text"
                      value={bldForm2.totalRevenue}
                      onChange={(e) => setBldForm2({ ...bldForm2, totalRevenue: e.target.value.replace(/\D/g, '') })}
                      className={inp}
                      placeholder="e.g. 50000000"
                    />
                  </div>

                  {/* Revenue in Last Year */}
                  <div>
                    <Label className={lbl}>Revenue in Last Year *</Label>
                    <Input
                      required
                      type="text"
                      value={bldForm2.revenueInLastYear}
                      onChange={(e) => setBldForm2({ ...bldForm2, revenueInLastYear: e.target.value.replace(/\D/g, '') })}
                      className={inp}
                      placeholder="e.g. 12000000"
                    />
                  </div>
                </div>
              </div>

              {/* ── Section 4: Compliance & Legal ── */}
              <div className="p-6 bg-gray-50/50 border border-gray-100 rounded-2xl space-y-6">
                <div>
                  <span className={sectionHead}>Compliance &amp; Legal</span>
                  <p className="text-xs text-gray-400 font-bold tracking-wide uppercase mt-1">Disclose any litigation or disputes.</p>
                </div>

                {/* Litigation / Disputes */}
                <div>
                  <Label className={lbl}>Litigation / Disputes (Optional)</Label>
                  <Textarea
                    value={bldForm2.declaredLitigationDisputes}
                    onChange={(e) => setBldForm2({ ...bldForm2, declaredLitigationDisputes: e.target.value })}
                    className={txta}
                    placeholder="Disclose any ongoing or past litigation or legal disputes (if applicable)"
                  />
                </div>
              </div>

              {/* ── Submit ── */}
              <Button
                type="submit"
                disabled={uploading || !isForm2Valid()}
                className="w-full h-16 bg-gray-900 hover:bg-black text-white font-black text-lg uppercase tracking-wider rounded-2xl shadow-xl shadow-black/10 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:scale-100 disabled:opacity-50 flex items-center justify-center gap-3"
              >
                {uploading ? (
                  <><Loader2 className="w-6 h-6 animate-spin" /> Finalizing...</>
                ) : (
                  <>Finalize Onboarding <ArrowRight className="h-6 w-6" /></>
                )}
              </Button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}
