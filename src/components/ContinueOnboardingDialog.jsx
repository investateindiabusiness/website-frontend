import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog'; 
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { Loader2, CheckCircle, FileWarning, ClipboardList, TrendingUp, Building } from 'lucide-react';
import { submitRequestedChanges, submitBuilderForm2, submitInvestorForm2 } from '@/api';

const ContinueOnboardingDialog = ({ isOpen, onOpenChange, data = {} }) => {
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const [dynamicFormData, setDynamicFormData] = useState({});

    const [invForm2, setInvForm2] = useState({
        profession: '', yearlyIncome: '', investmentTenure: '', expectedReturns: '', preferredProjectType: '', investmentPreference: ''
    });

    const [bldForm2, setBldForm2] = useState({
        yearOfIncorporation: '', promotersOrDirectors: '', totalSqftDelivered: '', majorCompletedProjects: '', typeOfProjectsOffered: '', companyOverview: '', experienceWithNriInvestors: '', declaredLitigationDisputes: '', financialOfCompany: '', outstandingDebt: '', bankingPartners: ''
    });

    const { error: phase, uid, role, adminRequests = [], userData = {} } = data;
    // Default to investor if role isn't passed for some reason, just to prevent crashes on the hero content
    const userType = role || 'investor'; 

    useEffect(() => {
        if (!isOpen) {
            setTimeout(() => setSubmitted(false), 300);
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

    // Hero Content matching RegisterDialog
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

                {/* --- HERO SECTION FROM REGISTER DIALOG --- */}
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
                                {/* Status Header */}
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
                                    <form onSubmit={handleDynamicChangeSubmit} className="space-y-6 animate-in fade-in">
                                        <div className="p-4 bg-orange-50 border border-orange-100 rounded-lg flex gap-3 mb-2">
                                            <FileWarning className="w-5 h-5 text-orange-600 flex-shrink-0" />
                                            <p className="text-sm text-orange-800">The admin team requires the following details to verify your account.</p>
                                        </div>

                                        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-5">
                                            {adminRequests.map((req, idx) => (
                                                <div key={idx}>
                                                    <Label className={labelStyle}>{req.fieldName} *</Label>
                                                    {req.type === 'file' ? (
                                                        <Input required type="file" onChange={(e) => setDynamicFormData({ ...dynamicFormData, [req.fieldName]: e.target.files[0]?.name })} className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100" />
                                                    ) : (
                                                        <Input required type="text" onChange={(e) => setDynamicFormData({ ...dynamicFormData, [req.fieldName]: e.target.value })} className={inputStyle} placeholder={`Enter ${req.fieldName}`} />
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                        <Button type="submit" disabled={loading} className="w-full h-12 bg-[#ea580c] hover:bg-[#c2410c] text-white font-bold text-lg rounded-lg transition-all">
                                            {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : 'Submit Changes'}
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
                                                            <option value="Professional">Professional</option>
                                                            <option value="Self Employed">Self Employed</option>
                                                            <option value="Other">Other</option>
                                                        </select>
                                                    </div>
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
                                                            <option value="Flat">Flat</option><option value="Villa">Villa</option><option value="Plot">Plot</option><option value="Building">Building</option>
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
                                                                <option value="">Select</option><option value="Yes">Yes</option><option value="No">No</option>
                                                            </select>
                                                        </div>
                                                        <div className="md:col-span-2"><Label className={labelStyle}>Major Completed Projects *</Label><Textarea required onChange={(e) => setBldForm2({ ...bldForm2, majorCompletedProjects: e.target.value })} className={textareaStyle} /></div>
                                                        <div className="md:col-span-2"><Label className={labelStyle}>Company Overview *</Label><Textarea required onChange={(e) => setBldForm2({ ...bldForm2, companyOverview: e.target.value })} className={textareaStyle} /></div>
                                                        
                                                        <div>
                                                            <Label className={labelStyle}>Outstanding Debt *</Label>
                                                            <select required className={selectStyle} onChange={(e) => setBldForm2({ ...bldForm2, outstandingDebt: e.target.value })}>
                                                                <option value="">Select</option><option value="High">High</option><option value="Medium">Medium</option><option value="Low">Low</option>
                                                            </select>
                                                        </div>
                                                        <div className="md:col-span-2"><Label className={labelStyle}>Declared Litigation / Disputes</Label><Textarea onChange={(e) => setBldForm2({ ...bldForm2, declaredLitigationDisputes: e.target.value })} className={textareaStyle} /></div>
                                                        <div className="md:col-span-2"><Label className={labelStyle}>Financials of Company (P&L Brief) *</Label><Textarea required onChange={(e) => setBldForm2({ ...bldForm2, financialOfCompany: e.target.value })} className={textareaStyle} /></div>
                                                        <div className="md:col-span-2"><Label className={labelStyle}>Banking Partners *</Label><Input required onChange={(e) => setBldForm2({ ...bldForm2, bankingPartners: e.target.value })} className={inputStyle} /></div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        <Button type="submit" disabled={loading} className="w-full h-12 bg-[#ea580c] hover:bg-[#c2410c] text-white font-bold text-lg rounded-lg transition-all mt-6">
                                            {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : 'Submit Final Details'}
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