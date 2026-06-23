"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useDesktop } from "@/desktop/DesktopProvider";

// ─── Skill data (UNCHANGED) ─────────────────────────────────────────────────────

interface SkillItem {
  name: string;
  proficiency: number;
}

interface SkillCategory {
  id: string;
  title: string;
  icon: string;
  accentColor: string;
  barGradient: string;
  glowColor: string;
  items: SkillItem[];
}

const SKILL_CATEGORIES: SkillCategory[] = [
  {
    id: "frontend",
    title: "Frontend",
    icon: "🎨",
    accentColor: "#1466E5",
    barGradient: "linear-gradient(90deg, #5AA0F0 0%, #1466E5 100%)",
    glowColor: "rgba(20,102,229,0.35)",
    items: [
      { name: "React",        proficiency: 95 },
      { name: "Next.js",      proficiency: 90 },
      { name: "TypeScript",   proficiency: 88 },
      { name: "Tailwind CSS", proficiency: 92 },
      { name: "CSS/SCSS",     proficiency: 90 },
      { name: "JavaScript",   proficiency: 95 },
    ],
  },
  {
    id: "backend",
    title: "Backend",
    icon: "⚙️",
    accentColor: "#0A6A00",
    barGradient: "linear-gradient(90deg, #4DD63C 0%, #0A8A00 100%)",
    glowColor: "rgba(10,106,0,0.32)",
    items: [
      { name: "Node.js",  proficiency: 85 },
      { name: "Django",   proficiency: 88 },
      { name: "Python",   proficiency: 90 },
      { name: "Express.js", proficiency: 80 },
    ],
  },
  {
    id: "aiml",
    title: "AI / Machine Learning",
    icon: "🧠",
    accentColor: "#7A00CC",
    barGradient: "linear-gradient(90deg, #B060E8 0%, #7A00CC 100%)",
    glowColor: "rgba(122,0,204,0.32)",
    items: [
      { name: "TensorFlow",  proficiency: 80 },
      { name: "OpenCV",      proficiency: 85 },
      { name: "Scikit-learn",proficiency: 82 },
      { name: "Pandas",      proficiency: 88 },
      { name: "NumPy",       proficiency: 90 },
    ],
  },
  {
    id: "tools",
    title: "Tools & Technologies",
    icon: "🛠",
    accentColor: "#B84800",
    barGradient: "linear-gradient(90deg, #F07840 0%, #C05020 100%)",
    glowColor: "rgba(184,72,0,0.32)",
    items: [
      { name: "Git & GitHub", proficiency: 92 },
      { name: "Docker",       proficiency: 75 },
      { name: "Postman",      proficiency: 90 },
      { name: "VS Code",      proficiency: 95 },
    ],
  },
  {
    id: "database",
    title: "Database",
    icon: "🗄️",
    accentColor: "#007878",
    barGradient: "linear-gradient(90deg, #30B8B8 0%, #008080 100%)",
    glowColor: "rgba(0,120,120,0.32)",
    items: [
      { name: "PostgreSQL", proficiency: 85 },
      { name: "MySQL",      proficiency: 88 },
      { name: "SQLite",     proficiency: 90 },
    ],
  },
  {
    id: "other",
    title: "Other",
    icon: "🌐",
    accentColor: "#505050",
    barGradient: "linear-gradient(90deg, #909090 0%, #606060 100%)",
    glowColor: "rgba(80,80,80,0.28)",
    items: [
      { name: "REST API Design",      proficiency: 90 },
      { name: "Authentication (JWT)", proficiency: 88 },
      { name: "WebSockets",           proficiency: 80 },
    ],
  },
];

const highlights = [
  { icon: "🎓", label: "B.S. Computer Science", sub: "Tribhuvan University" },
  { icon: "💼", label: "Full-Stack Developer",   sub: "3+ years experience" },
  { icon: "🌐", label: "Open Source Contributor",sub: "GitHub active" },
  { icon: "🤖", label: "AI / ML Enthusiast",     sub: "TensorFlow, OpenCV" },
];

