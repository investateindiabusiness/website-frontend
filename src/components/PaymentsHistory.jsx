"use client";

import React, { useState, useEffect, useCallback } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, TablePagination, Chip, Tooltip, IconButton, Box,
  Typography, TextField, MenuItem, Select, FormControl, InputLabel,
  CircularProgress, Card, Skeleton
} from '@mui/material';
import { Refresh as RefreshIcon, Receipt as ReceiptIcon } from '@mui/icons-material';
import { useAuth } from '@/hooks/AuthContext';
import { apiRequest } from '@/api';

const STATUS_COLORS = {
  SUCCEEDED: 'success',
  PENDING: 'warning',
  PROCESSING: 'info',
  FAILED: 'error',
  CANCELLED: 'default',
  REFUNDED: 'secondary',
  CREATED: 'default',
};

const PAGE_SIZE_OPTIONS = [10, 20, 50];

const formatCurrency = (amount, currency = 'usd') => {
  const currencyMap = { usd: 'USD', inr: 'INR', gbp: 'GBP' };
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: currencyMap[currency?.toLowerCase()] || 'USD',
    minimumFractionDigits: 2,
  }).format(amount || 0);
};

const formatDate = (iso) => {
  if (!iso) return '—';
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  }).format(new Date(iso));
};

export default function PaymentsHistory({ userId = null }) {
  const { user } = useAuth();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [statusFilter, setStatusFilter] = useState('');
  const [purposeFilter, setPurposeFilter] = useState('');

  const fetchPayments = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page + 1,
        limit: rowsPerPage,
        ...(statusFilter && { status: statusFilter }),
        ...(purposeFilter && { paymentPurpose: purposeFilter }),
      });

      const data = await apiRequest(`/api/payments/history?${params.toString()}`);
      setRows(data.data || []);
      setTotalCount(data.pagination?.total || 0);
    } catch (err) {
      console.error('Failed to fetch payments:', err);
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, [user, page, rowsPerPage, statusFilter, purposeFilter]);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  const handleChangePage = (_, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); };
  const handleRefresh = () => { setPage(0); fetchPayments(); };

  return (
    <Box sx={{ width: '100%' }}>
      {/* Filters Row */}
      <Box sx={{ display: 'flex', gap: 2, mb: 2.5, flexWrap: 'wrap', alignItems: 'center' }}>
        <FormControl size="small" sx={{ minWidth: 160 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={statusFilter}
            label="Status"
            onChange={(e) => { setStatusFilter(e.target.value); setPage(0); }}
          >
            <MenuItem value="">All Statuses</MenuItem>
            {['CREATED', 'PENDING', 'PROCESSING', 'SUCCEEDED', 'FAILED', 'CANCELLED', 'REFUNDED'].map(s => (
              <MenuItem key={s} value={s}>{s.charAt(0) + s.slice(1).toLowerCase()}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 180 }}>
          <InputLabel>Purpose</InputLabel>
          <Select
            value={purposeFilter}
            label="Purpose"
            onChange={(e) => { setPurposeFilter(e.target.value); setPage(0); }}
          >
            <MenuItem value="">All Purposes</MenuItem>
            {['ADVERTISEMENT', 'USER_REGISTRATION', 'BUILDER_REGISTRATION', 'INVESTOR_REGISTRATION', 'SUBSCRIPTION'].map(p => (
              <MenuItem key={p} value={p}>{p.replace(/_/g, ' ')}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <Tooltip title="Refresh">
          <span>
            <IconButton onClick={handleRefresh} disabled={loading} size="small" sx={{ ml: 'auto' }}>
              <RefreshIcon fontSize="small" />
            </IconButton>
          </span>
        </Tooltip>
      </Box>

      {/* Table */}
      <Card variant="outlined" sx={{ borderRadius: 2, overflow: 'hidden' }}>
        <TableContainer component={Paper} elevation={0}>
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 700, bgcolor: '#f8fafc', color: '#374151', fontSize: '0.75rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Payment #</TableCell>
                <TableCell sx={{ fontWeight: 700, bgcolor: '#f8fafc', color: '#374151', fontSize: '0.75rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Date</TableCell>
                <TableCell sx={{ fontWeight: 700, bgcolor: '#f8fafc', color: '#374151', fontSize: '0.75rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Purpose</TableCell>
                <TableCell sx={{ fontWeight: 700, bgcolor: '#f8fafc', color: '#374151', fontSize: '0.75rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Amount</TableCell>
                <TableCell sx={{ fontWeight: 700, bgcolor: '#f8fafc', color: '#374151', fontSize: '0.75rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 700, bgcolor: '#f8fafc', color: '#374151', fontSize: '0.75rem', letterSpacing: '0.05em', textTransform: 'uppercase' }} align="center">Receipt</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                Array.from({ length: rowsPerPage }).map((_, i) => (
                  <TableRow key={i}>
                    {[1, 2, 3, 4, 5, 6].map(c => (
                      <TableCell key={c}><Skeleton variant="text" height={28} /></TableCell>
                    ))}
                  </TableRow>
                ))
              ) : rows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 6, color: '#6b7280' }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                      <ReceiptIcon sx={{ fontSize: 40, color: '#d1d5db' }} />
                      <Typography variant="body2" color="text.secondary">No payment records found.</Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                rows.map((row) => (
                  <TableRow key={row.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <TableCell sx={{ fontWeight: 600, fontFamily: 'monospace', fontSize: '0.8rem', color: '#1f2937' }}>
                      {row.paymentNumber || row.id?.slice(0, 10) + '...'}
                    </TableCell>
                    <TableCell sx={{ fontSize: '0.8rem', color: '#4b5563', whiteSpace: 'nowrap' }}>
                      {formatDate(row.createdAt)}
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <Typography variant="caption" sx={{ fontWeight: 600, color: '#1f2937', lineHeight: 1.3 }}>
                          {(row.paymentPurpose || '').replace(/_/g, ' ')}
                        </Typography>
                        {row.referenceType && (
                          <Typography variant="caption" sx={{ color: '#9ca3af', fontSize: '0.7rem' }}>
                            {row.referenceType}
                          </Typography>
                        )}
                      </Box>
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#0b264f', whiteSpace: 'nowrap' }}>
                      {formatCurrency(row.amount, row.currency)}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={row.status || 'N/A'}
                        color={STATUS_COLORS[row.status] || 'default'}
                        size="small"
                        sx={{ fontWeight: 700, fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.03em' }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      {row.receiptUrl ? (
                        <Tooltip title="View Receipt">
                          <IconButton size="small" href={row.receiptUrl} target="_blank" rel="noopener noreferrer" sx={{ color: '#D48035' }}>
                            <ReceiptIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      ) : (
                        <Typography variant="caption" color="text.disabled">—</Typography>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          component="div"
          count={totalCount}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={PAGE_SIZE_OPTIONS}
          labelRowsPerPage="Rows per page:"
          sx={{ borderTop: '1px solid #f3f4f6', '& .MuiTablePagination-select': { fontWeight: 600 } }}
        />
      </Card>
    </Box>
  );
}
