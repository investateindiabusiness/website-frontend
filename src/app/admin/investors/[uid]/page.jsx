"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import {
  Mail, Phone, ShieldCheck, ShieldAlert, CheckCircle, XCircle,
  TrendingUp, Clock, FileWarning, Plus, Eye, Download, ArrowLeft,
  User, Building2, MapPin, FileText, BadgeCheck
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/AuthContext';
import { apiRequest, approveInvestorForm1, requestInvestorChanges, verifyInvestorFinal } from '@/api';
import { Chip } from '@mui/material';

const STANDARD_INVESTOR_KEYS = [
  'uid', 'id', 'email', 'role', 'createdAt', 'updatedAt', 'onboardingStatus', 'isVerified', 'adminRequests', 'password', 'pendingChanges',
  'fullName', 'name', 'contactNumber', 'investorType', 'investmentRangeMin', 'investmentRangeMax', 'address', 'country', 'state', 'city', 'zip', 'termsAccepted',
  'profession', 'professionOther', 'nationality', 'nationalityOther', 'yearlyIncome', 'investmentTenure', 'expectedReturns', 'preferredProjectType', 'investmentPreference',
  'preferredGoalStategy', 'industryNatureOfWork', 'nriStatus', 'kycVisaUrl',
  'preferredCategories', 'preferredTypes', 'preferredStages', 'preferredPurposes', 'preferredLocations', 'preferredBudgets',
  'projectCategories', 'projectTypes', 'projectStages', 'capitalRequirements',
  'passportNumber', 'kycPassportUrl', 'kycStatus', 'isKycVerified', 'kycSubmittedAt', 'isDuplicatePassport', 'duplicatePassportUsers',
  'companyName', 'yearsOfExperience', 'contactNameAndDesignation', 'contactPersonPhone', 'ongoingProjects', 'projectsCompleted',
  'contactName', 'contactPersonRole', 'contactPersonRoleOther', 'companyEmail', 'aboutYourself',
  'yearOfIncorporation', 'promotersOrDirectors', 'totalSqftDelivered', 'majorCompletedProjects', 'typeOfProjectsOffered', 'companyOverview',
  'experienceWithNriInvestors', 'declaredLitigationDisputes', 'financialOfCompany', 'outstandingDebt', 'bankingPartners',
  'isVerified', 'membershipStatus', 'membershipExpiry', 'notifications', 'profileImage', 'referralCode',
  'projectType', 'projectSubType',
];

const FORM1_EDITABLE_FIELDS = [
  { id: 'fullName', label: 'Full Name' },
  { id: 'contactNumber', label: 'Contact Number' },
  { id: 'investorType', label: 'Investor Type' },
  { id: 'investmentRangeMin', label: 'Min Investment Range ($)' },
  { id: 'investmentRangeMax', label: 'Max Investment Range ($)' },
  { id: 'address', label: 'Street Address' },
  { id: 'city', label: 'City' },
  { id: 'state', label: 'State' },
  { id: 'zip', label: 'ZIP Code' },
  { id: 'country', label: 'Country' },
  { id: 'companyName', label: 'Company Name' },
  { id: 'yearsOfExperience', label: 'Years of Experience' },
  { id: 'contactNameAndDesignation', label: 'Contact Person Details' }
];

const FORM2_INVESTOR_FIELDS = [
  { id: 'profession', label: 'Profession' },
  { id: 'nriStatus', label: 'NRI Status' },
  { id: 'investmentTenure', label: 'Investment Tenure' },
  { id: 'yearlyIncome', label: 'Yearly Income Range' },
  { id: 'expectedReturns', label: 'Expected Returns' },
  { id: 'preferredGoalStategy', label: 'Preferred Goal / Strategy' },
  { id: 'preferredProjectType', label: 'Preferred Project Type' },
  { id: 'investmentPreference', label: 'Assistance Preference' },
  { id: 'passportNumber', label: 'Passport Number' },
  { id: 'kycPassportUrl', label: 'Passport Document' },
  { id: 'kycVisaUrl', label: 'Visa Document' },
];

