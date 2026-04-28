"use client";

import { motion, AnimatePresence } from "framer-motion";
import { WindowType } from "@/types";
import React, { useCallback, useEffect, useRef, useState } from "react";

const APP_DESCRIPTIONS: Partial<Record<WindowType, string>> = {
  about:      "Learn more about Samriddha",
  projects:   "Browse my portfolio projects",
  contact:    "Send me a message",
  resume:     "View & download my CV",
  mycomputer: "Browse files & folders",
  github:     "My GitHub repositories",
  settings:   "Customize the desktop",
  help:       "Help & system info",
  recycle:    "Recycle Bin",
};

interface DesktopIconProps {
  type: WindowType;
  label: string;
  icon: React.ReactNode;
  onDoubleClick: () => void;
  position?: { x: number; y: number };
}

export const DesktopIcon: React.FC<DesktopIconProps> = ({
  type,
  label,
  icon,
  onDoubleClick,
}) => {
  const [selected, setSelected] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const tooltipTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Deselect when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setSelected(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleDoubleClick = useCallback(() => {
    setClicked(true);
    setShowTooltip(false);
    setTimeout(() => setClicked(false), 300);
    onDoubleClick();
  }, [onDoubleClick]);

  const handleMouseEnter = useCallback(() => {
    tooltipTimer.current = setTimeout(() => setShowTooltip(true), 600);
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (tooltipTimer.current) clearTimeout(tooltipTimer.current);
    setShowTooltip(false);
  }, []);

  const description = APP_DESCRIPTIONS[type] ?? label;

  return (
    <div
      ref={ref}
      className="select-none"
      style={{ width: "76px", padding: "6px 4px", textAlign: "center", cursor: "default", position: "relative" }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        onClick={() => setSelected(true)}
        onDoubleClick={handleDoubleClick}
        animate={clicked ? { scale: [1, 0.85, 1.1, 1] } : { scale: 1 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        whileHover={{ scale: 1.08 }}
        className="flex flex-col items-center gap-1 p-1 rounded"
        style={{
          background: selected ? "rgba(11, 97, 255, 0.3)" : "transparent",
          border: selected
            ? "1px dotted rgba(150, 200, 255, 0.8)"
            : "1px solid transparent",
          cursor: "default",
        }}
      >
        <motion.div
          className="w-[32px] h-[32px] flex items-center justify-center"
          animate={
            selected
              ? { filter: "drop-shadow(0 0 5px rgba(80,160,255,0.9))" }
              : { filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.5))" }
          }
          whileHover={{ filter: "drop-shadow(0 0 6px rgba(80,160,255,0.8))" }}
          transition={{ duration: 0.15 }}
        >
          {icon}
        </motion.div>
        <span
          className="xp-icon-label text-center break-words leading-tight"
          style={{
            fontSize: "11px",
            color: "#FFFFFF",
            textShadow: "1px 1px 2px rgba(0,0,0,0.9), 0 0 3px rgba(0,0,0,0.7)",
            lineHeight: "1.2",
            maxWidth: "68px",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            background: selected ? "rgba(11, 97, 255, 0.5)" : "transparent",
            padding: "1px 2px",
          }}
        >
          {label}
        </span>
      </motion.div>

      {/* XP-style tooltip */}
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.12 }}
            style={{
              position: "absolute",
              bottom: "calc(100% + 4px)",
              left: "50%",
              transform: "translateX(-50%)",
              background: "#FFFFE1",
              border: "1px solid #767676",
              borderRadius: "2px",
              padding: "3px 6px",
              fontSize: "11px",
              fontFamily: "Tahoma, Arial, sans-serif",
              color: "#000",
              whiteSpace: "nowrap",
              boxShadow: "1px 1px 3px rgba(0,0,0,0.25)",
              zIndex: 99999,
              pointerEvents: "none",
            }}
          >
            {description}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
