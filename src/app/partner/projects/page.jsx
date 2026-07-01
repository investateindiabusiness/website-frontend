"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Search, Edit, Trash2, Eye, ArrowLeft, Save, Building2, MapPin, FileText, ShieldAlert, CheckCircle, FileWarning, Loader2, Clock, XCircle, RefreshCw, LayoutDashboard, Layers, Landmark, IndianRupee, ImagePlus, X } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/AuthContext';
import { fetchBuilderProjects, createProject, updateProject, deleteProject, submitProjectChanges, appealProjectRejection, uploadFile } from '@/api';
import { compressImage } from '@/utils/imageCompressor';

const initialFormState = {
    projectName: '', builderName: '', projectOverview: '', projectLocation: '', projectType: 'Residential',
    totalLandArea: '', totalBuiltUpArea: '', totalUnits: '', currentConstructionStatus: '', expectedCompletionDate: '',
    governmentApprovalsObtained: '', reraRegistrationNumber: '', bankApprovals: 'No', bankApprovalsName: '',
    projectCost: '', existingBorrowings: 'No', existingBorrowingsAmount: '', existingBorrowingsPurpose: '', sellingPrice: '', pricingOffered: '',
    securityOffered: '', lockInPeriod: '', buybackGuarantee: 'No', buybackGuaranteeDetails: '', exitResaleFramework: '', marketingResponsibility: '',
    additionalDisclosures: '', availableForRent: 'No', expectedRent: '',
    projectImages: [],
    projectDocuments: []
};

