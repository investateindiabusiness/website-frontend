"use client";

import React, { useState, useEffect, useCallback } from 'react';
import AppDataGrid from '@/components/AppDataGrid';
import { useAuth } from '@/hooks/AuthContext';
import { apiRequest } from '@/api';
import { toast } from '@/hooks/use-toast';
import {
  Chip, Box, Typography, Avatar, Tooltip, IconButton
} from '@mui/material';
import {
  VerifiedUser as KYCIcon,
  Refresh as RefreshIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  HourglassTop as HourglassIcon,
  Visibility as ViewIcon
} from '@mui/icons-material';
import { Button } from '@/components/ui/button';

const STATUS_CHIP = (status) => {
  if (status === 'approved') return <Chip icon={<CheckCircleIcon style={{ fontSize: 13 }} />} label="Approved" color="success" size="small" sx={{ fontWeight: 700, fontSize: '0.67rem' }} />;
  if (status === 'pending') return <Chip icon={<HourglassIcon style={{ fontSize: 13 }} />} label="Pending" color="warning" size="small" sx={{ fontWeight: 700, fontSize: '0.67rem' }} />;
  if (status === 'rejected') return <Chip icon={<CancelIcon style={{ fontSize: 13 }} />} label="Rejected" color="error" size="small" sx={{ fontWeight: 700, fontSize: '0.67rem' }} />;
  return <Chip label={status || '—'} size="small" sx={{ fontWeight: 700, fontSize: '0.67rem', textTransform: 'capitalize' }} />;
};

