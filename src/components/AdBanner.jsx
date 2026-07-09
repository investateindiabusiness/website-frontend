"use client";

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { fetchActiveAd } from '@/api';
import { useAuth } from '@/hooks/AuthContext';
import { getSocket, joinZone, leaveZone } from '@/utils/socket';
import { ExternalLink, Loader2, TrendingUp, CheckCircle, Building2, MapPin, PlusCircle, X, User, HardHat, Wrench, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Zone pixel dimensions from the API spec
const ZONE_CONFIG = {
  zone1: { width: 728, height: 90 },
  zone2: { width: 728, height: 90 },
  zone3: { width: 300, height: 250 },
  zone4: { width: 728, height: 90 },
  zone5: { width: 970, height: 150 },
};

/**
 * AdBanner
 *
 * Props:
 *  zoneId   — required, e.g. "zone2"
 *  variant  — "default"   → floating card with max-width (works everywhere)
 *             "hero"      → flush full-width strip inside a dark hero section
 *             "spotlight" → large prominent banner section below the hero,
 *                           styled like the home page's zone5 placement
 */
export default function AdBanner({ zoneId, variant = 'default', forceRole }) {
  const [ad, setAd] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { user } = useAuth();

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    let active = true;
    const loadAd = async () => {
      try {
        setLoading(true);
        const data = await fetchActiveAd(zoneId);
        if (active) setAd(data || null);
      } catch (err) {
        console.warn(`AdBanner [${zoneId}]: failed to load.`, err);
        if (active) setAd(null);
      } finally {
        if (active) setLoading(false);
      }
    };
    loadAd();
    joinZone(zoneId);

    const socket = getSocket();
    const handleAdUpdate = ({ zoneId: updatedZoneId, adData }) => {
      if (updatedZoneId === zoneId && active) {
        console.log(`[AdBanner] Received real-time update for ${zoneId}`);
        setAd(adData);
      }
    };

    socket.on('activeAdUpdated', handleAdUpdate);

    return () => {
      active = false;
      leaveZone(zoneId);
      socket.off('activeAdUpdated', handleAdUpdate);
    };
  }, [zoneId]);

  const zone = ZONE_CONFIG[zoneId] || { width: 728, height: 90 };

  // Role-specific advertisement URLs
  const AD_PATHS = {
    admin: '/admin/advertisements',
    investor: '/investor/advertisements',
    serviceProvider: '/service-provider/advertisements',
    builder: '/builder/advertisements',
  };

  const getBookingUrl = () => {
    if (!user) return null; // Unauthenticated: handled by handleBookAdClick
    return AD_PATHS[user.role] || '/builder/advertisements';
  };

  // Called when unauthenticated user clicks "Book this Space"
  const handleBookAdClick = () => {
    if (user && user.role) {
      // Already logged in — go directly to ads page
      window.location.href = AD_PATHS[user.role] || '/builder/advertisements';
      return;
    }

    if (forceRole) {
      sessionStorage.setItem('postLoginRedirect', '/advertisements');
      window.location.href = `/login?role=${forceRole}`;
      return;
    }

    setShowLoginModal(true);
  };

  const handleRoleSelect = (role) => {
    sessionStorage.setItem('postLoginRedirect', '/advertisements');
    window.location.href = `/login?role=${role}`;
  };


  /* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
     ROLE SELECTION MODAL — rendered via portal so it
     always lives at document.body regardless of variant
  â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
  const modalContent = (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      onClick={() => setShowLoginModal(false)}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className="relative bg-white rounded-3xl shadow-2xl w-full max-w-sm mx-4 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        style={{ animation: 'adBannerSlideUp 0.25s ease' }}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#0b264f] to-[#1a4b8c] px-6 py-5 text-white relative">
          <button
            onClick={() => setShowLoginModal(false)}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/15 hover:bg-white/25 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
          <h2 className="text-lg font-extrabold mb-1">Login to Continue</h2>
          <p className="text-sm text-white/70">Select your role to log in</p>
        </div>

        {/* Role options */}
        <div className="p-4 flex flex-col gap-3">
          {[
            { role: 'investor', label: 'Investor Login', sub: 'Discover & invest in properties', Icon: User, bg: 'bg-blue-100', ic: 'text-blue-700' },
            { role: 'builder', label: 'Builder Login', sub: 'Showcase your projects', Icon: HardHat, bg: 'bg-green-100', ic: 'text-green-700' },
            { role: 'service-provider', label: 'Service Provider Login', sub: 'Offer your services', Icon: Wrench, bg: 'bg-purple-100', ic: 'text-purple-700' },
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
          Already have an account?{' '}
          <button onClick={() => setShowLoginModal(false)} className="text-orange-500 font-semibold hover:underline">Close</button>
        </p>
      </div>

      <style>{`
        @keyframes adBannerSlideUp {
          from { opacity: 0; transform: translateY(24px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );

  // Portal renders modal at document.body so it's always in the DOM
  const portal = mounted && showLoginModal
    ? createPortal(modalContent, document.body)
    : null;

  const renderDefaultAdContent = () => {
    const defaultBannerInner = (
      <div
        className={`w-full rounded-2xl flex flex-col items-center justify-center text-center gap-3 px-6 transition-colors ${ad.type === 'default'
          ? 'bg-gradient-to-r from-gray-100 to-gray-200 border-2 border-dashed border-gray-300 hover:border-orange-400 hover:bg-orange-50'
          : 'bg-gradient-to-r from-[#0b264f] to-[#1a4b8c]'
          }`}
        style={{ height: zone.height, minHeight: 90 }}
      >
        {ad.type === 'default' ? (
          <>
            <span className="text-[10px] uppercase font-bold text-orange-600 tracking-wider flex items-center gap-1">
              Boost your visibility today
            </span>
          </>
        ) : (
          <p className="text-sm md:text-base font-bold text-white leading-snug max-w-[85%] text-center line-clamp-2">
            {ad?.adContent?.text}
          </p>
        )}
      </div>
    );

    if (ad.type === 'default' && (!user || !user.role) && !forceRole) {
      return (
        <div className="w-full">
          {defaultBannerInner}
        </div>
      );
    }

    return defaultBannerInner;
  };


  /* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
     CARD VARIANT — sits inside the property grid
     Same shape/size as a property listing card
  â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
  if (variant === 'card') {
    if (loading) {
      return (
        <div className="rounded-[2rem] overflow-hidden shadow-sm border border-gray-100 bg-gray-100 animate-pulse aspect-[4/3]" />
      );
    }
    if (!ad?.adContent || (!ad.adContent.imageUrl && !ad.adContent.text)) return null;

    const { imageUrl, targetUrl, text } = ad.adContent;
    return (
      <>
        <div
          className="group bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-200 flex flex-col h-full"
          aria-label={text || 'Sponsored advertisement'}
        >
          <div className="relative aspect-[4/3] overflow-hidden bg-gray-100 flex-shrink-0">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={text || 'Advertisement'}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-[#0b264f] to-[#1a4b8c]" />
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-90" />

            {/* Top-left: Sponsored badge */}
            <div className="absolute top-4 left-4">
              <span className="bg-[#EAF0F6] text-[#0b264f] text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm">
                Sponsored
              </span>
            </div>
            {/* Bottom Overlay - Yield slot */}
            <div className="absolute bottom-4 left-4 right-4 text-white">
              <span className="text-xs font-bold bg-[#10B981] text-white inline-flex items-center px-2.5 py-1 rounded-md mb-1 shadow-sm">
                <TrendingUp className="w-3.5 h-3.5 mr-1" />
                {ad.adContent.yield || 'High ROI'}
              </span>
              <h3 className="text-2xl font-bold leading-tight tracking-tight mt-1 drop-shadow-md">
                {ad.adContent.price || '9876654'}
              </h3>
            </div>
          </div>

          <div className="p-6 flex flex-col flex-grow">
            <div className="flex-grow">
              <h3 className="font-extrabold text-gray-900 text-2xl mb-1.5 capitalize tracking-tight line-clamp-2 leading-tight">
                {text || 'Featured Promotion'}
              </h3>
              <p className="text-sm text-gray-400 mb-4 flex items-center font-medium">
                <Building2 className="w-4 h-4 mr-2 text-gray-400 stroke-[2]" /> Verified Partner
              </p>
              <div className="flex items-center text-sm text-gray-600 bg-gray-50/80 px-4 py-2.5 rounded-2xl mb-5 border border-gray-100/50">
                <MapPin className="w-4.5 h-4.5 mr-2 text-orange-500 flex-shrink-0" />
                <span className="truncate">{targetUrl || 'www.investateindia.com'}</span>
              </div>
              <div className="flex flex-wrap gap-2 mb-6">
                <span className="text-xs font-bold px-3 py-1.5 bg-[#EEF2FF] text-[#4F46E5] rounded-lg border border-[#E0E7FF]">
                  Promo
                </span>
                <span className="text-xs font-bold px-3 py-1.5 bg-[#ECFDF5] text-[#059669] rounded-lg border border-[#D1FAE5] flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5 text-[#059669]" /> Verified
                </span>
              </div>
            </div>
            <Button
              className="w-full bg-[#0b264f] hover:bg-blue-900 text-white font-bold py-4 rounded-[1.25rem] transition-all duration-300 h-13 text-sm tracking-wide"
            >
              View Full Details
            </Button>
          </div>
        </div>
        {portal}
      </>
    );
  }

  /* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
     SPOTLIGHT VARIANT — standalone big banner
     matches the home page hero section feel
  â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
  if (variant === 'spotlight') {
    const spotlightFallback = (
      <>
        <div
          className="relative w-full rounded-2xl overflow-hidden shadow-lg"
          style={{ height: 460 }}
        >
          <img
            src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200&q=80"
            alt="Real estate banner"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.75) 100%)' }}
          />
          {/* <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-black/55 backdrop-blur-sm text-white text-[10px] font-bold tracking-widest px-3 py-1.5 rounded-full border border-white/20 uppercase pointer-events-none">
            SPONSORED <ExternalLink className="w-2.5 h-2.5 opacity-70" />
          </div> */}
          <div className="absolute inset-x-0 bottom-0 flex flex-col items-start justify-end px-8 pb-10 z-10">
            <span className="text-orange-400 text-xs font-black uppercase tracking-widest mb-2">Premium Placement</span>
            <h2 className="text-white font-extrabold text-2xl leading-tight mb-4 drop-shadow-xl max-w-xs">
              Showcase your project to 10,000+ investors
            </h2>

          </div>
        </div>
        {portal}
      </>
    );
    if (loading) return spotlightFallback;
    if (!ad?.adContent || (!ad.adContent.imageUrl && !ad.adContent.text)) return spotlightFallback;

    const { imageUrl, targetUrl, text } = ad.adContent;
    return (
      <>
        <div
          className="relative w-full rounded-2xl overflow-hidden group shadow-lg hover:shadow-xl transition-shadow duration-300"
          style={{ height: 460 }}
          aria-label={text || 'Sponsored advertisement'}
        >
          {imageUrl ? (
            <>
              <img
                src={imageUrl}
                alt={text || 'Advertisement'}
                className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
              />
              {/* Gradient for text legibility */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent pointer-events-none" />
            </>
          ) : (
            <div className="absolute inset-0 bg-gradient-to-r from-[#0b264f] to-[#1a4b8c]" />
          )}

          {/* Text overlay — bottom-left */}
          <div className="absolute inset-y-0 left-0 flex flex-col justify-center px-8 md:px-12 max-w-xl z-10">
            {text && (
              <p className="text-white text-xl md:text-3xl font-extrabold leading-tight drop-shadow-xl line-clamp-3">
                {text}
              </p>
            )}
          </div>

          {/* Sponsored pill — top right */}
          <div className="absolute top-3 right-3 z-20 flex items-center gap-1 bg-black/50 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-bold text-white/80 uppercase tracking-widest pointer-events-none">
            {/* <span>Sponsored</span> */}
            {targetUrl && <ExternalLink className="w-2.5 h-2.5 opacity-60" />}
          </div>
        </div>
        {portal}
      </>
    );
  }

  /* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
     HERO VARIANT — flush strip inside a hero
  â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
  if (variant === 'hero') {
    if (loading) {
      return (
        <div className="w-full h-[90px] animate-pulse bg-white/10 rounded-2xl flex items-center justify-center">
          <Loader2 className="w-4 h-4 text-white/40 animate-spin mr-2" />
          <span className="text-xs text-white/40 font-medium">Loading sponsor…</span>
        </div>
      );
    }
    if (!ad?.adContent || (!ad.adContent.imageUrl && !ad.adContent.text)) return null;

    const { imageUrl, targetUrl, text } = ad.adContent;
    return (
      <>
        <div
          className="w-full relative group rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-white/10"
          style={{ height: zone.height, minHeight: 80 }}
          aria-label={text || 'Sponsored advertisement'}
        >
          {imageUrl ? (
            <>
              <img
                src={imageUrl}
                alt={text || 'Advertisement'}
                className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/20 pointer-events-none" />
            </>
          ) : (
            <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-orange-500 flex items-center justify-center px-6">
              <p className="text-white font-bold text-sm md:text-base text-center line-clamp-2 max-w-2xl">{text}</p>
            </div>
          )}
          <div className="absolute top-2 right-3 z-10 flex items-center gap-1 bg-black/50 backdrop-blur-sm px-2 py-0.5 rounded-full text-[9px] font-bold text-white/80 uppercase tracking-widest pointer-events-none">
            <span>Sponsored</span>
            {targetUrl && <ExternalLink className="w-2.5 h-2.5 opacity-70" />}
          </div>
          {imageUrl && text && (
            <div className="absolute bottom-0 inset-x-0 px-4 py-2.5 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <p className="text-white text-xs md:text-sm font-medium line-clamp-1">{text}</p>
            </div>
          )}
        </div>
        {portal}
      </>
    );
  }

  /* ─────────────────────────────────────────
     CTA-ONLY VARIANT
  â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
  if (variant === 'cta-only') {
    return (
      <>
        {portal}
      </>
    );
  }



  /* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
     DEFAULT VARIANT — floating card
  â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
  const staticFallbackBanner = (
    <div
      className="relative w-full mx-auto rounded-2xl overflow-hidden shadow-md"
      style={{ maxWidth: '100%', height: zone.height }}
    >
      {/* Background image */}
      <img
        src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200&q=80"
        alt="Real estate banner"
        className="absolute inset-0 w-full h-full object-cover"
      />
      {/* Dark gradient left→right */}
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(to right, rgba(11,38,79,0.9) 0%, rgba(26,75,140,0.8) 50%, rgba(26,75,140,0.4) 100%)' }}
      />
      {/* ADVERTISE badge — top right */}
      <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-white/10 backdrop-blur-sm text-white text-[9px] font-bold tracking-widest px-2.5 py-1 rounded-full border border-white/20 uppercase pointer-events-none">
        Advertise Here
      </div>
      {/* Text + CTA */}
      <div className={`absolute inset-0 flex justify-center px-6 md:px-8 z-10 ${zone.height <= 100 ? 'flex-row items-center justify-between gap-4' : 'flex-col items-start'}`}>
        <h2 className={`text-white font-extrabold leading-tight drop-shadow-lg ${zone.height <= 100 ? 'text-base md:text-lg mb-0' : 'text-xl md:text-2xl mb-3'}`}>
          Showcase your projects here
        </h2>
      </div>
    </div>
  );

  if (loading) return staticFallbackBanner;
  if (!ad?.adContent || (!ad.adContent.imageUrl && !ad.adContent.text)) return staticFallbackBanner;

  const { imageUrl, targetUrl, text } = ad.adContent;
  // Padding-bottom trick for bulletproof aspect ratio
  const paddingBottom = `${((zone.height / zone.width) * 100).toFixed(4)}%`;

  return (
    <>
      <div
        className="w-full mx-auto relative group rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 select-none border border-slate-200/60 dark:border-slate-700/60"
        style={{ maxWidth: zone.width }}
        aria-label={text || 'Sponsored advertisement'}
      >
        <div className="absolute top-2 right-2 z-20 flex items-center gap-1 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm px-2 py-0.5 rounded-full border border-slate-200/60 text-[9px] font-bold text-slate-500 uppercase tracking-widest pointer-events-none shadow-sm">
          <span>Sponsored</span>
          {targetUrl && <ExternalLink className="w-2.5 h-2.5 opacity-60 group-hover:opacity-100 transition-opacity" />}
        </div>
        {imageUrl ? (
          <div className="relative w-full rounded-2xl overflow-hidden bg-slate-900" style={{ paddingBottom }}>
            <img
              src={imageUrl}
              alt={text || 'Advertisement'}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            {text && (
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent px-4 py-3 text-white text-xs md:text-sm font-medium line-clamp-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {text}
              </div>
            )}
          </div>
        ) : (
          renderDefaultAdContent()
        )}
      </div>
      {portal}
    </>
  );
}
