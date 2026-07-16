"use client";

import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SupportDashboard from '@/components/support/SupportDashboard';

export default function GeneralSupportPage() {
  return (
    <div className="min-h-screen bg-gray-50/50 flex flex-col font-sans">
      <Header />
      <SupportDashboard />
      <Footer />
    </div>
  );
}
