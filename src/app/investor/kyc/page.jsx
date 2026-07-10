"use client";

import React, { useState } from 'react';
import { useAuth } from '@/hooks/AuthContext';
import { uploadFile, apiRequest, submitInvestorForm2 } from '@/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from '@/hooks/use-toast';
import { 
  Upload, CheckCircle2, 
  Loader2, FileCheck, ArrowRight, ShieldAlert as AlertIcon, ClipboardList
} from 'lucide-react';
import { useRouter } from 'next/navigation';

// Income options by profession (in USD ranges)
const INCOME_OPTIONS_BY_PROFESSION = {
  'NRI / Overseas Professional': [
    '$30,000 - $60,000', '$60,000 - $100,000', '$100,000 - $150,000',
    '$150,000 - $250,000', '$250,000 - $500,000', '$500,000+'
  ],
  'Salaried (Government)': [
    '$5,000 - $15,000', '$15,000 - $30,000', '$30,000 - $60,000',
    '$60,000 - $100,000', '$100,000+'
  ],
  'Salaried (Private)': [
    '$10,000 - $20,000', '$20,000 - $50,000', '$50,000 - $100,000',
    '$100,000 - $200,000', '$200,000+'
  ],
  'Business Owner': [
    '$30,000 - $75,000', '$75,000 - $150,000', '$150,000 - $300,000',
    '$300,000 - $500,000', '$500,000+'
  ],
  'Self-Employed Professional': [
    '$20,000 - $50,000', '$50,000 - $100,000', '$100,000 - $200,000',
    '$200,000 - $400,000', '$400,000+'
  ],
  'Entrepreneur / Startup Founder': [
    '$20,000 - $60,000', '$60,000 - $120,000', '$120,000 - $250,000',
    '$250,000 - $500,000', '$500,000+'
  ],
  'Investor / Trader': [
    '$25,000 - $75,000', '$75,000 - $200,000', '$200,000 - $500,000',
    '$500,000 - $1,000,000', '$1,000,000+'
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

export default function InvestorKycPage() {
  const { user, refreshUser } = useAuth();
  const router = useRouter();
  
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

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
    preferredProjectType: []
  });

  const kycStatus = user?.kycStatus || 'not_started';
  const isKycVerified = user?.isKycVerified || false;

  const handleProjectTypeToggle = (type) => {
    const allTypes = ['Plots / Land', 'Villa', 'Apartments / Flats', 'Commercial Spaces', 'Farm Land / Agri Projects'];
    setInvForm2(prev => {
      const current = prev.preferredProjectType || [];
      if (type === 'Open to All') return { ...prev, preferredProjectType: current.includes('Open to All') ? [] : [...allTypes, 'Open to All'] };
      let newSelection = current.includes(type) ? current.filter(t => t !== type && t !== 'Open to All') : [...current, type];
      if (allTypes.every(t => newSelection.includes(t))) newSelection.push('Open to All');
      return { ...prev, preferredProjectType: newSelection };
    });
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
    if (invForm2.preferredProjectType.length === 0) {
      return toast({ title: "Incomplete Profile", description: "Please select at least one portfolio interest.", variant: "destructive" });
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
        body: JSON.stringify({ kycPassportUrl: uploadRes.url })
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

  const incomeOptions = invForm2.profession && invForm2.profession !== 'Other'
    ? (INCOME_OPTIONS_BY_PROFESSION[invForm2.profession] || DEFAULT_INCOME_OPTIONS)
    : DEFAULT_INCOME_OPTIONS;

  const NATIONALITIES = [
    'Indian', 'American', 'British', 'Australian', 'Canadian', 'UAE / Emirati',
    'Singaporean', 'Malaysian', 'Saudi Arabian', 'Qatari', 'German', 'French', 'Other'
  ];

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-3xl border border-gray-100 p-8 shadow-xl shadow-gray-200/50">
        
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
        {kycStatus === 'pending' && (
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

        {/* ── Status: Not Started or Rejected ── */}
        {(kycStatus === 'not_started' || kycStatus === 'rejected') && (
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

                {/* Pre-filled from Form 1 */}
                <div>
                  <Label className={labelStyle}>Full Name</Label>
                  <input readOnly value={user?.name || user?.fullName || ''} className="w-full h-12 bg-gray-100 border-transparent rounded-xl px-4 font-bold text-gray-500 select-none" />
                </div>
                <div>
                  <Label className={labelStyle}>Location</Label>
                  <input readOnly value={[user?.city, user?.state, user?.country].filter(Boolean).join(', ')} className="w-full h-12 bg-gray-100 border-transparent rounded-xl px-4 font-bold text-gray-500 select-none" />
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
                    <option value="">Select</option>
                    <option value="NRI / Overseas Professional">NRI / Overseas Professional</option>
                    <option value="Salaried (Government)">Salaried (Government)</option>
                    <option value="Salaried (Private)">Salaried (Private)</option>
                    <option value="Business Owner">Business Owner</option>
                    <option value="Self-Employed Professional">Self-Employed Professional (CA, Doctor, etc.)</option>
                    <option value="Entrepreneur / Startup Founder">Entrepreneur / Startup Founder</option>
                    <option value="Investor / Trader">Investor / Trader</option>
                    <option value="Retired">Retired</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* "Other" profession text input */}
                {invForm2.profession === 'Other' && (
                  <div className="animate-in slide-in-from-top-2 duration-300">
                    <Label className={labelStyle}>Please Specify *</Label>
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

                {/* Portfolio Interest */}
                <div className="md:col-span-2">
                  <Label className={labelStyle}>Portfolio Interest *</Label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2 p-5 border border-gray-100 rounded-2xl bg-gray-50/50">
                    {['Plots / Land', 'Villa', 'Apartments / Flats', 'Commercial Spaces', 'Farm Land / Agri Projects', 'Open to All'].map((type) => (
                      <div key={type} className="flex items-center space-x-3">
                        <Checkbox
                          id={`kyc-${type}`}
                          checked={invForm2.preferredProjectType?.includes(type)}
                          onCheckedChange={() => handleProjectTypeToggle(type)}
                          className="data-[state=checked]:bg-orange-600 border-gray-300 w-5 h-5"
                        />
                        <Label htmlFor={`kyc-${type}`} className="text-sm font-semibold text-gray-700 cursor-pointer">{type}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="h-px bg-gray-100 w-full" />

              <div>
                <Label className={labelStyle}>Passport Document *</Label>
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
                disabled={uploading || !file || invForm2.preferredProjectType.length === 0}
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
