"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Building2, FileText, Users, MessageSquare, Loader2,
  RefreshCw, ShieldCheck, TrendingUp, Inbox, Activity, ArrowRight, ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/AuthContext';
import { fetchAllProjects, fetchAllLeads, fetchAllInquiries } from '@/api';

const QUICK_LINKS = [
  { label: 'Projects', path: '/admin/projects', icon: Building2, description: 'Verify & approve property listings' },
  { label: 'Builders', path: '/admin/builders', icon: Users, description: 'Manage builder profile status' },
  { label: 'Leads', path: '/admin/leads', icon: TrendingUp, description: 'Track investor real estate leads' },
  { label: 'Inquiries', path: '/admin/inquiries', icon: FileText, description: 'Review general platform messages' },
  { label: 'Helpdesk', path: '/admin/helpdesk', icon: MessageSquare, description: 'Respond to support tickets' },
  { label: 'SP Outreach', path: '/admin/sp-outreach', icon: Inbox, description: 'Monitor service provider chats' },
];

export default function AdminDashboard() {
  const router = useRouter();
  const { user } = useAuth();

  const [projects, setProjects] = useState([]);
  const [leads, setLeads] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      const [projectsData, leadsData, inquiriesData] = await Promise.all([
        fetchAllProjects({ page: 1, limit: 1000 }).catch(e => { console.error('Failed to fetch projects', e); return []; }),
        fetchAllLeads().catch(e => { console.error('Failed to fetch leads', e); return []; }),
        fetchAllInquiries().catch(e => { console.error('Failed to fetch inquiries', e); return []; })
      ]);
      setProjects(Array.isArray(projectsData?.data) ? projectsData.data : []);
      setLeads(Array.isArray(leadsData) ? leadsData : (leadsData?.data || []));
      setInquiries(Array.isArray(inquiriesData) ? inquiriesData : (inquiriesData?.data || []));
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
    } finally {
      setLoading(false);
    }
  }, [user?.token]);

  useEffect(() => {
    if (user) loadDashboardData();
  }, [user, loadDashboardData]);

  const safeProjects = Array.isArray(projects) ? projects : [];
  const safeLeads = Array.isArray(leads) ? leads : [];
  const safeInquiries = Array.isArray(inquiries) ? inquiries : [];

  const stats = [
    { label: 'Total Projects', value: safeProjects.length, icon: Building2, color: 'text-blue-600', bg: 'bg-blue-50/70 border-blue-100' },
    { label: 'Active Builders', value: new Set(safeProjects.filter(p => p.builderName).map(p => p.builderName)).size, icon: Users, color: 'text-emerald-600', bg: 'bg-emerald-50/70 border-emerald-100' },
    { label: 'Project Leads', value: safeLeads.length, icon: TrendingUp, color: 'text-amber-600', bg: 'bg-amber-50/70 border-amber-100' },
    { label: 'General Inquiries', value: safeInquiries.length, icon: FileText, color: 'text-purple-600', bg: 'bg-purple-50/70 border-purple-100' },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans pb-16">
      {/* Top Banner Control Section */}
      <div className="bg-white border-b border-slate-200/80 py-8 px-6 mb-8">
        <div className="container mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <ShieldCheck className="w-5 h-5 text-[#D48035]" />
              <span className="text-xs font-bold uppercase tracking-wider text-[#D48035]">Administrative Control Center</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0b264f] tracking-tight">
              Welcome back, <span className="text-[#D48035]">{user?.name || 'Administrator'}</span>
            </h1>
            <p className="text-slate-500 text-sm mt-1">Monitor real-time project submissions, buyer leads, and platform activity.</p>
          </div>
          <Button
            onClick={loadDashboardData}
            disabled={loading}
            variant="outline"
            className="border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl gap-2 h-11 px-5 font-bold self-start md:self-auto shadow-sm"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin text-slate-500" /> : <RefreshCw className="w-4 h-4 text-slate-500" />}
            Refresh Stats
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-6 space-y-8">
        {/* KPI stats cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {stats.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/70 flex items-center gap-5 hover:shadow-md transition-all duration-300"
            >
              <div className={`w-14 h-14 rounded-2xl ${s.bg} border flex items-center justify-center flex-shrink-0`}>
                <s.icon className={`w-6 h-6 ${s.color}`} />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">{s.label}</p>
                {loading ? (
                  <div className="h-8 w-16 bg-slate-100 rounded animate-pulse mt-2" />
                ) : (
                  <p className="text-2xl sm:text-3xl font-extrabold text-[#0b264f] leading-none">{s.value}</p>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions Layout */}
        <div>
          <h2 className="text-sm font-black uppercase tracking-wider text-slate-400 mb-4">Quick Navigation</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {QUICK_LINKS.map((link, i) => (
              <motion.button
                key={i}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.04 }}
                onClick={() => router.push(link.path)}
                className="bg-white border border-slate-200/80 hover:border-[#D48035] rounded-2xl p-5 flex items-start gap-4 shadow-sm hover:shadow-md transition-all duration-300 text-left group"
              >
                <div className="bg-slate-50 group-hover:bg-amber-50 rounded-xl p-3 border border-slate-100 group-hover:border-amber-200 transition-colors">
                  <link.icon className="w-5 h-5 text-[#0b264f] group-hover:text-[#D48035] transition-colors" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-sm text-[#0b264f] group-hover:text-[#D48035] transition-colors mb-1 flex items-center gap-1.5">
                    {link.label}
                    <ChevronRight className="w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </h3>
                  <p className="text-xs text-slate-400 font-medium leading-relaxed">{link.description}</p>
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* System Summary Activity */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="border-b border-slate-200/80 px-6 py-5 flex items-center gap-2.5">
            <Activity className="w-5 h-5 text-[#D48035]" />
            <h2 className="text-base font-bold text-[#0b264f]">Project Quality Audit</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Approved Projects', value: safeProjects.filter(p => p.status === 'approved').length, textClass: 'text-emerald-700', bgClass: 'bg-emerald-50/40 border-emerald-100' },
                { label: 'Pending Review', value: safeProjects.filter(p => p.status === 'pending').length, textClass: 'text-amber-700', bgClass: 'bg-amber-50/40 border-amber-100' },
                { label: 'Rejected Listings', value: safeProjects.filter(p => p.status === 'rejected').length, textClass: 'text-rose-700', bgClass: 'bg-rose-50/40 border-rose-100' },
                { label: 'Builder Cities', value: new Set(safeProjects.map(p => p.projectLocation?.split(',')[0]?.trim()).filter(Boolean)).size, textClass: 'text-blue-700', bgClass: 'bg-blue-50/40 border-blue-100' },
              ].map((item, i) => (
                <div key={i} className={`rounded-xl p-5 border ${item.bgClass}`}>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">{item.label}</p>
                  {loading ? (
                    <div className="h-7 w-12 bg-white/70 rounded animate-pulse" />
                  ) : (
                    <p className={`text-2xl font-black ${item.textClass}`}>{item.value}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
