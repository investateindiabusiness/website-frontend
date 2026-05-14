"use client";

import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Search, Building2, Calendar, Edit, Trash2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { fetchAllLeads, updateLead, deleteLead } from '@/api';

export default function AdminLeads() {
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

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
                                            <Button variant="ghost" size="sm"><Edit className="w-4 h-4" /></Button>
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
