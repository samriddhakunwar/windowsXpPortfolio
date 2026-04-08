"use client";

import React from "react";
import Image from "next/image";

export const HelpWindow: React.FC = () => {
  const sysInfo = [
    { label: "System", value: "Windows XP Portfolio Edition" },
    { label: "Version", value: "1.0.0 (Build 2026.04)" },
    { label: "Developer", value: "Samriddha Kunwar" },
    { label: "Framework", value: "Next.js 16 + React 19" },
    { label: "Language", value: "TypeScript 5" },
    { label: "Animation", value: "Framer Motion 11" },
    { label: "Processor", value: "Your CPU @ Your GHz" },
    { label: "RAM", value: "Your browser's memory" },
  ];

  return (
    <div style={{ fontFamily: "Tahoma, Arial, sans-serif", fontSize: "11px" }}>
      {/* Header */}
      <div
        style={{
          background: "linear-gradient(180deg, #0068C0 0%, #0050A0 100%)",
          padding: "10px 12px",
          borderRadius: "4px 4px 0 0",
          marginBottom: "8px",
          display: "flex",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <Image src="/assets/help.png" alt="Help" width={28} height={28} />
        <div>
          <div style={{ color: "#FFF", fontWeight: "bold", fontSize: "13px" }}>
            Windows XP Portfolio Help &amp; Support Center
          </div>
          <div style={{ color: "#C8E0FF", fontSize: "10px" }}>
            Find answers, credits, and system information
          </div>
        </div>
      </div>

      {/* System Info */}
      <div className="xp-panel" style={{ marginBottom: "8px" }}>
        <div style={{ fontWeight: "bold", marginBottom: "8px", fontSize: "12px" }}>
          🖥 System Information
        </div>
        <div
          className="xp-inset"
          style={{ padding: "6px 8px" }}
        >
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <tbody>
              {sysInfo.map((row) => (
                <tr key={row.label}>
                  <td style={{ padding: "2px 8px 2px 0", fontWeight: "bold", color: "#333", whiteSpace: "nowrap" }}>
                    {row.label}:
                  </td>
                  <td style={{ padding: "2px 0", color: "#555" }}>{row.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Credits */}
      <div className="xp-panel" style={{ marginBottom: "8px" }}>
        <div style={{ fontWeight: "bold", marginBottom: "6px", fontSize: "12px" }}>🙏 Credits</div>
        <div style={{ lineHeight: "1.8", color: "#333" }}>
          <div>Designed &amp; Developed by <strong>Samriddha Kunwar</strong></div>
          <div>Windows XP UI inspired by Microsoft Corporation</div>
          <div>Icons from original XP icon set</div>
          <div>Background: Windows XP &ldquo;Luna&rdquo; wallpaper style</div>
        </div>
      </div>

      {/* Links */}
      <div style={{ display: "flex", gap: "6px" }}>
        <a
          href="https://github.com/samriddhakunwar/windowsXpPortfolio"
          target="_blank"
          rel="noopener noreferrer"
          className="xp-button"
          style={{ textDecoration: "none", color: "#000", display: "inline-flex", alignItems: "center", gap: "4px" }}
        >
          <Image src="/assets/github.png" alt="" width={14} height={14} />
          View Source Code
        </a>
        <a
          href="https://linkedin.com/in/samriddhakunwar"
          target="_blank"
          rel="noopener noreferrer"
          className="xp-button"
          style={{ textDecoration: "none", color: "#000", display: "inline-flex", alignItems: "center", gap: "4px" }}
        >
          <Image src="/assets/linkedin.png" alt="" width={14} height={14} />
          LinkedIn
        </a>
      </div>
    </div>
  );
};
