"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Inbox,
  Mail,
  MailOpen,
  Reply,
  Send,
  X,
  Loader2,
  Clock,
  Building2,
  ChevronRight,
  RefreshCw,
  Info,
  AlertTriangle,
  MessageSquare,
} from "lucide-react";
import { fetchOutreachInbox, replyToSPOutreachMessage, fetchOutreachMessageReplies } from "@/api";
import { toast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/AuthContext";

const timeAgo = (iso) => {
  if (!iso) return "";
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 60) return "Just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 2592000) return `${Math.floor(diff / 86400)}d ago`;
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
};

// ─── Read + Reply Modal ─────────────────────────────────────────
function MessageModal({ message, onClose, onReplied }) {
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
      toast({ title: "Error", description: "Failed to load thread.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }, [msgState.id]);

  useEffect(() => {
    loadReplies();
  }, [loadReplies]);

  const handleReply = async (e) => {
    e.preventDefault();
    if (!replyText.trim() || replyText.trim().length < 5) {
      toast({ title: "Too short", description: "Please write at least 5 characters.", variant: "destructive" });
      return;
    }
    try {
      setSending(true);
      await replyToSPOutreachMessage(msgState.id, replyText.trim());
      toast({ title: "Reply Sent", description: "Your reply has been sent." });
      setReplyText("");
      onReplied?.();
      await loadReplies();
    } catch (err) {
      toast({ title: "Failed to send reply", description: err?.message, variant: "destructive" });
    } finally {
      setSending(false);
    }
  };

  const isBlocked = msgState.status === "blocked";

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
                <p className="text-[11px] uppercase tracking-widest text-slate-400 mb-1">Message from Service Provider</p>
                <h2 className="font-bold text-lg leading-tight truncate">{msgState.subject}</h2>
                <p className="text-slate-400 text-xs mt-1">
                  From: <span className="text-white">{msgState.spName}</span>
                  {msgState.spCompany && <span className="text-slate-400"> ({msgState.spCompany})</span>}
                  {" · "}{timeAgo(msgState.createdAt)}
                </p>
              </div>
              <button
                onClick={onClose}
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            {isBlocked && (
              <div className="mt-2.5">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border bg-red-100 text-red-800 border-red-200">
                  Stopped by Admin
                </span>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto px-7 py-5 space-y-5">
            {/* Blocked message notice */}
            {isBlocked && (
              <div className="bg-red-50 border border-red-100 rounded-2xl p-4 flex gap-3">
                <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-red-800 mb-1">Conversation Blocked</p>
                  <p className="text-xs text-red-600">
                    This communication has been stopped by the admin. Reason: {msgState.adminNote || "Unhealthy content."}
                  </p>
                </div>
              </div>
            )}

            {/* Admin privacy note */}
            {!isBlocked && (
              <div className="flex items-start gap-3 p-3 bg-blue-50 border border-blue-100 rounded-xl">
                <Info className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-blue-700 leading-relaxed">
                  This message was approved by admin. Your contact details remain private.
                </p>
              </div>
            )}

            {/* Message body */}
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Original Message</p>
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">{msgState.body}</p>
              </div>
              <p className="text-[11px] text-slate-400 mt-2 text-right">{timeAgo(msgState.createdAt)}</p>
            </div>

            {/* Conversation Thread */}
            {replies.length > 0 && (
              <div className="space-y-4 pt-2 border-t border-slate-100">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Conversation Thread</p>
                {loading ? (
                  <div className="flex items-center justify-center py-4">
                    <Loader2 className="w-6 h-6 animate-spin text-orange-500" />
                  </div>
                ) : (
                  <div className="space-y-4">
                    {replies.map((reply, i) => {
                      const isMe = reply.senderRole !== "serviceProvider";
                      return (
                        <motion.div
                          key={reply.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.05 }}
                          className={`rounded-2xl p-4 border max-w-[85%] ${
                            isMe
                              ? "bg-green-50 border-green-100 ml-auto"
                              : "bg-blue-50 border-blue-100"
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                              isMe ? "bg-green-200 text-green-800" : "bg-blue-200 text-blue-800"
                            }`}>
                              {isMe ? "U" : "SP"}
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-slate-800">{isMe ? "You" : reply.senderName}</p>
                              <p className="text-[9px] text-slate-400">{timeAgo(reply.createdAt)}</p>
                            </div>
                          </div>
                          <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">{reply.body}</p>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Reply Form */}
          <div className="border-t border-slate-100 p-5 bg-slate-50 flex-shrink-0">
            {isBlocked ? (
              <div className="flex items-start gap-2 p-3 bg-red-100 text-red-800 border border-red-200 rounded-xl text-xs font-medium">
                <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                <span>You cannot send replies because this conversation was stopped by the admin.</span>
              </div>
            ) : (
              <form onSubmit={handleReply}>
                <div className="flex gap-2">
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
                </div>
              </form>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ─── Inbox Card ─────────────────────────────────────────────────
function InboxCard({ message, index, onClick }) {
  const avatarColors = [
    "from-blue-500 to-indigo-600",
    "from-purple-500 to-pink-500",
    "from-amber-500 to-orange-500",
    "from-green-500 to-teal-600",
    "from-rose-500 to-red-600",
  ];
  const colorClass = avatarColors[index % avatarColors.length];
  const initials = (message.spName || "SP")
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      onClick={() => onClick(message)}
      className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer p-5 flex items-start gap-4 group"
    >
      {/* Avatar */}
      <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${colorClass} flex items-center justify-center text-white font-bold text-base flex-shrink-0 shadow-md`}>
        {initials}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-1">
          <div>
            <p className="font-bold text-slate-900 text-sm">{message.spName}</p>
            {message.spCompany && <p className="text-xs text-slate-500">{message.spCompany}</p>}
          </div>
          <span className="text-[11px] text-slate-400 flex-shrink-0">{timeAgo(message.createdAt)}</span>
        </div>

        <p className="font-semibold text-slate-800 text-sm mt-1.5 truncate">{message.subject}</p>
        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mt-1">{message.body}</p>

        <div className="flex items-center gap-1 mt-2.5 text-xs text-slate-400 group-hover:text-orange-500 transition-colors">
          <MailOpen className="w-3.5 h-3.5" />
          <span>Read & Reply</span>
          <ChevronRight className="w-3 h-3" />
        </div>
      </div>
    </motion.div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────
export default function OutreachInboxPage({ role = "investor" }) {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  const loadInbox = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetchOutreachInbox();
      setMessages(res.data || []);
    } catch (err) {
      toast({ title: "Error", description: "Failed to load inbox.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadInbox();
  }, [loadInbox]);

  const roleLabel = role === "builder" ? "Builder" : "Investor";
  const RoleIcon = role === "builder" ? Building2 : Inbox;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-950 text-white px-4 md:px-8 pt-8 pb-16 rounded-b-[2.5rem] shadow-xl relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-orange-400 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />
        </div>
        <div className="container mx-auto relative z-10">
          <Badge className="bg-orange-500/25 text-orange-200 border-none mb-3 backdrop-blur-sm px-3 py-1">
            <RoleIcon className="w-3.5 h-3.5 mr-1.5" /> Service Provider Inbox
          </Badge>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Messages from Service Providers</h1>
          <p className="text-slate-300 text-sm max-w-xl">
            These messages have been reviewed and approved by our admin team before reaching you.
          </p>

          {/* Stats */}
          <div className="mt-6 flex gap-3">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl px-5 py-3 text-center">
              <p className="text-2xl font-bold text-white">{messages.length}</p>
              <p className="text-[11px] text-slate-300">Message{messages.length !== 1 ? "s" : ""}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="container mx-auto px-4 -mt-5 relative z-20">
        <div className="bg-white rounded-2xl shadow-md border border-slate-100 px-4 py-3 flex items-center justify-between">
          <p className="text-sm font-semibold text-slate-600">
            {loading ? "Loading…" : `${messages.length} message${messages.length !== 1 ? "s" : ""} received`}
          </p>
          <button
            onClick={loadInbox}
            className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 transition-colors px-3 py-2 rounded-xl hover:bg-slate-50"
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
            <p className="text-slate-400 text-sm">Loading your inbox…</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
            <div className="w-20 h-20 rounded-3xl bg-slate-100 flex items-center justify-center">
              <Mail className="w-10 h-10 text-slate-300" />
            </div>
            <h3 className="text-xl font-bold text-slate-700">Your inbox is empty</h3>
            <p className="text-slate-400 text-sm max-w-sm leading-relaxed">
              When service providers send you messages and they're approved by admin, they'll appear here.
            </p>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto space-y-4">
            {/* Info */}
            <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-100 rounded-2xl">
              <Info className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-blue-700 leading-relaxed">
                All messages shown here have been <strong>reviewed and approved</strong> by our admin team. Your contact details remain hidden from service providers at all times.
              </p>
            </div>

            {messages.map((msg, i) => (
              <InboxCard key={msg.id} message={msg} index={i} onClick={setSelected} />
            ))}
          </div>
        )}
      </div>

      {/* Message Detail + Reply Modal */}
      {selected && (
        <MessageModal
          message={selected}
          onClose={() => setSelected(null)}
          onReplied={loadInbox}
        />
      )}
    </div>
  );
}
