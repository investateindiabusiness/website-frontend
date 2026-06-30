"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Building2, FileText, Users, MessageSquare, Loader2, Calendar, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/AuthContext';
import { fetchAllProjects, fetchAllLeads, fetchAllInquiries } from '@/api';

export default function AdminDashboard() {
  const router = useRouter();
  const { user } = useAuth();

  const [projects, setProjects] = useState([]);
  const [leads, setLeads] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      const [projectsData, leadsData, inquiriesData] = await Promise.all([
        fetchAllProjects({ page: 1, limit: 1000 }),
        fetchAllLeads(),
        fetchAllInquiries()
      ]);
      setProjects(Array.isArray(projectsData?.data) ? projectsData.data : []);
      setLeads(Array.isArray(leadsData) ? leadsData : (leadsData?.data || []));
      setInquiries(Array.isArray(inquiriesData) ? inquiriesData : (inquiriesData?.data || []));
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
    } finally {
      setLoading(false);
    }
  }, [user?.token]);

  useEffect(() => {
    if (user) loadDashboardData();
  }, [user, loadDashboardData]);

  const safeProjects = Array.isArray(projects) ? projects : [];
  const safeLeads = Array.isArray(leads) ? leads : [];
  const safeInquiries = Array.isArray(inquiries) ? inquiries : [];

  const stats = {
    totalProjects: safeProjects.length,
    totalBuilders: new Set(safeProjects.filter(p => p.builderName).map(p => p.builderName)).size,
    totalLeads: safeLeads.length,
    inquiries: safeInquiries.length
  };

  return (
    <div className="font-sans">
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Welcome back! Manage your platform here.</p>
        </div>
        <Button variant="outline" onClick={loadDashboardData} disabled={loading}>
          {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <RefreshCw className="w-4 h-4 mr-2" />}
          Refresh Data
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Total Projects" value={stats.totalProjects} icon={<Building2 />} color="blue" />
        <StatCard title="Active Builders" value={stats.totalBuilders} icon={<Users />} color="green" />
        <StatCard title="Project Leads" value={stats.totalLeads} icon={<MessageSquare />} color="orange" />
        <StatCard title="General Inquiries" value={stats.inquiries} icon={<FileText />} color="purple" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
        <Button onClick={() => router.push('/admin/projects')} className="bg-blue-600 h-auto py-6 flex-col gap-2"><Building2 /> Manage Projects</Button>
        <Button onClick={() => router.push('/admin/builders')} className="bg-green-600 h-auto py-6 flex-col gap-2"><Users /> Manage Builders</Button>
        <Button onClick={() => router.push('/admin/leads')} className="bg-orange-600 h-auto py-6 flex-col gap-2"><MessageSquare /> Project Leads</Button>
        <Button onClick={() => router.push('/admin/inquiries')} className="bg-purple-600 h-auto py-6 flex-col gap-2"><FileText /> Inquiries</Button>
        <Button onClick={() => router.push('/admin/helpdesk')} className="bg-[#D48035] h-auto py-6 flex-col gap-2"><MessageSquare /> Helpdesk</Button>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color }) {
  const colors = { blue: 'bg-blue-100 text-blue-600', green: 'bg-green-100 text-green-600', orange: 'bg-orange-100 text-orange-600', purple: 'bg-purple-100 text-purple-600' };
  return (
    <Card className="border-none shadow-md">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div><p className="text-sm font-medium text-gray-500">{title}</p><p className="text-3xl font-bold">{value}</p></div>
          <div className={`p-3 rounded-full ${colors[color]}`}>{React.cloneElement(icon, { className: 'h-6 w-6' })}</div>
        </div>
      </CardContent>
    </Card>
  );
}
