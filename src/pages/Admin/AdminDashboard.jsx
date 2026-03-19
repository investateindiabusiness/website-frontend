import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, FileText, Users, Eye, MessageSquare, Loader2, Calendar } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/AuthContext';
import { fetchAllProjects, fetchAllLeads, fetchAllInquiries } from '@/api';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // --- REAL DATA STATES ---
  const [projects, setProjects] = useState([]);
  const [leads, setLeads] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- FETCH DATA ON LOAD ---
  const loadDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      const [projectsData, leadsData, inquiriesData] = await Promise.all([
        fetchAllProjects(user?.token),
        fetchAllLeads(),
        fetchAllInquiries()
      ]);

      setProjects(projectsData || []);
      setLeads(leadsData || []);
      setInquiries(inquiriesData || []);
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
    } finally {
      setLoading(false);
    }
  }, [user?.token]);

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user, loadDashboardData]);

  // --- CALCULATE DYNAMIC STATS ---
  const stats = {
    totalProjects: projects.length,
    // Calculate unique builders based on project listings
    totalBuilders: new Set(projects.filter(p => p.builderName).map(p => p.builderName)).size,
    totalLeads: leads.length,
    totalViews: projects.reduce((sum, p) => sum + (p.views || 0), 0)
  };

  // Sort by createdAt descending to get the newest 5
  const recentLeads = [...leads]
    .sort((a, b) => new Date(b.createdAt || 0) < new Date(a.createdAt || 0) ? 1 : -1)
    .slice(0, 5);

  const recentProjects = [...projects]
    .sort((a, b) => new Date(b.createdAt || 0) < new Date(a.createdAt || 0) ? 1 : -1)
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Header />

      <div className="container mx-auto px-4 py-8 flex-grow mt-[2rem] md:mt-[4rem]">
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
            <p className="text-gray-600">Welcome back! Here's what's happening today.</p>
          </div>
          <div className="flex gap-3">
             <Button variant="outline" onClick={loadDashboardData} disabled={loading}>
               {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <RefreshCw className="w-4 h-4 mr-2" />}
               Refresh Data
             </Button>
             {/* <Button onClick={() => navigate('/admin/projects')}>
               + Add Project
             </Button> */}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-none shadow-md bg-white hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Total Projects</p>
                  <p className="text-3xl font-bold text-gray-900">{loading ? '-' : stats.totalProjects}</p>
                </div>
                <div className="bg-blue-100 p-3 rounded-full">
                  <Building2 className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <div className="mt-4 text-xs text-green-600 flex items-center">
                 <span className="font-bold">Live & Pending</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-md bg-white hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Active Builders</p>
                  <p className="text-3xl font-bold text-gray-900">{loading ? '-' : stats.totalBuilders}</p>
                </div>
                <div className="bg-green-100 p-3 rounded-full">
                  <Users className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <div className="mt-4 text-xs text-green-600 flex items-center">
                 <span className="font-bold">With listed projects</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-md bg-white hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Project Leads</p>
                  <p className="text-3xl font-bold text-gray-900">{loading ? '-' : stats.totalLeads}</p>
                </div>
                <div className="bg-orange-100 p-3 rounded-full">
                  <MessageSquare className="h-6 w-6 text-orange-600" />
                </div>
              </div>
              <div className="mt-4 text-xs text-blue-500 flex items-center">
                 <span className="font-bold">Investor Inquiries</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-md bg-white hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">General Inquiries</p>
                  <p className="text-3xl font-bold text-gray-900">{loading ? '-' : inquiries.length}</p>
                </div>
                <div className="bg-purple-100 p-3 rounded-full">
                  <FileText className="h-6 w-6 text-purple-600" />
                </div>
              </div>
              <div className="mt-4 text-xs text-gray-500 flex items-center">
                 <span className="font-bold">From Contact Us Page</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="border-none shadow-md mb-8 bg-white">
          <CardHeader className="pb-4 border-b border-gray-100">
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Button onClick={() => navigate('/admin/projects')} className="bg-blue-600 hover:bg-blue-700 h-auto py-4 flex-col gap-2">
                <Building2 className="h-6 w-6" />
                <span>Manage Projects</span>
              </Button>
              <Button onClick={() => navigate('/admin/builders')} className="bg-green-600 hover:bg-green-700 h-auto py-4 flex-col gap-2">
                <Users className="h-6 w-6" />
                <span>Manage Builders</span>
              </Button>
              <Button onClick={() => navigate('/admin/leads')} className="bg-orange-600 hover:bg-orange-700 h-auto py-4 flex-col gap-2">
                <MessageSquare className="h-6 w-6" />
                <span>Project Leads</span>
              </Button>
              <Button onClick={() => navigate('/admin/inquiries')} className="bg-purple-600 hover:bg-purple-700 h-auto py-4 flex-col gap-2">
                <FileText className="h-6 w-6" />
                <span>General Inquiries</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* --- RECENT LEADS --- */}
          <Card className="border-none shadow-md bg-white lg:col-span-2">
            <CardHeader className="border-b border-gray-100 pb-4">
              <div className="flex items-center justify-between">
                <CardTitle>Recent Leads</CardTitle>
                <Button variant="ghost" className="text-xs h-8" onClick={() => navigate('/admin/leads')}>View All</Button>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="divide-y divide-gray-100">
                {loading ? (
                    <div className="py-10 text-center text-gray-500 text-sm">Loading leads...</div>
                ) : recentLeads.length === 0 ? (
                    <div className="py-10 text-center text-gray-500 text-sm">No leads generated yet.</div>
                ) : recentLeads.map((lead) => (
                  <div key={lead.id} className="py-4 hover:bg-gray-50 transition-colors rounded-md px-2 -mx-2">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold uppercase">
                          {lead.investorName ? lead.investorName.charAt(0) : '?'}
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 text-sm">{lead.investorName || 'Unknown Investor'}</h4>
                          <p className="text-xs text-gray-500 flex items-center"><Building2 className="w-3 h-3 mr-1"/> {lead.projectName}</p>
                        </div>
                      </div>
                      <span
                        className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
                          lead.status === 'New' ? 'bg-blue-100 text-blue-700'
                            : lead.status === 'In Progress' ? 'bg-yellow-100 text-yellow-700'
                            : lead.status === 'Closed' ? 'bg-gray-100 text-gray-700'
                            : 'bg-green-100 text-green-700'
                        }`}
                      >
                        {lead.status || 'New'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2 pl-12 line-clamp-1">{lead.message}</p>
                    <div className="flex items-center justify-between text-xs text-gray-400 pl-12">
                      <span>{lead.investorEmail}</span>
                      <span>{lead.createdAt ? new Date(lead.createdAt).toLocaleDateString() : 'N/A'}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* --- RECENT PROJECTS --- */}
          <Card className="border-none shadow-md bg-white">
            <CardHeader className="border-b border-gray-100 pb-4">
              <CardTitle>Recent Projects</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="divide-y divide-gray-100">
                {loading ? (
                    <div className="py-10 text-center text-gray-500 text-sm">Loading projects...</div>
                ) : recentProjects.length === 0 ? (
                    <div className="py-10 text-center text-gray-500 text-sm">No projects listed yet.</div>
                ) : recentProjects.map((project, index) => (
                  <div key={project.id} className="py-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-start space-x-3">
                        <div className={`
                          font-bold rounded-lg w-8 h-8 flex items-center justify-center text-sm
                          ${project.status === 'approved' ? 'bg-green-100 text-green-700' : 
                            project.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 
                            project.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'}
                        `}>
                          {index + 1}
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 text-sm truncate w-40">{project.projectName || 'Unnamed'}</h4>
                          <p className="text-xs text-gray-500 truncate w-40">{project.builderName || 'Unknown Builder'}</p>
                        </div>
                      </div>
                    </div>
                    <div className="ml-11 grid grid-cols-2 gap-2 text-xs text-gray-600 bg-gray-50 p-2 rounded">
                      <span className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1 text-gray-400" />
                        {project.createdAt ? new Date(project.createdAt).toLocaleDateString() : 'N/A'}
                      </span>
                      <span className="flex items-center justify-end font-medium capitalize">
                        {project.status === 'approved' ? 'Live' : project.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <Button
                onClick={() => navigate('/admin/projects')}
                variant="outline"
                className="w-full mt-4 text-xs"
              >
                View All Projects
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
};

// Add this missing icon component for the refresh button
import { RefreshCw } from 'lucide-react';

export default AdminDashboard;