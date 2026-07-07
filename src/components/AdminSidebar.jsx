"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/AuthContext';
import NotificationBell from './NotificationBell';
import { apiRequest } from '@/api';
import { User, Pencil, Crown, X, Loader2 } from 'lucide-react';
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
  VerifiedUser as KYCIcon,
  CardMembership as MembershipIcon,
  Forum as OutreachIcon,
  ContactMail as DirectoryIcon,
<<<<<<< HEAD
  CardGiftcard as ReferralsIcon,
=======
>>>>>>> 5627b10a2105b23a802352e1ccd8df8ffd4e1612
} from '@mui/icons-material';

const DRAWER_WIDTH = 240;
const DRAWER_COLLAPSED = 64;

const NAV_ITEMS_BY_ROLE = {
  admin: [
    { label: 'Dashboard',        path: '/admin/dashboard',        icon: <DashboardIcon /> },
    { label: 'Builders',         path: '/admin/builders',          icon: <BuilderIcon /> },
    { label: 'Investors',        path: '/admin/investors',         icon: <InvestorIcon /> },
    { label: 'KYC Verifications Investor', path: '/admin/kyc-verifications', icon: <KYCIcon /> },
    { label: 'Service Providers',path: '/admin/service-providers', icon: <ServiceProviderIcon /> },
    { label: 'SP Outreach',      path: '/admin/sp-outreach',       icon: <OutreachIcon /> },
    { label: 'Users',            path: '/admin/users',             icon: <UsersIcon /> },
    { label: 'Projects',         path: '/admin/projects',          icon: <ProjectsIcon /> },
    { label: 'Leads',            path: '/admin/leads',             icon: <LeadsIcon /> },
    { label: 'Inquiries',        path: '/admin/inquiries',         icon: <InquiriesIcon /> },
    { label: 'Helpdesk',         path: '/admin/helpdesk',          icon: <HelpdeskIcon /> },
    { label: 'Advertisements',   path: '/admin/advertisements',    icon: <AdsIcon /> },
    { label: 'Newsletter',       path: '/admin/newsletter',        icon: <NewsletterIcon /> },
    { label: 'Coupons',          path: '/admin/coupons',           icon: <CouponsIcon /> },
<<<<<<< HEAD
    { label: 'Referrals',        path: '/admin/referrals',         icon: <ReferralsIcon /> },
=======
>>>>>>> 5627b10a2105b23a802352e1ccd8df8ffd4e1612
    { label: 'Membership Pricing', path: '/admin/membership-pricing', icon: <MembershipIcon /> },
  ],
  builder: [
    { label: 'Dashboard',     path: '/builder/dashboard',       icon: <DashboardIcon /> },
    { label: 'Projects',      path: '/builder/projects',        icon: <ProjectsIcon /> },
    { label: 'Advertise',     path: '/builder/advertisements',  icon: <AdsIcon /> },
    { label: 'Payments',      path: '/builder/payments',        icon: <LeadsIcon /> },
<<<<<<< HEAD
    { label: 'Referrals',     path: '/builder/referrals',      icon: <ReferralsIcon /> },
=======
>>>>>>> 5627b10a2105b23a802352e1ccd8df8ffd4e1612
    { label: 'Coupons',       path: '/builder/coupons',         icon: <CouponsIcon /> },
    { label: 'SP Inbox',      path: '/builder/outreach-inbox',  icon: <OutreachIcon /> },
  ],
  investor: [
    { label: 'Dashboard',     path: '/dashboard',              icon: <DashboardIcon /> },
    { label: 'Properties',    path: '/properties',             icon: <ProjectsIcon /> },
    { label: 'KYC Verification', path: '/investor/kyc',         icon: <KYCIcon /> },
    { label: 'Advertise',     path: '/investor/advertisements',icon: <AdsIcon /> },
<<<<<<< HEAD
    { label: 'Referrals',     path: '/investor/referrals',     icon: <ReferralsIcon /> },
=======
>>>>>>> 5627b10a2105b23a802352e1ccd8df8ffd4e1612
    { label: 'Payments',      path: '/investor/payments',      icon: <LeadsIcon /> },
    { label: 'Coupons',       path: '/investor/coupons',       icon: <CouponsIcon /> },
    { label: 'SP Inbox',      path: '/investor/outreach-inbox',icon: <OutreachIcon /> },
  ],
  serviceProvider: [
    { label: 'Dashboard',     path: '/service-provider/dashboard',       icon: <DashboardIcon /> },
    { label: 'Directory',     path: '/service-provider/directory',       icon: <DirectoryIcon /> },
    { label: 'My Outreach',   path: '/service-provider/outreach',        icon: <OutreachIcon /> },
<<<<<<< HEAD
    { label: 'Referrals',     path: '/service-provider/referrals',      icon: <ReferralsIcon /> },
=======
>>>>>>> 5627b10a2105b23a802352e1ccd8df8ffd4e1612
    { label: 'Advertise',     path: '/service-provider/advertisements',  icon: <AdsIcon /> },
    { label: 'Payments',      path: '/service-provider/payments',        icon: <LeadsIcon /> },
    { label: 'Coupons',       path: '/service-provider/coupons',         icon: <CouponsIcon /> },
  ],
};