const formatDate = (iso) => {
  if (!iso) return '—';
  return new Intl.DateTimeFormat('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(iso));
};

const getInitials = (name) => {
  if (!name) return '?';
  const p = name.trim().split(' ');
  return ((p[0]?.[0] || '') + (p[1]?.[0] || '')).toUpperCase();
};

export default function AdminKycVerificationsPage() {
  const { user } = useAuth();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState('');
  const [filteredRows, setFilteredRows] = useState([]);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);

  const fetchSubmissions = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await apiRequest('/api/admin/kyc-submissions');
      if (data.success) {
        setRows(data.data || []);
      }
    } catch (err) {
      console.error(err);
      toast({ title: "Fetch Failed", description: "Failed to load KYC submissions list.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => { fetchSubmissions(); }, [fetchSubmissions]);

  // Handle Approve / Reject
  const handleVerify = async (uid, kycStatus) => {
    try {
      await apiRequest(`/api/admin/verify-kyc/${uid}`, {
        method: 'PATCH',
        body: JSON.stringify({ kycStatus })
      });
      toast({
        title: kycStatus === 'approved' ? "KYC Approved" : "KYC Rejected",
        description: `Investor KYC status has been updated to ${kycStatus}.`
      });
      fetchSubmissions();
    } catch (err) {
      toast({
        title: "Action Failed",
        description: err.message || "Failed to update verification status.",
        variant: "destructive"
      });
    }
  };

  // Search filtering in-memory
  useEffect(() => {
    const q = searchInput.trim().toLowerCase();
    setPage(0); // reset page on search
    if (!q) {
      setFilteredRows(rows);
    } else {
      const filtered = rows.filter(r => 
        (r.fullName || '').toLowerCase().includes(q) ||
        (r.email || '').toLowerCase().includes(q) ||
        (r.id || '').toLowerCase().includes(q)
      );
      setFilteredRows(filtered);
    }
  }, [searchInput, rows]);

  const COLUMNS = [
    {
      field: 'user',
      headerName: 'Investor',
      minWidth: 200,
      renderCell: ({ row }) => {
        const name = row.fullName || row.companyName || row.email?.split('@')[0] || '—';
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Avatar sx={{ width: 30, height: 30, bgcolor: '#0b264f', fontSize: '0.65rem', fontWeight: 800 }}>
              {getInitials(name)}
            </Avatar>
            <Box>
              <Typography variant="caption" sx={{ fontWeight: 700, color: '#111827', display: 'block', lineHeight: 1.2 }}>{name}</Typography>
              <Typography variant="caption" sx={{ color: '#9ca3af', fontSize: '0.65rem', fontFamily: 'monospace' }}>{row.id || row.uid}</Typography>
            </Box>
          </Box>
        );
      }
    },
    {
      field: 'email', headerName: 'Email', minWidth: 180,
      renderCell: ({ value }) => <Typography variant="caption" noWrap sx={{ display: 'block', maxWidth: 180, color: '#4b5563' }}>{value || '—'}</Typography>
    },
    {
      field: 'passportNumber',
      headerName: 'Passport Number',
      minWidth: 160,
      renderCell: ({ row }) => {
        const num = row.passportNumber || '—';
        const isDup = row.isDuplicatePassport;
        const dupUsers = row.duplicatePassportUsers || [];

        return (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="caption" sx={{ fontWeight: 700, color: '#374151', fontFamily: 'monospace' }}>
              {num}
            </Typography>
            {isDup && (
              <Tooltip
                title={
                  <Box sx={{ p: 0.5 }}>
                    <Typography variant="caption" sx={{ fontWeight: 800, display: 'block', mb: 0.5, color: '#ffc107' }}>
                      Duplicate Passport Number!
                    </Typography>
                    {dupUsers.map(du => (
                      <Typography key={du.uid} variant="caption" sx={{ display: 'block', fontSize: '0.7rem', color: '#fff' }}>
                        • {du.name || 'Unnamed'} ({du.email})
                      </Typography>
                    ))}
                  </Box>
                }
                arrow
              >
                <Chip
                  label="Duplicate"
                  size="small"
                  color="error"
                  sx={{
                    height: 18,
                    fontSize: '9px',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    cursor: 'help'
                  }}
                />
              </Tooltip>
            )}
          </Box>
        );
      }
    },
    {
      field: 'kycSubmittedAt', headerName: 'Submitted On', width: 160,
      renderCell: ({ value }) => <Typography variant="caption" sx={{ color: '#6b7280' }}>{formatDate(value)}</Typography>
    },
    {
      field: 'kycPassportUrl', headerName: 'Passport Copy', width: 140,
      renderCell: ({ value }) => {
        if (!value) return <Typography variant="caption" sx={{ color: 'gray' }}>No Document</Typography>;
        return (
          <Tooltip title="View Passport Copy">
            <IconButton 
              component="a" 
              href={value} 
              target="_blank" 
              rel="noreferrer"
              size="small" 
              sx={{ border: '1px solid #e5e7eb', color: '#0b264f' }}
            >
              <ViewIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        );
      }
    },
    {
      field: 'kycVisaUrl', headerName: 'Visa Copy', width: 140,
      renderCell: ({ row }) => {
        if (row.nriStatus !== 'NRI') return <Typography variant="caption" sx={{ color: 'gray' }}>N/A (Non-NRI)</Typography>;
        if (!row.kycVisaUrl) return <Typography variant="caption" sx={{ color: 'gray' }}>No Document</Typography>;
        return (
          <Tooltip title="View Visa Copy">
            <IconButton 
              component="a" 
              href={row.kycVisaUrl} 
              target="_blank" 
              rel="noreferrer"
              size="small" 
              sx={{ border: '1px solid #e5e7eb', color: '#0b264f' }}
            >
              <ViewIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        );
      }
    },
    {
      field: 'kycStatus', headerName: 'Status', width: 120,
      renderCell: ({ value }) => STATUS_CHIP(value)
    },
    {
      field: 'actions',
      headerName: 'Actions',
      minWidth: 200,
      renderCell: ({ row }) => {
        return (
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', height: '100%' }}>
            <Button
              onClick={() => handleVerify(row.id, 'approved')}
              disabled={row.kycStatus === 'approved'}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] uppercase font-black tracking-wider px-3 py-1.5 h-8 rounded-lg disabled:opacity-40"
            >
              Approve
            </Button>
            <Button
              onClick={() => handleVerify(row.id, 'rejected')}
              disabled={row.kycStatus === 'rejected'}
              className="bg-rose-600 hover:bg-rose-700 text-white text-[10px] uppercase font-black tracking-wider px-3 py-1.5 h-8 rounded-lg disabled:opacity-40"
            >
              Reject
            </Button>
          </Box>
        );
      }
    }
  ];

  // Manual pagination for in-memory filtered rows
  const paginatedRows = filteredRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <div className="flex-grow container mx-auto px-4 py-8">
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 800, color: '#0b264f', display: 'flex', alignItems: 'center', gap: 1 }}>
            <KYCIcon /> KYC Verifications Investor
          </Typography>
          <Typography variant="body2" sx={{ color: '#6b7280', mt: 0.5 }}>
            Manage and verify uploaded passport documents for investor accounts
          </Typography>
        </Box>
        <Tooltip title="Refresh">
          <span>
            <IconButton onClick={fetchSubmissions} disabled={loading} sx={{ border: '1px solid #e5e7eb' }}>
              <RefreshIcon fontSize="small" />
            </IconButton>
          </span>
        </Tooltip>
      </Box>

      <AppDataGrid
        columns={COLUMNS}
        rows={paginatedRows}
        total={filteredRows.length}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={(p) => setPage(p)}
        onRowsPerPageChange={(s) => { setRowsPerPage(s); setPage(0); }}
        loading={loading}
        searchValue={searchInput}
        onSearchChange={setSearchInput}
        searchPlaceholder="Search name, email or UID…"
        getRowId={(r) => r.id || r.uid}
        emptyMessage="No KYC submissions found."
      />
    </div>
  );
}
