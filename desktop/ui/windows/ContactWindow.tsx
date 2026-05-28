"use client";

import React, { useState } from "react";
import Image from "next/image";

type Status = "idle" | "loading" | "success" | "error";

export const ContactWindow: React.FC = () => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error || "Something went wrong. Please try again.");
        setStatus("error");
        return;
      }

      setStatus("success");
      setFormData({ name: "", email: "", message: "" });
      setTimeout(() => setStatus("idle"), 5000);
    } catch {
      setErrorMsg("Network error. Please check your connection and try again.");
      setStatus("error");
    }
  };

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
          <p style={{ fontWeight: "bold", fontSize: "13px", marginBottom: "6px", color: "#0A6A00" }}>
            Message Sent Successfully!
          </p>
          <p style={{ color: "#444", lineHeight: "1.5" }}>
            Thanks for reaching out, <strong>{formData.name || "friend"}</strong>!
            I&apos;ll get back to you as soon as possible.
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

  return (
    <form
      onSubmit={handleSubmit}
      style={{ fontFamily: "Tahoma, Arial, sans-serif", fontSize: "11px" }}
    >
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
        <Image src="/assets/outlook_large.png" alt="" width={24} height={24} />
        <div>
          <div style={{ fontWeight: "bold", fontSize: "12px" }}>Send a Message</div>
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

      <div style={{ marginBottom: "8px" }}>
        <label style={{ fontWeight: "bold", display: "block", marginBottom: "3px", color: "#222222" }}>
          Name
        </label>
        <input
          required
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="xp-inset"
          placeholder="Your full name"
          disabled={status === "loading"}
          style={{
            width: "100%",
            padding: "4px 6px",
            fontSize: "11px",
            fontFamily: "Tahoma, Arial, sans-serif",
            color: "#000000",
            caretColor: "#000000",
            background: "#ffffff",
          }}
        />
      </div>

      <div style={{ marginBottom: "8px" }}>
        <label style={{ fontWeight: "bold", display: "block", marginBottom: "3px", color: "#222222" }}>
          Email
        </label>
        <input
          required
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="xp-inset"
          placeholder="your@email.com"
          disabled={status === "loading"}
          style={{
            width: "100%",
            padding: "4px 6px",
            fontSize: "11px",
            fontFamily: "Tahoma, Arial, sans-serif",
            color: "#000000",
            caretColor: "#000000",
            background: "#ffffff",
          }}
        />
      </div>

      <div style={{ marginBottom: "8px" }}>
        <label style={{ fontWeight: "bold", display: "block", marginBottom: "3px", color: "#222222" }}>
          Message
        </label>
        <textarea
          required
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          className="xp-inset"
          rows={5}
          placeholder="Write your message here (minimum 10 characters)..."
          disabled={status === "loading"}
          style={{
            width: "100%",
            padding: "4px 6px",
            resize: "none",
            fontSize: "11px",
            fontFamily: "Tahoma, Arial, sans-serif",
            color: "#000000",
            caretColor: "#000000",
            background: "#ffffff",
          }}
        />
      </div>

      {/* Loading progress */}
      {status === "loading" && (
        <div style={{ marginBottom: "8px" }}>
          <div style={{ color: "#444", marginBottom: "4px" }}>Sending message...</div>
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
          onClick={() => {
            setFormData({ name: "", email: "", message: "" });
            setStatus("idle");
            setErrorMsg("");
          }}
        >
          Clear
        </button>
      </div>
    </form>
  );
};
