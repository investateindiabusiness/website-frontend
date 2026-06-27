"use client";

import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { fetchAdminCoupons, createAdminCoupon, deleteAdminCoupon, resetAdminCoupon } from '@/api';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, Tag, Loader2, RotateCcw } from 'lucide-react';
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

  const [formData, setFormData] = useState({
    code: '',
    discountAmount: '',
    type: 'custom',
    maxUses: 1,
    assignedTo: '',
    assignedRole: 'all',
    validUntil: ''
  });

  useEffect(() => {
    if (user?.role === 'admin') {
      loadCoupons();
    }
  }, [user]);

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

  const handleCreateCoupon = async (e) => {
    e.preventDefault();
    if (!formData.code || !formData.discountAmount) {
      return toast({ title: "Validation Error", description: "Code and discount amount are required.", variant: "destructive" });
    }

    try {
      setIsSubmitting(true);
      const payload = {
        ...formData,
        discountAmount: Number(formData.discountAmount),
        maxUses: Number(formData.maxUses),
        validUntil: formData.validUntil ? new Date(formData.validUntil).toISOString() : null
      };

      await createAdminCoupon(payload);
      toast({ title: "Coupon Created", description: "The coupon has been successfully created." });
      setIsModalOpen(false);
      setFormData({ code: '', discountAmount: '', type: 'custom', maxUses: 1, assignedTo: '', assignedRole: 'all', validUntil: '' });
      loadCoupons();
    } catch (err) {
      toast({ title: "Creation Failed", description: err.message, variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
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
      <Header />
      <div className="flex-grow flex pt-[4rem]">
        <main className="flex-1 p-6 md:p-10 overflow-x-hidden">
          
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
                <Tag className="w-8 h-8 text-[#0b264f]" />
                Coupon Management
              </h1>
              <p className="text-slate-500 text-sm mt-1">Create and manage advertisement coupons.</p>
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
                            {c.assignedTo ? <span title={c.assignedTo}>Specific User</span> : c.assignedRole === 'all' ? 'All Roles' : c.assignedRole}
                          </td>
                          <td className="py-4 px-6 text-xs font-medium text-slate-500">
                            {c.usedCount} / {c.maxUses}
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
                    <Button
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      variant="outline"
                      className="h-9 px-3 rounded-lg text-xs font-bold hover:bg-slate-100 bg-white"
                    >
                      Previous
                    </Button>
                    
                    {Array.from({ length: Math.ceil(coupons.length / ITEMS_PER_PAGE) }, (_, i) => i + 1).map((page) => (
                      <Button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        variant={currentPage === page ? 'default' : 'outline'}
                        className={`h-9 w-9 p-0 rounded-lg text-xs font-bold ${
                          currentPage === page ? 'bg-slate-900 text-white hover:bg-slate-800' : 'hover:bg-slate-100 bg-white'
                        }`}
                      >
                        {page}
                      </Button>
                    ))}

                    <Button
                      onClick={() => setCurrentPage(prev => Math.min(Math.ceil(coupons.length / ITEMS_PER_PAGE), prev + 1))}
                      disabled={currentPage === Math.ceil(coupons.length / ITEMS_PER_PAGE)}
                      variant="outline"
                      className="h-9 px-3 rounded-lg text-xs font-bold hover:bg-slate-100 bg-white"
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

        </main>
      </div>

      {/* Create Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity">
          <Card className="w-full max-w-md bg-white rounded-2xl shadow-2xl border-none overflow-hidden">
            <CardHeader className="bg-[#0b264f] text-white p-5 flex flex-row justify-between items-center">
              <CardTitle className="text-lg font-bold">Create New Coupon</CardTitle>
              <button onClick={() => setIsModalOpen(false)} className="text-white/80 hover:text-white">✕</button>
            </CardHeader>
            <form onSubmit={handleCreateCoupon}>
              <CardContent className="p-6 space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600">Coupon Code <span className="text-red-500">*</span></label>
                  <input required value={formData.code} onChange={e => setFormData({...formData, code: e.target.value.toUpperCase()})} placeholder="e.g. SUMMER20" className="w-full border rounded-xl px-4 py-2.5 text-sm uppercase" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600">Discount Amount (₹) <span className="text-red-500">*</span></label>
                  <input type="number" required min="1" value={formData.discountAmount} onChange={e => setFormData({...formData, discountAmount: e.target.value})} placeholder="e.g. 50" className="w-full border rounded-xl px-4 py-2.5 text-sm" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600">Max Uses</label>
                    <input type="number" min="1" value={formData.maxUses} onChange={e => setFormData({...formData, maxUses: e.target.value})} className="w-full border rounded-xl px-4 py-2.5 text-sm" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600">Valid Until</label>
                    <input type="date" value={formData.validUntil} onChange={e => setFormData({...formData, validUntil: e.target.value})} className="w-full border rounded-xl px-4 py-2.5 text-sm" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600">Assigned Role</label>
                    <select value={formData.assignedRole} onChange={e => setFormData({...formData, assignedRole: e.target.value})} className="w-full border rounded-xl px-4 py-2.5 text-sm bg-white">
                      <option value="all">All Roles</option>
                      <option value="investor">Investors</option>
                      <option value="builder">Builders</option>
                      <option value="serviceProvider">Service Providers</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600">Assigned User (UID)</label>
                    <input value={formData.assignedTo} onChange={e => setFormData({...formData, assignedTo: e.target.value})} placeholder="Optional UID" className="w-full border rounded-xl px-4 py-2.5 text-sm" />
                  </div>
                </div>
              </CardContent>
              <div className="bg-slate-50 border-t border-slate-100 p-4 px-6 flex justify-end gap-3 rounded-b-2xl">
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={isSubmitting} className="bg-[#0b264f] text-white">
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Create"}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
      
    </div>
  );
}
