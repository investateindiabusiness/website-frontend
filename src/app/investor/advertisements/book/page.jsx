"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuth } from '@/hooks/AuthContext';
import { toast } from '@/hooks/use-toast';
import { getSocket, joinUser, leaveUser } from '@/utils/socket';
import { bookSlot, fetchAdZones, fetchMyCoupons, validateCoupon } from '@/api';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from '@/components/CheckoutForm';
import { Calendar, Loader2, ArrowLeft, Image as ImageIcon, CheckCircle, Clock, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { compressAdImage } from '@/utils/imageCompressor';

const ZONE_META = {
  zone1: { name: 'Builder Dashboard Top Banner',       cost: 100, campaignDuration: 7, width: 728, height: 90 },
  zone2: { name: 'Investor Dashboard Leaderboard',     cost: 150, campaignDuration: 7, width: 728, height: 90 },
  zone3: { name: 'Investor Project Details Sidebar',   cost: 120, campaignDuration: 7, width: 300, height: 250 },
  zone4: { name: 'Project Search Results Inline Ad',   cost: 80,  campaignDuration: 7, width: 728, height: 90 },
  zone5: { name: 'Landing Page Hero Spotlight',        cost: 200, campaignDuration: 7, width: 970, height: 250 },
};

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_test_placeholder');

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  if (/^\d{2}-\d{2}-\d{4}$/.test(dateStr)) return dateStr;
  const parts = dateStr.split('-');
  if (parts.length === 3 && parts[0].length === 4) {
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
  }
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

function BookingFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();

  const zoneId = searchParams.get('zoneId');
  const slotId = searchParams.get('slotId');
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');
  const timeSlot = searchParams.get('timeSlot') || 'All Day';

  const [selectedZone, setSelectedZone] = useState(null);
  const [loadingZone, setLoadingZone] = useState(true);
  const [adContent, setAdContent] = useState({
    imageUrl: '',
    videoUrl: '',
    text: '',
    targetUrl: ''
  });
  
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [imageBase64, setImageBase64] = useState('');
  const [isSubmittingBooking, setIsSubmittingBooking] = useState(false);
  const [spinnerMsg, setSpinnerMsg] = useState('Complete Booking');
  const [paymentClientSecret, setPaymentClientSecret] = useState(null);
  const [paymentId, setPaymentId] = useState(null);
  
  // Coupon States
  const [coupons, setCoupons] = useState([]);
  const [loadingCoupons, setLoadingCoupons] = useState(false);
  const [couponCodeInput, setCouponCodeInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [validatingCoupon, setValidatingCoupon] = useState(false);

  useEffect(() => {
    if (user && zoneId) {
      loadZoneDetails();
      loadAvailableCoupons();
      joinUser(user.uid);

      const socket = getSocket();
      const handleNewCoupon = (couponData) => {
        toast({ title: "New Coupon!", description: `You received coupon code: ${couponData.code}` });
        loadAvailableCoupons();
      };
      socket.on('new_coupon', handleNewCoupon);

      return () => {
        socket.off('new_coupon', handleNewCoupon);
        leaveUser(user.uid);
      };
    }
  }, [user, zoneId]);

  const loadAvailableCoupons = async () => {
    try {
      setLoadingCoupons(true);
      const res = await fetchMyCoupons();
      setCoupons(res.data || []);
    } catch (error) {
      console.error("Failed to load user coupons:", error);
    } finally {
      setLoadingCoupons(false);
    }
  };

  const loadZoneDetails = async () => {
    try {
      setLoadingZone(true);
      const data = await fetchAdZones();
      const zonesList = data.data || [];
      const zoneObj = zonesList.find(z => z.id === zoneId);
      if (zoneObj) {
        setSelectedZone({
          ...ZONE_META[zoneId],
          ...zoneObj,
          name: zoneObj.name || ZONE_META[zoneId]?.name || zoneId,
          cost: zoneObj.cost ?? ZONE_META[zoneId]?.cost ?? 0,
        });
      } else {
        setSelectedZone({
          id: zoneId,
          ...ZONE_META[zoneId],
        });
      }
    } catch (error) {
      console.error("Error loading zone details:", error);
      setSelectedZone({
        id: zoneId,
        ...ZONE_META[zoneId],
      });
    } finally {
      setLoadingZone(false);
    }
  };

  // Compress image locally and convert to base64 instantly (no network call)
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));

    try {
      const compressed = await compressAdImage(file);
      // Convert to base64 data URL — instant, no upload needed
      const reader = new FileReader();
      reader.onloadend = () => setImageBase64(reader.result);
      reader.readAsDataURL(compressed);
    } catch (err) {
      toast({ title: 'Image Processing Failed', description: err.message, variant: 'destructive' });
      setImageFile(null);
      setImagePreview('');
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview('');
    setImageBase64('');
  };

  const handleApplyCoupon = async (codeToApply) => {
    const code = (codeToApply || couponCodeInput).trim().toUpperCase();
    if (!code) return;
    try {
      setValidatingCoupon(true);
      const res = await validateCoupon(code);
      if (res.data) {
        setAppliedCoupon(res.data);
        setCouponCodeInput(code);
        toast({ title: "Coupon Applied!", description: `Discount of ₹${res.data.discountAmount} applied.` });
      }
    } catch (error) {
      toast({ title: "Invalid Coupon", description: error.message || "Failed to validate coupon.", variant: "destructive" });
    } finally {
      setValidatingCoupon(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCodeInput('');
  };

  const discountedCost = Math.max(0, (selectedZone?.cost || 0) - (appliedCoupon?.discountAmount || 0));

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (!imageFile || !imageBase64) {
      return toast({ title: "Validation Error", description: "Ad image is required.", variant: "destructive" });
    }
    if (!adContent.targetUrl) {
      return toast({ title: "Validation Error", description: "Ad redirect URL is required.", variant: "destructive" });
    }
    if (!adContent.text) {
      return toast({ title: "Validation Error", description: "Ad caption text is required.", variant: "destructive" });
    }

    try {
      setIsSubmittingBooking(true);
      setSpinnerMsg('Booking Campaign Slot...');

      // Send compressed base64 image directly — no Firebase upload needed
      const response = await bookSlot({
        zoneId,
        slotId,
        timeSlot,
        couponCode: appliedCoupon?.code,
        adContent: {
          ...adContent,
          imageUrl: imageBase64
        }
      });
      
      if (response?.data?.payment?.clientSecret) {
        setPaymentClientSecret(response.data.payment.clientSecret);
        setPaymentId(response.data.payment.paymentId || null);
      } else {
        toast({ 
          title: "Campaign Booked!", 
          description: "Your campaign has been submitted successfully." 
        });
        router.push('/investor/advertisements');
      }
    } catch (error) {
      toast({ 
        title: "Booking Failed", 
        description: error.message || "Failed to submit campaign details.", 
        variant: "destructive" 
      });
    } finally {
      setIsSubmittingBooking(false);
      setSpinnerMsg('Complete Booking');
    }
  };

  if (loadingZone) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600 mb-4" />
        <p className="text-gray-500">Loading campaign setup...</p>
      </div>
    );
  }

  return (
    <Card className="w-full max-w-xl bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden mx-auto my-8">
      <CardHeader className="bg-[#0b264f] text-white p-6 relative">
        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => router.push('/investor/advertisements')}
            className="text-white hover:text-white/80 hover:bg-white/10 rounded-full"
            type="button"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <CardTitle className="text-xl font-bold">
              {paymentClientSecret ? 'Complete Payment' : 'Campaign Details'}
            </CardTitle>
            <CardDescription className="text-xs text-blue-100/80 mt-1">
              Book slot for: {selectedZone?.name}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      
      {paymentClientSecret ? (
        <CardContent className="p-8">
          <Elements stripe={stripePromise} options={{ clientSecret: paymentClientSecret, appearance: { theme: 'stripe' } }}>
            <CheckoutForm 
              amount={discountedCost}
              paymentId={paymentId}
              onSuccess={() => {
                toast({ title: "Payment Complete!", description: "Your campaign booking is fully paid and active." });
                router.push('/investor/advertisements');
              }} 
              onCancel={() => setPaymentClientSecret(null)} 
            />
          </Elements>
        </CardContent>
      ) : (
        <form onSubmit={handleBookingSubmit}>
          <CardContent className="p-8 space-y-6">
            {/* Dates + Time Display */}
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {/* Start Date */}
                <div className="space-y-1">
                  <span className="font-semibold text-slate-400 uppercase tracking-wide block text-[9px]">Start Date</span>
                  <p className="text-slate-800 text-sm font-bold flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-slate-400 flex-shrink-0" />
                    {formatDate(startDate)}
                  </p>
                </div>

                {/* End Date */}
                <div className="space-y-1">
                  <span className="font-semibold text-slate-400 uppercase tracking-wide block text-[9px]">End Date</span>
                  <p className="text-slate-800 text-sm font-bold flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-slate-400 flex-shrink-0" />
                    {formatDate(endDate)}
                  </p>
                </div>
              </div>

              {/* Selected Time Slot Display */}
              <div className="border-t border-slate-100 pt-3 flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-400 uppercase tracking-wide block text-[9px]">Ad Display Timing</span>
                <span className="text-slate-700 font-bold flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  {timeSlot}
                </span>
              </div>

              <div className="border-t border-slate-100 pt-3 flex justify-between items-center">
                <span className="text-[9px] font-semibold text-slate-400 uppercase tracking-wide">Total Cost</span>
                <div className="text-right">
                  {appliedCoupon && (
                    <span className="text-xs text-slate-400 line-through mr-2">₹{selectedZone?.cost}</span>
                  )}
                  <strong className="text-[#0b264f] text-base font-bold">₹{discountedCost}</strong>
                </div>
              </div>
            </div>

            {/* Coupons Section */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-600 block">Apply Coupon</label>
              <div className="flex gap-2">
                <input 
                  type="text"
                  placeholder="ENTER CODE"
                  disabled={!!appliedCoupon}
                  className="flex-1 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#0b264f] uppercase font-semibold text-slate-700 placeholder-slate-400 shadow-sm"
                  value={couponCodeInput}
                  onChange={(e) => setCouponCodeInput(e.target.value)}
                />
                {appliedCoupon ? (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleRemoveCoupon}
                    className="rounded-xl border-red-200 text-red-600 hover:bg-red-50"
                  >
                    Remove
                  </Button>
                ) : (
                  <Button
                    type="button"
                    onClick={() => handleApplyCoupon()}
                    disabled={validatingCoupon || !couponCodeInput}
                    className="bg-[#0b264f] hover:bg-blue-900 text-white rounded-xl"
                  >
                    {validatingCoupon ? <Loader2 className="w-4 h-4 animate-spin" /> : "Apply"}
                  </Button>
                )}
              </div>

              {/* Available Coupons List */}
              {coupons.length > 0 && !appliedCoupon && (
                <div className="space-y-2 mt-2">
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide block">Your Available Coupons:</span>
                  <div className="flex flex-wrap gap-2">
                    {coupons.map((coupon) => (
                      <button
                        key={coupon.id}
                        type="button"
                        onClick={() => handleApplyCoupon(coupon.code)}
                        className="flex items-center gap-1.5 bg-indigo-50 border border-indigo-100 hover:border-indigo-300 hover:bg-indigo-100/50 text-indigo-700 text-xs font-bold px-3 py-2 rounded-xl transition-all shadow-sm"
                      >
                        <Tag className="w-3.5 h-3.5" />
                        <span>{coupon.code} (Save ₹{coupon.discountAmount})</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-2.5">
              <label className="text-xs font-bold text-slate-600 block">Ad Image <span className="text-red-500">*</span></label>
              
              {!imageFile ? (
                <div className="relative border-2 border-dashed border-slate-200 hover:border-[#0b264f] rounded-2xl p-6 transition-all cursor-pointer group bg-slate-50/50 flex flex-col items-center justify-center min-h-[140px]">
                  <input 
                    type="file" 
                    accept="image/*" 
                    required
                    onChange={handleImageChange} 
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                  />
                  <ImageIcon className="w-8 h-8 text-slate-400 group-hover:text-[#0b264f] transition-colors mb-2" />
                  <span className="text-sm font-bold text-slate-600 group-hover:text-slate-800 transition-colors">Select Ad Image File</span>
                  <span className="text-[10px] text-slate-400 mt-1">Click or drag image file here</span>
                </div>
              ) : (
                <div className="space-y-3">
                  {/* File name / status box */}
                  <div className="border-2 border-dashed border-emerald-200 bg-emerald-50/40 text-emerald-700 rounded-xl p-3.5 text-xs font-bold flex items-center justify-between shadow-sm">
                    <span className="flex items-center gap-2 truncate">
                      <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      <span className="truncate">{imageFile.name}</span>
                    </span>
                    <button type="button" onClick={handleRemoveImage} className="text-slate-400 hover:text-red-500 font-bold ml-2 text-sm transition-colors">✕</button>
                  </div>
                  {/* Image Preview */}
                  <div className="relative rounded-2xl overflow-hidden bg-slate-50 border border-slate-200/80 aspect-[16/9] max-h-56 flex items-center justify-center p-2">
                    <img 
                      src={imagePreview} 
                      alt="Ad Image Preview" 
                      className="w-full h-full object-contain rounded-lg"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-600 block">Target Redirect URL <span className="text-red-500">*</span></label>
              <input 
                type="url"
                required
                placeholder="https://mywebsite.com/project-listing"
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#0b264f] text-slate-700 placeholder-slate-400 shadow-sm transition-all focus:ring-1 focus:ring-[#0b264f]"
                value={adContent.targetUrl}
                onChange={(e) => setAdContent({...adContent, targetUrl: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-600 block">Ad Caption / Text <span className="text-red-500">*</span></label>
              <textarea 
                required
                rows="4"
                placeholder="e.g. Invest in Premium Commercial Real Estate starting from..."
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#0b264f] text-slate-700 placeholder-slate-400 resize-none shadow-sm transition-all focus:ring-1 focus:ring-[#0b264f]"
                value={adContent.text}
                onChange={(e) => setAdContent({...adContent, text: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-600 block">Ad Video URL (Optional)</label>
              <input 
                type="url"
                placeholder="https://example.com/ad-video.mp4"
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#0b264f] text-slate-700 placeholder-slate-400 shadow-sm transition-all focus:ring-1 focus:ring-[#0b264f]"
                value={adContent.videoUrl}
                onChange={(e) => setAdContent({...adContent, videoUrl: e.target.value})}
              />
            </div>
          </CardContent>
          <div className="bg-slate-50 border-t border-slate-100 p-5 px-8 flex justify-end gap-3 rounded-b-3xl">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => router.push('/investor/advertisements')} 
              className="rounded-xl border-slate-200 text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmittingBooking}
              className="bg-[#0b264f] hover:bg-blue-900 text-white rounded-xl shadow-md min-w-[140px] flex items-center justify-center gap-2"
            >
              {isSubmittingBooking ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-xs truncate">{spinnerMsg}</span>
                </>
              ) : "Complete Booking"}
            </Button>
          </div>
        </form>
      )}
    </Card>
  );
}

export default function BookAdCampaign() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-between">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 mt-[1.5rem] md:mt-[3rem] flex items-center justify-center">
        <Suspense fallback={
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <Loader2 className="w-10 h-10 animate-spin text-blue-600 mb-4" />
            <p className="text-gray-500">Loading campaign page...</p>
          </div>
        }>
          <BookingFormContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
