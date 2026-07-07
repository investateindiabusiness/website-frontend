"use client";

import React from 'react';
import { useAuth } from '@/hooks/AuthContext';
import AdminSidebar from '@/components/AdminSidebar';

export default function InvestorPropertiesLayout({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900"></div>
      </div>
    );
  }

  // Wrap with sidebar if logged in as investor
  if (user && user.role === 'investor') {
    return <AdminSidebar>{children}</AdminSidebar>;
  }

  return <>{children}</>;
}
