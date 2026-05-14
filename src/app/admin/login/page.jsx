"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/AuthContext';
import { toast } from '@/hooks/use-toast';
import { adminLoginRequest } from '@/api';
import { ShieldCheck, ArrowRight, Lock, Activity, Users, FileText } from 'lucide-react';

export default function AdminLogin() {
  const router = useRouter();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [submitting, setSubmitting] = useState(false);

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
    <div className="min-h-screen flex flex-col bg-white font-sans">
      <div className="flex-1 flex w-full max-w-full mx-auto">
        <div className="hidden lg:flex w-1/2 relative bg-[#0f172a] flex-col justify-center px-12 text-white overflow-hidden">
          <div className="relative z-10 max-w-lg">
            <h1 className="text-4xl font-bold mb-6 leading-tight">Platform <br /><span className="text-orange-500">Administration.</span></h1>
            <p className="text-lg text-gray-400 mb-10 leading-relaxed font-light">Secure gateway for platform management.</p>
          </div>
        </div>
        <div className="flex-1 flex flex-col justify-center items-center p-4 bg-slate-50">
          <div className="w-full max-w-[450px] bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="p-8 md:p-10">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3"><ShieldCheck /> Admin Portal</h2>
              <form onSubmit={handleSubmit} className="space-y-5 mt-8">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Admin Email</Label>
                    <Input id="email" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" type="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} required />
                  </div>
                </div>
                <Button type="submit" className="w-full bg-slate-900 text-white" disabled={submitting}>
                  {submitting ? 'Authenticating...' : 'Secure Login'}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
