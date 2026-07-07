"use client";

import React, { useState, useEffect, useCallback } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AppDataGrid from '@/components/AppDataGrid';
import { useAuth } from '@/hooks/AuthContext';
import { apiRequest } from '@/api';
import {
  Chip, Box, Typography, Avatar, FormControl, InputLabel,
  Select, MenuItem, IconButton, Tooltip
} from '@mui/material';
import {
  Shield as ShieldIcon,
  Refresh as RefreshIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  HourglassTop as HourglassIcon,
} from '@mui/icons-material';

const ROLE_COLORS = { admin: 'error', builder: 'primary', investor: 'success', serviceProvider: 'warning' };
const ROLE_LABELS = { admin: 'Admin', builder: 'Builder', investor: 'Investor', serviceProvider: 'Service Provider' };

const formatDate = (iso) => {
  if (!iso) return '—';
  return new Intl.DateTimeFormat('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(iso));
};

const getInitials = (name) => {
  if (!name) return '?';
  const p = name.trim().split(' ');
  return ((p[0]?.[0] || '') + (p[1]?.[0] || '')).toUpperCase();
};

const STATUS_CHIP = (status) => {
  if (status === 'complete') return <Chip icon={<CheckCircleIcon style={{ fontSize: 13 }} />} label="Complete" color="success" size="small" sx={{ fontWeight: 700, fontSize: '0.67rem' }} />;
  if (status?.includes('pending')) return <Chip icon={<HourglassIcon style={{ fontSize: 13 }} />} label={status.replace(/_/g, ' ')} color="warning" size="small" sx={{ fontWeight: 700, fontSize: '0.67rem', textTransform: 'capitalize' }} />;
  if (status?.includes('rejected')) return <Chip icon={<CancelIcon style={{ fontSize: 13 }} />} label="Rejected" color="error" size="small" sx={{ fontWeight: 700, fontSize: '0.67rem' }} />;
  return <Chip label={status || '—'} size="small" sx={{ fontWeight: 700, fontSize: '0.67rem', textTransform: 'capitalize' }} />;
};

const COLUMNS = [
  {
    field: 'user',
    headerName: 'User',
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
            <Typography variant="caption" sx={{ color: '#9ca3af', fontSize: '0.65rem', fontFamily: 'monospace' }}>{row.uid || row.id}</Typography>
          </Box>
        </Box>
      );
    }
  },
  {
    field: 'email', headerName: 'Email', minWidth: 200,
    renderCell: ({ value }) => <Typography variant="caption" noWrap sx={{ display: 'block', maxWidth: 200, color: '#4b5563' }}>{value || '—'}</Typography>
  },
  {
    field: 'role', headerName: 'Role', width: 140,
    renderCell: ({ value }) => <Chip label={ROLE_LABELS[value] || value || 'N/A'} color={ROLE_COLORS[value] || 'default'} size="small" sx={{ fontWeight: 700, fontSize: '0.67rem' }} />
  },
  {
    field: 'onboardingStatus', headerName: 'Status', width: 150,
    renderCell: ({ value }) => STATUS_CHIP(value)
  },
  {
    field: 'isVerified', headerName: 'Verified', width: 100,
    renderCell: ({ value }) => value === true
      ? <Chip label="Verified" color="success" size="small" sx={{ fontWeight: 700, fontSize: '0.67rem' }} />
      : <Chip label="No" size="small" variant="outlined" sx={{ fontWeight: 700, fontSize: '0.67rem' }} />
  },
  {
    field: 'createdAt', headerName: 'Joined', width: 110,
    renderCell: ({ value }) => <Typography variant="caption" sx={{ color: '#6b7280' }}>{formatDate(value)}</Typography>
  },
];

export default function AdminUsersPage() {
  const { user } = useAuth();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [total, setTotal] = useState(0);
  const [roleFilter, setRoleFilter] = useState('all');
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchUsers = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const params = { page: page + 1, limit: rowsPerPage };
      if (roleFilter !== 'all') params.role = roleFilter;
      if (searchQuery) params.search = searchQuery;
      const data = await apiRequest(`/api/admin/users?${new URLSearchParams(params)}`);
      setRows(data.data || []);
      setTotal(data.pagination?.total || 0);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [user, page, rowsPerPage, roleFilter, searchQuery]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => { setPage(0); setSearchQuery(searchInput); }, 400);
    return () => clearTimeout(t);
  }, [searchInput]);

  return (
    <div className="">
      <div className="flex-grow container mx-auto px-4 py-8">
        <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 800, color: '#0b264f', display: 'flex', alignItems: 'center', gap: 1 }}>
              <ShieldIcon /> User Management
            </Typography>
            <Typography variant="body2" sx={{ color: '#6b7280', mt: 0.5 }}>
              {total.toLocaleString()} total registered users
            </Typography>
          </Box>
          <Tooltip title="Refresh">
            <span>
              <IconButton onClick={fetchUsers} disabled={loading} sx={{ border: '1px solid #e5e7eb' }}>
                <RefreshIcon fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>
        </Box>

        <AppDataGrid
          columns={COLUMNS}
          rows={rows}
          total={total}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={(p) => setPage(p)}
          onRowsPerPageChange={(s) => { setRowsPerPage(s); setPage(0); }}
          loading={loading}
          searchValue={searchInput}
          onSearchChange={setSearchInput}
          searchPlaceholder="Search name, email or UID…"
          filterSlot={
            <FormControl size="small" sx={{ minWidth: 180 }}>
              <InputLabel>Role</InputLabel>
              <Select value={roleFilter} label="Role" onChange={(e) => { setRoleFilter(e.target.value); setPage(0); }}>
                <MenuItem value="all">All Roles</MenuItem>
                <MenuItem value="investor">Investor</MenuItem>
                <MenuItem value="builder">Builder</MenuItem>
                <MenuItem value="serviceProvider">Service Provider</MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
              </Select>
            </FormControl>
          }
          getRowId={(r) => r.id || r.uid}
          emptyMessage="No users found."
        />
      </div>
    </div>
  );
}
