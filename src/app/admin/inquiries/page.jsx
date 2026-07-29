"use client";

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Search, Phone, Mail, Calendar, Edit, Trash2, MessageSquare, Save } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { fetchAllInquiries, updateInquiry, deleteInquiry } from '@/api';

export default function AdminInquiries() {
    const [inquiries, setInquiries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedInquiry, setSelectedInquiry] = useState(null);
    const [statusValue, setStatusValue] = useState('New');
    const [saving, setSaving] = useState(false);

    const loadInquiries = async () => {
        try {
            setLoading(true);
            const data = await fetchAllInquiries();
            setInquiries(data || []);
        } catch (error) {
            toast({ title: "Error", description: "Failed to load inquiries", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadInquiries();
    }, []);

    const handleEditClick = (inq) => {
        setSelectedInquiry(inq);
        setStatusValue(inq.status || 'New');
        setIsModalOpen(true);
    };

    const handleSaveStatus = async () => {
        if (!selectedInquiry) return;
        try {
            setSaving(true);
            await updateInquiry(selectedInquiry.id, { status: statusValue });
            toast({ title: "Success", description: "Inquiry status updated successfully" });
            setIsModalOpen(false);
            loadInquiries();
        } catch (error) {
            toast({ title: "Error", description: "Failed to update status", variant: "destructive" });
        } finally {
            setSaving(false);
        }
    };

    const filteredInquiries = inquiries.filter(inq => 
        (inq.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (inq.email || '').toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="font-sans">
            <div className="flex-grow container mx-auto px-4 py-6 sm:py-8 max-w-7xl">
                <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
                    <div><h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">General Inquiries</h1><p className="text-gray-600 text-sm">Submissions from Contact Us page.</p></div>
                    <div className="relative w-full md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-9" />
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 border-b">
                                <tr>
                                    <th className="p-4 text-xs uppercase text-gray-600">Date</th>
                                    <th className="p-4 text-xs uppercase text-gray-600">Name</th>
                                    <th className="p-4 text-xs uppercase text-gray-600">Email</th>
                                    <th className="p-4 text-xs uppercase text-gray-600">Status</th>
                                    <th className="p-4 text-xs uppercase text-gray-600 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {loading ? (
                                    <tr><td colSpan="5" className="p-8 text-center">Loading...</td></tr>
                                ) : filteredInquiries.length === 0 ? (
                                    <tr><td colSpan="5" className="p-8 text-center">No inquiries.</td></tr>
                                ) : (
                                    filteredInquiries.map((inq) => (
                                        <tr key={inq.id} className="hover:bg-gray-50">
                                            <td className="p-4 text-sm text-gray-600">{new Date(inq.createdAt).toLocaleDateString()}</td>
                                            <td className="p-4 font-semibold">{inq.name}</td>
                                            <td className="p-4">{inq.email}</td>
                                            <td className="p-4"><Badge>{inq.status || 'New'}</Badge></td>
                                            <td className="p-4 text-right">
                                                <Button variant="ghost" size="sm" onClick={() => handleEditClick(inq)}><Edit className="w-4 h-4" /></Button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="max-w-md bg-white rounded-2xl p-6" aria-describedby={undefined}>
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold text-gray-900">Inquiry Details</DialogTitle>
                    </DialogHeader>
                    {selectedInquiry && (
                        <div className="space-y-4 mt-4">
                            <div className="grid grid-cols-2 gap-4 border-b pb-4">
                                <div>
                                    <Label className="text-xs text-gray-400 font-semibold uppercase">Investor Name</Label>
                                    <p className="text-sm font-semibold text-gray-800">{selectedInquiry.name}</p>
                                </div>
                                <div>
                                    <Label className="text-xs text-gray-400 font-semibold uppercase">Email Address</Label>
                                    <p className="text-sm font-semibold text-gray-800 flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-gray-400" /> {selectedInquiry.email}</p>
                                </div>
                                <div className="col-span-2 pt-2">
                                    <Label className="text-xs text-gray-400 font-semibold uppercase">Phone Number</Label>
                                    <p className="text-sm font-semibold text-gray-800 flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-gray-400" /> {selectedInquiry.phone || 'N/A'}</p>
                                </div>
                            </div>

                            <div>
                                <Label className="text-xs text-gray-400 font-semibold uppercase block mb-1">Message / Inquiry Text</Label>
                                <div className="bg-gray-50 border rounded-xl p-3.5 text-sm text-gray-700 min-h-[80px] max-h-[160px] overflow-y-auto italic">
                                    "{selectedInquiry.message || selectedInquiry.comment || 'No message provided.'}"
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-xs text-gray-400 font-semibold uppercase">Inquiry Status</Label>
                                <select 
                                    value={statusValue} 
                                    onChange={(e) => setStatusValue(e.target.value)} 
                                    className="w-full h-10 px-3 rounded-lg border border-gray-200 bg-white text-sm outline-none focus:border-[#0b264f] transition-all"
                                >
                                    <option value="New">New</option>
                                    <option value="Contacted">Contacted</option>
                                    <option value="Resolved">Resolved</option>
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
        </div>
    );
}

function Input({ className, ...props }) {
  return <input className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ${className}`} {...props} />;
}
