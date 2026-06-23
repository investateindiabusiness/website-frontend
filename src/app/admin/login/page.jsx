"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/hooks/AuthContext';
import { toast } from '@/hooks/use-toast';
import { adminLoginRequest } from '@/api';
import { Shield, Lock, Eye, EyeOff, User, BarChart3, Users } from 'lucide-react';

function AdminLoginForm() {
  const router = useRouter();
  const { login } = useAuth();
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    if (searchParams.get('session_expired') === 'true') {
      toast({
        title: "Session Expired",
        description: "Your session has expired. Please log in again.",
        variant: "destructive"
      });
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const userData = await adminLoginRequest(formData);
      if (userData.role !== 'admin') {
        toast({ title: 'Access Denied', description: 'Not an admin.', variant: 'destructive' });
        return;
      }
      login(userData);
      toast({ title: 'Welcome', description: 'Accessing dashboard...' });
      router.push('/admin/dashboard');
    } catch (error) {
      toast({ title: 'Login Failed', description: error.message, variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-md rounded-[2.25rem] shadow-[0_30px_70px_-15px_rgba(0,0,0,0.08)] border border-slate-100/90 p-8 md:p-10 transition-all duration-300">

      {/* Shield Icon Top Badge */}
      <div className="w-12 h-12 rounded-2xl border border-orange-500/20 bg-orange-500/5 flex items-center justify-center text-orange-500 mb-6 shadow-sm shadow-orange-500/10">
        <Shield className="w-6 h-6 stroke-[1.75]" />
      </div>

      {/* Card Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 leading-none">Admin Portal</h2>
        <p className="text-sm text-slate-400 mt-2 font-medium">Sign in to access your dashboard</p>
      </div>

      {/* Login Form */}
      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Admin Email Input */}
        <div className="space-y-2">
          <label htmlFor="email" className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Admin Email</label>
          <div className="relative group">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-500/70 group-focus-within:text-orange-500 transition-colors">
              <User className="h-5 w-5 stroke-[1.75]" />
            </span>
            <input
              id="email"
              type="email"
              placeholder="test.admin@gmail.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              className="w-full h-12 pl-12 pr-4 bg-slate-50/50 hover:bg-slate-50 focus:bg-white border border-slate-200 focus:border-orange-500 rounded-2xl text-slate-800 placeholder-slate-400 text-sm focus:ring-4 focus:ring-orange-500/10 focus:outline-none transition-all duration-200 font-medium"
            />
          </div>
        </div>

        {/* Password Input */}
        <div className="space-y-2">
          <label htmlFor="password" className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Password</label>
          <div className="relative group">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-500/70 group-focus-within:text-orange-500 transition-colors">
              <Lock className="h-5 w-5 stroke-[1.75]" />
            </span>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
              className="w-full h-12 pl-12 pr-12 bg-slate-50/50 hover:bg-slate-50 focus:bg-white border border-slate-200 focus:border-orange-500 rounded-2xl text-slate-800 placeholder-slate-400 text-sm focus:ring-4 focus:ring-orange-500/10 focus:outline-none transition-all duration-200 font-medium"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors focus:outline-none"
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5 stroke-[1.75]" />
              ) : (
                <Eye className="h-5 w-5 stroke-[1.75]" />
              )}
            </button>
          </div>
        </div>

        {/* Remember me & Forgot Password */}
        <div className="flex items-center justify-between text-xs pt-1">
          <label className="flex items-center gap-2 text-slate-500 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4.5 h-4.5 rounded border-slate-300 text-orange-500 focus:ring-orange-500/20 focus:ring-offset-0 accent-orange-500"
            />
            <span className="font-medium">Remember me</span>
          </label>
          <a href="#forgot" className="font-semibold text-slate-500 hover:text-orange-500 transition-colors">Forgot password?</a>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={submitting}
          className="w-full h-12 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold text-sm rounded-2xl shadow-lg shadow-orange-500/20 hover:shadow-orange-500/30 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group"
        >
          {submitting ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <>
              <Lock className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
              <span>Secure Login</span>
            </>
          )}
        </button>

      </form>

      {/* Encrypted footer inside card */}
      <div className="flex items-center justify-center gap-2 text-[10px] text-slate-400 mt-6 font-medium">
        <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
        <span>Your connection is encrypted and secure</span>
      </div>

    </div>
  );
}

