"use client";

import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuth } from '@/hooks/AuthContext';
import { toast } from '@/hooks/use-toast';
import { 
  fetchAdZones, 
  fetchAvailableSlots, 
  bookSlot, 
  fetchMyBookings, 
  rectifyBooking, 
  cancelBooking 
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

// Zone display metadata — names and pricing shown in the sidebar list
const ZONE_META = {
  zone1: { name: 'Builder Dashboard Top Banner',       cost: 100, campaignDuration: 7 },
  zone2: { name: 'Investor Dashboard Leaderboard',     cost: 150, campaignDuration: 7 },
  zone3: { name: 'Investor Project Details Sidebar',   cost: 120, campaignDuration: 7 },
  zone4: { name: 'Project Search Results Inline Ad',   cost: 80,  campaignDuration: 7 },
  zone5: { name: 'Landing Page Hero Spotlight',        cost: 200, campaignDuration: 7 },
};

// Initialize Stripe outside component render to avoid recreating Stripe object on every render
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_test_placeholder');

export default function BuilderAdvertisements() {
  const { user } = useAuth();
  
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

  // Rectify Modal / Form State
  const [rectifyBookingItem, setRectifyBookingItem] = useState(null);
  const [rectifyAdContent, setRectifyAdContent] = useState({
    imageUrl: '',
    videoUrl: '',
    text: '',
    targetUrl: ''
  });
  const [isSubmittingRectify, setIsSubmittingRectify] = useState(false);

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
      // Merge API zone list with local metadata (names, costs, durations)
      const enriched = (data.data || []).map((z) => ({
        ...ZONE_META[z.id],
        ...z,
        // Prefer API values but fall back to local meta
        name: z.name || ZONE_META[z.id]?.name || z.id,
        cost: z.cost ?? ZONE_META[z.id]?.cost ?? '—',
        campaignDuration: z.campaignDuration ?? ZONE_META[z.id]?.campaignDuration ?? '—',
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
    try {
      setLoadingSlots(true);
      const data = await fetchAvailableSlots(zone.id);
      setSlots(data.data || []);
    } catch (error) {
      toast({ 
        title: "Error loading slots", 
        description: error.message || "Failed to load available slots for this zone.", 
        variant: "destructive" 
      });
    } finally {
      setLoadingSlots(false);
    }
  };

  const handleOpenBookingModal = (slot) => {
    setBookingSlot(slot);
    setAdContent({
      imageUrl: '',
      videoUrl: '',
      text: '',
      targetUrl: ''
    });
  };

  const handleCloseBookingModal = () => {
    setBookingSlot(null);
    setPaymentClientSecret(null);
    setPaymentId(null);
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
        slotId: bookingSlot.id,
        adContent
      });
      
      // If payment details exist, proceed to checkout
      if (response?.data?.payment?.clientSecret) {
        setPaymentClientSecret(response.data.payment.clientSecret);
        // API returns `paymentId` (not `id`) in the payment response DTO
        setPaymentId(response.data.payment.paymentId || null);
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
      <Header />
      
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
                        className={`w-full text-left p-4 rounded-xl border transition-all duration-200 flex items-center justify-between gap-3 ${
                          selectedZone?.id === zone.id
                            ? 'border-[#0b264f] bg-[#0b264f]/5 shadow-sm'
                            : 'border-slate-200 bg-white hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex flex-col gap-0.5 min-w-0">
                          <span className={`text-sm font-bold truncate ${selectedZone?.id === zone.id ? 'text-[#0b264f]' : 'text-slate-800'}`}>
                            {zone.name}
                          </span>
                          <span className="text-xs font-semibold text-orange-500">
                            ₹{zone.cost} / {zone.campaignDuration} days
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
                        <span className="text-[10px] text-slate-400 uppercase font-semibold flex items-center"><DollarSign className="w-3.5 h-3.5 mr-0.5 text-green-600" /> Cost / Slot</span>
                        <p className="text-lg font-bold text-slate-800">₹{selectedZone.cost}</p>
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] text-slate-400 uppercase font-semibold flex items-center"><Clock className="w-3.5 h-3.5 mr-0.5 text-blue-600" /> Duration</span>
                        <p className="text-base font-bold text-slate-800">{selectedZone.campaignDuration} Days</p>
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
                <CardHeader className="bg-slate-50 border-b border-slate-100 py-4 px-6">
                  <CardTitle className="text-lg font-bold text-slate-800">Available Booking Calendar</CardTitle>
                  <CardDescription className="text-xs">Reserve slots to start showing your listings in {selectedZone?.name}</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  {loadingSlots ? (
                    <div className="flex flex-col items-center justify-center py-16">
                      <Loader2 className="w-10 h-10 text-[#0b264f] animate-spin mb-4" />
                      <p className="text-sm text-slate-500 font-medium">Checking slot availability...</p>
                    </div>
                  ) : slots.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                      <Calendar className="w-12 h-12 text-slate-300 mb-3" />
                      <h3 className="text-base font-bold text-slate-800 mb-1">No Available Slots in "{selectedZone?.name}"</h3>
                      <p className="text-xs text-slate-500 max-w-sm">
                        No upcoming booking slots have been created for this zone yet, or all existing slots are in the past.
                        Please select a different zone or contact the admin to add new slots.
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {slots.map((slot) => (
                        <div 
                          key={slot.id} 
                          className="bg-white border border-slate-200/80 rounded-2xl p-4 flex flex-col justify-between hover:shadow-md transition-shadow relative"
                        >
                          <div className="space-y-3">
                            <div className="flex justify-between items-start">
                              <Badge className="bg-[#0b264f]/10 text-[#0b264f] border-none font-bold text-[10px]">
                                {slot.timeSlot || 'All Day'}
                              </Badge>
                              <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded">Available</span>
                            </div>
                            
                            <div className="space-y-1">
                              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Slot Schedule</span>
                              <p className="text-sm font-bold text-slate-700 flex items-center gap-1.5">
                                <Calendar className="w-4 h-4 text-slate-400" />
                                {new Date(slot.startDate).toLocaleDateString(undefined, {month: 'short', day: 'numeric', year: 'numeric'})} 
                                <span className="text-slate-400 font-medium">to</span> 
                                {new Date(slot.endDate).toLocaleDateString(undefined, {month: 'short', day: 'numeric', year: 'numeric'})}
                              </p>
                            </div>
                          </div>

                          <div className="border-t border-slate-100 pt-3.5 mt-4 flex items-center justify-between">
                            <div>
                              <span className="text-[9px] text-slate-400 uppercase font-semibold">Total Price</span>
                              <p className="text-base font-bold text-[#0b264f]">₹{selectedZone?.cost}</p>
                            </div>
                            <Button 
                              onClick={() => handleOpenBookingModal(slot)} 
                              size="sm" 
                              className="bg-orange-500 hover:bg-orange-600 text-white rounded-xl shadow-sm"
                            >
                              <Plus className="w-4 h-4 mr-1.5" /> Book Ad Slot
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
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
                            <td className="py-4 px-4 font-bold text-slate-800">₹{booking.cost}</td>
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
                    <strong className="text-slate-800 text-sm">₹{selectedZone?.cost}</strong>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600 block">Ad Image URL <span className="text-red-500">*</span></label>
                  <input 
                    type="url"
                    required
                    placeholder="https://example.com/ad-image.jpg"
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#0b264f] text-slate-700 placeholder-slate-400"
                    value={adContent.imageUrl}
                    onChange={(e) => setAdContent({...adContent, imageUrl: e.target.value})}
                  />
                  <p className="text-[10px] text-slate-400">Supported Dimensions: {selectedZone?.width} x {selectedZone?.height} px</p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600 block">Target Redirect URL <span className="text-red-500">*</span></label>
                  <input 
                    type="url"
                    required
                    placeholder="https://mywebsite.com/project-listing"
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#0b264f] text-slate-700 placeholder-slate-400"
                    value={adContent.targetUrl}
                    onChange={(e) => setAdContent({...adContent, targetUrl: e.target.value})}
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
                    onChange={(e) => setAdContent({...adContent, text: e.target.value})}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600 block">Ad Video URL (Optional)</label>
                  <input 
                    type="url"
                    placeholder="https://example.com/ad-video.mp4"
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#0b264f] text-slate-700 placeholder-slate-400"
                    value={adContent.videoUrl}
                    onChange={(e) => setAdContent({...adContent, videoUrl: e.target.value})}
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

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600 block">Corrected Image URL <span className="text-red-500">*</span></label>
                  <input 
                    type="url"
                    required
                    placeholder="https://example.com/ad-image-rectified.jpg"
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-amber-500 text-slate-700 placeholder-slate-400"
                    value={rectifyAdContent.imageUrl}
                    onChange={(e) => setRectifyAdContent({...rectifyAdContent, imageUrl: e.target.value})}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600 block">Target Redirect URL <span className="text-red-500">*</span></label>
                  <input 
                    type="url"
                    required
                    placeholder="https://mywebsite.com/project-listing"
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-amber-500 text-slate-700 placeholder-slate-400"
                    value={rectifyAdContent.targetUrl}
                    onChange={(e) => setRectifyAdContent({...rectifyAdContent, targetUrl: e.target.value})}
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
                    onChange={(e) => setRectifyAdContent({...rectifyAdContent, text: e.target.value})}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600 block">Ad Video URL (Optional)</label>
                  <input 
                    type="url"
                    placeholder="https://example.com/ad-video.mp4"
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-amber-500 text-slate-700 placeholder-slate-400"
                    value={rectifyAdContent.videoUrl}
                    onChange={(e) => setRectifyAdContent({...rectifyAdContent, videoUrl: e.target.value})}
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

      <Footer />
    </div>
  );
}
