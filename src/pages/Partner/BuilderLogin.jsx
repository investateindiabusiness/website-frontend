import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/AuthContext';
import { toast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';
import { loginRequest } from '@/api';
import { Building2, ArrowRight, CheckCircle2, LayoutDashboard } from 'lucide-react';

const BuilderLogin = () => {
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
        title: 'Login Failed',
        description: 'Please enter valid credentials',
        variant: 'destructive'
      });
      return;
    }

    try {
      setSubmitting(true);

      const userData = await loginRequest(formData);

      if (userData.role !== 'builder' && userData.role !== 'admin') {
        toast({
          title: 'Incorrect Portal',
          description: 'This login is for Builders. Please use the Investor Login.',
          variant: 'destructive'
        });
        return;
      }

      login(userData);

      toast({
        title: 'Login Successful',
        description: `Welcome back, ${userData.name || 'Partner'}!`
      });

      if (userData.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/partner/dashboard');
      }

    } catch (error) {
      console.error(error);
      toast({
        title: 'Login Failed',
        description: error.message || 'Invalid credentials',
        variant: 'destructive'
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    // 1. Main Container: Flex column ensures Header/Footer stay at top/bottom
    <div className="min-h-screen flex flex-col bg-white font-sans">
      <div className="lg:hidden w-full absolute top-0 left-0 z-50">
        <Header />
      </div>
      {/* <Header /> */}
      <Toaster />

      {/* 2. Content Area: flex-1 makes it fill all available space between Header and Footer */}
      <div className="flex-1 flex w-full max-w-full mx-auto mt-10 md:mt-0">

        {/* LEFT PANEL: Branding & Value Prop (Hidden on small mobile screens) */}
        <div className="hidden lg:flex w-1/2 relative bg-[#2A1B15] flex-col justify-center px-12 xl:px-20 text-white overflow-hidden">
          {/* Background Gradient Effect matching your image style */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#ffffff6b] via-[#2A1B15] to-[#1a100c] z-0"></div>

          {/* Subtle background pattern/image overlay */}
          <div
            className="absolute inset-0 opacity-10 z-0"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop')`,
              backgroundSize: 'cover',
              backgroundBlendMode: 'overlay'
            }}
          />

          <div className="relative z-10 max-w-lg">
            {/* Floating Icon */}
            <div className="flex items-center space-x-2 mb-8">
            <img src="/logo-small.png" alt="INVESTATE INDIA" onClick={() => navigate('/')} className="h-24 w-auto hover:cursor-pointer" />
            </div>

            <h1 className="text-4xl xl:text-5xl font-bold mb-6 leading-tight">
              Build the future with <br />
              <span className="text-orange-500">precision.</span>
            </h1>

            <p className="text-lg text-gray-300 mb-10 leading-relaxed font-light">
              Access your partner dashboard to manage projects, track milestones, and connect with investors seamlessly.
            </p>

            {/* Features List */}
            <div className="space-y-5">
              {[
                "Real-time Project Analytics",
                "Direct Investor Communication",
                "Secure Document Management"
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-4 group">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-orange-500/20 flex items-center justify-center group-hover:bg-orange-500 transition-colors duration-300">
                    <CheckCircle2 className="h-4 w-4 text-orange-500 group-hover:text-white transition-colors" />
                  </div>
                  <span className="text-base font-medium text-gray-200">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT PANEL: Login Form */}
        <div className="flex-1 flex flex-col justify-center items-center p-4 lg:p-8 xl:p-12 bg-gray-50">

          {/* THE CARD CONTAINER */}
          <div className="w-full max-w-[480px] bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden">

            {/* Card Content */}
            <div className="p-8 md:p-10">
              <div className="text-left mb-8">
                <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900">
                  <div className="inline-flex items-center justify-center w-8 h-8">
                    <LayoutDashboard className="h-6 w-6 text-orange-500" />
                  </div>
                  Partner Login
                </h2>
                <p className="mt-2 text-sm md:text-base text-gray-500">
                  Welcome back! Please enter your details.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-semibold text-gray-700">Work Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@company.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      className="h-11 px-4 bg-white border-gray-200 focus:bg-white focus:ring-2 focus:ring-orange-500/10 focus:border-orange-500 transition-all rounded-lg"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password" className="text-sm font-semibold text-gray-700">Password</Label>
                      <button type="button" className="text-xs font-medium text-orange-600 hover:text-orange-700 hover:underline">
                        Forgot password?
                      </button>
                    </div>
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      required
                      className="h-11 px-4 bg-white border-gray-200 focus:bg-white focus:ring-2 focus:ring-orange-500/10 focus:border-orange-500 transition-all rounded-lg"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full h-11 bg-[#ea580c] hover:bg-[#c2410c] text-white font-semibold text-sm rounded-lg shadow-lg shadow-orange-500/20 transition-all mt-4"
                  disabled={submitting}
                >
                  {submitting ? 'Verifying...' : 'Access Dashboard'}
                  {!submitting && <ArrowRight className="h-4 w-4" />}
                </Button>

                <div className="text-center text-sm text-gray-600">
                  Not a partner yet?
                  <button type="button" className="text-orange-600 hover:underline font-medium ml-2" onClick={() => navigate('/partner/register')}>
                    Register Now
                  </button>
                </div>
              </form>

            </div>

          </div>

          <div className="lg:hidden mt-10">
            <Footer />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuilderLogin;