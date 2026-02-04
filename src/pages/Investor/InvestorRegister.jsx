import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';
import { ChevronRight, Loader2 } from 'lucide-react';
import { createUserAuth, updateInvestorProfile } from '@/api';

const InvestorRegister = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(false);

  // --- Auth State ---
  const [authData, setAuthData] = useState({ email: '', password: '', confirmPassword: '' });

  // --- Profile State ---
  const [profileData, setProfileData] = useState({
    fullName: '',
    contactNumber: '',
    investorType: '',
    address: '',
    country: '',
    state: '',
    city: '',
    zip: '',
    totalInvestedAmount: '',
    preferredProjectTypes: '',
    kycDocuments: null
  });

  // --- Location Data State ---
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
        if (!data.error) {
          setCountries(data.data || []);
        }
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    };
    fetchCountries();
  }, []);

  // --- Handle Country Change -> Fetch States ---
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
        if (!data.error) {
          setStates(data.data.states || []);
        }
      } catch (error) {
        console.error("Error fetching states:", error);
      } finally {
        setLoadingLocation(false);
      }
    }
  };

  // --- Handle State Change -> Fetch Cities ---
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
        if (!data.error) {
          setCities(data.data || []);
        }
      } catch (error) {
        console.error("Error fetching cities:", error);
      } finally {
        setLoadingLocation(false);
      }
    }
  };

  // --- Handlers ---
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
      toast({ title: "Account Created", description: "Now, let's complete your profile." });
    } catch (err) {
      toast({ title: "Registration Failed", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      // Note: File upload (kycDocuments) usually requires FormData or a separate upload API call first.
      // Here we are just sending the profile data object.
      await updateInvestorProfile(userId, profileData);
      toast({ title: "Success!", description: "Profile completed successfully." });
      navigate('/login');
    } catch (err) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  // Helper for consistent dropdown styles
  const selectStyle = "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Toaster />
      <div className="container mt-16 mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <Card className="shadow-xl border-none bg-white">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold">
                {step === 1 ? "Create Investor Account" : "Complete Your Profile"}
              </CardTitle>
            </CardHeader>
            <CardContent>

              {/* STEP 1: AUTHENTICATION */}
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
                  <Button className="w-full bg-blue-600 hover:bg-blue-700" disabled={loading}>
                    {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating...</> : <>Next: Profile Details <ChevronRight className="ml-2 h-4 w-4" /></>}
                  </Button>
                </form>
              )}

              {/* STEP 2: PROFILE DETAILS */}
              {step === 2 && (
                <form onSubmit={handleProfileSubmit} className="space-y-6">
                  
                  {/* Personal Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Full Name</Label>
                      <Input required placeholder="John Doe" value={profileData.fullName} onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <Label>Contact Number</Label>
                      <Input required placeholder="+91 98765 43210" value={profileData.contactNumber} onChange={(e) => setProfileData({ ...profileData, contactNumber: e.target.value })} />
                    </div>
                  </div>

                  {/* Investor Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Investor Type</Label>
                      <select required className={selectStyle} value={profileData.investorType} onChange={(e) => setProfileData({ ...profileData, investorType: e.target.value })}>
                        <option value="">Select Type</option>
                        <option value="Individual">Individual</option>
                        <option value="Institutional">Institutional</option>
                        <option value="NRI">NRI</option>
                        <option value="Corporate">Corporate</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label>Total Invested Amount (₹)</Label>
                      <Input type="number" placeholder="5000000" value={profileData.totalInvestedAmount} onChange={(e) => setProfileData({ ...profileData, totalInvestedAmount: e.target.value })} />
                    </div>
                  </div>

                  {/* Address */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                     <div className="md:col-span-2 space-y-2">
                        <Label>Address</Label>
                        <Input placeholder="Apartment, Street" value={profileData.address} onChange={(e) => setProfileData({ ...profileData, address: e.target.value })} />
                     </div>
                     <div className="space-y-2">
                        <Label>Zip Code</Label>
                        <Input placeholder="380001" value={profileData.zip} onChange={(e) => setProfileData({ ...profileData, zip: e.target.value })} />
                     </div>
                  </div>

                  {/* Location Dropdowns */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Country */}
                    <div className="space-y-2">
                      <Label>Country</Label>
                      <select required className={selectStyle} value={profileData.country} onChange={handleCountryChange}>
                        <option value="">Select Country</option>
                        {countries.map((c) => (
                          <option key={c.name} value={c.name}>{c.name}</option>
                        ))}
                      </select>
                    </div>

                    {/* State */}
                    <div className="space-y-2">
                      <Label>State</Label>
                      <select required className={selectStyle} value={profileData.state} onChange={handleStateChange} disabled={!profileData.country}>
                        <option value="">{loadingLocation ? "Loading..." : "Select State"}</option>
                        {states.map((s) => (
                          <option key={s.name} value={s.name}>{s.name}</option>
                        ))}
                      </select>
                    </div>

                    {/* City */}
                    <div className="space-y-2">
                      <Label>City</Label>
                      <select required className={selectStyle} value={profileData.city} onChange={(e) => setProfileData({...profileData, city: e.target.value})} disabled={!profileData.state}>
                         <option value="">{loadingLocation ? "Loading..." : "Select City"}</option>
                         {cities.map((city, index) => (
                           <option key={index} value={city}>{city}</option>
                         ))}
                      </select>
                    </div>
                  </div>

                  {/* Preferences & Documents */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Preferred Project Types</Label>
                      <select className={selectStyle} value={profileData.preferredProjectTypes} onChange={(e) => setProfileData({ ...profileData, preferredProjectTypes: e.target.value })}>
                        <option value="">Select Preference</option>
                        <option value="Residential">Residential</option>
                        <option value="Commercial">Commercial</option>
                        <option value="Mixed-Use">Mixed-Use</option>
                        <option value="Industrial">Industrial</option>
                        <option value="Land">Land / Plot</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label>KYC Documents (Optional)</Label>
                      <Input 
                        type="file" 
                        className="cursor-pointer"
                        onChange={(e) => setProfileData({ ...profileData, kycDocuments: e.target.files[0] })} 
                      />
                    </div>
                  </div>

                  <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 py-6 text-lg mt-4" disabled={loading}>
                    {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving Profile...</> : "Complete Registration"}
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

export default InvestorRegister;