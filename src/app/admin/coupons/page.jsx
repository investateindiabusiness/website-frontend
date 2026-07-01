"use client";

import React, { useState, useEffect, useRef } from 'react';
import { fetchAdminCoupons, createAdminCoupon, deleteAdminCoupon, resetAdminCoupon, fetchAdminUsers } from '@/api';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, Tag, Loader2, RotateCcw, Search, Users, Globe, User, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/AuthContext';

export default function AdminCoupons() {
  const { user } = useAuth();
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  // Form state
  const [formData, setFormData] = useState({
    code: '',
    discountAmount: '',
    type: 'custom',
    maxUses: 1,
    validFrom: '',
    validUntil: ''
  });

  // User-search state for coupon assignment
  const [couponTarget, setCouponTarget] = useState('marketing'); // 'marketing' | 'user'
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [userSearchResults, setUserSearchResults] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isSearchingUsers, setIsSearchingUsers] = useState(false);
  const userSearchRef = useRef(null);
  const searchDebounceRef = useRef(null);

  useEffect(() => {
    if (user?.role === 'admin') loadCoupons();
  }, [user]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (userSearchRef.current && !userSearchRef.current.contains(e.target)) {
        setUserSearchResults([]);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const loadCoupons = async () => {
    try {
      setLoading(true);
      const res = await fetchAdminCoupons();
      setCoupons(res.data || []);
    } catch (err) {
      toast({ title: "Failed to load coupons", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleUserSearch = (q) => {
    setUserSearchQuery(q);
    setSelectedUser(null);
    if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
    if (!q.trim()) { setUserSearchResults([]); return; }
    searchDebounceRef.current = setTimeout(async () => {
      try {
        setIsSearchingUsers(true);
        const res = await fetchAdminUsers({ search: q, limit: 8 });
        setUserSearchResults(res.data || res.users || []);
      } catch {
        setUserSearchResults([]);
      } finally {
        setIsSearchingUsers(false);
      }
    }, 350);
  };

  const handleSelectUser = (u) => {
    setSelectedUser(u);
    setUserSearchQuery(u.name || u.email || u.uid);
    setUserSearchResults([]);
  };

  const handleCreateCoupon = async (e) => {
    e.preventDefault();
    if (!formData.code || !formData.discountAmount) {
      return toast({ title: "Validation Error", description: "Code and discount amount are required.", variant: "destructive" });
    }
    if (couponTarget === 'user' && !selectedUser) {
      return toast({ title: "Validation Error", description: "Please select a user to assign this coupon to.", variant: "destructive" });
    }

    try {
      setIsSubmitting(true);
      const payload = {
        ...formData,
        discountAmount: Number(formData.discountAmount),
        maxUses: Number(formData.maxUses),
        validFrom: formData.validFrom ? new Date(formData.validFrom).toISOString() : null,
        validUntil: formData.validUntil ? new Date(formData.validUntil).toISOString() : null,
        assignedTo: couponTarget === 'user' ? (selectedUser?.uid || null) : null,
      };

      await createAdminCoupon(payload);
      toast({ title: "Coupon Created", description: "The coupon has been successfully created." });
      setIsModalOpen(false);
      resetForm();
      loadCoupons();
    } catch (err) {
      toast({ title: "Creation Failed", description: err.message, variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({ code: '', discountAmount: '', type: 'custom', maxUses: 1, validFrom: '', validUntil: '' });
    setCouponTarget('marketing');
    setSelectedUser(null);
    setUserSearchQuery('');
    setUserSearchResults([]);
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this coupon?")) return;
    try {
      await deleteAdminCoupon(id);
      toast({ title: "Coupon Deleted", description: "Coupon has been removed." });
      loadCoupons();
    } catch (err) {
      toast({ title: "Delete Failed", description: err.message, variant: "destructive" });
    }
  };

  const handleReset = async (id, code) => {
    if (!confirm(`Reset usage count for coupon "${code}" back to 0?`)) return;
    try {
      await resetAdminCoupon(id);
      toast({ title: 'Coupon Reset', description: `${code} usage count has been reset to 0.` });
      loadCoupons();
    } catch (err) {
      toast({ title: 'Reset Failed', description: err.message, variant: 'destructive' });
    }
  };

  if (!user || user.role !== 'admin') return null;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <div className="flex-grow flex pt-0">
        <main className="flex-1 p-6 md:p-10 overflow-x-hidden">
          
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
                <Tag className="w-8 h-8 text-[#0b264f]" />
                Coupon Management
              </h1>
              <p className="text-slate-500 text-sm mt-1">Create and manage advertisement coupons — marketing or user-specific.</p>
            </div>
            <Button 
              onClick={() => setIsModalOpen(true)}
              className="bg-[#0b264f] hover:bg-[#1a4b8c] text-white rounded-xl shadow-md"
            >
              <Plus className="w-4 h-4 mr-2" /> Create Coupon
            </Button>
          </div>

          <Card className="border-none shadow-md rounded-2xl bg-white overflow-hidden">
            <CardHeader className="bg-slate-50 border-b border-slate-100 py-4 px-6">
              <CardTitle className="text-lg font-bold text-slate-800">All Coupons</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {loading ? (
                <div className="flex justify-center items-center py-20">
                  <Loader2 className="w-8 h-8 text-[#0b264f] animate-spin" />
                </div>
              ) : coupons.length === 0 ? (
                <div className="text-center py-20 text-slate-400">
                  <Tag className="w-12 h-12 mx-auto mb-4 opacity-30" />
                  <p>No coupons found. Create one to get started.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm text-slate-700">
                    <thead className="bg-slate-50 border-b border-slate-100">
                      <tr>
                        <th className="py-4 px-6 font-semibold">Code</th>
                        <th className="py-4 px-6 font-semibold">Discount</th>
                        <th className="py-4 px-6 font-semibold">Type</th>
                        <th className="py-4 px-6 font-semibold">Target</th>
                        <th className="py-4 px-6 font-semibold">Usage</th>
                        <th className="py-4 px-6 font-semibold">Valid From</th>
                        <th className="py-4 px-6 font-semibold">Valid Until</th>
                        <th className="py-4 px-6 font-semibold text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {coupons.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE).map(c => (
                        <tr key={c.id} className="hover:bg-slate-50/50">
                          <td className="py-4 px-6 font-bold text-[#0b264f]">{c.code}</td>
                          <td className="py-4 px-6 font-bold text-green-600">₹{c.discountAmount}</td>
                          <td className="py-4 px-6">
                            <Badge variant="outline" className={c.type === 'launch' ? 'bg-orange-50 text-orange-600 border-orange-200' : 'bg-blue-50 text-blue-600 border-blue-200'}>
                              {c.type}
                            </Badge>
                          </td>
                          <td className="py-4 px-6 text-xs text-slate-500">
                            {c.assignedTo ? (
                              <span className="flex items-center gap-1.5">
                                <User className="w-3.5 h-3.5 text-indigo-500" />
                                <span className="font-mono text-[10px] max-w-[120px] truncate" title={c.assignedTo}>{c.assignedTo}</span>
                              </span>
                            ) : (
                              <span className="flex items-center gap-1.5 text-emerald-600 font-medium">
                                <Globe className="w-3.5 h-3.5" /> Marketing
                              </span>
                            )}
                          </td>
                          <td className="py-4 px-6 text-xs font-medium text-slate-500">
                            {c.usedCount} / {c.maxUses}
                          </td>
                          <td className="py-4 px-6 text-xs font-medium text-slate-500">
                            {c.validFrom ? new Date(c.validFrom).toLocaleDateString() : '—'}
                          </td>
                          <td className="py-4 px-6 text-xs font-medium text-slate-500">
                            {c.validUntil ? new Date(c.validUntil).toLocaleDateString() : 'Never'}
                          </td>
                          <td className="py-4 px-6 text-center">
                            <div className="flex items-center justify-center gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                title="Reset usage count to 0"
                                onClick={() => handleReset(c.id, c.code)}
                                className="text-amber-500 hover:text-amber-700 hover:bg-amber-50"
                              >
                                <RotateCcw className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => handleDelete(c.id)} className="text-red-500 hover:text-red-700 hover:bg-red-50">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Pagination Controls */}
              {Math.ceil(coupons.length / ITEMS_PER_PAGE) > 1 && (
                <div className="bg-slate-50 border-t border-slate-100 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, coupons.length)} of {coupons.length} records
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Button onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))} disabled={currentPage === 1} variant="outline" className="h-9 px-3 rounded-lg text-xs font-bold hover:bg-slate-100 bg-white">Previous</Button>
                    {Array.from({ length: Math.ceil(coupons.length / ITEMS_PER_PAGE) }, (_, i) => i + 1).map((page) => (
                      <Button key={page} onClick={() => setCurrentPage(page)} variant={currentPage === page ? 'default' : 'outline'} className={`h-9 w-9 p-0 rounded-lg text-xs font-bold ${currentPage === page ? 'bg-slate-900 text-white hover:bg-slate-800' : 'hover:bg-slate-100 bg-white'}`}>{page}</Button>
                    ))}
                    <Button onClick={() => setCurrentPage(prev => Math.min(Math.ceil(coupons.length / ITEMS_PER_PAGE), prev + 1))} disabled={currentPage === Math.ceil(coupons.length / ITEMS_PER_PAGE)} variant="outline" className="h-9 px-3 rounded-lg text-xs font-bold hover:bg-slate-100 bg-white">Next</Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

        </main>
      </div>

      {/* Create Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <Card className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border-none overflow-hidden max-h-[90vh] overflow-y-auto">
            <CardHeader className="bg-[#0b264f] text-white p-5 flex flex-row justify-between items-center sticky top-0">
              <CardTitle className="text-lg font-bold">Create New Coupon</CardTitle>
              <button onClick={() => { setIsModalOpen(false); resetForm(); }} className="text-white/80 hover:text-white">✕</button>
            </CardHeader>
            <form onSubmit={handleCreateCoupon}>
              <CardContent className="p-6 space-y-5">

                {/* Code & Discount */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600">Coupon Code <span className="text-red-500">*</span></label>
                    <input required value={formData.code} onChange={e => setFormData({...formData, code: e.target.value.toUpperCase()})} placeholder="e.g. SUMMER20" className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm uppercase font-bold tracking-wider outline-none focus:border-[#0b264f]" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600">Discount Amount (₹) <span className="text-red-500">*</span></label>
                    <input type="number" required min="1" value={formData.discountAmount} onChange={e => setFormData({...formData, discountAmount: e.target.value})} placeholder="e.g. 500" className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#0b264f]" />
                  </div>
                </div>

                {/* Max Uses */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600">Max Uses</label>
                  <input type="number" min="1" value={formData.maxUses} onChange={e => setFormData({...formData, maxUses: e.target.value})} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#0b264f]" />
                </div>

                {/* Validity Date Range */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600 flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> Valid From</label>
                    <input type="date" value={formData.validFrom} onChange={e => setFormData({...formData, validFrom: e.target.value})} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#0b264f]" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600 flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> Valid Until</label>
                    <input type="date" value={formData.validUntil} onChange={e => setFormData({...formData, validUntil: e.target.value})} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#0b264f]" />
                  </div>
                </div>

                {/* Coupon Target Toggle */}
                <div className="space-y-3">
                  <label className="text-xs font-bold text-slate-600">Coupon Target</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => { setCouponTarget('marketing'); setSelectedUser(null); setUserSearchQuery(''); }}
                      className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all ${couponTarget === 'marketing' ? 'border-emerald-500 bg-emerald-50' : 'border-slate-200 hover:border-slate-300 bg-white'}`}
                    >
                      <Globe className={`w-6 h-6 ${couponTarget === 'marketing' ? 'text-emerald-600' : 'text-slate-400'}`} />
                      <div className="text-center">
                        <p className={`text-xs font-bold ${couponTarget === 'marketing' ? 'text-emerald-700' : 'text-slate-600'}`}>Marketing</p>
                        <p className="text-[10px] text-slate-400">Anyone can use</p>
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setCouponTarget('user')}
                      className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all ${couponTarget === 'user' ? 'border-indigo-500 bg-indigo-50' : 'border-slate-200 hover:border-slate-300 bg-white'}`}
                    >
                      <Users className={`w-6 h-6 ${couponTarget === 'user' ? 'text-indigo-600' : 'text-slate-400'}`} />
                      <div className="text-center">
                        <p className={`text-xs font-bold ${couponTarget === 'user' ? 'text-indigo-700' : 'text-slate-600'}`}>Assign to User</p>
                        <p className="text-[10px] text-slate-400">Restricted use</p>
                      </div>
                    </button>
                  </div>
                </div>

                {/* User Search — only shown when couponTarget is 'user' */}
                {couponTarget === 'user' && (
                  <div className="space-y-1.5" ref={userSearchRef}>
                    <label className="text-xs font-bold text-slate-600">Search User <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        value={userSearchQuery}
                        onChange={e => handleUserSearch(e.target.value)}
                        placeholder="Search by name, email, or UID..."
                        className="w-full border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none focus:border-indigo-500"
                      />
                      {isSearchingUsers && (
                        <Loader2 className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 animate-spin" />
                      )}
                    </div>

                    {/* Search Results Dropdown */}
                    {userSearchResults.length > 0 && (
                      <div className="border border-slate-200 rounded-xl overflow-hidden shadow-lg bg-white max-h-48 overflow-y-auto">
                        {userSearchResults.map(u => (
                          <button
                            key={u.uid || u.id}
                            type="button"
                            onClick={() => handleSelectUser(u)}
                            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-indigo-50 transition-colors border-b border-slate-100 last:border-0 text-left"
                          >
                            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                              <User className="w-4 h-4 text-indigo-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-slate-800 truncate">{u.name || u.fullName || 'No Name'}</p>
                              <p className="text-xs text-slate-500 truncate">{u.email}</p>
                              <p className="text-[10px] font-mono text-slate-400 truncate">{u.uid || u.id}</p>
                            </div>
                            <Badge variant="outline" className="text-[10px] capitalize shrink-0">{u.role}</Badge>
                          </button>
                        ))}
                      </div>
                    )}

                    {selectedUser && (
                      <div className="flex items-center gap-3 p-3 bg-indigo-50 border border-indigo-200 rounded-xl">
                        <div className="w-8 h-8 rounded-full bg-indigo-200 flex items-center justify-center">
                          <User className="w-4 h-4 text-indigo-700" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-indigo-900">{selectedUser.name || selectedUser.fullName || 'Selected User'}</p>
                          <p className="text-xs text-indigo-600 font-mono truncate">{selectedUser.uid || selectedUser.id}</p>
                        </div>
                        <button type="button" onClick={() => { setSelectedUser(null); setUserSearchQuery(''); }} className="text-indigo-400 hover:text-indigo-700">✕</button>
                      </div>
                    )}
                  </div>
                )}

              </CardContent>
              <div className="bg-slate-50 border-t border-slate-100 p-4 px-6 flex justify-end gap-3 rounded-b-2xl">
                <Button type="button" variant="outline" onClick={() => { setIsModalOpen(false); resetForm(); }}>Cancel</Button>
                <Button type="submit" disabled={isSubmitting} className="bg-[#0b264f] text-white">
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Create Coupon"}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
      
    </div>
  );
}
