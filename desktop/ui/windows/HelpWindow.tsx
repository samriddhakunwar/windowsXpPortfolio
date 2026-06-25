"use client";

import React, { useCallback, useMemo, useState } from "react";
import Image from "next/image";
import { useDesktop } from "@/desktop/DesktopProvider";
import { WindowType } from "@/types";

/* ============================================================================
 * Windows XP "Help and Support Center" — authentic re-skin.
 *
 * UI ONLY redesign: all of the original window's content is preserved — the
 * System Information table and the Credits block now live inside the
 * "Portfolio Guide" topic, and the original GitHub / LinkedIn links are kept
 * as Resources and inside the relevant topics. Search is functional and the
 * navigation behaviour (Back / Forward / Home / topic selection) mirrors the
 * real Help and Support Center.
 * ========================================================================== */

const FONT = `"Tahoma", "Segoe UI", Arial, sans-serif`;

// External links carried over verbatim from the original Help window.
const GITHUB_URL = "https://github.com/samriddhakunwar/windowsXpPortfolio";
const LINKEDIN_URL = "https://linkedin.com/in/samriddhakunwar";

// ── System Information — preserved exactly from the original Help window ──────
const SYS_INFO: { label: string; value: string }[] = [
  { label: "System", value: "Windows XP Portfolio Edition" },
  { label: "Version", value: "1.0.0 (Build 2026.04)" },
  { label: "Developer", value: "Samriddha Kunwar" },
  { label: "Framework", value: "Next.js 16 + React 19" },
  { label: "Language", value: "TypeScript 5" },
  { label: "Animation", value: "Framer Motion 11" },
  { label: "Processor", value: "Your CPU @ Your GHz" },
  { label: "RAM", value: "Your browser's memory" },
];

/* ------------------------------------------------------------------ *
 * Help-topic content model
 * ------------------------------------------------------------------ */

type Block =
  | { k: "p"; text: string }
  | { k: "h"; text: string }
  | { k: "ul"; items: string[] }
  | { k: "note"; title?: string; text: string }
  | { k: "table"; rows: { label: string; value: string }[] }
  | { k: "action"; label: string; icon: string; app?: WindowType; href?: string }
  | { k: "related"; items: { label: string; id: string }[] };

interface Topic {
  id: string;
  title: string;
  icon: string;
  blocks: Block[];
}

