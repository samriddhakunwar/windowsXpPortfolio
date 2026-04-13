"use client";

import React, { useState } from "react";

export const ResumeWindow: React.FC = () => {
  const [zoom, setZoom] = useState(100);

  const adjustZoom = (delta: number) => {
    setZoom((prev) => Math.min(200, Math.max(50, prev + delta)));
  };

  const resetZoom = () => setZoom(100);

  return (
    <div
      style={{
        fontFamily: "Tahoma, Arial, sans-serif",
        fontSize: "11px",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        gap: "0",
        background: "#F0F0F0",
      }}
    >
      {/* Header toolbar */}
      <div
        className="xp-panel"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          padding: "5px 8px",
          flexShrink: 0,
          borderBottom: "1px solid #ACA899",
        }}
      >
        <span style={{ fontSize: "18px" }}>📄</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: "bold", fontSize: "12px" }}>Resume.pdf</div>
          <div style={{ color: "#666" }}>Samriddha Kunwar — Full-Stack Developer</div>
        </div>

        {/* Zoom controls */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "4px",
            flexShrink: 0,
            marginRight: "6px",
          }}
        >
          <button
            className="xp-button"
            onClick={() => adjustZoom(-10)}
            title="Zoom Out"
            style={{ padding: "2px 7px", fontSize: "13px", lineHeight: 1 }}
          >
            −
          </button>
          <span
            onClick={resetZoom}
            title="Reset zoom"
            style={{
              minWidth: "38px",
              textAlign: "center",
              cursor: "pointer",
              fontSize: "11px",
              fontWeight: "bold",
              color: "#333",
              padding: "2px 4px",
              border: "1px solid #ACA899",
              borderRadius: "2px",
              background: "#ECE9D8",
              userSelect: "none",
            }}
          >
            {zoom}%
          </span>
          <button
            className="xp-button"
            onClick={() => adjustZoom(10)}
            title="Zoom In"
            style={{ padding: "2px 7px", fontSize: "13px", lineHeight: 1 }}
          >
            +
          </button>
        </div>

        {/* Action buttons */}
        <div style={{ display: "flex", gap: "5px", flexShrink: 0 }}>
          <a
            href="/resume.pdf"
            download="Samriddha_Kunwar_Resume.pdf"
            className="xp-button"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
              textDecoration: "none",
              color: "#000",
              padding: "3px 10px",
            }}
          >
            ⬇ Download
          </a>
          <a
            href="/resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="xp-button"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
              textDecoration: "none",
              color: "#000",
              padding: "3px 10px",
            }}
          >
            ↗ Open Tab
          </a>
        </div>
      </div>

      {/* PDF viewer — iframe for crisp, native rendering */}
      <div
        style={{
          flex: 1,
          overflow: "auto",
          background: "#525659",
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          padding: "12px",
        }}
      >
        <div
          style={{
            width: `${zoom}%`,
            minWidth: "480px",
            maxWidth: "1200px",
            height: "auto",
            boxShadow: "0 4px 24px rgba(0,0,0,0.5)",
            background: "#fff",
          }}
        >
          <iframe
            src={`/resume.pdf#toolbar=1&navpanes=0&scrolling=no&view=FitH`}
            title="Samriddha Kunwar Resume"
            style={{
              width: "100%",
              height: "calc(100vh - 120px)",
              minHeight: "480px",
              border: "none",
              display: "block",
              imageRendering: "auto",
            }}
          />
        </div>
      </div>
    </div>
  );
};
