"use client";

import React, { useEffect, useMemo, useState, useRef } from "react";
import {
  Bot,
  CheckCircle2,
  ChevronLeft,
  Loader2,
  MessageCircle,
  Send,
  X,
  User,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { fetchChatbotFaqs, submitContactInquiry } from "@/api";
import { chatbotFaqGroups, fallbackQuestion } from "@/data/chatbotFaqs";
import { useAuth } from "@/hooks/AuthContext";

const initialForm = {
  name: "",
  email: "",
  phone: "",
  organization: "",
  preferredContact: "Any",
  message: "",
};

const audienceContent = {
  public: {
    label: "Company Assistant",
    intro:
      "Hi there! I can answer company and operations questions. How can I help you today?",
    requestContext: "Company or purpose of inquiry",
  },
  investor: {
    label: "Investor Assistant",
    intro:
      "Hello! I am your Investor Support Assistant. I can help with investments, KYC, bookings, payments, and property services. How can I help?",
    requestContext: "City, property, booking ID, or issue context",
  },
  builder: {
    label: "Builder Assistant",
    intro:
      "Hello! I am your Builder Support Assistant. I can help with onboarding, listings, leads, CRM, and technical issues. What do you need help with?",
    requestContext: "Company, project, builder ID, or issue context",
  },
  serviceProvider: {
    label: "Service Provider Assistant",
    intro:
      "Hello! I can help with service provider profiles, enquiries, support, and workflow questions.",
    requestContext: "Service category, profile, enquiry, or issue context",
  },
  nri: {
    label: "NRI Investor Assistant",
    intro:
      "Hello! I can help with NRI investment, asset protection, legal, tax, and property management questions.",
    requestContext: "Country, city, property, or investment context",
  },
  customer: {
    label: "Support Assistant",
    intro:
      "Hi! I am here to provide technical support and guidance. How can I assist you?",
    requestContext: "Account, issue, or ticket context",
  },
};

const roleToAudience = (user) => {
  if (!user) return "public";
  if (user.role === "builder") return "builder";
  if (user.role === "serviceProvider") return "serviceProvider";
  if (
    user.role === "investor" &&
    String(user.investorType || user.type || "").toLowerCase() === "nri"
  )
    return "nri";
  if (user.role === "investor") return "investor";
  return "customer";
};

const categoryFallbacks = {
  public: "Before Login",
  investor: "Investor",
  builder: "Builder",
  serviceProvider: "Service Provider",
  nri: "NRI",
  customer: "Support",
};

const getFaqCategory = (faq, audience) => {
  if (faq.category) return faq.category;
  if (/kyc|verification/i.test(faq.question)) return "KYC / Workflow";
  return categoryFallbacks[audience] || "Support";
};

const isDuplicatePublicFallback = (faq, audience) => {
  return (
    audience === "public" &&
    faq.question === "What if my question is not listed?"
  );
};

export default function ChatbotWidget() {
  const { user, loading } = useAuth() || {};
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [showAppDownloadModal, setShowAppDownloadModal] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState({ type: "idle", message: "" });
  const [faqStatus, setFaqStatus] = useState("idle");
  const [remoteFaqs, setRemoteFaqs] = useState([]);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const chatEndRef = useRef(null);

  const audience = roleToAudience(user);
  const content = audienceContent[audience] || audienceContent.public;
  const fallbackGroup = chatbotFaqGroups[audience] || chatbotFaqGroups.public;

  const faqs = useMemo(() => {
    const sourceFaqs =
      remoteFaqs.length > 0 ? remoteFaqs : fallbackGroup?.faqs || [];
    return sourceFaqs.filter(
      (faq) => !isDuplicatePublicFallback(faq, audience),
    );
  }, [audience, fallbackGroup?.faqs, remoteFaqs]);

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const showMainMenu = () => {
    const groupedOptions = faqs.reduce((groups, faq) => {
      const category = getFaqCategory(faq, audience);
      if (!groups[category]) groups[category] = [];
      groups[category].push({
        label: faq.question,
        action: "FAQ",
        data: faq,
      });
      return groups;
    }, {});

    const optionGroups = Object.entries(groupedOptions).map(
      ([label, options]) => ({
        label,
        options,
      }),
    );

    optionGroups.push({
      label: user ? "Need More Help" : "Send A Query",
      options: [
        {
          label: user ? "Create support ticket" : fallbackQuestion,
          action: "CONTACT",
        },
      ],
    });

    setChatHistory((current) => [
      ...current,
      { id: generateId(), sender: "bot", type: "text", text: content.intro },
      {
        id: generateId(),
        sender: "bot",
        type: "options",
        groups: optionGroups,
      },
    ]);
  };

  useEffect(() => {
    let cancelled = false;

    async function loadFaqs() {
      setFaqStatus('loading');
      setRemoteFaqs([]);
      setSelectedQuestion(null);
      setShowRequestForm(false);
      setStatus({ type: "idle", message: "" });
      setChatHistory([]);

      try {
        const response = await fetchChatbotFaqs(audience);
        if (!cancelled) {
          setRemoteFaqs(response?.faqs || []);
          setFaqStatus("ready");
        }
      } catch (error) {
        if (!cancelled) {
          setFaqStatus("fallback");
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

  const showAppIcons = pathname === '/builder' || pathname === '/investor' || pathname === '/builder/' || pathname === '/investor/';

  return (
    <div className="fixed bottom-5 right-5 z-[80] font-sans flex flex-col items-end">
      {showAppDownloadModal && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-[400px] p-6 bg-white border border-slate-100 shadow-[0_24px_48px_-10px_rgba(0,0,0,0.18)] rounded-3xl flex flex-col items-center text-center animate-in zoom-in-95 duration-200 relative">
            <button
              onClick={() => setShowAppDownloadModal(false)}
              className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-slate-200 hover:text-slate-800"
              aria-label="Close download modal"
            >
              <X className="h-4 w-4" />
            </button>

            {/* App Icon Representation */}
            <div className="w-16 h-16 bg-[#C7742F] rounded-2xl flex items-center justify-center mb-4 text-white shadow-lg shadow-orange-950/20">
              <svg className="h-10 w-10 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
            </div>

            <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-2">
              Get the Investate App
            </h3>
            <p className="text-xs text-slate-500 font-semibold leading-relaxed mb-6 px-4">
              Scan the QR code with your phone camera or click below to download the app directly.
            </p>

            {/* QR Codes Container */}
            <div className="grid grid-cols-2 gap-4 w-full mb-6">
              <div className="flex flex-col items-center p-3 bg-slate-50 rounded-2xl border border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">iOS App</span>
                <div className="w-28 h-28 bg-white border border-slate-200 rounded-xl p-2 flex items-center justify-center">
                  <svg className="w-full h-full text-slate-800" viewBox="0 0 100 100">
                    <rect x="0" y="0" width="25" height="25" fill="currentColor" />
                    <rect x="5" y="5" width="15" height="15" fill="white" />
                    <rect x="10" y="10" width="5" height="5" fill="currentColor" />

                    <rect x="75" y="0" width="25" height="25" fill="currentColor" />
                    <rect x="80" y="5" width="15" height="15" fill="white" />
                    <rect x="85" y="10" width="5" height="5" fill="currentColor" />

                    <rect x="0" y="75" width="25" height="25" fill="currentColor" />
                    <rect x="5" y="80" width="15" height="15" fill="white" />
                    <rect x="10" y="85" width="5" height="5" fill="currentColor" />

                    <rect x="35" y="10" width="10" height="15" fill="currentColor" />
                    <rect x="55" y="5" width="10" height="10" fill="currentColor" />
                    <rect x="35" y="35" width="15" height="15" fill="currentColor" />
                    <rect x="60" y="30" width="15" height="20" fill="currentColor" />
                    <rect x="10" y="45" width="15" height="10" fill="currentColor" />
                    <rect x="30" y="60" width="20" height="10" fill="currentColor" />
                    <rect x="60" y="60" width="15" height="15" fill="currentColor" />
                    <rect x="40" y="80" width="15" height="10" fill="currentColor" />
                    <rect x="75" y="80" width="15" height="15" fill="currentColor" />
                  </svg>
                </div>
                <a
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  className="mt-3 w-full py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-[11px] font-bold tracking-wide flex items-center justify-center gap-1.5 transition-colors"
                >
                  App Store
                </a>
              </div>

              <div className="flex flex-col items-center p-3 bg-slate-50 rounded-2xl border border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Android App</span>
                <div className="w-28 h-28 bg-white border border-slate-200 rounded-xl p-2 flex items-center justify-center">
                  <svg className="w-full h-full text-slate-800" viewBox="0 0 100 100">
                    <rect x="0" y="0" width="25" height="25" fill="currentColor" />
                    <rect x="5" y="5" width="15" height="15" fill="white" />
                    <rect x="10" y="10" width="5" height="5" fill="currentColor" />

                    <rect x="75" y="0" width="25" height="25" fill="currentColor" />
                    <rect x="80" y="5" width="15" height="15" fill="white" />
                    <rect x="85" y="10" width="5" height="5" fill="currentColor" />

                    <rect x="0" y="75" width="25" height="25" fill="currentColor" />
                    <rect x="5" y="80" width="15" height="15" fill="white" />
                    <rect x="10" y="85" width="5" height="5" fill="currentColor" />

                    <rect x="40" y="5" width="15" height="10" fill="currentColor" />
                    <rect x="60" y="15" width="10" height="15" fill="currentColor" />
                    <rect x="35" y="30" width="15" height="15" fill="currentColor" />
                    <rect x="55" y="45" width="15" height="10" fill="currentColor" />
                    <rect x="15" y="40" width="10" height="15" fill="currentColor" />
                    <rect x="30" y="55" width="20" height="15" fill="currentColor" />
                    <rect x="65" y="65" width="10" height="10" fill="currentColor" />
                    <rect x="45" y="80" width="10" height="15" fill="currentColor" />
                    <rect x="75" y="80" width="15" height="15" fill="currentColor" />
                  </svg>
                </div>
                <a
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  className="mt-3 w-full py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-[11px] font-bold tracking-wide flex items-center justify-center gap-1.5 transition-colors"
                >
                  Google Play
                </a>
              </div>
            </div>

            <button
              onClick={() => setShowAppDownloadModal(false)}
              className="w-full py-3 bg-orange-600 hover:bg-orange-700 text-white font-black text-xs uppercase tracking-wider rounded-2xl shadow-lg shadow-orange-600/10 transition-all"
            >
              Done
            </button>
          </div>
        </div>
      )}

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

      <div className="flex items-center gap-3">
        {showAppIcons && (
          <>
            <div className="relative group">
              <a
                href="#"
                onClick={(e) => e.preventDefault()}
                className="flex h-14 w-14 items-center justify-center rounded-full bg-[#C7742F] border border-transparent text-white shadow-xl shadow-orange-950/20 transition duration-300 hover:bg-[#B45309] hover:scale-110"
                aria-label="Get Android App"
              >
                <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3.25098 2.32764C3.0768 2.50854 2.97852 2.78453 2.97852 3.12591V20.8741C2.97852 21.2155 3.0768 21.4915 3.25098 21.6724L3.31305 21.7291L13.1118 11.9304V11.8105L3.31305 2.01172L3.25098 2.32764Z" fill="white" fillOpacity="0.8" />
                  <path d="M16.3776 15.2016L13.1113 11.9353V11.8153L16.3789 8.54898L16.4526 8.59102L20.3204 10.79C21.4227 11.417 21.4227 12.4363 20.3204 13.0633L16.4526 15.2623L16.3776 15.2016Z" fill="white" fillOpacity="1" />
                  <path d="M13.2305 11.8754L3.3125 21.7933C3.65586 22.1557 4.21857 22.1977 4.8711 21.8267L16.3778 15.2818L13.2305 11.8754Z" fill="white" fillOpacity="0.6" />
                  <path d="M13.2305 11.8754L16.3778 8.469L4.8711 1.92408C4.21857 1.55305 3.65586 1.59509 3.3125 1.9575L13.2305 11.8754Z" fill="white" fillOpacity="0.9" />
                </svg>
              </a>
              <span className="absolute bottom-18 right-0 scale-0 group-hover:scale-100 transition-all duration-200 bg-slate-900 text-white text-[11px] font-bold px-2.5 py-1.5 rounded-lg whitespace-nowrap shadow-lg border border-slate-800">
                Get it on Google Play
              </span>
            </div>

            <div className="relative group">
              <a
                href="#"
                onClick={(e) => e.preventDefault()}
                className="flex h-14 w-14 items-center justify-center rounded-full bg-[#C7742F] border border-transparent text-white shadow-xl shadow-orange-950/20 transition duration-300 hover:bg-[#B45309] hover:scale-110"
                aria-label="Get iOS App"
              >
                <svg className="h-6 w-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-.96.04-2.13.64-2.82 1.45-.6.69-1.12 1.84-.98 2.94.1.08.2.12.3.12.87 0 1.95-.57 2.51-1.45z"/>
                </svg>
              </a>
              <span className="absolute bottom-18 right-0 scale-0 group-hover:scale-100 transition-all duration-200 bg-slate-900 text-white text-[11px] font-bold px-2.5 py-1.5 rounded-lg whitespace-nowrap shadow-lg border border-slate-800">
                Download on App Store
              </span>
            </div>
          </>
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
    </div>
  );
}
