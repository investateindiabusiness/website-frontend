"use client";

import React, { useState, useEffect, useCallback } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AppDataGrid from '@/components/AppDataGrid';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Building2, Eye, ShieldCheck, CheckCircle, XCircle, MapPin, RefreshCw, FileText, Download, X, ChevronLeft, ChevronRight, Loader2, AlertTriangle, Phone, Mail, Ruler, Layers, TrendingUp, Calendar, DollarSign, Landmark, Globe, Link2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/AuthContext';
import { fetchAllProjects, approveProject, verifyProjectStatus } from '@/api';
import { Chip, FormControl, InputLabel, Select, MenuItem, Box, Typography } from '@mui/material';

const DetailBlock = ({ label, value, isFullWidth = false, isLink = false }) => {
  if (!value) return null;
  return (
    <div className={`bg-white rounded-xl p-3 border border-gray-100 shadow-sm ${isFullWidth ? 'col-span-full' : ''}`}>
      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">{label}</span>
      {isLink ? (
        <a href={value.startsWith('http') ? value : `https://${value}`} target="_blank" rel="noopener noreferrer" className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1 break-all">
          <Link2 className="w-3.5 h-3.5 flex-shrink-0" /> {value}
        </a>
      ) : (
        <p className="text-xs font-semibold text-gray-800 whitespace-pre-wrap leading-relaxed">{value}</p>
      )}
    </div>
  );
};

