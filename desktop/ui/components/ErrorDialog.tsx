"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import React from "react";

interface ErrorDialogProps {
  isOpen: boolean;
  title?: string;
  message: string;
  type?: "error" | "info" | "warning";
  onClose: () => void;
  onOk?: () => void;
}

export const ErrorDialog: React.FC<ErrorDialogProps> = ({
  isOpen,
  title,
  message,
  type = "error",
  onClose,
  onOk,
}) => {
  const config = {
    error: {
      icon: "/assets/error.png",
      defaultTitle: "Error",
      borderColor: "#CC0000",
      headerBg:
        "linear-gradient(180deg, #D44040 0%, #B82020 8%, #B41E1E 20%, #C53030 40%, #B82525 70%, #A81818 85%, #A01515 100%)",
    },
    info: {
      icon: "/assets/help.png",
      defaultTitle: "Information",
      borderColor: "#0055E5",
      headerBg:
        "linear-gradient(180deg, #0997FF 0%, #0053E0 8%, #0050DE 20%, #1466E5 40%, #0F5CDE 70%, #004BD5 85%, #0048CE 100%)",
    },
    warning: {
      icon: "/assets/error.png",
      defaultTitle: "Warning",
      borderColor: "#B87000",
      headerBg:
        "linear-gradient(180deg, #F0B030 0%, #D09010 8%, #C88808 20%, #D49818 40%, #C88800 70%, #B87800 85%, #A87000 100%)",
    },
  }[type];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="xp-overlay" onClick={onClose}>
          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.8, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: -10 }}
            transition={{
              type: "spring",
              stiffness: 500,
              damping: 30,
              mass: 0.6,
            }}
            style={{
              width: "360px",
              fontFamily: "Tahoma, Arial, sans-serif",
              fontSize: "11px",
              border: `2px solid ${config.borderColor}`,
              borderRadius: "6px 6px 0 0",
              overflow: "hidden",
              boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
            }}
          >
            {/* Title bar */}
            <div
              style={{
                background: config.headerBg,
                padding: "3px 5px 3px 8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                minHeight: "28px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <Image src={config.icon} alt={type} width={14} height={14} />
                <span
                  style={{
                    color: "#FFF",
                    fontWeight: "bold",
                    fontSize: "12px",
                    textShadow: "1px 1px 1px rgba(0,0,0,0.5)",
                  }}
                >
                  {title || config.defaultTitle}
                </span>
              </div>
              <button
                onClick={onClose}
                style={{
                  background:
                    "linear-gradient(180deg, #E87765 0%, #C5311D 50%, #C12B12 100%)",
                  border: "1px solid #fff",
                  borderBottom: "1px solid #9B1B0A",
                  borderRight: "1px solid #9B1B0A",
                  borderRadius: "2px",
                  width: "21px",
                  height: "21px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#FFF",
                  fontSize: "12px",
                  fontWeight: "bold",
                }}
              >
                ✕
              </button>
            </div>

            {/* Body */}
            <div
              style={{
                background: "#ECE9D8",
                padding: "16px",
                display: "flex",
                alignItems: "flex-start",
                gap: "12px",
                borderTop: `1px solid ${config.borderColor}`,
              }}
            >
              <Image src={config.icon} alt={type} width={32} height={32} style={{ flexShrink: 0 }} />
              <p style={{ margin: 0, lineHeight: "1.5", wordBreak: "break-word" }}>{message}</p>
            </div>

            {/* Footer */}
            <div
              style={{
                background: "#ECE9D8",
                padding: "8px 12px",
                borderTop: "1px solid #ACA899",
                display: "flex",
                justifyContent: "center",
                gap: "8px",
              }}
            >
              <button
                className="xp-button"
                onClick={onOk ?? onClose}
                style={{ minWidth: "70px" }}
                autoFocus
              >
                OK
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
