"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/hooks/AuthContext';
import { toast } from '@/hooks/use-toast';
import { getSocket, joinUser, leaveUser } from '@/utils/socket';
import { bookSlot, fetchAdZones, fetchMyCoupons, validateCoupon, uploadImage, uploadFile } from '@/api';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from '@/components/CheckoutForm';
import { Calendar, Loader2, ArrowLeft, Image as ImageIcon, Video as VideoIcon, FileText as TextIcon, CheckCircle, Clock, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { compressAdImage } from '@/utils/imageCompressor';

const ZONE_META = {
  zone1: { name: 'Builder Dashboard Top Banner', cost: 100, campaignDuration: 7, width: 728, height: 90 },
  zone2: { name: 'Investor Dashboard Leaderboard', cost: 150, campaignDuration: 7, width: 728, height: 90 },
  zone3: { name: 'Investor Project Details Sidebar', cost: 120, campaignDuration: 7, width: 300, height: 250 },
  zone4: { name: 'Project Search Results Inline Ad', cost: 80, campaignDuration: 7, width: 728, height: 90 },
  zone5: { name: 'Landing Page Hero Spotlight', cost: 200, campaignDuration: 7, width: 970, height: 250 },
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

  const [campaignFormat, setCampaignFormat] = useState('image'); // 'image' | 'video' | 'text'
  const [adContent, setAdContent] = useState({
    imageUrl: '',
    videoUrl: '',
    text: '',
    targetUrl: ''
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [videoFile, setVideoFile] = useState(null);
  const [videoPreview, setVideoPreview] = useState('');

  const [isUploadingFile, setIsUploadingFile] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

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
          name: ZONE_META[zoneId]?.name || zoneObj.name || zoneId,
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

  const validateImageDimensions = (file, reqWidth, reqHeight) => {
    return new Promise((resolve) => {
      const img = new window.Image();
      img.src = URL.createObjectURL(file);
      img.onload = () => {
        URL.revokeObjectURL(img.src);
        if (img.width !== reqWidth || img.height !== reqHeight) {
          resolve({
            valid: false,
            error: `Selected image dimensions (${img.width}x${img.height}px) do not match the required zone dimensions (${reqWidth}x${reqHeight}px).`
          });
        } else {
          resolve({ valid: true });
        }
      };
      img.onerror = () => {
        resolve({ valid: false, error: "Failed to read image dimensions. Please make sure it's a valid image file." });
      };
    });
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!selectedZone) {
      toast({ title: 'Error', description: 'Zone details not loaded yet.', variant: 'destructive' });
      return;
    }

    const reqWidth = selectedZone.width || 728;
    const reqHeight = selectedZone.height || 90;

    const check = await validateImageDimensions(file, reqWidth, reqHeight);
    if (!check.valid) {
      toast({ title: 'Invalid Image Size', description: check.error, variant: 'destructive' });
      e.target.value = '';
      return;
    }

    try {
      setIsUploadingFile(true);
      setUploadProgress(30);

      const compressed = await compressAdImage(file);
      setUploadProgress(60);

      const res = await uploadImage(compressed, 'campaigns');
      setUploadProgress(100);

      setImageFile(file);
      setImagePreview(res.url);
      setAdContent(prev => ({ ...prev, imageUrl: res.url }));
      toast({ title: 'Upload Successful', description: 'Image uploaded to Firebase storage.' });
    } catch (err) {
      toast({ title: 'Upload Failed', description: err.message || 'Could not upload image.', variant: 'destructive' });
      setImageFile(null);
      setImagePreview('');
    } finally {
      setIsUploadingFile(false);
      setUploadProgress(0);
    }
  };

  const handleVideoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast({ title: 'File Too Large', description: 'Video size should be less than 10MB.', variant: 'destructive' });
      return;
    }

    try {
      setIsUploadingFile(true);
      setUploadProgress(40);

      const res = await uploadFile(file, 'campaigns');
      setUploadProgress(100);

      setVideoFile(file);
      setVideoPreview(res.url);
      setAdContent(prev => ({ ...prev, videoUrl: res.url }));
      toast({ title: 'Upload Successful', description: 'Video uploaded to Firebase storage.' });
    } catch (err) {
      toast({ title: 'Upload Failed', description: err.message || 'Could not upload video.', variant: 'destructive' });
      setVideoFile(null);
      setVideoPreview('');
    } finally {
      setIsUploadingFile(false);
      setUploadProgress(0);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview('');
    setAdContent(prev => ({ ...prev, imageUrl: '' }));
  };

  const handleRemoveVideo = () => {
    setVideoFile(null);
    setVideoPreview('');
    setAdContent(prev => ({ ...prev, videoUrl: '' }));
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
    if (campaignFormat === 'image' && !adContent.imageUrl) {
      return toast({ title: "Validation Error", description: "Ad image upload is required.", variant: "destructive" });
    }
    if (campaignFormat === 'video' && !adContent.videoUrl) {
      return toast({ title: "Validation Error", description: "Ad video upload is required.", variant: "destructive" });
    }
    if (!adContent.text) {
      return toast({ title: "Validation Error", description: "Ad caption text is required.", variant: "destructive" });
    }

    try {
      setIsSubmittingBooking(true);
      setSpinnerMsg('Booking Campaign Slot...');

      const response = await bookSlot({
        zoneId,
        startDate,
        endDate,
        couponCode: appliedCoupon?.code,
        adContent: {
          ...adContent,
          imageUrl: campaignFormat === 'image' ? adContent.imageUrl : '',
          videoUrl: campaignFormat === 'video' ? adContent.videoUrl : ''
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
        router.push('/builder/advertisements');
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
            onClick={() => router.push('/builder/advertisements')}
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
                router.push('/builder/advertisements');
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

            {/* Resolution specifications & Campaign Format Selector */}
            <div className="bg-indigo-50/50 border border-indigo-100 rounded-2xl p-5 space-y-4">
              <div>
                <span className="font-semibold text-indigo-400 uppercase tracking-wide block text-[9px] mb-1">Required Zone Specification</span>
                <p className="text-slate-800 text-sm font-bold flex items-center gap-1.5">
                  <ImageIcon className="w-4 h-4 text-indigo-500" />
                  Image Format: {selectedZone?.width || 728} x {selectedZone?.height || 90} px (Exact size required)
                </p>
                <p className="text-slate-500 text-[10px] mt-1">We accept PNG, JPG, and WEBP formats under 2MB.</p>
              </div>

              <div className="border-t border-slate-100 pt-3">
                <label className="text-xs font-bold text-slate-600 block mb-2">Campaign Format</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'image', label: 'Image', icon: <ImageIcon className="w-3.5 h-3.5" /> },
                    { id: 'video', label: 'Video', icon: <VideoIcon className="w-3.5 h-3.5" /> },
                    { id: 'text', label: 'Text Only', icon: <TextIcon className="w-3.5 h-3.5" /> },
                  ].map(fmt => (
                    <button
                      key={fmt.id}
                      type="button"
                      onClick={() => {
                        setCampaignFormat(fmt.id);
                        setAdContent(prev => ({ ...prev, imageUrl: '', videoUrl: '' }));
                        setImageFile(null);
                        setImagePreview('');
                        setVideoFile(null);
                        setVideoPreview('');
                      }}
                      className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl border text-xs font-semibold transition-all ${campaignFormat === fmt.id
                        ? 'border-[#0b264f] bg-[#0b264f]/5 text-[#0b264f] shadow-sm'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                        }`}
                    >
                      {fmt.icon}
                      {fmt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Render Image upload if 'image' selected */}
            {campaignFormat === 'image' && (
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
                    {isUploadingFile ? (
                      <>
                        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin mb-2" />
                        <span className="text-sm font-bold text-slate-600">Uploading to Firebase Storage...</span>
                        <span className="text-[10px] text-slate-400 mt-1">Please wait ({uploadProgress}%)</span>
                      </>
                    ) : (
                      <>
                        <ImageIcon className="w-8 h-8 text-slate-400 group-hover:text-[#0b264f] transition-colors mb-2" />
                        <span className="text-sm font-bold text-slate-600 group-hover:text-slate-800 transition-colors">Select Ad Image File</span>
                        <span className="text-[10px] text-slate-400 mt-1">Requires exact resolution: {selectedZone?.width || 728}x{selectedZone?.height || 90}</span>
                      </>
                    )}
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="border-2 border-dashed border-emerald-200 bg-emerald-50/40 text-emerald-700 rounded-xl p-3.5 text-xs font-bold flex items-center justify-between shadow-sm">
                      <span className="flex items-center gap-2 truncate">
                        <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                        <span className="truncate">{imageFile.name}</span>
                      </span>
                      <button type="button" onClick={handleRemoveImage} className="text-slate-400 hover:text-red-500 font-bold ml-2 text-sm transition-colors">✕</button>
                    </div>
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
            )}

            {/* Render Video upload if 'video' selected */}
            {campaignFormat === 'video' && (
              <div className="space-y-2.5">
                <label className="text-xs font-bold text-slate-600 block">Ad Video File <span className="text-red-500">*</span></label>

                {!videoFile ? (
                  <div className="relative border-2 border-dashed border-slate-200 hover:border-[#0b264f] rounded-2xl p-6 transition-all cursor-pointer group bg-slate-50/50 flex flex-col items-center justify-center min-h-[140px]">
                    <input
                      type="file"
                      accept="video/*"
                      required
                      onChange={handleVideoChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    {isUploadingFile ? (
                      <>
                        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin mb-2" />
                        <span className="text-sm font-bold text-slate-600">Uploading video to Firebase Storage...</span>
                        <span className="text-[10px] text-slate-400 mt-1">Please wait ({uploadProgress}%)</span>
                      </>
                    ) : (
                      <>
                        <VideoIcon className="w-8 h-8 text-slate-400 group-hover:text-[#0b264f] transition-colors mb-2" />
                        <span className="text-sm font-bold text-slate-600 group-hover:text-slate-800 transition-colors">Select Ad Video File</span>
                        <span className="text-[10px] text-slate-400 mt-1">Supports MP4, WEBM format (Max 10MB)</span>
                      </>
                    )}
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="border-2 border-dashed border-emerald-200 bg-emerald-50/40 text-emerald-700 rounded-xl p-3.5 text-xs font-bold flex items-center justify-between shadow-sm">
                      <span className="flex items-center gap-2 truncate">
                        <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                        <span className="truncate">{videoFile.name}</span>
                      </span>
                      <button type="button" onClick={handleRemoveVideo} className="text-slate-400 hover:text-red-500 font-bold ml-2 text-sm transition-colors">✕</button>
                    </div>
                    <div className="relative rounded-2xl overflow-hidden bg-slate-50 border border-slate-200/80 aspect-[16/9] max-h-56 flex items-center justify-center p-2">
                      <video
                        src={videoPreview}
                        controls
                        className="w-full h-full object-contain rounded-lg"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-600 block">Target Redirect URL <span className="text-red-500">*</span></label>
              <input
                type="url"
                required
                placeholder="https://mywebsite.com/project-listing"
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#0b264f] text-slate-700 placeholder-slate-400 shadow-sm transition-all focus:ring-1 focus:ring-[#0b264f]"
                value={adContent.targetUrl}
                onChange={(e) => setAdContent({ ...adContent, targetUrl: e.target.value })}
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
                onChange={(e) => setAdContent({ ...adContent, text: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-600 block">Ad Video URL (Optional)</label>
              <input
                type="url"
                placeholder="https://example.com/ad-video.mp4"
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#0b264f] text-slate-700 placeholder-slate-400 shadow-sm transition-all focus:ring-1 focus:ring-[#0b264f]"
                value={adContent.videoUrl}
                onChange={(e) => setAdContent({ ...adContent, videoUrl: e.target.value })}
              />
            </div>
          </CardContent>
          <div className="bg-slate-50 border-t border-slate-100 p-5 px-8 flex justify-end gap-3 rounded-b-3xl">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/builder/advertisements')}
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
    </div>
  );
}
