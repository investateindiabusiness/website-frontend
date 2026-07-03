"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Building2, Users, TrendingUp, Wallet, BadgePercent,
  AlertCircle, Loader2, Plus, Settings, Users2, Mail,
  ArrowRight, Zap, CheckCircle, BarChart2, Target
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/AuthContext';
import { fetchServiceProviderStats } from '@/api';
import { toast } from '@/hooks/use-toast';

const ANALYTICS_DATA = [
  { name: 'Jan', spent: 0 },
  { name: 'Feb', spent: 0 },
  { name: 'Mar', spent: 0 },
  { name: 'Apr', spent: 0 },
  { name: 'May', spent: 0 },
  { name: 'Jun', spent: 0 },
];

const QUICK_ACTIONS = [
  { label: 'Investor & Builder Directory', description: 'Browse verified users, send professional messages reviewed by admin.', path: '/service-provider/directory', icon: Users2, gradient: 'from-slate-700 to-slate-900', accent: 'text-blue-300', accentBg: 'bg-blue-500/15 border-blue-400/20' },
  { label: 'My Outreach Messages', description: 'Track messages sent — view delivery status, admin decisions, replies.', path: '/service-provider/outreach', icon: Mail, gradient: 'from-orange-600 to-orange-800', accent: 'text-orange-100', accentBg: 'bg-white/15 border-white/20' },
  { label: 'Ad Campaigns', description: 'Launch targeted ad campaigns and boost your visibility on the platform.', path: '/service-provider/advertisements', icon: Target, gradient: 'from-indigo-600 to-indigo-800', accent: 'text-indigo-100', accentBg: 'bg-white/15 border-white/20' },
];

