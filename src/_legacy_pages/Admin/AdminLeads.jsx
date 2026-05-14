import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Search, User, Phone, Mail, Building2, Calendar, Edit, Trash2, MessageSquare, Save } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { fetchAllLeads, updateLead, deleteLead } from '@/api';

const LEAD_STATUSES = ['New', 'Contacted', 'In Progress', 'Closed'];

const AdminLeads = () => {
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');

    const [selectedLead, setSelectedLead] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editForm, setEditForm] = useState({});

    useEffect(() => {
        loadLeads();
    }, []);

    const loadLeads = async () => {
        try {
            setLoading(true);
            const data = await fetchAllLeads();
            setLeads(data);
        } catch (error) {
            toast({ title: "Error", description: "Failed to load leads", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    const handleEditClick = (lead) => {
        setSelectedLead(lead);
        setEditForm({
            status: lead.status || 'New',
            adminNote: lead.adminNote || '',
            investorName: lead.investorName || '',
            investorPhone: lead.investorPhone || '',
            investorEmail: lead.investorEmail || ''
        });
        setIsModalOpen(true);
    };

    const handleSaveLead = async () => {
        try {
            await updateLead(selectedLead.id, editForm);
            toast({ title: "Success", description: "Lead updated successfully." });
            setIsModalOpen(false);
            loadLeads();
        } catch (error) {
            toast({ title: "Error", description: "Failed to update lead", variant: "destructive" });
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this lead? This action cannot be undone.")) {
            try {
                await deleteLead(id);
                toast({ title: "Deleted", description: "Lead removed successfully." });
                loadLeads();
            } catch (error) {
                toast({ title: "Error", description: "Failed to delete lead", variant: "destructive" });
            }
        }
    };

    const filteredLeads = leads.filter(lead => {
        const matchesSearch = (lead.investorName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
            (lead.projectName || '').toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'All' || lead.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
            <Header />

            <div className="flex-grow container mx-auto px-4 py-24 max-w-7xl">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Lead Management</h1>
                        <p className="text-gray-600">Track and manage investor inquiries.</p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                        <div className="relative flex-grow sm:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Search leads..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg outline-none focus:border-[#0b264f] text-sm shadow-sm"
                            />
                        </div>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="bg-white border border-gray-200 text-sm rounded-lg px-4 py-2 outline-none focus:border-[#0b264f] shadow-sm"
                        >
                            <option value="All">All Statuses</option>
                            {LEAD_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-100">
                                    <th className="p-4 font-semibold text-gray-600 text-xs uppercase tracking-wider">Date</th>
                                    <th className="p-4 font-semibold text-gray-600 text-xs uppercase tracking-wider">Investor Name</th>
                                    <th className="p-4 font-semibold text-gray-600 text-xs uppercase tracking-wider">Investor Email</th>
                                    <th className="p-4 font-semibold text-gray-600 text-xs uppercase tracking-wider">Investor Number</th>
                                    <th className="p-4 font-semibold text-gray-600 text-xs uppercase tracking-wider">Interested Project</th>
                                    <th className="p-4 font-semibold text-gray-600 text-xs uppercase tracking-wider">Status</th>
                                    <th className="p-4 font-semibold text-gray-600 text-xs uppercase tracking-wider text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {loading ? (
                                    <tr><td colSpan="5" className="p-8 text-center text-gray-500">Loading leads...</td></tr>
                                ) : filteredLeads.length === 0 ? (
                                    <tr><td colSpan="5" className="p-8 text-center text-gray-500">No leads found.</td></tr>
                                ) : (
                                    filteredLeads.map((lead) => (
                                        <tr key={lead.id} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="p-4 whitespace-nowrap">
                                                <div className="flex items-center text-sm text-gray-600">
                                                    <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                                                    {new Date(lead.createdAt).toLocaleDateString()}
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <div className="font-semibold text-gray-900">{lead.investorName}</div>
                                            </td>
                                            <td className="p-4">
                                                <div className="font-semibold text-gray-900">{lead.investorEmail}</div>
                                            </td>
                                            <td className="p-4">
                                                <div className="font-semibold text-gray-900">{lead.investorPhone}</div>
                                            </td>
                                            <td className="p-4">
                                                <div className="flex items-center text-sm font-medium text-[#0b264f]">
                                                    <Building2 className="w-4 h-4 mr-2 text-[#0b264f]/70" /> {lead.projectName}
                                                </div>
                                                {/* {lead.message && (
                          <p className="text-xs text-gray-500 mt-2 line-clamp-2 max-w-xs italic">"{lead.message}"</p>
                        )} */}
                                            </td>
                                            <td className="p-4">
                                                <Badge className={`
                          ${lead.status === 'New' ? 'bg-blue-100 text-blue-800' :
                                                        lead.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' :
                                                            lead.status === 'Closed' ? 'bg-gray-100 text-gray-800' :
                                                                'bg-green-100 text-green-800'} border-none shadow-none`}>
                                                    {lead.status || 'New'}
                                                </Badge>
                                            </td>
                                            <td className="p-4 text-right whitespace-nowrap">
                                                <Button variant="ghost" size="sm" onClick={() => handleEditClick(lead)} className="text-orange-600 hover:text-orange-700 hover:bg-orange-50 mr-2">
                                                    <Edit className="w-4 h-4" />
                                                </Button>
                                                <Button variant="ghost" size="sm" onClick={() => handleDelete(lead.id)} className="text-red-600 hover:text-red-700 hover:bg-red-50">
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* EDIT MODAL */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="sm:max-w-xl">
                    <DialogHeader>
                        <DialogTitle>Manage Lead</DialogTitle>
                    </DialogHeader>

                    {selectedLead && (
                        <div className="space-y-6 py-4">
                            {/* Read Only Info */}
                            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 text-sm space-y-2">
                                <p><span className="font-semibold text-gray-500">Project:</span> <span className="font-medium">{selectedLead.projectName}</span></p>
                                <p><span className="font-semibold text-gray-500">Investor Name:</span> {selectedLead.investorName}</p>
                                <p><span className="font-semibold text-gray-500">Investor Email:</span> {selectedLead.investorEmail}</p>
                                <p><span className="font-semibold text-gray-500">Investor Number:</span> {selectedLead.investorPhone}</p>
                                <p><span className="font-semibold text-gray-500">Submitted:</span> {new Date(selectedLead.createdAt).toLocaleString()}</p>
                            </div>

                            {/* Edit Status & Notes */}
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Lead Status</Label>
                                        <select
                                            className="w-full p-2.5 bg-white border border-gray-300 rounded-lg text-sm outline-none focus:border-[#0b264f]"
                                            value={editForm.status}
                                            onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                                        >
                                            {LEAD_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                                        </select>
                                    </div>
                                    {/* <div className="space-y-2">
                                        <Label>Investor Name</Label>
                                        <Input value={editForm.investorName} onChange={(e) => setEditForm({ ...editForm, investorName: e.target.value })} />
                                    </div> */}
                                </div>

                                <div className="space-y-2">
                                    <Label className="flex items-center"><MessageSquare className="w-4 h-4 mr-2" /> Internal Admin Note</Label>
                                    <Textarea
                                        placeholder="Add private notes about this lead (e.g. Called on Tuesday, sent brochure...)"
                                        value={editForm.adminNote}
                                        onChange={(e) => setEditForm({ ...editForm, adminNote: e.target.value })}
                                        rows="4"
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t">
                                <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                                <Button onClick={handleSaveLead} className="bg-[#0b264f] hover:bg-[#1a4b8c] text-white">
                                    <Save className="w-4 h-4 mr-2" /> Save Changes
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            <Footer />
        </div>
    );
};

export default AdminLeads;