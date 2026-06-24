"use client";

import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/AuthContext';
import { toast } from '@/hooks/use-toast';

export default function AdminLayout({ children }) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        if (pathname !== '/admin/login') {
          router.push('/admin/login');
        }
      } else if (user.role !== 'admin') {
        if (pathname === '/admin/login') {
          // If a non-admin tries to go to the admin login page, automatically log them out
          // so they can actually see the login form and log in as an admin.
          logout();
        } else {
          toast({
            title: "Access Denied",
            description: "You do not have administrator privileges.",
            variant: "destructive"
          });
          router.push('/');
        }
      }
    }
  }, [user, loading, router, pathname, logout]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900"></div>
      </div>
    );
  }

  return <>{children}</>;
}
