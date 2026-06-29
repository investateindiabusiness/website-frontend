"use client";

import React, { useState, useEffect, useCallback } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuth } from '@/hooks/AuthContext';
import { apiRequest } from '@/api';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, TablePagination, Chip, Box, Typography, TextField, MenuItem,
  Select, FormControl, InputLabel, IconButton, Tooltip, Card,
  Avatar, Skeleton, InputAdornment
} from '@mui/material';
import {
  Search as SearchIcon, Refresh as RefreshIcon, Shield as ShieldIcon,
  CheckCircle as CheckCircleIcon, Cancel as CancelIcon, HourglassTop as HourglassIcon
} from '@mui/icons-material';

const ROLE_COLORS = {
  admin: 'error',
  builder: 'primary',
  investor: 'success',
  serviceProvider: 'warning',
};

const ROLE_LABELS = {
  admin: 'Admin',
  builder: 'Builder',
  investor: 'Investor',
  serviceProvider: 'Service Provider',
};

const STATUS_ICON = (status) => {
  if (status === 'complete') return <CheckCircleIcon sx={{ fontSize: 16, color: '#16a34a' }} />;
  if (status?.includes('pending') || status?.includes('review')) return <HourglassIcon sx={{ fontSize: 16, color: '#d97706' }} />;
  if (status?.includes('rejected')) return <CancelIcon sx={{ fontSize: 16, color: '#dc2626' }} />;
  return null;
};

const PAGE_SIZE_OPTIONS = [10, 20, 50];

const formatDate = (iso) => {
  if (!iso) return '—';
  return new Intl.DateTimeFormat('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(iso));
};

const getInitials = (name) => {
  if (!name) return '?';
  const parts = name.trim().split(' ');
  return (parts[0]?.[0] || '') + (parts[1]?.[0] || '');
};

export default function AdminUsersPage() {
  const { user } = useAuth();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [totalCount, setTotalCount] = useState(0);
  const [roleFilter, setRoleFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchInput, setSearchInput] = useState('');

  const fetchUsers = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page + 1,
        limit: rowsPerPage,
        ...(roleFilter !== 'all' && { role: roleFilter }),
        ...(searchQuery && { search: searchQuery }),
      });

      const data = await apiRequest(`/api/admin/users?${params.toString()}`);
      setRows(data.data || []);
      setTotalCount(data.pagination?.total || 0);
    } catch (err) {
      console.error('Failed to fetch users:', err);
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, [user, page, rowsPerPage, roleFilter, searchQuery]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(0);
      setSearchQuery(searchInput);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const handleChangePage = (_, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Header />
      <div className="flex-grow container mx-auto px-4 py-8 mt-16 md:mt-[4rem]">

        {/* Page Title */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <ShieldIcon style={{ fontSize: 28, color: '#0b264f' }} />
            User Management
          </h1>
          <p className="text-gray-500 text-sm mt-1">All registered users — investors, builders, and service providers.</p>
        </div>

        {/* Filters */}
        <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap', alignItems: 'center' }}>
          <TextField
            size="small"
            placeholder="Search by name, email or UID..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            sx={{ minWidth: 280 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" sx={{ color: '#9ca3af' }} />
                </InputAdornment>
              )
            }}
          />

          <FormControl size="small" sx={{ minWidth: 180 }}>
            <InputLabel>Role</InputLabel>
            <Select
              value={roleFilter}
              label="Role"
              onChange={(e) => { setRoleFilter(e.target.value); setPage(0); }}
            >
              <MenuItem value="all">All Roles</MenuItem>
              <MenuItem value="investor">Investor</MenuItem>
              <MenuItem value="builder">Builder</MenuItem>
              <MenuItem value="serviceProvider">Service Provider</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
            </Select>
          </FormControl>

          <Tooltip title="Refresh">
            <IconButton onClick={fetchUsers} disabled={loading} size="small" sx={{ ml: 'auto', border: '1px solid #e5e7eb' }}>
              <RefreshIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>

        {/* Table */}
        <Card variant="outlined" sx={{ borderRadius: 2, overflow: 'hidden' }}>
          <TableContainer component={Paper} elevation={0}>
            <Table stickyHeader size="small">
              <TableHead>
                <TableRow>
                  {['User', 'Email', 'Role', 'Status', 'Verified', 'Joined On'].map(col => (
                    <TableCell key={col} sx={{ fontWeight: 700, bgcolor: '#f8fafc', color: '#374151', fontSize: '0.72rem', letterSpacing: '0.05em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
                      {col}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>

              <TableBody>
                {loading ? (
                  Array.from({ length: rowsPerPage > 6 ? 6 : rowsPerPage }).map((_, i) => (
                    <TableRow key={i}>
                      {[1, 2, 3, 4, 5, 6].map(c => (
                        <TableCell key={c}><Skeleton variant="text" height={28} /></TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : rows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 8, color: '#6b7280' }}>
                      <Typography variant="body2" color="text.secondary">No users found.</Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  rows.map((row) => {
                    const displayName = row.fullName || row.companyName || row.email?.split('@')[0] || '—';
                    return (
                      <TableRow key={row.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                        {/* User Column */}
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Avatar sx={{ width: 32, height: 32, bgcolor: '#0b264f', fontSize: '0.7rem', fontWeight: 700 }}>
                              {getInitials(displayName).toUpperCase()}
                            </Avatar>
                            <Box>
                              <Typography variant="caption" sx={{ fontWeight: 700, color: '#1f2937', display: 'block', lineHeight: 1.2 }}>
                                {displayName}
                              </Typography>
                              <Typography variant="caption" sx={{ color: '#9ca3af', fontSize: '0.65rem', fontFamily: 'monospace' }}>
                                {row.uid || row.id}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>

                        <TableCell sx={{ fontSize: '0.8rem', color: '#4b5563', maxWidth: 220 }}>
                          <Typography noWrap variant="caption" sx={{ display: 'block', maxWidth: 200 }}>{row.email || '—'}</Typography>
                        </TableCell>

                        <TableCell>
                          <Chip
                            label={ROLE_LABELS[row.role] || row.role || 'N/A'}
                            color={ROLE_COLORS[row.role] || 'default'}
                            size="small"
                            sx={{ fontWeight: 700, fontSize: '0.68rem' }}
                          />
                        </TableCell>

                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            {STATUS_ICON(row.onboardingStatus)}
                            <Typography variant="caption" sx={{ color: '#6b7280', fontSize: '0.72rem', textTransform: 'capitalize' }}>
                              {(row.onboardingStatus || '—').replace(/_/g, ' ')}
                            </Typography>
                          </Box>
                        </TableCell>

                        <TableCell>
                          {row.isVerified === true ? (
                            <Chip label="Verified" color="success" size="small" sx={{ fontWeight: 700, fontSize: '0.68rem' }} />
                          ) : row.isVerified === false ? (
                            <Chip label="Unverified" color="default" size="small" sx={{ fontWeight: 700, fontSize: '0.68rem' }} />
                          ) : (
                            <Typography variant="caption" color="text.disabled">—</Typography>
                          )}
                        </TableCell>

                        <TableCell sx={{ fontSize: '0.8rem', color: '#6b7280', whiteSpace: 'nowrap' }}>
                          {formatDate(row.createdAt)}
                        </TableCell>
                      </TableRow>
                    );
                  })
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
            sx={{ borderTop: '1px solid #f3f4f6' }}
          />
        </Card>
      </div>
      <Footer />
    </div>
  );
}
