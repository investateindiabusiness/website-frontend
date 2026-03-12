import React, { useState, useEffect, useCallback } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, Phone, ShieldCheck, ShieldAlert, CheckCircle, XCircle, Building2, Clock, FileWarning, Plus, Trash2, Eye } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/AuthContext';
import { fetchAllBuilders, apiRequest } from '@/api';

// Standard keys so we can separate them from dynamically requested fields
const STANDARD_BUILDER_KEYS = [
  'id', 'uid', 'email', 'role', 'createdAt', 'updatedAt', 'onboardingStatus', 'isVerified', 'adminRequests', 'password',
  'companyName', 'yearsOfExperience', 'contactNameAndDesignation', 'contactPersonPhone', 'ongoingProjects', 'projectsCompleted',
  'address', 'country', 'state', 'city', 'zip', 'termsAccepted',
  'yearOfIncorporation', 'promotersOrDirectors', 'totalSqftDelivered', 'typeOfProjectsOffered', 'majorCompletedProjects',
  'companyOverview', 'experienceWithNriInvestors', 'declaredLitigationDisputes', 'financialOfCompany', 'outstandingDebt', 'bankingPartners'
];

const AdminBuilders = () => {
  const { user } = useAuth();
  const [builders, setBuilders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending');

  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [selectedBuilderId, setSelectedBuilderId] = useState(null);
  const [requestedFields, setRequestedFields] = useState([{ fieldName: '', type: 'text' }]);

  // State for the Detailed View Modal
  const [viewBuilderData, setViewBuilderData] = useState(null);

  const loadBuilders = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchAllBuilders(user.token);
      setBuilders(data);
    } catch (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }, [user?.token]);

  useEffect(() => {
    if (user && user.token) loadBuilders();
  }, [user, loadBuilders]);

  const handleApproveForm1 = async (builderId) => {
    try {
      await apiRequest(`/api/builders/approve-form1/${builderId}`, { method: 'POST' });
      toast({ title: "Success", description: "Form 1 Approved. Builder can now fill Form 2." });
      loadBuilders();
      setViewBuilderData(null); // Close modal if open
    } catch (err) { toast({ title: "Error", description: err.message, variant: "destructive" }); }
  };

  const handleFinalVerification = async (builderId, isVerified) => {
    try {
      await apiRequest(`/api/builders/verify-final/${builderId}`, { method: 'POST', body: JSON.stringify({ isVerified }) });
      toast({ title: "Success", description: `Builder has been ${isVerified ? 'Verified' : 'Rejected'}.` });
      loadBuilders();
      setViewBuilderData(null); // Close modal if open
    } catch (err) { toast({ title: "Error", description: err.message, variant: "destructive" }); }
  };

  const submitChangeRequest = async () => {
    const validFields = requestedFields.filter(f => f.fieldName.trim() !== '');
    if (validFields.length === 0) return toast({ title: "Error", description: "Add at least one field to request.", variant: "destructive" });
    try {
      await apiRequest(`/api/builders/request-changes/${selectedBuilderId}`, { method: 'POST', body: JSON.stringify({ fieldsRequested: validFields }) });
      toast({ title: "Success", description: "Request sent to builder." });
      setIsRequestModalOpen(false);
      setRequestedFields([{ fieldName: '', type: 'text' }]);
      loadBuilders();
    } catch (err) { toast({ title: "Error", description: err.message, variant: "destructive" }); }
  };

  const filteredBuilders = builders.filter(builder => {
    if (filter === 'pending') return builder.onboardingStatus === 'form1_pending' || builder.onboardingStatus === 'form2_pending';
    if (filter === 'changes_requested') return builder.onboardingStatus === 'form1_changes_requested';
    if (filter === 'verified') return builder.onboardingStatus === 'complete' && builder.isVerified === true;
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

          <div className="flex bg-gray-200/50 p-1 rounded-lg flex-wrap">
            <button onClick={() => setFilter('pending')} className={`px-4 py-2 text-sm font-semibold rounded-md transition-all ${filter === 'pending' ? 'bg-white shadow-sm text-orange-600' : 'text-gray-600'}`}>Needs Review</button>
            <button onClick={() => setFilter('changes_requested')} className={`px-4 py-2 text-sm font-semibold rounded-md transition-all ${filter === 'changes_requested' ? 'bg-white shadow-sm text-yellow-600' : 'text-gray-600'}`}>Awaiting Changes</button>
            <button onClick={() => setFilter('verified')} className={`px-4 py-2 text-sm font-semibold rounded-md transition-all ${filter === 'verified' ? 'bg-white shadow-sm text-green-600' : 'text-gray-600'}`}>Verified Partners</button>
            <button onClick={() => setFilter('all')} className={`px-4 py-2 text-sm font-semibold rounded-md transition-all ${filter === 'all' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-600'}`}>All</button>
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
            const builderId = builder.uid || builder.id;

            const renderStatusBadge = () => {
              switch (builder.onboardingStatus) {
                case 'form1_pending': return <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100 border-none"><Clock className="w-3 h-3 mr-1" /> Form 1 Review</Badge>;
                case 'form2_pending': return <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-100 border-none"><Clock className="w-3 h-3 mr-1" /> Final Review</Badge>;
                case 'form1_changes_requested': return <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100 border-none"><FileWarning className="w-3 h-3 mr-1" /> Changes Req.</Badge>;
                case 'complete': return <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-none"><ShieldCheck className="w-3 h-3 mr-1" /> Verified</Badge>;
                default: return <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-100 border-none">Unknown</Badge>;
              }
            };

            return (
              <Card key={builderId} className="border border-gray-100 shadow-lg flex flex-col relative overflow-hidden">
                {/* Top accent line based on status */}
                <div className={`h-1 w-full ${builder.onboardingStatus === 'complete' ? 'bg-green-500' : builder.onboardingStatus === 'form1_changes_requested' ? 'bg-orange-500' : 'bg-blue-500'}`} />

                <CardContent className="p-8 flex-1 flex flex-col">
                  <div className="flex items-start space-x-6 mb-6">
                    <div className="w-16 h-16 flex-shrink-0 bg-orange-50 rounded-xl flex items-center justify-center">
                      <Building2 className="h-8 w-8 text-orange-400" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2 gap-2">
                        <h3 className="text-xl font-bold text-gray-900 truncate">{builder.companyName || builder.name || 'Unnamed Company'}</h3>
                        {renderStatusBadge()}
                      </div>
                      <p className="text-sm text-gray-500">{builder.city}, {builder.state}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-6 border-t border-gray-100 pt-4">
                    <a href={`mailto:${builder.email}`} className="flex items-center hover:text-orange-600"><Mail className="h-4 w-4 mr-1.5" /> Email</a>
                    {builder.contactPersonPhone && <a href={`tel:${builder.contactPersonPhone}`} className="flex items-center hover:text-orange-600"><Phone className="h-4 w-4 mr-1.5" /> Call</a>}
                  </div>

                  <div className="mt-auto pt-4 flex gap-3">
                    <Button onClick={() => setViewBuilderData(builder)} className="w-full bg-gray-900 hover:bg-gray-800 text-white">
                      <Eye className="w-4 h-4 mr-2" /> View Full Profile
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* DETAILED VIEW MODAL */}
      <Dialog open={!!viewBuilderData} onOpenChange={(open) => !open && setViewBuilderData(null)}>
        <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto p-0">
          <DialogHeader className="p-6 pb-0 sticky top-0 bg-white z-10 border-b border-gray-100">
            <DialogTitle className="text-2xl font-bold text-gray-900">{viewBuilderData?.companyName || 'Builder Details'}</DialogTitle>
            <DialogDescription>Review the complete submission history for this partner.</DialogDescription>
          </DialogHeader>

          {viewBuilderData && (
            <div className="p-6 space-y-8 bg-gray-50">

              {/* Form 1 Section */}
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h4 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">Form 1: Initial Details</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8 text-sm">
                  <div><span className="text-gray-500 block mb-1">Company Name</span><span className="font-medium">{viewBuilderData.companyName || '-'}</span></div>
                  <div><span className="text-gray-500 block mb-1">Years of Experience</span><span className="font-medium">{viewBuilderData.yearsOfExperience || '-'}</span></div>
                  <div><span className="text-gray-500 block mb-1">Contact Person & Desig.</span><span className="font-medium">{viewBuilderData.contactNameAndDesignation || '-'}</span></div>
                  <div><span className="text-gray-500 block mb-1">Contact Phone</span><span className="font-medium">{viewBuilderData.contactPersonPhone || '-'}</span></div>
                  <div><span className="text-gray-500 block mb-1">Ongoing Projects (Count)</span><span className="font-medium">{viewBuilderData.ongoingProjects || '-'}</span></div>
                  <div><span className="text-gray-500 block mb-1">Completed Projects (Count)</span><span className="font-medium">{viewBuilderData.projectsCompleted || '-'}</span></div>
                  <div className="md:col-span-2"><span className="text-gray-500 block mb-1">Address</span><span className="font-medium">{viewBuilderData.address}, {viewBuilderData.city}, {viewBuilderData.state}, {viewBuilderData.zip}, {viewBuilderData.country}</span></div>
                </div>
              </div>

              {/* Dynamic Added Fields Section (If user submitted changes) */}
              {Object.keys(viewBuilderData).filter(key => !STANDARD_BUILDER_KEYS.includes(key)).length > 0 && (
                <div className="bg-orange-50 p-6 rounded-xl border border-orange-100 shadow-sm">
                  <h4 className="text-lg font-semibold text-orange-900 mb-4 border-b border-orange-200 pb-2">Admin Requested Details</h4>
                  <div className="grid grid-cols-1 gap-y-4 text-sm">
                    {Object.keys(viewBuilderData).filter(key => !STANDARD_BUILDER_KEYS.includes(key)).map(key => (
                      <div key={key}>
                        <span className="text-orange-700/70 block mb-1 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                        <span className="font-medium text-orange-950">{viewBuilderData[key]}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Form 2 Section */}
              {(viewBuilderData.onboardingStatus === 'form2_pending' || viewBuilderData.onboardingStatus === 'complete') && (
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">Form 2: Deep Verification</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8 text-sm">
                    <div><span className="text-gray-500 block mb-1">Year of Incorporation</span><span className="font-medium">{viewBuilderData.yearOfIncorporation || '-'}</span></div>
                    <div><span className="text-gray-500 block mb-1">Total Sqft Delivered</span><span className="font-medium">{viewBuilderData.totalSqftDelivered || '-'}</span></div>
                    <div><span className="text-gray-500 block mb-1">Type of Projects</span><span className="font-medium">{viewBuilderData.typeOfProjectsOffered || '-'}</span></div>
                    <div><span className="text-gray-500 block mb-1">Experience with NRI</span><span className="font-medium">{viewBuilderData.experienceWithNriInvestors || '-'}</span></div>
                    <div><span className="text-gray-500 block mb-1">Outstanding Debt</span><span className="font-medium">{viewBuilderData.outstandingDebt || '-'}</span></div>
                    <div className="md:col-span-2"><span className="text-gray-500 block mb-1">Promoters / Directors</span><span className="font-medium">{viewBuilderData.promotersOrDirectors || '-'}</span></div>
                    <div className="md:col-span-2"><span className="text-gray-500 block mb-1">Major Completed Projects</span><span className="font-medium whitespace-pre-wrap">{viewBuilderData.majorCompletedProjects || '-'}</span></div>
                    <div className="md:col-span-2"><span className="text-gray-500 block mb-1">Company Overview</span><span className="font-medium whitespace-pre-wrap">{viewBuilderData.companyOverview || '-'}</span></div>
                    <div className="md:col-span-2"><span className="text-gray-500 block mb-1">Litigation / Disputes</span><span className="font-medium whitespace-pre-wrap">{viewBuilderData.declaredLitigationDisputes || 'None declared'}</span></div>
                    <div className="md:col-span-2"><span className="text-gray-500 block mb-1">Financials (P&L Brief)</span><span className="font-medium whitespace-pre-wrap">{viewBuilderData.financialOfCompany || '-'}</span></div>
                    <div className="md:col-span-2"><span className="text-gray-500 block mb-1">Banking Partners</span><span className="font-medium">{viewBuilderData.bankingPartners || '-'}</span></div>
                  </div>
                </div>
              )}

              {/* Action Buttons Inside Modal */}
              <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-wrap gap-3 sticky bottom-4">
                {viewBuilderData.onboardingStatus === 'form1_pending' && (
                  <>
                    <Button onClick={() => handleApproveForm1(viewBuilderData.uid)} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">Approve Form 1</Button>
                    <Button onClick={() => { setSelectedBuilderId(viewBuilderData.uid); setIsRequestModalOpen(true); }} variant="outline" className="flex-1 border-orange-200 text-orange-600 hover:bg-orange-50">Request Changes</Button>
                  </>
                )}
                {viewBuilderData.onboardingStatus === 'form2_pending' && (
                  <>
                    <Button onClick={() => handleFinalVerification(viewBuilderData.uid, true)} className="flex-1 bg-green-600 hover:bg-green-700 text-white"><CheckCircle className="w-4 h-4 mr-2" /> Verify Account</Button>
                    <Button onClick={() => handleFinalVerification(viewBuilderData.uid, false)} variant="outline" className="flex-1 border-red-200 text-red-600 hover:bg-red-50"><XCircle className="w-4 h-4 mr-2" /> Reject</Button>
                  </>
                )}
                {viewBuilderData.onboardingStatus === 'complete' && viewBuilderData.isVerified === true && (
                  <Button onClick={() => handleFinalVerification(viewBuilderData.uid, false)} variant="outline" className="w-full border-red-200 text-red-600 hover:bg-red-50"><ShieldAlert className="w-4 h-4 mr-2" /> Revoke Verification</Button>
                )}
                {viewBuilderData.onboardingStatus === 'form1_changes_requested' && (
                  <div className="w-full text-center text-sm font-medium text-orange-600 bg-orange-50 py-3 rounded-md">Waiting for builder to submit requested changes.</div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* REQUEST CHANGES MODAL */}
      <Dialog open={isRequestModalOpen} onOpenChange={setIsRequestModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Request More Information</DialogTitle>
            <DialogDescription>Specify additional fields the builder needs to provide.</DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            {requestedFields.map((field, idx) => (
              <div key={idx} className="flex gap-3 items-end">
                <div className="flex-1">
                  <Label className="text-xs text-gray-500">Field Name</Label>
                  <Input value={field.fieldName} onChange={(e) => { const updated = [...requestedFields]; updated[idx].fieldName = e.target.value; setRequestedFields(updated); }} placeholder="e.g. GST Certificate" />
                </div>
                <div className="w-1/3">
                  <Label className="text-xs text-gray-500">Type</Label>
                  <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={field.type} onChange={(e) => { const updated = [...requestedFields]; updated[idx].type = e.target.value; setRequestedFields(updated); }}>
                    <option value="text">Text / Link</option>
                    <option value="file">File Upload</option>
                  </select>
                </div>
                <Button variant="ghost" onClick={() => { const updated = [...requestedFields]; updated.splice(idx, 1); setRequestedFields(updated); }} className="text-red-500 p-2"><Trash2 size={16} /></Button>
              </div>
            ))}
            <Button type="button" variant="outline" onClick={() => setRequestedFields([...requestedFields, { fieldName: '', type: 'text' }])} className="w-full mt-2 text-sm"><Plus className="w-4 h-4 mr-2" /> Add Another Field</Button>
            <Button onClick={submitChangeRequest} className="w-full bg-orange-600 hover:bg-orange-700 text-white mt-6">Send Request to Builder</Button>
          </div>
        </DialogContent>
      </Dialog>
      <Footer />
    </div>
  );
};

export default AdminBuilders;