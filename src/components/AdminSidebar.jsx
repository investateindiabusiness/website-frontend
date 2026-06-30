"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/AuthContext';
import {
  Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText,
  Box, Avatar, Typography, Divider, IconButton, Tooltip, Collapse,
  useMediaQuery, useTheme
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Construction as BuilderIcon,
  AccountBalance as InvestorIcon,
  Business as ServiceProviderIcon,
  People as UsersIcon,
  Apartment as ProjectsIcon,
  TrendingUp as LeadsIcon,
  Inbox as InquiriesIcon,
  SupportAgent as HelpdeskIcon,
  Email as NewsletterIcon,
  CampaignOutlined as AdsIcon,
  LocalOffer as CouponsIcon,
  Logout as LogoutIcon,
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
} from '@mui/icons-material';

const DRAWER_WIDTH = 240;
const DRAWER_COLLAPSED = 64;

const NAV_ITEMS = [
  { label: 'Dashboard',        path: '/admin/dashboard',        icon: <DashboardIcon /> },
  { label: 'Builders',         path: '/admin/builders',          icon: <BuilderIcon /> },
  { label: 'Investors',        path: '/admin/investors',         icon: <InvestorIcon /> },
  { label: 'Service Providers',path: '/admin/service-providers', icon: <ServiceProviderIcon /> },
  { label: 'Users',            path: '/admin/users',             icon: <UsersIcon /> },
  { label: 'Projects',         path: '/admin/projects',          icon: <ProjectsIcon /> },
  { label: 'Leads',            path: '/admin/leads',             icon: <LeadsIcon /> },
  { label: 'Inquiries',        path: '/admin/inquiries',         icon: <InquiriesIcon /> },
  { label: 'Helpdesk',         path: '/admin/helpdesk',          icon: <HelpdeskIcon /> },
  { label: 'Advertisements',   path: '/admin/advertisements',    icon: <AdsIcon /> },
  { label: 'Newsletter',       path: '/admin/newsletter',        icon: <NewsletterIcon /> },
  { label: 'Coupons',          path: '/admin/coupons',           icon: <CouponsIcon /> },
];

export default function AdminSidebar({ children }) {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const drawerWidth = collapsed ? DRAWER_COLLAPSED : DRAWER_WIDTH;

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const drawerContent = (
    <Box sx={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      bgcolor: '#0f172a',
      color: 'white',
      overflow: 'hidden'
    }}>
      {/* Header */}
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: collapsed ? 'center' : 'space-between',
        px: collapsed ? 1 : 2,
        py: 1.5,
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        minHeight: 64,
      }}>
        {!collapsed && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <img src="/logo-small-white.png" alt="Logo" style={{ height: 40, objectFit: 'contain' }} />
          </Box>
        )}
        <IconButton
          onClick={() => setCollapsed(prev => !prev)}
          sx={{ color: 'rgba(255,255,255,0.6)', '&:hover': { color: '#D48035', bgcolor: 'rgba(212,128,53,0.1)' } }}
          size="small"
        >
          {collapsed ? <MenuIcon fontSize="small" /> : <ChevronLeftIcon fontSize="small" />}
        </IconButton>
      </Box>

      {/* User Info */}
      {!collapsed && (
        <Box sx={{ px: 2, py: 2, borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Avatar sx={{ width: 36, height: 36, bgcolor: '#D48035', fontSize: '0.85rem', fontWeight: 700 }}>
              {(user?.name || 'A')[0].toUpperCase()}
            </Avatar>
            <Box>
              <Typography variant="caption" sx={{ fontWeight: 700, color: 'white', display: 'block', lineHeight: 1.3 }}>
                {user?.name || 'Admin'}
              </Typography>
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.65rem' }}>
                Administrator
              </Typography>
            </Box>
          </Box>
        </Box>
      )}

      {/* Nav Items */}
      <Box sx={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', py: 1 }}>
        <List dense disablePadding>
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.path || pathname.startsWith(item.path + '/');
            return (
              <ListItem key={item.path} disablePadding sx={{ display: 'block', mb: 0.5 }}>
                <Tooltip title={collapsed ? item.label : ''} placement="right" arrow>
                  <ListItemButton
                    component={Link}
                    href={item.path}
                    onClick={() => setMobileOpen(false)}
                    sx={{
                      mx: 1,
                      borderRadius: 2,
                      minHeight: 44,
                      justifyContent: collapsed ? 'center' : 'flex-start',
                      px: collapsed ? 1 : 1.5,
                      bgcolor: isActive ? 'rgba(212,128,53,0.15)' : 'transparent',
                      borderLeft: isActive ? '3px solid #D48035' : '3px solid transparent',
                      '&:hover': {
                        bgcolor: isActive ? 'rgba(212,128,53,0.2)' : 'rgba(255,255,255,0.05)',
                      },
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: collapsed ? 0 : 36,
                        color: isActive ? '#D48035' : 'rgba(255,255,255,0.5)',
                        '& .MuiSvgIcon-root': { fontSize: 20 },
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>
                    {!collapsed && (
                      <ListItemText
                        primary={item.label}
                        slotProps={{
                          primary: {
                            fontSize: '0.82rem',
                            fontWeight: isActive ? 700 : 500,
                            color: isActive ? '#D48035' : 'rgba(255,255,255,0.75)',
                            noWrap: true,
                          }
                        }}
                      />
                    )}
                  </ListItemButton>
                </Tooltip>
              </ListItem>
            );
          })}
        </List>
      </Box>

      {/* Logout */}
      <Box sx={{ borderTop: '1px solid rgba(255,255,255,0.08)', p: 1 }}>
        <Tooltip title={collapsed ? 'Logout' : ''} placement="right" arrow>
          <ListItemButton
            onClick={handleLogout}
            sx={{
              borderRadius: 2,
              justifyContent: collapsed ? 'center' : 'flex-start',
              px: collapsed ? 1 : 1.5,
              '&:hover': { bgcolor: 'rgba(239,68,68,0.1)' },
            }}
          >
            <ListItemIcon sx={{ minWidth: collapsed ? 0 : 36, color: 'rgba(239,68,68,0.7)' }}>
              <LogoutIcon sx={{ fontSize: 20 }} />
            </ListItemIcon>
            {!collapsed && (
              <ListItemText
                primary="Logout"
                slotProps={{
                  primary: { fontSize: '0.82rem', fontWeight: 600, color: 'rgba(239,68,68,0.85)' }
                }}
              />
            )}
          </ListItemButton>
        </Tooltip>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f8fafc' }}>
      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { width: DRAWER_WIDTH, boxSizing: 'border-box', border: 'none' },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Desktop Drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            border: 'none',
            transition: 'width 0.25s ease',
            overflowX: 'hidden',
          },
        }}
        open
      >
        {drawerContent}
      </Drawer>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          transition: 'margin-left 0.25s ease',
        }}
      >
        {/* Mobile top bar */}
        <Box sx={{
          display: { xs: 'flex', md: 'none' },
          alignItems: 'center',
          px: 2, py: 1.5,
          bgcolor: '#0f172a',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          position: 'sticky', top: 0, zIndex: 100,
        }}>
          <IconButton onClick={() => setMobileOpen(true)} sx={{ color: 'white', mr: 2 }}>
            <MenuIcon />
          </IconButton>
          <img src="/logo-small-white.png" alt="Logo" style={{ height: 36, objectFit: 'contain' }} />
        </Box>

        {/* Page Content */}
        <Box sx={{ flex: 1, p: { xs: 2, md: 3 } }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
}
