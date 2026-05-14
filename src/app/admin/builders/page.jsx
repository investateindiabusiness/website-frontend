"use client";

import React, { useState, useEffect, useCallback } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, Phone, ShieldCheck, ShieldAlert, CheckCircle, XCircle, Building2, Clock, FileWarning, Plus, Eye, Download } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/AuthContext';
import { fetchAllBuilders, apiRequest } from '@/api';

const FORM1_BUILDER_FIELDS = [
  { id: 'companyName', label: 'Company Name' },
  { id: 'yearsOfExperience', label: 'Years of Experience' },
  { id: 'contactNameAndDesignation', label: 'Contact Person Details' },
  { id: 'contactPersonPhone', label: 'Contact Person Phone' },
  { id: 'ongoingProjects', label: 'Ongoing Projects (Count)' },
  { id: 'projectsCompleted', label: 'Projects Completed (Count)' },
  { id: 'address', label: 'Street Address' },
  { id: 'city', label: 'City' },
  { id: 'state', label: 'State' },
  { id: 'zip', label: 'ZIP Code' },
  { id: 'country', label: 'Country' }
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

export default function AdminBuilders() {
  const { user } = useAuth();
  const [builders, setBuilders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [selectedBuilderId, setSelectedBuilderId] = useState(null);
  const [requestedFields, setRequestedFields] = useState([]);
  const [customFieldInput, setCustomFieldInput] = useState('');
  const [viewBuilderData, setViewBuilderData] = useState(null);

  const loadBuilders = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchAllBuilders(user?.token);
      setBuilders(data || []);
    } catch (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }, [user?.token]);

  useEffect(() => {
    if (user?.token) loadBuilders();
  }, [user, loadBuilders]);

  const handleToggleField = (fieldId) => {
    setRequestedFields(prev => prev.includes(fieldId) ? prev.filter(id => id !== fieldId) : [...prev, fieldId]);
  };

  const handleApproveForm1 = async (builderId) => {
    try {
      await apiRequest(`/api/builders/approve-form1/${builderId}`, { method: 'POST' });
      toast({ title: "Success", description: "Form 1 Approved." });
      loadBuilders();
      setViewBuilderData(null);
    } catch (err) { toast({ title: "Error", description: err.message, variant: "destructive" }); }
  };

  const handleFinalVerification = async (builderId, isVerified) => {
    try {
      await apiRequest(`/api/builders/verify-final/${builderId}`, { method: 'POST', body: JSON.stringify({ isVerified }) });
      toast({ title: "Success", description: `Builder ${isVerified ? 'Verified' : 'Rejected'}.` });
      loadBuilders();
      setViewBuilderData(null);
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
          <div><h1 className="text-3xl font-bold text-gray-900 mb-2">Manage Builders</h1><p className="text-gray-600">Review and verify builder applications.</p></div>
          <div className="flex bg-gray-200/50 p-1 rounded-lg">
            {['all', 'pending', 'changes_requested', 'verified'].map(f => (
              <button key={f} onClick={() => setFilter(f)} className={`px-4 py-2 text-sm font-semibold rounded-md transition-all ${filter === f ? 'bg-white shadow-sm text-blue-600' : 'text-gray-600'}`}>{f.replace('_', ' ').toUpperCase()}</button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {loading ? (
            <div className="col-span-full py-24 text-center">Loading builders...</div>
          ) : filteredBuilders.length === 0 ? (
            <div className="col-span-full text-center py-12">No builders found.</div>
          ) : filteredBuilders.map((builder) => (
            <Card key={builder.uid || builder.id} className="border border-gray-100 shadow-lg">
              <CardContent className="p-8">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center text-orange-400"><Building2 /></div>
                    <div><h3 className="text-xl font-bold">{builder.companyName || 'Unnamed'}</h3><p className="text-sm text-gray-500">{builder.city}, {builder.state}</p></div>
                  </div>
                  <Badge>{builder.onboardingStatus}</Badge>
                </div>
                <Button onClick={() => setViewBuilderData(builder)} className="w-full bg-gray-900 text-white">View Full Profile</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}
