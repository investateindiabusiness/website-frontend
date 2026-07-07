"use client";

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Bot, CheckCircle2, ChevronLeft, Loader2, MessageCircle, Send, X, User } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
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
    intro: 'Hi there! I can answer company and operations questions. How can I help you today?',
    requestContext: 'Company or purpose of inquiry',
  },
  investor: {
    label: 'Investor Assistant',
    intro: 'Hello! I am your Investor Support Assistant. I can help with investments, KYC, bookings, payments, and property services. How can I help?',
    requestContext: 'City, property, booking ID, or issue context',
  },
  builder: {
    label: 'Builder Assistant',
    intro: 'Hello! I am your Builder Support Assistant. I can help with onboarding, listings, leads, CRM, and technical issues. What do you need help with?',
    requestContext: 'Company, project, builder ID, or issue context',
  },
  serviceProvider: {
    label: 'Service Provider Assistant',
    intro: 'Hello! I can help with service provider profiles, enquiries, support, and workflow questions.',
    requestContext: 'Service category, profile, enquiry, or issue context',
  },
  nri: {
    label: 'NRI Investor Assistant',
    intro: 'Hello! I can help with NRI investment, asset protection, legal, tax, and property management questions.',
    requestContext: 'Country, city, property, or investment context',
  },
  customer: {
    label: 'Support Assistant',
    intro: 'Hi! I am here to provide technical support and guidance. How can I assist you?',
    requestContext: 'Account, issue, or ticket context',
  },
};

const roleToAudience = (user) => {
  if (!user) return 'public';
  if (user.role === 'builder') return 'builder';
  if (user.role === 'serviceProvider') return 'serviceProvider';
  if (user.role === 'investor' && String(user.investorType || user.type || '').toLowerCase() === 'nri') return 'nri';
  if (user.role === 'investor') return 'investor';
  return 'customer';
};

const categoryFallbacks = {
  public: 'Before Login',
  investor: 'Investor',
  builder: 'Builder',
  serviceProvider: 'Service Provider',
  nri: 'NRI',
  customer: 'Support',
};

const getFaqCategory = (faq, audience) => {
  if (faq.category) return faq.category;
  if (/kyc|verification/i.test(faq.question)) return 'KYC / Workflow';
  return categoryFallbacks[audience] || 'Support';
};

