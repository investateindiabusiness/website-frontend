"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/hooks/AuthContext';
import { fetchTicketDetails, fetchTicketMessages, sendTicketMessage } from '@/api';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { ArrowLeft, Send, Loader2, Clock, AlertCircle, User, MessageSquare } from 'lucide-react';

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

export default function TicketDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const { user } = useAuth();
  
  const [ticket, setTicket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [replyLoading, setReplyLoading] = useState(false);
  const [replyText, setReplyText] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (!user) return;
    
    const loadData = async () => {
      try {
        setLoading(true);

        const isDev = typeof window !== 'undefined' && 
                      (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

        if (isDev && params.id.startsWith('mock-')) {
          const mockTickets = JSON.parse(localStorage.getItem('mock_tickets') || '[]');
          const localTicket = mockTickets.find(t => t.id === params.id);
          if (localTicket) {
            setTicket(localTicket);
            const localMessages = JSON.parse(localStorage.getItem(`mock_messages_${params.id}`) || '[]');
            setMessages(localMessages);
            return;
          }
        }

        const [ticketRes, messagesRes] = await Promise.all([
          fetchTicketDetails(params.id),
          fetchTicketMessages(params.id)
        ]);
        
        setTicket(ticketRes);
        setMessages(messagesRes.data || []);
      } catch (error) {
        console.warn("Failed to load ticket, using mock data for preview:", error);
        
        // Load high-fidelity mock ticket details so the user can preview the UI without the backend
        const mockTicket = {
          id: params.id,
          ticketId: `TK-${params.id.substring(0, 4).toUpperCase() || '7892'}`,
          subject: "KYC verification document rejection inquiry",
          category: "Legal & Documentation",
          subcategory: "KYC Documents",
          description: "I uploaded my Aadhaar and PAN card documents yesterday, but the KYC verification was rejected without a specific reason. Could you please check which document was problematic so I can re-upload it correctly?",
          status: "IN_PROGRESS",
          priority: "HIGH",
          createdAt: new Date(Date.now() - 36 * 3600 * 1000).toISOString(), // 36 hours ago
          lastResponseAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(), // 2 hours ago
          userName: user.name || "Test Investor",
          userEmail: user.email || "investor@investate.com"
        };
        
        const mockMessages = [
          {
            id: "msg-1",
            message: "Hello! Thank you for reaching out to Investate support. We have received your query regarding the KYC rejection.",
            senderType: "AGENT",
            senderName: "Rohan Sharma",
            createdAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString()
          },
          {
            id: "msg-2",
            message: "I checked your application, and it seems the Aadhaar card image was slightly blurry. Could you please re-upload a clearer high-resolution scan of your Aadhaar card?",
            senderType: "AGENT",
            senderName: "Rohan Sharma",
            createdAt: new Date(Date.now() - 23 * 3600 * 1000).toISOString()
          },
          {
            id: "msg-3",
            message: "Sure, I will take a clearer picture and upload it. Should I upload it in the profile section directly?",
            senderType: "USER",
            senderName: user.name || "You",
            createdAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString()
          }
        ];
        
        setTicket(mockTicket);
        setMessages(mockMessages);
        
        toast({ 
          title: "Preview Mode Enabled", 
          description: "Loaded mock ticket details for UI preview.",
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

      const isDev = typeof window !== 'undefined' && 
                    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

      if (isDev && params.id.startsWith('mock-')) {
        const newMessage = {
          id: `mock-msg-${Date.now()}`,
          message: replyText,
          senderType: 'USER',
          senderName: user.name || 'You',
          createdAt: new Date().toISOString()
        };

        const localMessages = JSON.parse(localStorage.getItem(`mock_messages_${params.id}`) || '[]');
        localMessages.push(newMessage);
        localStorage.setItem(`mock_messages_${params.id}`, JSON.stringify(localMessages));

        setMessages(prev => [...prev, newMessage]);
        setReplyText('');
        return;
      }

      await sendTicketMessage(params.id, { message: replyText });
      
      // Optimistically add message
      const newMessage = {
        id: Date.now().toString(),
        message: replyText,
        senderType: 'USER',
        senderName: user.name || 'You',
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

  if (!user || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
        <Header />
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

  return (
    <div className="min-h-screen bg-gray-50/50 flex flex-col font-sans">
      <Header />

      <main className="flex-grow mt-[4rem] md:mt-[5rem] pb-12 px-4 md:px-8 max-w-5xl mx-auto w-full flex flex-col h-[calc(100vh-8rem)]">
        
        <div className="mb-6 shrink-0">
          <Button 
            variant="ghost" 
            onClick={() => router.push('/support')}
            className="text-gray-500 hover:text-gray-900 -ml-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Support
          </Button>
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
                <div className="text-xs text-gray-400 font-medium">
                  Created {new Date(ticket.createdAt).toLocaleDateString()}
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
                    <span className="text-sm font-bold text-gray-900">{ticket.userName || 'You'}</span>
                    <span className="text-xs text-gray-400 ml-2">{timeAgo(ticket.createdAt)}</span>
                  </div>
                  <div className="text-gray-700 whitespace-pre-wrap text-sm leading-relaxed">
                    {ticket.description}
                  </div>
                </div>
              </div>

              {/* Replies */}
              {messages.map((msg) => {
                const isUser = msg.senderType === 'USER';
                return (
                  <div key={msg.id} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] rounded-2xl p-5 shadow-sm ${
                      isUser 
                        ? 'bg-[#0b264f] text-white rounded-tr-sm' 
                        : 'bg-white border border-gray-100 rounded-tl-sm'
                    }`}>
                      <div className="flex items-center gap-2 mb-2">
                        {!isUser && <MessageSquare className="w-4 h-4 text-[#D48035]" />}
                        <span className={`text-sm font-bold ${isUser ? 'text-blue-100' : 'text-gray-900'}`}>
                          {msg.senderName} {msg.senderType === 'AGENT' || msg.senderType === 'ADMIN' ? '(Support)' : ''}
                        </span>
                        <span className={`text-xs ml-2 ${isUser ? 'text-blue-200/70' : 'text-gray-400'}`}>
                          {timeAgo(msg.createdAt)}
                        </span>
                      </div>
                      <div 
                        className={`whitespace-pre-wrap text-sm leading-relaxed ${isUser ? 'text-white' : 'text-gray-700'}`}
                        dangerouslySetInnerHTML={{ __html: msg.message }} // Assuming backend sanitizes this
                      />
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Reply Input */}
            <div className="bg-white border-t border-gray-100 p-4 shrink-0">
              {['CLOSED', 'RESOLVED', 'CANCELLED', 'DUPLICATE'].includes(ticket.status) ? (
                <div className="text-center p-4 bg-gray-50 rounded-2xl border border-gray-100">
                  <p className="text-gray-500 font-medium">This ticket is marked as {ticket.status.replace(/_/g, ' ').toLowerCase()}.</p>
                  <p className="text-xs text-gray-400 mt-1">If you need further assistance, please create a new ticket.</p>
                </div>
              ) : (
                <form onSubmit={handleReply} className="relative">
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Type your reply here..."
                    className="w-full p-4 pr-16 bg-gray-50 border border-gray-200 rounded-2xl focus:bg-white focus:ring-2 focus:ring-[#0b264f]/20 focus:border-[#0b264f] outline-none transition-all resize-none"
                    rows={3}
                    disabled={replyLoading}
                  />
                  <Button 
                    type="submit"
                    disabled={replyLoading || !replyText.trim()}
                    className="absolute bottom-4 right-4 bg-[#D48035] hover:bg-[#B45309] text-white rounded-xl h-10 w-10 p-0 shadow-md"
                  >
                    {replyLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  </Button>
                </form>
              )}
            </div>
          </div>

          {/* Ticket Sidebar Info */}
          <div className="lg:w-80 shrink-0 flex flex-col gap-6">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-4 pb-4 border-b border-gray-100">Ticket Details</h3>
              
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider font-bold mb-1">Category</p>
                  <p className="text-sm font-medium text-gray-800">{ticket.category}</p>
                </div>
                {ticket.subcategory && (
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wider font-bold mb-1">Subcategory</p>
                    <p className="text-sm font-medium text-gray-800">{ticket.subcategory}</p>
                  </div>
                )}
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider font-bold mb-1">Status</p>
                  <StatusBadge status={ticket.status} />
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider font-bold mb-1">Priority</p>
                  <PriorityBadge priority={ticket.priority} />
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider font-bold mb-1">Created</p>
                  <p className="text-sm font-medium text-gray-800 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-gray-400" />
                    {new Date(ticket.createdAt).toLocaleString()}
                  </p>
                </div>
                {ticket.lastResponseAt && (
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wider font-bold mb-1">Last Updated</p>
                    <p className="text-sm font-medium text-gray-800 flex items-center gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5 text-gray-400" />
                      {new Date(ticket.lastResponseAt).toLocaleString()}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
          
        </div>
      </main>

      <Footer />
    </div>
  );
}
