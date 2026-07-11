"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/AuthContext';
import AdminSidebar from '@/components/AdminSidebar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { apiRequest } from '@/api';
import { toast } from '@/hooks/use-toast';
import {
  User, Mail, Phone, MapPin, Shield, Crown,
  Edit2, Save, Loader2, Calendar, BadgeCheck, AlertTriangle, Plus, X
} from 'lucide-react';
import MultiSelect from '@/components/ui/MultiSelect';

// Investment Mappings
const INVESTMENT_CATEGORY_TYPES = {
  "Residential": [
    "Apartments", "Villas", "Villaments", "Gated Communities",
    "Luxury Homes", "Senior Living", "Affordable Housing", "Holiday Homes"
  ],
  "Commercial": [
    "Office Spaces", "Retail Shops", "Commercial Complexes",
    "Shopping Malls", "Co-working Spaces", "IT Parks"
  ],
  "Land & Plots": [
    "Residential Plots", "Villa Plots", "Farm Plots",
    "Commercial Plots", "Township Plots"
  ],
  "Industrial & Warehousing": [
    "Warehouses", "Industrial Parks", "Manufacturing Units",
    "Logistics Parks", "Cold Storage"
  ],
  "Agricultural": [
    "Agricultural Land", "Farm Houses", "Organic Farms", "Plantation Projects"
  ],
  "Hospitality": [
    "Hotels", "Resorts", "Serviced Apartments", "Holiday Projects"
  ],
  "Alternative Investments": [
    "Fractional Ownership", "REIT Opportunities", "Equity Participation", "Joint Ventures"
  ]
};

const PREFERRED_INVESTMENT_STAGES = [
  "Pre-Launch", "New Launch", "Under Construction", "Ready to Move", "Rental Income", "Resale"
];

const INVESTMENT_PURPOSES = [
  "Self Use", "Rental Income", "Long-Term Appreciation", "Short-Term Returns", "Portfolio Diversification", "Retirement Planning"
];

const BUDGET_RANGES = [
  "₹25L–50L", "₹50L–1Cr", "₹1Cr–2Cr", "₹2Cr–5Cr", "₹5Cr–10Cr", "₹10Cr+"
];

// Builder Mappings
const PROJECT_CATEGORY_TYPES = {
  "Residential": [
    "Apartments", "Villas", "Villaments", "Luxury Homes", "Senior Living", "Affordable Housing"
  ],
  "Commercial": [
    "Office Spaces", "Retail", "Shopping Mall", "Commercial Complex", "IT Park", "Business Park"
  ],
  "Land Development": [
    "Residential Plots", "Villa Plots", "Farm Plots", "Commercial Plots", "Townships"
  ],
  "Industrial": [
    "Warehouse", "Logistics Park", "Manufacturing Unit", "Industrial Facility"
  ],
  "Agricultural": [
    "Farm Projects", "Agricultural Land", "Plantation Projects"
  ],
  "Hospitality": [
    "Hotels", "Resorts", "Serviced Apartments"
  ],
  "Mixed Use": [
    "Residential + Commercial", "Integrated Township", "Smart City Development"
  ]
};

const PROJECT_STAGES = [
  "Pre-Launch", "New Launch", "Under Construction", "Ready to Occupy", "Completed"
];

const CAPITAL_REQUIREMENTS = [
  "Project Marketing", "Investor Partnerships", "Equity Capital", "Project Finance", "Pre-Sales Support", "Joint Venture", "Strategic Partnership"
];

