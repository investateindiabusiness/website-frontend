"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/AuthContext';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { CheckCircle, ChevronRight, Loader2, TrendingUp, Building, UserCheck, FileWarning, ClipboardList, Gift, CalendarCheck2, Crown, Sparkles } from 'lucide-react';
import { getAuth, signOut } from 'firebase/auth';
import { app } from '@/firebase';
import { registerStep1, submitInvestorForm1, submitBuilderForm1, submitServiceProviderForm1, submitRequestedChanges, submitInvestorForm2, submitBuilderForm2, apiRequest } from '@/api';
import GoogleAuthButton from '@/components/GoogleAuthButton';

const RegisterDialog = ({ isOpen, onOpenChange, onLoginClick, initialData = {} }) => {
  const router = useRouter();
  const { login } = useAuth();

  const [step, setStep] = useState(1);
  const [userType, setUserType] = useState('investor');
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [launchConfig, setLaunchConfig] = useState(null);

  // Fetch launch configuration on mount
  useEffect(() => {
    apiRequest('/api/auth/launch-config')
      .then(data => { if (data?.success) setLaunchConfig(data); })
      .catch(() => {}); // non-critical, silently fail
  }, []);

  const [localInitialData, setLocalInitialData] = useState(initialData);

  useEffect(() => {
    if (isOpen) {
      setLocalInitialData(initialData);
    }
  }, [isOpen, initialData]);

  // --- Update Modes ---
  // --- CRITICAL FAIL-SAFE: Update Mode Auto-Detection ---
  const currentStatus = localInitialData?.userData?.onboardingStatus;
  const adminRequests = localInitialData?.adminRequests || localInitialData?.userData?.adminRequests || [];

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

  const isUpdateMode = localInitialData?.phase === 'CHANGES_REQUESTED' || currentStatus?.includes('changes_requested');

  // Force Form 2 update mode if the status is form2 OR if Form 2 fields are detected
  const isForm2UpdateMode = isUpdateMode && (currentStatus === 'form2_changes_requested' || hasForm2Requests);
  const isForm1UpdateMode = isUpdateMode && !isForm2UpdateMode;

  const isForm2Mode = localInitialData?.phase === 'FORM2_PENDING' || isForm2UpdateMode;

  const prefilledUserData = localInitialData?.userData || {};

  const [authData, setAuthData] = useState({ email: '', password: '', confirmPassword: '' });

  const [investorData, setInvestorData] = useState({
    fullName: '', contactNumber: '', investorType: '', investmentRangeMin: '', investmentRangeMax: '',
    address: '', country: '', state: '', city: '', zip: '', termsAccepted: false
  });

  const [builderData, setBuilderData] = useState({
    companyName: '', yearsOfExperience: '', contactNameAndDesignation: '', contactPersonPhone: '',
    ongoingProjects: '', projectsCompleted: '', address: '', country: '', state: '', city: '', zip: '', termsAccepted: false
  });

  const [serviceProviderData, setServiceProviderData] = useState({
    fullName: '', contactNumber: '', serviceCategory: '', yearsOfExperience: '',
    address: '', country: '', state: '', city: '', zip: '', termsAccepted: false
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

  const getActiveData = () => {
    if (userType === 'investor') return investorData;
    if (userType === 'builder') return builderData;
    return serviceProviderData;
  };
  const setActiveData = (data) => {
    if (userType === 'investor') setInvestorData(data);
    else if (userType === 'builder') setBuilderData(data);
    else setServiceProviderData(data);
  };

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
      if (localInitialData?.userType) setUserType(localInitialData.userType);

      if (localInitialData?.skipStep1 && localInitialData?.uid) {
        setUserId(localInitialData.uid);
        setAuthData(prev => ({ ...prev, email: localInitialData.email || '' }));

        if (isUpdateMode && localInitialData.userData) {
          const uData = localInitialData.userData;
          if (localInitialData.userType === 'investor') setInvestorData(prev => ({ ...prev, ...uData }));
          else if (localInitialData.userType === 'builder') setBuilderData(prev => ({ ...prev, ...uData }));
          else setServiceProviderData(prev => ({ ...prev, ...uData }));
        } else if (localInitialData.userType === 'investor' && !isForm2Mode) {
          setInvestorData(prev => ({ ...prev, fullName: localInitialData.name || '' }));
        } else if (localInitialData.userType === 'serviceProvider' && !isForm2Mode) {
          setServiceProviderData(prev => ({ ...prev, fullName: localInitialData.name || '' }));
        }

        if (isForm2Mode) {
          setStep(3);
          if (localInitialData.userData) {
            if (localInitialData.userType === 'investor') setInvForm2(prev => ({ ...prev, ...localInitialData.userData }));
            else setBldForm2(prev => ({ ...prev, ...localInitialData.userData }));
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
  }, [isOpen, localInitialData, isUpdateMode, isForm2Mode]);

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
    } else if (userType === 'builder') {
      return (
        builderData.companyName.trim() !== '' && builderData.yearsOfExperience.toString().trim() !== '' &&
        builderData.contactNameAndDesignation.trim() !== '' && builderData.contactPersonPhone.trim() !== '' &&
        builderData.country.trim() !== '' && builderData.state.trim() !== '' && builderData.city.trim() !== '' && builderData.termsAccepted
      );
    } else {
      return (
        serviceProviderData.fullName.trim() !== '' && serviceProviderData.contactNumber.trim() !== '' &&
        serviceProviderData.serviceCategory.trim() !== '' && serviceProviderData.yearsOfExperience.toString().trim() !== '' &&
        serviceProviderData.country.trim() !== '' && serviceProviderData.state.trim() !== '' && serviceProviderData.city.trim() !== '' && serviceProviderData.termsAccepted
      );
    }
  };

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    if (authData.password !== authData.confirmPassword) return toast({ title: "Error", description: "Passwords do not match", variant: "destructive" });
    try {
      setLoading(true);
      let response = await registerStep1({ email: authData.email, password: authData.password, role: userType });
<<<<<<< HEAD

=======
>>>>>>> 5627b10a2105b23a802352e1ccd8df8ffd4e1612
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
        setSubmitted(true);
      } else if (userType === 'investor') {
        await submitInvestorForm1(userId, currentData);
        setStep(3);
      } else if (userType === 'builder') {
        await submitBuilderForm1(userId, currentData);
        setStep(3);
      } else {
        await submitServiceProviderForm1(userId, currentData);
        setSubmitted(true);
      }
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

  const handleGoogleRegisterSuccess = (userData) => {
    login(userData);
    toast({ title: 'Login Successful', description: `Welcome back, ${userData.name || 'User'}!` });
    onOpenChange(false);

    if (userData.role === 'admin') router.push('/admin/dashboard');
    else if (userData.role === 'builder') router.push('/builder/dashboard');
    else router.push('/dashboard');
  };

  const handleGoogleRegisterError = (err) => {
    console.log("Register Google Auth Error:", err);

    const targetUserType = err.userType || userType;

    if (err.error === 'STEP2_PENDING') {
      toast({ title: 'Profile Incomplete', description: 'Please complete your profile details.' });
      setLocalInitialData({
        uid: err.uid,
        email: err.email,
        name: err.name,
        skipStep1: true,
        userType: targetUserType
      });
    } else if (err.error === 'CHANGES_REQUESTED') {
      toast({ title: 'Update Required', description: err.message });
      setLocalInitialData({
        uid: err.uid,
        userType: targetUserType,
        skipStep1: true,
        phase: 'CHANGES_REQUESTED',
        adminRequests: err.adminRequests,
        userData: err.userData
      });
    } else if (err.error === 'FORM2_PENDING') {
      toast({ title: 'Action Required', description: err.message });
      setLocalInitialData({
        uid: err.uid,
        userType: targetUserType,
        skipStep1: true,
        phase: 'FORM2_PENDING',
        userData: err.userData
      });
    } else if (err.error === 'ACCOUNT_UNDER_REVIEW') {
      toast({
        title: 'Account Under Review',
        description: 'Your account is currently under review by our administration team.',
        variant: 'destructive'
      });
    } else {
      toast({
        title: "Registration Failed",
        description: err.message || "Google registration failed",
        variant: "destructive"
      });
    }
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
      desc: isUpdateMode ? "Please update the requested fields to finalize your builder verification." : (isForm2Mode ? "Almost there! Complete the final details to finalize your builder account." : "Join our exclusive network of top-tier builders. Access global investors and streamline fundraising."),
      features: ["Verified Investor Network", "Automated Compliance", "Fast-track Funding"]
    },
    serviceProvider: {
      image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=2070&auto=format&fit=crop",
      title: isUpdateMode ? "Update your" : "Connect with builders",
      highlight: isUpdateMode ? "information." : "and investors.",
      desc: isUpdateMode ? "Please update the requested fields to finalize your service provider verification." : "Advertise your professional services to a global network of builders and investors.",
      features: ["Premium Client Acquisition", "Targeted Dashboard Ads", "Rigorously Vetted Platform"]
    }
  };

  const inputStyle = "h-10 px-4 bg-white border-gray-200 focus:bg-white focus:ring-2 focus:ring-orange-500/10 focus:border-orange-500 transition-all rounded-lg w-full";
  const selectStyle = "flex h-10 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/10 focus-visible:border-orange-500 disabled:opacity-50 transition-all";
  const textareaStyle = "min-h-[70px] px-4 py-3 bg-white border-gray-200 focus:bg-white focus:ring-2 focus:ring-orange-500/10 focus:border-orange-500 transition-all rounded-lg w-full";
  const readOnlyStyle = "h-10 px-4 bg-gray-100 border-gray-200 text-gray-500 rounded-lg w-full cursor-not-allowed";
  const labelStyle = "text-sm font-semibold text-gray-700 block mb-1.5";
  const sectionContainerStyle = "bg-white p-5 rounded-xl border border-gray-100 shadow-sm space-y-5";

  // --- CRITICAL FIX: Include ALL fields from both forms to ensure native UI logic catches them and they do not fall back to plain text inputs.
  const STANDARD_FIELDS = [
    'fullName', 'contactNumber', 'investorType', 'investmentRangeMin', 'investmentRangeMax', 'address', 'country', 'state', 'city', 'zip', 'termsAccepted',
    'companyName', 'yearsOfExperience', 'contactNameAndDesignation', 'contactPersonPhone', 'ongoingProjects', 'projectsCompleted', 'serviceCategory',
    'profession', 'yearlyIncome', 'investmentTenure', 'industryNatureOfWork', 'expectedReturns', 'preferredProjectType', 'preferredGoalStategy', 'investmentPreference',
    'yearOfIncorporation', 'promotersOrDirectors', 'totalSqftDelivered', 'majorCompletedProjects', 'typeOfProjectsOffered', 'companyOverview',
    'experienceWithNriInvestors', 'declaredLitigationDisputes', 'financialOfCompany', 'outstandingDebt', 'bankingPartners'
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="fixed left-1/2 top-[72px] -translate-x-1/2 translate-y-0 w-[95vw] md:max-w-[950px] p-0 overflow-hidden bg-white border-none shadow-[0_32px_64px_-15px_rgba(0,0,0,0.2)] flex flex-col lg:flex-row z-50 rounded-[2.5rem]" style={{ maxHeight: 'calc(100vh - 80px)' }}>

        <DialogTitle className="sr-only">
          {isUpdateMode ? 'Update Account' : 'Register Account'}
        </DialogTitle>
        <DialogDescription className="sr-only">
          {isUpdateMode ? 'Update your builder profile details.' : 'Create an account to join Investate India as an investor or builder.'}
        </DialogDescription>
        
        {/* Vertex Inspired Sidebar - High Key & Airy */}
        <div className="hidden lg:flex lg:w-[40%] relative bg-gray-50 flex-col justify-between p-8 lg:p-10 overflow-hidden transition-all duration-700">
          <div className="absolute inset-0 z-0">
            {/* Minimal overlay for text readability, but keeping image very clear */}
            <div className="absolute inset-0 bg-white/10 z-[1]" />
            <img 
              src={content[userType].image} 
              alt="bg" 
              className="absolute inset-0 w-full h-full object-cover opacity-[0.6] brightness-110 contrast-105 saturate-[1.1]" 
            />
            {/* Subtle Decorative Blobs */}
            <div className="absolute top-[-5%] right-[-5%] w-[40%] h-[20%] bg-orange-200/20 blur-[60px] rounded-full" />
          </div>

          <div className="relative z-20">
            <div className="inline-flex items-center gap-2 bg-orange-600 px-3 py-1 rounded-full mb-8 shadow-lg shadow-orange-600/20">
              <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Platform Registration</span>
            </div>
            <h1 className="text-4xl font-black mb-10 leading-[1.1] tracking-tight text-gray-900">
              {content[userType].title} <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-700">
                {content[userType].highlight}
              </span>
            </h1>

            {/* Repositioned Floating Chips */}
            <div className="relative h-56 mt-4 pointer-events-none">
               <div className="absolute top-[5%] left-[5%] px-3 py-1.5 bg-gray-900 rounded-full shadow-xl border border-gray-800 flex items-center gap-2 animate-float-slow">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.3)]" />
                  <span className="text-[8px] font-black text-white uppercase tracking-[0.2em]">Yield Focus</span>
               </div>
               <div className="absolute top-[20%] right-[8%] px-3 py-1.5 bg-white rounded-full shadow-xl border border-gray-100 flex items-center gap-2 animate-float">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.3)]" />
                  <span className="text-[8px] font-black text-gray-700 uppercase tracking-[0.2em]">Market Pulse</span>
               </div>
               <div className="absolute top-[45%] left-[0%] px-3 py-1.5 bg-white/90 backdrop-blur-md rounded-full shadow-xl border border-white/50 flex items-center gap-2 animate-float-sideways">
                  <div className="w-1.5 h-1.5 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.3)]" />
                  <span className="text-[8px] font-black text-gray-700 uppercase tracking-[0.2em]">Smart Assets</span>
               </div>
               <div className="absolute top-[35%] left-[55%] px-3 py-1.5 bg-gray-900 rounded-full shadow-xl border border-gray-800 flex items-center gap-2 animate-float-slow">
                  <div className="w-1.5 h-1.5 rounded-full bg-purple-400 shadow-[0_0_8px_rgba(192,132,252,0.3)]" />
                  <span className="text-[8px] font-black text-white uppercase tracking-[0.2em]">Secure Vault</span>
               </div>
               <div className="absolute top-[65%] right-[5%] px-3 py-1.5 bg-gray-900 rounded-full shadow-xl border border-gray-800 flex items-center gap-2 animate-float">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-400 shadow-[0_0_8px_rgba(248,113,113,0.3)]" />
                  <span className="text-[8px] font-black text-white uppercase tracking-[0.2em]">Verified</span>
               </div>
               <div className="absolute top-[85%] left-[15%] px-3 py-1.5 bg-white/95 rounded-full shadow-xl border border-gray-100 flex items-center gap-2 animate-float-slow">
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.3)]" />
                  <span className="text-[8px] font-black text-gray-700 uppercase tracking-[0.2em]">Growth Intel</span>
               </div>
               <div className="absolute top-[72%] left-[48%] px-3 py-1.5 bg-white rounded-full shadow-xl border border-gray-100 flex items-center gap-2 animate-float-sideways">
                  <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.3)]" />
                  <span className="text-[8px] font-black text-gray-700 uppercase tracking-[0.2em]">ROI Optimized</span>
               </div>
            </div>

            {/* Description & Points Commented Out */}
            {/* 
            <p className="text-base text-gray-500 mb-8 leading-relaxed font-medium max-w-sm">{content[userType].desc}</p>
            */}
          </div>

          <div className="relative z-20 space-y-5">
            <div className="pt-8 border-t border-black/5 flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-9 h-9 rounded-full border-2 border-white bg-gray-200 overflow-hidden shadow-sm">
                      <img src={`https://i.pravatar.cc/100?img=${i + 20}`} alt="user" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
                <div className="flex flex-col">
                  <p className="text-[10px] font-black text-gray-900 uppercase tracking-widest">Trusted Community</p>
