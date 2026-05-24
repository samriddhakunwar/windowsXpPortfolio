"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";

// ─── Skill data ───────────────────────────────────────────────────────────────

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

// ─── Animated progress bar ────────────────────────────────────────────────────

interface AnimatedBarProps {
  proficiency: number;
  barGradient: string;
  glowColor: string;
  delay: number;
}

const AnimatedBar: React.FC<AnimatedBarProps> = ({ proficiency, barGradient, glowColor, delay }) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10px" });
  const [hovered, setHovered] = useState(false);

  return (
    <div
      ref={ref}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: "100%",
        height: "12px",
        background: "#D8D0C0",
        border: "1px solid #ACA899",
        borderRadius: "1px",
        overflow: "hidden",
        boxShadow: "inset 0 1px 2px rgba(0,0,0,0.18)",
        transition: "box-shadow 200ms",
        ...(hovered ? { boxShadow: `inset 0 1px 2px rgba(0,0,0,0.18), 0 0 5px ${glowColor}` } : {}),
      }}
    >
      <motion.div
        initial={{ width: 0 }}
        animate={inView ? { width: `${proficiency}%` } : { width: 0 }}
        transition={{ duration: 0.85, delay, ease: [0.4, 0, 0.2, 1] }}
        style={{
          height: "100%",
          background: barGradient,
          borderRadius: "1px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Repeating XP-style ridges */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "repeating-linear-gradient(90deg, transparent 0px, transparent 6px, rgba(255,255,255,0.08) 6px, rgba(255,255,255,0.08) 7px)",
          }}
        />
        {/* Shine sweep */}
        <motion.div
          initial={{ x: "-100%" }}
          animate={inView ? { x: "220%" } : { x: "-100%" }}
          transition={{ duration: 0.55, delay: delay + 0.75, ease: "easeOut" }}
          style={{
            position: "absolute",
            top: 0, bottom: 0,
            width: "35%",
            background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.42), transparent)",
          }}
        />
        {/* Top highlight line */}
        <div
          style={{
            position: "absolute",
            top: 0, left: 0, right: 0,
            height: "3px",
            background: "rgba(255,255,255,0.28)",
          }}
        />
      </motion.div>
    </div>
  );
};

// ─── Skill category card ──────────────────────────────────────────────────────

interface SkillCardProps {
  category: SkillCategory;
  baseDelay: number;
}

const SkillCard: React.FC<SkillCardProps> = ({ category, baseDelay }) => (
  <div
    style={{
      border: `1px solid ${category.accentColor}55`,
      borderRadius: "2px",
      background: "#FAFAFA",
      boxShadow: "inset 0 1px 0 rgba(255,255,255,0.9), 0 1px 3px rgba(0,0,0,0.08)",
      overflow: "hidden",
    }}
  >
    {/* XP group-box header */}
    <div
      style={{
        background: `linear-gradient(180deg, ${category.accentColor}28 0%, ${category.accentColor}12 100%)`,
        borderBottom: `1px solid ${category.accentColor}44`,
        padding: "4px 8px",
        display: "flex",
        alignItems: "center",
        gap: "5px",
      }}
    >
      <span style={{ fontSize: "12px" }}>{category.icon}</span>
      <span style={{ fontWeight: "bold", fontSize: "10px", color: category.accentColor }}>
        {category.title}
      </span>
    </div>

    {/* Skill rows */}
    <div style={{ padding: "7px 8px", display: "flex", flexDirection: "column", gap: "6px" }}>
      {category.items.map((item, i) => (
        <div key={item.name}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "2px" }}>
            <span style={{ fontWeight: "bold", color: "#222", fontSize: "10px" }}>{item.name}</span>
            <span
              style={{
                color: category.accentColor,
                fontWeight: "bold",
                fontSize: "9px",
                background: `${category.accentColor}14`,
                padding: "1px 4px",
                borderRadius: "2px",
                border: `1px solid ${category.accentColor}30`,
              }}
            >
              {item.proficiency}%
            </span>
          </div>
          <AnimatedBar
            proficiency={item.proficiency}
            barGradient={category.barGradient}
            glowColor={category.glowColor}
            delay={baseDelay + i * 0.055}
          />
        </div>
      ))}
    </div>
  </div>
);

// ─── XP Group Box wrapper ─────────────────────────────────────────────────────

const XPGroupBox: React.FC<{
  title: string;
  icon?: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ title, icon, children, style }) => (
  <div
    style={{
      border: "1px solid #7AA7E0",
      borderRadius: "3px",
      marginBottom: "8px",
      background: "#FFFFFF",
      boxShadow: "inset 0 1px 0 rgba(255,255,255,0.8)",
      ...style,
    }}
  >
    <div
      style={{
        background: "linear-gradient(180deg, #DAE9FF 0%, #C5D9F5 100%)",
        borderBottom: "1px solid #7AA7E0",
        padding: "4px 8px",
        display: "flex",
        alignItems: "center",
        gap: "5px",
        borderRadius: "2px 2px 0 0",
      }}
    >
      {icon && <span style={{ fontSize: "12px" }}>{icon}</span>}
      <span style={{ fontWeight: "bold", fontSize: "11px", color: "#0040A0" }}>{title}</span>
    </div>
    <div style={{ padding: "8px" }}>{children}</div>
  </div>
);

