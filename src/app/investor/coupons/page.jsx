"use client";

import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import MyCoupons from '@/components/MyCoupons';

export default function InvestorCouponsPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Header />
      <main className="flex-1 px-4 py-8 md:px-12 md:py-12 mt-16">
        <MyCoupons />
      </main>
      <Footer />
    </div>
  );
}