<<<<<<< HEAD
                  <p className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">Join 2,500+ Active Professionals</p>
=======
                  <p className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">
                    {userType === 'investor' 
                      ? 'Join our growing NRI investor community' 
                      : userType === 'builder' 
                        ? 'Join our growing network of builders' 
                        : 'Join our growing network of professionals'}
                  </p>
>>>>>>> 5627b10a2105b23a802352e1ccd8df8ffd4e1612
                </div>
              </div>
              <p className="text-[10px] text-gray-500 font-medium leading-tight max-w-[240px]">
                "The most transparent real estate investment platform I've used in years."
              </p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto relative custom-scrollbar bg-white flex flex-col">
          <div className="flex-1 p-6 md:px-12 lg:px-14 py-8 md:py-10 flex flex-col justify-center">
            {submitted ? (
              <div className="text-center py-4 animate-in zoom-in duration-500 space-y-6">
                {/* Success Icon */}
                <div className="bg-green-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto shadow-inner">
                  <CheckCircle className="h-10 w-10 text-green-500" />
                </div>

                <div>
                  <h2 className="text-3xl font-black text-gray-900 mb-2 tracking-tight">
                    {isUpdateMode ? 'Update Submitted!' : 'Welcome Aboard! 🎉'}
                  </h2>
                  <p className="text-gray-500 max-w-sm mx-auto text-sm leading-relaxed">
                    {isUpdateMode
                      ? "Your changes have been sent to our administration team for final review."
                      : isForm2Mode
                        ? "Your final details have been sent to our administration team. We will activate your account shortly."
                        : "Your initial details have been submitted. We will notify you once approved."}
                  </p>
                </div>

                {/* Free Trial Info Card — only shown on new registration */}
                {!isUpdateMode && launchConfig && (
                  <div className="mx-auto max-w-xs bg-gradient-to-br from-[#0b264f] to-[#1a4b8c] text-white rounded-2xl p-5 shadow-xl space-y-4">
                    {/* Premium Badge */}
                    <div className="flex items-center justify-center gap-2 bg-white/15 rounded-full px-3 py-1.5 w-fit mx-auto">
                      <Crown className="w-4 h-4 text-yellow-300" />
                      <span className="text-xs font-black uppercase tracking-widest text-yellow-200">1 Year Free Premium</span>
                    </div>

                    {/* Date of Joining */}
                    <div className="flex items-start gap-3 bg-white/10 rounded-xl p-3">
                      <div className="bg-white/20 p-2 rounded-lg flex-shrink-0">
                        <CalendarCheck2 className="w-4 h-4 text-white" />
                      </div>
                      <div className="text-left">
                        <p className="text-white/60 text-[10px] font-bold uppercase tracking-wider">Date of Joining</p>
                        <p className="text-white font-black text-sm">{new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
                      </div>
                    </div>

                    {/* Free Trial Expiry */}
                    <div className="flex items-start gap-3 bg-white/10 rounded-xl p-3">
                      <div className="bg-orange-500/50 p-2 rounded-lg flex-shrink-0">
                        <Gift className="w-4 h-4 text-orange-200" />
                      </div>
                      <div className="text-left">
                        <p className="text-white/60 text-[10px] font-bold uppercase tracking-wider">Free Trial Valid Till</p>
                        <p className="text-orange-200 font-black text-sm">
                          {new Date(launchConfig.freeTrialExpiryDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 bg-white/10 rounded-xl p-3">
                      <Sparkles className="w-4 h-4 text-yellow-300 flex-shrink-0" />
                      <p className="text-[11px] text-white/80 font-semibold text-left leading-snug">
                        Enjoy all <span className="text-yellow-300 font-black">premium features</span> for free for 1 year from the product launch date.
                      </p>
                    </div>
                  </div>
                )}

                <Button
                  onClick={() => { onOpenChange(false); onLoginClick(); }}
                  className="bg-gray-900 hover:bg-black px-10 py-6 text-base font-black rounded-[1.25rem] shadow-2xl shadow-black/10 transition-all hover:scale-105 active:scale-95"
                >
                  Return to Login
                </Button>
              </div>
            ) : (
              <div className="w-full max-w-lg mx-auto">
                <div className="text-center mb-6">
                   <h2 className="text-2xl font-black tracking-tight text-gray-900 uppercase">
                      {step === 1 ? (userType === 'investor' ? "Investor Registration" : "Builder Registration") : step === 2 ? "Basic Details" : "Verification"}
                   </h2>
                   <p className="text-gray-400 font-bold mt-1 tracking-wide uppercase text-[9px]">Step 0{step}</p>
                </div>

                {step === 1 && (
                  <div className="space-y-6 animate-in slide-in-from-bottom-6 duration-500">
                    <GoogleAuthButton onSuccess={handleGoogleRegisterSuccess} onError={handleGoogleRegisterError} text="Continue with Google" userType={userType} />
                    
                    <div className="relative py-2">
                      <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-gray-100" /></div>
                      <div className="relative flex justify-center text-[9px] font-black uppercase tracking-[0.3em]"><span className="bg-white px-6 text-gray-400">Security Check</span></div>
                    </div>

                    <form onSubmit={handleAuthSubmit} className="space-y-5">
                      <div className="space-y-2">
                        <Label className="text-[10px] font-black text-gray-900 uppercase tracking-widest ml-1">{userType === 'investor' ? 'Email Address' : 'Professional Email'}</Label>
                        <Input type="email" name='email' autoComplete="off" required value={authData.email} onChange={(e) => setAuthData({ ...authData, email: e.target.value })} className="h-11 px-6 bg-gray-50 border-gray-200 focus:bg-white focus:ring-[6px] focus:ring-orange-500/5 focus:border-orange-500 transition-all duration-300 rounded-2xl text-sm font-bold placeholder:text-gray-300" placeholder="name@example.com" />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-[10px] font-black text-gray-900 uppercase tracking-widest ml-1">Password</Label>
                          <Input type="password" autoComplete="new-password" required value={authData.password} onChange={(e) => setAuthData({ ...authData, password: e.target.value })} className="h-11 px-6 bg-gray-50 border-gray-200 focus:bg-white focus:ring-[6px] focus:ring-orange-500/5 focus:border-orange-500 transition-all duration-300 rounded-2xl text-sm font-bold placeholder:text-gray-300" placeholder="••••••••" />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-[10px] font-black text-gray-900 uppercase tracking-widest ml-1">Confirm Password</Label>
                          <Input type="password" autoComplete="new-password" required value={authData.confirmPassword} onChange={(e) => setAuthData({ ...authData, confirmPassword: e.target.value })} className="h-11 px-6 bg-gray-50 border-gray-200 focus:bg-white focus:ring-[6px] focus:ring-orange-500/5 focus:border-orange-500 transition-all duration-300 rounded-2xl text-sm font-bold placeholder:text-gray-300" placeholder="••••••••" />
                        </div>
                      </div>
                      <Button 
                        type="submit" 
                        className="w-full h-12 bg-gray-900 hover:bg-black text-white font-black text-base rounded-[1.25rem] mt-4 shadow-2xl shadow-black/10 transition-all hover:scale-[1.02] active:scale-[0.98]" 
                        disabled={loading}
                      >
                        {loading ? <Loader2 className="mr-2 h-6 w-6 animate-spin" /> : <div className="flex items-center justify-center gap-3 text-sm uppercase tracking-wider">Register <ChevronRight className="h-5 w-5" /></div>}
                      </Button>
                      
                      <p className="text-center text-[10px] font-bold text-gray-400 uppercase tracking-widest pt-2">
                        Member? <button type="button" onClick={onLoginClick} className="text-orange-600 hover:text-orange-700 font-black underline underline-offset-4 decoration-2">Sign In</button>
                      </p>
                    </form>
                  </div>
                )}

                {step === 2 && (
                  <form onSubmit={handleProfileSubmit} className="space-y-8 animate-in slide-in-from-bottom-6 duration-500">
                    {isForm1UpdateMode && (
                      <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl font-bold text-sm flex items-center gap-4">
                        <FileWarning className="w-6 h-6 flex-shrink-0" />
                        <span>Action Required: The admin team has requested changes to specific fields.</span>
                      </div>
                    )}

                    {/* INVESTOR FORM 1 */}
                    {userType === 'investor' && (
                      <div className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                              <div className="flex gap-4">
                                {shouldShowField('investmentRangeMin') && <Input type="text" placeholder="Min value" value={investorData.investmentRangeMin} onChange={(e) => setInvestorData({ ...investorData, investmentRangeMin: e.target.value.replace(/\D/g, '') })} className={inputStyle} />}
                                {shouldShowField('investmentRangeMax') && <Input type="text" placeholder="Max value" value={investorData.investmentRangeMax} onChange={(e) => setInvestorData({ ...investorData, investmentRangeMax: e.target.value.replace(/\D/g, '') })} className={inputStyle} />}
                              </div>
                            </div>
                          )}
                        </div>
                        {(shouldShowField('address') || shouldShowField('country') || shouldShowField('zip') || shouldShowField('state') || shouldShowField('city')) && (
                          <div className="space-y-6 pt-4 border-t border-gray-100">
                            <Label className="text-xs font-black text-gray-900 uppercase tracking-widest block mb-4">Location Details</Label>
                            <div className="grid grid-cols-1 gap-6">
                              {shouldShowField('address') && (<div><Label className={labelStyle}>Mailing Address</Label><Input value={investorData.address} onChange={(e) => setInvestorData({ ...investorData, address: e.target.value })} className={inputStyle} /></div>)}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                        <div className="grid grid-cols-1 gap-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {shouldShowField('companyName') && (<div><Label className={labelStyle}>Entity Name *</Label><Input required value={builderData.companyName} onChange={(e) => setBuilderData({ ...builderData, companyName: e.target.value })} className={inputStyle} /></div>)}
                            {shouldShowField('yearsOfExperience') && (<div><Label className={labelStyle}>Track Record (Years) *</Label><Input type="text" required value={builderData.yearsOfExperience} onChange={(e) => setBuilderData({ ...builderData, yearsOfExperience: e.target.value.replace(/\D/g, '') })} placeholder="e.g. 10" className={inputStyle} /></div>)}
                          </div>
                          {(shouldShowField('contactNameAndDesignation') || shouldShowField('contactPersonPhone')) && (
                            <div className={isForm1UpdateMode ? "" : sectionContainerStyle}>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {shouldShowField('contactNameAndDesignation') && (<div><Label className={labelStyle}>Liaison Name & Role *</Label><Input required value={builderData.contactNameAndDesignation} onChange={(e) => setBuilderData({ ...builderData, contactNameAndDesignation: e.target.value })} className={inputStyle} /></div>)}
                                {shouldShowField('contactPersonPhone') && (<div><Label className={labelStyle}>Direct Phone *</Label><Input required value={builderData.contactPersonPhone} onChange={(e) => setBuilderData({ ...builderData, contactPersonPhone: e.target.value.replace(/\D/g, '') })} className={inputStyle} /></div>)}
                              </div>
                            </div>
                          )}
                          {(shouldShowField('ongoingProjects') || shouldShowField('projectsCompleted')) && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              {shouldShowField('ongoingProjects') && (<div><Label className={labelStyle}>Active Projects</Label><Input type="text" value={builderData.ongoingProjects} onChange={(e) => setBuilderData({ ...builderData, ongoingProjects: e.target.value })} className={inputStyle} /></div>)}
                              {shouldShowField('projectsCompleted') && (<div><Label className={labelStyle}>Total Deliveries</Label><Input type="text" value={builderData.projectsCompleted} onChange={(e) => setBuilderData({ ...builderData, projectsCompleted: e.target.value })} className={inputStyle} /></div>)}
                            </div>
                          )}
                          {(shouldShowField('address') || shouldShowField('country') || shouldShowField('zip') || shouldShowField('state') || shouldShowField('city')) && (
                            <div className="space-y-6 pt-4 border-t border-gray-100">
                              <Label className="text-xs font-black text-gray-900 uppercase tracking-widest block mb-4">Corporate Office</Label>
                              <div className="grid grid-cols-1 gap-6">
                                {shouldShowField('address') && (<div><Label className={labelStyle}>Full Address</Label><Input value={builderData.address} onChange={(e) => setBuilderData({ ...builderData, address: e.target.value })} className={inputStyle} /></div>)}
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

                    {/* SERVICE PROVIDER FORM 1 */}
                    {userType === 'serviceProvider' && (
                      <div className="space-y-8 animate-in slide-in-from-bottom-6 duration-500">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {shouldShowField('fullName') && (
                            <div>
                              <Label className={labelStyle}>Full Name / Entity Name *</Label>
                              <Input required value={serviceProviderData.fullName} onChange={(e) => setServiceProviderData({ ...serviceProviderData, fullName: e.target.value })} placeholder="Full name / Entity name" className={inputStyle} />
                            </div>
                          )}
                          {shouldShowField('contactNumber') && (
                            <div>
                              <Label className={labelStyle}>Contact Number *</Label>
                              <Input required value={serviceProviderData.contactNumber} onChange={(e) => setServiceProviderData({ ...serviceProviderData, contactNumber: e.target.value.replace(/\D/g, '') })} placeholder="Contact number" className={inputStyle} />
                            </div>
                          )}
                          {shouldShowField('serviceCategory') && (
                            <div>
                              <Label className={labelStyle}>Service Category *</Label>
                              <select required className={selectStyle} value={serviceProviderData.serviceCategory} onChange={(e) => setServiceProviderData({ ...serviceProviderData, serviceCategory: e.target.value })}>
                                <option value="">Select Category</option>
                                <option value="Lawyers">Lawyers</option>
                                <option value="Real Estate Consultants">Real Estate Consultants</option>
                                <option value="Real Estate Agents / Brokers">Real Estate Agents / Brokers</option>
                                <option value="Chartered Accountants">Chartered Accountants</option>
                                <option value="Tax Consultants">Tax Consultants</option>
                                <option value="Financial Advisors">Financial Advisors</option>
                                <option value="Mortgage Consultants">Mortgage Consultants</option>
                                <option value="Banks / Financial Institutions">Banks / Financial Institutions</option>
                                <option value="Insurance Providers">Insurance Providers</option>
                                <option value="Property Management Companies">Property Management Companies</option>
                                <option value="Interior Designers">Interior Designers</option>
                                <option value="Architects">Architects</option>
                                <option value="Civil Contractors">Civil Contractors</option>
                                <option value="Home Loan Consultants">Home Loan Consultants</option>
                                <option value="Property Valuation Experts">Property Valuation Experts</option>
                                <option value="Immigration Consultants">Immigration Consultants</option>
                                <option value="Other Professional Services">Other Professional Services</option>
                              </select>
                            </div>
                          )}
                          {shouldShowField('yearsOfExperience') && (
                            <div>
                              <Label className={labelStyle}>Years of Experience *</Label>
                              <Input required value={serviceProviderData.yearsOfExperience} onChange={(e) => setServiceProviderData({ ...serviceProviderData, yearsOfExperience: e.target.value.replace(/\D/g, '') })} placeholder="e.g. 5" className={inputStyle} />
                            </div>
                          )}
                        </div>

                        {(shouldShowField('address') || shouldShowField('country') || shouldShowField('zip') || shouldShowField('state') || shouldShowField('city')) && (
                          <div className="space-y-6 pt-4 border-t border-gray-100">
                            <Label className="text-xs font-black text-gray-900 uppercase tracking-widest block mb-4">Location Details</Label>
                            <div className="grid grid-cols-1 gap-6">
                              {shouldShowField('address') && (
                                <div>
                                  <Label className={labelStyle}>Full Address</Label>
                                  <Input value={serviceProviderData.address} onChange={(e) => setServiceProviderData({ ...serviceProviderData, address: e.target.value })} className={inputStyle} />
                                </div>
                              )}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              {shouldShowField('country') && (
                                <div>
                                  <Label className={labelStyle}>Country *</Label>
                                  <select required className={selectStyle} value={serviceProviderData.country} onChange={handleCountryChange}>
                                    <option value="">Select Country</option>
                                    {countries.map((c) => <option key={c.name} value={c.name}>{c.name}</option>)}
                                  </select>
                                </div>
                              )}
                              {shouldShowField('zip') && (
                                <div>
                                  <Label className={labelStyle}>{addressLabels.zip}</Label>
                                  <Input value={serviceProviderData.zip} onChange={(e) => setServiceProviderData({ ...serviceProviderData, zip: e.target.value })} className={inputStyle} />
                                </div>
                              )}
                              {shouldShowField('state') && (
                                <div>
                                  <Label className={labelStyle}>{addressLabels.state} *</Label>
                                  <select required className={selectStyle} value={serviceProviderData.state} onChange={handleStateChange} disabled={!serviceProviderData.country}>
                                    <option value="">{loadingLocation ? "Loading..." : `Select ${addressLabels.state}`}</option>
                                    {states.map((s) => <option key={s.name} value={s.name}>{s.name}</option>)}
                                  </select>
                                </div>
                              )}
                              {shouldShowField('city') && (
                                <div>
                                  <Label className={labelStyle}>City *</Label>
                                  <select required className={selectStyle} value={serviceProviderData.city} onChange={(e) => setServiceProviderData({ ...serviceProviderData, city: e.target.value })} disabled={!serviceProviderData.state}>
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

                    {isForm1UpdateMode && adminRequests.filter(req => !STANDARD_FIELDS.includes(typeof req === 'string' ? req : (req.id || req.fieldName))).map((req) => {
                      const id = typeof req === 'string' ? req : (req.id || req.fieldName);
                      return (
                        <div key={`custom-${id}`} className="space-y-1">
                          <Label className={labelStyle}>{id.replace(/([A-Z])/g, ' $1').trim()} *</Label>
                          <Input required type="text" value={getActiveData()[id] || ''} onChange={(e) => setActiveData({ ...getActiveData(), [id]: e.target.value })} className={inputStyle} placeholder={`Enter ${id.replace(/([A-Z])/g, ' $1').trim()}`} />
                        </div>
                      )
                    })}

                    <div className="h-px bg-gray-100 w-full mt-10 mb-8" />

                    <div className="flex items-start space-x-5 p-6 bg-orange-50/20 border border-orange-100/50 rounded-2xl">
                      <Checkbox id="terms" checked={getActiveData().termsAccepted} onCheckedChange={(checked) => setActiveData({ ...getActiveData(), termsAccepted: checked })} className="data-[state=checked]:bg-orange-600 border-orange-200 mt-1" />
                      <Label htmlFor="terms" className="text-sm font-bold text-gray-500 leading-relaxed cursor-pointer">
                        I verify all data provided is accurate and agree to the <span className="text-orange-600 font-black hover:underline underline-offset-2">Platform Policies</span>.
                      </Label>
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full h-14 bg-gray-900 hover:bg-black text-white font-black text-lg rounded-[1.25rem] shadow-2xl shadow-black/10 disabled:bg-gray-200 disabled:shadow-none transition-all hover:scale-[1.02] active:scale-[0.98] mt-6" 
                      disabled={loading || !isProfileFormValid()}
                    >
                      {loading ? <Loader2 className="mr-2 h-6 w-6 animate-spin" /> : (isForm1UpdateMode ? 'Update Account' : 'Initialize Verification')}
                    </Button>
                  </form>
                )}

                {/* --- FORM 2 --- */}
                {step === 3 && (
                  <form onSubmit={handleForm2Submit} className="space-y-8 animate-in slide-in-from-bottom-6 duration-500">
                    {isForm2UpdateMode ? (
                      <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl flex items-center gap-4 font-bold text-sm">
                        <FileWarning className="w-6 h-6 flex-shrink-0" />
                        <span>Action Required: Please update the requested fields below.</span>
                      </div>
                    ) : (
                      <div className="p-6 bg-blue-50 border border-blue-100 rounded-2xl flex gap-5">
                        <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                          <ClipboardList className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-black text-blue-900 text-sm uppercase tracking-wider">Final Step</p>
                          <p className="text-sm text-blue-700 mt-1 font-medium">Please provide these details to complete your professional profile.</p>
                        </div>
                      </div>
                    )}

                    {userType === 'investor' && (
                      <div className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {(!isForm2UpdateMode) && (
                            <>
                              <div><Label className={labelStyle}>Full Name</Label><input readOnly value={prefilledUserData.fullName || ''} className={readOnlyStyle} /></div>
                              <div><Label className={labelStyle}>Location</Label><input readOnly value={`${prefilledUserData.city || ''}, ${prefilledUserData.state || ''}`} className={readOnlyStyle} /></div>
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
                          {shouldShowForm2Field('industryNatureOfWork') && (<div><Label className={labelStyle}>Primary Industry *</Label><Input required value={invForm2.industryNatureOfWork} onChange={(e) => setInvForm2({ ...invForm2, industryNatureOfWork: e.target.value })} className={inputStyle} /></div>)}
                          {shouldShowForm2Field('yearlyIncome') && (
                            <div><Label className={labelStyle}>Annual Income *</Label>
                              <Input required type="text" value={invForm2.yearlyIncome} onChange={(e) => {
                                const validNumber = e.target.value.replace(/\D/g, '').replace(/^0+/, '');
                                setInvForm2({ ...invForm2, yearlyIncome: validNumber });
                              }} className={inputStyle} placeholder="e.g. 1500000" />
                            </div>
                          )}
                          {shouldShowForm2Field('investmentTenure') && (
                            <div><Label className={labelStyle}>Target Tenure *</Label>
                              <select required className={selectStyle} value={invForm2.investmentTenure} onChange={(e) => setInvForm2({ ...invForm2, investmentTenure: e.target.value })}>
                                <option value="">Select Tenure</option>
                                <option value="1-3 Years">1 - 3 Years</option>
                                <option value="3-5 Years">3 - 5 Years</option>
                                <option value="5+ Years">5+ Years</option>
                              </select>
                            </div>
                          )}
                          {shouldShowForm2Field('expectedReturns') && (<div><Label className={labelStyle}>Return Expectations *</Label><Input required value={invForm2.expectedReturns} onChange={(e) => setInvForm2({ ...invForm2, expectedReturns: e.target.value })} className={inputStyle} placeholder="e.g. 15%" /></div>)}
                          {shouldShowForm2Field('preferredGoalStategy') && (
                            <div><Label className={labelStyle}>Primary Strategy *</Label>
                              <select required className={selectStyle} value={invForm2.preferredGoalStategy} onChange={(e) => setInvForm2({ ...invForm2, preferredGoalStategy: e.target.value })}>
                                <option value="">Select Strategy</option>
                                <option value="Buy & Hold">Buy & Hold (Long-term Appreciation)</option>
                                <option value="Buy & Resell">Buy & Resell (Short-term Gains)</option>
                                <option value="Buy & Lease">Buy & Lease (Rental Income)</option>
                                <option value="Mix of Appreciation & Rental">Mix of Appreciation & Rental</option>
                                <option value="Open to Suggestions">Open to Suggestions</option>
                              </select>
                            </div>
                          )}
                          {shouldShowForm2Field('preferredProjectType') && (
                            <div className="md:col-span-2"><Label className={labelStyle}>Portfolio Interest *</Label>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2 p-5 border border-gray-100 rounded-2xl bg-gray-50/50">
                                {['Plots / Land', 'Villa', 'Apartments / Flats', 'Commercial Spaces', 'Farm Land / Agri Projects', 'Open to All'].map((type) => (
                                  <div key={type} className="flex items-center space-x-4">
                                    <Checkbox id={`proj-${type.replace(/\s+/g, '-')}`} checked={(invForm2.preferredProjectType || []).includes(type)} onCheckedChange={() => handleProjectTypeToggle(type)} className="data-[state=checked]:bg-orange-600 border-gray-300" />
                                    <Label htmlFor={`proj-${type.replace(/\s+/g, '-')}`} className="text-sm font-bold text-gray-600 cursor-pointer">{type}</Label>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                          {shouldShowForm2Field('investmentPreference') && (
                            <div className="md:col-span-2"><Label className={labelStyle}>Support Requirement *</Label>
                              <select required className={selectStyle} value={invForm2.investmentPreference} onChange={(e) => setInvForm2({ ...invForm2, investmentPreference: e.target.value })}>
                                <option value="">Select Level</option>
                                <option value="Browse curated investment opportunities on my own">I prefer self-managed browsing</option>
                                <option value="Get recommendations according to my needs from an executive">I want dedicated advisor assistance</option>
                              </select>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {userType === 'builder' && (
                      <div className="space-y-8">
                        <div className="grid grid-cols-1 gap-8">
                          {(!isForm2UpdateMode) && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-gray-50 rounded-[2rem] border border-gray-100">
                              <div><Label className={labelStyle}>Entity</Label><input readOnly value={prefilledUserData.companyName || ''} className={readOnlyStyle} /></div>
                              <div><Label className={labelStyle}>Liaison</Label><input readOnly value={prefilledUserData.contactNameAndDesignation || ''} className={readOnlyStyle} /></div>
                            </div>
                          )}

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {shouldShowForm2Field('yearOfIncorporation') && (<div><Label className={labelStyle}>Est. Year *</Label><Input required value={bldForm2.yearOfIncorporation} onChange={(e) => setBldForm2({ ...bldForm2, yearOfIncorporation: e.target.value })} className={inputStyle} placeholder="YYYY" /></div>)}
                            {shouldShowForm2Field('totalSqftDelivered') && (<div><Label className={labelStyle}>Delivery Volume (Sqft) *</Label><Input required value={bldForm2.totalSqftDelivered} onChange={(e) => setBldForm2({ ...bldForm2, totalSqftDelivered: e.target.value })} className={inputStyle} /></div>)}
                            {shouldShowForm2Field('promotersOrDirectors') && (<div className="md:col-span-2"><Label className={labelStyle}>Governance (Promoters / Directors) *</Label><Textarea required value={bldForm2.promotersOrDirectors} onChange={(e) => setBldForm2({ ...bldForm2, promotersOrDirectors: e.target.value })} className={textareaStyle} /></div>)}
                            {shouldShowForm2Field('typeOfProjectsOffered') && (<div><Label className={labelStyle}>Specialization *</Label><Input required value={bldForm2.typeOfProjectsOffered} onChange={(e) => setBldForm2({ ...bldForm2, typeOfProjectsOffered: e.target.value })} className={inputStyle} /></div>)}
                            {shouldShowForm2Field('experienceWithNriInvestors') && (
                              <div><Label className={labelStyle}>NRI Client Exposure *</Label>
                                <select required className={selectStyle} value={bldForm2.experienceWithNriInvestors} onChange={(e) => setBldForm2({ ...bldForm2, experienceWithNriInvestors: e.target.value })}>
                                  <option value="">Select</option>
                                  <option value="Yes">Yes</option>
                                  <option value="No">No</option>
                                </select>
                              </div>
                            )}
                            {shouldShowForm2Field('majorCompletedProjects') && (<div className="md:col-span-2"><Label className={labelStyle}>Key Portfolio Highlights *</Label><Textarea required value={bldForm2.majorCompletedProjects} onChange={(e) => setBldForm2({ ...bldForm2, majorCompletedProjects: e.target.value })} className={textareaStyle} /></div>)}
                            {shouldShowForm2Field('companyOverview') && (<div className="md:col-span-2"><Label className={labelStyle}>Corporate Profile *</Label><Textarea required value={bldForm2.companyOverview} onChange={(e) => setBldForm2({ ...bldForm2, companyOverview: e.target.value })} className={textareaStyle} /></div>)}
                            {shouldShowForm2Field('outstandingDebt') && (
                              <div><Label className={labelStyle}>Leverage Level *</Label>
                                <select required className={selectStyle} value={bldForm2.outstandingDebt} onChange={(e) => setBldForm2({ ...bldForm2, outstandingDebt: e.target.value })}>
                                  <option value="">Select Level</option>
                                  <option value="High">High</option>
                                  <option value="Medium">Medium</option>
                                  <option value="Low">Low</option>
                                </select>
                              </div>
                            )}
                            {shouldShowForm2Field('declaredLitigationDisputes') && (<div className="md:col-span-2"><Label className={labelStyle}>Disclosure (Litigation / Disputes)</Label><Textarea value={bldForm2.declaredLitigationDisputes || ''} onChange={(e) => setBldForm2({ ...bldForm2, declaredLitigationDisputes: e.target.value })} className={textareaStyle} /></div>)}
                            {shouldShowForm2Field('financialOfCompany') && (<div className="md:col-span-2"><Label className={labelStyle}>Financial Brief (P&L Highlights) *</Label><Textarea required value={bldForm2.financialOfCompany} onChange={(e) => setBldForm2({ ...bldForm2, financialOfCompany: e.target.value })} className={textareaStyle} /></div>)}
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

                    <Button 
                      type="submit" 
                      className="w-full h-16 bg-gray-900 hover:bg-black text-white font-black text-lg rounded-[1.25rem] shadow-2xl shadow-black/10 transition-all hover:scale-[1.02] active:scale-[0.98] mt-8" 
                      disabled={loading}
                    >
                      {loading ? <><Loader2 className="mr-2 h-6 w-6 animate-spin" /> Finalizing...</> : <div className="flex items-center justify-center gap-3 text-lg uppercase tracking-wider">Finalize Onboarding <ChevronRight className="h-6 w-6" /></div>}
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