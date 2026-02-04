import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { MessageSquare, Mail, Phone, MapPin, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { Toaster } from '@/components/ui/toaster';

const AdminInquiries = () => {
  const [inquiries, setInquiries] = useState([]);
  const [builders, setBuilders] = useState([]);
  const [filterStatus, setFilterStatus] = useState('all');
  const [loading, setLoading] = useState(true);

  let filteredInquiries = [];
  if (filterStatus === 'all') {
    filteredInquiries = inquiries;
  } else {
    for (let i = 0; i < inquiries.length; i++) {
      if (inquiries[i].status === filterStatus) {
        filteredInquiries.push(inquiries[i]);
      }
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Toaster />

      <div className="container mx-auto px-4 py-24">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Investor Inquiries</h1>
          <p className="text-gray-600">Manage and assign investor inquiries to builders</p>
        </div>

        <Card className="mb-8 border-none shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <label className="text-sm font-medium text-gray-700">Filter by Status:</label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Inquiries</option>
                  <option value="New">New</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>
              <div className="text-sm text-gray-600">
                {loading
                  ? 'Loading inquiries...'
                  : `Showing ${filteredInquiries.length} of ${inquiries.length} inquiries`}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-16 text-gray-500">
              Loading inquiries...
            </div>
          ) : filteredInquiries.map((inquiry) => (
            <Card key={inquiry.id} className="border-none shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-xl font-bold text-gray-900">{inquiry.investorName}</h3>
                      <Badge className={
                        inquiry.status === 'New' ? 'bg-blue-500 text-white' :
                        inquiry.status === 'In Progress' ? 'bg-orange-500 text-white' :
                        'bg-green-500 text-white'
                      }>
                        {inquiry.status === 'New' && <Clock className="h-3 w-3 mr-1 inline" />}
                        {inquiry.status === 'In Progress' && <AlertCircle className="h-3 w-3 mr-1 inline" />}
                        {inquiry.status === 'Closed' && <CheckCircle className="h-3 w-3 mr-1 inline" />}
                        {inquiry.status}
                      </Badge>
                    </div>
                    <p className="text-lg font-semibold text-blue-600 mb-2">{inquiry.projectTitle}</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-4">
                      <div className="flex items-center space-x-2">
                        <Mail className="h-4 w-4" />
                        <span>{inquiry.investorEmail}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Phone className="h-4 w-4" />
                        <span>{inquiry.investorPhone}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4" />
                        <span>{inquiry.investorCountry}</span>
                      </div>
                      <div className="text-gray-500">
                        Date: {inquiry.date}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Message</h4>
                  <p className="text-gray-700">{inquiry.message}</p>
                  <div className="mt-2 text-sm text-gray-600">
                    <strong>Budget:</strong> {inquiry.budget}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {inquiry.assignedTo ? (
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <span className="text-sm font-medium text-gray-700">
                          Assigned to: <span className="text-blue-600">{inquiry.assignedTo}</span>
                        </span>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-500">Not assigned yet</span>
                    )}
                  </div>

                  <div className="flex items-center space-x-3">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          Assign to Builder
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Assign to Builder</DialogTitle>
                          <DialogDescription>
                            Select a builder to assign this inquiry
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-3">
                          {builders.map((builder) => (
                            <Button
                              key={builder.id}
                              variant="outline"
                              className="w-full justify-start"
                              onClick={() => handleAssign(inquiry.id, builder.companyName)}
                            >
                              <div className="flex items-center space-x-3">
                                <img
                                  src={builder.logo}
                                  alt={builder.companyName}
                                  className="w-10 h-10 object-cover rounded"
                                />
                                <div className="text-left">
                                  <div className="font-semibold">{builder.companyName}</div>
                                  <div className="text-xs text-gray-500">{builder.regions.join(', ')}</div>
                                </div>
                              </div>
                            </Button>
                          ))}
                        </div>
                      </DialogContent>
                    </Dialog>

                    <select
                      value={inquiry.status}
                      onChange={(e) => handleStatusChange(inquiry.id, e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="New">New</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Closed">Closed</option>
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {!loading && filteredInquiries.length === 0 && (
          <div className="text-center py-16">
            <MessageSquare className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No inquiries found</h3>
            <p className="text-gray-500">Try adjusting your filters</p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default AdminInquiries;
