"use client";

import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/AuthContext';
import { toast } from '@/hooks/use-toast';
import AdminSidebar from '@/components/AdminSidebar';
import { getSocket } from '@/utils/socket';

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

  useEffect(() => {
    if (user && user.role === 'admin') {
      const socket = getSocket();
      
      const handleNewLead = (leadData) => {
        toast({
          title: "🎯 New Project Lead!",
          description: `${leadData.investorName} has shown interest in "${leadData.projectName}".`,
          variant: "default"
        });
      };

      socket.on('newLead', handleNewLead);
      
      return () => {
        socket.off('newLead', handleNewLead);
      };
    }
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900"></div>
      </div>
    );
  }

  // Don't wrap the login page in the sidebar
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  return <AdminSidebar>{children}</AdminSidebar>;
}