// ─── Main component ───────────────────────────────────────────────────────────

export const AboutWindow: React.FC = () => {
  return (
    <div
      style={{
        fontFamily: "Tahoma, Arial, sans-serif",
        fontSize: "11px",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        background: "#ECE9D8",
      }}
    >
      {/* ── Header banner ── */}
      <div
        style={{
          background: "linear-gradient(180deg, #0058E0 0%, #004ECC 100%)",
          padding: "6px 10px 5px",
          display: "flex",
          alignItems: "center",
          gap: "10px",
          flexShrink: 0,
          borderBottom: "2px solid #003BB0",
        }}
      >
        <div
          style={{
            width: 40, height: 40,
            borderRadius: "3px",
            border: "2px solid rgba(255,255,255,0.5)",
            overflow: "hidden",
            flexShrink: 0,
          }}
        >
          <Image
            src="/assets/userprofile.jpg"
            alt="Samriddha"
            width={40}
            height={40}
            style={{ objectFit: "cover" }}
          />
        </div>

        <div style={{ flex: 1 }}>
          <div
            style={{
              color: "#FFF",
              fontWeight: "bold",
              fontSize: "13px",
              textShadow: "1px 1px 2px rgba(0,0,0,0.5)",
            }}
          >
            Samriddha Kunwar
          </div>
          <div style={{ color: "#B8D8FF", fontSize: "10px" }}>
            Full-Stack Developer · Kathmandu, Nepal
          </div>
        </div>

        <div style={{ display: "flex", gap: "5px" }}>
          <a
            href="https://github.com/samriddhakunwar"
            target="_blank"
            rel="noopener noreferrer"
            className="xp-button"
            style={{
              textDecoration: "none",
              color: "#000",
              fontSize: "10px",
              padding: "2px 7px",
              display: "inline-flex",
              alignItems: "center",
              gap: "3px",
            }}
          >
            <Image src="/assets/github.png" alt="" width={11} height={11} /> GitHub
          </a>
          <a
            href="https://linkedin.com/in/samriddhakunwar"
            target="_blank"
            rel="noopener noreferrer"
            className="xp-button"
            style={{
              textDecoration: "none",
              color: "#000",
              fontSize: "10px",
              padding: "2px 7px",
              display: "inline-flex",
              alignItems: "center",
              gap: "3px",
            }}
          >
            <Image src="/assets/linkedin.png" alt="" width={11} height={11} /> LinkedIn
          </a>
        </div>
      </div>

      {/* ── Body: two-column layout ── */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden", minHeight: 0 }}>

        {/* ══ LEFT SIDEBAR ══ */}
        <div
          style={{
            width: "175px",
            flexShrink: 0,
            background: "linear-gradient(180deg, #C5D9F5 0%, #B8CEF0 100%)",
            borderRight: "1px solid #7AA7E0",
            display: "flex",
            flexDirection: "column",
            overflowY: "auto",
            padding: "8px 6px",
          }}
        >
          {/* Basic Information header */}
          <div
            style={{
              background: "linear-gradient(180deg, #3580CB 0%, #2B6BBF 100%)",
              borderRadius: "3px",
              padding: "4px 8px",
              marginBottom: "8px",
              color: "#FFF",
              fontWeight: "bold",
              fontSize: "11px",
              display: "flex",
              alignItems: "center",
              gap: "5px",
              border: "1px solid #1A5AAF",
            }}
          >
            <span>📋</span> Basic Information
          </div>

          {highlights.map((h) => (
            <div
              key={h.label}
              style={{
                background: "rgba(255,255,255,0.65)",
                border: "1px solid #A8C4E8",
                borderRadius: "2px",
                padding: "5px 6px",
                marginBottom: "4px",
                display: "flex",
                alignItems: "flex-start",
                gap: "6px",
              }}
            >
              <span style={{ fontSize: "14px", flexShrink: 0 }}>{h.icon}</span>
              <div>
                <div style={{ fontWeight: "bold", fontSize: "10px", color: "#002080" }}>
                  {h.label}
                </div>
                <div style={{ color: "#4A6A9A", fontSize: "9px" }}>{h.sub}</div>
              </div>
            </div>
          ))}

          <div style={{ height: "1px", background: "#7AA7E0", margin: "8px 0" }} />

          {/* Quick Links header */}
          <div
            style={{
              background: "linear-gradient(180deg, #3580CB 0%, #2B6BBF 100%)",
              borderRadius: "3px",
              padding: "4px 8px",
              marginBottom: "8px",
              color: "#FFF",
              fontWeight: "bold",
              fontSize: "11px",
              display: "flex",
              alignItems: "center",
              gap: "5px",
              border: "1px solid #1A5AAF",
            }}
          >
            <span>🔗</span> Quick Links
          </div>

          {[
            { label: "GitHub",   href: "https://github.com/samriddhakunwar",      icon: "/assets/github.png" },
            { label: "LinkedIn", href: "https://linkedin.com/in/samriddhakunwar", icon: "/assets/linkedin.png" },
            { label: "Resume",   href: "/resume.pdf",                     icon: "/assets/doc.png" },
          ].map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "4px 6px",
                marginBottom: "3px",
                background: "rgba(255,255,255,0.55)",
                border: "1px solid #A8C4E8",
                borderRadius: "2px",
                textDecoration: "none",
                color: "#0040C0",
                fontSize: "10px",
                fontWeight: "bold",
                cursor: "pointer",
                transition: "background 120ms",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.9)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.55)";
              }}
            >
              <Image src={link.icon} alt="" width={14} height={14} unoptimized />
              {link.label}
            </a>
          ))}

          {/* Skills legend */}
          <div style={{ height: "1px", background: "#7AA7E0", margin: "8px 0" }} />
          <div
            style={{
              background: "linear-gradient(180deg, #3580CB 0%, #2B6BBF 100%)",
              borderRadius: "3px",
              padding: "4px 8px",
              marginBottom: "8px",
              color: "#FFF",
              fontWeight: "bold",
              fontSize: "11px",
              display: "flex",
              alignItems: "center",
              gap: "5px",
              border: "1px solid #1A5AAF",
            }}
          >
            <span>📊</span> Skill Legend
          </div>
          {SKILL_CATEGORIES.map((cat) => (
            <div
              key={cat.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "5px",
                padding: "3px 5px",
                marginBottom: "2px",
                fontSize: "9px",
                color: "#222",
              }}
            >
              <div
                style={{
                  width: "22px",
                  height: "6px",
                  background: cat.barGradient,
                  borderRadius: "1px",
                  border: "1px solid rgba(0,0,0,0.12)",
                  flexShrink: 0,
                }}
              />
              <span style={{ color: cat.accentColor, fontWeight: "bold" }}>
                {cat.icon} {cat.title}
              </span>
            </div>
          ))}
        </div>

        {/* ══ RIGHT MAIN CONTENT ══ */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "8px",
            background: "#F0EBE0",
            minWidth: 0,
          }}
        >
          {/* About Me group box */}
          <XPGroupBox title="About Me" icon="👤">
            <p style={{ lineHeight: "1.7", margin: 0, color: "#333" }}>
              Hi! I&apos;m a passionate <strong>Full-Stack Developer</strong> from Nepal with a love for
              building clean, performant, and user-friendly web applications. I specialize in the{" "}
              <strong>React / Next.js</strong> ecosystem on the frontend and{" "}
              <strong>Django / Node.js</strong> on the backend.
            </p>
            <p style={{ lineHeight: "1.7", margin: "6px 0 0", color: "#333" }}>
              When I&apos;m not coding, I enjoy exploring <strong>AI &amp; machine learning</strong>,
              contributing to open source, and building side projects that solve real-world problems.
            </p>
          </XPGroupBox>

          {/* Skills group box — 2-column card grid */}
          <XPGroupBox title="Skills" icon="🛠">
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "8px",
              }}
            >
              {SKILL_CATEGORIES.map((cat, idx) => (
                <SkillCard
                  key={cat.id}
                  category={cat}
                  baseDelay={idx * 0.08}
                />
              ))}
            </div>
          </XPGroupBox>

          {/* Tech Stack group box */}
          <XPGroupBox title="Tech Stack" icon="💻" style={{ marginBottom: 0 }}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
              {[
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
              ].map((tech) => (
                <motion.span
                  key={tech.name}
                  whileHover={{ scale: 1.08, y: -1 }}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "4px",
                    padding: "3px 8px",
                    background: "linear-gradient(180deg, #fff 0%, #ECE9D8 100%)",
                    border: "1px solid #ACA899",
                    borderRadius: "3px",
                    fontSize: "10px",
                    fontWeight: "bold",
                    cursor: "default",
                    color: "#333",
                    transition: "all 150ms ease",
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.background = `${tech.color}22`;
                    el.style.borderColor = tech.color;
                    el.style.color = tech.color;
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.background = "linear-gradient(180deg, #fff 0%, #ECE9D8 100%)";
                    el.style.borderColor = "#ACA899";
                    el.style.color = "#333";
                  }}
                >
                  <span
                    style={{
                      width: 7,
                      height: 7,
                      borderRadius: "50%",
                      background: tech.color,
                      display: "inline-block",
                      border: "1px solid rgba(0,0,0,0.15)",
                    }}
                  />
                  {tech.name}
                </motion.span>
              ))}
            </div>
          </XPGroupBox>
        </div>
      </div>

      {/* ── Status bar ── */}
      <div
        style={{
          background: "linear-gradient(180deg, #D4E4F8 0%, #C8D8F0 100%)",
          borderTop: "1px solid #7AA7E0",
          padding: "2px 10px",
          fontSize: "10px",
          color: "#003080",
          flexShrink: 0,
        }}
      >
        Full-Stack Developer · {SKILL_CATEGORIES.reduce((acc, c) => acc + c.items.length, 0)} skills across{" "}
        {SKILL_CATEGORIES.length} categories
      </div>
    </div>
  );
};
