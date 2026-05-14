import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Search, Phone, Mail, Calendar, Edit, Trash2, MessageSquare, Save, HelpCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { fetchAllInquiries, updateInquiry, deleteInquiry } from '@/api';

const INQUIRY_STATUSES = ['New', 'Contacted', 'In Progress', 'Closed'];

const AdminInquiries = () => {
    const [inquiries, setInquiries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');

    const [selectedInquiry, setSelectedInquiry] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editForm, setEditForm] = useState({});

    useEffect(() => {
        loadInquiries();
    }, []);

    const loadInquiries = async () => {
        try {
            setLoading(true);
            const data = await fetchAllInquiries();
            setInquiries(data);
        } catch (error) {
            toast({ title: "Error", description: "Failed to load inquiries", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    const handleEditClick = (inquiry) => {
        setSelectedInquiry(inquiry);
        setEditForm({
            status: inquiry.status || 'New',
            adminNote: inquiry.adminNote || ''
        });
        setIsModalOpen(true);
    };

    const handleSaveInquiry = async () => {
        try {
            await updateInquiry(selectedInquiry.id, editForm);
            toast({ title: "Success", description: "Inquiry updated successfully." });
            setIsModalOpen(false);
            loadInquiries();
        } catch (error) {
            toast({ title: "Error", description: "Failed to update inquiry", variant: "destructive" });
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this inquiry? This action cannot be undone.")) {
            try {
                await deleteInquiry(id);
                toast({ title: "Deleted", description: "Inquiry removed successfully." });
                loadInquiries();
            } catch (error) {
                toast({ title: "Error", description: "Failed to delete inquiry", variant: "destructive" });
            }
        }
    };

    const filteredInquiries = inquiries.filter(inq => {
        const matchesSearch = (inq.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                              (inq.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                              (inq.subject || '').toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'All' || inq.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
            <Header />

            <div className="flex-grow container mx-auto px-4 py-24 max-w-7xl">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">General Inquiries</h1>
                        <p className="text-gray-600">Manage submissions from the Contact Us page.</p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                        <div className="relative flex-grow sm:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Search names, emails..."
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
                            {INQUIRY_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-100">
                                    <th className="p-4 font-semibold text-gray-600 text-xs uppercase tracking-wider">Date</th>
                                    <th className="p-4 font-semibold text-gray-600 text-xs uppercase tracking-wider">Name</th>
                                    <th className="p-4 font-semibold text-gray-600 text-xs uppercase tracking-wider">Email</th>
                                    <th className="p-4 font-semibold text-gray-600 text-xs uppercase tracking-wider">Contact No.</th>
                                    <th className="p-4 font-semibold text-gray-600 text-xs uppercase tracking-wider">Subject</th>
                                    <th className="p-4 font-semibold text-gray-600 text-xs uppercase tracking-wider">Message</th>
                                    <th className="p-4 font-semibold text-gray-600 text-xs uppercase tracking-wider">Status</th>
                                    <th className="p-4 font-semibold text-gray-600 text-xs uppercase tracking-wider text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {loading ? (
                                    <tr><td colSpan="8" className="p-8 text-center text-gray-500">Loading inquiries...</td></tr>
                                ) : filteredInquiries.length === 0 ? (
                                    <tr><td colSpan="8" className="p-8 text-center text-gray-500">No inquiries found.</td></tr>
                                ) : (
                                    filteredInquiries.map((inq) => (
                                        <tr key={inq.id} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="p-4 whitespace-nowrap align-top">
                                                <div className="flex items-center text-sm text-gray-600 mt-1">
                                                    <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                                                    {new Date(inq.createdAt).toLocaleDateString()}
                                                </div>
                                            </td>
                                            <td className="p-4 align-top">
                                                <div className="font-semibold text-gray-900">{inq.name}</div>
                                            </td>
                                            <td className="p-4 align-top">
                                                <div className="font-semibold text-gray-900">{inq.email}</div>
                                            </td>
                                            <td className="p-4 align-top">
                                                <div className="font-semibold text-gray-900">{inq.phone}</div>
                                            </td>
                                            <td className="p-4 max-w-md">
                                                <div className="flex items-center text-sm font-bold text-[#0b264f] mb-1">
                                                    {inq.subject}
                                                </div>
                                            </td>
                                            <td className="p-4 max-w-md">
                                                <div className="flex items-center text-sm font-bold text-[#0b264f] mb-1">
                                                    {inq.message}
                                                </div>
                                            </td>
                                            <td className="p-4 align-top">
                                                <Badge className={`
                                                    ${inq.status === 'New' ? 'bg-blue-100 text-blue-800' :
                                                      inq.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' :
                                                      inq.status === 'Closed' ? 'bg-gray-100 text-gray-800' :
                                                      'bg-green-100 text-green-800'} border-none shadow-none mt-1`}>
                                                    {inq.status || 'New'}
                                                </Badge>
                                            </td>
                                            <td className="p-4 text-right whitespace-nowrap align-top">
                                                <Button variant="ghost" size="sm" onClick={() => handleEditClick(inq)} className="text-orange-600 hover:text-orange-700 hover:bg-orange-50 mr-2">
                                                    <Edit className="w-4 h-4" />
                                                </Button>
                                                <Button variant="ghost" size="sm" onClick={() => handleDelete(inq.id)} className="text-red-600 hover:text-red-700 hover:bg-red-50">
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
                <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Manage Inquiry</DialogTitle>
                    </DialogHeader>

                    {selectedInquiry && (
                        <div className="space-y-6 py-4">
                            {/* Read Only Info */}
                            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 text-sm space-y-3">
                                <div className="grid grid-cols-2 gap-4">
                                    <p><span className="font-semibold text-gray-500 block text-xs uppercase mb-1">Name</span> {selectedInquiry.name}</p>
                                    <p><span className="font-semibold text-gray-500 block text-xs uppercase mb-1">Date</span> {new Date(selectedInquiry.createdAt).toLocaleString()}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <p><span className="font-semibold text-gray-500 block text-xs uppercase mb-1">Email</span> {selectedInquiry.email}</p>
                                    <p><span className="font-semibold text-gray-500 block text-xs uppercase mb-1">Phone</span> {selectedInquiry.phone}</p>
                                </div>
                                
                                <div className="pt-3 border-t border-gray-200">
                                    <p><span className="font-semibold text-gray-500 block text-xs uppercase mb-1">Subject</span> <span className="font-bold text-[#0b264f]">{selectedInquiry.subject ? (selectedInquiry.subject.charAt(0).toUpperCase() + selectedInquiry.subject.slice(1)) : 'General Inquiry'}</span></p>
                                </div>
                                <div>
                                    <p><span className="font-semibold text-gray-500 block text-xs uppercase mb-1">Message</span> <span className="whitespace-pre-wrap">{selectedInquiry.message}</span></p>
                                </div>
                            </div>

                            {/* Edit Status & Notes */}
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Inquiry Status</Label>
                                    <select
                                        className="w-full p-2.5 bg-white border border-gray-300 rounded-lg text-sm outline-none focus:border-[#0b264f]"
                                        value={editForm.status}
                                        onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                                    >
                                        {INQUIRY_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <Label className="flex items-center"><MessageSquare className="w-4 h-4 mr-2" /> Internal Admin Note</Label>
                                    <Textarea
                                        placeholder="Add private notes about this inquiry (e.g. Responded via email on Tuesday...)"
                                        value={editForm.adminNote}
                                        onChange={(e) => setEditForm({ ...editForm, adminNote: e.target.value })}
                                        rows="3"
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t">
                                <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                                <Button onClick={handleSaveInquiry} className="bg-[#0b264f] hover:bg-[#1a4b8c] text-white">
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

export default AdminInquiries;