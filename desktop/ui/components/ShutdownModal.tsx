"use client";

import { AnimatePresence, motion } from "framer-motion";
import React, { useCallback, useEffect, useState } from "react";

export type ShutdownAction = "turnoff" | "restart" | "standby";

interface ShutdownModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAction: (action: ShutdownAction) => void;
}

interface OptionButtonProps {
  icon: React.ReactNode;
  label: string;
  color: string;
  glowColor: string;
  onClick: () => void;
}

const OptionButton: React.FC<OptionButtonProps> = ({ icon, label, color, glowColor, onClick }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "8px",
        cursor: "pointer",
        userSelect: "none",
      }}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Icon circle */}
      <div
        style={{
          width: "64px",
          height: "64px",
          borderRadius: "50%",
          background: hovered
            ? `radial-gradient(circle at 35% 35%, ${lighten(color)}, ${color})`
            : `radial-gradient(circle at 35% 35%, ${lighten(color, 0.3)}, ${darken(color)})`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: `2px solid ${darken(color, 0.3)}`,
          boxShadow: hovered
            ? `0 0 18px 4px ${glowColor}, inset 0 1px 3px rgba(255,255,255,0.4)`
            : `inset 0 1px 3px rgba(255,255,255,0.25), 0 2px 6px rgba(0,0,0,0.4)`,
          transition: "box-shadow 180ms ease, background 180ms ease, filter 180ms ease",
          filter: hovered ? "brightness(1.15)" : "brightness(1)",
        }}
      >
        {icon}
      </div>
      {/* Label */}
      <span
        style={{
          fontSize: "11px",
          fontFamily: "Tahoma, Arial, sans-serif",
          color: hovered ? "#003087" : "#222",
          fontWeight: hovered ? "bold" : "normal",
          transition: "color 150ms ease, font-weight 150ms ease",
          textDecoration: hovered ? "underline" : "none",
        }}
      >
        {label}
      </span>
    </div>
  );
};

// Tiny colour helpers (hex only, 6-char)
function lighten(hex: string, amount = 0.5): string {
  const n = parseInt(hex.replace("#", ""), 16);
  const r = Math.min(255, ((n >> 16) & 0xff) + Math.round(255 * amount));
  const g = Math.min(255, ((n >> 8) & 0xff) + Math.round(255 * amount));
  const b = Math.min(255, (n & 0xff) + Math.round(255 * amount));
  return `rgb(${r},${g},${b})`;
}
function darken(hex: string, amount = 0.2): string {
  const n = parseInt(hex.replace("#", ""), 16);
  const r = Math.max(0, ((n >> 16) & 0xff) - Math.round(255 * amount));
  const g = Math.max(0, ((n >> 8) & 0xff) - Math.round(255 * amount));
  const b = Math.max(0, (n & 0xff) - Math.round(255 * amount));
  return `rgb(${r},${g},${b})`;
}