export default function AdminSidebar({ children }) {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const profileDropdownRefMobile = React.useRef(null);
  const profileDropdownRefDesktop = React.useRef(null);

  // Close dropdown on outside click
  React.useEffect(() => {
    const handleClick = (e) => {
      const clickedMobile = profileDropdownRefMobile.current && profileDropdownRefMobile.current.contains(e.target);
      const clickedDesktop = profileDropdownRefDesktop.current && profileDropdownRefDesktop.current.contains(e.target);
      if (!clickedMobile && !clickedDesktop) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);



  const drawerWidth = collapsed ? DRAWER_COLLAPSED : DRAWER_WIDTH;
  const NAV_ITEMS = NAV_ITEMS_BY_ROLE[user?.role] || NAV_ITEMS_BY_ROLE.admin;
  const roleLabel = user?.role === 'serviceProvider' ? 'Service Provider' :
    user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'User';

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
        height: 64,
        borderBottom: '1px solid rgba(255,255,255,0.08)',
      }}>
        {!collapsed && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <img src="/logo-small-white.png" alt="Logo" style={{ height: 48, objectFit: 'contain' }} />
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


    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f8fafc', overflowX: 'hidden', maxWidth: '100vw' }}>
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
          overflowX: 'hidden',
          width: '100%',
          minWidth: 0,
        }}
      >
        {/* Mobile top bar */}
        <Box sx={{
          display: { xs: 'flex', md: 'none' },
          alignItems: 'center',
          px: 2,
          height: 56,
          bgcolor: '#0f172a',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          position: 'sticky', top: 0, zIndex: 100,
        }}>
          <IconButton onClick={() => setMobileOpen(true)} sx={{ color: 'white', mr: 2 }}>
            <MenuIcon />
          </IconButton>
          <img src="/logo-small-white.png" alt="Logo" style={{ height: 36, objectFit: 'contain' }} />
          <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center', gap: 1 }}>
            {/* Profile Dropdown — mobile */}
            <div ref={profileDropdownRefMobile} style={{ position: 'relative' }}>
              <button
                onClick={() => setProfileDropdownOpen(p => !p)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: 24, padding: '4px 10px 4px 6px', cursor: 'pointer', color: 'white',
                  fontSize: 12, fontWeight: 700, transition: 'all 0.2s',
                }}
              >
                <span style={{ width: 28, height: 28, borderRadius: '50%', background: '#D48035', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 800, color: 'white', flexShrink: 0 }}>
                  {(user?.name || user?.email || 'U')[0].toUpperCase()}
                </span>
                <ChevronLeftIcon style={{ width: 14, height: 14, transform: profileDropdownOpen ? 'rotate(-90deg)' : 'rotate(-180deg)', transition: 'transform 0.2s' }} />
              </button>
              {profileDropdownOpen && (
                <div style={{
                  position: 'absolute', top: 'calc(100% + 8px)', right: 0, width: 220,
                  background: '#1a1a1c', border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 16, boxShadow: '0 20px 60px rgba(0,0,0,0.6)', zIndex: 9999,
                  overflow: 'hidden', animation: 'fadeIn 0.15s ease',
                }}>
                  <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 2 }}>Account</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: 'white', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.name || user?.email?.split('@')[0]}</div>
                    <div style={{ fontSize: 11, color: '#D48035', fontWeight: 600 }}>{roleLabel}</div>
                  </div>
                  {[{icon: <User style={{width:15,height:15}}/>, label:'My Profile', action:()=>{router.push('/profile');setProfileDropdownOpen(false);}},
                    {icon: <Crown style={{width:15,height:15,color:'#f97316'}}/>, label:'My Membership', action:()=>{router.push('/membership');setProfileDropdownOpen(false);}}
                  ].map(item => (
                    <button key={item.label} onClick={item.action} style={{ display:'flex', alignItems:'center', gap:10, width:'100%', padding:'10px 16px', background:'none', border:'none', cursor:'pointer', color:'rgba(255,255,255,0.75)', fontSize:13, fontWeight:500, textAlign:'left', transition:'all 0.15s' }}
                      onMouseEnter={e=>{e.currentTarget.style.background='rgba(255,255,255,0.06)';e.currentTarget.style.color='#D48035';}}
                      onMouseLeave={e=>{e.currentTarget.style.background='none';e.currentTarget.style.color='rgba(255,255,255,0.75)';}}
                    >{item.icon}{item.label}</button>
                  ))}
                  <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                    <button onClick={()=>{handleLogout();setProfileDropdownOpen(false);}} style={{ display:'flex', alignItems:'center', gap:10, width:'100%', padding:'10px 16px', background:'none', border:'none', cursor:'pointer', color:'rgba(239,68,68,0.85)', fontSize:13, fontWeight:600, textAlign:'left', transition:'all 0.15s' }}
                      onMouseEnter={e=>{e.currentTarget.style.background='rgba(239,68,68,0.08)';}}
                      onMouseLeave={e=>{e.currentTarget.style.background='none';}}
                    ><LogoutIcon style={{width:15,height:15}}/> Logout</button>
                  </div>
                </div>
              )}
            </div>
            <NotificationBell iconColor="rgba(255,255,255,0.7)" hoverColor="white" />
          </Box>
        </Box>
        {/* Desktop top bar */}
        <Box sx={{
          display: { xs: 'none', md: 'flex' },
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 3,
          height: 50,
          bgcolor: 'white',
          borderBottom: '1px solid #e2e8f0',
          position: 'sticky', top: 0, zIndex: 100,
        }}>
          {/* Logo visible when sidebar is collapsed */}
          <Box sx={{ 
            opacity: collapsed ? 1 : 0, 
            visibility: collapsed ? 'visible' : 'hidden', 
            transition: 'opacity 0.25s ease, visibility 0.25s ease', 
            display: 'flex', 
            alignItems: 'center',
            bgcolor: '#0f172a',
            px: 1.5,
            py: 0.2,
            borderRadius: '6px',
          }}>
            <Link href="/" style={{ display: 'flex', alignItems: 'center' }}>
              <img src="/logo-small-white.png" alt="Logo" style={{ height: 38, objectFit: 'contain' }} />
            </Link>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {/* Profile Dropdown — desktop */}
          <div ref={profileDropdownRefDesktop} style={{ position: 'relative' }}>
            <button
              onClick={() => setProfileDropdownOpen(p => !p)}
              style={{
                display: 'flex', alignItems: 'center', gap: 7,
                background: profileDropdownOpen ? 'rgba(212,128,53,0.08)' : 'transparent',
                border: '1px solid', borderColor: profileDropdownOpen ? 'rgba(212,128,53,0.3)' : 'transparent',
                borderRadius: 24, padding: '5px 12px 5px 6px', cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e=>{if(!profileDropdownOpen){e.currentTarget.style.background='rgba(212,128,53,0.06)';e.currentTarget.style.borderColor='rgba(212,128,53,0.2)';}}} 
              onMouseLeave={e=>{if(!profileDropdownOpen){e.currentTarget.style.background='transparent';e.currentTarget.style.borderColor='transparent';}}}
            >
              <span style={{ width: 30, height: 30, borderRadius: '50%', background: 'linear-gradient(135deg, #D48035, #f97316)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 800, color: 'white', flexShrink: 0, boxShadow: '0 2px 8px rgba(212,128,53,0.4)' }}>
                {(user?.name || user?.email || 'U')[0].toUpperCase()}
              </span>
              <div style={{ textAlign: 'left', lineHeight: 1.2 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#1e293b', maxWidth: 110, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.name || user?.email?.split('@')[0]}</div>
                <div style={{ fontSize: 10, color: '#D48035', fontWeight: 600, textTransform: 'capitalize' }}>{roleLabel}</div>
              </div>
              <ChevronLeftIcon style={{ width: 14, height: 14, color: '#94a3b8', transform: profileDropdownOpen ? 'rotate(-90deg)' : 'rotate(-270deg)', transition: 'transform 0.2s', marginLeft: 2 }} />
            </button>

            {profileDropdownOpen && (
              <div style={{
                position: 'absolute', top: 'calc(100% + 10px)', right: 0, width: 230,
                background: '#1a1a1c', border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 18, boxShadow: '0 24px 64px rgba(0,0,0,0.5)', zIndex: 9999,
                overflow: 'hidden',
              }}>
                <div style={{ padding: '14px 16px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                  <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 3 }}>Signed in as</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'white', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.name || user?.email?.split('@')[0]}</div>
                  <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.email}</div>
                  <span style={{ display:'inline-block', marginTop:4, fontSize:10, fontWeight:700, padding:'2px 8px', background:'rgba(212,128,53,0.15)', color:'#D48035', borderRadius:20, border:'1px solid rgba(212,128,53,0.25)', textTransform:'capitalize' }}>{roleLabel}</span>
                </div>
                {[{icon:<User style={{width:15,height:15}}/>, label:'My Profile', action:()=>{router.push('/profile');setProfileDropdownOpen(false);}},
                  {icon:<Crown style={{width:15,height:15,color:'#f97316'}}/>, label:'My Membership', action:()=>{router.push('/membership');setProfileDropdownOpen(false);}}
                ].map(item => (
                  <button key={item.label} onClick={item.action} style={{ display:'flex', alignItems:'center', gap:10, width:'100%', padding:'11px 16px', background:'none', border:'none', cursor:'pointer', color:'rgba(255,255,255,0.75)', fontSize:13, fontWeight:500, textAlign:'left', transition:'all 0.15s' }}
                    onMouseEnter={e=>{e.currentTarget.style.background='rgba(255,255,255,0.06)';e.currentTarget.style.color='#D48035';}}
                    onMouseLeave={e=>{e.currentTarget.style.background='none';e.currentTarget.style.color='rgba(255,255,255,0.75)';}}
                  >{item.icon}{item.label}</button>
                ))}
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                  <button onClick={()=>{handleLogout();setProfileDropdownOpen(false);}} style={{ display:'flex', alignItems:'center', gap:10, width:'100%', padding:'11px 16px', background:'none', border:'none', cursor:'pointer', color:'rgba(239,68,68,0.85)', fontSize:13, fontWeight:600, textAlign:'left', transition:'all 0.15s' }}
                    onMouseEnter={e=>{e.currentTarget.style.background='rgba(239,68,68,0.08)';}}
                    onMouseLeave={e=>{e.currentTarget.style.background='none';}}
                  ><LogoutIcon style={{width:15,height:15}}/> Logout</button>
                </div>
              </div>
            )}
          </div>
          <NotificationBell iconColor="#64748b" hoverColor="#0f172a" />
        </Box>
      </Box>

        {/* Page Content */}
        <Box sx={{
          flex: 1,
          px: { xs: 0, md: 3 },
          pb: { xs: 2, md: 3 },
          pt: 0,
          overflowX: 'hidden',
          maxWidth: '100%',
          '& > div:not(.min-h-screen)': { marginTop: '0 !important', paddingTop: '16px !important' },
          '& > div.min-h-screen': { marginTop: '0 !important' },
          '& > main': { marginTop: '0 !important', paddingTop: '12px !important' },
          '& > section': { marginTop: '0 !important', paddingTop: '12px !important' },
          '& > div > div': { marginTop: '0 !important' },
          '& > div > main': { marginTop: '0 !important', paddingTop: '12px !important' },
          '& > div > section': { marginTop: '0 !important', paddingTop: '12px !important' },
          '& > div > .flex-grow': { marginTop: '0 !important' },
          '& > div > .container': { marginTop: '0 !important', paddingTop: '12px !important' },
          '& > div > .bg-gradient-to-r': { marginTop: '0 !important' }
        }}>
          {children}
        </Box>
      </Box>
    </Box>  );
}
