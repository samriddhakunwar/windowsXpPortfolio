"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import React, { useCallback, useRef } from "react";

interface XPWindowProps {
  id: string;
  title: string;
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
  onFocus?: () => void;
  zIndex?: number;
  taskbarButtonRef?: React.RefObject<HTMLElement>;
}

export const XPWindow: React.FC<XPWindowProps> = ({
  id,
  title,
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
  onFocus,
  zIndex = 10,
}) => {
  const dragRef = useRef<{
    startX: number;
    startY: number;
    origX: number;
    origY: number;
  } | null>(null);
  const posRef = useRef({ x, y });

  // Keep posRef in sync with props
  posRef.current = { x, y };

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
        const newX = Math.max(-width / 2, dragRef.current.origX + dx);
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
    [isMaximized, onFocus, onDragEnd, width],
  );

  const handleTitleBarDoubleClick = useCallback(
    (e: React.MouseEvent) => {
      if ((e.target as HTMLElement).closest("button")) return;
      onMaximize();
    },
    [onMaximize],
  );

  const focused = isFocused;

  const windowVariants = {
    hidden: {
      opacity: 0,
      scale: 0.88,
      y: 20,
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring" as const,
        stiffness: 380,
        damping: 28,
        mass: 0.8,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.88,
      y: 12,
      transition: {
        duration: 0.18,
        ease: [0.4, 0, 1, 1],
      },
    },
  };

  const minimizeVariants = {
    hidden: {
      opacity: 0,
      scale: 0.5,
      y: 60,
      transition: {
        duration: 0.2,
        ease: [0.4, 0, 1, 1],
      },
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring" as const,
        stiffness: 400,
        damping: 30,
      },
    },
  };

  return (
    <AnimatePresence mode="wait">
      {!isMinimized && (
        <motion.div
          key={id}
          variants={windowVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          style={{
            position: "fixed",
            left: isMaximized ? 0 : x,
            top: isMaximized ? 0 : y,
            width: isMaximized ? "100vw" : width,
            height: isMaximized ? "calc(100vh - 40px)" : height,
            zIndex,
          }}
          className="flex flex-col"
          onMouseDown={() => onFocus?.()}
        >
          {/* Window frame */}
          <div
            className="flex flex-col h-full"
            style={{
              borderRadius: "8px 8px 0 0",
              border: focused
                ? "2px solid #0055E5"
                : "2px solid #9B9DA2",
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
                padding: "3px 5px 3px 8px",
                minHeight: "28px",
                transition: "background 200ms ease",
              }}
              className="flex items-center justify-between cursor-move select-none"
            >
              <span
                className="text-white text-xs font-bold truncate flex-1"
                style={{
                  textShadow: focused
                    ? "1px 1px 1px rgba(0,0,0,0.6)"
                    : "1px 1px 1px rgba(0,0,0,0.3)",
                }}
              >
                {title}
              </span>
              <div className="flex gap-[2px] ml-2">
                {/* Minimize */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onMinimize();
                  }}
                  className="w-[21px] h-[21px] flex items-center justify-center rounded-sm"
                  style={{
                    background:
                      "linear-gradient(180deg, #3C8CF6 0%, #0E59CE 50%, #0853C2 100%)",
                    border: "1px solid #fff",
                    borderBottom: "1px solid #0241A0",
                    borderRight: "1px solid #0241A0",
                  }}
                >
                  <Image
                    src="/assets/minimise.png"
                    alt="Minimize"
                    width={9}
                    height={9}
                    draggable={false}
                  />
                </motion.button>
                {/* Maximize/Restore */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onMaximize();
                  }}
                  className="w-[21px] h-[21px] flex items-center justify-center rounded-sm"
                  style={{
                    background:
                      "linear-gradient(180deg, #3C8CF6 0%, #0E59CE 50%, #0853C2 100%)",
                    border: "1px solid #fff",
                    borderBottom: "1px solid #0241A0",
                    borderRight: "1px solid #0241A0",
                  }}
                >
                  <Image
                    src={
                      isMaximized
                        ? "/assets/resize.png"
                        : "/assets/maximise.png"
                    }
                    alt={isMaximized ? "Restore" : "Maximize"}
                    width={9}
                    height={9}
                    draggable={false}
                  />
                </motion.button>
                {/* Close */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onClose();
                  }}
                  className="w-[21px] h-[21px] flex items-center justify-center rounded-sm ml-[2px]"
                  style={{
                    background:
                      "linear-gradient(180deg, #E87765 0%, #C5311D 50%, #C12B12 100%)",
                    border: "1px solid #fff",
                    borderBottom: "1px solid #9B1B0A",
                    borderRight: "1px solid #9B1B0A",
                  }}
                >
                  <Image
                    src="/assets/close.png"
                    alt="Close"
                    width={9}
                    height={9}
                    draggable={false}
                  />
                </motion.button>
              </div>
            </div>

            {/* Content Area */}
            <div
              className="flex-1 overflow-auto"
              style={{
                background: "#ECE9D8",
                borderTop: "1px solid #0831D9",
              }}
            >
              <div className="p-3">{children}</div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
