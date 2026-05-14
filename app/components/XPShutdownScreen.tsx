"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

interface XPShutdownScreenProps {
  visible: boolean;
  mode: "turnoff" | "restart";
}

export default function XPShutdownScreen({ visible, mode }: XPShutdownScreenProps) {
  const [cursorHidden, setCursorHidden] = useState(false);
  const [dotFrame, setDotFrame] = useState(0);
  const dotTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  // Hide cursor after 1.5 s (authentic XP behaviour)
  useEffect(() => {
    if (!visible) { setCursorHidden(false); return; }
    const t = setTimeout(() => setCursorHidden(true), 1500);
    return () => clearTimeout(t);
  }, [visible]);

  // Animate loading dots while visible
  useEffect(() => {
    if (visible) {
      dotTimer.current = setInterval(() => {
        setDotFrame(f => (f + 1) % 4);
      }, 450);
    } else {
      if (dotTimer.current) clearInterval(dotTimer.current);
      setDotFrame(0);
    }
    return () => { if (dotTimer.current) clearInterval(dotTimer.current); };
  }, [visible]);

  const statusText =
    mode === "restart"
      ? "Windows is restarting"
      : "Windows is shutting down";

  // Trailing dots cycle: "", ".", "..", "..."
  const dots = ".".repeat(dotFrame);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 999998,
        opacity: visible ? 1 : 0,
        transition: "opacity 1.1s ease",
        pointerEvents: visible ? "all" : "none",
        cursor: cursorHidden ? "none" : "default",
        fontFamily: "Tahoma, Arial, sans-serif",
        userSelect: "none",
        overflow: "hidden",
        // 5-row grid — mirrors the welcome / login page exactly
        display: "grid",
        gridTemplateRows: "8% 2px 1fr 2px 10%",
      }}
    >
      {/* ── Header bar ─────────────────────────────────────────────────────── */}
      <div style={{ background: "#00309c" }} />

      {/* ── Header stripe ──────────────────────────────────────────────────── */}
      <div
        style={{
          background:
            "linear-gradient(45deg, #466dcd, #c7ddff, #b0c9f7, #5a7edc)",
        }}
      />

      {/* ── Center body ────────────────────────────────────────────────────── */}
      <div
        style={{
          background:
            "radial-gradient(circle at 5% 5%, #91b1ef 0, #7698e6 6%, #5a7edc 12%)",
          position: "relative",
        }}
      >
        {/* Inner content block — positioned to match authentic XP shutdown coordinates */}
        <div
          style={{
            position: "absolute",
            left: "56%",
            top: "53%",
            transform: "translate(-50%, -50%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "20px",
          }}
        >
        {/* Logo image — same /img/logo.png used on the welcome/login screen */}
        <Image
          src="/img/logo.png"
          alt="Windows XP Logo"
          width={136}
          height={136}
          priority
          draggable={false}
          style={{ display: "block", userSelect: "none" }}
        />

        {/* Status text — italic bold white, matching welcome-text style */}
        <p
          style={{
            margin: 0,
            fontFamily: "Tahoma, Arial, sans-serif",
            fontStyle: "italic",
            fontWeight: "bold",
            fontSize: "20px",
            color: "#e6e6e6",
            textShadow: "2px 2px 4px rgba(0,0,0,0.4)",
            letterSpacing: "0.2px",
            // fixed-width container so the trailing dots don't shift layout
            minWidth: "280px",
            textAlign: "center",
          }}
        >
          {statusText}
          <span style={{ display: "inline-block", width: "1.5ch", textAlign: "left" }}>
            {dots}
          </span>
        </p>
        </div>
      </div>

      {/* ── Footer stripe ──────────────────────────────────────────────────── */}
      <div
        style={{
          background:
            "linear-gradient(45deg, #003399, #f99736, #c2814d, #00309c)",
        }}
      />

      {/* ── Footer bar ─────────────────────────────────────────────────────── */}
      <div style={{ background: "linear-gradient(90deg, #3833ac, #00309c)" }} />
    </div>
  );
}
