"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Building2, Users, TrendingUp, Wallet, BadgePercent, AlertCircle, Loader2, Plus, Calendar, Settings } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
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
        setStats(response || {
          totalBuilders: 0,
          totalInvestors: 0,
          totalCampaigns: 0,
          activeCampaigns: 0,
          totalSpent: 0
        });
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

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans overflow-x-hidden">
      <Header />

      <div className="flex-grow mt-16 md:mt-[4rem] pb-12">
        <div className="bg-gradient-to-r from-slate-800 to-slate-950 text-white pt-6 pb-12 md:pt-10 md:pb-20 px-4 md:px-8 rounded-b-[2rem] md:rounded-b-[2.5rem] shadow-xl relative overflow-hidden">
          <div className="container mx-auto relative z-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
              <div className="w-full md:w-auto">
                <Badge className="bg-orange-500/25 text-orange-200 border-none mb-3 backdrop-blur-sm px-3 py-1">
                  <Settings className="w-3.5 h-3.5 mr-1.5" /> Professional Service Provider Dashboard
                </Badge>
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2">Welcome Back, {user.name}</h1>
                <p className="text-sm md:text-base text-slate-300 opacity-90">Review platform metrics, user demographics, and ad visibility stats.</p>
              </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 md:gap-4 mt-8">
              {[
                { label: 'Registered Builders', value: stats.totalBuilders, icon: Building2, color: 'text-blue-400' },
                { label: 'Registered Investors', value: stats.totalInvestors, icon: Users, color: 'text-green-400' },
                { label: 'Total Campaigns', value: stats.totalCampaigns, icon: BadgePercent, color: 'text-amber-400' },
                { label: 'Active Ads', value: stats.activeCampaigns, icon: TrendingUp, color: 'text-indigo-400' },
                { label: 'Total Ad Spent', value: `₹${stats.totalSpent}`, icon: Wallet, color: 'text-emerald-400' },
              ].map((stat, idx) => (
                <div key={idx} className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-3 md:p-4 flex flex-col justify-between hover:bg-white/10 transition-all cursor-pointer">
                  <div className="flex justify-between items-start">
                    <div className={`p-1.5 md:p-2 rounded-lg bg-white/10 ${stat.color}`}>
                      <stat.icon className="w-4 h-4 md:w-5 md:h-5" />
                    </div>
                  </div>
                  <div className="mt-3 md:mt-4">
                    <p className="text-lg md:text-xl lg:text-2xl font-bold truncate">{stat.value}</p>
                    <p className="text-[10px] md:text-xs text-slate-300 uppercase tracking-wider opacity-85">{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 -mt-4 md:-mt-8 relative z-20 space-y-6 md:space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white rounded-3xl p-4 md:p-6 shadow-sm border border-gray-100">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3 sm:gap-0">
                <h3 className="font-bold text-gray-900 text-lg flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-slate-800" /> Ad Performance Analytics
                </h3>
              </div>
              <div className="h-56 md:h-64 w-full">
                {isLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <Loader2 className="w-8 h-8 text-orange-600 animate-spin" />
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height={256}>
                    <AreaChart data={ANALYTICS_DATA.map(d => ({ ...d, spent: d.name === 'Jun' ? stats.totalSpent : 0 }))}>
                      <defs>
                        <linearGradient id="colorSpent" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} width={30} />
                      <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                      <Area type="monotone" dataKey="spent" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#colorSpent)" />
                    </AreaChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>

            <div className="bg-white rounded-3xl p-4 md:p-6 shadow-sm border border-gray-100 flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-gray-900 text-lg mb-4 flex items-center">
                  <Settings className="w-5 h-5 mr-2 text-orange-500" /> Ecosystem Guidelines
                </h3>
                <div className="space-y-4 text-xs md:text-sm text-slate-500 leading-relaxed">
                  <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl text-blue-800 flex gap-2.5 items-start">
                    <AlertCircle className="w-5 h-5 flex-shrink-0 text-blue-600 mt-0.5" />
                    <p>
                      <strong>Privacy Enforcement:</strong> To protect builders and investors, direct contact details are hidden. All client inquiries routed through ads are reviewed and dispatched by the Admin team.
                    </p>
                  </div>
                  <p>
                    Ensure your ad campaigns contain verified credentials, relevant business contact guidelines, and transparent terms.
                  </p>
                </div>
              </div>

              <div className="mt-6">
                <Button 
                  onClick={() => router.push('/service-provider/advertisements')} 
                  className="w-full bg-[#D48035] hover:bg-[#b06725] text-white py-6 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-md"
                >
                  <Plus className="w-5 h-5" /> Book Advertisement Campaign
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
