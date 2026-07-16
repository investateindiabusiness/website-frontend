"use client";

import React, { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/AuthContext';
import { createTicket } from '@/api';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { ArrowLeft, Send, Loader2 } from 'lucide-react';

const CATEGORIES = [
  'General Inquiry',
  'Investment Advice',
  'Legal & Documentation',
  'Property Management',
  'Technical Support',
  'Billing & Payments',
  'Other'
];

export default function NewTicket() {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    subject: '',
    category: CATEGORIES[0],
    priority: 'MEDIUM',
    description: '',
  });

  // Determine role prefix dynamically based on route
  const getPrefix = () => {
    if (pathname.startsWith('/investor')) return '/investor';
    if (pathname.startsWith('/builder')) return '/builder';
    if (pathname.startsWith('/service-provider')) return '/service-provider';
    return '';
  };
  const rolePrefix = getPrefix();
  const isDashboard = rolePrefix !== '';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.subject.trim() || !formData.description.trim()) {
      toast({ title: "Validation Error", description: "Subject and Description are required.", variant: "destructive" });
      return;
    }

    try {
      setLoading(true);
      await createTicket(formData);
      toast({ title: "Success", description: "Support ticket created successfully." });
      router.push(`${rolePrefix}/support`);
    } catch (error) {
      console.warn("Failed to create ticket:", error);
      toast({ title: "Error", description: error.message || "Failed to submit ticket.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <main className={`flex-grow pb-12 px-4 md:px-8 max-w-4xl mx-auto w-full ${!isDashboard ? 'mt-[4rem] md:mt-[5rem]' : 'pt-4'}`}>
      
      <div className="mb-6">
        <Button 
          variant="ghost" 
          onClick={() => router.push(`${rolePrefix}/support`)}
          className="text-gray-500 hover:text-gray-900 -ml-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Support
        </Button>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-[#0b264f] to-[#1a4b8c] px-8 py-10 text-white">
          <h1 className="text-3xl font-bold mb-2">Create New Ticket</h1>
          <p className="text-blue-100/80">Describe your issue or query below and our support team will get back to you.</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-semibold text-gray-700">Subject *</label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="Briefly describe your issue..."
                className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#0b264f]/20 focus:border-[#0b264f] outline-none transition-all"
                required
                minLength={5}
                maxLength={200}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#0b264f]/20 focus:border-[#0b264f] outline-none transition-all cursor-pointer"
              >
                {CATEGORIES.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Priority</label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#0b264f]/20 focus:border-[#0b264f] outline-none transition-all cursor-pointer"
              >
                <option value="LOW">Low - General Question</option>
                <option value="MEDIUM">Medium - Need Assistance</option>
                <option value="HIGH">High - Issue preventing progress</option>
                <option value="CRITICAL">Critical - Urgent/System Down</option>
              </select>
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-semibold text-gray-700">Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Provide as much detail as possible so we can assist you better..."
                rows={6}
                className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#0b264f]/20 focus:border-[#0b264f] outline-none transition-all resize-none"
                required
                minLength={10}
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <Button 
              type="submit" 
              disabled={loading}
              className="bg-[#D48035] hover:bg-[#B45309] text-white rounded-xl shadow-lg shadow-orange-500/20 px-8 py-6 h-auto transition-all"
            >
              {loading ? (
                <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Submitting...</>
              ) : (
                <><Send className="w-5 h-5 mr-2" /> Submit Ticket</>
              )}
            </Button>
          </div>
        </form>
      </div>
    </main>
  );
}
