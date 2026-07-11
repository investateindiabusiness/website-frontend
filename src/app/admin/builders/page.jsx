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
import { Mail, Phone, ShieldCheck, ShieldAlert, CheckCircle, XCircle, Building2, Clock, FileWarning, Plus, Eye, Download } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/AuthContext';
import { fetchAllBuilders, apiRequest } from '@/api';
import { Chip, FormControl, InputLabel, Select, MenuItem, Box, Typography } from '@mui/material';

// Standard keys so we can separate them from dynamically requested fields
const STANDARD_BUILDER_KEYS = [
  'id', 'uid', 'email', 'role', 'createdAt', 'updatedAt', 'onboardingStatus', 'isVerified', 'adminRequests', 'password',
  'companyName', 'yearsOfExperience', 'contactName', 'contactPersonRole', 'contactPersonRoleOther', 'contactPersonPhone', 'companyEmail', 'aboutYourself',
  'address', 'country', 'state', 'city', 'zip', 'termsAccepted',
  'yearOfIncorporation', 'deliveryVolumeType', 'deliverySqft', 'deliverySqyd', 'namesOfProjects', 'typeOfFirm', 'typeOfFirmOther', 'totalPartners', 'managingPartnerName', 'majorStakeholderName',
  'tradeOrganizationMembership', 'tradeOrganizationOther', 'companyOverview', 'declaredLitigationDisputes', 'bankingPartners', 'totalRevenue', 'revenueInLastYear', 'experienceWithNriInvestors',
  'majorCompletedProjects', 'outstandingDebt', 'financialOfCompany', 'projectCategories', 'projectTypes', 'projectStages', 'capitalRequirements', 'ongoingProjects', 'projectsCompleted'
];

const FORM1_BUILDER_FIELDS = [
  { id: 'companyName', label: 'Company Name' },
  { id: 'yearsOfExperience', label: 'Track Record (Years)' },
  { id: 'contactName', label: 'Liaison Name' },
  { id: 'contactPersonRole', label: 'Liaison Role' },
  { id: 'contactPersonPhone', label: 'Liaison Phone' },
  { id: 'companyEmail', label: 'Company Email' },
  { id: 'aboutYourself', label: 'About Company' },
  { id: 'address', label: 'Street Address' },
  { id: 'city', label: 'City' },
  { id: 'state', label: 'State' },
  { id: 'zip', label: 'ZIP Code' },
  { id: 'country', label: 'Country' }
];

const FORM2_BUILDER_FIELDS = [
  { id: 'yearOfIncorporation', label: 'Year of Incorporation' },
  { id: 'namesOfProjects', label: 'Best Projects' },
  { id: 'deliveryVolumeType', label: 'Delivery Volume Type' },
  { id: 'deliverySqft', label: 'Delivery Sqft' },
  { id: 'deliverySqyd', label: 'Delivery Sqyd' },
  { id: 'typeOfFirm', label: 'Type of Firm' },
  { id: 'totalPartners', label: 'Total Partners' },
  { id: 'managingPartnerName', label: 'Managing Partner Name' },
  { id: 'majorStakeholderName', label: 'Major Stakeholder Name' },
  { id: 'tradeOrganizationMembership', label: 'Trade Organization Membership' },
  { id: 'companyOverview', label: 'Company Overview' },
  { id: 'declaredLitigationDisputes', label: 'Litigation / Disputes' },
  { id: 'bankingPartners', label: 'Banking Partner' },
  { id: 'totalRevenue', label: 'Total Revenue' },
  { id: 'revenueInLastYear', label: 'Revenue in Last Year' },
  { id: 'experienceWithNriInvestors', label: 'NRI Client Exposure' },
  { id: 'majorCompletedProjects', label: 'Key Portfolio Highlights' },
  { id: 'outstandingDebt', label: 'Outstanding Debt' },
  { id: 'financialOfCompany', label: 'Financial Brief (P&L)' },
  { id: 'projectCategories', label: 'Project Categories' },
  { id: 'projectTypes', label: 'Project Types' },
  { id: 'projectStages', label: 'Project Stages' },
  { id: 'capitalRequirements', label: 'Capital Requirements' },
  { id: 'ongoingProjects', label: 'Active Projects' },
  { id: 'projectsCompleted', label: 'Total Deliveries' }
];

