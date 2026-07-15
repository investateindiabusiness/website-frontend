"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  User,
  MapPin,
  Wallet,
  Send,
  X,
  Loader2,
  Building2,
  Users2,
  Globe,
  ChevronLeft,
  ChevronRight,
  Info,
  CheckCircle,
  Filter,
  MessageSquare,
  AlertTriangle,
  Clock,
} from "lucide-react";
import { fetchSPDirectory, sendSPOutreachMessage } from "@/api";
import { toast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/AuthContext";

const INVESTOR_TYPE_LABELS = {
  individual: { label: "Individual", color: "bg-blue-100 text-blue-800 border-blue-200" },
  nri: { label: "NRI", color: "bg-purple-100 text-purple-800 border-purple-200" },
  company: { label: "Company", color: "bg-amber-100 text-amber-800 border-amber-200" },
  builder: { label: "Builder", color: "bg-green-100 text-green-800 border-green-200" },
};

const formatCrores = (val) => {
  const n = Number(val);
  if (!n || isNaN(n)) return "—";
  if (n >= 100) return `$${(n / 100).toFixed(1)} Cr`;
  return `$${n}L`;
};

function ComposeMessageModal({ recipient, onClose, onSent }) {
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!subject.trim() || !body.trim()) {
      toast({ title: "Incomplete", description: "Please fill in subject and message.", variant: "destructive" });
      return;
    }
    try {
      setSending(true);
      await sendSPOutreachMessage({
        recipientId: recipient.id,
        subject: subject.trim(),
        body: body.trim(),
      });
      toast({
        title: "Message Submitted",
        description: "Your message has been sent to admin for review. You'll be notified once it's delivered.",
      });
      onSent?.();
      onClose();
    } catch (err) {
      toast({
        title: "Failed to Send",
        description: err?.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Backdrop */}
        <motion.div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        />

        {/* Modal */}
        <motion.div
          className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden"
          initial={{ scale: 0.92, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.92, opacity: 0, y: 20 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-800 to-slate-900 text-white px-7 py-5 flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-widest mb-1">Compose Message</p>
              <h2 className="text-lg font-bold">
                To:{" "}
                <span className="text-orange-400">
                  {recipient.fullName || recipient.name}
                </span>
              </h2>
              {recipient.city && (
                <p className="text-xs text-slate-400 mt-0.5">{recipient.city}, {recipient.state}</p>
              )}
            </div>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Privacy Notice */}
          <div className="mx-6 mt-5 p-3 bg-blue-50 border border-blue-100 rounded-xl flex gap-3 items-start">
            <Info className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-blue-700 leading-relaxed">
              Your message will be reviewed by our admin team before delivery. Direct contact information is not shared to protect platform privacy.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSend} className="px-6 py-5 space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Subject <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. Legal Advisory Services for NRI Property"
                maxLength={150}
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400/50 focus:border-orange-400 transition-all placeholder-slate-400"
              />
              <p className="text-right text-[11px] text-slate-400 mt-1">{subject.length}/150</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Message <span className="text-red-500">*</span>
              </label>
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Introduce yourself, your services, and how you can help this investor/builder..."
                rows={7}
                maxLength={3000}
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400/50 focus:border-orange-400 transition-all placeholder-slate-400 resize-none"
              />
              <p className="text-right text-[11px] text-slate-400 mt-1">{body.length}/3000</p>
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1 py-6 rounded-xl text-slate-600"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={sending}
                className="flex-1 bg-[#D48035] hover:bg-[#b06725] text-white py-6 rounded-xl font-bold flex items-center justify-center gap-2"
              >
                {sending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
                {sending ? "Sending…" : "Submit for Review"}
              </Button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

const getPreferredLocations = (locations) => {
  if (!locations) return [];
  if (Array.isArray(locations)) {
    return locations
      .map((loc) => {
        if (typeof loc === "string") return loc;
        if (loc && typeof loc === "object") return loc.label || loc.value || "";
        return "";
      })
      .filter(Boolean);
  }
  if (typeof locations === "string") {
    const trimmed = locations.trim();
    if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
      try {
        const parsed = JSON.parse(trimmed);
        return getPreferredLocations(parsed);
      } catch (e) {
        // Fall back
      }
    }
    return trimmed.split(",").map((s) => s.trim()).filter(Boolean);
  }
  return [];
};

function DirectoryCard({ person, onMessage, index }) {
  const router = useRouter();
  const typeInfo =
    INVESTOR_TYPE_LABELS[person.investorType] ||
    INVESTOR_TYPE_LABELS[person.role] ||
    { label: person.role || "User", color: "bg-gray-100 text-gray-700 border-gray-200" };

  const initials = (person.fullName || person.name || "?")
    .split(" ")
    .filter(Boolean)
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const locations = getPreferredLocations(person.preferredLocations);

  const avatarColors = [
    "from-blue-500 to-indigo-600",
    "from-purple-500 to-pink-500",
    "from-amber-500 to-orange-500",
    "from-green-500 to-teal-600",
    "from-rose-500 to-red-600",
    "from-cyan-500 to-blue-600",
  ];
  const colorClass = avatarColors[index % avatarColors.length];

  // Helper to determine CTA button state and action
  const getCtaDetails = () => {
    switch (person.outreachStatus) {
      case "pending_review":
        return {
          label: "Awaiting Review",
          disabled: true,
          icon: Clock,
          className: "bg-amber-100 text-amber-700 border border-amber-200 cursor-not-allowed",
          onClick: () => {}
        };
      case "blocked":
        return {
          label: "Blocked by Admin",
          disabled: true,
          icon: AlertTriangle,
          className: "bg-red-100 text-red-700 border border-red-200 cursor-not-allowed",
          onClick: () => {}
        };
      case "delivered":
        if (!person.hasRecipientReplied) {
          return {
            label: "Awaiting Response",
            disabled: true,
            icon: Clock,
            className: "bg-blue-50 text-blue-600 border border-blue-100 cursor-not-allowed",
            onClick: () => {}
          };
        } else {
          return {
            label: "Continue Chat",
            disabled: false,
            icon: MessageSquare,
            className: "bg-green-600 hover:bg-green-700 text-white shadow-md hover:-translate-y-0.5",
            onClick: () => {
              router.push("/service-provider/outreach");
            }
          };
        }
      default:
        return {
          label: "Send Message",
          disabled: false,
          icon: Send,
          className: "bg-slate-900 hover:bg-[#D48035] text-white hover:shadow-md hover:-translate-y-0.5",
          onClick: () => onMessage(person)
        };
    }
  };

  const cta = getCtaDetails();
  const Icon = cta.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03, duration: 0.4 }}
      className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 overflow-hidden group"
    >
      {/* Top accent bar */}
      <div className={`h-1 bg-gradient-to-r ${colorClass}`} />

      <div className="p-5">
        {/* Header */}
        <div className="flex items-start gap-4 mb-4">
          {/* Avatar */}
          <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${colorClass} flex items-center justify-center text-white font-bold text-base flex-shrink-0 shadow-md`}>
            {initials}
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-slate-900 text-base leading-tight truncate">
              {person.fullName || person.name}
            </h3>
            {person.companyName && (
              <p className="text-xs text-slate-500 truncate mt-0.5">{person.companyName}</p>
            )}
            <div className="mt-2 flex flex-wrap gap-1.5">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${typeInfo.color}`}>
                {typeInfo.label}
              </span>
              {person.role === "builder" && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border bg-green-50 text-green-700 border-green-200">
                  Builder
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="space-y-2 mb-4">
          {(person.city || person.state) && (
            <div className="flex items-center gap-2 text-xs text-slate-600">
              <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
              <span>
                {[person.city, person.state].filter(Boolean).join(", ")}
              </span>
            </div>
          )}

          {person.totalInvestmentCapacity && (
            <div className="flex items-center gap-2 text-xs text-slate-600">
              <Wallet className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
              <span>
                Investment Capacity:{" "}
                <span className="font-semibold text-slate-800">
                  {formatCrores(person.totalInvestmentCapacity)}
                </span>
              </span>
            </div>
          )}

          {locations.length > 0 && (
            <div className="flex items-start gap-2 text-xs text-slate-600">
              <Globe className="w-3.5 h-3.5 text-slate-400 flex-shrink-0 mt-0.5" />
              <span className="leading-relaxed">
                {locations.slice(0, 3).join(", ")}
                {locations.length > 3 && (
                  <span className="text-slate-400"> +{locations.length - 3} more</span>
                )}
              </span>
            </div>
          )}

          {person.investmentFocus && (
            <div className="flex items-center gap-2 text-xs text-slate-600">
              <Building2 className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
              <span className="capitalize">{person.investmentFocus}</span>
            </div>
          )}
        </div>

        {/* Privacy note */}
        <div className="flex items-center gap-1.5 mb-4 p-2 bg-slate-50 rounded-lg">
          <Info className="w-3 h-3 text-slate-400" />
          <p className="text-[10px] text-slate-400">Contact info hidden for privacy</p>
        </div>

        {/* CTA */}
        <button
          onClick={cta.onClick}
          disabled={cta.disabled}
          className={`w-full text-sm font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all duration-200 ${cta.className}`}
        >
          <Icon className="w-4 h-4" />
          {cta.label}
        </button>
      </div>
    </motion.div>
  );
}

