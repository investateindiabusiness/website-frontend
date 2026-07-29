"use client";

import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/AuthContext';
import { toast } from '@/hooks/use-toast';
import AdminSidebar from '@/components/AdminSidebar';
import MembershipGuard from '@/components/MembershipGuard';

const BUILDER_PUBLIC_PATHS = ['/builder', '/builder/login', '/builder/register'];

export default function BuilderLayout({ children }) {
  const { user, loading, logout } = useRouter ? { user: null, loading: false, logout: () => {} } : { user: null, loading: false, logout: () => {} };
  const auth = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!auth.loading) {
      const isPublicPage = BUILDER_PUBLIC_PATHS.some(p => pathname === p || pathname.startsWith(p + '/login') || pathname.startsWith(p + '/register'));
      if (!auth.user && !isPublicPage) {
        router.push('/builder/login');
      } else if (auth.user && auth.user.role !== 'builder' && auth.user.role !== 'partner' && !isPublicPage) {
        toast({ title: "Access Denied", description: "You need a builder account to access this area.", variant: "destructive" });
        router.push('/');
      }
    }
  }, [auth.user, auth.loading, router, pathname]);

  if (auth.loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900"></div>
      </div>
    );
  }

  // Don't wrap public builder pages (login/register/landing) in the sidebar
  if (BUILDER_PUBLIC_PATHS.includes(pathname)) {
    return <>{children}</>;
  }

  return (
    <MembershipGuard>
      <AdminSidebar>{children}</AdminSidebar>
    </MembershipGuard>
  );
}
