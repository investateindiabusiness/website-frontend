"use client";

import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
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

    const filteredInquiries = inquiries.filter(inq => 
        (inq.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (inq.email || '').toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
            <Header />
            <div className="flex-grow container mx-auto px-4 py-24 max-w-7xl">
                <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-8">
                    <div><h1 className="text-3xl font-bold text-gray-900 mb-2">General Inquiries</h1><p className="text-gray-600">Submissions from Contact Us page.</p></div>
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
                                            <Button variant="ghost" size="sm" onClick={() => { setSelectedInquiry(inq); setIsModalOpen(true); }}><Edit className="w-4 h-4" /></Button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            <Footer />
        </div>
    );
}

function Input({ className, ...props }) {
  return <input className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ${className}`} {...props} />;
}
