"use client";

import React from 'react';
import PaymentsHistory from '@/components/PaymentsHistory';
import { Box, Typography } from '@mui/material';
import { Receipt as ReceiptIcon } from '@mui/icons-material';

export default function ServiceProviderPaymentsPage() {
  return (
    <div className="min-h-screen container mx-auto px-2 pb-4" style={{ minHeight: 'auto', paddingTop: 0 }}>
      <Box sx={{ mb: 3, mt: 0, pt: 0 }}>
        <Typography variant="h5" sx={{ fontWeight: 800, color: '#0b264f', display: 'flex', alignItems: 'center', gap: 1 }}>
          <ReceiptIcon /> Payment History
        </Typography>
        <Typography variant="body2" sx={{ color: '#6b7280', mt: 0.5 }}>
          All transactions linked to your service provider account.
        </Typography>
      </Box>
      <PaymentsHistory />
    </div>
  );
}
