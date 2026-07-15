"use client";

import React, { useState, useEffect, useCallback } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AppDataGrid from '@/components/AppDataGrid';
import { Card, CardContent } from '@/components/ui/card';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, Phone, ShieldCheck, ShieldAlert, CheckCircle, XCircle, TrendingUp, Clock, FileWarning, Plus, Eye, Download } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/AuthContext';
import { fetchAllInvestors, approveInvestorForm1, requestInvestorChanges, verifyInvestorFinal } from '@/api';
import { Chip, FormControl, InputLabel, Select, MenuItem, Box, Typography } from '@mui/material';

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
  { id: 'investmentPreference', label: 'Assistance Preference' }
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

export default function AdminInvestors() {
  const { user } = useAuth();
  const [investors, setInvestors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('final_review');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [total, setTotal] = useState(0);
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [selectedInvestorId, setSelectedInvestorId] = useState(null);
  const [viewInvestorData, setViewInvestorData] = useState(null);
  const [requestedFields, setRequestedFields] = useState([]);
  const [customFieldInput, setCustomFieldInput] = useState('');

  const handleToggleField = (fieldId) => {
    setRequestedFields(prev => prev.includes(fieldId) ? prev.filter(id => id !== fieldId) : [...prev, fieldId]);
  };

  const handleAddCustomField = () => {
    if (!customFieldInput.trim()) return;
    const formattedId = customFieldInput.trim().toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase());
    if (!requestedFields.includes(formattedId)) setRequestedFields(prev => [...prev, formattedId]);
    setCustomFieldInput('');
  };

  const loadInvestors = useCallback(async () => {
    if (!user) return;
    try {
      setLoading(true);
      const params = { page: page + 1, limit: rowsPerPage };
      if (filter !== 'all') params.status = filter;
      if (searchQuery) params.search = searchQuery;
      const data = await fetchAllInvestors(params);
      setInvestors(data.data || []);
      setTotal(data.pagination?.total || 0);
    } catch (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }, [user, page, rowsPerPage, filter, searchQuery]);


  const getActiveFieldsForModal = () => {
    if (!viewInvestorData) return [];
    if (['form2_pending', 'form2_changes_requested'].includes(viewInvestorData.onboardingStatus)) {
      return viewInvestorData.role === 'builder' ? FORM2_BUILDER_FIELDS : FORM2_INVESTOR_FIELDS;
    }
    return FORM1_EDITABLE_FIELDS;
  };

  useEffect(() => { if (user) loadInvestors(); }, [user, loadInvestors]);

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => { setPage(0); setSearchQuery(searchInput); }, 400);
    return () => clearTimeout(t);
  }, [searchInput]);

  // Aliases for the table rendering — server-side filtering means filteredInvestors === investors
  const ITEMS_PER_PAGE = rowsPerPage;
  const filteredInvestors = investors;
  const currentPage = page + 1; // API uses 0-based; display uses 1-based
  const setCurrentPage = (newPage) => {
    if (typeof newPage === 'function') {
      setPage(prev => newPage(prev + 1) - 1);
    } else {
      setPage(newPage - 1);
    }
  };

  const handleApproveForm1 = async (investorId) => {
    try {
      await approveInvestorForm1(investorId);
      toast({ title: "Success", description: "Form 1 Approved. Investor can now fill Form 2." });
      loadInvestors();
      setViewInvestorData(null);
    } catch (err) { toast({ title: "Error", description: err.message, variant: "destructive" }); }
  };

  const handleFinalVerification = async (investorId, isVerified) => {
    try {
      await verifyInvestorFinal(investorId, isVerified);
      toast({ title: "Success", description: `Investor has been ${isVerified ? 'Verified' : 'Rejected'}.` });
      loadInvestors();
      setViewInvestorData(null);
    } catch (err) { toast({ title: "Error", description: err.message, variant: "destructive" }); }
  };

  const submitChangeRequest = async () => {
    const validFields = requestedFields.filter(f => typeof f === 'string' && f.trim() !== '');
    if (validFields.length === 0) return toast({ title: "Error", description: "Add at least one field to request.", variant: "destructive" });

    try {
      await requestInvestorChanges(selectedInvestorId, validFields);
      toast({ title: "Success", description: "Request sent to investor." });
      setIsRequestModalOpen(false);
      setRequestedFields([]);
      setCustomFieldInput('');
      loadInvestors();
    } catch (err) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  const downloadCSV = () => {
    if (!investors || investors.length === 0) {
      toast({ title: "Export Failed", description: "No investors available to export.", variant: "destructive" });
      return;
    }

    const EXCLUDED_FIELDS = ['uid', 'id', 'password', 'createdAt', 'updatedAt', 'adminRequests', 'pendingChanges', 'role', 'profileImage', 'onboardingStatus'];

    const allKeys = new Set();
    investors.forEach(investor => Object.keys(investor).forEach(key => allKeys.add(key)));

    const headers = Array.from(allKeys).filter(key => !EXCLUDED_FIELDS.includes(key));

    const csvRows = [];
    const formattedHeaders = headers.map(key => key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()));
    csvRows.push(formattedHeaders.join(','));

    investors.forEach(investor => {
      const row = headers.map(header => {
        let val = investor[header];
        if (val === null || val === undefined) val = '';
        else if (typeof val === 'object') val = JSON.stringify(val);
        let strVal = String(val);
        if (strVal.includes(',') || strVal.includes('"') || strVal.includes('\n')) {
          strVal = `"${strVal.replace(/"/g, '""')}"`;
        }
        return strVal;
      });
      csvRows.push(row.join(','));
    });

    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `all_investors_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast({ title: "Success", description: "Investors exported successfully!" });
  };

  const INV_STATUS_MAP = {
    form1_pending: { label: 'Form 1 Review', color: 'warning' },
    form2_pending: { label: 'Final Review', color: 'secondary' },
    form1_changes_requested: { label: 'Form 1 Changes', color: 'default' },
    form2_changes_requested: { label: 'Form 2 Changes', color: 'default' },
    complete: { label: 'Verified', color: 'success' },
    form1_rejected: { label: 'Rejected', color: 'error' },
  };

  const INVESTOR_COLUMNS = [
    {
      field: 'fullName', headerName: 'Investor', minWidth: 200,
      renderCell: ({ row }) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box sx={{ width: 32, height: 32, bgcolor: '#eff6ff', borderRadius: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <TrendingUp size={15} color="#3b82f6" />
          </Box>
          <Box>
            <Typography variant="caption" sx={{ fontWeight: 700, color: '#111827', display: 'block' }}>
              {row.fullName || row.companyName || row.name || 'Unnamed'}
            </Typography>
            <Typography variant="caption" sx={{ color: '#9ca3af', fontSize: '0.65rem' }}>{row.role === 'builder' ? (row.companyName || 'Builder') : (row.investorType || 'Individual Investor')}</Typography>
          </Box>
        </Box>
      )
    },
    {
      field: 'email', headerName: 'Email', minWidth: 190,
      renderCell: ({ value }) => <Typography variant="caption" noWrap sx={{ color: '#4b5563', maxWidth: 190, display: 'block' }}>{value || '—'}</Typography>
    },
    {
      field: 'createdAt', headerName: 'Registered', width: 140,
      renderCell: ({ value }) => <Typography variant="caption" sx={{ color: '#6b7280' }}>{value ? new Date(value).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}</Typography>
    },
    {
      field: 'onboardingStatus', headerName: 'Status', width: 160,
      renderCell: ({ value }) => {
        const s = INV_STATUS_MAP[value] || { label: value || 'Unknown', color: 'default' };
        return <Chip label={s.label} color={s.color} size="small" sx={{ fontWeight: 700, fontSize: '0.67rem' }} />;
      }
    },
    {
      field: 'actions', headerName: 'Actions', width: 110, align: 'right', stopPropagation: true,
      renderCell: ({ row }) => (
        <Button onClick={() => setViewInvestorData(row)} className="bg-gray-900 hover:bg-gray-800 text-white rounded-xl text-xs px-3 py-1.5">
          <Eye className="w-3.5 h-3.5 mr-1" /> View
        </Button>
      )
    },
  ];

  return (
    <div className="">
      <div className="flex-1 container mx-auto px-4 py-6 sm:py-8 max-w-7xl">
        <div className="flex flex-col md:flex-row md:items-start justify-between mb-6 gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">Manage Investors</h1>
            <p className="text-gray-600 text-sm">{total.toLocaleString()} investor{total !== 1 ? 's' : ''} registered</p>
          </div>
        </div>


        <AppDataGrid
          columns={INVESTOR_COLUMNS}
          rows={investors}
          total={total}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={(p) => setPage(p)}
          onRowsPerPageChange={(s) => { setRowsPerPage(s); setPage(0); }}
          loading={loading}
          searchValue={searchInput}
          onSearchChange={setSearchInput}
          searchPlaceholder="Search name, email, city…"
          filterSlot={
            <FormControl size="small" sx={{ minWidth: 180 }}>
              <InputLabel>Status</InputLabel>
              <Select value={filter} label="Status" onChange={(e) => { setFilter(e.target.value); setPage(0); }}>
                <MenuItem value="pending">Form 1 Review</MenuItem>
                <MenuItem value="final_review">Final Review</MenuItem>
                <MenuItem value="all">All Users</MenuItem>
                <MenuItem value="changes_requested">Awaiting Changes</MenuItem>
                <MenuItem value="verified">Verified</MenuItem>
                <MenuItem value="complete">Complete</MenuItem>
              </Select>
            </FormControl>
          }
          getRowId={(r) => r.uid || r.id}
          emptyMessage="No investors found."
        />
      </div>

      {/* DETAILED VIEW MODAL */}
      <Dialog open={!!viewInvestorData} onOpenChange={(open) => !open && setViewInvestorData(null)}>
        <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto p-0">
          <DialogHeader className="p-6 pb-0 sticky top-0 bg-white z-10 border-b border-gray-100">
            <DialogTitle className="text-2xl font-bold text-gray-900">{viewInvestorData?.fullName || viewInvestorData?.companyName || 'Details'}</DialogTitle>
            <DialogDescription>Review the complete submission history for this user.</DialogDescription>
          </DialogHeader>

          {viewInvestorData && (
            <div className="p-6 space-y-8 bg-gray-50">
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h4 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">Form 1: Initial Details</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8 text-sm">
                  {viewInvestorData.role === 'investor' ? (
                    <>
                      <div><span className="text-gray-500 block mb-1">Full Name</span><span className="font-medium">{viewInvestorData.fullName || '-'}</span></div>
                      <div><span className="text-gray-500 block mb-1">Contact Number</span><span className="font-medium">{viewInvestorData.contactNumber || '-'}</span></div>
                      <div><span className="text-gray-500 block mb-1">Investor Type</span><span className="font-medium">{viewInvestorData.investorType || '-'}</span></div>
                      <div><span className="text-gray-500 block mb-1">Intended Range</span><span className="font-medium text-green-700">${viewInvestorData.investmentRangeMin || '0'} - ${viewInvestorData.investmentRangeMax || '0'}</span></div>
                    </>
                  ) : (
                    <>
                      <div><span className="text-gray-500 block mb-1">Company Name</span><span className="font-medium">{viewInvestorData.companyName || '-'}</span></div>
                      <div><span className="text-gray-500 block mb-1">Contact Details</span><span className="font-medium">{viewInvestorData.contactNameAndDesignation} | {viewInvestorData.contactPersonPhone}</span></div>
                    </>
                  )}
                  <div><span className="text-gray-500 block mb-1">Address</span><span className="font-medium">{viewInvestorData.address}, {viewInvestorData.city}, {viewInvestorData.state}, {viewInvestorData.zip}, {viewInvestorData.country}</span></div>
                </div>
              </div>

              {/* Admin Requested Details Section */}
              {Object.keys(viewInvestorData).filter(key => !STANDARD_INVESTOR_KEYS.includes(key)).length > 0 && (
                <div className="bg-orange-50 p-6 rounded-xl border border-orange-100 shadow-sm">
                  <h4 className="text-lg font-semibold text-orange-900 mb-4 border-b border-orange-200 pb-2">Admin Requested Details</h4>
                  <div className="grid grid-cols-1 gap-y-4 text-sm">
                    {Object.keys(viewInvestorData).filter(key => !STANDARD_INVESTOR_KEYS.includes(key)).map(key => {
                      const val = viewInvestorData[key];
                      let displayVal = '';
                      if (val === null || val === undefined) {
                        displayVal = '—';
                      } else if (Array.isArray(val)) {
                        displayVal = val.map(item => typeof item === 'object' ? (item?.label || JSON.stringify(item)) : String(item)).join(', ');
                      } else if (typeof val === 'object') {
                        displayVal = val.label || JSON.stringify(val);
                      } else {
                        displayVal = String(val);
                      }
                      return (
                        <div key={key}>
                          <span className="text-orange-700/70 block mb-1 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                          <span className="font-medium text-orange-950">{displayVal}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Form 2 Section */}
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h4 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">Form 2: Deep Verification</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8 text-sm">
                  {viewInvestorData.role === 'investor' ? (
                    <>
                      <div><span className="text-gray-500 block mb-1">Profession</span><span className="font-medium">{viewInvestorData.profession || '-'}</span></div>
                      {viewInvestorData.nationality === 'Indian' ? (
                        <div><span className="text-gray-500 block mb-1">NRI Status</span><span className="font-medium">{viewInvestorData.nriStatus || '-'}</span></div>
                      ) : (
                        <div><span className="text-gray-500 block mb-1">Nationality</span><span className="font-medium">{viewInvestorData.nationality || '-'}</span></div>
                      )}
                      <div><span className="text-gray-500 block mb-1">Investment Tenure</span><span className="font-medium">{viewInvestorData.investmentTenure || '-'}</span></div>
                      <div><span className="text-gray-500 block mb-1">Yearly Income Range</span><span className="font-medium">{viewInvestorData.yearlyIncome || '-'}</span></div>
                      <div><span className="text-gray-500 block mb-1">Expected Returns</span><span className="font-medium">{viewInvestorData.expectedReturns || '-'}</span></div>
                      <div><span className="text-gray-500 block mb-1">Preferred Goal / Strategy</span><span className="font-medium">{viewInvestorData.preferredGoalStategy || '-'}</span></div>
                      <div><span className="text-gray-500 block mb-1">Passport Number</span><span className="font-mono font-medium">{viewInvestorData.passportNumber || '-'}</span></div>
                      <div>
                        <span className="text-gray-500 block mb-1">Passport Copy</span>
                        {viewInvestorData.kycPassportUrl ? (
                          <a
                            href={viewInvestorData.kycPassportUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center text-blue-600 hover:text-blue-800 font-bold gap-1 mt-1 underline"
                          >
                            <Download className="w-4 h-4" /> View Passport Document
                          </a>
                        ) : (
                          <span className="text-gray-400 font-medium">Not Uploaded</span>
                        )}
                      </div>
                      {viewInvestorData.nriStatus === 'NRI' && (
                        <div>
                          <span className="text-gray-500 block mb-1">Visa Copy</span>
                          {viewInvestorData.kycVisaUrl ? (
                            <a
                              href={viewInvestorData.kycVisaUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center text-blue-600 hover:text-blue-800 font-bold gap-1 mt-1 underline"
                            >
                              <Download className="w-4 h-4" /> View Visa Document
                            </a>
                          ) : (
                            <span className="text-gray-400 font-medium">Not Uploaded</span>
                          )}
                        </div>
                      )}
                      {/* Preferred Categories */}
                      {Array.isArray(viewInvestorData.preferredCategories) && viewInvestorData.preferredCategories.length > 0 && (
                        <div className="md:col-span-2">
                          <span className="text-gray-500 block mb-1">Investment Categories</span>
                          <div className="flex flex-wrap gap-1">{viewInvestorData.preferredCategories.map((c, i) => <span key={i} className="inline-block bg-blue-50 text-blue-700 text-xs font-bold px-2 py-0.5 rounded-full">{c}</span>)}</div>
                        </div>
                      )}
                      {Array.isArray(viewInvestorData.preferredTypes) && viewInvestorData.preferredTypes.length > 0 && (
                        <div className="md:col-span-2">
                          <span className="text-gray-500 block mb-1">Investment Types</span>
                          <div className="flex flex-wrap gap-1">{viewInvestorData.preferredTypes.map((t, i) => <span key={i} className="inline-block bg-indigo-50 text-indigo-700 text-xs font-bold px-2 py-0.5 rounded-full">{t}</span>)}</div>
                        </div>
                      )}
                    </>
                  ) : (
                    <>
                      <div><span className="text-gray-500 block mb-1">Year of Incorporation</span><span className="font-medium">{viewInvestorData.yearOfIncorporation || '-'}</span></div>
                      <div><span className="text-gray-500 block mb-1">Total Sqft Delivered</span><span className="font-medium">{viewInvestorData.totalSqftDelivered || '-'}</span></div>
                      <div className="md:col-span-2"><span className="text-gray-500 block mb-1">Promoters / Directors</span><span className="font-medium">{viewInvestorData.promotersOrDirectors || '-'}</span></div>
                      {Array.isArray(viewInvestorData.projectCategories) && viewInvestorData.projectCategories.length > 0 && (
                        <div className="md:col-span-2">
                          <span className="text-gray-500 block mb-1">Project Categories</span>
                          <div className="flex flex-wrap gap-1">{viewInvestorData.projectCategories.map((c, i) => <span key={i} className="inline-block bg-blue-50 text-blue-700 text-xs font-bold px-2 py-0.5 rounded-full">{c}</span>)}</div>
                        </div>
                      )}
                      {Array.isArray(viewInvestorData.projectTypes) && viewInvestorData.projectTypes.length > 0 && (
                        <div className="md:col-span-2">
                          <span className="text-gray-500 block mb-1">Project Types</span>
                          <div className="flex flex-wrap gap-1">{viewInvestorData.projectTypes.map((t, i) => <span key={i} className="inline-block bg-indigo-50 text-indigo-700 text-xs font-bold px-2 py-0.5 rounded-full">{t}</span>)}</div>
                        </div>
                      )}
                      {Array.isArray(viewInvestorData.capitalRequirements) && viewInvestorData.capitalRequirements.length > 0 && (
                        <div className="md:col-span-2">
                          <span className="text-gray-500 block mb-1">Capital Requirements</span>
                          <div className="flex flex-wrap gap-1">{viewInvestorData.capitalRequirements.map((r, i) => <span key={i} className="inline-block bg-purple-50 text-purple-700 text-xs font-bold px-2 py-0.5 rounded-full">{r}</span>)}</div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>

              {/* Pending Changes Section */}
              {viewInvestorData.pendingChanges && Object.keys(viewInvestorData.pendingChanges).length > 0 && (
                <div className="bg-blue-50 p-6 rounded-xl border border-blue-200 shadow-sm mb-6">
                  <h4 className="text-lg font-semibold text-blue-900 mb-4 border-b border-blue-200 pb-2">Review Submitted Changes</h4>
                  <div className="grid grid-cols-1 gap-y-4 text-sm">
                    {Object.entries(viewInvestorData.pendingChanges).map(([key, newValue]) => {
                      const oldValue = viewInvestorData[key];
                      const isUnchanged = String(oldValue || '').trim() === String(newValue || '').trim();
                      return (
                        <div key={key} className={`p-3 rounded-lg border flex flex-col md:flex-row gap-4 justify-between transition-all ${isUnchanged ? 'bg-gray-50 border-gray-200 opacity-80' : 'bg-white border-blue-100 shadow-sm'}`}>
                          <div className="flex-1 w-full md:w-1/3">
                            <span className="text-gray-500 block text-xs uppercase font-semibold mb-1">Field</span>
                            <span className="font-medium text-gray-900 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                          </div>
                          <div className="flex-1 w-full md:w-1/3 md:border-l md:pl-4 border-gray-100 mt-2 md:mt-0">
                            <span className="text-red-500 block text-xs uppercase font-semibold mb-1">Old Value</span>
                            <span className={`text-gray-600 ${!isUnchanged && oldValue ? 'line-through' : ''}`}>
                              {oldValue ? (Array.isArray(oldValue) ? oldValue.join(', ') : oldValue) : <span className="italic text-gray-400">Empty</span>}
                            </span>
                          </div>
                          <div className="flex-1 w-full md:w-1/3 md:border-l md:pl-4 border-gray-100 mt-2 md:mt-0">
                            <span className={`${isUnchanged ? 'text-gray-500' : 'text-green-600'} block text-xs uppercase font-semibold mb-1`}>New Value</span>
                            <span className={`font-medium ${isUnchanged ? 'text-gray-600' : 'text-green-800'}`}>
                              {newValue ? (Array.isArray(newValue) ? newValue.join(', ') : newValue) : <span className="italic text-gray-400">Empty</span>}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* DYNAMIC ACTION BUTTONS */}
              <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-wrap gap-3 sticky bottom-4">
                {viewInvestorData.onboardingStatus === 'form1_pending' && (
                  <>
                    <Button onClick={() => handleApproveForm1(viewInvestorData.uid)} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">Approve Form 1</Button>
                    <Button onClick={() => { setSelectedInvestorId(viewInvestorData.uid); setIsRequestModalOpen(true); }} variant="outline" className="flex-1 border-orange-200 text-orange-600 hover:bg-orange-50">Request Changes in Form 1</Button>
                  </>
                )}
                {viewInvestorData.onboardingStatus === 'form2_pending' && (
                  <>
                    <Button onClick={() => handleFinalVerification(viewInvestorData.uid, true)} className="flex-1 bg-green-600 hover:bg-green-700 text-white"><CheckCircle className="w-4 h-4 mr-2" /> Approve Form 2</Button>
                    <Button onClick={() => { setSelectedInvestorId(viewInvestorData.uid); setIsRequestModalOpen(true); }} variant="outline" className="flex-1 border-orange-200 text-orange-600 hover:bg-orange-50">Request Changes in Form 2</Button>
                    <Button onClick={() => handleFinalVerification(viewInvestorData.uid, false)} variant="outline" className="flex-1 border-red-200 text-red-600 hover:bg-red-50"><XCircle className="w-4 h-4 mr-2" /> Reject</Button>
                  </>
                )}
                {viewInvestorData.onboardingStatus === 'complete' && viewInvestorData.isVerified === true && (
                  <Button onClick={() => handleFinalVerification(viewInvestorData.uid, false)} variant="outline" className="w-full border-red-200 text-red-600 hover:bg-red-50"><ShieldAlert className="w-4 h-4 mr-2" /> Revoke Verification</Button>
                )}
                {viewInvestorData.onboardingStatus?.includes('changes_requested') && (
                  <div className="w-full text-center text-sm font-medium text-orange-600 bg-orange-50 py-3 rounded-md">Waiting for user to submit requested changes.</div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* REQUEST CHANGES MODAL */}
      <Dialog open={isRequestModalOpen} onOpenChange={(open) => {
        setIsRequestModalOpen(open);
        if (!open) { setRequestedFields([]); setCustomFieldInput(''); }
      }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Request Information Updates</DialogTitle>
            <DialogDescription>Select specific fields or request new information for the user to correct.</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-2 max-h-[30vh] overflow-y-auto p-1">
              {getActiveFieldsForModal().map((field) => (
                <label key={field.id} className={`flex items-start p-3 rounded-lg border cursor-pointer transition-all ${requestedFields.includes(field.id) ? 'border-orange-500 bg-orange-50/50' : 'border-gray-200 hover:border-orange-200 hover:bg-gray-50'}`}>
                  <div className="flex items-center h-5">
                    <input type="checkbox" className="w-4 h-4 text-orange-600 bg-gray-100 border-gray-300 rounded focus:ring-orange-500" checked={requestedFields.includes(field.id)} onChange={() => handleToggleField(field.id)} />
                  </div>
                  <div className="ml-3 text-sm">
                    <span className={`font-medium ${requestedFields.includes(field.id) ? 'text-orange-900' : 'text-gray-900'}`}>{field.label}</span>
                  </div>
                </label>
              ))}
              {requestedFields.filter(id => !getActiveFieldsForModal().some(f => f.id === id)).map(customId => (
                <label key={customId} className="flex items-start p-3 rounded-lg border border-orange-500 bg-orange-50/50 cursor-pointer transition-all">
                  <div className="flex items-center h-5">
                    <input type="checkbox" className="w-4 h-4 text-orange-600 bg-gray-100 border-gray-300 rounded focus:ring-orange-500" checked onChange={() => handleToggleField(customId)} />
                  </div>
                  <div className="ml-3 text-sm"><span className="font-medium text-orange-900 capitalize">{customId.replace(/([A-Z])/g, ' $1').trim()}</span></div>
                </label>
              ))}
            </div>

            <div className="mb-6 mt-4 pt-4 border-t border-gray-100">
              <Label className="text-sm font-semibold text-gray-700 mb-2 block">Need additional information?</Label>
              <div className="flex gap-2">
                <Input placeholder="e.g. PAN Card, Bank Statement..." value={customFieldInput} onChange={(e) => setCustomFieldInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddCustomField(); } }} className="h-10 text-sm focus:ring-orange-500/20" />
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
