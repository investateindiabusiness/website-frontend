import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Building2, 
  FileText, 
  Users, 
  Eye, 
  MessageSquare, 
  Search, 
  Bell, 
  Menu,
  LogOut
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

// --- DUMMY DATA ---

const MOCK_PROJECTS = [
  { id: 1, title: 'Skyline Heights', builderName: 'Apex Constructors', views: 1250, inquiries: 45 },
  { id: 2, title: 'Green Valley Villas', builderName: 'Eco Homes', views: 980, inquiries: 32 },
  { id: 3, title: 'Urban Loft Spaces', builderName: 'City Developers', views: 850, inquiries: 28 },
  { id: 4, title: 'The Royal Gardens', builderName: 'Apex Constructors', views: 2100, inquiries: 89 },
  { id: 5, title: 'Sunset Boulevard', builderName: 'Westside Real Estate', views: 600, inquiries: 15 },
  { id: 6, title: 'Ocean View Apartments', builderName: 'Coastal Living', views: 1500, inquiries: 60 },
];

const MOCK_BUILDERS = [
  { id: 1, name: 'Apex Constructors' },
  { id: 2, name: 'Eco Homes' },
  { id: 3, name: 'City Developers' },
  { id: 4, name: 'Westside Real Estate' },
  { id: 5, name: 'Coastal Living' },
];

const MOCK_INQUIRIES = [
  { 
    id: 101, 
    investorName: 'Sarah Johnson', 
    projectTitle: 'The Royal Gardens', 
    status: 'New', 
    message: 'Interested in the 3BHK unit pricing.', 
    investorCountry: 'USA', 
    date: '2 hrs ago' 
  },
  { 
    id: 102, 
    investorName: 'Michael Chen', 
    projectTitle: 'Skyline Heights', 
    status: 'New', 
    message: 'Can we schedule a site visit this weekend?', 
    investorCountry: 'Singapore', 
    date: '5 hrs ago' 
  },
  { 
    id: 103, 
    investorName: 'Ahmed Al-Fayed', 
    projectTitle: 'Green Valley Villas', 
    status: 'Reviewed', 
    message: 'Please send the brochure and floor plans.', 
    investorCountry: 'UAE', 
    date: '1 day ago' 
  },
  { 
    id: 104, 
    investorName: 'Elena Rodriguez', 
    projectTitle: 'Urban Loft Spaces', 
    status: 'Contacted', 
    message: 'Is financing available for international buyers?', 
    investorCountry: 'Spain', 
    date: '2 days ago' 
  },
  { 
    id: 105, 
    investorName: 'David Kim', 
    projectTitle: 'The Royal Gardens', 
    status: 'New', 
    message: 'What is the expected completion date?', 
    investorCountry: 'South Korea', 
    date: '3 days ago' 
  },
  { 
    id: 106, 
    investorName: 'John Smith', 
    projectTitle: 'Ocean View Apartments', 
    status: 'Reviewed', 
    message: 'Checking availability.', 
    investorCountry: 'UK', 
    date: '4 days ago' 
  },
];

// --- MAIN COMPONENT ---

