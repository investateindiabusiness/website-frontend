"use client";

import React, { useEffect, useState } from 'react';
import { apiRequest } from '@/api';
import { toast } from '@/hooks/use-toast';
import { DollarSign, Crown, Save, Loader2, RefreshCw, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ROLES = [
  {
    key: 'investor',
    label: 'Investor',
    description: 'Individual investors browsing property listings',
    color: 'from-blue-500/10 to-blue-600/5 border-blue-500/20',
    badge: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  },
  {
    key: 'builder',
    label: 'Builder',
    description: 'Real estate builders & developers listing projects',
    color: 'from-purple-500/10 to-purple-600/5 border-purple-500/20',
    badge: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  },
  {
    key: 'serviceProvider',
    label: 'Service Provider',
    description: 'Third-party service companies on the platform',
    color: 'from-green-500/10 to-green-600/5 border-green-500/20',
    badge: 'bg-green-500/10 text-green-400 border-green-500/20',
  },
];

export default function AdminMembershipPricingPage() {
  const [pricing, setPricing] = useState({ investor: 49, builder: 99, serviceProvider: 49, currency: 'usd' });
  const [form, setForm] = useState({ investor: '', builder: '', serviceProvider: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchPricing = async () => {
    setLoading(true);
    try {
      const data = await apiRequest('/api/admin/membership-pricing');
      if (data?.data) {
        setPricing(data.data);
        setForm({
          investor: String(data.data.investor ?? 49),
          builder: String(data.data.builder ?? 99),
          serviceProvider: String(data.data.serviceProvider ?? 49),
        });
        setLastUpdated(data.data.updatedAt);
      }
    } catch (err) {
      toast({ title: 'Failed to load pricing', description: err.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPricing(); }, []);

  const handleSave = async () => {
    const updates = {};
    let hasError = false;

    for (const role of ROLES) {
      const val = parseFloat(form[role.key]);
      if (isNaN(val) || val <= 0) {
        toast({ title: `Invalid price for ${role.label}`, description: 'Must be a positive number in USD.', variant: 'destructive' });
        hasError = true;
        break;
      }
      updates[role.key] = val;
    }
    if (hasError) return;

    setSaving(true);
    try {
      await apiRequest('/api/admin/membership-pricing', {
        method: 'PATCH',
        body: JSON.stringify(updates),
      });
      toast({ title: '✅ Pricing Updated', description: 'Membership prices have been saved successfully.' });
      fetchPricing();
    } catch (err) {
      toast({ title: 'Save Failed', description: err.message, variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-500/20">
            <Crown className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900">Membership Pricing</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Set annual membership prices per user role · All amounts in <strong>USD ($)</strong>
            </p>
          </div>
          <button
            onClick={fetchPricing}
            className="ml-auto p-2.5 rounded-xl border border-gray-200 hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {/* Info banner */}
        <div className="flex items-start gap-3 bg-blue-50 border border-blue-200 rounded-2xl px-5 py-4 mb-6">
          <Info className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-blue-700 leading-relaxed">
            Prices shown here are the annual membership fees charged via Stripe when a user's complimentary trial expires.
            Changes take effect immediately for new payment sessions. Currency is always <strong>USD</strong>.
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
          </div>
        ) : (
          <div className="space-y-4">
            {ROLES.map((role) => (
              <div
                key={role.key}
                className={`bg-gradient-to-r ${role.color} border rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center gap-4`}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${role.badge}`}>
                      {role.label}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">{role.description}</p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm">$</span>
                    <input
                      type="number"
                      min="1"
                      step="0.01"
                      value={form[role.key]}
                      onChange={(e) => setForm((prev) => ({ ...prev, [role.key]: e.target.value }))}
                      className="w-32 pl-7 pr-3 py-2.5 bg-white border border-gray-300 rounded-xl text-gray-900 font-bold text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20 transition-all"
                    />
                  </div>
                  <span className="text-xs text-gray-400 font-medium">USD / year</span>
                </div>
              </div>
            ))}

            {/* Save Button */}
            <div className="flex items-center justify-between pt-4">
              {lastUpdated && (
                <p className="text-xs text-gray-400">
                  Last updated: {new Date(lastUpdated).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </p>
              )}
              <Button
                onClick={handleSave}
                disabled={saving}
                className="ml-auto bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold px-8 py-2.5 rounded-xl flex items-center gap-2 shadow-lg shadow-orange-500/20 disabled:opacity-60"
              >
                {saving ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Saving…</>
                ) : (
                  <><Save className="w-4 h-4" /> Save Pricing</>
                )}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
