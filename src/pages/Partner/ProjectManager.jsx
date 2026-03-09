import React, { useState, useEffect } from 'react';
import {
    Plus, Search, Edit, Trash2, Eye, ArrowLeft,
    Save, Upload, Building2, MapPin, FileText
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

// Form initial state mapping exactly to your image fields
const initialFormState = {
    projectName: '',
    builderName: '',
    projectOverviewAndLocation: '',
    projectType: 'Residential', // Dropdown: Residential / Commercial
    totalLandArea: '',
    totalBuiltUpArea: '',
    totalUnits: '',
    currentConstructionStatus: '',
    expectedCompletionDate: '',
    governmentApprovalsObtained: '',
    reraRegistrationNumber: '',
    bankApprovals: '', // Yes/No - Names
    projectCost: '',
    existingBorrowings: '', // Yes/No - Amount & Purpose
    sellingPrice: '',
    pricingOffered: '',
    securityOffered: '',
    lockInPeriod: '',
    buybackGuarantee: '',
    exitResaleFramework: '',
    marketingResponsibility: '',
    additionalDisclosures: '',
    expectedRent: '', // Optional Field
    documents: [] // Mock state for file uploads
};

const ProjectManager = () => {
    // State Management
    const [view, setView] = useState('list'); // 'list', 'form', 'detail'
    const [projects, setProjects] = useState([]);
    const [currentProject, setCurrentProject] = useState(initialFormState);
    const [isEditing, setIsEditing] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // --- MOCK DATABASE FETCH (Replace with your actual Node.js API call) ---
    useEffect(() => {
        // Example: fetch('/api/projects').then(res => res.json()).then(data => setProjects(data))
        setProjects([
            { ...initialFormState, id: 1, projectName: 'Imperial Heights', location: 'Mumbai', projectType: 'Residential', totalUnits: '120' }
        ]);
    }, []);

    // --- CRUD HANDLERS ---
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCurrentProject(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            if (isEditing) {
                await axios.patch(`http://localhost:5000/api/projects/${currentProject.id}`, currentProject);
            } else {
                await axios.post('http://localhost:5000/api/projects', currentProject);
            }
            setView('list');
        } catch (error) {
            console.error("Error saving project:", error);
            alert('Failed to save project.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleEdit = (project) => {
        setCurrentProject(project);
        setIsEditing(true);
        setView('form');
    };

    const handleViewDetails = (project) => {
        setCurrentProject(project);
        setView('detail');
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this project?')) {
            // DELETE LOGIC (e.g., axios.delete(`/api/projects/${id}`))
            setProjects(projects.filter(p => p.id !== id));
        }
    };

    const resetForm = () => {
        setCurrentProject(initialFormState);
        setIsEditing(false);
        setView('form');
    };

    // --- RENDER HELPERS ---
    const filteredProjects = projects.filter(p =>
        p.projectName?.toLowerCase().includes(searchQuery.toLowerCase())
    );

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
                                <p className="text-gray-500 text-sm">Manage all your property listings in one place.</p>
                            </div>
                            <div className="flex w-full md:w-auto gap-3">
                                <div className="relative flex-grow md:w-64">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                                    <input
                                        type="text"
                                        placeholder="Search projects..."
                                        className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-[#0b264f] transition-colors text-sm"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
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
                                            <th className="p-4 font-semibold text-gray-600 text-sm">Type</th>
                                            <th className="p-4 font-semibold text-gray-600 text-sm">Units</th>
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
                                                        <MapPin className="w-3 h-3" /> {project.projectOverviewAndLocation || 'Location TBA'}
                                                    </div>
                                                </td>
                                                <td className="p-4">
                                                    <Badge variant="outline">{project.projectType}</Badge>
                                                </td>
                                                <td className="p-4 text-sm text-gray-600">{project.totalUnits || 'N/A'}</td>
                                                <td className="p-4 text-right space-x-2">
                                                    <button onClick={() => handleViewDetails(project)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="View">
                                                        <Eye className="w-4 h-4" />
                                                    </button>
                                                    <button onClick={() => handleEdit(project)} className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors" title="Edit">
                                                        <Edit className="w-4 h-4" />
                                                    </button>
                                                    <button onClick={() => handleDelete(project.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
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
                    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-6">
                        <div className="flex items-center justify-between mb-6">
                            <Button type="button" variant="ghost" onClick={() => setView('list')} className="text-gray-500 hover:text-[#0b264f]">
                                <ArrowLeft className="w-4 h-4 mr-2" /> Back to List
                            </Button>
                            <h2 className="text-2xl font-bold text-gray-900">{isEditing ? 'Edit Project' : 'New Project Listing'}</h2>
                        </div>

                        {/* Logical Groupings for UI clarity */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 space-y-8">

                            {/* Basic Info */}
                            <section>
                                <h3 className="text-lg font-bold text-[#0b264f] border-b pb-2 mb-4">Basic Information</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Project Name *</label>
                                        <input required type="text" name="projectName" value={currentProject.projectName} onChange={handleInputChange} className="w-full p-2.5 border border-gray-300 rounded-lg outline-none focus:border-[#0b264f]" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Builder Name *</label>
                                        <input required type="text" name="builderName" value={currentProject.builderName} onChange={handleInputChange} className="w-full p-2.5 border border-gray-300 rounded-lg outline-none focus:border-[#0b264f]" />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Project Overview and Location</label>
                                        <textarea name="projectOverviewAndLocation" value={currentProject.projectOverviewAndLocation} onChange={handleInputChange} rows="3" className="w-full p-2.5 border border-gray-300 rounded-lg outline-none focus:border-[#0b264f]"></textarea>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Project Type</label>
                                        <select name="projectType" value={currentProject.projectType} onChange={handleInputChange} className="w-full p-2.5 border border-gray-300 rounded-lg outline-none focus:border-[#0b264f]">
                                            <option value="Residential">Residential</option>
                                            <option value="Commercial">Commercial</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Current Construction Status</label>
                                        <input type="text" name="currentConstructionStatus" value={currentProject.currentConstructionStatus} onChange={handleInputChange} className="w-full p-2.5 border border-gray-300 rounded-lg outline-none focus:border-[#0b264f]" placeholder="e.g., Under Construction, 50% Complete" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Expected Completion Date</label>
                                        <input type="date" name="expectedCompletionDate" value={currentProject.expectedCompletionDate} onChange={handleInputChange} className="w-full p-2.5 border border-gray-300 rounded-lg outline-none focus:border-[#0b264f]" />
                                    </div>
                                </div>
                            </section>

                            {/* Area & Units */}
                            <section>
                                <h3 className="text-lg font-bold text-[#0b264f] border-b pb-2 mb-4">Area & Inventory</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Total Land Area</label>
                                        <input type="text" name="totalLandArea" value={currentProject.totalLandArea} onChange={handleInputChange} className="w-full p-2.5 border border-gray-300 rounded-lg outline-none focus:border-[#0b264f]" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Total Built-up Area</label>
                                        <input type="text" name="totalBuiltUpArea" value={currentProject.totalBuiltUpArea} onChange={handleInputChange} className="w-full p-2.5 border border-gray-300 rounded-lg outline-none focus:border-[#0b264f]" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Total Units</label>
                                        <input type="number" name="totalUnits" value={currentProject.totalUnits} onChange={handleInputChange} className="w-full p-2.5 border border-gray-300 rounded-lg outline-none focus:border-[#0b264f]" />
                                    </div>
                                </div>
                            </section>

                            {/* Financials & Compliance */}
                            <section>
                                <h3 className="text-lg font-bold text-[#0b264f] border-b pb-2 mb-4">Financials & Approvals</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Government Approvals Obtained</label>
                                        <input type="text" name="governmentApprovalsObtained" value={currentProject.governmentApprovalsObtained} onChange={handleInputChange} className="w-full p-2.5 border border-gray-300 rounded-lg outline-none focus:border-[#0b264f]" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">RERA Registration Number</label>
                                        <input type="text" name="reraRegistrationNumber" value={currentProject.reraRegistrationNumber} onChange={handleInputChange} className="w-full p-2.5 border border-gray-300 rounded-lg outline-none focus:border-[#0b264f]" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Bank Approvals (Names)</label>
                                        <input type="text" name="bankApprovals" value={currentProject.bankApprovals} onChange={handleInputChange} placeholder="Yes - HDFC, SBI..." className="w-full p-2.5 border border-gray-300 rounded-lg outline-none focus:border-[#0b264f]" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Project Cost (Approx)</label>
                                        <input type="text" name="projectCost" value={currentProject.projectCost} onChange={handleInputChange} className="w-full p-2.5 border border-gray-300 rounded-lg outline-none focus:border-[#0b264f]" />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Existing Borrowings (Amount & Purpose)</label>
                                        <input type="text" name="existingBorrowings" value={currentProject.existingBorrowings} onChange={handleInputChange} placeholder="Yes/No - Detail if yes" className="w-full p-2.5 border border-gray-300 rounded-lg outline-none focus:border-[#0b264f]" />
                                    </div>
                                </div>
                            </section>

                            {/* Pricing & Investment Details */}
                            <section>
                                <h3 className="text-lg font-bold text-[#0b264f] border-b pb-2 mb-4">Pricing & Investment Offerings</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Selling Price</label>
                                        <input type="text" name="sellingPrice" value={currentProject.sellingPrice} onChange={handleInputChange} className="w-full p-2.5 border border-gray-300 rounded-lg outline-none focus:border-[#0b264f]" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Pricing Offered</label>
                                        <input type="text" name="pricingOffered" value={currentProject.pricingOffered} onChange={handleInputChange} className="w-full p-2.5 border border-gray-300 rounded-lg outline-none focus:border-[#0b264f]" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Security Offered Against Investment</label>
                                        <input type="text" name="securityOffered" value={currentProject.securityOffered} onChange={handleInputChange} className="w-full p-2.5 border border-gray-300 rounded-lg outline-none focus:border-[#0b264f]" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Lock-in Period</label>
                                        <input type="text" name="lockInPeriod" value={currentProject.lockInPeriod} onChange={handleInputChange} className="w-full p-2.5 border border-gray-300 rounded-lg outline-none focus:border-[#0b264f]" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Buyback Guarantee</label>
                                        <input type="text" name="buybackGuarantee" value={currentProject.buybackGuarantee} onChange={handleInputChange} className="w-full p-2.5 border border-gray-300 rounded-lg outline-none focus:border-[#0b264f]" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Expected Rent (Optional)</label>
                                        <input type="text" name="expectedRent" value={currentProject.expectedRent} onChange={handleInputChange} placeholder="If investment is retained" className="w-full p-2.5 border border-gray-300 rounded-lg outline-none focus:border-[#0b264f]" />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Exit & Resale Framework</label>
                                        <textarea name="exitResaleFramework" value={currentProject.exitResaleFramework} onChange={handleInputChange} rows="2" className="w-full p-2.5 border border-gray-300 rounded-lg outline-none focus:border-[#0b264f]"></textarea>
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Marketing Responsibility for Investor Inventory</label>
                                        <input type="text" name="marketingResponsibility" value={currentProject.marketingResponsibility} onChange={handleInputChange} className="w-full p-2.5 border border-gray-300 rounded-lg outline-none focus:border-[#0b264f]" />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Additional Disclosures (Optional)</label>
                                        <textarea name="additionalDisclosures" value={currentProject.additionalDisclosures} onChange={handleInputChange} rows="2" className="w-full p-2.5 border border-gray-300 rounded-lg outline-none focus:border-[#0b264f]"></textarea>
                                    </div>
                                </div>
                            </section>

                            {/* Documents Box */}
                            <section className="bg-blue-50/50 p-6 rounded-xl border border-blue-100">
                                <h3 className="text-lg font-bold text-[#0b264f] mb-2 flex items-center"><FileText className="w-5 h-5 mr-2" /> Document Uploads</h3>
                                <p className="text-sm text-gray-500 mb-4">Upload Floor Plans, Permissions, Schedule of property, DGPA, etc.</p>
                                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:bg-gray-50 transition-colors cursor-pointer flex flex-col items-center justify-center">
                                    <Upload className="w-8 h-8 text-gray-400 mb-2" />
                                    <span className="text-sm font-medium text-gray-600">Click to upload files or drag and drop</span>
                                    <span className="text-xs text-gray-400 mt-1">PDF, JPG, PNG up to 10MB</span>
                                    <input type="file" multiple className="hidden" /> {/* Functionality to be wired later */}
                                </div>
                            </section>

                        </div>

                        <div className="flex justify-end gap-4 mt-6">
                            <Button type="button" variant="outline" onClick={() => setView('list')}>Cancel</Button>
                            <Button type="submit" disabled={isLoading} className="bg-[#0b264f] hover:bg-[#1a4b8c] text-white">
                                <Save className="w-4 h-4 mr-2" /> {isLoading ? 'Saving...' : 'Save Listing'}
                            </Button>
                        </div>
                    </form>
                )}

                {/* --- DETAIL VIEW --- */}
                {view === 'detail' && (
                    <div className="max-w-4xl mx-auto space-y-6">
                        <Button type="button" variant="ghost" onClick={() => setView('list')} className="text-gray-500 hover:text-[#0b264f]">
                            <ArrowLeft className="w-4 h-4 mr-2" /> Back to List
                        </Button>

                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                            <div className="border-b pb-6 mb-6 flex justify-between items-start">
                                <div>
                                    <h1 className="text-3xl font-bold text-[#0b264f] mb-2">{currentProject.projectName || 'Unnamed Project'}</h1>
                                    <p className="text-gray-500 flex items-center"><MapPin className="w-4 h-4 mr-1" /> {currentProject.projectOverviewAndLocation || 'Location not specified'}</p>
                                </div>
                                <Badge className="bg-blue-100 text-blue-800 border-none px-3 py-1 text-sm">{currentProject.projectType}</Badge>
                            </div>

                            {/* Using a simple grid to display read-only pairs */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
                                {Object.entries(currentProject).map(([key, value]) => {
                                    // Skip internal fields or large text blocks for the simple grid
                                    if (['id', 'projectName', 'projectType', 'projectOverviewAndLocation', 'documents'].includes(key)) return null;

                                    // Format camelCase key to readable label
                                    const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());

                                    return (
                                        <div key={key}>
                                            <dt className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">{label}</dt>
                                            <dd className="text-sm font-medium text-gray-900">{value || '--'}</dd>
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="mt-8 flex justify-end">
                                <Button onClick={() => handleEdit(currentProject)} className="bg-orange-50 hover:bg-orange-100 text-orange-600 border border-orange-200">
                                    <Edit className="w-4 h-4 mr-2" /> Edit Details
                                </Button>
                            </div>
                        </div>
                    </div>
                )}

            </div>
            <Footer />
        </div>
    );
};

export default ProjectManager;