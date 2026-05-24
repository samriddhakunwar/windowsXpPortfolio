import type { NextConfig } from "next";

// ── HTTP Security Headers ─────────────────────────────────────────────────────
// Applied to every response via the headers() hook.
const securityHeaders = [
  // Prevent the site from being embedded in iframes on other origins (clickjacking)
  {
    key: "X-Frame-Options",
    value: "SAMEORIGIN",
  },
  // Block MIME-type sniffing
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  // Referrer policy — don't leak the full URL to third parties
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  // Permissions policy — disable unused browser features
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
  // Force HTTPS for 1 year (only meaningful in production / behind HTTPS)
  {
    key: "Strict-Transport-Security",
    value: "max-age=31536000; includeSubDomains",
  },
  // Content Security Policy
  // Allows:
  //   - Scripts: same-origin only (no inline, no eval)
  //   - Styles: same-origin + inline (required for CSS-in-JS / style props)
  //   - Images: same-origin + data URIs (for Next/Image optimised URLs)
  //   - Media (audio): same-origin (XP sounds)
  //   - Frames: same-origin (PDF iframe in ResumeWindow)
  //   - Connect: same-origin + GitHub API (GithubWindow fetch)
  //   - Fonts: same-origin
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "script-src 'self'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data:",
      "media-src 'self'",
      "frame-src 'self'",
      "connect-src 'self' https://api.github.com",
      "font-src 'self'",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        // Apply to all routes
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
