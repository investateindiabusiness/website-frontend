<<<<<<< HEAD
"use client";
=======
﻿"use client";
>>>>>>> 5627b10a2105b23a802352e1ccd8df8ffd4e1612

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/AuthContext';
import { toast } from '@/hooks/use-toast';
import {
  fetchAdZones,
  fetchSlots,
  bookSlot,
  fetchMyBookings,
  rectifyBooking,
  cancelBooking,
  uploadImage,
  uploadFile
} from '@/api';
import { compressAdImage } from '@/utils/imageCompressor';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from '@/components/CheckoutForm';
import {
  Calendar,
  Image as ImageIcon,
  DollarSign,
  Clock,
  Plus,
  AlertCircle,
  CheckCircle,
  XCircle,
  Edit,
  Trash2,
  Loader2,
  Sparkles,
  ExternalLink,
  Settings,
  Video as VideoIcon,
  FileText as TextIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

// Zone display metadata
const ZONE_META = {
<<<<<<< HEAD
  zone1: { name: 'Home Page Spotlight', cost: 63, campaignDuration: 1 },
  zone2: { name: 'Public Investor Page Spotlight', cost: 70, campaignDuration: 1 },
  zone3: { name: 'Project Search Results Inline Ad', cost: 70, campaignDuration: 1 },
  zone4: { name: 'Investor Project Details', cost: 70, campaignDuration: 1 },
  zone5: { name: 'Landing Page Hero Spotlight', cost: 70, campaignDuration: 1 },
=======
  zone1: { name: 'Builder Dashboard Leaderboard', cost: 63, campaignDuration: 7 },
  zone2: { name: 'Investor Dashboard Leaderboard', cost: 70, campaignDuration: 7 },
  zone3: { name: 'Project Search Results Inline Ad', cost: 70, campaignDuration: 7 },
  zone4: { name: 'Investor Project Details', cost: 70, campaignDuration: 7 },
  zone5: { name: 'Landing Page Hero Spotlight', cost: 70, campaignDuration: 7 },
>>>>>>> 5627b10a2105b23a802352e1ccd8df8ffd4e1612
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

export default function ServiceProviderAdvertisements() {
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
  const [paymentClientSecret, setPaymentClientSecret] = useState(null);
  const [paymentId, setPaymentId] = useState(null);

  // Rectify Modal / Form State
  const [rectifyBookingItem, setRectifyBookingItem] = useState(null);
  const [rectifyAdContent, setRectifyAdContent] = useState({
    imageUrl: '',
    videoUrl: '',
    text: '',
    targetUrl: ''
  });
  const [rectifyImageFile, setRectifyImageFile] = useState(null);
  const [rectifyImagePreview, setRectifyImagePreview] = useState('');
  const [rectifyVideoFile, setRectifyVideoFile] = useState(null);
  const [rectifyVideoPreview, setRectifyVideoPreview] = useState('');
  const [isRectifyUploadingFile, setIsRectifyUploadingFile] = useState(false);
  const [isSubmittingRectify, setIsSubmittingRectify] = useState(false);

  // Calendar Navigation & Interaction States
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [hoveredSlot, setHoveredSlot] = useState(null);

  useEffect(() => {
    if (user) {
      loadZones();
      loadMyBookings();
    }
  }, [user]);

  const loadZones = async () => {
    try {
      setLoadingZones(true);
      const data = await fetchAdZones();
      const enriched = (data.data || [])
        .filter((z) => !z.allowedBookers || z.allowedBookers.includes('serviceProvider'))
        .map((z) => ({
        ...ZONE_META[z.id],
        ...z,
        name: z.name || ZONE_META[z.id]?.name || z.id,
        cost: z.cost ?? ZONE_META[z.id]?.cost ?? '—',
<<<<<<< HEAD
        campaignDuration: z.campaignDuration ?? ZONE_META[z.id]?.campaignDuration ?? 1,
=======
        campaignDuration: z.campaignDuration ?? ZONE_META[z.id]?.campaignDuration ?? '—',
>>>>>>> 5627b10a2105b23a802352e1ccd8df8ffd4e1612
      }));
      setZones(enriched);
      if (enriched.length > 0) {
        const defaultZone = enriched.find(z => z.id === 'zone2') || enriched[0];
        handleSelectZone(defaultZone);
      }
    } catch (error) {
      toast({
        title: "Error loading zones",
        description: error.message || "Failed to load active advertisement zones.",
        variant: "destructive"
      });
    } finally {
      setLoadingZones(false);
    }
  };

  const loadMyBookings = async () => {
    try {
      setLoadingBookings(true);
      const data = await fetchMyBookings();
      setMyBookings(data.data || []);
    } catch (error) {
      toast({
        title: "Error loading bookings",
        description: error.message || "Failed to load your campaigns.",
        variant: "destructive"
      });
    } finally {
      setLoadingBookings(false);
    }
  };

  const handleSelectZone = async (zone) => {
    setSelectedZone(zone);
    setSelectedSlot(null);
    setHoveredSlot(null);
    try {
      setLoadingSlots(true);
      const data = await fetchSlots(zone.id);
      setSlots(data.data || []);
    } catch (error) {
      toast({
        title: "Error loading slots",
        description: error.message || "Failed to load advertisement slots for this zone.",
        variant: "destructive"
      });
    } finally {
      setLoadingSlots(false);
    }
  };

  const handleOpenBookingModal = (slot) => {
    if (!slot || !selectedZone) return;
    router.push(
      `/service-provider/advertisements/book?zoneId=${selectedZone.id}&startDate=${slot.startDate}&endDate=${slot.endDate}&timeSlot=${encodeURIComponent(slot.timeSlot || 'All Day')}`
    );
  };

  const getSlotForDate = (dateString) => {
    const bookedCampaign = slots.find(s => s.isBooked && s.startDate <= dateString && s.endDate >= dateString);
    if (bookedCampaign) return bookedCampaign;

    const currentDate = new Date().toISOString().split('T')[0];
    if (dateString < currentDate) return null;

    if (selectedZone) {
<<<<<<< HEAD
      const duration = selectedZone.campaignDuration || 1;
=======
      const duration = selectedZone.campaignDuration || 7;
>>>>>>> 5627b10a2105b23a802352e1ccd8df8ffd4e1612
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

  const handleCloseBookingModal = () => {
    setBookingSlot(null);
    setPaymentClientSecret(null);
    setPaymentId(null);
    setImageFile(null);
    setImagePreview('');
    setVideoFile(null);
    setVideoPreview('');
    setIsUploadingFile(false);
    setUploadProgress(0);
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
      const response = await bookSlot({
        zoneId: selectedZone.id,
        startDate: bookingSlot.startDate,
        endDate: bookingSlot.endDate,
        adContent: {
          ...adContent,
          imageUrl: campaignFormat === 'image' ? adContent.imageUrl : '',
          videoUrl: campaignFormat === 'video' ? adContent.videoUrl : ''
        }
      });

      if (response?.data?.payment?.clientSecret) {
        setPaymentClientSecret(response.data.payment.clientSecret);
        setPaymentId(response.data.payment.id);
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

  const handleOpenRectifyModal = (booking) => {
    setRectifyBookingItem(booking);
    setRectifyAdContent({
      imageUrl: booking.adContent?.imageUrl || '',
      videoUrl: booking.adContent?.videoUrl || '',
      text: booking.adContent?.text || '',
      targetUrl: booking.adContent?.targetUrl || ''
    });
    setRectifyImagePreview(booking.adContent?.imageUrl || '');
    setRectifyVideoPreview(booking.adContent?.videoUrl || '');
    setRectifyImageFile(null);
    setRectifyVideoFile(null);
  };

  const handleCloseRectifyModal = () => {
    setRectifyBookingItem(null);
    setRectifyImageFile(null);
    setRectifyImagePreview('');
    setRectifyVideoFile(null);
    setRectifyVideoPreview('');
  };

  const handleRectifyImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      setIsRectifyUploadingFile(true);
      const compressed = await compressAdImage(file);
      const res = await uploadImage(compressed, 'campaigns');
      setRectifyImageFile(file);
      setRectifyImagePreview(res.url);
      setRectifyAdContent(prev => ({ ...prev, imageUrl: res.url }));
      toast({ title: 'Upload Successful', description: 'Corrected image uploaded to Firebase.' });
    } catch (err) {
      toast({ title: 'Upload Failed', description: err.message || 'Could not upload image.', variant: 'destructive' });
    } finally {
      setIsRectifyUploadingFile(false);
    }
  };

  const handleRectifyVideoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      return toast({ title: 'File Too Large', description: 'Video must be under 10MB.', variant: 'destructive' });
    }
    try {
      setIsRectifyUploadingFile(true);
      const res = await uploadFile(file, 'campaigns');
      setRectifyVideoFile(file);
      setRectifyVideoPreview(res.url);
      setRectifyAdContent(prev => ({ ...prev, videoUrl: res.url }));
      toast({ title: 'Upload Successful', description: 'Corrected video uploaded to Firebase.' });
    } catch (err) {
      toast({ title: 'Upload Failed', description: err.message || 'Could not upload video.', variant: 'destructive' });
    } finally {
      setIsRectifyUploadingFile(false);
    }
  };

  const handleRectifySubmit = async (e) => {
    e.preventDefault();
    if (!rectifyAdContent.imageUrl && !rectifyAdContent.videoUrl) {
      return toast({ title: "Validation Error", description: "Please upload an image or video for the corrected ad.", variant: "destructive" });
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

      <div className="flex-grow pb-16">

        {/* Banner Section */}
        <div className="bg-gradient-to-r from-slate-800 to-slate-950 text-white pt-8 pb-14 px-4 md:px-8 rounded-b-[2rem] shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl pointer-events-none"></div>
          <div className="container mx-auto relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <Badge className="bg-orange-500/25 text-orange-200 border-none mb-3 px-3 py-1">
                <Sparkles className="w-3.5 h-3.5 mr-1.5" /> Expose Your Brand
              </Badge>
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2">Service Provider Campaigns</h1>
              <p className="text-sm md:text-base text-slate-300 opacity-90 max-w-xl">
                Deploy ad banners across builder dashboards and investor details panels to acquire premium developer and NRI contracts.
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
                          ? 'border-slate-800 bg-slate-50 shadow-sm'
                          : 'border-slate-200 bg-white hover:bg-slate-50'
                          }`}
                      >
                        <div className="flex flex-col gap-0.5 min-w-0">
                          <span className={`text-sm font-bold truncate ${selectedZone?.id === zone.id ? 'text-slate-900' : 'text-slate-800'}`}>
                            {zone.name}
                          </span>
                          <span className="text-xs font-semibold text-orange-500">
<<<<<<< HEAD
                            ${zone.cost} / day
=======
                            ${zone.cost} / {zone.campaignDuration} days
>>>>>>> 5627b10a2105b23a802352e1ccd8df8ffd4e1612
                          </span>
                        </div>
                      </button>
                    ))
                  )}
                </CardContent>
              </Card>

              {selectedZone && (
                <Card className="shadow-sm border border-slate-200/60 rounded-2xl bg-white overflow-hidden">
                  <div className="bg-slate-800 text-white p-4.5 text-center">
                    <h3 className="text-sm uppercase tracking-wider font-bold opacity-85">Zone Specification</h3>
                    <h2 className="text-lg font-bold mt-1">{selectedZone.name}</h2>
                  </div>
                  <CardContent className="p-5 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <span className="text-[10px] text-slate-400 uppercase font-semibold flex items-center"><DollarSign className="w-3.5 h-3.5 mr-0.5 text-green-600" /> Cost / Slot</span>
                        <p className="text-lg font-bold text-slate-800">${selectedZone.cost}</p>
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] text-slate-400 uppercase font-semibold flex items-center"><Clock className="w-3.5 h-3.5 mr-0.5 text-blue-600" /> Duration</span>
<<<<<<< HEAD
                        <p className="text-base font-bold text-slate-800">Per Day</p>
=======
                        <p className="text-base font-bold text-slate-800">{selectedZone.campaignDuration} Days</p>
>>>>>>> 5627b10a2105b23a802352e1ccd8df8ffd4e1612
                      </div>
                    </div>

                    <div className="border-t border-slate-100 pt-4 space-y-1">
                      <span className="text-[10px] text-slate-400 uppercase font-semibold">Dimensions Format</span>
                      <p className="text-sm font-semibold text-slate-700">{selectedZone.width}x{selectedZone.height} ({selectedZone.adType})</p>
                    </div>

                    <div className="bg-slate-50 border border-slate-100 rounded-xl p-3.5 space-y-2">
                      <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Default Ad Fallback</h4>
                      <p className="text-xs text-slate-600 italic">"{selectedZone.defaultAd?.text}"</p>
                      {selectedZone.defaultAd?.imageUrl && (
                        <div className="mt-2 text-[10px]">
                          <a href={selectedZone.defaultAd.imageUrl} target="_blank" rel="noreferrer" className="text-blue-600 font-semibold flex items-center hover:underline">
                            View default image <ExternalLink className="w-3 h-3 ml-1" />
                          </a>
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
                    <CardDescription className="text-xs">Select a green date slot to schedule your advertisement campaign in {selectedZone?.name}</CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  {loadingSlots ? (
                    <div className="flex flex-col items-center justify-center py-16">
                      <Loader2 className="w-10 h-10 text-slate-700 animate-spin mb-4" />
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
                            ❮
                          </button>
                          <button
                            type="button"
                            onClick={nextMonth}
                            className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors border border-slate-200 shadow-sm"
                          >
                            ❯
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

                      <div className="grid grid-cols-7 gap-2">
                        {Array.from({ length: firstDayIndex }).map((_, idx) => (
                          <div key={`empty-${idx}`} className="h-10 md:h-12"></div>
                        ))}
                        {Array.from({ length: daysInMonth }).map((_, idx) => {
                          const day = idx + 1;
                          const dateStr = `${calendarYear}-${String(calendarMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                          const slot = getSlotForDate(dateStr);

                          let dayBg = "bg-white hover:bg-slate-50 border border-slate-100 text-slate-700";
                          let isClickable = false;
                          let title = "";

                          if (slot) {
                            if (slot.isBooked) {
                              dayBg = "bg-red-500 text-white font-bold cursor-not-allowed shadow-sm";
                              title = `Booked slot: ${formatDate(slot.startDate)} to ${formatDate(slot.endDate)}`;
                            } else {
                              const isSelected = selectedSlot?.startDate && slot.startDate === selectedSlot.startDate;
                              const isHovered = hoveredSlot && !hoveredSlot.isBooked && dateStr >= hoveredSlot.startDate && dateStr <= hoveredSlot.endDate;
                              dayBg = isSelected
                                ? "bg-green-700 text-white font-bold ring-2 ring-green-500 shadow-md cursor-pointer"
                                : isHovered
                                  ? "bg-green-400 text-white font-semibold cursor-pointer shadow-sm"
                                  : "bg-green-500 text-white font-semibold hover:bg-green-600 cursor-pointer shadow-sm";
                              isClickable = true;
                              title = `Available slot: ${formatDate(slot.startDate)} to ${formatDate(slot.endDate)}`;
                            }
                          }

                          return (
                            <div
                              key={`day-${day}`}
                              className={`h-10 md:h-12 flex flex-col items-center justify-center rounded-lg text-xs md:text-sm transition-all duration-150 relative select-none ${dayBg}`}
                              onClick={() => {
                                if (isClickable && slot) {
                                  setSelectedSlot(slot);
                                }
                              }}
                              onMouseEnter={() => {
                                if (slot && !slot.isBooked) {
                                  setHoveredSlot(slot);
                                }
                              }}
                              onMouseLeave={() => {
                                setHoveredSlot(null);
                              }}
                              title={title}
                            >
                              <span>{day}</span>
                              {slot && (
                                <span className="absolute bottom-0.5 text-[8px] opacity-75 font-mono">
                                  {slot.isBooked ? "Booked" : "Open"}
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>

                      {/* Legend */}
                      <div className="flex items-center gap-4 text-xs font-semibold text-slate-500 pt-2 border-t border-slate-100">
                        <div className="flex items-center gap-1.5">
                          <div className="w-3.5 h-3.5 bg-green-500 rounded"></div>
                          <span>Available</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <div className="w-3.5 h-3.5 bg-red-500 rounded"></div>
                          <span>Booked</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <div className="w-3.5 h-3.5 bg-white border border-slate-200 rounded"></div>
                          <span>No Slot</span>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Selected Slot Information Card */}
              {selectedSlot && (
                <Card className="border border-green-200 bg-green-50/50 rounded-2xl p-4 shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-200">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                      <h4 className="text-xs font-bold text-green-800 uppercase tracking-wide">Selected Available Slot</h4>
                      <p className="text-sm font-bold text-slate-800 mt-1">
                        {formatDate(selectedSlot.startDate)} to {formatDate(selectedSlot.endDate)}
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5 font-medium">Time Slot: {selectedSlot.timeSlot || 'All Day'}</p>
                    </div>
                    <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end border-t md:border-none border-slate-100 pt-3 md:pt-0">
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-semibold block">Total Price</span>
                        <p className="text-base font-bold text-slate-800">${selectedZone?.cost}</p>
                      </div>
                      <Button
                        onClick={() => handleOpenBookingModal(selectedSlot)}
                        className="bg-green-600 hover:bg-green-700 text-white rounded-xl shadow-md font-semibold px-5"
                      >
                        Book Ad Slot
                      </Button>
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
                  <Loader2 className="w-10 h-10 text-slate-700 animate-spin mb-4" />
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
                              {booking.startDate} to {booking.endDate}
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
            <CardHeader className="bg-slate-800 text-white p-5">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl font-bold">{paymentClientSecret ? 'Complete Payment' : 'Campaign Details'}</CardTitle>
                  <CardDescription className="text-xs text-slate-100/80 mt-1">Book slot for: {selectedZone?.name}</CardDescription>
                </div>
                <button onClick={handleCloseBookingModal} className="text-white/80 hover:text-white text-xl">✕</button>
              </div>
            </CardHeader>
            {paymentClientSecret ? (
              <CardContent className="p-6">
                <Elements stripe={stripePromise} options={{ clientSecret: paymentClientSecret, appearance: { theme: 'stripe' } }}>
                  <CheckoutForm
                    amount={selectedZone?.cost}
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
                      <strong className="text-slate-800 text-sm">{bookingSlot.startDate} to {bookingSlot.endDate}</strong>
                    </div>
                    <div className="text-right">
                      <span className="font-semibold text-slate-400 uppercase tracking-wide block text-[9px]">Cost</span>
                      <strong className="text-slate-800 text-sm">${selectedZone?.cost}</strong>
                    </div>
                  </div>

                  {/* Resolution specifications & Campaign Format Selector */}
                  <div className="bg-indigo-50/50 border border-indigo-100 rounded-2xl p-4.5 space-y-4">
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
                              ? 'border-slate-800 bg-slate-100 text-slate-900 shadow-sm'
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
                        <div className="relative border-2 border-dashed border-slate-200 hover:border-slate-800 rounded-2xl p-6 transition-all cursor-pointer group bg-slate-50/50 flex flex-col items-center justify-center min-h-[140px]">
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
                              <ImageIcon className="w-8 h-8 text-slate-400 group-hover:text-slate-800 transition-colors mb-2" />
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
                        <div className="relative border-2 border-dashed border-slate-200 hover:border-slate-800 rounded-2xl p-6 transition-all cursor-pointer group bg-slate-50/50 flex flex-col items-center justify-center min-h-[140px]">
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
                              <VideoIcon className="w-8 h-8 text-slate-400 group-hover:text-slate-800 transition-colors mb-2" />
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

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600 block">Target Redirect URL <span className="text-red-500">*</span></label>
                    <input
                      type="url"
                      required
                      placeholder="https://mywebsite.com/my-services"
                      className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-slate-800 text-slate-700 placeholder-slate-400"
                      value={adContent.targetUrl}
                      onChange={(e) => setAdContent({ ...adContent, targetUrl: e.target.value })}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600 block">Ad Caption / Text <span className="text-red-500">*</span></label>
                    <textarea
                      required
                      rows="3"
                      placeholder="e.g. Legal due diligence and property verification advisors..."
                      className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-slate-800 text-slate-700 placeholder-slate-400 resize-none"
                      value={adContent.text}
                      onChange={(e) => setAdContent({ ...adContent, text: e.target.value })}
                    />
                  </div>
                </CardContent>
                <div className="bg-slate-50 border-t border-slate-100 p-4 px-6 flex justify-end gap-3 rounded-b-2xl">
                  <Button type="button" variant="outline" onClick={handleCloseBookingModal} className="rounded-xl">Cancel</Button>
                  <Button
                    type="submit"
                    disabled={isSubmittingBooking}
                    className="bg-slate-800 hover:bg-slate-900 text-white rounded-xl shadow-md min-w-[120px]"
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
                <button onClick={handleCloseRectifyModal} className="text-white/80 hover:text-white text-xl">✕</button>
              </div>
            </CardHeader>
            <form onSubmit={handleRectifySubmit}>
              <CardContent className="p-6 space-y-4">

                {/* Admin Rejection Reason Display */}
                <div className="bg-red-50 border border-red-100 text-red-700 rounded-xl p-4 text-xs font-semibold">
                  <p className="font-bold text-red-800 mb-1 flex items-center gap-1.5"><AlertCircle className="w-4 h-4" /> Admin Feedback:</p>
                  <p className="italic font-medium">"{rectifyBookingItem.rejectionReason}"</p>
                </div>

                {/* Corrected Image Upload */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-600 block">Corrected Ad Image</label>
                  {rectifyImagePreview ? (
                    <div className="space-y-2">
                      <div className="relative w-full rounded-xl overflow-hidden border border-slate-200 bg-slate-50 aspect-[16/9] max-h-40 flex items-center justify-center p-2">
                        <img src={rectifyImagePreview} alt="Corrected Ad" className="w-full h-full object-contain rounded-lg" />
                      </div>
                      <button type="button" onClick={() => { setRectifyImageFile(null); setRectifyImagePreview(''); setRectifyAdContent(prev => ({ ...prev, imageUrl: '' })); }} className="text-xs text-red-500 hover:underline font-semibold">✕ Remove image</button>
                    </div>
                  ) : (
                    <div className="relative border-2 border-dashed border-amber-200 hover:border-amber-400 rounded-2xl p-5 flex flex-col items-center justify-center min-h-[100px] cursor-pointer group transition-all">
                      <input type="file" accept="image/*" onChange={handleRectifyImageChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                      {isRectifyUploadingFile ? (
                        <><Loader2 className="w-6 h-6 text-amber-500 animate-spin mb-1" /><span className="text-xs font-medium text-slate-500">Uploading...</span></>
                      ) : (
                        <><ImageIcon className="w-6 h-6 text-slate-400 group-hover:text-amber-500 transition-colors mb-1" /><span className="text-xs font-semibold text-slate-500 group-hover:text-amber-600">Click to upload corrected image</span></>
                      )}
                    </div>
                  )}
                </div>

                {/* Corrected Video Upload */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-600 block">Corrected Ad Video (Optional)</label>
                  {rectifyVideoPreview ? (
                    <div className="space-y-2">
                      <video src={rectifyVideoPreview} controls className="w-full rounded-xl border border-slate-200 max-h-36" />
                      <button type="button" onClick={() => { setRectifyVideoFile(null); setRectifyVideoPreview(''); setRectifyAdContent(prev => ({ ...prev, videoUrl: '' })); }} className="text-xs text-red-500 hover:underline font-semibold">✕ Remove video</button>
                    </div>
                  ) : (
                    <div className="relative border-2 border-dashed border-slate-200 hover:border-amber-300 rounded-2xl p-5 flex flex-col items-center justify-center min-h-[80px] cursor-pointer group transition-all">
                      <input type="file" accept="video/*" onChange={handleRectifyVideoChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                      {isRectifyUploadingFile ? (
                        <><Loader2 className="w-6 h-6 text-slate-400 animate-spin mb-1" /><span className="text-xs font-medium text-slate-500">Uploading...</span></>
                      ) : (
                        <><VideoIcon className="w-6 h-6 text-slate-400 group-hover:text-amber-500 transition-colors mb-1" /><span className="text-xs font-semibold text-slate-500 group-hover:text-amber-600">Click to upload corrected video (optional)</span></>
                      )}
                    </div>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600 block">Target Redirect URL <span className="text-red-500">*</span></label>
                  <input
                    type="url"
                    required
                    placeholder="https://mywebsite.com/my-services"
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
                    placeholder="e.g. Legal due diligence and property verification advisors..."
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-amber-500 text-slate-700 placeholder-slate-400 resize-none"
                    value={rectifyAdContent.text}
                    onChange={(e) => setRectifyAdContent({ ...rectifyAdContent, text: e.target.value })}
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
