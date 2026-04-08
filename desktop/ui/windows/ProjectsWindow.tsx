"use client";

import { projects } from "@/data/projects";
import React, { useState } from "react";
import Image from "next/image";

export const ProjectsWindow: React.FC = () => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <div
      style={{
        fontFamily: "Tahoma, Arial, sans-serif",
        fontSize: "11px",
        maxHeight: "100%",
        overflowY: "auto",
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
        <Image src="/assets/folder_program.png" alt="" width={20} height={20} />
        <div>
          <div style={{ fontWeight: "bold", fontSize: "12px" }}>My Projects</div>
          <div style={{ color: "#666" }}>{projects.length} projects found</div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
        {projects.map((project) => (
          <div
            key={project.id}
            className="xp-project-card"
            onMouseEnter={() => setHoveredId(project.id)}
            onMouseLeave={() => setHoveredId(null)}
            style={{
              background: hoveredId === project.id
                ? "linear-gradient(180deg, #FFFFFF 0%, #EEF4FF 100%)"
                : "#ECE9D8",
              border: "2px solid",
              borderColor: hoveredId === project.id
                ? "#FFFFFF #5588CC #5588CC #FFFFFF"
                : "#FFFFFF #ACA899 #ACA899 #FFFFFF",
              padding: "0",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
              transition: "border-color 150ms ease, background 150ms ease",
            }}
          >
            {/* Image area */}
            <div
              style={{
                height: "90px",
                background: "linear-gradient(135deg, #1E6BC5 0%, #0097E6 50%, #3578D8 100%)",
                position: "relative",
                overflow: "hidden",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              {project.image ? (
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  style={{ objectFit: "cover", opacity: 0.85 }}
                  onError={() => {}} // Silently fail, fallback is the gradient
                />
              ) : null}
              {/* Always show title overlay */}
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  background: "linear-gradient(0deg, rgba(0,0,0,0.65) 0%, transparent 100%)",
                  padding: "6px 8px 4px",
                  color: "#FFF",
                  fontSize: "10px",
                  fontWeight: "bold",
                  textShadow: "1px 1px 2px rgba(0,0,0,0.8)",
                }}
              >
                {project.title}
              </div>
            </div>

            {/* Content */}
            <div style={{ padding: "8px", flex: 1, display: "flex", flexDirection: "column", gap: "5px" }}>
              <p style={{ margin: 0, color: "#333", lineHeight: "1.45", flex: 1, fontSize: "10px" }}>
                {project.description}
              </p>

              {/* Tech stack */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: "3px" }}>
                {project.technologies.map((tech) => (
                  <span
                    key={tech}
                    style={{
                      display: "inline-block",
                      background: hoveredId === project.id ? "#1E5FBF" : "#316AC5",
                      color: "#FFF",
                      padding: "1px 5px",
                      borderRadius: "2px",
                      fontSize: "9px",
                      fontWeight: "bold",
                      transition: "background 150ms ease",
                    }}
                  >
                    {tech}
                  </span>
                ))}
              </div>

              {/* Links */}
              <div style={{ display: "flex", gap: "4px", paddingTop: "2px" }}>
                {project.github && (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="xp-button"
                    style={{
                      textDecoration: "none",
                      color: "#000",
                      fontSize: "10px",
                      padding: "2px 8px",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "3px",
                    }}
                  >
                    <Image src="/assets/github.png" alt="" width={12} height={12} />
                    GitHub
                  </a>
                )}
                {project.liveDemo && (
                  <a
                    href={project.liveDemo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="xp-button"
                    style={{
                      textDecoration: "none",
                      color: "#000",
                      fontSize: "10px",
                      padding: "2px 8px",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "3px",
                    }}
                  >
                    🌐 Live Demo
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
