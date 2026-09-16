"use client";

import React, { useRef, useState } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// Microsoft Word (Windows XP era) style tokens — visual redesign only.
// The document itself is still the real PDF, loaded exactly as before via an
// iframe pointed at /resume.pdf. Nothing about the file, its path, or the
// window chrome (XPWindow) is touched — only the content inside this window.
// ─────────────────────────────────────────────────────────────────────────────
const FONT = '"Tahoma", "Segoe UI", Arial, sans-serif';
const BEIGE = "#ECE9D8";

const MENU_ITEMS = ["File", "Edit", "View", "Insert", "Format", "Tools", "Table", "Window", "Help"];
const ZOOM_PRESETS = [50, 75, 100, 125, 150, 200];

// ── 16×16 flat XP-style toolbar icons (inline SVG, self-contained) ───────────
const ICONS: Record<string, React.ReactNode> = {
  New: (
    <svg width="16" height="16" viewBox="0 0 16 16">
      <path d="M3 1.5 h6.5 L12.5 4.5 V14.5 h-9.5 z" fill="#FFFFFF" stroke="#5A5A5A" />
      <path d="M9.5 1.5 V4.5 H12.5" fill="none" stroke="#5A5A5A" />
      <line x1="5" y1="7" x2="10.5" y2="7" stroke="#B7B7B7" />
      <line x1="5" y1="9" x2="10.5" y2="9" stroke="#B7B7B7" />
      <line x1="5" y1="11" x2="10.5" y2="11" stroke="#B7B7B7" />
    </svg>
  ),
  Open: (
    <svg width="16" height="16" viewBox="0 0 16 16">
      <path d="M1.5 4 h4 l1.2 1.4 h6.3 v1.1 h-11.5 z" fill="#F5CD6E" stroke="#8A6D1F" />
      <path d="M1.2 6.2 h12.6 l-1.4 6.3 h-9.8 z" fill="#FFE9A8" stroke="#8A6D1F" />
    </svg>
  ),
  Save: (
    <svg width="16" height="16" viewBox="0 0 16 16">
      <path d="M2 2 h9 l3 3 v9 h-12 z" fill="#3066C0" stroke="#1B3F80" />
      <rect x="4" y="2.5" width="6" height="4" fill="#D8E4F5" stroke="#1B3F80" />
      <rect x="8" y="3" width="1.5" height="3" fill="#1B3F80" />
      <rect x="4" y="9" width="8" height="4.5" fill="#EAF1FB" stroke="#1B3F80" />
    </svg>
  ),
  Print: (
    <svg width="16" height="16" viewBox="0 0 16 16">
      <rect x="3.5" y="2" width="9" height="5" fill="#FFFFFF" stroke="#7A7A7A" />
      <rect x="1.5" y="6" width="13" height="6" rx="1" fill="#C9C9C9" stroke="#6E6E6E" />
      <rect x="3.5" y="10" width="9" height="4" fill="#FFFFFF" stroke="#7A7A7A" />
      <circle cx="12.5" cy="8" r="0.8" fill="#1A7D1A" />
    </svg>
  ),
  Cut: (
    <svg width="16" height="16" viewBox="0 0 16 16">
      <line x1="4" y1="4" x2="13" y2="13" stroke="#6E6E6E" strokeWidth="1.2" />
      <line x1="13" y1="4" x2="4" y2="13" stroke="#6E6E6E" strokeWidth="1.2" />
      <circle cx="3.5" cy="11.5" r="2" fill="#E9E9E9" stroke="#5A5A5A" />
      <circle cx="3.5" cy="4.5" r="2" fill="#E9E9E9" stroke="#5A5A5A" />
    </svg>
  ),
  Copy: (
    <svg width="16" height="16" viewBox="0 0 16 16">
      <rect x="2" y="2" width="8" height="10" fill="#FFFFFF" stroke="#5A7FB0" />
      <rect x="5" y="4.5" width="9" height="10" fill="#FFFFFF" stroke="#5A7FB0" />
      <line x1="7" y1="7" x2="12" y2="7" stroke="#9AB0CC" />
      <line x1="7" y1="9.5" x2="12" y2="9.5" stroke="#9AB0CC" />
      <line x1="7" y1="12" x2="12" y2="12" stroke="#9AB0CC" />
    </svg>
  ),
  Paste: (
    <svg width="16" height="16" viewBox="0 0 16 16">
      <rect x="2.5" y="3" width="11" height="11" fill="#C8A96B" stroke="#7A5B2A" />
      <rect x="5" y="2" width="6" height="2.5" rx="0.5" fill="#9A9A9A" stroke="#5A5A5A" />
      <rect x="4.5" y="5.5" width="7" height="7.5" fill="#FFFFFF" stroke="#7A5B2A" />
      <line x1="6" y1="7.5" x2="10" y2="7.5" stroke="#B7B7B7" />
      <line x1="6" y1="9.5" x2="10" y2="9.5" stroke="#B7B7B7" />
    </svg>
  ),
  Undo: (
    <svg width="16" height="16" viewBox="0 0 16 16">
      <path d="M4 6.5 H10 a3.5 3.5 0 0 1 0 7 H7" fill="none" stroke="#3B5FA0" strokeWidth="1.3" />
      <path d="M6 3.5 L2.5 6.5 L6 9.5" fill="none" stroke="#3B5FA0" strokeWidth="1.3" strokeLinejoin="round" />
    </svg>
  ),
  Redo: (
    <svg width="16" height="16" viewBox="0 0 16 16">
      <path d="M12 6.5 H6 a3.5 3.5 0 0 0 0 7 H9" fill="none" stroke="#3B5FA0" strokeWidth="1.3" />
      <path d="M10 3.5 L13.5 6.5 L10 9.5" fill="none" stroke="#3B5FA0" strokeWidth="1.3" strokeLinejoin="round" />
    </svg>
  ),
};

