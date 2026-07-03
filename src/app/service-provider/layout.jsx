"use client";

import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/AuthContext';
import { toast } from '@/hooks/use-toast';
import AdminSidebar from '@/components/AdminSidebar';
import MembershipGuard from '@/components/MembershipGuard';

const SP_PUBLIC_PATHS = ['/service-provider', '/service-provider/login', '/service-provider/register'];

export default function ServiceProviderLayout({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading) {
      const isPublicPage = SP_PUBLIC_PATHS.some(p => pathname === p || pathname === p + '/login' || pathname === p + '/register');
      if (!user && !isPublicPage) {
        router.push('/service-provider/login');
      } else if (user && user.role !== 'serviceProvider') {
        toast({ title: "Access Denied", description: "You need a Service Provider account to access this area.", variant: "destructive" });
        router.push('/');
      }
    }
  }, [user, loading, router, pathname]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900"></div>
      </div>
    );
  }

  // Don't wrap public service-provider pages (login/register/landing) in the sidebar
  if (SP_PUBLIC_PATHS.includes(pathname)) {
    return <>{children}</>;
  }

  return (
    <MembershipGuard>
      <AdminSidebar>{children}</AdminSidebar>
    </MembershipGuard>
  );
}