const TOPICS: Record<string, Topic> = {
  "getting-started": {
    id: "getting-started",
    title: "Getting Started",
    icon: "/assets/dialog/info.png",
    blocks: [
      {
        k: "p",
        text:
          "Welcome to the Windows XP Portfolio Edition of Samriddha Kunwar. This desktop works like a real copy of Windows XP — you can open applications, browse folders, and explore projects right inside your browser.",
      },
      { k: "h", text: "To get started" },
      {
        k: "ul",
        items: [
          "Open My Computer to browse the drives and folders.",
          "Browse Projects to see featured work.",
          "View Resume to read about experience and skills.",
          "Contact Me to send a message.",
        ],
      },
      { k: "action", label: "Open My Computer", icon: "/assets/mycomputer.png", app: "mycomputer" },
      {
        k: "related",
        items: [
          { label: "About Me", id: "about" },
          { label: "Projects", id: "projects" },
          { label: "How to Navigate", id: "navigate" },
        ],
      },
    ],
  },

  about: {
    id: "about",
    title: "About Me",
    icon: "/assets/users.png",
    blocks: [
      {
        k: "p",
        text:
          "The About Me application introduces Samriddha Kunwar, including background, technical skills, and professional experience.",
      },
      { k: "h", text: "What you'll find" },
      {
        k: "ul",
        items: [
          "A short biography and professional summary.",
          "Technical skills and proficiency levels.",
          "Education and experience highlights.",
        ],
      },
      { k: "action", label: "Open About Me", icon: "/assets/users.png", app: "about" },
      {
        k: "related",
        items: [
          { label: "Resume", id: "resume" },
          { label: "Contact", id: "contact" },
        ],
      },
    ],
  },

  projects: {
    id: "projects",
    title: "Projects",
    icon: "/assets/folder_program.png",
    blocks: [
      {
        k: "p",
        text:
          "The Projects application showcases featured work. Each project includes a description, the technologies used, and links to its source code or a live demo.",
      },
      { k: "h", text: "Working with projects" },
      {
        k: "ul",
        items: [
          "Double-click a project to view its details.",
          "Use the links inside a project to open its repository or live site.",
          "Projects cover web applications, data pipelines, and more.",
        ],
      },
      { k: "action", label: "Open Projects", icon: "/assets/folder_program.png", app: "projects" },
      {
        k: "related",
        items: [
          { label: "GitHub", id: "github" },
          { label: "About Me", id: "about" },
        ],
      },
    ],
  },

  resume: {
    id: "resume",
    title: "Resume",
    icon: "/assets/pdf.png",
    blocks: [
      {
        k: "p",
        text:
          "The Resume application displays a printable résumé with experience, education, and skills in a document viewer.",
      },
      { k: "h", text: "Using the résumé" },
      {
        k: "ul",
        items: [
          "Read the full résumé in the document viewer.",
          "Print or save the résumé for offline use.",
        ],
      },
      { k: "action", label: "Open Resume", icon: "/assets/pdf.png", app: "resume" },
      {
        k: "related",
        items: [
          { label: "About Me", id: "about" },
          { label: "Contact", id: "contact" },
        ],
      },
    ],
  },

  contact: {
    id: "contact",
    title: "Contact",
    icon: "/assets/outlook_large.png",
    blocks: [
      {
        k: "p",
        text:
          "The Contact application lets you send a message directly to Samriddha Kunwar. It works just like Outlook Express.",
      },
      { k: "h", text: "Sending a message" },
      {
        k: "ul",
        items: [
          "Fill in your name, email address, and message.",
          "Click Send to deliver your message.",
          "All messages are delivered to the site owner.",
        ],
      },
      { k: "action", label: "Open Contact", icon: "/assets/outlook_large.png", app: "contact" },
      {
        k: "related",
        items: [
          { label: "GitHub", id: "github" },
          { label: "Resume", id: "resume" },
        ],
      },
    ],
  },

  github: {
    id: "github",
    title: "GitHub",
    icon: "/assets/github.png",
    blocks: [
      {
        k: "p",
        text:
          "View source code and open-source projects on GitHub, including the source for this Windows XP portfolio.",
      },
      { k: "h", text: "On GitHub you can" },
      {
        k: "ul",
        items: [
          "Browse repositories and contributions.",
          "View the source code for this portfolio.",
          "Star or fork projects you find interesting.",
        ],
      },
      { k: "action", label: "View Source Code", icon: "/assets/github.png", href: GITHUB_URL },
      { k: "action", label: "Open GitHub", icon: "/assets/github.png", app: "github" },
      {
        k: "related",
        items: [{ label: "Projects", id: "projects" }],
      },
    ],
  },

  "portfolio-guide": {
    id: "portfolio-guide",
    title: "Portfolio Guide",
    icon: "/assets/help.png",
    blocks: [
      {
        k: "p",
        text:
          "This portfolio is built to look and feel like Windows XP. Below is information about the system and the people who made it.",
      },
      { k: "h", text: "System Information" },
      { k: "table", rows: SYS_INFO },
      { k: "h", text: "Credits" },
      {
        k: "ul",
        items: [
          "Designed & Developed by Samriddha Kunwar.",
          "Windows XP UI inspired by Microsoft Corporation.",
          "Icons from the original XP icon set.",
          "Background: Windows XP “Luna” wallpaper style.",
        ],
      },
      {
        k: "related",
        items: [
          { label: "Getting Started", id: "getting-started" },
          { label: "How to Navigate", id: "navigate" },
        ],
      },
    ],
  },

  faq: {
    id: "faq",
    title: "Frequently Asked Questions",
    icon: "/assets/dialog/help.png",
    blocks: [
      { k: "h", text: "Is this a real copy of Windows XP?" },
      {
        k: "p",
        text:
          "No. It is a portfolio website designed to look and behave like Windows XP inside your web browser.",
      },
      { k: "h", text: "How do I open an application?" },
      { k: "p", text: "Double-click any desktop icon, or use the Start menu." },
      { k: "h", text: "Can I contact the developer?" },
      { k: "p", text: "Yes. Open the Contact application to send a message." },
      { k: "h", text: "Where is the source code?" },
      {
        k: "p",
        text:
          "Open the GitHub topic or the GitHub application to view the source code for this portfolio.",
      },
      {
        k: "related",
        items: [
          { label: "How to Navigate", id: "navigate" },
          { label: "Troubleshooting", id: "troubleshooting" },
        ],
      },
    ],
  },

  navigate: {
    id: "navigate",
    title: "How to Navigate",
    icon: "/assets/dialog/info.png",
    blocks: [
      { k: "p", text: "Get around the desktop the same way you would in Windows XP." },
      {
        k: "ul",
        items: [
          "Double-click desktop icons to open applications.",
          "Click the Start button to access programs.",
          "Drag a window's title bar to move it.",
          "Use the minimize, maximize, and close buttons in the top-right of each window.",
          "Click a taskbar button to switch between open windows.",
        ],
      },
      {
        k: "related",
        items: [
          { label: "Keyboard Shortcuts", id: "shortcuts" },
          { label: "Getting Started", id: "getting-started" },
        ],
      },
    ],
  },

  shortcuts: {
    id: "shortcuts",
    title: "Keyboard Shortcuts",
    icon: "/assets/doc.png",
    blocks: [
      { k: "p", text: "These shortcuts help you work faster on the desktop." },
      {
        k: "table",
        rows: [
          { label: "Enter", value: "Open the selected item" },
          { label: "Esc", value: "Close the active dialog box" },
          { label: "Tab", value: "Move between fields" },
          { label: "Ctrl + 0", value: "Reset browser zoom to 100%" },
        ],
      },
      {
        k: "note",
        title: "Note",
        text: "Some shortcuts may vary depending on your web browser.",
      },
      { k: "related", items: [{ label: "How to Navigate", id: "navigate" }] },
    ],
  },

  troubleshooting: {
    id: "troubleshooting",
    title: "Troubleshooting",
    icon: "/assets/dialog/warning.png",
    blocks: [
      { k: "h", text: "An application will not open" },
      {
        k: "p",
        text:
          "Close any other windows and try again. Refreshing the page will reset the desktop to its starting state.",
      },
      { k: "h", text: "The contact form is not sending" },
      {
        k: "p",
        text:
          "Check your internet connection and make sure every field is filled in correctly before clicking Send.",
      },
      { k: "h", text: "Icons or text look blurry" },
      { k: "p", text: "Set your browser zoom back to 100% by pressing Ctrl+0." },
      {
        k: "related",
        items: [
          { label: "Frequently Asked Questions", id: "faq" },
          { label: "Portfolio Guide (System Information)", id: "portfolio-guide" },
        ],
      },
    ],
  },
};

