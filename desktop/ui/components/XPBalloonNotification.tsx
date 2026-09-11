"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";

const BALLOON_SOUND_SRC = "/audio/windows-xp-balloon_C_minor.wav";

/** Delay after mount before the balloon appears (and its sound plays). */
const SHOW_DELAY_MS = 500;
/** How long the balloon stays up before auto-dismissing, authentic XP-style. */
const AUTO_DISMISS_MS = 9000;

interface XPBalloonNotificationProps {
  title?: string;
  lines?: string[];
  tip?: string;
  /** Fires once the balloon has closed, whether by timeout or the close button. */
  onDismiss?: () => void;
}

export const XPBalloonNotification: React.FC<XPBalloonNotificationProps> = ({
  title = "Welcome to Samriddha's XP",
  lines = [
    "My portfolio, built as a Windows XP desktop.",
    "- Double-click an icon to get started",
    "- Or open a program from the Start menu",
  ],
  tip = "Tip: Right-click for context menus.",
  onDismiss,
}) => {
  const [visible, setVisible] = useState(false);
  const soundPlayedRef = useRef(false);

  // Show the balloon 0.5s after mount (i.e. 0.5s after the desktop itself
  // mounts, since this component only ever renders inside DesktopPanel).
  // The cleanup-on-unmount below is what actually protects against
  // React Strict Mode's mount→cleanup→mount dev cycle: the first effect's
  // timer never survives long enough to fire. The ref is a second guard so
  // the balloon sound can never be triggered twice even under future changes.
  useEffect(() => {
    const showTimer = setTimeout(() => {
      if (!soundPlayedRef.current) {
        soundPlayedRef.current = true;
        const audio = new Audio(BALLOON_SOUND_SRC);
        audio.volume = 0.7;
        audio.play().catch(() => {
          // Autoplay blocked by the browser — fail silently, same as the
          // existing startup/shutdown sounds elsewhere in the app.
        });
      }
      setVisible(true);
    }, SHOW_DELAY_MS);

    return () => clearTimeout(showTimer);
  }, []);

  // Auto-dismiss once shown.
  useEffect(() => {
    if (!visible) return;
    const dismissTimer = setTimeout(() => {
      setVisible(false);
      onDismiss?.();
    }, AUTO_DISMISS_MS);
    return () => clearTimeout(dismissTimer);
  }, [visible, onDismiss]);

  const handleClose = () => {
    setVisible(false);
    onDismiss?.();
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          role="alert"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.28, ease: "easeOut" }}
          style={{
            position: "fixed",
            bottom: "62px",
            right: "16px",
            width: "min(300px, calc(100vw - 32px))",
            zIndex: 10000,
            fontFamily: "Tahoma, Arial, sans-serif",
            userSelect: "none",
          }}
        >
          <div
            style={{
              position: "relative",
              background: "linear-gradient(180deg, #FFFFFF 0%, #F7F6EA 100%)",
              border: "1px solid #6E6E6E",
              borderRadius: "6px",
              boxShadow: "2px 3px 9px rgba(0,0,0,0.35)",
              padding: "8px 10px 9px",
            }}
          >
            {/* ── Header ─────────────────────────────────────────────── */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                paddingBottom: "6px",
                marginBottom: "6px",
                borderBottom: "1px solid #E4E2D6",
              }}
            >
              <Image
                src="/assets/dialog/info.png"
                alt=""
                width={16}
                height={16}
                draggable={false}
                style={{ flexShrink: 0 }}
              />
              <span
                style={{
                  flex: 1,
                  fontSize: "12px",
                  fontWeight: 700,
                  color: "#000000",
                  lineHeight: 1.2,
                }}
              >
                {title}
              </span>
              <button
                type="button"
                onClick={handleClose}
                aria-label="Close notification"
                style={{
                  flexShrink: 0,
                  width: "16px",
                  height: "16px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "none",
                  background: "transparent",
                  color: "#555555",
                  fontSize: "13px",
                  lineHeight: 1,
                  cursor: "pointer",
                  padding: 0,
                }}
                onMouseEnter={(e) => { e.currentTarget.style.color = "#000000"; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = "#555555"; }}
              >
                ×
              </button>
            </div>

            {/* ── Body ───────────────────────────────────────────────── */}
            <div style={{ fontSize: "11px", color: "#1a1a1a", lineHeight: 1.5 }}>
              {lines.map((line, i) => (
                <div key={i}>{line}</div>
              ))}
            </div>

            {/* ── Helper / tip text ──────────────────────────────────── */}
            <div
              style={{
                marginTop: "7px",
                paddingTop: "6px",
                borderTop: "1px dashed #DEDCD0",
                fontSize: "10px",
                fontStyle: "italic",
                color: "#5A5A5A",
                lineHeight: 1.3,
              }}
            >
              {tip}
            </div>

            {/* ── Pointer, aimed at the system tray ─────────────────── */}
            <div
              style={{
                position: "absolute",
                bottom: "-9px",
                right: "26px",
                width: 0,
                height: 0,
                borderLeft: "9px solid transparent",
                borderRight: "9px solid transparent",
                borderTop: "9px solid #6E6E6E",
              }}
            />
            <div
              style={{
                position: "absolute",
                bottom: "-7px",
                right: "28px",
                width: 0,
                height: 0,
                borderLeft: "7px solid transparent",
                borderRight: "7px solid transparent",
                borderTop: "7px solid #F7F6EA",
              }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
