"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Home, ArrowLeft, MapPinOff, Search, Building2 } from 'lucide-react';

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="w-full min-h-screen bg-gray-50 flex flex-col font-sans">
      <main className="flex-grow flex items-center justify-center px-4 pb-20 pt-10">
        <div className="max-w-3xl w-full text-center space-y-8">
          <div className="relative flex justify-center items-center">
            <div className="absolute w-64 h-64 bg-blue-100 rounded-full blur-3xl opacity-50 -z-10"></div>
            <div className="relative">
              <h1 className="text-9xl font-extrabold text-[#0b264f] opacity-10 select-none">404</h1>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-white p-6 rounded-full shadow-xl border border-gray-100 animate-bounce">
                  <MapPinOff className="w-16 h-16 text-orange-500" />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold text-[#0b264f]">We couldn't find this address</h2>
            <p className="text-lg text-gray-600 max-w-lg mx-auto">The page you are looking for might have been removed or the link might be broken.</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8">
            <Button onClick={() => router.push('/')} size="lg" className="bg-[#0b264f] hover:bg-[#001A72] text-white px-8 h-12 rounded-xl flex items-center gap-2">
              <Home className="w-4 h-4" /> Back to Home
            </Button>
            <Button onClick={() => router.back()} variant="outline" size="lg" className="border-gray-300 px-8 h-12 rounded-xl flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" /> Go Back
            </Button>
          </div>

          <div className="mt-12 pt-12 border-t border-gray-200">
            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-6">While you're here, why not explore:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-left">
              <div onClick={() => router.push('/')} className="group p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md cursor-pointer transition-all">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 text-blue-600 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800">Buy Property</h4>
                    <p className="text-xs text-gray-500">Explore premium listings</p>
                  </div>
                </div>
              </div>
              <div onClick={() => router.push('/contact')} className="group p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md cursor-pointer transition-all">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-50 text-green-600 rounded-lg group-hover:bg-green-600 group-hover:text-white transition-colors">
                    <ArrowLeft className="w-5 h-5 rotate-180" /> 
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800">Contact Support</h4>
                    <p className="text-xs text-gray-500">Get help immediately</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
