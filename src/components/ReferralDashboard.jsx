"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Users, Target, IndianRupee,
  Gift, Trophy, TrendingUp, Copy, CheckCircle2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

export default function ReferralDashboard({ role = 'Investor' }) {
  const [copied, setCopied] = useState(false);
  // referralCode will be populated by the backend API once ready
  const referralCode = 'INV-8X29Q';
  const referralLink = referralCode ? `https://investateindia.com/register?ref=${referralCode}` : '';

  const handleCopy = () => {
    if (!referralLink) return;
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    toast({ title: 'Copied!', description: 'Referral link copied to clipboard.' });
    setTimeout(() => setCopied(false), 2000);
  };

  const stats = [
    { label: 'Total Referrals', value: '—', icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { label: 'Successful Conversions', value: '—', icon: Target, color: 'text-green-500', bg: 'bg-green-500/10' },
    { label: 'Total Earnings', value: '—', icon: IndianRupee, color: 'text-orange-500', bg: 'bg-orange-500/10' },
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">

      {/* Header Area */}
      <div className="bg-gradient-to-br from-[#0b264f] to-[#1a4b8c] rounded-3xl p-8 text-white relative overflow-hidden shadow-lg">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="space-y-2 text-center md:text-left">
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight flex items-center justify-center md:justify-start gap-2">
              <Gift className="w-7 h-7 text-orange-400" /> Refer & Earn Rewards
            </h1>
            <p className="text-blue-100/80 text-sm md:text-base max-w-lg">
              Invite your network to Investate India and earn exclusive rewards for every successful onboarding.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl w-full md:w-auto">
            <p className="text-xs text-blue-200 uppercase tracking-wider font-bold mb-2 text-center md:text-left">Your Referral Link</p>
            <div className="flex items-center gap-2 bg-black/20 p-2 rounded-xl border border-white/10">
              <span className="text-sm font-mono px-2 w-48 md:w-56 text-blue-200 italic truncate">
                {referralCode || 'Coming soon...'}
              </span>
              <Button
                onClick={handleCopy}
                size="sm"
                disabled={!referralCode}
                title={referralCode ? 'Copy referral link' : 'Referral code not yet assigned'}
                className={`rounded-lg transition-all shrink-0 ${
                  copied ? 'bg-green-500 hover:bg-green-600' : 'bg-orange-500 hover:bg-orange-600'
                } disabled:opacity-40 disabled:cursor-not-allowed`}
              >
                {copied ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            key={i}
            className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow"
          >
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${stat.bg} ${stat.color} shrink-0`}>
              <stat.icon className="w-7 h-7" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
              <h3 className="text-2xl font-black text-gray-400 mt-1">{stat.value}</h3>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Milestones / Rewards Flow */}
        <div className="lg:col-span-1 bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
          <h3 className="font-bold text-lg text-gray-900 mb-6 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-orange-500" /> Reward Milestones
          </h3>
          <div className="flex flex-col items-center justify-center py-10 text-center gap-3">
            <Trophy className="w-12 h-12 text-gray-200" />
            <p className="text-gray-400 text-sm font-medium">Milestones will appear here once the referral system is activated.</p>
          </div>
        </div>

        {/* Recent Referrals Table */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-100 p-6 shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-lg text-gray-900 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-[#0b264f]" /> Recent Activity
            </h3>
          </div>

          <div className="flex-grow overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="py-3 px-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Referred User</th>
                  <th className="py-3 px-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Date Joined</th>
                  <th className="py-3 px-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="py-3 px-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Reward</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan={4} className="py-16 text-center">
                    <div className="flex flex-col items-center gap-3 text-gray-400">
                      <Users className="w-12 h-12 text-gray-200" />
                      <p className="font-medium">No referrals yet.</p>
                      <p className="text-sm text-gray-400">Share your referral link to start earning rewards!</p>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
