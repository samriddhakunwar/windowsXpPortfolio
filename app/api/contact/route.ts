import { Resend } from "resend";
import { NextResponse } from "next/server";

// ─────────────────────────────────────────────────────────────────────────────
// Environment validation
// These are read server-side only (never NEXT_PUBLIC_*), so the API key is
// never shipped to the browser. We log presence (booleans), never the secret.
// ─────────────────────────────────────────────────────────────────────────────
console.log("[contact] Resend key loaded:", !!process.env.RESEND_API_KEY);
console.log("[contact] Contact email:", process.env.CONTACT_EMAIL ?? "(not set)");

const resend = new Resend(process.env.RESEND_API_KEY);

// ── Validation limits ────────────────────────────────────────────────────────
const LIMITS = {
  nameMin: 2,
  nameMax: 100,
  emailMax: 254,
  subjectMax: 150,
  messageMin: 10,
  messageMax: 5000,
};

// Reasonable email shape check (defence-in-depth; the client validates too).
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// ── HTML escaping — prevents HTML injection / XSS in the delivered email ──────
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// ── Simple in-memory rate limiter ────────────────────────────────────────────
// Limits each IP to a handful of submissions per window. This is best-effort:
// in-memory state is per-instance and resets on cold start, but it meaningfully
// blunts casual spam/abuse. For multi-instance scale, swap for Redis/Upstash.
const RATE_LIMIT = { max: 5, windowMs: 60_000 };
const hits = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = hits.get(ip);
  if (!entry || now > entry.resetAt) {
    hits.set(ip, { count: 1, resetAt: now + RATE_LIMIT.windowMs });
    return false;
  }
  entry.count += 1;
  return entry.count > RATE_LIMIT.max;
}

function getClientIp(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}

export async function POST(req: Request) {
  try {
    // ── Startup / config validation ──────────────────────────────────────────
    if (!process.env.RESEND_API_KEY) {
      console.error("[contact] Missing RESEND_API_KEY");
      return NextResponse.json(
        { success: false, error: "Email service is not configured." },
        { status: 500 }
      );
    }
    if (!process.env.CONTACT_EMAIL) {
      console.error("[contact] Missing CONTACT_EMAIL");
      return NextResponse.json(
        { success: false, error: "Email service is not configured." },
        { status: 500 }
      );
    }

    // ── Rate limiting ────────────────────────────────────────────────────────
    const ip = getClientIp(req);
    if (isRateLimited(ip)) {
      console.warn("[contact] Rate limited:", ip);
      return NextResponse.json(
        { success: false, error: "Too many messages. Please try again in a minute." },
        { status: 429 }
      );
    }

    // ── JSON parsing ─────────────────────────────────────────────────────────
    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { success: false, error: "Invalid request format." },
        { status: 400 }
      );
    }

    const {
      name: rawName,
      email: rawEmail,
      subject: rawSubject,
      message: rawMessage,
    } = (body ?? {}) as Record<string, unknown>;

    // ── Type + presence validation ───────────────────────────────────────────
    if (
      typeof rawName !== "string" ||
      typeof rawEmail !== "string" ||
      typeof rawMessage !== "string" ||
      (rawSubject !== undefined && typeof rawSubject !== "string")
    ) {
      return NextResponse.json(
        { success: false, error: "Missing or invalid fields." },
        { status: 400 }
      );
    }

    const name = rawName.trim();
    const email = rawEmail.trim();
    const subject = (rawSubject ?? "").toString().trim();
    const message = rawMessage.trim();

    // Avoid logging the full message body; log non-sensitive metadata only.
    console.log("[contact] Contact form submitted:", {
      name,
      email,
      subject: subject || "(none)",
      messageLength: message.length,
      ip,
    });

    // ── Field-level validation (mirrors the client rules) ────────────────────
    const errors: string[] = [];
    if (name.length < LIMITS.nameMin) errors.push("Name must be at least 2 characters.");
    if (name.length > LIMITS.nameMax) errors.push("Name is too long.");
    if (!EMAIL_RE.test(email) || email.length > LIMITS.emailMax)
      errors.push("Please enter a valid email address.");
    if (subject.length > LIMITS.subjectMax) errors.push("Subject is too long.");
    if (message.length < LIMITS.messageMin)
      errors.push("Message must be at least 10 characters.");
    if (message.length > LIMITS.messageMax) errors.push("Message is too long.");

    if (errors.length > 0) {
      return NextResponse.json(
        { success: false, error: errors[0], errors },
        { status: 400 }
      );
    }

    // ── Build the email (all user input HTML-escaped) ────────────────────────
    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safeSubject = escapeHtml(subject || "No subject");
    const safeMessage = escapeHtml(message).replace(/\n/g, "<br/>");

    const html = `
      <div style="font-family: Tahoma, Arial, sans-serif; font-size: 14px; color: #222; max-width: 600px;">
        <h2 style="color: #0A246A; margin: 0 0 16px;">New Contact Form Message</h2>
        <p><strong>Name:</strong> ${safeName}</p>
        <p><strong>Email:</strong> <a href="mailto:${safeEmail}">${safeEmail}</a></p>
        <p><strong>Subject:</strong> ${safeSubject}</p>
        <p><strong>Message:</strong></p>
        <div style="background: #f6f6f6; border: 1px solid #ddd; border-radius: 4px; padding: 12px; white-space: pre-wrap;">${safeMessage}</div>
        <hr style="border: none; border-top: 1px solid #ddd; margin: 16px 0;" />
        <p style="font-size: 12px; color: #888;">Sent from your portfolio contact form.</p>
      </div>
    `;

    const fromEmail = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";

    const response = await resend.emails.send({
      from: `Portfolio Contact <${fromEmail}>`,
      to: process.env.CONTACT_EMAIL,
      subject: subject
        ? `New Portfolio Contact: ${subject}`
        : "New Portfolio Contact Form Submission",
      replyTo: email,
      html,
    });

    console.log("[contact] Resend response:", response);

    // Resend returns { data, error } — surface a real failure as an error.
    if (response.error) {
      console.error("[contact] Resend error:", response.error);
      return NextResponse.json(
        { success: false, error: "Failed to send message. Please try again later." },
        { status: 502 }
      );
    }

    return NextResponse.json({ success: true, id: response.data?.id });
  } catch (error) {
    console.error("[contact] Contact error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to send message. Please try again later." },
      { status: 500 }
    );
  }
}