const FORM2_BUILDER_FIELDS = [
  { id: 'yearOfIncorporation', label: 'Year of Incorporation' },
  { id: 'totalSqftDelivered', label: 'Total Sqft Delivered' },
  { id: 'promotersOrDirectors', label: 'Promoters / Directors' },
  { id: 'typeOfProjectsOffered', label: 'Type of Projects Offered' },
  { id: 'experienceWithNriInvestors', label: 'Experience with NRI' },
  { id: 'majorCompletedProjects', label: 'Major Completed Projects' },
  { id: 'companyOverview', label: 'Company Overview' },
  { id: 'outstandingDebt', label: 'Outstanding Debt' },
  { id: 'declaredLitigationDisputes', label: 'Declared Litigation / Disputes' },
  { id: 'financialOfCompany', label: 'Financials of Company (P&L Brief)' },
  { id: 'bankingPartners', label: 'Banking Partners' }
];

const INV_STATUS_MAP = {
  form1_pending: { label: 'Form 1 Review', color: 'warning' },
  form2_pending: { label: 'Final Review', color: 'secondary' },
  form1_changes_requested: { label: 'Form 1 Changes Requested', color: 'default' },
  form2_changes_requested: { label: 'Form 2 Changes Requested', color: 'default' },
  complete: { label: 'Verified', color: 'success' },
  form1_rejected: { label: 'Rejected', color: 'error' },
};

function InfoRow({ label, value }) {
  if (!value && value !== 0) return null;
  return (
    <div>
      <span className="text-gray-400 text-xs font-semibold uppercase tracking-wider block mb-1">{label}</span>
      <span className="font-semibold text-gray-900 text-sm">{value}</span>
    </div>
  );
}

function DocLink({ label, url }) {
  if (!url) return null;
  return (
    <div>
      <span className="text-gray-400 text-xs font-semibold uppercase tracking-wider block mb-1">{label}</span>
      <a
        href={url}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-800 font-bold text-sm underline underline-offset-2"
      >
        <Download className="w-3.5 h-3.5" /> View Document
      </a>
    </div>
  );
}