export default function AdminBuilders() {
  const { user } = useAuth();
  const [builders, setBuilders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('final_review');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [total, setTotal] = useState(0);
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [selectedBuilderId, setSelectedBuilderId] = useState(null);
  const [requestedFields, setRequestedFields] = useState([]);
  const [customFieldInput, setCustomFieldInput] = useState('');
  const [viewBuilderData, setViewBuilderData] = useState(null);

  const handleToggleField = (fieldId) => {
    setRequestedFields(prev => prev.includes(fieldId) ? prev.filter(id => id !== fieldId) : [...prev, fieldId]);
  };

  const handleAddCustomField = () => {
    if (!customFieldInput.trim()) return;
    const formattedId = customFieldInput.trim().toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase());
    if (!requestedFields.includes(formattedId)) setRequestedFields(prev => [...prev, formattedId]);
    setCustomFieldInput('');
  };

  const getActiveFieldsForModal = () => {
    if (!viewBuilderData) return [];
    if (['form2_pending', 'form2_changes_requested'].includes(viewBuilderData.onboardingStatus)) return FORM2_BUILDER_FIELDS;
    return FORM1_BUILDER_FIELDS;
  };

  const loadBuilders = useCallback(async () => {
    if (!user) return;
    try {
      setLoading(true);
      const params = { page: page + 1, limit: rowsPerPage };
      if (filter !== 'all') params.status = filter;
      if (searchQuery) params.search = searchQuery;
      const data = await fetchAllBuilders(params);
      setBuilders(data.data || []);
      setTotal(data.pagination?.total || 0);

    } catch (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }, [user, page, rowsPerPage, filter, searchQuery]);

  useEffect(() => { if (user) loadBuilders(); }, [user, loadBuilders]);

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => { setPage(0); setSearchQuery(searchInput); }, 400);
    return () => clearTimeout(t);
  }, [searchInput]);

  const handleApproveForm1 = async (builderId) => {
    try {
      await apiRequest(`/api/builders/approve-form1/${builderId}`, { method: 'POST' });
      toast({ title: "Success", description: "Form 1 Approved. Builder can now fill Form 2." });
      loadBuilders();
      setViewBuilderData(null);
    } catch (err) { toast({ title: "Error", description: err.message, variant: "destructive" }); }
  };

  const handleFinalVerification = async (builderId, isVerified) => {
    try {
      await apiRequest(`/api/builders/verify-final/${builderId}`, { method: 'POST', body: JSON.stringify({ isVerified }) });
      toast({ title: "Success", description: `Builder has been ${isVerified ? 'Verified' : 'Rejected'}.` });
      loadBuilders();
      setViewBuilderData(null);
    } catch (err) { toast({ title: "Error", description: err.message, variant: "destructive" }); }
  };

  const submitChangeRequest = async () => {
    const validFields = requestedFields.filter(f => typeof f === 'string' && f.trim() !== '');
    if (validFields.length === 0) return toast({ title: "Error", description: "Add at least one field to request.", variant: "destructive" });

    try {
      await apiRequest(`/api/builders/request-changes/${selectedBuilderId}`, { method: 'POST', body: JSON.stringify({ fieldsRequested: validFields }) });
      toast({ title: "Success", description: "Request sent to builder." });
      setIsRequestModalOpen(false);
      setRequestedFields([]);
      setCustomFieldInput('');
      loadBuilders();
    } catch (err) { toast({ title: "Error", description: err.message, variant: "destructive" }); }
  };

  const downloadCSV = () => {
    if (!builders || builders.length === 0) {
      toast({ title: "Export Failed", description: "No builders available to export.", variant: "destructive" });
      return;
    }

    const EXCLUDED_FIELDS = ['uid', 'id', 'password', 'createdAt', 'updatedAt', 'adminRequests', 'profileImage', 'role', 'onboardingStatus'];

    const allKeys = new Set();
    builders.forEach(builder => Object.keys(builder).forEach(key => allKeys.add(key)));

    const headers = Array.from(allKeys).filter(key => !EXCLUDED_FIELDS.includes(key));

    const csvRows = [];
    const formattedHeaders = headers.map(key => key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()));
    csvRows.push(formattedHeaders.join(','));

    builders.forEach(builder => {
      const row = headers.map(header => {
        let val = builder[header];
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
    link.setAttribute('download', `all_builders_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast({ title: "Success", description: "Builders exported successfully!" });
  };

  const safeRender = (val) => {
    if (val === null || val === undefined || val === '') return '-';
    if (typeof val === 'object') return JSON.stringify(val);
    return String(val);
  };

  const STATUS_CHIP_MAP = {
    form1_pending: { label: 'Form 1 Review', color: 'warning' },
    form2_pending: { label: 'Final Review', color: 'secondary' },
    form1_changes_requested: { label: 'Changes Req.', color: 'default' },
    complete: { label: 'Verified', color: 'success' },
    form1_approved: { label: 'Form 1 Approved', color: 'info' },
    form1_rejected: { label: 'Rejected', color: 'error' },
  };

  const BUILDER_COLUMNS = [
    {
      field: 'companyName', headerName: 'Company', minWidth: 200,
      renderCell: ({ row }) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box sx={{ width: 32, height: 32, bgcolor: '#fff7ed', borderRadius: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Building2 size={16} color="#f97316" />
          </Box>
          <Box>
            <Typography variant="caption" sx={{ fontWeight: 700, color: '#111827', display: 'block' }}>{row.companyName || row.name || 'Unnamed'}</Typography>
            <Typography variant="caption" sx={{ color: '#9ca3af', fontSize: '0.65rem' }}>{row.email || '—'}</Typography>
          </Box>
        </Box>
      )
    },
    {
      field: 'city', headerName: 'Location', width: 160,
      renderCell: ({ row }) => <Typography variant="caption" sx={{ color: '#4b5563' }}>{row.city ? `${row.city}, ${row.state}` : '—'}</Typography>
    },
    {
      field: 'contactPersonPhone', headerName: 'Phone', width: 140,
      renderCell: ({ value }) => <Typography variant="caption" sx={{ color: '#4b5563' }}>{value || '—'}</Typography>
    },
    {
      field: 'onboardingStatus', headerName: 'Status', width: 160,
      renderCell: ({ value }) => {
        const s = STATUS_CHIP_MAP[value] || { label: value || 'Unknown', color: 'default' };
        return <Chip label={s.label} color={s.color} size="small" sx={{ fontWeight: 700, fontSize: '0.67rem' }} />;
      }
    },
    {
      field: 'actions', headerName: 'Actions', width: 120, align: 'right', stopPropagation: true,
      renderCell: ({ row }) => (
        <Button onClick={() => setViewBuilderData(row)} className="bg-gray-900 hover:bg-gray-800 text-white rounded-xl text-xs px-3 py-1.5">
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
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">Manage Builders</h1>
            <p className="text-gray-600 text-sm">{total.toLocaleString()} builder{total !== 1 ? 's' : ''} registered</p>
          </div>
        </div>


        <AppDataGrid
          columns={BUILDER_COLUMNS}
          rows={builders}
          total={total}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={(p) => setPage(p)}
          onRowsPerPageChange={(s) => { setRowsPerPage(s); setPage(0); }}
          loading={loading}
          searchValue={searchInput}
          onSearchChange={setSearchInput}
          searchPlaceholder="Search company, email, city…"
          filterSlot={
            <FormControl size="small" sx={{ minWidth: 180 }}>
              <InputLabel>Status</InputLabel>
              <Select value={filter} label="Status" onChange={(e) => { setFilter(e.target.value); setPage(0); }}>
                <MenuItem value="all">All Builders</MenuItem>
                <MenuItem value="final_review">Final Review</MenuItem>
                <MenuItem value="pending">Needs Review</MenuItem>
                <MenuItem value="changes_requested">Awaiting Changes</MenuItem>
                <MenuItem value="verified">Verified</MenuItem>
              </Select>
            </FormControl>
          }
          getRowId={(r) => r.uid || r.id}
          emptyMessage="No builders found."
        />
      </div>

      {/* DETAILED VIEW MODAL */}
      <Dialog open={!!viewBuilderData} onOpenChange={(open) => !open && setViewBuilderData(null)}>
        <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto p-0">
          <DialogHeader className="p-6 pb-0 sticky top-0 bg-white z-10 border-b border-gray-100">
            <DialogTitle className="text-2xl font-bold text-gray-900">{viewBuilderData?.companyName || 'Builder Details'}</DialogTitle>
            <DialogDescription>Review the complete submission history for this partner.</DialogDescription>
          </DialogHeader>

          {viewBuilderData && (
            <div className="p-6 space-y-8 bg-gray-50">

              {/* Form 1 Section */}
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h4 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">Form 1: Initial Details</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8 text-sm">
                  <div><span className="text-gray-500 block mb-1">Company Name</span><span className="font-medium">{viewBuilderData.companyName || '-'}</span></div>
                  <div><span className="text-gray-500 block mb-1">Email</span><span className="font-medium">{viewBuilderData.email || viewBuilderData.companyEmail || '-'}</span></div>
                  <div><span className="text-gray-500 block mb-1">Track Record</span><span className="font-medium">{viewBuilderData.yearsOfExperience ? `${viewBuilderData.yearsOfExperience} Years` : '-'}</span></div>
                  <div>
                    <span className="text-gray-500 block mb-1">Liaison Officer</span>
                    <span className="font-medium">
                      {viewBuilderData.contactName || '-'} 
                      {viewBuilderData.contactPersonRole ? ` (${viewBuilderData.contactPersonRole === 'Other' ? viewBuilderData.contactPersonRoleOther : viewBuilderData.contactPersonRole})` : ''}
                    </span>
                  </div>
                  <div><span className="text-gray-500 block mb-1">Liaison Phone</span><span className="font-medium">{viewBuilderData.contactPersonPhone || '-'}</span></div>
                  <div className="md:col-span-2"><span className="text-gray-500 block mb-1">About Company</span><span className="font-medium whitespace-pre-wrap">{viewBuilderData.aboutYourself || '-'}</span></div>
                  <div className="md:col-span-2">
                    <span className="text-gray-500 block mb-1">Address</span>
                    <span className="font-medium">
                      {safeRender(viewBuilderData.address)}, {safeRender(viewBuilderData.city)}, {safeRender(viewBuilderData.state)}, {safeRender(viewBuilderData.zip)}, {safeRender(viewBuilderData.country)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Form 2 Section */}
              {(viewBuilderData.onboardingStatus === 'form2_pending' || viewBuilderData.onboardingStatus === 'complete' || viewBuilderData.onboardingStatus === 'form2_changes_requested') && (
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">Form 2: Deep Verification</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8 text-sm">
                    <div><span className="text-gray-500 block mb-1">Year of Incorporation</span><span className="font-medium">{viewBuilderData.yearOfIncorporation || '-'}</span></div>
                    <div>
                      <span className="text-gray-500 block mb-1">Total Delivery Volume</span>
                      <span className="font-medium">
                        {viewBuilderData.deliveryVolumeType === 'sqft' && `${viewBuilderData.deliverySqft || '-'} Sqft`}
                        {viewBuilderData.deliveryVolumeType === 'sqyd' && `${viewBuilderData.deliverySqyd || '-'} Sqyd`}
                        {viewBuilderData.deliveryVolumeType === 'both' && `${viewBuilderData.deliverySqft || '-'} Sqft & ${viewBuilderData.deliverySqyd || '-'} Sqyd`}
                        {!viewBuilderData.deliveryVolumeType && '-'}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500 block mb-1">Firm Structure</span>
                      <span className="font-medium">
                        {viewBuilderData.typeOfFirm || '-'}
                        {viewBuilderData.typeOfFirm === 'Other' && ` (${viewBuilderData.typeOfFirmOther || ''})`}
                      </span>
                    </div>
                    <div><span className="text-gray-500 block mb-1">Partners Count</span><span className="font-medium">{viewBuilderData.totalPartners || '-'}</span></div>
                    <div><span className="text-gray-500 block mb-1">Managing Partner</span><span className="font-medium">{viewBuilderData.managingPartnerName || '-'}</span></div>
                    <div><span className="text-gray-500 block mb-1">Major Stakeholder</span><span className="font-medium">{viewBuilderData.majorStakeholderName || '-'}</span></div>
                    <div>
                      <span className="text-gray-500 block mb-1">Trade Organization Memberships</span>
                      <span className="font-medium">
                        {viewBuilderData.tradeOrganizationMembership ? (
                          Array.isArray(viewBuilderData.tradeOrganizationMembership) 
                            ? viewBuilderData.tradeOrganizationMembership.map(m => m === 'Others' ? (viewBuilderData.tradeOrganizationOther || 'Others') : m).join(', ')
                            : viewBuilderData.tradeOrganizationMembership
                        ) : '-'}
                      </span>
                    </div>
                    <div><span className="text-gray-500 block mb-1">NRI Client Exposure</span><span className="font-medium">{viewBuilderData.experienceWithNriInvestors || '-'}</span></div>
                    <div><span className="text-gray-500 block mb-1">Outstanding Debt / Leverage</span><span className="font-medium">{viewBuilderData.outstandingDebt || '-'}</span></div>
                    <div><span className="text-gray-500 block mb-1">Banking Partner</span><span className="font-medium">{viewBuilderData.bankingPartners || '-'}</span></div>
                    <div><span className="text-gray-500 block mb-1">Total Revenue</span><span className="font-medium">{viewBuilderData.totalRevenue || '-'}</span></div>
                    <div><span className="text-gray-500 block mb-1">Revenue in Last Year</span><span className="font-medium">{viewBuilderData.revenueInLastYear || '-'}</span></div>

                    <div className="md:col-span-2"><span className="text-gray-500 block mb-1">Best Projects</span><span className="font-medium whitespace-pre-wrap">{viewBuilderData.namesOfProjects || '-'}</span></div>
                    <div className="md:col-span-2"><span className="text-gray-500 block mb-1">Company Overview</span><span className="font-medium whitespace-pre-wrap">{viewBuilderData.companyOverview || '-'}</span></div>
                    <div className="md:col-span-2"><span className="text-gray-500 block mb-1">Litigation / Disputes</span><span className="font-medium whitespace-pre-wrap">{viewBuilderData.declaredLitigationDisputes || 'None declared'}</span></div>
                    <div className="md:col-span-2"><span className="text-gray-500 block mb-1">Financial Brief (P&L Highlights)</span><span className="font-medium whitespace-pre-wrap">{viewBuilderData.financialOfCompany || '-'}</span></div>
                    <div className="md:col-span-2"><span className="text-gray-500 block mb-1">Key Portfolio Highlights</span><span className="font-medium whitespace-pre-wrap">{viewBuilderData.majorCompletedProjects || '-'}</span></div>

                    <div>
                      <span className="text-gray-500 block mb-1">Project Categories</span>
                      <span className="font-medium">
                        {viewBuilderData.projectCategories ? (Array.isArray(viewBuilderData.projectCategories) ? viewBuilderData.projectCategories.join(', ') : viewBuilderData.projectCategories) : '-'}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500 block mb-1">Project Types</span>
                      <span className="font-medium">
                        {viewBuilderData.projectTypes ? (Array.isArray(viewBuilderData.projectTypes) ? viewBuilderData.projectTypes.join(', ') : viewBuilderData.projectTypes) : '-'}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500 block mb-1">Project Stages</span>
                      <span className="font-medium">
                        {viewBuilderData.projectStages ? (Array.isArray(viewBuilderData.projectStages) ? viewBuilderData.projectStages.join(', ') : viewBuilderData.projectStages) : '-'}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500 block mb-1">Capital / Business Requirements</span>
                      <span className="font-medium">
                        {viewBuilderData.capitalRequirements ? (Array.isArray(viewBuilderData.capitalRequirements) ? viewBuilderData.capitalRequirements.join(', ') : viewBuilderData.capitalRequirements) : '-'}
                      </span>
                    </div>
                    <div><span className="text-gray-500 block mb-1">Active Projects</span><span className="font-medium">{viewBuilderData.ongoingProjects || '-'}</span></div>
                    <div><span className="text-gray-500 block mb-1">Total Deliveries</span><span className="font-medium">{viewBuilderData.projectsCompleted || '-'}</span></div>
                  </div>
                </div>
              )}

              {/* Pending Changes Section */}
              {viewBuilderData.pendingChanges && Object.keys(viewBuilderData.pendingChanges).length > 0 && (
                <div className="bg-blue-50 p-6 rounded-xl border border-blue-200 shadow-sm mb-6">
                  <h4 className="text-lg font-semibold text-blue-900 mb-4 border-b border-blue-200 pb-2">Review Submitted Changes</h4>
                  <div className="grid grid-cols-1 gap-y-4 text-sm">
                    {Object.entries(viewBuilderData.pendingChanges).map(([key, newValue]) => {
                      const oldValue = viewBuilderData[key];
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

              {/* Action Buttons Inside Modal */}
              <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-wrap gap-3 sticky bottom-4">
                {viewBuilderData.onboardingStatus === 'form1_pending' && (
                  <>
                    <Button onClick={() => handleApproveForm1(viewBuilderData.uid)} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">Approve Form 1</Button>
                    <Button onClick={() => { setSelectedBuilderId(viewBuilderData.uid); setIsRequestModalOpen(true); }} variant="outline" className="flex-1 border-orange-200 text-orange-600 hover:bg-orange-50">Request Changes</Button>
                  </>
                )}
                {viewBuilderData.onboardingStatus === 'form2_pending' && (
                  <>
                    <Button onClick={() => handleFinalVerification(viewBuilderData.uid, true)} className="flex-1 bg-green-600 hover:bg-green-700 text-white"><CheckCircle className="w-4 h-4 mr-2" /> Verify Account</Button>
                    <Button onClick={() => { setSelectedBuilderId(viewBuilderData.uid); setIsRequestModalOpen(true); }} variant="outline" className="flex-1 border-orange-200 text-orange-600 hover:bg-orange-50">Request Changes</Button>
                    <Button onClick={() => handleFinalVerification(viewBuilderData.uid, false)} variant="outline" className="flex-1 border-red-200 text-red-600 hover:bg-red-50"><XCircle className="w-4 h-4 mr-2" /> Reject</Button>
                  </>
                )}
                {viewBuilderData.onboardingStatus === 'complete' && viewBuilderData.isVerified === true && (
                  <Button onClick={() => handleFinalVerification(viewBuilderData.uid, false)} variant="outline" className="w-full border-red-200 text-red-600 hover:bg-red-50"><ShieldAlert className="w-4 h-4 mr-2" /> Revoke Verification</Button>
                )}
                {viewBuilderData.onboardingStatus?.includes('changes_requested') && (
                  <div className="w-full text-center text-sm font-medium text-orange-600 bg-orange-50 py-3 rounded-md">Waiting for builder to submit requested changes.</div>
                )}
                {viewBuilderData.onboardingStatus === 'form1_approved' && (
                  <div className="w-full text-center text-sm font-medium text-blue-600 bg-blue-50 py-3 rounded-md">Form 1 approved. Waiting for builder to fill Form 2.</div>
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
            <DialogDescription>Select specific fields or request new information for the builder to correct.</DialogDescription>
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
                <Input placeholder="e.g. GST Certificate, RERA Details..." value={customFieldInput} onChange={(e) => setCustomFieldInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddCustomField(); } }} className="h-10 text-sm focus:ring-orange-500/20" />
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
