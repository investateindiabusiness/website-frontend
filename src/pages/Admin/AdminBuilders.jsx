import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, Globe, Mail, Phone } from 'lucide-react';

const AdminBuilders = () => {
  const [builders, setBuilders] = useState([]);
  const [loading, setLoading] = useState(true);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-24">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Manage Builders</h1>
          <p className="text-gray-600">View and manage verified builder profiles</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {loading ? (
            <div className="col-span-full text-center text-gray-500 py-16">
              Loading builders...
            </div>
          ) : builders.map((builder) => (
            <Card key={builder.id} className="border-none shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8">
                <div className="flex items-start space-x-6 mb-6">
                  <img
                    src={builder.logo}
                    alt={builder.companyName}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-2xl font-bold text-gray-900">{builder.companyName}</h3>
                      {builder.verified && (
                        <Badge className="bg-green-500 text-white">Verified</Badge>
                      )}
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                      <span>{builder.yearsActive}+ Years</span>
                      <span>•</span>
                      <span>{builder.totalProjects} Projects</span>
                    </div>
                    <div className="flex items-center space-x-1 mb-3">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <Star className="h-4 w-4 text-gray-300" />
                      <span className="text-sm text-gray-600 ml-2">{builder.rating}/5</span>
                    </div>
                  </div>
                </div>

                <p className="text-gray-700 mb-6 leading-relaxed">{builder.overview}</p>

                <div className="space-y-4 mb-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">Company Details</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Type:</span>
                        <span className="font-medium">{builder.type}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">CIN:</span>
                        <span className="font-medium text-xs">{builder.cin}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">GST:</span>
                        <span className="font-medium text-xs">{builder.gst}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">Operating Regions</h4>
                    <div className="text-sm text-gray-600">{builder.regions.join(', ')}</div>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">Key Projects</h4>
                    <div className="text-sm text-gray-600">{builder.keyProjects.join(', ')}</div>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4 space-y-2">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">Contact Information</h4>
                  <div className="flex items-center space-x-3 text-sm text-gray-600">
                    <Phone className="h-4 w-4" />
                    <span>{builder.phone}</span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm text-gray-600">
                    <Mail className="h-4 w-4" />
                    <span>{builder.email}</span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm text-gray-600">
                    <Globe className="h-4 w-4" />
                    <a href={builder.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      {builder.website}
                    </a>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <p className="text-xs text-gray-500 mb-3">
                    <strong>Address:</strong> {builder.registeredAddress}
                  </p>
                  <div className="flex space-x-3">
                    <Button variant="outline" className="flex-1">
                      Edit Profile
                    </Button>
                    <Button className="flex-1 bg-blue-600 hover:bg-blue-700">
                      View Projects
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AdminBuilders;
