import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building2, FileText, Users, Eye, MessageSquare } from 'lucide-react';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [builders, setBuilders] = useState([]);
  const [inquiries, setInquiries] = useState([]);

  const stats = {
    totalProjects: projects.length,
    totalBuilders: builders.length,
    totalInquiries: inquiries.length,
    totalViews: projects.reduce((sum, p) => sum + (p.views || 0), 0)
  };

  const recentInquiries = inquiries.slice(0, 5);
  const topProjects = [...projects].sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 5);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-24">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage projects, builders, and investor inquiries</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-none shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Total Projects</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.totalProjects}</p>
                </div>
                <div className="bg-blue-100 p-3 rounded-full">
                  <Building2 className="h-8 w-8 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Total Builders</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.totalBuilders}</p>
                </div>
                <div className="bg-green-100 p-3 rounded-full">
                  <Users className="h-8 w-8 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Total Inquiries</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.totalInquiries}</p>
                </div>
                <div className="bg-orange-100 p-3 rounded-full">
                  <MessageSquare className="h-8 w-8 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Total Views</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.totalViews.toLocaleString()}</p>
                </div>
                <div className="bg-purple-100 p-3 rounded-full">
                  <Eye className="h-8 w-8 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="border-none shadow-lg mb-8">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Button
                onClick={() => navigate('/admin/projects')}
                className="bg-blue-600 hover:bg-blue-700 py-6"
              >
                <Building2 className="h-5 w-5 mr-2" />
                Manage Projects
              </Button>
              <Button
                onClick={() => navigate('/admin/builders')}
                className="bg-green-600 hover:bg-green-700 py-6"
              >
                <Users className="h-5 w-5 mr-2" />
                Manage Builders
              </Button>
              <Button
                onClick={() => navigate('/admin/inquiries')}
                className="bg-orange-600 hover:bg-orange-700 py-6"
              >
                <MessageSquare className="h-5 w-5 mr-2" />
                View Inquiries
              </Button>
              <Button
                variant="outline"
                className="py-6"
              >
                <FileText className="h-5 w-5 mr-2" />
                Generate Report
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Inquiries */}
          <Card className="border-none shadow-lg">
            <CardHeader>
              <CardTitle>Recent Inquiries</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentInquiries.map((inquiry) => (
                  <div key={inquiry.id} className="border-b border-gray-200 pb-4 last:border-0">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-semibold text-gray-900">{inquiry.investorName}</h4>
                        <p className="text-sm text-gray-600">{inquiry.projectTitle}</p>
                      </div>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          inquiry.status === 'New'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-green-100 text-green-700'
                        }`}
                      >
                        {inquiry.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 mb-2">{inquiry.message}</p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{inquiry.investorCountry}</span>
                      <span>{inquiry.date}</span>
                    </div>
                  </div>
                ))}
              </div>
              <Button
                onClick={() => navigate('/admin/inquiries')}
                variant="outline"
                className="w-full mt-4"
              >
                View All Inquiries
              </Button>
            </CardContent>
          </Card>

          {/* Top Performing Projects */}
          <Card className="border-none shadow-lg">
            <CardHeader>
              <CardTitle>Top Performing Projects</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topProjects.map((project, index) => (
                  <div key={project.id} className="border-b border-gray-200 pb-4 last:border-0">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-start space-x-3">
                        <div className="bg-blue-100 text-blue-600 font-bold rounded-full w-8 h-8 flex items-center justify-center text-sm">
                          {index + 1}
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{project.title}</h4>
                          <p className="text-sm text-gray-600">{project.builderName}</p>
                        </div>
                      </div>
                    </div>
                    <div className="ml-11 flex items-center space-x-4 text-sm text-gray-600">
                      <span className="flex items-center">
                        <Eye className="h-4 w-4 mr-1" />
                        {project.views}
                      </span>
                      <span className="flex items-center">
                        <MessageSquare className="h-4 w-4 mr-1" />
                        {project.inquiries}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <Button
                onClick={() => navigate('/admin/projects')}
                variant="outline"
                className="w-full mt-4"
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

export default AdminDashboard;
