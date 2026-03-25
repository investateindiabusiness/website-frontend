import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { CheckCircle, ChevronRight, Loader2, TrendingUp, Building, UserCheck, FileWarning, ClipboardList } from 'lucide-react';
import { getAuth, signOut } from 'firebase/auth';
import { app } from '@/firebase';
import { registerStep1, submitInvestorForm1, submitBuilderForm1, submitRequestedChanges, submitInvestorForm2, submitBuilderForm2 } from '@/api';
import GoogleAuthButton from '@/components/GoogleAuthButton';

const RegisterDialog = ({ isOpen, onOpenChange, onLoginClick, initialData = {} }) => {
  const [step, setStep] = useState(1);
  const [userType, setUserType] = useState('investor');
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // --- Update Modes ---
  // --- CRITICAL FAIL-SAFE: Update Mode Auto-Detection ---
  const currentStatus = initialData?.userData?.onboardingStatus;
  const adminRequests = initialData?.adminRequests || initialData?.userData?.adminRequests || [];

  // List of all Form 2 specific keys
  const FORM2_KEYS = [
    'profession', 'yearlyIncome', 'investmentTenure', 'industryNatureOfWork', 'expectedReturns', 'preferredProjectType', 'preferredGoalStategy', 'investmentPreference',
    'yearOfIncorporation', 'promotersOrDirectors', 'totalSqftDelivered', 'majorCompletedProjects', 'typeOfProjectsOffered', 'companyOverview', 'experienceWithNriInvestors', 'declaredLitigationDisputes', 'financialOfCompany', 'outstandingDebt', 'bankingPartners'
  ];

  // Detect if any of the fields the admin requested belong to Form 2
  const hasForm2Requests = adminRequests.some(req => {
    const id = typeof req === 'string' ? req : (req.id || req.fieldName);
    return FORM2_KEYS.includes(id);
  });

  const isUpdateMode = initialData?.phase === 'CHANGES_REQUESTED' || currentStatus?.includes('changes_requested');

  // Force Form 2 update mode if the status is form2 OR if Form 2 fields are detected
  const isForm2UpdateMode = isUpdateMode && (currentStatus === 'form2_changes_requested' || hasForm2Requests);
  const isForm1UpdateMode = isUpdateMode && !isForm2UpdateMode;

  const isForm2Mode = initialData?.phase === 'FORM2_PENDING' || isForm2UpdateMode;

  const prefilledUserData = initialData?.userData || {};

  const [authData, setAuthData] = useState({ email: '', password: '', confirmPassword: '' });

  const [investorData, setInvestorData] = useState({
    fullName: '', contactNumber: '', investorType: '', investmentRangeMin: '', investmentRangeMax: '',
    address: '', country: '', state: '', city: '', zip: '', termsAccepted: false
  });

  const [builderData, setBuilderData] = useState({
    companyName: '', yearsOfExperience: '', contactNameAndDesignation: '', contactPersonPhone: '',
    ongoingProjects: '', projectsCompleted: '', address: '', country: '', state: '', city: '', zip: '', termsAccepted: false
  });

  const [invForm2, setInvForm2] = useState({
    profession: '', yearlyIncome: '', investmentTenure: '', industryNatureOfWork: '', expectedReturns: '', preferredProjectType: [], preferredGoalStategy: '', investmentPreference: ''
  });

  const [bldForm2, setBldForm2] = useState({
    yearOfIncorporation: '', promotersOrDirectors: '', totalSqftDelivered: '', majorCompletedProjects: '', typeOfProjectsOffered: '', companyOverview: '', experienceWithNriInvestors: '', declaredLitigationDisputes: '', financialOfCompany: '', outstandingDebt: '', bankingPartners: ''
  });

  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [loadingLocation, setLoadingLocation] = useState(false);

  const getActiveData = () => userType === 'investor' ? investorData : builderData;
  const setActiveData = (data) => userType === 'investor' ? setInvestorData(data) : setBuilderData(data);

  const handleProjectTypeToggle = (type) => {
    const allTypes = ['Plots / Land', 'Villa', 'Apartments / Flats', 'Commercial Spaces', 'Farm Land / Agri Projects'];
    setInvForm2(prev => {
      const current = prev.preferredProjectType || [];
      if (type === 'Open to All') return { ...prev, preferredProjectType: current.includes('Open to All') ? [] : [...allTypes, 'Open to All'] };

      let newSelection = current.includes(type) ? current.filter(t => t !== type && t !== 'Open to All') : [...current, type];
      if (allTypes.every(t => newSelection.includes(t))) newSelection.push('Open to All');
      return { ...prev, preferredProjectType: newSelection };
    });
  };

  const activeCountry = getActiveData().country;
  useEffect(() => {
    if (activeCountry) {
      setLoadingLocation(true);
      fetch('https://countriesnow.space/api/v0.1/countries/states', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ country: activeCountry })
      }).then(res => res.json()).then(data => { if (!data.error) setStates(data.data.states || []); }).catch(console.error).finally(() => setLoadingLocation(false));
    } else { setStates([]); }
  }, [activeCountry]);

  const activeState = getActiveData().state;
  useEffect(() => {
    if (activeCountry && activeState) {
      setLoadingLocation(true);
      fetch('https://countriesnow.space/api/v0.1/countries/state/cities', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ country: activeCountry, state: activeState })
      }).then(res => res.json()).then(data => { if (!data.error) setCities(data.data || []); }).catch(console.error).finally(() => setLoadingLocation(false));
    } else { setCities([]); }
  }, [activeCountry, activeState]);

  useEffect(() => {
    let timer;
    if (isOpen) {
      fetch('https://countriesnow.space/api/v0.1/countries/iso').then(res => res.json()).then(data => { if (!data.error) setCountries(data.data || []); }).catch(console.error);
      if (initialData?.userType) setUserType(initialData.userType);

      if (initialData?.skipStep1 && initialData?.uid) {
        setUserId(initialData.uid);
        setAuthData(prev => ({ ...prev, email: initialData.email || '' }));

        if (isUpdateMode && initialData.userData) {
          const uData = initialData.userData;
          if (initialData.userType === 'investor') setInvestorData(prev => ({ ...prev, ...uData }));
          else setBuilderData(prev => ({ ...prev, ...uData }));
        } else if (initialData.userType === 'investor' && !isForm2Mode) {
          setInvestorData(prev => ({ ...prev, fullName: initialData.name || '' }));
        }

        if (isForm2Mode) {
          setStep(3);
          if (initialData.userData) {
            if (initialData.userType === 'investor') setInvForm2(prev => ({ ...prev, ...initialData.userData }));
            else setBldForm2(prev => ({ ...prev, ...initialData.userData }));
          }
        } else {
          setStep(2);
        }
      } else {
        setStep(1);
      }
    } else {
      timer = setTimeout(() => {
        setSubmitted(false); setUserId(null); setStep(1); setAuthData({ email: '', password: '', confirmPassword: '' });
      }, 300);
    }
    return () => { if (timer) clearTimeout(timer); };
  }, [isOpen, initialData, isUpdateMode, isForm2Mode]);

  const handleCountryChange = (e) => setActiveData({ ...getActiveData(), country: e.target.value, state: '', city: '' });
  const handleStateChange = (e) => setActiveData({ ...getActiveData(), state: e.target.value, city: '' });

  const getAddressLabels = (country) => {
    if (country === 'India') return { state: 'State', zip: 'PIN Code' };
    if (country === 'United States') return { state: 'State', zip: 'Zip Code' };
    return { state: 'State / Province / Region', zip: 'Postal Code' };
  };
  const addressLabels = getAddressLabels(getActiveData().country);

  const shouldShowField = (fieldName) => {
    if (!isForm1UpdateMode) return true;
    const requested = adminRequests.map(req => typeof req === 'string' ? req : (req.id || req.fieldName));
    if (requested.includes(fieldName)) return true;
    if (fieldName === 'country' && (requested.includes('state') || requested.includes('city') || requested.includes('zip'))) return true;
    if (fieldName === 'state' && requested.includes('city')) return true;
    if (fieldName === 'investmentRangeMin' && requested.includes('investmentRangeMax')) return true;
    if (fieldName === 'investmentRangeMax' && requested.includes('investmentRangeMin')) return true;
    return false;
  };

  const shouldShowForm2Field = (fieldName) => {
    if (!isForm2UpdateMode) return true;
    const requested = adminRequests.map(req => typeof req === 'string' ? req : (req.id || req.fieldName));
    return requested.includes(fieldName);
  };

  const isProfileFormValid = () => {
    const data = getActiveData();
    if (isForm1UpdateMode) {
      let isValid = true;
      const requested = adminRequests.map(req => typeof req === 'string' ? req : (req.id || req.fieldName));
      const fieldsToCheck = new Set(requested);
      if (fieldsToCheck.has('city')) { fieldsToCheck.add('state'); fieldsToCheck.add('country'); }
      if (fieldsToCheck.has('state')) { fieldsToCheck.add('country'); }
      fieldsToCheck.forEach(id => { if (data[id] === undefined || data[id] === '') isValid = false; });
      return isValid && data.termsAccepted;
    }

    if (userType === 'investor') {
      return (
        investorData.fullName.trim() !== '' && investorData.contactNumber.trim() !== '' &&
        investorData.country.trim() !== '' && investorData.state.trim() !== '' && investorData.city.trim() !== '' && investorData.termsAccepted
      );
    } else {
      return (
        builderData.companyName.trim() !== '' && builderData.yearsOfExperience.toString().trim() !== '' &&
        builderData.contactNameAndDesignation.trim() !== '' && builderData.contactPersonPhone.trim() !== '' &&
        builderData.country.trim() !== '' && builderData.state.trim() !== '' && builderData.city.trim() !== '' && builderData.termsAccepted
      );
    }
  };

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    if (authData.password !== authData.confirmPassword) return toast({ title: "Error", description: "Passwords do not match", variant: "destructive" });
    try {
      setLoading(true);
      let response = await registerStep1({ email: authData.email, password: authData.password, role: userType });
      setUserId(response.uid); setStep(2);
      toast({ title: "Account Created", description: "Please complete Form 1 details." });
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
      if (isForm1UpdateMode) {
        const existingPendingChanges = initialData?.userData?.pendingChanges || {};
        const payload = { ...existingPendingChanges };
        const requestedIds = adminRequests.map(req => typeof req === 'string' ? req : (req.id || req.fieldName));
        const fieldsToSend = new Set(requestedIds);

        if (fieldsToSend.has('city') || fieldsToSend.has('zip')) { fieldsToSend.add('state'); fieldsToSend.add('country'); }
        if (fieldsToSend.has('state')) fieldsToSend.add('country');
        if (fieldsToSend.has('investmentRangeMin') || fieldsToSend.has('investmentRangeMax')) {
          fieldsToSend.add('investmentRangeMin'); fieldsToSend.add('investmentRangeMax');
        }

        fieldsToSend.forEach(id => { if (currentData[id] !== undefined) payload[id] = currentData[id]; });
        await submitRequestedChanges(userId, payload);
      } else if (userType === 'investor') {
        await submitInvestorForm1(userId, currentData);
      } else {
        await submitBuilderForm1(userId, currentData);
      }
      setSubmitted(true);
    } catch (error) {
      toast({ title: 'Error', description: error.message || 'Failed to submit.', variant: 'destructive' });
    } finally { setLoading(false); }
  };

  const handleForm2Submit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (isForm2UpdateMode) {
        const existingPendingChanges = initialData?.userData?.pendingChanges || {};
        const payload = { ...existingPendingChanges };
        const requestedIds = adminRequests.map(req => typeof req === 'string' ? req : (req.id || req.fieldName));

        const currentForm2Data = userType === 'investor' ? invForm2 : bldForm2;
        const baseData = getActiveData(); // Grabs investorData/builderData where custom fields live

        requestedIds.forEach(id => {
          // Check Form 2 state first, fallback to base state for custom fields
          if (currentForm2Data[id] !== undefined) {
            payload[id] = currentForm2Data[id];
          } else if (baseData[id] !== undefined) {
            payload[id] = baseData[id];
          }
        });

        await submitRequestedChanges(userId, payload);
      } else {
        if (userType === 'investor') await submitInvestorForm2(userId, invForm2);
        else await submitBuilderForm2(userId, bldForm2);
      }
      setSubmitted(true);
    } catch (error) {
      toast({ title: 'Error', description: error.message || 'Failed to submit final details.', variant: 'destructive' });
    } finally { setLoading(false); }
  };

  const handleGoogleRegisterSuccess = async (userData) => {
    const auth = getAuth(app);
    await signOut(auth);
    setUserId(userData.uid);
    setAuthData({ ...authData, email: userData.email });
    if (userType === 'investor') setInvestorData(prev => ({ ...prev, fullName: userData.name || '' }));
    toast({ title: "Authentication Successful", description: "Please complete your details." });
    setStep(2);
  };

  const content = {
    investor: {
      image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop",
      title: isUpdateMode ? "Update your" : (isForm2Mode ? "Complete your" : "Grow your wealth"),
      highlight: isUpdateMode ? "information." : (isForm2Mode ? "profile." : "with confidence."),
      desc: isUpdateMode ? "Please update the requested fields to finalize your profile verification." : (isForm2Mode ? "Almost there! Complete the final details to access exclusive opportunities." : "Access exclusive, high-yield real estate opportunities. Join a network of elite investors."),
      features: ["Curated Premium Projects", "Transparent Documentation", "High ROI Potential"]
    },
    builder: {
      image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=2070&auto=format&fit=crop",
      title: isUpdateMode ? "Update your" : (isForm2Mode ? "Complete your" : "Scale your projects"),
      highlight: isUpdateMode ? "information." : (isForm2Mode ? "profile." : "without limits."),
      desc: isUpdateMode ? "Please update the requested fields to finalize your builder verification." : (isForm2Mode ? "Almost there! Complete the final details to finalize your partner account." : "Join our exclusive network of top-tier builders. Access global investors and streamline fundraising."),
      features: ["Verified Investor Network", "Automated Compliance", "Fast-track Funding"]
    }
  };

  const inputStyle = "h-11 px-4 bg-white border-gray-200 focus:bg-white focus:ring-2 focus:ring-orange-500/10 focus:border-orange-500 transition-all rounded-lg w-full";
  const selectStyle = "flex h-11 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/10 focus-visible:border-orange-500 disabled:opacity-50 transition-all";
  const textareaStyle = "min-h-[80px] px-4 py-3 bg-white border-gray-200 focus:bg-white focus:ring-2 focus:ring-orange-500/10 focus:border-orange-500 transition-all rounded-lg w-full";
  const readOnlyStyle = "h-11 px-4 bg-gray-100 border-gray-200 text-gray-500 rounded-lg w-full cursor-not-allowed";
  const labelStyle = "text-sm font-semibold text-gray-700 block mb-1.5";
  const sectionContainerStyle = "bg-white p-5 rounded-xl border border-gray-100 shadow-sm space-y-5";

  // --- CRITICAL FIX: Include ALL fields from both forms to ensure native UI logic catches them and they do not fall back to plain text inputs.
  const STANDARD_FIELDS = [
    'fullName', 'contactNumber', 'investorType', 'investmentRangeMin', 'investmentRangeMax', 'address', 'country', 'state', 'city', 'zip', 'termsAccepted',
    'companyName', 'yearsOfExperience', 'contactNameAndDesignation', 'contactPersonPhone', 'ongoingProjects', 'projectsCompleted',
    'profession', 'yearlyIncome', 'investmentTenure', 'industryNatureOfWork', 'expectedReturns', 'preferredProjectType', 'preferredGoalStategy', 'investmentPreference',
    'yearOfIncorporation', 'promotersOrDirectors', 'totalSqftDelivered', 'majorCompletedProjects', 'typeOfProjectsOffered', 'companyOverview',
    'experienceWithNriInvestors', 'declaredLitigationDisputes', 'financialOfCompany', 'outstandingDebt', 'bankingPartners'
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl p-0 overflow-hidden bg-white border-none shadow-2xl flex max-h-[90vh]">
        <DialogTitle style={{ display: 'none' }}></DialogTitle>
        <div className="hidden lg:flex lg:w-2/5 relative bg-[#1c1c1c] flex-col justify-center px-10 text-white overflow-hidden transition-all duration-500">
          <div className="absolute inset-0 bg-gradient-to-br from-[#ffffff6b] via-[#1c1c1c] to-[#000] z-0"></div>
          <div className="absolute inset-0 opacity-15 z-0 transition-all duration-700" style={{ backgroundImage: `url('${content[userType].image}')`, backgroundSize: 'cover', backgroundBlendMode: 'overlay' }} />
          <div className="relative z-10">
            <h1 className="text-3xl font-bold mb-4 leading-tight">{content[userType].title} <br /> <span className="text-orange-500">{content[userType].highlight}</span></h1>
            <p className="text-sm text-gray-300 mb-8 leading-relaxed font-light">{content[userType].desc}</p>
            <div className="space-y-4">
              {content[userType].features.map((item, index) => (
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

        <div className="flex-1 overflow-y-auto relative custom-scrollbar bg-gray-50">
          <div className="p-8">
            {submitted ? (
              <div className="text-center py-10">
                <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"><CheckCircle className="h-10 w-10 text-green-600" /></div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">{isUpdateMode ? 'Update Submitted!' : 'Registration Submitted!'}</h2>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                  {isUpdateMode ? "Your changes have been sent to our administration team for final review." : isForm2Mode ? "Your final details have been sent to our administration team. We will activate your account shortly." : "Your initial details have been sent to our administration team for verification. We will notify you once approved so you can complete your profile setup."}
                </p>
                <Button onClick={() => { onOpenChange(false); onLoginClick(); }} className="bg-[#ea580c] hover:bg-[#c2410c] px-8 py-6 text-lg">Back to Login</Button>
              </div>
            ) : (
              <div>
                {step === 1 && (
                  <div className="flex bg-gray-200/50 p-1 rounded-xl mb-4 w-full max-w-sm mx-auto">
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
                      {step === 1 ? (userType === 'investor' ? "Create Investor Account" : "Create Builder Account") : step === 2 ? (isForm1UpdateMode ? "Information Update Required" : (userType === 'investor' ? "Initial Details" : "Initial Details")) : "Complete Registration"}
                    </h2>
                  </div>
                </div>

                {step === 1 && (
                  <div className="space-y-2">
                    <GoogleAuthButton onSuccess={handleGoogleRegisterSuccess} text="Sign up with Google" userType={userType} />
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-gray-200" /></div>
                      <div className="relative flex justify-center text-xs uppercase"><span className="bg-gray-50 px-2 text-gray-500">Or register with email</span></div>
                    </div>

                    <form onSubmit={handleAuthSubmit} className="space-y-4">
                      <div className="space-y-2">
                        <Label className={labelStyle}>{userType === 'investor' ? 'Email Address' : 'Work Email'}</Label>
                        <Input type="email" name='email' required value={authData.email} onChange={(e) => setAuthData({ ...authData, email: e.target.value })} className={inputStyle} placeholder="you@company.com" />
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
                    </form>
                  </div>
                )}

                {step === 2 && (
                  <form onSubmit={handleProfileSubmit} className="space-y-8 animate-in fade-in">
                    {isForm1UpdateMode && (
                      <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm flex items-center gap-3 mb-4">
                        <FileWarning className="w-5 h-5 flex-shrink-0" />
                        <span>The admin team has requested changes to specific fields. Please correct them below.</span>
                      </div>
                    )}

                    {/* INVESTOR FORM 1 */}
                    {userType === 'investor' && (
                      <div className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                          {shouldShowField('fullName') && (<div><Label className={labelStyle}>Full Name *</Label><Input required value={investorData.fullName} onChange={(e) => setInvestorData({ ...investorData, fullName: e.target.value })} placeholder="Full name" className={inputStyle} /></div>)}
                          {shouldShowField('contactNumber') && (<div><Label className={labelStyle}>Contact Number *</Label><Input required value={investorData.contactNumber} onChange={(e) => setInvestorData({ ...investorData, contactNumber: e.target.value.replace(/\D/g, '') })} placeholder="Contact number" className={inputStyle} /></div>)}
                          {shouldShowField('investorType') && (
                            <div>
                              <Label className={labelStyle}>Investor Type</Label>
                              <select className={selectStyle} value={investorData.investorType} onChange={(e) => setInvestorData({ ...investorData, investorType: e.target.value })}>
                                <option value="">Select Type</option>
                                <option value="Direct Investor">Direct Investor</option>
                                <option value="Financial Advisor">Financial Advisor</option>
                              </select>
                            </div>
                          )}
                          {(shouldShowField('investmentRangeMin') || shouldShowField('investmentRangeMax')) && (
                            <div>
                              <Label className={labelStyle}>Investment Range</Label>
                              <div className="flex gap-2">
                                {shouldShowField('investmentRangeMin') && <Input type="text" placeholder="Min value" value={investorData.investmentRangeMin} onChange={(e) => setInvestorData({ ...investorData, investmentRangeMin: e.target.value.replace(/\D/g, '') })} className={inputStyle} />}
                                {shouldShowField('investmentRangeMax') && <Input type="text" placeholder="Max value" value={investorData.investmentRangeMax} onChange={(e) => setInvestorData({ ...investorData, investmentRangeMax: e.target.value.replace(/\D/g, '') })} className={inputStyle} />}
                              </div>
                            </div>
                          )}
                        </div>
                        {(shouldShowField('address') || shouldShowField('country') || shouldShowField('zip') || shouldShowField('state') || shouldShowField('city')) && (
                          <div className="space-y-4 pt-2">
                            {(!isForm1UpdateMode || shouldShowField('address')) && <Label className="text-base font-bold text-gray-900 border-b pb-2 block">Address Details</Label>}
                            <div className="grid grid-cols-1 gap-5">
                              {shouldShowField('address') && (<div><Label className={labelStyle}>Address Line</Label><Input value={investorData.address} onChange={(e) => setInvestorData({ ...investorData, address: e.target.value })} className={inputStyle} /></div>)}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                              {shouldShowField('country') && (
                                <div><Label className={labelStyle}>Country *</Label>
                                  <select required className={selectStyle} value={investorData.country} onChange={handleCountryChange}>
                                    <option value="">Select Country</option>
                                    {countries.map((c) => <option key={c.name} value={c.name}>{c.name}</option>)}
                                  </select>
                                </div>
                              )}
                              {shouldShowField('zip') && (<div><Label className={labelStyle}>{addressLabels.zip}</Label><Input value={investorData.zip} onChange={(e) => setInvestorData({ ...investorData, zip: e.target.value.replace(/\D/g, '') })} className={inputStyle} /></div>)}
                              {shouldShowField('state') && (
                                <div><Label className={labelStyle}>{addressLabels.state} *</Label>
                                  <select required className={selectStyle} value={investorData.state} onChange={handleStateChange} disabled={!investorData.country}>
                                    <option value="">{loadingLocation ? "Loading..." : `Select ${addressLabels.state}`}</option>
                                    {states.map((s) => <option key={s.name} value={s.name}>{s.name}</option>)}
                                  </select>
                                </div>
                              )}
                              {shouldShowField('city') && (
                                <div><Label className={labelStyle}>City *</Label>
                                  <select required className={selectStyle} value={investorData.city} onChange={(e) => setInvestorData({ ...investorData, city: e.target.value })} disabled={!investorData.state}>
                                    <option value="">{loadingLocation ? "Loading..." : "Select City"}</option>
                                    {cities.map((city, index) => <option key={index} value={city}>{city}</option>)}
                                  </select>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* BUILDER FORM 1 */}
                    {userType === 'builder' && (
                      <div className="space-y-8">
                        <div className="grid grid-cols-1 gap-5">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            {shouldShowField('companyName') && (<div><Label className={labelStyle}>Company Name *</Label><Input required value={builderData.companyName} onChange={(e) => setBuilderData({ ...builderData, companyName: e.target.value })} className={inputStyle} /></div>)}
                            {shouldShowField('yearsOfExperience') && (<div><Label className={labelStyle}>Years of Experience *</Label><Input type="text" required value={builderData.yearsOfExperience} onChange={(e) => setBuilderData({ ...builderData, yearsOfExperience: e.target.value.replace(/\D/g, '') })} placeholder="e.g. 5" className={inputStyle} /></div>)}
                          </div>
                          {(shouldShowField('contactNameAndDesignation') || shouldShowField('contactPersonPhone')) && (
                            <div className={isForm1UpdateMode ? "" : sectionContainerStyle}>
                              {!isForm1UpdateMode && <Label className="text-base font-bold text-gray-900 border-b pb-2 block">Contact Details</Label>}
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                {shouldShowField('contactNameAndDesignation') && (<div><Label className={labelStyle}>Name & Designation *</Label><Input required value={builderData.contactNameAndDesignation} onChange={(e) => setBuilderData({ ...builderData, contactNameAndDesignation: e.target.value })} className={inputStyle} /></div>)}
                                {shouldShowField('contactPersonPhone') && (<div><Label className={labelStyle}>Phone Number *</Label><Input required value={builderData.contactPersonPhone} onChange={(e) => setBuilderData({ ...builderData, contactPersonPhone: e.target.value.replace(/\D/g, '') })} className={inputStyle} /></div>)}
                              </div>
                            </div>
                          )}
                          {(shouldShowField('ongoingProjects') || shouldShowField('projectsCompleted')) && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                              {shouldShowField('ongoingProjects') && (<div><Label className={labelStyle}>Ongoing Projects</Label><Input type="text" value={builderData.ongoingProjects} onChange={(e) => setBuilderData({ ...builderData, ongoingProjects: e.target.value })} className={inputStyle} /></div>)}
                              {shouldShowField('projectsCompleted') && (<div><Label className={labelStyle}>Projects Completed</Label><Input type="text" value={builderData.projectsCompleted} onChange={(e) => setBuilderData({ ...builderData, projectsCompleted: e.target.value })} className={inputStyle} /></div>)}
                            </div>
                          )}
                          {(shouldShowField('address') || shouldShowField('country') || shouldShowField('zip') || shouldShowField('state') || shouldShowField('city')) && (
                            <div className="space-y-4 pt-2">
                              {(!isForm1UpdateMode || shouldShowField('address')) && <Label className="text-base font-bold text-gray-900 border-b pb-2 block">Registered Address</Label>}
                              <div className="grid grid-cols-1 gap-5">
                                {shouldShowField('address') && (<div><Label className={labelStyle}>Address Line</Label><Input value={builderData.address} onChange={(e) => setBuilderData({ ...builderData, address: e.target.value })} className={inputStyle} /></div>)}
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                {shouldShowField('country') && (
                                  <div><Label className={labelStyle}>Country *</Label>
                                    <select required className={selectStyle} value={builderData.country} onChange={handleCountryChange}>
                                      <option value="">Select Country</option>
                                      {countries.map((c) => <option key={c.name} value={c.name}>{c.name}</option>)}
                                    </select>
                                  </div>
                                )}
                                {shouldShowField('zip') && (<div><Label className={labelStyle}>{addressLabels.zip}</Label><Input value={builderData.zip} onChange={(e) => setBuilderData({ ...builderData, zip: e.target.value })} className={inputStyle} /></div>)}
                                {shouldShowField('state') && (
                                  <div><Label className={labelStyle}>{addressLabels.state} *</Label>
                                    <select required className={selectStyle} value={builderData.state} onChange={handleStateChange} disabled={!builderData.country}>
                                      <option value="">{loadingLocation ? "Loading..." : `Select ${addressLabels.state}`}</option>
                                      {states.map((s) => <option key={s.name} value={s.name}>{s.name}</option>)}
                                    </select>
                                  </div>
                                )}
                                {shouldShowField('city') && (
                                  <div><Label className={labelStyle}>City *</Label>
                                    <select required className={selectStyle} value={builderData.city} onChange={(e) => setBuilderData({ ...builderData, city: e.target.value })} disabled={!builderData.state}>
                                      <option value="">{loadingLocation ? "Loading..." : "Select City"}</option>
                                      {cities.map((city, index) => <option key={index} value={city}>{city}</option>)}
                                    </select>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {isForm1UpdateMode && adminRequests.filter(req => !STANDARD_FIELDS.includes(typeof req === 'string' ? req : (req.id || req.fieldName))).map((req) => {
                      const id = typeof req === 'string' ? req : (req.id || req.fieldName);
                      return (
                        <div key={`custom-${id}`} className="space-y-1">
                          <Label className={labelStyle}>{id.replace(/([A-Z])/g, ' $1').trim()} *</Label>
                          <Input required type="text" value={getActiveData()[id] || ''} onChange={(e) => setActiveData({ ...getActiveData(), [id]: e.target.value })} className={inputStyle} placeholder={`Enter ${id.replace(/([A-Z])/g, ' $1').trim()}`} />
                        </div>
                      )
                    })}

                    <div className="h-px bg-gray-200 w-full mt-8 mb-6" />

                    <div className="flex items-start space-x-3 p-4 bg-orange-50/50 border border-orange-100 rounded-lg">
                      <Checkbox id="terms" checked={getActiveData().termsAccepted} onCheckedChange={(checked) => setActiveData({ ...getActiveData(), termsAccepted: checked })} className="data-[state=checked]:bg-orange-600 border-orange-200" />
                      <Label htmlFor="terms" className="text-sm font-medium text-gray-600 cursor-pointer">
                        I confirm the information is accurate and agree to the <span className="text-orange-600 underline">terms and conditions</span>.
                      </Label>
                    </div>

                    <Button type="submit" className="w-full h-12 bg-[#ea580c] hover:bg-[#c2410c] text-white font-bold text-lg rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed transition-all" disabled={loading || !isProfileFormValid()}>
                      {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : (isForm1UpdateMode ? 'Submit Updates' : 'Submit for Verification')}
                    </Button>
                  </form>
                )}

                {/* --- FORM 2 --- */}
                {step === 3 && (
                  <form onSubmit={handleForm2Submit} className="space-y-8 animate-in fade-in">
                    {isForm2UpdateMode ? (
                      <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg flex items-center gap-3 mb-4">
                        <FileWarning className="w-5 h-5 flex-shrink-0" />
                        <span>The admin team has requested changes to specific Form 2 fields. Please correct them below.</span>
                      </div>
                    ) : (
                      <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg flex gap-3 mb-2">
                        <ClipboardList className="w-5 h-5 text-blue-600 flex-shrink-0" />
                        <p className="text-sm text-blue-800">Your initial details were approved! Please complete the final required fields to finish your onboarding.</p>
                      </div>
                    )}

                    {userType === 'investor' && (
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                          {(!isForm2UpdateMode) && (
                            <>
                              <div><Label className={labelStyle}>Full Name</Label><input readOnly value={prefilledUserData.fullName || ''} className={readOnlyStyle} /></div>
                              <div><Label className={labelStyle}>Address</Label><input readOnly value={`${prefilledUserData.city || ''}, ${prefilledUserData.state || ''}`} className={readOnlyStyle} /></div>
                            </>
                          )}

                          {shouldShowForm2Field('profession') && (
                            <div><Label className={labelStyle}>Profession *</Label>
                              <select required className={selectStyle} value={invForm2.profession} onChange={(e) => setInvForm2({ ...invForm2, profession: e.target.value })}>
                                <option value="">Select</option>
                                <option value="Salaried (Government)">Salaried (Government)</option>
                                <option value="Business Owner">Business Owner</option>
                                <option value="Self-Employed Professional">Self-Employed Professional (CA, Doctor, etc.)</option>
                                <option value="Entrepreneur / Startup Founder">Entrepreneur / Startup Founder</option>
                                <option value="Investor / Trader">Investor / Trader</option>
                                <option value="NRI / Overseas Professional">NRI / Overseas Professional</option>
                                <option value="Retired">Retired</option>
                                <option value="Other">Other</option>
                              </select>
                            </div>
                          )}
                          {shouldShowForm2Field('industryNatureOfWork') && (<div><Label className={labelStyle}>Industry / Nature of Work *</Label><Input required value={invForm2.industryNatureOfWork} onChange={(e) => setInvForm2({ ...invForm2, industryNatureOfWork: e.target.value })} className={inputStyle} /></div>)}
                          {shouldShowForm2Field('yearlyIncome') && (
                            <div><Label className={labelStyle}>Yearly Income *</Label>
                              <Input required type="text" value={invForm2.yearlyIncome} onChange={(e) => {
                                const validNumber = e.target.value.replace(/\D/g, '').replace(/^0+/, '');
                                setInvForm2({ ...invForm2, yearlyIncome: validNumber });
                              }} className={inputStyle} placeholder="e.g. 1500000" />
                            </div>
                          )}
                          {shouldShowForm2Field('investmentTenure') && (
                            <div><Label className={labelStyle}>Investment Tenure *</Label>
                              <select required className={selectStyle} value={invForm2.investmentTenure} onChange={(e) => setInvForm2({ ...invForm2, investmentTenure: e.target.value })}>
                                <option value="">Select Tenure</option>
                                <option value="1-3 Years">1 - 3 Years</option>
                                <option value="3-5 Years">3 - 5 Years</option>
                                <option value="5+ Years">5+ Years</option>
                              </select>
                            </div>
                          )}
                          {shouldShowForm2Field('expectedReturns') && (<div><Label className={labelStyle}>Expected Returns *</Label><Input required value={invForm2.expectedReturns} onChange={(e) => setInvForm2({ ...invForm2, expectedReturns: e.target.value })} className={inputStyle} placeholder="e.g. 12-15%" /></div>)}
                          {shouldShowForm2Field('preferredGoalStategy') && (
                            <div><Label className={labelStyle}>Preferred Goal / Strategy *</Label>
                              <select required className={selectStyle} value={invForm2.preferredGoalStategy} onChange={(e) => setInvForm2({ ...invForm2, preferredGoalStategy: e.target.value })}>
                                <option value="">Select Type</option>
                                <option value="Buy & Hold">Buy & Hold (Long-term Appreciation)</option>
                                <option value="Buy & Resell">Buy & Resell (Short-term Gains)</option>
                                <option value="Buy & Lease">Buy & Lease (Rental Income)</option>
                                <option value="Mix of Appreciation & Rental">Mix of Appreciation & Rental</option>
                                <option value="Open to Suggestions">Open to Suggestions</option>
                              </select>
                            </div>
                          )}
                          {shouldShowForm2Field('preferredProjectType') && (
                            <div className="md:col-span-2"><Label className={labelStyle}>Preferred Project Type *</Label>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2 p-3 border border-gray-200 rounded-lg bg-white">
                                {['Plots / Land', 'Villa', 'Apartments / Flats', 'Commercial Spaces', 'Farm Land / Agri Projects', 'Open to All'].map((type) => (
                                  <div key={type} className="flex items-center space-x-3">
                                    <Checkbox id={`proj-${type.replace(/\s+/g, '-')}`} checked={(invForm2.preferredProjectType || []).includes(type)} onCheckedChange={() => handleProjectTypeToggle(type)} className="data-[state=checked]:bg-orange-600 border-gray-300" />
                                    <Label htmlFor={`proj-${type.replace(/\s+/g, '-')}`} className="text-sm font-medium text-gray-700 cursor-pointer">{type}</Label>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                          {shouldShowForm2Field('investmentPreference') && (
                            <div className="md:col-span-2"><Label className={labelStyle}>Assistance Preference *</Label>
                              <select required className={selectStyle} value={invForm2.investmentPreference} onChange={(e) => setInvForm2({ ...invForm2, investmentPreference: e.target.value })}>
                                <option value="">Select</option>
                                <option value="Browse curated investment opportunities on my own">Browse curated investment opportunities on my own</option>
                                <option value="Get recommendations according to my needs from an executive">Get recommendations according to my needs from an executive</option>
                              </select>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {userType === 'builder' && (
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 gap-5">
                          {(!isForm2UpdateMode) && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                              <div><Label className={labelStyle}>Company Name</Label><input readOnly value={prefilledUserData.companyName || ''} className={readOnlyStyle} /></div>
                              <div><Label className={labelStyle}>Contact Person</Label><input readOnly value={prefilledUserData.contactNameAndDesignation || ''} className={readOnlyStyle} /></div>
                              <div><Label className={labelStyle}>Total Projects Completed</Label><input readOnly value={prefilledUserData.projectsCompleted || '0'} className={readOnlyStyle} /></div>
                              <div><Label className={labelStyle}>Current Ongoing Projects</Label><input readOnly value={prefilledUserData.ongoingProjects || '0'} className={readOnlyStyle} /></div>
                            </div>
                          )}

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            {shouldShowForm2Field('yearOfIncorporation') && (<div><Label className={labelStyle}>Year of Incorporation *</Label><Input required value={bldForm2.yearOfIncorporation} onChange={(e) => setBldForm2({ ...bldForm2, yearOfIncorporation: e.target.value })} className={inputStyle} placeholder="YYYY" /></div>)}
                            {shouldShowForm2Field('totalSqftDelivered') && (<div><Label className={labelStyle}>Total Sqft Delivered *</Label><Input required value={bldForm2.totalSqftDelivered} onChange={(e) => setBldForm2({ ...bldForm2, totalSqftDelivered: e.target.value })} className={inputStyle} /></div>)}
                            {shouldShowForm2Field('promotersOrDirectors') && (<div className="md:col-span-2"><Label className={labelStyle}>Promoters / Directors *</Label><Textarea required value={bldForm2.promotersOrDirectors} onChange={(e) => setBldForm2({ ...bldForm2, promotersOrDirectors: e.target.value })} className={textareaStyle} /></div>)}
                            {shouldShowForm2Field('typeOfProjectsOffered') && (<div><Label className={labelStyle}>Type of Projects Offered *</Label><Input required value={bldForm2.typeOfProjectsOffered} onChange={(e) => setBldForm2({ ...bldForm2, typeOfProjectsOffered: e.target.value })} className={inputStyle} /></div>)}
                            {shouldShowForm2Field('experienceWithNriInvestors') && (
                              <div><Label className={labelStyle}>Experience with NRI *</Label>
                                <select required className={selectStyle} value={bldForm2.experienceWithNriInvestors} onChange={(e) => setBldForm2({ ...bldForm2, experienceWithNriInvestors: e.target.value })}>
                                  <option value="">Select</option>
                                  <option value="Yes">Yes</option>
                                  <option value="No">No</option>
                                </select>
                              </div>
                            )}
                            {shouldShowForm2Field('majorCompletedProjects') && (<div className="md:col-span-2"><Label className={labelStyle}>Major Completed Projects *</Label><Textarea required value={bldForm2.majorCompletedProjects} onChange={(e) => setBldForm2({ ...bldForm2, majorCompletedProjects: e.target.value })} className={textareaStyle} /></div>)}
                            {shouldShowForm2Field('companyOverview') && (<div className="md:col-span-2"><Label className={labelStyle}>Company Overview *</Label><Textarea required value={bldForm2.companyOverview} onChange={(e) => setBldForm2({ ...bldForm2, companyOverview: e.target.value })} className={textareaStyle} /></div>)}
                            {shouldShowForm2Field('outstandingDebt') && (
                              <div><Label className={labelStyle}>Outstanding Debt *</Label>
                                <select required className={selectStyle} value={bldForm2.outstandingDebt} onChange={(e) => setBldForm2({ ...bldForm2, outstandingDebt: e.target.value })}>
                                  <option value="">Select</option>
                                  <option value="High">High</option>
                                  <option value="Medium">Medium</option>
                                  <option value="Low">Low</option>
                                </select>
                              </div>
                            )}
                            {shouldShowForm2Field('declaredLitigationDisputes') && (<div className="md:col-span-2"><Label className={labelStyle}>Declared Litigation / Disputes</Label><Textarea value={bldForm2.declaredLitigationDisputes || ''} onChange={(e) => setBldForm2({ ...bldForm2, declaredLitigationDisputes: e.target.value })} className={textareaStyle} /></div>)}
                            {shouldShowForm2Field('financialOfCompany') && (<div className="md:col-span-2"><Label className={labelStyle}>Financials of Company (P&L Brief) *</Label><Textarea required value={bldForm2.financialOfCompany} onChange={(e) => setBldForm2({ ...bldForm2, financialOfCompany: e.target.value })} className={textareaStyle} /></div>)}
                            {shouldShowForm2Field('bankingPartners') && (<div className="md:col-span-2"><Label className={labelStyle}>Banking Partners *</Label><Input required value={bldForm2.bankingPartners} onChange={(e) => setBldForm2({ ...bldForm2, bankingPartners: e.target.value })} className={inputStyle} /></div>)}
                          </div>
                        </div>
                      </div>
                    )}

                    {isForm2UpdateMode && adminRequests.filter(req => !STANDARD_FIELDS.includes(typeof req === 'string' ? req : (req.id || req.fieldName))).map((req) => {
                      const id = typeof req === 'string' ? req : (req.id || req.fieldName);
                      return (
                        <div key={`custom-${id}`} className="space-y-1">
                          <Label className={labelStyle}>{id.replace(/([A-Z])/g, ' $1').trim()} *</Label>
                          <Input required type="text" value={getActiveData()[id] || ''} onChange={(e) => setActiveData({ ...getActiveData(), [id]: e.target.value })} className={inputStyle} placeholder={`Enter ${id.replace(/([A-Z])/g, ' $1').trim()}`} />
                        </div>
                      )
                    })}

                    <Button type="submit" className="w-full h-12 bg-[#ea580c] hover:bg-[#c2410c] text-white font-bold text-lg rounded-lg transition-all" disabled={loading}>
                      {loading ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Submitting...</> : <>Submit Final Details <ChevronRight className="ml-2 h-5 w-5" /></>}
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