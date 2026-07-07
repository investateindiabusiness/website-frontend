"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, Phone, ShieldCheck, ShieldAlert, CheckCircle, XCircle, Settings, Clock, FileWarning, Plus, Eye, Download, Loader2, TrendingUp } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/AuthContext';
import {
  fetchAllServiceProviders,
  approveServiceProviderForm1,
  requestServiceProviderChanges,
  verifyServiceProviderFinal
} from '@/api';

const STANDARD_SP_KEYS = [
  'id', 'uid', 'email', 'role', 'createdAt', 'updatedAt', 'onboardingStatus', 'isVerified', 'adminRequests', 'password',
  'fullName', 'contactNumber', 'serviceCategory', 'yearsOfExperience',
  'address', 'country', 'state', 'city', 'zip', 'termsAccepted'
];

const FORM1_SP_FIELDS = [
  { id: 'fullName', label: 'Full Name / Entity Name' },
  { id: 'contactNumber', label: 'Contact Number' },
  { id: 'serviceCategory', label: 'Service Category' },
  { id: 'yearsOfExperience', label: 'Years of Experience' },
  { id: 'address', label: 'Street Address' },
  { id: 'city', label: 'City' },
  { id: 'state', label: 'State' },
  { id: 'zip', label: 'ZIP Code' },
  { id: 'country', label: 'Country' }
];

