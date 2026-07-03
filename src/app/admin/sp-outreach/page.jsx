"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Search,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  ChevronRight,
  Loader2,
  X,
  MessageSquare,
  Reply,
  RefreshCw,
  Shield,
  Filter,
  AlertTriangle,
  Send,
} from "lucide-react";
import {
  adminFetchSPOutreachMessages,
  adminReviewSPOutreachMessage,
  adminFetchOutreachThread,
  adminBlockOutreachConversation,
} from "@/api";
import { toast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/AuthContext";
import { useRouter } from "next/navigation";

const STATUS_CONFIG = {
  pending_review: {
    label: "Pending Review",
    color: "bg-amber-100 text-amber-800 border-amber-200",
    dot: "bg-amber-500",
    icon: Clock,
  },
  delivered: {
    label: "Delivered",
    color: "bg-green-100 text-green-800 border-green-200",
    dot: "bg-green-500",
    icon: CheckCircle,
  },
  rejected: {
    label: "Rejected",
    color: "bg-red-100 text-red-800 border-red-200",
    dot: "bg-red-500",
    icon: XCircle,
  },
};

const timeAgo = (iso) => {
  if (!iso) return "";
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 60) return "Just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 2592000) return `${Math.floor(diff / 86400)}d ago`;
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
};