const IGNORED_DETAIL_KEYS = [
    'id', 'builderId', 'status', 'projectName', 'projectType', 'projectLocation',
    'projectImages', 'projectDocuments', 'adminRequests', 'appealReason', 'createdAt', 'updatedAt', 'views', 'inquiries', 'createdBy', 'updatedBy'
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

    const [dynamicProjectData, setDynamicProjectData] = useState({});
    const [isAppealModalOpen, setIsAppealModalOpen] = useState(false);
    const [appealReason, setAppealReason] = useState('');

    const loadProjects = useCallback(async () => {
        if (!user?.uid) return;
        try {
            const data = await fetchBuilderProjects(user.uid);
            setProjects(data || []);
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
        setCurrentProject(prev => ({ ...prev, projectImages: [...(prev.projectImages || []), ...files] }));
    };

    const removeImage = (indexToRemove) => {
        setCurrentProject(prev => ({ ...prev, projectImages: (prev.projectImages || []).filter((_, idx) => idx !== indexToRemove) }));
    };

    const addDocumentRow = () => {
        setCurrentProject(prev => ({ ...prev, projectDocuments: [...(prev.projectDocuments || []), { docName: '', file: null, fileName: '' }] }));
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
        setCurrentProject(prev => ({ ...prev, projectDocuments: (prev.projectDocuments || []).filter((_, idx) => idx !== indexToRemove) }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            // Generate a project ID for folder naming
            const projectId = isEditing ? currentProject.id : `proj_${Date.now()}`;

            // Upload new image files via backend API
            const uploadedImages = [];
            for (const img of (currentProject.projectImages || [])) {
                if (img instanceof File) {
                    const response = await uploadFile(img, `${tempId}/ProjectDisplayImages`);
                    uploadedImages.push(response.url);
                } else uploadedImages.push(img);
            }

            // Upload new document files via backend API
            const uploadedDocs = [];
            for (const docObj of (currentProject.projectDocuments || [])) {
                if (docObj.file instanceof File) {
                    const response = await uploadFile(docObj.file, `${tempId}/ProjectDocuments`);
                    uploadedDocs.push({ docName: docObj.docName, fileName: docObj.file.name, url: response.url });
                } else uploadedDocs.push(docObj);
            }
            const payload = { ...currentProject, builderId: user.uid, updatedBy: user.email || user.name, projectImages: uploadedImages, projectDocuments: uploadedDocs };

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
            const payloadWithUser = { ...dynamicProjectData, updatedBy: user.email || user.name };
            await submitProjectChanges(currentProject.id, payloadWithUser);
            toast({ title: "Success", description: "Changes submitted for verification." });
            setDynamicProjectData({});
            loadProjects();
            setView('list');
        } catch (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); }
        finally { setIsLoading(false); }
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
        } catch (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); }
        finally { setIsLoading(false); }
    };

    const handleEdit = (project) => {
        const dataToLoad = project.hasPendingEdits ? { ...project, ...project.pendingEdits } : project;
        setCurrentProject({ ...initialFormState, ...dataToLoad, projectImages: dataToLoad.projectImages || [], projectDocuments: dataToLoad.projectDocuments || [] });
        setIsEditing(true);
        setView('form');
    };

    const handleViewDetails = (project) => {
        setCurrentProject({ ...initialFormState, ...project });
        setDynamicProjectData({});
        setView('detail');
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this project?')) {
            try {
                await deleteProject(id);
                toast({ title: "Deleted", description: "Project has been removed." });
                loadProjects();
            } catch (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); }
        }
    };

    const resetForm = () => {
        setCurrentProject(initialFormState);
        setIsEditing(false);
        setView('form');
    };

    const filteredProjects = projects.filter(p => p.projectName?.toLowerCase().includes(searchQuery.toLowerCase()));

    const inputStyle = "w-full p-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-[#0b264f]/20 focus:border-[#0b264f] bg-white text-sm transition-all";
    const selectStyle = "w-full p-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-[#0b264f]/20 focus:border-[#0b264f] bg-white text-sm transition-all";
    const labelStyle = "block text-sm font-semibold text-gray-700 mb-1.5";
    const cardStyle = "bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8";
    const cardHeaderStyle = "bg-gray-50/80 border-b border-gray-100 px-6 py-4 flex items-center";

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
            <div className="flex-grow container mx-auto px-4 py-8">
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
                                    <input type="text" placeholder="Search projects..." className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-[#0b264f] text-sm" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                                </div>
                                <Button onClick={resetForm} className="bg-[#0b264f] hover:bg-[#1a4b8c] text-white">
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
                                        {filteredProjects.length > 0 ? filteredProjects.map((project) => (
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
                                                    {project.status === 'approved' ? (
                                                        <Badge className="bg-green-100 text-green-800 border-none"><CheckCircle className="w-3 h-3 mr-1" /> Live</Badge>
                                                    ) : (
                                                        <Badge className="bg-yellow-100 text-yellow-800 border-none"><Clock className="w-3 h-3 mr-1" /> {project.status}</Badge>
                                                    )}
                                                </td>
                                                <td className="p-4">
                                                    <Badge variant="outline">{project.projectType}</Badge>
                                                </td>
                                                <td className="p-4 text-right space-x-2">
                                                    <button onClick={() => handleViewDetails(project)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><Eye className="w-4 h-4" /></button>
                                                    <button onClick={() => handleEdit(project)} className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg"><Edit className="w-4 h-4" /></button>
                                                    <button onClick={() => handleDelete(project.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                                                </td>
                                            </tr>
                                        )) : (
                                            <tr><td colSpan="4" className="p-8 text-center text-gray-500">No projects found.</td></tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {view === 'form' && (
                    <form onSubmit={handleSubmit} className="max-w-5xl mx-auto space-y-6">
                        <div className="flex items-center justify-between mb-4 sticky top-16 md:top-20 z-10 bg-gray-50/95 backdrop-blur py-4 border-b border-gray-200 shadow-sm px-4 rounded-xl">
                            <Button type="button" variant="ghost" onClick={() => setView('list')} className="text-gray-500"><ArrowLeft className="w-4 h-4 mr-2" /> Back</Button>
                            <h2 className="text-xl md:text-2xl font-bold text-gray-900">{isEditing ? 'Edit Project' : 'New Project Listing'}</h2>
                            <Button type="submit" disabled={isLoading} className="bg-[#0b264f] text-white">
                                {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 md:mr-2" />}
                                <span className="hidden md:inline">{isLoading ? 'Saving...' : 'Save & Submit'}</span>
                            </Button>
                        </div>

                        <div className={cardStyle}>
                            <div className={cardHeaderStyle}><LayoutDashboard className="w-5 h-5 mr-2" /><h3 className="font-bold">Basic Information</h3></div>
                            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 bg-white">
                                <div><Label className={labelStyle}>Project Name *</Label><Input required name="projectName" value={currentProject.projectName} onChange={handleInputChange} className={inputStyle} /></div>
                                <div><Label className={labelStyle}>Builder Name *</Label><Input required name="builderName" value={currentProject.builderName} onChange={handleInputChange} className={inputStyle} /></div>
                                <div className="md:col-span-2"><Label className={labelStyle}>Project Overview *</Label><Textarea required name="projectOverview" value={currentProject.projectOverview} onChange={handleInputChange} rows="3" className={inputStyle} /></div>
                                <div className="md:col-span-2"><Label className={labelStyle}>Project Location *</Label><Input required name="projectLocation" value={currentProject.projectLocation} onChange={handleInputChange} className={inputStyle} /></div>
                                <div>
                                    <Label className={labelStyle}>Project Type *</Label>
                                    <select required name="projectType" value={currentProject.projectType} onChange={handleInputChange} className={selectStyle}>
                                        <option value="Residential">Residential</option>
                                        <option value="Commercial">Commercial</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className={cardStyle}>
                            <div className={cardHeaderStyle}><ImagePlus className="w-5 h-5 mr-2" /><h3 className="font-bold">Media</h3></div>
                            <div className="p-6 bg-white">
                                <Input type="file" multiple accept="image/*" onChange={handleImageUpload} />
                                <div className="mt-4 flex flex-wrap gap-2">
                                    {currentProject.projectImages.map((img, idx) => (
                                        <div key={idx} className="relative w-20 h-20 bg-gray-100 rounded border">
                                            <button type="button" onClick={() => removeImage(idx)} className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5"><X className="w-3 h-3" /></button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </form>
                )}

                {view === 'detail' && (
                    <div className="max-w-5xl mx-auto space-y-6">
                        <Button type="button" variant="ghost" onClick={() => setView('list')} className="text-gray-500"><ArrowLeft className="w-4 h-4 mr-2" /> Back</Button>
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                            <h1 className="text-3xl font-bold text-[#0b264f] mb-4">{currentProject.projectName}</h1>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {Object.entries(currentProject).map(([key, value]) => {
                                    if (IGNORED_DETAIL_KEYS.includes(key) || typeof value === 'object') return null;
                                    return (
                                        <div key={key}>
                                            <dt className="text-xs font-semibold text-gray-500 uppercase mb-1">{key.replace(/([A-Z])/g, ' $1')}</dt>
                                            <dd className="text-sm font-medium p-3 bg-gray-50 rounded border">{value || '-'}</dd>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
}
