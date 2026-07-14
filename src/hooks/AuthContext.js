"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { toast } from '@/hooks/use-toast';
import { apiRequest, logoutRequest } from '@/api';

const AuthContext = createContext(null);

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Decode the `exp` claim from a Firebase JWT without verifying the signature.
 * Returns a Unix timestamp in ms, or 0 on failure.
 */
const decodeTokenExpiry = (token) => {
  try {
    if (!token || typeof token !== 'string') return 0;
    const payload = JSON.parse(atob(token.split('.')[1]));
    return (payload.exp || 0) * 1000;
  } catch {
    return 0;
  }
};

const isSessionExpired = (userData) => {
  if (!userData) return false;
  // Prefer JWT-derived expiry; fall back to a 24-hour absolute cap
  if (userData.expiresAt) {
    return Date.now() >= userData.expiresAt;
  }
  if (userData.loginTime) {
    const SESSION_TIMEOUT = 24 * 60 * 60 * 1000;
    return Date.now() - userData.loginTime >= SESSION_TIMEOUT;
  }
  return false;
};

const isProtectedRoute = (path) => {
  if (!path) return false;
  const isAdminRoute = path.startsWith('/admin') && path !== '/admin/login';
  const isBuilderRoute =
    (path.startsWith('/builder/') && path !== '/builder/login' && path !== '/builder/register') ||
    path === '/builder/dashboard' ||
    path === '/builder/projects' ||
    path === '/builder/advertisements';
  const isInvestorRoute =
    path === '/dashboard' ||
    path.startsWith('/properties') ||
    (path.startsWith('/investor/') && path !== '/investor/login' && path !== '/investor/register');
  const isServiceProviderRoute =
    (path.startsWith('/service-provider/') &&
      path !== '/service-provider' &&
      path !== '/service-provider/login' &&
      path !== '/service-provider/register') ||
    path === '/service-provider/dashboard' ||
    path === '/service-provider/advertisements';

  return isAdminRoute || isBuilderRoute || isInvestorRoute || isServiceProviderRoute;
};

