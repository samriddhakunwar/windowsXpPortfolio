"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";

/** How long the balloon stays up before auto-dismissing, authentic XP-style. */
const AUTO_DISMISS_MS = 9000;
/** Half-width (in px) of the pointer triangle. */
const TAIL_HALF_WIDTH = 9;
/** Minimum gap kept between the bubble and the viewport edge. */
const EDGE_MARGIN = 8;

interface XPBalloonNotificationProps {
  /** Controlled visibility — toggled by the Info system-tray button. */
  visible: boolean;
  /** Called when the balloon should close (close button, auto-dismiss, or outside click). */
  onRequestClose: () => void;
  /** The Info system-tray button the pointer should aim at. */
  anchorRef: React.RefObject<HTMLElement | null>;
  title?: string;
  lines?: string[];
  tip?: string;
}

interface BubblePosition {
  left: number;
  pointerLeft: number;
}

export const XPBalloonNotification: React.FC<XPBalloonNotificationProps> = ({
  visible,
  onRequestClose,
  anchorRef,
  title = "Welcome to Samriddha's XP",
  lines = [
    "My portfolio, built as a Windows XP desktop.",
    "- Double-click an icon to get started",
    "- Or open a program from the Start menu",
  ],
  tip = "Tip: Right-click for context menus.",
}) => {
  const bubbleRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<BubblePosition | null>(null);

  // Aim the pointer at the live center of the Info button rather than a fixed
  // taskbar offset, so it stays correct if the taskbar/tray layout changes.
  useLayoutEffect(() => {
    if (!visible) return;

    const updatePosition = () => {
      const anchor = anchorRef.current;
      const bubble = bubbleRef.current;
      if (!anchor || !bubble) return;

      const anchorRect = anchor.getBoundingClientRect();
      const iconCenterX = anchorRect.left + anchorRect.width / 2;
      const bubbleWidth = bubble.offsetWidth;

      const maxLeft = Math.max(EDGE_MARGIN, window.innerWidth - bubbleWidth - EDGE_MARGIN);
      // Same visual tail placement as the original fixed design (~35px in
      // from the bubble's right edge), just anchored to the icon instead.
      const idealLeft = iconCenterX - bubbleWidth + 35;
      const left = Math.min(Math.max(EDGE_MARGIN, idealLeft), maxLeft);

      const pointerCenter = Math.min(
        Math.max(iconCenterX, left + TAIL_HALF_WIDTH * 2),
        left + bubbleWidth - TAIL_HALF_WIDTH * 2,
      );

      setPosition({ left, pointerLeft: pointerCenter - left - TAIL_HALF_WIDTH });
    };

    updatePosition();
    window.addEventListener("resize", updatePosition);
    return () => window.removeEventListener("resize", updatePosition);
  }, [visible, anchorRef]);

  // Auto-dismiss once shown, authentic XP-style — no sound on the way out.
  useEffect(() => {
    if (!visible) return;
    const dismissTimer = setTimeout(onRequestClose, AUTO_DISMISS_MS);
    return () => clearTimeout(dismissTimer);
  }, [visible, onRequestClose]);

  // Clicking outside the bubble dismisses it. The Info button is excluded
  // here (same pattern as StartMenu's data-start-button check) so its own
  // onClick — not this handler — is what decides the toggle.
  useEffect(() => {
    if (!visible) return;

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (bubbleRef.current && bubbleRef.current.contains(target)) return;
      if (target.closest("[data-info-button]")) return;
      onRequestClose();
    };

    const timer = setTimeout(() => {
      document.addEventListener("mousedown", handleClickOutside);
    }, 50);

    return () => {
      clearTimeout(timer);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [visible, onRequestClose]);

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
            left: position ? `${position.left}px` : undefined,
            right: position ? undefined : "16px",
            width: "min(300px, calc(100vw - 32px))",
            zIndex: 10000,
            fontFamily: "Tahoma, Arial, sans-serif",
            userSelect: "none",
          }}
        >
          <div
            ref={bubbleRef}
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
                onClick={onRequestClose}
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

            {/* ── Pointer, aimed at the Info system-tray button ─────── */}
            <div
              style={{
                position: "absolute",
                bottom: "-9px",
                left: position ? `${position.pointerLeft}px` : undefined,
                right: position ? undefined : "26px",
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
                left: position ? `${position.pointerLeft + 2}px` : undefined,
                right: position ? undefined : "28px",
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
