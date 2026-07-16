"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/hooks/AuthContext';
import { fetchTicketDetails, fetchTicketMessages, sendTicketMessage, changeTicketStatus } from '@/api';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { ArrowLeft, Send, Loader2, Clock, AlertCircle, User, MessageSquare, CheckCircle, Shield } from 'lucide-react';

const timeAgo = (date) => {
  if (!date) return '';
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + " years ago";
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + " months ago";
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + " days ago";
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + " hours ago";
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + " minutes ago";
  return Math.floor(seconds) + " seconds ago";
};

const StatusBadge = ({ status }) => {
  const styles = {
    OPEN: 'bg-blue-100 text-blue-800 border-blue-200',
    IN_PROGRESS: 'bg-purple-100 text-purple-800 border-purple-200',
    WAITING_FOR_USER: 'bg-orange-100 text-orange-800 border-orange-200',
    RESOLVED: 'bg-green-100 text-green-800 border-green-200',
    CLOSED: 'bg-gray-100 text-gray-800 border-gray-200',
    REOPENED: 'bg-red-100 text-red-800 border-red-200',
    ESCALATED: 'bg-red-100 text-red-800 border-red-200 font-bold',
  };
  const defaultStyle = 'bg-gray-100 text-gray-800 border-gray-200';
  return (
    <Badge variant="outline" className={`${styles[status] || defaultStyle} px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider`}>
      {status?.replace(/_/g, ' ')}
    </Badge>
  );
};

const PriorityBadge = ({ priority }) => {
  const styles = {
    LOW: 'text-green-600 bg-green-50 border-green-200',
    MEDIUM: 'text-blue-600 bg-blue-50 border-blue-200',
    HIGH: 'text-orange-600 bg-orange-50 border-orange-200',
    CRITICAL: 'text-red-600 bg-red-50 border-red-200 animate-pulse',
  };
  return (
    <span className={`text-[10px] font-bold px-2 py-1 rounded border ${styles[priority] || 'text-gray-600'}`}>
      {priority}
    </span>
  );
};