// Ordering of topics inside each sidebar section.
const HELP_TOPIC_IDS = [
  "getting-started",
  "about",
  "projects",
  "resume",
  "contact",
  "github",
  "portfolio-guide",
];
const SUPPORT_TASK_IDS = ["faq", "navigate", "shortcuts", "troubleshooting"];

// Resources are external destinations rather than content panels.
interface Resource {
  label: string;
  icon: string;
  app?: WindowType;
  href?: string;
}
const RESOURCES: Resource[] = [
  { label: "GitHub Profile", icon: "/assets/github.png", href: GITHUB_URL },
  { label: "LinkedIn", icon: "/assets/linkedin.png", href: LINKEDIN_URL },
  { label: "Email Contact", icon: "/assets/outlook_large.png", app: "contact" },
];

/* ------------------------------------------------------------------ *
 * Search index
 * ------------------------------------------------------------------ */

function topicText(t: Topic): string {
  const parts: string[] = [t.title];
  for (const b of t.blocks) {
    if (b.k === "p" || b.k === "h") parts.push(b.text);
    else if (b.k === "ul") parts.push(...b.items);
    else if (b.k === "note") parts.push(b.title ?? "", b.text);
    else if (b.k === "table") b.rows.forEach((r) => parts.push(r.label, r.value));
  }
  return parts.join(" ").toLowerCase();
}

function firstParagraph(t: Topic): string {
  const p = t.blocks.find((b) => b.k === "p") as Extract<Block, { k: "p" }> | undefined;
  return p?.text ?? "";
}

/* ------------------------------------------------------------------ *
 * Toolbar icons (inline SVG — self-contained, Help-Center styled)
 * ------------------------------------------------------------------ */

