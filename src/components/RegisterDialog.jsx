import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from '@/hooks/use-toast';
import { CheckCircle, ChevronRight, Loader2, TrendingUp, Building, UserCheck } from 'lucide-react';
import { createUserAuth, updateInvestorProfile, createBuilderAuth, updateBuilderProfile } from '@/api';
import GoogleAuthButton from '@/components/GoogleAuthButton';

const RegisterDialog = ({ isOpen, onOpenChange, onLoginClick, initialData = {} }) => {
  const [step, setStep] = useState(1);
  const [userType, setUserType] = useState('investor'); // 'investor' or 'builder'
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Data States
  const [authData, setAuthData] = useState({ email: '', password: '', confirmPassword: '' });
  
  const [investorData, setInvestorData] = useState({
    fullName: '', contactNumber: '', investorType: '', totalInvestedAmount: '', preferredProjectTypes: '',
    address: '', country: '', state: '', city: '', zip: '', kycDocuments: null, termsAccepted: false
  });

  const [builderData, setBuilderData] = useState({
    companyName: '', yearOfIncorporation: '', companyOverview: '', promotersOrDirectors: '',
    contactPersonName: '', contactPersonEmail: '', contactPersonPhone: '',
    reraRegistrationNumbers: '', totalProjectsCompleted: '', totalSqftDelivered: '', majorCompletedProjects: '', currentOngoingProjects: '',
    financialOfCompany: '', outstandingDebt: '', bankingPartners: '', declaredLitigationDisputes: '', experienceWithNriInvestors: '',
    address: '', country: '', state: '', city: '', zip: '', termsAccepted: false
  });

  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [loadingLocation, setLoadingLocation] = useState(false);

  // Initialize from props if Google login redirected here
  useEffect(() => {
    if (initialData?.skipStep1 && initialData?.uid) {
      setUserType(initialData.userType || 'investor');
      setUserId(initialData.uid);
      setAuthData(prev => ({ ...prev, email: initialData.email }));
      setInvestorData(prev => ({ ...prev, fullName: initialData.name || '' }));
      setStep(2);
    }
  }, [initialData]);

  // Reset state when closed
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setStep(1); setSubmitted(false); setUserId(null);
        setAuthData({ email: '', password: '', confirmPassword: '' });
      }, 300);
    } else {
      fetch('https://countriesnow.space/api/v0.1/countries/iso')
        .then(res => res.json())
        .then(data => { if (!data.error) setCountries(data.data || []); })
        .catch(console.error);
    }
  }, [isOpen]);

  // Unified Location Handlers
  const getActiveData = () => userType === 'investor' ? investorData : builderData;
  const setActiveData = (data) => userType === 'investor' ? setInvestorData(data) : setBuilderData(data);

  const handleCountryChange = async (e) => {
    const selectedCountry = e.target.value;
    setActiveData({ ...getActiveData(), country: selectedCountry, state: '', city: '' });
    setStates([]); setCities([]);
    if (selectedCountry) {
      setLoadingLocation(true);
      try {
        const res = await fetch('https://countriesnow.space/api/v0.1/countries/states', {
          method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ country: selectedCountry })
        });
        const data = await res.json();
        if (!data.error) setStates(data.data.states || []);
      } catch (error) {} finally { setLoadingLocation(false); }
    }
  };

  const handleStateChange = async (e) => {
    const selectedState = e.target.value;
    setActiveData({ ...getActiveData(), state: selectedState, city: '' });
    setCities([]);
    if (selectedState && getActiveData().country) {
      setLoadingLocation(true);
      try {
        const res = await fetch('https://countriesnow.space/api/v0.1/countries/state/cities', {
          method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ country: getActiveData().country, state: selectedState })
        });
        const data = await res.json();
        if (!data.error) setCities(data.data || []);
      } catch (error) {} finally { setLoadingLocation(false); }
    }
  };

  // Submission Handlers
  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    if (authData.password !== authData.confirmPassword) {
      return toast({ title: "Error", description: "Passwords do not match", variant: "destructive" });
    }
    try {
      setLoading(true);
      let response;
      if (userType === 'investor') {
        response = await createUserAuth(authData);
      } else {
        response = await createBuilderAuth({ email: authData.email, password: authData.password });
        setBuilderData(prev => ({ ...prev, contactPersonEmail: authData.email })); // Pre-fill
      }
      setUserId(response.uid);
      setStep(2);
      toast({ title: "Account Created", description: "Please complete your profile." });
    } catch (err) {
      toast({ title: "Registration Failed", description: err.message, variant: "destructive" });
    } finally { setLoading(false); }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    const currentData = getActiveData();
    if (!currentData.termsAccepted) return toast({ title: 'Error', description: 'Please accept the terms.', variant: 'destructive' });
    
    try {
      setLoading(true);
      if (userType === 'investor') {
        await updateInvestorProfile(userId, currentData);
      } else {
        await updateBuilderProfile(userId, currentData);
      }
      setSubmitted(true);
    } catch (error) {
      toast({ title: 'Error', description: error.message || 'Failed to submit.', variant: 'destructive' });
    } finally { setLoading(false); }
  };

  const handleGoogleRegisterSuccess = (userData) => {
    setUserId(userData.uid);
    setAuthData({ ...authData, email: userData.email });
    setInvestorData(prev => ({ ...prev, fullName: userData.name || '' }));
    toast({ title: "Authentication Successful", description: "Please complete your details." });
    setStep(2);
  };

  const content = {
    investor: {
      image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop",
      title: "Grow your wealth", highlight: "with confidence.",
      desc: "Access exclusive, high-yield real estate opportunities. Join a network of elite investors.",
      features: ["Curated Premium Projects", "Transparent Documentation", "High ROI Potential"]
    },
    builder: {
      image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=2070&auto=format&fit=crop",
      title: "Scale your projects", highlight: "without limits.",
      desc: "Join our exclusive network of top-tier builders. Access global investors and streamline fundraising.",
      features: ["Verified Investor Network", "Automated Compliance", "Fast-track Funding"]
    }
  };

  const activeContent = content[userType];
  const inputStyle = "h-11 px-4 bg-white border-gray-200 focus:bg-white focus:ring-2 focus:ring-orange-500/10 focus:border-orange-500 transition-all rounded-lg";
  const selectStyle = "flex h-11 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/10 focus-visible:border-orange-500 disabled:opacity-50 transition-all";
  const labelStyle = "text-sm font-semibold text-gray-700 mb-1.5 block";

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl p-0 overflow-hidden bg-white border-none shadow-2xl flex max-h-[90vh]">
        
        {/* LEFT PANEL */}
        <div className="hidden lg:flex lg:w-2/5 relative bg-[#1c1c1c] flex-col justify-center px-10 text-white overflow-hidden transition-all duration-500">
          <div className="absolute inset-0 bg-gradient-to-br from-[#ffffff6b] via-[#1c1c1c] to-[#000] z-0"></div>
          <div className="absolute inset-0 opacity-15 z-0 transition-all duration-700" style={{ backgroundImage: `url('${activeContent.image}')`, backgroundSize: 'cover', backgroundBlendMode: 'overlay' }} />
          <div className="relative z-10">
            <h1 className="text-3xl font-bold mb-4 leading-tight">{activeContent.title} <br /> <span className="text-orange-500">{activeContent.highlight}</span></h1>
            <p className="text-sm text-gray-300 mb-8 leading-relaxed font-light">{activeContent.desc}</p>
            <div className="space-y-4">
              {activeContent.features.map((item, index) => (
                <div key={index} className="flex items-center gap-3 group">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-orange-500/20 flex items-center justify-center group-hover:bg-orange-500 transition-colors duration-300">
                    <CheckCircle className="h-3 w-3 text-orange-500 group-hover:text-white transition-colors" />
                  </div>
                  <span className="text-sm font-medium text-gray-200">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="flex-1 overflow-y-auto relative custom-scrollbar bg-gray-50">
          <div className="p-8 md:p-12">
            
            {submitted ? (
              <div className="text-center py-10">
                <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="h-10 w-10 text-green-600" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Registration Complete!</h2>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                  {userType === 'investor' 
                    ? "Your profile has been created. You can now browse exclusive projects."
                    : "Our team will verify your details and contact you shortly to activate your dashboard."}
                </p>
                <Button onClick={() => { onOpenChange(false); onLoginClick(); }} className="bg-[#ea580c] hover:bg-[#c2410c] px-8 py-6 text-lg">
                  Proceed to Login
                </Button>
              </div>
            ) : (
              <div>
                {/* TOGGLE SWITCH (Only show on Step 1) */}
                {step === 1 && (
                  <div className="flex bg-gray-200/50 p-1 rounded-xl mb-8 w-full max-w-sm mx-auto">
                    <button onClick={() => setUserType('investor')} className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${userType === 'investor' ? 'bg-white shadow-sm text-orange-600' : 'text-gray-500 hover:text-gray-700'}`}>Investor</button>
                    <button onClick={() => setUserType('builder')} className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${userType === 'builder' ? 'bg-white shadow-sm text-orange-600' : 'text-gray-500 hover:text-gray-700'}`}>Partner / Builder</button>
                  </div>
                )}

                <div className="text-left mb-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-orange-50">
                      {step === 1 ? <UserCheck className="h-5 w-5 text-orange-600" /> : (userType === 'investor' ? <TrendingUp className="h-5 w-5 text-orange-600" /> : <Building className="h-5 w-5 text-orange-600" />)}
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900">
                      {step === 1 ? "Create Account" : (userType === 'investor' ? "Investor Profile" : "Company Profile")}
                    </h2>
                  </div>
                </div>

                {/* STEP 1: AUTH */}
                {step === 1 && (
                  <div className="space-y-5">
                    {userType === 'investor' && (
                      <>
                        <GoogleAuthButton onSuccess={handleGoogleRegisterSuccess} text="Sign up with Google" />
                        <div className="relative">
                          <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-gray-200" /></div>
                          <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-gray-500">Or register with email</span></div>
                        </div>
                      </>
                    )}
                    <form onSubmit={handleAuthSubmit} className="space-y-4">
                      <div className="space-y-2">
                        <Label className={labelStyle}>{userType === 'investor' ? 'Email Address' : 'Work Email'}</Label>
                        <Input type="email" required value={authData.email} onChange={(e) => setAuthData({ ...authData, email: e.target.value })} className={inputStyle} placeholder="you@company.com" />
                      </div>
                      <div className="space-y-2">
                        <Label className={labelStyle}>Password</Label>
                        <Input type="password" required value={authData.password} onChange={(e) => setAuthData({ ...authData, password: e.target.value })} className={inputStyle} placeholder="••••••••" />
                      </div>
                      <div className="space-y-2">
                        <Label className={labelStyle}>Confirm Password</Label>
                        <Input type="password" required value={authData.confirmPassword} onChange={(e) => setAuthData({ ...authData, confirmPassword: e.target.value })} className={inputStyle} placeholder="••••••••" />
                      </div>
                      <Button type="submit" className="w-full h-11 bg-[#ea580c] hover:bg-[#c2410c] text-white font-semibold rounded-lg mt-4" disabled={loading}>
                        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <>Register <ChevronRight className="ml-2 h-4 w-4" /></>}
                      </Button>
                      <div className="text-center text-sm text-gray-600 mt-4">
                        Already have an account? 
                        <button type="button" className="text-orange-600 hover:underline font-medium ml-2" onClick={() => { onOpenChange(false); onLoginClick(); }}>Login Now</button>
                      </div>
                    </form>
                  </div>
                )}

                {/* STEP 2: PROFILE */}
                {step === 2 && (
                  <form onSubmit={handleProfileSubmit} className="space-y-8 animate-in fade-in">
                    
                    {/* INVESTOR SPECIFIC FIELDS */}
                    {userType === 'investor' && (
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                          <div className="space-y-1.5"><Label className={labelStyle}>Full Name *</Label><Input required value={investorData.fullName} onChange={(e) => setInvestorData({ ...investorData, fullName: e.target.value })} className={inputStyle} /></div>
                          <div className="space-y-1.5"><Label className={labelStyle}>Contact Number *</Label><Input required value={investorData.contactNumber} onChange={(e) => setInvestorData({ ...investorData, contactNumber: e.target.value })} className={inputStyle} /></div>
                          <div className="space-y-1.5"><Label className={labelStyle}>Investor Type</Label><select className={selectStyle} value={investorData.investorType} onChange={(e) => setInvestorData({ ...investorData, investorType: e.target.value })}><option value="">Select</option><option value="Individual">Individual</option><option value="NRI">NRI</option></select></div>
                          <div className="space-y-1.5"><Label className={labelStyle}>Capacity (₹)</Label><Input type="number" value={investorData.totalInvestedAmount} onChange={(e) => setInvestorData({ ...investorData, totalInvestedAmount: e.target.value })} className={inputStyle} /></div>
                        </div>
                      </div>
                    )}

                    {/* BUILDER SPECIFIC FIELDS */}
                    {userType === 'builder' && (
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                          <div className="space-y-1.5"><Label className={labelStyle}>Company Name *</Label><Input required value={builderData.companyName} onChange={(e) => setBuilderData({ ...builderData, companyName: e.target.value })} className={inputStyle} /></div>
                          <div className="space-y-1.5"><Label className={labelStyle}>Year of Inc. *</Label><Input type="number" required value={builderData.yearOfIncorporation} onChange={(e) => setBuilderData({ ...builderData, yearOfIncorporation: e.target.value })} className={inputStyle} /></div>
                          <div className="space-y-1.5"><Label className={labelStyle}>Contact Name *</Label><Input required value={builderData.contactPersonName} onChange={(e) => setBuilderData({ ...builderData, contactPersonName: e.target.value })} className={inputStyle} /></div>
                          <div className="space-y-1.5"><Label className={labelStyle}>Contact Phone *</Label><Input required value={builderData.contactPersonPhone} onChange={(e) => setBuilderData({ ...builderData, contactPersonPhone: e.target.value })} className={inputStyle} /></div>
                          <div className="space-y-1.5"><Label className={labelStyle}>RERA Nos</Label><Input value={builderData.reraRegistrationNumbers} onChange={(e) => setBuilderData({ ...builderData, reraRegistrationNumbers: e.target.value })} className={inputStyle} /></div>
                          <div className="space-y-1.5"><Label className={labelStyle}>Projects Completed</Label><Input type="number" value={builderData.totalProjectsCompleted} onChange={(e) => setBuilderData({ ...builderData, totalProjectsCompleted: e.target.value })} className={inputStyle} /></div>
                        </div>
                      </div>
                    )}

                    <div className="h-px bg-gray-200 w-full" />

                    {/* SHARED LOCATION FIELDS */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-bold text-gray-900">Location</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-1.5"><Label className={labelStyle}>Address Line</Label><Input value={getActiveData().address} onChange={(e) => setActiveData({ ...getActiveData(), address: e.target.value })} className={inputStyle} /></div>
                        <div className="space-y-1.5"><Label className={labelStyle}>Zip Code</Label><Input value={getActiveData().zip} onChange={(e) => setActiveData({ ...getActiveData(), zip: e.target.value })} className={inputStyle} /></div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        <div className="space-y-1.5">
                          <Label className={labelStyle}>Country</Label>
                          <select required className={selectStyle} value={getActiveData().country} onChange={handleCountryChange}>
                            <option value="">Select Country</option>
                            {countries.map((c) => <option key={c.name} value={c.name}>{c.name}</option>)}
                          </select>
                        </div>
                        <div className="space-y-1.5">
                          <Label className={labelStyle}>State</Label>
                          <select required className={selectStyle} value={getActiveData().state} onChange={handleStateChange} disabled={!getActiveData().country}>
                            <option value="">{loadingLocation ? "Loading..." : "Select State"}</option>
                            {states.map((s) => <option key={s.name} value={s.name}>{s.name}</option>)}
                          </select>
                        </div>
                        <div className="space-y-1.5">
                          <Label className={labelStyle}>City</Label>
                          <select required className={selectStyle} value={getActiveData().city} onChange={(e) => setActiveData({ ...getActiveData(), city: e.target.value })} disabled={!getActiveData().state}>
                            <option value="">{loadingLocation ? "Loading..." : "Select City"}</option>
                            {cities.map((city, index) => <option key={index} value={city}>{city}</option>)}
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3 p-4 bg-orange-50/50 border border-orange-100 rounded-lg mt-6">
                      <Checkbox id="terms" checked={getActiveData().termsAccepted} onCheckedChange={(checked) => setActiveData({ ...getActiveData(), termsAccepted: checked })} className="data-[state=checked]:bg-orange-600 border-orange-200" />
                      <Label htmlFor="terms" className="text-sm font-medium text-gray-600 cursor-pointer">
                        I confirm the information is accurate and agree to the <span className="text-orange-600 underline">terms and conditions</span>.
                      </Label>
                    </div>

                    <Button type="submit" className="w-full h-12 bg-[#ea580c] hover:bg-[#c2410c] text-white font-bold text-lg rounded-lg" disabled={loading}>
                      {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : 'Complete Registration'}
                    </Button>
                  </form>
                )}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RegisterDialog;