"use client";

import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import NewTicket from '@/components/support/NewTicket';

export default function GeneralNewTicketPage() {
  return (
    <div className="min-h-screen bg-gray-50/50 flex flex-col font-sans">
      <Header />
      <NewTicket />
      <Footer />
    </div>
  );
}
