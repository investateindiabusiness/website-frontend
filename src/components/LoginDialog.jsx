import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/AuthContext';
import { toast } from '@/hooks/use-toast';
import { loginRequest } from '@/api';
import { Loader2, LogIn, ArrowRight, LayoutDashboard, ShieldCheck, Building2 } from 'lucide-react';
import GoogleAuthButton from '@/components/GoogleAuthButton';

const LoginDialog = ({ isOpen, onOpenChange, onSwitchToRegister }) => {
  const navigate = useNavigate();
  const { login } = useAuth();

  // 'investor' or 'builder'
  const [userType, setUserType] = useState('investor'); 
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setFormData({ email: '', password: '' });
        setUserType('investor');
      }, 300);
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      return toast({ title: 'Login Failed', description: 'Please enter valid credentials', variant: 'destructive' });
    }

    try {
      setSubmitting(true);
      const userData = await loginRequest({ ...formData, role: userType });

      // Strict role validation based on the active tab
      if (userType === 'builder' && userData.role !== 'builder' && userData.role !== 'admin') {
        return toast({
          title: 'Incorrect Portal',
          description: 'This login is for Partners. Please use the Investor tab.',
          variant: 'destructive'
        });
      }

      login(userData);
      toast({ title: 'Login Successful', description: `Welcome back, ${userData.name || 'User'}!` });
      onOpenChange(false);

      // Route mapping
      if (userData.role === 'admin') navigate('/admin/dashboard');
      else if (userData.role === 'builder') navigate('/partner/dashboard');
      else navigate('/dashboard');

    } catch (error) {
      toast({ title: 'Login Failed', description: error.message || 'Invalid credentials', variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleSuccess = (userData) => {
    login(userData);
    toast({ title: 'Login Successful', description: `Welcome back, ${userData.name}!` });
    onOpenChange(false);

    if (userData.onboardingStatus === 'step1_complete') {
      onSwitchToRegister({ uid: userData.uid, email: userData.email, name: userData.name, skipStep1: true, userType: 'investor' });
    } else if (userData.role === 'admin') {
      navigate('/admin/dashboard');
    } else {
      navigate('/dashboard');
    }
  };

  // Dynamic visual content based on active tab
  const content = {
    investor: {
      image: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop",
      title: "Welcome back to",
      highlight: "the future of realty.",
      desc: "Sign in to manage your portfolio, track project progress, and discover exclusive new investment opportunities.",
      emailLabel: "Email Address"
    },
    builder: {
      image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop",
      title: "Build the future with",
      highlight: "precision.",
      desc: "Access your partner dashboard to manage projects, track milestones, and connect with investors seamlessly.",
      emailLabel: "Work Email"
    }
  };

  const activeContent = content[userType];
  const inputStyle = "h-11 px-4 bg-white border-gray-200 focus:bg-white focus:ring-2 focus:ring-orange-500/10 focus:border-orange-500 transition-all rounded-lg";
  const labelStyle = "text-sm font-semibold text-gray-700 mb-1.5 block";

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl p-0 overflow-hidden bg-white border-none shadow-2xl flex max-h-[90vh]">
        
        {/* LEFT PANEL */}
        <div className="hidden lg:flex lg:w-2/5 relative bg-[#1c1c1c] flex-col justify-center px-10 text-white overflow-hidden transition-all duration-500">
          <div className="absolute inset-0 bg-gradient-to-br from-[#ffffff6b] via-[#1c1c1c] to-[#000] z-0"></div>
          <div
            className="absolute inset-0 opacity-20 z-0 transition-all duration-700"
            style={{ backgroundImage: `url('${activeContent.image}')`, backgroundSize: 'cover', backgroundBlendMode: 'overlay' }}
          />
          <div className="relative z-10">
            <h1 className="text-3xl font-bold mb-4 leading-tight">
              {activeContent.title} <br />
              <span className="text-orange-500">{activeContent.highlight}</span>
            </h1>
            <p className="text-sm text-gray-300 mb-8 leading-relaxed font-light">
              {activeContent.desc}
            </p>
            <div className="space-y-4">
              {[
                { text: "Secure Dashboard Access", icon: LayoutDashboard },
                { text: userType === 'investor' ? "Real-time Portfolio Tracking" : "Direct Investor Communication", icon: ArrowRight },
                { text: userType === 'investor' ? "Encrypted Data Protection" : "Secure Document Management", icon: ShieldCheck }
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-3 group">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-orange-500/10 flex items-center justify-center group-hover:bg-orange-500 transition-colors duration-300">
                    <item.icon className="h-4 w-4 text-orange-500 group-hover:text-white transition-colors" />
                  </div>
                  <span className="text-sm font-medium text-gray-200">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="flex-1 overflow-y-auto relative custom-scrollbar bg-gray-50">
          <div className="p-8 md:p-12">
            
            {/* TOGGLE SWITCH */}
            <div className="flex bg-gray-200/50 p-1 rounded-xl mb-8 w-full max-w-sm mx-auto">
              <button
                onClick={() => setUserType('investor')}
                className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${userType === 'investor' ? 'bg-white shadow-sm text-orange-600' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Investor Login
              </button>
              <button
                onClick={() => setUserType('builder')}
                className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${userType === 'builder' ? 'bg-white shadow-sm text-orange-600' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Partner Login
              </button>
            </div>

            <div className="text-left mb-8">
              <div className="flex items-center gap-3 mb-2">
                <div className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-orange-50">
                  {userType === 'investor' ? <LogIn className="h-5 w-5 text-orange-600" /> : <Building2 className="h-5 w-5 text-orange-600" />}
                </div>
                <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900">
                  {userType === 'investor' ? 'Login to Account' : 'Partner Portal'}
                </h2>
              </div>
            </div>

            {userType === 'investor' && (
              <>
                <GoogleAuthButton onSuccess={handleGoogleSuccess} text="Sign in with Google" />
                <div className="relative mb-6">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-gray-200" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-gray-500">Or continue with email</span>
                  </div>
                </div>
              </>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="email" className={labelStyle}>{activeContent.emailLabel}</Label>
                  <Input id="email" type="email" placeholder="name@company.com" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required className={inputStyle} />
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className={labelStyle}>Password</Label>
                    <button type="button" className="text-xs font-medium text-orange-600 hover:text-orange-700 hover:underline">Forgot password?</button>
                  </div>
                  <Input id="password" type="password" placeholder="••••••••" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} required className={inputStyle} />
                </div>
              </div>

              <Button type="submit" className="w-full h-12 bg-[#ea580c] hover:bg-[#c2410c] text-white font-bold text-base rounded-lg mt-2" disabled={submitting}>
                {submitting ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Logging in...</> : <>Sign In <ArrowRight className="ml-2 h-5 w-5" /></>}
              </Button>

              <div className="pt-4 text-center">
                <p className="text-sm text-gray-600">Don't have an account?</p>
                <div className="flex items-center justify-center gap-4 mt-2">
                  <button type="button" onClick={() => onSwitchToRegister('investor')} className="text-sm font-semibold text-gray-900 hover:text-orange-600 transition-colors">
                    Join as Investor
                  </button>
                  <span className="text-gray-300">|</span>
                  <button type="button" onClick={() => onSwitchToRegister('builder')} className="text-sm font-semibold text-gray-900 hover:text-orange-600 transition-colors">
                    Join as Partner
                  </button>
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