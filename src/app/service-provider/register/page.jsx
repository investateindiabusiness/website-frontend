"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from '@/hooks/use-toast';
import { CheckCircle, ChevronRight, Loader2, FileWarning, ClipboardList, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { getAuth } from 'firebase/auth';
import { app } from '@/firebase';
import { registerStep1, sendOtp, submitServiceProviderForm1, submitRequestedChanges } from '@/api';
import GoogleAuthButton from '@/components/GoogleAuthButton';

function ServiceProviderRegisterContent() {
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
  const [serviceProviderData, setServiceProviderData] = useState({
    fullName: '', contactNumber: '', serviceCategory: '', yearsOfExperience: '',
    address: '', country: '', state: '', city: '', zip: '', termsAccepted: false
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

      const targetName = queryName || initData?.name || initData?.userData?.fullName;
      
      const uData = initData?.userData || {};
      setServiceProviderData(prev => ({
        ...prev,
        ...uData,
        fullName: targetName || uData.fullName || prev.fullName
      }));

      if (querySkipStep1 || initData?.skipStep1) {
        setStep(2);
      }
    }
  }, [searchParams]);

  // Country state lookup
  useEffect(() => {
    if (!serviceProviderData.country) {
      setStates([]);
      setCities([]);
      return;
    }
    setLoadingLocation(true);
    fetch('https://countriesnow.space/api/v0.1/countries/states', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ country: serviceProviderData.country })
    })
      .then(res => res.json())
      .then(data => {
        if (!data.error) setStates(data.data.states || []);
        else setStates([]);
        setCities([]);
        setLoadingLocation(false);
      })
      .catch(() => { setStates([]); setLoadingLocation(false); });
  }, [serviceProviderData.country]);

  // State city lookup
  useEffect(() => {
    if (!serviceProviderData.state || !serviceProviderData.country) {
      setCities([]);
      return;
    }
    setLoadingLocation(true);
    fetch('https://countriesnow.space/api/v0.1/countries/state/cities', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ country: serviceProviderData.country, state: serviceProviderData.state })
    })
      .then(res => res.json())
      .then(data => {
        if (!data.error) setCities(data.data || []);
        else setCities([]);
        setLoadingLocation(false);
      })
      .catch(() => { setCities([]); setLoadingLocation(false); });
  }, [serviceProviderData.state, serviceProviderData.country]);

  const handleCountryChange = (e) => {
    setServiceProviderData({ ...serviceProviderData, country: e.target.value, state: '', city: '' });
  };

  const handleStateChange = (e) => {
    setServiceProviderData({ ...serviceProviderData, state: e.target.value, city: '' });
  };

  const getAddressLabels = (cntry) => {
    if (cntry === 'India') return { state: 'State', zip: 'PIN Code' };
    if (cntry === 'United States') return { state: 'State', zip: 'Zip Code' };
    return { state: 'State / Province / Region', zip: 'Postal Code' };
  };
  const addressLabels = getAddressLabels(serviceProviderData.country);

  // Checks for update mode / requested changes from admin review
  const currentStatus = onboardingInitData?.userData?.onboardingStatus;
  const adminRequests = onboardingInitData?.adminRequests || onboardingInitData?.userData?.adminRequests || [];
  const isUpdateMode = onboardingInitData?.phase === 'CHANGES_REQUESTED' || currentStatus?.includes('changes_requested');
  const isForm1UpdateMode = isUpdateMode;

  const shouldShowField = (fieldName) => {
    if (!isForm1UpdateMode) return true;
    const requested = adminRequests.map(req => typeof req === 'string' ? req : (req.id || req.fieldName));
    if (requested.includes(fieldName)) return true;
    if (fieldName === 'country' && (requested.includes('state') || requested.includes('city') || requested.includes('zip'))) return true;
    if (fieldName === 'state' && requested.includes('city')) return true;
    return false;
  };

  const isProfileFormValid = () => {
    const data = serviceProviderData;
    if (isForm1UpdateMode) {
      let isValid = true;
      const requested = adminRequests.map(req => typeof req === 'string' ? req : (req.id || req.fieldName));
      const fieldsToCheck = new Set(requested);
      if (fieldsToCheck.has('city')) { fieldsToCheck.add('state'); fieldsToCheck.add('country'); }
      if (fieldsToCheck.has('state')) { fieldsToCheck.add('country'); }
      fieldsToCheck.forEach(id => { if (data[id] === undefined || data[id] === '') isValid = false; });
      return isValid && data.termsAccepted;
    }

    return (
      data.fullName.trim() !== '' &&
      data.contactNumber.trim() !== '' &&
      data.serviceCategory.trim() !== '' &&
      data.yearsOfExperience.toString().trim() !== '' &&
      data.country.trim() !== '' &&
      data.state.trim() !== '' &&
      data.city.trim() !== '' &&
      data.termsAccepted
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
      const response = await registerStep1({
        email: authData.email,
        password: authData.password,
        role: 'serviceProvider',
        otp: otpCode
      });

      setUserId(response.uid);
      setStep(2);
      toast({ title: "Account Verified & Created", description: "Please complete profile registration details." });
    } catch (err) {
      toast({ title: "Registration Failed", description: err.message || "Invalid or expired OTP.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    if (!serviceProviderData.termsAccepted) {
      return toast({ title: 'Error', description: 'Please accept the terms.', variant: 'destructive' });
    }

    try {
      setLoading(true);
      if (isForm1UpdateMode) {
        const existingPendingChanges = onboardingInitData?.userData?.pendingChanges || {};
        const payload = { ...existingPendingChanges };
        const requestedIds = adminRequests.map(req => typeof req === 'string' ? req : (req.id || req.fieldName));
        const fieldsToSend = new Set(requestedIds);

        if (fieldsToSend.has('city') || fieldsToSend.has('zip')) { fieldsToSend.add('state'); fieldsToSend.add('country'); }
        if (fieldsToSend.has('state')) fieldsToSend.add('country');

        fieldsToSend.forEach(id => { if (serviceProviderData[id] !== undefined) payload[id] = serviceProviderData[id]; });
        await submitRequestedChanges(userId, payload);
      } else {
        await submitServiceProviderForm1(userId, serviceProviderData);
      }
      setSubmitted(true);
    } catch (error) {
      toast({ title: 'Error', description: error.message || 'Failed to submit profile.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = (userData) => {
    login(userData);
    toast({ title: 'Login Successful', description: `Welcome back, ${userData.name || 'User'}!` });
    router.push('/service-provider/dashboard');
  };

  const handleGoogleError = (err) => {
    console.log("Register Google Auth Error:", err);
    if (err.error === 'STEP2_PENDING') {
      toast({ title: 'Profile Incomplete', description: 'Please complete your profile details.' });
      setUserId(err.uid);
      setAuthData(prev => ({ ...prev, email: err.email }));
      setServiceProviderData(prev => ({ ...prev, fullName: err.name || '' }));
      setStep(2);
    } else if (err.error === 'CHANGES_REQUESTED') {
      toast({ title: 'Update Required', description: err.message });
      setUserId(err.uid);
      setAuthData(prev => ({ ...prev, email: err.email }));
      setOnboardingInitData({ userData: err.userData, adminRequests: err.adminRequests, phase: 'CHANGES_REQUESTED' });
      setServiceProviderData(prev => ({ ...prev, ...err.userData }));
      setStep(2);
    } else {
      toast({ title: 'Google Registration Failed', description: err.message || 'Verification failed.', variant: 'destructive' });
    }
  };

  const inputStyle = "h-10 px-4 bg-white border-gray-200 focus:bg-white focus:ring-2 focus:ring-orange-500/10 focus:border-orange-500 transition-all rounded-lg w-full";
  const selectStyle = "flex h-10 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/10 focus-visible:border-orange-500 disabled:opacity-50 transition-all";
  const labelStyle = "text-sm font-semibold text-gray-700 block mb-1.5";

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="w-10 h-10 animate-spin text-orange-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-white overflow-hidden font-sans text-gray-800">
      
      {/* Mobile Back Button */}
      <div className="lg:hidden p-4 border-b border-gray-100 flex items-center bg-white">
        <Link href="/service-provider" className="inline-flex items-center gap-2 text-xs font-bold text-gray-600 uppercase tracking-wider hover:text-gray-900 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Page
        </Link>
      </div>

      {/* Sidebar - Left (Full height on Desktop) */}
      <div className="hidden lg:flex lg:w-[40%] relative bg-black flex-col justify-between p-10 overflow-hidden z-10 min-h-screen select-none">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-white/10 z-[1]" />
          <img 
            src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=2070&auto=format&fit=crop" 
            alt="service-provider-bg" 
            className="absolute inset-0 w-full h-full object-cover opacity-[0.6] brightness-110 contrast-105 saturate-[1.1]" 
          />
          <div className="absolute top-[-5%] right-[-5%] w-[40%] h-[20%] bg-orange-200/20 blur-[60px] rounded-full" />
        </div>

        <div className="relative z-20 flex flex-col items-start gap-4">
          <Link href="/service-provider" className="inline-flex items-center gap-2 text-xs font-bold text-white/80 uppercase tracking-wider hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Page
          </Link>
          <div className="inline-flex items-center gap-2 bg-orange-600 px-3 py-1 rounded-full shadow-lg shadow-orange-600/20">
            <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Platform Registration</span>
          </div>
          <h1 className="text-4xl font-black mt-2 mb-10 leading-[1.1] tracking-tight text-white">
            Verify credentials <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-300 to-orange-500">
              with precision.
            </span>
          </h1>
        </div>

        {/* Floating Chips exactly like Investor/Builder Pages */}
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

        <div className="relative z-20 space-y-5">
          <div className="pt-8 border-t border-white/10 flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-9 h-9 rounded-full border-2 border-black bg-gray-800 overflow-hidden shadow-sm">
                    <img src={`https://i.pravatar.cc/100?img=${i + 30}`} alt="user" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
              <div className="flex flex-col">
                <p className="text-[10px] font-black text-white uppercase tracking-widest">Professional Network</p>
                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">Join Verified Specialists</p>
              </div>
            </div>
            <p className="text-[10px] text-gray-300 font-medium leading-tight max-w-[280px]">
              "Connecting premium real estate developers and institutional service experts globally."
            </p>
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
                  : "Your details have been sent to our administration team. We will verify your qualifications and activate your profile dashboard shortly. You will receive an email confirmation once completed."}
              </p>
              <Link href="/service-provider/login">
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
                  {step === 1 ? "Service Provider Registration" : "Basic Details"}
                </h2>
                <p className="text-gray-400 font-bold mt-1 tracking-wide uppercase text-[9px]">Step 0{step}</p>
              </div>

              {/* STEP 1: Account credentials */}
              {step === 1 && (
                <div className="space-y-6 animate-in slide-in-from-bottom-6 duration-500">
                  <GoogleAuthButton 
                    onSuccess={handleGoogleSuccess} 
                    onError={handleGoogleError} 
                    text="Continue with Google" 
                    userType="serviceProvider" 
                  />

                  <div className="relative py-2">
                    <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-gray-100" /></div>
                    <div className="relative flex justify-center text-[9px] font-black uppercase tracking-[0.3em]"><span className="bg-white px-6 text-gray-400">Security Check</span></div>
                  </div>

                    <form onSubmit={handleAuthSubmit} className="space-y-5">
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-[10px] font-black text-gray-900 uppercase tracking-widest ml-1">Email Address</Label>
                        <Input
                          id="email"
                          type="email"
                          required
                          disabled={otpSent}
                          value={authData.email}
                          onChange={e => setAuthData({ ...authData, email: e.target.value })}
                          placeholder="professional@example.com"
                          className="h-11 px-6 bg-gray-50 border-gray-200 focus:bg-white focus:ring-[6px] focus:ring-orange-500/5 focus:border-orange-500 transition-all duration-300 rounded-2xl text-sm font-bold placeholder:text-gray-300 w-full disabled:opacity-75 disabled:cursor-not-allowed"
                        />
                      </div>

                      {!otpSent ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                          <div className="space-y-2">
                            <Label htmlFor="password" className="text-[10px] font-black text-gray-900 uppercase tracking-widest ml-1">Password</Label>
                            <div className="relative">
                              <Input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                required
                                value={authData.password}
                                onChange={e => setAuthData({ ...authData, password: e.target.value })}
                                placeholder="••••••••"
                                className="h-11 px-6 pr-12 bg-gray-50 border-gray-200 focus:bg-white focus:ring-[6px] focus:ring-orange-500/5 focus:border-orange-500 transition-all duration-300 rounded-2xl text-sm font-bold placeholder:text-gray-300 w-full"
                              />
                              <button type="button" onClick={() => setShowPassword(prev => !prev)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 transition-colors" tabIndex={-1}>
                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                              </button>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="confirmPassword" className="text-[10px] font-black text-gray-900 uppercase tracking-widest ml-1">Confirm Password</Label>
                            <div className="relative">
                              <Input
                                id="confirmPassword"
                                type={showConfirmPassword ? 'text' : 'password'}
                                required
                                value={authData.confirmPassword}
                                onChange={e => setAuthData({ ...authData, confirmPassword: e.target.value })}
                                placeholder="••••••••"
                                className="h-11 px-6 pr-12 bg-gray-50 border-gray-200 focus:bg-white focus:ring-[6px] focus:ring-orange-500/5 focus:border-orange-500 transition-all duration-300 rounded-2xl text-sm font-bold placeholder:text-gray-300 w-full"
                              />
                              <button type="button" onClick={() => setShowConfirmPassword(prev => !prev)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 transition-colors" tabIndex={-1}>
                                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                              </button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                          <Label className="text-[10px] font-black text-orange-600 uppercase tracking-widest ml-1">Enter 6-Digit Email OTP *</Label>
                          <Input
                            type="text"
                            maxLength={6}
                            required
                            value={otpCode}
                            onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                            className="h-11 px-6 bg-orange-50/10 border-orange-200 focus:bg-white focus:ring-[6px] focus:ring-orange-500/5 focus:border-orange-500 transition-all duration-300 rounded-2xl text-center text-lg font-black tracking-[0.4em] placeholder:text-gray-300 w-full"
                            placeholder="000000"
                          />
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
                        disabled={loading}
                        className="w-full h-12 bg-gray-900 hover:bg-black text-white font-black text-sm uppercase tracking-wider rounded-[1.25rem] transition-all shadow-lg hover:scale-[1.02] mt-4 flex items-center justify-center gap-2"
                      >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>{otpSent ? "Verify & Register" : "Send Verification OTP"} <ChevronRight className="w-4 h-4" /></>}
                      </Button>

                    <p className="text-center text-xs text-gray-400 mt-6 font-medium">
                      Already have a partner account?{' '}
                      <Link href="/service-provider/login" className="text-orange-600 hover:text-orange-700 font-black underline underline-offset-4 decoration-2">
                        Sign In
                      </Link>
                    </p>
                  </form>
                </div>
              )}

              {/* STEP 2: Profile setup */}
              {step === 2 && (
                <form onSubmit={handleProfileSubmit} className="space-y-5 animate-in slide-in-from-bottom-6 duration-500">
                  {isForm1UpdateMode && (
                    <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl flex items-center gap-3 font-semibold text-xs leading-relaxed">
                      <FileWarning className="w-5 h-5 flex-shrink-0" />
                      <span>Action Required: Please update the requested fields below.</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {shouldShowField('fullName') && (
                      <div>
                        <Label className={labelStyle}>Full Name / Entity Name *</Label>
                        <Input
                          required
                          value={serviceProviderData.fullName}
                          onChange={e => setServiceProviderData({ ...serviceProviderData, fullName: e.target.value })}
                          placeholder="Your name or company name"
                          className={inputStyle}
                        />
                      </div>
                    )}
                    {shouldShowField('contactNumber') && (
                      <div>
                        <Label className={labelStyle}>Contact Number *</Label>
                        <Input
                          required
                          value={serviceProviderData.contactNumber}
                          onChange={e => setServiceProviderData({ ...serviceProviderData, contactNumber: e.target.value.replace(/\D/g, '') })}
                          placeholder="Direct phone"
                          className={inputStyle}
                        />
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {shouldShowField('serviceCategory') && (
                      <div>
                        <Label className={labelStyle}>Service Category *</Label>
                        <select
                          required
                          className={selectStyle}
                          value={serviceProviderData.serviceCategory}
                          onChange={e => setServiceProviderData({ ...serviceProviderData, serviceCategory: e.target.value })}
                        >
                          <option value="">Select Category</option>
                          <option value="Lawyers">Lawyers</option>
                          <option value="Real Estate Consultants">Real Estate Consultants</option>
                          <option value="Real Estate Agents / Brokers">Real Estate Agents / Brokers</option>
                          <option value="Chartered Accountants">Chartered Accountants</option>
                          <option value="Tax Consultants">Tax Consultants</option>
                          <option value="Others">Others</option>
                        </select>
                      </div>
                    )}
                    {shouldShowField('yearsOfExperience') && (
                      <div>
                        <Label className={labelStyle}>Years of Experience *</Label>
                        <Input
                          required
                          type="text"
                          value={serviceProviderData.yearsOfExperience}
                          onChange={e => setServiceProviderData({ ...serviceProviderData, yearsOfExperience: e.target.value.replace(/\D/g, '') })}
                          placeholder="e.g. 8"
                          className={inputStyle}
                        />
                      </div>
                    )}
                  </div>

                  {(shouldShowField('address') || shouldShowField('country') || shouldShowField('zip') || shouldShowField('state') || shouldShowField('city')) && (
                    <div className="pt-4 border-t border-gray-100 space-y-4">
                      <Label className="text-xs font-black text-gray-900 uppercase tracking-widest block mb-2">
                        Office Location
                      </Label>
                      
                      {shouldShowField('address') && (
                        <div>
                          <Label className={labelStyle}>Full Address</Label>
                          <Input
                            value={serviceProviderData.address}
                            onChange={e => setServiceProviderData({ ...serviceProviderData, address: e.target.value })}
                            placeholder="Corporate address details"
                            className={inputStyle}
                          />
                        </div>
                      )}

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {shouldShowField('country') && (
                          <div>
                            <Label className={labelStyle}>Country *</Label>
                            <select
                              required
                              className={selectStyle}
                              value={serviceProviderData.country}
                              onChange={handleCountryChange}
                            >
                              <option value="">Select Country</option>
                              {countries.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
                            </select>
                          </div>
                        )}
                        {shouldShowField('zip') && (
                          <div>
                            <Label className={labelStyle}>{addressLabels.zip}</Label>
                            <Input
                              value={serviceProviderData.zip}
                              onChange={e => setServiceProviderData({ ...serviceProviderData, zip: e.target.value })}
                              placeholder="Postal code"
                              className={inputStyle}
                            />
                          </div>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {shouldShowField('state') && (
                          <div>
                            <Label className={labelStyle}>{addressLabels.state} *</Label>
                            <select
                              required
                              className={selectStyle}
                              value={serviceProviderData.state}
                              onChange={handleStateChange}
                              disabled={!serviceProviderData.country}
                            >
                              <option value="">{loadingLocation ? "Loading..." : `Select ${addressLabels.state}`}</option>
                              {states.map(s => <option key={s.name} value={s.name}>{s.name}</option>)}
                            </select>
                          </div>
                        )}
                        {shouldShowField('city') && (
                          <div>
                            <Label className={labelStyle}>City *</Label>
                            <select
                              required
                              className={selectStyle}
                              value={serviceProviderData.city}
                              onChange={e => setServiceProviderData({ ...serviceProviderData, city: e.target.value })}
                              disabled={!serviceProviderData.state}
                            >
                              <option value="">{loadingLocation ? "Loading..." : "Select City"}</option>
                              {cities.map((city, index) => <option key={index} value={city}>{city}</option>)}
                            </select>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="flex items-start space-x-4 p-5 bg-gray-50 border border-gray-100 rounded-2xl">
                    <Checkbox 
                      id="terms" 
                      checked={serviceProviderData.termsAccepted} 
                      onCheckedChange={checked => setServiceProviderData({ ...serviceProviderData, termsAccepted: checked })} 
                      className="data-[state=checked]:bg-orange-600 border-gray-200 mt-1 animate-none" 
                    />
                    <Label htmlFor="terms" className="text-xs font-semibold text-gray-500 leading-relaxed cursor-pointer select-none">
                      I verify all professional credentials provided are accurate and agree to the <span className="text-orange-600 font-bold hover:underline underline-offset-2">Platform Policies</span>.
                    </Label>
                  </div>

                  <Button
                    type="submit"
                    disabled={loading || !isProfileFormValid()}
                    className="w-full h-12 bg-gray-900 hover:bg-black text-white font-black text-sm uppercase tracking-wider rounded-[1.25rem] transition-all shadow-lg hover:scale-[1.02] flex items-center justify-center gap-2 mt-4"
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : (isForm1UpdateMode ? 'Update Account' : 'Initialize Verification')}
                  </Button>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ServiceProviderRegister() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="w-10 h-10 animate-spin text-orange-600" />
      </div>
    }>
      <ServiceProviderRegisterContent />
    </Suspense>
  );
}
