"use client";

import React, { useEffect, useMemo, useState } from 'react';
import { Bot, CheckCircle2, ChevronLeft, Loader2, MessageCircle, Send, ShieldCheck, X } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { fetchChatbotFaqs, submitChatbotRequest } from '@/api';
import { chatbotFaqGroups, fallbackQuestion } from '@/data/chatbotFaqs';
import { useAuth } from '@/hooks/AuthContext';

const initialForm = {
  name: '',
  email: '',
  phone: '',
  organization: '',
  preferredContact: 'Any',
  message: '',
};

const audienceContent = {
  public: {
    label: 'Company Assistant',
    intro: 'I can answer company and operations questions only.',
    requestContext: 'Company or purpose of inquiry',
  },
  investor: {
    label: 'Investor Assistant',
    intro: 'Logged-in investor support for investments, KYC, bookings, payments, legal, tax, and property services.',
    requestContext: 'City, property, booking ID, or issue context',
  },
  builder: {
    label: 'Builder Assistant',
    intro: 'Logged-in builder support for onboarding, listings, leads, CRM, finance, compliance, and technical issues.',
    requestContext: 'Company, project, builder ID, or issue context',
  },
  customer: {
    label: 'Support Assistant',
    intro: 'Logged-in support guidance for technical issues and urgent escalations.',
    requestContext: 'Account, issue, or ticket context',
  },
};

const roleToAudience = (user) => {
  if (!user) return 'public';
  if (user.role === 'builder') return 'builder';
  if (user.role === 'investor') return 'investor';
  return 'customer';
};

