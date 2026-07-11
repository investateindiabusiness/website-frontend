"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createPortal } from 'react-dom';
import { fetchActiveAd } from '@/api';
import { useAuth } from '@/hooks/AuthContext';
import { getSocket, joinZone, leaveZone } from '@/utils/socket';
import { ExternalLink, Loader2, TrendingUp, CheckCircle, Building2, MapPin, X, User, HardHat, Wrench, ChevronRight, Megaphone } from 'lucide-react';
import { Button } from '@/components/ui/button';

/**
 * Zone pixel dimensions — aligned with the confirmed zone map:
 *   zone1 → Homepage Hero Leaderboard        (970×90)
 *   zone2 → Homepage Mid-Page Banner          (970×250)
 *   zone3 → Investor Hero Leaderboard         (970×90)
 *   zone4 → Properties Page Top Banner        (970×90)
 *   zone5 → Project Detail Page Banner        (728×90)
 */
const ZONE_CONFIG = {
  zone1: { width: 970, height: 90,  name: 'Homepage Hero Leaderboard',    location: 'Bottom of main homepage hero section' },
  zone2: { width: 970, height: 250, name: 'Homepage Mid-Page Banner',      location: 'Between sections on main homepage' },
  zone3: { width: 970, height: 90,  name: 'Investor Hero Leaderboard',     location: 'Bottom of Investor page hero section' },
  zone4: { width: 970, height: 90,  name: 'Properties Page Top Banner',    location: 'Top of /properties listing page' },
  zone5: { width: 728, height: 90,  name: 'Project Detail Page Banner',    location: 'Inside individual project detail pages' },
};

/**
 * AdBanner
 *
 * Props:
 *  zoneId       — required, e.g. "zone1"
 *  variant      — "default"      → floating card with max-width
 *                 "hero"         → flush full-width strip inside a dark hero section
 *                 "leaderboard"  → slim horizontal strip at the bottom of a hero section
 *                 "spotlight"    → large prominent banner section below the hero
 *                 "card"         → same shape/size as a property listing card
 *  forceRole    — if set, skips role-selection modal and redirects to this role's login
 */
