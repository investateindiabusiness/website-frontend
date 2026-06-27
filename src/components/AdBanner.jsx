"use client";

import React, { useState, useEffect } from 'react';
import { fetchActiveAd, fetchMyBookings } from '@/api';
import { useAuth } from '@/hooks/AuthContext';
import { ExternalLink, Loader2, TrendingUp, CheckCircle, Building2, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Zone pixel dimensions from the API spec
const ZONE_CONFIG = {
  zone1: { width: 728, height: 90 },
  zone2: { width: 728, height: 90 },
  zone3: { width: 300, height: 250 },
  zone4: { width: 728, height: 90 },
  zone5: { width: 970, height: 250 },
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
export default function AdBanner({ zoneId, variant = 'default' }) {
  const [ad, setAd]           = useState(null);
  const [loading, setLoading] = useState(true);
  const { user }              = useAuth();

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
    return () => { active = false; };
  }, [zoneId]);

  const zone = ZONE_CONFIG[zoneId] || { width: 728, height: 90 };

  /* ─────────────────────────────────────────
     CARD VARIANT — sits inside the property grid
     Same shape/size as a property listing card
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
      <div
        className="group bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-200 flex flex-col h-full cursor-pointer"
        onClick={() => targetUrl && window.open(targetUrl, '_blank', 'noopener,noreferrer')}
        role={targetUrl ? 'link' : undefined}
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
    );
  }

  /* ─────────────────────────────────────────
     SPOTLIGHT VARIANT — standalone big banner
     matches the home page hero section feel
  ───────────────────────────────────────── */
  if (variant === 'spotlight') {
    const SpotlightFallback = () => (
      <div
        className="relative w-full max-w-5xl mx-auto rounded-2xl overflow-hidden shadow-lg"
        style={{ height: 340 }}
      >
        <img
          src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200&q=80"
          alt="Real estate banner"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to right, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.40) 55%, rgba(0,0,0,0.08) 100%)' }}
        />
        <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-black/55 backdrop-blur-sm text-white text-[10px] font-bold tracking-widest px-3 py-1.5 rounded-full border border-white/20 uppercase pointer-events-none">
          SPONSORED <ExternalLink className="w-2.5 h-2.5 opacity-70" />
        </div>
        <div className="absolute inset-y-0 left-0 flex flex-col justify-center px-10 md:px-14 max-w-xl">
          <h2 className="text-white font-extrabold text-3xl md:text-4xl leading-tight mb-5 drop-shadow-xl">
            Invest in premium real estate today!
          </h2>
          <a
            href="/properties"
            className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm px-6 py-3 rounded-lg shadow-lg transition-all duration-200 w-fit"
          >
            Learn More <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    );
    if (loading) return <SpotlightFallback />;
    if (!ad?.adContent || (!ad.adContent.imageUrl && !ad.adContent.text)) return <SpotlightFallback />;

    const { imageUrl, targetUrl, text } = ad.adContent;
    return (
      <div
        className="relative w-full max-w-5xl mx-auto rounded-2xl overflow-hidden cursor-pointer group shadow-lg hover:shadow-xl transition-shadow duration-300"
        style={{ height: 340 }}
        onClick={() => targetUrl && window.open(targetUrl, '_blank', 'noopener,noreferrer')}
        role={targetUrl ? 'link' : undefined}
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
          {targetUrl && (
            <a
              href={targetUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="mt-4 self-start inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold px-5 py-2 rounded-lg transition-colors shadow-md"
            >
              Learn More <ExternalLink className="w-4 h-4" />
            </a>
          )}
        </div>

        {/* Sponsored pill — top right */}
        <div className="absolute top-3 right-3 z-20 flex items-center gap-1 bg-black/50 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-bold text-white/80 uppercase tracking-widest pointer-events-none">
          <span>Sponsored</span>
          {targetUrl && <ExternalLink className="w-2.5 h-2.5 opacity-60" />}
        </div>
      </div>
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
      <div
        className="w-full relative group rounded-2xl overflow-hidden cursor-pointer shadow-lg hover:shadow-xl transition-all duration-300 border border-white/10"
        style={{ height: zone.height, minHeight: 80 }}
        onClick={() => targetUrl && window.open(targetUrl, '_blank', 'noopener,noreferrer')}
        role={targetUrl ? 'link' : undefined}
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
    );
  }

  /* ─────────────────────────────────────────
     DEFAULT VARIANT — floating card
  ───────────────────────────────────────── */
  /* Static fallback banner — shown when loading OR when no API ad is available */
  const StaticFallbackBanner = () => (
    <div
      className="relative w-full mx-auto rounded-2xl overflow-hidden shadow-md"
      style={{ maxWidth: '100%', height: 180 }}
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
        style={{ background: 'linear-gradient(to right, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.45) 50%, rgba(0,0,0,0.08) 100%)' }}
      />
      {/* SPONSORED badge — top right */}
      <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-black/55 backdrop-blur-sm text-white text-[10px] font-bold tracking-widest px-3 py-1.5 rounded-full border border-white/20 uppercase pointer-events-none">
        SPONSORED
        <ExternalLink className="w-3 h-3 opacity-70" />
      </div>
      {/* Text + CTA */}
      <div className="absolute inset-0 flex flex-col justify-center px-8 max-w-lg">
        <h2 className="text-white font-extrabold text-2xl md:text-3xl leading-tight mb-4 drop-shadow-lg">
          Invest in premium real estate today!
        </h2>
        <a
          href="/properties"
          className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white font-bold text-sm px-5 py-2.5 rounded-lg shadow-lg transition-all duration-200 w-fit"
        >
          Learn More <ExternalLink className="w-4 h-4" />
        </a>
      </div>
    </div>
  );

  if (loading) return <StaticFallbackBanner />;
  if (!ad?.adContent || (!ad.adContent.imageUrl && !ad.adContent.text)) return <StaticFallbackBanner />;

  const { imageUrl, targetUrl, text } = ad.adContent;
  // Padding-bottom trick for bulletproof aspect ratio
  const paddingBottom = `${((zone.height / zone.width) * 100).toFixed(4)}%`;

  return (
    <div
      className="w-full mx-auto relative group rounded-2xl shadow-sm hover:shadow-md hover:scale-[1.005] active:scale-[0.998] transition-all duration-300 cursor-pointer select-none border border-slate-200/60 dark:border-slate-700/60"
      style={{ maxWidth: zone.width }}
      onClick={() => targetUrl && window.open(targetUrl, '_blank', 'noopener,noreferrer')}
      role={targetUrl ? 'link' : undefined}
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
        <div
          className="w-full rounded-2xl flex flex-col items-center justify-center text-center gap-2 bg-gradient-to-r from-[#0b264f] to-[#1a4b8c] text-white px-6"
          style={{ height: zone.height, minHeight: 90 }}
        >
          <p className="text-sm md:text-base font-bold leading-snug max-w-[85%]">{text}</p>
          {targetUrl && (
            <span className="text-[10px] uppercase font-bold text-orange-400 tracking-wider flex items-center gap-1 group-hover:underline">
              Learn More <ExternalLink className="w-3 h-3" />
            </span>
          )}
        </div>
      )}
    </div>
  );
}
