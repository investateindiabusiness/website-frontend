"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/AuthContext';
import AdminSidebar from '@/components/AdminSidebar';
import { Button } from '@/components/ui/button';
import { apiRequest } from '@/api';
import { toast } from '@/hooks/use-toast';
import {
  User, Mail, Phone, MapPin, Shield, Crown,
  Edit2, Save, Loader2, Calendar, BadgeCheck, AlertTriangle
} from 'lucide-react';

export default function ProfilePage() {
  const { user, refreshUser, loading } = useAuth();
  const router = useRouter();

  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: '',
    contactNumber: '',
    address: ''
  });

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (refreshUser) {
      refreshUser();
    }
  }, []);

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || user.fullName || '',
        contactNumber: user.contactNumber || '',
        address: user.address || ''
      });
    }
  }, [user]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0f0f10]">
        <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
      </div>
    );
  }

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      toast({ title: 'Validation Error', description: 'Name cannot be empty.', variant: 'destructive' });
      return;
    }
    setSaving(true);
    try {
      await apiRequest('/api/auth/profile', {
        method: 'PATCH',
        body: JSON.stringify(form)
      });
      toast({ title: '✅ Profile Updated', description: 'Your profile has been saved successfully.' });
      if (refreshUser) {
        await refreshUser();
      }
      setIsEditing(false);
    } catch (err) {
      toast({ title: 'Update Failed', description: err.message || 'Could not save profile details.', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const isMembershipActive = user?.membershipStatus === 'active' && user?.membershipExpiry && new Date() <= new Date(user.membershipExpiry);
  const roleLabel = user.role === 'serviceProvider' ? 'Service Provider' : user.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : '';

  return (
    <AdminSidebar>
      <div className="max-w-4xl mx-auto py-8 px-4 font-sans">
        {/* Profile Header Card */}
        <div className="bg-[#0f172a] rounded-3xl border border-slate-800 p-8 text-white relative overflow-hidden shadow-2xl mb-8">
          <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col md:flex-row items-center gap-6 relative z-10">
            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-[#D48035] to-orange-500 flex items-center justify-center text-white text-3xl font-extrabold shadow-lg shadow-orange-500/20">
              {(user.name || user.email || 'U')[0].toUpperCase()}
            </div>
            <div className="text-center md:text-left flex-grow">
              <div className="flex flex-col md:flex-row md:items-center gap-2.5">
                <h1 className="text-2xl font-black">{user.name || user.email.split('@')[0]}</h1>
                <span className="inline-flex self-center md:self-start bg-orange-500/15 text-orange-400 border border-orange-500/30 text-xs font-bold px-3 py-1 rounded-full capitalize">
                  {roleLabel}
                </span>
              </div>
              <p className="text-slate-400 text-sm mt-1">{user.email}</p>

              {/* Onboarding / verification badges */}
              <div className="flex flex-wrap gap-2 mt-4 justify-center md:justify-start">
                {user.isVerified && (
                  <span className="inline-flex items-center gap-1 bg-green-500/10 text-green-400 border border-green-500/25 text-xs font-bold px-2.5 py-0.5 rounded-full">
                    <BadgeCheck className="w-3.5 h-3.5" /> Account Verified
                  </span>
                )}
                {user.isKycVerified ? (
                  <span className="inline-flex items-center gap-1 bg-blue-500/10 text-blue-400 border border-blue-500/25 text-xs font-bold px-2.5 py-0.5 rounded-full">
                    <Shield className="w-3.5 h-3.5" /> KYC Approved
                  </span>
                ) : user.role === 'investor' && (
                  <span className="inline-flex items-center gap-1 bg-yellow-500/10 text-yellow-400 border border-yellow-500/25 text-xs font-bold px-2.5 py-0.5 rounded-full">
                    <AlertTriangle className="w-3.5 h-3.5" /> KYC Pending / Not Uploaded
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Profile Details Form (Cols 2/3) */}
          <div className="md:col-span-2 bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="flex justify-between items-center px-6 py-5 border-b border-slate-100 bg-slate-50/50">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <User className="w-4 h-4 text-[#D48035]" /> Profile Details
              </h2>
              {!isEditing && (
                <Button
                  onClick={() => setIsEditing(true)}
                  variant="outline"
                  className="text-xs h-8 rounded-lg border-slate-200 hover:bg-slate-50"
                >
                  <Edit2 className="w-3.5 h-3.5 mr-1" /> Edit Profile
                </Button>
              )}
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-5">
              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1">Full Name</label>
                <input
                  type="text"
                  disabled={!isEditing}
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 outline-none focus:border-[#D48035] focus:bg-white disabled:opacity-70 transition-all font-medium"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1">Email Address</label>
                <input
                  type="email"
                  disabled
                  value={user.email}
                  className="w-full bg-slate-100 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-500 transition-all font-medium cursor-not-allowed"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1">Contact Number</label>
                <input
                  type="tel"
                  disabled={!isEditing}
                  value={form.contactNumber}
                  onChange={e => setForm({ ...form, contactNumber: e.target.value })}
                  placeholder="Enter contact number"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 outline-none focus:border-[#D48035] focus:bg-white disabled:opacity-70 transition-all font-medium"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1">Address</label>
                <textarea
                  rows="3"
                  disabled={!isEditing}
                  value={form.address}
                  onChange={e => setForm({ ...form, address: e.target.value })}
                  placeholder="Enter your billing/residential address"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 outline-none focus:border-[#D48035] focus:bg-white disabled:opacity-70 transition-all font-medium resize-none font-sans"
                />
              </div>

              {isEditing && (
                <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsEditing(false);
                      setForm({
                        name: user.name || user.fullName || '',
                        contactNumber: user.contactNumber || '',
                        address: user.address || ''
                      });
                    }}
                    className="text-xs rounded-xl"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={saving}
                    className="bg-[#D48035] hover:bg-[#B45309] text-white text-xs rounded-xl flex items-center gap-1.5"
                  >
                    {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                    Save Changes
                  </Button>
                </div>
              )}
            </form>
          </div>

          {/* Membership Stats Sidebar (Col 1) */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 flex flex-col justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-4">
                <Crown className="w-4 h-4 text-orange-400" /> Plan & Status
              </h2>

              <div className="space-y-4">
                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4">
                  <span className="text-xs text-slate-500 font-medium">Current Status</span>
                  <div className="flex items-center gap-2 mt-1">
                    {isMembershipActive ? (
                      <>
                        <span className="w-2.5 h-2.5 rounded-full bg-green-500" />
                        <span className="text-sm font-bold text-green-600 capitalize">Active Premium</span>
                      </>
                    ) : (
                      <>
                        <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
                        <span className="text-sm font-bold text-orange-600 capitalize">Free update for 1 yr</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 px-1 text-sm text-slate-600">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <div>
                    <p className="text-xs text-slate-400 font-bold">Expiration Date</p>
                    <p className="font-semibold text-slate-700 mt-0.5">
                      {user.membershipExpiry ? new Date(user.membershipExpiry).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric'
                      }) : new Date('2027-07-13').toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100 mt-6">
              <Button
                onClick={() => router.push('/membership')}
                className="w-full bg-[#0b264f] hover:bg-blue-900 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm"
              >
                <Crown className="w-4 h-4 text-orange-400 fill-orange-400" />
                {isMembershipActive ? 'Manage Membership' : 'Renew Membership'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </AdminSidebar>
  );
}
