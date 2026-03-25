import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { Loader2, CheckCircle, FileWarning, ClipboardList, TrendingUp, Building, ArrowRight } from 'lucide-react';
import { submitRequestedChanges, submitBuilderForm2, submitInvestorForm2 } from '@/api';

const ContinueOnboardingDialog = ({ isOpen, onOpenChange, data = {} }) => {
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    // Track initialization to prevent React from freezing/overwriting the inputs when typing
    const [isInitialized, setIsInitialized] = useState(false);
    const [dynamicFormData, setDynamicFormData] = useState({});

    const [invForm2, setInvForm2] = useState({
        profession: '', yearlyIncome: '', investmentTenure: '', industryNatureOfWork: '', expectedReturns: '', preferredProjectType: '', preferredGoalStategy : '', investmentPreference: ''
    });

    const [bldForm2, setBldForm2] = useState({
        yearOfIncorporation: '', promotersOrDirectors: '', totalSqftDelivered: '', majorCompletedProjects: '', typeOfProjectsOffered: '', companyOverview: '', experienceWithNriInvestors: '', declaredLitigationDisputes: '', financialOfCompany: '', outstandingDebt: '', bankingPartners: ''
    });

    const { error: phase, uid, role, adminRequests = [], userData = {} } = data;
    const userType = role || 'investor';

    // PRE-FILL LOGIC: Only run once per open so it doesn't freeze the user's typing
    useEffect(() => {
        if (isOpen && phase === 'CHANGES_REQUESTED' && adminRequests.length > 0 && !isInitialized) {
            const initialData = {};
            adminRequests.forEach(req => {
                const fieldId = typeof req === 'string' ? req : (req.id || req.fieldName);
                if (fieldId) {
                    initialData[fieldId] = userData[fieldId] || '';
                }
            });
            setDynamicFormData(initialData);
            setIsInitialized(true);
        }
    }, [isOpen, phase, adminRequests, userData, isInitialized]);

    // Reset everything when the modal closes
    useEffect(() => {
        if (!isOpen) {
            setTimeout(() => {
                setSubmitted(false);
                setIsInitialized(false);
                setDynamicFormData({});
            }, 300);
        }
    }, [isOpen]);

    const handleDynamicChangeSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            await submitRequestedChanges(uid, dynamicFormData);
            setSubmitted(true);
        } catch (err) {
            toast({ title: "Error", description: err.message, variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    const handleForm2Submit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            if (role === 'investor') {
                await submitInvestorForm2(uid, invForm2);
            } else {
                await submitBuilderForm2(uid, bldForm2);
            }
            setSubmitted(true);
        } catch (err) {
            toast({ title: "Error", description: err.message, variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    const isFieldRequested = (fieldName) => {
        return adminRequests.some(req => {
            const id = typeof req === 'string' ? req : (req.id || req.fieldName);
            return id === fieldName;
        });
    };

    const content = {
        investor: {
            image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop",
            title: "Grow your wealth", highlight: "with confidence.",
            desc: "Access exclusive, high-yield real estate opportunities. Join a network of elite investors.",
            features: ["Curated Premium Projects", "Transparent Documentation", "High ROI Potential"]
        },
        builder: {
            image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=2070&auto=format&fit=crop",
            title: "Scale your projects", highlight: "without limits.",
            desc: "Join our exclusive network of top-tier builders. Access global investors and streamline fundraising.",
            features: ["Verified Investor Network", "Automated Compliance", "Fast-track Funding"]
        }
    };

    const inputStyle = "h-11 px-4 bg-white border-gray-200 focus:bg-white focus:ring-2 focus:ring-orange-500/10 focus:border-orange-500 transition-all rounded-lg w-full";
    const textareaStyle = "min-h-[80px] px-4 py-3 bg-white border-gray-200 focus:bg-white focus:ring-2 focus:ring-orange-500/10 focus:border-orange-500 transition-all rounded-lg w-full";
    const selectStyle = "flex h-11 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/10 transition-all";
    const labelStyle = "text-sm font-semibold text-gray-700 block mb-1.5";
    const readOnlyStyle = "h-11 px-4 bg-gray-100 border-gray-200 text-gray-500 rounded-lg w-full cursor-not-allowed";

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-5xl p-0 overflow-hidden bg-white border-none shadow-2xl flex max-h-[90vh]">
                <DialogTitle className="sr-only">Continue Registration</DialogTitle>
                <DialogDescription className="sr-only">Please complete the required onboarding fields to proceed.</DialogDescription>

                {/* --- HERO SECTION --- */}
                <div className="hidden lg:flex lg:w-2/5 relative bg-[#1c1c1c] flex-col justify-center px-10 text-white overflow-hidden transition-all duration-500">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#ffffff6b] via-[#1c1c1c] to-[#000] z-0"></div>
                    <div className="absolute inset-0 opacity-15 z-0 transition-all duration-700" style={{ backgroundImage: `url('${content[userType].image}')`, backgroundSize: 'cover', backgroundBlendMode: 'overlay' }} />
                    <div className="relative z-10">
                        <h1 className="text-3xl font-bold mb-4 leading-tight">{content[userType].title} <br /> <span className="text-orange-500">{content[userType].highlight}</span></h1>
                        <p className="text-sm text-gray-300 mb-8 leading-relaxed font-light">{content[userType].desc}</p>
                        <div className="space-y-4">
                            {content[userType].features.map((item, index) => (
                                <div key={index} className="flex items-center gap-3 group">
                                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-orange-500/20 flex items-center justify-center group-hover:bg-orange-500 transition-colors duration-300">
                                        <CheckCircle className="h-3 w-3 text-orange-500 group-hover:text-white transition-colors" />
                                    </div>
                                    <span className="text-sm font-medium text-gray-200">{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* --- FORM SECTION --- */}
                <div className="flex-1 overflow-y-auto relative custom-scrollbar bg-gray-50">
                    <div className="p-8">
                        {submitted ? (
                            <div className="text-center py-10">
                                <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <CheckCircle className="h-10 w-10 text-green-600" />
                                </div>
                                <h2 className="text-3xl font-bold text-gray-900 mb-4">Submission Successful!</h2>
                                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                                    Your information has been sent to our administration team for final review.
                                </p>
                                <Button onClick={() => onOpenChange(false)} className="bg-[#ea580c] hover:bg-[#c2410c] px-8 py-6 text-lg">
                                    Close
                                </Button>
                            </div>
                        ) : (
                            <div>
                                <div className="text-left mb-6">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-orange-50">
                                            {userType === 'investor' ? <TrendingUp className="h-5 w-5 text-orange-600" /> : <Building className="h-5 w-5 text-orange-600" />}
                                        </div>
                                        <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900">
                                            {phase === 'CHANGES_REQUESTED' ? "Additional Information" : "Complete Registration"}
                                        </h2>
                                    </div>
                                </div>

                                {/* --- PHASE: ADMIN REQUESTED CHANGES --- */}
                                {phase === 'CHANGES_REQUESTED' && (
                                    <form onSubmit={handleDynamicChangeSubmit} className="space-y-5 animate-in fade-in">
                                        <div className="p-4 bg-orange-50 border border-orange-100 rounded-lg flex gap-3 mb-2">
                                            <FileWarning className="w-5 h-5 text-orange-600 flex-shrink-0" />
                                            <p className="text-sm text-orange-800">The admin team requires the following details to verify your account.</p>
                                        </div>

                                        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                                            {/* Matching the exact space-y structure from LoginDialog */}
                                            <div className="space-y-4">

                                                {isFieldRequested('fullName') && (
                                                    <div className="space-y-1">
                                                        <Label htmlFor="fullName" className={labelStyle}>Full Name *</Label>
                                                        <Input id="fullName" required type="text" value={dynamicFormData.fullName || ''} onChange={(e) => setDynamicFormData({ ...dynamicFormData, fullName: e.target.value })} className={inputStyle} placeholder="Enter your full name" />
                                                    </div>
                                                )}

                                                {isFieldRequested('contactNumber') && (
                                                    <div className="space-y-1">
                                                        <Label htmlFor="contactNumber" className={labelStyle}>Contact Number *</Label>
                                                        <Input id="contactNumber" required type="tel" value={dynamicFormData.contactNumber || ''} onChange={(e) => setDynamicFormData({ ...dynamicFormData, contactNumber: e.target.value })} className={inputStyle} placeholder="Enter your 10-digit number" />
                                                    </div>
                                                )}

                                                {isFieldRequested('investorType') && (
                                                    <div className="space-y-1">
                                                        <Label htmlFor="investorType" className={labelStyle}>Investor Type *</Label>
                                                        <select id="investorType" required className={selectStyle} value={dynamicFormData.investorType || ''} onChange={(e) => setDynamicFormData({ ...dynamicFormData, investorType: e.target.value })}>
                                                            <option value="">Select Investor Type</option>
                                                            <option value="Individual">Individual</option>
                                                            <option value="Institutional">Institutional</option>
                                                            <option value="NRI">NRI</option>
                                                            <option value="HUF">HUF</option>
                                                        </select>
                                                    </div>
                                                )}

                                                {isFieldRequested('investmentRangeMin') && (
                                                    <div className="space-y-1">
                                                        <Label htmlFor="investmentRangeMin" className={labelStyle}>Min Investment Range (₹) *</Label>
                                                        <Input id="investmentRangeMin" required type="number" min="0" value={dynamicFormData.investmentRangeMin || ''} onChange={(e) => setDynamicFormData({ ...dynamicFormData, investmentRangeMin: e.target.value })} className={inputStyle} placeholder="e.g. 500000" />
                                                    </div>
                                                )}

                                                {isFieldRequested('investmentRangeMax') && (
                                                    <div className="space-y-1">
                                                        <Label htmlFor="investmentRangeMax" className={labelStyle}>Max Investment Range (₹) *</Label>
                                                        <Input id="investmentRangeMax" required type="number" min="0" value={dynamicFormData.investmentRangeMax || ''} onChange={(e) => setDynamicFormData({ ...dynamicFormData, investmentRangeMax: e.target.value })} className={inputStyle} placeholder="e.g. 2000000" />
                                                    </div>
                                                )}

                                                {isFieldRequested('address') && (
                                                    <div className="space-y-1">
                                                        <Label htmlFor="address" className={labelStyle}>Street Address *</Label>
                                                        <Input id="address" required type="text" value={dynamicFormData.address || ''} onChange={(e) => setDynamicFormData({ ...dynamicFormData, address: e.target.value })} className={inputStyle} placeholder="Enter street address" />
                                                    </div>
                                                )}

                                                {/* Grouping smaller fields if they exist */}
                                                {(isFieldRequested('city') || isFieldRequested('state') || isFieldRequested('zip') || isFieldRequested('country')) && (
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        {isFieldRequested('city') && (
                                                            <div className="space-y-1">
                                                                <Label htmlFor="city" className={labelStyle}>City *</Label>
                                                                <Input id="city" required type="text" value={dynamicFormData.city || ''} onChange={(e) => setDynamicFormData({ ...dynamicFormData, city: e.target.value })} className={inputStyle} placeholder="City" />
                                                            </div>
                                                        )}

                                                        {isFieldRequested('state') && (
                                                            <div className="space-y-1">
                                                                <Label htmlFor="state" className={labelStyle}>State *</Label>
                                                                <Input id="state" required type="text" value={dynamicFormData.state || ''} onChange={(e) => setDynamicFormData({ ...dynamicFormData, state: e.target.value })} className={inputStyle} placeholder="State" />
                                                            </div>
                                                        )}

                                                        {isFieldRequested('zip') && (
                                                            <div className="space-y-1">
                                                                <Label htmlFor="zip" className={labelStyle}>ZIP Code *</Label>
                                                                <Input id="zip" required type="text" value={dynamicFormData.zip || ''} onChange={(e) => setDynamicFormData({ ...dynamicFormData, zip: e.target.value })} className={inputStyle} placeholder="ZIP Code" />
                                                            </div>
                                                        )}

                                                        {isFieldRequested('country') && (
                                                            <div className="space-y-1">
                                                                <Label htmlFor="country" className={labelStyle}>Country *</Label>
                                                                <Input id="country" required type="text" value={dynamicFormData.country || ''} onChange={(e) => setDynamicFormData({ ...dynamicFormData, country: e.target.value })} className={inputStyle} placeholder="Country" />
                                                            </div>
                                                        )}
                                                    </div>
                                                )}

                                                {/* Fallback for Custom Fields */}
                                                {adminRequests.filter(req => {
                                                    const id = typeof req === 'string' ? req : (req.id || req.fieldName);
                                                    return !['fullName', 'contactNumber', 'investorType', 'investmentRangeMin', 'investmentRangeMax', 'address', 'city', 'state', 'zip', 'country'].includes(id);
                                                }).map((req, idx) => {
                                                    const id = typeof req === 'string' ? req : (req.id || req.fieldName);
                                                    return (
                                                        <div key={`custom-${idx}`} className="space-y-1">
                                                            <Label htmlFor={id} className={labelStyle}>{id.replace(/([A-Z])/g, ' $1').trim()} *</Label>
                                                            <Input id={id} required type="text" value={dynamicFormData[id] || ''} onChange={(e) => setDynamicFormData({ ...dynamicFormData, [id]: e.target.value })} className={inputStyle} placeholder={`Enter ${id}`} />
                                                        </div>
                                                    )
                                                })}

                                            </div>
                                        </div>
                                        <Button type="submit" disabled={loading} className="w-full h-12 bg-[#ea580c] hover:bg-[#c2410c] text-white font-bold text-base rounded-lg mt-2 transition-all">
                                            {loading ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Submitting...</> : <>Submit Changes <ArrowRight className="ml-2 h-5 w-5" /></>}
                                        </Button>
                                    </form>
                                )}

                                {/* --- PHASE: FORM 2 COMPLETION --- */}
                                {phase === 'FORM2_PENDING' && (
                                    <form onSubmit={handleForm2Submit} className="space-y-8 animate-in fade-in">

                                        <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg flex gap-3 mb-2">
                                            <ClipboardList className="w-5 h-5 text-blue-600 flex-shrink-0" />
                                            <p className="text-sm text-blue-800">Your initial details were approved! Please complete the final required fields to finish your onboarding.</p>
                                        </div>

                                        {role === 'investor' && (
                                            <div className="space-y-6">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                                    <div><Label className={labelStyle}>Full Name</Label><input readOnly value={userData.fullName || ''} className={readOnlyStyle} /></div>
                                                    <div><Label className={labelStyle}>Address</Label><input readOnly value={`${userData.city || ''}, ${userData.state || ''}`} className={readOnlyStyle} /></div>

                                                    <div>
                                                        <Label className={labelStyle}>Profession *</Label>
                                                        <select required className={selectStyle} onChange={(e) => setInvForm2({ ...invForm2, profession: e.target.value })}>
                                                            <option value="">Select</option>
                                                            <option value="Salaried (Government)">Salaried (Government)</option>
                                                            <option value="Business Owner">Business Owner</option>
                                                            <option value="Self-Employed Professional (CA, Doctor, Lawyer, Consultant, etc.)">Self-Employed Professional (CA, Doctor, Lawyer, Consultant, etc.)</option>
                                                            <option value="Entrepreneur / Startup Founder">Entrepreneur / Startup Founder</option>
                                                            <option value="Investor / Trader">Investor / Trader</option>
                                                            <option value="NRI / Overseas Professional">NRI / Overseas Professional</option>
                                                            <option value="Retired">Retired</option>
                                                            <option value="Other">Other</option>
                                                        </select>
                                                    </div>
                                                    <div><Label className={labelStyle}>Industry / Nature of Work *</Label><Input required onChange={(e) => setInvForm2({ ...invForm2, industryNatureOfWork: e.target.value })} className={inputStyle} placeholder="e.g., IT, Manufacturing, Trading, Finance, Healthcare, Real Estate" /></div>
                                                    <div>
                                                        <Label className={labelStyle}>Yearly Income *</Label>
                                                        <select required className={selectStyle} onChange={(e) => setInvForm2({ ...invForm2, yearlyIncome: e.target.value })}>
                                                            <option value="">Select Range</option>
                                                            <option value="10L-20L">10L - 20L</option>
                                                            <option value="20L-50L">20L - 50L</option>
                                                            <option value="50L+">50L+</option>
                                                        </select>
                                                    </div>
                                                    <div>
                                                        <Label className={labelStyle}>Investment Tenure *</Label>
                                                        <select required className={selectStyle} onChange={(e) => setInvForm2({ ...invForm2, investmentTenure: e.target.value })}>
                                                            <option value="">Select Tenure</option>
                                                            <option value="1-3 Years">1 - 3 Years</option>
                                                            <option value="3-5 Years">3 - 5 Years</option>
                                                            <option value="5+ Years">5+ Years</option>
                                                        </select>
                                                    </div>
                                                    <div><Label className={labelStyle}>Expected Returns *</Label><Input required onChange={(e) => setInvForm2({ ...invForm2, expectedReturns: e.target.value })} className={inputStyle} placeholder="e.g. 12-15%" /></div>
                                                    <div>
                                                        <Label className={labelStyle}>Preferred Project Type *</Label>
                                                        <select required className={selectStyle} onChange={(e) => setInvForm2({ ...invForm2, preferredProjectType: e.target.value })}>
                                                            <option value="">Select Type</option>
                                                            <option value="Plots / Land">Plots / Land</option>
                                                            <option value="Villa">Villa</option>
                                                            <option value="Apartments / Flats">Apartments / Flats</option>
                                                            <option value="Commercial Spaces (Offices / Retail)">Commercial Spaces (Offices / Retail)</option>
                                                            <option value="Farm Land / Agri Projects">Farm Land / Agri Projects</option>
                                                            <option value="Open to All">Open to All</option>
                                                        </select>
                                                    </div>
                                                    <div>
                                                        <Label className={labelStyle}>Preferred Goal / Strategy *</Label>
                                                        <select required className={selectStyle} onChange={(e) => setInvForm2({ ...invForm2, preferredGoalStategy: e.target.value })}>
                                                            <option value="">Select Type</option>
                                                            <option value="Buy & Hold (Long-term Appreciation)">Buy & Hold (Long-term Appreciation)</option>
                                                            <option value="Buy & Resell (Short-term Gains)">Buy & Resell (Short-term Gains)</option>
                                                            <option value="Buy & Lease (Rental Income)">Buy & Lease (Rental Income)</option>
                                                            <option value="Mix of Appreciation & Rental">Mix of Appreciation & Rental</option>
                                                            <option value="Open to Suggestions">Open to Suggestions</option>

                                                        </select>
                                                    </div>
                                                    <div className="md:col-span-2">
                                                        <Label className={labelStyle}>Assistance Preference *</Label>
                                                        <select required className={selectStyle} onChange={(e) => setInvForm2({ ...invForm2, investmentPreference: e.target.value })}>
                                                            <option value="">Select</option>
                                                            <option value="Self Browse">Browse curated investment opportunities on my own</option>
                                                            <option value="Executive Assist">Get recommendations according to my needs from an executive</option>
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {role === 'builder' && (
                                            <div className="space-y-6">
                                                <div className="grid grid-cols-1 gap-5">
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                                        <div><Label className={labelStyle}>Company Name</Label><input readOnly value={userData.companyName || ''} className={readOnlyStyle} /></div>
                                                        <div><Label className={labelStyle}>Contact Person</Label><input readOnly value={userData.contactNameAndDesignation || ''} className={readOnlyStyle} /></div>
                                                        <div><Label className={labelStyle}>Total Projects Completed</Label><input readOnly value={userData.projectsCompleted || '0'} className={readOnlyStyle} /></div>
                                                        <div><Label className={labelStyle}>Current Ongoing Projects</Label><input readOnly value={userData.ongoingProjects || '0'} className={readOnlyStyle} /></div>
                                                    </div>

                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                                        <div><Label className={labelStyle}>Year of Incorporation *</Label><Input required onChange={(e) => setBldForm2({ ...bldForm2, yearOfIncorporation: e.target.value })} className={inputStyle} placeholder="YYYY" /></div>
                                                        <div><Label className={labelStyle}>Total Sqft Delivered *</Label><Input required onChange={(e) => setBldForm2({ ...bldForm2, totalSqftDelivered: e.target.value })} className={inputStyle} /></div>
                                                        <div className="md:col-span-2"><Label className={labelStyle}>Promoters / Directors *</Label><Textarea required onChange={(e) => setBldForm2({ ...bldForm2, promotersOrDirectors: e.target.value })} className={textareaStyle} /></div>
                                                        <div><Label className={labelStyle}>Type of Projects Offered *</Label><Input required onChange={(e) => setBldForm2({ ...bldForm2, typeOfProjectsOffered: e.target.value })} className={inputStyle} /></div>
                                                        <div>
                                                            <Label className={labelStyle}>Experience with NRI *</Label>
                                                            <select required className={selectStyle} onChange={(e) => setBldForm2({ ...bldForm2, experienceWithNriInvestors: e.target.value })}>
                                                                <option value="">Select</option>
                                                                <option value="Yes">Yes</option>
                                                                <option value="No">No</option>
                                                            </select>
                                                        </div>
                                                        <div className="md:col-span-2"><Label className={labelStyle}>Major Completed Projects *</Label><Textarea required onChange={(e) => setBldForm2({ ...bldForm2, majorCompletedProjects: e.target.value })} className={textareaStyle} /></div>
                                                        <div className="md:col-span-2"><Label className={labelStyle}>Company Overview *</Label><Textarea required onChange={(e) => setBldForm2({ ...bldForm2, companyOverview: e.target.value })} className={textareaStyle} /></div>

                                                        <div>
                                                            <Label className={labelStyle}>Outstanding Debt *</Label>
                                                            <select required className={selectStyle} onChange={(e) => setBldForm2({ ...bldForm2, outstandingDebt: e.target.value })}>
                                                                <option value="">Select</option>
                                                                <option value="High">High</option>
                                                                <option value="Medium">Medium</option>
                                                                <option value="Low">Low</option>
                                                            </select>
                                                        </div>
                                                        <div className="md:col-span-2"><Label className={labelStyle}>Declared Litigation / Disputes</Label><Textarea onChange={(e) => setBldForm2({ ...bldForm2, declaredLitigationDisputes: e.target.value })} className={textareaStyle} /></div>
                                                        <div className="md:col-span-2"><Label className={labelStyle}>Financials of Company (P&L Brief) *</Label><Textarea required onChange={(e) => setBldForm2({ ...bldForm2, financialOfCompany: e.target.value })} className={textareaStyle} /></div>
                                                        <div className="md:col-span-2"><Label className={labelStyle}>Banking Partners *</Label><Input required onChange={(e) => setBldForm2({ ...bldForm2, bankingPartners: e.target.value })} className={inputStyle} /></div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        <Button type="submit" disabled={loading} className="w-full h-12 bg-[#ea580c] hover:bg-[#c2410c] text-white font-bold text-base rounded-lg mt-6 transition-all">
                                            {loading ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Submitting...</> : <>Submit Final Details <ArrowRight className="ml-2 h-5 w-5" /></>}
                                        </Button>
                                    </form>
                                )}
                            </div>
                        )}

                    </div>
                </div>

            </DialogContent>
        </Dialog>
    );
};

export default ContinueOnboardingDialog;