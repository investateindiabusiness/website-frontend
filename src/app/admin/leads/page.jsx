"use client";

import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Search, Building2, Calendar, Edit, Trash2, Mail, Phone, Save } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { fetchAllLeads, updateLead, deleteLead } from '@/api';

export default function AdminLeads() {
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedLead, setSelectedLead] = useState(null);
    const [statusValue, setStatusValue] = useState('New');
    const [saving, setSaving] = useState(false);

    const loadLeads = async () => {
        try {
            setLoading(true);
            const data = await fetchAllLeads();
            setLeads(data || []);
        } catch (error) {
            toast({ title: "Error", description: "Failed to load leads", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadLeads();
    }, []);

    const handleEditClick = (lead) => {
        setSelectedLead(lead);
        setStatusValue(lead.status || 'New');
        setIsModalOpen(true);
    };

    const handleSaveStatus = async () => {
        if (!selectedLead) return;
        try {
            setSaving(true);
            await updateLead(selectedLead.id, { status: statusValue });
            toast({ title: "Success", description: "Lead status updated successfully" });
            setIsModalOpen(false);
            loadLeads();
        } catch (error) {
            toast({ title: "Error", description: "Failed to update status", variant: "destructive" });
        } finally {
            setSaving(false);
        }
    };

    const filteredLeads = leads.filter(lead =>
        (lead.investorName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (lead.projectName || '').toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
            <Header />
            <div className="flex-grow container mx-auto px-4 py-24 max-w-7xl">
                <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-8">
                    <div><h1 className="text-3xl font-bold text-gray-900 mb-2">Lead Management</h1><p className="text-gray-600">Track and manage investor inquiries.</p></div>
                    <div className="relative w-full md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-9" />
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="p-4 text-xs uppercase text-gray-600">Date</th>
                                <th className="p-4 text-xs uppercase text-gray-600">Investor</th>
                                <th className="p-4 text-xs uppercase text-gray-600">Project</th>
                                <th className="p-4 text-xs uppercase text-gray-600">Status</th>
                                <th className="p-4 text-xs uppercase text-gray-600 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {loading ? (
                                <tr><td colSpan="5" className="p-8 text-center">Loading...</td></tr>
                            ) : filteredLeads.length === 0 ? (
                                <tr><td colSpan="5" className="p-8 text-center">No leads.</td></tr>
                            ) : (
                                filteredLeads.map((lead) => (
                                    <tr key={lead.id} className="hover:bg-gray-50">
                                        <td className="p-4 text-sm text-gray-600">{new Date(lead.createdAt).toLocaleDateString()}</td>
                                        <td className="p-4 font-semibold">{lead.investorName}</td>
                                        <td className="p-4 text-sm"><Building2 className="w-4 h-4 inline mr-1" /> {lead.projectName}</td>
                                        <td className="p-4"><Badge>{lead.status || 'New'}</Badge></td>
                                        <td className="p-4 text-right">
                                            <Button variant="ghost" size="sm" onClick={() => handleEditClick(lead)}><Edit className="w-4 h-4" /></Button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="max-w-md bg-white rounded-2xl p-6" aria-describedby={undefined}>
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold text-gray-900">Lead Details</DialogTitle>
                    </DialogHeader>
                    {selectedLead && (
                        <div className="space-y-4 mt-4">
                            <div className="grid grid-cols-2 gap-4 border-b pb-4">
                                <div>
                                    <Label className="text-xs text-gray-400 font-semibold uppercase">Investor</Label>
                                    <p className="text-sm font-semibold text-gray-800">{selectedLead.investorName}</p>
                                </div>
                                <div>
                                    <Label className="text-xs text-gray-400 font-semibold uppercase">Project Name</Label>
                                    <p className="text-sm font-semibold text-gray-800 flex items-center gap-1.5"><Building2 className="w-3.5 h-3.5 text-gray-400" /> {selectedLead.projectName}</p>
                                </div>
                                {selectedLead.investorEmail && (
                                    <div>
                                        <Label className="text-xs text-gray-400 font-semibold uppercase">Email Address</Label>
                                        <p className="text-sm font-semibold text-gray-800 flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-gray-400" /> {selectedLead.investorEmail}</p>
                                    </div>
                                )}
                                {selectedLead.investorPhone && (
                                    <div>
                                        <Label className="text-xs text-gray-400 font-semibold uppercase">Phone Number</Label>
                                        <p className="text-sm font-semibold text-gray-800 flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-gray-400" /> {selectedLead.investorPhone}</p>
                                    </div>
                                )}
                            </div>

                            {selectedLead.message && (
                                <div>
                                    <Label className="text-xs text-gray-400 font-semibold uppercase block mb-1">Investor Message</Label>
                                    <div className="bg-gray-50 border rounded-xl p-3.5 text-sm text-gray-700 min-h-[60px] max-h-[120px] overflow-y-auto italic">
                                        "{selectedLead.message}"
                                    </div>
                                </div>
                            )}

                            <div className="space-y-2">
                                <Label className="text-xs text-gray-400 font-semibold uppercase">Lead Status</Label>
                                <select
                                    value={statusValue}
                                    onChange={(e) => setStatusValue(e.target.value)}
                                    className="w-full h-10 px-3 rounded-lg border border-gray-200 bg-white text-sm outline-none focus:border-[#0b264f] transition-all"
                                >
                                    <option value="New">New</option>
                                    <option value="Interested">Interested</option>
                                    <option value="Contacted">Contacted</option>
                                    <option value="Closed">Closed</option>
                                </select>
                            </div>

                            <div className="flex gap-3 justify-end pt-4 border-t">
                                <Button variant="outline" onClick={() => setIsModalOpen(false)} disabled={saving}>Cancel</Button>
                                <Button className="bg-[#0b264f] hover:bg-blue-900 text-white flex items-center gap-1.5" onClick={handleSaveStatus} disabled={saving}>
                                    <Save className="w-4 h-4" /> {saving ? "Saving..." : "Save Status"}
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            <Footer />
        </div>
    );
}

function Input({ className, ...props }) {
    return <input className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ${className}`} {...props} />;
}
