"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useRecycleBin } from "@/desktop/context/RecycleBinContext";

export const RecycleBinWindow: React.FC = () => {
  // ── All state lives in the shared context ──────────────────────────────────
  const { files, isEmpty, emptyBin, restoreFile } = useRecycleBin();

  const [selected, setSelected] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleEmpty = () => {
    emptyBin();
    setSelected(null);
    setShowConfirm(false);
  };

  const handleRestore = () => {
    if (!selected) return;
    restoreFile(selected);
    setSelected(null);
  };

  return (
    <div style={{ fontFamily: "Tahoma, Arial, sans-serif", fontSize: "11px", height: "100%", display: "flex", flexDirection: "column" }}>
      {/* Toolbar */}
      <div style={{ display: "flex", alignItems: "center", gap: "6px", padding: "4px 0", borderBottom: "1px solid #ACA899", marginBottom: "6px", flexShrink: 0 }}>
        <button
          className="xp-button"
          style={{ padding: "2px 8px", opacity: files.length === 0 ? 0.5 : 1, cursor: files.length === 0 ? "not-allowed" : "pointer" }}
          disabled={files.length === 0}
          onClick={() => setShowConfirm(true)}
        >
          🗑 Empty Recycle Bin
        </button>
        <button
          className="xp-button"
          style={{ padding: "2px 8px", opacity: !selected ? 0.5 : 1, cursor: !selected ? "not-allowed" : "pointer" }}
          disabled={!selected}
          onClick={handleRestore}
        >
          ↩ Restore Selected
        </button>
        {files.length > 0 && (
          <span style={{ color: "#666", fontSize: "10px", marginLeft: "auto" }}>
            💡 Double-click a file to restore it
          </span>
        )}
      </div>

      {/* Confirm dialog */}
      <AnimatePresence>
        {showConfirm && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(0,0,0,0.35)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 10,
            }}
          >
            <div className="xp-panel" style={{ width: 280, padding: "16px", boxShadow: "0 6px 24px rgba(0,0,0,0.4)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
                <Image src="/assets/Recycle_bin_full.webp" alt="" width={24} height={24} unoptimized />
                <strong>Confirm Delete</strong>
              </div>
              <p style={{ margin: "0 0 12px", color: "#333", lineHeight: "1.5" }}>
                Are you sure you want to permanently delete all {files.length} items in the Recycle Bin?
              </p>
              <div style={{ display: "flex", gap: "6px", justifyContent: "flex-end" }}>
                <button className="xp-button" onClick={handleEmpty}>Yes</button>
                <button className="xp-button" onClick={() => setShowConfirm(false)}>No</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* File list */}
      <div className="xp-inset" style={{ flex: 1, padding: "2px", overflowY: "auto" }}>
        {/* Header row */}
        {files.length > 0 && (
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 80px 90px",
            padding: "2px 6px",
            borderBottom: "1px solid #ACA899",
            fontWeight: "bold",
            background: "#D6D3C4",
            color: "#333",
            fontSize: "10px",
          }}>
            <span>Name</span>
            <span>Size</span>
            <span>Date Deleted</span>
          </div>
        )}

        {/* Empty state */}
        {isEmpty && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              display: "flex", flexDirection: "column", alignItems: "center",
              justifyContent: "center", gap: "10px", padding: "24px", textAlign: "center",
            }}
          >
            <Image src="/assets/recycling_bin.png" alt="Empty" width={48} height={48} draggable={false} unoptimized />
            <div>
              <div style={{ fontWeight: "bold", fontSize: "12px", color: "#333", marginBottom: "4px" }}>
                Recycle Bin is empty
              </div>
              <div style={{ color: "#666", lineHeight: "1.5" }}>
                Nothing here. Bad ideas? Gone forever. 🎉
              </div>
            </div>
          </motion.div>
        )}

        <AnimatePresence>
          {files.map((file) => (
            <motion.div
              key={file.name}
              initial={{ opacity: 1 }}
              exit={{ opacity: 0, x: -20, height: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setSelected(file.name)}
              onDoubleClick={() => {
                restoreFile(file.name);
                setSelected(null);
              }}
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 80px 90px",
                alignItems: "center",
                padding: "3px 6px",
                cursor: "default",
                background: selected === file.name ? "#316AC5" : "transparent",
                color: selected === file.name ? "#FFF" : "#000",
                userSelect: "none",
                fontSize: "11px",
              }}
            >
              <span style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                <span style={{ fontSize: "14px" }}>
                  {file.name.endsWith(".zip") ? "📦" :
                   file.name.endsWith(".docx") ? "📝" :
                   file.name.endsWith(".xlsx") ? "📊" :
                   file.name.endsWith(".md") ? "📋" : "📄"}
                </span>
                {file.name}
              </span>
              <span style={{ color: selected === file.name ? "#C8E0FF" : "#666", fontSize: "10px" }}>{file.size}</span>
              <span style={{ color: selected === file.name ? "#C8E0FF" : "#666", fontSize: "10px" }}>{file.date}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Status bar */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        marginTop: "4px",
        color: "#808080",
        paddingTop: "4px",
        borderTop: "1px solid #ACA899",
        flexShrink: 0,
      }}>
        <span>{files.length} object(s)</span>
        <span>{files.reduce((acc, f) => acc + parseInt(f.size), 0)} KB total</span>
      </div>
    </div>
  );
};
