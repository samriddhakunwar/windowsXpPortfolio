"use client";

import { AnimatePresence, motion } from "framer-motion";
import React, { useCallback, useEffect, useRef, useState } from "react";

export type ShutdownAction = "turnoff" | "restart" | "standby";

interface ShutdownModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAction: (action: ShutdownAction) => void;
}

// Tooltip content per button
const TIPS: Record<string, { title: string; desc: string }> = {
  standby: {
    title: "Stand By",
    desc: "Places your computer in a low-power state so you can quickly resume working.",
  },
  hibernate: {
    title: "Hibernate",
    desc: "Saves your session to disk and powers off. Resumes exactly where you left off.",
  },
  turnoff: {
    title: "Turn Off",
    desc: "Shuts down Windows so that you can safely turn off the power.",
  },
  restart: {
    title: "Restart",
    desc: "Closes all programs, restarts Windows, and then starts Windows again.",
  },
};

// Authentic Windows XP 4-colour flag logo
const WinLogo = () => (
  <svg width="20" height="20" viewBox="0 0 38 38" aria-hidden>
    <path d="M0 5.6 L17 3.2 L17 18.2 L0 18.2 Z" fill="#FF6B2B" />
    <path d="M18.4 3 L38 0 L38 18.2 L18.4 18.2 Z" fill="#8DC63F" />
    <path d="M0 19.8 L17 19.8 L17 34.8 L0 32.4 Z" fill="#2BAAE1" />
    <path d="M18.4 19.8 L38 19.8 L38 38 L18.4 35.6 Z" fill="#FFCF01" />
  </svg>
);



// ── XP Cancel push-button ────────────────────────────────────────────────────
const XPButton: React.FC<{ label: string; onClick: () => void }> = ({ label, onClick }) => {
  const [h, setH] = useState(false);
  const [p, setP] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => { setH(false); setP(false); }}
      onMouseDown={() => setP(true)}
      onMouseUp={() => setP(false)}
      style={{
        padding: "1px 12px",
        fontSize: "11px",
        fontFamily: "Tahoma, Arial, sans-serif",
        border: p
          ? "1px solid #2050a0"
          : h
          ? "1px solid #316ac5"
          : "1px solid #7f9db9",
        borderRadius: "3px",
        cursor: "pointer",
        background: p
          ? "linear-gradient(180deg,#b8cce8,#c8d8f0)"
          : h
          ? "linear-gradient(180deg,#dce8f8,#b8cfe8)"
          : "linear-gradient(180deg,#f0f5fc 0%,#dce8f8 50%,#c8d8f0 100%)",
        color: "#000",
        outline: h ? "1px dotted #000" : "none",
        outlineOffset: "-3px",
        transform: p ? "translateY(1px)" : "none",
        minWidth: "60px",
        height: "21px",
        boxSizing: "border-box",
      }}
    >
      {label}
    </button>
  );
};

// ── Compact XP icon button (PNG-based) ──────────────────────────────────────
interface OrbBtnProps {
  id: string;
  label: string;
  shortcutChar: string;
  imgSrc: string;
  hovered: boolean;
  pressed: boolean;
  disabled?: boolean;
  onEnter: () => void;
  onLeave: () => void;
  onDown: () => void;
  onUp: () => void;
}

const OrbButton: React.FC<OrbBtnProps> = ({
  label, shortcutChar, imgSrc,
  hovered, pressed, disabled, onEnter, onLeave, onDown, onUp,
}) => {
  const idx = label.toLowerCase().indexOf(shortcutChar.toLowerCase());
  const labelEl =
    idx >= 0 ? (
      <>
        {label.slice(0, idx)}
        <u style={{ textDecorationColor: "inherit" }}>{label[idx]}</u>
        {label.slice(idx + 1)}
      </>
    ) : label;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "4px",
        cursor: disabled ? "not-allowed" : "pointer",
        userSelect: "none",
        WebkitUserSelect: "none",
        width: "64px",
        pointerEvents: disabled ? "none" : "auto",
        opacity: disabled ? 0.45 : 1,
        filter: disabled ? "grayscale(100%)" : "none",
        transition: "opacity 0.15s, filter 0.15s",
      }}
      onMouseEnter={disabled ? undefined : onEnter}
      onMouseLeave={disabled ? undefined : onLeave}
      onMouseDown={disabled ? undefined : onDown}
      onMouseUp={disabled ? undefined : onUp}
    >
      {/* PNG icon */}
      <img
        src={imgSrc}
        alt={label}
        width={40}
        height={40}
        draggable={false}
        style={{
          borderRadius: "8px",
          display: "block",
          opacity: disabled ? 1 : pressed ? 0.75 : hovered ? 1 : 0.92,
          transform: disabled ? "none" : pressed ? "scale(0.93)" : hovered ? "scale(1.06)" : "scale(1)",
          transition: "transform 80ms ease, opacity 80ms ease",
          boxShadow: disabled ? "none" : hovered
            ? "0 2px 6px rgba(0,0,0,0.55)"
            : "0 1px 3px rgba(0,0,0,0.4)",
          flexShrink: 0,
        }}
      />

      {/* Label */}
      <span
        style={{
          fontSize: "10px",
          fontFamily: "Tahoma, Arial, sans-serif",
          color: "#fff",
          fontWeight: "normal",
          textShadow: "0 1px 1px rgba(0,0,0,0.8)",
          textAlign: "center",
          lineHeight: 1.2,
          whiteSpace: "nowrap",
        }}
      >
        {labelEl}
      </span>
    </div>
  );
};

