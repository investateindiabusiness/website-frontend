"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/AuthContext';
import { fetchAllTickets } from '@/api';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { Search, Clock, ArrowRight, Loader2, MessageSquare, AlertCircle } from 'lucide-react';

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

export default function AdminHelpdesk() {
  const router = useRouter();
  const { user } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');

  useEffect(() => {
    if (!user) {
      router.push('/admin/login');
      return;
    }

    const loadTickets = async () => {
      try {
        setLoading(true);

        let apiTickets = [];
        try {
          const res = await fetchAllTickets(filterStatus !== 'ALL' ? { status: filterStatus } : {});
          apiTickets = res.data || [];
        } catch (apiErr) {
          console.warn("API load failed, falling back to local mock storage:", apiErr);
        }

        const isDev = typeof window !== 'undefined' &&
          (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
        if (isDev) {
          const mockTickets = JSON.parse(localStorage.getItem('mock_tickets') || '[]');
          setTickets([...mockTickets, ...apiTickets]);
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
  }, [user, router, filterStatus]);

  const filteredTickets = tickets.filter(ticket => {
    if (!searchQuery.trim()) return true;
    // Strip leading '#' so users can type either '#TKT-001' or 'TKT-001'
    const query = searchQuery.trim().replace(/^#/, '').toLowerCase();
    const matchesSearch =
      String(ticket.ticketId || '').toLowerCase().includes(query) ||
      String(ticket.id || '').toLowerCase().includes(query) ||
      (ticket.subject || '').toLowerCase().includes(query) ||
      (ticket.userName || '').toLowerCase().includes(query) ||
      (ticket.userEmail || '').toLowerCase().includes(query) ||
      (ticket.category || '').toLowerCase().includes(query);
    return matchesSearch;
  });

  const statuses = ['ALL', 'OPEN', 'IN_PROGRESS', 'WAITING_FOR_USER', 'RESOLVED', 'CLOSED', 'ESCALATED'];

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50/50 flex flex-col font-sans">
      <Header />

      <main className="flex-grow mt-[4rem] md:mt-[5rem] pb-12 px-4 md:px-8 max-w-7xl mx-auto w-full">

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Helpdesk Administration</h1>
            <p className="text-gray-500 mt-1">Manage and respond to all investor and builder support tickets.</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-8 flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search ID, subject, user name..."
              className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl leading-5 bg-gray-50 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors sm:text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex overflow-x-auto gap-2 pb-2 md:pb-0 scrollbar-hide shrink-0 items-center">
            {statuses.map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${filterStatus === status
                  ? 'bg-[#0b264f] text-white border-[#0b264f] shadow-md'
                  : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                  }`}
              >
                {status.replace(/_/g, ' ')}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-10 h-10 text-orange-500 animate-spin mb-4" />
            <p className="text-gray-500 animate-pulse">Loading tickets...</p>
          </div>
        ) : filteredTickets.length === 0 ? (
          <div className="bg-white rounded-3xl border border-dashed border-gray-200 p-12 text-center flex flex-col items-center justify-center">
            <div className="bg-orange-50 p-4 rounded-full mb-4">
              <MessageSquare className="w-8 h-8 text-orange-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No tickets found</h3>
            <p className="text-gray-500 max-w-sm mb-6">
              There are no tickets matching your current filters.
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Ticket</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">User</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status / Priority</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Last Updated</th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTickets.map((ticket) => (
                  <tr key={ticket.id} className="hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => router.push(`/admin/helpdesk/${ticket.id}`)}>
                    <td className="px-6 py-4">
                      <div className="text-sm font-bold text-gray-900 mb-1">{ticket.subject}</div>
                      <div className="text-xs text-gray-500 font-mono">#{ticket.ticketId} • {ticket.category}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{ticket.userName}</div>
                      <div className="text-xs text-gray-500">{ticket.userEmail}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-2 items-start">
                        <StatusBadge status={ticket.status} />
                        <PriorityBadge priority={ticket.priority} />
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center gap-1.5">
                        <AlertCircle className="w-3.5 h-3.5 text-blue-400" />
                        {timeAgo(ticket.lastResponseAt || ticket.createdAt)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Button variant="ghost" className="text-blue-600 hover:text-blue-900">
                        View
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}
