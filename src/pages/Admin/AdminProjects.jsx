import React, { useState, useEffect, useCallback } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Building2, Clock, FileWarning, Plus, Trash2, Eye, ShieldCheck,
  ShieldAlert, CheckCircle, XCircle, MapPin, RefreshCw, Image as ImageIcon, FileText, Download
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/AuthContext';
import { fetchAllProjects, verifyProjectStatus, requestProjectChanges, verifyProjectEdits } from '@/api';

const IGNORED_PROJECT_KEYS = [
  'id', 'builderId', 'status', 'createdAt', 'updatedAt', 'adminRequests', 'appealReason',
  'projectName', 'projectType', 'projectLocation', 'documents', 'createdBy', 'updatedBy',
  'projectImages', 'projectDocuments', 'hasPendingEdits', 'pendingEdits', 'views', 'inquiries', 'visibleDocuments'
];

const AdminProjects = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [requestedFields, setRequestedFields] = useState([{ fieldName: '', type: 'text' }]);

  const [viewProjectData, setViewProjectData] = useState(null);

  // --- Approval Modal States ---
  const [isApprovalModalOpen, setIsApprovalModalOpen] = useState(false);
  const [selectedDocs, setSelectedDocs] = useState([]);

  const loadProjects = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchAllProjects(user.token);
      setProjects(data);
    } catch (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }, [user?.token]);

  useEffect(() => {
    if (user && user.token) loadProjects();
  }, [user, loadProjects]);

  // ==========================================
  // 🐛 DEBUG CONSOLE LOGGER
  // ==========================================
  useEffect(() => {
    if (viewProjectData) {
      console.log("\n=============================================");
      console.log("🔎 DEBUG: VIEW PROJECT DATA OPENED");
      console.log("=============================================");
      console.log("1. Full Project Object:", viewProjectData);
      console.log("2. Base projectImages:", viewProjectData.projectImages);
      console.log("3. Base projectDocuments:", viewProjectData.projectDocuments);
      console.log("4. hasPendingEdits:", viewProjectData.hasPendingEdits);
      if (viewProjectData.hasPendingEdits && viewProjectData.pendingEdits) {
        console.log("5. pendingEdits object:", viewProjectData.pendingEdits);
        console.log("6. pendingEdits.projectImages:", viewProjectData.pendingEdits.projectImages);
        console.log("7. pendingEdits.projectDocuments:", viewProjectData.pendingEdits.projectDocuments);
      }
      console.log("=============================================\n");
    }
  }, [viewProjectData]);

  const handleRejection = async (projectId) => {
    try {
      await verifyProjectStatus(projectId, false);
      toast({ title: "Rejected", description: `Project has been Rejected.` });
      loadProjects();
      setViewProjectData(null);
    } catch (err) { toast({ title: "Error", description: err.message, variant: "destructive" }); }
  };

  // Open Approval Modal
  const openApprovalModal = (project) => {
    const docsToApprove = (project.hasPendingEdits && project.pendingEdits?.projectDocuments?.length > 0)
      ? project.pendingEdits.projectDocuments
      : project.projectDocuments;

    if (docsToApprove && docsToApprove.length > 0) {
      setSelectedDocs(docsToApprove.map(doc => doc.url));
    } else {
      setSelectedDocs([]);
    }

    setViewProjectData(project);
    setIsApprovalModalOpen(true);
  };

  const toggleDocSelection = (url) => {
    setSelectedDocs(prev =>
      prev.includes(url) ? prev.filter(item => item !== url) : [...prev, url]
    );
  };

  const submitFinalApproval = async () => {
    try {
      await fetch(`http://localhost:5000/api/projects/verify/${viewProjectData.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${user.token}` },
        body: JSON.stringify({
          status: 'approved',
          visibleDocuments: selectedDocs
        })
      });
      toast({ title: "Success", description: "Project Approved and Published!" });
      setIsApprovalModalOpen(false);
      setViewProjectData(null);
      loadProjects();
    } catch (err) { toast({ title: "Error", description: err.message, variant: "destructive" }); }
  };

  const handleEditVerification = async (projectId, isApproved) => {
    try {
      await verifyProjectEdits(projectId, isApproved);
      toast({ title: "Success", description: `Edits ${isApproved ? 'Approved' : 'Rejected'}.` });
      loadProjects();
      setViewProjectData(null);
    } catch (err) { toast({ title: "Error", description: err.message, variant: "destructive" }); }
  };

  const handleRevokeRejection = async (projectId) => {
    try {
      await fetch(`http://localhost:5000/api/projects/verify/${projectId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${user.token}` },
        body: JSON.stringify({ status: 'pending' })
      });
      toast({ title: "Success", description: "Rejection revoked. Project is pending again." });
      loadProjects();
      setViewProjectData(null);
    } catch (err) { toast({ title: "Error", description: err.message, variant: "destructive" }); }
  }

  const submitChangeRequest = async () => {
    const validFields = requestedFields.filter(f => f.fieldName.trim() !== '');
    if (validFields.length === 0) return toast({ title: "Error", description: "Add at least one field to request.", variant: "destructive" });

    try {
      await requestProjectChanges(selectedProjectId, validFields);
      toast({ title: "Success", description: "Request sent to builder." });
      setIsRequestModalOpen(false);
      setRequestedFields([{ fieldName: '', type: 'text' }]);
      loadProjects();
      setViewProjectData(null);
    } catch (err) { toast({ title: "Error", description: err.message, variant: "destructive" }); }
  };

  // Add this function inside AdminProjects component
  const downloadCSV = () => {
    if (!projects || projects.length === 0) {
      toast({ title: "Export Failed", description: "No projects available to export.", variant: "destructive" });
      return;
    }

    // List of fields to exclude from the CSV
    const EXCLUDED_FIELDS = [
      'id', 'builderId', 'createdBy', 'createdAt', 'hasPendingEdits',
      'pendingEdits', 'updatedAt', 'projectDocuments', 'projectImages',
      'visibleDocuments', 'updatedBy', 'views'
    ];

    // 1. Get all unique keys from all projects, then filter out the excluded ones
    const allKeys = new Set();
    projects.forEach(project => Object.keys(project).forEach(key => allKeys.add(key)));

    // These are the original object keys (e.g., 'totalBuiltUpArea')
    const headers = Array.from(allKeys).filter(key => !EXCLUDED_FIELDS.includes(key));

    // 2. Map data to rows
    const csvRows = [];

    // FORMAT THE HEADERS for the first row (e.g., 'totalBuiltUpArea' -> 'Total Built Up Area')
    const formattedHeaders = headers.map(key => {
      return key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
    });

    // Add the formatted header row
    csvRows.push(formattedHeaders.join(','));

    // Add data rows
    projects.forEach(project => {
      const row = headers.map(header => {
        // We use the ORIGINAL 'header' variable here to pull the correct data
        let val = project[header];

        // Handle undefined, null, and empty values
        if (val === null || val === undefined) {
          val = '';
        }
        // Handle nested objects/arrays (if any other objects remain after filtering)
        else if (typeof val === 'object') {
          val = JSON.stringify(val);
        }

        // Convert to string and escape quotes and commas for CSV compatibility
        let strVal = String(val);
        if (strVal.includes(',') || strVal.includes('"') || strVal.includes('\n')) {
          strVal = `"${strVal.replace(/"/g, '""')}"`;
        }

        return strVal;
      });

      csvRows.push(row.join(','));
    });

    // 3. Create a Blob and trigger the download
    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `all_projects_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({ title: "Success", description: "Projects exported successfully!" });
  };

  const filteredProjects = projects.filter(project => {
    if (filter === 'pending') return project.status === 'pending' || project.hasPendingEdits;
    if (filter === 'changes_requested') return project.status === 'changes_requested';
    if (filter === 'approved') return project.status === 'approved' && !project.hasPendingEdits;
    if (filter === 'rejected') return project.status === 'rejected';
    return true;
  });

  // ==========================================
  // 🐛 DYNAMIC EXTRACTION WITH FALLBACKS
  // ==========================================
  let displayImages = viewProjectData?.projectImages || [];
  let displayDocs = viewProjectData?.projectDocuments || [];

  if (viewProjectData?.hasPendingEdits && viewProjectData?.pendingEdits) {
    if (viewProjectData.pendingEdits.projectImages && viewProjectData.pendingEdits.projectImages.length > 0) {
      displayImages = viewProjectData.pendingEdits.projectImages;
    }
    if (viewProjectData.pendingEdits.projectDocuments && viewProjectData.pendingEdits.projectDocuments.length > 0) {
      displayDocs = viewProjectData.pendingEdits.projectDocuments;
    }
  }

  // Console log what we are actually feeding to the UI
  if (viewProjectData) {
    console.log("=> FINAL Calculated displayImages array:", displayImages);
    console.log("=> FINAL Calculated displayDocs array:", displayDocs);
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <div className="flex-1 container mx-auto px-4 py-24 max-w-7xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Manage Projects</h1>
            <p className="text-gray-600">Review, verify, and approve builder project listings.</p>
          </div>

          <div className="flex flex-col gap-3 items-start md:items-end">
            <div className="flex bg-gray-200/50 p-1 rounded-lg flex-wrap">
              <button onClick={() => setFilter('all')} className={`px-4 py-2 text-sm font-semibold rounded-md transition-all ${filter === 'all' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-600'}`}>All</button>
              <button onClick={() => setFilter('pending')} className={`px-4 py-2 text-sm font-semibold rounded-md transition-all ${filter === 'pending' ? 'bg-white shadow-sm text-orange-600' : 'text-gray-600'}`}>Pending Review</button>
              <button onClick={() => setFilter('changes_requested')} className={`px-4 py-2 text-sm font-semibold rounded-md transition-all ${filter === 'changes_requested' ? 'bg-white shadow-sm text-yellow-600' : 'text-gray-600'}`}>Awaiting Changes</button>
              <button onClick={() => setFilter('approved')} className={`px-4 py-2 text-sm font-semibold rounded-md transition-all ${filter === 'approved' ? 'bg-white shadow-sm text-green-600' : 'text-gray-600'}`}>Approved</button>
              <button onClick={() => setFilter('rejected')} className={`px-4 py-2 text-sm font-semibold rounded-md transition-all ${filter === 'rejected' ? 'bg-white shadow-sm text-red-600' : 'text-gray-600'}`}>Rejected</button>
              <Button
              onClick={downloadCSV}
              variant="outline"
              className="bg-white border-green-600 text-green-700 hover:bg-green-50 shadow-sm"
            >
              <Download className="w-4 h-4 mr-2" /> Export
            </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {loading ? (
            <div className="col-span-full flex flex-col items-center justify-center text-gray-500 py-24">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mb-4"></div>
              Loading projects...
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="col-span-full text-center bg-white rounded-xl p-12 border border-gray-100 shadow-sm text-gray-500">
              No projects found in this category.
            </div>
          ) : filteredProjects.map((project) => {

            const renderStatusBadge = () => {
              if (project.hasPendingEdits) {
                return <Badge className="bg-blue-100 text-blue-800 border-none"><Clock className="w-3 h-3 mr-1" /> Edits Pending</Badge>;
              }
              switch (project.status) {
                case 'pending': return <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100 border-none"><Clock className="w-3 h-3 mr-1" /> Pending</Badge>;
                case 'changes_requested': return <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100 border-none"><FileWarning className="w-3 h-3 mr-1" /> Changes Req.</Badge>;
                case 'approved': return <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-none"><ShieldCheck className="w-3 h-3 mr-1" /> Live</Badge>;
                case 'rejected': return <Badge className="bg-red-100 text-red-700 hover:bg-red-100 border-none"><XCircle className="w-3 h-3 mr-1" /> Rejected</Badge>;
                default: return <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-100 border-none">Unknown</Badge>;
              }
            };

            return (
              <Card key={project.id} className="border border-gray-100 shadow-lg flex flex-col relative overflow-hidden">
                <div className={`h-1 w-full ${project.hasPendingEdits ? 'bg-blue-500' : project.status === 'approved' ? 'bg-green-500' : project.status === 'rejected' ? 'bg-red-500' : project.status === 'changes_requested' ? 'bg-orange-500' : 'bg-yellow-500'}`} />

                <CardContent className="p-8 flex-1 flex flex-col">
                  <div className="flex items-start space-x-6 mb-6">
                    <div className="w-16 h-16 flex-shrink-0 bg-blue-50 rounded-xl flex items-center justify-center">
                      <Building2 className="h-8 w-8 text-blue-500" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2 gap-2">
                        <h3 className="text-xl font-bold text-gray-900 truncate">{project.projectName || 'Unnamed Project'}</h3>
                        {renderStatusBadge()}
                      </div>
                      <p className="text-sm font-medium text-gray-600 mb-1">Builder: {project.builderName || 'Unknown'}</p>
                      <p className="text-sm text-gray-500 flex items-center"><MapPin className="w-3 h-3 mr-1" /> {project.projectLocation || 'Location TBA'}</p>
                    </div>
                  </div>

                  {project.appealReason && project.status === 'pending' && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-800">
                      <strong>Appeal Note:</strong> {project.appealReason}
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2 mb-6">
                    <Badge variant="outline">{project.projectType}</Badge>
                    <Badge variant="outline">{project.totalUnits} Units</Badge>
                  </div>

                  <div className="mt-auto pt-4 flex gap-3">
                    <Button onClick={() => setViewProjectData(project)} className="w-full bg-gray-900 hover:bg-gray-800 text-white">
                      <Eye className="w-4 h-4 mr-2" /> View Full Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* DETAILED VIEW MODAL */}
      <Dialog open={!!viewProjectData} onOpenChange={(open) => !open && setViewProjectData(null)}>
        <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto p-0">
          <DialogHeader className="p-6 pb-0 sticky top-0 bg-white z-10 border-b border-gray-100">
            <div className="flex justify-between items-start">
              <div>
                <DialogTitle className="text-2xl font-bold text-gray-900">{viewProjectData?.projectName || 'Project Details'}</DialogTitle>
                <DialogDescription>Review the complete submission for this project.</DialogDescription>
              </div>
              <Badge className="bg-blue-100 text-blue-800 border-none">{viewProjectData?.projectType}</Badge>
            </div>
          </DialogHeader>

          {viewProjectData && (
            <div className="p-6 space-y-8 bg-gray-50">

              {viewProjectData.appealReason && viewProjectData.status === 'pending' && (
                <div className="bg-red-50 border border-red-200 p-6 rounded-xl shadow-sm">
                  <h4 className="text-lg font-bold text-red-900 mb-2 flex items-center">
                    <RefreshCw className="w-5 h-5 mr-2" /> Rejection Appeal
                  </h4>
                  <p className="text-sm text-red-800 font-medium">The builder has appealed your previous rejection with the following reason:</p>
                  <p className="text-sm text-red-900 bg-white p-3 rounded mt-2 border border-red-100">{viewProjectData.appealReason}</p>
                </div>
              )}

              {/* --- MEDIA & DOCUMENTS DISPLAY --- */}
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-6">
                {/* Display Images */}
                <div>
                  <h4 className="text-lg font-bold text-[#0b264f] mb-3 flex items-center"><ImageIcon className="w-5 h-5 mr-2" /> Project Images</h4>
                  {displayImages.length > 0 ? (
                    <div className="flex gap-4 overflow-x-auto pb-2 custom-scrollbar">
                      {displayImages.map((img, i) => (
                        <a key={i} href={img} target="_blank" rel="noreferrer" className="flex-shrink-0">
                          <img src={img} alt={`Project visual ${i}`} className="h-32 w-48 object-cover rounded-xl border border-gray-200 shadow-sm hover:opacity-80 transition-opacity" />
                        </a>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 italic">No images uploaded.</p>
                  )}
                </div>

                {/* Display Documents */}
                <div className="pt-4 border-t border-gray-100">
                  <h4 className="text-lg font-bold text-[#0b264f] mb-3 flex items-center"><FileText className="w-5 h-5 mr-2" /> Official Documents</h4>
                  {displayDocs.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {displayDocs.map((doc, i) => (
                        <a key={i} href={doc.url} target="_blank" rel="noreferrer" className="flex items-center p-3 bg-blue-50/50 border border-blue-100 rounded-lg hover:bg-blue-100 transition-colors group">
                          <FileText className="w-5 h-5 text-blue-600 mr-3" />
                          <span className="text-sm font-medium text-gray-800 flex-1 truncate">{doc.docName || doc.fileName}</span>
                          <Download className="w-4 h-4 text-gray-400 group-hover:text-blue-600" />
                        </a>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 italic">No documents uploaded.</p>
                  )}
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h4 className="text-lg font-bold text-[#0b264f] mb-4 border-b pb-2">Project Text Data</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8 text-sm">

                  <div className="bg-blue-50/50 p-3 rounded-lg border border-blue-100">
                    <span className="text-blue-800 block mb-1 font-semibold uppercase tracking-wider text-xs">Created By</span>
                    <p className="font-medium text-gray-900">{viewProjectData.createdBy || 'Unknown (Legacy)'}</p>
                  </div>
                  <div className="bg-blue-50/50 p-3 rounded-lg border border-blue-100">
                    <span className="text-blue-800 block mb-1 font-semibold uppercase tracking-wider text-xs">Last Updated By</span>
                    <p className="font-medium text-gray-900">{viewProjectData.updatedBy || 'Unknown (Legacy)'}</p>
                  </div>

                  <div className="md:col-span-2">
                    <span className="text-gray-500 block mb-1 font-semibold uppercase tracking-wider text-xs">Overview</span>
                    <p className="font-medium bg-gray-50 p-3 rounded-lg border border-gray-100">{viewProjectData.projectOverview || 'No overview provided.'}</p>
                  </div>

                  {Object.entries(viewProjectData).map(([key, value]) => {
                    if (IGNORED_PROJECT_KEYS.includes(key) || key === 'projectOverview') return null;

                    if (key === 'bankApprovalsName' && viewProjectData.bankApprovals !== 'Yes') return null;
                    if ((key === 'existingBorrowingsAmount' || key === 'existingBorrowingsPurpose') && viewProjectData.existingBorrowings !== 'Yes') return null;
                    if (key === 'expectedRent' && viewProjectData.availableForRent !== 'Yes') return null;
                    if (key === 'buybackGuaranteeDetails' && viewProjectData.buybackGuarantee !== 'Yes') return null;

                    const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
                    const isLongText = typeof value === 'string' && value.length > 50;

                    return (
                      <div key={key} className={isLongText ? "md:col-span-2" : ""}>
                        <span className="text-gray-500 block mb-1 font-semibold uppercase tracking-wider text-xs">{label}</span>
                        <p className="font-medium bg-gray-50 p-2 rounded-lg border border-gray-100">{value || '--'}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {viewProjectData.adminRequests && viewProjectData.adminRequests.length > 0 && (
                <div className="bg-orange-50 p-6 rounded-xl border border-orange-100 shadow-sm">
                  <h4 className="text-lg font-semibold text-orange-900 mb-4 border-b border-orange-200 pb-2">Admin Requested Details</h4>
                  <div className="grid grid-cols-1 gap-y-4 text-sm">
                    {viewProjectData.adminRequests.map((req, idx) => (
                      <div key={idx}>
                        <span className="text-orange-700/70 block mb-1 capitalize">{req.fieldName}</span>
                        <span className="font-medium text-orange-950 bg-white p-2 rounded border border-orange-200 block">
                          {viewProjectData[req.fieldName] || 'Pending Builder Submission'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* --- PENDING EDITS SECTION --- */}
              {viewProjectData.hasPendingEdits && viewProjectData.pendingEdits && (
                <div className="mt-8 bg-blue-50 border border-blue-200 p-6 rounded-xl shadow-sm">
                  <h4 className="text-lg font-bold text-blue-900 mb-2 flex items-center">
                    <Clock className="w-5 h-5 mr-2" /> Proposed Updates (Pending Review)
                  </h4>
                  <p className="text-sm text-blue-800 mb-4">The builder wants to change the following fields. The project is currently LIVE with its old data.</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-6">
                    {Object.entries(viewProjectData.pendingEdits).map(([key, value]) => {
                      if (IGNORED_PROJECT_KEYS.includes(key) || !value) return null;
                      const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
                      return (
                        <div key={key} className="bg-white p-3 rounded border border-blue-100">
                          <span className="text-gray-500 block mb-1 font-semibold uppercase tracking-wider text-[10px]">{label}</span>
                          <span className="font-medium text-gray-900">{value}</span>
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex gap-3">
                    <Button onClick={() => handleEditVerification(viewProjectData.id, true)} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"><CheckCircle className="w-4 h-4 mr-2" /> Approve & Publish Updates</Button>
                    <Button onClick={() => handleEditVerification(viewProjectData.id, false)} variant="outline" className="flex-1 border-blue-300 text-blue-700 hover:bg-blue-100"><XCircle className="w-4 h-4 mr-2" /> Discard Updates</Button>
                  </div>
                </div>
              )}

              {/* Action Buttons Inside Modal */}
              <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-wrap gap-3 sticky bottom-4">
                {viewProjectData.status === 'pending' && (
                  <>
                    <Button onClick={() => openApprovalModal(viewProjectData)} className="flex-1 bg-green-600 hover:bg-green-700 text-white"><CheckCircle className="w-4 h-4 mr-2" /> Approve Project</Button>
                    <Button onClick={() => { setSelectedProjectId(viewProjectData.id); setIsRequestModalOpen(true); }} variant="outline" className="flex-1 border-orange-200 text-orange-600 hover:bg-orange-50"><FileWarning className="w-4 h-4 mr-2" /> Request Changes</Button>
                    <Button onClick={() => handleRejection(viewProjectData.id)} variant="outline" className="flex-1 border-red-200 text-red-600 hover:bg-red-50"><Trash2 className="w-4 h-4 mr-2" /> Reject</Button>
                  </>
                )}
                {viewProjectData.status === 'approved' && !viewProjectData.hasPendingEdits && (
                  <Button onClick={() => handleRejection(viewProjectData.id)} variant="outline" className="w-full border-red-200 text-red-600 hover:bg-red-50"><ShieldAlert className="w-4 h-4 mr-2" /> Revoke Approval (Reject)</Button>
                )}
                {viewProjectData.status === 'rejected' && (
                  <Button onClick={() => handleRevokeRejection(viewProjectData.id)} variant="outline" className="w-full border-orange-200 text-orange-600 hover:bg-orange-50"><RefreshCw className="w-4 h-4 mr-2" /> Revoke Rejection (Set to Pending)</Button>
                )}
                {viewProjectData.status === 'changes_requested' && (
                  <div className="w-full text-center text-sm font-medium text-orange-600 bg-orange-50 py-3 rounded-md">Waiting for builder to submit requested changes.</div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* --- APPROVAL SETTINGS MODAL --- */}
      <Dialog open={isApprovalModalOpen} onOpenChange={setIsApprovalModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Project Approval Settings</DialogTitle>
            <DialogDescription>Select which documents should be visible to investors. Unchecked documents will remain hidden for internal use only.</DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            {displayDocs?.length > 0 ? (
              <div className="space-y-3 bg-gray-50 p-4 rounded-lg border border-gray-200 max-h-[300px] overflow-y-auto">
                {displayDocs.map((doc, idx) => (
                  <div key={idx} className="flex items-center space-x-3 bg-white p-3 rounded border border-gray-100 shadow-sm">
                    <Checkbox
                      id={`doc-${idx}`}
                      checked={selectedDocs.includes(doc.url)}
                      onCheckedChange={() => toggleDocSelection(doc.url)}
                    />
                    <Label htmlFor={`doc-${idx}`} className="flex-1 cursor-pointer text-sm font-medium text-gray-700">
                      {doc.docName || doc.fileName}
                    </Label>
                    <a href={doc.url} target="_blank" rel="noreferrer" className="text-blue-500 hover:text-blue-700">
                      <Eye className="w-4 h-4" />
                    </a>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 italic bg-gray-50 p-4 rounded-lg">No documents available to share.</p>
            )}

            <Button onClick={submitFinalApproval} className="w-full bg-green-600 hover:bg-green-700 text-white mt-4 h-12 text-md">
              <CheckCircle className="w-5 h-5 mr-2" /> Confirm & Publish Project
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* REQUEST CHANGES MODAL */}
      <Dialog open={isRequestModalOpen} onOpenChange={setIsRequestModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Request More Information</DialogTitle>
            <DialogDescription>Specify additional details the builder needs to provide for this project.</DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            {requestedFields.map((field, idx) => (
              <div key={idx} className="flex gap-3 items-end">
                <div className="flex-1">
                  <Label className="text-xs text-gray-500">Field Name</Label>
                  <Input value={field.fieldName} onChange={(e) => { const updated = [...requestedFields]; updated[idx].fieldName = e.target.value; setRequestedFields(updated); }} placeholder="e.g. Legal Clearance Docs" />
                </div>
                <div className="w-1/3">
                  <Label className="text-xs text-gray-500">Type</Label>
                  <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={field.type} onChange={(e) => { const updated = [...requestedFields]; updated[idx].type = e.target.value; setRequestedFields(updated); }}>
                    <option value="text">Text / Link</option>
                    <option value="file">File Upload</option>
                  </select>
                </div>
                <Button variant="ghost" onClick={() => { const updated = [...requestedFields]; updated.splice(idx, 1); setRequestedFields(updated); }} className="text-red-500 p-2"><Trash2 size={16} /></Button>
              </div>
            ))}
            <Button type="button" variant="outline" onClick={() => setRequestedFields([...requestedFields, { fieldName: '', type: 'text' }])} className="w-full mt-2 text-sm"><Plus className="w-4 h-4 mr-2" /> Add Another Field</Button>
            <Button onClick={submitChangeRequest} className="w-full bg-orange-600 hover:bg-orange-700 text-white mt-6">Send Request to Builder</Button>
          </div>
        </DialogContent>
      </Dialog>
      <Footer />
    </div>
  );
};

export default AdminProjects;