"use client";

<<<<<<< HEAD
import React, { useEffect, useMemo, useState, useRef } from 'react';
import { Bot, CheckCircle2, ChevronLeft, Loader2, MessageCircle, Send, X, User } from 'lucide-react';
=======
import React, { useEffect, useMemo, useState } from 'react';
import { Bot, CheckCircle2, ChevronLeft, Loader2, MessageCircle, Send, ShieldCheck, X } from 'lucide-react';
>>>>>>> 5627b10a2105b23a802352e1ccd8df8ffd4e1612
import { usePathname } from 'next/navigation';
import { fetchChatbotFaqs, submitContactInquiry } from '@/api';
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
<<<<<<< HEAD
    intro: 'Hi there! I can answer company and operations questions. How can I help you today?',
=======
    intro: 'I can answer company and operations questions only.',
>>>>>>> 5627b10a2105b23a802352e1ccd8df8ffd4e1612
    requestContext: 'Company or purpose of inquiry',
  },
  investor: {
    label: 'Investor Assistant',
<<<<<<< HEAD
    intro: 'Hello! I am your Investor Support Assistant. I can help with investments, KYC, bookings, payments, and property services. How can I help?',
=======
    intro: 'Logged-in investor support for investments, KYC, bookings, payments, legal, tax, and property services.',
>>>>>>> 5627b10a2105b23a802352e1ccd8df8ffd4e1612
    requestContext: 'City, property, booking ID, or issue context',
  },
  builder: {
    label: 'Builder Assistant',
<<<<<<< HEAD
    intro: 'Hello! I am your Builder Support Assistant. I can help with onboarding, listings, leads, CRM, and technical issues. What do you need help with?',
=======
    intro: 'Logged-in builder support for onboarding, listings, leads, CRM, finance, compliance, and technical issues.',
>>>>>>> 5627b10a2105b23a802352e1ccd8df8ffd4e1612
    requestContext: 'Company, project, builder ID, or issue context',
  },
  customer: {
    label: 'Support Assistant',
<<<<<<< HEAD
    intro: 'Hi! I am here to provide technical support and guidance. How can I assist you?',
=======
    intro: 'Logged-in support guidance for technical issues and urgent escalations.',
>>>>>>> 5627b10a2105b23a802352e1ccd8df8ffd4e1612
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
<<<<<<< HEAD
  
  // Chat state
  const [chatHistory, setChatHistory] = useState([]);
  const chatEndRef = useRef(null);

=======
  const [activeQuestion, setActiveQuestion] = useState(null);
>>>>>>> 5627b10a2105b23a802352e1ccd8df8ffd4e1612
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState({ type: 'idle', message: '' });
  const [faqStatus, setFaqStatus] = useState('idle');
  const [remoteFaqs, setRemoteFaqs] = useState([]);

  const audience = roleToAudience(user);
  const content = audienceContent[audience] || audienceContent.public;
  const fallbackGroup = chatbotFaqGroups[audience] || chatbotFaqGroups.public;

<<<<<<< HEAD
=======
  if (pathname?.startsWith('/admin')) {
    return null;
  }
>>>>>>> 5627b10a2105b23a802352e1ccd8df8ffd4e1612

  const faqs = useMemo(() => {
    return remoteFaqs.length > 0 ? remoteFaqs : fallbackGroup.faqs;
  }, [fallbackGroup.faqs, remoteFaqs]);

<<<<<<< HEAD
  // Generate a unique ID for chat messages
  const generateId = () => Math.random().toString(36).substr(2, 9);

  // Initialize chat when opened or when FAQs load
  useEffect(() => {
    if (faqStatus === 'ready' || faqStatus === 'fallback') {
      if (chatHistory.length === 0) {
        showMainMenu();
      }
    }
  }, [faqStatus, faqs]);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatHistory, showRequestForm]);

