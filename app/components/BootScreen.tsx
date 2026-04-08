"use client";

import { motion, AnimatePresence } from "framer-motion";
import React, { useEffect, useState } from "react";

const BOOT_MESSAGES = [
  "Loading Windows XP Portfolio Edition...",
  "Initializing desktop environment...",
  "Loading applications...",
  "Restoring user preferences...",
  "Starting portfolio services...",
];

interface BootScreenProps {
  onComplete: () => void;
}

export const BootScreen: React.FC<BootScreenProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [messageIndex, setMessageIndex] = useState(0);
  const [phase, setPhase] = useState<"boot" | "logo" | "done">("logo");

  useEffect(() => {
    // Phase 1: Show logo briefly
    const logoTimer = setTimeout(() => {
      setPhase("boot");
    }, 800);

    return () => clearTimeout(logoTimer);
  }, []);

  useEffect(() => {
    if (phase !== "boot") return;

    const totalDuration = 2800; // ms
    const steps = 100;
    const stepTime = totalDuration / steps;

    let step = 0;
    const interval = setInterval(() => {
      step++;
      setProgress(step);

      // Update message at certain milestones
      const msgIdx = Math.floor((step / 100) * BOOT_MESSAGES.length);
      setMessageIndex(Math.min(msgIdx, BOOT_MESSAGES.length - 1));

      if (step >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setPhase("done");
          setTimeout(onComplete, 500);
        }, 400);
      }
    }, stepTime);

    return () => clearInterval(interval);
  }, [phase, onComplete]);

  return (
    <AnimatePresence>
      {phase !== "done" && (
        <motion.div
          key="boot"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          style={{
            position: "fixed",
            inset: 0,
            background: "#000000",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 999999,
            fontFamily: "Tahoma, Arial, sans-serif",
          }}
        >
          {/* Windows logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            style={{ marginBottom: "48px", textAlign: "center" }}
          >
            {/* XP-style Windows flag logo */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "4px",
                width: "64px",
                height: "64px",
                margin: "0 auto 16px",
                transform: "perspective(200px) rotateY(-10deg)",
              }}
            >
              {[
                { color: "#E74C3C" },
                { color: "#27AE60" },
                { color: "#3498DB" },
                { color: "#F39C12" },
              ].map((pane, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.08, duration: 0.3 }}
                  style={{
                    background: pane.color,
                    borderRadius: "2px",
                    boxShadow: `0 0 12px ${pane.color}80`,
                  }}
                />
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.4 }}
            >
              <div
                style={{
                  color: "#FFFFFF",
                  fontSize: "28px",
                  fontWeight: "300",
                  letterSpacing: "2px",
                  fontFamily: "Tahoma, Arial, sans-serif",
                }}
              >
                <span style={{ fontWeight: "700" }}>Windows</span>{" "}
                <span
                  style={{
                    fontStyle: "italic",
                    color: "#4FC3F7",
                    fontWeight: "400",
                  }}
                >
                  XP
                </span>
              </div>
              <div
                style={{
                  color: "#9E9E9E",
                  fontSize: "11px",
                  letterSpacing: "3px",
                  marginTop: "4px",
                  textTransform: "uppercase",
                }}
              >
                Portfolio Edition
              </div>
            </motion.div>
          </motion.div>

          {/* Progress bar section */}
          <AnimatePresence>
            {phase === "boot" && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                style={{ width: "280px", textAlign: "center" }}
              >
                {/* XP-style progress track */}
                <div
                  style={{
                    width: "100%",
                    height: "20px",
                    background: "#1a1a1a",
                    border: "1px solid #444",
                    borderRadius: "2px",
                    overflow: "hidden",
                    marginBottom: "12px",
                    position: "relative",
                  }}
                >
                  {/* Segmented XP-style fill */}
                  <div
                    style={{
                      position: "absolute",
                      top: "2px",
                      left: "2px",
                      bottom: "2px",
                      width: `calc(${progress}% - 4px)`,
                      display: "flex",
                      gap: "2px",
                      transition: "width 80ms linear",
                      overflow: "hidden",
                    }}
                  >
                    {Array.from({ length: 30 }).map((_, i) => (
                      <div
                        key={i}
                        style={{
                          minWidth: "8px",
                          flex: 1,
                          background:
                            "linear-gradient(180deg, #4FC3F7 0%, #0288D1 40%, #01579B 100%)",
                          borderRadius: "1px",
                        }}
                      />
                    ))}
                  </div>
                </div>

                <motion.div
                  key={messageIndex}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  style={{
                    color: "#9E9E9E",
                    fontSize: "11px",
                    letterSpacing: "0.3px",
                  }}
                >
                  {BOOT_MESSAGES[messageIndex]}
                </motion.div>

                <div
                  style={{
                    color: "#555",
                    fontSize: "10px",
                    marginTop: "6px",
                    fontStyle: "italic",
                  }}
                >
                  Copyright © 2026 Samriddha Kunwar
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
