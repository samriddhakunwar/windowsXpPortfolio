"use client";

import { motion, AnimatePresence } from "framer-motion";
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
  const clampedX = Math.min(x, window.innerWidth - menuWidth - 8);
  const clampedY = Math.min(y, window.innerHeight - menuHeight - 48);

  return (
    <AnimatePresence>
      <motion.div
        ref={ref}
        initial={{ opacity: 0, scale: 0.92, y: -4 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: -4 }}
        transition={{ duration: 0.1, ease: "easeOut" }}
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
            return <div key={i} className="xp-context-separator" />;
          }
          const menuItem = item as ContextMenuItem;
          return (
            <div
              key={i}
              className="xp-context-item"
              onClick={() => {
                if (!menuItem.disabled) {
                  menuItem.onClick();
                  onClose();
                }
              }}
              style={{
                opacity: menuItem.disabled ? 0.4 : 1,
                cursor: menuItem.disabled ? "default" : "default",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              {menuItem.icon && <span style={{ fontSize: "13px", width: "16px" }}>{menuItem.icon}</span>}
              {menuItem.label}
            </div>
          );
        })}
      </motion.div>
    </AnimatePresence>
  );
};