=======
>>>>>>> 5627b10a2105b23a802352e1ccd8df8ffd4e1612
  useEffect(() => {
    let cancelled = false;

    async function loadFaqs() {
      setFaqStatus('loading');
<<<<<<< HEAD
=======
      setActiveQuestion(null);
>>>>>>> 5627b10a2105b23a802352e1ccd8df8ffd4e1612
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

<<<<<<< HEAD
  const showMainMenu = () => {
    const options = faqs.map(faq => ({
      label: faq.question,
      action: 'FAQ',
      data: faq
    }));
    
    options.push({
      label: 'My question is not listed',
      action: 'CONTACT'
    });

    setChatHistory(prev => [
      ...prev,
      { id: generateId(), sender: 'bot', type: 'text', text: content.intro },
      { id: generateId(), sender: 'bot', type: 'options', options }
    ]);
  };

  const handleOptionClick = (option) => {
    // 1. Add user message
    setChatHistory(prev => [
      ...prev,
      { id: generateId(), sender: 'user', type: 'text', text: option.label }
    ]);

    // 2. Process action
    setTimeout(() => {
      if (option.action === 'FAQ') {
        const faq = option.data;
        setChatHistory(prev => [
          ...prev,
          { id: generateId(), sender: 'bot', type: 'text', text: faq.answer },
          { id: generateId(), sender: 'bot', type: 'options', text: 'Did this help?', options: [
            { label: 'Main Menu', action: 'MAIN_MENU' },
            { label: 'My question is not listed', action: 'CONTACT' }
          ]}
        ]);
      } else if (option.action === 'MAIN_MENU') {
        showMainMenu();
      } else if (option.action === 'CONTACT') {
        setShowRequestForm(true);
        setStatus({ type: 'idle', message: '' });
      }
    }, 400); // Slight delay for realistic chat feel
  };

  const resetPanel = () => {
    setShowRequestForm(false);
    setForm(initialForm);
    setStatus({ type: 'idle', message: '' });
    setChatHistory([]);
    if (faqStatus === 'ready' || faqStatus === 'fallback') {
      showMainMenu();
    }
=======
  const resetPanel = () => {
    setActiveQuestion(null);
    setShowRequestForm(false);
    setForm(initialForm);
    setStatus({ type: 'idle', message: '' });
>>>>>>> 5627b10a2105b23a802352e1ccd8df8ffd4e1612
  };

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const submitRequest = async (event) => {
    event.preventDefault();

    setStatus({ type: 'loading', message: 'Submitting your request...' });

    try {
      const inquiryMessage = [
        form.message,
        form.organization ? `Context: ${form.organization}` : '',
        `Preferred contact: ${form.preferredContact}`,
        `User type: ${audience}`,
<<<<<<< HEAD
=======
        `Selected question: ${activeQuestion?.question || fallbackQuestion}`,
>>>>>>> 5627b10a2105b23a802352e1ccd8df8ffd4e1612
      ]
        .filter(Boolean)
        .join('\n\n');

      await submitContactInquiry({
        name: form.name,
        email: form.email,
        phone: form.phone,
<<<<<<< HEAD
        subject: 'Chatbot Support Request',
=======
        subject: activeQuestion?.question || 'Chatbot Support Request',
>>>>>>> 5627b10a2105b23a802352e1ccd8df8ffd4e1612
        message: inquiryMessage,
      });

      setStatus({
        type: 'success',
        message: 'Thanks. Your request has been sent to the inquiries panel for the Investate team.',
      });
      setForm(initialForm);
<<<<<<< HEAD
      
      // Add success message to chat and hide form
      setTimeout(() => {
        setShowRequestForm(false);
        setChatHistory(prev => [
          ...prev,
          { id: generateId(), sender: 'bot', type: 'text', text: 'Your request has been successfully submitted. Our team will get back to you soon.' },
          { id: generateId(), sender: 'bot', type: 'options', options: [{ label: 'Main Menu', action: 'MAIN_MENU' }] }
        ]);
      }, 2000);

=======
      setActiveQuestion(null);
>>>>>>> 5627b10a2105b23a802352e1ccd8df8ffd4e1612
    } catch (error) {
      setStatus({
        type: 'error',
        message: error?.message || 'Could not submit your request. Please try again.',
      });
    }
  };

<<<<<<< HEAD
  if (pathname?.startsWith('/admin') || user?.role === 'admin') {
    return null;
  }

  return (
    <div className="fixed bottom-5 right-5 z-[80] font-sans">
      {open && (
        <section className="mb-4 w-[calc(100vw-2.5rem)] max-w-[410px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-900/20 flex flex-col" style={{ maxHeight: '75vh' }}>
          <header className="flex items-center justify-between bg-[#0b264f] px-4 py-3 text-white shrink-0">
=======
  return (
    <div className="fixed bottom-5 right-5 z-[80] font-sans">
      {open && (
        <section className="mb-4 w-[calc(100vw-2.5rem)] max-w-[410px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-900/20">
          <header className="flex items-center justify-between bg-[#0b264f] px-4 py-3 text-white">
>>>>>>> 5627b10a2105b23a802352e1ccd8df8ffd4e1612
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

<<<<<<< HEAD
          <div className="flex-grow overflow-y-auto p-4 bg-slate-50 flex flex-col gap-4">
            
            {faqStatus === 'loading' && chatHistory.length === 0 && (
              <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-600 self-start">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading support options...
              </div>
            )}

            {!showRequestForm && chatHistory.map((msg, index) => {
              const isBot = msg.sender === 'bot';
              
              if (msg.type === 'text') {
                return (
                  <div key={msg.id} className={`flex max-w-[85%] ${isBot ? 'self-start' : 'self-end flex-row-reverse'} gap-2`}>
                    <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full mt-auto ${isBot ? 'bg-[#0b264f] text-white' : 'bg-blue-100 text-blue-700'}`}>
                      {isBot ? <Bot className="h-3.5 w-3.5" /> : <User className="h-3.5 w-3.5" />}
                    </div>
                    <div className={`rounded-2xl px-4 py-2.5 text-[13px] leading-relaxed shadow-sm ${isBot ? 'bg-white border border-slate-200 text-slate-700 rounded-bl-sm' : 'bg-blue-600 text-white rounded-br-sm'}`}>
                      {msg.text}
                    </div>
                  </div>
                );
              }

              if (msg.type === 'options') {
                // Only show options for the most recent options message in the history
                const isLatestOptions = chatHistory.slice(index + 1).findIndex(m => m.type === 'options') === -1;
                
                return (
                  <div key={msg.id} className="flex flex-col gap-2 max-w-[90%] self-start ml-8">
                    {msg.text && (
                      <p className="text-[13px] text-slate-500 font-medium px-1">{msg.text}</p>
                    )}
                    {isLatestOptions && (
                      <div className="flex flex-wrap gap-2">
                        {msg.options.map((opt, i) => (
                          <button
                            key={i}
                            onClick={() => handleOptionClick(opt)}
                            className="bg-white border border-[#0b264f]/30 text-[#0b264f] hover:bg-[#0b264f] hover:text-white transition-colors text-[12px] font-semibold px-3 py-1.5 rounded-full shadow-sm text-left"
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }
              
              return null;
            })}

            {faqStatus === 'fallback' && !showRequestForm && (
              <p className="text-[11px] leading-5 text-slate-400 text-center mt-4">Using offline FAQs.</p>
            )}

            {showRequestForm && (
              <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-300">
                <form className="space-y-3" onSubmit={submitRequest}>
                  <div className="flex items-center gap-2 pb-2 border-b border-slate-100 mb-3">
                    <button
                      type="button"
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                      onClick={() => {
                        setShowRequestForm(false);
                        setStatus({ type: 'idle', message: '' });
                      }}
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">Contact Support</p>
                    </div>
                  </div>

                  <input
                    required
                    value={form.name}
                    onChange={(event) => updateField('name', event.target.value)}
                    className="h-10 w-full rounded-xl border border-slate-200 px-3 text-[13px] outline-none transition focus:border-[#0b264f]"
                    placeholder="Full name"
                  />
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <input
                      required
                      type="email"
                      value={form.email}
                      onChange={(event) => updateField('email', event.target.value)}
                      className="h-10 w-full rounded-xl border border-slate-200 px-3 text-[13px] outline-none transition focus:border-[#0b264f]"
                      placeholder="Email"
                    />
                    <input
                      required
                      value={form.phone}
                      onChange={(event) => updateField('phone', event.target.value)}
                      className="h-10 w-full rounded-xl border border-slate-200 px-3 text-[13px] outline-none transition focus:border-[#0b264f]"
                      placeholder="Phone"
                    />
                  </div>
                  <input
                    value={form.organization}
                    onChange={(event) => updateField('organization', event.target.value)}
                    className="h-10 w-full rounded-xl border border-slate-200 px-3 text-[13px] outline-none transition focus:border-[#0b264f]"
                    placeholder={content.requestContext}
                  />
                  <select
                    value={form.preferredContact}
                    onChange={(event) => updateField('preferredContact', event.target.value)}
                    className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-[13px] outline-none transition focus:border-[#0b264f]"
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
                    className="min-h-[80px] w-full resize-none rounded-xl border border-slate-200 px-3 py-3 text-[13px] outline-none transition focus:border-[#0b264f]"
                    placeholder="How can we help you?"
                  />

                  {status.message && (
                    <p
                      className={`rounded-xl px-3 py-2 text-[12px] ${
                        status.type === 'success'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                          : status.type === 'error'
                            ? 'bg-red-50 text-red-700 border border-red-100'
                            : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {status.type === 'success' && <CheckCircle2 className="mr-1 mb-0.5 inline h-3.5 w-3.5" />}
                      {status.message}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={status.type === 'loading'}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#0b264f] px-4 py-2.5 text-[13px] font-semibold text-white transition hover:bg-[#12376d] disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {status.type === 'loading' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                    {status.type === 'loading' ? 'Submitting...' : 'Send Message'}
                  </button>
                </form>
              </div>
            )}

            <div ref={chatEndRef} />
=======
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
>>>>>>> 5627b10a2105b23a802352e1ccd8df8ffd4e1612
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
