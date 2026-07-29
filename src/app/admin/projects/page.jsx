"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import AppDataGrid from '@/components/AppDataGrid';
import { Button } from '@/components/ui/button';
import { Building2, Eye } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/AuthContext';
import { fetchAllProjects } from '@/api';
import { Chip, FormControl, InputLabel, Select, MenuItem, Box, Typography } from '@mui/material';

export default function AdminProjects() {
  const { user } = useAuth();
  const router = useRouter();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [total, setTotal] = useState(0);
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const loadProjects = useCallback(async () => {
    if (!user) return;
    try {
      setLoading(true);
      const params = { page: page + 1, limit: rowsPerPage };
      if (filter !== 'all') params.status = filter === 'pending' ? 'pending_any' : filter;
      if (searchQuery) params.search = searchQuery;
      const data = await fetchAllProjects(params);
      setProjects(data.data || []);
      setTotal(data.pagination?.total || 0);
    } catch (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }, [user, page, rowsPerPage, filter, searchQuery]);

  useEffect(() => { 
    if (user) loadProjects(); 
  }, [user, loadProjects]);

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => { setPage(0); setSearchQuery(searchInput); }, 400);
    return () => clearTimeout(t);
  }, [searchInput]);

  const PROJECT_STATUS_MAP = {
    pending: { label: 'Pending', color: 'warning' },
    approved: { label: 'Approved', color: 'success' },
    rejected: { label: 'Rejected', color: 'error' },
    changes_requested: { label: 'Changes Req.', color: 'default' },
  };

  const PROJECT_COLUMNS = [
    {
      field: 'projectName', headerName: 'Project', minWidth: 220,
      renderCell: ({ row }) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box sx={{ width: 32, height: 32, bgcolor: '#f0f9ff', borderRadius: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Building2 size={15} color="#0284c7" />
          </Box>
          <Box>
            <Typography variant="caption" sx={{ fontWeight: 700, color: '#111827', display: 'block' }}>{row.projectName || '—'}</Typography>
            <Typography variant="caption" sx={{ color: '#9ca3af', fontSize: '0.65rem' }}>{row.reraRegistrationNumber || '—'}</Typography>
          </Box>
        </Box>
      )
    },
    {
      field: 'builderName', headerName: 'Builder', width: 160,
      renderCell: ({ value }) => <Typography variant="caption" sx={{ color: '#4b5563' }}>{value || '—'}</Typography>
    },
    {
      field: 'projectLocation', headerName: 'Location', width: 140,
      renderCell: ({ value }) => <Typography variant="caption" sx={{ color: '#4b5563' }}>{value || '—'}</Typography>
    },
    {
      field: 'projectType', headerName: 'Type', width: 120,
      renderCell: ({ value }) => <Chip label={value || '—'} size="small" variant="outlined" sx={{ fontWeight: 600, fontSize: '0.67rem' }} />
    },
    {
      field: 'status', headerName: 'Status', width: 130,
      renderCell: ({ row }) => {
        if (row.hasPendingEdits) return <Chip label="Edits Pending" color="warning" size="small" sx={{ fontWeight: 700, fontSize: '0.67rem' }} />;
        const s = PROJECT_STATUS_MAP[row.status] || { label: row.status || '—', color: 'default' };
        return <Chip label={s.label} color={s.color} size="small" sx={{ fontWeight: 700, fontSize: '0.67rem' }} />;
      }
    },
    {
      field: 'actions', headerName: 'Actions', width: 100, align: 'right', stopPropagation: true,
      renderCell: ({ row }) => (
        <Button 
          onClick={() => router.push(`/admin/projects/${row.id}`)} 
          className="bg-gray-900 hover:bg-gray-800 text-white rounded-xl text-xs px-3 py-1.5"
        >
          <Eye className="w-3.5 h-3.5 mr-1" /> View
        </Button>
      )
    },
  ];

  return (
    <div className="flex-1 container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Manage Projects</h1>
          <p className="text-gray-600">{total.toLocaleString()} project{total !== 1 ? 's' : ''} total</p>
        </div>
      </div>

      <AppDataGrid
        columns={PROJECT_COLUMNS}
        rows={projects}
        total={total}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={(p) => setPage(p)}
        onRowsPerPageChange={(s) => { setRowsPerPage(s); setPage(0); }}
        loading={loading}
        searchValue={searchInput}
        onSearchChange={setSearchInput}
        searchPlaceholder="Search project name, builder, location…"
        filterSlot={
          <FormControl size="small" sx={{ minWidth: 160 }}>
            <InputLabel>Status</InputLabel>
            <Select value={filter} label="Status" onChange={(e) => { setFilter(e.target.value); setPage(0); }}>
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="approved">Approved</MenuItem>
              <MenuItem value="rejected">Rejected</MenuItem>
            </Select>
          </FormControl>
        }
        getRowId={(r) => r.id}
        emptyMessage="No projects found."
      />
    </div>
  );
}