export default function AdBanner({ zoneId, variant = 'default', forceRole }) {
  const router = useRouter();
  const [ad, setAd] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginRedirectTarget, setLoginRedirectTarget] = useState('booking'); // 'booking' | 'current'
  const [mounted, setMounted] = useState(false);
  // Leaderboard variant state (hoisted to top level to obey Rules of Hooks)
  const [leaderboardClosed, setLeaderboardClosed] = useState(false);
  const [leaderboardVisible, setLeaderboardVisible] = useState(false);
  const { user } = useAuth();

  useEffect(() => { setMounted(true); }, []);

  // Leaderboard animation delay
  useEffect(() => {
    if (variant !== 'leaderboard') return;
    const t = setTimeout(() => setLeaderboardVisible(true), 800);
    return () => clearTimeout(t);
  }, [variant]);

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
    if (!user) return null;
    return AD_PATHS[user.role] || '/builder/advertisements';
  };

  // Called when clicking the "Book this Space" / "Advertise" CTA
  const handleBookAdClick = () => {
    if (user && user.role) {
      window.location.href = AD_PATHS[user.role] || '/builder/advertisements';
      return;
    }
    if (forceRole) {
      sessionStorage.setItem('postLoginRedirect', '/advertisements');
      window.location.href = `/login?role=${forceRole}`;
      return;
    }
    setLoginRedirectTarget('booking');
    setShowLoginModal(true);
  };

  // Called when clicking the ad itself (image or content area)
  // After login, returns to the current page, not the booking page
  const handleAdContentClick = (targetUrl) => {
    if (!user) {
      // Save current page URL so after login we come back here
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('postLoginRedirect', window.location.pathname + window.location.search);
      }
      if (forceRole) {
        window.location.href = `/login?role=${forceRole}`;
        return;
      }
      setLoginRedirectTarget('current');
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

  const handleRoleSelect = (role) => {
    if (loginRedirectTarget === 'booking') {
      sessionStorage.setItem('postLoginRedirect', '/advertisements');
    } else {
      // Keep whatever we stored in sessionStorage already (current page URL)
    }
    window.location.href = `/login?role=${role}`;
  };


  /* ─────────────────────────────────────────
     ROLE SELECTION MODAL — rendered via portal
  ───────────────────────────────────────── */
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
          <p className="text-sm text-white/70">Select your role to proceed</p>
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

  const portal = mounted && showLoginModal
    ? createPortal(modalContent, document.body)
    : null;


  /* ─────────────────────────────────────────
     LEADERBOARD VARIANT
     Slim horizontal strip anchored to the
     bottom of a hero section. Has a close
     button and a "Book This Spot" CTA.
  ───────────────────────────────────────── */
  if (variant === 'leaderboard') {
    // Use hoisted state (leaderboardClosed, leaderboardVisible, setLeaderboardClosed)
    if (leaderboardClosed) return null;

    const leaderboardFallback = (
      <div
        style={{
          transition: 'opacity 0.5s ease, transform 0.5s ease',
          opacity: leaderboardVisible ? 1 : 0,
          transform: leaderboardVisible ? 'translateY(0)' : 'translateY(12px)',
        }}
        className="w-full relative"
      >
        <div className="mx-4 md:mx-8 mb-4 rounded-2xl overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(11,38,79,0.92) 0%, rgba(26,75,140,0.88) 100%)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255,255,255,0.15)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
          }}>
          <div className="flex items-center justify-between px-5 py-3 gap-4">
            {/* Left: Sponsored label */}
            <div className="flex items-center gap-3 flex-shrink-0">
              <div className="w-8 h-8 rounded-lg bg-orange-500/20 border border-orange-400/30 flex items-center justify-center">
                <Megaphone className="w-4 h-4 text-orange-400" />
              </div>
              <div>
                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-white/40">Premium Placement</p>
                <p className="text-xs font-bold text-white/70">This ad spot is available</p>
              </div>
            </div>
            {/* Center: Call to action */}
            <div className="flex-1 hidden md:block text-center">
              <p className="text-sm font-bold text-white/60 italic">Showcase your project to 10,000+ investors across the globe</p>
            </div>
            {/* Right: CTA + Close */}
            <div className="flex items-center gap-3 flex-shrink-0">
              <button
                onClick={handleBookAdClick}
                className="bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg shadow-orange-500/30 whitespace-nowrap"
              >
                Book This Spot →
              </button>
              <button
                onClick={() => setLeaderboardClosed(true)}
                className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center transition-colors"
                aria-label="Close advertisement"
              >
                <X className="w-3.5 h-3.5 text-white/70" />
              </button>
            </div>
          </div>
        </div>
        {portal}
      </div>
    );

    if (loading || !ad?.adContent || (!ad.adContent.imageUrl && !ad.adContent.text)) {
      return leaderboardFallback;
    }

    const { imageUrl, targetUrl, text } = ad.adContent;

    return (
      <div
        style={{
          transition: 'opacity 0.5s ease, transform 0.5s ease',
          opacity: leaderboardVisible ? 1 : 0,
          transform: leaderboardVisible ? 'translateY(0)' : 'translateY(12px)',
        }}
        className="w-full relative"
      >
        <div
          className="mx-4 md:mx-8 mb-4 rounded-2xl overflow-hidden cursor-pointer group"
          onClick={() => handleAdContentClick(targetUrl)}
          style={{
            boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
            border: '1px solid rgba(255,255,255,0.15)',
          }}
          aria-label={text || 'Sponsored advertisement'}
        >
          <div className="flex items-center justify-between gap-4"
            style={{
              background: imageUrl
                ? 'linear-gradient(135deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.7) 100%)'
                : 'linear-gradient(135deg, #0b264f 0%, #1a4b8c 100%)',
              backdropFilter: 'blur(8px)',
              position: 'relative',
              minHeight: 64,
              padding: '12px 20px',
            }}
          >
            {/* Background image (if exists) */}
            {imageUrl && (
              <img
                src={imageUrl}
                alt={text || 'Advertisement'}
                className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:opacity-30 transition-opacity duration-500"
              />
            )}

            {/* Sponsored badge */}
            <div className="flex items-center gap-2 flex-shrink-0 relative z-10">
              <span className="text-[9px] font-black uppercase tracking-[0.18em] text-white/50 bg-white/10 border border-white/15 px-2 py-1 rounded-full">
                Sponsored
              </span>
            </div>

            {/* Ad text */}
            <div className="flex-1 text-center relative z-10 hidden sm:block">
              {text && (
                <p className="text-sm md:text-base font-bold text-white leading-snug line-clamp-1 drop-shadow-lg">
                  {text}
                </p>
              )}
            </div>

            {/* Right: Visit link + Close */}
            <div className="flex items-center gap-3 flex-shrink-0 relative z-10">
              {targetUrl && (
                <span className="hidden md:flex items-center gap-1 text-orange-400 text-xs font-bold">
                  Learn More <ExternalLink className="w-3 h-3" />
                </span>
              )}
              <button
                onClick={(e) => { e.stopPropagation(); setLeaderboardClosed(true); }}
                className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center transition-colors"
                aria-label="Close advertisement"
              >
                <X className="w-3.5 h-3.5 text-white/70" />
              </button>
            </div>
          </div>
        </div>
        {portal}
      </div>
    );
  }


  /* ─────────────────────────────────────────
     CARD VARIANT — sits inside a property grid
  ───────────────────────────────────────── */
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
          className="group bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-200 flex flex-col h-full cursor-pointer"
          onClick={() => handleAdContentClick(targetUrl)}
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
            <div className="absolute top-4 left-4">
              <span className="bg-[#EAF0F6] text-[#0b264f] text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm">
                Sponsored
              </span>
            </div>
          </div>
          <div className="p-6 flex flex-col flex-grow">
            <div className="flex-grow">
              <h3 className="font-extrabold text-gray-900 text-xl mb-1.5 capitalize tracking-tight line-clamp-2 leading-tight">
                {text || 'Featured Promotion'}
              </h3>
              <p className="text-sm text-gray-400 mb-4 flex items-center font-medium">
                <Building2 className="w-4 h-4 mr-2 text-gray-400 stroke-[2]" /> Verified Partner
              </p>
            </div>
            <Button className="w-full bg-[#0b264f] hover:bg-blue-900 text-white font-bold py-4 rounded-[1.25rem] transition-all duration-300 h-13 text-sm tracking-wide">
              View Full Details
            </Button>
          </div>
        </div>
        {portal}
      </>
    );
  }


  /* ─────────────────────────────────────────
     SPOTLIGHT VARIANT — standalone big banner
  ───────────────────────────────────────── */
  if (variant === 'spotlight') {
    const spotlightFallback = (
      <>
        <div
          className="relative w-full rounded-2xl overflow-hidden shadow-lg cursor-pointer"
          style={{ height: 460 }}
          onClick={handleBookAdClick}
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
          className="relative w-full rounded-2xl overflow-hidden group shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer"
          style={{ height: 460 }}
          aria-label={text || 'Sponsored advertisement'}
          onClick={() => handleAdContentClick(targetUrl)}
        >
          {imageUrl ? (
            <>
              <img
                src={imageUrl}
                alt={text || 'Advertisement'}
                className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent pointer-events-none" />
            </>
          ) : (
            <div className="absolute inset-0 bg-gradient-to-r from-[#0b264f] to-[#1a4b8c]" />
          )}
          <div className="absolute inset-y-0 left-0 flex flex-col justify-center px-8 md:px-12 max-w-xl z-10">
            {text && (
              <p className="text-white text-xl md:text-3xl font-extrabold leading-tight drop-shadow-xl line-clamp-3">
                {text}
              </p>
            )}
          </div>
          <div className="absolute top-3 right-3 z-20 flex items-center gap-1 bg-black/50 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-bold text-white/80 uppercase tracking-widest pointer-events-none">
            <span>Sponsored</span>
            {targetUrl && <ExternalLink className="w-2.5 h-2.5 opacity-60" />}
          </div>
        </div>
        {portal}
      </>
    );
  }


  /* ─────────────────────────────────────────
     HERO VARIANT — flush strip inside a hero
  ───────────────────────────────────────── */
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
          className="w-full relative group rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-white/10 cursor-pointer"
          style={{ height: zone.height, minHeight: 80 }}
          aria-label={text || 'Sponsored advertisement'}
          onClick={() => handleAdContentClick(targetUrl)}
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
        </div>
        {portal}
      </>
    );
  }


  /* ─────────────────────────────────────────
     DEFAULT VARIANT — floating leaderboard card
  ───────────────────────────────────────── */
  const staticFallbackBanner = (
    <div
      className="relative w-full mx-auto rounded-2xl overflow-hidden shadow-md cursor-pointer group"
      style={{ maxWidth: '100%', height: Math.max(zone.height, 90) }}
      onClick={handleBookAdClick}
    >
      <img
        src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200&q=80"
        alt="Real estate banner"
        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
      />
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(to right, rgba(11,38,79,0.92) 0%, rgba(26,75,140,0.8) 50%, rgba(26,75,140,0.4) 100%)' }}
      />
      <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-white/10 backdrop-blur-sm text-white text-[9px] font-bold tracking-widest px-2.5 py-1 rounded-full border border-white/20 uppercase pointer-events-none">
        Advertise Here
      </div>
      <div className={`absolute inset-0 flex justify-center px-6 md:px-8 z-10 ${zone.height <= 100 ? 'flex-row items-center justify-between gap-4' : 'flex-col items-start'}`}>
        <h2 className={`text-white font-extrabold leading-tight drop-shadow-lg ${zone.height <= 100 ? 'text-base md:text-lg mb-0' : 'text-xl md:text-2xl mb-3'}`}>
          {zone.name} — This spot is available
        </h2>
        <button
          onClick={(e) => { e.stopPropagation(); handleBookAdClick(); }}
          className="bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all duration-200 hover:scale-105 shadow-lg shadow-orange-500/30 whitespace-nowrap flex-shrink-0"
        >
          Book This Spot →
        </button>
      </div>
    </div>
  );

  if (loading) return staticFallbackBanner;
  if (!ad?.adContent || (!ad.adContent.imageUrl && !ad.adContent.text)) return staticFallbackBanner;

  const { imageUrl, targetUrl, text } = ad.adContent;
  const paddingBottom = `${((zone.height / zone.width) * 100).toFixed(4)}%`;

  return (
    <>
      <div
        className="w-full mx-auto relative group rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 select-none border border-slate-200/60 cursor-pointer"
        style={{ maxWidth: zone.width }}
        aria-label={text || 'Sponsored advertisement'}
        onClick={() => handleAdContentClick(targetUrl)}
      >
        <div className="absolute top-2 right-2 z-20 flex items-center gap-1 bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded-full border border-slate-200/60 text-[9px] font-bold text-slate-500 uppercase tracking-widest pointer-events-none shadow-sm">
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
          staticFallbackBanner
        )}
      </div>
      {portal}
    </>
  );
}
