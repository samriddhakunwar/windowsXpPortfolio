"use client";

import { WindowType } from "@/types";
import React, { useEffect, useRef } from "react";

export interface DesktopIconInfo {
  type: WindowType;
  label: string;
}

interface DesktopIconContextMenuProps {
  icon: DesktopIconInfo;
  position: { x: number; y: number };
  onOpen: () => void;
  onClose: () => void;
}

export const DesktopIconContextMenu: React.FC<DesktopIconContextMenuProps> = ({
  icon,
  position,
  onOpen,
  onClose,
}) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    // Slight delay to avoid immediately closing from the opening right-click
    const timer = setTimeout(() => {
      document.addEventListener("mousedown", handleMouseDown);
      document.addEventListener("keydown", handleKeyDown);
    }, 10);

    return () => {
      clearTimeout(timer);
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  // Clamp menu so it doesn't overflow the viewport
  // Use safe fallbacks for SSR (window is not available server-side)
  const MENU_WIDTH = 180;
  const MENU_HEIGHT = 260; // approximate
  const vw = typeof window !== "undefined" ? window.innerWidth : 1280;
  const vh = typeof window !== "undefined" ? window.innerHeight : 768;
  const clampedX = Math.min(position.x, vw - MENU_WIDTH - 8);
  const clampedY = Math.min(position.y, vh - MENU_HEIGHT - 48);


  const handleOpen = (e: React.MouseEvent) => {
    e.stopPropagation();
    onOpen();
    onClose();
  };

  return (
    <div
      ref={ref}
      role="menu"
      className="xp-icon-context-menu"
      style={{
        position: "fixed",
        left: clampedX,
        top: clampedY,
        zIndex: 99999,
      }}
      onContextMenu={(e) => e.preventDefault()}
    >
      {/* ── Open (functional) ─────────────────────────────────────── */}
      <div
        role="menuitem"
        className="xp-icon-ctx-item xp-icon-ctx-bold"
        onClick={handleOpen}
      >
        Open
      </div>

      {/* ── Explore (disabled) ───────────────────────────────────── */}
      <div role="menuitem" aria-disabled="true" className="xp-icon-ctx-item xp-icon-ctx-disabled">Explore</div>

      {/* ── Search (disabled) ────────────────────────────────────── */}
      <div role="menuitem" aria-disabled="true" className="xp-icon-ctx-item xp-icon-ctx-disabled">Search...</div>

      <div className="xp-icon-ctx-separator" role="separator" />

      {/* ── Manage (disabled) ────────────────────────────────────── */}
      <div role="menuitem" aria-disabled="true" className="xp-icon-ctx-item xp-icon-ctx-disabled">Manage</div>

      <div className="xp-icon-ctx-separator" role="separator" />

      {/* ── Map/Disconnect (disabled) ────────────────────────────── */}
      <div role="menuitem" aria-disabled="true" className="xp-icon-ctx-item xp-icon-ctx-disabled">Map Network Drive...</div>
      <div role="menuitem" aria-disabled="true" className="xp-icon-ctx-item xp-icon-ctx-disabled">Disconnect Network Drive...</div>

      <div className="xp-icon-ctx-separator" role="separator" />

      {/* ── Shortcut / Delete / Rename (disabled) ────────────────── */}
      <div role="menuitem" aria-disabled="true" className="xp-icon-ctx-item xp-icon-ctx-disabled">Create Shortcut</div>
      <div role="menuitem" aria-disabled="true" className="xp-icon-ctx-item xp-icon-ctx-disabled">Delete</div>
      <div role="menuitem" aria-disabled="true" className="xp-icon-ctx-item xp-icon-ctx-disabled">Rename</div>

      <div className="xp-icon-ctx-separator" role="separator" />

      {/* ── Properties (disabled) ────────────────────────────────── */}
      <div role="menuitem" aria-disabled="true" className="xp-icon-ctx-item xp-icon-ctx-disabled">Properties</div>
    </div>
  );
};
