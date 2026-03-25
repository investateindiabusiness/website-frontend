import React, { useState, useEffect, useCallback } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, Phone, ShieldCheck, ShieldAlert, CheckCircle, XCircle, TrendingUp, Clock, FileWarning, Plus, Eye, Download } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/AuthContext';
import { fetchAllInvestors, approveInvestorForm1, requestInvestorChanges, verifyInvestorFinal } from '@/api';

const STANDARD_INVESTOR_KEYS = [
  'uid', 'id', 'email', 'role', 'createdAt', 'updatedAt', 'onboardingStatus', 'isVerified', 'adminRequests', 'password', 'pendingChanges',
  'fullName', 'contactNumber', 'investorType', 'investmentRangeMin', 'investmentRangeMax', 'address', 'country', 'state', 'city', 'zip', 'termsAccepted',
  'profession', 'yearlyIncome', 'investmentTenure', 'expectedReturns', 'preferredProjectType', 'investmentPreference',
  'companyName', 'yearsOfExperience', 'contactNameAndDesignation', 'contactPersonPhone', 'ongoingProjects', 'projectsCompleted',
  'yearOfIncorporation', 'promotersOrDirectors', 'totalSqftDelivered', 'majorCompletedProjects', 'typeOfProjectsOffered', 'companyOverview',
  'experienceWithNriInvestors', 'declaredLitigationDisputes', 'financialOfCompany', 'outstandingDebt', 'bankingPartners', 'industryNatureOfWork', 'preferredGoalStategy'
];

const FORM1_EDITABLE_FIELDS = [
  { id: 'fullName', label: 'Full Name' },
  { id: 'contactNumber', label: 'Contact Number' },
  { id: 'investorType', label: 'Investor Type' },
  { id: 'investmentRangeMin', label: 'Min Investment Range (₹)' },
  { id: 'investmentRangeMax', label: 'Max Investment Range (₹)' },
  { id: 'address', label: 'Street Address' },
  { id: 'city', label: 'City' },
  { id: 'state', label: 'State' },
  { id: 'zip', label: 'ZIP Code' },
  { id: 'country', label: 'Country' },
  // Builder specific Form 1
  { id: 'companyName', label: 'Company Name' },
  { id: 'yearsOfExperience', label: 'Years of Experience' },
  { id: 'contactNameAndDesignation', label: 'Contact Person Details' }
];

const FORM2_INVESTOR_FIELDS = [
  { id: 'profession', label: 'Profession' },
  { id: 'industryNatureOfWork', label: 'Industry / Nature of Work' },
  { id: 'investmentTenure', label: 'Investment Tenure' },
  { id: 'yearlyIncome', label: 'Yearly Income Range' },
  { id: 'expectedReturns', label: 'Expected Returns' },
  { id: 'preferredGoalStategy', label: 'Preferred Goal / Strategy' },
  { id: 'preferredProjectType', label: 'Preferred Project Type' },
  { id: 'investmentPreference', label: 'Assistance Preference' }
];

const FORM2_BUILDER_FIELDS = [
  { id: 'yearOfIncorporation', label: 'Year of Incorporation' },
  { id: 'totalSqftDelivered', label: 'Total Sqft Delivered' },
  { id: 'promotersOrDirectors', label: 'Promoters / Directors' },
  { id: 'typeOfProjectsOffered', label: 'Type of Projects Offered' },
  { id: 'experienceWithNriInvestors', label: 'Experience with NRI' },
  { id: 'majorCompletedProjects', label: 'Major Completed Projects' },
  { id: 'companyOverview', label: 'Company Overview' },
  { id: 'outstandingDebt', label: 'Outstanding Debt' },
  { id: 'declaredLitigationDisputes', label: 'Declared Litigation / Disputes' },
  { id: 'financialOfCompany', label: 'Financials of Company (P&L Brief)' },
  { id: 'bankingPartners', label: 'Banking Partners' }
];

