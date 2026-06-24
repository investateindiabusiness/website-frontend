"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { toast } from '@/hooks/use-toast';

const AuthContext = createContext(null);

const isSessionExpired = (userData) => {
  if (!userData) return false;

  // 1. Check JWT expiration if token is present
  if (userData.token) {
    try {
      const parts = userData.token.split('.');
      if (parts.length === 3) {
        const base64Url = parts[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
          atob(base64)
            .split('')
            .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
            .join('')
        );
        const payload = JSON.parse(jsonPayload);
        if (payload && typeof payload.exp === 'number') {
          const expirationTime = payload.exp * 1000;
          if (Date.now() >= expirationTime) {
            return true;
          }
        }
      }
    } catch (e) {
      console.warn("Failed to parse JWT token expiration:", e);
    }
  }

  // 2. Fallback: absolute session timeout (e.g., 2 hours from login time)
  if (userData.loginTime) {
    const SESSION_TIMEOUT = 2 * 60 * 60 * 1000; // 2 hours
    if (Date.now() - userData.loginTime >= SESSION_TIMEOUT) {
      return true;
    }
  }

  return false;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const savedUser = sessionStorage.getItem('user_session');
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      if (isSessionExpired(parsedUser)) {
        const role = parsedUser.role;
        sessionStorage.removeItem('user_session');
        if (role === 'admin') {
          window.location.href = '/admin/login?session_expired=true';
        } else if (role === 'builder') {
          window.location.href = '/builder?login=true&role=builder&session_expired=true';
        } else {
          window.location.href = '/?login=true&role=investor&session_expired=true';
        }
      } else {
        setUser(parsedUser);
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (loading) return;

    const checkSession = () => {
      const savedUser = sessionStorage.getItem('user_session');
      if (savedUser) {
        const parsedUser = JSON.parse(savedUser);
        if (isSessionExpired(parsedUser)) {
          const role = parsedUser.role;
          sessionStorage.removeItem('user_session');
          setUser(null);

          if (role === 'admin') {
            window.location.href = '/admin/login?session_expired=true';
          } else if (role === 'builder') {
            window.location.href = '/builder?login=true&role=builder&session_expired=true';
          } else {
            window.location.href = '/?login=true&role=investor&session_expired=true';
          }
          return true;
        }
      }
      return false;
    };

    const isExpired = checkSession();
    if (isExpired) return;

    const interval = setInterval(() => {
      checkSession();
    }, 5000);

    return () => clearInterval(interval);
  }, [loading, pathname]);

  useEffect(() => {
    if (loading) return;

    const isAdminRoute = pathname.startsWith('/admin') && pathname !== '/admin/login';
    const isBuilderRoute = pathname.startsWith('/builder/') || pathname === '/builder/dashboard' || pathname === '/builder/projects';
    const isInvestorRoute = pathname === '/dashboard' || pathname === '/properties' || pathname.startsWith('/investor/') || pathname.startsWith('/project/');

    if (isAdminRoute) {
      if (!user) {
        router.push('/admin/login');
      } else if (user.role !== 'admin') {
        toast({
          title: "Access Denied",
          description: "You do not have administrator privileges.",
          variant: "destructive"
        });
        router.push('/');
      }
    } else if (isBuilderRoute) {
      if (!user) {
        router.push('/builder?login=true&role=builder');
      } else if (user.role !== 'builder') {
        toast({
          title: "Access Denied",
          description: "You do not have builder privileges.",
          variant: "destructive"
        });
        router.push('/');
      }
    } else if (isInvestorRoute) {
      if (!user) {
        router.push('/?login=true&role=investor');
      } else if (user.role !== 'investor') {
        toast({
          title: "Access Denied",
          description: "You do not have investor privileges.",
          variant: "destructive"
        });
        router.push('/');
      }
    }
  }, [user, loading, pathname, router]);

  const login = (userData) => {
    const sessionData = { ...userData, loginTime: Date.now() };
    sessionStorage.setItem('user_session', JSON.stringify(sessionData));
    setUser(sessionData);
  };

  const logout = () => {
    sessionStorage.removeItem('user_session');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);