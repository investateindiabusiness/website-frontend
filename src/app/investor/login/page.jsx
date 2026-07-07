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

function InvestorLoginContent() {
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
      if (user.role === 'admin') router.push('/admin/dashboard');
      else if (user.role === 'builder') router.push('/builder/dashboard');
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
      const userData = await loginRequest({ ...formData, role: 'investor' });

      if (userData.role !== 'investor') {
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

      // Check for post-login redirect (e.g. coming from ad "Book this Space" click)
      const pendingRedirect = sessionStorage.getItem('postLoginRedirect');
      if (pendingRedirect === '/advertisements') {
        sessionStorage.removeItem('postLoginRedirect');
        return router.push('/investor/advertisements');
      }

      router.push('/dashboard');

    } catch (err) {
      console.log("[INVESTOR LOGIN] Catch Block Intercepted:", err);

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
          message: errMsg || 'This account is registered as a Builder. Please use the Builder tab.',
          role: 'builder'
        });
        return;
      }

      if (err.error === 'STEP2_PENDING') {
        toast({ title: 'Profile Incomplete', description: 'Please complete your initial profile details.' });
        router.push(`/investor/register?uid=${err.uid}&email=${err.email}&name=${err.name || ''}&skipStep1=true`);
        return;
      } else if (err.error === 'CHANGES_REQUESTED') {
        toast({ title: 'Update Required', description: err.message });
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('onboarding_init_data', JSON.stringify({ userData: err.userData, adminRequests: err.adminRequests, phase: 'CHANGES_REQUESTED' }));
        }
        router.push(`/investor/register?uid=${err.uid}&skipStep1=true&phase=CHANGES_REQUESTED`);
        return;
      } else if (err.error === 'FORM2_PENDING') {
        toast({ title: 'Action Required', description: err.message });
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('onboarding_init_data', JSON.stringify({ userData: err.userData, phase: 'FORM2_PENDING' }));
        }
        router.push(`/investor/register?uid=${err.uid}&skipStep1=true&phase=FORM2_PENDING`);
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
              role: 'investor'
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
            role: 'investor'
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
    router.push('/dashboard');
  };

  const handleGoogleError = (err) => {
    const errMsg = err.message || '';
    if (err.error === 'STEP2_PENDING') {
      toast({ title: 'Profile Incomplete', description: 'Please complete your profile details to continue.' });
      router.push(`/investor/register?uid=${err.uid}&email=${err.email}&name=${err.name || ''}&skipStep1=true`);
    } else if (err.error === 'CHANGES_REQUESTED') {
      toast({ title: 'Update Required', description: err.message });
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('onboarding_init_data', JSON.stringify({ userData: err.userData, adminRequests: err.adminRequests, phase: 'CHANGES_REQUESTED' }));
      }
      router.push(`/investor/register?uid=${err.uid}&skipStep1=true&phase=CHANGES_REQUESTED`);
    } else if (err.error === 'FORM2_PENDING') {
      toast({ title: 'Action Required', description: err.message });
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('onboarding_init_data', JSON.stringify({ userData: err.userData, phase: 'FORM2_PENDING' }));
      }
      router.push(`/investor/register?uid=${err.uid}&skipStep1=true&phase=FORM2_PENDING`);
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
            src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=2070&auto=format&fit=crop"
            alt="investor-bg"
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
            Welcome back <br />
            to <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-300 to-orange-500">the future of realty.</span>
          </h1>
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
                <p className="text-[10px] font-black text-white uppercase tracking-widest">Global Network</p>
                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">Trusted by 2K+ Professionals</p>
              </div>
            </div>
            <p className="text-[10px] text-gray-300 font-medium leading-tight max-w-[280px]">
              "Access to institutional-grade assets with the click of a button."
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
              Investor Login
            </h2>
            <p className="text-gray-400 font-bold mt-1 tracking-wide text-xs">Welcome back to Investate India</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-xs font-bold flex items-center gap-4 animate-in fade-in slide-in-from-top-4">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <GoogleAuthButton onSuccess={handleGoogleSuccess} onError={handleGoogleError} text="Continue with Google" userType="investor" />

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-gray-100" /></div>
            <div className="relative flex justify-center text-[9px] font-black uppercase tracking-[0.3em]"><span className="bg-white px-6 text-gray-400">Security Access</span></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-[10px] font-black text-gray-900 uppercase tracking-widest ml-1">Email Address</Label>
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
                Don't have an account? <Link href="/investor/register" className="text-orange-600 hover:text-orange-700 font-black underline underline-offset-4 decoration-2">Register</Link>
              </p>
            </div>
          </form>
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
                    if (alertModal.role === 'builder') router.push('/builder/login');
                    else setAlertModal(prev => ({ ...prev, isOpen: false }));
                  }}
                  className="w-full h-11 bg-orange-600 hover:bg-orange-700 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-orange-600/10 transition-all"
                >
                  Switch to Builder Tab
                </Button>
              ) : (
                <Button
                  onClick={() => router.push('/investor/register')}
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

export default function InvestorLogin() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="w-10 h-10 animate-spin text-orange-600" />
      </div>
    }>
      <InvestorLoginContent />
    </Suspense>
  );
}
