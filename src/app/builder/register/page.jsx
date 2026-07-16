"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { CheckCircle, ChevronRight, Loader2, FileWarning, ClipboardList, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { getAuth } from 'firebase/auth';
import { app } from '@/firebase';
import { registerStep1, sendOtp, submitBuilderForm1, submitRequestedChanges, submitBuilderForm2, loginRequest, googleSyncRequest } from '@/api';
import MultiSelect from '@/components/ui/MultiSelect';
import GoogleAuthButton from '@/components/GoogleAuthButton';

const PROJECT_CATEGORY_TYPES = {
  "Residential": ["Apartments", "Villas", "Luxury Homes", "Senior Living", "Holiday & Farm Houses"],
  "Commercial": ["Office Spaces", "Retail Shops", "Shopping Malls", "Co-working Spaces", "IT Parks"],
  "Land & Plots": ["Residential Plots", "Villa Plots", "Farm Plots", "Commercial Plots", "Agricultural Land"],
  "Industrial & Warehousing": ["Warehouses", "Industrial Parks", "Industrial Plots", "Cold Storage"],
  "Hospitality": ["Hotels & Resorts"]
};

const PROJECT_STAGES = [
  "Pre-Launch", "New Launch", "Under Construction", "Ready to Occupy", "Completed"
];

const CAPITAL_REQUIREMENTS = [
  "Project Marketing", "Investor Partnerships", "Equity Capital", "Project Finance", "Pre-Sales Support", "Joint Venture", "Strategic Partnership"
];

function BuilderRegisterContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, user, loading: authLoading } = useAuth();

  const [step, setStep] = useState(1);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [onboardingInitData, setOnboardingInitData] = useState(null);

  // Form states
  const [authData, setAuthData] = useState({ email: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [builderData, setBuilderData] = useState({
    companyName: '', yearsOfExperience: '',
    contactName: '', contactPersonRole: '', contactPersonRoleOther: '',
    contactPersonPhone: '', companyEmail: '',
    ongoingProjects: '',
    projectCategories: [],
    projectTypes: [],
    projectStages: [],
    capitalRequirements: [],
    projectsCompleted: '', aboutYourself: '',
    address: '', country: '', state: '', city: '', zip: '', termsAccepted: false
  });
  const [bldForm2, setBldForm2] = useState({
    yearOfIncorporation: '', promotersOrDirectors: '', totalSqftDelivered: '', majorCompletedProjects: '', typeOfProjectsOffered: '', companyOverview: '', experienceWithNriInvestors: '', declaredLitigationDisputes: '', financialOfCompany: '', outstandingDebt: '', bankingPartners: ''
  });

  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [loadingLocation, setLoadingLocation] = useState(false);

  // Parse parameters from query & sessionStorage
  useEffect(() => {
    // 1. Fetch countries API
    fetch('https://countriesnow.space/api/v0.1/countries/iso')
      .then(res => res.json())
      .then(data => { if (!data.error) setCountries(data.data || []); })
      .catch(console.error);

    // 2. Read query params and initialization data from sessionStorage
    const queryUid = searchParams.get('uid');
    const queryEmail = searchParams.get('email');
    const queryName = searchParams.get('name');
    const querySkipStep1 = searchParams.get('skipStep1') === 'true';
    const queryPhase = searchParams.get('phase');

    let initData = null;
    if (typeof window !== 'undefined') {
      const stored = sessionStorage.getItem('onboarding_init_data');
      if (stored) {
        try {
          initData = JSON.parse(stored);
          setOnboardingInitData(initData);
          sessionStorage.removeItem('onboarding_init_data'); // Clear it
        } catch (e) {
          console.error("Error parsing onboarding init data", e);
        }
      }
    }

    if (queryUid || initData?.uid) {
      const targetUid = queryUid || initData?.uid;
      setUserId(targetUid);

      const targetEmail = queryEmail || initData?.email || initData?.userData?.email;
      if (targetEmail) setAuthData(prev => ({ ...prev, email: targetEmail }));

      const targetName = queryName || initData?.name || initData?.userData?.contactNameAndDesignation;

      const uData = initData?.userData || {};
      setBuilderData(prev => ({
        ...prev,
        ...uData,
        contactName: targetName || uData.contactName || prev.contactName
      }));

      if (queryPhase === 'FORM2_PENDING' || initData?.phase === 'FORM2_PENDING' || uData.onboardingStatus === 'form2_changes_requested') {
        setStep(3);
        if (uData) setBldForm2(prev => ({ ...prev, ...uData }));
      } else if (querySkipStep1 || initData?.skipStep1) {
        setStep(2);
      }
    }
  }, [searchParams]);

  // Country state lookup
  useEffect(() => {
    if (builderData.country) {
      setLoadingLocation(true);
      fetch('https://countriesnow.space/api/v0.1/countries/states', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ country: builderData.country })
      })
        .then(res => res.json())
        .then(data => { if (!data.error) setStates(data.data.states || []); })
        .catch(console.error)
        .finally(() => setLoadingLocation(false));
    } else {
      setStates([]);
    }
  }, [builderData.country]);

  // State city lookup
  useEffect(() => {
    if (builderData.country && builderData.state) {
      setLoadingLocation(true);
      fetch('https://countriesnow.space/api/v0.1/countries/state/cities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ country: builderData.country, state: builderData.state })
      })
        .then(res => res.json())
        .then(data => { if (!data.error) setCities(data.data || []); })
        .catch(console.error)
        .finally(() => setLoadingLocation(false));
    } else {
      setCities([]);
    }
  }, [builderData.country, builderData.state]);

  const handleCountryChange = (e) => setBuilderData({ ...builderData, country: e.target.value, state: '', city: '' });
  const handleStateChange = (e) => setBuilderData({ ...builderData, state: e.target.value, city: '' });

  const getAddressLabels = (country) => {
    if (country === 'India') return { state: 'State', zip: 'PIN Code' };
    if (country === 'United States') return { state: 'State', zip: 'Zip Code' };
    return { state: 'State / Province / Region', zip: 'Postal Code' };
  };
  const addressLabels = getAddressLabels(builderData.country);

  // Update mode checks
  const currentStatus = onboardingInitData?.userData?.onboardingStatus;
  const adminRequests = onboardingInitData?.adminRequests || onboardingInitData?.userData?.adminRequests || [];

  const FORM2_KEYS = [
    'yearOfIncorporation', 'promotersOrDirectors', 'totalSqftDelivered', 'majorCompletedProjects', 'typeOfProjectsOffered', 'companyOverview', 'experienceWithNriInvestors', 'declaredLitigationDisputes', 'financialOfCompany', 'outstandingDebt', 'bankingPartners'
  ];

  const hasForm2Requests = adminRequests.some(req => {
    const id = typeof req === 'string' ? req : (req.id || req.fieldName);
    return FORM2_KEYS.includes(id);
  });

  const isUpdateMode = onboardingInitData?.phase === 'CHANGES_REQUESTED' || currentStatus?.includes('changes_requested');
  const isForm2UpdateMode = isUpdateMode && (currentStatus === 'form2_changes_requested' || hasForm2Requests);
  const isForm1UpdateMode = isUpdateMode && !isForm2UpdateMode;

  const shouldShowField = (fieldName) => {
    if (!isForm1UpdateMode) return true;
    const requested = adminRequests.map(req => typeof req === 'string' ? req : (req.id || req.fieldName));
    if (requested.includes(fieldName)) return true;
    if (fieldName === 'country' && (requested.includes('state') || requested.includes('city') || requested.includes('zip'))) return true;
    if (fieldName === 'state' && requested.includes('city')) return true;
    return false;
  };

  const shouldShowForm2Field = (fieldName) => {
    if (!isForm2UpdateMode) return true;
    const requested = adminRequests.map(req => typeof req === 'string' ? req : (req.id || req.fieldName));
    return requested.includes(fieldName);
  };

  const isProfileFormValid = () => {
    if (isForm1UpdateMode) {
      let isValid = true;
      const requested = adminRequests.map(req => typeof req === 'string' ? req : (req.id || req.fieldName));
      const fieldsToCheck = new Set(requested);
      if (fieldsToCheck.has('city')) { fieldsToCheck.add('state'); fieldsToCheck.add('country'); }
      if (fieldsToCheck.has('state')) { fieldsToCheck.add('country'); }
      fieldsToCheck.forEach(id => {
        if (builderData[id] === undefined || builderData[id] === '' || (Array.isArray(builderData[id]) && builderData[id].length === 0)) isValid = false;
      });
      return isValid && builderData.termsAccepted;
    }

    return (
      builderData.companyName.trim() !== '' && builderData.yearsOfExperience.toString().trim() !== '' &&
      builderData.contactName.trim() !== '' && builderData.contactPersonRole.trim() !== '' &&
      (builderData.contactPersonRole !== 'Other' || builderData.contactPersonRoleOther.trim() !== '') &&
      builderData.contactPersonPhone.trim() !== '' &&
      builderData.country.trim() !== '' && builderData.state.trim() !== '' && builderData.city.trim() !== '' &&
      builderData.termsAccepted
    );
  };

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    if (authData.password !== authData.confirmPassword) {
      return toast({ title: "Error", description: "Passwords do not match", variant: "destructive" });
    }

    // Step 1A: Send OTP
    if (!otpSent) {
      try {
        setLoading(true);
        await sendOtp(authData.email);
        setOtpSent(true);
        toast({ title: "OTP Code Sent", description: "A 6-digit verification code was sent to your email." });
      } catch (err) {
        toast({ title: "Verification Failed", description: err.message || "Failed to send verification email.", variant: "destructive" });
      } finally {
        setLoading(false);
      }
      return;
    }

    // Step 1B: Verify OTP & Create Account
    try {
      setLoading(true);
      let response = await registerStep1({
        email: authData.email,
        password: authData.password,
        role: 'builder',
        otp: otpCode
      });

      setUserId(response.uid);
      setStep(2);
      toast({ title: "Account Verified & Created", description: "Please complete basic details." });
    } catch (err) {
      toast({ title: "Registration Failed", description: err.message || "Invalid or expired OTP.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    if (!builderData.termsAccepted) return toast({ title: 'Error', description: 'Please accept the terms.', variant: 'destructive' });

    try {
      setLoading(true);
      if (isForm1UpdateMode) {
        const existingPendingChanges = onboardingInitData?.userData?.pendingChanges || {};
        const payload = { ...existingPendingChanges };
        const requestedIds = adminRequests.map(req => typeof req === 'string' ? req : (req.id || req.fieldName));
        const fieldsToSend = new Set(requestedIds);

        if (fieldsToSend.has('city') || fieldsToSend.has('zip')) { fieldsToSend.add('state'); fieldsToSend.add('country'); }
        if (fieldsToSend.has('state')) fieldsToSend.add('country');

        fieldsToSend.forEach(id => { if (builderData[id] !== undefined) payload[id] = builderData[id]; });
        await submitRequestedChanges(userId, payload);
        setSubmitted(true);
      } else {
        await submitBuilderForm1(userId, builderData);
        // Direct auto-login and navigation to dashboard
        let autoLoginSucceeded = false;
        try {
          let userData;
          if (onboardingInitData?.idToken) {
            userData = await googleSyncRequest(onboardingInitData.idToken, 'builder');
          } else if (authData.email && authData.password) {
            userData = await loginRequest({ email: authData.email, password: authData.password, role: 'builder' });
          }

          if (userData && userData.uid) {
            login(userData);
            autoLoginSucceeded = true;
            toast({ title: 'Registration Complete! 🎉', description: 'Welcome! Taking you to your dashboard...' });
            router.push('/builder/dashboard');
            return;
          }
        } catch (loginErr) {
          console.warn('Auto-login failed after Form 1:', loginErr);
        }

        if (!autoLoginSucceeded) {
          // Fallback: redirect to login with a success message
          toast({ title: 'Registration Complete!', description: 'Please sign in to access your dashboard.' });
          router.push('/builder/login');
        }
      }
    } catch (error) {
      toast({ title: 'Error', description: error.message || 'Failed to submit.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleForm2Submit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (isForm2UpdateMode) {
        const existingPendingChanges = onboardingInitData?.userData?.pendingChanges || {};
        const payload = { ...existingPendingChanges };
        const requestedIds = adminRequests.map(req => typeof req === 'string' ? req : (req.id || req.fieldName));

        requestedIds.forEach(id => {
          if (bldForm2[id] !== undefined) {
            payload[id] = bldForm2[id];
          } else if (builderData[id] !== undefined) {
            payload[id] = builderData[id];
          }
        });

        await submitRequestedChanges(userId, payload);
      } else {
        await submitBuilderForm2(userId, bldForm2);
      }
      setSubmitted(true);
    } catch (error) {
      toast({ title: 'Error', description: error.message || 'Failed to submit final details.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleRegisterSuccess = (userData) => {
    login(userData);
    toast({ title: 'Login Successful', description: `Welcome back, ${userData.name || 'User'}!` });
    router.push('/builder/dashboard');
  };

  const handleGoogleRegisterError = (err) => {
    if (err.error === 'STEP2_PENDING') {
      toast({ title: 'Profile Incomplete', description: 'Please complete your profile details.' });
      setUserId(err.uid);
      setAuthData(prev => ({ ...prev, email: err.email }));
      setBuilderData(prev => ({ ...prev, contactName: err.name || '' }));
      setOnboardingInitData(err);
      setStep(2);
    } else if (err.error === 'CHANGES_REQUESTED') {
      toast({ title: 'Update Required', description: err.message });
      setUserId(err.uid);
      setOnboardingInitData(err);
      setStep(2);
    } else if (err.error === 'FORM2_PENDING') {
      toast({ title: 'Action Required', description: err.message });
      setUserId(err.uid);
      setOnboardingInitData(err);
      setStep(3);
    } else if (err.error === 'ACCOUNT_UNDER_REVIEW') {
      toast({ title: 'Account Under Review', description: 'Your account is under review by admin.', variant: 'destructive' });
    } else {
      toast({ title: "Registration Failed", description: err.message || "Google registration failed", variant: "destructive" });
    }
  };

  const inputStyle = "h-10 px-4 bg-white border-gray-200 focus:bg-white focus:ring-2 focus:ring-orange-500/10 focus:border-orange-500 transition-all rounded-lg w-full";
  const selectStyle = "flex h-10 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/10 focus-visible:border-orange-500 disabled:opacity-50 transition-all";
  const textareaStyle = "min-h-[70px] px-4 py-3 bg-white border-gray-200 focus:bg-white focus:ring-2 focus:ring-orange-500/10 focus:border-orange-500 transition-all rounded-lg w-full";
  const labelStyle = "text-sm font-semibold text-gray-700 block mb-1.5";
  const readOnlyStyle = "h-10 px-4 bg-gray-100 border-gray-200 text-gray-500 rounded-lg w-full cursor-not-allowed";

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="w-10 h-10 animate-spin text-orange-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-white overflow-hidden">

      {/* Mobile Back Button */}
      <div className="lg:hidden p-4 border-b border-gray-100 flex items-center">
        <Link href="/" className="inline-flex items-center gap-2 text-xs font-bold text-gray-600 uppercase tracking-wider hover:text-gray-900 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
      </div>

      {/* Sidebar - Left (Full height on Desktop) */}
      <div className="hidden lg:flex lg:w-[40%] relative bg-black flex-col justify-between p-10 overflow-hidden z-10 min-h-screen select-none">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-white/10 z-[1]" />
          <img 
            src="/images/image copy 33.png" 
            alt="bg" 
            className="absolute inset-0 w-full h-full object-cover opacity-[0.75] brightness-105 contrast-105 saturate-[1.05]" 
          />
          <div className="absolute top-[-5%] right-[-5%] w-[40%] h-[20%] bg-orange-200/20 blur-[60px] rounded-full" />
        </div>

        <div className="relative z-20 flex flex-col items-start gap-4">
          <Link href="/" className="inline-flex items-center gap-2 text-xs font-bold text-white/80 uppercase tracking-wider hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
          <div className="inline-flex items-center gap-2 bg-orange-600 px-3 py-1 rounded-full shadow-lg shadow-orange-600/20">
            <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Platform Registration</span>
          </div>
          <h1 className="text-4xl font-black mt-2 mb-10 leading-[1.1] tracking-tight text-white">
            Build the future <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-300 to-orange-500">
              with precision.
            </span>
          </h1>
        </div>

        {/* Floating Chips exactly like first image */}
        <div className="relative h-72 mt-4 pointer-events-none w-full">
          <div className="absolute top-[5%] left-[5%] px-3 py-1.5 bg-gray-900/90 backdrop-blur-sm rounded-full shadow-xl border border-gray-800 flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
            <span className="text-[8px] font-black text-white uppercase tracking-[0.2em]">Yield Focus</span>
          </div>
          <div className="absolute top-[18%] right-[8%] px-3 py-1.5 bg-white/95 backdrop-blur-sm rounded-full shadow-xl border border-gray-100 flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
            <span className="text-[8px] font-black text-gray-700 uppercase tracking-[0.2em]">Market Pulse</span>
          </div>
          <div className="absolute top-[32%] right-[15%] px-3 py-1.5 bg-gray-900/90 backdrop-blur-sm rounded-full shadow-xl border border-gray-800 flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-purple-400" />
            <span className="text-[8px] font-black text-white uppercase tracking-[0.2em]">Secure Vault</span>
          </div>
          <div className="absolute top-[45%] left-[0%] px-3 py-1.5 bg-white/95 backdrop-blur-sm rounded-full shadow-xl border border-white/50 flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-orange-500" />
            <span className="text-[8px] font-black text-gray-700 uppercase tracking-[0.2em]">Smart Assets</span>
          </div>
          <div className="absolute top-[55%] right-[2%] px-3 py-1.5 bg-gray-900/90 backdrop-blur-sm rounded-full shadow-xl border border-gray-800 flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-red-400" />
            <span className="text-[8px] font-black text-white uppercase tracking-[0.2em]">Verified</span>
          </div>
          <div className="absolute top-[68%] right-[22%] px-3 py-1.5 bg-white/95 backdrop-blur-sm rounded-full shadow-xl border border-gray-100 flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-yellow-500" />
            <span className="text-[8px] font-black text-gray-700 uppercase tracking-[0.2em]">ROI Optimized</span>
          </div>
          <div className="absolute top-[80%] left-[10%] px-3 py-1.5 bg-white/95 backdrop-blur-sm rounded-full shadow-xl border border-white/50 flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
            <span className="text-[8px] font-black text-gray-700 uppercase tracking-[0.2em]">Growth Intel</span>
          </div>
        </div>

        {/* App Download Card */}
        <div className="p-5 bg-white/5 border border-white/10 rounded-2xl flex flex-col gap-4 text-left shadow-sm backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-600 rounded-xl flex items-center justify-center text-white shadow-md shadow-orange-600/20">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15" />
              </svg>
            </div>
            <div>
              <h4 className="text-[10px] font-black text-white/55 uppercase tracking-widest leading-none mb-1">Get the App</h4>
              <h3 className="text-sm font-black text-white uppercase tracking-tight">Investate Builder</h3>
            </div>
          </div>

          <p className="text-[11px] text-gray-300 font-semibold leading-relaxed">
            Manage listings, track high-net-worth investor leads, and update bookings on the go.
          </p>

          <div className="grid grid-cols-2 gap-2">
            <a
              href="#"
              onClick={(e) => e.preventDefault()}
              aria-label="Download on App Store"
              className="rounded-xl overflow-hidden block"
            >
              <img
                src="/images/app-store.png"
                alt="Download on App Store"
                className="h-11 w-full object-contain rounded-xl hover:scale-105 transition-transform"
              />
            </a>

            <a
              href="#"
              onClick={(e) => e.preventDefault()}
              aria-label="Get it on Google Play"
              className="rounded-xl overflow-hidden block"
            >
              <img
                src="/images/google-play.png"
                alt="Get it on Google Play"
                className="h-11 w-full object-contain rounded-xl hover:scale-105 transition-transform"
              />
            </a>
          </div>
        </div>
      </div>

      {/* Main Content - Right (Full height scrollable) */}
      <div className="flex-grow min-h-screen bg-white flex flex-col justify-center py-10 px-6 md:px-12 lg:px-20 overflow-y-auto">
        <div className="w-full max-w-lg mx-auto">
          {submitted ? (
            <div className="text-center py-6 animate-in zoom-in duration-500">
              <div className="bg-green-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                <CheckCircle className="h-10 w-10 text-green-500" />
              </div>
              <h2 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">
                {isUpdateMode ? 'Update Submitted!' : 'Success!'}
              </h2>
              <p className="text-gray-500 mb-8 max-w-md mx-auto text-base leading-relaxed">
                {isUpdateMode
                  ? "Your changes have been sent to our administration team for final review."
                  : step === 3
                    ? "Your final details have been sent to our administration team. We will activate your account shortly."
                    : "Your initial details have been sent to our administration team for verification. We will notify you once approved."}
              </p>
              <Link href="/builder/login">
                <Button className="bg-gray-900 hover:bg-black px-10 py-6 text-base font-black rounded-[1.25rem] shadow-2xl shadow-black/10 transition-all hover:scale-105 active:scale-95">
                  Return to Login
                </Button>
              </Link>
            </div>
          ) : (
            <div className="w-full">
              {/* Header */}
              <div className="text-center mb-6">
                <h2 className="text-2xl font-black tracking-tight text-gray-900 uppercase">
                  Builder
                </h2>
                <p className="text-gray-400 font-bold mt-1 tracking-wide uppercase text-[9px]">Step 0{step}</p>
              </div>

              {/* Step 1 */}
              {step === 1 && (
                <div className="space-y-6 animate-in slide-in-from-bottom-6 duration-500">
                  <GoogleAuthButton onSuccess={handleGoogleRegisterSuccess} onError={handleGoogleRegisterError} text="Continue with Google" userType="builder" />

                  <div className="relative py-2">
                    <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-gray-100" /></div>
                    <div className="relative flex justify-center text-[9px] font-black uppercase tracking-[0.3em]"><span className="bg-white px-6 text-gray-400">Security Check</span></div>
                  </div>

                  <form onSubmit={handleAuthSubmit} className="space-y-5">
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black text-gray-900 uppercase tracking-widest ml-1">Professional Email</Label>
                      <Input type="email" name='email' autoComplete="off" required disabled={otpSent} value={authData.email} onChange={(e) => setAuthData({ ...authData, email: e.target.value })} className="h-11 px-6 bg-gray-50 border-gray-200 focus:bg-white focus:ring-[6px] focus:ring-orange-500/5 focus:border-orange-500 transition-all duration-300 rounded-2xl text-sm font-bold placeholder:text-gray-300 disabled:opacity-75 disabled:cursor-not-allowed" placeholder="name@company.com" />
                    </div>
                    {!otpSent ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-[10px] font-black text-gray-900 uppercase tracking-widest ml-1">Password</Label>
                          <div className="relative">
                            <Input type={showPassword ? 'text' : 'password'} autoComplete="new-password" required value={authData.password} onChange={(e) => setAuthData({ ...authData, password: e.target.value })} className="h-11 px-6 pr-12 bg-gray-50 border-gray-200 focus:bg-white focus:ring-[6px] focus:ring-orange-500/5 focus:border-orange-500 transition-all duration-300 rounded-2xl text-sm font-bold placeholder:text-gray-300" placeholder="••••••••" />
                            <button type="button" onClick={() => setShowPassword(prev => !prev)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 transition-colors" tabIndex={-1}>
                              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-[10px] font-black text-gray-900 uppercase tracking-widest ml-1">Confirm Password</Label>
                          <div className="relative">
                            <Input type={showConfirmPassword ? 'text' : 'password'} autoComplete="new-password" required value={authData.confirmPassword} onChange={(e) => setAuthData({ ...authData, confirmPassword: e.target.value })} className="h-11 px-6 pr-12 bg-gray-50 border-gray-200 focus:bg-white focus:ring-[6px] focus:ring-orange-500/5 focus:border-orange-500 transition-all duration-300 rounded-2xl text-sm font-bold placeholder:text-gray-300" placeholder="••••••••" />
                            <button type="button" onClick={() => setShowConfirmPassword(prev => !prev)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 transition-colors" tabIndex={-1}>
                              {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                        <Label className="text-[10px] font-black text-orange-600 uppercase tracking-widest ml-1">Enter 6-Digit Email OTP *</Label>
                        <Input type="text" maxLength={6} required value={otpCode} onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))} className="h-11 px-6 bg-orange-50/10 border-orange-200 focus:bg-white focus:ring-[6px] focus:ring-orange-500/5 focus:border-orange-500 transition-all duration-300 rounded-2xl text-center text-lg font-black tracking-[0.4em] placeholder:text-gray-300" placeholder="000000" />
                        <div className="flex justify-between items-center text-[10px] font-bold text-gray-400 uppercase tracking-wider px-1 pt-1">
                          <span>Code sent to email</span>
                          <button type="button" onClick={async () => {
                            try {
                              setLoading(true);
                              await sendOtp(authData.email);
                              toast({ title: "OTP Resent", description: "A new code has been sent to your email." });
                            } catch (err) {
                              toast({ title: "Resend Failed", description: err.message, variant: "destructive" });
                            } finally {
                              setLoading(false);
                            }
                          }} className="text-orange-600 hover:underline font-black">Resend Code</button>
                        </div>
                      </div>
                    )}
                    <Button
                      type="submit"
                      className="w-full h-12 bg-gray-900 hover:bg-black text-white font-black text-base rounded-[1.25rem] mt-4 shadow-2xl shadow-black/10 transition-all hover:scale-[1.02] active:scale-[0.98]"
                      disabled={loading}
                    >
                      {loading ? <Loader2 className="mr-2 h-6 w-6 animate-spin" /> : <div className="flex items-center justify-center gap-3 text-sm uppercase tracking-wider font-black">{otpSent ? "Verify & Register" : "Send Verification OTP"} <ChevronRight className="h-5 w-5" /></div>}
                    </Button>

                    <p className="text-center text-[10px] font-bold text-gray-400 uppercase tracking-widest pt-2">
                      Already registered? <Link href="/builder/login" className="text-orange-600 hover:text-orange-700 font-black underline underline-offset-4 decoration-2">Sign In</Link>
                    </p>
                  </form>
                </div>
              )}

              {/* Step 2 */}
              {step === 2 && (
                <form onSubmit={handleProfileSubmit} className="space-y-8 animate-in slide-in-from-bottom-6 duration-500">
                  {isForm1UpdateMode && (
                    <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl font-bold text-sm flex items-center gap-4">
                      <FileWarning className="w-6 h-6 flex-shrink-0" />
                      <span>Action Required: The admin team has requested changes to specific fields.</span>
                    </div>
                  )}

                  <div className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {shouldShowField('companyName') && (<div><Label className={labelStyle}>Entity Name *</Label><Input required value={builderData.companyName} onChange={(e) => setBuilderData({ ...builderData, companyName: e.target.value })} className={inputStyle} /></div>)}
                      {shouldShowField('yearsOfExperience') && (<div><Label className={labelStyle}>Track Record (Years) *</Label><Input type="text" required value={builderData.yearsOfExperience} onChange={(e) => setBuilderData({ ...builderData, yearsOfExperience: e.target.value.replace(/\D/g, '') })} placeholder="e.g. 10" className={inputStyle} /></div>)}
                    </div>

                    {(shouldShowField('contactName') || shouldShowField('contactPersonRole') || shouldShowField('contactPersonPhone')) && (
                      <div className="bg-gray-50/50 p-5 rounded-2xl border border-gray-100 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {shouldShowField('contactName') && (<div><Label className={labelStyle}>Liaison Name *</Label><Input required value={builderData.contactName} onChange={(e) => setBuilderData({ ...builderData, contactName: e.target.value })} className={inputStyle} placeholder="Full name" /></div>)}
                          {shouldShowField('contactPersonRole') && (
                            <div>
                              <Label className={labelStyle}>Liaison Role *</Label>
                              <select required className={selectStyle} value={builderData.contactPersonRole} onChange={(e) => setBuilderData({ ...builderData, contactPersonRole: e.target.value, contactPersonRoleOther: '' })}>
                                <option value="">Select Role</option>
                                {['Managing Director (MD)', 'Chairman', 'Director', 'Partner', 'Proprietor', 'General Manager', 'Project Manager', 'Business Development Manager', 'Sales Manager', 'Marketing Manager', 'Liaison Officer', 'Authorized Signatory', 'Relationship Manager', 'Legal Representative', 'Administrative Officer', 'Other'].map(r => <option key={r} value={r}>{r}</option>)}
                              </select>
                            </div>
                          )}
                        </div>
                        {builderData.contactPersonRole === 'Other' && (
                          <div className="animate-in slide-in-from-top-2 duration-300">
                            <Label className={labelStyle}>Specify Role *</Label>
                            <Input required value={builderData.contactPersonRoleOther} onChange={(e) => setBuilderData({ ...builderData, contactPersonRoleOther: e.target.value })} className={inputStyle} placeholder="e.g. Founder, Co-founder" />
                          </div>
                        )}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {shouldShowField('contactPersonPhone') && (<div><Label className={labelStyle}>Direct Phone *</Label><Input required value={builderData.contactPersonPhone} onChange={(e) => setBuilderData({ ...builderData, contactPersonPhone: e.target.value.replace(/\D/g, '') })} className={inputStyle} /></div>)}
                          {shouldShowField('companyEmail') && (<div><Label className={labelStyle}>Company Email <span className="text-gray-400 normal-case font-medium">(optional)</span></Label><Input type="email" value={builderData.companyEmail} onChange={(e) => setBuilderData({ ...builderData, companyEmail: e.target.value })} className={inputStyle} placeholder="contact@company.com" /></div>)}
                        </div>
                      </div>
                    )}

                    {/* {shouldShowField('aboutYourself') && (
                      <div>
                        <Label className={labelStyle}>About Your Company / Yourself</Label>
                        <Textarea
                          value={builderData.aboutYourself}
                          onChange={(e) => setBuilderData({ ...builderData, aboutYourself: e.target.value })}
                          className="w-full bg-gray-50 border-gray-200 rounded-xl px-4 py-3 font-semibold text-gray-900 focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all min-h-[120px] resize-y"
                          placeholder="Tell us about your company, your background, and what makes you stand out..."
                        />
                      </div>
                    )} */}

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

                  <div className="h-px bg-gray-100 w-full mt-10 mb-8" />

                  <div className="flex items-start space-x-5 p-6 bg-orange-50/20 border border-orange-100/50 rounded-2xl">
                    <Checkbox id="terms" checked={builderData.termsAccepted} onCheckedChange={(checked) => setBuilderData({ ...builderData, termsAccepted: checked })} className="data-[state=checked]:bg-orange-600 border-orange-200 mt-1" />
                    <Label htmlFor="terms" className="text-sm font-bold text-gray-500 leading-relaxed cursor-pointer">
                      I verify all data provided is accurate and agree to the <span className="text-orange-600 font-black hover:underline underline-offset-2">Platform Policies</span>.
                    </Label>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-14 bg-gray-900 hover:bg-black text-white font-black text-lg rounded-[1.25rem] shadow-2xl shadow-black/10 disabled:bg-gray-200 disabled:shadow-none transition-all hover:scale-[1.02] active:scale-[0.98] mt-6"
                    disabled={loading || !isProfileFormValid()}
                  >
                    {loading ? <Loader2 className="mr-2 h-6 w-6 animate-spin" /> : (isForm1UpdateMode ? 'Update Account' : 'Complete Registration')}
                  </Button>
                  {/* Step 3 removed for builders */}          </form>
              )}
            </div>
          )}
          {/* Mobile App Download Card (Visible on Mobile only) */}
          <div className="lg:hidden mt-8 p-5 bg-gray-50 border border-gray-100 rounded-2xl flex flex-col gap-4 text-left shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-600 rounded-xl flex items-center justify-center text-white shadow-md shadow-orange-600/20">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15" />
                </svg>
              </div>
              <div>
                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Get the App</h4>
                <h3 className="text-sm font-black text-gray-900 uppercase tracking-tight">Investate Builder</h3>
              </div>
            </div>

            <p className="text-[11px] text-gray-500 font-semibold leading-relaxed">
              Manage listings, track high-net-worth investor leads, and update bookings on the go.
            </p>

            <div className="grid grid-cols-2 gap-2">
              <a
                href="#"
                onClick={(e) => e.preventDefault()}
                aria-label="Download on App Store"
                className="rounded-xl overflow-hidden block"
              >
                <img
                  src="/images/app-store.png"
                  alt="Download on App Store"
                  className="h-11 w-full object-contain rounded-xl hover:scale-105 transition-transform"
                />
              </a>

              <a
                href="#"
                onClick={(e) => e.preventDefault()}
                aria-label="Get it on Google Play"
                className="rounded-xl overflow-hidden block"
              >
                <img
                  src="/images/google-play.png"
                  alt="Get it on Google Play"
                  className="h-11 w-full object-contain rounded-xl hover:scale-105 transition-transform"
                />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BuilderRegister() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="w-10 h-10 animate-spin text-orange-600" />
      </div>
    }>
      <BuilderRegisterContent />
    </Suspense>
  );
}
