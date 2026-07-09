"use client";

import React, { useState } from "react";
import { X, ChevronLeft } from "lucide-react";
import AdBanner from "@/components/AdBanner";

export default function SlideAdPanel({ zoneId = "zone5", forceRole = "service-provider", loginPath = "/login" }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div
        style={{
          position: "fixed",
          top: "100px",
          right: 0,
          zIndex: 50,
          display: "flex",
          alignItems: "flex-start",
          transform: `translateX(${isOpen ? "0%" : "calc(100% - 48px)"})`,
          transition: "transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
          willChange: "transform",
          pointerEvents: "none",
        }}
      >
        <button
          onClick={() => setIsOpen((o) => !o)}
          aria-label={isOpen ? "Close advertisement" : "Open advertisement"}
          style={{
            flexShrink: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            cursor: "pointer",
            border: "none",
            width: 48,
            minHeight: 160,
            borderRadius: "14px 0 0 14px",
            boxShadow: "-6px 4px 24px rgba(0,0,0,0.35)",
            position: "relative",
            padding: "16px 0",
            pointerEvents: "auto",
          }}
          className="bg-gradient-to-br from-orange-500 to-orange-800"
        >
          {!isOpen && (
            <span
              style={{
                position: "absolute",
                left: -7,
                top: "50%",
                transform: "translateY(-50%)",
                width: 14,
                height: 14,
                borderRadius: "50%",
                background: "white",
                animation: "adPulse 1.6s ease-in-out infinite",
              }}
            />
          )}
          <span
            style={{
              display: "inline-flex",
              transition: "transform 0.4s ease",
              transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
              color: "white",
            }}
          >
            <ChevronLeft size={26} strokeWidth={3.5} />
          </span>
          <span
            style={{

              writingMode: "vertical-rl",
              fontSize: 10,
              fontWeight: 900,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.85)",
              userSelect: "none",
            }}
          >
            {isOpen ? "Close" : "Ad"}
          </span>
        </button>

        <div
          style={{
            width: 440,
            background: "white",
            borderRadius: "0 0 0 18px",
            boxShadow: "-8px 8px 40px rgba(0,0,0,0.28)",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            pointerEvents: "auto",
          }}
        >
          <div
            style={{
              padding: "10px 16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
            className="bg-gradient-to-r from-blue-950 to-blue-800"
          >
            <span
              style={{
                fontSize: 9,
                fontWeight: 900,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.55)",
              }}
            >
              Sponsored - Advertisement
            </span>
            <button
              onClick={() => setIsOpen(false)}
              aria-label="Close"
              style={{
                width: 28,
                height: 28,
                borderRadius: "50%",
                background: "rgba(255,255,255,0.12)",
                border: "1px solid rgba(255,255,255,0.2)",
                color: "white",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <X size={14} strokeWidth={2.5} />
            </button>
          </div>
          <div style={{ width: "100%", display: "flex", flexDirection: "column" }}>
            <AdBanner zoneId={zoneId} variant="spotlight" forceRole={forceRole} />
          </div>

          {/* Always-visible footer CTA */}
          <div
            style={{
              padding: "14px 20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
            }}
            className="bg-gradient-to-r from-blue-950 to-blue-800"
          >
            <div>
              <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", margin: 0 }}>
                Want this spot?
              </p>
              <p style={{ color: "white", fontSize: 12, fontWeight: 800, margin: 0, marginTop: 2 }}>
                Advertise your project here
              </p>
            </div>
            <button
              style={{
                flexShrink: 0,
                color: "white",
                border: "none",
                borderRadius: 10,
                padding: "9px 18px",
                fontSize: 12,
                fontWeight: 900,
                cursor: "pointer",
                letterSpacing: "0.04em",
                boxShadow: "0 4px 12px rgba(249,115,22,0.4)",
                transition: "transform 0.15s ease, box-shadow 0.15s ease",
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
              }}
              className="bg-gradient-to-br from-orange-500 to-orange-700"
              onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.05)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
            >
              Add Yours &#8594;
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes adPulse {
          0%   { box-shadow: 0 0 0 0 rgba(255,255,255,0.75); }
          60%  { box-shadow: 0 0 0 10px rgba(255,255,255,0); }
          100% { box-shadow: 0 0 0 0 rgba(255,255,255,0); }
        }
      `}</style>
    </>
  );
}