import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/AuthContext';
import { toast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';
import { adminLoginRequest } from '@/api';
import { ShieldCheck, ArrowRight, Lock, Activity, Users, FileText } from 'lucide-react';

const AdminLogin = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      toast({
        title: 'Validation Error',
        description: 'Please enter both email and password',
        variant: 'destructive'
      });
      return;
    }

    try {
      setSubmitting(true);

      // Call the generic login endpoint
      const userData = await adminLoginRequest(formData);

      // STRICT ROLE CHECK: Only allow Admins
      if (userData.role !== 'admin') {
        toast({
          title: 'Access Denied',
          description: 'You do not have administrator privileges.',
          variant: 'destructive'
        });
        return;
      }

      // If check passes, log them in
      login(userData);

      toast({
        title: 'Welcome, Administrator',
        description: 'Accessing secure control panel...'
      });

      navigate('/admin/dashboard');

    } catch (error) {
      console.error(error);
      toast({
        title: 'Login Failed',
        description: error.message || 'Invalid credentials or server error',
        variant: 'destructive'
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white font-sans">
      <Toaster />

      <div className="flex-1 flex w-full max-w-full mx-auto">

        {/* LEFT PANEL: Admin/Secure Branding */}
        {/* Changed background color to a darker slate/black for a "Secure" feel */}
        <div className="hidden lg:flex w-1/2 relative bg-[#0f172a] flex-col justify-center px-12 xl:px-20 text-white overflow-hidden">
          
          {/* Background Gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-[#0f172a] to-black z-0"></div>

          {/* Abstract Tech/Architecture Background */}
          <div
            className="absolute inset-0 opacity-20 z-0"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop')`, // Tech/Global map style
              backgroundSize: 'cover',
              backgroundBlendMode: 'luminosity'
            }}
          />

          <div className="relative z-10 max-w-lg">
            {/* Logo Area */}
            <div className="flex items-center space-x-2 mb-8 cursor-pointer" onClick={() => navigate('/')}>
              <img src="/logo-big.png" alt="INVESTATE INDIA" className="h-20 w-auto opacity-90" />
            </div>

            <h1 className="text-4xl xl:text-5xl font-bold mb-6 leading-tight">
              Platform <br />
              <span className="text-orange-500">Administration.</span>
            </h1>

            <p className="text-lg text-gray-400 mb-10 leading-relaxed font-light">
              Secure gateway for platform management, user oversight, and system configurations.
            </p>

            {/* Admin Features List */}
            <div className="space-y-5">
              {[
                { text: "Global System Overview", icon: Activity },
                { text: "User & Role Management", icon: Users },
                { text: "Audit Logs & Reports", icon: FileText }
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-4 group">
                  <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center group-hover:border-orange-500 transition-colors duration-300">
                    <item.icon className="h-4 w-4 text-gray-300 group-hover:text-orange-500 transition-colors" />
                  </div>
                  <span className="text-base font-medium text-gray-300">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT PANEL: Login Form */}
        <div className="flex-1 flex flex-col justify-center items-center p-4 lg:p-8 xl:p-12 bg-slate-50">

          <div className="w-full max-w-[450px] bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            
            <div className="p-8 md:p-10">
              <div className="text-left mb-8">
                <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900 flex items-center gap-3">
                  <ShieldCheck className="h-8 w-8 text-gray-900" />
                  Admin Portal
                </h2>
                <p className="mt-2 text-sm text-gray-500">
                  Please authenticate to access the dashboard.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-semibold text-gray-700">Admin Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="admin@investate.in"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      className="h-11 px-4 bg-white border-gray-200 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all rounded-lg"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password" className="text-sm font-semibold text-gray-700">Password</Label>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                      <Input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        required
                        className="h-11 pl-10 pr-4 bg-white border-gray-200 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all rounded-lg"
                      />
                    </div>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full h-11 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm rounded-lg shadow-lg transition-all mt-6"
                  disabled={submitting}
                >
                  {submitting ? 'Authenticating...' : 'Secure Login'}
                  {!submitting && <ArrowRight className="h-4 w-4 ml-2" />}
                </Button>

                <div className="text-center mt-6">
                  <p className="text-xs text-gray-400">
                    Restricted Area. Unauthorized access is monitored.
                  </p>
                </div>
              </form>
            </div>
            
            {/* Status Bar */}
            <div className="h-1.5 w-full bg-slate-900"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;