const TBIcon: Record<string, React.ReactNode> = {
  back: (
    <svg width="16" height="16" viewBox="0 0 16 16">
      <circle cx="8" cy="8" r="7" fill="#39A935" stroke="#1F6B1C" />
      <path d="M9.3 4.3 L5 8 l4.3 3.7" fill="none" stroke="#fff" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  forward: (
    <svg width="16" height="16" viewBox="0 0 16 16">
      <circle cx="8" cy="8" r="7" fill="#39A935" stroke="#1F6B1C" />
      <path d="M6.7 4.3 L11 8 l-4.3 3.7" fill="none" stroke="#fff" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  home: (
    <svg width="16" height="16" viewBox="0 0 16 16">
      <path d="M8 2 L1.5 7.5 H3.5 V14 H12.5 V7.5 H14.5 Z" fill="#F4C430" stroke="#7A5B00" strokeWidth="0.8" strokeLinejoin="round" />
      <rect x="6.5" y="9.5" width="3" height="4.5" fill="#7A4A1A" />
    </svg>
  ),
  index: (
    <svg width="16" height="16" viewBox="0 0 16 16">
      <rect x="2.5" y="2" width="11" height="12" rx="1" fill="#EAF1FB" stroke="#3A6BB0" />
      <line x1="5" y1="5" x2="11" y2="5" stroke="#3A6BB0" />
      <line x1="5" y1="7.5" x2="11" y2="7.5" stroke="#3A6BB0" />
      <line x1="5" y1="10" x2="9" y2="10" stroke="#3A6BB0" />
    </svg>
  ),
  favorites: (
    <svg width="16" height="16" viewBox="0 0 16 16">
      <path d="M8 1.8 L9.8 5.6 14 6.1 10.9 8.9 11.7 13 8 10.9 4.3 13 5.1 8.9 2 6.1 6.2 5.6 Z" fill="#FFD23F" stroke="#B98900" strokeWidth="0.8" strokeLinejoin="round" />
    </svg>
  ),
  history: (
    <svg width="16" height="16" viewBox="0 0 16 16">
      <circle cx="8" cy="8" r="6.3" fill="#DDEBC2" stroke="#5C8A2E" />
      <path d="M8 4.3 V8 L10.6 9.6" fill="none" stroke="#2E5A12" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  ),
  support: (
    <svg width="16" height="16" viewBox="0 0 16 16">
      <circle cx="8" cy="8" r="6.5" fill="#2E73D6" stroke="#1A4A99" />
      <path d="M6 6.2 a2 2 0 1 1 2.6 2 c-0.6 0.3 -0.9 0.6 -0.9 1.3" fill="none" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="7.7" cy="11.3" r="0.95" fill="#fff" />
    </svg>
  ),
  options: (
    <svg width="16" height="16" viewBox="0 0 16 16">
      <circle cx="8" cy="8" r="2.6" fill="#EAF1FB" stroke="#3A6BB0" />
      <g stroke="#3A6BB0" strokeWidth="1.4">
        <line x1="8" y1="1.5" x2="8" y2="3.4" />
        <line x1="8" y1="12.6" x2="8" y2="14.5" />
        <line x1="1.5" y1="8" x2="3.4" y2="8" />
        <line x1="12.6" y1="8" x2="14.5" y2="8" />
        <line x1="3.4" y1="3.4" x2="4.7" y2="4.7" />
        <line x1="11.3" y1="11.3" x2="12.6" y2="12.6" />
        <line x1="12.6" y1="3.4" x2="11.3" y2="4.7" />
        <line x1="4.7" y1="11.3" x2="3.4" y2="12.6" />
      </g>
    </svg>
  ),
};

/* ------------------------------------------------------------------ *
 * Toolbar button
 * ------------------------------------------------------------------ */

const ToolButton: React.FC<{
  icon: React.ReactNode;
  label: string;
  disabled?: boolean;
  onClick?: () => void;
}> = ({ icon, label, disabled, onClick }) => {
  const [hover, setHover] = useState(false);
  const active = hover && !disabled;
  return (
    <button
      type="button"
      onClick={disabled ? undefined : onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      disabled={disabled}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 4,
        height: 24,
        padding: "0 8px",
        background: active ? "rgba(255,255,255,0.55)" : "transparent",
        border: active ? "1px solid #2D5FA8" : "1px solid transparent",
        borderRadius: 3,
        cursor: disabled ? "default" : "pointer",
        fontFamily: FONT,
        fontSize: 11,
        color: disabled ? "#8FA6C8" : "#0A246A",
        fontWeight: "bold",
        whiteSpace: "nowrap",
        opacity: disabled ? 0.55 : 1,
      }}
    >
      <span style={{ width: 16, height: 16, display: "flex", alignItems: "center", justifyContent: "center", filter: disabled ? "grayscale(1)" : "none" }}>
        {icon}
      </span>
      <span>{label}</span>
    </button>
  );
};

const ToolSep: React.FC = () => (
  <span style={{ width: 1, height: 18, margin: "0 4px", background: "#7C9BD0", boxShadow: "1px 0 0 rgba(255,255,255,0.6)" }} />
);

/* ------------------------------------------------------------------ *
 * Sidebar
 * ------------------------------------------------------------------ */

const NavHeader: React.FC<{ title: string }> = ({ title }) => (
  <div
    style={{
      padding: "4px 9px",
      background: "linear-gradient(180deg, #F0F4FD 0%, #B9CEEE 100%)",
      borderTop: "1px solid #FFFFFF",
      borderBottom: "1px solid #95AED6",
      color: "#0A246A",
      fontWeight: "bold",
      fontSize: 11,
    }}
  >
    {title}
  </div>
);

const NavLink: React.FC<{
  icon: string;
  label: string;
  selected?: boolean;
  onClick: () => void;
}> = ({ icon, label, selected, onClick }) => {
  const [hover, setHover] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 6,
        padding: "2px 9px",
        cursor: "pointer",
        userSelect: "none",
        background: selected ? "#316AC5" : "transparent",
      }}
    >
      <Image src={icon} alt="" width={16} height={16} draggable={false} unoptimized style={{ flexShrink: 0 }} />
      <span
        style={{
          fontSize: 11,
          color: selected ? "#FFFFFF" : "#0E3A8C",
          textDecoration: !selected && hover ? "underline" : "none",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {label}
      </span>
    </div>
  );
};