export default function AdminServiceProviders() {
  const { user } = useAuth();
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    setCurrentPage(1);
  }, [filter]);

  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [selectedProviderId, setSelectedProviderId] = useState(null);

  const [requestedFields, setRequestedFields] = useState([]);
  const [customFieldInput, setCustomFieldInput] = useState('');

  const [viewProviderData, setViewProviderData] = useState(null);

  const handleToggleField = (fieldId) => {
    setRequestedFields(prev => prev.includes(fieldId) ? prev.filter(id => id !== fieldId) : [...prev, fieldId]);
  };

  const handleAddCustomField = () => {
    if (!customFieldInput.trim()) return;
    const formattedId = customFieldInput.trim().toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase());
    if (!requestedFields.includes(formattedId)) setRequestedFields(prev => [...prev, formattedId]);
    setCustomFieldInput('');
  };

  const loadProviders = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchAllServiceProviders(user?.token);
      setProviders(data || []);
    } catch (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }, [user?.token]);

  useEffect(() => {
    if (user && user.token) loadProviders();
  }, [user, loadProviders]);

  const handleApproveForm1 = async (providerId) => {
    try {
      await approveServiceProviderForm1(providerId);
      toast({ title: "Success", description: "Service Provider approved and verified successfully." });
      loadProviders();
      setViewProviderData(null);
    } catch (err) { toast({ title: "Error", description: err.message, variant: "destructive" }); }
  };

  const handleFinalVerification = async (providerId, isVerified) => {
    try {
      await verifyServiceProviderFinal(providerId, isVerified);
      toast({ title: "Success", description: `Service Provider has been ${isVerified ? 'Verified' : 'Rejected'}.` });
      loadProviders();
      setViewProviderData(null);
    } catch (err) { toast({ title: "Error", description: err.message, variant: "destructive" }); }
  };

  const submitChangeRequest = async () => {
    const validFields = requestedFields.filter(f => typeof f === 'string' && f.trim() !== '');
    if (validFields.length === 0) return toast({ title: "Error", description: "Add at least one field to request.", variant: "destructive" });

    try {
      await requestServiceProviderChanges(selectedProviderId, validFields);
      toast({ title: "Success", description: "Request sent to service provider." });
      setIsRequestModalOpen(false);
      setRequestedFields([]);
      setCustomFieldInput('');
      loadProviders();
    } catch (err) { toast({ title: "Error", description: err.message, variant: "destructive" }); }
  };

  const downloadCSV = () => {
    if (!providers || providers.length === 0) {
      toast({ title: "Export Failed", description: "No service providers available to export.", variant: "destructive" });
      return;
    }

    const EXCLUDED_FIELDS = ['uid', 'id', 'password', 'createdAt', 'updatedAt', 'adminRequests', 'profileImage', 'role', 'onboardingStatus'];

    const allKeys = new Set();
    providers.forEach(p => Object.keys(p).forEach(key => allKeys.add(key)));

    const headers = Array.from(allKeys).filter(key => !EXCLUDED_FIELDS.includes(key));

    const csvRows = [];
    const formattedHeaders = headers.map(key => key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()));
    csvRows.push(formattedHeaders.join(','));

    providers.forEach(p => {
      const values = headers.map(header => {
        let val = p[header];
        if (val === undefined || val === null) return '""';
        if (typeof val === 'object') return `"${JSON.stringify(val).replace(/"/g, '""')}"`;
        return `"${String(val).replace(/"/g, '""')}"`;
      });
      csvRows.push(values.join(','));
    });

    const csvContent = "data:text/csv;charset=utf-8," + csvRows.join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `service_providers_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredProviders = providers.filter((p) => {
    if (filter === 'verified') return p.isVerified === true && p.onboardingStatus === 'complete';
    if (filter === 'pending') return p.onboardingStatus === 'form1_pending';
    if (filter === 'changes') return p.onboardingStatus === 'form1_changes_requested';
    return true;
  });

  return (
    <div className="font-sans">
      <div className="flex-grow md:mt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight flex items-center uppercase">
                <Settings className="w-8 h-8 mr-3 text-orange-600" /> Service Providers Management
              </h1>
              <p className="text-sm text-slate-500 font-medium">Verify credentials, review onboarding stages, and approve service providers.</p>
            </div>
            <Button onClick={downloadCSV} className="bg-slate-900 hover:bg-black text-white rounded-xl flex items-center gap-2">
              <Download className="w-4 h-4" /> Export CSV
            </Button>
          </div>

          {/* Filtering tabs */}
          <div className="flex flex-wrap gap-2 mb-6">
            {[
              { id: 'all', label: 'All Providers' },
              { id: 'pending', label: 'Pending Review' },
              { id: 'changes', label: 'Changes Requested' },
              { id: 'verified', label: 'Verified Partners' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id)}
                className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-xl transition-all ${filter === tab.id
                    ? 'bg-slate-900 text-white shadow'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-10 h-10 text-orange-600 animate-spin mb-4" />
              <p className="text-sm text-slate-500">Fetching service providers database...</p>
            </div>
          ) : filteredProviders.length === 0 ? (
            <Card className="p-12 text-center text-slate-400 border border-gray-100 rounded-3xl">
              <p>No service providers matches the selected filter.</p>
            </Card>
          ) : (
            <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50/75 border-b border-gray-200 text-gray-600 text-xs font-bold uppercase tracking-wider">
                      <th className="px-6 py-4">Full Name</th>
                      <th className="px-6 py-4">Category</th>
                      <th className="px-6 py-4">Contact Info</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredProviders.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE).map((sp) => {
                      const renderStatusBadge = () => (
                        <Badge className={`border-none text-xs font-semibold py-1 px-3 ${sp.isVerified
                            ? 'bg-green-100 text-green-700'
                            : sp.onboardingStatus === 'form1_changes_requested'
                              ? 'bg-amber-100 text-amber-700'
                              : 'bg-yellow-100 text-yellow-700'
                          }`}>
                          {sp.isVerified ? 'Verified' : sp.onboardingStatus.replace('_', ' ').toUpperCase()}
                        </Badge>
                      );

                      return (
                        <tr key={sp.id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center flex-shrink-0">
                                <TrendingUp className="h-5 w-5 text-slate-500" />
                              </div>
                              <div>
                                <div className="text-sm font-bold text-gray-900">
                                  {sp.fullName || sp.email.split('@')[0]}
                                </div>
                                <div className="text-xs text-gray-400">
                                  Experience: {sp.yearsOfExperience || '0'} yrs
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {sp.serviceCategory || "Professional Service"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex flex-col gap-0.5 text-sm text-gray-600">
                              <a href={`mailto:${sp.email}`} className="flex items-center hover:text-orange-600 gap-1.5"><Mail className="h-3.5 w-3.5 text-gray-400" /> {sp.email}</a>
                              {sp.contactNumber && (
                                <a href={`tel:${sp.contactNumber}`} className="flex items-center hover:text-orange-600 gap-1.5"><Phone className="h-3.5 w-3.5 text-gray-400" /> {sp.contactNumber}</a>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {renderStatusBadge()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex justify-end gap-2">
                              <Button
                                onClick={() => setViewProviderData(sp)}
                                className="bg-gray-900 hover:bg-gray-800 text-white rounded-xl text-xs px-4 py-2"
                              >
                                <Eye className="w-3.5 h-3.5 mr-1.5" /> View Profile
                              </Button>
                              {sp.onboardingStatus === 'form1_pending' && (
                                <Button
                                  onClick={() => { setSelectedProviderId(sp.id); setRequestedFields([]); setIsRequestModalOpen(true); }}
                                  variant="ghost"
                                  className="text-amber-600 hover:text-amber-700 hover:bg-amber-50 rounded-xl text-xs font-bold border border-amber-100 hover:border-amber-200"
                                >
                                  Request Changes
                                </Button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Pagination Controls */}
              {Math.ceil(filteredProviders.length / ITEMS_PER_PAGE) > 1 && (
                <div className="bg-gray-50 border-t border-gray-200 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, filteredProviders.length)} of {filteredProviders.length} records
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Button
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      variant="outline"
                      className="h-9 px-3 rounded-lg text-xs font-bold hover:bg-slate-100 bg-white"
                    >
                      Previous
                    </Button>

                    {Array.from({ length: Math.ceil(filteredProviders.length / ITEMS_PER_PAGE) }, (_, i) => i + 1).map((page) => (
                      <Button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        variant={currentPage === page ? 'default' : 'outline'}
                        className={`h-9 w-9 p-0 rounded-lg text-xs font-bold ${currentPage === page ? 'bg-slate-950 text-white hover:bg-slate-800' : 'hover:bg-slate-100 bg-white'
                          }`}
                      >
                        {page}
                      </Button>
                    ))}

                    <Button
                      onClick={() => setCurrentPage(prev => Math.min(Math.ceil(filteredProviders.length / ITEMS_PER_PAGE), prev + 1))}
                      disabled={currentPage === Math.ceil(filteredProviders.length / ITEMS_PER_PAGE)}
                      variant="outline"
                      className="h-9 px-3 rounded-lg text-xs font-bold hover:bg-slate-100 bg-white"
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Provider Details Dialog */}
      <Dialog open={!!viewProviderData} onOpenChange={() => setViewProviderData(null)}>
        <DialogContent className="max-w-2xl bg-white rounded-3xl p-6 overflow-hidden flex flex-col max-h-[90vh]">
          <DialogHeader className="border-b border-gray-100 pb-4">
            <DialogTitle className="text-xl font-bold flex items-center gap-2 text-slate-900">
              {viewProviderData?.fullName || 'Service Provider Profile'}
            </DialogTitle>
            <DialogDescription className="text-xs">Full onboarding credentials submitted by the partner.</DialogDescription>
          </DialogHeader>

          {viewProviderData && (
            <div className="flex-grow overflow-y-auto space-y-6 py-4 custom-scrollbar pr-1">

              {/* Profile Details Grid */}
              <div className="space-y-4">
                <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Registration Details</h4>
                <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4.5 rounded-2xl border border-slate-100">
                  {FORM1_SP_FIELDS.map(f => (
                    <div key={f.id} className="text-xs">
                      <span className="text-slate-400 font-semibold block">{f.label}</span>
                      <strong className="text-slate-800 text-sm">{viewProviderData[f.id] || '—'}</strong>
                    </div>
                  ))}
                </div>
              </div>

              {/* Custom / Overflow Fields */}
              {Object.keys(viewProviderData)
                .filter(key => !STANDARD_SP_KEYS.includes(key))
                .length > 0 && (
                  <div className="space-y-4">
                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Additional Requested Details</h4>
                    <div className="grid grid-cols-2 gap-4 bg-amber-50/50 border border-amber-100/50 p-4.5 rounded-2xl">
                      {Object.keys(viewProviderData)
                        .filter(key => !STANDARD_SP_KEYS.includes(key))
                        .map(key => (
                          <div key={key} className="text-xs">
                            <span className="text-slate-400 font-semibold block uppercase tracking-wider">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                            <strong className="text-slate-800 text-sm">{String(viewProviderData[key] || '—')}</strong>
                          </div>
                        ))}
                    </div>
                  </div>
                )}

              {/* Actions Footer inside dialog */}
              <div className="border-t border-gray-100 pt-5 flex flex-wrap gap-3 justify-end">
                {viewProviderData.onboardingStatus === 'form1_pending' && (
                  <Button
                    onClick={() => handleApproveForm1(viewProviderData.id)}
                    className="bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold flex items-center gap-1.5"
                  >
                    <ShieldCheck className="w-4 h-4" /> Approve & Verify Partner
                  </Button>
                )}

                {viewProviderData.onboardingStatus === 'complete' && viewProviderData.isVerified === true && (
                  <Button
                    onClick={() => handleFinalVerification(viewProviderData.id, false)}
                    variant="destructive"
                    className="rounded-xl font-bold flex items-center gap-1.5"
                  >
                    <ShieldAlert className="w-4 h-4" /> Revoke Verification
                  </Button>
                )}

                {viewProviderData.onboardingStatus === 'complete' && viewProviderData.isVerified === false && (
                  <Button
                    onClick={() => handleFinalVerification(viewProviderData.id, true)}
                    className="bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold flex items-center gap-1.5"
                  >
                    <ShieldCheck className="w-4 h-4" /> Re-enable Verification
                  </Button>
                )}

                <Button variant="outline" onClick={() => setViewProviderData(null)} className="rounded-xl">Close</Button>
              </div>

            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Change Request Modal */}
      <Dialog open={isRequestModalOpen} onOpenChange={setIsRequestModalOpen}>
        <DialogContent className="max-w-md bg-white rounded-3xl p-6">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <FileWarning className="w-5 h-5 text-amber-500" /> Request Profile Corrections
            </DialogTitle>
            <DialogDescription className="text-xs">Select fields that the partner must correct or provide.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Standard Profile Fields</Label>
              <div className="grid grid-cols-2 gap-2">
                {FORM1_SP_FIELDS.map(f => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => handleToggleField(f.id)}
                    className={`text-left px-3 py-2 text-xs font-semibold rounded-lg border transition-all ${requestedFields.includes(f.id)
                        ? 'bg-amber-100 border-amber-300 text-amber-800'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="h-px bg-slate-100" />

            <div className="space-y-2">
              <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Custom Fields Requirement</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="e.g. gstNumber or reraRegistration"
                  value={customFieldInput}
                  onChange={(e) => setCustomFieldInput(e.target.value)}
                  className="rounded-lg h-9 text-xs border-slate-200"
                />
                <Button onClick={handleAddCustomField} size="sm" type="button" className="bg-slate-800 hover:bg-slate-900 text-white rounded-lg h-9 px-3">
                  <Plus className="w-4 h-4" /> Add
                </Button>
              </div>
            </div>

            {requestedFields.length > 0 && (
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 space-y-1">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Selected Fields to Correct:</span>
                <div className="flex flex-wrap gap-1.5">
                  {requestedFields.map(id => (
                    <Badge key={id} className="bg-slate-800/10 text-slate-800 border-none font-bold text-[10px] rounded-md px-2 py-0.5">
                      {id.replace(/([A-Z])/g, ' $1').trim()}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-2.5 justify-end">
            <Button variant="outline" onClick={() => setIsRequestModalOpen(false)} className="rounded-xl text-xs">Cancel</Button>
            <Button onClick={submitChangeRequest} className="bg-slate-900 hover:bg-black text-white rounded-xl text-xs font-bold">
              Send Request
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
