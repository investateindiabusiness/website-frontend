import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Globe, Mail, Phone, ShieldCheck, ShieldAlert, CheckCircle, XCircle, Building2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/AuthContext';
import { fetchAllBuilders, verifyBuilderStatus } from '@/api'; 

const AdminBuilders = () => {
  const { user } = useAuth();
  const [builders, setBuilders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending'); // 'all', 'pending', 'verified'

  // Wait for the user to be loaded before fetching
  useEffect(() => {
    if (user && user.token) {
      loadBuilders();
    }
  }, [user]);

  const loadBuilders = async () => {
    try {
      setLoading(true);
      const data = await fetchAllBuilders(user.token);       
      setBuilders(data);
    } catch (error) {
      toast({ 
        title: "Error fetching builders", 
        description: error.message, 
        variant: "destructive" 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVerificationUpdate = async (builderId, status) => {
    try {
      setBuilders(prevBuilders => 
        prevBuilders.map(b => (b.id === builderId || b.uid === builderId) ? { ...b, isVerified: status } : b)
      );

      await verifyBuilderStatus(builderId, status, user?.token);
      
      toast({ title: "Status Updated", description: `Builder has been ${status ? 'Verified' : 'Rejected/Revoked'}.` });
    } catch (error) {
      loadBuilders(); 
      toast({ title: "Update Failed", description: error.message, variant: "destructive" });
    }
  };

  const filteredBuilders = builders.filter(builder => {
    // Treat undefined or missing isVerified as false (pending)
    const isVerif = builder.isVerified === true;
    if (filter === 'pending') return !isVerif;
    if (filter === 'verified') return isVerif;
    return true; 
  });

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <div className="flex-1 container mx-auto px-4 py-24 max-w-7xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Manage Builders</h1>
            <p className="text-gray-600">Review, verify, and manage builder applications.</p>
          </div>

          <div className="flex bg-gray-200/50 p-1 rounded-lg">
            <button onClick={() => setFilter('pending')} className={`px-4 py-2 text-sm font-semibold rounded-md transition-all ${filter === 'pending' ? 'bg-white shadow-sm text-orange-600' : 'text-gray-600 hover:text-gray-900'}`}>
              Pending Approval
            </button>
            <button onClick={() => setFilter('verified')} className={`px-4 py-2 text-sm font-semibold rounded-md transition-all ${filter === 'verified' ? 'bg-white shadow-sm text-green-600' : 'text-gray-600 hover:text-gray-900'}`}>
              Verified Partners
            </button>
            <button onClick={() => setFilter('all')} className={`px-4 py-2 text-sm font-semibold rounded-md transition-all ${filter === 'all' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-600 hover:text-gray-900'}`}>
              All
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {loading ? (
            <div className="col-span-full flex flex-col items-center justify-center text-gray-500 py-24">
               <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mb-4"></div>
               Loading builders...
            </div>
          ) : filteredBuilders.length === 0 ? (
             <div className="col-span-full text-center bg-white rounded-xl p-12 border border-gray-100 shadow-sm text-gray-500">
               No builders found in this category.
             </div>
          ) : filteredBuilders.map((builder) => {
            const builderId = builder.uid || builder.id; // Support both ID formats

            return (
            <Card key={builderId} className="border border-gray-100 shadow-lg hover:shadow-xl transition-shadow flex flex-col">
              <CardContent className="p-8 flex-1 flex flex-col">
                
                <div className="flex items-start space-x-6 mb-6">
                  <div className="w-20 h-20 flex-shrink-0 bg-orange-50 rounded-xl border border-orange-100 flex items-center justify-center overflow-hidden">
                    <Building2 className="h-8 w-8 text-orange-400" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2 gap-2">
                      <h3 className="text-xl font-bold text-gray-900 line-clamp-2">{builder.companyName || 'Unnamed Company'}</h3>
                      {builder.isVerified ? (
                        <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-none flex-shrink-0">
                          <ShieldCheck className="w-3 h-3 mr-1" /> Verified
                        </Badge>
                      ) : (
                        <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100 border-none flex-shrink-0">
                          <ShieldAlert className="w-3 h-3 mr-1" /> Pending
                        </Badge>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-600 mb-2">
                      {builder.yearOfIncorporation && <span>Est. {builder.yearOfIncorporation}</span>}
                      {builder.yearOfIncorporation && <span>•</span>}
                      <span>{builder.totalProjectsCompleted || 0} Projects Completed</span>
                    </div>
                  </div>
                </div>

                <p className="text-gray-700 mb-6 leading-relaxed text-sm line-clamp-3">
                  {builder.email || 'No Email provided.'}
                </p>

                <p className="text-gray-700 mb-6 leading-relaxed text-sm line-clamp-3">
                  {builder.companyOverview || 'No company overview provided.'}
                </p>

                <div className="space-y-4 mb-6 flex-1">
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                    <h4 className="text-sm font-semibold text-gray-700 mb-3">Key Details</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">RERA No:</span>
                        <span className="font-medium text-right line-clamp-1 max-w-[60%]">{builder.reraRegistrationNumbers || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Promoters/Directors:</span>
                        <span className="font-medium text-right line-clamp-1 max-w-[60%]">{builder.promotersOrDirectors || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Operating City:</span>
                        <span className="font-medium">{builder.city || 'N/A'}, {builder.state || 'N/A'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-6 border-t border-gray-100 pt-4">
                  <div className="w-full flex justify-between mb-2">
                    <span className="font-medium text-gray-900">{builder.contactPersonName || 'No Contact Person'}</span>
                  </div>
                  <a href={`mailto:${builder.contactPersonEmail || builder.email}`} className="flex items-center hover:text-orange-600 transition-colors">
                    <Mail className="h-4 w-4 mr-1.5" /> Email
                  </a>
                  <a href={`tel:${builder.contactPersonPhone || ''}`} className="flex items-center hover:text-orange-600 transition-colors">
                    <Phone className="h-4 w-4 mr-1.5" /> Call
                  </a>
                </div>

                <div className="mt-auto pt-4 border-t border-gray-100 flex gap-3">
                  {!builder.isVerified ? (
                    <>
                      <Button onClick={() => handleVerificationUpdate(builderId, true)} className="flex-1 bg-green-600 hover:bg-green-700 text-white">
                        <CheckCircle className="w-4 h-4 mr-2" /> Approve
                      </Button>
                      <Button onClick={() => handleVerificationUpdate(builderId, false)} variant="outline" className="flex-1 border-red-200 text-red-600 hover:bg-red-50">
                        <XCircle className="w-4 h-4 mr-2" /> Reject
                      </Button>
                    </>
                  ) : (
                    <Button onClick={() => handleVerificationUpdate(builderId, false)} variant="outline" className="w-full border-red-200 text-red-600 hover:bg-red-50">
                        <ShieldAlert className="w-4 h-4 mr-2" /> Revoke Verification
                    </Button>
                  )}
                </div>

              </CardContent>
            </Card>
            );
          })}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AdminBuilders;