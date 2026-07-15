"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Badge, IconButton, Popover, List, ListItem, ListItemText, Typography, Box, CircularProgress, Button, ListItemButton } from '@mui/material';
import { Notifications as NotificationsIcon, CheckCircle as CheckCircleIcon } from '@mui/icons-material';
import { useAuth } from '@/hooks/AuthContext';
import { apiRequest } from '@/api';
import { formatDistanceToNow } from 'date-fns';

export default function NotificationBell({ iconColor = 'rgba(255,255,255,0.7)', hoverColor = 'white' }) {
  const { user } = useAuth();
  const router = useRouter();
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const fetchUnreadCount = async () => {
    if (!user) return;
    try {
      const res = await apiRequest('/api/notifications/unread-count', { method: 'GET' });
      setUnreadCount(res.count || 0);
    } catch (err) {
      const errMsg = err?.message || (typeof err === 'string' ? err : '');
      if (errMsg !== 'Session expired' && !errMsg.includes('Session expired')) {
        console.warn('Failed to fetch unread count (graceful bypass):', err?.message || (typeof err === 'object' ? JSON.stringify(err) : err));
      }
    }
  };

  const fetchNotifications = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const res = await apiRequest('/api/notifications?limit=10', { method: 'GET' });
      setNotifications(res.data || []);
    } catch (err) {
      const errMsg = err?.message || (typeof err === 'string' ? err : '');
      if (errMsg !== 'Session expired' && !errMsg.includes('Session expired')) {
        console.warn('Failed to fetch notifications (graceful bypass):', err?.message || (typeof err === 'object' ? JSON.stringify(err) : err));
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchUnreadCount();
      // Poll every 120 seconds (reduced frequency to prevent database quota exhaustion)
      const interval = setInterval(fetchUnreadCount, 120000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    if (notifications.length === 0) {
      fetchNotifications();
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMarkAsRead = async (id, e) => {
    if (e) e.stopPropagation();
    try {
      await apiRequest(`/api/notifications/${id}/read`, { method: 'PATCH' });
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Failed to mark as read:', err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      const response = await apiRequest('/api/notifications/read-all', { method: 'PATCH' });
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
      // Refetch notifications to ensure persistence after refresh
      fetchNotifications();
    } catch (err) {
      console.error('Failed to mark all as read:', err);
    }
  };

  const handleNotificationClick = async (notif) => {
    // Optimistically mark as read if it isn't
    if (!notif.isRead) {
      handleMarkAsRead(notif.id);
    }

    // Close popover
    setAnchorEl(null);

    // Route based on notification data
    if (notif.ticketId) {
      const isAdminRole = ['admin', 'super_admin', 'support_manager', 'support_agent'].includes(user?.role);
      let basePath = '/dashboard'; // default
      if (isAdminRole) basePath = '/admin/helpdesk';
      else if (user?.role === 'builder') basePath = '/builder/helpdesk';
      else if (user?.role === 'investor') basePath = '/investor/helpdesk';
      else if (user?.role === 'serviceProvider') basePath = '/service-provider/helpdesk';

      router.push(`${basePath}?ticketId=${notif.ticketId}`);
    }
  };

  const open = Boolean(anchorEl);

  return (
    <>
      <IconButton color="inherit" onClick={handleClick} sx={{ mr: 1, color: iconColor, '&:hover': { color: hoverColor } }}>
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        slotProps={{
          paper: {
            sx: { width: 320, maxHeight: 400, mt: 1.5, borderRadius: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }
          }
        }}
      >
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eee' }}>
          <Typography variant="subtitle1" fontWeight="bold">Notifications</Typography>
          {unreadCount > 0 && (
            <Button size="small" onClick={handleMarkAllRead} sx={{ fontSize: '0.7rem' }}>Mark all read</Button>
          )}
        </Box>
        {loading ? (
          <Box sx={{ p: 4, display: 'flex', justifyContent: 'center' }}>
            <CircularProgress size={24} />
          </Box>
        ) : notifications.length > 0 ? (
          <List sx={{ p: 0 }}>
            {notifications.map((notif) => (
              <ListItem
                key={notif.id}
                disablePadding
                sx={{ borderBottom: '1px solid #f5f5f5' }}
              >
                <ListItemButton
                  onClick={() => handleNotificationClick(notif)}
                  sx={{
                    bgcolor: notif.isRead ? 'transparent' : 'rgba(212,128,53,0.05)',
                    alignItems: 'flex-start',
                    px: 2,
                    py: 1.5
                  }}
                >
                  <ListItemText
                    disableTypography
                    primary={
                      <Typography component="div" variant="subtitle2" sx={{ fontWeight: notif.isRead ? 500 : 700, color: notif.isRead ? '#555' : '#111' }}>
                        {notif.title}
                      </Typography>
                    }
                    secondary={
                      <React.Fragment>
                        <Typography component="div" variant="body2" sx={{ color: '#666', mt: 0.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                          {notif.message}
                        </Typography>
                        <Typography component="div" variant="caption" sx={{ color: '#999', display: 'block', mt: 1 }}>
                          {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true })}
                        </Typography>
                      </React.Fragment>
                    }
                  />
                  {!notif.isRead && (
                    <IconButton size="small" onClick={(e) => handleMarkAsRead(notif.id, e)} sx={{ mt: 0.5 }}>
                      <CheckCircleIcon sx={{ fontSize: 16, color: '#D48035' }} />
                    </IconButton>
                  )}
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        ) : (
          <Box sx={{ p: 4, textAlign: 'center', color: '#888' }}>
            <Typography variant="body2">No notifications yet</Typography>
          </Box>
        )}
      </Popover>
    </>
  );
}
