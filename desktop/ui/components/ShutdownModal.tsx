"use client";

import { AnimatePresence, motion } from "framer-motion";
import React, { useCallback, useEffect, useRef, useState } from "react";

export type ShutdownAction = "turnoff" | "restart" | "standby";

interface ShutdownModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAction: (action: ShutdownAction) => void;
}

// ── Tooltip copy (mirroring XP AHK recreation bubble-tips) ────────────────
const TIPS: Record<string, { title: string; desc: string }> = {
  standby: {
    title: "Stand By",
    desc: "Places your computer in a low-power state so you can quickly resume working.",
  },
  hibernate: {
    title: "Hibernate",
    desc: "Saves your session to disk and powers off. Resumes from where you left off.",
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

// ── Colour helpers (hex 6-char) ────────────────────────────────────────────
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

// ── OrbButton ──────────────────────────────────────────────────────────────
interface OrbButtonProps {
  id: string;
  label: string;
  shortcut: string;        // letter to underline
  icon: React.ReactNode;
  hex: string;             // base colour
  glow: string;            // rgba glow
  isHovered: boolean;
  isPressed: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onMouseDown: () => void;
  onMouseUp: () => void;
}

const OrbButton: React.FC<OrbButtonProps> = ({
  label, shortcut, icon, hex, glow,
  isHovered, isPressed,
  onMouseEnter, onMouseLeave, onMouseDown, onMouseUp,
}) => {
  const orbBg = isPressed
    ? `radial-gradient(circle at 38% 32%, ${lighten(hex, 0.25)}, ${darken(hex, 0.1)} 55%, ${darken(hex, 0.35)})`
    : isHovered
    ? `radial-gradient(circle at 38% 32%, ${lighten(hex, 0.55)}, ${hex} 55%, ${darken(hex, 0.25)})`
    : `radial-gradient(circle at 38% 32%, ${lighten(hex, 0.38)}, ${darken(hex, 0.05)} 55%, ${darken(hex, 0.28)})`;

  const scale = isPressed ? 0.93 : 1;

  // build label with underlined shortcut letter
  const idx = label.toLowerCase().indexOf(shortcut.toLowerCase());
  const labelEl = idx >= 0
    ? <>{label.slice(0, idx)}<u style={{ textDecorationColor: "inherit" }}>{label[idx]}</u>{label.slice(idx + 1)}</>
    : label;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "8px",
        cursor: "pointer",
        userSelect: "none",
        WebkitUserSelect: "none",
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
    >
      {/* Orb */}
      <div
        style={{
          width: "68px",
          height: "68px",
          borderRadius: "50%",
          background: orbBg,
          border: `2px solid ${darken(hex, 0.35)}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: isHovered
            ? `0 0 22px 6px ${glow}, inset 0 2px 4px rgba(255,255,255,0.45), 0 4px 8px rgba(0,0,0,0.55)`
            : `inset 0 2px 4px rgba(255,255,255,0.28), 0 3px 7px rgba(0,0,0,0.5)`,
          transform: `scale(${scale})`,
          transition: "transform 100ms ease, box-shadow 160ms ease, background 160ms ease",
          filter: isHovered ? "brightness(1.12)" : "brightness(1)",
          /* glossy top shine */
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* shine arc */}
        <div style={{
          position: "absolute",
          top: 0, left: 0, right: 0,
          height: "50%",
          borderRadius: "50% 50% 0 0 / 60% 60% 0 0",
          background: "linear-gradient(180deg, rgba(255,255,255,0.38) 0%, rgba(255,255,255,0.06) 100%)",
          pointerEvents: "none",
        }} />
        {icon}
      </div>

      {/* Label */}
      <span
        style={{
          fontSize: "11px",
          fontFamily: "Tahoma, Arial, sans-serif",
          color: isHovered ? "#fff" : "rgba(255,255,255,0.88)",
          fontWeight: isHovered ? "bold" : "normal",
          textShadow: "0 1px 3px rgba(0,0,0,0.9)",
          transition: "color 140ms ease",
          letterSpacing: "0.1px",
        }}
      >
        {labelEl}
      </span>
    </div>
  );
};

// ── Main ShutdownModal ─────────────────────────────────────────────────────
export const ShutdownModal: React.FC<ShutdownModalProps> = ({ isOpen, onClose, onAction }) => {
  const [hovered, setHovered] = useState<string | null>(null);
  const [pressed, setPressed] = useState<string | null>(null);
  const [shift, setShift] = useState(false);
  const [tipReady, setTipReady] = useState(false);
  const tipTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Keyboard ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!isOpen) return;
    const down = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Shift") setShift(true);
    };
    const up = (e: KeyboardEvent) => {
      if (e.key === "Shift") setShift(false);
    };
    document.addEventListener("keydown", down);
    document.addEventListener("keyup", up);
    return () => {
      document.removeEventListener("keydown", down);
      document.removeEventListener("keyup", up);
      setShift(false);
    };
  }, [isOpen, onClose]);

  // ── Reset on close ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!isOpen) { setHovered(null); setTipReady(false); setPressed(null); }
  }, [isOpen]);

  // ── Hover helpers ────────────────────────────────────────────────────────
  const enter = (id: string) => {
    setHovered(id);
    setTipReady(false);
    if (tipTimer.current) clearTimeout(tipTimer.current);
    tipTimer.current = setTimeout(() => setTipReady(true), 650);
  };
  const leave = () => {
    setHovered(null);
    setTipReady(false);
    if (tipTimer.current) clearTimeout(tipTimer.current);
  };

  const act = useCallback((action: ShutdownAction) => {
    onClose();
    onAction(action);
  }, [onClose, onAction]);

  const standbyId = shift ? "hibernate" : "standby";
  const tip = hovered ? TIPS[hovered] : null;

  return (
    <AnimatePresence>
      {isOpen && (
        // ── Fullscreen centering wrapper (immune to parent overflow/transforms)
        <div style={{ position: "fixed", inset: 0, zIndex: 99998, display: "flex", alignItems: "center", justifyContent: "center" }}>

          {/* Dimmed blur overlay */}
          <motion.div
            key="so"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.28 }}
            onClick={onClose}
            style={{
              position: "absolute", inset: 0,
              background: "rgba(0,0,0,0.62)",
              backdropFilter: "blur(3px)",
              WebkitBackdropFilter: "blur(3px)",
            }}
          />

          {/* Dialog */}
          <motion.div
            key="sm"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.94 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            style={{
              position: "relative", zIndex: 1,
              width: "430px",
              fontFamily: "Tahoma, Arial, sans-serif",
              borderRadius: "8px 8px 4px 4px",
              border: "2px solid #0832cc",
              boxShadow:
                "0 0 0 1px rgba(160,200,255,0.35) inset, 8px 8px 36px rgba(0,0,0,0.92), 0 2px 8px rgba(0,0,0,0.7)",
              overflow: "hidden",
            }}
          >

            {/* ── Title bar ─────────────────────────────────────────── */}
            <div style={{
              background: "linear-gradient(180deg, #549ef8 0%, #2461e6 10%, #1848c8 88%, #0f3db4 100%)",
              padding: "5px 8px 5px 6px",
              display: "flex", alignItems: "center", justifyContent: "space-between",
              minHeight: "28px", userSelect: "none",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <span style={{ fontSize: "14px", lineHeight: 1 }}>💻</span>
                <span style={{
                  color: "#fff", fontSize: "12px", fontWeight: "bold",
                  textShadow: "1px 1px 2px rgba(0,0,0,0.65)", letterSpacing: "0.2px",
                }}>
                  Turn off computer
                </span>
              </div>
              <XPCloseButton onClick={onClose} />
            </div>

            {/* ── Body — authentic XP dark-blue gradient ─────────────── */}
            <div style={{
              background: "linear-gradient(170deg, #1252a8 0%, #1660bc 30%, #1452a4 68%, #0b3888 100%)",
              position: "relative",
            }}>

              {/* XP watermark */}
              <div style={{
                position: "absolute", top: 10, right: 14,
                pointerEvents: "none", userSelect: "none",
                textAlign: "right", lineHeight: 1.3,
              }}>
                <div style={{ fontSize: "8px", color: "rgba(255,255,255,0.22)", letterSpacing: "1.8px" }}>Microsoft</div>
                <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.18)", fontWeight: "bold", letterSpacing: "0.5px" }}>Windows XP</div>
              </div>

              {/* Prompt */}
              <div style={{ padding: "18px 22px 10px" }}>
                <p style={{
                  color: "#fff", fontSize: "13px", margin: 0,
                  fontWeight: "bold", textShadow: "0 1px 4px rgba(0,0,0,0.85)",
                }}>
                  What do you want the computer to do?
                </p>
                <p style={{
                  color: "rgba(255,255,255,0.55)", fontSize: "10px", margin: "4px 0 0",
                  fontStyle: "italic",
                }}>
                  Hold <kbd style={{ fontStyle: "normal", background: "rgba(255,255,255,0.12)", padding: "0 4px", borderRadius: "2px", fontSize: "9px" }}>Shift</kbd> to switch Stand By → Hibernate
                </p>
              </div>

              {/* Thin divider */}
              <div style={{
                height: "1px", margin: "0 18px 16px",
                background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.18) 20%, rgba(255,255,255,0.18) 80%, transparent)",
              }} />

              {/* Orb buttons */}
              <div style={{ display: "flex", justifyContent: "center", gap: "28px", padding: "0 18px 4px" }}>
                <OrbButton
                  id={standbyId}
                  label={shift ? "Hibernate" : "Stand By"}
                  shortcut={shift ? "H" : "S"}
                  icon={<StandByIcon />}
                  hex="#b88a00"
                  glow="rgba(255,195,30,0.65)"
                  isHovered={hovered === standbyId}
                  isPressed={pressed === "standby"}
                  onMouseEnter={() => enter(standbyId)}
                  onMouseLeave={leave}
                  onMouseDown={() => setPressed("standby")}
                  onMouseUp={() => { setPressed(null); act("standby"); }}
                />
                <OrbButton
                  id="turnoff"
                  label="Turn Off"
                  shortcut="U"
                  icon={<TurnOffIcon />}
                  hex="#b81a10"
                  glow="rgba(220,40,40,0.65)"
                  isHovered={hovered === "turnoff"}
                  isPressed={pressed === "turnoff"}
                  onMouseEnter={() => enter("turnoff")}
                  onMouseLeave={leave}
                  onMouseDown={() => setPressed("turnoff")}
                  onMouseUp={() => { setPressed(null); act("turnoff"); }}
                />
                <OrbButton
                  id="restart"
                  label="Restart"
                  shortcut="R"
                  icon={<RestartIcon />}
                  hex="#0e7a20"
                  glow="rgba(30,190,70,0.65)"
                  isHovered={hovered === "restart"}
                  isPressed={pressed === "restart"}
                  onMouseEnter={() => enter("restart")}
                  onMouseLeave={leave}
                  onMouseDown={() => setPressed("restart")}
                  onMouseUp={() => { setPressed(null); act("restart"); }}
                />
              </div>

              {/* Bubble tooltip area — fixed height so layout doesn't jump */}
              <div style={{ minHeight: "58px", padding: "8px 18px 6px" }}>
                <AnimatePresence mode="wait">
                  {hovered && tipReady && tip && (
                    <motion.div
                      key={hovered}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 3 }}
                      transition={{ duration: 0.2 }}
                      style={{
                        background: "rgba(255,255,255,0.11)",
                        border: "1px solid rgba(255,255,255,0.22)",
                        borderRadius: "4px",
                        padding: "7px 10px",
                        backdropFilter: "blur(4px)",
                      }}
                    >
                      <div style={{
                        color: "#fff", fontSize: "11px", fontWeight: "bold",
                        marginBottom: "3px", textShadow: "0 1px 2px rgba(0,0,0,0.7)",
                      }}>
                        {tip.title}
                      </div>
                      <div style={{
                        color: "rgba(255,255,255,0.75)", fontSize: "10px",
                        lineHeight: "1.45",
                      }}>
                        {tip.desc}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Bottom bar */}
              <div style={{
                background: "rgba(0,0,0,0.22)",
                borderTop: "1px solid rgba(255,255,255,0.1)",
                padding: "8px 12px",
                display: "flex", justifyContent: "flex-end",
              }}>
                <XPButton onClick={onClose} label="Cancel" />
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

// ── XP title-bar close button ──────────────────────────────────────────────
const XPCloseButton: React.FC<{ onClick: () => void }> = ({ onClick }) => {
  const [h, setH] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        width: "21px", height: "21px", borderRadius: "3px",
        border: "1px solid rgba(0,0,0,0.35)",
        background: h
          ? "linear-gradient(180deg,#f05550 0%,#d42020 50%,#be1010 100%)"
          : "linear-gradient(180deg,#e86260 0%,#c23030 50%,#aa1414 100%)",
        color: "#fff", fontSize: "11px", fontWeight: "bold",
        cursor: "pointer", display: "flex", alignItems: "center",
        justifyContent: "center", flexShrink: 0,
        boxShadow: "inset 0 1px 1px rgba(255,255,255,0.32)",
        transition: "background 120ms ease",
      }}
    >✕</button>
  );
};

// ── XP push-button (Cancel) ────────────────────────────────────────────────
const XPButton: React.FC<{ onClick: () => void; label: string }> = ({ onClick, label }) => {
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
        padding: "3px 20px", fontSize: "11px",
        fontFamily: "Tahoma, Arial, sans-serif",
        border: "1px solid #7f9db9", borderRadius: "3px",
        cursor: "pointer",
        background: p
          ? "linear-gradient(180deg,#b8ccec 0%,#c8d8f0 100%)"
          : h
          ? "linear-gradient(180deg,#dce8f8 0%,#b8cfe8 100%)"
          : "linear-gradient(180deg,#f4f8fe 0%,#dce8f8 50%,#c8d8f0 100%)",
        color: "#000",
        boxShadow: h ? "inset 0 0 0 1px #316ac5" : "inset 0 1px 0 rgba(255,255,255,0.85)",
        outline: h ? "1px dotted #000" : "none",
        outlineOffset: "-3px",
        transform: p ? "translateY(1px)" : "none",
        transition: "background 100ms ease, box-shadow 100ms ease, transform 60ms ease",
      }}
    >{label}</button>
  );
};

// ── SVG Icons ──────────────────────────────────────────────────────────────
const StandByIcon = () => (
  <svg width="34" height="34" viewBox="0 0 32 32" fill="none">
    <circle cx="16" cy="16" r="11" stroke="rgba(255,255,255,0.45)" strokeWidth="1.4" />
    <path d="M16 8 L16 16" stroke="rgba(255,255,255,0.92)" strokeWidth="2.6" strokeLinecap="round" />
    <path d="M10 11 A9 9 0 1 0 22 11" stroke="rgba(255,255,255,0.82)" strokeWidth="2.3" strokeLinecap="round" fill="none" />
  </svg>
);

const TurnOffIcon = () => (
  <svg width="34" height="34" viewBox="0 0 32 32" fill="none">
    <path d="M10.5 10.5 A9 9 0 1 0 21.5 10.5" stroke="rgba(255,255,255,0.88)" strokeWidth="2.6" strokeLinecap="round" fill="none" />
    <path d="M16 7 L16 18" stroke="rgba(255,255,255,0.96)" strokeWidth="2.9" strokeLinecap="round" />
  </svg>
);

const RestartIcon = () => (
  <svg width="34" height="34" viewBox="0 0 32 32" fill="none">
    <path d="M22 16 A7 7 0 1 1 18 9.8" stroke="rgba(255,255,255,0.9)" strokeWidth="2.6" strokeLinecap="round" fill="none" />
    <polygon points="17,7 23,10.5 17,14" fill="rgba(255,255,255,0.92)" />
  </svg>
);
