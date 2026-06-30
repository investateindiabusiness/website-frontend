"use client";

import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PaymentsHistory from '@/components/PaymentsHistory';
import { Box, Typography } from '@mui/material';
import { Receipt as ReceiptIcon } from '@mui/icons-material';

export default function ServiceProviderPaymentsPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Header />
      <div className="flex-grow container mx-auto px-4 py-8 mt-16 md:mt-[4rem]">
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" sx={{ fontWeight: 800, color: '#0b264f', display: 'flex', alignItems: 'center', gap: 1 }}>
            <ReceiptIcon /> Payment History
          </Typography>
          <Typography variant="body2" sx={{ color: '#6b7280', mt: 0.5 }}>
            All transactions linked to your service provider account.
          </Typography>
        </Box>
        <PaymentsHistory />
      </div>
      <Footer />
    </div>
  );
}
