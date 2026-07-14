"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Search, Edit, Trash2, Eye, ArrowLeft, Save, Building2, MapPin, FileText, ShieldAlert, CheckCircle, FileWarning, Loader2, Clock, XCircle, RefreshCw, LayoutDashboard, Layers, Landmark, DollarSign, ImagePlus, X, Lock, Upload, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/AuthContext';
import { useRouter } from 'next/navigation';
import { fetchBuilderProjects, createProject, updateProject, deleteProject, submitProjectChanges, appealProjectRejection, uploadFile, uploadImage } from '@/api';
import MultiSelect from '@/components/ui/MultiSelect';

const PROJECT_CATEGORY_TYPES = {
    "Residential": ["Apartments", "Villas", "Villaments", "Gated Communities", "Luxury Homes", "Senior Living", "Affordable Housing", "Holiday Homes"],
    "Commercial": ["Office Spaces", "Retail Shops", "Commercial Complexes", "Shopping Malls", "Co-working Spaces", "IT Parks"],
    "Land & Plots": ["Residential Plots", "Villa Plots", "Farm Plots", "Commercial Plots", "Township Plots"],
    "Industrial & Warehousing": ["Warehouses", "Industrial Parks", "Manufacturing Units", "Logistics Parks", "Cold Storage"],
    "Agricultural": ["Agricultural Land", "Farm Houses", "Organic Farms", "Plantation Projects"],
    "Hospitality": ["Hotels", "Resorts", "Serviced Apartments", "Holiday Projects"],
    "Alternative Investments": ["Fractional Ownership", "REIT Opportunities", "Equity Participation", "Joint Ventures"]
};

const initialFormState = {
    projectName: '', builderName: '', projectOverview: '', projectLocation: '', projectType: [],
    projectCategories: [], projectTypes: [],
    totalLandArea: '', totalBuiltUpArea: '', totalUnits: '', currentConstructionStatus: '', expectedCompletionDate: '',
    governmentApprovalsObtained: '', reraRegistrationNumber: '', bankApprovals: 'No', bankApprovalsName: '',
    projectCost: '', existingBorrowings: 'No', existingBorrowingsAmount: '', existingBorrowingsPurpose: '', sellingPrice: '', pricingOffered: '',
    securityOffered: '', lockInPeriod: '', buybackGuarantee: 'No', buybackGuaranteeDetails: '', exitResaleFramework: '', marketingResponsibility: '',
    additionalDisclosures: '', availableForRent: 'No', expectedRent: '',
    projectImages: [],
    projectDocuments: [],
    area: '',
    inventory: '',
    landType: 'Owned Land',
    landTypeOther: '',
    projectBrochure: null,
    projectBrochureUrl: '',
    projectSpecifications: ''
};

const IGNORED_DETAIL_KEYS = [
    'id', 'builderId', 'status', 'projectName', 'projectType', 'projectLocation',
    'projectImages', 'projectDocuments', 'adminRequests', 'appealReason', 'createdAt', 'updatedAt', 'views', 'inquiries', 'createdBy', 'updatedBy',
    'pendingEdits', 'hasPendingEdits', 'projectCategories', 'projectTypes', 'projectSpecifications', 'projectBrochure', 'projectBrochureUrl', 'landTypeOther'
];

const CONSTRUCTION_STATUSES = [
    "Pre-Launch", "Excavation", "Foundation", "Under Construction",
    "Structure Complete", "Finishing", "Ready to Move", "Delivered"
];

