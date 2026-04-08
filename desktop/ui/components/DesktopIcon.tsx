"use client";

import { motion, AnimatePresence } from "framer-motion";
import { WindowType } from "@/types";
import React, { useCallback, useEffect, useRef, useState } from "react";

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
  position = { x: 0, y: 0 },
}) => {
  const [selected, setSelected] = useState(false);
  const [clicked, setClicked] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

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
    setTimeout(() => setClicked(false), 300);
    onDoubleClick();
  }, [onDoubleClick]);

  return (
    <div
      ref={ref}
      className="select-none"
      style={{
        width: "76px",
        padding: "6px 4px",
        textAlign: "center",
        cursor: "default",
      }}
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
    </div>
  );
};
