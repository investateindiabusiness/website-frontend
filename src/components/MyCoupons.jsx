"use client";

import React, { useState, useEffect } from 'react';
import { getSocket, joinUser, leaveUser } from '@/utils/socket';
import { fetchMyCoupons } from '@/api';
import { toast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Tag, Gift, AlertCircle, Copy, Check } from 'lucide-react';
import { useAuth } from '@/hooks/AuthContext';

export default function MyCoupons() {
  const { user } = useAuth();
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState(null);

  useEffect(() => {
    if (user) {
      loadCoupons();
      joinUser(user.uid);
      
      const socket = getSocket();
      
      const handleNewCoupon = (couponData) => {
        toast({ title: "New Coupon!", description: `You received a new coupon: ${couponData.code}` });
        loadCoupons();
      };
      
      socket.on('new_coupon', handleNewCoupon);
      
      return () => {
        socket.off('new_coupon', handleNewCoupon);
        leaveUser(user.uid);
      };
    }
  }, [user]);

  const loadCoupons = async () => {
    try {
      setLoading(true);
      const res = await fetchMyCoupons();
      setCoupons(res?.data || []);
    } catch (err) {
      // Silently set empty — backend may not be ready or coupon route unavailable
      setCoupons([]);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  if (!user) return null;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
          <Gift className="w-8 h-8 text-[#0b264f]" />
          My Rewards & Coupons
        </h1>
        <p className="text-slate-500 mt-2">View all your available promotional codes and discounts.</p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-32">
          <Loader2 className="w-8 h-8 text-[#0b264f] animate-spin" />
        </div>
      ) : coupons.length === 0 ? (
        <Card className="border-dashed border-2 border-slate-200 bg-slate-50/50">
          <CardContent className="flex flex-col items-center justify-center py-24 text-center">
            <Tag className="w-16 h-16 text-slate-300 mb-4" />
            <h3 className="text-xl font-bold text-slate-700">No coupons available</h3>
            <p className="text-slate-500 mt-2 max-w-sm">
              You don't have any active coupons at the moment. Keep an eye out for future promotions!
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {coupons.map((coupon) => (
            <Card key={coupon.id} className="border-none shadow-md hover:shadow-lg transition-all rounded-2xl overflow-hidden group">
              <div className="h-2 w-full bg-gradient-to-r from-[#0b264f] to-[#D48035]" />
              <CardHeader className="bg-white pb-2 relative">
                <div className="absolute top-4 right-4">
                  <Badge variant="secondary" className={coupon.type === 'launch' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'}>
                    {coupon.type === 'launch' ? 'Launch Promo' : 'Special Offer'}
                  </Badge>
                </div>
                <CardTitle className="text-3xl font-bold text-green-600 mt-2">
                  ₹{coupon.discountAmount} <span className="text-sm font-medium text-slate-500 line-through">Off</span>
                </CardTitle>
                <CardDescription className="text-slate-600 font-medium">
                  {coupon.type === 'launch' ? 'Welcome to Investate India!' : 'Exclusive discount for you.'}
                </CardDescription>
              </CardHeader>
              <CardContent className="bg-slate-50/50 pt-4 pb-6 px-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">Coupon Code</label>
                    <div 
                      onClick={() => copyToClipboard(coupon.code)}
                      className="mt-1 flex items-center justify-between bg-white border border-slate-200 p-3 rounded-xl cursor-pointer hover:border-[#0b264f] transition-colors group-hover:border-[#0b264f]/30"
                    >
                      <span className="font-mono font-bold text-lg text-slate-800 tracking-wider">{coupon.code}</span>
                      {copiedCode === coupon.code ? (
                        <Check className="w-5 h-5 text-green-500" />
                      ) : (
                        <Copy className="w-5 h-5 text-slate-400 hover:text-[#0b264f]" />
                      )}
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center text-xs text-slate-500 border-t border-slate-100 pt-3">
                    <span className="flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {coupon.validUntil ? `Valid till ${new Date(coupon.validUntil).toLocaleDateString()}` : 'No expiry'}
                    </span>
                    <span>
                      Uses left: <strong className="text-slate-700">{coupon.maxUses - coupon.usedCount}</strong>
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