export default function ProjectManager() {
    const { user } = useAuth();
    const router = useRouter();
    const [view, setView] = useState('list');
    const [projects, setProjects] = useState([]);
    const [currentProject, setCurrentProject] = useState(initialFormState);
    const [isEditing, setIsEditing] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 10;

    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery]);

    const [dynamicProjectData, setDynamicProjectData] = useState({});
    const [isAppealModalOpen, setIsAppealModalOpen] = useState(false);
    const [appealReason, setAppealReason] = useState('');

    const loadProjects = useCallback(async () => {
        if (!user?.uid) return;
        try {
            const res = await fetchBuilderProjects(user.uid);
            setProjects(res?.data || res || []);
        } catch (error) {
            toast({ title: "Error loading projects", description: error.message, variant: "destructive" });
        }
    }, [user]);

    useEffect(() => {
        if (user?.uid) loadProjects();
    }, [user, loadProjects]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCurrentProject(prev => ({ ...prev, [name]: value }));
    };

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        setCurrentProject(prev => ({
            ...prev,
            projectImages: [...(prev.projectImages || []), ...files]
        }));
    };

    const removeImage = (indexToRemove) => {
        setCurrentProject(prev => ({
            ...prev,
            projectImages: (prev.projectImages || []).filter((_, idx) => idx !== indexToRemove)
        }));
    };

    const addDocumentRow = () => {
        setCurrentProject(prev => ({
            ...prev,
            projectDocuments: [...(prev.projectDocuments || []), { docName: '', file: null, fileName: '' }]
        }));
    };

    const updateDocumentName = (index, newName) => {
        const updatedDocs = [...(currentProject.projectDocuments || [])];
        updatedDocs[index].docName = newName;
        setCurrentProject(prev => ({ ...prev, projectDocuments: updatedDocs }));
    };

    const handleDocumentFileUpload = (index, e) => {
        const file = e.target.files[0];
        if (file) {
            const updatedDocs = [...(currentProject.projectDocuments || [])];
            updatedDocs[index].file = file;
            updatedDocs[index].fileName = file.name;
            setCurrentProject(prev => ({ ...prev, projectDocuments: updatedDocs }));
        }
    };

    const removeDocumentRow = (indexToRemove) => {
        setCurrentProject(prev => ({
            ...prev,
            projectDocuments: (prev.projectDocuments || []).filter((_, idx) => idx !== indexToRemove)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // Generate a temporary client-side ID for folder naming (backend will set the real Firestore ID)
            const tempId = isEditing ? currentProject.id : `proj_${Date.now()}`;

            // Upload new image files via backend API (use uploadImage for proper image handling)
            const uploadedImages = [];
            for (const img of (currentProject.projectImages || [])) {
                if (img instanceof File) {
                    const response = await uploadImage(img, `${tempId}/ProjectDisplayImages`);
                    if (!response?.url) throw new Error(`Image upload failed for ${img.name}`);
                    uploadedImages.push(response.url);
                } else if (typeof img === 'string' && img.startsWith('http')) {
                    // Already a URL from a previous upload — keep it
                    uploadedImages.push(img);
                }
            }

            // Upload new document files via backend API
            const uploadedDocs = [];
            for (const docObj of (currentProject.projectDocuments || [])) {
                if (docObj.file instanceof File) {
                    const response = await uploadFile(docObj.file, `${tempId}/ProjectDocuments`);
                    uploadedDocs.push({
                        docName: docObj.docName,
                        fileName: docObj.file.name,
                        url: response.url
                    });
                } else {
                    uploadedDocs.push(docObj);
                }
            }

            let uploadedBrochureUrl = currentProject.projectBrochureUrl || '';
            if (currentProject.projectBrochure instanceof File) {
                const response = await uploadFile(currentProject.projectBrochure, `${tempId}/ProjectBrochure`);
                if (!response?.url) throw new Error(`Brochure upload failed`);
                uploadedBrochureUrl = response.url;
            }

            const payload = {
                ...currentProject,
                builderId: user.uid,
                updatedBy: user.email || user.name,
                projectImages: uploadedImages,
                projectDocuments: uploadedDocs,
                projectBrochureUrl: uploadedBrochureUrl,
                projectBrochure: null,
                projectCategories: currentProject.projectCategories || [],
                projectTypes: currentProject.projectTypes || [],
                projectType: currentProject.projectTypes || []
            };

            if (isEditing) {
                await updateProject(currentProject.id, payload);
                toast({ title: "Success", description: "Project updated. Submitted for admin verification." });
            } else {
                payload.createdBy = user.email || user.name;
                await createProject(payload);
                toast({ title: "Success", description: "Project created. Submitted for admin verification." });
            }

            loadProjects();
            setView('list');
        } catch (error) {
            toast({ title: "Error", description: error.message || "Failed to save project.", variant: "destructive" });
        } finally {
            setIsLoading(false);
        }
    };

    const handleDynamicSubmit = async () => {
        setIsLoading(true);
        try {
            const payloadWithUser = {
                ...dynamicProjectData,
                updatedBy: user.email || user.name
            };
            await submitProjectChanges(currentProject.id, payloadWithUser);
            toast({ title: "Success", description: "Changes submitted for verification." });
            setDynamicProjectData({});
            loadProjects();
            setView('list');
        } catch (error) {
            toast({ title: "Error", description: error.message, variant: "destructive" });
        } finally {
            setIsLoading(false);
        }
    };

    const handleAppealSubmit = async () => {
        if (!appealReason.trim()) return toast({ title: "Error", description: "Please provide a reason.", variant: "destructive" });
        setIsLoading(true);
        try {
            await appealProjectRejection(currentProject.id, appealReason);
            toast({ title: "Appeal Submitted", description: "Your project is back under review." });
            setIsAppealModalOpen(false);
            setAppealReason('');
            loadProjects();
            setView('list');
        } catch (error) {
            toast({ title: "Error", description: error.message, variant: "destructive" });
        } finally {
            setIsLoading(false);
        }
    };

    const handleEdit = (project) => {
        const dataToLoad = project.hasPendingEdits
            ? { ...project, ...project.pendingEdits }
            : project;

        const categories = Array.isArray(dataToLoad.projectCategories) 
            ? dataToLoad.projectCategories 
            : (typeof dataToLoad.projectCategory === 'string' 
                ? [dataToLoad.projectCategory] 
                : (typeof dataToLoad.projectType === 'string' && Object.keys(PROJECT_CATEGORY_TYPES).includes(dataToLoad.projectType)
                    ? [dataToLoad.projectType]
                    : []));
        const types = Array.isArray(dataToLoad.projectTypes)
            ? dataToLoad.projectTypes
            : (Array.isArray(dataToLoad.projectType)
                ? dataToLoad.projectType
                : (typeof dataToLoad.projectType === 'string' ? [dataToLoad.projectType] : []));

        setCurrentProject({
            ...initialFormState,
            ...dataToLoad,
            projectCategories: categories,
            projectTypes: types,
            projectImages: dataToLoad.projectImages || [],
            projectDocuments: dataToLoad.projectDocuments || []
        });
        setIsEditing(true);
        setView('form');
    };

    const handleViewDetails = (project) => {
        const categories = Array.isArray(project.projectCategories) 
            ? project.projectCategories 
            : (typeof project.projectCategory === 'string' 
                ? [project.projectCategory] 
                : (typeof project.projectType === 'string' && Object.keys(PROJECT_CATEGORY_TYPES).includes(project.projectType)
                    ? [project.projectType]
                    : []));
        const types = Array.isArray(project.projectTypes)
            ? project.projectTypes
            : (Array.isArray(project.projectType)
                ? project.projectType
                : (typeof project.projectType === 'string' ? [project.projectType] : []));

        setCurrentProject({
            ...initialFormState,
            ...project,
            projectCategories: categories,
            projectTypes: types
        });
        setDynamicProjectData({});
        setView('detail');
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this project? This cannot be undone.')) {
            try {
                await deleteProject(id);
                toast({ title: "Deleted", description: "Project has been removed." });
                loadProjects();
            } catch (error) {
                toast({ title: "Error", description: error.message, variant: "destructive" });
            }
        }
    };

    const resetForm = () => {
        setCurrentProject(initialFormState);
        setIsEditing(false);
        setView('form');
    };

    const filteredProjects = projects.filter(p =>
        p.projectName?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const inputStyle = "w-full p-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-[#0b264f]/20 focus:border-[#0b264f] bg-white text-sm transition-all";
    const selectStyle = "w-full p-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-[#0b264f]/20 focus:border-[#0b264f] bg-white text-sm transition-all";
    const labelStyle = "block text-sm font-semibold text-gray-700 mb-1.5";
    const cardStyle = "bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8";
    const cardHeaderStyle = "bg-gray-50/80 border-b border-gray-100 px-6 py-4 flex items-center";

    const isBlocked = user?.onboardingStatus !== 'complete' && user?.isVerified !== true;

    if (!user) return null;

    if (isBlocked) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center font-sans p-4">
                <div className="bg-white border border-amber-200/50 rounded-3xl p-8 sm:p-12 text-center shadow-2xl max-w-lg w-full relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-400 via-orange-500 to-amber-400" />
                    <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner border border-amber-100">
                        <Lock className="w-10 h-10 text-amber-500" />
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-4 tracking-tight">Verification Required</h2>
                    <p className="text-gray-500 mb-8 leading-relaxed font-medium">
                        To add and manage projects, your profile must be fully verified by our administration team. Please complete the verification process first.
                    </p>
                    <Button 
                        onClick={() => router.push('/builder/verification')}
                        className="bg-gray-900 hover:bg-black text-white px-10 py-6 text-base font-black rounded-2xl shadow-xl shadow-black/10 transition-all hover:scale-105 active:scale-95"
                    >
                        Go to Verification
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans overflow-x-hidden">
            <div className="flex-grow w-full max-w-7xl mx-auto px-2 sm:px-4 pb-8 pt-4 sm:pt-6">
                {view === 'list' && (
                    <div className="space-y-6">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Project Directory</h1>
                                <p className="text-gray-500 text-sm">Manage your properties. All edits require admin verification.</p>
                            </div>
                            <div className="flex w-full md:w-auto gap-3">
                                <div className="relative flex-grow md:w-64">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                                    <input type="text" placeholder="Search projects..." className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-[#0b264f] transition-colors text-sm" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                                </div>
                                <Button onClick={resetForm} className="bg-[#0b264f] hover:bg-[#1a4b8c] text-white whitespace-nowrap">
                                    <Plus className="w-4 h-4 mr-2" /> Add Project
                                </Button>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-gray-50 border-b border-gray-100">
                                            <th className="p-4 font-semibold text-gray-600 text-sm">Project Name</th>
                                            <th className="p-4 font-semibold text-gray-600 text-sm">Status</th>
                                            <th className="p-4 font-semibold text-gray-600 text-sm">Type</th>
                                            <th className="p-4 font-semibold text-gray-600 text-sm text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredProjects.length > 0 ? filteredProjects.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE).map((project) => (
                                            <tr key={project.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                                                <td className="p-4">
                                                    <div className="font-bold text-gray-900 flex items-center gap-2">
                                                        <Building2 className="w-4 h-4 text-[#0b264f]" /> {project.projectName || 'Unnamed'}
                                                    </div>
                                                    <div className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                                                        <MapPin className="w-3 h-3" /> {project.projectLocation || 'Location TBA'}
                                                    </div>
                                                </td>
                                                <td className="p-4">
                                                    {project.status === 'approved' && project.hasPendingEdits ? (
                                                        <Badge className="bg-blue-100 text-blue-800 border-none"><Clock className="w-3 h-3 mr-1" /> Live (Edits Pending)</Badge>
                                                    ) : project.status === 'approved' ? (
                                                        <Badge className="bg-green-100 text-green-800 border-none"><CheckCircle className="w-3 h-3 mr-1" /> Live</Badge>
                                                    ) : project.status === 'changes_requested' ? (
                                                        <Badge className="bg-orange-100 text-orange-800 border-none"><FileWarning className="w-3 h-3 mr-1" /> Needs Action</Badge>
                                                    ) : project.status === 'rejected' ? (
                                                        <Badge className="bg-red-100 text-red-800 border-none"><XCircle className="w-3 h-3 mr-1" /> Rejected</Badge>
                                                    ) : (
                                                        <Badge className="bg-yellow-100 text-yellow-800 border-none"><Clock className="w-3 h-3 mr-1" /> Pending</Badge>
                                                    )}
                                                </td>
                                                <td className="p-4">
                                                    <Badge variant="outline">{project.projectType}</Badge>
                                                </td>
                                                <td className="p-4 text-right space-x-2">
                                                    <button onClick={() => handleViewDetails(project)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="View"><Eye className="w-4 h-4" /></button>
                                                    <button onClick={() => handleEdit(project)} className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors" title="Edit"><Edit className="w-4 h-4" /></button>
                                                    <button onClick={() => handleDelete(project.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete"><Trash2 className="w-4 h-4" /></button>
                                                </td>
                                            </tr>
                                        )) : (
                                            <tr>
                                                <td colSpan="4" className="p-8 text-center text-gray-500">No projects found. Add your first project!</td>
                                            </tr>
                                        )}
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
                                                className={`h-9 w-9 p-0 rounded-lg text-xs font-bold ${currentPage === page ? 'bg-slate-900 text-white hover:bg-slate-800' : 'hover:bg-slate-100 bg-white'
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
                        </div>
                    </div>
                )}

                {view === 'form' && (
                    <form onSubmit={handleSubmit} className="max-w-5xl mx-auto">
                        {/* Form Top Bar — static, not sticky */}
                        <div className="flex items-center justify-between bg-white border border-gray-200 rounded-xl px-3 sm:px-5 py-3 mb-4 shadow-sm gap-2">
                            <Button type="button" variant="ghost" onClick={() => setView('list')} className="text-gray-500 hover:text-[#0b264f] shrink-0 px-2 sm:px-4">
                                <ArrowLeft className="w-4 h-4 sm:mr-2" /> <span className="hidden sm:inline">Back</span>
                            </Button>
                            <h2 className="text-base sm:text-xl md:text-2xl font-bold text-gray-900 text-center truncate">{isEditing ? 'Edit Project' : 'New Project Listing'}</h2>
                            <Button type="submit" disabled={isLoading} className="bg-[#0b264f] hover:bg-[#1a4b8c] text-white shrink-0 px-2 sm:px-4">
                                {isLoading ? <Loader2 className="w-4 h-4 sm:mr-2 animate-spin" /> : <Save className="w-4 h-4 sm:mr-2" />}
                                <span className="hidden sm:inline">{isLoading ? 'Saving...' : 'Save & Submit'}</span>
                            </Button>
                        </div>

                        <div className="space-y-4 sm:space-y-6">
                        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-3 sm:p-4 rounded-xl text-sm flex gap-3">
                            <ShieldAlert className="w-5 h-5 flex-shrink-0 mt-0.5" />
                            <p><strong>Verification Required:</strong> Submitting this form sends it for Administrator Review. The project will not be visible to investors until approved.</p>
                        </div>

                        <div className={cardStyle}>
                            <div className={cardHeaderStyle}>
                                <LayoutDashboard className="w-5 h-5 mr-2 text-[#0b264f]" />
                                <h3 className="text-lg font-bold text-gray-900">Basic Information</h3>
                            </div>
                            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 bg-white">
                                <div><Label className={labelStyle}>Project Name *</Label><Input required name="projectName" value={currentProject.projectName} onChange={handleInputChange} className={inputStyle} /></div>
                                <div><Label className={labelStyle}>Builder Name *</Label><Input required name="builderName" value={currentProject.builderName} onChange={handleInputChange} className={inputStyle} /></div>
                                <div className="md:col-span-2"><Label className={labelStyle}>Project Overview *</Label><Textarea required name="projectOverview" value={currentProject.projectOverview} onChange={handleInputChange} rows="3" className={inputStyle} /></div>
                                <div className="md:col-span-2"><Label className={labelStyle}>Project Location *</Label><Input required name="projectLocation" value={currentProject.projectLocation} onChange={handleInputChange} className={inputStyle} /></div>
                                <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <Label className={labelStyle}>Project Category *</Label>
                                        <MultiSelect
                                            options={Object.keys(PROJECT_CATEGORY_TYPES)}
                                            selected={currentProject.projectCategories || []}
                                            onChange={(val) => {
                                                const validTypes = val.reduce((acc, cat) => [...acc, ...PROJECT_CATEGORY_TYPES[cat]], []);
                                                const filteredTypes = (currentProject.projectTypes || []).filter(t => validTypes.includes(t));
                                                setCurrentProject(prev => ({
                                                    ...prev,
                                                    projectCategories: val,
                                                    projectTypes: filteredTypes
                                                }));
                                            }}
                                            placeholder="Select categories"
                                        />
                                    </div>
                                    <div>
                                        <Label className={labelStyle}>Project Type *</Label>
                                        <MultiSelect
                                            options={(currentProject.projectCategories || []).reduce((acc, cat) => [...acc, ...(PROJECT_CATEGORY_TYPES[cat] || [])], [])}
                                            selected={currentProject.projectTypes || []}
                                            onChange={(val) => setCurrentProject(prev => ({ ...prev, projectTypes: val }))}
                                            placeholder={(currentProject.projectCategories || []).length === 0 ? 'Select categories first' : 'Select project types'}
                                            emptyMessage={(currentProject.projectCategories || []).length === 0 ? 'Please select a category first.' : 'No types found.'}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <Label className={labelStyle}>Current Construction Status *</Label>
                                    <select required name="currentConstructionStatus" value={currentProject.currentConstructionStatus} onChange={handleInputChange} className={selectStyle}>
                                        <option value="">Select Status</option>
                                        {CONSTRUCTION_STATUSES.map(status => (
                                            <option key={status} value={status}>{status}</option>
                                        ))}
                                    </select>
                                </div>
                                <div><Label className={labelStyle}>Expected Completion Date *</Label><Input required type="date" name="expectedCompletionDate" value={currentProject.expectedCompletionDate} onChange={handleInputChange} className={inputStyle} /></div>
                            </div>
                        </div>

                        <div className={cardStyle}>
                            <div className={cardHeaderStyle}>
                                <Layers className="w-5 h-5 mr-2 text-[#0b264f]" />
                                <h3 className="text-lg font-bold text-gray-900">Area & Inventory</h3>
                            </div>
                            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6 bg-white">
                                <div><Label className={labelStyle}>Total Land Area *</Label><Input required name="totalLandArea" value={currentProject.totalLandArea} onChange={handleInputChange} className={inputStyle} /></div>
                                <div><Label className={labelStyle}>Total Built-up Area *</Label><Input required name="totalBuiltUpArea" value={currentProject.totalBuiltUpArea} onChange={handleInputChange} className={inputStyle} /></div>
                                <div><Label className={labelStyle}>Total Units *</Label><Input required type="number" name="totalUnits" value={currentProject.totalUnits} onChange={handleInputChange} className={inputStyle} /></div>
                                <div className="md:col-span-2"><Label className={labelStyle}>Area Range / Sizes *</Label><Input required name="area" value={currentProject.area} onChange={handleInputChange} placeholder="e.g. 1200 - 2400 sqft or 2-5 Acres" className={inputStyle} /></div>
                                <div><Label className={labelStyle}>Inventory / Configurations *</Label><Input required name="inventory" value={currentProject.inventory} onChange={handleInputChange} placeholder="e.g. 2 BHK, 3 BHK, Commercial Plots" className={inputStyle} /></div>
                            </div>
                        </div>

                        <div className={cardStyle}>
                            <div className={cardHeaderStyle}>
                                <Landmark className="w-5 h-5 mr-2 text-[#0b264f]" />
                                <h3 className="text-lg font-bold text-gray-900">Financials & Approvals</h3>
                            </div>
                            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 bg-white">
                                <div><Label className={labelStyle}>Government Approvals Obtained *</Label><Input required name="governmentApprovalsObtained" value={currentProject.governmentApprovalsObtained} onChange={handleInputChange} className={inputStyle} /></div>
                                <div><Label className={labelStyle}>RERA Registration Number *</Label><Input required name="reraRegistrationNumber" value={currentProject.reraRegistrationNumber} onChange={handleInputChange} className={inputStyle} /></div>
                                <div>
                                    <Label className={labelStyle}>Bank Approvals *</Label>
                                    <select required name="bankApprovals" value={currentProject.bankApprovals} onChange={handleInputChange} className={selectStyle}>
                                        <option value="No">No</option>
                                        <option value="Yes">Yes</option>
                                    </select>
                                </div>
                                {currentProject.bankApprovals === 'Yes' && (
                                    <div className="animate-in fade-in slide-in-from-top-2"><Label className={labelStyle}>Names of Banks *</Label><Input required name="bankApprovalsName" value={currentProject.bankApprovalsName} onChange={handleInputChange} className={inputStyle} placeholder="e.g. HDFC, SBI" /></div>
                                )}
                                <div><Label className={labelStyle}>Project Cost (Approx) *</Label><Input required name="projectCost" value={currentProject.projectCost} onChange={handleInputChange} className={inputStyle} /></div>
                                <div>
                                    <Label className={labelStyle}>Existing Borrowings *</Label>
                                    <select required name="existingBorrowings" value={currentProject.existingBorrowings} onChange={handleInputChange} className={selectStyle}>
                                        <option value="No">No</option>
                                        <option value="Yes">Yes</option>
                                    </select>
                                </div>
                                {currentProject.existingBorrowings === 'Yes' && (
                                    <>
                                        <div className="animate-in fade-in slide-in-from-top-2">
                                            <Label className={labelStyle}>Borrowing Amount *</Label>
                                            <Input required name="existingBorrowingsAmount" value={currentProject.existingBorrowingsAmount} onChange={handleInputChange} className={inputStyle} placeholder="e.g. $50 Crores" />
                                        </div>
                                        <div className="animate-in fade-in slide-in-from-top-2">
                                            <Label className={labelStyle}>Purpose of Borrowing *</Label>
                                            <Input required name="existingBorrowingsPurpose" value={currentProject.existingBorrowingsPurpose} onChange={handleInputChange} className={inputStyle} placeholder="e.g. Construction Finance" />
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        <div className={cardStyle}>
                            <div className={cardHeaderStyle}>
                                <DollarSign className="w-3 h-3" />
                                <h3 className="text-lg font-bold text-gray-900">Pricing & Offerings</h3>
                            </div>
                            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 bg-white">
                                <div><Label className={labelStyle}>Selling Price *</Label><Input required name="sellingPrice" value={currentProject.sellingPrice} onChange={handleInputChange} className={inputStyle} /></div>
                                <div><Label className={labelStyle}>Pricing Offered *</Label><Input required name="pricingOffered" value={currentProject.pricingOffered} onChange={handleInputChange} className={inputStyle} /></div>
                                <div><Label className={labelStyle}>Security Offered Against Investment *</Label><Input required name="securityOffered" value={currentProject.securityOffered} onChange={handleInputChange} className={inputStyle} /></div>
                                <div><Label className={labelStyle}>Lock-in Period *</Label><Input required name="lockInPeriod" value={currentProject.lockInPeriod} onChange={handleInputChange} className={inputStyle} /></div>
                                <div>
                                    <Label className={labelStyle}>Buyback Guarantee? *</Label>
                                    <select required name="buybackGuarantee" value={currentProject.buybackGuarantee} onChange={handleInputChange} className={selectStyle}>
                                        <option value="No">No</option>
                                        <option value="Yes">Yes</option>
                                    </select>
                                </div>
                                {currentProject.buybackGuarantee === 'Yes' && (
                                    <div className="animate-in fade-in slide-in-from-top-2"><Label className={labelStyle}>Minimum Guarantee Offered *</Label><Input required name="buybackGuaranteeDetails" value={currentProject.buybackGuaranteeDetails} onChange={handleInputChange} className={inputStyle} placeholder="e.g. 10% after 3 years" /></div>
                                )}
                                <div>
                                    <Label className={labelStyle}>Available for Rent? *</Label>
                                    <select required name="availableForRent" value={currentProject.availableForRent} onChange={handleInputChange} className={selectStyle}>
                                        <option value="No">No</option>
                                        <option value="Yes">Yes</option>
                                    </select>
                                </div>
                                {currentProject.availableForRent === 'Yes' && (
                                    <div className="animate-in fade-in slide-in-from-top-2"><Label className={labelStyle}>Expected Rent</Label><Input name="expectedRent" value={currentProject.expectedRent} onChange={handleInputChange} className={inputStyle} placeholder="Optional" /></div>
                                )}
                                <div className="md:col-span-2"><Label className={labelStyle}>Exit & Resale Framework *</Label><Textarea required name="exitResaleFramework" value={currentProject.exitResaleFramework} onChange={handleInputChange} rows="2" className={inputStyle} /></div>
                                <div className="md:col-span-2"><Label className={labelStyle}>Marketing Responsibility for Investor Inventory *</Label><Input required name="marketingResponsibility" value={currentProject.marketingResponsibility} onChange={handleInputChange} className={inputStyle} /></div>
                                <div className="md:col-span-2"><Label className={labelStyle}>Additional Disclosures (Optional)</Label><Textarea name="additionalDisclosures" value={currentProject.additionalDisclosures} onChange={handleInputChange} rows="2" className={inputStyle} placeholder="Any other relevant details or risks..." /></div>
                            </div>
                        </div>

                        <div className={cardStyle}>
                            <div className={cardHeaderStyle}>
                                <Building2 className="w-5 h-5 mr-2 text-[#0b264f]" />
                                <h3 className="text-lg font-bold text-gray-900">Land & Specifications</h3>
                            </div>
                            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 bg-white">
                                <div>
                                    <Label className={labelStyle}>Land Ownership / Type *</Label>
                                    <select required name="landType" value={currentProject.landType} onChange={handleInputChange} className={selectStyle}>
                                        <option value="Owned Land">Owned Land</option>
                                        <option value="Joint Venture / Joint Development (JV/JDA)">Joint Venture / Joint Development (JV/JDA)</option>
                                        <option value="Leasehold Land">Leasehold Land</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                                {currentProject.landType === 'Other' && (
                                    <div className="animate-in fade-in slide-in-from-top-2">
                                        <Label className={labelStyle}>Specify Land Type *</Label>
                                        <Input required name="landTypeOther" value={currentProject.landTypeOther} onChange={handleInputChange} className={inputStyle} placeholder="e.g. Joint Development Agreement" />
                                    </div>
                                )}
                                <div className="md:col-span-2">
                                    <Label className={labelStyle}>Product Brochure (PDF / Document) *</Label>
                                    <div className="flex items-center gap-4 mt-1 bg-gray-50 p-4 rounded-xl border border-dashed border-gray-300">
                                        <div className="bg-white p-2.5 rounded-lg border border-gray-200 shadow-sm">
                                            <FileText className="w-6 h-6 text-[#0b264f]" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            {currentProject.projectBrochureUrl ? (
                                                <div>
                                                    <p className="text-xs font-semibold text-green-600 flex items-center gap-1"><CheckCircle className="w-3.5 h-3.5" /> Brochure Uploaded</p>
                                                    <a href={currentProject.projectBrochureUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline truncate block mt-0.5">{currentProject.projectBrochureUrl}</a>
                                                </div>
                                            ) : currentProject.projectBrochure ? (
                                                <div>
                                                    <p className="text-xs font-semibold text-amber-600">Selected: {currentProject.projectBrochure.name}</p>
                                                    <p className="text-[10px] text-gray-400">Ready to save</p>
                                                </div>
                                            ) : (
                                                <div>
                                                    <p className="text-xs font-semibold text-gray-600">No brochure uploaded</p>
                                                    <p className="text-[10px] text-gray-400">PDF, DOC up to 10MB</p>
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <Button type="button" variant="outline" className="relative h-9 text-xs border-gray-300 hover:bg-gray-100">
                                                <Upload className="w-3.5 h-3.5 mr-1.5" /> {currentProject.projectBrochureUrl || currentProject.projectBrochure ? 'Change' : 'Upload'}
                                                <input type="file" accept=".pdf,.doc,.docx" onChange={(e) => {
                                                    const file = e.target.files[0];
                                                    if (file) {
                                                        setCurrentProject(prev => ({ ...prev, projectBrochure: file }));
                                                    }
                                                }} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                                <div className="md:col-span-2">
                                    <Label className={labelStyle}>Project Specifications & Details *</Label>
                                    <Textarea required name="projectSpecifications" value={currentProject.projectSpecifications} onChange={handleInputChange} rows="5" placeholder="Enter specifications, construction materials, internal and external fittings, project highlights, etc." className={inputStyle} />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
                                <div className="bg-blue-50/50 border-b border-gray-100 px-6 py-4">
                                    <h3 className="text-lg font-bold text-[#0b264f] flex items-center"><ImagePlus className="w-5 h-5 mr-2" /> Project Images <span className="text-sm font-normal text-gray-500 ml-2">(Optional)</span></h3>
                                </div>
                                <div className="p-6 flex-1 flex flex-col">
                                    <div className="relative border-2 border-dashed border-gray-300 rounded-xl p-6 text-center bg-gray-50 hover:bg-gray-100 hover:border-[#0b264f] transition-all cursor-pointer group">
                                        <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                                        <ImagePlus className="w-8 h-8 text-gray-400 mb-2 mx-auto group-hover:text-[#0b264f] transition-colors" />
                                        <p className="text-sm font-semibold text-gray-700">Click or drag images here</p>
                                        <p className="text-xs text-gray-500 mt-1">Supports JPG, PNG, WEBP</p>
                                    </div>
                                    {currentProject.projectImages?.length > 0 && (
                                        <div className="mt-4 space-y-2">
                                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Selected Images ({currentProject.projectImages.length})</p>
                                            <div className="grid grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1 custom-scrollbar">
                                                {currentProject.projectImages.map((file, idx) => {
                                                    const src = typeof file === 'string' ? file : URL.createObjectURL(file);
                                                    const name = typeof file === 'string' ? `Image ${idx + 1}` : file.name;
                                                    return (
                                                        <div key={idx} className="relative group rounded-lg overflow-hidden border border-gray-200 aspect-video">
                                                            <img src={src} alt={name} className="w-full h-full object-cover" />
                                                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center">
                                                                <button type="button" onClick={() => removeImage(idx)} className="opacity-0 group-hover:opacity-100 bg-red-500 text-white rounded-full p-1 transition-all shadow"><X className="w-3 h-3" /></button>
                                                            </div>
                                                            <p className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs px-1.5 py-0.5 truncate">{name}</p>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
                                <div className="bg-blue-50/50 border-b border-gray-100 px-6 py-4 flex justify-between items-center">
                                    <h3 className="text-lg font-bold text-[#0b264f] flex items-center"><FileText className="w-5 h-5 mr-2" /> Official Documents</h3>
                                    <Button type="button" onClick={addDocumentRow} size="sm" variant="outline" className="h-8 text-xs border-[#0b264f] text-[#0b264f] hover:bg-[#0b264f] hover:text-white">
                                        <Plus className="w-3 h-3 mr-1" /> Add Document
                                    </Button>
                                </div>
                                <div className="p-6 flex-1 flex flex-col bg-gray-50/30">
                                    {!currentProject.projectDocuments || currentProject.projectDocuments.length === 0 ? (
                                        <div className="text-center py-10 text-gray-500 flex flex-col items-center justify-center h-full">
                                            <FileText className="w-12 h-12 text-gray-300 mb-3" />
                                            <p className="text-sm">No documents added yet.</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                                            {currentProject.projectDocuments.map((doc, idx) => (
                                                <div key={idx} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm animate-in fade-in">
                                                    <div className="flex justify-between items-center mb-3">
                                                        <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Document {idx + 1}</Label>
                                                        <button type="button" onClick={() => removeDocumentRow(idx)} className="text-red-400 hover:text-red-600 transition-colors"><Trash2 className="w-4 h-4" /></button>
                                                    </div>
                                                    <div className="space-y-3">
                                                        <Input placeholder="Document Name (e.g. Floor Plan)" value={doc.docName} onChange={(e) => updateDocumentName(idx, e.target.value)} className="bg-gray-50 h-9 text-sm border-gray-200" />
                                                        {doc.url && !doc.file ? (
                                                            <div className="text-xs font-medium text-green-600 bg-green-50 p-2 rounded-md border border-green-100 flex items-center"><CheckCircle className="w-3 h-3 mr-1" /> File Uploaded</div>
                                                        ) : (
                                                            <Input type="file" onChange={(e) => handleDocumentFileUpload(idx, e)} className="text-xs cursor-pointer file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        </div>{/* end space-y wrapper */}
                        <div className="pb-8" />
                    </form>
                )}

                {view === 'detail' && (
                    <div className="max-w-5xl mx-auto space-y-6">
                        <Button type="button" variant="ghost" onClick={() => setView('list')} className="text-gray-500 hover:text-[#0b264f]">
                            <ArrowLeft className="w-4 h-4 mr-2" /> Back to List
                        </Button>
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                            <div className="border-b border-gray-100 pb-6 mb-6 flex flex-col md:flex-row md:justify-between items-start gap-4">
                                <div>
                                    <h1 className="text-3xl font-bold text-[#0b264f] mb-2">{currentProject.projectName || 'Unnamed Project'}</h1>
                                    <p className="text-gray-500 flex items-center"><MapPin className="w-4 h-4 mr-1" /> {currentProject.projectLocation}</p>
                                </div>
                                <div className="flex flex-wrap items-center gap-2">
                                    {Array.isArray(currentProject.projectCategories) && currentProject.projectCategories.map(c => (
                                        <Badge key={c} className="bg-slate-100 text-slate-800 border border-slate-200 px-3 py-1.5 text-xs font-semibold">{c}</Badge>
                                    ))}
                                    {Array.isArray(currentProject.projectType) ? (
                                        currentProject.projectType.map(t => (
                                            <Badge key={t} className="bg-blue-50 text-blue-800 border border-blue-200 px-3 py-1.5 text-xs font-medium">{t}</Badge>
                                        ))
                                    ) : currentProject.projectType ? (
                                        <Badge className="bg-blue-50 text-blue-800 border border-blue-200 px-3 py-1.5 text-sm font-medium">{currentProject.projectType}</Badge>
                                    ) : null}
                                    <Badge className={`${currentProject.status === 'approved' ? 'bg-green-50 text-green-800' : 'bg-yellow-50 text-yellow-800'} border px-3 py-1.5 text-sm capitalize`}>{currentProject.status}</Badge>
                                </div>
                            </div>

                            {currentProject.status === 'rejected' && (
                                <div className="mb-8 bg-red-50 border border-red-200 rounded-xl p-6 shadow-sm">
                                    <h3 className="text-lg font-bold text-red-900 mb-2 flex items-center"><XCircle className="w-5 h-5 mr-2" /> Project Rejected</h3>
                                    <p className="text-sm text-red-800 mb-4">The administration team has rejected this listing. You can submit an appeal.</p>
                                    <Button onClick={() => setIsAppealModalOpen(true)} className="bg-red-600 hover:bg-red-700 text-white"><RefreshCw className="w-4 h-4 mr-2" /> Appeal Rejection</Button>
                                </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
                                {Object.entries(currentProject).map(([key, value]) => {
                                    if (IGNORED_DETAIL_KEYS.includes(key)) return null;
                                    const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
                                    if (key === 'bankApprovalsName' && currentProject.bankApprovals !== 'Yes') return null;
                                    if ((key === 'existingBorrowingsAmount' || key === 'existingBorrowingsPurpose') && currentProject.existingBorrowings !== 'Yes') return null;
                                    if (key === 'expectedRent' && currentProject.availableForRent !== 'Yes') return null;
                                    if (key === 'buybackGuaranteeDetails' && currentProject.buybackGuarantee !== 'Yes') return null;

                                    return (
                                        <div key={key} className={typeof value === 'string' && value.length > 50 ? "md:col-span-2" : ""}>
                                            <dt className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">{label}</dt>
                                            <dd className="text-sm font-medium text-gray-900 bg-gray-50 p-3.5 rounded-lg border border-gray-100 leading-relaxed whitespace-pre-wrap">{value || 'Not provided'}</dd>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Project Images Gallery */}
                            {Array.isArray(currentProject.projectImages) && currentProject.projectImages.length > 0 && (
                                <div className="mt-8">
                                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                                        <ImagePlus className="w-4 h-4" /> Project Images ({currentProject.projectImages.length})
                                    </h3>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                        {currentProject.projectImages.map((imgUrl, idx) => (
                                            typeof imgUrl === 'string' && imgUrl.startsWith('http') ? (
                                                <div key={idx} className="relative aspect-video rounded-xl overflow-hidden border border-gray-200 shadow-sm">
                                                    <img src={imgUrl} alt={`Project image ${idx + 1}`} className="w-full h-full object-cover hover:scale-105 transition-transform" />
                                                </div>
                                            ) : null
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Land Details & Brochure */}
                            <div className="mt-8 border-t border-gray-100 pt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <dt className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Land Ownership Type</dt>
                                    <dd className="text-sm font-medium text-gray-900 bg-gray-50 p-3.5 rounded-lg border border-gray-100 leading-relaxed">
                                        {currentProject.landType === 'Other' ? currentProject.landTypeOther || 'Other' : currentProject.landType || 'Not specified'}
                                    </dd>
                                </div>
                                {currentProject.projectBrochureUrl && (
                                    <div>
                                        <dt className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Product Brochure</dt>
                                        <dd className="text-sm font-medium text-gray-900 bg-gray-50 p-3 rounded-lg border border-gray-100 flex items-center justify-between">
                                            <span className="truncate max-w-[200px] text-xs font-mono text-gray-600">{currentProject.projectBrochureUrl.split('/').pop()}</span>
                                            <a href={currentProject.projectBrochureUrl} target="_blank" rel="noopener noreferrer" className="bg-[#0b264f] hover:bg-[#1a4b8c] text-white text-xs font-bold py-1.5 px-3 rounded-lg flex items-center gap-1.5 transition-colors">
                                                <Download className="w-3.5 h-3.5" /> Download PDF
                                            </a>
                                        </dd>
                                    </div>
                                )}
                            </div>

                            {/* Project Specifications */}
                            {currentProject.projectSpecifications && (
                                <div className="mt-6 border-t border-gray-100 pt-6">
                                    <dt className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Project Specifications & Materials</dt>
                                    <dd className="text-sm font-medium text-gray-600 bg-gray-50 p-4 rounded-lg border border-gray-100 leading-relaxed whitespace-pre-wrap">
                                        {currentProject.projectSpecifications}
                                    </dd>
                                </div>
                            )}

                            {/* Project Documents */}
                            {Array.isArray(currentProject.projectDocuments) && currentProject.projectDocuments.length > 0 && (
                                <div className="mt-6">
                                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                                        <FileText className="w-4 h-4" /> Documents ({currentProject.projectDocuments.length})
                                    </h3>
                                    <div className="space-y-2">
                                        {currentProject.projectDocuments.map((doc, idx) => (
                                            <div key={idx} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border border-gray-100">
                                                <div className="flex items-center gap-2">
                                                    <FileText className="w-4 h-4 text-[#0b264f]" />
                                                    <span className="text-sm font-medium text-gray-700">{doc.docName || `Document ${idx + 1}`}</span>
                                                    {doc.fileName && <span className="text-xs text-gray-400">({doc.fileName})</span>}
                                                </div>
                                                {doc.url && (
                                                    <a href={doc.url} target="_blank" rel="noopener noreferrer" className="text-xs text-[#0b264f] hover:underline font-semibold flex items-center gap-1">
                                                        <CheckCircle className="w-3 h-3" /> View
                                                    </a>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {currentProject.status === 'changes_requested' && currentProject.adminRequests && currentProject.adminRequests.length > 0 && (
                                <div className="mt-10 bg-orange-50 border border-orange-200 rounded-xl p-6 md:p-8 shadow-sm">
                                    <h3 className="text-lg font-bold text-orange-900 mb-2 flex items-center"><FileWarning className="w-5 h-5 mr-2" /> Admin Requested Changes</h3>
                                    <div className="space-y-5">
                                        {currentProject.adminRequests.map((req, idx) => (
                                            <div key={idx} className="bg-white p-4 rounded-lg border border-orange-100">
                                                <Label className="text-sm font-semibold text-orange-900 mb-2 block">{req.fieldName} *</Label>
                                                <Input type="text" onChange={(e) => setDynamicProjectData({ ...dynamicProjectData, [req.fieldName]: e.target.value })} className="bg-gray-50 border-orange-200" placeholder={`Enter ${req.fieldName}`} />
                                            </div>
                                        ))}
                                    </div>
                                    <Button onClick={handleDynamicSubmit} disabled={isLoading} className="mt-6 w-full bg-orange-600 hover:bg-orange-700 text-white h-12 text-md">
                                        {isLoading ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : 'Submit Requested Changes'}
                                    </Button>
                                </div>
                            )}

                            {currentProject.status !== 'pending' && (
                                <div className="mt-10 pt-6 border-t border-gray-100 flex justify-end">
                                    <Button onClick={() => handleEdit(currentProject)} className="bg-white hover:bg-gray-50 text-[#0b264f] border border-gray-200 shadow-sm h-11 px-6">
                                        <Edit className="w-4 h-4 mr-2" /> Edit Project Data
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            <Dialog open={isAppealModalOpen} onOpenChange={setIsAppealModalOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Appeal Project Rejection</DialogTitle>
                        <DialogDescription>Explain why this project should be reconsidered.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="reason">Reason for Appeal *</Label>
                            <Textarea id="reason" value={appealReason} onChange={(e) => setAppealReason(e.target.value)} placeholder="Explain your case..." className="min-h-[100px]" />
                        </div>
                        <Button onClick={handleAppealSubmit} disabled={isLoading || !appealReason.trim()} className="w-full bg-[#0b264f] hover:bg-[#1a4b8c] text-white">
                            {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : 'Submit Appeal'}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
