"use client";

import React, { useState } from "react";

type Status = "idle" | "loading" | "success" | "error";

type FieldErrors = {
  name?: string;
  email?: string;
  message?: string;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(data: { name: string; email: string; message: string }): FieldErrors {
  const errors: FieldErrors = {};
  if (data.name.trim().length < 2) {
    errors.name = "Name must be at least 2 characters.";
  }
  if (!EMAIL_RE.test(data.email.trim())) {
    errors.email = "Please enter a valid email address.";
  }
  if (data.message.trim().length < 10) {
    errors.message = "Message must be at least 10 characters.";
  }
  return errors;
}

// ─────────────────────────────────────────────────────────────────────────────
// Outlook Express style tokens
// ─────────────────────────────────────────────────────────────────────────────
const FONT = '"Tahoma", "Segoe UI", Arial, sans-serif';
const BEIGE = "#ECE9D8";
const SUNKEN_BORDER = "2px solid"; // colors set per element via borderColor

// White, sunken XP inset field
const insetStyle: React.CSSProperties = {
  background: "#ffffff",
  border: SUNKEN_BORDER,
  borderColor: "#7F9DB9 #FFFFFF #FFFFFF #7F9DB9",
  color: "#000000",
  caretColor: "#000000",
  fontFamily: FONT,
  fontSize: "11px",
  padding: "2px 4px",
  outline: "none",
};

// Flat raised gray button (used for the To:/Cc: recipient buttons)
const raisedButton: React.CSSProperties = {
  background: BEIGE,
  border: "1px solid",
  borderColor: "#FFFFFF #808080 #808080 #FFFFFF",
  color: "#000000",
  fontFamily: FONT,
  fontSize: "11px",
  padding: "1px 8px",
  cursor: "default",
  textAlign: "left",
  whiteSpace: "nowrap",
};

const MENU_ITEMS = ["File", "Edit", "View", "Insert", "Format", "Tools", "Message", "Help"];

// ── 16×16 flat XP-style toolbar icons (inline SVG, self-contained) ────────────
const ICONS: Record<string, React.ReactNode> = {
  Send: (
    <svg width="16" height="16" viewBox="0 0 16 16">
      <rect x="1" y="3.5" width="11" height="8" fill="#FFFDF0" stroke="#7A7A55" />
      <path d="M1 3.5 L6.5 8 L12 3.5" fill="none" stroke="#7A7A55" />
      <path d="M8 12 h6 M12 9.5 L14.5 12 L12 14.5" fill="none" stroke="#1A7D1A" strokeWidth="1.5" />
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
  Attach: (
    <svg width="16" height="16" viewBox="0 0 16 16">
      <path
        d="M11 4.5 L6 9.5 a2 2 0 0 0 3 3 L13 8 a3.2 3.2 0 0 0 -4.6 -4.6 L4 7.8 a1.2 1.2 0 0 0 0 1.7"
        fill="none"
        stroke="#7A7A7A"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  ),
};

export const ContactWindow: React.FC = () => {
  // ── State / hooks / logic — unchanged from the original implementation ──────
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [touched, setTouched] = useState(false);

  const update = (field: keyof typeof formData, value: string) => {
    const next = { ...formData, [field]: value };
    setFormData(next);
    if (touched) setFieldErrors(validate(next));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const errors = validate(formData);
    setTouched(true);
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) {
      return; // Prevent submission while invalid.
    }

    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          subject: formData.subject.trim(),
          message: formData.message.trim(),
        }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMsg(data.error || "Failed to send message. Please try again later.");
        setStatus("error");
        return;
      }

      setStatus("success");
      setFormData({ name: "", email: "", subject: "", message: "" });
      setFieldErrors({});
      setTouched(false);
      setTimeout(() => setStatus("idle"), 6000);
    } catch {
      setErrorMsg("Failed to send message. Please try again later.");
      setStatus("error");
    }
  };

  const loading = status === "loading";

  // ── Status-bar text driven by the existing state machine ────────────────────
  let statusText = "Ready";
  if (loading) statusText = "Sending message...";
  else if (status === "success") statusText = "Message sent successfully";
  else if (status === "error") statusText = errorMsg || "Failed to send message";
  else if (touched && Object.keys(fieldErrors).length > 0)
    statusText = fieldErrors.name || fieldErrors.email || fieldErrors.message || "";

  const invalidBorder = (key: keyof FieldErrors): React.CSSProperties =>
    touched && fieldErrors[key]
      ? { borderColor: "#C5311D #E8A99F #E8A99F #C5311D" }
      : {};

  return (
    // Neutralise the XPWindow's p-3 padding so the OE chrome fills edge-to-edge.
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

      {/* ── Toolbar ──────────────────────────────────────────────────────────── */}
      <form onSubmit={handleSubmit} style={{ display: "contents" }}>
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
          }}
        >
          <ToolbarButton label="Send" icon={ICONS.Send} type="submit" disabled={loading} primary />
          <ToolbarSeparator />
          <ToolbarButton label="Save" icon={ICONS.Save} />
          <ToolbarButton label="Print" icon={ICONS.Print} />
          <ToolbarSeparator />
          <ToolbarButton label="Cut" icon={ICONS.Cut} />
          <ToolbarButton label="Copy" icon={ICONS.Copy} />
          <ToolbarButton label="Paste" icon={ICONS.Paste} />
          <ToolbarSeparator />
          <ToolbarButton label="Attach" icon={ICONS.Attach} />
        </div>

        {/* ── Header fields: To / Cc / Subject ───────────────────────────────── */}
        <div
          style={{
            padding: "6px 8px",
            background: BEIGE,
            borderBottom: "1px solid #ACA899",
            display: "flex",
            flexDirection: "column",
            gap: "4px",
          }}
        >
          {/* To: = Name */}
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <button type="button" style={{ ...raisedButton, width: "56px" }} tabIndex={-1}>
              To:
            </button>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => update("name", e.target.value)}
              disabled={loading}
              aria-label="To (your name)"
              aria-invalid={!!(touched && fieldErrors.name)}
              style={{ ...insetStyle, ...invalidBorder("name"), flex: 1, minWidth: 0 }}
            />
          </div>

          {/* Cc: = Email */}
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <button type="button" style={{ ...raisedButton, width: "56px" }} tabIndex={-1}>
              Cc:
            </button>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => update("email", e.target.value)}
              disabled={loading}
              aria-label="Cc (your email)"
              aria-invalid={!!(touched && fieldErrors.email)}
              style={{ ...insetStyle, ...invalidBorder("email"), flex: 1, minWidth: 0 }}
            />
          </div>

          {/* Subject: = Subject */}
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span
              style={{
                width: "56px",
                paddingLeft: "2px",
                color: "#000000",
                flexShrink: 0,
              }}
            >
              Subject:
            </span>
            <input
              type="text"
              value={formData.subject}
              onChange={(e) => update("subject", e.target.value)}
              disabled={loading}
              aria-label="Subject"
              style={{ ...insetStyle, flex: 1, minWidth: 0 }}
            />
          </div>
        </div>

        {/* ── Message body — large white editor with a sunken XP inset border ── */}
        <div style={{ flex: 1, minHeight: 0, padding: "2px", background: BEIGE }}>
          <textarea
            value={formData.message}
            onChange={(e) => update("message", e.target.value)}
            disabled={loading}
            aria-label="Message"
            aria-invalid={!!(touched && fieldErrors.message)}
            spellCheck
            style={{
              width: "100%",
              height: "100%",
              resize: "none",
              border: SUNKEN_BORDER,
              borderColor: "#7F9DB9 #FFFFFF #FFFFFF #7F9DB9",
              outline: "none",
              background: "#FFFFFF",
              color: "#000000",
              caretColor: "#000000",
              fontFamily: FONT,
              fontSize: "12px",
              lineHeight: "1.4",
              padding: "6px 8px",
              boxSizing: "border-box",
            }}
          />
        </div>
      </form>

      {/* ── Status bar ───────────────────────────────────────────────────────── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          height: "20px",
          background: BEIGE,
          borderTop: "1px solid #FFFFFF",
          boxShadow: "inset 0 1px 0 #ACA899",
          userSelect: "none",
        }}
      >
        <div
          style={{
            flex: 1,
            height: "100%",
            display: "flex",
            alignItems: "center",
            padding: "0 8px",
            border: "1px solid",
            borderColor: "#808080 #FFFFFF #FFFFFF #808080",
            color: status === "error" ? "#C5311D" : status === "success" ? "#0A6A00" : "#000000",
            overflow: "hidden",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
          }}
        >
          {statusText}
        </div>
        <div
          style={{
            width: "120px",
            height: "100%",
            border: "1px solid",
            borderColor: "#808080 #FFFFFF #FFFFFF #808080",
          }}
        />
      </div>
    </div>
  );
};

// ── Toolbar sub-components ────────────────────────────────────────────────────
const ToolbarButton: React.FC<{
  label: string;
  icon: React.ReactNode;
  type?: "button" | "submit";
  disabled?: boolean;
  primary?: boolean;
}> = ({ label, icon, type = "button", disabled, primary }) => (
  <button
    type={type}
    disabled={disabled}
    className="oe-tool-btn"
    title={label}
    tabIndex={primary ? 0 : -1}
    style={{ opacity: disabled ? 0.5 : 1 }}
  >
    <span style={{ width: 16, height: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>
      {icon}
    </span>
    <span style={{ fontSize: "11px", lineHeight: 1 }}>{label}</span>
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