// Small dropdown-style field used for the (visual only) Style / Font / Size boxes
const DropField: React.FC<{ value: string; width: number }> = ({ value, width }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      width,
      height: 20,
      background: "#FFFFFF",
      border: "1px solid",
      borderColor: "#808080 #FFFFFF #FFFFFF #808080",
      fontSize: "11px",
      padding: "0 3px",
      color: "#000000",
      overflow: "hidden",
      whiteSpace: "nowrap",
      flexShrink: 0,
    }}
  >
    <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis" }}>{value}</span>
    <span
      style={{
        borderLeft: "1px solid #ACA899",
        paddingLeft: "3px",
        marginLeft: "3px",
        color: "#555",
        fontSize: "9px",
      }}
    >
      ▾
    </span>
  </div>
);

const ToolbarButton: React.FC<{
  label: string;
  icon: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  active?: boolean;
}> = ({ label, icon, onClick, disabled, active }) => (
  <button
    type="button"
    className="oe-tool-btn"
    title={label}
    onClick={onClick}
    disabled={disabled}
    tabIndex={-1}
    style={{
      opacity: disabled ? 0.4 : 1,
      background: active ? "#DAD8C8" : undefined,
      borderColor: active ? "#808080 #FFFFFF #FFFFFF #808080" : undefined,
      minWidth: "auto",
      padding: "3px 5px",
    }}
  >
    <span style={{ width: 16, height: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>
      {icon}
    </span>
  </button>
);

const GlyphButton: React.FC<{ label: string; style?: React.CSSProperties }> = ({ label, style }) => (
  <button
    type="button"
    className="oe-tool-btn"
    title={label}
    disabled
    tabIndex={-1}
    style={{ opacity: 0.45, minWidth: "auto", width: 22, padding: "2px 0", fontWeight: "bold", ...style }}
  >
    {label}
  </button>
);

const ToolbarSeparator: React.FC = () => (
  <span
    style={{
      width: "1px",
      margin: "2px 3px",
      background: "#ACA899",
      boxShadow: "1px 0 0 #FFFFFF",
      alignSelf: "stretch",
    }}
  />
);

const StatusSegment: React.FC<{ children: React.ReactNode; width?: number; grow?: boolean }> = ({
  children,
  width,
  grow,
}) => (
  <div
    style={{
      flex: grow ? 1 : undefined,
      width: grow ? undefined : width,
      height: "100%",
      display: "flex",
      alignItems: "center",
      padding: "0 6px",
      border: "1px solid",
      borderColor: "#808080 #FFFFFF #FFFFFF #808080",
      color: "#000000",
      overflow: "hidden",
      whiteSpace: "nowrap",
      textOverflow: "ellipsis",
      flexShrink: 0,
    }}
  >
    {children}
  </div>
);

export const ResumeWindow: React.FC = () => {
  const [zoom, setZoom] = useState(100);
  const [zoomMenuOpen, setZoomMenuOpen] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const adjustZoom = (delta: number) => {
    setZoom((prev) => Math.min(200, Math.max(50, prev + delta)));
  };

  const handlePrint = () => {
    try {
      iframeRef.current?.contentWindow?.focus();
      iframeRef.current?.contentWindow?.print();
    } catch {
      window.open("/resume.pdf", "_blank", "noopener,noreferrer");
    }
  };

  const handleOpenTab = () => {
    window.open("/resume.pdf", "_blank", "noopener,noreferrer");
  };

  const handleDownload = () => {
    const a = document.createElement("a");
    a.href = "/resume.pdf";
    a.download = "Samriddha_Kunwar_Data_Analyst_CV.pdf";
    a.click();
  };

  return (
    // Neutralise the XPWindow's p-3 padding so the Word chrome fills edge-to-edge.
    <div
      style={{
        margin: -12,
        height: "calc(100% + 24px)",
        display: "flex",
        flexDirection: "column",
        background: BEIGE,
        fontFamily: FONT,
        fontSize: "11px",
        color: "#000000",
        overflow: "hidden",
      }}
      onClick={() => zoomMenuOpen && setZoomMenuOpen(false)}
    >
      {/* ── Menu bar ─────────────────────────────────────────────────────────── */}
      <div
        style={{
          display: "flex",
          gap: "2px",
          padding: "2px 4px",
          background: BEIGE,
          borderBottom: "1px solid #ACA899",
          userSelect: "none",
        }}
      >
        {MENU_ITEMS.map((m) => (
          <span key={m} className="oe-menu-item">
            <u>{m[0]}</u>
            {m.slice(1)}
          </span>
        ))}
      </div>

      {/* ── Standard toolbar ─────────────────────────────────────────────────── */}
      <div
        style={{
          display: "flex",
          alignItems: "stretch",
          gap: "1px",
          padding: "3px 4px",
          background: BEIGE,
          borderBottom: "1px solid #ACA899",
          boxShadow: "inset 0 1px 0 #FFFFFF",
          userSelect: "none",
          flexWrap: "wrap",
        }}
      >
        <ToolbarButton label="New (unavailable)" icon={ICONS.New} disabled />
        <ToolbarButton label="Open in new tab" icon={ICONS.Open} onClick={handleOpenTab} />
        <ToolbarButton label="Save / Download" icon={ICONS.Save} onClick={handleDownload} />
        <ToolbarSeparator />
        <ToolbarButton label="Print" icon={ICONS.Print} onClick={handlePrint} />
        <ToolbarSeparator />
        <ToolbarButton label="Cut (unavailable)" icon={ICONS.Cut} disabled />
        <ToolbarButton label="Copy (unavailable)" icon={ICONS.Copy} disabled />
        <ToolbarButton label="Paste (unavailable)" icon={ICONS.Paste} disabled />
        <ToolbarSeparator />
        <ToolbarButton label="Undo (unavailable)" icon={ICONS.Undo} disabled />
        <ToolbarButton label="Redo (unavailable)" icon={ICONS.Redo} disabled />
        <ToolbarSeparator />

        {/* Zoom control */}
        <div style={{ display: "flex", alignItems: "center", gap: "2px", position: "relative" }}>
          <ToolbarButton label="Zoom Out" icon={<span style={{ fontSize: 13, fontWeight: "bold" }}>−</span>} onClick={() => adjustZoom(-10)} />
          <div
            onClick={(e) => {
              e.stopPropagation();
              setZoomMenuOpen((v) => !v);
            }}
            title="Zoom"
            style={{
              display: "flex",
              alignItems: "center",
              height: 20,
              minWidth: 52,
              justifyContent: "center",
              gap: "3px",
              background: "#FFFFFF",
              border: "1px solid",
              borderColor: "#808080 #FFFFFF #FFFFFF #808080",
              fontSize: "11px",
              fontWeight: "bold",
              cursor: "pointer",
              userSelect: "none",
              padding: "0 4px",
            }}
          >
            <span>{zoom}%</span>
            <span style={{ fontSize: "9px", color: "#555" }}>▾</span>
          </div>
          {zoomMenuOpen && (
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                position: "absolute",
                top: "100%",
                left: 0,
                marginTop: "1px",
                background: "#FFFFFF",
                border: "1px solid #808080",
                boxShadow: "2px 2px 4px rgba(0,0,0,0.3)",
                zIndex: 20,
                minWidth: 60,
              }}
            >
              {ZOOM_PRESETS.map((p) => (
                <div
                  key={p}
                  onClick={() => {
                    setZoom(p);
                    setZoomMenuOpen(false);
                  }}
                  className="oe-menu-item"
                  style={{ display: "block", padding: "2px 10px" }}
                >
                  {p}%
                </div>
              ))}
            </div>
          )}
          <ToolbarButton label="Zoom In" icon={<span style={{ fontSize: 13, fontWeight: "bold" }}>+</span>} onClick={() => adjustZoom(10)} />
        </div>
      </div>

      {/* ── Formatting toolbar (visual only — document is a fixed PDF) ──────────── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "3px",
          padding: "3px 4px",
          background: BEIGE,
          borderBottom: "1px solid #ACA899",
          userSelect: "none",
          flexWrap: "wrap",
        }}
      >
        <DropField value="Normal" width={70} />
        <DropField value="Times New Roman" width={100} />
        <DropField value="12" width={32} />
        <ToolbarSeparator />
        <GlyphButton label="Bold" style={{ fontStyle: "normal" }} />
        <GlyphButton label="Italic" style={{ fontStyle: "italic" }} />
        <GlyphButton label="Underline" style={{ textDecoration: "underline" }} />
        <ToolbarSeparator />
        <GlyphButton label="Align Left" style={{ fontWeight: "normal" }} />
        <GlyphButton label="Center" style={{ fontWeight: "normal" }} />
        <GlyphButton label="Align Right" style={{ fontWeight: "normal" }} />
        <GlyphButton label="Justify" style={{ fontWeight: "normal" }} />
      </div>

      {/* ── Horizontal ruler ─────────────────────────────────────────────────── */}
      <div
        style={{
          height: "16px",
          flexShrink: 0,
          background: "#FFFFFF",
          borderBottom: "1px solid #ACA899",
          backgroundImage:
            "repeating-linear-gradient(90deg, #8A8A8A 0, #8A8A8A 1px, transparent 1px, transparent 8px), repeating-linear-gradient(90deg, #4A4A4A 0, #4A4A4A 1px, transparent 1px, transparent 40px)",
          backgroundSize: "8px 5px, 40px 9px",
          backgroundPosition: "left 4px, left bottom",
          backgroundRepeat: "repeat-x, repeat-x",
        }}
      />

      {/* ── Document workspace ───────────────────────────────────────────────── */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden", minHeight: 0 }}>
        {/* Vertical ruler */}
        <div
          style={{
            width: "16px",
            flexShrink: 0,
            background: "#FFFFFF",
            borderRight: "1px solid #ACA899",
            backgroundImage:
              "repeating-linear-gradient(180deg, #8A8A8A 0, #8A8A8A 1px, transparent 1px, transparent 8px), repeating-linear-gradient(180deg, #4A4A4A 0, #4A4A4A 1px, transparent 1px, transparent 40px)",
            backgroundSize: "5px 8px, 9px 40px",
            backgroundPosition: "left top, left top",
            backgroundRepeat: "repeat-y, repeat-y",
          }}
        />

        {/* Gray workspace with centered white page */}
        <div
          style={{
            flex: 1,
            overflow: "auto",
            background: "#808080",
            display: "flex",
            justifyContent: "center",
            padding: "18px 24px",
          }}
        >
          <div
            style={{
              width: `${zoom}%`,
              minWidth: "420px",
              maxWidth: "1000px",
              height: "fit-content",
              flexShrink: 0,
              boxShadow: "0 0 0 1px #666, 0 4px 18px rgba(0,0,0,0.4)",
              background: "#fff",
            }}
          >
            <iframe
              ref={iframeRef}
              src="/resume.pdf#toolbar=0&navpanes=0&statusbar=0&view=FitH"
              title="Samriddha Kunwar Data Analyst CV"
              style={{
                width: "100%",
                height: "calc(100vh - 220px)",
                minHeight: "440px",
                border: "none",
                display: "block",
              }}
            />
          </div>
        </div>
      </div>

      {/* ── Status bar ───────────────────────────────────────────────────────── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          height: "20px",
          flexShrink: 0,
          background: BEIGE,
          borderTop: "1px solid #FFFFFF",
          boxShadow: "inset 0 1px 0 #ACA899",
          userSelect: "none",
        }}
      >
        <StatusSegment width={54}>Page 1</StatusSegment>
        <StatusSegment width={50}>Sec 1</StatusSegment>
        <StatusSegment width={54}>1/1</StatusSegment>
        <StatusSegment width={92}>At 1&quot;  Ln 1  Col 1</StatusSegment>
        <StatusSegment grow>Samriddha_Kunwar_Data_Analyst_CV.pdf</StatusSegment>
        <StatusSegment width={92}>English (U.S.)</StatusSegment>
        <StatusSegment width={64}>{zoom}%</StatusSegment>
      </div>
    </div>
  );
};
