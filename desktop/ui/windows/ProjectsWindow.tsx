"use client";

const projects = [
  {
    id: "hospital-management",
    title: "Hospital Management System Backend",
    description: "A backend system built with Django REST Framework for managing hospital operations including patients, doctors, appointments, and authentication.",
    technologies: ["Django", "Python", "PostgreSQL"],
    github: "https://github.com/samriddhakunwar/hospitalmanagementsystembackend",
    image: "/assets/project_hospital.png",
  },
  {
    id: "daraz-clone",
    title: "Daraz Clone",
    description: "A full-stack eCommerce web application inspired by Daraz with product listings, cart functionality, and modern UI.",
    technologies: ["React", "JavaScript", "Node.js"],
    github: "https://github.com/samriddhakunwar/daraz-clone",
    image: "/assets/project_daraz.png",
  },
  {
    id: "sales-insights",
    title: "Sales Insights Data Analysis",
    description: "Data analysis project using Python to extract insights from sales data, including visualization and business intelligence metrics.",
    technologies: ["Python", "Pandas"],
    github: "https://github.com/samriddhakunwar/sales-insights-data-analysis",
    image: "/assets/project_sales.png",
  },
  {
    id: "ecommerce-pipeline",
    title: "E-commerce Data Pipeline",
    description: "A data pipeline for processing and analyzing eCommerce data, handling ETL workflows and structured storage.",
    technologies: ["Python", "Pandas", "MongoDB"],
    github: "https://github.com/samriddhakunwar/ecommerce-data-pipeline",
    image: "/assets/project_pipeline.png",
  },
  {
    id: "valentines-special",
    title: "Valentine's Special Project",
    description: "A creative interactive web project designed for Valentine's Day with animations and engaging UI.",
    technologies: ["HTML", "CSS", "JavaScript"],
    github: "https://github.com/samriddhakunwar/valentinesSpecial",
    image: "/assets/project_valentines.png",
  },
  {
    id: "url-slice",
    title: "URL Slice (Django + FastAPI)",
    description: "A URL shortening service built using Django and FastAPI, focusing on performance and scalable API design.",
    technologies: ["Django", "FastAPI", "Python"],
    github: "https://github.com/samriddhakunwar/url-slice-django-fastapi",
    image: "/assets/project_urlslice.png",
  },
  {
    id: "monkey-pose",
    title: "Monkey Pose Detection with OpenCV",
    description: "A computer vision project using OpenCV to detect and analyze monkey poses in real-time video streams.",
    technologies: ["Python", "OpenCV"],
    github: "https://github.com/samriddhakunwar/MonkeyPoseWithOpenCV",
  },
];
import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

type FilterKey = "All" | "Web" | "AI/ML" | "Tools";

const FILTER_MAP: Record<FilterKey, string[]> = {
  All: [],
  Web: ["Django", "React", "Next.js", "JavaScript", "TypeScript", "Node.js", "HTML", "CSS", "Elasticsearch"],
  "AI/ML": ["Python", "TensorFlow", "OpenCV", "Scikit-learn", "Pandas"],
  Tools: ["Docker", "Git", "Linux", "MongoDB", "PostgreSQL", "D3.js"],
};

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 18, scale: 0.96 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring" as const, stiffness: 340, damping: 26 } },
  exit: { opacity: 0, scale: 0.92, transition: { duration: 0.15 } },
};

const GRADIENT_PALETTES = [
  "linear-gradient(135deg, #1E6BC5 0%, #0097E6 100%)",
  "linear-gradient(135deg, #0A6A00 0%, #27AE60 100%)",
  "linear-gradient(135deg, #6B00A8 0%, #A040D0 100%)",
  "linear-gradient(135deg, #8B4513 0%, #E07040 100%)",
  "linear-gradient(135deg, #003580 0%, #0055B3 100%)",
];

