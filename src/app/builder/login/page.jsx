"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/AuthContext';
import { toast } from '@/hooks/use-toast';
import { loginRequest } from '@/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, LogIn, ArrowRight, AlertCircle, AlertTriangle, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import GoogleAuthButton from '@/components/GoogleAuthButton';
import { getAuth, signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { app } from '@/firebase';

function BuilderLoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, login, loading: authLoading } = useAuth();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [alertModal, setAlertModal] = useState({
    isOpen: false,
    type: '', // 'role_mismatch' | 'not_registered'
    message: '',
    role: '',
  });

  // Redirect to dashboard if already logged in
  useEffect(() => {
    if (!authLoading && user) {
      const resolvedRole = user.role === 'partner' ? 'builder' : user.role;
      if (resolvedRole === 'admin') router.push('/admin/dashboard');
      else if (resolvedRole === 'builder') router.push('/builder/dashboard');
      else if (resolvedRole === 'serviceProvider') router.push('/service-provider/dashboard');
      else router.push('/dashboard');
    }
  }, [user, authLoading, router]);

  // Show session expired toast if parameter is present
  useEffect(() => {
    const expiredParam = searchParams.get('session_expired');
    if (expiredParam === 'true') {
      toast({
        title: "Session Expired",
        description: "Your session has expired. Please log in again.",
        variant: "destructive"
      });
      // Clear query param
      const cleanUrl = window.location.pathname;
      window.history.replaceState({}, '', cleanUrl);
    }
  }, [searchParams]);

  const handleForgotPassword = async () => {
    if (!formData.email) {
      setError("Please enter your email address in the field above first.");
      return;
    }
    setError(null);
    try {
      if (!app) throw new Error("Firebase app is not initialized.");
      const fbAuth = getAuth(app);
      await sendPasswordResetEmail(fbAuth, formData.email);
      toast({
        title: "Reset Email Sent",
        description: `A password reset link has been sent to ${formData.email}.`,
      });
    } catch (err) {
      console.error("Password reset error:", err);
      setError(err.message || "Failed to send reset email. Please verify the email.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!formData.email || !formData.password) {
      return setError('Please enter valid credentials');
    }

    try {
      setSubmitting(true);
      const userData = await loginRequest({ ...formData, role: 'builder' });

      if (userData.role !== 'builder') {
        const registeredRole = userData.role === 'partner' ? 'builder' : userData.role;
        const displayRole = registeredRole === 'investor' ? 'Investor' : (registeredRole === 'builder' ? 'Builder' : registeredRole);
        setAlertModal({
          isOpen: true,
          type: 'role_mismatch',
          message: `This account is registered as a${displayRole === 'Investor' ? 'n' : ''} ${displayRole}. Please use the ${displayRole} tab.`,
          role: registeredRole
        });
        return;
      }

      login(userData);
      toast({ title: 'Login Successful', description: `Welcome back, ${userData.name || 'User'}!` });

      // Silently sign into Firebase so getIdToken() works for Helpdesk API.
      if (app) {
        try {
          const fbAuth = getAuth(app);
          await signInWithEmailAndPassword(fbAuth, formData.email, formData.password).catch(() => {
            // Non-blocking fallback
          });
        } catch (_) { /* non-blocking */ }
      }

      router.push('/builder/dashboard');

    } catch (err) {
      console.log("[BUILDER LOGIN] Catch Block Intercepted:", err);

      const errMsg = err.message || '';
      const isRoleMismatch =
        errMsg.toLowerCase().includes('registered as') ||
        errMsg.toLowerCase().includes('role mismatch') ||
        errMsg.toLowerCase().includes('use the investor tab') ||
        errMsg.toLowerCase().includes('use the builder tab') ||
        errMsg.toLowerCase().includes('use the builder portal');

      if (isRoleMismatch) {
        setAlertModal({
          isOpen: true,
          type: 'role_mismatch',
          message: errMsg || 'This account is registered as an Investor. Please use the Investor tab.',
          role: 'investor'
        });
        return;
      }

      if (err.error === 'STEP2_PENDING') {
        toast({ title: 'Profile Incomplete', description: 'Please complete your initial profile details.' });
        router.push(`/builder/register?uid=${err.uid}&email=${err.email}&name=${err.name || ''}&skipStep1=true`);
        return;
      } else if (err.error === 'CHANGES_REQUESTED') {
        toast({ title: 'Update Required', description: err.message });
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('onboarding_init_data', JSON.stringify({ userData: err.userData, adminRequests: err.adminRequests, phase: 'CHANGES_REQUESTED' }));
        }
        router.push(`/builder/register?uid=${err.uid}&skipStep1=true&phase=CHANGES_REQUESTED`);
        return;
      } else if (err.error === 'FORM2_PENDING') {
        toast({ title: 'Action Required', description: err.message });
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('onboarding_init_data', JSON.stringify({ userData: err.userData, phase: 'FORM2_PENDING' }));
        }
        router.push(`/builder/register?uid=${err.uid}&skipStep1=true&phase=FORM2_PENDING`);
        return;
      }

      const isLoginFailure =
        errMsg.toLowerCase().includes('login failed') ||
        errMsg.toLowerCase().includes('invalid credentials') ||
        err.error === 'INVALID_LOGIN_CREDENTIALS';

      if (isLoginFailure && formData.email) {
        try {
          const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
          const signUpUrl = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${apiKey}`;
          const deleteUrl = `https://identitytoolkit.googleapis.com/v1/accounts:delete?key=${apiKey}`;

          const res = await fetch(signUpUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: formData.email,
              password: 'CheckEmailExistencePassword123!',
              returnSecureToken: true
            })
          });

          const data = await res.json();

          if (res.status === 200) {
            const idToken = data.idToken;
            await fetch(deleteUrl, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ idToken })
            });

            setAlertModal({
              isOpen: true,
              type: 'not_registered',
              message: 'Your email id is not registered. Do register.',
              role: 'builder'
            });
          } else if (data.error?.message === 'EMAIL_EXISTS') {
            setError('Login failed. Please check your credentials.');
          } else {
            setError('Login failed');
          }
        } catch (checkErr) {
          setError('Login failed');
        }
      } else {
        const isNotRegistered =
          errMsg.toLowerCase().includes('user not found') ||
          errMsg.toLowerCase().includes('not registered') ||
          errMsg.toLowerCase().includes('no user found') ||
          errMsg.toLowerCase().includes('not exist') ||
          err.error === 'USER_NOT_FOUND' ||
          err.code === 'auth/user-not-found';

        if (isNotRegistered) {
          setAlertModal({
            isOpen: true,
            type: 'not_registered',
            message: 'Your email id is not registered. Do register.',
            role: 'builder'
          });
        } else {
          setError(errMsg || 'Login failed');
        }
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleSuccess = (userData) => {
    login(userData);
    toast({ title: 'Login Successful', description: `Welcome back, ${userData.name || 'User'}!` });
    
    const targetRole = userData.role === 'partner' ? 'builder' : userData.role;
    if (targetRole === 'admin') router.push('/admin/dashboard');
    else if (targetRole === 'builder') router.push('/builder/dashboard');
    else if (targetRole === 'serviceProvider') router.push('/service-provider/dashboard');
    else router.push('/dashboard');
  };

  const handleGoogleError = (err) => {
    const errMsg = err.message || '';
    if (err.error === 'STEP2_PENDING') {
      toast({ title: 'Profile Incomplete', description: 'Please complete your profile details to continue.' });
      router.push(`/builder/register?uid=${err.uid}&email=${err.email}&name=${err.name || ''}&skipStep1=true`);
    } else if (err.error === 'CHANGES_REQUESTED') {
      toast({ title: 'Update Required', description: err.message });
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('onboarding_init_data', JSON.stringify({ userData: err.userData, adminRequests: err.adminRequests, phase: 'CHANGES_REQUESTED' }));
      }
      router.push(`/builder/register?uid=${err.uid}&skipStep1=true&phase=CHANGES_REQUESTED`);
    } else if (err.error === 'FORM2_PENDING') {
      toast({ title: 'Action Required', description: err.message });
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('onboarding_init_data', JSON.stringify({ userData: err.userData, phase: 'FORM2_PENDING' }));
      }
      router.push(`/builder/register?uid=${err.uid}&skipStep1=true&phase=FORM2_PENDING`);
    } else if (err.error === 'ACCOUNT_UNDER_REVIEW') {
      setError('Your account is currently under review by our administration team.');
    } else {
      setError(errMsg || 'Google authentication failed');
    }
  };

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
      <div className="hidden lg:flex lg:w-[40%] relative overflow-hidden p-10 flex-col justify-between z-10 min-h-screen bg-black select-none">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-white/10 z-[1]" />
          <img
            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop"
            alt="builder-bg"
            className="absolute inset-0 w-full h-full object-cover opacity-[0.6] brightness-110 contrast-105 saturate-[1.1]"
          />
          <div className="absolute top-[-5%] right-[-5%] w-[40%] h-[20%] bg-orange-200/20 blur-[60px] rounded-full" />
        </div>

        <div className="relative z-20 flex flex-col items-start gap-4">
          <Link href="/" className="inline-flex items-center gap-2 text-xs font-bold text-white/80 uppercase tracking-wider hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
          <div className="inline-flex items-center gap-2 bg-orange-600 px-3 py-1 rounded-full shadow-lg shadow-orange-600/20">
            <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Platform Access</span>
          </div>
          <h1 className="text-4xl font-black mt-2 mb-10 leading-[1.1] tracking-tight text-white">
            Build the future <br />
            with <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-300 to-orange-500">precision.</span>
          </h1>
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
              className="flex items-center justify-center gap-2 px-3 py-2 bg-white/10 hover:bg-white/15 text-white rounded-xl transition duration-300 shadow-md shadow-black/10 select-none group border border-white/5"
            >
              <svg className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-.96.04-2.13.64-2.82 1.45-.6.69-1.12 1.84-.98 2.94.1.08.2.12.3.12.87 0 1.95-.57 2.51-1.45z"/>
              </svg>
              <div className="flex flex-col text-left">
                <span className="text-[7px] font-black text-white/50 uppercase tracking-widest leading-none">Download on</span>
                <span className="text-[10px] font-black text-white tracking-wide leading-none mt-0.5">App Store</span>
              </div>
            </a>

            <a
              href="#"
              onClick={(e) => e.preventDefault()}
              className="flex items-center justify-center gap-2 px-3 py-2 bg-white/10 hover:bg-white/15 text-white rounded-xl transition duration-300 shadow-md shadow-black/10 select-none group border border-white/5"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3.25098 2.32764C3.0768 2.50854 2.97852 2.78453 2.97852 3.12591V20.8741C2.97852 21.2155 3.0768 21.4915 3.25098 21.6724L3.31305 21.7291L13.1118 11.9304V11.8105L3.31305 2.01172L3.25098 2.32764Z" fill="#EA4335" />
                <path d="M16.3776 15.2016L13.1113 11.9353V11.8153L16.3789 8.54898L16.4526 8.59102L20.3204 10.79C21.4227 11.417 21.4227 12.4363 20.3204 13.0633L16.4526 15.2623L16.3776 15.2016Z" fill="#FBBC05" />
                <path d="M13.2305 11.8754L3.3125 21.7933C3.65586 22.1557 4.21857 22.1977 4.8711 21.8267L16.3778 15.2818L13.2305 11.8754Z" fill="#34A853" />
                <path d="M13.2305 11.8754L16.3778 8.469L4.8711 1.92408C4.21857 1.55305 3.65586 1.59509 3.3125 1.9575L13.2305 11.8754Z" fill="#4285F4" />
              </svg>
              <div className="flex flex-col text-left">
                <span className="text-[7px] font-black text-white/50 uppercase tracking-widest leading-none">Get it on</span>
                <span className="text-[10px] font-black text-white tracking-wide leading-none mt-0.5">Google Play</span>
              </div>
            </a>
          </div>
        </div>

        <div className="relative z-20 space-y-5">
          <div className="pt-8 border-t border-white/10 flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <div className="flex -space-x-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="w-9 h-9 rounded-full border-2 border-black bg-gray-800 overflow-hidden shadow-sm">
                    <img src={`https://i.pravatar.cc/100?img=${i + 20}`} alt="user" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
              <div className="flex flex-col">
                <p className="text-[10px] font-black text-white uppercase tracking-widest">Developer Network</p>
                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">Connect with NRI Investors</p>
              </div>
            </div>
            <p className="text-[10px] text-gray-300 font-medium leading-tight max-w-[280px]">
              "The most transparent real estate investment platform I've used in years."
            </p>
          </div>
        </div>
      </div>
      {/* Main content - Right (Full height scrollable) */}
      <div className="flex-grow min-h-screen bg-white flex flex-col justify-center py-10 px-6 md:px-12 lg:px-20 overflow-y-auto">
        <div className="w-full max-w-md mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-black tracking-tight text-gray-900 uppercase">
              Builder Login
            </h2>
            <p className="text-gray-400 font-bold mt-1 tracking-wide text-xs">Welcome back to Investate India</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-xs font-bold flex items-center gap-4 animate-in fade-in slide-in-from-top-4">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <GoogleAuthButton onSuccess={handleGoogleSuccess} onError={handleGoogleError} text="Continue with Google" userType="builder" />

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-gray-100" /></div>
            <div className="relative flex justify-center text-[9px] font-black uppercase tracking-[0.3em]"><span className="bg-white px-6 text-gray-400">Security Access</span></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-[10px] font-black text-gray-900 uppercase tracking-widest ml-1">Work Email</Label>
                <Input id="email" type="email" autoComplete="off" placeholder="name@company.com" value={formData.email} onChange={(e) => { setFormData({ ...formData, email: e.target.value }); setError(null); }} required className="h-11 px-6 bg-gray-50 border-gray-200 focus:bg-white focus:ring-[6px] focus:ring-orange-500/5 focus:border-orange-500 transition-all duration-300 rounded-2xl text-sm font-bold placeholder:text-gray-300" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-[10px] font-black text-gray-900 uppercase tracking-widest ml-1">Password</Label>
                  <button type="button" onClick={handleForgotPassword} className="text-[9px] font-black text-orange-600 uppercase tracking-widest hover:underline">Forgot?</button>
                </div>
                <div className="relative">
                  <Input id="password" type={showPassword ? 'text' : 'password'} autoComplete="new-password" placeholder="••••••••" value={formData.password} onChange={(e) => { setFormData({ ...formData, password: e.target.value }); setError(null); }} required className="h-11 px-6 pr-12 bg-gray-50 border-gray-200 focus:bg-white focus:ring-[6px] focus:ring-orange-500/5 focus:border-orange-500 transition-all duration-300 rounded-2xl text-sm font-bold placeholder:text-gray-300" />
                  <button type="button" onClick={() => setShowPassword(prev => !prev)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 transition-colors" tabIndex={-1}>
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-gray-900 hover:bg-black text-white font-black text-base rounded-[1.25rem] mt-4 shadow-2xl shadow-black/10 transition-all hover:scale-[1.02] active:scale-[0.98]"
              disabled={submitting}
            >
              {submitting ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Signing In...</> : <div className="flex items-center justify-center gap-3 text-sm uppercase tracking-wider font-black">Sign In <ArrowRight className="h-5 w-5" /></div>}
            </Button>

            <div className="text-center pt-2">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                Don't have an account? <Link href="/builder/register" className="text-orange-600 hover:text-orange-700 font-black underline underline-offset-4 decoration-2">Register</Link>
              </p>
            </div>
          </form>

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
                className="flex items-center justify-center gap-2 px-3 py-2 bg-gray-900 hover:bg-black text-white rounded-xl transition duration-300 shadow-md shadow-black/10 select-none group border border-gray-800"
              >
                <svg className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-.96.04-2.13.64-2.82 1.45-.6.69-1.12 1.84-.98 2.94.1.08.2.12.3.12.87 0 1.95-.57 2.51-1.45z"/>
                </svg>
                <div className="flex flex-col text-left">
                  <span className="text-[7px] font-black text-white/50 uppercase tracking-widest leading-none">Download on</span>
                  <span className="text-[10px] font-black text-white tracking-wide leading-none mt-0.5">App Store</span>
                </div>
              </a>

              <a
                href="#"
                onClick={(e) => e.preventDefault()}
                className="flex items-center justify-center gap-2 px-3 py-2 bg-gray-900 hover:bg-black text-white rounded-xl transition duration-300 shadow-md shadow-black/10 select-none group border border-gray-800"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3.25098 2.32764C3.0768 2.50854 2.97852 2.78453 2.97852 3.12591V20.8741C2.97852 21.2155 3.0768 21.4915 3.25098 21.6724L3.31305 21.7291L13.1118 11.9304V11.8105L3.31305 2.01172L3.25098 2.32764Z" fill="#EA4335" />
                  <path d="M16.3776 15.2016L13.1113 11.9353V11.8153L16.3789 8.54898L16.4526 8.59102L20.3204 10.79C21.4227 11.417 21.4227 12.4363 20.3204 13.0633L16.4526 15.2623L16.3776 15.2016Z" fill="#FBBC05" />
                  <path d="M13.2305 11.8754L3.3125 21.7933C3.65586 22.1557 4.21857 22.1977 4.8711 21.8267L16.3778 15.2818L13.2305 11.8754Z" fill="#34A853" />
                  <path d="M13.2305 11.8754L16.3778 8.469L4.8711 1.92408C4.21857 1.55305 3.65586 1.59509 3.3125 1.9575L13.2305 11.8754Z" fill="#4285F4" />
                </svg>
                <div className="flex flex-col text-left">
                  <span className="text-[7px] font-black text-white/50 uppercase tracking-widest leading-none">Get it on</span>
                  <span className="text-[10px] font-black text-white tracking-wide leading-none mt-0.5">Google Play</span>
                </div>
              </a>
            </div>
          </div>

        </div>
      </div>

      {/* Alert Modals */}
      {alertModal.isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-[420px] p-6 bg-white border border-gray-100 shadow-[0_24px_48px_-10px_rgba(0,0,0,0.18)] rounded-3xl flex flex-col items-center text-center animate-in zoom-in-95 duration-200">
            {alertModal.type === 'role_mismatch' ? (
              <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center mb-4 text-amber-600 shadow-inner">
                <AlertTriangle className="w-7 h-7" />
              </div>
            ) : (
              <div className="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center mb-4 text-orange-600 shadow-inner">
                <LogIn className="w-7 h-7" />
              </div>
            )}

            <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight mb-2">
              {alertModal.type === 'role_mismatch' ? 'Account Role Mismatch' : 'Account Not Found'}
            </h3>
            <p className="text-xs text-gray-500 font-semibold leading-relaxed mb-6 px-2">
              {alertModal.message}
            </p>

            <div className="flex flex-col gap-2 w-full">
              {alertModal.type === 'role_mismatch' ? (
                <Button
                  onClick={() => {
                    if (alertModal.role === 'investor') router.push('/investor/login');
                    else setAlertModal(prev => ({ ...prev, isOpen: false }));
                  }}
                  className="w-full h-11 bg-orange-600 hover:bg-orange-700 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-orange-600/10 transition-all"
                >
                  Switch to Investor Tab
                </Button>
              ) : (
                <Button
                  onClick={() => router.push('/builder/register')}
                  className="w-full h-11 bg-orange-600 hover:bg-orange-700 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-orange-600/10 transition-all"
                >
                  Register Now
                </Button>
              )}
              <Button
                variant="outline"
                onClick={() => setAlertModal(prev => ({ ...prev, isOpen: false }))}
                className="w-full h-11 border-gray-200 text-gray-500 font-black text-xs uppercase tracking-wider rounded-xl hover:bg-gray-50"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function BuilderLogin() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="w-10 h-10 animate-spin text-orange-600" />
      </div>
    }>
      <BuilderLoginContent />
    </Suspense>
  );
}