const getLoginPath = (role) => {
  if (role === 'admin') return '/admin/login?session_expired=true';
  if (role === 'builder') return '/builder/login?session_expired=true';
  if (role === 'serviceProvider') return '/service-provider/login?session_expired=true';
  return '/investor/login?session_expired=true';
};

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const router = useRouter();
  const expiryTimerRef = useRef(null);

  /**
   * Schedule a single expiry check that fires exactly when the token expires.
   * This replaces the old wasteful 5-second setInterval.
   */
  const scheduleExpiryCheck = useCallback((userData) => {
    if (expiryTimerRef.current) {
      clearTimeout(expiryTimerRef.current);
      expiryTimerRef.current = null;
    }
    if (!userData?.expiresAt) return;

    const msUntilExpiry = userData.expiresAt - Date.now();
    if (msUntilExpiry <= 0) return; // already expired

    expiryTimerRef.current = setTimeout(() => {
      if (typeof window === 'undefined') return;
      const savedUser = sessionStorage.getItem('user_session');
      if (!savedUser) return;
      try {
        const parsedUser = JSON.parse(savedUser);
        if (isSessionExpired(parsedUser)) {
          sessionStorage.removeItem('user_session');
          setUser(null);
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new Event('user_session_updated'));
          }
          const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';
          if (isProtectedRoute(currentPath)) {
            window.location.href = getLoginPath(parsedUser.role);
          }
        }
      } catch { /* ignore corrupt session */ }
    }, msUntilExpiry);
  }, []);

  // Sync React state helper
  const syncStateFromStorage = useCallback(() => {
    if (typeof window === 'undefined') return;
    const savedUser = sessionStorage.getItem('user_session');
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        if (isSessionExpired(parsedUser)) {
          const role = parsedUser.role;
          sessionStorage.removeItem('user_session');
          setUser(null);
          const currentPath = window.location.pathname;
          if (isProtectedRoute(currentPath)) {
            window.location.href = getLoginPath(role);
          }
        } else {
          const normalizedRole = parsedUser.role === 'partner' ? 'builder' : parsedUser.role;
          if (parsedUser.role !== normalizedRole) {
            parsedUser.role = normalizedRole;
            sessionStorage.setItem('user_session', JSON.stringify(parsedUser));
          }
          setUser(parsedUser);
          scheduleExpiryCheck(parsedUser);
        }
      } catch {
        setUser(null);
      }
    } else {
      setUser(null);
    }
  }, [scheduleExpiryCheck]);

  // Hydrate from sessionStorage on mount and register listeners
  useEffect(() => {
    syncStateFromStorage();
    setLoading(false);

    if (typeof window !== 'undefined') {
      window.addEventListener('user_session_updated', syncStateFromStorage);
      // NOTE: 'storage' event only fires for localStorage changes in OTHER tabs.
      // With sessionStorage (tab-isolated), we no longer need cross-tab sync.
    }

    return () => {
      if (expiryTimerRef.current) clearTimeout(expiryTimerRef.current);
      if (typeof window !== 'undefined') {
        window.removeEventListener('user_session_updated', syncStateFromStorage);
      }
    };
  }, [syncStateFromStorage]);

  // Route-based access control
  useEffect(() => {
    if (loading) return;

    const isAdminRoute = pathname.startsWith('/admin') && pathname !== '/admin/login';
    const isBuilderRoute =
      (pathname.startsWith('/builder/') && pathname !== '/builder/login' && pathname !== '/builder/register') ||
      pathname === '/builder/dashboard' ||
      pathname === '/builder/projects' ||
      pathname === '/builder/advertisements';
    const isInvestorRoute =
      pathname === '/dashboard' ||
      pathname.startsWith('/properties') ||
      (pathname.startsWith('/investor/') && pathname !== '/investor/login' && pathname !== '/investor/register');
    const isServiceProviderRoute =
      (pathname.startsWith('/service-provider/') &&
        pathname !== '/service-provider' &&
        pathname !== '/service-provider/login' &&
        pathname !== '/service-provider/register') ||
      pathname === '/service-provider/dashboard' ||
      pathname === '/service-provider/advertisements';

    if (isAdminRoute) {
      if (!user) {
        router.push('/admin/login');
      } else if (user.role !== 'admin') {
        toast({ title: 'Access Denied', description: 'You do not have administrator privileges.', variant: 'destructive' });
        router.push('/');
      }
    } else if (isBuilderRoute) {
      if (!user) {
        router.push('/builder/login');
      } else if (user.role !== 'builder' && user.role !== 'partner') {
        toast({ title: 'Access Denied', description: 'You do not have builder privileges.', variant: 'destructive' });
        router.push('/');
      }
    } else if (isInvestorRoute) {
      if (!user) {
        router.push('/investor/login');
      } else if (user.role !== 'investor') {
        toast({ title: 'Access Denied', description: 'You do not have investor privileges.', variant: 'destructive' });
        router.push('/');
      }
    } else if (isServiceProviderRoute) {
      if (!user) {
        router.push('/service-provider/login');
      } else if (user.role !== 'serviceProvider') {
        toast({ title: 'Access Denied', description: 'You do not have service provider privileges.', variant: 'destructive' });
        router.push('/');
      }
    }
  }, [user, loading, pathname, router]);

  // ---------------------------------------------------------------------------
  // Auth actions
  // ---------------------------------------------------------------------------

  const login = (userData) => {
    // Decode the JWT's own exp claim for accurate expiry tracking
    const tokenExpiry = userData.token ? decodeTokenExpiry(userData.token) : 0;
    
    // Normalize role 'partner' to 'builder'
    const normalizedRole = userData.role === 'partner' ? 'builder' : userData.role;
    
    const sessionData = {
      ...userData,
      role: normalizedRole,
      loginTime: Date.now(),
      expiresAt: tokenExpiry > 0 ? tokenExpiry : Date.now() + 3600 * 1000,
    };
    sessionStorage.setItem('user_session', JSON.stringify(sessionData));
    setUser(sessionData);
    scheduleExpiryCheck(sessionData);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('user_session_updated'));
    }
  };

  const logout = () => {
    if (expiryTimerRef.current) {
      clearTimeout(expiryTimerRef.current);
      expiryTimerRef.current = null;
    }
    logoutRequest().catch(() => {});
    sessionStorage.removeItem('user_session');
    setUser(null);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('user_session_updated'));
    }
  };

  /**
   * Exchange the stored refreshToken for a new idToken via the backend.
   * Updates localStorage and React state on success.
   * Returns true on success, false on failure.
   */
  const refreshSession = useCallback(async () => {
    if (typeof window === 'undefined') return false;
    const savedUser = sessionStorage.getItem('user_session');
    if (!savedUser) return false;
    let parsedUser;
    try {
      parsedUser = JSON.parse(savedUser);
    } catch {
      return false;
    }
    if (!parsedUser?.refreshToken) return false;

    try {
      const data = await apiRequest('/api/auth/refresh-token', {
        method: 'POST',
        body: JSON.stringify({ refreshToken: parsedUser.refreshToken }),
      });
      if (!data?.idToken) return false;

      const tokenExpiry = decodeTokenExpiry(data.idToken);
      const updated = {
        ...parsedUser,
        token: data.idToken,
        refreshToken: data.refreshToken || parsedUser.refreshToken,
        expiresAt: tokenExpiry > 0 ? tokenExpiry : Date.now() + 3600 * 1000,
      };
      sessionStorage.setItem('user_session', JSON.stringify(updated));
      setUser(updated);
      scheduleExpiryCheck(updated);
      window.dispatchEvent(new Event('user_session_updated'));
      return true;
    } catch {
      return false;
    }
  }, [scheduleExpiryCheck]);

  /**
   * Reload user profile data from the backend into the session.
   */
  const refreshUser = useCallback(async () => {
    if (typeof window === 'undefined') return;
    try {
      const data = await apiRequest('/api/auth/me', { method: 'GET' });
      if (data.success && data.user) {
        const savedUser = sessionStorage.getItem('user_session');
        const parsedUser = savedUser ? JSON.parse(savedUser) : {};
        
        // Normalize role 'partner' to 'builder'
        const normalizedRole = data.user.role === 'partner' ? 'builder' : data.user.role;
        const updatedUser = { ...data.user, role: normalizedRole };
        
        const updated = { ...parsedUser, ...updatedUser };
        sessionStorage.setItem('user_session', JSON.stringify(updated));
        setUser(updated);
        window.dispatchEvent(new Event('user_session_updated'));
      }
    } catch (err) {
      console.warn('Failed to refresh user profile:', err);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, refreshUser, refreshSession }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