export const ShutdownModal: React.FC<ShutdownModalProps> = ({ isOpen, onClose, onAction }) => {
  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  const handleAction = useCallback(
    (action: ShutdownAction) => {
      onClose();
      onAction(action);
    },
    [onClose, onAction],
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* ── Overlay ─────────────────────────────────────────────────── */}
          <motion.div
            key="shutdown-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.55)",
              backdropFilter: "blur(2px)",
              WebkitBackdropFilter: "blur(2px)",
              zIndex: 99998,
            }}
          />

          {/* ── Modal ───────────────────────────────────────────────────── */}
          <motion.div
            key="shutdown-modal"
            initial={{ opacity: 0, scale: 0.93, y: -12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.93, y: -8 }}
            transition={{ type: "spring", stiffness: 380, damping: 28, mass: 0.8 }}
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              zIndex: 99999,
              width: "420px",
              fontFamily: "Tahoma, Arial, sans-serif",
              /* XP window chrome */
              borderRadius: "6px 6px 4px 4px",
              border: "2px solid #0831d9",
              boxShadow:
                "0 0 0 1px #fff inset, 4px 4px 20px rgba(0,0,0,0.7), 0 2px 4px rgba(0,0,0,0.5)",
              overflow: "hidden",
            }}
          >
            {/* ── Title bar ───────────────────────────────────────────── */}
            <div
              style={{
                background:
                  "linear-gradient(180deg, #2c6fdb 0%, #1a4fc4 8%, #1a4fc4 92%, #1040b8 100%)",
                padding: "5px 8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "6px",
                minHeight: "28px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                {/* XP window icon */}
                <span style={{ fontSize: "14px" }}>💻</span>
                <span
                  style={{
                    color: "#fff",
                    fontSize: "12px",
                    fontWeight: "bold",
                    textShadow: "1px 1px 1px rgba(0,0,0,0.5)",
                    letterSpacing: "0.3px",
                  }}
                >
                  Turn off computer
                </span>
              </div>

              {/* Close button */}
              <XPCloseButton onClick={onClose} />
            </div>

            {/* ── Body ────────────────────────────────────────────────── */}
            <div
              style={{
                background: "linear-gradient(180deg, #dce8f8 0%, #c8dcf5 100%)",
                padding: "28px 20px 20px",
              }}
            >
              {/* Top accent strip */}
              <div
                style={{
                  height: "3px",
                  background:
                    "linear-gradient(90deg, transparent, #4a90d9 30%, #1a5cc4 50%, #4a90d9 70%, transparent)",
                  borderRadius: "2px",
                  marginBottom: "24px",
                  opacity: 0.7,
                }}
              />

              {/* Options row */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: "32px",
                  marginBottom: "28px",
                }}
              >
                <OptionButton
                  icon={<StandByIcon />}
                  label="Stand By"
                  color="#d4a017"
                  glowColor="rgba(255,190,30,0.6)"
                  onClick={() => handleAction("standby")}
                />
                <OptionButton
                  icon={<TurnOffIcon />}
                  label="Turn Off"
                  color="#c0392b"
                  glowColor="rgba(220,50,50,0.6)"
                  onClick={() => handleAction("turnoff")}
                />
                <OptionButton
                  icon={<RestartIcon />}
                  label="Restart"
                  color="#27ae60"
                  glowColor="rgba(50,200,90,0.6)"
                  onClick={() => handleAction("restart")}
                />
              </div>

              {/* Bottom divider */}
              <div
                style={{
                  height: "1px",
                  background: "rgba(0,0,100,0.15)",
                  marginBottom: "12px",
                }}
              />

              {/* Cancel row */}
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <XPButton onClick={onClose} label="Cancel" />
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

/* ── Sub-components ─────────────────────────────────────────────────────── */

const XPCloseButton: React.FC<{ onClick: () => void }> = ({ onClick }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: "21px",
        height: "21px",
        borderRadius: "3px",
        border: "1px solid rgba(0,0,0,0.3)",
        background: hovered
          ? "linear-gradient(180deg, #f0514e 0%, #d42020 50%, #bc1010 100%)"
          : "linear-gradient(180deg, #e8625e 0%, #c23030 50%, #a81414 100%)",
        color: "#fff",
        fontSize: "11px",
        fontWeight: "bold",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        boxShadow: "inset 0 1px 1px rgba(255,255,255,0.3)",
        transition: "background 120ms ease",
      }}
    >
      ✕
    </button>
  );
};

const XPButton: React.FC<{ onClick: () => void; label: string }> = ({ onClick, label }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: "3px 18px",
        fontSize: "11px",
        fontFamily: "Tahoma, Arial, sans-serif",
        border: "1px solid #7f9db9",
        borderRadius: "3px",
        cursor: "pointer",
        background: hovered
          ? "linear-gradient(180deg, #dce8f8 0%, #b8cfe8 100%)"
          : "linear-gradient(180deg, #f4f8fe 0%, #dce8f8 50%, #c8d8f0 100%)",
        color: "#000",
        boxShadow: hovered
          ? "inset 0 0 0 1px #316ac5"
          : "inset 0 1px 0 rgba(255,255,255,0.8)",
        outline: hovered ? "1px dotted #000" : "none",
        outlineOffset: "-3px",
        transition: "background 120ms ease, box-shadow 120ms ease",
      }}
    >
      {label}
    </button>
  );
};

/* ── SVG Icons ──────────────────────────────────────────────────────────── */

const StandByIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
    <circle cx="16" cy="16" r="11" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" />
    <path
      d="M16 8 L16 16"
      stroke="rgba(255,255,255,0.9)"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
    <path
      d="M10 11 A9 9 0 1 0 22 11"
      stroke="rgba(255,255,255,0.85)"
      strokeWidth="2.2"
      strokeLinecap="round"
      fill="none"
    />
  </svg>
);

const TurnOffIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
    <circle cx="16" cy="16" r="9" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" />
    <path
      d="M16 7 L16 17"
      stroke="rgba(255,255,255,0.95)"
      strokeWidth="2.8"
      strokeLinecap="round"
    />
    <path
      d="M10.5 10.5 A9 9 0 1 0 21.5 10.5"
      stroke="rgba(255,255,255,0.9)"
      strokeWidth="2.5"
      strokeLinecap="round"
      fill="none"
    />
  </svg>
);

const RestartIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
    <path
      d="M22 16 A7 7 0 1 1 18 9.8"
      stroke="rgba(255,255,255,0.9)"
      strokeWidth="2.5"
      strokeLinecap="round"
      fill="none"
    />
    <polygon points="17,7 22,10 17,13" fill="rgba(255,255,255,0.9)" />
  </svg>
);