const TECH_STACK = [
  { name: "Next.js",    color: "#000000" },
  { name: "React",      color: "#61DAFB" },
  { name: "TypeScript", color: "#3178C6" },
  { name: "Python",     color: "#3572A5" },
  { name: "Django",     color: "#092E20" },
  { name: "PostgreSQL", color: "#336791" },
  { name: "Docker",     color: "#2496ED" },
  { name: "Git",        color: "#F05032" },
  { name: "TensorFlow", color: "#FF6F00" },
  { name: "OpenCV",     color: "#5C3EE8" },
];

const FONT = `"Tahoma", "Segoe UI", Arial, sans-serif`;

/** Skills shown as XP progress lists; the "tools" category is shown as a Details view. */
const TOOLS_CATEGORY = SKILL_CATEGORIES.find((c) => c.id === "tools")!;
const SKILL_LIST_CATEGORIES = SKILL_CATEGORIES.filter((c) => c.id !== "tools");

/** Map a numeric proficiency onto an Explorer-style experience word. */
const experienceLabel = (p: number): string =>
  p >= 90 ? "Expert" : p >= 75 ? "Advanced" : "Intermediate";

// ─── Reusable XP primitives ─────────────────────────────────────────────────────

/** Etched property-sheet group box, à la System Properties. */
const GroupBox: React.FC<{ title: string; children: React.ReactNode; style?: React.CSSProperties }> = ({
  title,
  children,
  style,
}) => (
  <fieldset
    style={{
      border: "1px solid #ACA899",
      margin: "0 0 12px 0",
      padding: "10px 12px 12px 12px",
      ...style,
    }}
  >
    <legend
      style={{
        padding: "0 4px",
        fontWeight: "bold",
        fontSize: 11,
        color: "#0A246A",
        background: "#ECE9D8",
      }}
    >
      {title}
    </legend>
    {children}
  </fieldset>
);

/** Native-looking XP segmented progress bar (sunken track + green blocks). */
const XPProgressBar: React.FC<{ value: number }> = ({ value }) => (
  <div
    style={{
      flex: 1,
      height: 15,
      background: "#FFFFFF",
      border: "1px solid",
      borderColor: "#808080 #FFFFFF #FFFFFF #808080",
      padding: 1,
      boxSizing: "border-box",
    }}
  >
    <div
      style={{
        width: `${value}%`,
        height: "100%",
        backgroundColor: "#16A516",
        backgroundImage:
          "repeating-linear-gradient(90deg, rgba(255,255,255,0) 0px, rgba(255,255,255,0) 8px, #FFFFFF 8px, #FFFFFF 10px)," +
          "linear-gradient(180deg, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0) 45%, rgba(0,0,0,0.10) 100%)",
      }}
    />
  </div>
);

/** Up-chevron inside the blue task-pane header (mirrors My Computer). */
const HeaderChevron: React.FC = () => (
  <span
    style={{
      width: 13,
      height: 13,
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: "50%",
      background: "linear-gradient(180deg, #5E97EC 0%, #2A5BC0 100%)",
      boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.4)",
      flexShrink: 0,
    }}
  >
    <span
      style={{
        width: 0,
        height: 0,
        borderLeft: "3px solid transparent",
        borderRight: "3px solid transparent",
        borderBottom: "4px solid #FFFFFF",
      }}
    />
  </span>
);

/** Collapsible-looking task-pane group (System Tasks / Other Places / Details). */
const TaskGroup: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div style={{ margin: "0 0 10px 0" }}>
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "3px 8px",
        background: "linear-gradient(180deg, #F0F4FD 0%, #C6D9F1 100%)",
        borderTop: "1px solid #FFFFFF",
        color: "#1B438F",
        fontWeight: "bold",
        fontSize: 11,
      }}
    >
      <span>{title}</span>
      <HeaderChevron />
    </div>
    <div
      style={{
        background: "linear-gradient(180deg, #EEF3FC 0%, #D9E4F5 100%)",
        padding: "6px 10px 8px 10px",
      }}
    >
      {children}
    </div>
  </div>
);

