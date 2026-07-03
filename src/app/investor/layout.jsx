"use client";

import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/AuthContext';
import { toast } from '@/hooks/use-toast';
import AdminSidebar from '@/components/AdminSidebar';
import MembershipGuard from '@/components/MembershipGuard';

const INVESTOR_PUBLIC_PATHS = ['/investor', '/investor/login', '/investor/register'];

export default function InvestorLayout({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading) {
      // Normalize pathname to handle trailing slashes
      const normalizedPath = pathname.endsWith('/') && pathname.length > 1 
        ? pathname.slice(0, -1) 
        : pathname;
        
      const isPublicPage = INVESTOR_PUBLIC_PATHS.includes(normalizedPath);
      
      if (!user && !isPublicPage) {
        router.push('/investor/login');
      } else if (user && user.role !== 'investor' && !isPublicPage) {
        toast({ title: "Access Denied", description: "You need an Investor account to access this area.", variant: "destructive" });
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

  // Don't wrap public investor pages in the sidebar
  const normalizedPath = pathname.endsWith('/') && pathname.length > 1 
    ? pathname.slice(0, -1) 
    : pathname;
  if (INVESTOR_PUBLIC_PATHS.includes(normalizedPath)) {
    return <>{children}</>;
  }

  return (
    <MembershipGuard>
      <AdminSidebar>{children}</AdminSidebar>
    </MembershipGuard>
  );
}
