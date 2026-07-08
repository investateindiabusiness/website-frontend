"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from '@/hooks/AuthContext';
import { toast } from '@/hooks/use-toast';
import { loginRequest } from '@/api';
import { Loader2, LogIn, ArrowRight, ChevronDown, UserPlus, AlertCircle } from 'lucide-react';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { app } from '@/firebase';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const ROLES = [
  { id: "investor", label: "Investor" },
  { id: "builder", label: "Builder" },
  { id: "service-provider", label: "Service Provider" },
];

function UnifiedLoginPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, user } = useAuth();

  // Pre-select role from query param e.g. /login?role=investor
  const initialRole = () => {
    const roleParam = searchParams?.get('role');
    return ROLES.find(r => r.id === roleParam) || ROLES[0];
  };

  const [selectedRole, setSelectedRole] = useState(initialRole);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Update selected role if query param changes
  useEffect(() => {
    const roleParam = searchParams?.get('role');
    if (roleParam) {
      const match = ROLES.find(r => r.id === roleParam);
      if (match) setSelectedRole(match);
    }
  }, [searchParams]);

  // If already logged in, redirect away
  useEffect(() => {
    if (user && user.role) {
      const pendingRedirect = sessionStorage.getItem('postLoginRedirect');
      if (pendingRedirect) {
        sessionStorage.removeItem('postLoginRedirect');
        router.push(`/${user.role}/advertisements`);
      } else {
        router.push(user.role === 'admin' ? '/admin/dashboard' : `/${user.role}/dashboard`);
      }
    }
  }, [user, router]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRegisterRedirect = () => {
    router.push(`/${selectedRole.id}/register`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!formData.email || !formData.password) {
      return setError('Please enter valid credentials');
    }

    try {
      setSubmitting(true);
      const userData = await loginRequest({ ...formData, role: selectedRole.id });

      // Check role mismatch
      const normalizedRole = userData.role === 'partner' ? 'builder' : userData.role;
      if (normalizedRole !== selectedRole.id) {
        const displayRole = normalizedRole === 'investor' ? 'Investor' : (normalizedRole === 'builder' ? 'Builder' : 'Service Provider');
        setError(`This account is registered as a ${displayRole}. Please switch the role dropdown above to ${displayRole}.`);
        setSubmitting(false);
        return;
      }

      login(userData);
      toast({ title: 'Login Successful', description: `Welcome back, ${userData.name || 'User'}!` });

      // Silently sign into Firebase for compliance APIs
      if (app) {
        try {
          const fbAuth = getAuth(app);
          await signInWithEmailAndPassword(fbAuth, formData.email, formData.password).catch(() => { });
        } catch (_) { }
      }

      // Check if user came from ad CTA
      const pendingRedirect = sessionStorage.getItem('postLoginRedirect');
      if (pendingRedirect === '/advertisements') {
        sessionStorage.removeItem('postLoginRedirect');
        const role = userData.role === 'partner' ? 'builder' : userData.role;
        return router.push(`/${role}/advertisements`);
      }

      // Default dashboard route
      if (userData.role === 'admin') router.push('/admin/dashboard');
      else if (userData.role === 'builder' || userData.role === 'partner') router.push('/builder/dashboard');
      else if (userData.role === 'serviceProvider') router.push('/service-provider/dashboard');
      else router.push('/dashboard');

    } catch (err) {
      console.error("[UNIFIED LOGIN] Login Failed:", err);
      setSubmitting(false);

      const errMsg = err.message || '';

      if (err.error === 'STEP2_PENDING') {
        toast({ title: 'Profile Incomplete', description: 'Please complete your initial profile details.' });
        router.push(`/${selectedRole.id}/register?uid=${err.uid}&email=${err.email}&name=${err.name || ''}&skipStep1=true`);
        return;
      } else if (err.error === 'CHANGES_REQUESTED') {
        toast({ title: 'Update Required', description: err.message });
        sessionStorage.setItem('onboarding_init_data', JSON.stringify({ userData: err.userData, adminRequests: err.adminRequests, phase: 'CHANGES_REQUESTED' }));
        router.push(`/${selectedRole.id}/register?uid=${err.uid}&skipStep1=true&phase=CHANGES_REQUESTED`);
        return;
      } else if (err.error === 'FORM2_PENDING') {
        toast({ title: 'Action Required', description: err.message });
        sessionStorage.setItem('onboarding_init_data', JSON.stringify({ userData: err.userData, phase: 'FORM2_PENDING' }));
        router.push(`/${selectedRole.id}/register?uid=${err.uid}&skipStep1=true&phase=FORM2_PENDING`);
        return;
      } else if (err.error === 'ACCOUNT_UNDER_REVIEW') {
        setError('Your account is currently under review by our administration team.');
        return;
      }

      setError(errMsg || 'Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="min-h-screen bg-[#0b1120] flex flex-col font-sans">
      <Header transparent={false} />

      <main className="flex-1 relative flex items-start justify-center p-4 pt-20">
        {/* Background ambient glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-orange-900/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative z-10 w-full max-w-sm bg-white rounded-2xl shadow-2xl p-6 border border-gray-100">
          <div className="text-center mb-5">
            <h1 className="text-2xl font-black text-gray-900 mb-1">Login Portal</h1>
            <p className="text-gray-500 text-xs font-medium">Select your role and enter credentials</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-xl flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <p className="text-xs font-semibold text-red-700 leading-tight">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                Log in as
              </label>
              <DropdownMenu>
                <DropdownMenuTrigger className="w-full flex items-center justify-between bg-gray-50 border border-gray-200 hover:border-orange-400 text-gray-800 font-semibold px-3 py-2.5 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500/20 text-sm">
                  {selectedRole.label}
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-[var(--radix-dropdown-menu-trigger-width)] bg-white rounded-xl shadow-xl border border-gray-100 p-1">
                  {ROLES.map((role) => (
                    <DropdownMenuItem
                      key={role.id}
                      onClick={() => setSelectedRole(role)}
                      className={`px-4 py-3 text-sm font-medium rounded-lg cursor-pointer transition-colors ${selectedRole.id === role.id
                        ? "bg-orange-50 text-orange-700"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                        }`}
                    >
                      {role.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full h-10 px-3 bg-gray-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-orange-500/10 focus:border-orange-500 transition-all rounded-lg focus:outline-none text-gray-800 font-medium text-sm"
                placeholder="name@company.com"
                required
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full h-10 px-3 bg-gray-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-orange-500/10 focus:border-orange-500 transition-all rounded-lg focus:outline-none text-gray-800 font-medium text-sm"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-800 disabled:bg-gray-300 text-white font-bold py-2.5 rounded-lg transition-all shadow-md active:scale-[0.98] text-sm"
            >
              {submitting ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <LogIn className="w-4 h-4" /> Login
                </>
              )}
            </button>
          </form>

          <div className="relative py-4 flex items-center justify-center">
            <div className="absolute inset-x-0 h-px bg-gray-100" />
            <span className="relative bg-white px-3 text-[10px] font-semibold text-gray-400 uppercase tracking-widest">
              New User?
            </span>
          </div>

          <button
            onClick={handleRegisterRedirect}
            className="w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold py-2.5 rounded-lg transition-all shadow-md active:scale-[0.98] text-sm"
          >
            <UserPlus className="w-4 h-4" /> Register as {selectedRole.label}
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function UnifiedLoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0b1120] flex items-center justify-center text-white">
        <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
      </div>
    }>
      <UnifiedLoginPageContent />
    </Suspense>
  );
}
