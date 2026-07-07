"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/hooks/AuthContext";
import { toast } from "@/hooks/use-toast";
import {
  adminSeedZones,
  adminFetchZones,
  adminUpdateZone,
  adminCreateSlot,
  adminDeleteSlot,
  adminFetchSlots,
  adminFetchBookings,
  adminReviewBooking,
  uploadImage,
} from "@/api";
import { compressAdImage } from "@/utils/imageCompressor";
import {
  Calendar,
  Image as ImageIcon,
  DollarSign,
  Clock,
  Layers,
  Settings,
  Plus,
  Trash2,
  Check,
  X,
  AlertCircle,
  Loader2,
  Database,
  Search,
  Filter,
  ExternalLink,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

const formatDate = (dateStr) => {
  if (!dateStr) return "";
  if (/^\d{2}-\d{2}-\d{4}$/.test(dateStr)) return dateStr;
  const parts = dateStr.split("-");
  if (parts.length === 3 && parts[0].length === 4) {
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
  }
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

export default function AdminAdvertisements() {
  const { user } = useAuth();

  const [zones, setZones] = useState([]);
  const [selectedZone, setSelectedZone] = useState(null);
  const [slots, setSlots] = useState([]);
  const [bookings, setBookings] = useState([]);

  const [loadingZones, setLoadingZones] = useState(true);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [isSeeding, setIsSeeding] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Active view tab: 'zones' or 'bookings'
  const [activeTab, setActiveTab] = useState("bookings");

  // Booking approval filters
  const [statusFilter, setStatusFilter] = useState("All");
  const [zoneFilter, setZoneFilter] = useState("All");

  // Modal forms
  const [editZoneItem, setEditZoneItem] = useState(null);
  const [editZoneForm, setEditZoneForm] = useState({
    name: "",
    costPerDay: 0,
    status: "active",
    defaultAd: {
      imageUrl: "",
      videoUrl: "",
      text: "",
      targetUrl: "",
    },
  });
  const [isUpdatingZone, setIsUpdatingZone] = useState(false);

  // Reject review state
  const [rejectingBooking, setRejectingBooking] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [previewBooking, setPreviewBooking] = useState(null);

  useEffect(() => {
    if (user && user.role === "admin") {
      loadZones();
      loadBookings();
    }
  }, [user]);

  const loadZones = async () => {
    try {
      setLoadingZones(true);
      const data = await adminFetchZones();
      const zoneList = (data.data || []).filter((z) => z.status === 'active');
      setZones(zoneList);
      if (zoneList.length > 0 && !selectedZone) {
        handleSelectZone(zoneList[0]);
      } else if (selectedZone) {
        // Refresh currently selected zone if any
        const updatedSelected = zoneList.find((z) => z.id === selectedZone.id);
        if (updatedSelected) setSelectedZone(updatedSelected);
      }
    } catch (error) {
      toast({
        title: "Error loading zones",
        description: error.message || "Failed to fetch zones.",
        variant: "destructive",
      });
    } finally {
      setLoadingZones(false);
    }
  };

  const loadBookings = async () => {
    try {
      setLoadingBookings(true);
      const data = await adminFetchBookings();
      setBookings(data.data || []);
    } catch (error) {
      toast({
        title: "Error loading bookings",
        description: error.message || "Failed to fetch bookings.",
        variant: "destructive",
      });
    } finally {
      setLoadingBookings(false);
    }
  };

  const handleSelectZone = async (zone) => {
    setSelectedZone(zone);
    try {
      setLoadingSlots(true);
      const data = await adminFetchSlots(zone.id);
      setSlots(data.data || []);
    } catch (error) {
      toast({
        title: "Error loading slots",
        description: error.message || "Failed to load slots.",
        variant: "destructive",
      });
    } finally {
      setLoadingSlots(false);
    }
  };

  const handleSeedZones = async () => {
    try {
      setIsSeeding(true);
      await adminSeedZones();
      toast({
        title: "Success!",
        description: "Advertisement zones seeded successfully.",
      });
      loadZones();
    } catch (error) {
      toast({
        title: "Seeding Failed",
        description: error.message || "Failed to seed zones.",
        variant: "destructive",
      });
    } finally {
      setIsSeeding(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid File",
        description: "Please upload an image file (PNG, JPG, etc).",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (e.g., 2MB max)
    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "Image size should be less than 2MB.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsUploadingImage(true);
      setUploadProgress(25);

      const response = await uploadImage(file, "fallback");

      setUploadProgress(100);
      const downloadURL = response.url;

      setEditZoneForm((prev) => ({
        ...prev,
        defaultAd: { ...prev.defaultAd, imageUrl: downloadURL },
      }));
      toast({
        title: "Upload Successful",
        description: "Image uploaded successfully.",
      });
      setIsUploadingImage(false);
      setUploadProgress(0);
    } catch (error) {
      console.error("Upload setup error:", error);
      toast({
        title: "Upload Failed",
        description: error.message || "Could not initialize upload.",
        variant: "destructive",
      });
      setIsUploadingImage(false);
      setUploadProgress(0);
    }
  };

  // Zone editing
  const handleOpenEditZone = (zone) => {
    setEditZoneItem(zone);
    setEditZoneForm({
      name: zone.name,
      costPerDay: zone.costPerDay,
      status: zone.status || "active",
      defaultAd: {
        imageUrl: zone.defaultAd?.imageUrl || "",
        videoUrl: zone.defaultAd?.videoUrl || "",
        text: zone.defaultAd?.text || "",
        targetUrl: zone.defaultAd?.targetUrl || "",
      },
    });
  };

  const handleCloseEditZone = () => {
    setEditZoneItem(null);
  };

  const handleFallbackImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const compressed = await compressAdImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditZoneForm({
          ...editZoneForm,
          defaultAd: { ...editZoneForm.defaultAd, imageUrl: reader.result },
        });
      };
      reader.readAsDataURL(compressed);
    } catch (err) {
      toast({
        title: "Image Processing Failed",
        description: err.message,
        variant: "destructive",
      });
    }
  };

  const handleRemoveFallbackImage = () => {
    setEditZoneForm({
      ...editZoneForm,
      defaultAd: { ...editZoneForm.defaultAd, imageUrl: "" },
    });
  };

  const handleZoneUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsUpdatingZone(true);
      const payload = {
        name: editZoneForm.name,
        defaultZoneName:
          editZoneItem.defaultZoneName || editZoneItem.name || "Default Name",
        platform: editZoneItem.platform || "Web",
        category: editZoneItem.category || "Real Estate",
        adType: editZoneItem.adType || "Image",
        width: Number(editZoneItem.width || 728),
        height: Number(editZoneItem.height || 90),
        costPerDay: Number(editZoneForm.costPerDay),
        availableDateRange: editZoneItem.availableDateRange || {
          start: "2026-06-01",
          end: "2026-12-31",
        },
        availableTimeSlots: editZoneItem.availableTimeSlots || ["All Day"],
        status: editZoneForm.status,
        defaultAd: {
          imageUrl: editZoneForm.defaultAd?.imageUrl || "",
          videoUrl: editZoneForm.defaultAd?.videoUrl || "",
          text: editZoneForm.defaultAd?.text || "",
          targetUrl: editZoneForm.defaultAd?.targetUrl || "",
        },
      };
      await adminUpdateZone(editZoneItem.id, payload);
      toast({
        title: "Zone Updated",
        description: "Zone configuration saved successfully.",
      });
      handleCloseEditZone();
      loadZones();
    } catch (error) {
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update zone.",
        variant: "destructive",
      });
    } finally {
      setIsUpdatingZone(false);
    }
  };

  // Booking review (Approve / Reject)
  const handleApproveBooking = async (bookingId) => {
    if (
      !confirm(
        "Approve this campaign booking? This will go live on scheduled dates.",
      )
    )
      return;
    try {
      setIsSubmittingReview(true);
      await adminReviewBooking(bookingId, { approvalStatus: "approved" });
      toast({
        title: "Booking Approved",
        description: "Campaign approved successfully.",
      });
      loadBookings();
    } catch (error) {
      toast({
        title: "Review Failed",
        description: error.message || "Failed to approve booking.",
        variant: "destructive",
      });
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const handleOpenRejectDialog = (booking) => {
    setRejectingBooking(booking);
    setRejectionReason("");
  };

  const handleCloseRejectDialog = () => {
    setRejectingBooking(null);
  };

  const handleRejectBookingSubmit = async (e) => {
    e.preventDefault();
    if (!rejectionReason.trim()) {
      return toast({
        title: "Validation Error",
        description: "Rejection comment is required.",
        variant: "destructive",
      });
    }
    try {
      setIsSubmittingReview(true);
      await adminReviewBooking(rejectingBooking.id, {
        approvalStatus: "rejected",
        rejectionReason,
      });
      toast({
        title: "Booking Rejected",
        description: "Campaign rejected with feedback.",
      });
      handleCloseRejectDialog();
      loadBookings();
    } catch (error) {
      toast({
        title: "Review Failed",
        description: error.message || "Failed to reject booking.",
        variant: "destructive",
      });
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "approved":
        return (
          <Badge className="bg-green-500 hover:bg-green-600 text-white flex items-center gap-1 w-fit">
            <Check className="w-3 h-3" /> Approved
          </Badge>
        );
      case "rejected":
        return (
          <Badge className="bg-red-500 hover:bg-red-600 text-white flex items-center gap-1 w-fit">
            <X className="w-3 h-3" /> Rejected
          </Badge>
        );
      case "cancelled":
        return (
          <Badge className="bg-gray-400 hover:bg-gray-500 text-white flex items-center gap-1 w-fit">
            <X className="w-3 h-3" /> Cancelled
          </Badge>
        );
      case "pending_payment":
        return (
          <Badge className="bg-blue-500 hover:bg-blue-600 text-white flex items-center gap-1 w-fit">
            <DollarSign className="w-3 h-3" /> Pending Payment
          </Badge>
        );
      case "completed":
        return (
          <Badge className="bg-purple-500 hover:bg-purple-600 text-white flex items-center gap-1 w-fit">
            <Check className="w-3 h-3" /> Completed
          </Badge>
        );
      case "pending_review":
      default:
        return (
          <Badge className="bg-yellow-500 hover:bg-yellow-600 text-white flex items-center gap-1 w-fit">
            <AlertCircle className="w-3 h-3" /> Pending Review
          </Badge>
        );
    }
  };

  // Filtered Bookings
  const filteredBookings = bookings.filter((b) => {
    const matchesStatus =
      statusFilter === "All" || b.approvalStatus === statusFilter;
    const matchesZone = zoneFilter === "All" || b.zoneId === zoneFilter;
    return matchesStatus && matchesZone;
  });

  if (!user || user.role !== "admin") return null;

  return (
    <div className="font-sans overflow-x-hidden">
      <div className="flex-grow mt-[2rem] md:mt-[4rem] pb-16">
        {/* Banner Title */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white pt-8 pb-14 px-4 md:px-8 rounded-b-[2rem] shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl pointer-events-none"></div>
          <div className="container mx-auto relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2">
                Manage Advertisements
              </h1>
              <p className="text-sm md:text-base text-slate-300 opacity-90 max-w-xl">
                Configure advertisement banner slots, edit listing
                categories/costs, and review submitted user campaigns.
              </p>
            </div>
            {/* <div className="flex items-center gap-2">
              <Button
                onClick={handleSeedZones}
                disabled={isSeeding}
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md flex items-center gap-2"
              >
                {isSeeding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Database className="w-4 h-4" />}
                Seed Default Zones
              </Button>
            </div> */}
          </div>
        </div>

        {/* Tabs Control */}
        <div className="container mx-auto px-4 mt-6">
          <div className="flex border-b border-slate-200 gap-6">
            <button
              onClick={() => setActiveTab("bookings")}
              className={`pb-3 font-bold text-sm transition-all relative flex items-center gap-2 ${
                activeTab === "bookings"
                  ? "text-slate-900 border-b-2 border-slate-900"
                  : "text-slate-400 hover:text-slate-600"
              }`}
            >
              Campaign Bookings
              {bookings.filter((b) => b.approvalStatus === "pending_review").length > 0 ? (
                <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold flex items-center justify-center">
                  {bookings.filter((b) => b.approvalStatus === "pending_review").length} Pending
                </span>
              ) : (
                <span className="bg-slate-100 text-slate-500 text-[10px] px-2 py-0.5 rounded-full font-semibold">
                  0 Pending
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab("zones")}
              className={`pb-3 font-bold text-sm transition-all relative flex items-center gap-2 ${
                activeTab === "zones"
                  ? "text-slate-900 border-b-2 border-slate-900"
                  : "text-slate-400 hover:text-slate-600"
              }`}
            >
              Configure Placements & Slots
            </button>
          </div>
        </div>

        {/* Tab 1: Bookings Management */}
        {activeTab === "bookings" && (
          <div className="container mx-auto px-4 mt-6 space-y-6">
            <Card className="shadow-md border-none bg-white rounded-2xl overflow-hidden">
              <CardHeader className="bg-slate-50 border-b border-slate-100 py-4 px-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <CardTitle className="text-lg font-bold text-slate-800">
                    Submitted Campaigns
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Review advertisement submissions and approve them to go live
                  </CardDescription>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-slate-400" />
                    <select
                      className="bg-white border border-slate-200 rounded-lg text-xs font-semibold py-1.5 px-3 text-slate-700 outline-none"
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                    >
                      <option value="All">All Statuses</option>
                      <option value="pending_review">Pending Review</option>
                      <option value="pending_payment">Pending Payment</option>
                      <option value="approved">Approved</option>
                      <option value="completed">Completed</option>
                      <option value="rejected">Rejected</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>

                  <select
                    className="bg-white border border-slate-200 rounded-lg text-xs font-semibold py-1.5 px-3 text-slate-700 outline-none"
                    value={zoneFilter}
                    onChange={(e) => setZoneFilter(e.target.value)}
                  >
                    <option value="All">All Placements</option>
                    {zones.map((z) => (
                      <option key={z.id} value={z.id}>
                        {z.name}
                      </option>
                    ))}
                  </select>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                {loadingBookings ? (
                  <div className="flex flex-col items-center justify-center py-20">
                    <Loader2 className="w-10 h-10 text-slate-500 animate-spin mb-4" />
                    <p className="text-sm text-slate-500">
                      Loading bookings list...
                    </p>
                  </div>
                ) : filteredBookings.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 text-center text-slate-400">
                    <ImageIcon className="w-12 h-12 text-slate-300 mb-3" />
                    <h3 className="text-base font-bold text-slate-700 mb-1">
                      No Bookings Found
                    </h3>
                    <p className="text-xs max-w-sm">
                      No campaigns match your status/placement filters.
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto rounded-xl border border-slate-200">
                    <table className="w-full text-left text-sm text-slate-700 border-collapse">
                      <thead>
                        <tr className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                          <th className="py-3 px-4">User</th>
                          <th className="py-3 px-4">Placement</th>
                          <th className="py-3 px-4">Schedule</th>
                          <th className="py-3 px-4">Ad content details</th>
                          <th className="py-3 px-4">Revenue</th>
                          <th className="py-3 px-4">Status</th>
                          <th className="py-3 px-4 text-center">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {filteredBookings.map((booking) => {
                          const zone = zones.find(
                            (z) => z.id === booking.zoneId,
                          );
                          return (
                            <tr
                              key={booking.id}
                              className="hover:bg-slate-50/50"
                            >
                              <td className="py-4 px-4">
                                <span className="font-bold text-slate-800 text-xs block">
                                  {booking.userEmail}
                                </span>
                                <span className="text-[10px] text-slate-400 block font-mono">
                                  UID: {booking.userId}
                                </span>
                              </td>
                              <td className="py-4 px-4">
                                <span className="font-bold text-slate-700 block">
                                  {zone?.name || booking.zoneId}
                                </span>
                                <span className="text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded font-mono w-fit mt-1 block">
                                  {zone?.width}x{zone?.height}
                                </span>
                              </td>
                              <td className="py-4 px-4 text-xs font-semibold text-slate-600">
                                {formatDate(booking.startDate)} to{" "}
                                {formatDate(booking.endDate)}
                                <div className="text-[10px] text-slate-400 mt-0.5">
                                  {booking.timeSlot}
                                </div>
                              </td>
                              <td className="py-4 px-4 max-w-[280px]">
                                <div className="space-y-1">
                                  <p className="text-xs font-bold text-slate-700 line-clamp-1">
                                    {booking.adContent?.text}
                                  </p>
                                  <div className="flex items-center gap-2 text-[10px] font-medium">
                                    {booking.adContent?.imageUrl && (
                                      <a
                                        href={booking.adContent.imageUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-blue-600 hover:underline flex items-center gap-0.5"
                                      >
                                        Image{" "}
                                        <ExternalLink className="w-2.5 h-2.5" />
                                      </a>
                                    )}
                                    {booking.adContent?.targetUrl && (
                                      <a
                                        href={booking.adContent.targetUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-slate-500 hover:underline flex items-center gap-0.5"
                                      >
                                        Redirect{" "}
                                        <ExternalLink className="w-2.5 h-2.5" />
                                      </a>
                                    )}
                                  </div>
                                </div>
                              </td>
                              <td className="py-4 px-4 font-bold text-slate-800">
                                ${booking.cost}
                              </td>
                              <td className="py-4 px-4">
                                <div className="space-y-1">
                                  {getStatusBadge(booking.approvalStatus)}
                                  {booking.approvalStatus === "rejected" &&
                                    booking.rejectionReason && (
                                      <p className="text-[9px] text-red-500 italic max-w-[200px]">
                                        "{booking.rejectionReason}"
                                      </p>
                                    )}
                                </div>
                              </td>
                              <td className="py-4 px-4 text-center">
                                <div className="flex items-center justify-center gap-1.5">
                                  <Button
                                    onClick={() => setPreviewBooking(booking)}
                                    size="sm"
                                    variant="outline"
                                    className="rounded-lg h-8 px-2.5 text-xs font-semibold border-slate-200 text-slate-700 hover:bg-slate-50 flex items-center gap-1"
                                    title="Preview details"
                                  >
                                    Preview
                                  </Button>
                                  {booking.approvalStatus === "pending_review" && (
                                    <>
                                      <Button
                                        onClick={() => handleApproveBooking(booking.id)}
                                        size="sm"
                                        disabled={isSubmittingReview}
                                        className="bg-green-600 hover:bg-green-700 text-white rounded-lg p-2 h-8 w-8"
                                        title="Approve"
                                      >
                                        <Check className="w-4 h-4" />
                                      </Button>
                                      <Button
                                        onClick={() => handleOpenRejectDialog(booking)}
                                        size="sm"
                                        disabled={isSubmittingReview}
                                        className="bg-red-600 hover:bg-red-700 text-white rounded-lg p-2 h-8 w-8"
                                        title="Reject with Comments"
                                      >
                                        <X className="w-4 h-4" />
                                      </Button>
                                    </>
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
        )}

        {/* Tab 2: Configure Placements & Slots */}
        {activeTab === "zones" && (
          <div className="container mx-auto px-4 mt-6 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
              {/* Placement settings column */}
              <div className="lg:col-span-1 space-y-6">
                <Card className="shadow-md border-none rounded-2xl overflow-hidden bg-white">
                  <CardHeader className="bg-slate-50 border-b border-slate-100 py-4 px-5">
                    <CardTitle className="text-lg font-bold text-slate-800">
                      Active Zones
                    </CardTitle>
                    <CardDescription className="text-xs">
                      Click a zone to manage its available booking calendar
                      slots
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 space-y-2.5">
                    {loadingZones ? (
                      <div className="flex flex-col items-center justify-center py-10">
                        <Loader2 className="w-8 h-8 text-slate-400 animate-spin mb-2" />
                        <p className="text-xs text-slate-400">
                          Loading placements...
                        </p>
                      </div>
                    ) : (
                      zones.map((zone) => (
                        <div
                          key={zone.id}
                          className={`p-3.5 rounded-xl border transition-all duration-200 flex items-center justify-between gap-2 ${
                            selectedZone?.id === zone.id
                              ? "border-slate-800 bg-slate-50 shadow-sm"
                              : "border-slate-200"
                          }`}
                        >
                          <button
                            onClick={() => {
                              handleSelectZone(zone);
                              handleOpenEditZone(zone);
                            }}
                            className="flex-grow text-left flex flex-col gap-0.5"
                          >
                            <span className="text-sm font-bold text-slate-800">
                              {zone.name}
                            </span>
                            <span className="text-[10px] text-slate-500">
                              ${zone.costPerDay}/day
                            </span>
                          </button>
                          <Button
                            onClick={() => handleOpenEditZone(zone)}
                            size="sm"
                            variant="ghost"
                            className="rounded-lg h-8 w-8 p-1 text-slate-500 hover:text-slate-800 hover:bg-slate-100"
                          >
                            <Settings className="w-4 h-4" />
                          </Button>
                        </div>
                      ))
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Slot Management column */}
              <div className="lg:col-span-2 space-y-6">
                {selectedZone ? (
                  <>
                    {/* Zone Details / Settings Panel */}
                    <Card className="shadow-md border-none rounded-2xl overflow-hidden bg-white">
                      <CardHeader className="bg-slate-50 border-b border-slate-100 py-4 px-6 flex justify-between items-center">
                        <div>
                          <CardTitle className="text-base font-bold text-slate-800">
                            Zone Specifications
                          </CardTitle>
                          <CardDescription className="text-xs">
                            Details and default ad configuration for{" "}
                            {selectedZone.name}
                          </CardDescription>
                        </div>
                        <Button
                          onClick={() => handleOpenEditZone(selectedZone)}
                          size="sm"
                          className="bg-slate-900 hover:bg-slate-950 text-white rounded-xl shadow-sm text-xs font-semibold"
                        >
                          <Settings className="w-3.5 h-3.5 mr-1" /> Edit Zone
                        </Button>
                      </CardHeader>
                      <CardContent className="p-6 space-y-4">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="space-y-1">
                            <span className="text-[10px] text-slate-400 uppercase font-semibold">
                              Cost / Day
                            </span>
                            <p className="text-sm font-bold text-slate-700">
                              ${selectedZone.costPerDay}
                            </p>
                          </div>
                          <div className="space-y-1">
                            <span className="text-[10px] text-slate-400 uppercase font-semibold">
                              Billing
                            </span>
                            <p className="text-sm font-bold text-slate-700">
                              Per Day (Flexible)
                            </p>
                          </div>
                          <div className="space-y-1">
                            <span className="text-[10px] text-slate-400 uppercase font-semibold">
                              Format Size
                            </span>
                            <p className="text-sm font-bold text-slate-700">
                              {selectedZone.width}x{selectedZone.height}
                            </p>
                          </div>
                          <div className="space-y-1">
                            <span className="text-[10px] text-slate-400 uppercase font-semibold">
                              Status
                            </span>
                            <p className="text-sm font-bold text-slate-700 capitalize">
                              {selectedZone.status || "Active"}
                            </p>
                          </div>
                        </div>

                        {selectedZone.defaultAd && (
                          <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 space-y-3">
                            <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                              Default Ad Fallback
                            </h4>
                            <p className="text-xs text-slate-600 italic">
                              "
                              {selectedZone.defaultAd.text ||
                                "No text provided"}
                              "
                            </p>
                            {selectedZone.defaultAd.imageUrl && (
                              <div className="rounded-lg overflow-hidden border border-slate-200 bg-white p-1 max-w-sm max-h-32 flex items-center justify-center">
                                <img
                                  src={selectedZone.defaultAd.imageUrl}
                                  alt="Default fallback ad"
                                  className="max-w-full max-h-28 object-contain rounded-lg"
                                />
                              </div>
                            )}
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    {/* Booked Dates Listing */}
                    <Card className="shadow-md border-none rounded-2xl overflow-hidden bg-white">
                      <CardHeader className="bg-slate-50 border-b border-slate-100 py-4 px-6">
                        <CardTitle className="text-base font-bold text-slate-800">
                          Booked Campaign Dates
                        </CardTitle>
                        <CardDescription className="text-xs">
                          Active and upcoming date reservations for this zone.
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="p-6">
                        {loadingSlots ? (
                          <div className="flex flex-col items-center justify-center py-12">
                            <Loader2 className="w-8 h-8 text-slate-400 animate-spin mb-2" />
                            <p className="text-xs text-slate-400">
                              Loading booked campaigns...
                            </p>
                          </div>
                        ) : slots.length === 0 ? (
                          <div className="text-center py-10 text-slate-400 text-xs">
                            No active or upcoming bookings for this zone.
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {slots.map((slot) => (
                              <div
                                key={slot.id}
                                className="border border-slate-100 bg-slate-50/50 rounded-xl p-4 flex justify-between items-center"
                              >
                                <div className="space-y-1.5">
                                  <div className="flex items-center gap-2">
                                    <Badge className="bg-red-500 text-white border-none font-bold text-[9px] px-1.5 py-0.2">
                                      Booked
                                    </Badge>
                                    <span className="text-[10px] text-slate-500 font-medium">
                                      By: {slot.userEmail}
                                    </span>
                                  </div>
                                  <p className="text-xs font-bold text-slate-700">
                                    {formatDate(slot.startDate)} to{" "}
                                    {formatDate(slot.endDate)}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </>
                ) : (
                  <div className="text-center py-12 text-slate-400 text-sm">
                    Select a zone to manage its settings.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Zone edit modal config */}
      {editZoneItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity">
          <Card className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border-none overflow-hidden animate-in fade-in zoom-in duration-200">
            <CardHeader className="bg-slate-900 text-white p-5">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl font-bold">
                    Edit Zone Configuration
                  </CardTitle>
                  <CardDescription className="text-xs text-slate-300 mt-1">
                    Placement ID: {editZoneItem.id}
                  </CardDescription>
                </div>
                <button
                  onClick={handleCloseEditZone}
                  className="text-white/80 hover:text-white text-xl"
                >
                  ✕
                </button>
              </div>
            </CardHeader>
            <form onSubmit={handleZoneUpdateSubmit}>
              <CardContent className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600 block">
                    Placement Display Name
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-slate-800 text-slate-700"
                    value={editZoneForm.name}
                    onChange={(e) =>
                      setEditZoneForm({ ...editZoneForm, name: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600 block">
                    Cost Per Day ($)
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-slate-800 text-slate-700"
                    value={editZoneForm.costPerDay}
                    onChange={(e) =>
                      setEditZoneForm({
                        ...editZoneForm,
                        costPerDay: parseInt(e.target.value) || 0,
                      })
                    }
                  />
                  <p className="text-[10px] text-slate-400">
                    Investors will be charged this rate × number of days they
                    select.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600 block">
                    Active Status
                  </label>
                  <select
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-slate-800 text-slate-700 bg-white"
                    value={editZoneForm.status}
                    onChange={(e) =>
                      setEditZoneForm({
                        ...editZoneForm,
                        status: e.target.value,
                      })
                    }
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>

                {/* Default Fallback Sub-fields */}
                <div className="border-t border-slate-100 pt-4 space-y-3">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Configure Fallback Ad Details
                  </h4>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600 block">
                      Fallback Text
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Grow your reach with Investate India"
                      className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-slate-800 text-slate-700"
                      value={editZoneForm.defaultAd.text}
                      onChange={(e) =>
                        setEditZoneForm({
                          ...editZoneForm,
                          defaultAd: {
                            ...editZoneForm.defaultAd,
                            text: e.target.value,
                          },
                        })
                      }
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600 block">
                      Fallback Banner Image
                    </label>
                    {editZoneForm.defaultAd.imageUrl ? (
                      <div className="space-y-2">
                        <div className="relative rounded-xl overflow-hidden bg-slate-50 border border-slate-200 aspect-[16/9] max-h-40 flex items-center justify-center p-2">
                          <img
                            src={editZoneForm.defaultAd.imageUrl}
                            alt="Fallback Preview"
                            className="w-full h-full object-contain rounded-lg"
                          />
                        </div>
                        <div className="flex gap-2">
                          <label className="relative flex-grow flex items-center justify-center px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer shadow-sm">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleImageUpload}
                              disabled={isUploadingImage}
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                            {isUploadingImage ? "Uploading..." : "Change Image"}
                          </label>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={handleRemoveFallbackImage}
                            className="rounded-xl text-xs font-bold border-red-200 text-red-500 hover:bg-red-50"
                          >
                            Remove
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="relative border-2 border-dashed border-slate-200 hover:border-slate-800 rounded-xl p-5 transition-all cursor-pointer group bg-slate-50/50 flex flex-col items-center justify-center min-h-[120px]">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          disabled={isUploadingImage}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        />
                        {isUploadingImage ? (
                          <>
                            <Loader2 className="w-6 h-6 animate-spin text-[#0b264f] mb-1.5" />
                            <span className="text-xs font-medium text-slate-500">
                              Uploading... {uploadProgress}%
                            </span>
                          </>
                        ) : (
                          <>
                            <ImageIcon className="w-6 h-6 text-slate-400 group-hover:text-slate-600 transition-colors mb-1.5" />
                            <span className="text-xs font-bold text-slate-600 group-hover:text-slate-800 transition-colors">
                              Upload Fallback Image
                            </span>
                            <span className="text-[9px] text-slate-400 mt-0.5">
                              Click to browse file
                            </span>
                          </>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600 block">
                      Fallback Redirect Target URL
                    </label>
                    <input
                      type="url"
                      placeholder="https://investateindia.com"
                      className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-slate-800 text-slate-700"
                      value={editZoneForm.defaultAd.targetUrl}
                      onChange={(e) =>
                        setEditZoneForm({
                          ...editZoneForm,
                          defaultAd: {
                            ...editZoneForm.defaultAd,
                            targetUrl: e.target.value,
                          },
                        })
                      }
                    />
                  </div>
                </div>
              </CardContent>
              <div className="bg-slate-50 border-t border-slate-100 p-4 px-6 flex justify-end gap-3 rounded-b-2xl">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCloseEditZone}
                  className="rounded-xl"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isUpdatingZone}
                  className="bg-slate-900 hover:bg-slate-950 text-white rounded-xl shadow-md min-w-[120px]"
                >
                  {isUpdatingZone ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* Ad Campaign Preview Modal */}
      {previewBooking && (() => {
        const zone = zones.find((z) => z.id === previewBooking.zoneId);
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity">
            <Card className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border-none overflow-hidden animate-in fade-in zoom-in duration-200">
              <CardHeader className="bg-slate-900 text-white p-5">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl font-bold flex items-center gap-2">
                      <ImageIcon className="w-5 h-5 text-blue-400" /> Ad Campaign Details
                    </CardTitle>
                    <CardDescription className="text-xs text-slate-300 mt-1">
                      Campaign ID: {previewBooking.id}
                    </CardDescription>
                  </div>
                  <button
                    onClick={() => setPreviewBooking(null)}
                    className="text-white/80 hover:text-white text-xl"
                  >
                    ✕
                  </button>
                </div>
              </CardHeader>
              
              <CardContent className="p-6 space-y-6 max-h-[70vh] overflow-y-auto text-slate-700">
                {/* 1. Placement & User Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4 border-b border-slate-100">
                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Placement Zone</span>
                    <p className="text-sm font-bold text-slate-800">{zone?.name || previewBooking.zoneId}</p>
                    <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono font-semibold">
                      Format: {zone?.width}x{zone?.height}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Submitted By</span>
                    <p className="text-sm font-bold text-slate-800">{previewBooking.userEmail}</p>
                    <span className="text-[10px] text-slate-400 block font-mono">UID: {previewBooking.userId}</span>
                  </div>
                </div>

                {/* 2. Schedule & Financials */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pb-4 border-b border-slate-100">
                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Campaign Schedule</span>
                    <p className="text-xs font-semibold text-slate-700">
                      {formatDate(previewBooking.startDate)} to {formatDate(previewBooking.endDate)}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Time Slot</span>
                    <p className="text-xs font-semibold text-slate-700 capitalize">{previewBooking.timeSlot || 'All Day'}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Total Revenue</span>
                    <p className="text-base font-extrabold text-slate-900">${previewBooking.cost}</p>
                  </div>
                </div>

                {/* 3. Status Information */}
                <div className="pb-4 border-b border-slate-100 space-y-1.5">
                  <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Approval Status</span>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(previewBooking.approvalStatus)}
                  </div>
                  {previewBooking.approvalStatus === "rejected" && previewBooking.rejectionReason && (
                    <div className="bg-red-50 border border-red-100 rounded-xl p-3.5 mt-2">
                      <p className="text-[11px] font-bold text-red-700 uppercase tracking-wide mb-1">Rejection Feedback</p>
                      <p className="text-xs text-red-600 italic">"{previewBooking.rejectionReason}"</p>
                    </div>
                  )}
                </div>

                {/* 4. Advertisement Creative (Ad Text & Banner Preview) */}
                <div className="space-y-3.5">
                  <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Submitted Creative Details</span>
                  
                  <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 space-y-3">
                    <div className="space-y-1">
                      <span className="text-[9px] text-slate-400 uppercase font-bold block">Ad Description Text</span>
                      <p className="text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg p-2.5">
                        {previewBooking.adContent?.text || <span className="text-slate-400 italic">No text provided</span>}
                      </p>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[9px] text-slate-400 uppercase font-bold block">Target Redirect URL</span>
                      {previewBooking.adContent?.targetUrl ? (
                        <a
                          href={previewBooking.adContent.targetUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs text-blue-600 hover:underline flex items-center gap-1 font-semibold"
                        >
                          {previewBooking.adContent.targetUrl} <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      ) : (
                        <p className="text-xs text-slate-400 italic">No redirect URL configured</p>
                      )}
                    </div>
                  </div>

                  {previewBooking.adContent?.imageUrl && (
                    <div className="space-y-1.5">
                      <span className="text-[9px] text-slate-400 uppercase font-bold block">Banner Image Preview</span>
                      <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-50 p-2 max-w-full flex items-center justify-center min-h-[120px]">
                        <img
                          src={previewBooking.adContent.imageUrl}
                          alt="Campaign Creative Preview"
                          className="max-w-full max-h-60 object-contain rounded-lg shadow-sm"
                          onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80'; }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>

              <div className="bg-slate-50 border-t border-slate-100 p-4 px-6 flex justify-between items-center rounded-b-2xl">
                <div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setPreviewBooking(null)}
                    className="rounded-xl"
                  >
                    Close Preview
                  </Button>
                </div>

                {previewBooking.approvalStatus === "pending_review" && (
                  <div className="flex gap-2">
                    <Button
                      onClick={() => {
                        handleOpenRejectDialog(previewBooking);
                        setPreviewBooking(null);
                      }}
                      disabled={isSubmittingReview}
                      className="bg-red-600 hover:bg-red-700 text-white rounded-xl shadow-md px-4"
                    >
                      <X className="w-4 h-4 mr-1.5" /> Reject
                    </Button>
                    <Button
                      onClick={async () => {
                        await handleApproveBooking(previewBooking.id);
                        setPreviewBooking(null);
                      }}
                      disabled={isSubmittingReview}
                      className="bg-green-600 hover:bg-green-700 text-white rounded-xl shadow-md px-4"
                    >
                      <Check className="w-4 h-4 mr-1.5" /> Approve
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          </div>
        );
      })()}
      
      {/* Reject Reason input dialog */}
      {rejectingBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity">
          <Card className="w-full max-w-md bg-white rounded-2xl shadow-2xl border-none overflow-hidden animate-in fade-in zoom-in duration-200">
            <CardHeader className="bg-red-600 text-white p-5">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg font-bold">
                    Reject Campaign Booking
                  </CardTitle>
                  <CardDescription className="text-xs text-red-100/80 mt-1">
                    Provide feedback so the builder can rectify and resubmit
                  </CardDescription>
                </div>
                <button
                  onClick={handleCloseRejectDialog}
                  className="text-white/80 hover:text-white text-xl"
                >
                  ✕
                </button>
              </div>
            </CardHeader>
            <form onSubmit={handleRejectBookingSubmit}>
              <CardContent className="p-6 space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600 block">
                    Rejection Feedback/Reason{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    required
                    rows="4"
                    placeholder="Provide specific reasons (e.g. upload high-res image, fix text formatting, target link is dead)..."
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-red-500 text-slate-700 placeholder-slate-400 resize-none"
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                  />
                </div>
              </CardContent>
              <div className="bg-slate-50 border-t border-slate-100 p-4 px-6 flex justify-end gap-3 rounded-b-2xl">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCloseRejectDialog}
                  className="rounded-xl"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmittingReview}
                  className="bg-red-600 hover:bg-red-700 text-white rounded-xl shadow-md min-w-[120px]"
                >
                  {isSubmittingReview ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    "Confirm Rejection"
                  )}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