export default function ChatbotWidget() {
  const { user, loading } = useAuth() || {};
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [activeQuestion, setActiveQuestion] = useState(null);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState({ type: 'idle', message: '' });
  const [faqStatus, setFaqStatus] = useState('idle');
  const [remoteFaqs, setRemoteFaqs] = useState([]);

  const audience = roleToAudience(user);
  const content = audienceContent[audience] || audienceContent.public;
  const fallbackGroup = chatbotFaqGroups[audience] || chatbotFaqGroups.public;

  if (pathname?.startsWith('/admin')) {
    return null;
  }

  const faqs = useMemo(() => {
    return remoteFaqs.length > 0 ? remoteFaqs : fallbackGroup.faqs;
  }, [fallbackGroup.faqs, remoteFaqs]);

  useEffect(() => {
    let cancelled = false;

    async function loadFaqs() {
      setFaqStatus('loading');
      setActiveQuestion(null);
      setShowRequestForm(false);
      setStatus({ type: 'idle', message: '' });

      try {
        const response = await fetchChatbotFaqs(audience);
        if (!cancelled) {
          setRemoteFaqs(response?.faqs || []);
          setFaqStatus('ready');
        }
      } catch (error) {
        if (!cancelled) {
          setRemoteFaqs([]);
          setFaqStatus('fallback');
        }
      }
    }

    if (!loading) {
      loadFaqs();
    }

    return () => {
      cancelled = true;
    };
  }, [audience, loading]);

  const resetPanel = () => {
    setActiveQuestion(null);
    setShowRequestForm(false);
    setForm(initialForm);
    setStatus({ type: 'idle', message: '' });
  };

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const submitRequest = async (event) => {
    event.preventDefault();

    setStatus({ type: 'loading', message: 'Submitting your request...' });

    try {
      await submitChatbotRequest({
        ...form,
        userType: audience,
        selectedQuestion: activeQuestion?.question || fallbackQuestion,
      });

      setStatus({
        type: 'success',
        message: 'Thanks. Your request has been shared with the Investate team.',
      });
      setForm(initialForm);
      setActiveQuestion(null);
    } catch (error) {
      setStatus({
        type: 'error',
        message: error?.message || 'Could not submit your request. Please try again.',
      });
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-[80] font-sans">
      {open && (
        <section className="mb-4 w-[calc(100vw-2.5rem)] max-w-[410px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-900/20">
          <header className="flex items-center justify-between bg-[#0b264f] px-4 py-3 text-white">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/12">
                <Bot className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">Investate {content.label}</p>
                <p className="truncate text-xs text-white/75">{user ? 'Logged-in support' : 'Public company information'}</p>
              </div>
            </div>
            <button
              type="button"
              className="flex h-8 w-8 items-center justify-center rounded-full text-white/80 transition hover:bg-white/10 hover:text-white"
              onClick={() => setOpen(false)}
              aria-label="Close FAQ assistant"
            >
              <X className="h-4 w-4" />
            </button>
          </header>

          <div className="max-h-[70vh] overflow-y-auto p-4">
            {!showRequestForm && (
              <div className="space-y-4">
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                  <div className="flex gap-2">
                    <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#0b264f]" />
                    <div>
                      <p className="text-sm font-semibold text-slate-950">{content.label}</p>
                      <p className="mt-1 text-sm leading-6 text-slate-600">{content.intro}</p>
                    </div>
                  </div>
                </div>

                {faqStatus === 'loading' && (
                  <div className="flex items-center gap-2 rounded-xl border border-slate-200 p-3 text-sm text-slate-600">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Loading FAQs...
                  </div>
                )}

                <div className="space-y-2">
                  {faqs.map((faq) => {
                    const isActive = activeQuestion?.question === faq.question;
                    return (
                      <button
                        type="button"
                        key={faq.id || faq.question}
                        className={`w-full rounded-xl border p-3 text-left transition ${
                          isActive ? 'border-[#0b264f] bg-slate-50' : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                        }`}
                        onClick={() => setActiveQuestion(isActive ? null : faq)}
                      >
                        {faq.category && <span className="mb-1 block text-[11px] font-semibold uppercase text-slate-400">{faq.category}</span>}
                        <span className="block text-sm font-semibold leading-5 text-slate-900">{faq.question}</span>
                        {isActive && <span className="mt-2 block text-sm leading-6 text-slate-600">{faq.answer}</span>}
                      </button>
                    );
                  })}
                </div>

                {faqStatus === 'fallback' && (
                  <p className="text-xs leading-5 text-slate-500">Using built-in FAQ copy because the live FAQ service is temporarily unavailable.</p>
                )}

                <button
                  type="button"
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#0b264f] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#12376d]"
                  onClick={() => {
                    setShowRequestForm(true);
                    setStatus({ type: 'idle', message: '' });
                  }}
                >
                  <MessageCircle className="h-4 w-4" />
                  My question is not listed
                </button>
              </div>
            )}

            {showRequestForm && (
              <form className="space-y-3" onSubmit={submitRequest}>
                <div className="flex items-start gap-3 pb-1">
                  <button
                    type="button"
                    className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-slate-200 text-slate-600 transition hover:bg-slate-50"
                    onClick={() => {
                      setShowRequestForm(false);
                      setStatus({ type: 'idle', message: '' });
                    }}
                    aria-label="Back to FAQ list"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <div>
                    <p className="text-sm font-semibold text-slate-950">Send your question</p>
                    <p className="mt-1 text-sm leading-6 text-slate-600">The Investate team can follow up with the right guidance.</p>
                  </div>
                </div>

                <input
                  required
                  value={form.name}
                  onChange={(event) => updateField('name', event.target.value)}
                  className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none transition focus:border-[#0b264f]"
                  placeholder="Full name"
                />
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <input
                    required
                    type="email"
                    value={form.email}
                    onChange={(event) => updateField('email', event.target.value)}
                    className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none transition focus:border-[#0b264f]"
                    placeholder="Email"
                  />
                  <input
                    required
                    value={form.phone}
                    onChange={(event) => updateField('phone', event.target.value)}
                    className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none transition focus:border-[#0b264f]"
                    placeholder="Phone"
                  />
                </div>
                <input
                  value={form.organization}
                  onChange={(event) => updateField('organization', event.target.value)}
                  className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none transition focus:border-[#0b264f]"
                  placeholder={content.requestContext}
                />
                <select
                  value={form.preferredContact}
                  onChange={(event) => updateField('preferredContact', event.target.value)}
                  className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none transition focus:border-[#0b264f]"
                >
                  <option value="Any">Preferred contact: Any</option>
                  <option value="Email">Preferred contact: Email</option>
                  <option value="Phone">Preferred contact: Phone</option>
                  <option value="WhatsApp">Preferred contact: WhatsApp</option>
                </select>
                <textarea
                  required
                  value={form.message}
                  onChange={(event) => updateField('message', event.target.value)}
                  className="min-h-[96px] w-full resize-none rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none transition focus:border-[#0b264f]"
                  placeholder="Write your question"
                />

                {status.message && (
                  <p
                    className={`rounded-xl px-3 py-2 text-sm ${
                      status.type === 'success'
                        ? 'bg-emerald-50 text-emerald-700'
                        : status.type === 'error'
                          ? 'bg-red-50 text-red-700'
                          : 'bg-slate-50 text-slate-600'
                    }`}
                  >
                    {status.type === 'success' && <CheckCircle2 className="mr-1 inline h-4 w-4" />}
                    {status.message}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={status.type === 'loading'}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#0b264f] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#12376d] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  <Send className="h-4 w-4" />
                  {status.type === 'loading' ? 'Submitting...' : 'Submit request'}
                </button>
              </form>
            )}
          </div>
        </section>
      )}

      <button
        type="button"
        onClick={() => {
          setOpen((current) => !current);
          if (open) resetPanel();
        }}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-[#0b264f] text-white shadow-xl shadow-slate-900/25 transition hover:bg-[#12376d] focus:outline-none focus:ring-4 focus:ring-[#0b264f]/20"
        aria-label={open ? 'Close FAQ assistant' : 'Open FAQ assistant'}
      >
        {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </button>
    </div>
  );
}