/** A single-click task-pane link (icon + blue underline-on-hover). */
const TaskLink: React.FC<{
  icon?: string;
  label: string;
  href?: string;
  onClick?: () => void;
}> = ({ icon, label, href, onClick }) => {
  const [hover, setHover] = useState(false);
  const inner = (
    <>
      {icon && (
        <Image src={icon} alt="" width={16} height={16} draggable={false} unoptimized style={{ flexShrink: 0 }} />
      )}
      <span
        style={{
          fontSize: 11,
          color: hover ? "#1E5FCC" : "#0E3A8C",
          textDecoration: hover ? "underline" : "none",
        }}
      >
        {label}
      </span>
    </>
  );
  const sharedStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: 6,
    padding: "2px 0",
    cursor: "pointer",
    userSelect: "none",
    textDecoration: "none",
  };
  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={sharedStyle}
      >
        {inner}
      </a>
    );
  }
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={sharedStyle}
    >
      {inner}
    </div>
  );
};

/** Blue category divider used above content groups (mirrors My Computer). */
const CategoryHeader: React.FC<{ title: string }> = ({ title }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 8, margin: "0 0 6px 0" }}>
    <span style={{ fontSize: 11, fontWeight: "bold", color: "#003399", whiteSpace: "nowrap" }}>{title}</span>
    <span
      style={{
        flex: 1,
        height: 2,
        background: "linear-gradient(to right, #A6C0E8 0%, #E8EEF8 60%, transparent 100%)",
      }}
    />
  </div>
);

/** One row of the Tools "Details view" (Explorer-style). */
const ToolRow: React.FC<{ name: string; experience: string; even: boolean }> = ({ name, experience, even }) => {
  const [hover, setHover] = useState(false);
  const cell: React.CSSProperties = {
    padding: "2px 8px",
    fontSize: 11,
    color: hover ? "#FFFFFF" : "#000000",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  };
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 120px",
        alignItems: "center",
        background: hover ? "#316AC5" : even ? "#FFFFFF" : "#F4F7FD",
        cursor: "default",
        userSelect: "none",
      }}
    >
      <div style={{ ...cell, display: "flex", alignItems: "center", gap: 6 }}>
        <Image src="/assets/defaultprog.png" alt="" width={16} height={16} draggable={false} unoptimized style={{ flexShrink: 0 }} />
        {name}
      </div>
      <div style={cell}>{experience}</div>
    </div>
  );
};

// ─── Main component ─────────────────────────────────────────────────────────────

