"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Building2, MapPin, Search, Users, TrendingUp, Wallet,
  HardHat, Loader2, Plus, MessageSquare, CheckCircle,
  Clock, ArrowRight, Inbox, Lock, ShieldCheck, AlertCircle
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/AuthContext';
import { fetchBuilderProjects } from '@/api';
import { toast } from '@/hooks/use-toast';

// ─── Onboarding status helpers ────────────────────────────────────────────────
function getOnboardingState(user) {
  if (!user) return { isFullyVerified: false, needsForm2: false, needsForm2Changes: false };
  const s = user.onboardingStatus || '';
  // Builders auto-approve Form 1 — they never hit form1_pending.
  // isFullyVerified = admin has set status to 'complete' (after Form2/document approval)
  const isFullyVerified = s === 'complete' || user.isVerified === true;
  // needsForm2 = Form1 done, waiting for user to submit builder profile details (Form 2)
  const needsForm2 = s === 'form1_approved' || s === 'form2_pending';
  const needsForm2Changes = s === 'form2_changes_requested';
  return { isFullyVerified, needsForm2, needsForm2Changes };
}

export default function BuilderDashboard() {
  const router = useRouter();
  const { user, refreshUser } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 8;
  const [mounted, setMounted] = useState(false);

  // Always fetch latest onboarding status from the server
  useEffect(() => {
    refreshUser();
    setMounted(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => { setCurrentPage(1); }, [searchQuery]);

  useEffect(() => {
    const loadProjects = async () => {
      if (!user?.uid) return;
      try {
        setIsLoading(true);
        const res = await fetchBuilderProjects(user.uid);
        setProjects(res?.data || res || []);
      } catch {
        toast({ title: "Error", description: "Failed to load your projects.", variant: "destructive" });
      } finally {
        setIsLoading(false);
      }
    };
    loadProjects();
  }, [user]);

  const { isFullyVerified, needsForm2, needsForm2Changes } = getOnboardingState(user);
  const isBlocked = !isFullyVerified;

  const totalLeads = projects.reduce((acc, curr) => acc + (curr.inquiries || 0), 0);
  const approvedCount = projects.filter(p => p.status === 'approved').length;
  const pendingCount = projects.filter(p => p.status === 'pending').length;

  const filteredProjects = projects.filter(p =>
    (p.projectName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.projectLocation || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const paginated = filteredProjects.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
  const totalPages = Math.ceil(filteredProjects.length / ITEMS_PER_PAGE);

  const analyticsData = [
    { name: 'Sep', leads: 0, approved: 0 },
    { name: 'Oct', leads: 0, approved: 0 },
    { name: 'Nov', leads: 0, approved: 0 },
    { name: 'Dec', leads: 0, approved: 0 },
    { name: 'Jan', leads: totalLeads, approved: approvedCount },
    { name: 'Feb', leads: totalLeads, approved: approvedCount },
  ];

  if (!user) return null;



  return (
    <div className="min-h-screen bg-[#f5f6fa] font-sans pb-16 overflow-x-hidden">

      {/* ── Hero Header ── */}
      <div className="relative bg-gradient-to-br from-[#0b264f] via-[#1a3e7a] to-[#0b264f] text-white px-4 sm:px-6 pt-8 pb-20 sm:pb-24 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-20 -right-20 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-indigo-400/10 rounded-full blur-2xl" />
        </div>
        <div className="container mx-auto relative z-10">
          <div className="flex flex-col gap-5">
            {/* Title + Actions */}
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
              <div>
                <Badge className={`${isBlocked ? 'bg-amber-400/20 text-amber-200' : 'bg-emerald-400/20 text-emerald-200'} border-none mb-3 px-3 py-1`}>
                  {isBlocked
                    ? <><AlertCircle className="w-3.5 h-3.5 mr-1.5" /> Unverified Builder</>
                    : <><ShieldCheck className="w-3.5 h-3.5 mr-1.5" /> Verified Builder</>
                  }
                </Badge>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold leading-tight">
                  Welcome back,<br />
                  <span className="text-orange-300">{user?.name || user?.companyName || 'Builder'}</span>
                </h1>
                <p className="text-blue-200 text-sm mt-2 opacity-80">Track your projects and monitor performance.</p>
                <div className="flex flex-wrap gap-2 sm:gap-3 mt-4 sm:mt-5">
                  <Button
                    onClick={() => router.push('/builder/projects')}
                    disabled={isBlocked}
                    className="bg-orange-500 hover:bg-orange-600 disabled:opacity-40 text-white rounded-xl gap-2 text-sm h-9 sm:h-10"
                  >
                    <Plus className="w-4 h-4" /> Add Project
                  </Button>
                  <Button
                    onClick={() => router.push('/builder/outreach-inbox')}
                    disabled={isBlocked}
                    variant="outline"
                    className="bg-white/10 border-white/20 text-white hover:bg-white/20 disabled:opacity-40 rounded-xl gap-2 text-sm h-9 sm:h-10"
                  >
                    <Inbox className="w-4 h-4" /> SP Inbox
                  </Button>
                  <Button
                    onClick={() => router.push('/builder/support')}
                    variant="outline"
                    className="bg-white/10 border-white/20 text-white hover:bg-white/20 rounded-xl gap-2 text-sm h-9 sm:h-10"
                  >
                    <MessageSquare className="w-4 h-4" /> Support
                  </Button>
                </div>
              </div>

              {/* Stat Pills */}
              <div className="grid grid-cols-2 gap-2 sm:gap-3 w-full md:w-auto md:min-w-[280px]">
                {[
                  { label: 'Total Revenue', value: '₹0 Cr', icon: Wallet, color: 'text-emerald-300' },
                  { label: 'Active Leads', value: totalLeads, icon: Users, color: 'text-blue-300' },
                  { label: 'Live Projects', value: approvedCount, icon: Building2, color: 'text-orange-300' },
                  { label: 'Conversion', value: '0.0%', icon: TrendingUp, color: 'text-purple-300' },
                ].map((stat, idx) => (
                  <div key={idx} className="bg-white/10 backdrop-blur border border-white/10 rounded-xl sm:rounded-2xl p-3 sm:p-4 flex flex-col justify-between">
                    <div className={`p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-white/10 ${stat.color} w-fit`}>
                      <stat.icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </div>
                    <div className="mt-2 sm:mt-3">
                      <p className="text-lg sm:text-xl font-bold">{isLoading ? '—' : stat.value}</p>
                      <p className="text-[9px] sm:text-[10px] text-blue-200 uppercase tracking-wider opacity-80 leading-tight">{stat.label}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main Content ── */}
      <div className="container mx-auto px-3 sm:px-4 md:px-6 -mt-10 relative z-20 space-y-6 sm:space-y-8">

        {/* ── Verification Gate Banner ── */}
        {isBlocked && (
          <div className="bg-white/80 backdrop-blur-md border border-amber-200/50 rounded-3xl p-8 sm:p-12 text-center shadow-2xl shadow-amber-900/5 relative overflow-hidden mt-4">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-400 via-orange-500 to-amber-400" />

            <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner border border-amber-100">
              {needsForm2Changes ? (
                <AlertCircle className="w-10 h-10 text-orange-500 animate-pulse" />
              ) : (
                <Lock className="w-10 h-10 text-amber-500" />
              )}
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-4 tracking-tight">
              {needsForm2Changes ? "Action Required: Changes Requested" : "Complete Verification to Unlock Dashboard"}
            </h2>
            <p className="text-gray-500 max-w-lg mx-auto mb-8 leading-relaxed font-semibold">
              {needsForm2Changes ? (
                <>
                  The administrator has requested modifications or additional details for your profile verification.
                  {user.adminRequests?.length > 0 && (
                    <span className="block mt-2 font-bold text-orange-600">Please correct: {user.adminRequests.join(', ')}</span>
                  )}
                </>
              ) : (
                "Your account is currently restricted. To access your dashboard, add projects, and manage leads, please complete your profile and upload your verification documents."
              )}
            </p>

            <Button
              onClick={() => router.push('/builder/verification')}
              className="bg-gray-900 hover:bg-black text-white px-10 py-6 text-base font-black rounded-2xl shadow-xl shadow-black/10 transition-all hover:scale-105 active:scale-95"
            >
              Go to Verification
            </Button>
          </div>
        )}

        {/* ── Charts + Summary ── */}
        <div className={`grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 transition-all duration-500 ${isBlocked ? 'opacity-30 pointer-events-none select-none blur-sm' : ''}`}>
          <div className="lg:col-span-2 bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-900 text-base sm:text-lg flex items-center mb-4 sm:mb-6">
              <TrendingUp className="w-5 h-5 mr-2 text-[#0b264f]" /> Performance Overview
            </h3>
            <div className="h-48 sm:h-56 w-full">
              {mounted && (
                <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                  <AreaChart data={analyticsData}>
                    <defs>
                      <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0b264f" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#0b264f" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorApproved" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 11 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 11 }} width={25} />
                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                    <Area type="monotone" dataKey="leads" stroke="#0b264f" strokeWidth={3} fill="url(#colorLeads)" name="Leads" />
                    <Area type="monotone" dataKey="approved" stroke="#10b981" strokeWidth={2} fill="url(#colorApproved)" name="Approved" />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-sm border border-gray-100 space-y-3 sm:space-y-4">
            <h3 className="font-bold text-gray-900 text-base sm:text-lg mb-1">Project Summary</h3>
            {[
              { label: 'Total Properties', value: projects.length, icon: Building2, bg: 'bg-blue-50', color: 'text-blue-600' },
              { label: 'Live & Verified', value: approvedCount, icon: CheckCircle, bg: 'bg-emerald-50', color: 'text-emerald-600' },
              { label: 'Pending Review', value: pendingCount, icon: Clock, bg: 'bg-yellow-50', color: 'text-yellow-600' },
              { label: 'Total Leads', value: totalLeads, icon: Users, bg: 'bg-orange-50', color: 'text-orange-600' },
            ].map((item, i) => (
              <div key={i} className={`${item.bg} rounded-xl sm:rounded-2xl px-3 sm:px-4 py-2.5 sm:py-3 flex items-center justify-between`}>
                <div className="flex items-center gap-2 sm:gap-3">
                  <item.icon className={`w-4 h-4 ${item.color}`} />
                  <span className="text-xs sm:text-sm font-semibold text-gray-700">{item.label}</span>
                </div>
                <span className={`text-base sm:text-lg font-extrabold ${item.color}`}>{isLoading ? '—' : item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Projects Table ── */}
        <div className={`transition-all duration-500 ${isBlocked ? 'opacity-30 pointer-events-none select-none blur-sm' : ''}`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-5">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900">Your Projects</h2>
            <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 px-3 sm:px-4 py-2.5 sm:py-3 flex items-center gap-2 w-full sm:w-72 shadow-sm">
              <Search className="text-gray-400 w-4 h-4 shrink-0" />
              <input
                type="text"
                placeholder="Search projects…"
                className="flex-grow outline-none text-gray-700 bg-transparent text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-10 h-10 text-orange-500 animate-spin mb-4" />
              <p className="text-gray-500 font-medium">Loading your projects…</p>
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100 text-center">
              <Building2 className="w-12 h-12 text-gray-200 mb-4" />
              <h3 className="text-lg font-bold text-gray-900 mb-2">No Projects Yet</h3>
              <p className="text-gray-400 mb-6 text-sm">Start building your portfolio by adding your first project.</p>
              <Button onClick={() => router.push('/builder/projects')} className="bg-[#0b264f] hover:bg-blue-900 text-white gap-2">
                <Plus className="w-4 h-4" /> Add New Project
              </Button>
            </div>
          ) : (
            <>
              {/* Mobile: card layout */}
              <div className="grid grid-cols-1 gap-3 sm:hidden">
                {paginated.map((project) => {
                  const fallback = 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80';
                  const img = (project.projectImages?.length > 0 && project.projectImages[0].startsWith('http'))
                    ? project.projectImages[0] : fallback;
                  const statusConfig = {
                    approved: { label: 'Live', cls: 'bg-emerald-100 text-emerald-700' },
                    pending: { label: 'Pending', cls: 'bg-yellow-100 text-yellow-700' },
                    rejected: { label: 'Rejected', cls: 'bg-red-100 text-red-700' },
                  }[project.status] || { label: project.status, cls: 'bg-gray-100 text-gray-700' };

                  return (
                    <div key={project.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-3 flex gap-3">
                      <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 border border-gray-200 shrink-0">
                        <img src={img} alt={project.projectName} className="w-full h-full object-cover"
                          onError={(e) => { e.target.src = fallback; }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-sm font-bold text-gray-900 capitalize truncate">{project.projectName}</p>
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${statusConfig.cls}`}>{statusConfig.label}</span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                          <MapPin className="w-3 h-3 text-orange-500 shrink-0" />
                          <span className="truncate">{project.projectLocation || '—'}</span>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-gray-400">{project.projectType || 'Residential'} · {project.totalUnits || 0} Units</span>
                          <Button onClick={() => router.push('/builder/projects')}
                            className="bg-white text-[#0b264f] border border-gray-200 hover:bg-[#0b264f] hover:text-white rounded-lg text-xs px-3 py-1 h-auto gap-1">
                            Manage <ArrowRight className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Desktop: table layout */}
              <div className="hidden sm:block bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 text-xs font-bold uppercase tracking-wider">
                        <th className="px-6 py-4">Project</th>
                        <th className="px-6 py-4">Location</th>
                        <th className="px-6 py-4">Type / Units</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {paginated.map((project) => {
                        const fallback = 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80';
                        const img = (project.projectImages?.length > 0 && project.projectImages[0].startsWith('http'))
                          ? project.projectImages[0] : fallback;
                        const statusConfig = {
                          approved: { label: 'Live', cls: 'bg-emerald-100 text-emerald-700' },
                          pending: { label: 'Pending', cls: 'bg-yellow-100 text-yellow-700' },
                          rejected: { label: 'Rejected', cls: 'bg-red-100 text-red-700' },
                        }[project.status] || { label: project.status, cls: 'bg-gray-100 text-gray-700' };

                        return (
                          <tr key={project.id} className="hover:bg-gray-50/50 transition-colors">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="w-14 h-10 rounded-xl overflow-hidden bg-gray-100 border border-gray-200 shrink-0">
                                  <img src={img} alt={project.projectName} className="w-full h-full object-cover"
                                    onError={(e) => { e.target.src = fallback; }} />
                                </div>
                                <div>
                                  <p className="text-sm font-bold text-gray-900 capitalize">{project.projectName}</p>
                                  <p className="text-xs text-gray-400">ID: {project.id?.slice(0, 8)}…</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-1.5 text-sm text-gray-600">
                                <MapPin className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                                {project.projectLocation || '—'}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <p className="text-sm font-semibold text-gray-900">{project.projectType || 'Residential'}</p>
                              <p className="text-xs text-gray-400">{project.totalUnits || 0} Units</p>
                            </td>
                            <td className="px-6 py-4">
                              <Badge className={`border-none py-1 px-3 text-xs font-semibold capitalize ${statusConfig.cls}`}>
                                {statusConfig.label}
                              </Badge>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <Button
                                onClick={() => router.push('/builder/projects')}
                                className="bg-white text-[#0b264f] border border-gray-200 hover:bg-[#0b264f] hover:text-white transition-all shadow-sm rounded-xl text-xs px-4 py-2 gap-1"
                              >
                                Manage <ArrowRight className="w-3 h-3" />
                              </Button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {totalPages > 1 && (
                  <div className="bg-gray-50 border-t border-gray-200 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <p className="text-xs text-gray-500 font-semibold">
                      Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, filteredProjects.length)} of {filteredProjects.length}
                    </p>
                    <div className="flex items-center gap-1.5">
                      <Button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}
                        variant="outline" className="h-8 px-3 rounded-lg text-xs font-bold">Previous</Button>
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                        <Button key={page} onClick={() => setCurrentPage(page)}
                          className={`h-8 w-8 p-0 rounded-lg text-xs font-bold ${currentPage === page ? 'bg-slate-900 text-white' : 'bg-white text-gray-700 border border-gray-200'}`}>
                          {page}
                        </Button>
                      ))}
                      <Button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}
                        variant="outline" className="h-8 px-3 rounded-lg text-xs font-bold">Next</Button>
                    </div>
                  </div>
                )}
              </div>

              {/* Mobile pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-1.5 pt-3 sm:hidden flex-wrap">
                  <Button variant="outline" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}
                    className="rounded-lg h-8 px-3 text-xs font-bold">Previous</Button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <Button key={page} onClick={() => setCurrentPage(page)}
                      className={`h-8 w-8 p-0 rounded-lg text-xs font-bold ${currentPage === page ? 'bg-[#0b264f] text-white' : 'bg-white text-gray-700 border border-gray-200'}`}>
                      {page}
                    </Button>
                  ))}
                  <Button variant="outline" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}
                    className="rounded-lg h-8 px-3 text-xs font-bold">Next</Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
