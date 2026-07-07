"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  CheckCircle,
  XCircle,
  Clock,
  MessageSquare,
  ChevronRight,
  Loader2,
  X,
  Reply,
  Info,
  RefreshCw,
  Mail,
} from "lucide-react";
import {
  fetchMySentOutreachMessages,
  fetchOutreachMessageReplies,
  spReplyToOutreachMessage,
} from "@/api";
import { toast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/AuthContext";

const STATUS_CONFIG = {
  pending_review: {
    label: "Pending Review",
    color: "bg-amber-100 text-amber-800 border-amber-200",
    icon: Clock,
    description: "Admin is reviewing your message before delivery.",
  },
  delivered: {
    label: "Delivered",
    color: "bg-green-100 text-green-800 border-green-200",
    icon: CheckCircle,
    description: "Message delivered to the recipient.",
  },
  rejected: {
    label: "Not Approved",
    color: "bg-red-100 text-red-800 border-red-200",
    icon: XCircle,
    description: "Admin did not approve this message.",
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

function ThreadModal({ message, onClose }) {
  const [replies, setReplies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [replyText, setReplyText] = useState("");
  const [sending, setSending] = useState(false);
  const [msgState, setMsgState] = useState(message);

  const loadReplies = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetchOutreachMessageReplies(msgState.id);
      setReplies(res.replies || []);
      if (res.message) {
        setMsgState(res.message);
      }
    } catch (err) {
      toast({ title: "Error", description: "Failed to load replies.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }, [msgState.id]);

  useEffect(() => {
    loadReplies();
  }, [loadReplies]);

  const handleReplySubmit = async (e) => {
    e.preventDefault();
    if (!replyText.trim() || replyText.trim().length < 5) {
      toast({ title: "Short message", description: "Reply must be at least 5 characters.", variant: "destructive" });
      return;
    }

    try {
      setSending(true);
      await spReplyToOutreachMessage(msgState.id, replyText.trim());
      setReplyText("");
      toast({ title: "Reply Sent", description: "Your message has been delivered." });
      // Reload replies
      await loadReplies();
    } catch (err) {
      toast({
        title: "Reply Failed",
        description: err?.message || "Failed to deliver reply.",
        variant: "destructive"
      });
    } finally {
      setSending(false);
    }
  };

  const statusCfg = STATUS_CONFIG[msgState.status] || STATUS_CONFIG.pending_review;
  const isDelivered = msgState.status === "delivered";
  const isBlocked = msgState.status === "blocked";
  const hasReplied = msgState.hasRecipientReplied || false;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        />
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
                <p className="text-[11px] uppercase tracking-widest text-slate-400 mb-1">Outreach Conversation</p>
                <h2 className="font-bold text-lg leading-tight truncate">{msgState.subject}</h2>
                <p className="text-slate-400 text-xs mt-1">
                  To: <span className="text-white">{msgState.recipientName}</span>
                  {" · "}
                  <span className="capitalize">{msgState.recipientRole}</span>
                  {" · "}
                  {timeAgo(msgState.createdAt)}
                </p>
              </div>
              <button
                onClick={onClose}
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors flex-shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Status */}
            <div className="mt-3 flex items-center gap-2">
              <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${statusCfg.color}`}>
                {isBlocked ? "Blocked by Admin" : statusCfg.label}
              </span>
              {msgState.status === "rejected" && msgState.adminNote && (
                <span className="text-xs text-red-300">Reason: {msgState.adminNote}</span>
              )}
            </div>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto px-7 py-5 space-y-5">
            {/* Blocked message notice */}
            {isBlocked && (
              <div className="bg-red-50 border border-red-100 rounded-2xl p-4 flex gap-3">
                <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-red-800 mb-1">Conversation Blocked</p>
                  <p className="text-xs text-red-600">
                    This communication loop was stopped by the admin. Reason: {msgState.adminNote || "Unhealthy content detected."}
                  </p>
                </div>
              </div>
            )}

            {/* Original Message */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Send className="w-4 h-4 text-slate-400" />
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Your Outreach Message</p>
              </div>
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">{msgState.body}</p>
              </div>
              <p className="text-[11px] text-slate-400 mt-2 text-right">{timeAgo(msgState.createdAt)}</p>
            </div>

            {/* Admin note if rejected */}
            {msgState.status === "rejected" && (
              <div className="bg-red-50 border border-red-100 rounded-2xl p-4 flex gap-3">
                <XCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-red-800 mb-1">Message Not Approved</p>
                  <p className="text-xs text-red-600">
                    {msgState.adminNote || "Admin did not approve this outreach."}
                  </p>
                </div>
              </div>
            )}

            {/* Replies */}
            {isDelivered && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-3">
                  <Reply className="w-4 h-4 text-slate-400" />
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Conversation Loop ({replies.length})
                  </p>
                </div>

                {loading ? (
                  <div className="flex items-center justify-center py-6">
                    <Loader2 className="w-6 h-6 animate-spin text-orange-500" />
                  </div>
                ) : replies.length === 0 ? (
                  <div className="bg-slate-50 rounded-2xl p-6 text-center border border-slate-100 border-dashed">
                    <MessageSquare className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="text-sm text-slate-400">No replies yet</p>
                    <p className="text-xs text-slate-400 mt-1">
                      The recipient must respond first to activate the back-and-forth loop.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {replies.map((reply, i) => {
                      const isMe = reply.senderRole === "serviceProvider";
                      return (
                        <motion.div
                          key={reply.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.05 }}
                          className={`rounded-2xl p-4 border max-w-[85%] ${
                            isMe
                              ? "bg-blue-50 border-blue-100 ml-auto"
                              : "bg-green-50 border-green-100"
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                              isMe ? "bg-blue-200 text-blue-800" : "bg-green-200 text-green-800"
                            }`}>
                              {isMe ? "U" : (reply.senderName || "?")[0].toUpperCase()}
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-slate-800">{isMe ? "You" : reply.senderName}</p>
                              <p className="text-[9px] text-slate-400">{timeAgo(reply.createdAt)}</p>
                            </div>
                          </div>
                          <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">
                            {reply.body}
                          </p>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Bottom Composer / Actions */}
          {isDelivered && (
            <div className="border-t border-slate-100 p-5 bg-slate-50 flex-shrink-0">
              {hasReplied ? (
                <form onSubmit={handleReplySubmit} className="flex gap-2">
                  <input
                    type="text"
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Type your reply here…"
                    className="flex-grow border border-slate-200 rounded-xl px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-orange-400/50"
                  />
                  <Button
                    type="submit"
                    disabled={sending || !replyText.trim()}
                    className="bg-[#D48035] hover:bg-[#b06725] text-white px-5 rounded-xl font-bold flex items-center gap-1.5"
                  >
                    {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    Send
                  </Button>
                </form>
              ) : (
                <div className="flex items-start gap-2.5 p-3.5 bg-blue-100 border border-blue-200 rounded-xl text-blue-800">
                  <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                  <p className="text-xs font-medium leading-relaxed">
                    You cannot send further messages until <strong>{msgState.recipientName}</strong> replies to your initial outreach.
                  </p>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function MessageCard({ msg, index, onClick }) {
  const statusCfg = STATUS_CONFIG[msg.status] || STATUS_CONFIG.pending_review;
  const StatusIcon = statusCfg.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.35 }}
      onClick={() => msg.status !== "pending_review" && onClick(msg)}
      className={`bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex items-start gap-4 transition-all duration-200 ${
        msg.status !== "pending_review"
          ? "hover:shadow-md hover:-translate-y-0.5 cursor-pointer"
          : "opacity-80"
      }`}
    >
      {/* Status Icon */}
      <div
        className={`w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 ${
          msg.status === "delivered"
            ? "bg-green-100"
            : msg.status === "rejected"
            ? "bg-red-100"
            : "bg-amber-100"
        }`}
      >
        <StatusIcon
          className={`w-5 h-5 ${
            msg.status === "delivered"
              ? "text-green-600"
              : msg.status === "rejected"
              ? "text-red-600"
              : "text-amber-600"
          }`}
        />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-1">
          <div className="min-w-0">
            <p className="font-bold text-slate-900 text-sm truncate">{msg.subject}</p>
            <p className="text-xs text-slate-500 mt-0.5">
              To: <span className="font-medium text-slate-700">{msg.recipientName}</span>{" "}
              <span className="text-slate-400 capitalize">({msg.recipientRole})</span>
            </p>
          </div>
          <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${statusCfg.color}`}>
              {statusCfg.label}
            </span>
            <span className="text-[10px] text-slate-400">{timeAgo(msg.createdAt)}</span>
          </div>
        </div>

        <p className="text-xs text-slate-500 line-clamp-2 mt-1.5 leading-relaxed">
          {msg.body}
        </p>

        {msg.status === "rejected" && msg.adminNote && (
          <p className="text-xs text-red-500 mt-2 font-medium">
            Reason: {msg.adminNote}
          </p>
        )}

        {msg.status !== "pending_review" && (
          <div className="flex items-center gap-1 mt-2 text-xs text-slate-400">
            <span>View thread</span>
            <ChevronRight className="w-3 h-3" />
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default function SPOutreachPage() {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [selectedMessage, setSelectedMessage] = useState(null);

  const loadMessages = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetchMySentOutreachMessages();
      setMessages(res.data || []);
    } catch (err) {
      toast({ title: "Error", description: "Failed to load messages.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  const filterTabs = [
    { value: "all", label: "All" },
    { value: "pending_review", label: "Pending Review" },
    { value: "delivered", label: "Delivered" },
    { value: "rejected", label: "Rejected" },
  ];

  const filtered =
    filter === "all" ? messages : messages.filter((m) => m.status === filter);

  const counts = {
    all: messages.length,
    pending_review: messages.filter((m) => m.status === "pending_review").length,
    delivered: messages.filter((m) => m.status === "delivered").length,
    rejected: messages.filter((m) => m.status === "rejected").length,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-950 text-white px-4 md:px-8 pt-8 pb-14 rounded-b-[2.5rem] shadow-xl relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-orange-400 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />
        </div>
        <div className="container mx-auto relative z-10">
          <Badge className="bg-orange-500/25 text-orange-200 border-none mb-3 backdrop-blur-sm px-3 py-1">
            <Mail className="w-3.5 h-3.5 mr-1.5" /> Outreach Messages
          </Badge>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">My Outreach</h1>
          <p className="text-slate-300 text-sm max-w-xl">
            Track the status of your messages sent to investors and builders.
          </p>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-3 mt-6 max-w-lg">
            {[
              { label: "Pending Review", count: counts.pending_review, color: "text-amber-300" },
              { label: "Delivered", count: counts.delivered, color: "text-green-300" },
              { label: "Rejected", count: counts.rejected, color: "text-red-300" },
            ].map((s) => (
              <div key={s.label} className="bg-white/10 backdrop-blur-sm rounded-2xl p-3 text-center">
                <p className={`text-2xl font-bold ${s.color}`}>{s.count}</p>
                <p className="text-[10px] text-slate-300 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="container mx-auto px-4 -mt-5 relative z-20">
        <div className="bg-white rounded-2xl shadow-md border border-slate-100 p-3 flex flex-wrap gap-2 items-center">
          {filterTabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setFilter(tab.value)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                filter === tab.value
                  ? "bg-slate-900 text-white shadow"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {tab.label}
              {counts[tab.value] > 0 && (
                <span
                  className={`text-[10px] font-bold min-w-[18px] h-[18px] rounded-full flex items-center justify-center px-1 ${
                    filter === tab.value ? "bg-white/20 text-white" : "bg-slate-200 text-slate-600"
                  }`}
                >
                  {counts[tab.value]}
                </span>
              )}
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
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <Loader2 className="w-10 h-10 text-orange-500 animate-spin" />
            <p className="text-slate-400 text-sm">Loading messages…</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center">
              <Mail className="w-8 h-8 text-slate-300" />
            </div>
            <h3 className="text-lg font-bold text-slate-700">No messages yet</h3>
            <p className="text-slate-400 text-sm max-w-sm">
              {filter === "all"
                ? "Browse the directory to find investors and builders you can connect with."
                : `No ${filter.replace("_", " ")} messages found.`}
            </p>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto space-y-4">
            {/* Info box */}
            <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-100 rounded-2xl">
              <Info className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-blue-700 leading-relaxed">
                Click on <strong>Delivered</strong> or <strong>Rejected</strong> messages to view the full thread and any replies from the recipient.
              </p>
            </div>

            {filtered.map((msg, i) => (
              <MessageCard
                key={msg.id}
                msg={msg}
                index={i}
                onClick={setSelectedMessage}
              />
            ))}
          </div>
        )}
      </div>

      {/* Thread Modal */}
      {selectedMessage && (
        <ThreadModal
          message={selectedMessage}
          onClose={() => setSelectedMessage(null)}
        />
      )}
    </div>
  );
}
