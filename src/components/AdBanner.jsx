"use client";

import React, { useState, useEffect } from 'react';
import { fetchActiveAd } from '@/api';
import { ExternalLink, Loader2 } from 'lucide-react';

export default function AdBanner({ zoneId }) {
  const [ad, setAd] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const loadAd = async () => {
      try {
        setLoading(true);
        const data = await fetchActiveAd(zoneId);
        if (active) {
          setAd(data || null);
        }
      } catch (error) {
        console.warn(`Failed to fetch ad for zone ${zoneId}:`, error);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };
    loadAd();
    return () => {
      active = false;
    };
  }, [zoneId]);

  if (loading) {
    return (
      <div className="w-full flex items-center justify-center bg-slate-50 dark:bg-slate-900/20 border border-slate-100 dark:border-slate-800 rounded-2xl py-6 animate-pulse select-none">
        <Loader2 className="w-5 h-5 text-slate-400 animate-spin mr-2" />
        <span className="text-xs font-semibold text-slate-400">Loading Sponsor Spotlight...</span>
      </div>
    );
  }

  // If there's no advertisement content, do not render anything
  if (!ad || !ad.adContent || (!ad.adContent.imageUrl && !ad.adContent.text)) {
    return null;
  }

  const { imageUrl, targetUrl, text } = ad.adContent;

  // Set default dimensions based on zoneId to preserve aspect ratio / spacing
  const getZoneDimensions = () => {
    switch (zoneId) {
      case 'zone1':
      case 'zone2':
      case 'zone4':
        return { maxWidth: '728px', aspectRatio: '728/90' };
      case 'zone3':
        return { maxWidth: '300px', aspectRatio: '300/250' };
      case 'zone5':
        return { maxWidth: '970px', aspectRatio: '970/250' };
      default:
        return { maxWidth: '100%', aspectRatio: 'auto' };
    }
  };

  const dims = getZoneDimensions();

  const handleAdClick = () => {
    if (targetUrl) {
      window.open(targetUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div 
      className="w-full mx-auto relative group overflow-hidden bg-white/60 dark:bg-slate-900/60 backdrop-blur-md border border-slate-200/50 dark:border-slate-800/50 rounded-2xl shadow-sm hover:shadow-md hover:scale-[1.01] active:scale-[0.99] transition-all duration-300 cursor-pointer select-none"
      style={{ maxWidth: dims.maxWidth }}
      onClick={handleAdClick}
    >
      {/* Sponsored Tag */}
      <div className="absolute top-2.5 right-2.5 z-10 flex items-center gap-1 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md px-2 py-0.5 rounded-full border border-slate-200/40 dark:border-slate-800/40 text-[9px] font-bold text-slate-400 uppercase tracking-widest pointer-events-none transition-opacity duration-300">
        <span>Sponsored</span>
        {targetUrl && <ExternalLink className="w-2.5 h-2.5 ml-0.5 opacity-60 group-hover:opacity-100 transition-opacity" />}
      </div>

      {imageUrl ? (
        <div className="relative w-full overflow-hidden flex items-center justify-center bg-slate-950" style={{ aspectRatio: dims.aspectRatio }}>
          <img 
            src={imageUrl} 
            alt={text || "Advertisement"} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            onError={(e) => {
              // Fallback to text banner if image fails to load
              e.currentTarget.style.display = 'none';
            }}
          />
          {text && (
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent p-3 pt-8 text-white text-xs font-medium md:text-sm line-clamp-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              {text}
            </div>
          )}
        </div>
      ) : (
        /* Text-Only Banner Layout */
        <div className="p-6 flex flex-col justify-center items-center text-center gap-2 min-h-[90px] bg-gradient-to-br from-[#0b264f] to-[#1a4b8c] text-white">
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
