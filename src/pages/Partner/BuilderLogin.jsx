import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/AuthContext';
import { toast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';
import { loginRequest } from '@/api';
import { Building2 } from 'lucide-react'; // Added an icon for visual distinction

const BuilderLogin = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  // We don't need 'role' in state because the backend determines the role from the DB
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
      
      // 1. Call the SAME backend endpoint (it handles both Investors and Builders)
      const userData = await loginRequest(formData);

      // 2. Check if the user is actually a builder
      // Optional: You can block investors from logging in here if you want strict separation
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

      // 3. Redirect to Builder Dashboard
      if (userData.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/partner/dashboard'); // Redirects to the builder's home
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
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Toaster />

      <div className="container mx-auto px-4 py-24">
        <div className="max-w-md mx-auto">
          <Card className="border-none shadow-xl">
            <CardHeader className="text-center">
              <div className="mx-auto bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <Building2 className="h-8 w-8 text-orange-600" />
              </div>
              <CardTitle className="text-3xl font-bold text-gray-900">Partner Login</CardTitle>
              <CardDescription className="text-gray-600">
                Access your Builder Dashboard to manage projects and leads
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email">Work Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="contact@company.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                  />
                </div>

                <Button type="submit" className="w-full bg-orange-600 hover:bg-orange-700 py-6 text-lg" disabled={submitting}>
                  {submitting ? 'Verifying...' : 'Login to Dashboard'}
                </Button>

                <div className="text-center text-sm text-gray-600">
                  Not a partner yet?{' '}
                  <button
                    type="button"
                    onClick={() => navigate('/partner/register')}
                    className="text-orange-600 hover:underline font-medium"
                  >
                    Register Company
                  </button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default BuilderLogin;