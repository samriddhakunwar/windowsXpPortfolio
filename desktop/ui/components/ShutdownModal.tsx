"use client";

import { AnimatePresence, motion } from "framer-motion";
import React, { useCallback, useEffect, useRef, useState } from "react";

export type ShutdownAction = "turnoff" | "restart" | "standby";

interface ShutdownModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAction: (action: ShutdownAction) => void;
}

// ── Bubble-tip content (mirrors AHK MyText1–4 variables) ──────────────────
const TIPS: Record<string, { title: string; desc: string }> = {
  standby: {
    title: "Stand By",
    desc: "Places your computer in a low-power state so you can quickly resume working.",
  },
  hibernate: {
    title: "Hibernate",
    desc: "Saves your session to disk and powers off. Resumes exactly from where you left off.",
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

// ── Windows XP 4-colour logo SVG ──────────────────────────────────────────
const WinLogo = () => (
  <svg width="38" height="38" viewBox="0 0 38 38" aria-hidden>
    <path d="M0 5.6 L17 3.2 L17 18.2 L0 18.2 Z" fill="#F25022" opacity="0.92" />
    <path d="M18.4 3 L38 0 L38 18.2 L18.4 18.2 Z" fill="#7FBA00" opacity="0.92" />
    <path d="M0 19.8 L17 19.8 L17 34.8 L0 32.4 Z" fill="#00A4EF" opacity="0.92" />
    <path d="M18.4 19.8 L38 19.8 L38 38 L18.4 35.6 Z" fill="#FFB900" opacity="0.92" />
  </svg>
);

// ── Colour helpers ─────────────────────────────────────────────────────────
function lighten(hex: string, t = 0.45): string {
  const n = parseInt(hex.replace("#", ""), 16);
  const r = Math.min(255, ((n >> 16) & 0xff) + Math.round(255 * t));
  const g = Math.min(255, ((n >> 8) & 0xff) + Math.round(255 * t));
  const b = Math.min(255, (n & 0xff) + Math.round(255 * t));
  return `rgb(${r},${g},${b})`;
}
function darken(hex: string, t = 0.22): string {
  const n = parseInt(hex.replace("#", ""), 16);
  const r = Math.max(0, ((n >> 16) & 0xff) - Math.round(255 * t));
  const g = Math.max(0, ((n >> 8) & 0xff) - Math.round(255 * t));
  const b = Math.max(0, (n & 0xff) - Math.round(255 * t));
  return `rgb(${r},${g},${b})`;
}

// ── OrbButton — 3 visual states: normal / hover / pressed (AHK Btn*Hvr/Dwn) ─
interface OrbBtnProps {
  id: string;
  label: string;
  shortcutChar: string;
  icon: React.ReactNode;
  hex: string;
  glow: string;
  hovered: boolean;
  pressed: boolean;
  onEnter: () => void;
  onLeave: () => void;
  onDown: () => void;
  onUp: () => void;
}

const OrbButton: React.FC<OrbBtnProps> = ({
  label, shortcutChar, icon, hex, glow,
  hovered, pressed, onEnter, onLeave, onDown, onUp,
}) => {
  // Three-state gradient — normal / hover / down  (mirrors AHK image swap)
  const bg = pressed
    ? `radial-gradient(circle at 42% 36%, ${lighten(hex, 0.18)}, ${darken(hex, 0.08)} 52%, ${darken(hex, 0.38)})`
    : hovered
    ? `radial-gradient(circle at 38% 32%, ${lighten(hex, 0.52)}, ${hex} 52%, ${darken(hex, 0.28)})`
    : `radial-gradient(circle at 38% 32%, ${lighten(hex, 0.36)}, ${darken(hex, 0.04)} 52%, ${darken(hex, 0.30)})`;

  // Underline the shortcut letter (AHK keyboard shortcuts)
  const idx = label.toLowerCase().indexOf(shortcutChar.toLowerCase());
  const labelEl =
    idx >= 0 ? (
      <>
        {label.slice(0, idx)}
        <u style={{ textDecorationColor: "inherit" }}>{label[idx]}</u>
        {label.slice(idx + 1)}
      </>
    ) : (
      label
    );

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "7px",
        cursor: "pointer",
        userSelect: "none",
        WebkitUserSelect: "none",
      }}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onMouseDown={onDown}
      onMouseUp={onUp}
    >
      {/* Orb — scales 0.93 on press matching AHK "down" image swap */}
      <div
        style={{
          width: "66px",
          height: "66px",
          borderRadius: "50%",
          background: bg,
          border: `2px solid ${darken(hex, 0.38)}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
          boxShadow: hovered
            ? `0 0 20px 5px ${glow}, inset 0 2px 5px rgba(255,255,255,0.42), 0 4px 10px rgba(0,0,0,0.6)`
            : `inset 0 2px 4px rgba(255,255,255,0.26), 0 3px 8px rgba(0,0,0,0.52)`,
          transform: pressed ? "scale(0.93)" : "scale(1)",
          transition: "transform 90ms ease, box-shadow 150ms ease, background 140ms ease",
          filter: hovered ? "brightness(1.10)" : "none",
        }}
      >
        {/* Gloss shine arc — top half highlight */}
        <div
          style={{
            position: "absolute",
            top: 0, left: 0, right: 0,
            height: "52%",
            borderRadius: "50% 50% 0 0 / 60% 60% 0 0",
            background:
              "linear-gradient(180deg,rgba(255,255,255,0.42) 0%,rgba(255,255,255,0.05) 100%)",
            pointerEvents: "none",
          }}
        />
        {icon}
      </div>

      {/* Label — bold on hover, matching AHK font changes */}
      <span
        style={{
          fontSize: "11px",
          fontFamily: "Tahoma, Arial, sans-serif",
          color: hovered ? "#fff" : "rgba(255,255,255,0.86)",
          fontWeight: hovered ? "bold" : "normal",
          textShadow: "0 1px 4px rgba(0,0,0,0.95)",
          transition: "color 130ms ease, font-weight 0ms",
          letterSpacing: "0.1px",
        }}
      >
        {labelEl}
      </span>
    </div>
  );
};

// ── XP title-bar close button ──────────────────────────────────────────────
const XPClose: React.FC<{ onClick: () => void }> = ({ onClick }) => {
  const [h, setH] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      aria-label="Close"
      style={{
        width: "21px", height: "21px", borderRadius: "3px",
        border: "1px solid rgba(0,0,0,0.38)",
        background: h
          ? "linear-gradient(180deg,#f26060 0%,#d42222 50%,#be1212 100%)"
          : "linear-gradient(180deg,#e86464 0%,#c23232 50%,#aa1616 100%)",
        color: "#fff", fontSize: "11px", fontWeight: "bold",
        cursor: "pointer", display: "flex", alignItems: "center",
        justifyContent: "center", flexShrink: 0,
        boxShadow: "inset 0 1px 1px rgba(255,255,255,0.3)",
        transition: "background 110ms ease",
        padding: 0,
      }}
    >
      ✕
    </button>
  );
};

// ── XP push-button (Cancel) ────────────────────────────────────────────────
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
        padding: "3px 22px",
        fontSize: "11px",
        fontFamily: "Tahoma, Arial, sans-serif",
        border: "1px solid #7f9db9",
        borderRadius: "3px",
        cursor: "pointer",
        background: p
          ? "linear-gradient(180deg,#b8ccec,#c8d8f0)"
          : h
          ? "linear-gradient(180deg,#dce8f8,#b8cfe8)"
          : "linear-gradient(180deg,#f4f8fe,#dce8f8 50%,#c8d8f0)",
        color: "#000",
        boxShadow: h ? "inset 0 0 0 1px #316ac5" : "inset 0 1px 0 rgba(255,255,255,0.85)",
        outline: h ? "1px dotted #000" : "none",
        outlineOffset: "-3px",
        transform: p ? "translateY(1px)" : "none",
        transition: "background 90ms ease, transform 55ms ease",
      }}
    >
      {label}
    </button>
  );
};

// ── SVG icons ──────────────────────────────────────────────────────────────
const IconStandBy = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
    <circle cx="16" cy="16" r="10" stroke="rgba(255,255,255,0.4)" strokeWidth="1.2" />
    <path d="M16 8 L16 16" stroke="rgba(255,255,255,0.94)" strokeWidth="2.6" strokeLinecap="round" />
    <path d="M10.5 11 A8 8 0 1 0 21.5 11" stroke="rgba(255,255,255,0.84)" strokeWidth="2.2" strokeLinecap="round" fill="none" />
  </svg>
);

const IconTurnOff = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
    <path d="M10.5 10.5 A8 8 0 1 0 21.5 10.5" stroke="rgba(255,255,255,0.9)" strokeWidth="2.6" strokeLinecap="round" fill="none" />
    <path d="M16 7 L16 18" stroke="rgba(255,255,255,0.97)" strokeWidth="2.9" strokeLinecap="round" />
  </svg>
);

const IconRestart = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
    <path d="M22 16 A7 7 0 1 1 18.2 9.8" stroke="rgba(255,255,255,0.9)" strokeWidth="2.5" strokeLinecap="round" fill="none" />
    <polygon points="17,7 23.5,10.5 17,14" fill="rgba(255,255,255,0.92)" />
  </svg>
);

// ── Main component ─────────────────────────────────────────────────────────
export const ShutdownModal: React.FC<ShutdownModalProps> = ({ isOpen, onClose, onAction }) => {
  const [hovered, setHovered] = useState<string | null>(null);
  const [pressed, setPressed] = useState<string | null>(null);
  const [shift, setShift] = useState(false);
  // tipVisible mirrors the AHK TransAmount reaching 255 (fully opaque)
  const [tipVisible, setTipVisible] = useState(false);
  const tipTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Keyboard — mirrors AHK C:: L:: S:: shortcuts + Esc/Alt+F4 ──────────
  useEffect(() => {
    if (!isOpen) return;
    const down = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Shift") setShift(true);
      const k = e.key.toLowerCase();
      if (k === "c") onClose();
      if (k === "u") { onClose(); onAction("turnoff"); }
      if (k === "r") { onClose(); onAction("restart"); }
      if (k === "s" && !shift) { onClose(); onAction("standby"); }
      if (k === "h" && shift) { onClose(); onAction("standby"); }
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

  // ── Reset on close ─────────────────────────────────────────────────────
  useEffect(() => {
    if (!isOpen) {
      setHovered(null);
      setTipVisible(false);
      setPressed(null);
    }
  }, [isOpen]);

  // ── Hover helpers — 400ms initial delay then fade (mirrors MakeTrans) ──
  const handleEnter = (id: string) => {
    setHovered(id);
    setTipVisible(false);
    if (tipTimer.current) clearTimeout(tipTimer.current);
    // AHK: first loop iteration → Sleep, 400; then opacity steps 30/30ms ≈ 270ms
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

  // Dialog is scaled from AHK's 315×200  →  ~2× for screen = 500×(proportional)
  return (
    <AnimatePresence>
      {isOpen && (
        /* Fullscreen fixed centering wrapper — immune to parent overflow/transforms
           Mirrors AHK: SysGet primary monitor → Yposition := Round(H/4) center calc */
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
          {/* Dimmed backdrop — AHK misc\fade.exe effect */}
          <motion.div
            key="sd-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            style={{
              position: "absolute", inset: 0,
              background: "rgba(0,0,0,0.60)",
              backdropFilter: "blur(2px)",
              WebkitBackdropFilter: "blur(2px)",
            }}
          />

          {/* Dialog — black outer border mirrors Gui,Default:Color,black 1px effect */}
          <motion.div
            key="sd-dialog"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.16, ease: "easeOut" }}
            style={{
              position: "relative",
              zIndex: 1,
              width: "500px",
              fontFamily: "Tahoma, Arial, sans-serif",
              /* 1px black outer border (Gui Color, black) */
              outline: "1px solid #000",
              borderRadius: "8px 8px 4px 4px",
              border: "2px solid #1040cc",
              boxShadow:
                "0 0 0 1px rgba(180,210,255,0.28) inset, 10px 10px 40px rgba(0,0,0,0.95), 0 2px 10px rgba(0,0,0,0.7)",
              overflow: "hidden",
            }}
          >
            {/* ── Title bar ─────────────────────────────────────── */}
            <div
              style={{
                background:
                  "linear-gradient(180deg,#5ca8fa 0%,#2468e8 12%,#1850cc 88%,#1040b8 100%)",
                padding: "5px 8px 5px 6px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                minHeight: "28px",
                userSelect: "none",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                {/* Small computer icon in title bar */}
                <span style={{ fontSize: "13px", lineHeight: 1 }}>🖥️</span>
                <span
                  style={{
                    color: "#fff",
                    fontSize: "12px",
                    fontWeight: "bold",
                    textShadow: "1px 1px 2px rgba(0,0,0,0.65)",
                    letterSpacing: "0.2px",
                  }}
                >
                  Turn off computer
                </span>
              </div>
              <XPClose onClick={onClose} />
            </div>

            {/* ── Body — recreates Bitmap20142.png XP blue panel ── */}
            <div
              style={{
                /* Authentic XP logoff/turnoff panel gradient */
                background:
                  "linear-gradient(165deg,#1a58b8 0%,#1660c8 18%,#1452a8 55%,#0e3d90 82%,#092e7a 100%)",
                position: "relative",
                minHeight: "200px",
              }}
            >
              {/* Subtle radial glow in center (XP panel ambient light) */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "radial-gradient(ellipse 60% 55% at 50% 42%,rgba(60,130,255,0.18) 0%,transparent 100%)",
                  pointerEvents: "none",
                }}
              />

              {/* Windows logo — top-right, mirrors Bitmap20141.png x266 y2 w48 h40 */}
              <div
                style={{
                  position: "absolute",
                  top: "8px",
                  right: "12px",
                  opacity: 0.82,
                  pointerEvents: "none",
                }}
              >
                <WinLogo />
              </div>

              {/* ── Prompt text — "Log Off Windows" equivalent ── */}
              <div style={{ padding: "16px 20px 0" }}>
                <p
                  style={{
                    color: "#fff",
                    fontSize: "13px",
                    fontWeight: "bold",
                    margin: 0,
                    textShadow: "0 1px 4px rgba(0,0,0,0.9)",
                  }}
                >
                  What do you want the computer to do?
                </p>
                <p
                  style={{
                    color: "rgba(255,255,255,0.5)",
                    fontSize: "10px",
                    margin: "4px 0 0",
                    fontStyle: "italic",
                  }}
                >
                  Hold{" "}
                  <kbd
                    style={{
                      fontStyle: "normal",
                      background: "rgba(255,255,255,0.12)",
                      padding: "0 4px",
                      borderRadius: "2px",
                      fontSize: "9px",
                    }}
                  >
                    Shift
                  </kbd>{" "}
                  to switch Stand By → Hibernate
                </p>
              </div>

              {/* Divider */}
              <div
                style={{
                  height: "1px",
                  margin: "12px 18px 0",
                  background:
                    "linear-gradient(90deg,transparent,rgba(255,255,255,0.2) 20%,rgba(255,255,255,0.2) 80%,transparent)",
                }}
              />

              {/* ── Three orb buttons — y≈82/200 scaled → centred area ── */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: "32px",
                  padding: "18px 20px 8px",
                }}
              >
                {/* Stand By / Hibernate (Shift toggle) — mirrors AHK S:: / H:: */}
                <OrbButton
                  id={standbyId}
                  label={shift ? "Hibernate" : "Stand By"}
                  shortcutChar={shift ? "H" : "S"}
                  icon={<IconStandBy />}
                  hex="#b88a00"
                  glow="rgba(255,195,30,0.6)"
                  hovered={hovered === standbyId}
                  pressed={pressed === "standby"}
                  onEnter={() => handleEnter(standbyId)}
                  onLeave={handleLeave}
                  onDown={() => setPressed("standby")}
                  onUp={() => { setPressed(null); act("standby"); }}
                />

                {/* Turn Off — mirrors AHK L:: (Log Off equivalent) */}
                <OrbButton
                  id="turnoff"
                  label="Turn Off"
                  shortcutChar="U"
                  icon={<IconTurnOff />}
                  hex="#b81a10"
                  glow="rgba(220,40,40,0.6)"
                  hovered={hovered === "turnoff"}
                  pressed={pressed === "turnoff"}
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
                  icon={<IconRestart />}
                  hex="#0e7a20"
                  glow="rgba(30,190,70,0.6)"
                  hovered={hovered === "restart"}
                  pressed={pressed === "restart"}
                  onEnter={() => handleEnter("restart")}
                  onLeave={handleLeave}
                  onDown={() => setPressed("restart")}
                  onUp={() => { setPressed(null); act("restart"); }}
                />
              </div>

              {/* ── Bubble tip area — mirrors AHK BubbleWindow (800×285) ──
                  Fixed min-height prevents layout jump; AnimatePresence handles
                  the 270ms opacity fade (9 steps × 30ms from AHK MakeTrans loop) */}
              <div style={{ minHeight: "62px", padding: "6px 18px 4px" }}>
                <AnimatePresence mode="wait">
                  {hovered && tipVisible && tip && (
                    <motion.div
                      key={hovered}
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 2 }}
                      /* 270ms ≈ 9 × 30ms AHK fade steps */
                      transition={{ duration: 0.27, ease: "easeOut" }}
                      style={{
                        background: "rgba(255,255,255,0.10)",
                        border: "1px solid rgba(255,255,255,0.20)",
                        borderRadius: "4px",
                        padding: "7px 11px",
                        backdropFilter: "blur(4px)",
                        WebkitBackdropFilter: "blur(4px)",
                      }}
                    >
                      <div
                        style={{
                          color: "#fff",
                          fontSize: "11px",
                          fontWeight: "bold",
                          marginBottom: "3px",
                          textShadow: "0 1px 2px rgba(0,0,0,0.8)",
                        }}
                      >
                        {tip.title}
                      </div>
                      <div
                        style={{
                          color: "rgba(255,255,255,0.72)",
                          fontSize: "10px",
                          lineHeight: "1.45",
                        }}
                      >
                        {tip.desc}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* ── Bottom bar — Cancel button (x225 y170 in AHK, bottom-right) ─ */}
              <div
                style={{
                  background: "rgba(0,0,0,0.20)",
                  borderTop: "1px solid rgba(255,255,255,0.10)",
                  padding: "8px 12px",
                  display: "flex",
                  justifyContent: "flex-end",
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
