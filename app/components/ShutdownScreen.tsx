"use client";

import { motion } from "framer-motion";
import React from "react";

export const ShutdownScreen: React.FC = () => {
  return (
    <motion.div
      key="shutdown"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
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
        userSelect: "none",
      }}
    >
      {/* Windows XP Flag logo */}
      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        style={{ marginBottom: "36px", textAlign: "center" }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "4px",
            width: "56px",
            height: "56px",
            margin: "0 auto 14px",
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
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.07, duration: 0.25 }}
              style={{
                background: pane.color,
                borderRadius: "2px",
                boxShadow: `0 0 10px ${pane.color}80`,
              }}
            />
          ))}
        </div>

        <div
          style={{
            color: "#FFFFFF",
            fontSize: "26px",
            fontWeight: "300",
            letterSpacing: "2px",
          }}
        >
          <span style={{ fontWeight: 700 }}>Windows</span>{" "}
          <span style={{ fontStyle: "italic", color: "#4FC3F7", fontWeight: 400 }}>
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

      {/* Shutdown message */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.4 }}
        style={{ textAlign: "center" }}
      >
        <div
          style={{
            color: "#CCCCCC",
            fontSize: "13px",
            letterSpacing: "0.5px",
            marginBottom: "20px",
          }}
        >
          It is now safe to turn off your computer.
        </div>

        {/* XP-style animated dots */}
        <div style={{ display: "flex", justifyContent: "center", gap: "6px" }}>
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{ opacity: [0.2, 1, 0.2] }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                delay: i * 0.3,
                ease: "easeInOut",
              }}
              style={{
                width: "10px",
                height: "10px",
                borderRadius: "50%",
                background: "linear-gradient(180deg, #4FC3F7 0%, #0288D1 100%)",
                boxShadow: "0 0 8px #4FC3F780",
              }}
            />
          ))}
        </div>

        <div
          style={{
            color: "#555",
            fontSize: "10px",
            marginTop: "16px",
            fontStyle: "italic",
          }}
        >
          Restarting automatically...
        </div>
      </motion.div>
    </motion.div>
  );
};
