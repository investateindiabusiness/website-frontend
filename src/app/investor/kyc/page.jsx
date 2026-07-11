"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/AuthContext';
import { uploadFile, apiRequest, submitInvestorForm2 } from '@/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from '@/hooks/use-toast';
import { 
  Upload, CheckCircle2, 
  Loader2, FileCheck, ArrowRight, ShieldAlert as AlertIcon, ClipboardList, Plus, X
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import MultiSelect from '@/components/ui/MultiSelect';
import { Badge } from '@/components/ui/badge';

// Professional global-specific professions
const DETAILED_PROFESSIONS = [
  "Technology / IT Professional",
  "Healthcare / Medical Professional",
  "Finance / Banking / Investment Specialist",
  "Business Owner / Entrepreneur",
  "Corporate Executive / Manager",
  "Consultant / Advisor",
  "Engineer / Scientist",
  "Educator / Researcher",
  "Self-Employed Professional (CA, Legal, etc.)",
  "Real Estate / Developer / Construction",
  "Retired",
  "Other"
];

// Income options by profession (in USD ranges)
const INCOME_OPTIONS_BY_PROFESSION = {
  'NRI / Overseas Professional': [
    '$30,000 - $60,000', '$60,000 - $100,000', '$100,000 - $150,000',
    '$150,000 - $250,000', '$250,000 - $500,000', '$500,000+'
  ],
  'Retired': [
    '$10,000 - $25,000', '$25,000 - $50,000', '$50,000 - $100,000',
    '$100,000 - $200,000', '$200,000+'
  ],
  'Other': [
    '$5,000 - $20,000', '$20,000 - $50,000', '$50,000 - $100,000',
    '$100,000 - $250,000', '$250,000+'
  ],
};

const DEFAULT_INCOME_OPTIONS = [
  '$10,000 - $30,000', '$30,000 - $75,000', '$75,000 - $150,000',
  '$150,000 - $300,000', '$300,000+'
];

// Dynamic Categories and Types mapping
const INVESTMENT_CATEGORY_TYPES = {
  "Residential": [
    "Apartments", "Villas", "Villaments", "Gated Communities",
    "Luxury Homes", "Senior Living", "Affordable Housing", "Holiday Homes"
  ],
  "Commercial": [
    "Office Spaces", "Retail Shops", "Commercial Complexes",
    "Shopping Malls", "Co-working Spaces", "IT Parks"
  ],
  "Land & Plots": [
    "Residential Plots", "Villa Plots", "Farm Plots",
    "Commercial Plots", "Township Plots"
  ],
  "Industrial & Warehousing": [
    "Warehouses", "Industrial Parks", "Manufacturing Units",
    "Logistics Parks", "Cold Storage"
  ],
  "Agricultural": [
    "Agricultural Land", "Farm Houses", "Organic Farms", "Plantation Projects"
  ],
  "Hospitality": [
    "Hotels", "Resorts", "Serviced Apartments", "Holiday Projects"
  ],
  "Alternative Investments": [
    "Fractional Ownership", "REIT Opportunities", "Equity Participation", "Joint Ventures"
  ]
};

const PREFERRED_INVESTMENT_STAGES = [
  "Pre-Launch", "New Launch", "Under Construction", "Ready to Move", "Rental Income", "Resale"
];

const INVESTMENT_PURPOSES = [
  "Self Use", "Rental Income", "Long-Term Appreciation", "Short-Term Returns", "Portfolio Diversification", "Retirement Planning"
];

const BUDGET_RANGES = [
  "₹25L–50L", "₹50L–1Cr", "₹1Cr–2Cr", "₹2Cr–5Cr", "₹5Cr–10Cr", "₹10Cr+"
];

const NATIONALITIES = [
  'Indian', 'American', 'British', 'Australian', 'Canadian', 'UAE / Emirati',
  'Singaporean', 'Malaysian', 'Saudi Arabian', 'Qatari', 'German', 'French', 'Other'
];

export default function InvestorKycPage() {
  const { user, refreshUser } = useAuth();
  const router = useRouter();
  
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [locInput, setLocInput] = useState({ country: '', state: '', city: '' });

  const [invForm2, setInvForm2] = useState({
    profession: '',
    professionOther: '',
    nationality: '',
    nationalityOther: '',
    industryNatureOfWork: '',
    yearlyIncome: '',
    investmentTenure: '',
    expectedReturns: '',
    preferredGoalStategy: '',
    passportNumber: '',
    preferredCategories: [],
    preferredTypes: [],
    preferredStages: [],
    preferredPurposes: [],
    preferredLocations: [],
    preferredBudgets: []
  });

  const kycStatus = user?.kycStatus || 'not_started';
  const isKycVerified = user?.isKycVerified || false;

  // Hydrate form if user data exists
  useEffect(() => {
    if (user) {
      setInvForm2(prev => ({
        ...prev,
        profession: user.profession || '',
        nationality: user.nationality || '',
        industryNatureOfWork: user.industryNatureOfWork || '',
        yearlyIncome: user.yearlyIncome || '',
        investmentTenure: user.investmentTenure || '',
        expectedReturns: user.expectedReturns || '',
        preferredGoalStategy: user.preferredGoalStategy || '',
        passportNumber: user.passportNumber || '',
        preferredCategories: user.preferredCategories || [],
        preferredTypes: user.preferredTypes || [],
        preferredStages: user.preferredStages || [],
        preferredPurposes: user.preferredPurposes || [],
        preferredLocations: user.preferredLocations || [],
        preferredBudgets: user.preferredBudgets || []
      }));
    }
  }, [user]);

  // Load locations on mount
  useEffect(() => {
    fetch('https://countriesnow.space/api/v0.1/countries/iso')
      .then(res => res.json())
      .then(data => { if (!data.error) setCountries(data.data || []); })
      .catch(console.error);
  }, []);

  // Fetch States when selected country in Preferred Locations change
  useEffect(() => {
    if (locInput.country) {
      setLoadingLocation(true);
      fetch('https://countriesnow.space/api/v0.1/countries/states', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ country: locInput.country })
      })
        .then(res => res.json())
        .then(data => { if (!data.error) setStates(data.data.states || []); })
        .catch(console.error)
        .finally(() => setLoadingLocation(false));
    } else {
      setStates([]);
    }
    setLocInput(prev => ({ ...prev, state: '', city: '' }));
  }, [locInput.country]);

  // Fetch Cities when selected state in Preferred Locations change
  useEffect(() => {
    if (locInput.country && locInput.state) {
      setLoadingLocation(true);
      fetch('https://countriesnow.space/api/v0.1/countries/state/cities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ country: locInput.country, state: locInput.state })
      })
        .then(res => res.json())
        .then(data => { if (!data.error) setCities(data.data || []); })
        .catch(console.error)
        .finally(() => setLoadingLocation(false));
    } else {
      setCities([]);
    }
    setLocInput(prev => ({ ...prev, city: '' }));
  }, [locInput.country, locInput.state]);

  const handleAddLocation = () => {
    if (!locInput.country) return;
    const label = [locInput.city, locInput.state, locInput.country].filter(Boolean).join(', ');
    
    if (invForm2.preferredLocations.some(loc => loc.label === label)) {
      return toast({ title: "Duplicate Location", description: "This location is already added." });
    }

    setInvForm2(prev => ({
      ...prev,
      preferredLocations: [...prev.preferredLocations, {
        country: locInput.country,
        state: locInput.state,
        city: locInput.city,
        label: label
      }]
    }));
    setLocInput({ country: '', state: '', city: '' });
  };

  const handleRemoveLocation = (labelToRemove) => {
    setInvForm2(prev => ({
      ...prev,
      preferredLocations: prev.preferredLocations.filter(loc => loc.label !== labelToRemove)
    }));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.size > 10 * 1024 * 1024) {
        return toast({ title: "File Too Large", description: "Please upload a passport document under 10MB.", variant: "destructive" });
      }
      setFile(selectedFile);
    }
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      return toast({ title: "No File Selected", description: "Please select your passport scanned copy first.", variant: "destructive" });
    }
    if (!invForm2.passportNumber || !invForm2.passportNumber.trim()) {
      return toast({ title: "Passport Required", description: "Please enter your passport number.", variant: "destructive" });
    }
    if (invForm2.preferredCategories.length === 0) {
      return toast({ title: "Category Required", description: "Please select at least one Investment Category.", variant: "destructive" });
    }
    if (invForm2.preferredTypes.length === 0) {
      return toast({ title: "Type Required", description: "Please select at least one Investment Type.", variant: "destructive" });
    }

    // Build submission payload — use "other" typed values if selected
    const payload = {
      ...invForm2,
      profession: invForm2.profession === 'Other' ? `Other: ${invForm2.professionOther}` : invForm2.profession,
      nationality: invForm2.nationality === 'Other' ? `Other: ${invForm2.nationalityOther}` : invForm2.nationality,
    };

    try {
      setUploading(true);
      await submitInvestorForm2(user.uid, payload);

      const uploadRes = await uploadFile(file, 'kyc_passports');
      if (!uploadRes.success || !uploadRes.url) throw new Error(uploadRes.error || "File upload failed");

      await apiRequest('/api/investors/submit-kyc', {
        method: 'POST',
        body: JSON.stringify({ kycPassportUrl: uploadRes.url, passportNumber: invForm2.passportNumber })
      });

      toast({ title: "Profile & KYC Submitted", description: "Your final details and passport copy have been sent for verification." });
      await refreshUser();
      setFile(null);
    } catch (err) {
      toast({ title: "Submission Failed", description: err.message || "Failed to submit KYC. Please try again.", variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  const labelStyle = "text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block";
  const inputStyle = "w-full h-12 bg-gray-50 border-gray-200 rounded-xl px-4 font-semibold text-gray-900 focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all";
  const selectStyle = "w-full h-12 bg-gray-50 border border-gray-200 rounded-xl px-4 font-semibold text-gray-900 focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all outline-none appearance-none";

  const getIncomeOptions = () => {
    if (!invForm2.profession) return DEFAULT_INCOME_OPTIONS;
    if (invForm2.profession.includes('NRI')) return INCOME_OPTIONS_BY_PROFESSION['NRI / Overseas Professional'];
    if (invForm2.profession === 'Retired') return INCOME_OPTIONS_BY_PROFESSION['Retired'];
    if (invForm2.profession === 'Other') return INCOME_OPTIONS_BY_PROFESSION['Other'];
    return DEFAULT_INCOME_OPTIONS;
  };

  const incomeOptions = getIncomeOptions();

  // Dynamically compute valid investment types based on selected categories
  const dynamicTypesList = [];
  invForm2.preferredCategories.forEach(cat => {
    if (INVESTMENT_CATEGORY_TYPES[cat]) {
      dynamicTypesList.push(...INVESTMENT_CATEGORY_TYPES[cat]);
    }
  });

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="max-w-3xl w-full bg-white rounded-3xl border border-gray-100 p-8 shadow-xl shadow-gray-200/50">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Verification</h1>
          <p className="text-xs text-gray-400 font-bold tracking-wide uppercase mt-1">Step 02 — Profile Completion</p>
        </div>

        {/* ── Status: Approved ── */}
        {kycStatus === 'approved' && isKycVerified && (
          <div className="text-center flex flex-col items-center py-6 animate-in fade-in zoom-in-95 duration-300">
            <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mb-6 shadow-inner">
              <CheckCircle2 className="w-8 h-8 animate-bounce" />
            </div>
            <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight mb-2">Identity Verified</h3>
            <p className="text-xs text-gray-500 font-semibold leading-relaxed mb-8 px-4">
              Congratulations! Your KYC verification is approved. You have full, unrestricted access to the Investate India property catalog, detailed blueprints, and yields.
            </p>
            <Button onClick={() => router.push('/dashboard')} className="bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs uppercase tracking-wider px-8 py-3 rounded-xl transition-all shadow-md shadow-emerald-600/10 hover:scale-[1.02] active:scale-[0.98]">
              Go to Dashboard <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        )}

        {/* ── Status: Pending ── */}
        {kycStatus === 'pending' && user?.onboardingStatus !== 'form2_changes_requested' && (
          <div className="text-center flex flex-col items-center py-6 animate-in fade-in zoom-in-95 duration-300">
            <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600 mb-6 shadow-inner">
              <FileCheck className="w-8 h-8 animate-pulse" />
            </div>
            <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight mb-2">Verification In Progress</h3>
            <p className="text-xs text-gray-500 font-semibold leading-relaxed mb-6 px-4">
              Your details and document have been submitted and are under review. This usually takes less than 24 hours.
            </p>
            <Button onClick={() => router.push('/dashboard')} variant="outline" className="mt-4 font-black text-xs uppercase tracking-wider px-8 py-3 rounded-xl transition-all shadow-sm">
              Return to Dashboard
            </Button>
          </div>
        )}

        {/* ── Status: Not Started or Rejected or Changes Requested ── */}
        {(kycStatus === 'not_started' || kycStatus === 'rejected' || user?.onboardingStatus === 'form2_changes_requested') && (
          <div className="animate-in fade-in duration-300">
            {kycStatus === 'rejected' && (
              <div className="mb-8 p-4 bg-rose-50 border border-rose-100 text-rose-700 rounded-2xl text-xs font-bold flex items-start gap-3.5">
                <AlertIcon className="w-5 h-5 shrink-0 text-rose-500 mt-0.5" />
                <div>
                  <span className="block font-black uppercase tracking-tight mb-0.5">KYC Application Rejected</span>
                  <span className="font-semibold text-gray-600 leading-normal">Please review and re-submit your details and passport scan.</span>
                </div>
              </div>
            )}

            {user?.onboardingStatus === 'form2_changes_requested' && (
              <div className="mb-8 p-4 bg-orange-50 border border-orange-100 text-orange-700 rounded-2xl text-xs font-bold flex items-start gap-3.5 animate-in slide-in-from-top-2 duration-300">
                <AlertIcon className="w-5 h-5 shrink-0 text-orange-500 mt-0.5" />
                <div>
                  <span className="block font-black uppercase tracking-tight mb-0.5">Changes Requested by Admin</span>
                  <span className="font-semibold text-gray-600 leading-normal">
                    Please correct the following fields: <span className="underline">{user.adminRequests?.join(', ')}</span>.
                  </span>
                </div>
              </div>
            )}

            <div className="p-6 bg-blue-50 border border-blue-100 rounded-2xl flex gap-5 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                <ClipboardList className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="font-black text-blue-900 text-sm uppercase tracking-wider">Final Step</p>
                <p className="text-sm text-blue-700 mt-1 font-medium">Provide these details and your passport to complete your professional profile.</p>
              </div>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Pre-filled from Form 1 (Location removed) */}
                <div className="md:col-span-2">
                  <Label className={labelStyle}>Full Name</Label>
                  <input readOnly value={user?.name || user?.fullName || ''} className="w-full h-12 bg-gray-100 border-transparent rounded-xl px-4 font-bold text-gray-500 select-none" />
                </div>

                {/* Profession */}
                <div className={invForm2.profession === 'Other' ? '' : 'md:col-span-1'}>
                  <Label className={labelStyle}>Profession *</Label>
                  <select
                    required
                    className={selectStyle}
                    value={invForm2.profession}
                    onChange={(e) => setInvForm2({ ...invForm2, profession: e.target.value, yearlyIncome: '' })}
                  >
                    <option value="">Select Profession</option>
                    {DETAILED_PROFESSIONS.map(prof => (
                      <option key={prof} value={prof}>{prof}</option>
                    ))}
                  </select>
                </div>

                {/* "Other" profession text input */}
                {invForm2.profession === 'Other' && (
                  <div className="animate-in slide-in-from-top-2 duration-300">
                    <Label className={labelStyle}>Please Specify Profession *</Label>
                    <Input
                      required
                      value={invForm2.professionOther}
                      onChange={(e) => setInvForm2({ ...invForm2, professionOther: e.target.value })}
                      className={inputStyle}
                      placeholder="Describe your profession"
                    />
                  </div>
                )}

                {/* Annual Income — dropdown based on profession */}
                <div>
                  <Label className={labelStyle}>Annual Income *</Label>
                  <select
                    required
                    className={selectStyle}
                    value={invForm2.yearlyIncome}
                    onChange={(e) => setInvForm2({ ...invForm2, yearlyIncome: e.target.value })}
                  >
                    <option value="">Select Range</option>
                    {incomeOptions.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>

                {/* Nationality */}
                <div>
                  <Label className={labelStyle}>Nationality *</Label>
                  <select
                    required
                    className={selectStyle}
                    value={invForm2.nationality}
                    onChange={(e) => setInvForm2({ ...invForm2, nationality: e.target.value, nationalityOther: '' })}
                  >
                    <option value="">Select Nationality</option>
                    {NATIONALITIES.map(n => (
                      <option key={n} value={n}>{n}</option>
                    ))}
                  </select>
                </div>

                {/* "Other" nationality text input */}
                {invForm2.nationality === 'Other' && (
                  <div className="animate-in slide-in-from-top-2 duration-300">
                    <Label className={labelStyle}>Please Specify Nationality *</Label>
                    <Input
                      required
                      value={invForm2.nationalityOther}
                      onChange={(e) => setInvForm2({ ...invForm2, nationalityOther: e.target.value })}
                      className={inputStyle}
                      placeholder="Enter your nationality"
                    />
                  </div>
                )}

                {/* Primary Industry */}
                <div>
                  <Label className={labelStyle}>Primary Industry *</Label>
                  <Input required value={invForm2.industryNatureOfWork} onChange={(e) => setInvForm2({ ...invForm2, industryNatureOfWork: e.target.value })} className={inputStyle} placeholder="e.g. IT, Real Estate, Healthcare" />
                </div>

                {/* Target Tenure */}
                <div>
                  <Label className={labelStyle}>Target Tenure *</Label>
                  <select required className={selectStyle} value={invForm2.investmentTenure} onChange={(e) => setInvForm2({ ...invForm2, investmentTenure: e.target.value })}>
                    <option value="">Select Tenure</option>
                    <option value="1-3 Years">1 - 3 Years</option>
                    <option value="3-5 Years">3 - 5 Years</option>
                    <option value="5+ Years">5+ Years</option>
                  </select>
                </div>

                {/* Return Expectations */}
                <div>
                  <Label className={labelStyle}>Return Expectations *</Label>
                  <Input required value={invForm2.expectedReturns} onChange={(e) => setInvForm2({ ...invForm2, expectedReturns: e.target.value })} className={inputStyle} placeholder="e.g. 15%" />
                </div>

                {/* Primary Strategy */}
                <div>
                  <Label className={labelStyle}>Primary Strategy *</Label>
                  <select required className={selectStyle} value={invForm2.preferredGoalStategy} onChange={(e) => setInvForm2({ ...invForm2, preferredGoalStategy: e.target.value })}>
                    <option value="">Select Strategy</option>
                    <option value="Buy & Hold">Buy & Hold (Long-term Appreciation)</option>
                    <option value="Buy & Resell">Buy & Resell (Short-term Gains)</option>
                    <option value="Buy & Lease">Buy & Lease (Rental Income)</option>
                    <option value="Mix of Appreciation & Rental">Mix of Appreciation & Rental</option>
                    <option value="Open to Suggestions">Open to Suggestions</option>
                  </select>
                </div>

                {/* Passport Number */}
                <div>
                  <Label className={labelStyle}>Passport Number *</Label>
                  <Input
                    required
                    value={invForm2.passportNumber}
                    onChange={(e) => setInvForm2({ ...invForm2, passportNumber: e.target.value.toUpperCase() })}
                    className={inputStyle}
                    placeholder="Enter passport number"
                  />
                </div>
              </div>

              {/* ─── INVESTMENT PREFERENCES SECTION ─── */}
              <div className="pt-6 border-t border-gray-100 space-y-6">
                <div>
                  <h3 className="text-sm font-black text-gray-900 uppercase tracking-wider">Investment Preferences</h3>
                  <p className="text-xs text-gray-500 font-semibold mt-1">These preferences help customize recommendations and matching options.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Category (Multi Select) */}
                  <div>
                    <Label className={labelStyle}>Investment Category *</Label>
                    <MultiSelect
                      options={Object.keys(INVESTMENT_CATEGORY_TYPES)}
                      selected={invForm2.preferredCategories}
                      onChange={(val) => {
                        // Reset types that are no longer valid under new categories
                        const validTypes = val.reduce((acc, cat) => [...acc, ...INVESTMENT_CATEGORY_TYPES[cat]], []);
                        const filteredSelectedTypes = invForm2.preferredTypes.filter(t => validTypes.includes(t));
                        setInvForm2(prev => ({ 
                          ...prev, 
                          preferredCategories: val,
                          preferredTypes: filteredSelectedTypes
                        }));
                      }}
                      placeholder="Select categories"
                    />
                  </div>

                  {/* Type (Dependent Multi Select) */}
                  <div>
                    <Label className={labelStyle}>Investment Type *</Label>
                    <MultiSelect
                      options={dynamicTypesList}
                      selected={invForm2.preferredTypes}
                      onChange={(val) => setInvForm2(prev => ({ ...prev, preferredTypes: val }))}
                      placeholder={invForm2.preferredCategories.length === 0 ? "Select categories first" : "Select investment types"}
                      emptyMessage={invForm2.preferredCategories.length === 0 ? "Please select a category first." : "No types found."}
                    />
                  </div>

                  {/* Preferred Investment Stage (Multi Select) */}
                  <div>
                    <Label className={labelStyle}>Preferred Investment Stage</Label>
                    <MultiSelect
                      options={PREFERRED_INVESTMENT_STAGES}
                      selected={invForm2.preferredStages}
                      onChange={(val) => setInvForm2(prev => ({ ...prev, preferredStages: val }))}
                      placeholder="Select stages"
                    />
                  </div>

                  {/* Investment Purpose (Multi Select) */}
                  <div>
                    <Label className={labelStyle}>Investment Purpose</Label>
                    <MultiSelect
                      options={INVESTMENT_PURPOSES}
                      selected={invForm2.preferredPurposes}
                      onChange={(val) => setInvForm2(prev => ({ ...prev, preferredPurposes: val }))}
                      placeholder="Select purposes"
                    />
                  </div>

                  {/* Preferred Locations (Multi Select Country, State, City) */}
                  <div className="md:col-span-2 space-y-4">
                    <Label className={labelStyle}>Preferred Locations (Multiple)</Label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
                      <div>
                        <Label className="text-[10px] font-bold text-gray-400 uppercase mb-1 block">Country</Label>
                        <select 
                          className={selectStyle}
                          value={locInput.country} 
                          onChange={(e) => setLocInput(prev => ({ ...prev, country: e.target.value }))}
                        >
                          <option value="">Select Country</option>
                          {countries.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
                        </select>
                      </div>

                      <div>
                        <Label className="text-[10px] font-bold text-gray-400 uppercase mb-1 block">State / Region</Label>
                        <select 
                          className={selectStyle}
                          value={locInput.state} 
                          onChange={(e) => setLocInput(prev => ({ ...prev, state: e.target.value }))}
                          disabled={!locInput.country}
                        >
                          <option value="">{loadingLocation && !locInput.state ? "Loading..." : "Select State"}</option>
                          {states.map(s => <option key={s.name} value={s.name}>{s.name}</option>)}
                        </select>
                      </div>

                      <div className="flex gap-2">
                        <div className="flex-grow">
                          <Label className="text-[10px] font-bold text-gray-400 uppercase mb-1 block">City</Label>
                          <select 
                            className={selectStyle}
                            value={locInput.city} 
                            onChange={(e) => setLocInput(prev => ({ ...prev, city: e.target.value }))}
                            disabled={!locInput.state}
                          >
                            <option value="">{loadingLocation && !locInput.city ? "Loading..." : "Select City"}</option>
                            {cities.map(c => <option key={c} value={c}>{c}</option>)}
                          </select>
                        </div>
                        <Button 
                          type="button" 
                          onClick={handleAddLocation}
                          disabled={!locInput.country}
                          className="h-12 w-12 rounded-xl bg-orange-600 hover:bg-orange-700 text-white p-0 flex items-center justify-center flex-shrink-0"
                        >
                          <Plus className="w-5 h-5" />
                        </Button>
                      </div>
                    </div>

                    {/* Removable chips/tags */}
                    {invForm2.preferredLocations.length > 0 && (
                      <div className="flex flex-wrap gap-2 p-3 bg-gray-50 border border-gray-100 rounded-2xl">
                        {invForm2.preferredLocations.map(loc => (
                          <Badge 
                            key={loc.label} 
                            className="bg-gray-200 text-gray-800 hover:bg-gray-300 font-bold py-1 px-3.5 rounded-xl flex items-center gap-1.5"
                          >
                            {loc.label}
                            <button 
                              type="button" 
                              onClick={() => handleRemoveLocation(loc.label)}
                              className="text-gray-500 hover:text-gray-800"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Budget Range */}
                  <div>
                    <Label className={labelStyle}>Budget Range</Label>
                    <MultiSelect
                      options={BUDGET_RANGES}
                      selected={invForm2.preferredBudgets}
                      onChange={(val) => setInvForm2(prev => ({ ...prev, preferredBudgets: val }))}
                      placeholder="Select budgets"
                    />
                  </div>
                </div>
              </div>

              <div className="h-px bg-gray-100 w-full" />

              <div>
                <Label className={labelStyle}>Passport Document Copy *</Label>
                <div className="relative group border-2 border-dashed border-gray-200 hover:border-orange-500/50 rounded-2xl p-8 text-center transition-all bg-gray-50/50 hover:bg-orange-50/10 cursor-pointer mt-2">
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="flex flex-col items-center justify-center">
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-gray-400 group-hover:text-orange-500 group-hover:scale-110 shadow-sm border border-gray-100 transition-all mb-4">
                      <Upload className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-bold text-gray-700 uppercase tracking-tight block">
                      {file ? file.name : "Upload Passport Document"}
                    </span>
                    <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide block mt-1">
                      {file ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : "PDF, JPEG, or PNG up to 10MB"}
                    </span>
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                disabled={uploading || !file || invForm2.preferredCategories.length === 0 || invForm2.preferredTypes.length === 0}
                className="w-full h-14 bg-gray-900 hover:bg-black text-white font-black text-sm uppercase tracking-wider rounded-xl shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98] disabled:scale-100 disabled:opacity-50"
              >
                {uploading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    Submitting Profile & KYC...
                  </>
                ) : (
                  "Complete Verification"
                )}
              </Button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}
