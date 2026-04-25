"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import React, { useCallback, useRef } from "react";

interface XPWindowProps {
  id: string;
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
  isMaximized?: boolean;
  isMinimized?: boolean;
  isFocused?: boolean;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  onDragEnd?: (x: number, y: number) => void;
  onResize?: (w: number, h: number, x: number, y: number) => void;
  onFocus?: () => void;
  zIndex?: number;
}

const MIN_W = 160;
const MIN_H = 180;

type ResizeDir = "n" | "s" | "e" | "w" | "ne" | "nw" | "se" | "sw";

const RESIZE_CURSORS: Record<ResizeDir, string> = {
  n: "n-resize",
  s: "s-resize",
  e: "e-resize",
  w: "w-resize",
  ne: "ne-resize",
  nw: "nw-resize",
  se: "se-resize",
  sw: "sw-resize",
};

export const XPWindow: React.FC<XPWindowProps> = ({
  id,
  title,
  icon,
  children,
  onClose,
  onMinimize,
  onMaximize,
  isMaximized = false,
  isMinimized = false,
  isFocused = true,
  x = 100,
  y = 100,
  width = 600,
  height = 400,
  onDragEnd,
  onResize,
  onFocus,
  zIndex = 10,
}) => {
  const dragRef = useRef<{
    startX: number;
    startY: number;
    origX: number;
    origY: number;
  } | null>(null);
  const posRef = useRef({ x, y, width, height });
  posRef.current = { x, y, width, height };

  const handleTitleBarMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if ((e.target as HTMLElement).closest("button")) return;
      if (isMaximized) return;
      e.preventDefault();
      onFocus?.();

      const startX = e.clientX;
      const startY = e.clientY;
      const origX = posRef.current.x;
      const origY = posRef.current.y;
      dragRef.current = { startX, startY, origX, origY };

      const handleMouseMove = (ev: MouseEvent) => {
        if (!dragRef.current) return;
        const dx = ev.clientX - dragRef.current.startX;
        const dy = ev.clientY - dragRef.current.startY;
        const newX = Math.max(-posRef.current.width / 2, dragRef.current.origX + dx);
        const newY = Math.max(0, dragRef.current.origY + dy);
        onDragEnd?.(newX, newY);
      };

      const handleMouseUp = () => {
        dragRef.current = null;
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    },
    [isMaximized, onFocus, onDragEnd],
  );

  const handleTitleBarDoubleClick = useCallback(
    (e: React.MouseEvent) => {
      if ((e.target as HTMLElement).closest("button")) return;
      onMaximize();
    },
    [onMaximize],
  );

  const handleResizeMouseDown = useCallback(
    (e: React.MouseEvent, dir: ResizeDir) => {
      if (isMaximized) return;
      e.preventDefault();
      e.stopPropagation();
      onFocus?.();

      const startX = e.clientX;
      const startY = e.clientY;
      const origX = posRef.current.x;
      const origY = posRef.current.y;
      const origW = posRef.current.width;
      const origH = posRef.current.height;

      const handleMouseMove = (ev: MouseEvent) => {
        const dx = ev.clientX - startX;
        const dy = ev.clientY - startY;

        let newX = origX;
        let newY = origY;
        let newW = origW;
        let newH = origH;

        if (dir.includes("e")) newW = Math.max(MIN_W, origW + dx);
        if (dir.includes("w")) {
          newW = Math.max(MIN_W, origW - dx);
          newX = origW - newW + origX;
        }
        if (dir.includes("s")) newH = Math.max(MIN_H, origH + dy);
        if (dir.includes("n")) {
          newH = Math.max(MIN_H, origH - dy);
          newY = origH - newH + origY;
        }

        onResize?.(newW, newH, newX, newY);
      };

      const handleMouseUp = () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    },
    [isMaximized, onFocus, onResize],
  );

  const focused = isFocused;

  const windowVariants = {
    hidden: { opacity: 0, scale: 0.88, y: 20 },
    visible: { opacity: 1, scale: 1, y: 0 },
    exit: {
      opacity: 0, scale: 0.88, y: 12,
      transition: { duration: 0.18, ease: [0.4, 0, 1, 1] as const },
    },
  };

  // Resize handle thickness
  const H = 5;

  return (
    <AnimatePresence mode="wait">
      {!isMinimized && (
        <motion.div
          key={id}
          variants={windowVariants}
          initial="hidden"
          animate={{
            opacity: 1, scale: 1, y: 0,
            width:  isMaximized ? "100vw" : width,
            height: isMaximized ? "calc(100vh - 40px)" : height,
          }}
          exit="exit"
          transition={{
            opacity:    { duration: 0.15 },
            scale:      { type: "spring", stiffness: 380, damping: 28, mass: 0.8 },
            y:          { type: "spring", stiffness: 380, damping: 28, mass: 0.8 },
            width:      { type: "spring", stiffness: 260, damping: 28, mass: 0.6 },
            height:     { type: "spring", stiffness: 260, damping: 28, mass: 0.6 },
          }}
          style={{
            position: "fixed",
            left: isMaximized ? 0 : x,
            top:  isMaximized ? 0 : y,
            zIndex,
          }}
          className="flex flex-col"
          onMouseDown={() => onFocus?.()}
        >
          {/* Resize handles — only visible when not maximized */}
          {!isMaximized && (
            <>
              {/* Edges */}
              {(["n", "s", "e", "w", "ne", "nw", "se", "sw"] as ResizeDir[]).map((dir) => {
                const style: React.CSSProperties = {
                  position: "absolute",
                  zIndex: 1,
                  cursor: RESIZE_CURSORS[dir],
                };
                if (dir === "n")   { style.top = 0; style.left = H; style.right = H; style.height = H; }
                if (dir === "s")   { style.bottom = 0; style.left = H; style.right = H; style.height = H; }
                if (dir === "e")   { style.right = 0; style.top = H; style.bottom = H; style.width = H; }
                if (dir === "w")   { style.left = 0; style.top = H; style.bottom = H; style.width = H; }
                if (dir === "ne")  { style.top = 0; style.right = 0; style.width = H; style.height = H; }
                if (dir === "nw")  { style.top = 0; style.left = 0; style.width = H; style.height = H; }
                if (dir === "se")  { style.bottom = 0; style.right = 0; style.width = H; style.height = H; }
                if (dir === "sw")  { style.bottom = 0; style.left = 0; style.width = H; style.height = H; }
                return (
                  <div
                    key={dir}
                    style={style}
                    onMouseDown={(e) => handleResizeMouseDown(e, dir)}
                  />
                );
              })}
            </>
          )}

          {/* Window frame */}
          <div
            className="flex flex-col h-full"
            style={{
              borderRadius: "8px 8px 0 0",
              border: focused ? "2px solid #0055E5" : "2px solid #9B9DA2",
              overflow: "hidden",
              boxShadow: focused
                ? "0 8px 32px rgba(0,0,0,0.45), 0 2px 8px rgba(0,0,0,0.25), 0 0 0 1px rgba(0,85,229,0.2)"
                : "0 4px 16px rgba(0,0,0,0.28)",
              transition: "box-shadow 200ms ease, border-color 200ms ease",
            }}
          >
            {/* Title Bar */}
            <div
              onMouseDown={handleTitleBarMouseDown}
              onDoubleClick={handleTitleBarDoubleClick}
              style={{
                background: focused
                  ? "linear-gradient(180deg, #0997FF 0%, #0053E0 8%, #0050DE 20%, #1466E5 40%, #0F5CDE 70%, #004BD5 85%, #0048CE 100%)"
                  : "linear-gradient(180deg, #B4B7BC 0%, #8E8F94 8%, #8E8F94 20%, #9B9DA2 40%, #97999E 70%, #8E8F94 85%, #8C8E93 100%)",
                padding: "3px 5px 3px 6px",
                minHeight: "28px",
                transition: "background 200ms ease",
              }}
              className="flex items-center justify-between cursor-move select-none"
            >
              {/* Icon + Title */}
              <div className="flex items-center gap-[5px] flex-1 min-w-0">
                {icon && (
                  <div style={{ width: 16, height: 16, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {icon}
                  </div>
                )}
                <span
                  className="text-white text-xs font-bold truncate"
                  style={{
                    textShadow: focused
                      ? "1px 1px 1px rgba(0,0,0,0.6)"
                      : "1px 1px 1px rgba(0,0,0,0.3)",
                  }}
                >
                  {title}
                </span>
              </div>

              <div className="flex gap-[2px] ml-2">
                {/* Minimize */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => { e.stopPropagation(); onMinimize(); }}
                  className="w-[21px] h-[21px] flex items-center justify-center rounded-sm"
                  style={{
                    background: "linear-gradient(180deg, #3C8CF6 0%, #0E59CE 50%, #0853C2 100%)",
                    border: "1px solid #fff",
                    borderBottom: "1px solid #0241A0",
                    borderRight: "1px solid #0241A0",
                  }}
                >
                  <Image src="/assets/minimise.png" alt="Minimize" width={9} height={9} draggable={false} />
                </motion.button>
                {/* Maximize/Restore */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => { e.stopPropagation(); onMaximize(); }}
                  className="w-[21px] h-[21px] flex items-center justify-center rounded-sm"
                  style={{
                    background: "linear-gradient(180deg, #3C8CF6 0%, #0E59CE 50%, #0853C2 100%)",
                    border: "1px solid #fff",
                    borderBottom: "1px solid #0241A0",
                    borderRight: "1px solid #0241A0",
                  }}
                >
                  <Image
                    src={isMaximized ? "/assets/resize.png" : "/assets/maximise.png"}
                    alt={isMaximized ? "Restore" : "Maximize"}
                    width={9} height={9} draggable={false}
                  />
                </motion.button>
                {/* Close */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => { e.stopPropagation(); onClose(); }}
                  className="w-[21px] h-[21px] flex items-center justify-center rounded-sm ml-[2px]"
                  style={{
                    background: "linear-gradient(180deg, #E87765 0%, #C5311D 50%, #C12B12 100%)",
                    border: "1px solid #fff",
                    borderBottom: "1px solid #9B1B0A",
                    borderRight: "1px solid #9B1B0A",
                  }}
                >
                  <Image src="/assets/close.png" alt="Close" width={9} height={9} draggable={false} />
                </motion.button>
              </div>
            </div>

            {/* Content Area */}
            <div
              className="flex-1 overflow-auto"
              style={{ background: "#ECE9D8", borderTop: "1px solid #0831D9" }}
            >
              <div className="p-3">{children}</div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
