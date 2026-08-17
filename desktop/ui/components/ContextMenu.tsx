"use client";

import React, { useEffect, useRef } from "react";

interface ContextMenuItem {
  label: string;
  icon?: string;
  onClick: () => void;
  disabled?: boolean;
  separator?: false;
}

interface ContextMenuSeparator {
  separator: true;
}

type ContextMenuEntry = ContextMenuItem | ContextMenuSeparator;

interface ContextMenuProps {
  x: number;
  y: number;
  items: ContextMenuEntry[];
  onClose: () => void;
}

export const ContextMenu: React.FC<ContextMenuProps> = ({ x, y, items, onClose }) => {
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

    // Small delay to prevent immediate close from the opening right-click
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

  // Clamp position so menu doesn't go offscreen
  const menuWidth = 180;
  const menuHeight = items.length * 22 + 8;
  const vw = typeof window !== "undefined" ? window.innerWidth : 1280;
  const vh = typeof window !== "undefined" ? window.innerHeight : 768;
  const clampedX = Math.min(x, vw - menuWidth - 8);
  const clampedY = Math.min(y, vh - menuHeight - 48);

  return (
    <div
      ref={ref}
      role="menu"
      className="xp-context-menu"
      style={{
        position: "fixed",
        left: clampedX,
        top: clampedY,
        zIndex: 99999,
      }}
    >
      {items.map((item, i) => {
        if ("separator" in item && item.separator) {
          return <div key={i} className="xp-context-separator" role="separator" />;
        }
        const menuItem = item as ContextMenuItem;
        return (
          <div
            key={i}
            role="menuitem"
            aria-disabled={menuItem.disabled || undefined}
            className={`xp-context-item${menuItem.disabled ? " disabled" : ""}`}
            onClick={() => {
              if (!menuItem.disabled) {
                menuItem.onClick();
                onClose();
              }
            }}
          >
            <span className="xp-context-icon">{menuItem.icon}</span>
            <span className="xp-context-label">{menuItem.label}</span>
          </div>
        );
      })}
    </div>
  );
};
