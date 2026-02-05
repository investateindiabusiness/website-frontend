import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// import Header from '@/components/Header'; // Commented out for full screen layout
// import Footer from '@/components/Footer'; // Commented out for full screen layout
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox'; // Added Checkbox
import { toast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';
import { CheckCircle, ChevronRight, Loader2, TrendingUp, CheckCircle2, UserCheck, Upload } from 'lucide-react';
import { createUserAuth, updateInvestorProfile } from '@/api';
import Footer from '@/components/Footer';
import Header from '@/components/Header';

const InvestorRegister = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // --- Step 1: Auth Data ---
  const [authData, setAuthData] = useState({ email: '', password: '', confirmPassword: '' });

  // --- Step 2: Profile Data ---
  const [profileData, setProfileData] = useState({
    fullName: '',
    contactNumber: '',
    investorType: '',
    
    // Investment Details
    totalInvestedAmount: '',
    preferredProjectTypes: '',
    
    // Location
    address: '',
    country: '',
    state: '',
    city: '',
    zip: '',
    
    // Docs
    kycDocuments: null,
    
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
    setProfileData({ ...profileData, country: selectedCountry, state: '', city: '' });
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
    setProfileData({ ...profileData, state: selectedState, city: '' });
    setCities([]);

    if (selectedState && profileData.country) {
      setLoadingLocation(true);
      try {
        const res = await fetch('https://countriesnow.space/api/v0.1/countries/state/cities', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ country: profileData.country, state: selectedState })
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
      const response = await createUserAuth(authData);
      setUserId(response.uid);
      setStep(2);
      toast({ title: "Account Created", description: "Please complete your investment profile." });
    } catch (err) {
      toast({ title: "Registration Failed", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    if (!profileData.termsAccepted) {
      return toast({ title: 'Error', description: 'Please accept the terms and conditions', variant: 'destructive' });
    }
    try {
      setLoading(true);
      // Note: For file uploads (kycDocuments), ensure your API handles FormData if needed.
      // This implementation passes the object as is, matching your previous logic.
      await updateInvestorProfile(userId, profileData);
      setSubmitted(true);
    } catch (error) {
      console.error(error);
      toast({ title: 'Error', description: error.message || 'Failed to submit.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  // Helper styles (Matched exactly to BuilderRegister)
  const inputStyle = "h-11 px-4 bg-white border-gray-200 focus:bg-white focus:ring-2 focus:ring-orange-500/10 focus:border-orange-500 transition-all rounded-lg";
  const selectStyle = "flex h-11 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/10 focus-visible:border-orange-500 disabled:cursor-not-allowed disabled:opacity-50 transition-all";
  const labelStyle = "text-sm font-semibold text-gray-700 mb-1.5 block";

  return (
    <div className="fixed inset-0 w-full h-full flex bg-white overflow-hidden z-50">
      <div className="lg:hidden w-full absolute top-0 left-0 z-50">
        <Header />
      </div>
      <Toaster />

      {/* LEFT PANEL: Investor Themed */}
      <div className="hidden lg:flex lg:w-1/2 h-full relative bg-[#1a2e35] flex-col justify-center px-12 xl:px-20 text-white overflow-hidden">
        {/* Background Gradient & Image */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-900/40 via-[#1a2e35] to-[#0f1c21] z-0"></div>
        <div
          className="absolute inset-0 opacity-10 z-0"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop')`, // Different image for investors (high rise/finance)
            backgroundSize: 'cover',
            backgroundBlendMode: 'overlay'
          }}
        />

        <div className="relative z-10 max-w-lg">
          <div className="flex items-center space-x-2 mb-8">
            <img src="/logo-big.png" alt="INVESTATE INDIA" onClick={() => navigate('/')} className="h-24 w-auto hover:cursor-pointer" />
          </div>

          <h1 className="text-4xl xl:text-5xl font-bold mb-6 leading-tight">
            Grow your wealth <br />
            <span className="text-orange-500">with confidence.</span>
          </h1>

          <p className="text-lg text-gray-300 mb-10 leading-relaxed font-light">
            Access exclusive, high-yield real estate opportunities. Join a network of elite investors and builders today.
          </p>

          <div className="space-y-5">
            {["Curated Premium Projects", "Transparent Documentation", "High ROI Potential"].map((item, index) => (
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

      {/* RIGHT PANEL: Form */}
      <div className="flex-1 h-full bg-gray-50 overflow-y-auto mt-10 md:mt-0">
        <div className="min-h-full flex flex-col items-center p-4 lg:p-8 xl:p-12">

          <div className={`w-full max-w-3xl my-auto bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden transition-all duration-500 ease-in-out`}>

            {submitted ? (
              // Success State
              <div className="p-12 text-center">
                <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="h-10 w-10 text-green-600" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Profile Completed!</h2>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                  Thank you. Your investor profile has been created. You can now browse exclusive projects and start investing.
                </p>
                <Button onClick={() => navigate('/login')} className="bg-[#ea580c] hover:bg-[#c2410c] px-8 py-6 text-lg">
                  Proceed to Login
                </Button>
              </div>
            ) : (
              // Form Content
              <div className="p-8 md:p-10">
                <div className="text-left mb-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-orange-50">
                      {step === 1 ? <UserCheck className="h-5 w-5 text-orange-600" /> : <TrendingUp className="h-5 w-5 text-orange-600" />}
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900">
                      {step === 1 ? "Create Account" : "Investor Profile"}
                    </h2>
                  </div>
                  <p className="mt-2 text-sm md:text-base text-gray-500">
                    {step === 1 ? "Start your investment journey." : "Tell us about your investment preferences."}
                  </p>
                </div>

                {/* STEP 1: AUTH */}
                {step === 1 && (
                  <form onSubmit={handleAuthSubmit} className="space-y-5">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label className={labelStyle}>Email Address</Label>
                        <Input type="email" required value={authData.email} onChange={(e) => setAuthData({ ...authData, email: e.target.value })} className={inputStyle} placeholder="you@example.com" />
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
                      Already have an account?
                      <button type="button" className="text-orange-600 hover:underline font-medium ml-2" onClick={() => navigate('/login')}>
                        Login Now
                      </button>
                    </div>
                  </form>
                )}

                {/* STEP 2: PROFILE */}
                {step === 2 && (
                  <form onSubmit={handleProfileSubmit} className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">

                    {/* Section 1: Personal Info */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 text-xs text-gray-600">1</span>
                        Personal Information
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-1.5">
                          <Label className={labelStyle}>Full Name *</Label>
                          <Input required value={profileData.fullName} onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })} className={inputStyle} />
                        </div>
                        <div className="space-y-1.5">
                          <Label className={labelStyle}>Contact Number *</Label>
                          <Input required placeholder="+91..." value={profileData.contactNumber} onChange={(e) => setProfileData({ ...profileData, contactNumber: e.target.value })} className={inputStyle} />
                        </div>
                      </div>
                    </div>

                    <div className="h-px bg-gray-100 w-full" />

                    {/* Section 2: Investment Details */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 text-xs text-gray-600">2</span>
                        Investment Profile
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-1.5">
                          <Label className={labelStyle}>Investor Type</Label>
                          <select required className={selectStyle} value={profileData.investorType} onChange={(e) => setProfileData({ ...profileData, investorType: e.target.value })}>
                            <option value="">Select Type</option>
                            <option value="Individual">Individual</option>
                            <option value="Institutional">Institutional</option>
                            <option value="NRI">NRI</option>
                            <option value="Corporate">Corporate</option>
                          </select>
                        </div>
                        <div className="space-y-1.5">
                          <Label className={labelStyle}>Total Investment Capacity (₹)</Label>
                          <Input type="number" placeholder="e.g. 5000000" value={profileData.totalInvestedAmount} onChange={(e) => setProfileData({ ...profileData, totalInvestedAmount: e.target.value })} className={inputStyle} />
                        </div>
                        <div className="col-span-1 md:col-span-2 space-y-1.5">
                          <Label className={labelStyle}>Preferred Project Types</Label>
                          <select className={selectStyle} value={profileData.preferredProjectTypes} onChange={(e) => setProfileData({ ...profileData, preferredProjectTypes: e.target.value })}>
                            <option value="">Select Preference</option>
                            <option value="Residential">Residential</option>
                            <option value="Commercial">Commercial</option>
                            <option value="Mixed-Use">Mixed-Use</option>
                            <option value="Industrial">Industrial</option>
                            <option value="Land">Land / Plot</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="h-px bg-gray-100 w-full" />

                    {/* Section 3: Location / Address */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 text-xs text-gray-600">3</span>
                        Address Details
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-1.5">
                          <Label className={labelStyle}>Address Line</Label>
                          <Input placeholder="Apartment, Street" value={profileData.address} onChange={(e) => setProfileData({ ...profileData, address: e.target.value })} className={inputStyle} />
                        </div>
                        <div className="space-y-1.5">
                          <Label className={labelStyle}>Zip Code</Label>
                          <Input value={profileData.zip} onChange={(e) => setProfileData({ ...profileData, zip: e.target.value })} className={inputStyle} />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        <div className="space-y-1.5">
                          <Label className={labelStyle}>Country</Label>
                          <select required className={selectStyle} value={profileData.country} onChange={handleCountryChange}>
                            <option value="">Select Country</option>
                            {countries.map((c) => (
                              <option key={c.name} value={c.name}>{c.name}</option>
                            ))}
                          </select>
                        </div>
                        <div className="space-y-1.5">
                          <Label className={labelStyle}>State</Label>
                          <select required className={selectStyle} value={profileData.state} onChange={handleStateChange} disabled={!profileData.country}>
                            <option value="">{loadingLocation ? "Loading..." : "Select State"}</option>
                            {states.map((s) => (
                              <option key={s.name} value={s.name}>{s.name}</option>
                            ))}
                          </select>
                        </div>
                        <div className="space-y-1.5">
                          <Label className={labelStyle}>City</Label>
                          <select required className={selectStyle} value={profileData.city} onChange={(e) => setProfileData({ ...profileData, city: e.target.value })} disabled={!profileData.state}>
                            <option value="">{loadingLocation ? "Loading..." : "Select City"}</option>
                            {cities.map((city, index) => (
                              <option key={index} value={city}>{city}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="h-px bg-gray-100 w-full" />

                    {/* Section 4: Documents */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 text-xs text-gray-600">4</span>
                        KYC (Optional)
                      </h3>
                      <div className="space-y-1.5">
                         <Label className={labelStyle}>Upload Documents</Label>
                         <div className="flex items-center gap-3">
                            <Input 
                              type="file" 
                              className={`file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100 ${inputStyle} pt-2`}
                              onChange={(e) => setProfileData({ ...profileData, kycDocuments: e.target.files[0] })} 
                            />
                         </div>
                      </div>
                    </div>

                    {/* Terms */}
                    <div className="flex items-start space-x-3 p-4 bg-orange-50/50 border border-orange-100 rounded-lg">
                      <Checkbox id="terms" checked={profileData.termsAccepted} onCheckedChange={(checked) => setProfileData({ ...profileData, termsAccepted: checked })} className="data-[state=checked]:bg-orange-600 border-orange-200" />
                      <div className="flex-1">
                        <Label htmlFor="terms" className="text-sm font-medium text-gray-600 cursor-pointer leading-snug">
                          I confirm that the information provided is accurate and agree to the platform <span className="text-orange-600 underline">terms and conditions</span>.
                        </Label>
                      </div>
                    </div>

                    <Button type="submit" className="w-full h-12 bg-[#ea580c] hover:bg-[#c2410c] text-white font-bold text-lg rounded-lg shadow-lg shadow-orange-500/20 transition-all" disabled={loading}>
                      {loading ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Saving Profile...</> : 'Complete Registration'}
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

export default InvestorRegister;