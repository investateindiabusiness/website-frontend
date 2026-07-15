"use client";

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/AuthContext';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import {
  Crown, Shield, CheckCircle2, AlertCircle, Loader2,
  CreditCard, ArrowLeft, Lock, RefreshCw, Star
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { apiRequest } from '@/api';
import { toast } from '@/hooks/use-toast';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

// â”€â”€â”€ Stripe Payment Form â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function MembershipPaymentForm({ amount, paymentId, onSuccess }) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsProcessing(true);
    setError(null);

    const { error: stripeError, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: window.location.origin + '/membership?status=success' },
      redirect: 'if_required',
    });

    if (stripeError) {
      setError(stripeError.message);
      setIsProcessing(false);
      return;
    }

    if (paymentIntent && paymentIntent.status === 'succeeded') {
      try {
        await apiRequest('/api/payments/confirm', {
          method: 'POST',
          body: JSON.stringify({ paymentId, stripePaymentIntentId: paymentIntent.id }),
        });
        onSuccess();
      } catch (err) {
        setError('Payment confirmed with Stripe but failed to sync. Please contact support.');
      }
    }

    setIsProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="bg-gray-900/60 border border-gray-700/50 rounded-2xl p-5">
        <PaymentElement
          options={{
            layout: 'tabs',
            style: {
              base: {
                color: '#e5e7eb',
                fontFamily: '"Inter", system-ui, sans-serif',
                fontSize: '14px',
                '::placeholder': { color: '#6b7280' },
              },
            },
          }}
        />
      </div>

      {error && (
        <div className="flex items-start gap-3 bg-red-500/10 border border-red-500/25 rounded-xl px-4 py-3 text-sm text-red-400">
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          {error}
        </div>
      )}

      <Button
        type="submit"
        disabled={!stripe || isProcessing}
        className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-3.5 rounded-2xl text-base shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200"
      >
        {isProcessing ? (
          <><Loader2 className="w-5 h-5 animate-spin" /> Processing…</>
        ) : (
          <><CreditCard className="w-5 h-5" /> Pay ${amount} USD</>
        )}
      </Button>

      <div className="flex items-center justify-center gap-2 text-xs text-gray-600">
        <Lock className="w-3.5 h-3.5" />
        Secured by Stripe Â· 256-bit SSL encryption
      </div>
    </form>
  );
}

// â”€â”€â”€ Success Screen â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function SuccessScreen({ onContinue }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 space-y-5 text-center">
      <div className="w-20 h-20 rounded-full bg-green-500/15 border border-green-500/30 flex items-center justify-center animate-in zoom-in duration-500">
        <CheckCircle2 className="w-10 h-10 text-green-400" />
      </div>
      <div>
        <h2 className="text-white font-bold text-2xl">Membership Activated!</h2>
        <p className="text-gray-400 text-sm mt-2">Your annual membership is now active. Enjoy full access.</p>
      </div>
      <Button
        onClick={onContinue}
        className="bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold px-8 py-3 rounded-2xl flex items-center gap-2"
      >
        Continue to Dashboard
      </Button>
    </div>
  );
}