const AdminDashboard = () => {
  // Use a try-catch for navigate in case it's rendered outside a Router context during testing
  let navigate = useNavigate();

  // Initialize with Dummy Data
  const [projects, setProjects] = useState(MOCK_PROJECTS);
  const [builders, setBuilders] = useState(MOCK_BUILDERS);
  const [inquiries, setInquiries] = useState(MOCK_INQUIRIES);

  const stats = {
    totalProjects: projects.length,
    totalBuilders: builders.length,
    totalInquiries: inquiries.length,
    totalViews: projects.reduce((sum, p) => sum + (p.views || 0), 0)
  };

  const recentInquiries = inquiries.slice(0, 5);
  const topProjects = [...projects].sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 5);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Header />

      <div className="container mx-auto px-4 py-8 flex-grow mt-[3rem] md:mt-[5rem]">
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
            <p className="text-gray-600">Welcome back! Here's what's happening today.</p>
          </div>
          <div className="flex gap-3">
             <Button variant="outline" onClick={() => console.log("Refresh")}>
               Refresh Data
             </Button>
             <Button onClick={() => navigate('/admin/dashboard')}>
               + Add Project
             </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-none shadow-md bg-white hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Total Projects</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.totalProjects}</p>
                </div>
                <div className="bg-blue-100 p-3 rounded-full">
                  <Building2 className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <div className="mt-4 text-xs text-green-600 flex items-center">
                 <span className="font-bold">+12%</span>
                 <span className="text-gray-500 ml-1">from last month</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-md bg-white hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Total Builders</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.totalBuilders}</p>
                </div>
                <div className="bg-green-100 p-3 rounded-full">
                  <Users className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <div className="mt-4 text-xs text-green-600 flex items-center">
                 <span className="font-bold">+2</span>
                 <span className="text-gray-500 ml-1">new this week</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-md bg-white hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Active Inquiries</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.totalInquiries}</p>
                </div>
                <div className="bg-orange-100 p-3 rounded-full">
                  <MessageSquare className="h-6 w-6 text-orange-600" />
                </div>
              </div>
              <div className="mt-4 text-xs text-red-500 flex items-center">
                 <span className="font-bold">-5%</span>
                 <span className="text-gray-500 ml-1">from last week</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-md bg-white hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Total Page Views</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.totalViews.toLocaleString()}</p>
                </div>
                <div className="bg-purple-100 p-3 rounded-full">
                  <Eye className="h-6 w-6 text-purple-600" />
                </div>
              </div>
              <div className="mt-4 text-xs text-green-600 flex items-center">
                 <span className="font-bold">+24%</span>
                 <span className="text-gray-500 ml-1">traffic surge</span>
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
              <Button
                onClick={() => navigate('/admin/projects')}
                className="bg-blue-600 hover:bg-blue-700 h-auto py-4 flex-col gap-2"
              >
                <Building2 className="h-6 w-6" />
                <span>Manage Projects</span>
              </Button>
              <Button
                onClick={() => navigate('/admin/builders')}
                className="bg-green-600 hover:bg-green-700 h-auto py-4 flex-col gap-2"
              >
                <Users className="h-6 w-6" />
                <span>Manage Builders</span>
              </Button>
              <Button
                onClick={() => navigate('/admin/inquiries')}
                className="bg-orange-600 hover:bg-orange-700 h-auto py-4 flex-col gap-2"
              >
                <MessageSquare className="h-6 w-6" />
                <span>View Inquiries</span>
              </Button>
              <Button
                variant="outline"
                className="h-auto py-4 flex-col gap-2 border-dashed border-2 hover:bg-gray-50"
              >
                <FileText className="h-6 w-6 text-gray-600" />
                <span>Generate Report</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Inquiries (Takes up 2 columns on large screens) */}
          <Card className="border-none shadow-md bg-white lg:col-span-2">
            <CardHeader className="border-b border-gray-100 pb-4">
              <div className="flex items-center justify-between">
                <CardTitle>Recent Inquiries</CardTitle>
                <Button variant="ghost" className="text-xs h-8" onClick={() => navigate('/admin/inquiries')}>View All</Button>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="divide-y divide-gray-100">
                {recentInquiries.map((inquiry) => (
                  <div key={inquiry.id} className="py-4 hover:bg-gray-50 transition-colors rounded-md px-2 -mx-2">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-semibold">
                          {inquiry.investorName.charAt(0)}
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 text-sm">{inquiry.investorName}</h4>
                          <p className="text-xs text-gray-500">{inquiry.projectTitle}</p>
                        </div>
                      </div>
                      <span
                        className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
                          inquiry.status === 'New'
                            ? 'bg-blue-100 text-blue-700'
                            : inquiry.status === 'Contacted' 
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-green-100 text-green-700'
                        }`}
                      >
                        {inquiry.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2 pl-12 line-clamp-1">{inquiry.message}</p>
                    <div className="flex items-center justify-between text-xs text-gray-400 pl-12">
                      <span>{inquiry.investorCountry}</span>
                      <span>{inquiry.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Top Performing Projects (Takes up 1 column) */}
          <Card className="border-none shadow-md bg-white">
            <CardHeader className="border-b border-gray-100 pb-4">
              <CardTitle>Top Projects</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="divide-y divide-gray-100">
                {topProjects.map((project, index) => (
                  <div key={project.id} className="py-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-start space-x-3">
                        <div className={`
                          font-bold rounded-lg w-8 h-8 flex items-center justify-center text-sm
                          ${index === 0 ? 'bg-yellow-100 text-yellow-700' : 
                            index === 1 ? 'bg-gray-200 text-gray-700' : 
                            index === 2 ? 'bg-orange-100 text-orange-800' : 'bg-blue-50 text-blue-600'}
                        `}>
                          #{index + 1}
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 text-sm">{project.title}</h4>
                          <p className="text-xs text-gray-500 truncate w-32">{project.builderName}</p>
                        </div>
                      </div>
                    </div>
                    <div className="ml-11 grid grid-cols-2 gap-2 text-xs text-gray-600 bg-gray-50 p-2 rounded">
                      <span className="flex items-center">
                        <Eye className="h-3 w-3 mr-1 text-gray-400" />
                        {project.views.toLocaleString()}
                      </span>
                      <span className="flex items-center justify-end">
                        <MessageSquare className="h-3 w-3 mr-1 text-gray-400" />
                        {project.inquiries}
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
                View Analytics
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