/* ------------------------------------------------------------------ *
 * Content renderers
 * ------------------------------------------------------------------ */

const PageTitle: React.FC<{ icon: string; title: string }> = ({ icon, title }) => (
  <div style={{ marginBottom: 10 }}>
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <Image src={icon} alt="" width={24} height={24} draggable={false} unoptimized style={{ flexShrink: 0 }} />
      <span style={{ fontSize: 13, fontWeight: "bold", color: "#0A246A" }}>{title}</span>
    </div>
    <div style={{ height: 2, marginTop: 4, background: "linear-gradient(to right, #8FB0E0 0%, #C9DBF2 55%, transparent 100%)" }} />
  </div>
);

/* ------------------------------------------------------------------ *
 * Main window
 * ------------------------------------------------------------------ */

type View =
  | { kind: "home" }
  | { kind: "topic"; id: string }
  | { kind: "search"; query: string };

const MENU_ITEMS = ["File", "Edit", "View", "Tools", "Help"];

export const HelpWindow: React.FC = () => {
  const { launchApp } = useDesktop();

  const [view, setView] = useState<View>({ kind: "home" });
  const [back, setBack] = useState<View[]>([]);
  const [forward, setForward] = useState<View[]>([]);
  const [searchBox, setSearchBox] = useState("");

  const navigate = useCallback(
    (next: View) => {
      setBack((b) => [...b, view]);
      setForward([]);
      setView(next);
    },
    [view],
  );

  const goBack = useCallback(() => {
    setBack((b) => {
      if (b.length === 0) return b;
      const prev = b[b.length - 1];
      setForward((f) => [view, ...f]);
      setView(prev);
      return b.slice(0, -1);
    });
  }, [view]);

  const goForward = useCallback(() => {
    setForward((f) => {
      if (f.length === 0) return f;
      const next = f[0];
      setBack((b) => [...b, view]);
      setView(next);
      return f.slice(1);
    });
  }, [view]);

  const openTopic = useCallback((id: string) => navigate({ kind: "topic", id }), [navigate]);
  const goHome = useCallback(() => navigate({ kind: "home" }), [navigate]);

  const runSearch = useCallback(() => {
    const q = searchBox.trim();
    if (!q) return;
    navigate({ kind: "search", query: q });
  }, [searchBox, navigate]);

  const openResource = useCallback(
    (r: Resource) => {
      if (r.app) launchApp(r.app);
      else if (r.href) window.open(r.href, "_blank", "noopener,noreferrer");
    },
    [launchApp],
  );

  // Search results for the current view.
  const searchResults = useMemo(() => {
    if (view.kind !== "search") return [];
    const q = view.query.toLowerCase();
    return Object.values(TOPICS).filter((t) => topicText(t).includes(q));
  }, [view]);

  // Status-bar text.
  let statusText = "Ready";
  if (view.kind === "topic") statusText = `Viewing: ${TOPICS[view.id]?.title ?? ""}`;
  else if (view.kind === "search")
    statusText = `Showing search results — ${searchResults.length} topic(s) found`;

  // ── Block renderer (needs access to navigate / launchApp) ──────────────────
  const renderBlock = (b: Block, i: number): React.ReactNode => {
    switch (b.k) {
      case "p":
        return (
          <p key={i} style={{ fontSize: 11, lineHeight: 1.6, color: "#000", margin: "0 0 8px 0" }}>
            {b.text}
          </p>
        );
      case "h":
        return (
          <div key={i} style={{ fontSize: 11, fontWeight: "bold", color: "#0A246A", margin: "10px 0 4px 0" }}>
            {b.text}
          </div>
        );
      case "ul":
        return (
          <ul key={i} style={{ margin: "0 0 8px 0", paddingLeft: 0, listStyle: "none" }}>
            {b.items.map((it, j) => (
              <li key={j} style={{ display: "flex", gap: 6, fontSize: 11, lineHeight: 1.5, color: "#000", margin: "2px 0" }}>
                <span style={{ color: "#2E73D6", flexShrink: 0, lineHeight: 1.5 }}>&#9642;</span>
                <span>{it}</span>
              </li>
            ))}
          </ul>
        );
      case "note":
        return (
          <div
            key={i}
            style={{
              display: "flex",
              gap: 7,
              alignItems: "flex-start",
              background: "#FBFBE8",
              border: "1px solid #E2D98F",
              padding: "5px 8px",
              margin: "6px 0 8px 0",
              fontSize: 11,
              lineHeight: 1.5,
            }}
          >
            <Image src="/assets/dialog/info.png" alt="" width={16} height={16} draggable={false} unoptimized style={{ flexShrink: 0, marginTop: 1 }} />
            <span>
              {b.title && <strong>{b.title}: </strong>}
              {b.text}
            </span>
          </div>
        );
      case "table":
        return (
          <div key={i} className="xp-inset" style={{ padding: "5px 8px", margin: "2px 0 10px 0" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <tbody>
                {b.rows.map((r) => (
                  <tr key={r.label}>
                    <td style={{ padding: "2px 10px 2px 0", fontWeight: "bold", color: "#0A246A", whiteSpace: "nowrap", verticalAlign: "top", fontSize: 11 }}>
                      {r.label}
                    </td>
                    <td style={{ padding: "2px 0", color: "#333", fontSize: 11 }}>{r.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      case "action":
        return (
          <button
            key={i}
            type="button"
            className="xp-button"
            onClick={() => {
              if (b.app) launchApp(b.app);
              else if (b.href) window.open(b.href, "_blank", "noopener,noreferrer");
            }}
            style={{ display: "inline-flex", alignItems: "center", gap: 5, margin: "2px 6px 8px 0", color: "#000" }}
          >
            <Image src={b.icon} alt="" width={16} height={16} draggable={false} unoptimized />
            {b.label}
          </button>
        );
      case "related":
        return (
          <div key={i} style={{ marginTop: 12, borderTop: "1px solid #D9D5C3", paddingTop: 8 }}>
            <div style={{ fontSize: 11, fontWeight: "bold", color: "#0A246A", marginBottom: 4 }}>Related Topics</div>
            {b.items.map((it) => (
              <RelatedLink key={it.id} label={it.label} onClick={() => openTopic(it.id)} />
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  // ── Content area ───────────────────────────────────────────────────────────
  const renderContent = () => {
    if (view.kind === "home") {
      return (
        <>
          <PageTitle icon="/assets/help.png" title="Welcome to Help and Support" />
          <p style={{ fontSize: 11, lineHeight: 1.6, color: "#000", margin: "0 0 10px 0" }}>
            Use this guide to learn about the portfolio, navigate applications, and explore projects.
            Pick a Help topic from the list on the left, or type a question in the Search box above.
          </p>

          <div style={{ fontSize: 11, fontWeight: "bold", color: "#0A246A", margin: "10px 0 4px 0" }}>
            Pick a Help topic
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2px 16px", marginBottom: 10 }}>
            {["getting-started", "projects", "about", "contact", "resume", "github"].map((id) => (
              <RelatedLink key={id} label={TOPICS[id].title} icon={TOPICS[id].icon} onClick={() => openTopic(id)} />
            ))}
          </div>

          <div
            style={{
              display: "flex",
              gap: 7,
              alignItems: "flex-start",
              background: "#FBFBE8",
              border: "1px solid #E2D98F",
              padding: "5px 8px",
              fontSize: 11,
              lineHeight: 1.5,
            }}
          >
            <Image src="/assets/dialog/info.png" alt="" width={16} height={16} draggable={false} unoptimized style={{ flexShrink: 0, marginTop: 1 }} />
            <span>
              <strong>Did you know? </strong>
              Double-click any icon on the desktop to open an application, just like a real copy of Windows XP.
            </span>
          </div>
        </>
      );
    }

    if (view.kind === "search") {
      return (
        <>
          <PageTitle icon="/assets/search.png" title={`Search Results for “${view.query}”`} />
          {searchResults.length === 0 ? (
            <p style={{ fontSize: 11, lineHeight: 1.6, color: "#000" }}>
              No Help topics matched your search. Try a different word, or pick a topic from the list on the left.
            </p>
          ) : (
            <>
              <p style={{ fontSize: 11, color: "#444", margin: "0 0 8px 0" }}>
                {searchResults.length} topic(s) found. Click a result to open it.
              </p>
              {searchResults.map((t) => (
                <div
                  key={t.id}
                  onClick={() => openTopic(t.id)}
                  className="help-search-result"
                  style={{ display: "flex", gap: 8, padding: "6px 6px", cursor: "pointer", borderBottom: "1px solid #ECECE4" }}
                >
                  <Image src={t.icon} alt="" width={20} height={20} draggable={false} unoptimized style={{ flexShrink: 0, marginTop: 1 }} />
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 11, fontWeight: "bold", color: "#0E3A8C", textDecoration: "underline" }}>{t.title}</div>
                    <div style={{ fontSize: 11, color: "#555", lineHeight: 1.4 }}>{firstParagraph(t)}</div>
                  </div>
                </div>
              ))}
            </>
          )}
        </>
      );
    }

    // topic
    const topic = TOPICS[view.id];
    if (!topic) return null;
    return (
      <>
        <PageTitle icon={topic.icon} title={topic.title} />
        {topic.blocks.map((b, i) => renderBlock(b, i))}
      </>
    );
  };

  const selectedTopicId = view.kind === "topic" ? view.id : null;

  return (
    <div
      style={{
        fontFamily: FONT,
        fontSize: 11,
        color: "#000",
        // Cancel the host window's 12px content padding so the Help Center
        // chrome runs edge-to-edge and fills the full window height.
        margin: -12,
        height: "calc(100% + 24px)",
        display: "flex",
        flexDirection: "column",
        background: "#ECE9D8",
        overflow: "hidden",
      }}
    >
      {/* ---------------- Menu Bar ---------------- */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          padding: "1px 2px",
          background: "linear-gradient(180deg, #FBFAF6 0%, #ECE9DC 100%)",
          borderBottom: "1px solid #E3DEC9",
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

      {/* ---------------- Blue header banner ---------------- */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "8px 12px",
          background: "linear-gradient(180deg, #5E8AD9 0%, #3F6FD1 45%, #2552A8 100%)",
          borderBottom: "1px solid #1B3F86",
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.35)",
        }}
      >
        <Image src="/assets/help.png" alt="Help" width={30} height={30} draggable={false} unoptimized style={{ flexShrink: 0, filter: "drop-shadow(0 1px 1px rgba(0,0,0,0.35))" }} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ color: "#FFFFFF", fontWeight: "bold", fontSize: 14, textShadow: "0 1px 1px rgba(0,0,0,0.35)", lineHeight: 1.15 }}>
            Help and Support Center
          </div>
          <div style={{ color: "#D2E2FB", fontSize: 11 }}>Find answers, tutorials, and support resources.</div>
        </div>

        {/* Search box (header, right) */}
        <div style={{ display: "flex", flexDirection: "column", gap: 3, flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <span style={{ color: "#FFFFFF", fontSize: 11, fontWeight: "bold" }}>Search</span>
            <input
              type="text"
              value={searchBox}
              onChange={(e) => setSearchBox(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") runSearch();
              }}
              aria-label="Search Help"
              className="xp-inset"
              style={{
                width: 150,
                height: 20,
                padding: "0 5px",
                fontFamily: FONT,
                fontSize: 11,
                color: "#000",
                outline: "none",
              }}
            />
            <button
              type="button"
              className="xp-button"
              onClick={runSearch}
              title="Search"
              style={{ display: "flex", alignItems: "center", gap: 4, height: 20, padding: "0 8px", color: "#000" }}
            >
              <Image src="/assets/search.png" alt="" width={14} height={14} draggable={false} unoptimized />
              Search
            </button>
          </div>
        </div>
      </div>

      {/* ---------------- Navigation toolbar ---------------- */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          padding: "3px 6px",
          background: "linear-gradient(180deg, #DCE7F8 0%, #B7CCEC 100%)",
          borderBottom: "1px solid #8FA9D4",
          boxShadow: "inset 0 1px 0 #FFFFFF",
          userSelect: "none",
        }}
      >
        <ToolButton icon={TBIcon.back} label="Back" disabled={back.length === 0} onClick={goBack} />
        <ToolButton icon={TBIcon.forward} label="Forward" disabled={forward.length === 0} onClick={goForward} />
        <ToolSep />
        <ToolButton icon={TBIcon.home} label="Home" onClick={goHome} />
        <ToolButton icon={TBIcon.index} label="Index" onClick={() => openTopic("getting-started")} />
        <ToolButton icon={TBIcon.favorites} label="Favorites" onClick={() => openTopic("portfolio-guide")} />
        <ToolButton icon={TBIcon.history} label="History" onClick={goHome} />
        <ToolSep />
        <ToolButton icon={TBIcon.support} label="Support" onClick={() => openTopic("faq")} />
        <ToolButton icon={TBIcon.options} label="Options" onClick={() => openTopic("troubleshooting")} />
      </div>

      {/* ---------------- Main: sidebar + content ---------------- */}
      <div style={{ flex: 1, display: "flex", minHeight: 0 }}>
        {/* Left navigation pane */}
        <div
          style={{
            width: 188,
            flexShrink: 0,
            overflowY: "auto",
            background: "#D6E3F7",
            borderRight: "1px solid #95AED6",
            paddingBottom: 8,
          }}
        >
          <NavHeader title="Help Topics" />
          <div style={{ padding: "4px 0 6px 0" }}>
            {HELP_TOPIC_IDS.map((id) => (
              <NavLink
                key={id}
                icon={TOPICS[id].icon}
                label={TOPICS[id].title}
                selected={selectedTopicId === id}
                onClick={() => openTopic(id)}
              />
            ))}
          </div>

          <NavHeader title="Support Tasks" />
          <div style={{ padding: "4px 0 6px 0" }}>
            {SUPPORT_TASK_IDS.map((id) => (
              <NavLink
                key={id}
                icon={TOPICS[id].icon}
                label={TOPICS[id].title}
                selected={selectedTopicId === id}
                onClick={() => openTopic(id)}
              />
            ))}
          </div>

          <NavHeader title="Resources" />
          <div style={{ padding: "4px 0 6px 0" }}>
            {RESOURCES.map((r) => (
              <NavLink key={r.label} icon={r.icon} label={r.label} onClick={() => openResource(r)} />
            ))}
          </div>
        </div>

        {/* Right content area */}
        <div style={{ flex: 1, overflowY: "auto", background: "#FFFFFF", padding: "12px 16px" }}>
          {renderContent()}
        </div>
      </div>

      {/* ---------------- Status bar ---------------- */}
      <div
        style={{
          display: "flex",
          alignItems: "stretch",
          height: 20,
          borderTop: "1px solid #FFFFFF",
          background: "#ECE9D8",
          fontSize: 11,
          color: "#3A3A3A",
        }}
      >
        <div style={{ flex: 1, display: "flex", alignItems: "center", padding: "0 8px", borderTop: "1px solid #ACA899", margin: "1px 0 1px 1px", overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>
          {statusText}
        </div>
        <div style={{ width: 150, display: "flex", alignItems: "center", gap: 5, padding: "0 8px", borderTop: "1px solid #ACA899", borderLeft: "1px solid #ACA899", margin: "1px 1px 1px 0" }}>
          <Image src="/assets/help.png" alt="" width={14} height={14} draggable={false} unoptimized />
          Help and Support
        </div>
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ *
 * Related / topic link (blue underline-on-hover)
 * ------------------------------------------------------------------ */

const RelatedLink: React.FC<{ label: string; icon?: string; onClick: () => void }> = ({ label, icon, onClick }) => {
  const [hover, setHover] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{ display: "flex", alignItems: "center", gap: 6, padding: "2px 0", cursor: "pointer", userSelect: "none" }}
    >
      {icon && <Image src={icon} alt="" width={16} height={16} draggable={false} unoptimized style={{ flexShrink: 0 }} />}
      <span style={{ fontSize: 11, color: hover ? "#1E5FCC" : "#0E3A8C", textDecoration: hover ? "underline" : "none" }}>
        {label}
      </span>
    </div>
  );
};