export default function AdminProjects() {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [viewProjectData, setViewProjectData] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [actionLoading, setActionLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [total, setTotal] = useState(0);
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const loadProjects = useCallback(async () => {
    if (!user) return;
    try {
      setLoading(true);
      const params = { page: page + 1, limit: rowsPerPage };
      if (filter !== 'all') params.status = filter === 'pending' ? 'pending_any' : filter;
      if (searchQuery) params.search = searchQuery;
      const data = await fetchAllProjects(params);
      setProjects(data.data || []);
      setTotal(data.pagination?.total || 0);
    } catch (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }, [user, page, rowsPerPage, filter, searchQuery]);

  useEffect(() => { if (user) loadProjects(); }, [user, loadProjects]);

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => { setPage(0); setSearchQuery(searchInput); }, 400);
    return () => clearTimeout(t);
  }, [searchInput]);

  const handleApprove = async (projectId) => {
    try {
      setActionLoading(true);
      await approveProject(projectId, []);
      toast({ title: "Approved", description: "Project has been approved and is now live." });
      await loadProjects();
      setViewProjectData(prev => prev ? { ...prev, status: 'approved' } : null);
    } catch (error) {
      toast({ title: "Error", description: error.message || "Failed to approve project.", variant: "destructive" });
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (projectId) => {
    try {
      setActionLoading(true);
      await verifyProjectStatus(projectId, false);
      toast({ title: "Rejected", description: "Project has been rejected." });
      await loadProjects();
      setViewProjectData(prev => prev ? { ...prev, status: 'rejected' } : null);
    } catch (error) {
      toast({ title: "Error", description: error.message || "Failed to reject project.", variant: "destructive" });
    } finally {
      setActionLoading(false);
    }
  };

  const openModal = (project) => {
    setViewProjectData(project);
    setCurrentImageIndex(0);
  };

  const closeModal = () => {
    setViewProjectData(null);
    setCurrentImageIndex(0);
  };

  const images = viewProjectData?.projectImages?.length > 0
    ? viewProjectData.projectImages
    : ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&q=80'];

  const getStatusColor = (status) => {
    if (status === 'approved') return 'bg-green-100 text-green-800';
    if (status === 'rejected') return 'bg-red-100 text-red-800';
    return 'bg-yellow-100 text-yellow-800';
  };

  const PROJECT_STATUS_MAP = {
    pending: { label: 'Pending', color: 'warning' },
    approved: { label: 'Approved', color: 'success' },
    rejected: { label: 'Rejected', color: 'error' },
    changes_requested: { label: 'Changes Req.', color: 'default' },
  };

  const PROJECT_COLUMNS = [
    {
      field: 'projectName', headerName: 'Project', minWidth: 220,
      renderCell: ({ row }) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box sx={{ width: 32, height: 32, bgcolor: '#f0f9ff', borderRadius: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Building2 size={15} color="#0284c7" />
          </Box>
          <Box>
            <Typography variant="caption" sx={{ fontWeight: 700, color: '#111827', display: 'block' }}>{row.projectName || '—'}</Typography>
            <Typography variant="caption" sx={{ color: '#9ca3af', fontSize: '0.65rem' }}>{row.reraRegistrationNumber || '—'}</Typography>
          </Box>
        </Box>
      )
    },
    {
      field: 'builderName', headerName: 'Builder', width: 160,
      renderCell: ({ value }) => <Typography variant="caption" sx={{ color: '#4b5563' }}>{value || '—'}</Typography>
    },
    {
      field: 'projectLocation', headerName: 'Location', width: 140,
      renderCell: ({ value }) => <Typography variant="caption" sx={{ color: '#4b5563' }}>{value || '—'}</Typography>
    },
    {
      field: 'projectType', headerName: 'Type', width: 120,
      renderCell: ({ value }) => <Chip label={value || '—'} size="small" variant="outlined" sx={{ fontWeight: 600, fontSize: '0.67rem' }} />
    },
    {
      field: 'status', headerName: 'Status', width: 130,
      renderCell: ({ row }) => {
        if (row.hasPendingEdits) return <Chip label="Edits Pending" color="warning" size="small" sx={{ fontWeight: 700, fontSize: '0.67rem' }} />;
        const s = PROJECT_STATUS_MAP[row.status] || { label: row.status || '—', color: 'default' };
        return <Chip label={s.label} color={s.color} size="small" sx={{ fontWeight: 700, fontSize: '0.67rem' }} />;
      }
    },
    {
      field: 'actions', headerName: 'Actions', width: 100, align: 'right', stopPropagation: true,
      renderCell: ({ row }) => (
        <Button onClick={() => openModal(row)} className="bg-gray-900 hover:bg-gray-800 text-white rounded-xl text-xs px-3 py-1.5">
          <Eye className="w-3.5 h-3.5 mr-1" /> View
        </Button>
      )
    },
  ];

  return (
    <div className="">
      <div className="flex-1 container mx-auto px-4 py-24 max-w-7xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Manage Projects</h1>
            <p className="text-gray-600">{total.toLocaleString()} project{total !== 1 ? 's' : ''} total</p>
          </div>
        </div>

        <AppDataGrid
          columns={PROJECT_COLUMNS}
          rows={projects}
          total={total}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={(p) => setPage(p)}
          onRowsPerPageChange={(s) => { setRowsPerPage(s); setPage(0); }}
          loading={loading}
          searchValue={searchInput}
          onSearchChange={setSearchInput}
          searchPlaceholder="Search project name, builder, location…"
          filterSlot={
            <FormControl size="small" sx={{ minWidth: 160 }}>
              <InputLabel>Status</InputLabel>
              <Select value={filter} label="Status" onChange={(e) => { setFilter(e.target.value); setPage(0); }}>
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="approved">Approved</MenuItem>
                <MenuItem value="rejected">Rejected</MenuItem>
              </Select>
            </FormControl>
          }
          getRowId={(r) => r.id}
          emptyMessage="No projects found."
        />
      </div>



      {/* ─── Project Details Modal ─── */}
      <Dialog open={!!viewProjectData} onOpenChange={(open) => { if (!open) closeModal(); }}>
        <DialogContent className="max-w-4xl w-full overflow-y-auto p-0 !top-[72px] !translate-y-0" style={{ maxHeight: 'calc(100vh - 80px)' }}>
          <DialogHeader className="sticky top-0 bg-white z-10 px-6 py-4 border-b border-gray-100 flex flex-row items-center justify-between">
            <DialogTitle className="text-xl font-bold text-gray-900 pr-4">
              {viewProjectData?.projectName || 'Project Details'}
            </DialogTitle>
            <button onClick={closeModal} className="text-gray-400 hover:text-gray-700 transition-colors flex-shrink-0">
              <X className="w-5 h-5" />
            </button>
          </DialogHeader>

          {viewProjectData && (
            <div className="p-6 space-y-6">

              {/* Status + Action Buttons */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-gray-600">Status:</span>
                  <Badge className={`capitalize text-sm px-3 py-1 ${getStatusColor(viewProjectData.status)}`}>
                    {viewProjectData.status}
                  </Badge>
                  {viewProjectData.hasPendingEdits && (
                    <Badge className="bg-purple-100 text-purple-800 text-sm px-3 py-1">Pending Edits</Badge>
                  )}
                </div>
                {viewProjectData.status !== 'approved' && (
                  <div className="flex gap-2 w-full sm:w-auto">
                    <Button
                      onClick={() => handleApprove(viewProjectData.id)}
                      disabled={actionLoading}
                      className="flex-1 sm:flex-none bg-green-600 hover:bg-green-700 text-white gap-2"
                    >
                      {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                      Approve
                    </Button>
                    <Button
                      onClick={() => handleReject(viewProjectData.id)}
                      disabled={actionLoading}
                      variant="destructive"
                      className="flex-1 sm:flex-none gap-2"
                    >
                      {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />}
                      Reject
                    </Button>
                  </div>
                )}
                {viewProjectData.status === 'approved' && (
                  <Button
                    onClick={() => handleReject(viewProjectData.id)}
                    disabled={actionLoading}
                    variant="destructive"
                    size="sm"
                    className="gap-2"
                  >
                    <XCircle className="w-4 h-4" /> Revoke Approval
                  </Button>
                )}
              </div>

              {/* Image Gallery */}
              {images.length > 0 && (
                <div className="relative h-64 md:h-80 rounded-2xl overflow-hidden bg-gray-100 group">
                  <img
                    src={images[currentImageIndex]}
                    alt={`Project image ${currentImageIndex + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&q=80'; }}
                  />
                  {images.length > 1 && (
                    <>
                      <button
                        onClick={() => setCurrentImageIndex(i => (i - 1 + images.length) % images.length)}
                        className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-all opacity-0 group-hover:opacity-100"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => setCurrentImageIndex(i => (i + 1) % images.length)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-all opacity-0 group-hover:opacity-100"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                        {images.map((_, idx) => (
                          <button key={idx} onClick={() => setCurrentImageIndex(idx)}
                            className={`w-2 h-2 rounded-full transition-all ${idx === currentImageIndex ? 'bg-white scale-125' : 'bg-white/50'}`}
                          />
                        ))}
                      </div>
                      <div className="absolute top-3 right-3 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
                        {currentImageIndex + 1} / {images.length}
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* Section 1: Basic Information */}
              <div className="bg-gray-50/50 rounded-xl p-4 border border-gray-100 space-y-3">
                <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-blue-600" /> Basic Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  <DetailBlock label="Project Name" value={viewProjectData.projectName} />
                  <DetailBlock label="Builder Name" value={viewProjectData.builderName} />
                  <DetailBlock label="Project Location" value={viewProjectData.projectLocation} />
                  <DetailBlock label="Current Construction Status" value={viewProjectData.currentConstructionStatus} />
                  <DetailBlock label="Expected Completion Date" value={viewProjectData.expectedCompletionDate} />
                  <DetailBlock label="Project Categories" value={Array.isArray(viewProjectData.projectCategories) ? viewProjectData.projectCategories.join(', ') : viewProjectData.projectCategories} />
                  <DetailBlock label="Project Types" value={Array.isArray(viewProjectData.projectType) ? viewProjectData.projectType.join(', ') : viewProjectData.projectType} />
                </div>
              </div>

              {/* Section 2: Land, Inventory & Configuration */}
              <div className="bg-gray-50/50 rounded-xl p-4 border border-gray-100 space-y-3">
                <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-purple-600" /> Land, Inventory & Configuration
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  <DetailBlock label="Total Land Area" value={viewProjectData.totalLandArea} />
                  <DetailBlock label="Total Built-up Area" value={viewProjectData.totalBuiltUpArea} />
                  <DetailBlock label="Total Units" value={viewProjectData.totalUnits} />
                  <DetailBlock label="Unit Sizes / Configurations" value={viewProjectData.area} isFullWidth />
                  <DetailBlock label="Unit Mix" value={viewProjectData.inventory} isFullWidth />
                  <DetailBlock label="Undivided Share (UDS) / Land Share" value={viewProjectData.undividedShare} isFullWidth />
                  <DetailBlock label="Other Unit Information" value={viewProjectData.otherUnitInformation} isFullWidth />
                </div>
              </div>

              {/* Section 3: Approvals & Compliance */}
              <div className="bg-gray-50/50 rounded-xl p-4 border border-gray-100 space-y-3">
                <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-green-600" /> Approvals & Compliance
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <DetailBlock label="Project State" value={viewProjectData.projectState} />
                  <DetailBlock label="Government Construction Approvals" value={Array.isArray(viewProjectData.governmentApprovalsObtained) ? viewProjectData.governmentApprovalsObtained.join(', ') : viewProjectData.governmentApprovalsObtained} />
                  {viewProjectData.governmentApprovalsObtained?.includes("Other") && (
                    <DetailBlock label="Other Government Approvals" value={viewProjectData.otherGovernmentApprovals} isFullWidth />
                  )}
                  <DetailBlock label="RERA Registration Number" value={viewProjectData.reraRegistrationNumber} />
                  <DetailBlock label="Bank Approvals" value={viewProjectData.bankApprovals} />
                  {viewProjectData.bankApprovals === 'Yes' && (
                    <DetailBlock label="Names of Approved Banks" value={viewProjectData.bankApprovalsName} isFullWidth />
                  )}
                  <DetailBlock label="Existing Borrowings" value={viewProjectData.existingBorrowings} />
                  {viewProjectData.existingBorrowings === 'Yes' && (
                    <>
                      <DetailBlock label="Borrowing Amount" value={viewProjectData.existingBorrowingsAmount} />
                      <DetailBlock label="Purpose of Borrowing" value={viewProjectData.existingBorrowingsPurpose} />
                    </>
                  )}
                </div>
              </div>

              {/* Section 4: Project Financials */}
              <div className="bg-gray-50/50 rounded-xl p-4 border border-gray-100 space-y-3">
                <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-emerald-600" /> Project Financials
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <DetailBlock label="Estimated Project Value" value={viewProjectData.projectCost} />
                </div>
              </div>

              {/* Section 5: Investment Opportunity */}
              <div className="bg-gray-50/50 rounded-xl p-4 border border-gray-100 space-y-3">
                <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-teal-600" /> Investment Opportunity
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  <DetailBlock label="Selling Price" value={viewProjectData.sellingPrice} />
                  <DetailBlock label="Pricing Offered" value={viewProjectData.pricingOffered} />
                  <DetailBlock label="Security Offered" value={viewProjectData.securityOffered} />
                  <DetailBlock label="Lock-in Period" value={viewProjectData.lockInPeriod} />
                  <DetailBlock label="Buyback Guarantee" value={viewProjectData.buybackGuarantee} />
                  {viewProjectData.buybackGuarantee === 'Yes' && (
                    <DetailBlock label="Guarantee Details" value={viewProjectData.buybackGuaranteeDetails} />
                  )}
                  <DetailBlock label="Rental Opportunity Available" value={viewProjectData.availableForRent} />
                  {viewProjectData.availableForRent === 'Yes' && (
                    <DetailBlock label="Expected Rent" value={viewProjectData.expectedRent} />
                  )}
                  <DetailBlock label="Exit & Resale Framework" value={viewProjectData.exitResaleFramework} isFullWidth />
                  <DetailBlock label="Marketing Responsibility" value={viewProjectData.marketingResponsibility} isFullWidth />
                  <DetailBlock label="Additional Disclosures" value={viewProjectData.additionalDisclosures} isFullWidth />
                </div>
              </div>

              {/* Section 6: Live Project Monitoring (Optional) */}
              {viewProjectData.liveCctvAvailable === 'Yes' && (
                <div className="bg-gray-50/50 rounded-xl p-4 border border-gray-100 space-y-3">
                  <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                    <Eye className="w-4 h-4 text-amber-600" /> Live Project Monitoring
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <DetailBlock label="Live Camera URL" value={viewProjectData.liveCameraUrl} isFullWidth />
                    <DetailBlock label="Camera Username" value={viewProjectData.cameraUsername} />
                    <DetailBlock label="Camera Password" value={viewProjectData.cameraPassword ? '********' : 'N/A'} />
                    <DetailBlock label="Viewer Instructions" value={viewProjectData.viewerInstructions} isFullWidth />
                  </div>
                </div>
              )}

              {/* Section 7: Additional Project Information */}
              <div className="bg-gray-50/50 rounded-xl p-4 border border-gray-100 space-y-3">
                <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-indigo-600" /> Additional Project Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  <DetailBlock label="Land Ownership Type" value={viewProjectData.landType === 'Other' ? viewProjectData.landTypeOther : viewProjectData.landType} />
                  <DetailBlock label="Google Maps Location" value={viewProjectData.googleMapsLocation} isLink />
                </div>
              </div>

              {/* Builder Info */}
              {(viewProjectData.builderName || viewProjectData.builderEmail || viewProjectData.builderPhone) && (
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                  <h3 className="text-sm font-bold text-blue-900 mb-3 flex items-center gap-2">
                    <Building2 className="w-4 h-4" /> Builder Information
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {viewProjectData.builderName && (
                      <div>
                        <p className="text-xs text-blue-600 font-semibold mb-0.5">Name</p>
                        <p className="text-sm font-medium text-gray-800">{viewProjectData.builderName}</p>
                      </div>
                    )}
                    {viewProjectData.builderEmail && (
                      <div>
                        <p className="text-xs text-blue-600 font-semibold mb-0.5">Email</p>
                        <a href={`mailto:${viewProjectData.builderEmail}`} className="text-sm text-blue-700 hover:underline flex items-center gap-1">
                          <Mail className="w-3 h-3" />{viewProjectData.builderEmail}
                        </a>
                      </div>
                    )}
                    {viewProjectData.builderPhone && (
                      <div>
                        <p className="text-xs text-blue-600 font-semibold mb-0.5">Phone</p>
                        <a href={`tel:${viewProjectData.builderPhone}`} className="text-sm text-blue-700 hover:underline flex items-center gap-1">
                          <Phone className="w-3 h-3" />{viewProjectData.builderPhone}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Project Overview */}
              {viewProjectData.projectOverview && (
                <div className="bg-white border border-gray-100 rounded-xl p-4">
                  <h3 className="text-sm font-bold text-gray-900 mb-2">Project Overview</h3>
                  <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">{viewProjectData.projectOverview}</p>
                </div>
              )}

              {/* Amenities */}
              {viewProjectData.amenities?.length > 0 && (
                <div className="bg-white border border-gray-100 rounded-xl p-4">
                  <h3 className="text-sm font-bold text-gray-900 mb-3">Amenities</h3>
                  <div className="flex flex-wrap gap-2">
                    {viewProjectData.amenities.map((a, i) => (
                      <span key={i} className="text-xs bg-green-50 text-green-700 border border-green-100 px-3 py-1 rounded-full font-medium">
                        <CheckCircle className="w-3 h-3 inline mr-1" />{a}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Product Brochure */}
              {viewProjectData.projectBrochureUrl && (
                <div className="bg-white border border-gray-100 rounded-xl p-4">
                  <h3 className="text-sm font-bold text-gray-900 mb-2 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-orange-500" /> Product Brochure
                  </h3>
                  <div className="flex items-center justify-between bg-orange-50 rounded-lg px-3 py-2 border border-orange-100">
                    <div className="flex items-center gap-2 min-w-0">
                      <FileText className="w-4 h-4 text-orange-400 flex-shrink-0" />
                      <span className="text-sm text-orange-800 truncate font-medium">{viewProjectData.projectBrochureUrl.split('/').pop()}</span>
                    </div>
                    <a href={viewProjectData.projectBrochureUrl} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-1 text-xs bg-orange-600 hover:bg-orange-700 text-white font-bold py-1.5 px-3 rounded-lg transition-colors flex-shrink-0">
                      <Download className="w-3.5 h-3.5" /> Download Brochure
                    </a>
                  </div>
                </div>
              )}

              {/* Project Specifications */}
              {viewProjectData.projectSpecifications && (
                <div className="bg-white border border-gray-100 rounded-xl p-4">
                  <h3 className="text-sm font-bold text-gray-900 mb-2">Project Specifications</h3>
                  <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">{viewProjectData.projectSpecifications}</p>
                </div>
              )}

              {/* Documents */}
              {viewProjectData.projectDocuments?.length > 0 && (
                <div className="bg-white border border-gray-100 rounded-xl p-4">
                  <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <FileText className="w-4 h-4" /> Project Documents
                  </h3>
                  <div className="space-y-2">
                    {viewProjectData.projectDocuments.map((doc, i) => (
                      <div key={i} className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2 border border-gray-100">
                        <div className="flex items-center gap-2 min-w-0">
                          <FileText className="w-4 h-4 text-gray-400 flex-shrink-0" />
                          <span className="text-sm text-gray-700 truncate">{doc.name || `Document ${i + 1}`}</span>
                        </div>
                        {doc.url && (
                          <a href={doc.url} target="_blank" rel="noopener noreferrer"
                            className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 font-medium ml-2 flex-shrink-0">
                            <Download className="w-3.5 h-3.5" /> Download
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Raw ID reference */}
              <div className="text-xs text-gray-400 text-right pt-2 border-t border-gray-100">
                Project ID: <span className="font-mono">{viewProjectData.id}</span>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
