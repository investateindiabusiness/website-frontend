"use client";

import React from 'react';
import PaymentsHistory from '@/components/PaymentsHistory';
import { Box, Typography } from '@mui/material';
import { Receipt as ReceiptIcon } from '@mui/icons-material';

export default function InvestorPaymentsPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <div className="flex-grow w-full max-w-7xl mx-auto px-4 pb-8 pt-6">
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" sx={{ fontWeight: 800, color: '#0b264f', display: 'flex', alignItems: 'center', gap: 1 }}>
            <ReceiptIcon /> Payment History
          </Typography>
          <Typography variant="body2" sx={{ color: '#6b7280', mt: 0.5 }}>
            All transactions linked to your investor account.
          </Typography>
        </Box>
        <PaymentsHistory />
      </div>
    </div>
  );
}