export default function ChatbotWidget() {
  const { user, loading } = useAuth() || {};
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState({ type: 'idle', message: '' });
  const [faqStatus, setFaqStatus] = useState('idle');
  const [remoteFaqs, setRemoteFaqs] = useState([]);
  const chatEndRef = useRef(null);

  const audience = roleToAudience(user);
  const content = audienceContent[audience] || audienceContent.public;
  const fallbackGroup = chatbotFaqGroups[audience] || chatbotFaqGroups.public;

  const faqs = useMemo(() => {
    return remoteFaqs.length > 0 ? remoteFaqs : fallbackGroup.faqs;
  }, [fallbackGroup.faqs, remoteFaqs]);

  const generateId = () => Math.random().toString(36).slice(2, 11);

  const showMainMenu = () => {
    const groupedOptions = faqs.reduce((groups, faq) => {
      const category = getFaqCategory(faq, audience);
      if (!groups[category]) groups[category] = [];
      groups[category].push({
        label: faq.question,
        action: 'FAQ',
        data: faq,
      });
      return groups;
    }, {});

    const optionGroups = Object.entries(groupedOptions).map(([label, options]) => ({
      label,
      options,
    }));

    optionGroups.push({
      label: user ? 'Need More Help' : 'Send A Query',
      options: [{
        label: user ? 'Create support ticket' : fallbackQuestion,
        action: 'CONTACT',
      }],
    });

    setChatHistory((current) => [
      ...current,
      { id: generateId(), sender: 'bot', type: 'text', text: content.intro },
      { id: generateId(), sender: 'bot', type: 'options', groups: optionGroups },
    ]);
  };

  useEffect(() => {
    let cancelled = false;

    async function loadFaqs() {
      setFaqStatus('loading');
      setRemoteFaqs([]);
      setSelectedQuestion(null);
      setShowRequestForm(false);
      setStatus({ type: 'idle', message: '' });
      setChatHistory([]);

      try {
        const response = await fetchChatbotFaqs(audience);
        if (!cancelled) {
          setRemoteFaqs(response?.faqs || []);
          setFaqStatus('ready');
        }
      } catch (error) {
        if (!cancelled) {
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

  useEffect(() => {
    if (open && chatHistory.length === 0 && (faqStatus === 'ready' || faqStatus === 'fallback')) {
      showMainMenu();
    }
  }, [open, chatHistory.length, faqStatus, faqs]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, showRequestForm]);

  const handleOptionClick = (option) => {
    setChatHistory((current) => [
      ...current,
      { id: generateId(), sender: 'user', type: 'text', text: option.label },
    ]);

    setTimeout(() => {
      if (option.action === 'FAQ') {
        const faq = option.data;
        setSelectedQuestion(faq);
        setChatHistory((current) => [
          ...current,
          { id: generateId(), sender: 'bot', type: 'text', text: faq.answer },
          {
            id: generateId(),
            sender: 'bot',
            type: 'options',
            text: 'Did this help?',
            groups: [{
              label: 'Next Step',
              options: [
                { label: 'Main Menu', action: 'MAIN_MENU' },
                { label: user ? 'Create support ticket' : fallbackQuestion, action: 'CONTACT' },
              ],
            }],
          },
        ]);
      } else if (option.action === 'MAIN_MENU') {
        setSelectedQuestion(null);
        showMainMenu();
      } else if (option.action === 'CONTACT') {
        if (user) {
          setChatHistory((current) => [
            ...current,
            { id: generateId(), sender: 'bot', type: 'text', text: 'I will take you to the support ticket page so the team can track this properly.' },
          ]);
          setTimeout(() => router.push('/support/new'), 500);
        } else {
          setShowRequestForm(true);
          setStatus({ type: 'idle', message: '' });
        }
      }
    }, 300);
  };

  const resetPanel = () => {
    setSelectedQuestion(null);
    setShowRequestForm(false);
    setForm(initialForm);
    setStatus({ type: 'idle', message: '' });
    setChatHistory([]);
  };

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const submitRequest = async (event) => {
    event.preventDefault();
    setStatus({ type: 'loading', message: 'Submitting your request...' });

    try {
      await submitChatbotRequest({
        userType: audience,
        name: form.name,
        email: form.email,
        phone: form.phone,
        organization: form.organization,
        preferredContact: form.preferredContact,
        selectedQuestion: selectedQuestion?.question || fallbackQuestion,
        message: form.message,
      });

      setStatus({
        type: 'success',
        message: 'Thanks. Your request has been sent to the Investate team.',
      });
      setForm(initialForm);

      setTimeout(() => {
        setShowRequestForm(false);
        setChatHistory((current) => [
          ...current,
          { id: generateId(), sender: 'bot', type: 'text', text: 'Your request has been submitted. Our team will get back to you soon.' },
          { id: generateId(), sender: 'bot', type: 'options', options: [{ label: 'Main Menu', action: 'MAIN_MENU' }] },
        ]);
      }, 1200);
    } catch (error) {
      setStatus({
        type: 'error',
        message: error?.message || 'Could not submit your request. Please try again.',
      });
    }
  };

  if (pathname?.startsWith('/admin') || user?.role === 'admin') {
    return null;
  }

  return (
    <div className="fixed bottom-5 right-5 z-[80] font-sans">
      {open && (
        <section className="mb-4 flex max-h-[75vh] w-[calc(100vw-2.5rem)] max-w-[410px] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-900/20">
          <header className="flex shrink-0 items-center justify-between bg-[#D48035] px-4 py-3 text-white">
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

          <div className="flex flex-grow flex-col gap-4 overflow-y-auto bg-slate-50 p-4">
            {faqStatus === 'loading' && chatHistory.length === 0 && (
              <div className="flex items-center gap-2 self-start rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-600">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading support options...
              </div>
            )}

            {!showRequestForm && chatHistory.map((msg, index) => {
              const isBot = msg.sender === 'bot';

              if (msg.type === 'text') {
                return (
                  <div key={msg.id} className={`flex max-w-[85%] gap-2 ${isBot ? 'self-start' : 'self-end flex-row-reverse'}`}>
                    <div className={`mt-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${isBot ? 'bg-[#D48035] text-white' : 'bg-orange-100 text-orange-700'}`}>
                      {isBot ? <Bot className="h-3.5 w-3.5" /> : <User className="h-3.5 w-3.5" />}
                    </div>
                    <div className={`rounded-2xl px-4 py-2.5 text-[13px] leading-relaxed shadow-sm ${isBot ? 'rounded-bl-sm border border-orange-100 bg-white text-slate-700' : 'rounded-br-sm bg-[#C7742F] text-white'}`}>
                      {msg.text}
                    </div>
                  </div>
                );
              }

              if (msg.type === 'options') {
                const isLatestOptions = chatHistory.slice(index + 1).findIndex((item) => item.type === 'options') === -1;

                return (
                  <div key={msg.id} className="ml-8 flex max-w-[90%] flex-col gap-2 self-start">
                    {msg.text && <p className="px-1 text-[13px] font-medium text-slate-500">{msg.text}</p>}
                    {isLatestOptions && (
                      <div className="flex flex-col gap-3">
                        {(msg.groups || [{ label: null, options: msg.options || [] }]).map((group) => (
                          <div key={group.label || 'options'}>
                            {group.label && (
                              <p className="mb-2 rounded-md bg-orange-50 px-2 py-1 text-[11px] font-bold uppercase text-[#B45309]">
                                {group.label}
                              </p>
                            )}
                            <div className="flex flex-wrap gap-2">
                              {group.options.map((opt) => (
                                <button
                                  type="button"
                                  key={opt.label}
                                  onClick={() => handleOptionClick(opt)}
                                  className="rounded-full border border-orange-200 bg-white px-3 py-1.5 text-left text-[12px] font-semibold text-[#9A5A24] shadow-sm transition-colors hover:border-[#D48035] hover:bg-orange-50 hover:text-[#B45309]"
                                >
                                  {opt.label}
                                </button>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }

              return null;
            })}

            {faqStatus === 'fallback' && !showRequestForm && (
              <p className="mt-4 text-center text-[11px] leading-5 text-slate-400">Using offline FAQs.</p>
            )}

            {showRequestForm && (
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <form className="space-y-3" onSubmit={submitRequest}>
                  <div className="mb-3 flex items-center gap-2 border-b border-slate-100 pb-2">
                    <button
                      type="button"
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                      onClick={() => {
                        setShowRequestForm(false);
                        setStatus({ type: 'idle', message: '' });
                      }}
                      aria-label="Back to FAQ options"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <p className="text-sm font-semibold text-slate-900">Contact Support</p>
                  </div>

                  <input required value={form.name} onChange={(event) => updateField('name', event.target.value)} className="h-10 w-full rounded-xl border border-slate-200 px-3 text-[13px] outline-none transition focus:border-[#D48035]" placeholder="Full name" />
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <input required type="email" value={form.email} onChange={(event) => updateField('email', event.target.value)} className="h-10 w-full rounded-xl border border-slate-200 px-3 text-[13px] outline-none transition focus:border-[#D48035]" placeholder="Email" />
                    <input required value={form.phone} onChange={(event) => updateField('phone', event.target.value)} className="h-10 w-full rounded-xl border border-slate-200 px-3 text-[13px] outline-none transition focus:border-[#D48035]" placeholder="Phone" />
                  </div>
                  <input value={form.organization} onChange={(event) => updateField('organization', event.target.value)} className="h-10 w-full rounded-xl border border-slate-200 px-3 text-[13px] outline-none transition focus:border-[#D48035]" placeholder={content.requestContext} />
                  <select value={form.preferredContact} onChange={(event) => updateField('preferredContact', event.target.value)} className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-[13px] outline-none transition focus:border-[#D48035]">
                    <option value="Any">Preferred contact: Any</option>
                    <option value="Email">Preferred contact: Email</option>
                    <option value="Phone">Preferred contact: Phone</option>
                    <option value="WhatsApp">Preferred contact: WhatsApp</option>
                  </select>
                  <textarea required value={form.message} onChange={(event) => updateField('message', event.target.value)} className="min-h-[80px] w-full resize-none rounded-xl border border-slate-200 px-3 py-3 text-[13px] outline-none transition focus:border-[#D48035]" placeholder="How can we help you?" />

                  {status.message && (
                    <p className={`rounded-xl border px-3 py-2 text-[12px] ${status.type === 'success' ? 'border-emerald-100 bg-emerald-50 text-emerald-700' : status.type === 'error' ? 'border-red-100 bg-red-50 text-red-700' : 'border-slate-100 bg-slate-100 text-slate-600'}`}>
                      {status.type === 'success' && <CheckCircle2 className="mr-1 mb-0.5 inline h-3.5 w-3.5" />}
                      {status.message}
                    </p>
                  )}

                  <button type="submit" disabled={status.type === 'loading'} className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#C7742F] px-4 py-2.5 text-[13px] font-semibold text-white transition hover:bg-[#B45309] disabled:cursor-not-allowed disabled:opacity-70">
                    {status.type === 'loading' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                    {status.type === 'loading' ? 'Submitting...' : 'Send Message'}
                  </button>
                </form>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>
        </section>
      )}

      <button
        type="button"
        onClick={() => {
          setOpen((current) => !current);
          if (open) resetPanel();
        }}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-[#C7742F] text-white shadow-xl shadow-orange-900/20 transition hover:bg-[#B45309] focus:outline-none focus:ring-4 focus:ring-[#D48035]/20"
        aria-label={open ? 'Close FAQ assistant' : 'Open FAQ assistant'}
      >
        {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </button>
    </div>
  );
}
