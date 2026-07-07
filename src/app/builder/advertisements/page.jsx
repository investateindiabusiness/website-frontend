"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/AuthContext';
import { toast } from '@/hooks/use-toast';
import { getSocket, joinUser, leaveUser } from '@/utils/socket';
import {
  fetchAdZones,
  fetchSlots,
  bookSlot,
  fetchMyBookings,
  rectifyBooking,
  cancelBooking,
  uploadImage,
  fetchMyCoupons,
  validateCoupon
} from '@/api';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from '@/components/CheckoutForm';
import {
  Calendar,
  Image as ImageIcon,
  DollarSign,
  Clock,
  Monitor,
  Plus,
  AlertCircle,
  CheckCircle,
  XCircle,
  Edit,
  Trash2,
  Loader2,
  Sparkles,
  ExternalLink,
  Settings
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

// Zone display metadata is now loaded entirely from the backend.

// Initialize Stripe outside component render to avoid recreating Stripe object on every render
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

export default function BuilderAdvertisements() {
  const { user } = useAuth();
  const router = useRouter();

  const [zones, setZones] = useState([]);
  const [selectedZone, setSelectedZone] = useState(null);
  const [slots, setSlots] = useState([]);
  const [myBookings, setMyBookings] = useState([]);
  const [loadingZones, setLoadingZones] = useState(true);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [loadingBookings, setLoadingBookings] = useState(true);

  // Booking Modal / Form State
  const [bookingSlot, setBookingSlot] = useState(null);
  const [adContent, setAdContent] = useState({
    imageUrl: '',
    videoUrl: '',
    text: '',
    targetUrl: ''
  });
  const [isSubmittingBooking, setIsSubmittingBooking] = useState(false);
  const [paymentClientSecret, setPaymentClientSecret] = useState(null);
  const [paymentId, setPaymentId] = useState(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [checkoutCost, setCheckoutCost] = useState(0);

  // Rectify Modal / Form State
  const [rectifyBookingItem, setRectifyBookingItem] = useState(null);
  const [rectifyAdContent, setRectifyAdContent] = useState({
    imageUrl: '',
    videoUrl: '',
    text: '',
    targetUrl: ''
  });
  const [isSubmittingRectify, setIsSubmittingRectify] = useState(false);

  // Calendar - free range selection (same as investor)
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [rangeStart, setRangeStart] = useState(null);
  const [rangeEnd, setRangeEnd] = useState(null);
  const [hoverDate, setHoverDate] = useState(null);

  useEffect(() => {
    if (!user) return;

    loadZones(false);
    loadMyBookings(false);

    const interval = setInterval(() => {
      loadZones(true);
      loadMyBookings(true);
      if (selectedZone) {
        loadSlots(selectedZone.id, true);
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [user, selectedZone?.id]);
  // Coupon State
  const [myCoupons, setMyCoupons] = useState([]);
  const [couponCodeInput, setCouponCodeInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const [couponError, setCouponError] = useState('');

  useEffect(() => {
    if (user) {
      loadZones();
      loadMyBookings();
      loadCoupons();
      joinUser(user.uid);

      const socket = getSocket();
      const handleNewCoupon = (couponData) => {
        toast({ title: "New Coupon Assigned!", description: `You received coupon code: ${couponData.code}` });
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
      const res = await fetchMyCoupons();
      setMyCoupons(res?.data || []);
    } catch (err) {
      // Silently ignore â€” coupons are an optional feature.
      // A "Failed to fetch" is expected when the backend is not yet ready.
      setMyCoupons([]);
    }
  };

  const loadZones = async (silent = false) => {
    try {
      if (!silent) setLoadingZones(true);
      const data = await fetchAdZones();
      const enriched = (data.data || [])
        .filter((z) => !z.allowedBookers || z.allowedBookers.includes('builder'))
        .filter((z) => ['zone2', 'zone3', 'zone4'].includes(z.id))
        .map((z) => ({
          ...z,
          name: z.name || z.id,
          costPerDay: z.costPerDay ?? 0,
          campaignDuration: z.campaignDuration ?? 1,
        }));
      setZones(enriched);
      if (selectedZone) {
        const updated = enriched.find(z => z.id === selectedZone.id);
        if (updated) setSelectedZone(updated);
      } else if (enriched.length > 0) {
        const defaultZone = enriched.find(z => z.id === 'zone2') || enriched[0];
        handleSelectZone(defaultZone);
      }
    } catch (error) {
      if (!silent) {
        toast({
          title: "Error loading zones",
          description: error.message || "Failed to load active advertisement zones.",
          variant: "destructive"
        });
      }
    } finally {
      if (!silent) setLoadingZones(false);
    }
  };

  const loadMyBookings = async (silent = false) => {
    try {
      if (!silent) setLoadingBookings(true);
      const data = await fetchMyBookings();
      setMyBookings(data.data || []);
    } catch (error) {
      if (!silent) {
        toast({
          title: "Error loading bookings",
          description: error.message || "Failed to load your campaigns.",
          variant: "destructive"
        });
      }
    } finally {
      if (!silent) setLoadingBookings(false);
    }
  };

  const loadSlots = async (zoneId, silent = false) => {
    try {
      if (!silent) setLoadingSlots(true);
      const data = await fetchSlots(zoneId);
      setSlots(data.data || []);
    } catch (error) {
      if (!silent) {
        toast({
          title: "Error loading slots",
          description: error.message || "Failed to load advertisement slots for this zone.",
          variant: "destructive"
        });
      }
    } finally {
      if (!silent) setLoadingSlots(false);
    }
  };

  const handleSelectZone = async (zone) => {
    setSelectedZone(zone);
    setRangeStart(null);
    setRangeEnd(null);
    setHoverDate(null);
    if (zone) {
      loadSlots(zone.id, false);
    }
  };

  // Navigate to booking page with selected range
  const handleOpenBookingModal = () => {
    if (!rangeStart || !rangeEnd || !selectedZone) return;
    const msPerDay = 1000 * 60 * 60 * 24;
    const days = Math.round((new Date(rangeEnd) - new Date(rangeStart)) / msPerDay) + 1;
    const totalCost = (selectedZone?.costPerDay || 0) * days;
    router.push(
      `/builder/advertisements/book?zoneId=${selectedZone.id}&startDate=${rangeStart}&endDate=${rangeEnd}&days=${days}&costPerDay=${selectedZone.costPerDay}&totalCost=${totalCost}`
    );
  };

  // Handle calendar date clicks for free range selection
  const handleCalendarClick = (dateStr, isBooked) => {
    if (isBooked) return;
    const today = new Date().toISOString().split('T')[0];
    if (dateStr < today) return;

    if (!rangeStart || (rangeStart && rangeEnd)) {
      setRangeStart(dateStr);
      setRangeEnd(null);
    } else {
      if (dateStr < rangeStart) {
        setRangeEnd(rangeStart);
        setRangeStart(dateStr);
      } else if (dateStr === rangeStart) {
        setRangeStart(null);
      } else {
        const overlaps = slots.some(s => s.isBooked && rangeStart <= s.endDate && dateStr >= s.startDate);
        if (overlaps) {
          toast({ title: 'Overlap Detected', description: 'Your selected range overlaps a booked period. Please choose different dates.', variant: 'destructive' });
          return;
        }
        setRangeEnd(dateStr);
      }
    }
  };

  // Compute selection cost
  const getSelectionDays = () => {
    if (!rangeStart || !rangeEnd) return 0;
    const msPerDay = 1000 * 60 * 60 * 24;
    return Math.round((new Date(rangeEnd) - new Date(rangeStart)) / msPerDay) + 1;
  };
  const selectionDays = getSelectionDays();
  const totalCost = selectionDays > 0 ? (selectedZone?.costPerDay || 0) * selectionDays : 0;


  const handleCloseBookingModal = () => {
    setBookingSlot(null);
    setPaymentClientSecret(null);
    setPaymentId(null);
    setIsUploadingImage(false);
    setUploadProgress(0);
  };

  const handleImageUpload = async (e, formType = 'book') => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({ title: "Invalid File", description: "Please upload an image file (PNG, JPG, etc).", variant: "destructive" });
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast({ title: "File Too Large", description: "Image size should be less than 2MB.", variant: "destructive" });
      return;
    }

    try {
      setIsUploadingImage(true);
      setUploadProgress(25); // Fake progress to show activity

      const response = await uploadImage(file, 'campaigns');

      setUploadProgress(100);
      const downloadURL = response.url;

      if (formType === 'book') {
        setAdContent(prev => ({ ...prev, imageUrl: downloadURL }));
      } else {
        setRectifyAdContent(prev => ({ ...prev, imageUrl: downloadURL }));
      }
      toast({ title: "Upload Successful", description: "Image uploaded successfully." });
      setIsUploadingImage(false);
      setUploadProgress(0);
    } catch (error) {
      console.error("Upload setup error:", error);
      toast({ title: "Upload Failed", description: error.message || "Could not initialize upload.", variant: "destructive" });
      setIsUploadingImage(false);
      setUploadProgress(0);
      setCheckoutCost(0);
      setCouponCodeInput('');
      setAppliedCoupon(null);
      setCouponError('');
    }
  };

  const handleApplyCoupon = async () => {
    if (!couponCodeInput) return;
    try {
      setIsApplyingCoupon(true);
      setCouponError('');
      const res = await validateCoupon(couponCodeInput);
      setAppliedCoupon(res.data);
      toast({ title: "Coupon Applied", description: `Discount of $${res.data.discountAmount} applied.` });
    } catch (err) {
      setCouponError(err.message || 'Invalid coupon');
      setAppliedCoupon(null);
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (!adContent.imageUrl) {
      return toast({ title: "Validation Error", description: "Ad image URL is required.", variant: "destructive" });
    }
    if (!adContent.targetUrl) {
      return toast({ title: "Validation Error", description: "Ad redirect URL is required.", variant: "destructive" });
    }
    if (!adContent.text) {
      return toast({ title: "Validation Error", description: "Ad caption text is required.", variant: "destructive" });
    }

    try {
      setIsSubmittingBooking(true);
      const response = await bookSlot({
        zoneId: selectedZone.id,
        startDate: bookingSlot.startDate,
        endDate: bookingSlot.endDate,
        couponCode: appliedCoupon?.code,
        adContent
      });

      // If payment details exist, proceed to checkout
      if (response?.data?.payment?.clientSecret) {
        setPaymentClientSecret(response.data.payment.clientSecret);
        // API returns `paymentId` (not `id`) in the payment response DTO
        setPaymentId(response.data.payment.paymentId || null);
        setCheckoutCost(response.data.cost || 0);
      } else {
        toast({
          title: "Campaign Booked!",
          description: "Your campaign has been submitted successfully."
        });
        handleCloseBookingModal();
        loadMyBookings();
        if (selectedZone) {
          handleSelectZone(selectedZone);
        }
      }
    } catch (error) {
      toast({
        title: "Booking Failed",
        description: error.message || "Failed to book slot.",
        variant: "destructive"
      });
    } finally {
      setIsSubmittingBooking(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!confirm("Are you sure you want to cancel this campaign? This will release the slot.")) return;

    try {
      await cancelBooking(bookingId);
      toast({ title: "Campaign Cancelled", description: "Your booking has been cancelled and slot released." });
      loadMyBookings();
      if (selectedZone) {
        handleSelectZone(selectedZone);
      }
    } catch (error) {
      toast({ title: "Cancellation Failed", description: error.message || "Failed to cancel booking.", variant: "destructive" });
    }
  };

  const getSlotForDate = (dateString) => {
    const bookedCampaign = slots.find(s => s.isBooked && s.startDate <= dateString && s.endDate >= dateString);
    if (bookedCampaign) return bookedCampaign;

    const currentDate = new Date().toISOString().split('T')[0];
    if (dateString < currentDate) return null;

    if (selectedZone) {
      const duration = selectedZone.campaignDuration || 1;
      const start = new Date(dateString);
      const end = new Date(start);
      end.setDate(end.getDate() + duration - 1);
      const endDateString = end.toISOString().split('T')[0];

      const hasOverlap = slots.some(c => c.isBooked && dateString <= c.endDate && endDateString >= c.startDate);
      if (hasOverlap) return null;

      return {
        id: `virtual-${dateString}`,
        startDate: dateString,
        endDate: endDateString,
        timeSlot: 'All Day',
        isBooked: false,
        isVirtual: true
      };
    }
    return null;
  };

  const calendarYear = calendarDate.getFullYear();
  const calendarMonth = calendarDate.getMonth();
  const daysInMonth = new Date(calendarYear, calendarMonth + 1, 0).getDate();
  const firstDayIndex = new Date(calendarYear, calendarMonth, 1).getDay();
  const today = new Date().toISOString().split('T')[0];

  // Helper: is a given date booked?
  const isDateBooked = (dateStr) =>
    slots.some(s => s.isBooked && s.startDate <= dateStr && s.endDate >= dateStr);

  // Helper: get style class for each calendar day
  const getDateRangeClass = (dateStr) => {
    const isPast = dateStr < today;
    const booked = isDateBooked(dateStr);
    if (isPast) return { bg: 'bg-slate-100 text-slate-300 cursor-not-allowed', label: null };
    if (booked) return { bg: 'bg-red-500 text-white font-bold cursor-not-allowed shadow-sm', label: 'Booked' };

    const effectiveEnd = rangeEnd || hoverDate;
    const lo = rangeStart && effectiveEnd ? (rangeStart <= effectiveEnd ? rangeStart : effectiveEnd) : null;
    const hi = rangeStart && effectiveEnd ? (rangeStart <= effectiveEnd ? effectiveEnd : rangeStart) : null;

    const inRange = lo && hi && dateStr >= lo && dateStr <= hi;
    const isStart = rangeStart && dateStr === rangeStart;
    const isEnd = rangeEnd && dateStr === rangeEnd;

    if (isStart && rangeEnd) return { bg: 'bg-[#0b264f] text-white font-bold rounded-l-xl cursor-pointer shadow-md', label: 'Start' };
    if (isEnd) return { bg: 'bg-[#0b264f] text-white font-bold rounded-r-xl cursor-pointer shadow-md', label: 'End' };
    if (isStart && !rangeEnd) return { bg: 'bg-[#0b264f] text-white font-bold cursor-pointer shadow-md ring-2 ring-blue-300', label: 'Start' };
    if (inRange) return { bg: 'bg-blue-100 text-blue-800 font-semibold cursor-pointer', label: null };

    return { bg: 'bg-white hover:bg-green-50 border border-slate-100 text-slate-700 cursor-pointer', label: 'Open' };
  };

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const prevMonth = () => {
    setCalendarDate(new Date(calendarYear, calendarMonth - 1, 1));
  };

  const nextMonth = () => {
    setCalendarDate(new Date(calendarYear, calendarMonth + 1, 1));
  };

  const handleOpenRectifyModal = (booking) => {
    setRectifyBookingItem(booking);
    setRectifyAdContent({
      imageUrl: booking.adContent?.imageUrl || '',
      videoUrl: booking.adContent?.videoUrl || '',
      text: booking.adContent?.text || '',
      targetUrl: booking.adContent?.targetUrl || ''
    });
  };

  const handleCloseRectifyModal = () => {
    setRectifyBookingItem(null);
  };

  const handleRectifySubmit = async (e) => {
    e.preventDefault();
    if (!rectifyAdContent.imageUrl) {
      return toast({ title: "Validation Error", description: "Ad image URL is required.", variant: "destructive" });
    }
    if (!rectifyAdContent.targetUrl) {
      return toast({ title: "Validation Error", description: "Ad redirect URL is required.", variant: "destructive" });
    }
    if (!rectifyAdContent.text) {
      return toast({ title: "Validation Error", description: "Ad caption text is required.", variant: "destructive" });
    }

    try {
      setIsSubmittingRectify(true);
      await rectifyBooking(rectifyBookingItem.id, {
        adContent: rectifyAdContent
      });
      toast({
        title: "Campaign Re-submitted!",
        description: "Your corrected campaign has been re-submitted for review."
      });
      handleCloseRectifyModal();
      loadMyBookings();
    } catch (error) {
      toast({
        title: "Re-submission Failed",
        description: error.message || "Failed to update campaign details.",
        variant: "destructive"
      });
    } finally {
      setIsSubmittingRectify(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-500 hover:bg-green-600 text-white flex items-center gap-1 w-fit"><CheckCircle className="w-3.5 h-3.5" /> Approved / Active</Badge>;
      case 'rejected':
        return <Badge className="bg-red-500 hover:bg-red-600 text-white flex items-center gap-1 w-fit"><XCircle className="w-3.5 h-3.5" /> Action Required</Badge>;
      case 'cancelled':
        return <Badge className="bg-gray-400 hover:bg-gray-500 text-white flex items-center gap-1 w-fit"><XCircle className="w-3.5 h-3.5" /> Cancelled</Badge>;
      case 'pending_review':
      default:
        return <Badge className="bg-yellow-500 hover:bg-yellow-600 text-white flex items-center gap-1 w-fit"><AlertCircle className="w-3.5 h-3.5" /> Pending Review</Badge>;
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans overflow-x-hidden">

      <div className="flex-grow mt-[2rem] md:mt-[4rem] pb-16">

        {/* Banner Section */}
        <div className="bg-gradient-to-r from-[#0b264f] to-[#1a4b8c] text-white pt-8 pb-14 px-4 md:px-8 rounded-b-[2rem] shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl pointer-events-none"></div>
          <div className="container mx-auto relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <Badge className="bg-orange-500/20 text-orange-200 hover:bg-orange-500/30 border-none mb-3 px-3 py-1">
                <Sparkles className="w-3.5 h-3.5 mr-1.5" /> Expand Your Viewers
              </Badge>
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2">Builder Campaigns</h1>
              <p className="text-sm md:text-base text-blue-100 opacity-90 max-w-xl">
                Advertise your premium real estate listings inside active landing pages, dashboards, and search inline sections across Investate India.
              </p>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="container mx-auto px-4 -mt-6 relative z-20 space-y-8">

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">

            {/* Column 1: Zones list & selected details */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="shadow-md border-none rounded-2xl overflow-hidden bg-white">
                <CardHeader className="bg-slate-50 border-b border-slate-100 py-4 px-5">
                  <CardTitle className="text-lg font-bold text-slate-800">Advertisement Placements</CardTitle>
                  <CardDescription className="text-xs">Select a zone to view details and slots</CardDescription>
                </CardHeader>
                <CardContent className="p-4 space-y-2.5">
                  {loadingZones ? (
                    <div className="flex flex-col items-center justify-center py-10">
                      <Loader2 className="w-8 h-8 text-orange-500 animate-spin mb-2" />
                      <p className="text-xs text-slate-400">Loading zones...</p>
                    </div>
                  ) : zones.length === 0 ? (
                    <div className="text-center py-6 text-slate-400 text-xs">No active zones.</div>
                  ) : (
                    zones.map((zone) => (
                      <button
                        key={zone.id}
                        onClick={() => handleSelectZone(zone)}
                        className={`w-full text-left p-4 rounded-xl border transition-all duration-200 flex items-center justify-between gap-3 ${selectedZone?.id === zone.id
                          ? 'border-[#0b264f] bg-[#0b264f]/5 shadow-sm'
                          : 'border-slate-200 bg-white hover:bg-slate-50'
                          }`}
                      >
                        <div className="flex flex-col gap-0.5 min-w-0">
                          <span className={`text-sm font-bold truncate ${selectedZone?.id === zone.id ? 'text-[#0b264f]' : 'text-slate-800'}`}>
                            {zone.name}
                          </span>
                          <span className="text-xs font-semibold text-orange-500">
                            ${zone.costPerDay}/day
                          </span>
                        </div>

                      </button>
                    ))
                  )}
                </CardContent>
              </Card>

              {selectedZone && (
                <Card className="shadow-sm border border-slate-200/60 rounded-2xl bg-white overflow-hidden">
                  <div className="bg-[#0b264f] text-white p-4.5 text-center">
                    <h3 className="text-sm uppercase tracking-wider font-bold opacity-85">Zone Specification</h3>
                    <h2 className="text-lg font-bold mt-1">{selectedZone.name}</h2>
                  </div>
                  <CardContent className="p-5 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <span className="text-[10px] text-slate-400 uppercase font-semibold flex items-center"><DollarSign className="w-3.5 h-3.5 mr-0.5 text-green-600" /> Cost / Day</span>
                        <p className="text-lg font-bold text-slate-800">${selectedZone.costPerDay}</p>
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] text-slate-400 uppercase font-semibold flex items-center"><Clock className="w-3.5 h-3.5 mr-0.5 text-blue-600" /> Campaign Duration</span>
                        <p className="text-base font-bold text-slate-800">Per Day</p>
                      </div>
                    </div>

                    <div className="bg-slate-50 border border-slate-100 rounded-xl p-3.5 space-y-2">
                      <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Default Ad Fallback</h4>
                      <p className="text-xs text-slate-600 italic">"{selectedZone.defaultAd?.text}"</p>
                      {selectedZone.defaultAd?.imageUrl && (
                        <div className="mt-2 rounded-xl overflow-hidden border border-slate-200 bg-white p-1 max-h-32 flex items-center justify-center">
                          <img
                            src={selectedZone.defaultAd.imageUrl}
                            alt="Default fallback ad"
                            className="max-w-full max-h-28 object-contain rounded-lg"
                          />
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Column 2: Available slots list */}
            <div className="lg:col-span-3 space-y-6">
              <Card className="shadow-md border-none rounded-2xl overflow-hidden bg-white">
                <CardHeader className="bg-slate-50 border-b border-slate-100 py-4 px-6 flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg font-bold text-slate-800">Available Booking Calendar</CardTitle>
                    <CardDescription className="text-xs">Click a start date, then click an end date to select your campaign window in {selectedZone?.name}</CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  {loadingSlots ? (
                    <div className="flex flex-col items-center justify-center py-16">
                      <Loader2 className="w-10 h-10 text-[#0b264f] animate-spin mb-4" />
                      <p className="text-sm text-slate-500 font-medium">Checking slot availability...</p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {/* Month Controller */}
                      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                        <h3 className="text-base font-bold text-slate-800">
                          {monthNames[calendarMonth]} {calendarYear}
                        </h3>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={prevMonth}
                            className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors border border-slate-200 shadow-sm"
                          >
                            â®
                          </button>
                          <button
                            type="button"
                            onClick={nextMonth}
                            className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors border border-slate-200 shadow-sm"
                          >
                            â¯
                          </button>
                        </div>
                      </div>

                      {/* Calendar Grid */}
                      <div className="grid grid-cols-7 gap-2 text-center text-xs font-semibold text-slate-500 mb-2">
                        <div>Sun</div>
                        <div>Mon</div>
                        <div>Tue</div>
                        <div>Wed</div>
                        <div>Thu</div>
                        <div>Fri</div>
                        <div>Sat</div>
                      </div>

                      <div className="grid grid-cols-7 gap-1">
                        {Array.from({ length: firstDayIndex }).map((_, idx) => (
                          <div key={`empty-${idx}`} className="h-10 md:h-12"></div>
                        ))}
                        {Array.from({ length: daysInMonth }).map((_, idx) => {
                          const day = idx + 1;
                          const dateStr = `${calendarYear}-${String(calendarMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                          const { bg, label } = getDateRangeClass(dateStr);

                          return (
                            <div
                              key={`day-${day}`}
                              className={`h-10 md:h-12 flex flex-col items-center justify-center rounded-lg text-xs md:text-sm transition-all duration-100 relative select-none ${bg}`}
                              onClick={() => handleCalendarClick(dateStr, isDateBooked(dateStr))}
                              onMouseEnter={() => { if (rangeStart && !rangeEnd) setHoverDate(dateStr); }}
                              onMouseLeave={() => setHoverDate(null)}
                            >
                              <span>{day}</span>
                              {label && (
                                <span className="absolute bottom-0.5 text-[8px] opacity-75 font-mono">{label}</span>
                              )}
                            </div>
                          );
                        })}
                      </div>

                      {/* Legend */}
                      <div className="flex items-center gap-4 text-xs font-semibold text-slate-500 pt-2 border-t border-slate-100">
                        <div className="flex items-center gap-1.5">
                          <div className="w-3.5 h-3.5 bg-[#0b264f] rounded"></div>
                          <span>Selected</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <div className="w-3.5 h-3.5 bg-blue-100 border border-blue-200 rounded"></div>
                          <span>In Range</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <div className="w-3.5 h-3.5 bg-red-500 rounded"></div>
                          <span>Booked</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <div className="w-3.5 h-3.5 bg-white border border-slate-200 rounded"></div>
                          <span>Available</span>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Live Cost Preview Card â€” investor-style free range */}
              {rangeStart && (
                <Card className={`border rounded-2xl p-4 shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-200 ${rangeEnd ? 'border-[#0b264f] bg-[#0b264f]/5' : 'border-blue-200 bg-blue-50/50'}`}>
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                      <h4 className="text-xs font-bold text-[#0b264f] uppercase tracking-wide">
                        {rangeEnd ? 'Selected Campaign Window' : 'Select an End Dateâ€¦'}
                      </h4>
                      <p className="text-sm font-bold text-slate-800 mt-1">
                        {formatDate(rangeStart)}
                        {(rangeEnd || hoverDate) && (
                          <> â†’ {formatDate(rangeEnd || hoverDate)}</>
                        )}
                      </p>
                      {selectionDays > 0 && (
                        <p className="text-xs text-slate-500 mt-0.5 font-medium">{selectionDays} day{selectionDays !== 1 ? 's' : ''} selected</p>
                      )}
                    </div>
                    <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end border-t md:border-none border-slate-100 pt-3 md:pt-0">
                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                          ${selectedZone?.costPerDay}/day Ã— {selectionDays || (hoverDate ? Math.round((new Date(hoverDate) - new Date(rangeStart)) / 86400000) + 1 : '?')} days
                        </span>
                        <p className="text-xl font-bold text-[#0b264f]">
                          {totalCost > 0 ? `$${totalCost}` : '...'}
                        </p>
                      </div>
                      {rangeEnd ? (
                        <div className="flex gap-2">
                          <Button
                            onClick={() => { setRangeStart(null); setRangeEnd(null); }}
                            variant="outline"
                            size="sm"
                            className="rounded-xl border-slate-300 text-slate-600"
                          >
                            Reset
                          </Button>
                          <Button
                            onClick={handleOpenBookingModal}
                            className="bg-[#0b264f] hover:bg-[#0a1f3f] text-white rounded-xl shadow-md font-semibold px-5"
                          >
                            Book Now â†’
                          </Button>
                        </div>
                      ) : (
                        <Button
                          onClick={() => { setRangeStart(null); }}
                          variant="ghost"
                          size="sm"
                          className="text-slate-400 hover:text-red-500 rounded-xl"
                        >
                          Cancel
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              )}
            </div>

          </div>

          {/* Section 2: User's Current Bookings / Campaigns */}
          <Card className="shadow-md border-none rounded-2xl overflow-hidden bg-white">
            <CardHeader className="bg-slate-50 border-b border-slate-100 py-4 px-6 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg font-bold text-slate-800">My Campaign Bookings</CardTitle>
                <CardDescription className="text-xs">History of all advertisement bookings submitted by you</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              {loadingBookings ? (
                <div className="flex flex-col items-center justify-center py-16">
                  <Loader2 className="w-10 h-10 text-[#0b264f] animate-spin mb-4" />
                  <p className="text-sm text-slate-500">Loading campaign history...</p>
                </div>
              ) : myBookings.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center text-slate-400">
                  <ImageIcon className="w-12 h-12 text-slate-300 mb-3" />
                  <h3 className="text-base font-bold text-slate-700 mb-1">No Bookings Found</h3>
                  <p className="text-xs max-w-sm">You haven't submitted any advertisement campaigns yet.</p>
                </div>
              ) : (
                <div className="overflow-x-auto rounded-xl border border-slate-200/80">
                  <table className="w-full text-left text-sm text-slate-700 border-collapse">
                    <thead>
                      <tr className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                        <th className="py-3 px-4">Zone</th>
                        <th className="py-3 px-4">Dates</th>
                        <th className="py-3 px-4">Ad Details</th>
                        <th className="py-3 px-4">Cost</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {myBookings.map((booking) => {
                        const zoneName = zones.find(z => z.id === booking.zoneId)?.name || booking.zoneId;
                        return (
                          <tr key={booking.id} className="hover:bg-slate-50/50">
                            <td className="py-4 px-4 font-bold text-slate-800">{zoneName}</td>
                            <td className="py-4 px-4 text-xs font-semibold text-slate-600">
                              {formatDate(booking.startDate)} to {formatDate(booking.endDate)}
                              <div className="text-[10px] text-slate-400 mt-0.5">{booking.timeSlot}</div>
                            </td>
                            <td className="py-4 px-4 max-w-[280px]">
                              <div className="space-y-1">
                                <p className="text-xs font-bold text-slate-700 line-clamp-1">{booking.adContent?.text}</p>
                                <div className="flex items-center gap-2 text-[10px] font-medium">
                                  {booking.adContent?.imageUrl && (
                                    <a href={booking.adContent.imageUrl} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline flex items-center gap-0.5">
                                      Image <ExternalLink className="w-2.5 h-2.5" />
                                    </a>
                                  )}
                                  {booking.adContent?.targetUrl && (
                                    <a href={booking.adContent.targetUrl} target="_blank" rel="noreferrer" className="text-slate-500 hover:underline flex items-center gap-0.5">
                                      Redirect <ExternalLink className="w-2.5 h-2.5" />
                                    </a>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td className="py-4 px-4 font-bold text-slate-800">${booking.cost}</td>
                            <td className="py-4 px-4">
                              <div className="space-y-1">
                                {getStatusBadge(booking.approvalStatus)}
                                {booking.approvalStatus === 'rejected' && booking.rejectionReason && (
                                  <p className="text-[10px] text-red-500 font-semibold bg-red-50 border border-red-100 rounded-lg p-2 max-w-[240px]">
                                    <strong>Reason:</strong> {booking.rejectionReason}
                                  </p>
                                )}
                              </div>
                            </td>
                            <td className="py-4 px-4 text-center">
                              <div className="flex items-center justify-center gap-2">
                                {booking.approvalStatus === 'rejected' && (
                                  <Button
                                    onClick={() => handleOpenRectifyModal(booking)}
                                    size="sm"
                                    variant="outline"
                                    className="border-amber-200 text-amber-700 bg-amber-50 hover:bg-amber-100 hover:text-amber-800 rounded-xl"
                                  >
                                    <Edit className="w-3.5 h-3.5 mr-1" /> Rectify
                                  </Button>
                                )}
                                {booking.approvalStatus !== 'cancelled' && (
                                  <Button
                                    onClick={() => handleCancelBooking(booking.id)}
                                    size="sm"
                                    variant="ghost"
                                    className="text-red-500 hover:text-red-700 hover:bg-red-50 rounded-xl"
                                  >
                                    <Trash2 className="w-3.5 h-3.5 mr-1" /> Cancel
                                  </Button>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>

        </div>
      </div>

      {/* Booking Form Dialog Modal */}
      {bookingSlot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity">
          <Card className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border-none overflow-hidden animate-in fade-in zoom-in duration-200">
            <CardHeader className="bg-[#0b264f] text-white p-5">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl font-bold">{paymentClientSecret ? 'Complete Payment' : 'Campaign Details'}</CardTitle>
                  <CardDescription className="text-xs text-blue-100/80 mt-1">Book slot for: {selectedZone?.name}</CardDescription>
                </div>
                <button onClick={handleCloseBookingModal} className="text-white/80 hover:text-white text-xl">âœ•</button>
              </div>
            </CardHeader>
            {paymentClientSecret ? (
              <CardContent className="p-6">
                <Elements stripe={stripePromise} options={{ clientSecret: paymentClientSecret, appearance: { theme: 'stripe' } }}>
                  <CheckoutForm
                    amount={checkoutCost}
                    paymentId={paymentId}
                    onSuccess={() => {
                      handleCloseBookingModal();
                      loadMyBookings();
                      if (selectedZone) handleSelectZone(selectedZone);
                    }}
                    onCancel={handleCloseBookingModal}
                  />
                </Elements>
              </CardContent>
            ) : (
              <form onSubmit={handleBookingSubmit}>
                <CardContent className="p-6 space-y-4">
                  <div className="bg-slate-50 border border-slate-100 rounded-xl p-3.5 text-xs text-slate-600 flex justify-between items-center">
                    <div>
                      <span className="font-semibold text-slate-400 uppercase tracking-wide block text-[9px]">Slot Dates</span>
                      <strong className="text-slate-800 text-sm">{formatDate(bookingSlot.startDate)} to {formatDate(bookingSlot.endDate)}</strong>
                    </div>
                    <div className="text-right">
                      <span className="font-semibold text-slate-400 uppercase tracking-wide block text-[9px]">${selectedZone?.costPerDay}/day</span>
                      <strong className="text-slate-800 text-sm">${(selectedZone?.costPerDay || 0) * (selectedZone?.campaignDuration || 1)}</strong>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-600 block">Ad Image <span className="text-red-500">*</span></label>

                    {adContent.imageUrl && (
                      <div className="relative w-full h-32 rounded-xl overflow-hidden border border-slate-200 mb-2 group">
                        <img
                          src={adContent.imageUrl}
                          alt="Ad Preview"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={() => setAdContent({ ...adContent, imageUrl: '' })}
                            className="rounded-lg h-8"
                          >
                            <Trash2 className="w-4 h-4 mr-2" /> Remove
                          </Button>
                        </div>
                      </div>
                    )}

                    {!adContent.imageUrl && (
                      <div className="relative">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e, 'book')}
                          disabled={isUploadingImage}
                          className="hidden"
                          id="ad-image-upload"
                        />
                        <label
                          htmlFor="ad-image-upload"
                          className={`w-full flex items-center justify-center gap-2 border-2 border-dashed border-slate-200 rounded-xl px-4 py-6 text-sm transition-colors cursor-pointer ${isUploadingImage ? 'bg-slate-50 cursor-not-allowed' : 'hover:border-slate-400 hover:bg-slate-50 text-slate-600'}`}
                        >
                          {isUploadingImage ? (
                            <>
                              <Loader2 className="w-5 h-5 animate-spin text-slate-400" />
                              <span className="text-slate-500 font-medium">Uploading... {uploadProgress}%</span>
                            </>
                          ) : (
                            <>
                              <ImageIcon className="w-5 h-5 text-slate-400" />
                              <span className="font-medium">Click to upload image</span>
                            </>
                          )}
                        </label>
                      </div>
                    )}
                    <p className="text-[10px] text-slate-400">Supported Dimensions: {selectedZone?.width} x {selectedZone?.height} px (Max 2MB)</p>
                  </div>
                  <div className="space-y-1.5 border-t border-slate-100 pt-3">
                    <label className="text-xs font-bold text-slate-600 block">Apply Coupon</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Enter coupon code"
                        className="flex-1 border border-slate-200 rounded-xl px-4 py-2.5 text-sm uppercase outline-none focus:border-[#0b264f]"
                        value={couponCodeInput}
                        onChange={(e) => setCouponCodeInput(e.target.value.toUpperCase())}
                        disabled={!!appliedCoupon}
                      />
                      {!appliedCoupon ? (
                        <Button type="button" onClick={handleApplyCoupon} disabled={!couponCodeInput || isApplyingCoupon} className="bg-slate-800 text-white rounded-xl hover:bg-slate-700">
                          {isApplyingCoupon ? <Loader2 className="w-4 h-4 animate-spin" /> : "Apply"}
                        </Button>
                      ) : (
                        <Button type="button" onClick={() => { setAppliedCoupon(null); setCouponCodeInput(''); }} variant="outline" className="text-red-500 border-red-200 rounded-xl hover:bg-red-50">
                          Remove
                        </Button>
                      )}
                    </div>
                    {couponError && <p className="text-[10px] text-red-500">{couponError}</p>}
                    {appliedCoupon && (
                      <div className="flex justify-between items-center text-xs text-green-600 font-semibold bg-green-50 p-2 rounded-lg mt-2">
                        <span>Discount Applied:</span>
                        <span>-${appliedCoupon.discountAmount}</span>
                      </div>
                    )}
                    {myCoupons.length > 0 && !appliedCoupon && (
                      <div className="mt-2 text-xs flex gap-2 flex-wrap items-center">
                        <span className="text-slate-500">Available:</span>
                        {myCoupons.map(c => (
                          <button key={c.id} type="button" onClick={() => setCouponCodeInput(c.code)} className="text-[#0b264f] font-bold hover:underline px-2 py-1 bg-blue-50 rounded">
                            {c.code}
                          </button>
                        ))}
                      </div>
                    )}
                    {appliedCoupon && selectedZone && (
                      <div className="flex justify-between items-center mt-2 font-bold text-sm pt-2 border-t border-slate-100">
                        <span className="text-slate-700">Final Total:</span>
                        <span className="text-[#0b264f] text-lg">${Math.max(0, (selectedZone?.costPerDay || 0) * (selectedZone?.campaignDuration || 1) - appliedCoupon.discountAmount)}</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600 block">Ad Image URL <span className="text-red-500">*</span></label>
                    <input
                      type="url"
                      required
                      placeholder="https://example.com/ad-image.jpg"
                      className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#0b264f] text-slate-700 placeholder-slate-400"
                      value={adContent.imageUrl}
                      onChange={(e) => setAdContent({ ...adContent, imageUrl: e.target.value })}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600 block">Target Redirect URL <span className="text-red-500">*</span></label>
                    <input
                      type="url"
                      required
                      placeholder="https://mywebsite.com/project-listing"
                      className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#0b264f] text-slate-700 placeholder-slate-400"
                      value={adContent.targetUrl}
                      onChange={(e) => setAdContent({ ...adContent, targetUrl: e.target.value })}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600 block">Ad Caption / Text <span className="text-red-500">*</span></label>
                    <textarea
                      required
                      rows="3"
                      placeholder="e.g. Invest in Premium Commercial Real Estate starting from..."
                      className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#0b264f] text-slate-700 placeholder-slate-400 resize-none"
                      value={adContent.text}
                      onChange={(e) => setAdContent({ ...adContent, text: e.target.value })}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600 block">Ad Video URL (Optional)</label>
                    <input
                      type="url"
                      placeholder="https://example.com/ad-video.mp4"
                      className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#0b264f] text-slate-700 placeholder-slate-400"
                      value={adContent.videoUrl}
                      onChange={(e) => setAdContent({ ...adContent, videoUrl: e.target.value })}
                    />
                  </div>
                </CardContent>
                <div className="bg-slate-50 border-t border-slate-100 p-4 px-6 flex justify-end gap-3 rounded-b-2xl">
                  <Button type="button" variant="outline" onClick={handleCloseBookingModal} className="rounded-xl">Cancel</Button>
                  <Button
                    type="submit"
                    disabled={isSubmittingBooking}
                    className="bg-[#0b264f] hover:bg-blue-900 text-white rounded-xl shadow-md min-w-[120px]"
                  >
                    {isSubmittingBooking ? <Loader2 className="w-4 h-4 animate-spin" /> : "Complete Booking"}
                  </Button>
                </div>
              </form>
            )}
          </Card>
        </div>
      )}

      {/* Rectification Form Dialog Modal */}
      {rectifyBookingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity">
          <Card className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border-none overflow-hidden animate-in fade-in zoom-in duration-200">
            <CardHeader className="bg-amber-600 text-white p-5">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl font-bold">Rectify Ad Campaign</CardTitle>
                  <CardDescription className="text-xs text-amber-50/80 mt-1">Review feedback and fix issues below</CardDescription>
                </div>
                <button onClick={handleCloseRectifyModal} className="text-white/80 hover:text-white text-xl">âœ•</button>
              </div>
            </CardHeader>
            <form onSubmit={handleRectifySubmit}>
              <CardContent className="p-6 space-y-4">

                {/* Admin Rejection Reason Display */}
                <div className="bg-red-50 border border-red-100 text-red-700 rounded-xl p-4 text-xs font-semibold">
                  <p className="font-bold text-red-800 mb-1 flex items-center gap-1.5"><AlertCircle className="w-4 h-4" /> Admin Feedback:</p>
                  <p className="italic font-medium">"{rectifyBookingItem.rejectionReason}"</p>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-600 block">Corrected Image <span className="text-red-500">*</span></label>

                  {rectifyAdContent.imageUrl && (
                    <div className="relative w-full h-32 rounded-xl overflow-hidden border border-slate-200 mb-2 group">
                      <img
                        src={rectifyAdContent.imageUrl}
                        alt="Ad Preview"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => setRectifyAdContent({ ...rectifyAdContent, imageUrl: '' })}
                          className="rounded-lg h-8"
                        >
                          <Trash2 className="w-4 h-4 mr-2" /> Remove
                        </Button>
                      </div>
                    </div>
                  )}

                  {!rectifyAdContent.imageUrl && (
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, 'rectify')}
                        disabled={isUploadingImage}
                        className="hidden"
                        id="rectify-image-upload"
                      />
                      <label
                        htmlFor="rectify-image-upload"
                        className={`w-full flex items-center justify-center gap-2 border-2 border-dashed border-amber-200 rounded-xl px-4 py-6 text-sm transition-colors cursor-pointer ${isUploadingImage ? 'bg-slate-50 cursor-not-allowed' : 'hover:border-amber-400 hover:bg-amber-50 text-slate-600'}`}
                      >
                        {isUploadingImage ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin text-slate-400" />
                            <span className="text-slate-500 font-medium">Uploading... {uploadProgress}%</span>
                          </>
                        ) : (
                          <>
                            <ImageIcon className="w-5 h-5 text-slate-400" />
                            <span className="font-medium">Click to upload corrected image</span>
                          </>
                        )}
                      </label>
                    </div>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600 block">Target Redirect URL <span className="text-red-500">*</span></label>
                  <input
                    type="url"
                    required
                    placeholder="https://mywebsite.com/project-listing"
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-amber-500 text-slate-700 placeholder-slate-400"
                    value={rectifyAdContent.targetUrl}
                    onChange={(e) => setRectifyAdContent({ ...rectifyAdContent, targetUrl: e.target.value })}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600 block">Ad Caption / Text <span className="text-red-500">*</span></label>
                  <textarea
                    required
                    rows="3"
                    placeholder="e.g. Invest in Premium Commercial Real Estate starting from..."
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-amber-500 text-slate-700 placeholder-slate-400 resize-none"
                    value={rectifyAdContent.text}
                    onChange={(e) => setRectifyAdContent({ ...rectifyAdContent, text: e.target.value })}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600 block">Ad Video URL (Optional)</label>
                  <input
                    type="url"
                    placeholder="https://example.com/ad-video.mp4"
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-amber-500 text-slate-700 placeholder-slate-400"
                    value={rectifyAdContent.videoUrl}
                    onChange={(e) => setRectifyAdContent({ ...rectifyAdContent, videoUrl: e.target.value })}
                  />
                </div>
              </CardContent>
              <div className="bg-slate-50 border-t border-slate-100 p-4 px-6 flex justify-end gap-3 rounded-b-2xl">
                <Button type="button" variant="outline" onClick={handleCloseRectifyModal} className="rounded-xl">Cancel</Button>
                <Button
                  type="submit"
                  disabled={isSubmittingRectify}
                  className="bg-amber-600 hover:bg-amber-700 text-white rounded-xl shadow-md min-w-[120px]"
                >
                  {isSubmittingRectify ? <Loader2 className="w-4 h-4 animate-spin" /> : "Re-submit Review"}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}

    </div>
  );
}