// ─── Thread Detail Modal ───────────────────────────────────────
function ThreadModal({ message, onClose, onAction }) {
  const [thread, setThread] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviewing, setReviewing] = useState(false);
  const [adminNote, setAdminNote] = useState("");
  const [blockReason, setBlockReason] = useState("");
  const [blocking, setBlocking] = useState(false);

  const loadThread = useCallback(async () => {
    try {
      setLoading(true);
      const res = await adminFetchOutreachThread(message.id);
      setThread(res);
    } catch {
      toast({ title: "Error", description: "Failed to load thread.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }, [message.id]);

  useEffect(() => {
    loadThread();
  }, [loadThread]);

  const handleReview = async (act) => {
    if (act === "reject" && !adminNote.trim()) {
      toast({ title: "Reason Required", description: "Please provide a reason for rejection.", variant: "destructive" });
      return;
    }
    try {
      setReviewing(true);
      await adminReviewSPOutreachMessage(message.id, act, adminNote);
      toast({
        title: act === "accept" ? "Message Approved & Delivered ✓" : "Message Rejected",
        description:
          act === "accept"
            ? "The message has been delivered to the recipient."
            : "The SP has been notified of the rejection.",
      });
      onAction?.();
      onClose();
    } catch (err) {
      toast({ title: "Error", description: err?.message || "Action failed.", variant: "destructive" });
    } finally {
      setReviewing(false);
    }
  };

  const handleBlockToggle = async (shouldBlock) => {
    if (shouldBlock && !blockReason.trim()) {
      toast({ title: "Reason Required", description: "Please enter a reason to block this conversation.", variant: "destructive" });
      return;
    }
    try {
      setBlocking(true);
      await adminBlockOutreachConversation(message.id, shouldBlock, blockReason);
      toast({
        title: shouldBlock ? "Conversation Blocked 🚫" : "Conversation Reactivated ✓",
        description: shouldBlock ? "Both parties have been notified." : "Communication is restored.",
      });
      onAction?.();
      onClose();
    } catch (err) {
      toast({ title: "Error", description: err?.message || "Block action failed.", variant: "destructive" });
    } finally {
      setBlocking(false);
    }
  };

  const msg = thread?.message || message;
  const replies = thread?.replies || [];
  const isPending = msg.status === "pending_review";
  const isBlocked = msg.status === "blocked";
  const isDelivered = msg.status === "delivered";

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

        <motion.div
          className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden"
          initial={{ scale: 0.92, y: 20, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.92, y: 20, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-800 to-slate-900 text-white px-7 py-5 flex-shrink-0">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <p className="text-[11px] uppercase tracking-widest text-slate-400 mb-1">
                  <Shield className="w-3 h-3 inline mr-1" />
                  Admin Review
                </p>
                <h2 className="font-bold text-lg leading-tight truncate">{msg.subject}</h2>
                <p className="text-slate-400 text-xs mt-1">
                  From: <span className="text-white">{msg.spName}</span>
                  {msg.spCompany && <span className="text-slate-400"> ({msg.spCompany})</span>}
                  {" → "}
                  <span className="text-white">{msg.recipientName}</span>{" "}
                  <span className="text-slate-400 capitalize">({msg.recipientRole})</span>
                  {" · "}{timeAgo(msg.createdAt)}
                </p>
              </div>
              <button
                onClick={onClose}
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors flex-shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="mt-3">
              <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${STATUS_CONFIG[msg.status]?.color}`}>
                {msg.status === "blocked" ? "Stopped by Admin" : STATUS_CONFIG[msg.status]?.label}
              </span>
            </div>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto px-7 py-5 space-y-5">
            {loading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
              </div>
            ) : (
              <>
                {/* Original Message */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Send className="w-4 h-4 text-slate-400" />
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Original Outreach (from SP)</p>
                  </div>
                  <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                    <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">{msg.body}</p>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1.5">{timeAgo(msg.createdAt)}</p>
                </div>

                {/* Replies (if any) */}
                {replies.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Reply className="w-4 h-4 text-slate-400" />
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        Conversation Thread ({replies.length})
                      </p>
                    </div>
                    <div className="space-y-4">
                      {replies.map((reply, i) => {
                        const isSP = reply.senderRole === "serviceProvider";
                        return (
                          <div
                            key={reply.id}
                            className={`rounded-2xl p-4 border max-w-[85%] ${
                              isSP
                                ? "bg-blue-50 border-blue-100 ml-auto"
                                : "bg-green-50 border-green-100"
                            }`}
                          >
                            <div className="flex items-center gap-2 mb-2">
                              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                                isSP ? "bg-blue-200 text-blue-800" : "bg-green-200 text-green-800"
                              }`}>
                                {isSP ? "SP" : "R"}
                              </div>
                              <div>
                                <p className="text-xs font-semibold text-slate-800">
                                  {reply.senderName} <span className="text-[10px] text-slate-400 font-normal">({isSP ? "Service Provider" : "Recipient"})</span>
                                </p>
                                <p className="text-[9px] text-slate-400">{timeAgo(reply.createdAt)}</p>
                              </div>
                            </div>
                            <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">{reply.body}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Review Actions (Pending status) */}
                {isPending && (
                  <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <AlertTriangle className="w-4 h-4 text-amber-600" />
                      <p className="text-sm font-semibold text-amber-800">Review Required</p>
                    </div>
                    <p className="text-xs text-amber-700 mb-4 leading-relaxed">
                      Review the message above and decide if it's appropriate to deliver to{" "}
                      <strong>{msg.recipientName}</strong>. Ensure the message is professional, relevant, and does not violate privacy policies.
                    </p>

                    <textarea
                      value={adminNote}
                      onChange={(e) => setAdminNote(e.target.value)}
                      placeholder="Admin note (required if rejecting, optional if accepting)…"
                      rows={3}
                      className="w-full border border-amber-200 bg-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/50 transition-all placeholder-slate-400 resize-none mb-4"
                    />

                    <div className="flex gap-3">
                      <Button
                        onClick={() => handleReview("reject")}
                        disabled={reviewing}
                        variant="outline"
                        className="flex-1 border-red-200 text-red-600 hover:bg-red-50 py-5 rounded-xl font-bold"
                      >
                        {reviewing ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />}
                        <span className="ml-2">Reject</span>
                      </Button>
                      <Button
                        onClick={() => handleReview("accept")}
                        disabled={reviewing}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white py-5 rounded-xl font-bold"
                      >
                        {reviewing ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                        <span className="ml-2">Approve & Deliver</span>
                      </Button>
                    </div>
                  </div>
                )}

                {/* Block/Unblock Controls (Active or Blocked statuses) */}
                {!isPending && (isDelivered || isBlocked) && (
                  <div className={`border rounded-2xl p-5 ${isBlocked ? "bg-red-50 border-red-100" : "bg-slate-50 border-slate-100"}`}>
                    <div className="flex items-center gap-2 mb-3">
                      <Shield className={`w-4 h-4 ${isBlocked ? "text-red-600" : "text-slate-600"}`} />
                      <p className={`text-sm font-semibold ${isBlocked ? "text-red-800" : "text-slate-800"}`}>
                        {isBlocked ? "Reactivate Communication" : "Stop / Block Conversation"}
                      </p>
                    </div>
                    {isBlocked ? (
                      <div>
                        <p className="text-xs text-red-700 mb-4 leading-relaxed">
                          This conversation is blocked. Reason: <strong>{msg.adminNote}</strong>. Reactivating it will let the SP and recipient resume replying back and forth.
                        </p>
                        <Button
                          onClick={() => handleBlockToggle(false)}
                          disabled={blocking}
                          className="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-xl font-bold"
                        >
                          {blocking ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4 mr-1.5" />}
                          Reactivate Conversation
                        </Button>
                      </div>
                    ) : (
                      <div>
                        <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                          If this connection becomes unhealthy, contains spam, or violates rules, you can block it. Both parties will be notified and replies will be blocked.
                        </p>
                        <textarea
                          value={blockReason}
                          onChange={(e) => setBlockReason(e.target.value)}
                          placeholder="Provide a reason for stopping this conversation (sent to users)…"
                          rows={2}
                          className="w-full border border-slate-200 bg-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-400/50 transition-all placeholder-slate-400 resize-none mb-3"
                        />
                        <Button
                          onClick={() => handleBlockToggle(true)}
                          disabled={blocking || !blockReason.trim()}
                          className="w-full bg-red-600 hover:bg-red-700 text-white py-4 rounded-xl font-bold"
                        >
                          {blocking ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4 mr-1.5" />}
                          Block Conversation
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ─── Message Row ────────────────────────────────────────────────
function MessageRow({ msg, index, onClick }) {
  const cfg = STATUS_CONFIG[msg.status] || STATUS_CONFIG.pending_review;
  const Icon = cfg.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.035 }}
      onClick={() => onClick(msg)}
      className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer p-5 flex items-start gap-4 group"
    >
      {/* Status indicator */}
      <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${cfg.dot}`} />

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-4 mb-1">
          <div className="min-w-0">
            <p className="font-bold text-slate-900 text-sm truncate">{msg.subject}</p>
            <p className="text-xs text-slate-500 mt-0.5">
              <span className="text-slate-700 font-medium">{msg.spName}</span>
              {msg.spCompany && <span className="text-slate-400"> ({msg.spCompany})</span>}
              {" → "}
              <span className="text-slate-700 font-medium">{msg.recipientName}</span>{" "}
              <span className="text-slate-400 capitalize">({msg.recipientRole})</span>
            </p>
          </div>
          <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${cfg.color}`}>
              {cfg.label}
            </span>
            <span className="text-[10px] text-slate-400">{timeAgo(msg.createdAt)}</span>
          </div>
        </div>

        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mt-1.5">{msg.body}</p>

        <div className="flex items-center gap-1 mt-2 text-xs text-slate-400 group-hover:text-slate-600 transition-colors">
          <Eye className="w-3 h-3" />
          <span>Review thread</span>
          <ChevronRight className="w-3 h-3" />
        </div>
      </div>
    </motion.div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────
export default function AdminSPOutreach() {
  const { user } = useAuth();
  const router = useRouter();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("pending_review");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ pages: 1, total: 0 });

  const loadMessages = useCallback(async () => {
    try {
      setLoading(true);
      const res = await adminFetchSPOutreachMessages({
        status: filter,
        page,
        limit: 20,
        ...(search.trim() && { search: search.trim() }),
      });
      setMessages(res.data || []);
      setPagination(res.pagination || { pages: 1, total: 0 });
    } catch (err) {
      toast({ title: "Error loading messages", description: err?.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }, [filter, page, search]);

  useEffect(() => {
    const t = setTimeout(() => { setPage(1); }, 400);
    return () => clearTimeout(t);
  }, [search, filter]);

  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  const filterTabs = [
    { value: "pending_review", label: "Pending Review", badge: "amber" },
    { value: "delivered", label: "Delivered", badge: "green" },
    { value: "rejected", label: "Rejected", badge: "red" },
    { value: "all", label: "All Messages", badge: "slate" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-950 text-white px-4 md:px-8 pt-8 pb-16 rounded-b-[2.5rem] shadow-xl relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-orange-400 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-400 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2" />
        </div>
        <div className="container mx-auto relative z-10">
          <Badge className="bg-orange-500/25 text-orange-200 border-none mb-3 backdrop-blur-sm px-3 py-1">
            <Shield className="w-3.5 h-3.5 mr-1.5" /> Admin Moderation
          </Badge>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">SP Outreach Messages</h1>
          <p className="text-slate-300 text-sm max-w-xl">
            Review, approve, or reject messages from Service Providers to investors and builders. Monitor all communications.
          </p>

          {/* Search */}
          <div className="mt-6 relative max-w-lg">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by SP name, recipient, or subject…"
              className="w-full bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-white/50 rounded-2xl pl-12 pr-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400/60 transition-all"
            />
          </div>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="container mx-auto px-4 -mt-5 relative z-20">
        <div className="bg-white rounded-2xl shadow-md border border-slate-100 p-3 flex flex-wrap gap-2 items-center">
          {filterTabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => { setFilter(tab.value); setPage(1); }}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                filter === tab.value
                  ? "bg-slate-900 text-white shadow"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
          <button
            onClick={loadMessages}
            className="ml-auto flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 transition-colors px-3 py-2 rounded-xl hover:bg-slate-50"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-slate-500 font-medium">
            {pagination.total} message{pagination.total !== 1 ? "s" : ""} found
          </p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <Loader2 className="w-10 h-10 text-orange-500 animate-spin" />
            <p className="text-slate-400 text-sm">Loading messages…</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center">
              <Mail className="w-8 h-8 text-slate-300" />
            </div>
            <h3 className="text-lg font-bold text-slate-700">No messages found</h3>
            <p className="text-slate-400 text-sm max-w-sm">
              {filter === "pending_review"
                ? "All caught up! No messages awaiting review."
                : "No messages match the current filter."}
            </p>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto space-y-4">
            {messages.map((msg, i) => (
              <MessageRow key={msg.id} msg={msg} index={i} onClick={setSelected} />
            ))}

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="flex items-center justify-center gap-4 pt-4">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  className="w-10 h-10 rounded-full border bg-white hover:bg-slate-50 flex items-center justify-center disabled:opacity-40"
                >
                  ‹
                </button>
                <span className="text-sm font-semibold text-slate-600">
                  {page} / {pagination.pages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(pagination.pages, p + 1))}
                  disabled={page >= pagination.pages}
                  className="w-10 h-10 rounded-full border bg-white hover:bg-slate-50 flex items-center justify-center disabled:opacity-40"
                >
                  ›
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Thread Modal */}
      {selected && (
        <ThreadModal
          message={selected}
          onClose={() => setSelected(null)}
          onAction={() => { setSelected(null); loadMessages(); }}
        />
      )}
    </div>
  );
}
