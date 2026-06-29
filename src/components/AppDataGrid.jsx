"use client";

/**
 * AppDataGrid — Global reusable MUI data table for Investate India.
 * Features: server-side pagination, skeleton loading, empty state,
 * search, filter slots, custom cell renderers, row click, action column.
 *
 * Props:
 *  columns          Array<{ field, headerName, width?, flex?, renderCell?, align? }>
 *  rows             Array<object>  — current page data
 *  total            number         — total record count (for server-side pagination)
 *  page             number         — 0-indexed current page
 *  rowsPerPage      number         — current page size
 *  onPageChange     (newPage) => void
 *  onRowsPerPageChange (newSize) => void
 *  loading          boolean
 *  searchValue      string
 *  onSearchChange   (value) => void
 *  searchPlaceholder string
 *  filterSlot       ReactNode      — optional extra filter controls
 *  onRowClick       (row) => void
 *  rowsPerPageOptions  number[]    — default [10, 20, 50]
 *  size             'small'|'medium'
 *  emptyMessage     string
 *  getRowId         (row) => string|number
 *  stickyHeader     boolean
 */

import React from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, TablePagination, Box, Typography, TextField, Skeleton,
  InputAdornment, Card, Tooltip
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';

const PAGE_SIZE_OPTIONS = [10, 20, 50];

const HEADER_CELL_SX = {
  fontWeight: 700,
  bgcolor: '#f8fafc',
  color: '#374151',
  fontSize: '0.72rem',
  letterSpacing: '0.06em',
  textTransform: 'uppercase',
  whiteSpace: 'nowrap',
  borderBottom: '2px solid #e5e7eb',
  py: 1.5,
};

const BODY_CELL_SX = {
  fontSize: '0.82rem',
  color: '#374151',
  py: 1.25,
  borderBottom: '1px solid #f3f4f6',
};

export default function AppDataGrid({
  columns = [],
  rows = [],
  total = 0,
  page = 0,
  rowsPerPage = 20,
  onPageChange,
  onRowsPerPageChange,
  loading = false,
  searchValue = '',
  onSearchChange,
  searchPlaceholder = 'Search…',
  filterSlot,
  onRowClick,
  rowsPerPageOptions = PAGE_SIZE_OPTIONS,
  size = 'small',
  emptyMessage = 'No records found.',
  getRowId = (row) => row.id,
  stickyHeader = true,
}) {
  const skeletonRows = Math.min(rowsPerPage, 8);

  return (
    <Box sx={{ width: '100%' }}>
      {/* ── Toolbar: search + filters ── */}
      {(onSearchChange || filterSlot) && (
        <Box sx={{ display: 'flex', gap: 2, mb: 2.5, flexWrap: 'wrap', alignItems: 'center' }}>
          {onSearchChange && (
            <TextField
              size="small"
              placeholder={searchPlaceholder}
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              sx={{ minWidth: 260 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" sx={{ color: '#9ca3af' }} />
                  </InputAdornment>
                ),
              }}
            />
          )}
          {filterSlot}
        </Box>
      )}

      {/* ── Table card ── */}
      <Card variant="outlined" sx={{ borderRadius: 2, overflow: 'hidden' }}>
        <TableContainer component={Paper} elevation={0}>
          <Table stickyHeader={stickyHeader} size={size}>
            {/* Header */}
            <TableHead>
              <TableRow>
                {columns.map((col) => (
                  <TableCell
                    key={col.field}
                    align={col.align || 'left'}
                    sx={{
                      ...HEADER_CELL_SX,
                      width: col.width,
                      minWidth: col.minWidth,
                      flex: col.flex,
                    }}
                  >
                    {col.headerName}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            {/* Body */}
            <TableBody>
              {loading ? (
                Array.from({ length: skeletonRows }).map((_, i) => (
                  <TableRow key={`sk-${i}`}>
                    {columns.map((col) => (
                      <TableCell key={col.field} sx={BODY_CELL_SX}>
                        <Skeleton variant="text" height={22} width="85%" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : rows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={columns.length} align="center" sx={{ py: 8 }}>
                    <Typography variant="body2" color="text.secondary">
                      {emptyMessage}
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                rows.map((row) => (
                  <TableRow
                    key={getRowId(row)}
                    hover
                    onClick={onRowClick ? () => onRowClick(row) : undefined}
                    sx={{
                      cursor: onRowClick ? 'pointer' : 'default',
                      '&:last-child td, &:last-child th': { border: 0 },
                      '&:hover': { bgcolor: '#f9fafb' },
                    }}
                  >
                    {columns.map((col) => (
                      <TableCell
                        key={col.field}
                        align={col.align || 'left'}
                        sx={{ ...BODY_CELL_SX, width: col.width, minWidth: col.minWidth }}
                        onClick={col.stopPropagation ? (e) => e.stopPropagation() : undefined}
                      >
                        {col.renderCell
                          ? col.renderCell({ row, value: row[col.field] })
                          : (
                            <Tooltip title={String(row[col.field] ?? '')} placement="top-start" disableHoverListener={String(row[col.field] ?? '').length < 40}>
                              <Typography
                                variant="caption"
                                sx={{
                                  display: 'block',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: col.wrap ? 'normal' : 'nowrap',
                                  maxWidth: col.width || col.maxWidth || 240,
                                  fontSize: 'inherit',
                                  color: 'inherit',
                                }}
                              >
                                {row[col.field] !== undefined && row[col.field] !== null ? String(row[col.field]) : '—'}
                              </Typography>
                            </Tooltip>
                          )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination */}
        <TablePagination
          component="div"
          count={total}
          page={page}
          onPageChange={(_, newPage) => onPageChange?.(newPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => onRowsPerPageChange?.(parseInt(e.target.value, 10))}
          rowsPerPageOptions={rowsPerPageOptions}
          labelRowsPerPage="Rows per page:"
          sx={{
            borderTop: '1px solid #f3f4f6',
            '& .MuiTablePagination-select': { fontWeight: 600 },
            '& .MuiTablePagination-displayedRows': { fontSize: '0.8rem' },
          }}
        />
      </Card>
    </Box>
  );
}
