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

// ── XP title-bar close button ────────────────────────────────────────────────
const XPClose: React.FC<{ onClick: () => void }> = ({ onClick }) => {
  const [h, setH] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      aria-label="Close"
      style={{
        width: "13px",
        height: "13px",
        borderRadius: "2px",
        border: "1px solid rgba(0,0,0,0.6)",
        background: h
          ? "linear-gradient(180deg,#f07070 0%,#cc2020 100%)"
          : "linear-gradient(180deg,#d85050 0%,#a81010 100%)",
        color: "#fff",
        fontSize: "7px",
        fontWeight: "bold",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        padding: 0,
        fontFamily: "Tahoma, Arial, sans-serif",
        lineHeight: 1,
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.3)",
      }}
    >
      ✕
    </button>
  );
};

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
  onEnter: () => void;
  onLeave: () => void;
  onDown: () => void;
  onUp: () => void;
}

const OrbButton: React.FC<OrbBtnProps> = ({
  label, shortcutChar, imgSrc,
  hovered, pressed, onEnter, onLeave, onDown, onUp,
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
        cursor: "pointer",
        userSelect: "none",
        WebkitUserSelect: "none",
        width: "64px",
      }}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onMouseDown={onDown}
      onMouseUp={onUp}
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
          opacity: pressed ? 0.75 : hovered ? 1 : 0.92,
          transform: pressed ? "scale(0.93)" : hovered ? "scale(1.06)" : "scale(1)",
          transition: "transform 80ms ease, opacity 80ms ease",
          boxShadow: hovered
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
      if (k === "u") { onClose(); onAction("turnoff"); }
      if (k === "r") { onClose(); onAction("restart"); }
      if (k === "s" && !shift) { onClose(); onAction("standby"); }
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
              /* XP outer window border — thin 3-D bevel */
              border: "2px solid #0a246a",
              borderRadius: "6px 6px 4px 4px",
              boxShadow: "1px 1px 0 #6699cc, 4px 6px 14px rgba(0,0,0,0.65)",
              overflow: "hidden",
            }}
          >
            {/* ── Title bar ──────────────────────────────────────────────── */}
            <div
              style={{
                background:
                  "linear-gradient(180deg,#4d94f0 0%,#2565e0 8%,#1a52cc 88%,#1040b4 100%)",
                padding: "0 4px 0 5px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                height: "22px",
                userSelect: "none",
                boxSizing: "border-box",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "3px" }}>
                {/* Small monitor icon */}
                <span style={{ fontSize: "11px", lineHeight: 1 }}>🖥️</span>
                <span
                  style={{
                    color: "#fff",
                    fontSize: "11px",
                    fontWeight: "bold",
                    textShadow: "1px 1px 1px rgba(0,0,0,0.5)",
                    letterSpacing: "0.1px",
                  }}
                >
                  Turn off computer
                </span>
              </div>
              <div style={{ display: "flex", gap: "2px", alignItems: "center" }}>
                <XPClose onClick={onClose} />
              </div>
            </div>

            {/* ── Body — authentic XP blue ────────────────────────────────── */}
            <div
              style={{
                background: "#3a6ea5",
                position: "relative",
              }}
            >
              {/* Windows logo — top right */}
              <div
                style={{
                  position: "absolute",
                  top: "6px",
                  right: "8px",
                  opacity: 0.88,
                  pointerEvents: "none",
                }}
              >
                <WinLogo />
              </div>

              {/* "What do you want the computer to do?" heading */}
              <div style={{ padding: "7px 12px 4px 12px" }}>
                <p
                  style={{
                    color: "#fff",
                    fontSize: "11px",
                    fontWeight: "bold",
                    margin: 0,
                    textShadow: "0 1px 1px rgba(0,0,0,0.6)",
                  }}
                >
                  What do you want the computer to do?
                </p>
              </div>

              {/* Subtle separator line */}
              <div
                style={{
                  height: "1px",
                  margin: "0 0 0",
                  background:
                    "linear-gradient(90deg,rgba(255,255,255,0.05),rgba(255,255,255,0.20) 20%,rgba(255,255,255,0.20) 80%,rgba(255,255,255,0.05))",
                }}
              />

              {/* ── Three orb buttons ──────────────────────────────────────── */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: "12px",
                  padding: "10px 12px 6px",
                }}
              >
                {/* Stand By */}
                <OrbButton
                  id={standbyId}
                  label={shift ? "Hibernate" : "Stand By"}
                  shortcutChar={shift ? "H" : "S"}
                  imgSrc="/assets/logoff.png"
                  hovered={hovered === standbyId}
                  pressed={pressed === "standby"}
                  onEnter={() => handleEnter(standbyId)}
                  onLeave={handleLeave}
                  onDown={() => setPressed("standby")}
                  onUp={() => { setPressed(null); act("standby"); }}
                />

                {/* Turn Off */}
                <OrbButton
                  id="turnoff"
                  label="Turn Off"
                  shortcutChar="U"
                  imgSrc="/assets/shutdown.png"
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
                  imgSrc="/assets/restart-icon-32272.png"
                  hovered={hovered === "restart"}
                  pressed={pressed === "restart"}
                  onEnter={() => handleEnter("restart")}
                  onLeave={handleLeave}
                  onDown={() => setPressed("restart")}
                  onUp={() => { setPressed(null); act("restart"); }}
                />
              </div>

              {/* ── Tooltip area ─────────────────────────────────────────── */}
              <div style={{ minHeight: "38px", padding: "2px 12px 2px" }}>
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

              {/* ── Footer bar — slightly darker blue with Cancel ─────────── */}
              <div
                style={{
                  background: "#1e4d8c",
                  borderTop: "1px solid #0d3066",
                  padding: "5px 8px 6px",
                  display: "flex",
                  justifyContent: "flex-end",
                  alignItems: "center",
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
