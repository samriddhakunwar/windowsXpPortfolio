"use client";

import { useEffect, useState } from "react";

interface XPShutdownScreenProps {
  visible: boolean;
  mode: "turnoff" | "restart";
}

// Authentic 4-colour Windows flag — matches the XP logo proportions
const WinFlag = () => (
  <svg width="72" height="68" viewBox="0 0 100 95" aria-hidden>
    {/* Red (top-left) */}
    <path d="M0 8 L46 1 L46 45 L0 45 Z"    fill="#E8420A" />
    {/* Green (top-right) */}
    <path d="M50 0 L100 -6 L100 45 L50 45 Z" fill="#78B82A" />
    {/* Blue (bottom-left) */}
    <path d="M0 49 L46 49 L46 93 L0 86 Z"   fill="#00ADEF" />
    {/* Yellow (bottom-right) */}
    <path d="M50 49 L100 49 L100 101 L50 95 Z" fill="#FBBC09" />
  </svg>
);

export default function XPShutdownScreen({ visible, mode }: XPShutdownScreenProps) {
  const [cursorHidden, setCursorHidden] = useState(false);

  useEffect(() => {
    if (!visible) { setCursorHidden(false); return; }
    const t = setTimeout(() => setCursorHidden(true), 1500);
    return () => clearTimeout(t);
  }, [visible]);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 999998,
        // Authentic XP shutdown blue — flat royal blue with radial glow
        background:
          "radial-gradient(ellipse 70% 60% at 30% 30%, #5A88D8 0%, #4070C8 30%, #3860BE 60%, #3055B0 100%)",
        opacity: visible ? 1 : 0,
        transition: "opacity 1.1s ease",
        pointerEvents: visible ? "all" : "none",
        cursor: cursorHidden ? "none" : "default",
        fontFamily: "Tahoma, Arial, sans-serif",
        overflow: "hidden",
        userSelect: "none",
      }}
    >
      {/* ── Thin white/silver highlight line at very top ─────────────────── */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "2px",
          background:
            "linear-gradient(90deg, rgba(255,255,255,0.0) 0%, rgba(255,255,255,0.6) 20%, rgba(255,255,255,0.7) 50%, rgba(255,255,255,0.6) 80%, rgba(255,255,255,0.0) 100%)",
        }}
      />

      {/* ── Thin orange line near bottom (authentic XP detail) ───────────── */}
      <div
        style={{
          position: "absolute",
          bottom: "42px",
          left: 0,
          right: 0,
          height: "2px",
          background:
            "linear-gradient(90deg, rgba(220,100,0,0.0) 0%, rgba(220,100,0,0.9) 10%, rgba(220,100,0,0.9) 90%, rgba(220,100,0,0.0) 100%)",
        }}
      />

      {/* ── Centred content area ─────────────────────────────────────────── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "18px",
        }}
      >
        {/* ── Windows XP logo ─────────────────────────────────────────────── */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <WinFlag />

          {/* Wordmark: "Microsoft" small + "Windows" large + "xp" orange italic */}
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {/* "Microsoft" in small caps above */}
            <span
              style={{
                color: "rgba(255,255,255,0.85)",
                fontSize: "13px",
                fontWeight: "normal",
                letterSpacing: "0.3px",
                lineHeight: 1,
                marginBottom: "2px",
              }}
            >
              Microsoft
            </span>

            {/* "Windows" + superscript "xp" on the same baseline */}
            <div style={{ display: "flex", alignItems: "baseline", gap: "5px" }}>
              <span
                style={{
                  color: "#ffffff",
                  fontSize: "40px",
                  fontWeight: "bold",
                  letterSpacing: "-0.5px",
                  lineHeight: 1,
                }}
              >
                Windows
              </span>
              <span
                style={{
                  color: "#FF9C00",
                  fontSize: "22px",
                  fontStyle: "italic",
                  fontWeight: "bold",
                  lineHeight: 1,
                  marginBottom: "4px",
                }}
              >
                xp
              </span>
            </div>
          </div>
        </div>

        {/* ── "Windows is shutting down..." ────────────────────────────────── */}
        <p
          style={{
            color: "#ffffff",
            fontSize: "16px",
            fontWeight: "normal",
            margin: 0,
            letterSpacing: "0.2px",
            opacity: 0.95,
          }}
        >
          {mode === "restart"
            ? "Windows is restarting\u2026"
            : "Windows is shutting down\u2026"}
        </p>
      </div>
    </div>
  );
}
