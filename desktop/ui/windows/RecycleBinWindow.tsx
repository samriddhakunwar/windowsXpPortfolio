"use client";

import React from "react";
import Image from "next/image";

export const RecycleBinWindow: React.FC = () => {
  return (
    <div style={{ fontFamily: "Tahoma, Arial, sans-serif", fontSize: "11px" }}>
      {/* Toolbar area */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "6px",
          padding: "4px 0",
          borderBottom: "1px solid #ACA899",
          marginBottom: "8px",
        }}
      >
        <button className="xp-button" style={{ padding: "2px 8px", opacity: 0.5, cursor: "not-allowed" }} disabled>
          Empty Recycle Bin
        </button>
        <button className="xp-button" style={{ padding: "2px 8px", opacity: 0.5, cursor: "not-allowed" }} disabled>
          Restore All Items
        </button>
      </div>

      {/* Empty state */}
      <div
        className="xp-inset"
        style={{
          minHeight: "200px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "12px",
          padding: "24px",
        }}
      >
        <Image
          src="/assets/recycling_bin.png"
          alt="Recycle Bin"
          width={48}
          height={48}
          draggable={false}
        />
        <div style={{ textAlign: "center" }}>
          <div style={{ fontWeight: "bold", fontSize: "12px", marginBottom: "4px" }}>
            Recycle Bin is empty
          </div>
          <div style={{ color: "#666", lineHeight: "1.5" }}>
            No deleted files here. Everything you value is still intact! 🎉
          </div>
        </div>
      </div>

      {/* Status bar */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "6px",
          color: "#808080",
          paddingTop: "4px",
          borderTop: "1px solid #ACA899",
        }}
      >
        <span>0 object(s)</span>
        <span>0 bytes</span>
      </div>
    </div>
  );
};