const AdminInvestors = () => {
  const { user } = useAuth();
  const [investors, setInvestors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [selectedInvestorId, setSelectedInvestorId] = useState(null);
  const [viewInvestorData, setViewInvestorData] = useState(null);

  const [requestedFields, setRequestedFields] = useState([]);
  const [customFieldInput, setCustomFieldInput] = useState('');

  const handleToggleField = (fieldId) => {
    setRequestedFields(prev => prev.includes(fieldId) ? prev.filter(id => id !== fieldId) : [...prev, fieldId]);
  };

  const handleAddCustomField = () => {
    if (!customFieldInput.trim()) return;
    const formattedId = customFieldInput.trim().toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase());
    if (!requestedFields.includes(formattedId)) setRequestedFields(prev => [...prev, formattedId]);
    setCustomFieldInput('');
  };

  const loadInvestors = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchAllInvestors(user.token);
      setInvestors(data);
    } catch (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); }
    finally { setLoading(false); }
  }, [user?.token]);

  const getActiveFieldsForModal = () => {
    if (!viewInvestorData) return [];
    if (['form2_pending', 'form2_changes_requested'].includes(viewInvestorData.onboardingStatus)) {
      return viewInvestorData.role === 'builder' ? FORM2_BUILDER_FIELDS : FORM2_INVESTOR_FIELDS;
    }
    return FORM1_EDITABLE_FIELDS;
  };

  useEffect(() => {
    if (user && user.token) loadInvestors();
  }, [user, loadInvestors]);

  const handleApproveForm1 = async (investorId) => {
    try {
      await approveInvestorForm1(investorId);
      toast({ title: "Success", description: "Form 1 Approved. Investor can now fill Form 2." });
      loadInvestors();
      setViewInvestorData(null);
    } catch (err) { toast({ title: "Error", description: err.message, variant: "destructive" }); }
  };

  const handleFinalVerification = async (investorId, isVerified) => {
    try {
      await verifyInvestorFinal(investorId, isVerified);
      toast({ title: "Success", description: `Investor has been ${isVerified ? 'Verified' : 'Rejected'}.` });
      loadInvestors();
      setViewInvestorData(null);
    } catch (err) { toast({ title: "Error", description: err.message, variant: "destructive" }); }
  };

  const submitChangeRequest = async () => {
    const validFields = requestedFields.filter(f => typeof f === 'string' && f.trim() !== '');
    if (validFields.length === 0) return toast({ title: "Error", description: "Add at least one field to request.", variant: "destructive" });

    try {
      await requestInvestorChanges(selectedInvestorId, validFields);
      toast({ title: "Success", description: "Request sent to investor." });
      setIsRequestModalOpen(false);
      setRequestedFields([]);
      setCustomFieldInput('');
      loadInvestors();
    } catch (err) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  // Add this function inside AdminInvestors component
  const downloadCSV = () => {
    if (!investors || investors.length === 0) {
      toast({ title: "Export Failed", description: "No investors available to export.", variant: "destructive" });
      return;
    }

    // List of internal/technical fields to exclude from the CSV
    const EXCLUDED_FIELDS = [
      'uid', 'id', 'password', 'createdAt', 'updatedAt', 'adminRequests', 'pendingChanges', 'role', 'profileImage', 'onboardingStatus'
    ];

    // 1. Get all unique keys from all investors, filter out excluded ones
    const allKeys = new Set();
    investors.forEach(investor => Object.keys(investor).forEach(key => allKeys.add(key)));

    const headers = Array.from(allKeys).filter(key => !EXCLUDED_FIELDS.includes(key));

    const csvRows = [];

    // FORMAT THE HEADERS for the first row (e.g., 'yearlyIncome' -> 'Yearly Income')
    const formattedHeaders = headers.map(key => {
      return key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
    });

    // Add the formatted header row
    csvRows.push(formattedHeaders.join(','));

    // Add data rows
    investors.forEach(investor => {
      const row = headers.map(header => {
        let val = investor[header];

        // Handle undefined, null, and empty values
        if (val === null || val === undefined) {
          val = '';
        }
        // Handle nested objects/arrays
        else if (typeof val === 'object') {
          val = JSON.stringify(val);
        }

        // Convert to string and escape quotes and commas for CSV compatibility
        let strVal = String(val);
        if (strVal.includes(',') || strVal.includes('"') || strVal.includes('\n')) {
          strVal = `"${strVal.replace(/"/g, '""')}"`;
        }

        return strVal;
      });

      csvRows.push(row.join(','));
    });

    // 3. Create a Blob and trigger the download
    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `all_investors_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({ title: "Success", description: "Investors exported successfully!" });
  };

  const filteredInvestors = investors.filter(investor => {
    if (filter === 'pending') return investor.onboardingStatus === 'form1_pending' || investor.onboardingStatus === 'form2_pending';
    if (filter === 'changes_requested') return investor.onboardingStatus === 'form1_changes_requested' || investor.onboardingStatus === 'form2_changes_requested';
    if (filter === 'verified') return investor.onboardingStatus === 'complete' && investor.isVerified === true;
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <div className="flex-1 container mx-auto px-4 py-24 max-w-7xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Manage Investors</h1>
            <p className="text-gray-600">Review, verify, and manage investor applications.</p>
          </div>

          <div className="flex flex-col gap-3 items-start md:items-end">
            <div className="flex bg-gray-200/50 p-1 rounded-lg flex-wrap">
              <button onClick={() => setFilter('all')} className={`px-4 py-2 text-sm font-semibold rounded-md transition-all ${filter === 'all' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-600'}`}>All</button>
              <button onClick={() => setFilter('pending')} className={`px-4 py-2 text-sm font-semibold rounded-md transition-all ${filter === 'pending' ? 'bg-white shadow-sm text-orange-600' : 'text-gray-600'}`}>Needs Review</button>
              <button onClick={() => setFilter('changes_requested')} className={`px-4 py-2 text-sm font-semibold rounded-md transition-all ${filter === 'changes_requested' ? 'bg-white shadow-sm text-yellow-600' : 'text-gray-600'}`}>Awaiting Changes</button>
              <button onClick={() => setFilter('verified')} className={`px-4 py-2 text-sm font-semibold rounded-md transition-all ${filter === 'verified' ? 'bg-white shadow-sm text-green-600' : 'text-gray-600'}`}>Verified Investors</button>
              <Button
                onClick={downloadCSV}
                variant="outline"
                className="bg-white border-green-600 text-green-700 hover:bg-green-50 shadow-sm"
              >
                <Download className="w-4 h-4 mr-2" /> Export
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {loading ? (
            <div className="col-span-full flex flex-col items-center justify-center text-gray-500 py-24">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mb-4"></div>
              Loading investors...
            </div>
          ) : filteredInvestors.length === 0 ? (
            <div className="col-span-full text-center bg-white rounded-xl p-12 border border-gray-100 shadow-sm text-gray-500">
              No investors found in this category.
            </div>
          ) : filteredInvestors.map((investor) => {
            const investorId = investor.uid || investor.id;
            const renderStatusBadge = () => {
              switch (investor.onboardingStatus) {
                case 'form1_pending': return <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100 border-none"><Clock className="w-3 h-3 mr-1" /> Form 1 Review</Badge>;
                case 'form2_pending': return <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-100 border-none"><Clock className="w-3 h-3 mr-1" /> Final Review</Badge>;
                case 'form1_changes_requested': return <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100 border-none"><FileWarning className="w-3 h-3 mr-1" /> Form 1 Changes Req.</Badge>;
                case 'form2_changes_requested': return <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100 border-none"><FileWarning className="w-3 h-3 mr-1" /> Form 2 Changes Req.</Badge>;
                case 'complete': return <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-none"><ShieldCheck className="w-3 h-3 mr-1" /> Verified</Badge>;
                default: return <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-100 border-none">Unknown</Badge>;
              }
            };

            return (
              <Card key={investorId} className="border border-gray-100 shadow-lg flex flex-col relative overflow-hidden">
                <div className={`h-1 w-full ${investor.onboardingStatus === 'complete' ? 'bg-green-500' : investor.onboardingStatus?.includes('changes_requested') ? 'bg-orange-500' : 'bg-blue-500'}`} />
                <CardContent className="p-8 flex-1 flex flex-col">
                  <div className="flex items-start space-x-6 mb-6">
                    <div className="w-16 h-16 flex-shrink-0 bg-blue-50 rounded-xl flex items-center justify-center">
                      <TrendingUp className="h-8 w-8 text-blue-500" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2 gap-2">
                        <h3 className="text-xl font-bold text-gray-900 truncate">{investor.fullName || investor.companyName || investor.name || 'Unnamed'}</h3>
                        {renderStatusBadge()}
                      </div>
                      <p className="text-sm text-gray-500">{investor.city}, {investor.state}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-6 border-t border-gray-100 pt-4">
                    <a href={`mailto:${investor.email}`} className="flex items-center hover:text-orange-600"><Mail className="h-4 w-4 mr-1.5" /> Email</a>
                    {investor.contactNumber && <a href={`tel:${investor.contactNumber}`} className="flex items-center hover:text-orange-600"><Phone className="h-4 w-4 mr-1.5" /> Call</a>}
                  </div>

                  <div className="mt-auto pt-4 flex gap-3">
                    <Button onClick={() => setViewInvestorData(investor)} className="w-full bg-gray-900 hover:bg-gray-800 text-white">
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
      <Dialog open={!!viewInvestorData} onOpenChange={(open) => !open && setViewInvestorData(null)}>
        <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto p-0">
          <DialogHeader className="p-6 pb-0 sticky top-0 bg-white z-10 border-b border-gray-100">
            <DialogTitle className="text-2xl font-bold text-gray-900">{viewInvestorData?.fullName || viewInvestorData?.companyName || 'Details'}</DialogTitle>
            <DialogDescription>Review the complete submission history for this user.</DialogDescription>
          </DialogHeader>

          {viewInvestorData && (
            <div className="p-6 space-y-8 bg-gray-50">
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h4 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">Form 1: Initial Details</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8 text-sm">
                  {viewInvestorData.role === 'investor' ? (
                    <>
                      <div><span className="text-gray-500 block mb-1">Full Name</span><span className="font-medium">{viewInvestorData.fullName || '-'}</span></div>
                      <div><span className="text-gray-500 block mb-1">Contact Number</span><span className="font-medium">{viewInvestorData.contactNumber || '-'}</span></div>
                      <div><span className="text-gray-500 block mb-1">Investor Type</span><span className="font-medium">{viewInvestorData.investorType || '-'}</span></div>
                      <div><span className="text-gray-500 block mb-1">Intended Range</span><span className="font-medium text-green-700">₹{viewInvestorData.investmentRangeMin || '0'} - ₹{viewInvestorData.investmentRangeMax || '0'}</span></div>
                    </>
                  ) : (
                    <>
                      <div><span className="text-gray-500 block mb-1">Company Name</span><span className="font-medium">{viewInvestorData.companyName || '-'}</span></div>
                      <div><span className="text-gray-500 block mb-1">Contact Details</span><span className="font-medium">{viewInvestorData.contactNameAndDesignation} | {viewInvestorData.contactPersonPhone}</span></div>
                    </>
                  )}
                  <div><span className="text-gray-500 block mb-1">Address</span><span className="font-medium">{viewInvestorData.address}, {viewInvestorData.city}, {viewInvestorData.state}, {viewInvestorData.zip}, {viewInvestorData.country}</span></div>
                </div>
              </div>

              {Object.keys(viewInvestorData).filter(key => !STANDARD_INVESTOR_KEYS.includes(key)).length > 0 && (
                <div className="bg-orange-50 p-6 rounded-xl border border-orange-100 shadow-sm">
                  <h4 className="text-lg font-semibold text-orange-900 mb-4 border-b border-orange-200 pb-2">Admin Requested Details</h4>
                  <div className="grid grid-cols-1 gap-y-4 text-sm">
                    {Object.keys(viewInvestorData).filter(key => !STANDARD_INVESTOR_KEYS.includes(key)).map(key => (
                      <div key={key}>
                        <span className="text-orange-700/70 block mb-1 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                        <span className="font-medium text-orange-950">{viewInvestorData[key]}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h4 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">Form 2: Deep Verification</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8 text-sm">
                  {viewInvestorData.role === 'investor' ? (
                    <>
                      <div><span className="text-gray-500 block mb-1">Profession</span><span className="font-medium">{viewInvestorData.profession || '-'}</span></div>
                      <div><span className="text-gray-500 block mb-1">Industry / Nature of Work</span><span className="font-medium">{viewInvestorData.industryNatureOfWork || '-'}</span></div>
                      <div><span className="text-gray-500 block mb-1">Investment Tenure</span><span className="font-medium">{viewInvestorData.investmentTenure || '-'}</span></div>
                      <div><span className="text-gray-500 block mb-1">Yearly Income Range</span><span className="font-medium">{viewInvestorData.yearlyIncome || '-'}</span></div>
                      <div><span className="text-gray-500 block mb-1">Expected Returns</span><span className="font-medium">{viewInvestorData.expectedReturns || '-'}</span></div>
                      <div><span className="text-gray-500 block mb-1">Preferred Goal / Stratagy</span><span className="font-medium">{viewInvestorData.preferredGoalStategy || '-'}</span></div>
                      <div><span className="text-gray-500 block mb-1">Assistance Preference</span><span className="font-medium">{viewInvestorData.investmentPreference || '-'}</span></div>
                      <div>
                        <span className="text-gray-500 block mb-1">Preferred Project Type</span>
                        <div className="font-medium">
                          {Array.isArray(viewInvestorData.preferredProjectType) && viewInvestorData.preferredProjectType.length > 0
                            ? viewInvestorData.preferredProjectType.map((type, index) => <div key={index}>{type}</div>)
                            : viewInvestorData.preferredProjectType || '-'}
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div><span className="text-gray-500 block mb-1">Year of Incorporation</span><span className="font-medium">{viewInvestorData.yearOfIncorporation || '-'}</span></div>
                      <div><span className="text-gray-500 block mb-1">Total Sqft Delivered</span><span className="font-medium">{viewInvestorData.totalSqftDelivered || '-'}</span></div>
                      <div className="md:col-span-2"><span className="text-gray-500 block mb-1">Promoters / Directors</span><span className="font-medium">{viewInvestorData.promotersOrDirectors || '-'}</span></div>
                      <div><span className="text-gray-500 block mb-1">Type of Projects</span><span className="font-medium">{viewInvestorData.typeOfProjectsOffered || '-'}</span></div>
                    </>
                  )}
                </div>
              </div>

              {viewInvestorData.pendingChanges && Object.keys(viewInvestorData.pendingChanges).length > 0 && (
                <div className="bg-blue-50 p-6 rounded-xl border border-blue-200 shadow-sm mb-6">
                  <h4 className="text-lg font-semibold text-blue-900 mb-4 border-b border-blue-200 pb-2">Review Submitted Changes</h4>
                  <div className="grid grid-cols-1 gap-y-4 text-sm">
                    {Object.entries(viewInvestorData.pendingChanges).map(([key, newValue]) => {
                      const oldValue = viewInvestorData[key];
                      const isUnchanged = String(oldValue || '').trim() === String(newValue || '').trim();
                      return (
                        <div key={key} className={`p-3 rounded-lg border flex flex-col md:flex-row gap-4 justify-between transition-all ${isUnchanged ? 'bg-gray-50 border-gray-200 opacity-80' : 'bg-white border-blue-100 shadow-sm'}`}>
                          <div className="flex-1 w-full md:w-1/3">
                            <span className="text-gray-500 block text-xs uppercase font-semibold mb-1">Field</span>
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-gray-900 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                            </div>
                          </div>
                          <div className="flex-1 w-full md:w-1/3 md:border-l md:pl-4 border-gray-100 mt-2 md:mt-0">
                            <span className="text-red-500 block text-xs uppercase font-semibold mb-1">Old Value</span>
                            <span className={`text-gray-600 ${!isUnchanged && oldValue ? 'line-through' : ''}`}>
                              {oldValue ? (Array.isArray(oldValue) ? oldValue.join(', ') : oldValue) : <span className="italic text-gray-400">Empty</span>}
                            </span>
                          </div>
                          <div className="flex-1 w-full md:w-1/3 md:border-l md:pl-4 border-gray-100 mt-2 md:mt-0">
                            <span className={`${isUnchanged ? 'text-gray-500' : 'text-green-600'} block text-xs uppercase font-semibold mb-1`}>New Value</span>
                            <span className={`font-medium ${isUnchanged ? 'text-gray-600' : 'text-green-800'}`}>
                              {newValue ? (Array.isArray(newValue) ? newValue.join(', ') : newValue) : <span className="italic text-gray-400">Empty</span>}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* DYNAMIC ACTION BUTTONS */}
              <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-wrap gap-3 sticky bottom-4">
                {viewInvestorData.onboardingStatus === 'form1_pending' && (
                  <>
                    <Button onClick={() => handleApproveForm1(viewInvestorData.uid)} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">Approve Form 1</Button>
                    <Button onClick={() => { setSelectedInvestorId(viewInvestorData.uid); setIsRequestModalOpen(true); }} variant="outline" className="flex-1 border-orange-200 text-orange-600 hover:bg-orange-50">Request Changes in Form 1</Button>
                  </>
                )}
                {viewInvestorData.onboardingStatus === 'form2_pending' && (
                  <>
                    <Button onClick={() => handleFinalVerification(viewInvestorData.uid, true)} className="flex-1 bg-green-600 hover:bg-green-700 text-white"><CheckCircle className="w-4 h-4 mr-2" /> Approve Form 2</Button>
                    <Button onClick={() => { setSelectedInvestorId(viewInvestorData.uid); setIsRequestModalOpen(true); }} variant="outline" className="flex-1 border-orange-200 text-orange-600 hover:bg-orange-50">Request Changes in Form 2</Button>
                    <Button onClick={() => handleFinalVerification(viewInvestorData.uid, false)} variant="outline" className="flex-1 border-red-200 text-red-600 hover:bg-red-50"><XCircle className="w-4 h-4 mr-2" /> Reject</Button>
                  </>
                )}
                {viewInvestorData.onboardingStatus === 'complete' && viewInvestorData.isVerified === true && (
                  <Button onClick={() => handleFinalVerification(viewInvestorData.uid, false)} variant="outline" className="w-full border-red-200 text-red-600 hover:bg-red-50"><ShieldAlert className="w-4 h-4 mr-2" /> Revoke Verification</Button>
                )}
                {viewInvestorData.onboardingStatus?.includes('changes_requested') && (
                  <div className="w-full text-center text-sm font-medium text-orange-600 bg-orange-50 py-3 rounded-md">Waiting for user to submit requested changes.</div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* REQUEST CHANGES MODAL */}
      <Dialog open={isRequestModalOpen} onOpenChange={(open) => {
        setIsRequestModalOpen(open);
        if (!open) { setRequestedFields([]); setCustomFieldInput(''); }
      }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Request Information Updates</DialogTitle>
            <DialogDescription>Select specific fields or request new information for the user to correct.</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-2 max-h-[30vh] overflow-y-auto p-1 custom-scrollbar">
              {getActiveFieldsForModal().map((field) => (
                <label key={field.id} className={`flex items-start p-3 rounded-lg border cursor-pointer transition-all ${requestedFields.includes(field.id) ? 'border-orange-500 bg-orange-50/50' : 'border-gray-200 hover:border-orange-200 hover:bg-gray-50'}`}>
                  <div className="flex items-center h-5">
                    <input type="checkbox" className="w-4 h-4 text-orange-600 bg-gray-100 border-gray-300 rounded focus:ring-orange-500" checked={requestedFields.includes(field.id)} onChange={() => handleToggleField(field.id)} />
                  </div>
                  <div className="ml-3 text-sm">
                    <span className={`font-medium ${requestedFields.includes(field.id) ? 'text-orange-900' : 'text-gray-900'}`}>{field.label}</span>
                  </div>
                </label>
              ))}
              {requestedFields.filter(id => !getActiveFieldsForModal().some(f => f.id === id)).map(customId => (
                <label key={customId} className="flex items-start p-3 rounded-lg border border-orange-500 bg-orange-50/50 cursor-pointer transition-all">
                  <div className="flex items-center h-5">
                    <input type="checkbox" className="w-4 h-4 text-orange-600 bg-gray-100 border-gray-300 rounded focus:ring-orange-500" checked onChange={() => handleToggleField(customId)} />
                  </div>
                  <div className="ml-3 text-sm"><span className="font-medium text-orange-900 capitalize">{customId.replace(/([A-Z])/g, ' $1').trim()}</span></div>
                </label>
              ))}
            </div>

            <div className="mb-6 mt-4 pt-4 border-t border-gray-100">
              <Label className="text-sm font-semibold text-gray-700 mb-2 block">Need additional information?</Label>
              <div className="flex gap-2">
                <Input placeholder="e.g. PAN Card, Bank Statement..." value={customFieldInput} onChange={(e) => setCustomFieldInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddCustomField(); } }} className="h-10 text-sm focus:ring-orange-500/20" />
                <Button type="button" onClick={handleAddCustomField} variant="outline" className="h-10 shrink-0 text-orange-600 border-orange-200 hover:bg-orange-50"><Plus className="w-4 h-4 mr-1" /> Add</Button>
              </div>
            </div>
            <Button onClick={submitChangeRequest} disabled={requestedFields.length === 0} className="w-full bg-orange-600 hover:bg-orange-700 text-white">
              Send Request for {requestedFields.length} {requestedFields.length === 1 ? 'Field' : 'Fields'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      <Footer />
    </div>
  );
};

export default AdminInvestors;