// â”€â”€â”€ Main Page â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export default function MembershipPage() {
  const { user, refreshUser } = useAuth();
  const router = useRouter();

  const [pricing, setPricing] = useState(null);
  const [clientSecret, setClientSecret] = useState(null);
  const [paymentId, setPaymentId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  // â”€â”€ Check if arrived from Stripe redirect (3D-Secure flow)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('status') === 'success') {
      setSuccess(true);
    }
  }, []);

  useEffect(() => {
    if (refreshUser) {
      refreshUser();
    }
  }, []);

  // â”€â”€ Fetch pricing for this user's role
  const fetchPricing = useCallback(async () => {
    if (!user) return;
    try {
      const data = await apiRequest('/api/auth/membership-pricing');
      const rolePrice = data?.data?.[user.role] ?? 49;
      setPricing({ amount: rolePrice, currency: 'usd' });
    } catch {
      setPricing({ amount: 49, currency: 'usd' }); // fallback
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => { fetchPricing(); }, [fetchPricing]);

  // â”€â”€ Create Stripe payment intent
  const handleCreatePayment = async () => {
    if (!user || !pricing) return;
    setCreating(true);
    setError(null);
    try {
      const data = await apiRequest('/api/payments', {
        method: 'POST',
        body: JSON.stringify({
          amount: pricing.amount,
          currency: 'usd',
          paymentPurpose: 'MEMBERSHIP',
          referenceType: 'MEMBERSHIP',
          referenceId: `${user.uid}_${Date.now()}`,
          metadata: { role: user.role, membershipYear: new Date().getFullYear() },
        }),
      });

      setClientSecret(data.data.clientSecret);
      setPaymentId(data.data.paymentId);
    } catch (err) {
      setError(err.message || 'Could not initialize payment. Please try again.');
    } finally {
      setCreating(false);
    }
  };

  const handleSuccess = async () => {
    setSuccess(true);
    try { await refreshUser?.(); } catch { }
    toast({ title: '✅ Membership Activated', description: 'Your annual membership is now active.' });
  };

  const handleContinue = () => {
    const paths = { admin: '/admin/dashboard', builder: '/builder/dashboard', serviceProvider: '/service-provider/dashboard' };
    router.push(paths[user?.role] || '/dashboard');
  };

  const stripeOptions = clientSecret ? {
    clientSecret,
    appearance: {
      theme: 'night',
      variables: {
        colorPrimary: '#f97316',
        colorBackground: '#1a1a1c',
        colorText: '#e5e7eb',
        borderRadius: '12px',
      },
    },
  } : null;

  const roleLabel = user?.role === 'serviceProvider' ? 'Service Provider' : user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : '';

  // â”€â”€ Compute membership status display
  const isMembershipActive = user?.membershipStatus === 'active' && user?.membershipExpiry && new Date() <= new Date(user.membershipExpiry);

  return (
    <div className="min-h-screen bg-[#0f0f10] py-8 px-4 relative overflow-hidden">
      {/* Background glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-orange-500/4 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-2xl mx-auto">
        {/* Back button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-300 text-sm mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-orange-500/15 border border-orange-500/30 mb-4">
            <Crown className="w-8 h-8 text-orange-400" />
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            {isMembershipActive ? 'Membership Active' : 'Renew Membership'}
          </h1>
          <p className="text-gray-400 text-sm mt-2">
            {isMembershipActive
              ? `Your membership is active until ${new Date(user.membershipExpiry).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`
              : `Annual membership for ${roleLabel} accounts Â· Billed in USD`}
          </p>
        </div>

        {success ? (
          <div className="bg-[#1a1a1c] border border-gray-800 rounded-3xl p-8">
            <SuccessScreen onContinue={handleContinue} />
          </div>
        ) : (
          <div className="grid md:grid-cols-5 gap-6">
            {/* Left: Plan details */}
            <div className="md:col-span-2 space-y-4">
              <div className="bg-[#1a1a1c] border border-gray-800 rounded-2xl p-5 space-y-4">
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-orange-400 fill-orange-400" />
                  <span className="text-white font-bold text-sm">Annual Plan</span>
                </div>

                <div>
                  <div className="text-4xl font-black text-white">Free</div>
                  <div className="text-orange-400 font-semibold text-xs mt-1 uppercase tracking-wider">For the First Year</div>
                </div>

                <div className="border-t border-gray-800 pt-4 space-y-2.5">
                  {[
                    'Full access to all listings',
                    'Investment analytics',
                    'Builder & project details',
                    'Priority support',
                    'KYC verification access',
                  ].map((f) => (
                    <div key={f} className="flex items-center gap-2.5 text-xs text-gray-400">
                      <CheckCircle2 className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
                      {f}
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-[#1a1a1c] border border-gray-800 rounded-2xl p-4 flex items-start gap-3">
                <Shield className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-gray-500 leading-relaxed">
                  Your payment is secured by Stripe. We never store your card details.
                </p>
              </div>
            </div>

            {/* Right: Payment or Active Status */}
            <div className="md:col-span-3 bg-[#1a1a1c] border border-gray-800 rounded-2xl p-6">
              {isMembershipActive ? (
                <div className="flex flex-col items-center justify-center py-8 text-center space-y-5">
                  <div className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center">
                    <Star className="w-8 h-8 text-orange-400 fill-orange-400" />
                  </div>
                  <div>
                    <h2 className="text-white font-bold text-lg">First Year is Free!</h2>
                    <p className="text-sm text-gray-400 mt-2 leading-relaxed">
                      Enjoy full access to all premium features on Investate India for your first year, completely free. No payment details required right now.
                    </p>
                  </div>
                  {/* <div className="w-full bg-gray-900/40 rounded-xl p-4 border border-gray-800/60 text-left space-y-2">
                    {/* <div className="flex justify-between text-xs text-gray-500">
                      <span>Billed Amount:</span>
                      <span className="text-orange-400 font-semibold uppercase text-[10px] tracking-wider">Free (First Year)</span>
                    </div> */}
                  {/* <div className="flex justify-between text-xs text-gray-500">
                      <span>Expires On:</span>
                      <span className="text-gray-300 font-semibold">
                        {new Date(user.membershipExpiry).toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>
                    </div> */}
                  {/* </div> */}
                  <Button
                    onClick={handleContinue}
                    className="w-full bg-[#D48035] hover:bg-[#B45309] text-white text-xs font-bold py-2.5 rounded-xl transition-all"
                  >
                    Go to Dashboard
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center space-y-5">
                  <div className="w-16 h-16 rounded-full bg-orange-500/10 border border-orange-500/30 flex items-center justify-center">
                    <Star className="w-8 h-8 text-orange-400 fill-orange-400" />
                  </div>
                  <div>
                    <h2 className="text-white font-bold text-lg">First Year is Free!</h2>
                    <p className="text-sm text-gray-400 mt-2 leading-relaxed">
                      Enjoy full access to all premium features on Investate India for your first year, completely free. No payment details required right now.
                    </p>
                  </div>
                  <Button
                    onClick={handleContinue}
                    className="w-full bg-[#D48035] hover:bg-[#B45309] text-white text-xs font-bold py-3 rounded-xl transition-all mt-4"
                  >
                    Go to Dashboard
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div >
  );
}
