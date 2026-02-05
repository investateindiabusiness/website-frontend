import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// import Header from '@/components/Header'; // Commented out
// import Footer from '@/components/Footer'; // Commented out
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';
import { CheckCircle, ChevronRight, Loader2, Building, ArrowRight, CheckCircle2, UserCheck } from 'lucide-react';
import { createBuilderAuth, updateBuilderProfile } from '@/api';
import Footer from '@/components/Footer';
import Header from '@/components/Header';

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
    promotersOrDirectors: '',

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
    financialOfCompany: '',
    outstandingDebt: '',
    bankingPartners: '',
    declaredLitigationDisputes: '',
    experienceWithNriInvestors: '',

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
  const inputStyle = "h-11 px-4 bg-white border-gray-200 focus:bg-white focus:ring-2 focus:ring-orange-500/10 focus:border-orange-500 transition-all rounded-lg";
  const selectStyle = "flex h-11 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/10 focus-visible:border-orange-500 disabled:cursor-not-allowed disabled:opacity-50 transition-all";
  const labelStyle = "text-sm font-semibold text-gray-700 mb-1.5 block";

  return (
    <div className="fixed inset-0 w-full h-full flex bg-white overflow-hidden z-50">
      <div className="lg:hidden w-full absolute top-0 left-0 z-50">
        <Header />
      </div>
      <Toaster />

      {/* LEFT PANEL: Fixed width, Full Height, Hidden Overflow */}
      <div className="hidden lg:flex lg:w-1/2 h-full relative bg-[#2A1B15] flex-col justify-center px-12 xl:px-20 text-white overflow-hidden">
        {/* Background Gradient & Image */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-900/40 via-[#2A1B15] to-[#1a100c] z-0"></div>
        <div
          className="absolute inset-0 opacity-10 z-0"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=2070&auto=format&fit=crop')`,
            backgroundSize: 'cover',
            backgroundBlendMode: 'overlay'
          }}
        />

        <div className="relative z-10 max-w-lg">
          <div className="flex items-center space-x-2 mb-8">
            <img src="/logo-big.png" alt="INVESTATE INDIA" onClick={() => navigate('/')} className="h-24 w-auto hover:cursor-pointer" />
          </div>

          <h1 className="text-4xl xl:text-5xl font-bold mb-6 leading-tight">
            Scale your projects <br />
            <span className="text-orange-500">without limits.</span>
          </h1>

          <p className="text-lg text-gray-300 mb-10 leading-relaxed font-light">
            Join our exclusive network of top-tier builders. Access global investors and streamline your fundraising.
          </p>

          <div className="space-y-5">
            {["Verified Investor Network", "Automated Compliance", "Fast-track Funding"].map((item, index) => (
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

      {/* RIGHT PANEL: Takes remaining width, Independent Scrolling */}
      <div className="flex-1 h-full bg-gray-50 overflow-y-auto mt-10 md:mt-0">
        {/* Wrapper: Ensures centering but allows expansion */}
        <div className="min-h-full flex flex-col items-center p-4 lg:p-8 xl:p-12">

          {/* Card Container: 'my-auto' centers vertically if content is short, flows naturally if long */}
          <div className={`w-full max-w-3xl my-auto bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden transition-all duration-500 ease-in-out`}>

            {submitted ? (
              // Success State
              <div className="p-12 text-center">
                <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="h-10 w-10 text-green-600" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Registration Submitted!</h2>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                  Thank you. Our team will verify your company details and contact you shortly to activate your dashboard.
                </p>
                <Button onClick={() => navigate('/partner/login')} className="bg-[#ea580c] hover:bg-[#c2410c] px-8 py-6 text-lg">
                  Proceed to Login
                </Button>
              </div>
            ) : (
              // Form Content
              <div className="p-8 md:p-10">
                <div className="text-left mb-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-orange-50">
                      {step === 1 ? <UserCheck className="h-5 w-5 text-orange-600" /> : <Building className="h-5 w-5 text-orange-600" />}
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900">
                      {step === 1 ? "Create Account" : "Company Profile"}
                    </h2>
                  </div>
                  <p className="mt-2 text-sm md:text-base text-gray-500">
                    {step === 1 ? "Enter your email to get started." : "Tell us about your organization."}
                  </p>
                </div>

                {/* STEP 1: AUTH */}
                {step === 1 && (
                  <form onSubmit={handleAuthSubmit} className="space-y-5">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label className={labelStyle}>Email Address</Label>
                        <Input type="email" required value={authData.email} onChange={(e) => setAuthData({ ...authData, email: e.target.value })} className={inputStyle} placeholder="work@company.com" />
                      </div>
                      <div className="space-y-2">
                        <Label className={labelStyle}>Password</Label>
                        <Input type="password" required value={authData.password} onChange={(e) => setAuthData({ ...authData, password: e.target.value })} className={inputStyle} placeholder="••••••••" />
                      </div>
                      <div className="space-y-2">
                        <Label className={labelStyle}>Confirm Password</Label>
                        <Input type="password" required value={authData.confirmPassword} onChange={(e) => setAuthData({ ...authData, confirmPassword: e.target.value })} className={inputStyle} placeholder="••••••••" />
                      </div>
                    </div>

                    <Button type="submit" className="w-full h-11 bg-[#ea580c] hover:bg-[#c2410c] text-white font-semibold text-sm rounded-lg shadow-lg shadow-orange-500/20 transition-all mt-4" disabled={loading}>
                      {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating...</> : <>Register <ChevronRight className="ml-2 h-4 w-4" /></>}
                    </Button>

                    <div className="text-center text-sm text-gray-600">
                      Alredy Partner
                      <button type="button" className="text-orange-600 hover:underline font-medium ml-2" onClick={() => navigate('/partner/login')}>
                        Login Now
                      </button>
                    </div>
                  </form>
                )}

                {/* STEP 2: PROFILE */}
                {step === 2 && (
                  <form onSubmit={handleProfileSubmit} className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">

                    {/* Section 1: Basic Company Info */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 text-xs text-gray-600">1</span>
                        Company Information
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-1.5">
                          <Label className={labelStyle}>Company Name *</Label>
                          <Input required value={formData.companyName} onChange={(e) => setFormData({ ...formData, companyName: e.target.value })} className={inputStyle} />
                        </div>
                        <div className="space-y-1.5">
                          <Label className={labelStyle}>Year of Incorporation *</Label>
                          <Input type="number" placeholder="YYYY" required value={formData.yearOfIncorporation} onChange={(e) => setFormData({ ...formData, yearOfIncorporation: e.target.value })} className={inputStyle} />
                        </div>
                        <div className="col-span-1 md:col-span-2 space-y-1.5">
                          <Label className={labelStyle}>Company Overview</Label>
                          <Textarea rows={3} placeholder="Brief about the company..." value={formData.companyOverview} onChange={(e) => setFormData({ ...formData, companyOverview: e.target.value })} className="bg-white border-gray-200 focus:ring-orange-500/10 focus:border-orange-500 resize-none" />
                        </div>
                        <div className="col-span-1 md:col-span-2 space-y-1.5">
                          <Label className={labelStyle}>Promoters / Directors Names</Label>
                          <Input placeholder="Name 1, Name 2" value={formData.promotersOrDirectors} onChange={(e) => setFormData({ ...formData, promotersOrDirectors: e.target.value })} className={inputStyle} />
                        </div>
                      </div>
                    </div>

                    <div className="h-px bg-gray-100 w-full" />

                    {/* Section 2: Contact Person */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 text-xs text-gray-600">2</span>
                        Contact Person Details
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        <div className="space-y-1.5">
                          <Label className={labelStyle}>Name *</Label>
                          <Input required value={formData.contactPersonName} onChange={(e) => setFormData({ ...formData, contactPersonName: e.target.value })} className={inputStyle} />
                        </div>
                        <div className="space-y-1.5">
                          <Label className={labelStyle}>Email *</Label>
                          <Input type="email" required value={formData.contactPersonEmail} onChange={(e) => setFormData({ ...formData, contactPersonEmail: e.target.value })} className={inputStyle} />
                        </div>
                        <div className="space-y-1.5">
                          <Label className={labelStyle}>Phone *</Label>
                          <Input required value={formData.contactPersonPhone} onChange={(e) => setFormData({ ...formData, contactPersonPhone: e.target.value })} className={inputStyle} />
                        </div>
                      </div>
                    </div>

                    <div className="h-px bg-gray-100 w-full" />

                    {/* Section 3: Track Record */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 text-xs text-gray-600">3</span>
                        Track Record
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-1.5">
                          <Label className={labelStyle}>RERA Registration No(s)</Label>
                          <Input placeholder="Commas separated" value={formData.reraRegistrationNumbers} onChange={(e) => setFormData({ ...formData, reraRegistrationNumbers: e.target.value })} className={inputStyle} />
                        </div>
                        <div className="space-y-1.5">
                          <Label className={labelStyle}>Total Projects Completed</Label>
                          <Input type="number" value={formData.totalProjectsCompleted} onChange={(e) => setFormData({ ...formData, totalProjectsCompleted: e.target.value })} className={inputStyle} />
                        </div>
                        <div className="space-y-1.5">
                          <Label className={labelStyle}>Total Sqft Delivered</Label>
                          <Input placeholder="e.g. 5 Million Sqft" value={formData.totalSqftDelivered} onChange={(e) => setFormData({ ...formData, totalSqftDelivered: e.target.value })} className={inputStyle} />
                        </div>
                        <div className="space-y-1.5">
                          <Label className={labelStyle}>Banking Partners</Label>
                          <Input placeholder="SBI, HDFC, etc." value={formData.bankingPartners} onChange={(e) => setFormData({ ...formData, bankingPartners: e.target.value })} className={inputStyle} />
                        </div>
                        <div className="col-span-1 md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-5">
                          <div className="space-y-1.5">
                            <Label className={labelStyle}>Major Completed Projects</Label>
                            <Textarea rows={2} placeholder="List key projects" value={formData.majorCompletedProjects} onChange={(e) => setFormData({ ...formData, majorCompletedProjects: e.target.value })} className="bg-white border-gray-200 focus:ring-orange-500/10 focus:border-orange-500 resize-none" />
                          </div>
                          <div className="space-y-1.5">
                            <Label className={labelStyle}>Current Ongoing Projects</Label>
                            <Textarea rows={2} placeholder="List ongoing projects" value={formData.currentOngoingProjects} onChange={(e) => setFormData({ ...formData, currentOngoingProjects: e.target.value })} className="bg-white border-gray-200 focus:ring-orange-500/10 focus:border-orange-500 resize-none" />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="h-px bg-gray-100 w-full" />

                    {/* Section 4: Legal & Financial */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 text-xs text-gray-600">4</span>
                        Legal & Financial
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-1.5">
                          <Label className={labelStyle}>Financial of Company Available?</Label>
                          <select className={selectStyle} value={formData.financialOfCompany} onChange={(e) => setFormData({ ...formData, financialOfCompany: e.target.value })}>
                            <option value="">Select</option>
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                          </select>
                        </div>
                        <div className="space-y-1.5">
                          <Label className={labelStyle}>Experience with NRI Investors?</Label>
                          <select className={selectStyle} value={formData.experienceWithNriInvestors} onChange={(e) => setFormData({ ...formData, experienceWithNriInvestors: e.target.value })}>
                            <option value="">Select</option>
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                          </select>
                        </div>
                        <div className="space-y-1.5">
                          <Label className={labelStyle}>Outstanding Debt (Approx)</Label>
                          <Input value={formData.outstandingDebt} onChange={(e) => setFormData({ ...formData, outstandingDebt: e.target.value })} className={inputStyle} />
                        </div>
                        <div className="space-y-1.5">
                          <Label className={labelStyle}>Declared Litigation / Disputes</Label>
                          <Textarea rows={1} value={formData.declaredLitigationDisputes} onChange={(e) => setFormData({ ...formData, declaredLitigationDisputes: e.target.value })} className="bg-white border-gray-200 focus:ring-orange-500/10 focus:border-orange-500 resize-none" />
                        </div>
                      </div>
                    </div>

                    <div className="h-px bg-gray-100 w-full" />

                    {/* Section 5: Location / Address */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 text-xs text-gray-600">5</span>
                        Office Location
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-1.5">
                          <Label className={labelStyle}>Address Line</Label>
                          <Input placeholder="Building, Street" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} className={inputStyle} />
                        </div>
                        <div className="space-y-1.5">
                          <Label className={labelStyle}>Zip Code</Label>
                          <Input value={formData.zip} onChange={(e) => setFormData({ ...formData, zip: e.target.value })} className={inputStyle} />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        <div className="space-y-1.5">
                          <Label className={labelStyle}>Country</Label>
                          <select required className={selectStyle} value={formData.country} onChange={handleCountryChange}>
                            <option value="">Select Country</option>
                            {countries.map((c) => (
                              <option key={c.name} value={c.name}>{c.name}</option>
                            ))}
                          </select>
                        </div>
                        <div className="space-y-1.5">
                          <Label className={labelStyle}>State</Label>
                          <select required className={selectStyle} value={formData.state} onChange={handleStateChange} disabled={!formData.country}>
                            <option value="">{loadingLocation ? "Loading..." : "Select State"}</option>
                            {states.map((s) => (
                              <option key={s.name} value={s.name}>{s.name}</option>
                            ))}
                          </select>
                        </div>
                        <div className="space-y-1.5">
                          <Label className={labelStyle}>City</Label>
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
                    <div className="flex items-start space-x-3 p-4 bg-orange-50/50 border border-orange-100 rounded-lg">
                      <Checkbox id="terms" checked={formData.termsAccepted} onCheckedChange={(checked) => setFormData({ ...formData, termsAccepted: checked })} className="data-[state=checked]:bg-orange-600 border-orange-200" />
                      <div className="flex-1">
                        <Label htmlFor="terms" className="text-sm font-medium text-gray-600 cursor-pointer leading-snug">
                          I confirm that the information provided is accurate and agree to the platform <span className="text-orange-600 underline">terms and conditions</span>.
                        </Label>
                      </div>
                    </div>

                    <Button type="submit" className="w-full h-12 bg-[#ea580c] hover:bg-[#c2410c] text-white font-bold text-lg rounded-lg shadow-lg shadow-orange-500/20 transition-all" disabled={loading}>
                      {loading ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Submitting Application...</> : 'Complete Registration'}
                    </Button>
                  </form>
                )}
              </div>
            )}

          </div>
        </div>
        <div className="lg:hidden mt-10">
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default BuilderRegister;