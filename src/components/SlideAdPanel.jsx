"use client";

import React, { useState, useEffect } from "react";
import { X, ChevronRight, Megaphone, ExternalLink } from "lucide-react";
import AdBanner from "@/components/AdBanner";
import { fetchActiveAd } from "@/api";

/**
 * SlideAdPanel
 *
 * A fixed right-side ad panel that:
 * - Opens by default on page load (drops down from the right edge)
 * - Has a clear X close button
 * - Stays flush to the right side of the viewport
 * - Does NOT overlap hero content (positioned at top right, clear of text)
 * - Has an increased-size circular re-open badge showing the first word of the ad title
 *
 * Props:
 *  zoneId     — ad zone to display, e.g. "zone1"
 *  forceRole  — role to redirect to on login click
 *  topOffset  — CSS value for distance from top of viewport (default: "90px")
 */
export default function SlideAdPanel({
  zoneId = "zone1",
  forceRole,
  topOffset = "90px",
}) {
  const [isOpen, setIsOpen] = useState(false); // starts false, animates open after mount
  const [hasEverClosed, setHasEverClosed] = useState(false);
  const [ad, setAd] = useState(null);

  // Fetch active ad to display its title's first word on the tab
  useEffect(() => {
    let active = true;
    const loadAd = async () => {
      try {
        const data = await fetchActiveAd(zoneId);
        if (active) setAd(data || null);
      } catch (err) {
        console.warn(`SlideAdPanel [${zoneId}]: failed to load.`, err);
      }
    };
    loadAd();
    return () => { active = false; };
  }, [zoneId]);

  // Animate open after a short delay so the page renders first
  useEffect(() => {
    const t = setTimeout(() => setIsOpen(true), 600);
    return () => clearTimeout(t);
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    setHasEverClosed(true);
  };

  const handleReopen = () => {
    setIsOpen(true);
  };

  const getFirstWord = () => {
    if (ad?.adContent?.text) {
      const cleanText = ad.adContent.text.trim().replace(/[^\w\s-]/g, '');
      const firstWord = cleanText.split(/\s+/)[0];
      if (firstWord) {
        return firstWord.substring(0, 8); // maximum 8 characters to fit nicely
      }
    }
    return "Promo";
  };

  return (
    <>
      {/* ─── Re-open tab: Circular Floating Attachment Badge (visible only after closed) ─── */}
      {hasEverClosed && !isOpen && (
        <div
          style={{
            position: "fixed",
            top: topOffset,
            right: "12px",
            zIndex: 50,
          }}
          className="animate-bounce-slow"
        >
          {/* Circular Button */}
          <button
            onClick={handleReopen}
            aria-label="Open advertisement"
            style={{
              position: "relative",
              width: 76,
              height: 76,
              borderRadius: "50%",
              border: "2px solid rgba(255, 255, 255, 0.2)",
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 8px 32px rgba(249, 115, 22, 0.4)",
              transition: "transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.3s ease",
            }}
            className="bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700 text-white hover:scale-105 active:scale-95"
          >
            {/* Small Attachment (Pill Badge overlapping top of circle) */}
            <div
              style={{
                position: "absolute",
                top: "-8px",
                left: "50%",
                transform: "translateX(-50%)",
                background: "#0b264f",
                color: "#ffffff",
                fontSize: "8px",
                fontWeight: "900",
                letterSpacing: "0.12em",
                padding: "2px 8px",
                borderRadius: "9999px",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
                whiteSpace: "nowrap",
                textTransform: "uppercase",
              }}
            >
              Sponsored
            </div>

            {/* Main word from ad title */}
            <span
              style={{
                fontSize: "10px",
                fontWeight: "900",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                maxWidth: "60px",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                lineHeight: "1.2",
              }}
            >
              {getFirstWord()}
            </span>

            <span style={{ fontSize: "8px", fontWeight: "700", color: "rgba(255,255,255,0.75)", marginTop: "2px" }}>
              Click to View
            </span>

            {/* Small corner Megaphone icon attachment */}
            <div
              style={{
                position: "absolute",
                bottom: "-2px",
                right: "-2px",
                width: "22px",
                height: "22px",
                borderRadius: "50%",
                background: "#0b264f",
                border: "1px solid rgba(255,255,255,0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
              }}
            >
              <Megaphone size={10} className="text-orange-400" />
            </div>
          </button>
        </div>
      )}

      {/* ─── Main panel ─── */}
      <div
        aria-hidden={!isOpen}
        style={{
          position: "fixed",
          top: topOffset,
          right: 0,
          zIndex: 50,
          width: 300,
          borderRadius: "0 0 0 20px",
          overflow: "hidden",
          boxShadow: "-8px 8px 40px rgba(0,0,0,0.25), -2px 0 12px rgba(0,0,0,0.1)",
          transform: isOpen ? "translateX(0%)" : "translateX(105%)",
          opacity: isOpen ? 1 : 0,
          transition: "transform 0.45s cubic-bezier(0.34, 1.4, 0.64, 1), opacity 0.35s ease",
          willChange: "transform, opacity",
          pointerEvents: isOpen ? "auto" : "none",
        }}
      >
        {/* ── Panel header ── */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "10px 14px",
            gap: 8,
          }}
          className="bg-gradient-to-r from-[#0b264f] to-[#1a4b8c]"
        >
          {/* Left: label */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div
              style={{
                width: 24,
                height: 24,
                borderRadius: 8,
                background: "rgba(249,115,22,0.25)",
                border: "1px solid rgba(249,115,22,0.4)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <Megaphone size={12} style={{ color: "#f97316" }} />
            </div>
            <span
              style={{
                fontSize: 10,
                fontWeight: 800,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.55)",
              }}
            >
              Sponsored
            </span>
          </div>

          {/* Right: close button */}
          <button
            onClick={handleClose}
            aria-label="Close advertisement"
            style={{
              width: 28,
              height: 28,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.1)",
              border: "1px solid rgba(255,255,255,0.18)",
              color: "white",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              transition: "background 0.15s ease",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.22)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.1)"; }}
          >
            <X size={13} strokeWidth={2.5} />
          </button>
        </div>

        {/* ── Ad content ── */}
        <div
          style={{
            width: "100%",
            background: "white",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <AdBanner
            zoneId={zoneId}
            variant="spotlight"
            forceRole={forceRole}
          />
        </div>

        {/* ── Footer CTA ── */}
        <div
          style={{
            padding: "12px 16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 10,
          }}
          className="bg-gradient-to-r from-[#0b264f] to-[#1a4b8c]"
        >
          <div>
            <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 9, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.1em", margin: 0 }}>
              Want this spot?
            </p>
            <p style={{ color: "white", fontSize: 11, fontWeight: 800, margin: 0, marginTop: 2 }}>
              Advertise your project here
            </p>
          </div>
          <button
            style={{
              flexShrink: 0,
              color: "white",
              border: "none",
              borderRadius: 10,
              padding: "8px 14px",
              fontSize: 11,
              fontWeight: 900,
              cursor: "pointer",
              letterSpacing: "0.04em",
              boxShadow: "0 4px 12px rgba(249,115,22,0.4)",
              transition: "transform 0.15s ease, box-shadow 0.15s ease",
              display: "inline-flex",
              alignItems: "center",
              gap: 5,
              whiteSpace: "nowrap",
            }}
            className="bg-gradient-to-br from-orange-500 to-orange-700"
            onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.05)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
          >
            Book Spot <ExternalLink size={11} />
          </button>
        </div>
      </div>

      <style>{`
        @keyframes bounceSlow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
        .animate-bounce-slow {
          animation: bounceSlow 3s ease-in-out infinite;
        }
      `}</style>
    </>
  );
}