export default function AdminLogin() {
  return (
    <div className="min-h-screen w-full flex bg-[#fafbfe] relative overflow-hidden font-sans">

      {/* Left Panel: Secure Branding Showcase */}
      <div className="hidden lg:flex lg:w-[46vw] relative bg-[#070c18] flex-col justify-between p-12 xl:p-16 text-white overflow-hidden select-none">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0c1324] via-[#070c18] to-[#04060b] z-0" />

        {/* Mesh Grid Dotted Overlay */}
        <div
          className="absolute inset-0 opacity-[0.12] z-0 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(rgba(249, 115, 22, 0.2) 1px, transparent 1px)`,
            backgroundSize: '24px 24px'
          }}
        />

        {/* Large Glowing Shield Outline in Background */}
        <div className="absolute right-[-8%] top-[25%] w-[420px] h-[420px] opacity-[0.08] pointer-events-none z-0">
          <svg
            className="w-full h-full text-blue-500 filter drop-shadow-[0_0_20px_rgba(59,130,246,0.6)]"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.4"
          >
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
        </div>

        {/* Curve Divider SVG */}
        <div className="absolute top-0 bottom-0 right-[-120px] w-[120px] z-30 hidden lg:block pointer-events-none">
          <svg className="h-full w-full fill-[#070c18]" viewBox="0 0 120 1000" preserveAspectRatio="none">
            <path d="M 0 0 L 80 0 C 80 250, -20 400, 5 650 C 30 900, 100 950, 120 1000 L 0 1000 Z" />
          </svg>
        </div>

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 bg-slate-900 rounded-xl border border-orange-500/30 shadow-md">
            <svg className="w-5.5 h-5.5 text-orange-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            <div className="absolute top-[13px] text-white">
              <svg className="w-2.5 h-2.5 text-white fill-white" viewBox="0 0 24 24">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              </svg>
            </div>
          </div>
          <span className="text-xl font-extrabold tracking-wide text-white">
            INVESTATE <span className="text-orange-500">INDIA</span>
          </span>
        </div>

        {/* Title & Description Container */}
        <div className="relative z-10 my-auto py-12 max-w-lg">
          <span className="text-xs font-bold tracking-widest text-orange-500 uppercase mb-4 block">
            Platform Administration
          </span>
          <h1 className="text-4xl xl:text-5xl font-extrabold tracking-wide text-white leading-[1.15]">
            Secure. Manage. <br />
            Grow with <span className="text-orange-500">Confidence.</span>
          </h1>
          <p className="text-base text-slate-400 font-light leading-relaxed mt-5 max-w-md">
            Advanced platform management with enterprise grade security and control.
          </p>
        </div>

        {/* Bottom features columns */}
        <div className="relative z-10 grid grid-cols-3 gap-4 pt-6 border-t border-slate-800/60">
          <div className="flex flex-col items-start">
            <div className="w-9 h-9 rounded-xl border border-orange-500/20 bg-orange-500/5 flex items-center justify-center text-orange-500 mb-3 shadow-sm">
              <Shield className="h-4.5 w-4.5 stroke-[1.75]" />
            </div>
            <h3 className="text-sm font-semibold text-white">Secure Access</h3>
            <p className="text-[11px] text-slate-400 mt-1 leading-normal">Enterprise grade protection</p>
          </div>

          <div className="flex flex-col items-start">
            <div className="w-9 h-9 rounded-xl border border-orange-500/20 bg-orange-500/5 flex items-center justify-center text-orange-500 mb-3 shadow-sm">
              <BarChart3 className="h-4.5 w-4.5 stroke-[1.75]" />
            </div>
            <h3 className="text-sm font-semibold text-white">Real-time Control</h3>
            <p className="text-[11px] text-slate-400 mt-1 leading-normal">Monitor and manage operations</p>
          </div>

          <div className="flex flex-col items-start">
            <div className="w-9 h-9 rounded-xl border border-orange-500/20 bg-orange-500/5 flex items-center justify-center text-orange-500 mb-3 shadow-sm">
              <Users className="h-4.5 w-4.5 stroke-[1.75]" />
            </div>
            <h3 className="text-sm font-semibold text-white">User Management</h3>
            <p className="text-[11px] text-slate-400 mt-1 leading-normal">Manage users and permissions</p>
          </div>
        </div>

        {/* Footer watermark */}
        <div className="relative z-10 text-xs text-slate-500/80 mt-12 font-medium">
          © 2025  INVESTATE INDIA. All rights reserved.
        </div>
      </div>

      {/* Right Panel: Login Card Container */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 md:p-12 bg-slate-50 relative z-20">
        {/* Grid Background Pattern */}
        <div
          className="absolute inset-0 opacity-[0.06] z-0 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(rgba(15, 23, 42, 0.15) 1.5px, transparent 1.5px)`,
            backgroundSize: '24px 24px'
          }}
        />

        <div className="w-full max-w-[450px] z-10">
          <Suspense fallback={
            <div className="bg-white/80 backdrop-blur-md rounded-[2.25rem] shadow-[0_30px_70px_-15px_rgba(0,0,0,0.08)] border border-slate-100/90 p-8 md:p-10 text-center flex flex-col items-center justify-center min-h-[400px]">
              <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          }>
            <AdminLoginForm />
          </Suspense>
        </div>
      </div>

    </div>
  );
}
