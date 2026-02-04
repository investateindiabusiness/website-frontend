import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';
import { CheckCircle, ChevronRight, Loader2 } from 'lucide-react';
import { createBuilderAuth, updateBuilderProfile } from '@/api';

const BuilderRegister = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // --- Step 1: Auth Data ---
  const [authData, setAuthData] = useState({ email: '', password: '', confirmPassword: '' });

  // --- Step 2: Profile Data ---
  const [formData, setFormData] = useState({
    // Company Details
    companyName: '',
    yearOfIncorporation: '',
    companyOverview: '',
    promotersOrDirectors: '', // Text field for names

    // Contact Person
    contactPersonName: '',
    contactPersonEmail: '',
    contactPersonPhone: '',

    // Track Record
    reraRegistrationNumbers: '',
    totalProjectsCompleted: '',
    totalSqftDelivered: '',
    majorCompletedProjects: '',
    currentOngoingProjects: '',
    
    // Financial & Legal
    financialOfCompany: '', // Yes/No
    outstandingDebt: '',
    bankingPartners: '',
    declaredLitigationDisputes: '',
    experienceWithNriInvestors: '', // Yes/No

    // Location (Address specific)
    address: '',
    country: '',
    state: '',
    city: '',
    zip: '',
    
    termsAccepted: false
  });

  // --- Location State ---
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [loadingLocation, setLoadingLocation] = useState(false);

  // --- Fetch Countries on Mount ---
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const res = await fetch('https://countriesnow.space/api/v0.1/countries/iso');
        const data = await res.json();
        if (!data.error) setCountries(data.data || []);
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    };
    fetchCountries();
  }, []);

  // --- Location Handlers ---
  const handleCountryChange = async (e) => {
    const selectedCountry = e.target.value;
    setFormData({ ...formData, country: selectedCountry, state: '', city: '' });
    setStates([]);
    setCities([]);

    if (selectedCountry) {
      setLoadingLocation(true);
      try {
        const res = await fetch('https://countriesnow.space/api/v0.1/countries/states', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ country: selectedCountry })
        });
        const data = await res.json();
        if (!data.error) setStates(data.data.states || []);
      } catch (error) {
        console.error("Error fetching states:", error);
      } finally {
        setLoadingLocation(false);
      }
    }
  };

  const handleStateChange = async (e) => {
    const selectedState = e.target.value;
    setFormData({ ...formData, state: selectedState, city: '' });
    setCities([]);

    if (selectedState && formData.country) {
      setLoadingLocation(true);
      try {
        const res = await fetch('https://countriesnow.space/api/v0.1/countries/state/cities', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ country: formData.country, state: selectedState })
        });
        const data = await res.json();
        if (!data.error) setCities(data.data || []);
      } catch (error) {
        console.error("Error fetching cities:", error);
      } finally {
        setLoadingLocation(false);
      }
    }
  };

  // --- Form Submission Handlers ---
  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    if (authData.password !== authData.confirmPassword) {
      return toast({ title: "Error", description: "Passwords do not match", variant: "destructive" });
    }
    try {
      setLoading(true);
      const response = await createBuilderAuth({ email: authData.email, password: authData.password });
      setUserId(response.uid);
      
      // Auto-fill contact email from auth step
      setFormData(prev => ({ ...prev, contactPersonEmail: authData.email }));
      
      setStep(2);
      toast({ title: "Account Created", description: "Please provide company details." });
    } catch (err) {
      toast({ title: "Registration Failed", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    if (!formData.termsAccepted) {
      return toast({ title: 'Error', description: 'Please accept the terms and conditions', variant: 'destructive' });
    }
    try {
      setLoading(true);
      await updateBuilderProfile(userId, formData);
      setSubmitted(true);
    } catch (error) {
      console.error(error);
      toast({ title: 'Error', description: error.message || 'Failed to submit.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  // Helper styles
  const selectStyle = "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";

  // --- Success View ---
  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <Toaster />
        <div className="container mx-auto px-4 py-24">
          <div className="max-w-2xl mx-auto text-center">
            <Card className="border-none shadow-xl">
              <CardContent className="p-12">
                <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="h-12 w-12 text-green-600" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Registration Submitted!</h2>
                <p className="text-gray-600 mb-6">
                  Thank you. Our team will verify your company details and contact you shortly.
                </p>
                <Button onClick={() => navigate('/partner/login')} className="bg-blue-600 hover:bg-blue-700">
                  Go to Login
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Toaster />
      <div className="mt-16 container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <Card className="border-none shadow-xl bg-white">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold text-gray-900">
                {step === 1 ? "Builder Partner Registration" : "Company Profile Details"}
              </CardTitle>
            </CardHeader>
            <CardContent>

              {/* STEP 1 */}
              {step === 1 && (
                <form onSubmit={handleAuthSubmit} className="space-y-4 max-w-md mx-auto">
                  <div className="space-y-2">
                    <Label>Email Address</Label>
                    <Input type="email" required value={authData.email} onChange={(e) => setAuthData({ ...authData, email: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Password</Label>
                    <Input type="password" required value={authData.password} onChange={(e) => setAuthData({ ...authData, password: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Confirm Password</Label>
                    <Input type="password" required value={authData.confirmPassword} onChange={(e) => setAuthData({ ...authData, confirmPassword: e.target.value })} />
                  </div>
                  <Button className="w-full bg-orange-600 hover:bg-orange-700" disabled={loading}>
                    {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating...</> : <>Next: Company Details <ChevronRight className="ml-2 h-4 w-4" /></>}
                  </Button>
                  <div className="text-center text-sm text-gray-600 mt-4">
                     Already registered? <button type="button" onClick={() => navigate('/partner/login')} className="text-blue-600 hover:underline font-medium">Login here</button>
                  </div>
                </form>
              )}

              {/* STEP 2 */}
              {step === 2 && (
                <form onSubmit={handleProfileSubmit} className="space-y-8">
                  
                  {/* Section 1: Basic Company Info */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">1. Company Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Company Name *</Label>
                        <Input required value={formData.companyName} onChange={(e) => setFormData({ ...formData, companyName: e.target.value })} />
                      </div>
                      <div className="space-y-2">
                        <Label>Year of Incorporation *</Label>
                        <Input type="number" placeholder="YYYY" required value={formData.yearOfIncorporation} onChange={(e) => setFormData({ ...formData, yearOfIncorporation: e.target.value })} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Company Overview</Label>
                      <Textarea rows={3} placeholder="Brief about the company..." value={formData.companyOverview} onChange={(e) => setFormData({ ...formData, companyOverview: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <Label>Promoters / Directors Names</Label>
                      <Input placeholder="Name 1, Name 2" value={formData.promotersOrDirectors} onChange={(e) => setFormData({ ...formData, promotersOrDirectors: e.target.value })} />
                    </div>
                  </div>

                  {/* Section 2: Contact Person */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">2. Contact Person Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label>Name *</Label>
                        <Input required value={formData.contactPersonName} onChange={(e) => setFormData({ ...formData, contactPersonName: e.target.value })} />
                      </div>
                      <div className="space-y-2">
                        <Label>Email *</Label>
                        <Input type="email" required value={formData.contactPersonEmail} onChange={(e) => setFormData({ ...formData, contactPersonEmail: e.target.value })} />
                      </div>
                      <div className="space-y-2">
                        <Label>Phone *</Label>
                        <Input required value={formData.contactPersonPhone} onChange={(e) => setFormData({ ...formData, contactPersonPhone: e.target.value })} />
                      </div>
                    </div>
                  </div>

                  {/* Section 3: Project History */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">3. Track Record</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>RERA Registration No(s)</Label>
                        <Input placeholder="Commas separated" value={formData.reraRegistrationNumbers} onChange={(e) => setFormData({ ...formData, reraRegistrationNumbers: e.target.value })} />
                      </div>
                       <div className="space-y-2">
                        <Label>Total Projects Completed</Label>
                        <Input type="number" value={formData.totalProjectsCompleted} onChange={(e) => setFormData({ ...formData, totalProjectsCompleted: e.target.value })} />
                      </div>
                      <div className="space-y-2">
                        <Label>Total Sqft Delivered</Label>
                        <Input placeholder="e.g. 5 Million Sqft" value={formData.totalSqftDelivered} onChange={(e) => setFormData({ ...formData, totalSqftDelivered: e.target.value })} />
                      </div>
                       <div className="space-y-2">
                        <Label>Banking Partners</Label>
                        <Input placeholder="SBI, HDFC, etc." value={formData.bankingPartners} onChange={(e) => setFormData({ ...formData, bankingPartners: e.target.value })} />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Major Completed Projects</Label>
                        <Textarea placeholder="List key projects" value={formData.majorCompletedProjects} onChange={(e) => setFormData({ ...formData, majorCompletedProjects: e.target.value })} />
                      </div>
                      <div className="space-y-2">
                        <Label>Current Ongoing Projects</Label>
                        <Textarea placeholder="List ongoing projects" value={formData.currentOngoingProjects} onChange={(e) => setFormData({ ...formData, currentOngoingProjects: e.target.value })} />
                      </div>
                    </div>
                  </div>

                  {/* Section 4: Legal & Financial */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">4. Legal & Financial</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Financial of Company Available?</Label>
                        <select className={selectStyle} value={formData.financialOfCompany} onChange={(e) => setFormData({ ...formData, financialOfCompany: e.target.value })}>
                          <option value="">Select</option>
                          <option value="Yes">Yes</option>
                          <option value="No">No</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <Label>Experience with NRI Investors?</Label>
                        <select className={selectStyle} value={formData.experienceWithNriInvestors} onChange={(e) => setFormData({ ...formData, experienceWithNriInvestors: e.target.value })}>
                          <option value="">Select</option>
                          <option value="Yes">Yes</option>
                          <option value="No">No</option>
                        </select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Declared Litigation / Disputes (if any)</Label>
                      <Textarea value={formData.declaredLitigationDisputes} onChange={(e) => setFormData({ ...formData, declaredLitigationDisputes: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <Label>Outstanding Debt (Approx)</Label>
                      <Input value={formData.outstandingDebt} onChange={(e) => setFormData({ ...formData, outstandingDebt: e.target.value })} />
                    </div>
                  </div>

                  {/* Section 5: Location / Address */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">5. Office Location</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       <div className="space-y-2">
                          <Label>Address Line</Label>
                          <Input placeholder="Building, Street" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} />
                       </div>
                       <div className="space-y-2">
                          <Label>Zip Code</Label>
                          <Input value={formData.zip} onChange={(e) => setFormData({ ...formData, zip: e.target.value })} />
                       </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label>Country</Label>
                        <select required className={selectStyle} value={formData.country} onChange={handleCountryChange}>
                          <option value="">Select Country</option>
                          {countries.map((c) => (
                            <option key={c.name} value={c.name}>{c.name}</option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-2">
                        <Label>State</Label>
                        <select required className={selectStyle} value={formData.state} onChange={handleStateChange} disabled={!formData.country}>
                          <option value="">{loadingLocation ? "Loading..." : "Select State"}</option>
                          {states.map((s) => (
                            <option key={s.name} value={s.name}>{s.name}</option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-2">
                        <Label>City</Label>
                        <select required className={selectStyle} value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} disabled={!formData.state}>
                           <option value="">{loadingLocation ? "Loading..." : "Select City"}</option>
                           {cities.map((city, index) => (
                             <option key={index} value={city}>{city}</option>
                           ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Terms */}
                  <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                    <Checkbox id="terms" checked={formData.termsAccepted} onCheckedChange={(checked) => setFormData({ ...formData, termsAccepted: checked })} />
                    <div className="flex-1">
                      <Label htmlFor="terms" className="text-sm font-normal cursor-pointer">
                        I confirm that the information provided is accurate and agree to the platform terms.
                      </Label>
                    </div>
                  </div>

                  <Button type="submit" className="w-full bg-orange-600 hover:bg-orange-700 py-6 text-lg" disabled={loading}>
                    {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...</> : 'Complete Registration'}
                  </Button>
                </form>
              )}

            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default BuilderRegister;