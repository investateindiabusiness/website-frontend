import React, { useState, useEffect, useCallback } from 'react';
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
import { fetchBuilderProjects, createProject, updateProject, deleteProject, submitProjectChanges, appealProjectRejection } from '@/api';

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

const ProjectManager = () => {
    const { user } = useAuth();
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
            setProjects(data);
        } catch (error) {
            toast({
                title: "Error loading projects",
                description: error.message,
                variant: "destructive"
            });
        }
    }, [user]);
    
    useEffect(() => {
        if (user?.uid) {
            loadProjects();
        }
    }, [user, loadProjects]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCurrentProject(prev => ({ ...prev, [name]: value }));
    };

    // --- UPLOAD HANDLERS ---
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
    // -----------------------

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const payload = {
                ...currentProject,
                builderId: user.uid,
                updatedBy: user.email || user.name,
                projectImages: (currentProject.projectImages || []).map(img => img.name || img),
                projectDocuments: (currentProject.projectDocuments || []).map(doc => ({ docName: doc.docName, fileName: doc.fileName }))
            };

            console.log("--- [FRONTEND] SUBMITTING PROJECT ---");
            console.log("Is Editing?", isEditing);
            console.log("Payload:", payload);

            if (isEditing) {
                await updateProject(currentProject.id, payload);
                toast({ title: "Success", description: "Project updated. Submitted for admin verification." });
            } else {
                payload.createdBy = user.email || user.name;
                await createProject(payload);
                toast({ title: "Success", description: "Project created. Submitted for admin verification." });
            }

            console.log("--- [FRONTEND] RE-FETCHING PROJECTS ---");
            loadProjects();
            setView('list');
        } catch (error) {
            console.error("! FRONTEND SUBMIT ERROR:", error);
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
        // If they have pending edits, load those into the form instead of the live data!
        const dataToLoad = project.hasPendingEdits
            ? { ...project, ...project.pendingEdits }
            : project;

        setCurrentProject({
            ...initialFormState,
            ...dataToLoad,
            projectImages: dataToLoad.projectImages || [],
            projectDocuments: dataToLoad.projectDocuments || []
        });
        setIsEditing(true);
        setView('form');
    };

    const handleViewDetails = (project) => {
        // Fix: Merge initialFormState to ensure legacy DB entries don't crash the arrays
        setCurrentProject({
            ...initialFormState,
            ...project
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

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
            <Header />

            <div className="flex-grow container mx-auto px-4 py-8 mt-16 md:mt-24">

                {/* --- LIST VIEW --- */}
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
                        </div>
                    </div>
                )}

                {/* --- ADD/EDIT FORM VIEW --- */}
                {view === 'form' && (
                    <form onSubmit={handleSubmit} className="max-w-5xl mx-auto space-y-6">

                        <div className="flex items-center justify-between mb-4 sticky top-16 md:top-20 z-10 bg-gray-50/95 backdrop-blur py-4 border-b border-gray-200 shadow-sm px-4 rounded-xl">
                            <Button type="button" variant="ghost" onClick={() => setView('list')} className="text-gray-500 hover:text-[#0b264f]">
                                <ArrowLeft className="w-4 h-4 mr-2" /> Back
                            </Button>
                            <h2 className="text-xl md:text-2xl font-bold text-gray-900">{isEditing ? 'Edit Project' : 'New Project Listing'}</h2>
                            <Button type="submit" disabled={isLoading} className="bg-[#0b264f] hover:bg-[#1a4b8c] text-white">
                                {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 md:mr-2" />}
                                <span className="hidden md:inline">{isLoading ? 'Saving...' : 'Save & Submit'}</span>
                            </Button>
                        </div>

                        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-4 rounded-xl text-sm flex gap-3 mb-6 mx-2">
                            <ShieldAlert className="w-5 h-5 flex-shrink-0 mt-0.5" />
                            <p><strong>Verification Required:</strong> Submitting this form sends it for Administrator Review. The project will not be visible to investors until approved.</p>
                        </div>

                        {/* Section 1: Basic Info */}
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
                                <div>
                                    <Label className={labelStyle}>Project Type *</Label>
                                    <select required name="projectType" value={currentProject.projectType} onChange={handleInputChange} className={selectStyle}>
                                        <option value="Residential">Residential</option>
                                        <option value="Commercial">Commercial</option>
                                    </select>
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

                        {/* Section 2: Area & Units */}
                        <div className={cardStyle}>
                            <div className={cardHeaderStyle}>
                                <Layers className="w-5 h-5 mr-2 text-[#0b264f]" />
                                <h3 className="text-lg font-bold text-gray-900">Area & Inventory</h3>
                            </div>
                            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6 bg-white">
                                <div><Label className={labelStyle}>Total Land Area *</Label><Input required name="totalLandArea" value={currentProject.totalLandArea} onChange={handleInputChange} className={inputStyle} /></div>
                                <div><Label className={labelStyle}>Total Built-up Area *</Label><Input required name="totalBuiltUpArea" value={currentProject.totalBuiltUpArea} onChange={handleInputChange} className={inputStyle} /></div>
                                <div><Label className={labelStyle}>Total Units *</Label><Input required type="number" name="totalUnits" value={currentProject.totalUnits} onChange={handleInputChange} className={inputStyle} /></div>
                            </div>
                        </div>

                        {/* Section 3: Approvals & Finance */}
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
                                        <option value="No">No</option><option value="Yes">Yes</option>
                                    </select>
                                </div>
                                {currentProject.bankApprovals === 'Yes' && (
                                    <div className="animate-in fade-in slide-in-from-top-2"><Label className={labelStyle}>Names of Banks *</Label><Input required name="bankApprovalsName" value={currentProject.bankApprovalsName} onChange={handleInputChange} className={inputStyle} placeholder="e.g. HDFC, SBI" /></div>
                                )}
                                <div><Label className={labelStyle}>Project Cost (Approx) *</Label><Input required name="projectCost" value={currentProject.projectCost} onChange={handleInputChange} className={inputStyle} /></div>
                                <div>
                                    <Label className={labelStyle}>Existing Borrowings *</Label>
                                    <select required name="existingBorrowings" value={currentProject.existingBorrowings} onChange={handleInputChange} className={selectStyle}>
                                        <option value="No">No</option><option value="Yes">Yes</option>
                                    </select>
                                </div>
                                {currentProject.existingBorrowings === 'Yes' && (
                                    <>
                                        <div className="animate-in fade-in slide-in-from-top-2">
                                            <Label className={labelStyle}>Borrowing Amount *</Label>
                                            <Input required name="existingBorrowingsAmount" value={currentProject.existingBorrowingsAmount} onChange={handleInputChange} className={inputStyle} placeholder="e.g. ₹50 Crores" />
                                        </div>
                                        <div className="animate-in fade-in slide-in-from-top-2">
                                            <Label className={labelStyle}>Purpose of Borrowing *</Label>
                                            <Input required name="existingBorrowingsPurpose" value={currentProject.existingBorrowingsPurpose} onChange={handleInputChange} className={inputStyle} placeholder="e.g. Construction Finance" />
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Section 4: Pricing & Investment */}
                        <div className={cardStyle}>
                            <div className={cardHeaderStyle}>
                                <IndianRupee className="w-5 h-5 mr-2 text-[#0b264f]" />
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
                                        <option value="No">No</option><option value="Yes">Yes</option>
                                    </select>
                                </div>
                                {currentProject.buybackGuarantee === 'Yes' && (
                                    <div className="animate-in fade-in slide-in-from-top-2"><Label className={labelStyle}>Minimum Guarantee Offered *</Label><Input required name="buybackGuaranteeDetails" value={currentProject.buybackGuaranteeDetails} onChange={handleInputChange} className={inputStyle} placeholder="e.g. 10% after 3 years" /></div>
                                )}

                                <div>
                                    <Label className={labelStyle}>Available for Rent? *</Label>
                                    <select required name="availableForRent" value={currentProject.availableForRent} onChange={handleInputChange} className={selectStyle}>
                                        <option value="No">No</option><option value="Yes">Yes</option>
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

                        {/* Section 5: Media & Documents */}
                        {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">

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
                                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Selected Images</p>
                                            <div className="max-h-40 overflow-y-auto pr-2 custom-scrollbar space-y-2">
                                                {currentProject.projectImages.map((file, idx) => (
                                                    <div key={idx} className="flex items-center justify-between bg-gray-50 p-2 rounded-lg border border-gray-100 text-sm">
                                                        <span className="truncate pr-4 text-gray-700">{file.name || file}</span>
                                                        <button type="button" onClick={() => removeImage(idx)} className="text-gray-400 hover:text-red-500 p-1"><X className="w-4 h-4" /></button>
                                                    </div>
                                                ))}
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
                                            <p className="text-xs mt-1">Click "Add Document" to upload plans, permits, etc.</p>
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
                                                        <div className="flex items-center gap-2">
                                                            <Input type="file" onChange={(e) => handleDocumentFileUpload(idx, e)} className="text-xs cursor-pointer file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                        </div> */}

                    </form>
                )}

                {/* --- DETAIL VIEW --- */}
                {view === 'detail' && (
                    <div className="max-w-5xl mx-auto space-y-6">
                        <Button type="button" variant="ghost" onClick={() => setView('list')} className="text-gray-500 hover:text-[#0b264f]">
                            <ArrowLeft className="w-4 h-4 mr-2" /> Back to List
                        </Button>

                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                            <div className="border-b border-gray-100 pb-6 mb-6 flex flex-col md:flex-row md:justify-between items-start gap-4">
                                <div>
                                    <h1 className="text-3xl font-bold text-[#0b264f] mb-2">{currentProject.projectName || 'Unnamed Project'}</h1>
                                    <p className="text-gray-500 flex items-center"><MapPin className="w-4 h-4 mr-1" /> {currentProject.projectLocation || 'Location not specified'}</p>
                                </div>
                                <div className="flex flex-wrap items-center gap-2">
                                    <Badge className="bg-blue-50 text-blue-800 border border-blue-200 px-3 py-1.5 text-sm">{currentProject.projectType}</Badge>
                                    {currentProject.status === 'approved' ? (
                                        <Badge className="bg-green-50 text-green-800 border border-green-200 px-3 py-1.5 text-sm"><CheckCircle className="w-3.5 h-3.5 mr-1.5" /> Live</Badge>
                                    ) : currentProject.status === 'changes_requested' ? (
                                        <Badge className="bg-orange-50 text-orange-800 border border-orange-200 px-3 py-1.5 text-sm"><FileWarning className="w-3.5 h-3.5 mr-1.5" /> Action Required</Badge>
                                    ) : currentProject.status === 'rejected' ? (
                                        <Badge className="bg-red-50 text-red-800 border border-red-200 px-3 py-1.5 text-sm"><XCircle className="w-3.5 h-3.5 mr-1.5" /> Rejected</Badge>
                                    ) : (
                                        <Badge className="bg-yellow-50 text-yellow-800 border border-yellow-200 px-3 py-1.5 text-sm"><Clock className="w-3.5 h-3.5 mr-1.5" /> Under Review</Badge>
                                    )}
                                </div>
                            </div>

                            {/* REJECTION APPEAL BANNER */}
                            {currentProject.status === 'rejected' && (
                                <div className="mb-8 bg-red-50 border border-red-200 rounded-xl p-6 shadow-sm">
                                    <h3 className="text-lg font-bold text-red-900 mb-2 flex items-center">
                                        <XCircle className="w-5 h-5 mr-2" /> Project Rejected
                                    </h3>
                                    <p className="text-sm text-red-800 mb-4">The administration team has rejected this listing. If you believe this was a mistake, you can submit an appeal.</p>
                                    <Button onClick={() => setIsAppealModalOpen(true)} className="bg-red-600 hover:bg-red-700 text-white">
                                        <RefreshCw className="w-4 h-4 mr-2" /> Appeal Rejection
                                    </Button>
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
                                        <div key={key} className={value?.length > 50 ? "md:col-span-2" : ""}>
                                            <dt className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">{label}</dt>
                                            <dd className="text-sm font-medium text-gray-900 bg-gray-50 p-3.5 rounded-lg border border-gray-100 leading-relaxed whitespace-pre-wrap">{value || 'Not provided'}</dd>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* DYNAMIC ADMIN REQUESTS SECTION */}
                            {currentProject.status === 'changes_requested' && currentProject.adminRequests && currentProject.adminRequests.length > 0 && (
                                <div className="mt-10 bg-orange-50 border border-orange-200 rounded-xl p-6 md:p-8 shadow-sm">
                                    <h3 className="text-lg font-bold text-orange-900 mb-2 flex items-center">
                                        <FileWarning className="w-5 h-5 mr-2" /> Admin Requested Changes
                                    </h3>
                                    <p className="text-sm text-orange-800 mb-6">Please provide the following additional details to get your project verified.</p>

                                    <div className="space-y-5">
                                        {currentProject.adminRequests.map((req, idx) => (
                                            <div key={idx} className="bg-white p-4 rounded-lg border border-orange-100">
                                                <Label className="text-sm font-semibold text-orange-900 mb-2 block">{req.fieldName} *</Label>
                                                {req.type === 'file' ? (
                                                    <Input type="file" onChange={(e) => setDynamicProjectData({ ...dynamicProjectData, [req.fieldName]: e.target.files[0]?.name })} className="bg-gray-50 border-orange-200" />
                                                ) : (
                                                    <Input type="text" onChange={(e) => setDynamicProjectData({ ...dynamicProjectData, [req.fieldName]: e.target.value })} className="bg-gray-50 border-orange-200" placeholder={`Enter ${req.fieldName}`} />
                                                )}
                                            </div>
                                        ))}
                                    </div>

                                    <Button onClick={handleDynamicSubmit} disabled={isLoading} className="mt-6 w-full bg-orange-600 hover:bg-orange-700 text-white h-12 text-md">
                                        {isLoading ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : 'Submit Requested Changes'}
                                    </Button>
                                </div>
                            )}

                            {/* Can't edit if under review to prevent conflicts */}
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

            {/* APPEAL MODAL */}
            <Dialog open={isAppealModalOpen} onOpenChange={setIsAppealModalOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Appeal Project Rejection</DialogTitle>
                        <DialogDescription>
                            Please explain why this project should be reconsidered for approval. The administration team will review your reason.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="reason">Reason for Appeal *</Label>
                            <Textarea
                                id="reason"
                                value={appealReason}
                                onChange={(e) => setAppealReason(e.target.value)}
                                placeholder="E.g., I have updated the legal clearance documents..."
                                className="min-h-[100px] focus:ring-[#0b264f] focus:border-[#0b264f]"
                            />
                        </div>
                        <Button onClick={handleAppealSubmit} disabled={isLoading || !appealReason.trim()} className="w-full bg-[#0b264f] hover:bg-[#1a4b8c] text-white">
                            {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : 'Submit Appeal'}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            <Footer />
        </div>
    );
};

export default ProjectManager;