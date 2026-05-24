import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

// ── Runtime guard: fail loudly at request-time if env vars are missing ──────
function getResendClient(): Resend {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    throw new Error("RESEND_API_KEY environment variable is not set.");
  }
  return new Resend(key);
}

function getRecipient(): string {
  const email = process.env.CONTACT_EMAIL;
  if (!email) {
    throw new Error("CONTACT_EMAIL environment variable is not set.");
  }
  return email;
}

// ── Input validation ─────────────────────────────────────────────────────────
function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ── HTML entity escaping — prevents XSS inside the email body ───────────────
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// ── Rate-limit response headers (informational; real limiting via Vercel/CDN) ─
const RATE_LIMIT_HEADERS = {
  "X-RateLimit-Limit": "10",
  "X-RateLimit-Policy": "10 requests per minute per IP",
};

// ── Field length limits ───────────────────────────────────────────────────────
const MAX_NAME_LENGTH = 100;
const MAX_EMAIL_LENGTH = 254; // RFC 5321 max
const MAX_MESSAGE_LENGTH = 5000;

export async function POST(req: NextRequest) {
  try {
    // ── Parse body ──────────────────────────────────────────────────────────
    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid request body." },
        { status: 400, headers: RATE_LIMIT_HEADERS }
      );
    }

    if (typeof body !== "object" || body === null) {
      return NextResponse.json(
        { error: "Invalid request body." },
        { status: 400, headers: RATE_LIMIT_HEADERS }
      );
    }

    const { name, email, message } = body as Record<string, unknown>;

    // ── Validation ──────────────────────────────────────────────────────────
    if (
      !name ||
      typeof name !== "string" ||
      name.trim().length < 2 ||
      name.trim().length > MAX_NAME_LENGTH
    ) {
      return NextResponse.json(
        { error: "Please provide a valid name (2–100 characters)." },
        { status: 400, headers: RATE_LIMIT_HEADERS }
      );
    }
    if (
      !email ||
      typeof email !== "string" ||
      email.length > MAX_EMAIL_LENGTH ||
      !validateEmail(email)
    ) {
      return NextResponse.json(
        { error: "Please provide a valid email address." },
        { status: 400, headers: RATE_LIMIT_HEADERS }
      );
    }
    if (
      !message ||
      typeof message !== "string" ||
      message.trim().length < 10 ||
      message.trim().length > MAX_MESSAGE_LENGTH
    ) {
      return NextResponse.json(
        { error: `Message must be between 10 and ${MAX_MESSAGE_LENGTH} characters.` },
        { status: 400, headers: RATE_LIMIT_HEADERS }
      );
    }

    // ── Sanitise inputs before embedding into HTML ──────────────────────────
    const safeName    = escapeHtml(name.trim());
    const safeEmail   = escapeHtml(email.trim());
    const safeMessage = escapeHtml(message.trim());

    // ── Send email ──────────────────────────────────────────────────────────
    const resend    = getResendClient();
    const recipient = getRecipient();

    const { error } = await resend.emails.send({
      from: "Portfolio Contact <onboarding@resend.dev>",
      to: [recipient],
      replyTo: email.trim(), // raw (validated) email — safe as header value
      subject: `Portfolio Contact: ${safeName}`,
      html: `
        <div style="font-family: Tahoma, Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(180deg, #0997FF 0%, #0048CE 100%); padding: 16px; color: white; border-radius: 4px 4px 0 0;">
            <h2 style="margin: 0; font-size: 16px;">📬 New Portfolio Contact Message</h2>
          </div>
          <div style="background: #ECE9D8; padding: 20px; border: 2px solid #ACA899; border-top: none;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 6px 0; font-weight: bold; width: 80px;">From:</td>
                <td style="padding: 6px 0;">${safeName}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; font-weight: bold;">Email:</td>
                <td style="padding: 6px 0;"><a href="mailto:${safeEmail}">${safeEmail}</a></td>
              </tr>
            </table>
            <hr style="margin: 12px 0; border-color: #ACA899;" />
            <div style="white-space: pre-wrap; line-height: 1.6;">${safeMessage}</div>
          </div>
          <div style="background: #DDD; padding: 8px 16px; font-size: 11px; color: #666; border-radius: 0 0 4px 4px;">
            Sent via Windows XP Portfolio Contact Form
          </div>
        </div>
      `,
    });

    if (error) {
      // Log to server only — never expose provider error details to the client
      console.error("[contact] Resend error:", error);
      return NextResponse.json(
        { error: "Failed to send message. Please try again later." },
        { status: 500, headers: RATE_LIMIT_HEADERS }
      );
    }

    return NextResponse.json(
      { success: true },
      { status: 200, headers: RATE_LIMIT_HEADERS }
    );
  } catch (err) {
    // Log to server only
    console.error("[contact] Unhandled error:", err instanceof Error ? err.message : "unknown");
    return NextResponse.json(
      { error: "Internal server error. Please try again later." },
      { status: 500, headers: RATE_LIMIT_HEADERS }
    );
  }
}
