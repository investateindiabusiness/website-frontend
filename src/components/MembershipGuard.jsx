"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/AuthContext';
import { Shield, Crown, AlertTriangle, ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

/**
 * Computes membership status from user profile + free trial window.
 * Returns: 'trial' | 'active' | 'expired'
 */
function computeMembershipStatus(user, freeTrialExpiryDate) {
  if (!user) return 'expired';

  // 1. Still within the global free trial window
  if (freeTrialExpiryDate && new Date() <= new Date(freeTrialExpiryDate)) {
    return 'trial';
  }

  // 2. User has an active paid membership
  if (user.membershipStatus === 'active' && user.membershipExpiry) {
    if (new Date() <= new Date(user.membershipExpiry)) {
      return 'active';
    }
  }

  return 'expired';
}

export default function MembershipGuard({ children }) {
  const { user } = useAuth();
  const router = useRouter();
  const [status, setStatus] = useState(null); // null = loading
  const [daysLeft, setDaysLeft] = useState(0);

  useEffect(() => {
    const checkMembership = async () => {
      if (!user) return;

      try {
        let freeTrialExpiry = '2027-06-29'; // Default: 1 year from 2026-06-29

        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'}/api/auth/launch-config`);
          const json = await res.json();
          if (json.success) freeTrialExpiry = json.freeTrialExpiryDate;
        } catch {
          // use default
        }

        const computed = computeMembershipStatus(user, freeTrialExpiry);
        setStatus(computed);

        if (computed === 'trial' && freeTrialExpiry) {
          const diff = new Date(freeTrialExpiry) - new Date();
          setDaysLeft(Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24))));
        } else if (computed === 'active' && user.membershipExpiry) {
          const diff = new Date(user.membershipExpiry) - new Date();
          setDaysLeft(Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24))));
        }
      } catch {
        setStatus('trial'); // Fail open during trial period
      }
    };

    checkMembership();
  }, [user]);

  // While checking, show a subtle loader
  if (status === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0f0f10]">
        <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
      </div>
    );
  }

  // Access granted during trial or active membership
  if (status === 'trial' || status === 'active') {
    return <>{children}</>;
  }

  // Membership expired — show paywall
  return (
    <div className="min-h-screen bg-[#0f0f10] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-orange-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-red-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-lg w-full">
        <div className="bg-[#1a1a1c] border border-gray-800 rounded-3xl overflow-hidden shadow-2xl shadow-black/60">
          {/* Top banner */}
          <div className="bg-gradient-to-r from-orange-600/20 to-red-600/20 border-b border-orange-500/20 px-8 py-6 flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-orange-500/15 border border-orange-500/30 flex items-center justify-center flex-shrink-0">
              <Crown className="w-7 h-7 text-orange-400" />
            </div>
            <div>
              <h1 className="text-white font-bold text-xl leading-tight">Membership Expired</h1>
              <p className="text-orange-400/80 text-sm font-medium mt-0.5">Your access has been restricted</p>
            </div>
          </div>

          {/* Body */}
          <div className="px-8 py-7 space-y-5">
            <div className="flex items-start gap-3 bg-red-500/8 border border-red-500/20 rounded-2xl px-4 py-4">
              <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-gray-300 leading-relaxed">
                Your <span className="text-white font-semibold">1-year complimentary membership</span> has ended.
                Renew your membership to continue accessing all features on Investate India.
              </p>
            </div>

            <div className="space-y-3">
              {[
                'Full access to all property listings',
                'Investment opportunity details',
                'Builder profiles & project analytics',
                'Priority support & notifications',
              ].map((feature) => (
                <div key={feature} className="flex items-center gap-3 text-sm text-gray-400">
                  <div className="w-5 h-5 rounded-full bg-orange-500/10 border border-orange-500/30 flex items-center justify-center flex-shrink-0">
                    <Shield className="w-3 h-3 text-orange-400" />
                  </div>
                  {feature}
                </div>
              ))}
            </div>
          </div>

          {/* Footer CTA */}
          <div className="px-8 pb-8">
            <Button
              onClick={() => router.push('/membership')}
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-3 rounded-2xl text-base shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            >
              Renew Membership
              <ArrowRight className="w-5 h-5" />
            </Button>
            <p className="text-center text-xs text-gray-600 mt-3">
              Annual membership · Billed in USD · Secure Stripe payment
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