export default function AdminInvestorDetailPage() {
  const { uid } = useParams();
  const router = useRouter();
  const { user } = useAuth();

  const [investor, setInvestor] = useState(null);
  const [loading, setLoading] = useState(true);

  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [requestedFields, setRequestedFields] = useState([]);
  const [customFieldInput, setCustomFieldInput] = useState('');

  const loadInvestor = useCallback(async () => {
    if (!uid) return;
    try {
      setLoading(true);
      const data = await apiRequest(`/api/investors/${uid}`);
      setInvestor(data.data || data);
    } catch (err) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }, [uid]);

  useEffect(() => { if (user) loadInvestor(); }, [user, loadInvestor]);

  const getActiveFieldsForModal = () => {
    if (!investor) return [];
    if (['form2_pending', 'form2_changes_requested'].includes(investor.onboardingStatus)) {
      return investor.role === 'builder' ? FORM2_BUILDER_FIELDS : FORM2_INVESTOR_FIELDS;
    }
    return FORM1_EDITABLE_FIELDS;
  };

  const handleToggleField = (fieldId) => {
    setRequestedFields(prev => prev.includes(fieldId) ? prev.filter(id => id !== fieldId) : [...prev, fieldId]);
  };

  const handleAddCustomField = () => {
    if (!customFieldInput.trim()) return;
    const formattedId = customFieldInput.trim().toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase());
    if (!requestedFields.includes(formattedId)) setRequestedFields(prev => [...prev, formattedId]);
    setCustomFieldInput('');
  };

  const handleApproveForm1 = async () => {
    try {
      await approveInvestorForm1(investor.uid);
      toast({ title: "Success", description: "Form 1 Approved. Investor can now fill Form 2." });
      loadInvestor();
    } catch (err) { toast({ title: "Error", description: err.message, variant: "destructive" }); }
  };

  const handleFinalVerification = async (isVerified) => {
    try {
      await verifyInvestorFinal(investor.uid, isVerified);
      toast({ title: "Success", description: `Investor has been ${isVerified ? 'Verified' : 'Rejected'}.` });
      loadInvestor();
    } catch (err) { toast({ title: "Error", description: err.message, variant: "destructive" }); }
  };

  const submitChangeRequest = async () => {
    const validFields = requestedFields.filter(f => typeof f === 'string' && f.trim() !== '');
    if (validFields.length === 0) return toast({ title: "Error", description: "Add at least one field to request.", variant: "destructive" });
    try {
      await requestInvestorChanges(investor.uid, validFields);
      toast({ title: "Success", description: "Request sent to investor." });
      setIsRequestModalOpen(false);
      setRequestedFields([]);
      setCustomFieldInput('');
      loadInvestor();
    } catch (err) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin" />
          <p className="text-gray-500 font-semibold text-sm">Loading investor profile…</p>
        </div>
      </div>
    );
  }

  if (!investor) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400 font-semibold mb-4">Investor not found.</p>
          <Button onClick={() => router.back()} variant="outline">Go Back</Button>
        </div>
      </div>
    );
  }

  const status = INV_STATUS_MAP[investor.onboardingStatus] || { label: investor.onboardingStatus || 'Unknown', color: 'default' };
  const extraKeys = Object.keys(investor).filter(key => !STANDARD_INVESTOR_KEYS.includes(key));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Bar */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => router.push('/admin/investors')} className="rounded-xl text-gray-500 hover:text-gray-900">
              <ArrowLeft className="w-4 h-4 mr-1.5" /> Close
            </Button>
            <div className="h-5 w-px bg-gray-200" />
            <div>
              <h1 className="text-lg font-black text-gray-900">{investor.fullName || investor.companyName || investor.name || 'Investor Detail'}</h1>
              <p className="text-xs text-gray-400 font-medium">{investor.email}</p>
            </div>
          </div>
          <Chip label={status.label} color={status.color} size="small" sx={{ fontWeight: 700, fontSize: '0.7rem' }} />
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">

        {/* ── Form 1 ── */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
            <User className="w-4 h-4 text-blue-500" />
            <h2 className="text-base font-black text-gray-900 uppercase tracking-tight">Form 1 — Initial Details</h2>
          </div>
          <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {investor.role === 'investor' ? (
              <>
                <InfoRow label="Full Name" value={investor.fullName} />
                <InfoRow label="Contact Number" value={investor.contactNumber} />
                <InfoRow label="Investor Type" value={investor.investorType} />
                <InfoRow label="Investment Range" value={`$${investor.investmentRangeMin || '0'} – $${investor.investmentRangeMax || '0'}`} />
              </>
            ) : (
              <>
                <InfoRow label="Company Name" value={investor.companyName} />
                <InfoRow label="Contact Person" value={investor.contactNameAndDesignation} />
                <InfoRow label="Phone" value={investor.contactPersonPhone} />
                <InfoRow label="Years of Experience" value={investor.yearsOfExperience} />
              </>
            )}
            <InfoRow label="Email" value={investor.email} />
            <InfoRow label="Role" value={investor.role} />
            <div className="sm:col-span-2 lg:col-span-3">
              <InfoRow label="Address" value={[investor.address, investor.city, investor.state, investor.zip, investor.country].filter(Boolean).join(', ')} />
            </div>
            <InfoRow label="Registered" value={investor.createdAt ? new Date(investor.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' }) : '—'} />
            <InfoRow label="KYC Submitted" value={investor.kycSubmittedAt ? new Date(investor.kycSubmittedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' }) : '—'} />
          </div>
        </div>

        {/* ── Admin Requested Extra Details ── */}
        {extraKeys.length > 0 && (
          <div className="bg-orange-50 rounded-2xl border border-orange-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-orange-100 flex items-center gap-2">
              <FileWarning className="w-4 h-4 text-orange-500" />
              <h2 className="text-base font-black text-orange-900 uppercase tracking-tight">Admin Requested Details</h2>
            </div>
            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {extraKeys.map(key => {
                const val = investor[key];
                let displayVal = '';
                if (val === null || val === undefined) displayVal = '—';
                else if (Array.isArray(val)) displayVal = val.map(item => typeof item === 'object' ? (item?.label || JSON.stringify(item)) : String(item)).join(', ');
                else if (typeof val === 'object') displayVal = val.label || JSON.stringify(val);
                else displayVal = String(val);
                return <InfoRow key={key} label={key.replace(/([A-Z])/g, ' $1').trim()} value={displayVal} />;
              })}
            </div>
          </div>
        )}

        {/* ── Form 2 ── */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
            <BadgeCheck className="w-4 h-4 text-emerald-500" />
            <h2 className="text-base font-black text-gray-900 uppercase tracking-tight">Form 2 — Deep Verification</h2>
          </div>
          <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {investor.role === 'investor' ? (
              <>
                <InfoRow label="Profession" value={investor.profession} />
                <InfoRow label="Nationality" value={investor.nationality} />
                {investor.nationality === 'Indian'
                  ? <InfoRow label="NRI Status" value={investor.nriStatus} />
                  : null}
                <InfoRow label="Investment Tenure" value={investor.investmentTenure} />
                <InfoRow label="Yearly Income" value={investor.yearlyIncome} />
                <InfoRow label="Expected Returns" value={investor.expectedReturns} />
                <InfoRow label="Goal / Strategy" value={investor.preferredGoalStategy} />
                <InfoRow label="Passport Number" value={investor.passportNumber} />
                <DocLink label="Passport Copy" url={investor.kycPassportUrl} />
                {investor.nriStatus === 'NRI' && (
                  <DocLink label="Visa Copy" url={investor.kycVisaUrl} />
                )}

                {/* Preferred Categories */}
                {Array.isArray(investor.preferredCategories) && investor.preferredCategories.length > 0 && (
                  <div className="sm:col-span-2 lg:col-span-3">
                    <span className="text-gray-400 text-xs font-semibold uppercase tracking-wider block mb-2">Investment Categories</span>
                    <div className="flex flex-wrap gap-1.5">
                      {investor.preferredCategories.map((c, i) => <span key={i} className="bg-blue-50 text-blue-700 text-xs font-bold px-2.5 py-1 rounded-full">{c}</span>)}
                    </div>
                  </div>
                )}
                {Array.isArray(investor.preferredTypes) && investor.preferredTypes.length > 0 && (
                  <div className="sm:col-span-2 lg:col-span-3">
                    <span className="text-gray-400 text-xs font-semibold uppercase tracking-wider block mb-2">Investment Types</span>
                    <div className="flex flex-wrap gap-1.5">
                      {investor.preferredTypes.map((t, i) => <span key={i} className="bg-indigo-50 text-indigo-700 text-xs font-bold px-2.5 py-1 rounded-full">{t}</span>)}
                    </div>
                  </div>
                )}
                {Array.isArray(investor.preferredStages) && investor.preferredStages.length > 0 && (
                  <div className="sm:col-span-2 lg:col-span-3">
                    <span className="text-gray-400 text-xs font-semibold uppercase tracking-wider block mb-2">Preferred Stages</span>
                    <div className="flex flex-wrap gap-1.5">
                      {investor.preferredStages.map((s, i) => <span key={i} className="bg-purple-50 text-purple-700 text-xs font-bold px-2.5 py-1 rounded-full">{s}</span>)}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <>
                <InfoRow label="Year of Incorporation" value={investor.yearOfIncorporation} />
                <InfoRow label="Total Sqft Delivered" value={investor.totalSqftDelivered} />
                <InfoRow label="Promoters / Directors" value={investor.promotersOrDirectors} />
                <InfoRow label="Outstanding Debt" value={investor.outstandingDebt} />
                <InfoRow label="Declared Litigation" value={investor.declaredLitigationDisputes} />
                <InfoRow label="Banking Partners" value={investor.bankingPartners} />
                {Array.isArray(investor.projectCategories) && investor.projectCategories.length > 0 && (
                  <div className="sm:col-span-2 lg:col-span-3">
                    <span className="text-gray-400 text-xs font-semibold uppercase tracking-wider block mb-2">Project Categories</span>
                    <div className="flex flex-wrap gap-1.5">
                      {investor.projectCategories.map((c, i) => <span key={i} className="bg-blue-50 text-blue-700 text-xs font-bold px-2.5 py-1 rounded-full">{c}</span>)}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* ── Pending Changes ── */}
        {investor.pendingChanges && Object.keys(investor.pendingChanges).length > 0 && (
          <div className="bg-blue-50 rounded-2xl border border-blue-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-blue-100 flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-500" />
              <h2 className="text-base font-black text-blue-900 uppercase tracking-tight">Review Submitted Changes</h2>
            </div>
            <div className="p-6 space-y-3">
              {Object.entries(investor.pendingChanges).map(([key, newValue]) => {
                const oldValue = investor[key];
                const isUnchanged = String(oldValue || '').trim() === String(newValue || '').trim();
                return (
                  <div key={key} className={`p-4 rounded-xl border flex flex-col md:flex-row gap-4 justify-between ${isUnchanged ? 'bg-gray-50 border-gray-200 opacity-70' : 'bg-white border-blue-100 shadow-sm'}`}>
                    <div className="flex-1">
                      <span className="text-gray-400 text-xs uppercase font-bold block mb-1">Field</span>
                      <span className="font-semibold text-gray-900 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                    </div>
                    <div className="flex-1 md:border-l md:pl-4 border-gray-100">
                      <span className="text-red-400 text-xs uppercase font-bold block mb-1">Old Value</span>
                      <span className={`text-gray-600 text-sm ${!isUnchanged && oldValue ? 'line-through' : ''}`}>
                        {oldValue ? (Array.isArray(oldValue) ? oldValue.join(', ') : oldValue) : <span className="italic text-gray-300">Empty</span>}
                      </span>
                    </div>
                    <div className="flex-1 md:border-l md:pl-4 border-gray-100">
                      <span className={`${isUnchanged ? 'text-gray-400' : 'text-emerald-600'} text-xs uppercase font-bold block mb-1`}>New Value</span>
                      <span className={`font-semibold text-sm ${isUnchanged ? 'text-gray-600' : 'text-emerald-800'}`}>
                        {newValue ? (Array.isArray(newValue) ? newValue.join(', ') : newValue) : <span className="italic text-gray-300">Empty</span>}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Action Buttons ── */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 flex flex-wrap gap-3 sticky bottom-4">
          {investor.onboardingStatus === 'form1_pending' && (
            <>
              <Button onClick={handleApproveForm1} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">Approve Form 1</Button>
              <Button onClick={() => setIsRequestModalOpen(true)} variant="outline" className="flex-1 border-orange-200 text-orange-600 hover:bg-orange-50">Request Changes in Form 1</Button>
            </>
          )}
          {investor.onboardingStatus === 'form2_pending' && (
            <>
              <Button onClick={() => handleFinalVerification(true)} className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"><CheckCircle className="w-4 h-4 mr-2" /> Approve & Verify</Button>
              <Button onClick={() => setIsRequestModalOpen(true)} variant="outline" className="flex-1 border-orange-200 text-orange-600 hover:bg-orange-50">Request Changes in Form 2</Button>
              <Button onClick={() => handleFinalVerification(false)} variant="outline" className="flex-1 border-red-200 text-red-600 hover:bg-red-50"><XCircle className="w-4 h-4 mr-2" /> Reject</Button>
            </>
          )}
          {investor.onboardingStatus === 'complete' && investor.isVerified === true && (
            <Button onClick={() => handleFinalVerification(false)} variant="outline" className="w-full border-red-200 text-red-600 hover:bg-red-50"><ShieldAlert className="w-4 h-4 mr-2" /> Revoke Verification</Button>
          )}
          {investor.onboardingStatus?.includes('changes_requested') && (
            <div className="w-full text-center text-sm font-semibold text-orange-600 bg-orange-50 py-3 rounded-xl border border-orange-100">
              ⏳ Waiting for investor to submit the requested changes.
            </div>
          )}
        </div>
      </div>

      {/* REQUEST CHANGES MODAL */}
      <Dialog open={isRequestModalOpen} onOpenChange={(open) => {
        setIsRequestModalOpen(open);
        if (!open) { setRequestedFields([]); setCustomFieldInput(''); }
      }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Request Information Updates</DialogTitle>
            <DialogDescription>Select fields or add custom info to request from the investor.</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-2 max-h-[35vh] overflow-y-auto p-1">
              {getActiveFieldsForModal().map((field) => (
                <label key={field.id} className={`flex items-start p-3 rounded-xl border cursor-pointer transition-all ${requestedFields.includes(field.id) ? 'border-orange-500 bg-orange-50/50' : 'border-gray-200 hover:border-orange-200 hover:bg-gray-50'}`}>
                  <div className="flex items-center h-5">
                    <input type="checkbox" className="w-4 h-4 text-orange-600 bg-gray-100 border-gray-300 rounded focus:ring-orange-500" checked={requestedFields.includes(field.id)} onChange={() => handleToggleField(field.id)} />
                  </div>
                  <div className="ml-3 text-sm">
                    <span className={`font-medium ${requestedFields.includes(field.id) ? 'text-orange-900' : 'text-gray-900'}`}>{field.label}</span>
                  </div>
                </label>
              ))}
              {requestedFields.filter(id => !getActiveFieldsForModal().some(f => f.id === id)).map(customId => (
                <label key={customId} className="flex items-start p-3 rounded-xl border border-orange-500 bg-orange-50/50 cursor-pointer">
                  <div className="flex items-center h-5">
                    <input type="checkbox" className="w-4 h-4 text-orange-600 bg-gray-100 border-gray-300 rounded focus:ring-orange-500" checked onChange={() => handleToggleField(customId)} />
                  </div>
                  <div className="ml-3 text-sm"><span className="font-medium text-orange-900 capitalize">{customId.replace(/([A-Z])/g, ' $1').trim()}</span></div>
                </label>
              ))}
            </div>

            <div className="mb-5 mt-4 pt-4 border-t border-gray-100">
              <Label className="text-sm font-semibold text-gray-700 mb-2 block">Need additional information?</Label>
              <div className="flex gap-2">
                <Input placeholder="e.g. PAN Card, Bank Statement..." value={customFieldInput} onChange={(e) => setCustomFieldInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddCustomField(); } }} className="h-10 text-sm" />
                <Button type="button" onClick={handleAddCustomField} variant="outline" className="h-10 shrink-0 text-orange-600 border-orange-200 hover:bg-orange-50"><Plus className="w-4 h-4 mr-1" /> Add</Button>
              </div>
            </div>
            <Button onClick={submitChangeRequest} disabled={requestedFields.length === 0} className="w-full bg-orange-600 hover:bg-orange-700 text-white">
              Send Request for {requestedFields.length} {requestedFields.length === 1 ? 'Field' : 'Fields'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
