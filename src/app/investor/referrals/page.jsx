"use client";

import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ReferralDashboard from '@/components/ReferralDashboard';
import { useAuth } from '@/hooks/AuthContext';

export default function InvestorReferralsPage() {
  const { user } = useAuth();
  
  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#f5f6fa] font-sans pb-16 overflow-x-hidden flex flex-col">
      <div className="flex-grow pb-12 pt-6 px-4 md:px-8">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#0b264f]">Referrals & Rewards</h1>
          <p className="text-gray-500 text-sm mt-1">Manage your referrals, track conversions, and view earnings.</p>
        </div>
        <ReferralDashboard role="Investor" />
      </div>
    </div>
  );
}
