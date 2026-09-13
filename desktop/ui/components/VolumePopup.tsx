"use client";

import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

/** Gap kept between the taskbar top edge and the popup. */
const TASKBAR_GAP = 6;
/** Minimum gap kept between the popup and the viewport edge. */
const EDGE_MARGIN = 8;
/** Height (px) of the vertical slider track. */
const TRACK_HEIGHT = 100;
/** Width/height (px) of the slider thumb. */
const THUMB_WIDTH = 19;
const THUMB_HEIGHT = 10;

interface VolumePopupProps {
  visible: boolean;
  onRequestClose: () => void;
  anchorRef: React.RefObject<HTMLElement | null>;
  volume: number;
  muted: boolean;
  onVolumeChange: (volume: number) => void;
  onMuteToggle: () => void;
}

export const VolumePopup: React.FC<VolumePopupProps> = ({
  visible,
  onRequestClose,
  anchorRef,
  volume,
  muted,
  onVolumeChange,
  onMuteToggle,
}) => {
  const popupRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [left, setLeft] = useState<number | null>(null);
  const draggingRef = useRef(false);

  // Anchor directly above the sound icon, horizontally centered, and stay
  // correct if the taskbar/viewport size changes (same approach as
  // XPBalloonNotification's anchor-tracking).
  useLayoutEffect(() => {
    if (!visible) return;

    const updatePosition = () => {
      const anchor = anchorRef.current;
      const popup = popupRef.current;
      if (!anchor || !popup) return;

      const anchorRect = anchor.getBoundingClientRect();
      const iconCenterX = anchorRect.left + anchorRect.width / 2;
      const popupWidth = popup.offsetWidth;

      const idealLeft = iconCenterX - popupWidth / 2;
      const maxLeft = Math.max(EDGE_MARGIN, window.innerWidth - popupWidth - EDGE_MARGIN);
      setLeft(Math.min(Math.max(EDGE_MARGIN, idealLeft), maxLeft));
    };

    updatePosition();
    window.addEventListener("resize", updatePosition);
    return () => window.removeEventListener("resize", updatePosition);
  }, [visible, anchorRef]);

  // Outside click closes the popup. The volume button itself is excluded so
  // its own onClick toggles the popup rather than this handler fighting it.
  useEffect(() => {
    if (!visible) return;

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (popupRef.current && popupRef.current.contains(target)) return;
      if (target.closest("[data-volume-button]")) return;
      onRequestClose();
    };

    const timer = setTimeout(() => {
      document.addEventListener("mousedown", handleClickOutside);
    }, 0);

    return () => {
      clearTimeout(timer);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [visible, onRequestClose]);

  const volumeFromPointer = useCallback((clientY: number) => {
    const track = trackRef.current;
    if (!track) return null;
    const rect = track.getBoundingClientRect();
    const relY = Math.min(rect.height, Math.max(0, clientY - rect.top));
    const pct = 1 - relY / rect.height;
    return Math.round(pct * 100);
  }, []);

  const handleThumbPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    draggingRef.current = true;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handleThumbPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return;
    const next = volumeFromPointer(e.clientY);
    if (next !== null) onVolumeChange(next);
  };

  const handleThumbPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    draggingRef.current = false;
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
  };

  const handleTrackPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const next = volumeFromPointer(e.clientY);
    if (next !== null) onVolumeChange(next);
  };

  if (!visible) return null;

  const thumbTop = TRACK_HEIGHT * (1 - volume / 100) - THUMB_HEIGHT / 2;

  return (
    <div
      ref={popupRef}
      onMouseDown={(e) => e.stopPropagation()}
      style={{
        position: "fixed",
        bottom: `${50 + TASKBAR_GAP}px`,
        left: left !== null ? `${left}px` : undefined,
        visibility: left !== null ? "visible" : "hidden",
        zIndex: 10002,
        fontFamily: "Tahoma, Arial, sans-serif",
        userSelect: "none",
        width: "72px",
        background: "#ECE9D8",
        border: "1px solid #404040",
        boxShadow:
          "inset 1px 1px 0 #FFFFFF, inset -1px -1px 0 #ACA899, 1px 1px 2px rgba(0,0,0,0.3)",
        padding: "3px 0 5px",
      }}
    >
      {/* Header */}
      <div
        style={{
          textAlign: "center",
          fontSize: "11px",
          fontWeight: 700,
          color: "#000000",
          padding: "1px 0 3px",
        }}
      >
        Volume
      </div>
      {/* Etched separator */}
      <div style={{ borderTop: "1px solid #ACA899", borderBottom: "1px solid #FFFFFF", margin: "0 3px 6px" }} />

      {/* Slider */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "2px",
        }}
      >
        <span style={{ fontSize: "10px", color: "#000000" }}>High</span>

        <div
          ref={trackRef}
          onPointerDown={handleTrackPointerDown}
          style={{
            position: "relative",
            width: "2px",
            height: `${TRACK_HEIGHT}px`,
            background: "#808080",
            boxShadow: "inset 1px 1px 0 #404040, inset -1px -1px 0 #FFFFFF",
            margin: "3px 0",
            cursor: "pointer",
          }}
        >
          {/* Thumb */}
          <div
            onPointerDown={handleThumbPointerDown}
            onPointerMove={handleThumbPointerMove}
            onPointerUp={handleThumbPointerUp}
            style={{
              position: "absolute",
              top: `${thumbTop}px`,
              left: `${-(THUMB_WIDTH - 2) / 2}px`,
              width: `${THUMB_WIDTH}px`,
              height: `${THUMB_HEIGHT}px`,
              background: "#D4D0C8",
              boxShadow:
                "inset 1px 1px 0 #FFFFFF, inset -1px -1px 0 #404040, inset 2px 2px 0 #FFFFFF, inset -2px -2px 0 #808080",
              cursor: "ns-resize",
              touchAction: "none",
            }}
          />
        </div>

        <span style={{ fontSize: "10px", color: "#000000" }}>Low</span>
      </div>

      {/* Mute checkbox */}
      <label
        onClick={(e) => {
          e.preventDefault();
          onMuteToggle();
        }}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "4px",
          marginTop: "7px",
          fontSize: "10px",
          color: "#000000",
          cursor: "pointer",
        }}
      >
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: "11px",
            height: "11px",
            background: "#FFFFFF",
            boxShadow: "inset 1px 1px 0 #404040, inset -1px -1px 0 #FFFFFF, inset 2px 2px 0 #808080",
            flexShrink: 0,
          }}
        >
          {muted && (
            <span
              style={{
                fontSize: "9px",
                lineHeight: 1,
                color: "#00007D",
                fontWeight: 700,
              }}
            >
              ✓
            </span>
          )}
        </span>
        Mute
      </label>
    </div>
  );
};
