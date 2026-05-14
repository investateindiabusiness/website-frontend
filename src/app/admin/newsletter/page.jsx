"use client";

import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Search, Mail, Calendar, Trash2, CheckCircle, XCircle, Power, Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { fetchAllNewsletterSubscribers, updateNewsletterSubscriber, deleteNewsletterSubscriber } from '@/api';

export default function AdminNewsletter() {
    const [subscribers, setSubscribers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');

    const loadSubscribers = async () => {
        try {
            setLoading(true);
            const data = await fetchAllNewsletterSubscribers();
            setSubscribers(data || []);
        } catch (error) {
            toast({ title: "Error", description: "Failed to load subscribers", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadSubscribers(); }, []);

    const handleToggleStatus = async (subscriber) => {
        const newStatus = subscriber.status === 'Active' ? 'Inactive' : 'Active';
        try {
            await updateNewsletterSubscriber(subscriber.id, { status: newStatus });
            toast({ title: "Success", description: `Subscriber marked as ${newStatus}.` });
            loadSubscribers();
        } catch (error) {
            toast({ title: "Error", description: "Failed to update status", variant: "destructive" });
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Delete this subscriber permanently?")) {
            try {
                await deleteNewsletterSubscriber(id);
                toast({ title: "Deleted", description: "Subscriber removed successfully." });
                loadSubscribers();
            } catch (error) {
                toast({ title: "Error", description: "Failed to delete subscriber", variant: "destructive" });
            }
        }
    };

    const filteredSubscribers = subscribers.filter(sub => {
        const matchesSearch = (sub.email || '').toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'All' || sub.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
            <Header />
            <div className="flex-grow container mx-auto px-4 py-24 max-w-7xl">
                <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Newsletter</h1>
                        <p className="text-gray-600">Manage investor emails collected from the landing page.</p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input type="text" placeholder="Search emails..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg outline-none text-sm shadow-sm" />
                        </div>
                        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="bg-white border border-gray-200 text-sm rounded-lg px-4 py-2 outline-none shadow-sm">
                            <option value="All">All Statuses</option>
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                        </select>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="p-4 text-xs uppercase text-gray-600">Date Subscribed</th>
                                <th className="p-4 text-xs uppercase text-gray-600">Email Address</th>
                                <th className="p-4 text-xs uppercase text-gray-600">Status</th>
                                <th className="p-4 text-xs uppercase text-gray-600 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {loading ? (
                                <tr><td colSpan="4" className="p-8 text-center"><Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-[#0b264f]" /> Loading...</td></tr>
                            ) : filteredSubscribers.length === 0 ? (
                                <tr><td colSpan="4" className="p-8 text-center text-gray-500">No emails found.</td></tr>
                            ) : (
                                filteredSubscribers.map((sub) => (
                                    <tr key={sub.id} className="hover:bg-gray-50">
                                        <td className="p-4 text-sm text-gray-600">
                                            <Calendar className="w-4 h-4 inline mr-1 text-gray-400" />
                                            {new Date(sub.subscribedAt || sub.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="p-4 text-sm font-semibold">
                                            <Mail className="w-4 h-4 inline mr-1 text-gray-400" />{sub.email}
                                        </td>
                                        <td className="p-4">
                                            <Badge className={`${sub.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'} border-none`}>
                                                {sub.status === 'Active' ? <CheckCircle className="w-3 h-3 inline mr-1" /> : <XCircle className="w-3 h-3 inline mr-1" />}
                                                {sub.status || 'Active'}
                                            </Badge>
                                        </td>
                                        <td className="p-4 text-right">
                                            <Button variant="ghost" size="sm" onClick={() => handleToggleStatus(sub)} className={`${sub.status === 'Active' ? 'text-orange-600 hover:bg-orange-50' : 'text-green-600 hover:bg-green-50'} mr-2`}>
                                                <Power className="w-4 h-4" />
                                            </Button>
                                            <Button variant="ghost" size="sm" onClick={() => handleDelete(sub.id)} className="text-red-600 hover:bg-red-50">
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
            <Footer />
        </div>
    );
}