export const ProjectsWindow: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<FilterKey>("All");
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const filtered = activeFilter === "All"
    ? projects
    : projects.filter((p) =>
        p.technologies.some((t) => FILTER_MAP[activeFilter].includes(t))
      );

  const filters: FilterKey[] = ["All", "Web", "AI/ML", "Tools"];

  return (
    <div style={{
      fontFamily: "Tahoma, Arial, sans-serif",
      fontSize: "11px",
      maxHeight: "100%",
      overflowY: "auto",
    }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
        <Image src="/assets/folder_program.png" alt="" width={20} height={20} />
        <div>
          <div style={{ fontWeight: "bold", fontSize: "12px" }}>My Projects</div>
          <div style={{ color: "#666" }}>{filtered.length} project{filtered.length !== 1 ? "s" : ""} found</div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div style={{
        display: "flex",
        gap: "3px",
        marginBottom: "10px",
        borderBottom: "2px solid #ACA899",
        paddingBottom: "4px",
      }}>
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className="xp-button"
            style={{
              padding: "2px 10px",
              fontSize: "10px",
              fontWeight: activeFilter === f ? "bold" : "normal",
              background: activeFilter === f
                ? "linear-gradient(180deg, #D6D3C4 0%, #C0BDB0 100%)"
                : undefined,
              borderBottom: activeFilter === f ? "2px solid #316AC5" : undefined,
            }}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Project Grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeFilter}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}
        >
          {filtered.map((project, idx) => (
            <motion.div
              key={project.id}
              variants={cardVariants}
              layout
              onMouseEnter={() => setHoveredId(project.id)}
              onMouseLeave={() => setHoveredId(null)}
              className="xp-project-card"
              style={{
                background: hoveredId === project.id
                  ? "linear-gradient(180deg, #FFFFFF 0%, #EEF4FF 100%)"
                  : "#ECE9D8",
                border: "2px solid",
                borderColor: hoveredId === project.id
                  ? "#FFFFFF #5588CC #5588CC #FFFFFF"
                  : "#FFFFFF #ACA899 #ACA899 #FFFFFF",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                transition: "border-color 150ms ease, background 150ms ease",
              }}
            >
              {/* Image / Gradient banner */}
              <div style={{
                height: "90px",
                background: GRADIENT_PALETTES[idx % GRADIENT_PALETTES.length],
                position: "relative",
                overflow: "hidden",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}>
                {project.image && (
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    style={{ objectFit: "cover", opacity: 0.85 }}
                  />
                )}
                {/* Title overlay */}
                <div style={{
                  position: "absolute",
                  bottom: 0, left: 0, right: 0,
                  background: "linear-gradient(0deg, rgba(0,0,0,0.7) 0%, transparent 100%)",
                  padding: "6px 8px 4px",
                  color: "#FFF",
                  fontSize: "10px",
                  fontWeight: "bold",
                  textShadow: "1px 1px 3px rgba(0,0,0,0.9)",
                }}>
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
                    <span key={tech} style={{
                      display: "inline-block",
                      background: hoveredId === project.id ? "#1E5FBF" : "#316AC5",
                      color: "#FFF",
                      padding: "1px 5px",
                      borderRadius: "2px",
                      fontSize: "9px",
                      fontWeight: "bold",
                      transition: "background 150ms ease",
                    }}>
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
                        textDecoration: "none", color: "#000",
                        fontSize: "10px", padding: "2px 8px",
                        display: "inline-flex", alignItems: "center", gap: "3px",
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
                        textDecoration: "none", color: "#000",
                        fontSize: "10px", padding: "2px 8px",
                        display: "inline-flex", alignItems: "center", gap: "3px",
                      }}
                    >
                      🌐 Live Demo
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>

      {filtered.length === 0 && (
        <div style={{
          padding: "24px",
          textAlign: "center",
          color: "#808080",
          background: "#fff",
          border: "2px inset #ACA899",
        }}>
          No projects match this filter.
        </div>
      )}
    </div>
  );
};