export default function AdminTicketDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const { user } = useAuth();
  
  const [ticket, setTicket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [replyLoading, setReplyLoading] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [isInternal, setIsInternal] = useState(false);
  const [statusLoading, setStatusLoading] = useState(false);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      if (user && user.role !== 'admin') router.push('/');
      return;
    }
    
    const loadData = async () => {
      try {
        setLoading(true);
        const [ticketRes, messagesRes] = await Promise.all([
          fetchTicketDetails(params.id),
          fetchTicketMessages(params.id)
        ]);
        
        setTicket(ticketRes);
        setMessages(messagesRes.data || []);
      } catch (error) {
        console.warn("Failed to load ticket:", error);
        toast({ 
          title: "Error", 
          description: "Failed to load ticket details.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user, params.id, router]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleReply = async (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    try {
      setReplyLoading(true);
      await sendTicketMessage(params.id, { message: replyText, isInternal });
      
      const newMessage = {
        id: Date.now().toString(),
        message: replyText,
        senderType: 'ADMIN',
        senderName: user.name || 'Admin',
        isInternal,
        createdAt: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, newMessage]);
      setReplyText('');
      
    } catch (error) {
      console.warn("Failed to send reply:", error);
      toast({ title: "Error", description: "Failed to send message.", variant: "destructive" });
    } finally {
      setReplyLoading(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      setStatusLoading(true);
      await changeTicketStatus(params.id, newStatus);
      setTicket(prev => ({ ...prev, status: newStatus }));
      toast({ title: "Success", description: `Status updated to ${newStatus}` });
    } catch (error) {
      console.warn("Failed to change status:", error);
      toast({ title: "Error", description: error.message || "Failed to update status", variant: "destructive" });
    } finally {
      setStatusLoading(false);
    }
  };

  if (!user || loading) {
    return (
      <div className="font-sans">
        <div className="flex-grow flex items-center justify-center">
          <div className="flex flex-col items-center">
            <Loader2 className="w-10 h-10 text-[#D48035] animate-spin mb-4" />
            <p className="text-gray-500">Loading ticket details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!ticket) return null;

  const validNextStatuses = {
    OPEN: ['IN_PROGRESS', 'CANCELLED', 'DUPLICATE'],
    IN_PROGRESS: ['WAITING_FOR_USER', 'RESOLVED', 'ESCALATED', 'CANCELLED'],
    WAITING_FOR_USER: ['IN_PROGRESS', 'RESOLVED', 'CANCELLED'],
    RESOLVED: ['CLOSED', 'REOPENED'],
    CLOSED: ['REOPENED'],
    REOPENED: ['IN_PROGRESS', 'CANCELLED'],
    ESCALATED: ['IN_PROGRESS', 'RESOLVED', 'CANCELLED'],
    CANCELLED: [],
    DUPLICATE: [],
  };

  const allowedStatuses = validNextStatuses[ticket.status] || [];

  return (
    <div className="min-h-screen bg-gray-50/50 flex flex-col font-sans">

      <main className="flex-grow md:mt-[5rem] pb-12 px-4 md:px-8 max-w-6xl mx-auto w-full flex flex-col h-[calc(100vh-8rem)]">
        
        <div className="mb-6 shrink-0 flex justify-between items-center">
          <Button 
            variant="ghost" 
            onClick={() => router.push('/admin/helpdesk')}
            className="text-gray-500 hover:text-gray-900 -ml-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Helpdesk
          </Button>
          
          <div className="flex gap-2">
            {allowedStatuses.map(status => (
              <Button 
                key={status}
                size="sm"
                variant="outline"
                disabled={statusLoading}
                onClick={() => handleStatusChange(status)}
                className="text-xs font-bold"
              >
                Mark as {status.replace(/_/g, ' ')}
              </Button>
            ))}
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 h-full min-h-0">
          
          {/* Main Chat Area */}
          <div className="flex-grow flex flex-col bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden min-h-[500px]">
            {/* Ticket Header */}
            <div className="bg-white border-b border-gray-100 p-6 shrink-0 z-10 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-2">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-mono font-bold text-gray-500 bg-gray-50 px-3 py-1 rounded-lg">
                    #{ticket.ticketId}
                  </span>
                  <StatusBadge status={ticket.status} />
                  <PriorityBadge priority={ticket.priority} />
                </div>
                <div className="text-xs text-gray-400 font-medium flex items-center gap-2">
                  <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded">SLA Breach: {ticket.slaBreached ? 'YES' : 'NO'}</span>
                </div>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 leading-tight">
                {ticket.subject}
              </h1>
            </div>

            {/* Messages Area */}
            <div className="flex-grow overflow-y-auto p-6 bg-gray-50/50 space-y-6">
              
              {/* Original Description as first message */}
              <div className="flex justify-start">
                <div className="max-w-[85%] bg-white border border-gray-100 rounded-2xl rounded-tl-sm p-5 shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <User className="w-4 h-4 text-gray-400" />
                    <span className="text-sm font-bold text-gray-900">{ticket.userName} ({ticket.userEmail})</span>
                    <span className="text-xs text-gray-400 ml-2">{timeAgo(ticket.createdAt)}</span>
                  </div>
                  <div className="text-gray-700 whitespace-pre-wrap text-sm leading-relaxed">
                    {ticket.description}
                  </div>
                </div>
              </div>

              {/* Replies */}
              {messages.map((msg) => {
                const isAdmin = msg.senderType === 'ADMIN' || msg.senderType === 'AGENT';
                return (
                  <div key={msg.id} className={`flex ${isAdmin ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] rounded-2xl p-5 shadow-sm ${
                      isAdmin 
                        ? (msg.isInternal ? 'bg-yellow-100 border border-yellow-300 rounded-tr-sm' : 'bg-[#0b264f] text-white rounded-tr-sm') 
                        : 'bg-white border border-gray-100 rounded-tl-sm'
                    }`}>
                      <div className="flex items-center gap-2 mb-2">
                        {msg.isInternal && <Shield className="w-4 h-4 text-yellow-600" />}
                        <span className={`text-sm font-bold ${
                          isAdmin 
                            ? (msg.isInternal ? 'text-yellow-900' : 'text-blue-100')
                            : 'text-gray-900'
                        }`}>
                          {msg.senderName} {msg.isInternal ? '(Internal Note)' : ''}
                        </span>
                        <span className={`text-xs ml-2 ${
                          isAdmin 
                            ? (msg.isInternal ? 'text-yellow-700' : 'text-blue-200/70') 
                            : 'text-gray-400'
                        }`}>
                          {timeAgo(msg.createdAt)}
                        </span>
                      </div>
                      <div 
                        className={`whitespace-pre-wrap text-sm leading-relaxed ${
                          isAdmin 
                            ? (msg.isInternal ? 'text-yellow-800' : 'text-white') 
                            : 'text-gray-700'
                        }`}
                        dangerouslySetInnerHTML={{ __html: msg.message }}
                      />
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Reply Input */}
            <div className="bg-white border-t border-gray-100 p-4 shrink-0 flex flex-col gap-2">
              <form onSubmit={handleReply} className="relative">
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder={isInternal ? "Type an internal note (only visible to admins)..." : "Type your reply to the user..."}
                  className={`w-full p-4 pr-16 border rounded-2xl focus:ring-2 focus:outline-none transition-all resize-none ${
                    isInternal 
                      ? "bg-yellow-50 border-yellow-200 focus:bg-yellow-50 focus:ring-yellow-500/20 focus:border-yellow-500 placeholder-yellow-600/50" 
                      : "bg-gray-50 border-gray-200 focus:bg-white focus:ring-[#0b264f]/20 focus:border-[#0b264f] placeholder-gray-400"
                  }`}
                  rows={3}
                  disabled={replyLoading}
                />
                <Button 
                  type="submit"
                  disabled={replyLoading || !replyText.trim()}
                  className={`absolute bottom-4 right-4 rounded-xl h-10 px-4 shadow-md ${
                    isInternal ? "bg-yellow-600 hover:bg-yellow-700 text-white" : "bg-[#D48035] hover:bg-[#B45309] text-white"
                  }`}
                >
                  {replyLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                    <span className="flex items-center gap-2"><Send className="w-4 h-4" /> Send</span>
                  )}
                </Button>
              </form>
              <div className="flex items-center gap-2 px-2">
                <input 
                  type="checkbox" 
                  id="internalNote" 
                  checked={isInternal} 
                  onChange={(e) => setIsInternal(e.target.checked)}
                  className="w-4 h-4 text-[#D48035] rounded border-gray-300 focus:ring-[#D48035]"
                />
                <label htmlFor="internalNote" className="text-sm font-medium text-gray-700 cursor-pointer">
                  Send as Internal Note
                </label>
              </div>
            </div>
          </div>

          {/* Ticket Sidebar Info */}
          <div className="lg:w-80 shrink-0 flex flex-col gap-6">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-4 pb-4 border-b border-gray-100">User Details</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider font-bold mb-1">Name</p>
                  <p className="text-sm font-medium text-gray-800">{ticket.userName}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider font-bold mb-1">Email</p>
                  <p className="text-sm font-medium text-gray-800">{ticket.userEmail}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider font-bold mb-1">Phone</p>
                  <p className="text-sm font-medium text-gray-800">{ticket.userMobile || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider font-bold mb-1">Role</p>
                  <Badge variant="secondary" className="text-xs">{ticket.userRole}</Badge>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-4 pb-4 border-b border-gray-100">Ticket Details</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider font-bold mb-1">Category</p>
                  <p className="text-sm font-medium text-gray-800">{ticket.category}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider font-bold mb-1">Created</p>
                  <p className="text-sm font-medium text-gray-800 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-gray-400" />
                    {new Date(ticket.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </main>
    </div>
  );
}
