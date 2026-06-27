"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { fetchMyBookings, fetchActiveAd } from '@/api';
import { ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAuth } from '@/hooks/AuthContext';

const AUTO_PLAY_MS = 4500;

/* ─── Static fallback when there are no ads ─── */
function FallbackBanner({ height = 340 }) {
  return (
    <div
      className="relative w-full rounded-2xl overflow-hidden shadow-md"
      style={{ height }}
    >
      <img
        src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200&q=80"
        alt="Real estate banner"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to right, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.45) 50%, rgba(0,0,0,0.08) 100%)',
        }}
      />
      <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-black/55 backdrop-blur-sm text-white text-[10px] font-bold tracking-widest px-3 py-1.5 rounded-full border border-white/20 uppercase pointer-events-none">
        SPONSORED <ExternalLink className="w-3 h-3 opacity-70" />
      </div>
      <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-14 max-w-xl">
        <h2 className="text-white font-extrabold text-2xl md:text-3xl leading-tight mb-4 drop-shadow-lg">
          Invest in premium real estate today!
        </h2>
        <a
          href="/properties"
          className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm px-5 py-2.5 rounded-lg shadow-lg transition-all duration-200 w-fit"
        >
          Learn More <ExternalLink className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
}

/* ─── Single slide ─── */
function AdSlide({ ad, height = 340 }) {
  const { imageUrl, targetUrl, text } = ad?.adContent || {};

  return (
    <div
      className="relative w-full h-full cursor-pointer group"
      onClick={() => targetUrl && window.open(targetUrl, '_blank', 'noopener,noreferrer')}
    >
      {imageUrl ? (
        <>
          <img
            src={imageUrl}
            alt={text || 'Advertisement'}
            className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
            onError={(e) => { e.currentTarget.style.display = 'none'; }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/25 to-transparent pointer-events-none" />
        </>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-r from-[#0b264f] to-[#1a4b8c]" />
      )}

      {/* SPONSORED badge */}
      <div className="absolute top-3 right-3 z-20 flex items-center gap-1 bg-black/50 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-bold text-white/80 uppercase tracking-widest pointer-events-none">
        <span>Sponsored</span>
        {targetUrl && <ExternalLink className="w-2.5 h-2.5 opacity-60" />}
      </div>

      {/* Text + CTA */}
      <div className="absolute inset-y-0 left-0 flex flex-col justify-center px-8 md:px-14 max-w-xl z-10">
        {text && (
          <p className="text-white text-xl md:text-3xl font-extrabold leading-tight drop-shadow-xl line-clamp-3 mb-4">
            {text}
          </p>
        )}
        {targetUrl && (
          <a
            href={targetUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="self-start inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold px-5 py-2.5 rounded-lg transition-colors shadow-md w-fit"
          >
            Learn More <ExternalLink className="w-4 h-4" />
          </a>
        )}
      </div>
    </div>
  );
}

/**
 * AdCarousel
 *
 * Props:
 *  zoneId  — required, e.g. "zone2"
 *  height  — optional, default 340
 *
 * Loads ALL approved bookings for this zone from the logged-in user
 * and displays them in an auto-scrolling carousel.
 * Falls back to single fetchActiveAd when user is not logged in.
 * Shows static fallback banner when no ads exist.
 */
export default function AdCarousel({ zoneId, height = 340 }) {
  const { user } = useAuth();
  const [ads, setAds]         = useState([]);
  const [loading, setLoading] = useState(true);
  const [current, setCurrent] = useState(0);
  const timerRef              = useRef(null);

  /* ── Load ads ── */
  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        setLoading(true);
        if (user?.token) {
          const res = await fetchMyBookings();
          const bookings = res?.data || [];

          console.log(`[AdCarousel zone=${zoneId}] all bookings:`, bookings);

          // Exclude rejected/cancelled/expired statuses
          const EXCLUDE_STATUSES = ['rejected', 'cancelled', 'canceled', 'rectify_needed', 'expired'];

          const zoneAds = bookings
            .filter(
              (b) =>
                b.zoneId === zoneId &&
                !EXCLUDE_STATUSES.includes((b.approvalStatus || b.status || '').toLowerCase()) &&
                (b.adContent?.imageUrl || b.adContent?.text)
            )
            .map((b) => ({ adContent: b.adContent }));

          console.log(`[AdCarousel zone=${zoneId}] matched ads:`, zoneAds);

          if (active) {
            if (zoneAds.length > 0) {
              setAds(zoneAds);
            } else {
              // No user bookings — fall back to public active ad
              const data = await fetchActiveAd(zoneId);
              setAds(data?.adContent ? [{ adContent: data.adContent }] : []);
            }
          }
        } else {
          const data = await fetchActiveAd(zoneId);
          if (active) setAds(data?.adContent ? [{ adContent: data.adContent }] : []);
        }
      } catch (err) {
        console.warn(`AdCarousel [${zoneId}]:`, err);
        // On error fall back to public ad
        try {
          const data = await fetchActiveAd(zoneId);
          if (active) setAds(data?.adContent ? [{ adContent: data.adContent }] : []);
        } catch {
          if (active) setAds([]);
        }
      } finally {
        if (active) setLoading(false);
      }
    };
    load();
    return () => { active = false; };
  }, [zoneId, user]);

  /* ── Auto-play ── */
  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % ads.length);
  }, [ads.length]);

  const prev = useCallback(() => {
    setCurrent((c) => (c - 1 + ads.length) % ads.length);
  }, [ads.length]);

  useEffect(() => {
    if (ads.length <= 1) return;
    timerRef.current = setInterval(next, AUTO_PLAY_MS);
    return () => clearInterval(timerRef.current);
  }, [ads.length, next]);

  const resetTimer = () => {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(next, AUTO_PLAY_MS);
  };

  /* ── Render ── */
  if (loading) {
    return (
      <div
        className="relative w-full rounded-2xl overflow-hidden bg-gray-200 animate-pulse"
        style={{ height }}
      />
    );
  }

  if (ads.length === 0) return <FallbackBanner height={height} />;

  return (
    <div className="relative w-full" style={{ height }}>
      {/* Slides */}
      <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-lg">
        {ads.map((ad, i) => (
          <div
            key={i}
            className="absolute inset-0 transition-opacity duration-700"
            style={{ opacity: i === current ? 1 : 0, zIndex: i === current ? 1 : 0 }}
          >
            <AdSlide ad={ad} height={height} />
          </div>
        ))}
      </div>

      {/* Arrows — only when more than 1 slide */}
      {ads.length > 1 && (
        <>
          <button
            onClick={() => { prev(); resetTimer(); }}
            className="absolute left-3 top-1/2 -translate-y-1/2 z-20 bg-black/40 hover:bg-black/65 backdrop-blur-sm text-white rounded-full p-2 transition-all shadow-md"
            aria-label="Previous ad"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => { next(); resetTimer(); }}
            className="absolute right-3 top-1/2 -translate-y-1/2 z-20 bg-black/40 hover:bg-black/65 backdrop-blur-sm text-white rounded-full p-2 transition-all shadow-md"
            aria-label="Next ad"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Dot indicators */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
            {ads.map((_, i) => (
              <button
                key={i}
                onClick={() => { setCurrent(i); resetTimer(); }}
                className={`rounded-full transition-all duration-300 ${
                  i === current
                    ? 'bg-white w-6 h-2.5'
                    : 'bg-white/50 hover:bg-white/80 w-2.5 h-2.5'
                }`}
                aria-label={`Go to ad ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
