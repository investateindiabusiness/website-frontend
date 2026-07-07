"use client";

import React, { useState } from 'react';
import { useAuth } from '@/hooks/AuthContext';
import { uploadFile, apiRequest } from '@/api';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { 
  Upload, ShieldAlert, FileText, CheckCircle2, 
  Loader2, FileCheck, ArrowRight, ShieldAlert as AlertIcon 
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function InvestorKycPage() {
  const { user, refreshUser } = useAuth();
  const router = useRouter();
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const kycStatus = user?.kycStatus || 'not_started';
  const isKycVerified = user?.isKycVerified || false;

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.size > 10 * 1024 * 1024) {
        return toast({ 
          title: "File Too Large", 
          description: "Please upload a passport document under 10MB.", 
          variant: "destructive" 
        });
      }
      setFile(selectedFile);
    }
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      return toast({ 
        title: "No File Selected", 
        description: "Please select your passport scanned copy first.", 
        variant: "destructive" 
      });
    }

    try {
      setUploading(true);
      // 1. Upload file to Firebase storage via existing API route
      const uploadRes = await uploadFile(file, 'kyc_passports');
      if (!uploadRes.success || !uploadRes.url) {
        throw new Error(uploadRes.error || "File upload failed");
      }

      // 2. Submit passport URL to investors KYC database route
      await apiRequest('/api/investors/submit-kyc', {
        method: 'POST',
        body: JSON.stringify({ kycPassportUrl: uploadRes.url })
      });

      toast({ 
        title: "KYC Submitted", 
        description: "Your passport copy has been successfully uploaded and sent for verification." 
      });

      // 3. Refresh user session
      await refreshUser();
      setFile(null);
    } catch (err) {
      toast({ 
        title: "Submission Failed", 
        description: err.message || "Failed to submit KYC. Please try again.", 
        variant: "destructive" 
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="max-w-xl w-full bg-white rounded-3xl border border-gray-100 p-8 shadow-xl shadow-gray-200/50">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-black text-gray-900 uppercase tracking-tight">
            KYC Verification
          </h1>
          <p className="text-xs text-gray-400 font-bold tracking-wide uppercase mt-1">
            Investor Verification Program
          </p>
        </div>

        {/* Dynamic Status UI blocks */}

        {/* ── Status: Approved ── */}
        {kycStatus === 'approved' && isKycVerified && (
          <div className="text-center flex flex-col items-center py-6 animate-in fade-in zoom-in-95 duration-300">
            <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mb-6 shadow-inner">
              <CheckCircle2 className="w-8 h-8 animate-bounce" />
            </div>
            <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight mb-2">
              Identity Verified
            </h3>
            <p className="text-xs text-gray-500 font-semibold leading-relaxed mb-8 px-4">
              Congratulations! Your KYC verification is approved. You have full, unrestricted access to the Investate India property catalog, detailed blueprints, and yields.
            </p>
            <Button
              onClick={() => router.push('/properties')}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs uppercase tracking-wider px-8 py-3 rounded-xl transition-all shadow-md shadow-emerald-600/10 hover:scale-[1.02] active:scale-[0.98]"
            >
              Browse Unlocked Properties <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        )}

        {/* ── Status: Pending ── */}
        {kycStatus === 'pending' && (
          <div className="text-center flex flex-col items-center py-6 animate-in fade-in zoom-in-95 duration-300">
            <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600 mb-6 shadow-inner">
              <FileCheck className="w-8 h-8 animate-pulse" />
            </div>
            <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight mb-2">
              Verification In Progress
            </h3>
            <p className="text-xs text-gray-500 font-semibold leading-relaxed mb-6 px-4">
              Your passport document has been uploaded successfully and is currently under review by our administration team. This usually takes less than 24 hours. We will notify you once approved.
            </p>
            {user?.kycPassportUrl && (
              <a 
                href={user.kycPassportUrl} 
                target="_blank" 
                rel="noreferrer"
                className="inline-flex items-center text-xs font-bold text-slate-600 hover:text-orange-600 gap-1.5 underline decoration-2 underline-offset-4"
              >
                <FileText className="w-4 h-4" /> View Submitted Document
              </a>
            )}
          </div>
        )}

        {/* ── Status: Not Started or Rejected ── */}
        {(kycStatus === 'not_started' || kycStatus === 'rejected') && (
          <div className="animate-in fade-in duration-300">
            {kycStatus === 'rejected' && (
              <div className="mb-8 p-4 bg-rose-50 border border-rose-100 text-rose-700 rounded-2xl text-xs font-bold flex items-start gap-3.5 animate-in slide-in-from-top-4">
                <AlertIcon className="w-5 h-5 shrink-0 text-rose-500 mt-0.5" />
                <div>
                  <span className="block font-black uppercase tracking-tight mb-0.5">KYC Application Rejected</span>
                  <span className="font-semibold text-gray-600 leading-normal">
                    Please review and upload a clearer scan of your passport. Ensure that your name, date of birth, and expiry details are fully readable.
                  </span>
                </div>
              </div>
            )}

            <p className="text-xs text-gray-500 font-semibold leading-relaxed text-center mb-8 px-2">
              To unlock premium investments, please upload a high-resolution, clear scanned copy of your passport (JPEG, PNG, or PDF format, up to 10MB).
            </p>

            <form onSubmit={handleUploadSubmit} className="space-y-6">
              {/* Drag & Drop File Input */}
              <div className="relative group border-2 border-dashed border-gray-200 hover:border-orange-500/50 rounded-2xl p-8 text-center transition-all bg-gray-50/50 hover:bg-orange-50/10 cursor-pointer">
                <input 
                  type="file" 
                  accept="image/*,.pdf" 
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="flex flex-col items-center justify-center">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-gray-400 group-hover:text-orange-500 group-hover:scale-110 shadow-sm border border-gray-100 transition-all mb-4">
                    <Upload className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold text-gray-700 uppercase tracking-tight block">
                    {file ? file.name : "Upload Passport Document"}
                  </span>
                  <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide block mt-1">
                    {file ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : "PDF, JPEG, or PNG up to 10MB"}
                  </span>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={uploading || !file}
                className="w-full h-12 bg-gray-900 hover:bg-black text-white font-black text-sm uppercase tracking-wider rounded-xl shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98] disabled:scale-100 disabled:opacity-50"
              >
                {uploading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    Uploading Passport...
                  </>
                ) : (
                  "Submit Passport for Review"
                )}
              </Button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}
