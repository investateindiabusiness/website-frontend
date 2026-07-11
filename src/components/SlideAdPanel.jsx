"use client";

import React, { useState, useEffect } from "react";
import { X, ChevronRight, Megaphone, ExternalLink } from "lucide-react";
import AdBanner from "@/components/AdBanner";

/**
 * SlideAdPanel
 *
 * A fixed right-side ad panel that:
 * - Opens by default on page load (drops down from the right edge)
 * - Has a clear X close button
 * - Stays flush to the right side of the viewport
 * - Does NOT overlap hero content (positioned at top right, clear of text)
 * - Has a small re-open tab when closed
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

  return (
    <>
      {/* ─── Re-open tab (visible only after user has closed the panel) ─── */}
      {hasEverClosed && !isOpen && (
        <button
          onClick={handleReopen}
          aria-label="Open advertisement"
          style={{
            position: "fixed",
            top: topOffset,
            right: 0,
            zIndex: 50,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
            width: 36,
            minHeight: 120,
            borderRadius: "12px 0 0 12px",
            border: "none",
            cursor: "pointer",
            padding: "14px 0",
            boxShadow: "-4px 4px 20px rgba(0,0,0,0.3)",
            transition: "transform 0.2s ease, box-shadow 0.2s ease",
          }}
          className="bg-gradient-to-b from-[#0b264f] to-[#1a4b8c]"
          onMouseEnter={(e) => { e.currentTarget.style.transform = "translateX(-3px)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = "translateX(0)"; }}
        >
          <Megaphone
            size={14}
            style={{ color: "rgba(255,255,255,0.8)" }}
          />
          <span
            style={{
              writingMode: "vertical-rl",
              fontSize: 9,
              fontWeight: 900,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.7)",
              userSelect: "none",
            }}
          >
            Sponsored
          </span>
          <ChevronRight
            size={14}
            style={{
              color: "rgba(255,255,255,0.7)",
              transform: "rotate(180deg)",
            }}
          />
        </button>
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
        @keyframes adPanelPulse {
          0%   { box-shadow: 0 0 0 0 rgba(249,115,22,0.6); }
          60%  { box-shadow: 0 0 0 8px rgba(249,115,22,0); }
          100% { box-shadow: 0 0 0 0 rgba(249,115,22,0); }
        }
      `}</style>
    </>
  );
}