export default function ProfilePage() {
  const { user, refreshUser, loading } = useAuth();
  const router = useRouter();

  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: '',
    contactNumber: '',
    address: '',
    preferredCategories: [],
    preferredTypes: [],
    preferredStages: [],
    preferredPurposes: [],
    preferredLocations: [],
    preferredBudgets: [],
    projectCategories: [],
    projectTypes: [],
    projectStages: [],
    capitalRequirements: []
  });

  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [locInput, setLocInput] = useState({ country: '', state: '', city: '' });

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (refreshUser) {
      refreshUser();
    }
  }, []);

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || user.fullName || '',
        contactNumber: user.contactNumber || '',
        address: user.address || '',
        preferredCategories: user.preferredCategories || [],
        preferredTypes: user.preferredTypes || [],
        preferredStages: user.preferredStages || [],
        preferredPurposes: user.preferredPurposes || [],
        preferredLocations: user.preferredLocations || [],
        preferredBudgets: user.preferredBudgets || [],
        projectCategories: user.projectCategories || [],
        projectTypes: user.projectTypes || [],
        projectStages: user.projectStages || [],
        capitalRequirements: user.capitalRequirements || []
      });
    }
  }, [user]);

  // Load locations for location editor
  useEffect(() => {
    if (isEditing && user?.role === 'investor') {
      fetch('https://countriesnow.space/api/v0.1/countries/iso')
        .then(res => res.json())
        .then(data => { if (!data.error) setCountries(data.data || []); })
        .catch(console.error);
    }
  }, [isEditing, user]);

  useEffect(() => {
    if (locInput.country) {
      setLoadingLocation(true);
      fetch('https://countriesnow.space/api/v0.1/countries/states', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ country: locInput.country })
      })
        .then(res => res.json())
        .then(data => { if (!data.error) setStates(data.data.states || []); })
        .catch(console.error)
        .finally(() => setLoadingLocation(false));
    } else {
      setStates([]);
    }
    setLocInput(prev => ({ ...prev, state: '', city: '' }));
  }, [locInput.country]);

  useEffect(() => {
    if (locInput.country && locInput.state) {
      setLoadingLocation(true);
      fetch('https://countriesnow.space/api/v0.1/countries/state/cities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ country: locInput.country, state: locInput.state })
      })
        .then(res => res.json())
        .then(data => { if (!data.error) setCities(data.data || []); })
        .catch(console.error)
        .finally(() => setLoadingLocation(false));
    } else {
      setCities([]);
    }
    setLocInput(prev => ({ ...prev, city: '' }));
  }, [locInput.country, locInput.state]);

  const handleAddLocation = () => {
    if (!locInput.country) return;
    const label = [locInput.city, locInput.state, locInput.country].filter(Boolean).join(', ');
    
    if (form.preferredLocations.some(loc => loc.label === label)) {
      return toast({ title: "Duplicate Location", description: "This location is already added." });
    }

    setForm(prev => ({
      ...prev,
      preferredLocations: [...prev.preferredLocations, {
        country: locInput.country,
        state: locInput.state,
        city: locInput.city,
        label: label
      }]
    }));
    setLocInput({ country: '', state: '', city: '' });
  };

  const handleRemoveLocation = (labelToRemove) => {
    setForm(prev => ({
      ...prev,
      preferredLocations: prev.preferredLocations.filter(loc => loc.label !== labelToRemove)
    }));
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0f0f10]">
        <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
      </div>
    );
  }

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      toast({ title: 'Validation Error', description: 'Name cannot be empty.', variant: 'destructive' });
      return;
    }
    setSaving(true);
    try {
      await apiRequest('/api/auth/profile', {
        method: 'PATCH',
        body: JSON.stringify(form)
      });
      toast({ title: '✅ Profile Updated', description: 'Your profile has been saved successfully.' });
      if (refreshUser) {
        await refreshUser();
      }
      setIsEditing(false);
    } catch (err) {
      toast({ title: 'Update Failed', description: err.message || 'Could not save profile details.', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const isMembershipActive = user?.membershipStatus === 'active' && user?.membershipExpiry && new Date() <= new Date(user.membershipExpiry);
  const roleLabel = user.role === 'serviceProvider' ? 'Service Provider' : user.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : '';

  return (
    <AdminSidebar>
      <div className="max-w-4xl mx-auto py-8 px-4 font-sans">
        {/* Profile Header Card */}
        <div className="bg-[#0f172a] rounded-3xl border border-slate-800 p-8 text-white relative overflow-hidden shadow-2xl mb-8">
          <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col md:flex-row items-center gap-6 relative z-10">
            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-[#D48035] to-orange-500 flex items-center justify-center text-white text-3xl font-extrabold shadow-lg shadow-orange-500/20">
              {(user.name || user.email || 'U')[0].toUpperCase()}
            </div>
            <div className="text-center md:text-left flex-grow">
              <div className="flex flex-col md:flex-row md:items-center gap-2.5">
                <h1 className="text-2xl font-black">{user.name || user.fullName || user.email.split('@')[0]}</h1>
                <span className="inline-flex self-center md:self-start bg-orange-500/15 text-orange-400 border border-orange-500/30 text-xs font-bold px-3 py-1 rounded-full capitalize">
                  {roleLabel}
                </span>
              </div>
              <p className="text-slate-400 text-sm mt-1">{user.email}</p>

              {/* Onboarding / verification badges */}
              <div className="flex flex-wrap gap-2 mt-4 justify-center md:justify-start">
                {user.isVerified && (
                  <span className="inline-flex items-center gap-1 bg-green-500/10 text-green-400 border border-green-500/25 text-xs font-bold px-2.5 py-0.5 rounded-full">
                    <BadgeCheck className="w-3.5 h-3.5" /> Account Verified
                  </span>
                )}
                {user.isKycVerified ? (
                  <span className="inline-flex items-center gap-1 bg-blue-500/10 text-blue-400 border border-blue-500/25 text-xs font-bold px-2.5 py-0.5 rounded-full">
                    <Shield className="w-3.5 h-3.5" /> KYC Approved
                  </span>
                ) : user.role === 'investor' && (
                  <span className="inline-flex items-center gap-1 bg-yellow-500/10 text-yellow-400 border border-yellow-500/25 text-xs font-bold px-2.5 py-0.5 rounded-full">
                    <AlertTriangle className="w-3.5 h-3.5" /> KYC Pending / Not Uploaded
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Profile Details Form (Cols 2/3) */}
          <div className="md:col-span-2 bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="flex justify-between items-center px-6 py-5 border-b border-slate-100 bg-slate-50/50">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <User className="w-4 h-4 text-[#D48035]" /> Profile Details
              </h2>
              {!isEditing && (
                <Button
                  onClick={() => setIsEditing(true)}
                  variant="outline"
                  className="text-xs h-8 rounded-lg border-slate-200 hover:bg-slate-50"
                >
                  <Edit2 className="w-3.5 h-3.5 mr-1" /> Edit Profile
                </Button>
              )}
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-5">
              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1">Full Name</label>
                <input
                  type="text"
                  disabled={!isEditing}
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 outline-none focus:border-[#D48035] focus:bg-white disabled:opacity-70 transition-all font-medium"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1">Email Address</label>
                <input
                  type="email"
                  disabled
                  value={user.email}
                  className="w-full bg-slate-100 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-500 transition-all font-medium cursor-not-allowed"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1">Contact Number</label>
                <input
                  type="tel"
                  disabled={!isEditing}
                  value={form.contactNumber}
                  onChange={e => setForm({ ...form, contactNumber: e.target.value })}
                  placeholder="Enter contact number"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 outline-none focus:border-[#D48035] focus:bg-white disabled:opacity-70 transition-all font-medium"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1">Address</label>
                <textarea
                  rows="3"
                  disabled={!isEditing}
                  value={form.address}
                  onChange={e => setForm({ ...form, address: e.target.value })}
                  placeholder="Enter your billing/residential address"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 outline-none focus:border-[#D48035] focus:bg-white disabled:opacity-70 transition-all font-medium resize-none font-sans"
                />
              </div>

              {/* Role-Specific Preferences */}
              {(user.role === 'investor' || user.role === 'builder') && (
                <div className="pt-6 border-t border-slate-100 mt-6 space-y-6">
                  <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">
                    {user.role === 'investor' ? 'Investment Preferences' : 'Project Preferences'}
                  </h3>

                  {user.role === 'investor' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Category */}
                      <div>
                        <label className="text-xs font-bold text-slate-500 block mb-1">Investment Category</label>
                        {isEditing ? (
                          <MultiSelect
                            options={Object.keys(INVESTMENT_CATEGORY_TYPES)}
                            selected={form.preferredCategories}
                            onChange={(val) => {
                              const validTypes = val.reduce((acc, cat) => [...acc, ...INVESTMENT_CATEGORY_TYPES[cat]], []);
                              const filteredSelectedTypes = form.preferredTypes.filter(t => validTypes.includes(t));
                              setForm(prev => ({ 
                                ...prev, 
                                preferredCategories: val,
                                preferredTypes: filteredSelectedTypes
                              }));
                            }}
                          />
                        ) : (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {form.preferredCategories.length === 0 ? (
                              <span className="text-slate-400 text-sm font-medium">Not specified</span>
                            ) : (
                              form.preferredCategories.map(cat => <Badge key={cat} variant="secondary" className="font-bold">{cat}</Badge>)
                            )}
                          </div>
                        )}
                      </div>

                      {/* Type */}
                      <div>
                        <label className="text-xs font-bold text-slate-500 block mb-1">Investment Type</label>
                        {isEditing ? (
                          <MultiSelect
                            options={form.preferredCategories.reduce((acc, cat) => [...acc, ...(INVESTMENT_CATEGORY_TYPES[cat] || [])], [])}
                            selected={form.preferredTypes}
                            onChange={(val) => setForm(prev => ({ ...prev, preferredTypes: val }))}
                            placeholder={form.preferredCategories.length === 0 ? "Select categories first" : "Select types"}
                          />
                        ) : (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {form.preferredTypes.length === 0 ? (
                              <span className="text-slate-400 text-sm font-medium">Not specified</span>
                            ) : (
                              form.preferredTypes.map(t => <Badge key={t} variant="secondary" className="font-bold">{t}</Badge>)
                            )}
                          </div>
                        )}
                      </div>

                      {/* Stage */}
                      <div>
                        <label className="text-xs font-bold text-slate-500 block mb-1">Preferred Investment Stage</label>
                        {isEditing ? (
                          <MultiSelect
                            options={PREFERRED_INVESTMENT_STAGES}
                            selected={form.preferredStages}
                            onChange={(val) => setForm(prev => ({ ...prev, preferredStages: val }))}
                          />
                        ) : (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {form.preferredStages.length === 0 ? (
                              <span className="text-slate-400 text-sm font-medium">Not specified</span>
                            ) : (
                              form.preferredStages.map(s => <Badge key={s} variant="secondary" className="font-bold">{s}</Badge>)
                            )}
                          </div>
                        )}
                      </div>

                      {/* Purpose */}
                      <div>
                        <label className="text-xs font-bold text-slate-500 block mb-1">Investment Purpose</label>
                        {isEditing ? (
                          <MultiSelect
                            options={INVESTMENT_PURPOSES}
                            selected={form.preferredPurposes}
                            onChange={(val) => setForm(prev => ({ ...prev, preferredPurposes: val }))}
                          />
                        ) : (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {form.preferredPurposes.length === 0 ? (
                              <span className="text-slate-400 text-sm font-medium">Not specified</span>
                            ) : (
                              form.preferredPurposes.map(p => <Badge key={p} variant="secondary" className="font-bold">{p}</Badge>)
                            )}
                          </div>
                        )}
                      </div>

                      {/* Budget */}
                      <div>
                        <label className="text-xs font-bold text-slate-500 block mb-1">Budget Range</label>
                        {isEditing ? (
                          <MultiSelect
                            options={BUDGET_RANGES}
                            selected={form.preferredBudgets}
                            onChange={(val) => setForm(prev => ({ ...prev, preferredBudgets: val }))}
                          />
                        ) : (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {form.preferredBudgets.length === 0 ? (
                              <span className="text-slate-400 text-sm font-medium">Not specified</span>
                            ) : (
                              form.preferredBudgets.map(b => <Badge key={b} variant="secondary" className="font-bold">{b}</Badge>)
                            )}
                          </div>
                        )}
                      </div>

                      {/* Location */}
                      <div className="md:col-span-2 space-y-3">
                        <label className="text-xs font-bold text-slate-500 block">Preferred Locations</label>
                        {isEditing && (
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
                            <div>
                              <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">Country</label>
                              <select 
                                className="w-full h-10 bg-slate-50 border border-slate-200 rounded-xl px-3 text-xs outline-none focus:bg-white transition-all appearance-none"
                                value={locInput.country} 
                                onChange={(e) => setLocInput(prev => ({ ...prev, country: e.target.value }))}
                              >
                                <option value="">Select Country</option>
                                {countries.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
                              </select>
                            </div>

                            <div>
                              <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">State / Region</label>
                              <select 
                                className="w-full h-10 bg-slate-50 border border-slate-200 rounded-xl px-3 text-xs outline-none focus:bg-white transition-all appearance-none"
                                value={locInput.state} 
                                onChange={(e) => setLocInput(prev => ({ ...prev, state: e.target.value }))}
                                disabled={!locInput.country}
                              >
                                <option value="">{loadingLocation && !locInput.state ? "Loading..." : "Select State"}</option>
                                {states.map(s => <option key={s.name} value={s.name}>{s.name}</option>)}
                              </select>
                            </div>

                            <div className="flex gap-2">
                              <div className="flex-grow">
                                <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">City</label>
                                <select 
                                  className="w-full h-10 bg-slate-50 border border-slate-200 rounded-xl px-3 text-xs outline-none focus:bg-white transition-all appearance-none"
                                  value={locInput.city} 
                                  onChange={(e) => setLocInput(prev => ({ ...prev, city: e.target.value }))}
                                  disabled={!locInput.state}
                                >
                                  <option value="">{loadingLocation && !locInput.city ? "Loading..." : "Select City"}</option>
                                  {cities.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                              </div>
                              <Button 
                                type="button" 
                                onClick={handleAddLocation}
                                disabled={!locInput.country}
                                className="h-10 w-10 rounded-xl bg-[#D48035] hover:bg-[#B45309] text-white p-0 flex items-center justify-center flex-shrink-0"
                              >
                                <Plus className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        )}

                        <div className="flex flex-wrap gap-1.5 mt-1">
                          {form.preferredLocations.length === 0 ? (
                            <span className="text-slate-400 text-sm font-medium">Not specified</span>
                          ) : (
                            form.preferredLocations.map(loc => (
                              <Badge 
                                key={loc.label} 
                                className="bg-slate-200 text-slate-800 hover:bg-slate-300 font-bold py-0.5 px-2 rounded-lg flex items-center gap-1"
                              >
                                {loc.label}
                                {isEditing && (
                                  <button 
                                    type="button" 
                                    onClick={() => handleRemoveLocation(loc.label)}
                                    className="text-slate-500 hover:text-slate-800"
                                  >
                                    <X className="w-3 h-3" />
                                  </button>
                                )}
                              </Badge>
                            ))
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {user.role === 'builder' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Category */}
                      <div>
                        <label className="text-xs font-bold text-slate-500 block mb-1">Project Category</label>
                        {isEditing ? (
                          <MultiSelect
                            options={Object.keys(PROJECT_CATEGORY_TYPES)}
                            selected={form.projectCategories}
                            onChange={(val) => {
                              const validTypes = val.reduce((acc, cat) => [...acc, ...PROJECT_CATEGORY_TYPES[cat]], []);
                              const filteredSelectedTypes = form.projectTypes.filter(t => validTypes.includes(t));
                              setForm(prev => ({ 
                                ...prev, 
                                projectCategories: val,
                                projectTypes: filteredSelectedTypes
                              }));
                            }}
                          />
                        ) : (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {form.projectCategories.length === 0 ? (
                              <span className="text-slate-400 text-sm font-medium">Not specified</span>
                            ) : (
                              form.projectCategories.map(cat => <Badge key={cat} variant="secondary" className="font-bold">{cat}</Badge>)
                            )}
                          </div>
                        )}
                      </div>

                      {/* Type */}
                      <div>
                        <label className="text-xs font-bold text-slate-500 block mb-1">Project Type</label>
                        {isEditing ? (
                          <MultiSelect
                            options={form.projectCategories.reduce((acc, cat) => [...acc, ...(PROJECT_CATEGORY_TYPES[cat] || [])], [])}
                            selected={form.projectTypes}
                            onChange={(val) => setForm(prev => ({ ...prev, projectTypes: val }))}
                            placeholder={form.projectCategories.length === 0 ? "Select categories first" : "Select types"}
                          />
                        ) : (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {form.projectTypes.length === 0 ? (
                              <span className="text-slate-400 text-sm font-medium">Not specified</span>
                            ) : (
                              form.projectTypes.map(t => <Badge key={t} variant="secondary" className="font-bold">{t}</Badge>)
                            )}
                          </div>
                        )}
                      </div>

                      {/* Stage */}
                      <div>
                        <label className="text-xs font-bold text-slate-500 block mb-1">Project Stage</label>
                        {isEditing ? (
                          <MultiSelect
                            options={PROJECT_STAGES}
                            selected={form.projectStages}
                            onChange={(val) => setForm(prev => ({ ...prev, projectStages: val }))}
                          />
                        ) : (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {form.projectStages.length === 0 ? (
                              <span className="text-slate-400 text-sm font-medium">Not specified</span>
                            ) : (
                              form.projectStages.map(s => <Badge key={s} variant="secondary" className="font-bold">{s}</Badge>)
                            )}
                          </div>
                        )}
                      </div>

                      {/* Capital Requirements */}
                      <div>
                        <label className="text-xs font-bold text-slate-500 block mb-1">Capital Requirements</label>
                        {isEditing ? (
                          <MultiSelect
                            options={CAPITAL_REQUIREMENTS}
                            selected={form.capitalRequirements}
                            onChange={(val) => setForm(prev => ({ ...prev, capitalRequirements: val }))}
                          />
                        ) : (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {form.capitalRequirements.length === 0 ? (
                              <span className="text-slate-400 text-sm font-medium">Not specified</span>
                            ) : (
                              form.capitalRequirements.map(c => <Badge key={c} variant="secondary" className="font-bold">{c}</Badge>)
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {isEditing && (
                <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsEditing(false);
                      setForm({
                        name: user.name || user.fullName || '',
                        contactNumber: user.contactNumber || '',
                        address: user.address || '',
                        preferredCategories: user.preferredCategories || [],
                        preferredTypes: user.preferredTypes || [],
                        preferredStages: user.preferredStages || [],
                        preferredPurposes: user.preferredPurposes || [],
                        preferredLocations: user.preferredLocations || [],
                        preferredBudgets: user.preferredBudgets || [],
                        projectCategories: user.projectCategories || [],
                        projectTypes: user.projectTypes || [],
                        projectStages: user.projectStages || [],
                        capitalRequirements: user.capitalRequirements || []
                      });
                    }}
                    className="text-xs rounded-xl"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={saving}
                    className="bg-[#D48035] hover:bg-[#B45309] text-white text-xs rounded-xl flex items-center gap-1.5 font-bold"
                  >
                    {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                    Save Changes
                  </Button>
                </div>
              )}
            </form>
          </div>

          {/* Membership Stats Sidebar (Col 1) */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 flex flex-col justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-4">
                <Crown className="w-4 h-4 text-orange-400" /> Plan & Status
              </h2>

              <div className="space-y-4">
                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4">
                  <span className="text-xs text-slate-500 font-medium">Current Status</span>
                  <div className="flex items-center gap-2 mt-1">
                    {isMembershipActive ? (
                      <>
                        <span className="w-2.5 h-2.5 rounded-full bg-green-500" />
                        <span className="text-sm font-bold text-green-600 capitalize">Active Premium</span>
                      </>
                    ) : (
                      <>
                        <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
                        <span className="text-sm font-bold text-orange-600 capitalize">Free update for 1 yr</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 px-1 text-sm text-slate-600">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <div>
                    <p className="text-xs text-slate-400 font-bold">Expiration Date</p>
                    <p className="font-semibold text-slate-700 mt-0.5">
                      {user.membershipExpiry ? new Date(user.membershipExpiry).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric'
                      }) : new Date('2027-07-13').toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100 mt-6">
              <Button
                onClick={() => router.push('/membership')}
                className="w-full bg-[#0b264f] hover:bg-blue-900 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm"
              >
                <Crown className="w-4 h-4 text-orange-400 fill-orange-400" />
                {isMembershipActive ? 'Manage Membership' : 'Renew Membership'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </AdminSidebar>
  );
}