export default function SPDirectoryPage() {
  const { user } = useAuth();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ pages: 1, total: 0 });
  const [selectedRecipient, setSelectedRecipient] = useState(null);

  const loadDirectory = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        page,
        limit: 12,
        role: roleFilter,
        ...(search.trim() && { search: search.trim() }),
        ...(typeFilter !== "all" && { type: typeFilter }),
      };
      const res = await fetchSPDirectory(params);
      setData(res.data || []);
      setPagination(res.pagination || { pages: 1, total: 0 });
    } catch (err) {
      toast({
        title: "Failed to load directory",
        description: err?.message || "Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [page, roleFilter, typeFilter, search]);

  useEffect(() => {
    const t = setTimeout(() => {
      setPage(1);
    }, 400);
    return () => clearTimeout(t);
  }, [search, roleFilter, typeFilter]);

  useEffect(() => {
    loadDirectory();
  }, [loadDirectory]);

  const roleOptions = [
    { value: "all", label: "All Users", icon: Globe },
    { value: "investor", label: "Investors", icon: Users2 },
    { value: "builder", label: "Builders", icon: Building2 },
  ];

  const typeOptions = [
    { value: "all", label: "All Types" },
    { value: "individual", label: "Individual" },
    { value: "nri", label: "NRI" },
    { value: "company", label: "Company" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-950 text-white px-4 md:px-8 pt-8 pb-14 rounded-b-[2.5rem] shadow-xl relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-orange-400 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-400 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2" />
        </div>
        <div className="container mx-auto relative z-10">
          <Badge className="bg-orange-500/25 text-orange-200 border-none mb-3 backdrop-blur-sm px-3 py-1">
            <Users2 className="w-3.5 h-3.5 mr-1.5" /> Member Directory
          </Badge>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Investor & Builder Directory</h1>
          <p className="text-slate-300 text-sm max-w-xl">
            Browse verified investors and builders on the platform. Send professional messages — reviewed by admin before delivery.
          </p>

          {/* Search bar */}
          <div className="mt-6 relative max-w-lg">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, city, company…"
              className="w-full bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-white/50 rounded-2xl pl-12 pr-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400/60 transition-all"
            />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="container mx-auto px-4 -mt-5 relative z-20">
        <div className="bg-white rounded-2xl shadow-md border border-slate-100 p-4 flex flex-wrap gap-3 items-center">
          {/* Role tabs */}
          <div className="flex flex-wrap gap-2">
            {roleOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => { setRoleFilter(opt.value); setPage(1); }}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                  roleFilter === opt.value
                    ? "bg-slate-900 text-white shadow"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                <opt.icon className="w-4 h-4" />
                {opt.label}
              </button>
            ))}
          </div>

          <div className="w-px h-7 bg-slate-200 hidden sm:block" />

          {/* Type filter — only relevant for investors */}
          {roleFilter !== "builder" && (
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-400" />
              <select
                value={typeFilter}
                onChange={(e) => { setTypeFilter(e.target.value); setPage(1); }}
                className="text-sm border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400/50 text-slate-700 bg-white"
              >
                {typeOptions.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
          )}

          <div className="ml-auto text-sm text-slate-400 font-medium">
            {pagination.total} {pagination.total === 1 ? "member" : "members"} found
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <Loader2 className="w-10 h-10 text-orange-500 animate-spin" />
            <p className="text-slate-400 text-sm">Loading directory…</p>
          </div>
        ) : data.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center">
              <Users2 className="w-8 h-8 text-slate-300" />
            </div>
            <h3 className="text-lg font-bold text-slate-700">No members found</h3>
            <p className="text-slate-400 text-sm max-w-sm">
              Try adjusting your search or filters to find more members.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {data.map((person, i) => (
                <DirectoryCard
                  key={person.id}
                  person={person}
                  index={i}
                  onMessage={setSelectedRecipient}
                />
              ))}
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="flex items-center justify-center gap-4 mt-10">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  className="w-10 h-10 rounded-full border border-slate-200 bg-white hover:bg-slate-50 flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <span className="text-sm font-semibold text-slate-600">
                  Page {page} of {pagination.pages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(pagination.pages, p + 1))}
                  disabled={page >= pagination.pages}
                  className="w-10 h-10 rounded-full border border-slate-200 bg-white hover:bg-slate-50 flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Compose Modal */}
      {selectedRecipient && (
        <ComposeMessageModal
          recipient={selectedRecipient}
          onClose={() => setSelectedRecipient(null)}
          onSent={loadDirectory}
        />
      )}
    </div>
  );
}