// ── Main component ───────────────────────────────────────────────────────────
export const ShutdownModal: React.FC<ShutdownModalProps> = ({ isOpen, onClose, onAction }) => {
  const [hovered, setHovered] = useState<string | null>(null);
  const [pressed, setPressed] = useState<string | null>(null);
  const [shift, setShift] = useState(false);
  const [tipVisible, setTipVisible] = useState(false);
  const tipTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Keyboard shortcuts
  useEffect(() => {
    if (!isOpen) return;
    const down = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Shift") setShift(true);
      const k = e.key.toLowerCase();
      if (k === "c") onClose();
      if (k === "r") { onClose(); onAction("restart"); }
    };
    const up = (e: KeyboardEvent) => { if (e.key === "Shift") setShift(false); };
    document.addEventListener("keydown", down);
    document.addEventListener("keyup", up);
    return () => {
      document.removeEventListener("keydown", down);
      document.removeEventListener("keyup", up);
      setShift(false);
    };
  }, [isOpen, shift, onClose, onAction]);

  useEffect(() => {
    if (!isOpen) {
      setHovered(null);
      setTipVisible(false);
      setPressed(null);
    }
  }, [isOpen]);

  const handleEnter = (id: string) => {
    setHovered(id);
    setTipVisible(false);
    if (tipTimer.current) clearTimeout(tipTimer.current);
    tipTimer.current = setTimeout(() => setTipVisible(true), 400);
  };
  const handleLeave = useCallback(() => {
    setHovered(null);
    setTipVisible(false);
    if (tipTimer.current) clearTimeout(tipTimer.current);
  }, []);

  const act = useCallback(
    (action: ShutdownAction) => { onClose(); onAction(action); },
    [onClose, onAction],
  );

  const standbyId = shift ? "hibernate" : "standby";
  const tip = hovered ? TIPS[hovered] : null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 99998,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* Backdrop */}
          <motion.div
            key="sd-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={onClose}
            style={{
              position: "absolute", inset: 0,
              background: "rgba(0,0,0,0.5)",
            }}
          />

          {/* ── Dialog window ──────────────────────────────────────────────── */}
          <motion.div
            key="sd-dialog"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.12, ease: "easeOut" }}
            style={{
              position: "relative",
              zIndex: 1,
              width: "320px",
              fontFamily: "Tahoma, Arial, sans-serif",
              /* XP authentic 3-layer bevel border */
              border: "2px solid #0a246a",
              outline: "1px solid #5a7fcd",
              outlineOffset: "-3px",
              borderRadius: "6px 6px 4px 4px",
              /* Blue outer glow (XP dialog shadow) + dark drop shadow underneath */
              boxShadow:
                "0 0 0 1px #8aaee8, " +
                "0 0 8px 2px rgba(90,126,220,0.55), " +
                "3px 6px 18px rgba(0,0,0,0.60)",
              overflow: "hidden",
            }}
          >
            {/* ── Title bar ──────────────────────────────────────────────── */}
            <div
              style={{
                /* XP Luna Blue title bar: deep navy base with a glossy highlight */
                background:
                  "linear-gradient(180deg, #1a5cbf 0%, #0044bb 18%, #003399 40%, #002a80 100%)",
                padding: "0 4px 0 5px",
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-start",
                height: "36px",
                userSelect: "none",
                boxSizing: "border-box",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* Glossy top-half highlight strip */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: "50%",
                  background:
                    "linear-gradient(180deg, rgba(255,255,255,0.28) 0%, rgba(255,255,255,0.07) 100%)",
                  pointerEvents: "none",
                }}
              />
              <div style={{ display: "flex", alignItems: "center", gap: "5px", position: "relative" }}>
                {/* XP window icon — logo left of title, authentic XP chrome */}
                <img
                  src="/img/logo-small.png"
                  alt=""
                  width={18}
                  height={18}
                  draggable={false}
                  style={{ display: "block", pointerEvents: "none", flexShrink: 0 }}
                />
                <span
                  style={{
                    color: "#fff",
                    fontSize: "11px",
                    fontWeight: "bold",
                    textShadow: "1px 1px 2px rgba(0,0,0,0.7)",
                    letterSpacing: "0.1px",
                  }}
                >
                  Turn off computer
                </span>
              </div>
            </div>

            {/* ── Body — authentic XP blue ────────────────────────────────── */}
            <div
              style={{
                /*
                 * Matches XPShutdownScreen body exactly:
                 * radial-gradient from upper-left (bright highlight) fading into
                 * mid-tone #6E8FE3, with a darker lower-right region for XP lighting.
                 * Layered backgrounds simulate the body-lighting vignette.
                 */
                background:
                  "radial-gradient(ellipse at 5% 5%, #a8c3f7 0%, #91b1ef 4%, #7698e6 10%, #639ae3 18%, #5a8fe0 30%, #5a7edc 50%, #4e70cc 70%, #4060be 100%)",
                position: "relative",
              }}
            >
              {/* Body lighting overlay: brighten upper-left, darken lower-right */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "radial-gradient(ellipse at 10% 10%, rgba(255,255,255,0.18) 0%, transparent 55%), " +
                    "radial-gradient(ellipse at 90% 90%, rgba(0,0,30,0.22) 0%, transparent 55%)",
                  pointerEvents: "none",
                  zIndex: 0,
                }}
              />
              {/* Subtle separator line */}
              <div
                style={{
                  height: "1px",
                  margin: "0 0 0",
                  background:
                    "linear-gradient(90deg,rgba(255,255,255,0.05),rgba(255,255,255,0.32) 20%,rgba(255,255,255,0.32) 80%,rgba(255,255,255,0.05))",
                  position: "relative",
                  zIndex: 1,
                }}
              />

              {/* ── Three orb buttons ──────────────────────────────────────── */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: "12px",
                  padding: "10px 12px 6px",
                  position: "relative",
                  zIndex: 1,
                }}
              >
                {/* Stand By — disabled */}
                <OrbButton
                  id={standbyId}
                  label={shift ? "Hibernate" : "Stand By"}
                  shortcutChar={shift ? "H" : "S"}
                  imgSrc="/assets/logoff.png"
                  hovered={hovered === standbyId}
                  pressed={pressed === "standby"}
                  disabled={true}
                  onEnter={() => handleEnter(standbyId)}
                  onLeave={handleLeave}
                  onDown={() => setPressed("standby")}
                  onUp={() => { setPressed(null); act("standby"); }}
                />

                {/* Turn Off — disabled */}
                <OrbButton
                  id="turnoff"
                  label="Turn Off"
                  shortcutChar="U"
                  imgSrc="/assets/shutdown.png"
                  hovered={hovered === "turnoff"}
                  pressed={pressed === "turnoff"}
                  disabled={true}
                  onEnter={() => handleEnter("turnoff")}
                  onLeave={handleLeave}
                  onDown={() => setPressed("turnoff")}
                  onUp={() => { setPressed(null); act("turnoff"); }}
                />

                {/* Restart */}
                <OrbButton
                  id="restart"
                  label="Restart"
                  shortcutChar="R"
                  imgSrc="/img/restart.png"
                  hovered={hovered === "restart"}
                  pressed={pressed === "restart"}
                  onEnter={() => handleEnter("restart")}
                  onLeave={handleLeave}
                  onDown={() => setPressed("restart")}
                  onUp={() => { setPressed(null); act("restart"); }}
                />
              </div>

              {/* ── Tooltip area ─────────────────────────────────────────── */}
              <div style={{ minHeight: "38px", padding: "2px 12px 2px", position: "relative", zIndex: 1 }}>
                <AnimatePresence mode="wait">
                  {hovered && tipVisible && tip && (
                    <motion.div
                      key={hovered}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.18 }}
                    >
                      <div
                        style={{
                          color: "#fff",
                          fontSize: "10px",
                          fontWeight: "bold",
                          marginBottom: "1px",
                          textShadow: "0 1px 1px rgba(0,0,0,0.6)",
                        }}
                      >
                        {tip.title}
                      </div>
                      <div
                        style={{
                          color: "rgba(255,255,255,0.85)",
                          fontSize: "10px",
                          lineHeight: "1.3",
                          textShadow: "0 1px 1px rgba(0,0,0,0.5)",
                        }}
                      >
                        {tip.desc}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* ── Footer bar — XP gradient matching XPShutdownScreen ─────── */}
              <div
                style={{
                  background: "linear-gradient(90deg, #3833ac, #00309c)",
                  /* Thin top highlight line — matches XP's footer stripe */
                  borderTop: "1px solid rgba(100,140,220,0.55)",
                  padding: "5px 8px 6px",
                  display: "flex",
                  justifyContent: "flex-end",
                  alignItems: "center",
                  position: "relative",
                  zIndex: 1,
                }}
              >
                <XPButton label="Cancel" onClick={onClose} />
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
