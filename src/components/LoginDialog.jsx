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
      else if (userData.role === 'builder') router.push('/partner/dashboard');
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
    else if (userData.role === 'builder') router.push('/partner/dashboard');
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
      desc: "Access your partner dashboard to manage projects, track milestones, and connect with investors seamlessly.",
      emailLabel: "Work Email"
    }
  };

  const activeContent = content[userType];
  const inputStyle = "h-11 px-4 bg-white border-gray-200 focus:bg-white focus:ring-2 focus:ring-orange-500/10 focus:border-orange-500 transition-all rounded-lg";
  const labelStyle = "text-sm font-semibold text-gray-700 block";

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[95vw] md:max-w-6xl p-0 overflow-hidden bg-white border-none shadow-[0_32px_64px_-15px_rgba(0,0,0,0.2)] flex flex-col lg:flex-row max-h-[90vh] md:max-h-[92vh] z-50 rounded-[2.5rem]">

        <DialogTitle className="sr-only">
          Login Dialog
        </DialogTitle>

        <DialogDescription className="sr-only">
          Sign in as investor or partner to access your dashboard.
        </DialogDescription>
        
        {/* Vertex Inspired Sidebar - High Key & Airy */}
        <div className="hidden lg:flex lg:w-[35%] relative bg-gray-50 flex-col justify-between p-12 overflow-hidden transition-all duration-700">
          <div className="absolute inset-0 z-0">
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
            <h1 className="text-4xl font-black mb-10 leading-[1.1] tracking-tight text-gray-900">
              {activeContent.title} <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-700">
                {activeContent.highlight}
              </span>
            </h1>

            {/* Repositioned Floating Chips - Moved down and simplified for a cleaner look */}
            <div className="relative h-72 mt-6 pointer-events-none">
               <div className="absolute top-[5%] left-[5%] px-4 py-2 bg-gray-900 rounded-full shadow-xl border border-gray-800 flex items-center gap-2 animate-float-slow">
                  <div className="w-1.5 h-1.5 rounded-full bg-orange-400 shadow-[0_0_8px_rgba(251,146,60,0.3)]" />
                  <span className="text-[9px] font-black text-white uppercase tracking-[0.2em]">Growth Intel</span>
               </div>
               <div className="absolute top-[22%] right-[8%] px-4 py-2 bg-white rounded-full shadow-xl border border-gray-100 flex items-center gap-2 animate-float">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.3)]" />
                  <span className="text-[9px] font-black text-gray-700 uppercase tracking-[0.2em]">Live Yield</span>
               </div>
               <div className="absolute top-[48%] left-[0%] px-4 py-2 bg-white/90 backdrop-blur-md rounded-full shadow-xl border border-white/50 flex items-center gap-2 animate-float-sideways">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.3)]" />
                  <span className="text-[9px] font-black text-gray-700 uppercase tracking-[0.2em]">Portfolio Live</span>
               </div>
               <div className="absolute top-[38%] left-[55%] px-4 py-2 bg-gray-900 rounded-full shadow-xl border border-gray-800 flex items-center gap-2 animate-float-slow">
                  <div className="w-1.5 h-1.5 rounded-full bg-purple-400 shadow-[0_0_8px_rgba(192,132,252,0.3)]" />
                  <span className="text-[9px] font-black text-white uppercase tracking-[0.2em]">Secure Access</span>
               </div>
               <div className="absolute top-[75%] left-[12%] px-4 py-2 bg-gray-900 rounded-full shadow-xl border border-gray-800 flex items-center gap-2 animate-float">
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.3)]" />
                  <span className="text-[9px] font-black text-white uppercase tracking-[0.2em]">Wealth Intel</span>
               </div>
            </div>

            {/* Description & Points Commented Out as requested */}
            {/* 
            <p className="text-base text-gray-500 mb-10 leading-relaxed font-medium max-w-sm">{activeContent.desc}</p>
            {[
              { text: "Secure Dashboard Access", icon: LayoutDashboard },
              { text: userType === 'investor' ? "Real-time Portfolio Tracking" : "Direct Investor Communication", icon: ArrowRight },
              { text: userType === 'investor' ? "Encrypted Data Protection" : "Secure Document Management", icon: ShieldCheck }
            ].map((item, index) => (
              <div key={index} className="flex items-center gap-4 group">
                <div className="flex-shrink-0 w-10 h-10 rounded-2xl bg-white shadow-sm border border-gray-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <item.icon className="h-4 w-4 text-orange-600" />
                </div>
                <span className="text-xs font-bold text-gray-600 tracking-wide">{item.text}</span>
              </div>
            ))}
            */}
          </div>

          <div className="relative z-20 space-y-5">
            <div className="pt-8 border-t border-black/5 flex flex-col gap-4">
               <div className="flex items-center gap-4">
                  <div className="flex -space-x-3">
                     {[1, 2, 3].map((i) => (
                       <div key={i} className="w-9 h-9 rounded-full border-2 border-white bg-gray-200 overflow-hidden shadow-sm">
                         <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="u" className="w-full h-full object-cover" />
                       </div>
                     ))}
                  </div>
                  <div className="flex flex-col">
                    <p className="text-[10px] font-black text-gray-900 uppercase tracking-widest">Global Network</p>
                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">Trusted by 2k+ Professionals</p>
                  </div>
               </div>
               <p className="text-[10px] text-gray-500 font-medium leading-tight max-w-[240px]">
                 "Access to institutional-grade assets with the click of a button."
               </p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto relative custom-scrollbar bg-white">
          <div className="p-6 md:p-12 lg:p-14 pt-12 md:pt-12">
            {/* Vertex-style Segmented Control */}
            <div className="inline-flex bg-gray-100 p-1 rounded-[1.25rem] mb-6 w-full shadow-inner border border-gray-200/50">
              <button
                onClick={() => {
                  setUserType('investor');
                  setFormData({ email: '', password: '' })
                  setError(null);
                }}
                className={`flex-1 py-3.5 text-[10px] font-black uppercase tracking-widest rounded-[1rem] transition-all duration-300 ${userType === 'investor' ? 'bg-white shadow-lg text-orange-600 ring-1 ring-black/5' : 'text-gray-400 hover:text-gray-600'}`}
              >
                Investor
              </button>
              <button
                onClick={() => {
                  setUserType('builder');
                  setFormData({ email: '', password: '' })
                  setError(null);
                }}
                className={`flex-1 py-3.5 text-[10px] font-black uppercase tracking-widest rounded-[1rem] transition-all duration-300 ${userType === 'builder' ? 'bg-white shadow-lg text-orange-600 ring-1 ring-black/5' : 'text-gray-400 hover:text-gray-600'}`}
              >
                Partner
              </button>
            </div>

            <div className="text-left mb-6">
               <h2 className="text-2xl font-black tracking-tight text-gray-900 uppercase">
                  Log In
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
                  <Input id="email" type="email" placeholder="name@company.com" value={formData.email} onChange={(e) => { setFormData({ ...formData, email: e.target.value }); setError(null); }} required className="h-11 px-6 bg-gray-50 border-gray-200 focus:bg-white focus:ring-[6px] focus:ring-orange-500/5 focus:border-orange-500 transition-all duration-300 rounded-2xl text-sm font-bold placeholder:text-gray-300" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-[10px] font-black text-gray-900 uppercase tracking-widest ml-1">Password</Label>
                    <button type="button" className="text-[9px] font-black text-orange-600 uppercase tracking-widest hover:underline">Forgot?</button>
                  </div>
                  <Input id="password" type="password" placeholder="••••••••" value={formData.password} onChange={(e) => { setFormData({ ...formData, password: e.target.value }); setError(null); }} required className="h-11 px-6 bg-gray-50 border-gray-200 focus:bg-white focus:ring-[6px] focus:ring-orange-500/5 focus:border-orange-500 transition-all duration-300 rounded-2xl text-sm font-bold placeholder:text-gray-300" />
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full h-12 bg-gray-900 hover:bg-black text-white font-black text-base rounded-[1.25rem] mt-4 shadow-2xl shadow-black/10 transition-all hover:scale-[1.02] active:scale-[0.98]" 
                disabled={submitting}
              >
                {submitting ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Signing In...</> : <div className="flex items-center justify-center gap-3 text-sm uppercase tracking-wider font-black">Sign In <ArrowRight className="h-5 w-5" /></div>}
              </Button>

              <div className="text-center pt-4">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Don't have an account?</p>
                <div className="flex items-center justify-center gap-4">
                  <button type="button" onClick={() => onSwitchToRegister('investor')} className="h-9 px-5 rounded-full border border-gray-200 text-[9px] font-black uppercase tracking-widest text-gray-600 hover:bg-gray-50 hover:border-orange-200 hover:text-orange-600 transition-all">Investor</button>
                  <button type="button" onClick={() => onSwitchToRegister('builder')} className="h-9 px-5 rounded-full border border-gray-200 text-[9px] font-black uppercase tracking-widest text-gray-600 hover:bg-gray-50 hover:border-orange-200 hover:text-orange-600 transition-all">Partner</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LoginDialog;