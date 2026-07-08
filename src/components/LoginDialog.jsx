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
import { Loader2, LogIn, ArrowRight, LayoutDashboard, ShieldCheck, Building2, AlertCircle, AlertTriangle, UserPlus } from 'lucide-react';
import GoogleAuthButton from '@/components/GoogleAuthButton';
import { getAuth, signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { app } from '@/firebase';

const LoginDialog = ({ isOpen, onOpenChange, onSwitchToRegister, initialData = {} }) => {
  const router = useRouter();
  const { login } = useAuth();

  const [userType, setUserType] = useState('investor');
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [alertModal, setAlertModal] = useState({
    isOpen: false,
    type: '', // 'role_mismatch' | 'not_registered'
    message: '',
    role: '',
  });

  useEffect(() => {
    if (isOpen && initialData?.userType) {
      setUserType(initialData.userType);
    }
  }, [isOpen, initialData?.userType]);

  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setFormData({ email: '', password: '' });
        setError(null);
        setAlertModal({ isOpen: false, type: '', message: '', role: '' });
      }, 300);
    }
  }, [isOpen]);

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
      const userData = await loginRequest({ ...formData, role: userType });

      if (userData.role !== userType) {
        const normalizedUserDataRole = userData.role === 'partner' ? 'builder' : userData.role;
        if (normalizedUserDataRole !== userType) {
          const registeredRole = normalizedUserDataRole;
          const displayRole = registeredRole === 'investor' ? 'Investor' : (registeredRole === 'builder' ? 'Builder' : (registeredRole === 'serviceProvider' ? 'Service Provider' : registeredRole));
          setAlertModal({
            isOpen: true,
            type: 'role_mismatch',
            message: `This account is registered as a${displayRole === 'Investor' ? 'n' : ''} ${displayRole}. Please use the ${displayRole} tab.`,
            role: registeredRole
          });
          return;
        }
      }

      login(userData);
      toast({ title: 'Login Successful', description: `Welcome back, ${userData.name || 'User'}!` });
      onOpenChange(false);

      // Silently sign into Firebase so getIdToken() works for Helpdesk API.
      // This runs in the background and doesn't block the user flow.
      if (app) {
        try {
          const fbAuth = getAuth(app);
          await signInWithEmailAndPassword(fbAuth, formData.email, formData.password).catch(() => {
            // Firebase sign-in may fail for non-email users or wrong project — that's OK.
            // The backend session token will be used as fallback.
          });
        } catch (_) { /* non-blocking */ }
      }

      // Check if user came from an ad "Book this Space" click
      const pendingRedirect = sessionStorage.getItem('postLoginRedirect');
      if (pendingRedirect === '/advertisements') {
        sessionStorage.removeItem('postLoginRedirect');
        const role = userData.role;
        if (role === 'admin') return router.push('/admin/advertisements');
        if (role === 'investor') return router.push('/investor/advertisements');
        if (role === 'serviceProvider') return router.push('/service-provider/advertisements');
        return router.push('/builder/advertisements');
      }

      if (userData.role === 'admin') router.push('/admin/dashboard');
      else if (userData.role === 'builder') router.push('/builder/dashboard');
      else if (userData.role === 'serviceProvider') router.push('/service-provider/dashboard');
      else router.push('/dashboard');

    } catch (err) {
      console.log("[1. LOGIN DIALOG] Catch Block Intercepted:", err);

      const isDev = typeof window !== 'undefined' && 
                    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
      const isRateLimit = err.message?.toLowerCase().includes('too many requests') || 
                          err.message?.toLowerCase().includes('rate limit') ||
                          err.status === 429;

      if (isDev && isRateLimit) {
        const mockUserData = {
          uid: "mock-dev-user-id",
          email: formData.email,
          name: formData.email.split('@')[0].toUpperCase(),
          role: userType,
          token: "mock-dev-token",
          isVerified: true
        };
        
        login(mockUserData);
        toast({ 
          title: "Development Bypass Enabled", 
          description: `Server rate limit detected. Logged in as ${mockUserData.name} (Mock Session).`,
        });
        onOpenChange(false);
        
        if (mockUserData.role === 'admin') router.push('/admin/dashboard');
        else if (mockUserData.role === 'builder') router.push('/builder/dashboard');
        else router.push('/dashboard');
        return;
      }

      if (err.error === 'STEP2_PENDING') {
        toast({ title: 'Profile Incomplete', description: 'Please complete your initial profile details.' });
        onOpenChange(false);
        setTimeout(() => {
          onSwitchToRegister({ uid: err.uid, email: err.email, name: err.name, skipStep1: true, userType: userType });
        }, 300);

      } else if (err.error === 'CHANGES_REQUESTED') {
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
            phase: 'FORM2_PENDING',
            userData: err.userData
          });
        }, 300);
      } else if (err.error === 'ACCOUNT_UNDER_REVIEW') {
        setError('Your account is currently under review by our administration team.');
      } else {
        const errMsg = err.message || '';
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
              // Successfully created user means the email is NOT registered!
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
                role: userType
              });
            } else if (data.error?.message === 'EMAIL_EXISTS') {
              // User exists, so the credentials entered were wrong
              setError('Login failed');
            } else {
              setError('Login failed');
            }
          } catch (checkErr) {
            console.error('Error checking email existence:', checkErr);
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

          const isRoleMismatch = 
            errMsg.toLowerCase().includes('registered as') || 
            errMsg.toLowerCase().includes('use the') || 
            errMsg.toLowerCase().includes('tab') ||
            (errMsg.toLowerCase().includes('account') && (
              errMsg.toLowerCase().includes('investor') ||
              errMsg.toLowerCase().includes('builder') ||
              errMsg.toLowerCase().includes('partner') ||
              errMsg.toLowerCase().includes('admin')
            ));

          if (isRoleMismatch) {
            let targetRole = 'builder';
            if (errMsg.toLowerCase().includes('investor')) targetRole = 'investor';
            else if (errMsg.toLowerCase().includes('partner') || errMsg.toLowerCase().includes('builder')) targetRole = 'builder';
            else if (errMsg.toLowerCase().includes('admin')) targetRole = 'admin';

            setAlertModal({
              isOpen: true,
              type: 'role_mismatch',
              message: errMsg.replace(/partner/gi, 'Builder').replace(/Partner/g, 'Builder'),
              role: targetRole
            });
          } else if (isNotRegistered) {
            setAlertModal({
              isOpen: true,
              type: 'not_registered',
              message: 'Your email id is not registered. Do register.',
              role: userType
            });
          } else {
            setError(errMsg || 'Login failed');
          }
        }
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleSuccess = (userData) => {
    setError(null);

    login(userData);
    toast({ title: 'Login Successful', description: `Welcome back, ${userData.name || 'User'}!` });
    onOpenChange(false);

    if (userData.role === 'admin') router.push('/admin/dashboard');
    else if (userData.role === 'builder') router.push('/builder/dashboard');
    else router.push('/dashboard');
  };

  const handleGoogleError = (err) => {
    console.log("Google Login Error Intercepted:", err);

    const targetUserType = err.userType || userType;

    if (err.error === 'STEP2_PENDING') {
      toast({ title: 'Profile Incomplete', description: 'Please complete your profile details to continue.' });
      onOpenChange(false);
      setTimeout(() => {
        onSwitchToRegister({ uid: err.uid, email: err.email, name: err.name, skipStep1: true, userType: targetUserType });
      }, 300);

    } else if (err.error === 'CHANGES_REQUESTED') {
      toast({ title: 'Update Required', description: err.message });
      onOpenChange(false);
      setTimeout(() => {
        onSwitchToRegister({
          uid: err.uid,
          userType: targetUserType,
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
          userType: targetUserType,
          skipStep1: true,
          phase: 'FORM2_PENDING',
          userData: err.userData
        });
      }, 300);
    } else if (err.error === 'ACCOUNT_UNDER_REVIEW') {
      setError('Your account is currently under review by our administration team.');
    } else {
      const errMsg = err.message || '';
      const isNotRegistered = 
        errMsg.toLowerCase().includes('user not found') || 
        errMsg.toLowerCase().includes('not registered') || 
        errMsg.toLowerCase().includes('no user found') ||
        errMsg.toLowerCase().includes('not exist') ||
        err.error === 'USER_NOT_FOUND' ||
        err.code === 'auth/user-not-found';

      const isRoleMismatch = 
        errMsg.toLowerCase().includes('registered as') || 
        errMsg.toLowerCase().includes('use the') || 
        errMsg.toLowerCase().includes('tab') ||
        (errMsg.toLowerCase().includes('account') && (
          errMsg.toLowerCase().includes('investor') ||
          errMsg.toLowerCase().includes('builder') ||
          errMsg.toLowerCase().includes('partner') ||
          errMsg.toLowerCase().includes('admin')
        ));

      if (isRoleMismatch) {
        let targetRole = 'builder';
        if (errMsg.toLowerCase().includes('investor')) targetRole = 'investor';
        else if (errMsg.toLowerCase().includes('partner') || errMsg.toLowerCase().includes('builder')) targetRole = 'builder';
        else if (errMsg.toLowerCase().includes('admin')) targetRole = 'admin';

        setAlertModal({
          isOpen: true,
          type: 'role_mismatch',
          message: errMsg.replace(/partner/gi, 'Builder').replace(/Partner/g, 'Builder'),
          role: targetRole
        });
      } else if (isNotRegistered) {
        setAlertModal({
          isOpen: true,
          type: 'not_registered',
          message: 'Your email id is not registered. Do register.',
          role: targetUserType
        });
      } else {
        setError(errMsg || 'Google authentication failed');
      }
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
    },
    serviceProvider: {
      image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=2070&auto=format&fit=crop",
      title: "Promote your services with", highlight: "prestige.",
      desc: "Access your dashboard to review campaign performance, view registered users count, and book new advertisement campaigns.",
      emailLabel: "Work Email"
    }
  };

  const activeContent = content[userType];
  const inputStyle = "h-11 px-4 bg-white border-gray-200 focus:bg-white focus:ring-2 focus:ring-orange-500/10 focus:border-orange-500 transition-all rounded-lg";
  const labelStyle = "text-sm font-semibold text-gray-700 block";

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="fixed left-1/2 top-[72px] -translate-x-1/2 translate-y-0 w-[95vw] md:max-w-[850px] p-0 overflow-hidden bg-white border-none shadow-[0_32px_64px_-15px_rgba(0,0,0,0.2)] flex flex-col lg:flex-row z-50 rounded-[2.5rem]" style={{ maxHeight: 'calc(100vh - 80px)' }}>

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
                  {userType === 'investor' ? 'Investor Login' : (userType === 'builder' ? 'Builder Login' : 'Service Provider Login')}
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
                      <button type="button" onClick={handleForgotPassword} className="text-[9px] font-black text-orange-600 uppercase tracking-widest hover:underline">Forgot?</button>
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

      <Dialog open={alertModal.isOpen} onOpenChange={(open) => setAlertModal(prev => ({ ...prev, isOpen: open }))}>
        <DialogContent className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-[420px] p-6 bg-white border border-gray-100 shadow-[0_24px_48px_-10px_rgba(0,0,0,0.18)] rounded-3xl z-[110] flex flex-col items-center text-center animate-in zoom-in-95 duration-200">
          <DialogTitle className="sr-only">
            {alertModal.type === 'role_mismatch' ? 'Role Mismatch' : 'Not Registered'}
          </DialogTitle>
          <DialogDescription className="sr-only">
            {alertModal.message}
          </DialogDescription>

          {alertModal.type === 'role_mismatch' ? (
            <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center mb-4 text-amber-600 shadow-inner">
              <AlertTriangle className="w-7 h-7" />
            </div>
          ) : (
            <div className="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center mb-4 text-orange-600 shadow-inner">
              <UserPlus className="w-7 h-7" />
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
                  setUserType(alertModal.role);
                  setFormData({ ...formData, password: '' });
                  setError(null);
                  setAlertModal(prev => ({ ...prev, isOpen: false }));
                }}
                className="w-full h-11 bg-orange-600 hover:bg-orange-700 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-orange-600/10 transition-all"
              >
                Switch to {alertModal.role === 'investor' ? 'Investor' : 'Builder'} Tab
              </Button>
            ) : (
              <Button
                onClick={() => {
                  setAlertModal(prev => ({ ...prev, isOpen: false }));
                  onOpenChange(false); // Close login dialog
                  setTimeout(() => {
                    onSwitchToRegister(alertModal.role); // Open register dialog with current userType role
                  }, 300);
                }}
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
        </DialogContent>
      </Dialog>
    </Dialog>
  );
};

export default LoginDialog;
