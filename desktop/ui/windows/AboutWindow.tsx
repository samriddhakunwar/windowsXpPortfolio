"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

const techStack = [
  { name: "Next.js", color: "#000000" },
  { name: "React", color: "#61DAFB" },
  { name: "TypeScript", color: "#3178C6" },
  { name: "Python", color: "#3572A5" },
  { name: "Django", color: "#092E20" },
  { name: "PostgreSQL", color: "#336791" },
  { name: "Docker", color: "#2496ED" },
  { name: "Git", color: "#F05032" },
];

const highlights = [
  { icon: "🎓", label: "B.S. Computer Science", sub: "Tribhuvan University" },
  { icon: "💼", label: "Full-Stack Developer", sub: "3+ years experience" },
  { icon: "🌐", label: "Open Source Contributor", sub: "GitHub active" },
  { icon: "🤖", label: "AI / ML Enthusiast", sub: "TensorFlow, OpenCV" },
];

export const AboutWindow: React.FC = () => {
  const [hoveredTech, setHoveredTech] = useState<string | null>(null);

  return (
    <div style={{ fontFamily: "Tahoma, Arial, sans-serif", fontSize: "11px", maxHeight: "100%", overflowY: "auto" }}>

      {/* Hero banner */}
      <div style={{
        background: "linear-gradient(135deg, #0050DE 0%, #0068FF 40%, #1A7FFF 100%)",
        borderRadius: "4px 4px 0 0",
        padding: "16px 14px 12px",
        marginBottom: "8px",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Decorative circles */}
        <div style={{ position: "absolute", top: -20, right: -20, width: 100, height: 100, borderRadius: "50%", background: "rgba(255,255,255,0.06)" }} />
        <div style={{ position: "absolute", bottom: -30, right: 40, width: 80, height: 80, borderRadius: "50%", background: "rgba(255,255,255,0.04)" }} />

        <div style={{ display: "flex", alignItems: "center", gap: "12px", position: "relative" }}>
          <div style={{
            width: 52, height: 52,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #4FC3F7, #0288D1)",
            border: "2px solid rgba(255,255,255,0.4)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "24px",
            flexShrink: 0,
          }}>
            <Image src="/assets/userprofile.jpg" alt="" width={52} height={52} />
          </div>
          <div>
            <div style={{ color: "#FFF", fontWeight: "bold", fontSize: "15px", marginBottom: "2px", textShadow: "1px 1px 2px rgba(0,0,0,0.4)" }}>
              Samriddha Kunwar
            </div>
            <div style={{ color: "#C8E8FF", fontSize: "11px" }}>Full-Stack Developer · Kathmandu, Nepal</div>
            <div style={{ display: "flex", gap: "6px", marginTop: "6px" }}>
              <a
                href="https://github.com/samriddhakunwar"
                target="_blank"
                rel="noopener noreferrer"
                className="xp-button"
                style={{ textDecoration: "none", color: "#000", fontSize: "10px", padding: "2px 8px", display: "inline-flex", alignItems: "center", gap: "3px" }}
              >
                <Image src="/assets/github.png" alt="" width={12} height={12} /> GitHub
              </a>
              <a
                href="https://linkedin.com/in/samriddhakunwar"
                target="_blank"
                rel="noopener noreferrer"
                className="xp-button"
                style={{ textDecoration: "none", color: "#000", fontSize: "10px", padding: "2px 8px", display: "inline-flex", alignItems: "center", gap: "3px" }}
              >
                <Image src="/assets/linkedin.png" alt="" width={12} height={12} /> LinkedIn
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bio */}
      <div className="xp-panel" style={{ marginBottom: "8px" }}>
        <div style={{ fontWeight: "bold", fontSize: "12px", marginBottom: "6px" }}>👤 About Me</div>
        <p style={{ lineHeight: "1.7", margin: 0, color: "#333" }}>
          Hi! I&apos;m a passionate <strong>Full-Stack Developer</strong> from Nepal with a love for building
          clean, performant, and user-friendly web applications. I specialize in the <strong>React / Next.js</strong> ecosystem
          on the frontend and <strong>Django / Node.js</strong> on the backend.
        </p>
        <p style={{ lineHeight: "1.7", margin: "6px 0 0", color: "#333" }}>
          When I&apos;m not coding, I enjoy exploring <strong>AI &amp; machine learning</strong>, contributing to open source,
          and building side projects that solve real-world problems.
        </p>
      </div>

      {/* Highlights grid */}
      <div className="xp-panel" style={{ marginBottom: "8px" }}>
        <div style={{ fontWeight: "bold", fontSize: "12px", marginBottom: "8px" }}>🏆 Highlights</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px" }}>
          {highlights.map((h) => (
            <div key={h.label} style={{
              background: "linear-gradient(180deg, #fff 0%, #EEF4FF 100%)",
              border: "1px solid #C5D8F0",
              borderRadius: "3px",
              padding: "6px 8px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}>
              <span style={{ fontSize: "18px" }}>{h.icon}</span>
              <div>
                <div style={{ fontWeight: "bold", fontSize: "10px" }}>{h.label}</div>
                <div style={{ color: "#666", fontSize: "10px" }}>{h.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tech Stack */}
      <div className="xp-panel">
        <div style={{ fontWeight: "bold", fontSize: "12px", marginBottom: "8px" }}>🛠 Tech Stack</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
          {techStack.map((tech) => (
            <motion.span
              key={tech.name}
              whileHover={{ scale: 1.08, y: -1 }}
              onMouseEnter={() => setHoveredTech(tech.name)}
              onMouseLeave={() => setHoveredTech(null)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
                padding: "3px 8px",
                background: hoveredTech === tech.name
                  ? `${tech.color}22`
                  : "linear-gradient(180deg, #fff 0%, #ECE9D8 100%)",
                border: `1px solid ${hoveredTech === tech.name ? tech.color : "#ACA899"}`,
                borderRadius: "3px",
                fontSize: "10px",
                fontWeight: "bold",
                cursor: "default",
                color: hoveredTech === tech.name ? tech.color : "#333",
                transition: "all 150ms ease",
              }}
            >
              <span style={{
                width: 7, height: 7, borderRadius: "50%",
                background: tech.color, display: "inline-block",
                border: "1px solid rgba(0,0,0,0.15)",
              }} />
              {tech.name}
            </motion.span>
          ))}
        </div>
      </div>
    </div>
  );
};
