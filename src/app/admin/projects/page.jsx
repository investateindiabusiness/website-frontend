"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Building2, Eye, ShieldCheck, CheckCircle, XCircle, MapPin, RefreshCw, FileText, Download, X, ChevronLeft, ChevronRight, Loader2, AlertTriangle, Phone, Mail, Ruler, Layers, TrendingUp, Calendar } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/AuthContext';
import { fetchAllProjects, approveProject, verifyProjectStatus } from '@/api';

export default function AdminProjects() {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [viewProjectData, setViewProjectData] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [actionLoading, setActionLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    setCurrentPage(1);
  }, [filter]);

  const loadProjects = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchAllProjects(user?.token);
      setProjects(data || []);
    } catch (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }, [user?.token]);

  useEffect(() => {
    if (user?.token) loadProjects();
  }, [user, loadProjects]);

  const filteredProjects = projects.filter(project => {
    if (filter === 'pending') return project.status === 'pending' || project.hasPendingEdits;
    if (filter === 'approved') return project.status === 'approved' && !project.hasPendingEdits;
    return true;
  });

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

  return (
    <div className="">
      <div className="flex-1 container mx-auto px-4 py-24 max-w-7xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Manage Projects</h1>
            <p className="text-gray-600">Approve or reject project listings.</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={loadProjects} disabled={loading} className="gap-2">
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <div className="flex bg-gray-200/50 p-1 rounded-lg">
              {['all', 'pending', 'approved'].map(f => (
                <button key={f} onClick={() => setFilter(f)} className={`px-4 py-2 text-sm font-semibold rounded-md transition-all ${filter === f ? 'bg-white shadow-sm text-blue-600' : 'text-gray-600'}`}>
                  {f.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="flex flex-col items-center justify-center text-gray-500 py-24">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mb-4"></div>
              Loading projects...
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="text-center p-12 text-gray-500">
              No projects found in this category.
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50/75 border-b border-gray-200 text-gray-600 text-xs font-bold uppercase tracking-wider">
                      <th className="px-6 py-4">Project</th>
                      <th className="px-6 py-4">Builder</th>
                      <th className="px-6 py-4">Location</th>
                      <th className="px-6 py-4">Type / Units</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredProjects.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE).map((project) => {
                      return (
                        <tr key={project.id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center space-x-3">
                              <div className="w-16 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-200">
                                <img
                                  src={project.projectImages?.[0] || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80'}
                                  alt={project.projectName}
                                  className="w-full h-full object-cover"
                                  onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80'; }}
                                />
                              </div>
                              <div>
                                <div className="text-sm font-bold text-gray-900">
                                  {project.projectName || 'Unnamed Project'}
                                </div>
                                <div className="text-xs text-gray-400">
                                  ID: {project.id}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-blue-700">
                            {project.builderName || '—'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            <div className="flex items-center gap-1.5">
                              <MapPin className="w-3.5 h-3.5 text-orange-500" />
                              {project.projectLocation || 'N/A'}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900 font-medium">
                              {project.projectType || 'N/A'}
                            </div>
                            <div className="text-xs text-gray-400">
                              {project.totalUnits ? `${project.totalUnits} Units` : 'N/A'}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Badge className={`capitalize border-none py-1 px-3 text-xs font-semibold ${getStatusColor(project.status)}`}>
                              {project.status}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <Button 
                              onClick={() => openModal(project)} 
                              className="bg-gray-900 hover:bg-gray-800 text-white rounded-xl text-xs px-4 py-2"
                            >
                              <Eye className="w-3.5 h-3.5 mr-1.5" /> View Details
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Pagination Controls */}
              {Math.ceil(filteredProjects.length / ITEMS_PER_PAGE) > 1 && (
                <div className="bg-gray-50 border-t border-gray-200 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, filteredProjects.length)} of {filteredProjects.length} records
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Button
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      variant="outline"
                      className="h-9 px-3 rounded-lg text-xs font-bold hover:bg-slate-100 bg-white"
                    >
                      Previous
                    </Button>
                    
                    {Array.from({ length: Math.ceil(filteredProjects.length / ITEMS_PER_PAGE) }, (_, i) => i + 1).map((page) => (
                      <Button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        variant={currentPage === page ? 'default' : 'outline'}
                        className={`h-9 w-9 p-0 rounded-lg text-xs font-bold ${
                          currentPage === page ? 'bg-slate-900 text-white hover:bg-slate-800' : 'hover:bg-slate-100 bg-white'
                        }`}
                      >
                        {page}
                      </Button>
                    ))}

                    <Button
                      onClick={() => setCurrentPage(prev => Math.min(Math.ceil(filteredProjects.length / ITEMS_PER_PAGE), prev + 1))}
                      disabled={currentPage === Math.ceil(filteredProjects.length / ITEMS_PER_PAGE)}
                      variant="outline"
                      className="h-9 px-3 rounded-lg text-xs font-bold hover:bg-slate-100 bg-white"
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
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

              {/* Core Details Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'Project Type', value: viewProjectData.projectType, icon: <Building2 className="w-4 h-4" /> },
                  { label: 'Total Units', value: viewProjectData.totalUnits, icon: <Layers className="w-4 h-4" /> },
                  { label: 'Land Area', value: viewProjectData.totalLandArea, icon: <Ruler className="w-4 h-4" /> },
                  { label: 'Selling Price', value: viewProjectData.sellingPrice, icon: <TrendingUp className="w-4 h-4" /> },
                  { label: 'RERA Number', value: viewProjectData.reraRegistrationNumber, icon: <ShieldCheck className="w-4 h-4" /> },
                  { label: 'Construction Status', value: viewProjectData.currentConstructionStatus, icon: <Calendar className="w-4 h-4" /> },
                  { label: 'Expected Rent', value: viewProjectData.expectedRent, icon: <TrendingUp className="w-4 h-4" /> },
                  { label: 'Location', value: viewProjectData.projectLocation, icon: <MapPin className="w-4 h-4" /> },
                ].map(({ label, value, icon }) => (
                  <div key={label} className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                    <div className="flex items-center gap-1.5 text-gray-400 mb-1">
                      {icon}
                      <span className="text-[10px] font-bold uppercase tracking-wider">{label}</span>
                    </div>
                    <p className="text-sm font-semibold text-gray-800">{value || 'N/A'}</p>
                  </div>
                ))}
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
