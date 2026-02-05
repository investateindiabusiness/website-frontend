import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/AuthContext';
import { toast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';
import { loginRequest } from '@/api';
import { Loader2, LogIn, ArrowRight, LayoutDashboard, ShieldCheck } from 'lucide-react';
import Footer from '@/components/Footer';
import Header from '@/components/Header';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'investor' // Default state, though usually handled by backend response
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

      login(userData);
      toast({
        title: 'Login Successful',
        description: `Welcome back, ${userData.name}!`
      });

      // Redirect based on role
      if (userData.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/dashboard');
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

  // Shared Styles
  const inputStyle = "h-11 px-4 bg-white border-gray-200 focus:bg-white focus:ring-2 focus:ring-orange-500/10 focus:border-orange-500 transition-all rounded-lg";
  const labelStyle = "text-sm font-semibold text-gray-700 mb-1.5 block";

  return (
    <div className="fixed inset-0 w-full h-full flex bg-white overflow-hidden z-50">
      <div className="lg:hidden w-full absolute top-0 left-0 z-50">
        <Header />
      </div>
      <Toaster />

      {/* LEFT PANEL: Branding & Visuals */}
      <div className="hidden lg:flex lg:w-1/2 h-full relative bg-[#1c1c1c] flex-col justify-center px-12 xl:px-20 text-white overflow-hidden">
        {/* Background Gradient & Image */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-900/50 via-[#1c1c1c] to-[#000] z-0"></div>
        <div
          className="absolute inset-0 opacity-20 z-0"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop')`, // Modern corporate/architectural bg
            backgroundSize: 'cover',
            backgroundBlendMode: 'overlay'
          }}
        />

        <div className="relative z-10 max-w-lg">
          <div className="flex items-center space-x-2 mb-8">
            <img src="/logo-small.png" alt="INVESTATE INDIA" onClick={() => navigate('/')} className="h-24 w-auto hover:cursor-pointer" />
          </div>

          <h1 className="text-4xl xl:text-5xl font-bold mb-6 leading-tight">
            Welcome back to <br />
            <span className="text-orange-500">the future of realty.</span>
          </h1>

          <p className="text-lg text-gray-300 mb-10 leading-relaxed font-light">
            Sign in to manage your portfolio, track project progress, and discover exclusive new investment opportunities.
          </p>

          <div className="space-y-5">
            {[
              { text: "Secure Dashboard Access", icon: LayoutDashboard },
              { text: "Real-time Portfolio Tracking", icon: ArrowRight },
              { text: "Encrypted Data Protection", icon: ShieldCheck }
            ].map((item, index) => (
              <div key={index} className="flex items-center gap-4 group">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center group-hover:bg-orange-500 transition-colors duration-300">
                  <item.icon className="h-5 w-5 text-orange-500 group-hover:text-white transition-colors" />
                </div>
                <span className="text-base font-medium text-gray-200">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT PANEL: Login Form */}
      <div className="flex-1 h-full bg-gray-50 overflow-y-auto mt-10 md:mt-0">
        <div className="min-h-full flex flex-col items-center justify-center p-4 lg:p-8 xl:p-12">

          <div className="w-full max-w-md bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden">

            <div className="p-8 md:p-10">
              <div className="text-left mb-8">
                <div className="flex items-center gap-3 mb-2">
                  <div className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-orange-50">
                    <LogIn className="h-6 w-6 text-orange-600" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900">
                    Login to Account
                  </h2>
                </div>
                <p className="mt-2 text-gray-500">
                  Enter your credentials to access your account.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="email" className={labelStyle}>Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@company.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      className={inputStyle}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password" className={labelStyle}>Password</Label>
                      <button type="button" className="text-xs font-medium text-orange-600 hover:text-orange-700 hover:underline tabindex='-1'">
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
                      className={inputStyle}
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 bg-[#ea580c] hover:bg-[#c2410c] text-white font-bold text-base rounded-lg shadow-lg shadow-orange-500/20 transition-all mt-2"
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Logging in...
                    </>
                  ) : (
                    <>Sign In <ArrowRight className="ml-2 h-5 w-5" /></>
                  )}
                </Button>

                <div className="pt-4 text-center">
                  <p className="text-sm text-gray-600">
                    Don't have an account?
                  </p>
                  <div className="flex items-center justify-center gap-4 mt-2">
                    <button
                      type="button"
                      onClick={() => navigate('/partner/register')}
                      className="text-sm font-semibold text-gray-900 hover:text-orange-600 transition-colors"
                    >
                      Join as Partner
                    </button>
                    <span className="text-gray-300">|</span>
                    <button
                      type="button"
                      onClick={() => navigate('/register')}
                      className="text-sm font-semibold text-gray-900 hover:text-orange-600 transition-colors"
                    >
                      Join as Investor
                    </button>
                  </div>
                </div>
              </form>
            </div>

          </div>

        </div>

        <div className="lg:hidden mt-10">
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default Login;