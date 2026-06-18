"use client";

import React, { useState } from "react";
import Image from "next/image";

type Status = "idle" | "loading" | "success" | "error";

type FieldErrors = {
  name?: string;
  email?: string;
  message?: string;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Shared field style — black text on a white XP inset, with a visible caret.
const fieldStyle: React.CSSProperties = {
  width: "100%",
  padding: "4px 6px",
  fontSize: "11px",
  fontFamily: "Tahoma, Arial, sans-serif",
  color: "#000000",
  caretColor: "#000000",
  background: "#ffffff",
};

const labelStyle: React.CSSProperties = {
  fontWeight: "bold",
  display: "block",
  marginBottom: "3px",
  color: "#222222",
};

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

export const ContactWindow: React.FC = () => {
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
    // Re-validate live once the user has attempted a submit.
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
        setErrorMsg(
          data.error || "Failed to send message. Please try again later."
        );
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

  const clearForm = () => {
    setFormData({ name: "", email: "", subject: "", message: "" });
    setStatus("idle");
    setErrorMsg("");
    setFieldErrors({});
    setTouched(false);
  };

  // ── Success screen ─────────────────────────────────────────────────────────
  if (status === "success") {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
          fontFamily: "Tahoma, Arial, sans-serif",
          fontSize: "11px",
        }}
      >
        <div
          className="xp-panel"
          style={{
            padding: "24px",
            textAlign: "center",
            maxWidth: "320px",
            background: "linear-gradient(180deg, #EFFFEF 0%, #D8F5D8 100%)",
            border: "2px solid #5DB85D",
          }}
        >
          <div style={{ fontSize: "36px", marginBottom: "8px" }}>✉</div>
          <p
            style={{
              fontWeight: "bold",
              fontSize: "13px",
              marginBottom: "6px",
              color: "#0A6A00",
            }}
          >
            Message sent successfully.
          </p>
          <p style={{ color: "#444", lineHeight: "1.5" }}>
            Thanks for reaching out! I&apos;ll get back to you as soon as
            possible.
          </p>
          <button
            className="xp-button"
            style={{ marginTop: "12px" }}
            onClick={() => setStatus("idle")}
          >
            Send Another Message
          </button>
        </div>
      </div>
    );
  }

  // ── Form ───────────────────────────────────────────────────────────────────
  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      style={{ fontFamily: "Tahoma, Arial, sans-serif", fontSize: "11px" }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          marginBottom: "10px",
        }}
      >
        <Image src="/assets/outlook_large.png" alt="" width={24} height={24} />
        <div>
          <div style={{ fontWeight: "bold", fontSize: "12px" }}>
            Send a Message
          </div>
          <div style={{ color: "#666" }}>I&apos;ll reply as soon as possible!</div>
        </div>
      </div>

      {/* Error banner */}
      {status === "error" && (
        <div
          style={{
            background: "#FFF0F0",
            border: "1px solid #CC4444",
            borderRadius: "2px",
            padding: "6px 10px",
            marginBottom: "8px",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            color: "#CC0000",
          }}
        >
          <Image src="/assets/error.png" alt="Error" width={16} height={16} />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Name */}
      <div style={{ marginBottom: "8px" }}>
        <label style={labelStyle}>Name</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => update("name", e.target.value)}
          className="xp-inset"
          placeholder="Your full name"
          maxLength={100}
          disabled={status === "loading"}
          aria-invalid={!!fieldErrors.name}
          style={fieldStyle}
        />
        {fieldErrors.name && <FieldError text={fieldErrors.name} />}
      </div>

      {/* Email */}
      <div style={{ marginBottom: "8px" }}>
        <label style={labelStyle}>Email</label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => update("email", e.target.value)}
          className="xp-inset"
          placeholder="your@email.com"
          maxLength={254}
          disabled={status === "loading"}
          aria-invalid={!!fieldErrors.email}
          style={fieldStyle}
        />
        {fieldErrors.email && <FieldError text={fieldErrors.email} />}
      </div>

      {/* Subject (optional) */}
      <div style={{ marginBottom: "8px" }}>
        <label style={labelStyle}>Subject</label>
        <input
          type="text"
          value={formData.subject}
          onChange={(e) => update("subject", e.target.value)}
          className="xp-inset"
          placeholder="What's this about? (optional)"
          maxLength={150}
          disabled={status === "loading"}
          style={fieldStyle}
        />
      </div>

      {/* Message */}
      <div style={{ marginBottom: "8px" }}>
        <label style={labelStyle}>Message</label>
        <textarea
          value={formData.message}
          onChange={(e) => update("message", e.target.value)}
          className="xp-inset"
          rows={5}
          placeholder="Write your message here (minimum 10 characters)..."
          maxLength={5000}
          disabled={status === "loading"}
          aria-invalid={!!fieldErrors.message}
          style={{ ...fieldStyle, resize: "none" }}
        />
        {fieldErrors.message && <FieldError text={fieldErrors.message} />}
      </div>

      {/* Loading progress */}
      {status === "loading" && (
        <div style={{ marginBottom: "8px" }}>
          <div style={{ color: "#444", marginBottom: "4px" }}>
            Sending message...
          </div>
          <div className="xp-progress-bar">
            <div className="xp-progress-fill" />
          </div>
        </div>
      )}

      <div style={{ display: "flex", gap: "6px", paddingTop: "4px" }}>
        <button
          type="submit"
          className="xp-button"
          disabled={status === "loading"}
          style={{ minWidth: "80px", opacity: status === "loading" ? 0.7 : 1 }}
        >
          {status === "loading" ? "Sending..." : "✉ Send"}
        </button>
        <button
          type="button"
          className="xp-button"
          disabled={status === "loading"}
          onClick={clearForm}
        >
          Clear
        </button>
      </div>
    </form>
  );
};

// XP-style inline validation message.
const FieldError: React.FC<{ text: string }> = ({ text }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: "4px",
      marginTop: "3px",
      color: "#CC0000",
      fontSize: "11px",
    }}
  >
    <span aria-hidden style={{ fontWeight: "bold" }}>⚠</span>
    <span>{text}</span>
  </div>
);