export default function ServiceProviderDashboard() {
  const router = useRouter();
  const { user } = useAuth();

  const [stats, setStats] = useState({
    totalBuilders: 0,
    totalInvestors: 0,
    totalCampaigns: 0,
    activeCampaigns: 0,
    totalSpent: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      if (!user) return;
      try {
        setIsLoading(true);
        const response = await fetchServiceProviderStats();
        setStats(response || { totalBuilders: 0, totalInvestors: 0, totalCampaigns: 0, activeCampaigns: 0, totalSpent: 0 });
      } catch (error) {
        console.error("Stats Loading Error:", error);
        toast({ title: "Error", description: "Failed to load dashboard statistics.", variant: "destructive" });
      } finally {
        setIsLoading(false);
      }
    };
    loadStats();
  }, [user]);

  if (!user) return null;

  const statCards = [
    { label: 'Registered Builders', value: stats.totalBuilders, icon: Building2, gradient: 'from-blue-500 to-blue-600' },
    { label: 'Registered Investors', value: stats.totalInvestors, icon: Users, gradient: 'from-emerald-500 to-emerald-600' },
    { label: 'Total Campaigns', value: stats.totalCampaigns, icon: BadgePercent, gradient: 'from-amber-500 to-amber-600' },
    { label: 'Active Ads', value: stats.activeCampaigns, icon: TrendingUp, gradient: 'from-indigo-500 to-indigo-600' },
    { label: 'Total Ad Spent', value: `₹${stats.totalSpent}`, icon: Wallet, gradient: 'from-rose-500 to-rose-600' },
  ];

  return (
    <div className="min-h-screen bg-[#f5f6fa] font-sans pb-16 overflow-x-hidden">
      {/* Hero */}
      <div className="relative bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 text-white px-6 pt-10 pb-28 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-20 -right-20 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-orange-500/5 rounded-full blur-3xl" />
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_bottom_right,rgba(79,70,229,0.08),transparent_60%)]" />
        </div>
        <div className="container mx-auto relative z-10">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <Badge className="bg-orange-500/20 text-orange-300 border-none mb-3 px-3 py-1">
                <Settings className="w-3.5 h-3.5 mr-1.5" /> Service Provider
              </Badge>
              <h1 className="text-3xl md:text-4xl font-extrabold leading-tight">
                Welcome back,<br />
                <span className="text-orange-400">{user.name}</span>
              </h1>
              <p className="text-slate-400 text-sm mt-2 opacity-90">Monitor metrics, manage campaigns, and connect with clients.</p>
              <div className="flex flex-wrap gap-3 mt-5">
                <Button
                  onClick={() => router.push('/service-provider/advertisements')}
                  className="bg-orange-500 hover:bg-orange-600 text-white rounded-xl gap-2"
                >
                  <Plus className="w-4 h-4" /> New Campaign
                </Button>
                <Button
                  onClick={() => router.push('/service-provider/directory')}
                  variant="outline"
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20 rounded-xl gap-2"
                >
                  <Users2 className="w-4 h-4" /> Directory
                </Button>
              </div>
            </div>

            {/* Ecosystem Guidelines pill */}
            <div className="bg-white/5 backdrop-blur border border-white/10 rounded-3xl p-5 max-w-xs">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-white mb-1">Privacy Enforcement</p>
                  <p className="text-xs text-slate-400 leading-relaxed">Direct contact details are hidden. All client messages are reviewed and dispatched by the Admin team.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 -mt-14 relative z-10 space-y-8">
        {/* Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          {statCards.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              className="bg-white rounded-3xl p-5 shadow-md border border-white/60 flex flex-col gap-3"
            >
              <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${s.gradient} flex items-center justify-center shadow-sm`}>
                <s.icon className="w-5 h-5 text-white" />
              </div>
              {isLoading
                ? <div className="h-7 w-12 bg-gray-100 rounded animate-pulse" />
                : <div>
                    <p className="text-2xl font-extrabold text-gray-900">{s.value}</p>
                    <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mt-0.5">{s.label}</p>
                  </div>
              }
            </motion.div>
          ))}
        </div>

        {/* Chart */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
              <BarChart2 className="w-5 h-5 text-slate-800" /> Ad Performance Analytics
            </h3>
            <Badge className="bg-indigo-50 text-indigo-600 border-none text-xs font-bold px-3 py-1">
              <Zap className="w-3 h-3 mr-1" /> Live Data
            </Badge>
          </div>
          <div className="h-56">
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={ANALYTICS_DATA.map(d => ({ ...d, spent: d.name === 'Jun' ? stats.totalSpent : 0 }))}>
                  <defs>
                    <linearGradient id="colorSpent" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} width={30} />
                  <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                  <Area type="monotone" dataKey="spent" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#colorSpent)" name="Ad Spend (₹)" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Quick Action Cards */}
        <div>
          <h2 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {QUICK_ACTIONS.map((action, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                onClick={() => router.push(action.path)}
                className={`bg-gradient-to-br ${action.gradient} rounded-3xl p-6 shadow-md cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-200 group relative overflow-hidden`}
              >
                <div className="absolute -top-8 -right-8 w-32 h-32 bg-white/5 rounded-full blur-2xl pointer-events-none" />
                <div className="relative z-10">
                  <div className={`w-12 h-12 rounded-2xl border ${action.accentBg} flex items-center justify-center mb-4`}>
                    <action.icon className={`w-6 h-6 ${action.accent}`} />
                  </div>
                  <h3 className="text-white font-bold text-base mb-2">{action.label}</h3>
                  <p className={`${action.accent} text-xs leading-relaxed mb-5 opacity-80`}>{action.description}</p>
                  <div className={`flex items-center gap-2 ${action.accent} text-sm font-semibold group-hover:gap-3 transition-all`}>
                    <span>Open</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Ad Spend Button */}
        <div className="bg-gradient-to-r from-[#D48035] to-orange-700 rounded-3xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-md">
          <div>
            <p className="text-white font-bold text-lg">Ready to boost your reach?</p>
            <p className="text-orange-100 text-sm mt-1 opacity-80">Launch a new advertisement campaign to reach builders & investors.</p>
          </div>
          <Button
            onClick={() => router.push('/service-provider/advertisements')}
            className="bg-white text-orange-700 hover:bg-orange-50 font-bold rounded-2xl px-6 py-3 shadow gap-2 shrink-0"
          >
            <Plus className="w-4 h-4" /> Book Campaign
          </Button>
        </div>
      </div>
    </div>
  );
}
