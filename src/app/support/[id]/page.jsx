"use client";

import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import TicketDetail from '@/components/support/TicketDetail';

export default function GeneralTicketDetailPage() {
  return (
    <div className="min-h-screen bg-gray-50/50 flex flex-col font-sans">
      <Header />
      <TicketDetail />
      <Footer />
    </div>
  );
}