export const AboutWindow: React.FC = () => {
  const { launchApp } = useDesktop();

  const totalSkills = SKILL_CATEGORIES.reduce((acc, c) => acc + c.items.length, 0);

  return (
    <div
      style={{
        // Cancel the host window's 12px content padding so the chrome runs edge-to-edge.
        margin: -12,
        height: "calc(100% + 24px)",
        fontFamily: FONT,
        fontSize: 11,
        color: "#000000",
        display: "flex",
        flexDirection: "column",
        background: "#ECE9D8",
        overflow: "hidden",
      }}
    >
      {/* ── Profile header — Windows XP "User Accounts" style ── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "10px 12px",
          background: "linear-gradient(180deg, #FFFFFF 0%, #ECE9D8 100%)",
          borderBottom: "1px solid #ACA899",
          flexShrink: 0,
        }}
      >
        <div
          className="xp-inset"
          style={{ padding: 2, background: "#FFFFFF", lineHeight: 0, flexShrink: 0 }}
        >
          <Image
            src="/assets/userprofile.jpg"
            alt="Samriddha Kunwar"
            width={48}
            height={48}
            style={{ objectFit: "cover", display: "block" }}
          />
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: "bold", fontSize: 13, color: "#0A246A" }}>Samriddha Kunwar</div>
          <div style={{ fontSize: 11, color: "#000000" }}>Full-Stack Developer</div>
          <div style={{ fontSize: 11, color: "#666666" }}>Kathmandu, Nepal</div>
        </div>

        <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
          <a
            href="https://github.com/samriddhakunwar"
            target="_blank"
            rel="noopener noreferrer"
            className="xp-button"
            style={{
              textDecoration: "none",
              color: "#000000",
              fontSize: 11,
              padding: "2px 10px 2px 7px",
              display: "inline-flex",
              alignItems: "center",
              gap: 5,
              height: 22,
            }}
          >
            <Image src="/assets/github.png" alt="" width={14} height={14} unoptimized /> GitHub
          </a>
          <a
            href="https://linkedin.com/in/samriddhakunwar"
            target="_blank"
            rel="noopener noreferrer"
            className="xp-button"
            style={{
              textDecoration: "none",
              color: "#000000",
              fontSize: 11,
              padding: "2px 10px 2px 7px",
              display: "inline-flex",
              alignItems: "center",
              gap: 5,
              height: 22,
            }}
          >
            <Image src="/assets/linkedin.png" alt="" width={14} height={14} unoptimized /> LinkedIn
          </a>
        </div>
      </div>

      {/* ── Body: task pane + property sheet ── */}
      <div style={{ flex: 1, display: "flex", minHeight: 0 }}>
        {/* ══ LEFT TASK PANE ══ */}
        <div
          style={{
            width: 190,
            flexShrink: 0,
            overflowY: "auto",
            padding: "10px 8px",
            background: "linear-gradient(180deg, #E9EFFB 0%, #C9D7EF 100%)",
            borderRight: "1px solid #BAC6DD",
          }}
        >
          <TaskGroup title="System Tasks">
            <TaskLink icon="/assets/pdf.png" label="View Resume" href="/resume.pdf" />
            <TaskLink icon="/assets/folder_program.png" label="Open Projects" onClick={() => launchApp("projects")} />
            <TaskLink icon="/assets/outlook_large.png" label="Contact Me" onClick={() => launchApp("contact")} />
          </TaskGroup>

          <TaskGroup title="Other Places">
            <TaskLink icon="/assets/mycomputer.png" label="My Computer" onClick={() => launchApp("mycomputer")} />
            <TaskLink icon="/assets/folder.png" label="My Documents" onClick={() => launchApp("resume")} />
            <TaskLink icon="/assets/github.png" label="GitHub" href="https://github.com/samriddhakunwar" />
            <TaskLink icon="/assets/linkedin.png" label="LinkedIn" href="https://linkedin.com/in/samriddhakunwar" />
          </TaskGroup>

          <TaskGroup title="Details">
            <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 8 }}>
              <Image src="/assets/users.png" alt="" width={28} height={28} draggable={false} unoptimized style={{ flexShrink: 0 }} />
              <div style={{ minWidth: 0 }}>
                <div style={{ fontWeight: "bold", color: "#1B438F" }}>Samriddha Kunwar</div>
                <div style={{ color: "#3A3A3A" }}>Full-Stack Developer</div>
              </div>
            </div>
            {highlights.map((h) => (
              <div key={h.label} style={{ marginBottom: 5 }}>
                <div style={{ fontWeight: "bold", fontSize: 11, color: "#1B438F" }}>{h.label}</div>
                <div style={{ fontSize: 11, color: "#3A3A3A" }}>{h.sub}</div>
              </div>
            ))}
            <div style={{ marginTop: 2 }}>
              <div style={{ fontWeight: "bold", fontSize: 11, color: "#1B438F" }}>Location</div>
              <div style={{ fontSize: 11, color: "#3A3A3A" }}>Kathmandu, Nepal</div>
            </div>
          </TaskGroup>
        </div>

        {/* ══ RIGHT PROPERTY SHEET ══ */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "12px 14px",
            background: "#ECE9D8",
            minWidth: 0,
          }}
        >
          {/* About Me */}
          <GroupBox title="About Me">
            <p style={{ margin: 0, lineHeight: 1.55, color: "#000000" }}>
              Hi! I&apos;m a passionate <strong>Full-Stack Developer</strong> from Nepal with a love for
              building clean, performant, and user-friendly web applications. I specialize in the{" "}
              <strong>React / Next.js</strong> ecosystem on the frontend and{" "}
              <strong>Django / Node.js</strong> on the backend.
            </p>
            <p style={{ margin: "8px 0 0 0", lineHeight: 1.55, color: "#000000" }}>
              When I&apos;m not coding, I enjoy exploring <strong>AI &amp; machine learning</strong>,
              contributing to open source, and building side projects that solve real-world problems.
            </p>
          </GroupBox>

          {/* Skills — XP progress lists grouped by category */}
          <GroupBox title="Skills">
            {SKILL_LIST_CATEGORIES.map((cat, idx) => (
              <div key={cat.id} style={{ marginTop: idx === 0 ? 0 : 12 }}>
                <CategoryHeader title={cat.title} />
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  {cat.items.map((item) => (
                    <div key={item.name} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ width: 110, flexShrink: 0, fontSize: 11, color: "#000000" }}>{item.name}</span>
                      <XPProgressBar value={item.proficiency} />
                      <span style={{ width: 32, flexShrink: 0, textAlign: "right", fontSize: 11, color: "#333333" }}>
                        {item.proficiency}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </GroupBox>

          {/* Tools & Technologies — Explorer Details view */}
          <GroupBox title={TOOLS_CATEGORY.title}>
            <div className="xp-inset" style={{ background: "#FFFFFF", padding: 0 }}>
              {/* column headers */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 120px",
                  background: "linear-gradient(180deg, #FFFFFF 0%, #ECE9D8 100%)",
                  borderBottom: "1px solid #ACA899",
                }}
              >
                <div style={{ padding: "2px 8px", fontSize: 11, borderRight: "1px solid #ACA899" }}>Name</div>
                <div style={{ padding: "2px 8px", fontSize: 11 }}>Experience</div>
              </div>
              {/* rows */}
              {TOOLS_CATEGORY.items.map((item, i) => (
                <ToolRow
                  key={item.name}
                  name={item.name}
                  experience={experienceLabel(item.proficiency)}
                  even={i % 2 === 0}
                />
              ))}
            </div>
          </GroupBox>

          {/* Tech Stack — flat XP tags */}
          <GroupBox title="Tech Stack" style={{ marginBottom: 0 }}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
              {TECH_STACK.map((tech) => (
                <span
                  key={tech.name}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 5,
                    padding: "2px 7px",
                    background: "#FFFFFF",
                    border: "1px solid #ACA899",
                    fontSize: 11,
                    color: "#000000",
                  }}
                >
                  <span
                    style={{
                      width: 8,
                      height: 8,
                      background: tech.color,
                      display: "inline-block",
                      border: "1px solid rgba(0,0,0,0.25)",
                    }}
                  />
                  {tech.name}
                </span>
              ))}
            </div>
          </GroupBox>
        </div>
      </div>

      {/* ── Status bar ── */}
      <div
        style={{
          display: "flex",
          alignItems: "stretch",
          height: 20,
          borderTop: "1px solid #FFFFFF",
          background: "#ECE9D8",
          fontSize: 11,
          color: "#3A3A3A",
          flexShrink: 0,
        }}
      >
        <div style={{ flex: 1, display: "flex", alignItems: "center", padding: "0 8px", borderTop: "1px solid #ACA899", margin: "1px 0 1px 1px" }}>
          Full-Stack Developer
        </div>
        <div style={{ width: 200, display: "flex", alignItems: "center", gap: 5, padding: "0 8px", borderTop: "1px solid #ACA899", borderLeft: "1px solid #ACA899", margin: "1px 1px 1px 0" }}>
          <Image src="/assets/users.png" alt="" width={14} height={14} draggable={false} unoptimized />
          {totalSkills} skills · {SKILL_CATEGORIES.length} categories
        </div>
      </div>
    </div>
  );
};
