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
  Upload, ShieldAlert, CheckCircle2, 
  Loader2, FileCheck, ArrowRight, ShieldAlert as AlertIcon, ClipboardList
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function BuilderVerificationPage() {
  const { user, refreshUser } = useAuth();
  const router = useRouter();
  
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  // Form 2 State
  const [bldForm2, setBldForm2] = useState({
    majorStakeholderName: '',
    companyOverview: '',
    litigationDisputes: 'No',
    litigationDisputesDescription: '',
    bankingPartner: '',
    totalRevenue: '',
    typeOfFirm: '',
    tradeOrganizationMembership: [],
    revenueInLastYear: '',
    propertyArea: '',
    inventory: '',
    propertyType: '',
    productSpecifications: ''
  });

  // Since builders might not have kycStatus natively in the previous implementation,
  // we will map 'form2_pending' onboardingStatus or use a new kycStatus field.
  const kycStatus = user?.kycStatus || 'not_started';
  const isKycVerified = user?.isVerified || false;

  const handleTradeOrgToggle = (type) => {
    setBldForm2(prev => {
      const current = prev.tradeOrganizationMembership || [];
      if (current.includes(type)) {
        return { ...prev, tradeOrganizationMembership: current.filter(t => t !== type) };
      }
      return { ...prev, tradeOrganizationMembership: [...current, type] };
    });
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.size > 10 * 1024 * 1024) {
        return toast({ 
          title: "File Too Large", 
          description: "Please upload a document under 10MB.", 
          variant: "destructive" 
        });
      }
      setFile(selectedFile);
    }
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      return toast({ 
        title: "No File Selected", 
        description: "Please select your project brochure first.", 
        variant: "destructive" 
      });
    }
    if (bldForm2.typeOfFirm === '') {
      return toast({ title: "Incomplete Profile", description: "Please select your Type of Firm.", variant: "destructive" });
    }
    if (bldForm2.propertyType === '') {
      return toast({ title: "Incomplete Profile", description: "Please select a Property Type.", variant: "destructive" });
    }

    try {
      setUploading(true);

      // 1. Upload brochure to Firebase storage
      const uploadRes = await uploadFile(file, 'project_brochures');
      if (!uploadRes.success || !uploadRes.url) {
        throw new Error(uploadRes.error || "File upload failed");
      }

      // 2. Submit form 2 data and brochure URL to builders backend route
      await apiRequest('/api/builders/submit-verification', {
        method: 'POST',
        body: JSON.stringify({ 
          ...bldForm2, 
          projectBrochureUrl: uploadRes.url 
        })
      });

      toast({ 
        title: "Verification Submitted", 
        description: "Your final details and brochure have been sent for verification." 
      });

      // 3. Refresh user session
      await refreshUser();
      setFile(null);
    } catch (err) {
      toast({ 
        title: "Submission Failed", 
        description: err.message || "Failed to submit verification. Please try again.", 
        variant: "destructive" 
      });
    } finally {
      setUploading(false);
    }
  };

  const labelStyle = "text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block";
  const inputStyle = "w-full h-12 bg-gray-50 border-gray-200 rounded-xl px-4 font-semibold text-gray-900 focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all";
  const selectStyle = "w-full h-12 bg-gray-50 border border-gray-200 rounded-xl px-4 font-semibold text-gray-900 focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all outline-none appearance-none";
  const textareaStyle = "w-full bg-gray-50 border-gray-200 rounded-xl px-4 py-3 font-semibold text-gray-900 focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all min-h-[100px] resize-y";

  return (
    <div className="min-h-screen bg-[#f5f6fa] flex items-center justify-center p-4 md:p-8">
      <div className="max-w-4xl w-full bg-white rounded-[2rem] border border-gray-100 p-8 shadow-xl shadow-gray-200/50">
        
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tight">
            Account Verification
          </h1>
          <p className="text-xs text-gray-400 font-bold tracking-wide uppercase mt-2">
            Step 02 — Professional Profile
          </p>
        </div>

        {/* ── Status: Approved ── */}
        {kycStatus === 'approved' && isKycVerified && (
          <div className="text-center flex flex-col items-center py-6 animate-in fade-in zoom-in-95 duration-300">
            <div className="w-20 h-20 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mb-6 shadow-inner border border-emerald-100">
              <CheckCircle2 className="w-10 h-10 animate-bounce" />
            </div>
            <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight mb-2">
              Identity Verified
            </h3>
            <p className="text-sm text-gray-500 font-semibold leading-relaxed mb-8 px-4 max-w-lg mx-auto">
              Congratulations! Your builder profile is approved. You have full, unrestricted access to the dashboard and can now publish projects.
            </p>
            <Button
              onClick={() => router.push('/builder/dashboard')}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs uppercase tracking-wider px-8 py-4 rounded-xl transition-all shadow-md shadow-emerald-600/10 hover:scale-[1.02] active:scale-[0.98] h-auto"
            >
              Go to Dashboard <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        )}

        {/* ── Status: Pending ── */}
        {kycStatus === 'pending' && (
          <div className="text-center flex flex-col items-center py-6 animate-in fade-in zoom-in-95 duration-300">
            <div className="w-20 h-20 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600 mb-6 shadow-inner border border-amber-100">
              <FileCheck className="w-10 h-10 animate-pulse" />
            </div>
            <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight mb-2">
              Verification In Progress
            </h3>
            <p className="text-sm text-gray-500 font-semibold leading-relaxed mb-6 px-4 max-w-lg mx-auto">
              Your company details and brochure have been submitted and are under review by our administration team. This usually takes less than 24 hours. We will notify you once approved.
            </p>
            <Button
              onClick={() => router.push('/builder/dashboard')}
              variant="outline"
              className="mt-4 font-black text-xs uppercase tracking-wider px-8 py-4 rounded-xl transition-all shadow-sm h-auto"
            >
              Return to Dashboard
            </Button>
          </div>
        )}

        {/* ── Status: Not Started or Rejected ── */}
        {(kycStatus === 'not_started' || kycStatus === 'rejected') && (
          <div className="animate-in fade-in duration-300">
            {kycStatus === 'rejected' && (
              <div className="mb-8 p-4 bg-rose-50 border border-rose-100 text-rose-700 rounded-2xl text-xs font-bold flex items-start gap-3.5 animate-in slide-in-from-top-4">
                <AlertIcon className="w-5 h-5 shrink-0 text-rose-500 mt-0.5" />
                <div>
                  <span className="block font-black uppercase tracking-tight mb-0.5">Verification Application Rejected</span>
                  <span className="font-semibold text-gray-600 leading-normal">
                    Please review and re-submit your details and brochure.
                  </span>
                </div>
              </div>
            )}

            <div className="p-6 bg-orange-50/50 border border-orange-100 rounded-2xl flex gap-5 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-orange-100 flex items-center justify-center flex-shrink-0">
                <ClipboardList className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="font-black text-orange-900 text-sm uppercase tracking-wider">Final Step</p>
                <p className="text-sm text-orange-700 mt-1 font-medium">Please provide these details and your project brochure to complete your professional builder profile.</p>
              </div>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* Major Stakeholder Name */}
                <div>
                  <Label className={labelStyle}>Major Stakeholder Name *</Label>
                  <Input required value={bldForm2.majorStakeholderName} onChange={(e) => setBldForm2({ ...bldForm2, majorStakeholderName: e.target.value })} className={inputStyle} placeholder="Names of main shareholders, founders, etc." />
                </div>

                {/* Type of Firm */}
                <div>
                  <Label className={labelStyle}>Type of Firm *</Label>
                  <select required className={selectStyle} value={bldForm2.typeOfFirm} onChange={(e) => setBldForm2({ ...bldForm2, typeOfFirm: e.target.value })}>
                    <option value="">Select Type</option>
                    <option value="LLC (Limited Liability Company)">LLC (Limited Liability Company)</option>
                    <option value="Pvt (Private Limited Company)">Pvt (Private Limited Company)</option>
                    <option value="Public Limited">Public Limited</option>
                    <option value="LLP">LLP</option>
                    <option value="Partnership">Partnership</option>
                    <option value="Sole Proprietorship">Sole Proprietorship</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* Company Overview */}
                <div className="md:col-span-2">
                  <Label className={labelStyle}>Company Overview *</Label>
                  <Textarea required value={bldForm2.companyOverview} onChange={(e) => setBldForm2({ ...bldForm2, companyOverview: e.target.value })} className={textareaStyle} placeholder="A short description of your company..." />
                </div>

                {/* Litigation / Disputes */}
                <div>
                  <Label className={labelStyle}>Litigation / Disputes *</Label>
                  <select required className={selectStyle} value={bldForm2.litigationDisputes} onChange={(e) => setBldForm2({ ...bldForm2, litigationDisputes: e.target.value })}>
                    <option value="No">No</option>
                    <option value="Yes">Yes</option>
                  </select>
                </div>

                {/* Litigation Description (Conditionally rendered) */}
                {bldForm2.litigationDisputes === 'Yes' && (
                  <div className="md:col-span-2 animate-in slide-in-from-top-2 duration-300">
                    <Label className={labelStyle}>Describe Litigation / Disputes *</Label>
                    <Textarea required value={bldForm2.litigationDisputesDescription} onChange={(e) => setBldForm2({ ...bldForm2, litigationDisputesDescription: e.target.value })} className={textareaStyle} placeholder="Please provide details..." />
                  </div>
                )}

                {/* Banking Partner */}
                <div>
                  <Label className={labelStyle}>Banking Partner *</Label>
                  <Input required value={bldForm2.bankingPartner} onChange={(e) => setBldForm2({ ...bldForm2, bankingPartner: e.target.value })} className={inputStyle} placeholder="Bank(s) the company works with" />
                </div>

                {/* Total Revenue */}
                <div>
                  <Label className={labelStyle}>Total Revenue *</Label>
                  <Input required type="text" value={bldForm2.totalRevenue} onChange={(e) => {
                    const validNumber = e.target.value.replace(/\D/g, '').replace(/^0+/, '');
                    setBldForm2({ ...bldForm2, totalRevenue: validNumber });
                  }} className={inputStyle} placeholder="e.g. 5000000" />
                </div>

                {/* Revenue in Last Year */}
                <div>
                  <Label className={labelStyle}>Revenue in Last Year *</Label>
                  <Input required type="text" value={bldForm2.revenueInLastYear} onChange={(e) => {
                    const validNumber = e.target.value.replace(/\D/g, '').replace(/^0+/, '');
                    setBldForm2({ ...bldForm2, revenueInLastYear: validNumber });
                  }} className={inputStyle} placeholder="e.g. 1000000" />
                </div>

                {/* Trade Organization Membership */}
                <div className="md:col-span-2">
                  <Label className={labelStyle}>Association with Trade Organizations / Membership *</Label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-2 p-5 border border-gray-100 rounded-2xl bg-gray-50/50">
                    {['FAPCCI', 'CII', 'Others'].map((type) => (
                      <div key={type} className="flex items-center space-x-3">
                        <Checkbox 
                          id={`trade-${type}`} 
                          checked={bldForm2.tradeOrganizationMembership?.includes(type)}
                          onCheckedChange={() => handleTradeOrgToggle(type)}
                          className="data-[state=checked]:bg-orange-600 border-gray-300 w-5 h-5"
                        />
                        <Label htmlFor={`trade-${type}`} className="text-sm font-semibold text-gray-700 cursor-pointer">{type}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Property Area & Inventory */}
                <div>
                  <Label className={labelStyle}>Property Area *</Label>
                  <Input required type="text" value={bldForm2.propertyArea} onChange={(e) => {
                    const validNumber = e.target.value.replace(/\D/g, '');
                    setBldForm2({ ...bldForm2, propertyArea: validNumber });
                  }} className={inputStyle} placeholder="Area (Sqft / Acres)" />
                </div>
                <div>
                  <Label className={labelStyle}>Inventory *</Label>
                  <Input required value={bldForm2.inventory} onChange={(e) => setBldForm2({ ...bldForm2, inventory: e.target.value })} className={inputStyle} placeholder="Number of units / text" />
                </div>

                {/* Property Type */}
                <div className="md:col-span-2">
                  <Label className={labelStyle}>Property Form *</Label>
                  <div className="flex gap-6 mt-2 p-5 border border-gray-100 rounded-2xl bg-gray-50/50">
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input 
                        type="radio" 
                        name="propertyType" 
                        value="Own Land"
                        checked={bldForm2.propertyType === 'Own Land'}
                        onChange={(e) => setBldForm2({ ...bldForm2, propertyType: e.target.value })}
                        className="w-5 h-5 text-orange-600 focus:ring-orange-500 border-gray-300"
                      />
                      <span className="text-sm font-semibold text-gray-700">Own Land</span>
                    </label>
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input 
                        type="radio" 
                        name="propertyType" 
                        value="Development Land"
                        checked={bldForm2.propertyType === 'Development Land'}
                        onChange={(e) => setBldForm2({ ...bldForm2, propertyType: e.target.value })}
                        className="w-5 h-5 text-orange-600 focus:ring-orange-500 border-gray-300"
                      />
                      <span className="text-sm font-semibold text-gray-700">Development Land</span>
                    </label>
                  </div>
                </div>

                {/* Product Specifications */}
                <div className="md:col-span-2">
                  <Label className={labelStyle}>Specifications (Size of product, etc.) *</Label>
                  <Textarea required value={bldForm2.productSpecifications} onChange={(e) => setBldForm2({ ...bldForm2, productSpecifications: e.target.value })} className={textareaStyle} placeholder="Product specifications..." />
                </div>

              </div>

              <div className="h-px bg-gray-100 w-full" />

              {/* Upload Project Brochure */}
              <div>
                <Label className={labelStyle}>Upload Project Brochure *</Label>
                <div className="relative group border-2 border-dashed border-gray-200 hover:border-orange-500/50 rounded-2xl p-10 text-center transition-all bg-gray-50/50 hover:bg-orange-50/10 cursor-pointer mt-2">
                  <input 
                    type="file" 
                    accept=".pdf,.doc,.docx" 
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="flex flex-col items-center justify-center">
                    <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-gray-400 group-hover:text-orange-500 group-hover:scale-110 shadow-sm border border-gray-100 transition-all mb-4">
                      <Upload className="w-6 h-6" />
                    </div>
                    <span className="text-sm font-black text-gray-700 uppercase tracking-tight block">
                      {file ? file.name : "Upload Brochure"}
                    </span>
                    <span className="text-xs text-gray-400 font-semibold uppercase tracking-wide block mt-2">
                      {file ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : "PDF or DOC up to 10MB"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={uploading || !file}
                className="w-full h-16 bg-gray-900 hover:bg-black text-white font-black text-lg uppercase tracking-wider rounded-2xl shadow-xl shadow-black/10 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:scale-100 disabled:opacity-50 mt-8"
              >
                {uploading ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin mr-3" />
                    Submitting Verification...
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
