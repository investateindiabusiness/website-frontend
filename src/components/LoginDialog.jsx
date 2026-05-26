"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/AuthContext';
import { toast } from '@/hooks/use-toast';
import { loginRequest } from '@/api';
import { Loader2, LogIn, ArrowRight, LayoutDashboard, ShieldCheck, Building2, AlertCircle } from 'lucide-react';
import GoogleAuthButton from '@/components/GoogleAuthButton';

const LoginDialog = ({ isOpen, onOpenChange, onSwitchToRegister, initialData = {} }) => {
  const router = useRouter();
  const { login } = useAuth();

  const [userType, setUserType] = useState('investor');
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen && initialData?.userType) {
      setUserType(initialData.userType);
    }
  }, [isOpen, initialData]);

  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setFormData({ email: '', password: '' });
        setError(null);
      }, 300);
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!formData.email || !formData.password) {
      return setError('Please enter valid credentials');
    }

    try {
      setSubmitting(true);
      const userData = await loginRequest({ ...formData, role: userType });

      login(userData);
      toast({ title: 'Login Successful', description: `Welcome back, ${userData.name || 'User'}!` });
      onOpenChange(false);

      if (userData.role === 'admin') router.push('/admin/dashboard');
      else if (userData.role === 'builder') router.push('/builder/dashboard');
      else router.push('/dashboard');

    } catch (err) {
      console.log("[1. LOGIN DIALOG] Catch Block Intercepted:", err);

      if (err.error === 'STEP2_PENDING') {
        toast({ title: 'Profile Incomplete', description: 'Please complete your initial profile details.' });
        onOpenChange(false);
        setTimeout(() => {
          onSwitchToRegister({ uid: err.uid, email: err.email, name: err.name, skipStep1: true, userType: userType });
        }, 300);

      } else if (err.error === 'CHANGES_REQUESTED') {
        // --- NEW: Route to Register Dialog with Update Data ---
        toast({ title: 'Update Required', description: err.message });
        onOpenChange(false);
        setTimeout(() => {
          onSwitchToRegister({
            uid: err.uid,
            userType: userType,
            skipStep1: true,
            phase: 'CHANGES_REQUESTED',
            adminRequests: err.adminRequests,
            userData: err.userData
          });
        }, 300);

      } else if (err.error === 'FORM2_PENDING') {
        toast({ title: 'Action Required', description: err.message });
        onOpenChange(false);
        setTimeout(() => {
          onSwitchToRegister({
            uid: err.uid,
            userType: userType,
            skipStep1: true,
            phase: 'FORM2_PENDING', // Tell RegisterDialog to open Form 2
            userData: err.userData  // Pass user data for read-only fields
          });
        }, 300);
      } else if (err.error === 'ACCOUNT_UNDER_REVIEW') {
        setError('Your account is currently under review by our administration team.');
      } else {
        setError(err.message || 'Invalid credentials. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleSuccess = (userData) => {
    setError(null);
    login(userData);
    toast({ title: 'Login Successful', description: `Welcome back, ${userData.name}!` });
    onOpenChange(false);

    if (userData.role === 'admin') router.push('/admin/dashboard');
    else if (userData.role === 'builder') router.push('/builder/dashboard');
    else router.push('/dashboard');
  };

  const handleGoogleError = (err) => {
    console.log("Google Login Error Intercepted:", err);

    if (err.error === 'STEP2_PENDING') {
      toast({ title: 'Profile Incomplete', description: 'Please complete your profile details to continue.' });
      onOpenChange(false);
      setTimeout(() => {
        onSwitchToRegister({ uid: err.uid, email: err.email, name: err.name, skipStep1: true, userType: userType });
      }, 300);

    } else if (err.error === 'CHANGES_REQUESTED') {
      // --- NEW: Route to Register Dialog with Update Data ---
      toast({ title: 'Update Required', description: err.message });
      onOpenChange(false);
      setTimeout(() => {
        onSwitchToRegister({
          uid: err.uid,
          userType: userType,
          skipStep1: true,
          phase: 'CHANGES_REQUESTED',
          adminRequests: err.adminRequests,
          userData: err.userData
        });
      }, 300);

    } else if (err.error === 'FORM2_PENDING') {
      toast({ title: 'Action Required', description: err.message });
      onOpenChange(false);
      setTimeout(() => {
        onSwitchToRegister({
          uid: err.uid,
          userType: userType,
          skipStep1: true,
          phase: 'FORM2_PENDING', // Tell RegisterDialog to open Form 2
          userData: err.userData  // Pass user data for read-only fields
        });
      }, 300);
    } else if (err.error === 'ACCOUNT_UNDER_REVIEW') {
      setError('Your account is currently under review by our administration team.');
    } else {
      setError(err.message || 'Google authentication failed');
    }
  };

  const content = {
    investor: {
      image: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop",
      title: "Welcome back to", highlight: "the future of realty.",
      desc: "Sign in to manage your portfolio, track project progress, and discover exclusive new investment opportunities.",
      emailLabel: "Email Address"
    },
    builder: {
      image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop",
      title: "Build the future with", highlight: "precision.",
      desc: "Access your builder dashboard to manage projects, track milestones, and connect with investors seamlessly.",
      emailLabel: "Work Email"
    }
  };

  const activeContent = content[userType];
  const inputStyle = "h-11 px-4 bg-white border-gray-200 focus:bg-white focus:ring-2 focus:ring-orange-500/10 focus:border-orange-500 transition-all rounded-lg";
  const labelStyle = "text-sm font-semibold text-gray-700 block";

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[95vw] md:max-w-[850px] p-0 overflow-hidden bg-white border-none shadow-[0_32px_64px_-15px_rgba(0,0,0,0.2)] flex flex-col lg:flex-row max-h-[90vh] md:max-h-[92vh] z-50 rounded-[2.5rem]">

        <DialogTitle className="sr-only">
          Login Dialog
        </DialogTitle>

        <DialogDescription className="sr-only">
          Sign in as investor or builder to access your dashboard.
        </DialogDescription>

        {/* Sidebar */}
        <div className="hidden lg:flex lg:w-[40%] relative overflow-hidden p-8 lg:p-10 flex-col justify-between group transition-all duration-700 hover:shadow-2xl z-10">
          <div className="absolute inset-0 z-0 bg-black">
            {/* Minimal overlay for text readability, but keeping image very clear */}
            <div className="absolute inset-0 bg-white/10 z-[1]" />
            <img
              src={activeContent.image}
              alt="bg"
              className="absolute inset-0 w-full h-full object-cover opacity-[0.6] brightness-110 contrast-105 saturate-[1.1]"
            />
            {/* Subtle Decorative Blobs */}
            <div className="absolute top-[-5%] right-[-5%] w-[40%] h-[20%] bg-orange-200/20 blur-[60px] rounded-full" />
          </div>

          <div className="relative z-20">
            <div className="inline-flex items-center gap-2 bg-orange-600 px-3 py-1 rounded-full mb-8 shadow-lg shadow-orange-600/20">
              <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Platform Access</span>
            </div>
            <h1 className="text-4xl font-black mb-10 leading-[1.1] tracking-tight text-white">
              {activeContent.title} <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-300 to-orange-500">
                {activeContent.highlight}
              </span>
            </h1>
          </div>

          <div className="relative z-20 space-y-5">
            <div className="pt-8 border-t border-white/10 flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <div className="flex -space-x-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="w-9 h-9 rounded-full border-2 border-black bg-gray-800 overflow-hidden shadow-sm">
                      <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="u" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
                <div className="flex flex-col">
                  <p className="text-[10px] font-black text-white uppercase tracking-widest">Global Network</p>
                  <p className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">Trusted by 2k+ Professionals</p>
                </div>
              </div>
              <p className="text-[10px] text-gray-300 font-medium leading-tight max-w-[240px]">
                "Access to institutional-grade assets with the click of a button."
              </p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto relative custom-scrollbar bg-white flex flex-col">
          <div className="flex-1 p-6 md:px-12 lg:px-14 py-8 md:py-10 flex flex-col justify-center">
            <div className="w-full max-w-md mx-auto">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-black tracking-tight text-gray-900 uppercase">
                  {userType === 'investor' ? 'Investor Login' : 'Builder Login'}
                </h2>
                <p className="text-gray-400 font-bold mt-1 tracking-wide text-xs">Welcome back!</p>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-xs font-bold flex items-center gap-4 animate-in fade-in slide-in-from-top-4">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <GoogleAuthButton onSuccess={handleGoogleSuccess} onError={handleGoogleError} text="Continue with Google" userType={userType} />

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-gray-100" /></div>
                <div className="relative flex justify-center text-[9px] font-black uppercase tracking-[0.3em]"><span className="bg-white px-6 text-gray-400">Security Access</span></div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-[10px] font-black text-gray-900 uppercase tracking-widest ml-1">{activeContent.emailLabel}</Label>
                    <Input id="email" type="email" autoComplete="off" placeholder="name@company.com" value={formData.email} onChange={(e) => { setFormData({ ...formData, email: e.target.value }); setError(null); }} required className="h-11 px-6 bg-gray-50 border-gray-200 focus:bg-white focus:ring-[6px] focus:ring-orange-500/5 focus:border-orange-500 transition-all duration-300 rounded-2xl text-sm font-bold placeholder:text-gray-300" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password" className="text-[10px] font-black text-gray-900 uppercase tracking-widest ml-1">Password</Label>
                      <button type="button" className="text-[9px] font-black text-orange-600 uppercase tracking-widest hover:underline">Forgot?</button>
                    </div>
                    <Input id="password" type="password" autoComplete="new-password" placeholder="••••••••" value={formData.password} onChange={(e) => { setFormData({ ...formData, password: e.target.value }); setError(null); }} required className="h-11 px-6 bg-gray-50 border-gray-200 focus:bg-white focus:ring-[6px] focus:ring-orange-500/5 focus:border-orange-500 transition-all duration-300 rounded-2xl text-sm font-bold placeholder:text-gray-300" />
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
                    Don't have an account? <button type="button" onClick={() => onSwitchToRegister(userType)} className="text-orange-600 hover:text-orange-700 font-black underline underline-offset-4 decoration-2">Register</button>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LoginDialog;