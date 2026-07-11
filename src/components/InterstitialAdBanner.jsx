"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { createPortal } from "react-dom";
import { fetchActiveAd } from "@/api";
import { useAuth } from "@/hooks/AuthContext";
import { getSocket, joinZone, leaveZone } from "@/utils/socket";
import {
  X,
  ExternalLink,
  Megaphone,
  ChevronRight,
  User,
  HardHat,
  Wrench,
  ArrowRight,
} from "lucide-react";

const AD_PATHS = {
  admin: "/admin/advertisements",
  investor: "/investor/advertisements",
  serviceProvider: "/service-provider/advertisements",
  builder: "/builder/advertisements",
};

/**
 * InterstitialAdBanner
 *
 * A full-width, dismissible advertisement banner that appears
 * between page sections. Uses zone2 (Homepage Mid-Page Banner).
 *
 * Props:
 *  zoneId      — e.g. "zone2"
 *  forceRole   — if set, skips role modal
 *  className   — extra wrapper classes
 */
export default function InterstitialAdBanner({
  zoneId = "zone2",
  forceRole,
  className = "",
}) {
  const router = useRouter();
  const [ad, setAd] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dismissed, setDismissed] = useState(false);
  const [visible, setVisible] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [loginRedirectTarget, setLoginRedirectTarget] = useState("booking");
  const sectionRef = useRef(null);
  const { user } = useAuth();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    let active = true;
    const loadAd = async () => {
      try {
        setLoading(true);
        const data = await fetchActiveAd(zoneId);
        if (active) setAd(data || null);
      } catch {
        if (active) setAd(null);
      } finally {
        if (active) setLoading(false);
      }
    };
    loadAd();
    joinZone(zoneId);

    const socket = getSocket();
    const handleAdUpdate = ({ zoneId: id, adData }) => {
      if (id === zoneId && active) setAd(adData);
    };
    socket.on("activeAdUpdated", handleAdUpdate);

    return () => {
      active = false;
      leaveZone(zoneId);
      socket.off("activeAdUpdated", handleAdUpdate);
    };
  }, [zoneId]);

  // Intersection Observer — animate in when section scrolls into view
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [loading]);

  const handleDismiss = () => {
    setVisible(false);
    setTimeout(() => setDismissed(true), 400);
  };

  const handleAdClick = (targetUrl) => {
    if (!user) {
      if (typeof window !== "undefined") {
        sessionStorage.setItem(
          "postLoginRedirect",
          window.location.pathname + window.location.search
        );
      }
      if (forceRole) {
        window.location.href = `/login?role=${forceRole}`;
        return;
      }
      setLoginRedirectTarget("current");
      setShowLoginModal(true);
      return;
    }
    // Logged in — navigate to target URL (in the same tab)
    if (targetUrl) {
      if (targetUrl.startsWith('http://') || targetUrl.startsWith('https://') || targetUrl.startsWith('//')) {
        window.location.href = targetUrl;
      } else {
        router.push(targetUrl);
      }
    }
  };

  const handleBookAdClick = () => {
    if (user && user.role) {
      window.location.href = AD_PATHS[user.role] || "/builder/advertisements";
      return;
    }
    if (forceRole) {
      sessionStorage.setItem("postLoginRedirect", "/advertisements");
      window.location.href = `/login?role=${forceRole}`;
      return;
    }
    setLoginRedirectTarget("booking");
    setShowLoginModal(true);
  };

  const handleRoleSelect = (role) => {
    if (loginRedirectTarget === "booking") {
      sessionStorage.setItem("postLoginRedirect", "/advertisements");
    }
    window.location.href = `/login?role=${role}`;
  };

  const portal =
    mounted && showLoginModal
      ? createPortal(
          <div
            className="fixed inset-0 z-[9999] flex items-center justify-center"
            onClick={() => setShowLoginModal(false)}
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <div
              className="relative bg-white rounded-3xl shadow-2xl w-full max-w-sm mx-4 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
              style={{ animation: "interstitialSlideUp 0.25s ease" }}
            >
              <div className="bg-gradient-to-r from-[#0b264f] to-[#1a4b8c] px-6 py-5 text-white relative">
                <button
                  onClick={() => setShowLoginModal(false)}
                  className="absolute top-4 right-4 p-1.5 rounded-full bg-white/15 hover:bg-white/25 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
                <h2 className="text-lg font-extrabold mb-1">Login to Continue</h2>
                <p className="text-sm text-white/70">Select your role to proceed</p>
              </div>
              <div className="p-4 flex flex-col gap-3">
                {[
                  { role: "investor", label: "Investor Login", sub: "Discover & invest in properties", Icon: User, bg: "bg-blue-100", ic: "text-blue-700" },
                  { role: "builder", label: "Builder Login", sub: "Showcase your projects", Icon: HardHat, bg: "bg-green-100", ic: "text-green-700" },
                  { role: "service-provider", label: "Service Provider Login", sub: "Offer your services", Icon: Wrench, bg: "bg-purple-100", ic: "text-purple-700" },
                ].map(({ role, label, sub, Icon, bg, ic }) => (
                  <button
                    key={role}
                    onClick={() => handleRoleSelect(role)}
                    className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl border-2 border-gray-100 hover:border-orange-400 hover:bg-orange-50 transition-all group text-left"
                  >
                    <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center flex-shrink-0 group-hover:bg-orange-100 transition-colors`}>
                      <Icon className={`w-5 h-5 ${ic} group-hover:text-orange-600`} />
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-gray-800 text-sm">{label}</p>
                      <p className="text-xs text-gray-500">{sub}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-orange-500 transition-colors" />
                  </button>
                ))}
              </div>
              <p className="text-center text-xs text-gray-400 pb-4">
                Already have an account?{" "}
                <button onClick={() => setShowLoginModal(false)} className="text-orange-500 font-semibold hover:underline">
                  Close
                </button>
              </p>
            </div>
            <style>{`
              @keyframes interstitialSlideUp {
                from { opacity: 0; transform: translateY(24px) scale(0.97); }
                to   { opacity: 1; transform: translateY(0) scale(1); }
              }
            `}</style>
          </div>,
          document.body
        )
      : null;

  // Don't render anything once permanently dismissed
  if (dismissed) return null;

  // Fallback when no ad is booked — show "book this spot" prompt
  const fallbackContent = (
    <div
      className="relative overflow-hidden rounded-3xl border border-slate-200/80 shadow-md cursor-pointer group bg-gradient-to-r from-[#0b264f] via-[#0d2e5c] to-[#0b264f]"
      style={{ minHeight: 200 }}
      onClick={handleBookAdClick}
    >
      {/* Background pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
          backgroundSize: "24px 24px",
        }}
      />
      
      {/* Left Accent Bar */}
      <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#D48035]" />

      {/* Close button */}
      <button
        onClick={(e) => { e.stopPropagation(); handleDismiss(); }}
        className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 flex items-center justify-center transition-colors"
        aria-label="Close advertisement"
      >
        <X className="w-4 h-4 text-white/70" />
      </button>

      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 px-8 md:px-12 py-10">
        {/* Left content */}
        <div className="flex-1 text-center md:text-left">
          <div className="inline-flex items-center gap-2 bg-orange-500/15 border border-orange-400/20 text-orange-300 text-[10px] font-black uppercase tracking-[0.18em] px-3 py-1.5 rounded-full mb-4">
            <Megaphone className="w-3.5 h-3.5" />
            Premium Advertising Slot
          </div>
          <h3 className="text-2xl md:text-3xl font-extrabold text-white leading-tight mb-2.5 tracking-tight">
            Reach 10,000+ Investors<br />
            <span className="text-[#D48035]">Showcase Your Real Estate Project</span>
          </h3>
          <p className="text-blue-200/60 text-xs md:text-sm font-medium leading-relaxed max-w-lg">
            This premium mid-page showcase is available. Target high-value NRI property buyers directly.
          </p>
        </div>

        {/* Right CTA */}
        <div className="flex flex-col items-center gap-4 flex-shrink-0 min-w-[200px]">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 text-center w-full">
            <p className="text-white/40 text-[9px] uppercase font-bold tracking-widest mb-1">Rates starting from</p>
            <p className="text-2xl font-black text-white">₹500 <span className="text-xs font-bold text-white/50">/ day</span></p>
            <p className="text-white/30 text-[10px] mt-1 font-semibold">Flexible booking cycles</p>
          </div>
          <button
            className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold text-sm px-8 py-3.5 rounded-xl transition-all duration-200 hover:scale-[1.03] active:scale-95 shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2"
          >
            Book This Spot <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  // Active ad content
  const hasAd = !loading && ad?.adContent && (ad.adContent.imageUrl || ad.adContent.text);
  const { imageUrl, targetUrl, text } = ad?.adContent || {};

  const activeContent = (
    <div
      className="relative overflow-hidden rounded-3xl border border-slate-200/80 shadow-md group cursor-pointer"
      style={{ minHeight: 200 }}
      onClick={() => handleAdClick(targetUrl)}
      aria-label={text || "Sponsored advertisement"}
    >
      {/* Background */}
      {imageUrl ? (
        <>
          <img
            src={imageUrl}
            alt={text || "Advertisement"}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/10 pointer-events-none" />
        </>
      ) : (
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(135deg, #0b264f 0%, #163e75 100%)" }}
        />
      )}

      {/* Sponsored badge */}
      <div className="absolute top-4 left-4 z-20 flex items-center gap-1.5 bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/10 text-white shadow-sm">
        <span className="text-[9px] font-black uppercase tracking-[0.15em] text-white/90">Sponsored</span>
        {targetUrl && <ExternalLink className="w-3 h-3 opacity-80" />}
      </div>

      {/* Close button */}
      <button
        onClick={(e) => { e.stopPropagation(); handleDismiss(); }}
        className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-black/45 hover:bg-black/60 border border-white/10 flex items-center justify-center transition-colors"
        aria-label="Close advertisement"
      >
        <X className="w-4 h-4 text-white/80" />
      </button>

      {/* Content */}
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 px-8 md:px-12 py-12">
        <div className="flex-1 text-center md:text-left">
          {text && (
            <p className="text-xl md:text-2xl font-extrabold text-white leading-snug drop-shadow-xl line-clamp-3">
              {text}
            </p>
          )}
        </div>
        {targetUrl && (
          <div className="flex-shrink-0">
            <span className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold text-sm px-6 py-3.5 rounded-xl transition-all duration-200 group-hover:scale-[1.03] shadow-lg shadow-orange-500/20">
              Learn More <ArrowRight className="w-4 h-4" />
            </span>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <section
      ref={sectionRef}
      className={`w-full py-8 px-4 md:px-8 ${className}`}
      style={{
        transition: "opacity 0.5s ease, transform 0.5s ease",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(24px)",
      }}
      aria-label="Advertisement section"
    >
      <div className="container mx-auto max-w-5xl">
        {/* Section header */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 px-3">
            Advertisement
          </span>
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
        </div>

        {loading ? (
          <div
            className="rounded-3xl animate-pulse bg-gradient-to-r from-slate-100 to-slate-200"
            style={{ minHeight: 200 }}
          />
        ) : hasAd ? (
          activeContent
        ) : (
          fallbackContent
        )}
      </div>
      {portal}
    </section>
  );
}
