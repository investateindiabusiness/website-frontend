"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AdBanner from '@/components/AdBanner';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import {
   MapPin, Building2, Calendar, FileCheck,
   Ruler, Layers, TrendingUp, Phone,
   AlertCircle, CheckCircle,
   Download, ShieldCheck, Loader2,
   ChevronLeft, ChevronRight, X
} from 'lucide-react';
import { apiRequest, submitProjectLead } from '@/api';
import { useAuth } from '@/hooks/AuthContext';
import { toast } from '@/hooks/use-toast';

export default function ProjectDetail() {
   const { id } = useParams();
   const router = useRouter();
   const { user } = useAuth();

   const [project, setProject] = useState(null);
   const [loading, setLoading] = useState(true);
   const [hasSubmittedLead, setHasSubmittedLead] = useState(false);
   const [inquiryMessage, setInquiryMessage] = useState('');
   const [isSubmittingLead, setIsSubmittingLead] = useState(false);
   const [isGalleryOpen, setIsGalleryOpen] = useState(false);
   const [currentImageIndex, setCurrentImageIndex] = useState(0);

   useEffect(() => {
      const fetchProjectData = async () => {
         try {
            setLoading(true);
            const data = await apiRequest(`/api/projects/${id}`);

            if (user && user.uid) {
               const leadStatus = await apiRequest(`/api/projects/${id}/lead-status?uid=${user.uid}`);
               setHasSubmittedLead(leadStatus.hasSubmitted);
            }

            const visibleUrls = data.visibleDocuments || [];
            const allDocs = data.projectDocuments || [];
            const approvedDocs = allDocs.filter(doc => visibleUrls.includes(doc.url));

            setProject({
               ...data,
               title: data.projectName,
               address: data.projectLocation,
               images: (data.projectImages && data.projectImages.length > 0) ? data.projectImages : ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&q=80'],
               approvedDocuments: approvedDocs,
               details: { ...data }
            });
         } catch (error) {
            toast({ title: "Error", description: "Failed to load project details.", variant: "destructive" });
         } finally {
            setLoading(false);
         }
      };
      fetchProjectData();
   }, [id, user]);

   const handleInquirySubmit = async (e, isDirectCall = false) => {
      if (e) e.preventDefault();
      if (!user) return toast({ title: "Login Required", description: "Please login to submit an inquiry.", variant: "destructive" });
      if (hasSubmittedLead) return toast({ title: "Already Submitted", description: "You have already inquired about this project." });

      try {
         setIsSubmittingLead(true);
         await submitProjectLead(project.id, { uid: user.uid, message: isDirectCall ? 'Investor requested a call back.' : inquiryMessage });
         toast({ title: "Success!", description: "Your request has been sent." });
         setHasSubmittedLead(true);
      } catch (error) {
         toast({ title: "Error", description: error.message || "Failed to submit request.", variant: "destructive" });
      } finally {
         setIsSubmittingLead(false);
      }
   };

   if (loading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-[#0b264f] h-10 w-10" /></div>;
   if (!project) return null;

   return (
      <div className="min-h-screen bg-[#F4F5F7] font-sans">
         <Header />
         <main className="container mx-auto px-4 py-6 mt-[2rem] md:mt-[4rem]">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
               <div className="lg:col-span-2 space-y-6">
                  <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                     <div className="flex flex-col md:flex-row justify-between mb-4">
                        <div>
                           <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{project.projectName}</h1>
                           <Badge className="bg-green-100 text-green-800 mt-2"><ShieldCheck className="w-3 h-3 mr-1" /> Verified Project</Badge>
                           <p className="text-gray-500 flex items-center text-sm mt-2"><MapPin className="h-3.5 w-3.5 mr-1" /> {project.projectLocation}</p>
                        </div>
                        <div className="text-left md:text-right mt-4 md:mt-0">
                           <p className="text-2xl font-bold text-[#0b264f]">{project.sellingPrice}</p>
                           <p className="text-sm text-green-600 font-semibold">{project.currentConstructionStatus}</p>
                        </div>
                     </div>
                     <div className="relative h-[250px] md:h-[400px] rounded-xl overflow-hidden cursor-pointer" onClick={() => setIsGalleryOpen(true)}>
                        <img src={project.images[0]} alt={project.projectName} className="w-full h-full object-cover" />
                        <div className="absolute bottom-4 left-4"><Button variant="secondary" size="sm">View Photos ({project.images.length})</Button></div>
                     </div>
                  </div>

                  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                     <h2 className="text-lg font-bold mb-4">Overview</h2>
                     <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        <DetailItem label="Type" value={project.projectType} icon={<Building2 />} />
                        <DetailItem label="Units" value={project.totalUnits} icon={<Layers />} />
                        <DetailItem label="Land Area" value={project.totalLandArea} icon={<Ruler />} />
                        <DetailItem label="RERA ID" value={project.reraRegistrationNumber} icon={<CheckCircle />} />
                     </div>
                  </div>

                  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                     <h2 className="text-lg font-bold mb-4">Project Overview</h2>
                     <p className="text-gray-600 text-sm leading-relaxed">{project.projectOverview}</p>
                  </div>
               </div>

               <div className="lg:col-span-1">
                  <div className="sticky top-24 space-y-4">
                     <Card className="border-t-4 border-t-[#0b264f] shadow-lg">
                        <CardContent className="p-6 text-center">
                           <h3 className="text-lg font-bold mb-4">Connect with Advisor</h3>
                           <Button
                              onClick={(e) => handleInquirySubmit(e, true)}
                              disabled={isSubmittingLead || hasSubmittedLead}
                              className={`w-full font-bold h-12 ${hasSubmittedLead ? 'bg-gray-300' : 'bg-green-600 hover:bg-green-700 text-white'}`}
                           >
                              {hasSubmittedLead ? 'Request Already Sent' : 'Request a Call Back'}
                           </Button>
                        </CardContent>
                     </Card>

                     <AdBanner zoneId="zone3" />
                  </div>
               </div>
            </div>
         </main>
         <Footer />
      </div>
   );
}

const DetailItem = ({ label, value, icon }) => (
   <div className="flex flex-col">
      <span className="text-[10px] uppercase font-semibold text-gray-500 mb-1">{label}</span>
      <div className="flex items-center gap-2 font-medium text-sm">
         {React.cloneElement(icon, { className: "w-4 h-4 text-gray-400" })}
         {value || 'N/A'}
      </div>
   </div>
);
