"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/AuthContext';
import { fetchMyTickets } from '@/api';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { PlusCircle, Search, Clock, AlertCircle, ArrowRight, Loader2, MessageSquare } from 'lucide-react';

const timeAgo = (date) => {
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
  const normalizedStatus = status?.toUpperCase().replace(/[-\s]/g, '_') || 'OPEN';
  return (
    <Badge variant="outline" className={`${styles[normalizedStatus] || defaultStyle} px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider`}>
      {normalizedStatus.replace(/_/g, ' ')}
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
  const normalizedPriority = priority?.toUpperCase().replace(/[-\s]/g, '_') || 'MEDIUM';
  return (
    <span className={`text-[10px] font-bold px-2 py-1 rounded border ${styles[normalizedPriority] || 'text-gray-600 bg-gray-50'}`}>
      {normalizedPriority}
    </span>
  );
};

export default function SupportDashboard() {
  const router = useRouter();
  const { user } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');

  useEffect(() => {
    if (!user) {
      router.push('/');
      return;
    }

    const loadTickets = async () => {
      try {
        setLoading(true);
        
        let apiTickets = [];
        try {
          const res = await fetchMyTickets();
          apiTickets = res.data || [];
        } catch (apiErr) {
          console.warn("API load failed, falling back to local mock storage:", apiErr);
        }

        const isDev = typeof window !== 'undefined' && 
                      (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
        if (isDev) {
          const allMockTickets = JSON.parse(localStorage.getItem('mock_tickets') || '[]');
          // Only show this user's tickets, not tickets from other users
          const myMockTickets = allMockTickets.filter(t => t.userEmail === user.email || t.userName === user.name);
          setTickets([...myMockTickets, ...apiTickets]);
        } else {
          setTickets(apiTickets);
        }
      } catch (error) {
        console.warn("Failed to load tickets:", error);
        toast({ title: "Error", description: "Could not load support tickets.", variant: "destructive" });
      } finally {
        setLoading(false);
      }
    };

    loadTickets();
  }, [user, router]);

  const filteredTickets = tickets.filter(ticket => {
    const cleanQuery = searchQuery.trim().toLowerCase().replace(/^#/, '');
    const matchesSearch = (ticket.subject || '').toLowerCase().includes(cleanQuery) || 
                          (ticket.ticketId || '').toLowerCase().includes(cleanQuery);
    
    if (cleanQuery) {
      return matchesSearch;
    }

    const normalizedTicketStatus = ticket.status?.toUpperCase().replace(/[-\s]/g, '_') || 'OPEN';
    const normalizedFilterStatus = filterStatus.toUpperCase().replace(/[-\s]/g, '_');
    const matchesStatus = normalizedFilterStatus === 'ALL' || normalizedTicketStatus === normalizedFilterStatus;
    return matchesSearch && matchesStatus;
  });

  const statuses = ['ALL', 'OPEN', 'IN_PROGRESS', 'WAITING_FOR_USER', 'RESOLVED', 'CLOSED'];

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50/50 flex flex-col font-sans">
      <Header />

      <main className="flex-grow mt-[4rem] md:mt-[5rem] pb-12 px-4 md:px-8 max-w-6xl mx-auto w-full">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Support Tickets</h1>
            <p className="text-gray-500 mt-1">Manage your helpdesk requests and track their progress.</p>
          </div>
          <Button 
            onClick={() => router.push('/support/new')}
            className="bg-[#D48035] hover:bg-[#B45309] text-white rounded-xl shadow-lg shadow-orange-500/20 px-6 py-6 h-auto transition-all group"
          >
            <PlusCircle className="w-5 h-5 mr-2 group-hover:rotate-90 transition-transform" /> 
            Create New Ticket
          </Button>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-8 flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by ticket ID or subject..."
              className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl leading-5 bg-gray-50 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors sm:text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex overflow-x-auto gap-2 pb-2 md:pb-0 scrollbar-hide shrink-0">
            {statuses.map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                  filterStatus === status
                    ? 'bg-[#0b264f] text-white border-[#0b264f] shadow-md'
                    : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                }`}
              >
                {status.replace(/_/g, ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Ticket List */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-10 h-10 text-orange-500 animate-spin mb-4" />
            <p className="text-gray-500 animate-pulse">Loading your tickets...</p>
          </div>
        ) : filteredTickets.length === 0 ? (
          <div className="bg-white rounded-3xl border border-dashed border-gray-200 p-12 text-center flex flex-col items-center justify-center">
            <div className="bg-orange-50 p-4 rounded-full mb-4">
              <MessageSquare className="w-8 h-8 text-orange-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No tickets found</h3>
            <p className="text-gray-500 max-w-sm mb-6">
              {searchQuery || filterStatus !== 'ALL' 
                ? "We couldn't find any tickets matching your current filters." 
                : "You haven't opened any support tickets yet. Need help? Create one now."}
            </p>
            {(searchQuery || filterStatus !== 'ALL') ? (
              <Button variant="outline" onClick={() => { setSearchQuery(''); setFilterStatus('ALL'); }} className="rounded-xl">
                Clear Filters
              </Button>
            ) : (
              <Button onClick={() => router.push('/support/new')} className="bg-[#0b264f] hover:bg-blue-900 text-white rounded-xl">
                Create Ticket
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredTickets.map((ticket) => (
              <div 
                key={ticket.id} 
                onClick={() => router.push(`/support/${ticket.id}`)}
                className="bg-white border border-gray-100 rounded-2xl p-5 hover:shadow-lg transition-all duration-300 cursor-pointer group flex flex-col md:flex-row gap-4 items-start md:items-center"
              >
                <div className="flex-grow">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xs font-mono font-medium text-gray-400 bg-gray-50 px-2 py-1 rounded">
                      #{ticket.ticketId}
                    </span>
                    <StatusBadge status={ticket.status} />
                    <PriorityBadge priority={ticket.priority} />
                  </div>
                  
                  <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-blue-700 transition-colors">
                    {ticket.subject}
                  </h3>
                  
                  <p className="text-sm text-gray-500 line-clamp-1 mb-3">
                    {ticket.category} {ticket.subcategory ? `> ${ticket.subcategory}` : ''}
                  </p>

                  <div className="flex items-center gap-4 text-xs text-gray-400 font-medium">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      Created {timeAgo(ticket.createdAt)}
                    </span>
                    {ticket.lastResponseAt && (
                      <span className="flex items-center gap-1 text-blue-500/80">
                        <AlertCircle className="w-3.5 h-3.5" />
                        Updated {timeAgo(ticket.lastResponseAt)}
                      </span>
                    )}
                  </div>
                </div>

                <div className="shrink-0 ml-auto md:ml-0 self-end md:self-center">
                  <Button variant="ghost" className="rounded-full w-10 h-10 p-0 text-gray-400 group-hover:text-[#D48035] group-hover:bg-orange-50 transition-colors">
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}
