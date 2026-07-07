"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Building2, FileText, Users, MessageSquare, Loader2,
  RefreshCw, ShieldCheck, TrendingUp, Inbox, Activity, ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/AuthContext';
import { fetchAllProjects, fetchAllLeads, fetchAllInquiries } from '@/api';

const QUICK_LINKS = [
  { label: 'Projects', path: '/admin/projects', color: 'from-blue-500 to-blue-700', icon: Building2 },
  { label: 'Builders', path: '/admin/builders', color: 'from-emerald-500 to-emerald-700', icon: Users },
  { label: 'Leads', path: '/admin/leads', color: 'from-orange-500 to-orange-700', icon: TrendingUp },
  { label: 'Inquiries', path: '/admin/inquiries', color: 'from-purple-500 to-purple-700', icon: FileText },
  { label: 'Helpdesk', path: '/admin/helpdesk', color: 'from-rose-500 to-rose-700', icon: MessageSquare },
  { label: 'SP Outreach', path: '/admin/sp-outreach', color: 'from-slate-600 to-slate-900', icon: Inbox },
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
        fetchAllProjects({ page: 1, limit: 1000 }),
        fetchAllLeads(),
        fetchAllInquiries()
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
    { label: 'Total Projects', value: safeProjects.length, icon: Building2, gradient: 'from-blue-500 to-blue-600' },
    { label: 'Active Builders', value: new Set(safeProjects.filter(p => p.builderName).map(p => p.builderName)).size, icon: Users, gradient: 'from-emerald-500 to-emerald-600' },
    { label: 'Project Leads', value: safeLeads.length, icon: TrendingUp, gradient: 'from-orange-500 to-orange-600' },
    { label: 'General Inquiries', value: safeInquiries.length, icon: FileText, gradient: 'from-purple-500 to-purple-600' },
  ];

  return (
    <div className="min-h-screen bg-[#f5f6fa] font-sans pb-16 overflow-x-hidden">
      {/* Hero */}
      <div className="relative bg-gradient-to-br from-[#0b264f] via-[#1a3e7a] to-[#0b264f] text-white px-4 sm:px-6 pt-8 pb-20 sm:pb-24 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -right-20 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-indigo-500/10 rounded-full blur-2xl" />
        </div>
        <div className="container mx-auto relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <ShieldCheck className="w-4 h-4 text-orange-400" />
              <span className="text-xs font-bold uppercase tracking-widest text-orange-300">Admin Control Panel</span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold leading-tight">
              Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 17 ? 'Afternoon' : 'Evening'},<br />
              <span className="text-orange-300">{user?.name || 'Admin'}</span>
            </h1>
            <p className="text-blue-200 text-sm mt-2 opacity-80">Here's your platform overview for today.</p>
          </div>
          <Button
            variant="outline"
            onClick={loadDashboardData}
            disabled={loading}
            className="bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur rounded-xl gap-2 self-start sm:self-auto"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
            Refresh
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-3 sm:px-4 md:px-6 -mt-12 relative z-10 space-y-6">
        {/* Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {stats.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-5 shadow-md border border-white/60 flex flex-col gap-2 sm:gap-3"
            >
              <div className={`w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-gradient-to-br ${s.gradient} flex items-center justify-center shadow-sm`}>
                <s.icon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <div>
                {loading
                  ? <div className="h-7 w-14 bg-gray-100 rounded animate-pulse mb-1" />
                  : <p className="text-xl sm:text-2xl font-extrabold text-gray-900">{s.value}</p>
                }
                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider leading-tight">{s.label}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Quick Links */}
        <div>
          <h2 className="text-xs sm:text-sm font-bold uppercase tracking-widest text-gray-400 mb-3 sm:mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {QUICK_LINKS.map((link, i) => (
              <motion.button
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => router.push(link.path)}
                className={`bg-gradient-to-br ${link.color} text-white rounded-2xl sm:rounded-3xl p-3 sm:p-5 flex flex-col items-start gap-2 sm:gap-3 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-200 text-left group`}
              >
                <div className="bg-white/20 rounded-lg sm:rounded-xl p-2">
                  <link.icon className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <span className="font-bold text-xs sm:text-sm leading-tight">{link.label}</span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Activity Panel */}
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-md border border-gray-100 p-4 sm:p-6">
          <div className="flex items-center gap-2 mb-4 sm:mb-5">
            <Activity className="w-5 h-5 text-orange-500" />
            <h2 className="text-base sm:text-lg font-bold text-gray-900">Platform Summary</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            {[
              { label: 'Approved Projects', value: safeProjects.filter(p => p.status === 'approved').length, color: 'text-green-600', bg: 'bg-green-50' },
              { label: 'Pending Review', value: safeProjects.filter(p => p.status === 'pending').length, color: 'text-yellow-600', bg: 'bg-yellow-50' },
              { label: 'Rejected', value: safeProjects.filter(p => p.status === 'rejected').length, color: 'text-red-600', bg: 'bg-red-50' },
              { label: 'Builder Locations', value: new Set(safeProjects.map(p => p.projectLocation?.split(',')[0]?.trim()).filter(Boolean)).size, color: 'text-blue-600', bg: 'bg-blue-50' },
            ].map((item, i) => (
              <div key={i} className={`${item.bg} rounded-xl sm:rounded-2xl px-4 py-3 sm:px-5 sm:py-4`}>
                {loading
                  ? <div className="h-6 w-10 bg-white/60 rounded animate-pulse mb-1" />
                  : <p className={`text-xl sm:text-2xl font-extrabold ${item.color}`}>{item.value}</p>
                }
                <p className="text-[10px] sm:text-xs font-semibold text-gray-500 mt-0.5 leading-tight">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
