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

function ServiceProviderLoginContent() {
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
      else if (user.role === 'serviceProvider') router.push('/service-provider/dashboard');
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
      const userData = await loginRequest({ ...formData, role: 'serviceProvider' });

      if (userData.role !== 'serviceProvider') {
        const registeredRole = userData.role === 'partner' ? 'builder' : userData.role;
        const displayRole = registeredRole === 'investor' ? 'Investor' : (registeredRole === 'builder' ? 'Builder' : (registeredRole === 'serviceProvider' ? 'Service Provider' : registeredRole));
        setAlertModal({
          isOpen: true,
          type: 'role_mismatch',
          message: `This account is registered as a ${displayRole}. Please use the ${displayRole} tab.`,
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
        return router.push('/service-provider/advertisements');
      }

      router.push('/service-provider/dashboard');

    } catch (err) {
      console.log("[SERVICE PROVIDER LOGIN] Catch Block Intercepted:", err);

      const errMsg = err.message || '';
      const isRoleMismatch = 
        errMsg.toLowerCase().includes('registered as') ||
        errMsg.toLowerCase().includes('role mismatch') ||
        errMsg.toLowerCase().includes('use the investor tab') ||
        errMsg.toLowerCase().includes('use the builder tab') ||
        errMsg.toLowerCase().includes('use the service provider tab') ||
        errMsg.toLowerCase().includes('use the builder portal');

      if (isRoleMismatch) {
        let detectedRole = 'investor';
        if (errMsg.toLowerCase().includes('builder')) detectedRole = 'builder';
        else if (errMsg.toLowerCase().includes('service provider')) detectedRole = 'serviceProvider';

        const displayRole = detectedRole === 'investor' ? 'Investor' : (detectedRole === 'builder' ? 'Builder' : 'Service Provider');

        setAlertModal({
          isOpen: true,
          type: 'role_mismatch',
          message: errMsg || `This account is registered as a ${displayRole}. Please use the ${displayRole} tab.`,
          role: detectedRole
        });
        return;
      }

      if (err.error === 'STEP2_PENDING') {
        toast({ title: 'Profile Incomplete', description: 'Please complete your initial profile details.' });
        router.push(`/service-provider/register?uid=${err.uid}&email=${err.email}&name=${err.name || ''}&skipStep1=true`);
        return;
      } else if (err.error === 'CHANGES_REQUESTED') {
        toast({ title: 'Update Required', description: err.message });
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('onboarding_init_data', JSON.stringify({ userData: err.userData, adminRequests: err.adminRequests, phase: 'CHANGES_REQUESTED' }));
        }
        router.push(`/service-provider/register?uid=${err.uid}&skipStep1=true&phase=CHANGES_REQUESTED`);
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
              role: 'serviceProvider'
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
        setError(errMsg || 'An unexpected error occurred. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleSuccess = (userData) => {
    login(userData);
    toast({ title: 'Login Successful', description: `Welcome back, ${userData.name || 'User'}!` });
    router.push('/service-provider/dashboard');
  };

  const handleGoogleError = (err) => {
    console.log("[GOOGLE AUTH ERROR] Details:", err);
    const errMsg = err.message || '';

    if (err.error === 'STEP2_PENDING') {
      toast({ title: 'Profile Incomplete', description: 'Please complete your initial profile details.' });
      router.push(`/service-provider/register?uid=${err.uid}&email=${err.email}&name=${err.name || ''}&skipStep1=true`);
      return;
    } else if (err.error === 'CHANGES_REQUESTED') {
      toast({ title: 'Update Required', description: err.message });
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('onboarding_init_data', JSON.stringify({ userData: err.userData, adminRequests: err.adminRequests, phase: 'CHANGES_REQUESTED' }));
      }
      router.push(`/service-provider/register?uid=${err.uid}&skipStep1=true&phase=CHANGES_REQUESTED`);
      return;
    }

    setError(errMsg || 'Google authentication failed.');
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="w-10 h-10 animate-spin text-orange-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-white overflow-hidden font-sans">
      
      {/* Mobile Back Button */}
      <div className="lg:hidden p-4 border-b border-gray-100 flex items-center bg-white">
        <Link href="/service-provider" className="inline-flex items-center gap-2 text-xs font-bold text-gray-600 uppercase tracking-wider hover:text-gray-900 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Page
        </Link>
      </div>

      {/* Sidebar - Left (Full height on Desktop) */}
      <div className="hidden lg:flex lg:w-[40%] relative overflow-hidden p-10 flex-col justify-between z-10 min-h-screen bg-black select-none">
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
            <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Platform Access</span>
          </div>
          <h1 className="text-4xl font-black mt-2 mb-10 leading-[1.1] tracking-tight text-white">
            Welcome back <br />
            to <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-300 to-orange-500">the partner ecosystem.</span>
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

        <div className="relative z-20 space-y-5">
          <div className="pt-8 border-t border-white/10 flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <div className="flex -space-x-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="w-9 h-9 rounded-full border-2 border-black bg-gray-800 overflow-hidden shadow-sm">
                    <img src={`https://i.pravatar.cc/100?img=${i + 30}`} alt="user" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
              <div className="flex flex-col">
                <p className="text-[10px] font-black text-white uppercase tracking-widest">Global Network</p>
                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">Trusted by 2K+ Professionals</p>
              </div>
            </div>
            <p className="text-[10px] text-gray-300 font-medium leading-tight max-w-[280px]">
              "Connecting premium real estate developers and institutional service experts globally."
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
              Service Provider Login
            </h2>
            <p className="text-gray-400 font-bold mt-1 tracking-wide text-xs">Welcome back to Investate India</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-xs font-bold flex items-center gap-4 animate-in fade-in slide-in-from-top-4">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <GoogleAuthButton onSuccess={handleGoogleSuccess} onError={handleGoogleError} text="Continue with Google" userType="serviceProvider" />

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-gray-100" /></div>
            <div className="relative flex justify-center text-[9px] font-black uppercase tracking-[0.3em]"><span className="bg-white px-6 text-gray-400">Security Access</span></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-[10px] font-black text-gray-900 uppercase tracking-widest ml-1">Email Address</Label>
                <Input id="email" type="email" autoComplete="off" placeholder="partner@company.com" value={formData.email} onChange={(e) => { setFormData({ ...formData, email: e.target.value }); setError(null); }} required className="h-11 px-6 bg-gray-50 border-gray-200 focus:bg-white focus:ring-[6px] focus:ring-orange-500/5 focus:border-orange-500 transition-all duration-300 rounded-2xl text-sm font-bold placeholder:text-gray-300" />
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
                Don't have an account? <Link href="/service-provider/register" className="text-orange-600 hover:text-orange-700 font-black underline underline-offset-4 decoration-2">Register</Link>
              </p>
            </div>
          </form>
        </div>
      </div>

      {/* Alert Modals */}
      {alertModal.isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-white border border-gray-100 rounded-3xl max-w-sm w-full p-6 text-center animate-in fade-in zoom-in duration-200 shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-orange-500/10 border border-orange-500/20 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-6 h-6 text-orange-500" />
            </div>
            
            <h3 className="text-lg font-black text-gray-900 mb-2 uppercase tracking-wide">
              {alertModal.type === 'role_mismatch' ? 'Role Mismatch' : 'Account Not Found'}
            </h3>
            
            <p className="text-sm text-gray-500 mb-6 font-semibold leading-relaxed">
              {alertModal.message}
            </p>

            <div className="flex flex-col gap-2 w-full">
              {alertModal.type === 'role_mismatch' ? (
                <Button
                  onClick={() => {
                    if (alertModal.role === 'investor') router.push('/investor/login');
                    else if (alertModal.role === 'builder') router.push('/builder/login');
                    else setAlertModal(prev => ({ ...prev, isOpen: false }));
                  }}
                  className="w-full h-11 bg-orange-600 hover:bg-orange-700 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-orange-600/10 transition-all"
                >
                  Switch Tab
                </Button>
              ) : (
                <Button
                  onClick={() => router.push('/service-provider/register')}
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

export default function ServiceProviderLogin() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="w-10 h-10 animate-spin text-orange-600" />
      </div>
    }>
      <ServiceProviderLoginContent />
    </Suspense>
  );
}
