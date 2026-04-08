"use client";

import React from "react";

export const ResumeWindow: React.FC = () => {
  return (
    <div
      style={{
        fontFamily: "Tahoma, Arial, sans-serif",
        fontSize: "11px",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        gap: "6px",
      }}
    >
      {/* Header toolbar */}
      <div
        className="xp-panel"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          padding: "6px 8px",
          flexShrink: 0,
        }}
      >
        <span style={{ fontSize: "20px" }}>📄</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: "bold", fontSize: "12px" }}>Resume.pdf</div>
          <div style={{ color: "#666" }}>Samriddha Kunwar — Full-Stack Developer</div>
        </div>
        <div style={{ display: "flex", gap: "6px", flexShrink: 0 }}>
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
            ⬇ Download PDF
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
            ↗ Open in Tab
          </a>
        </div>
      </div>

      {/* PDF Preview */}
      <div
        className="xp-inset"
        style={{
          flex: 1,
          minHeight: "320px",
          overflow: "hidden",
          position: "relative",
        }}
      >
        {/* Try to embed the PDF; show fallback if not available */}
        <object
          data="/resume.pdf"
          type="application/pdf"
          style={{ width: "100%", height: "100%", border: "none" }}
        >
          {/* Fallback when PDF not found */}
          <div
            style={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "12px",
              color: "#666",
              padding: "24px",
              textAlign: "center",
            }}
          >
            <span style={{ fontSize: "40px" }}>📋</span>
            <div>
              <div style={{ fontWeight: "bold", fontSize: "12px", marginBottom: "4px", color: "#333" }}>
                Resume Preview
              </div>
              <div style={{ lineHeight: "1.6", marginBottom: "10px" }}>
                <strong>Samriddha Kunwar</strong>
                <br />
                Full-Stack Developer | Web Developer | Open Source Contributor
                <br />
                <br />
                <span style={{ fontSize: "10px" }}>
                  📌 Add your <code>resume.pdf</code> to <code>/public/resume.pdf</code> to enable inline preview.
                </span>
              </div>
              <a
                href="/resume.pdf"
                download="Samriddha_Kunwar_Resume.pdf"
                className="xp-button"
                style={{ textDecoration: "none", color: "#000" }}
              >
                ⬇ Download Resume PDF
              </a>
            </div>
          </div>
        </object>
      </div>
    </div>
  );
};
