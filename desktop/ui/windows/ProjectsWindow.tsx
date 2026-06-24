"use client";

import Image from "next/image";
import React, { useMemo, useState } from "react";

type Project = {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  github?: string;
  liveDemo?: string;
  image?: string;
};

const projects: Project[] = [
  {
    id: "hospital-management",
    title: "Hospital Management System",
    description: "A full-stack Django web application combining an SEO-optimized public-facing hospital website with a complete internal Hospital Management System.",
    technologies: ["Django","SQLite","Bootstrap","HTML", "CSS","JavaScript"],
    github: "https://github.com/samriddhakunwar/hospital_management",
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
    technologies: ["Django", "FastAPI"],
    github: "https://github.com/samriddhakunwar/url-slice-django-fastapi",
    image: "/assets/project_urlslice.png",
  },
  {
    id: "monkey-pose",
    title: "Monkey Pose Detection with OpenCV",
    description: "A computer vision project using OpenCV to detect and analyze monkey poses in real-time video streams.",
    technologies: ["Python.", "OpenCV"],
    github: "https://github.com/samriddhakunwar/MonkeyPoseWithOpenCV",
  },
];

/* ------------------------------------------------------------------ *
 * Filtering — unchanged behaviour, just presented as XP categories.
 * ------------------------------------------------------------------ */

type FilterKey = "All" | "Web" | "Data Analysis" | "Tools";

const FILTER_MAP: Record<FilterKey, string[]> = {
  All: [],
  Web: ["Django", "React", "Next.js", "JavaScript", "TypeScript", "Node.js", "HTML", "CSS", "Elasticsearch"],
  "Data Analysis": ["Python", "Pandas", "NumPy", "Matplotlib", "Seaborn"],
  Tools: ["Docker", "Git", "MongoDB", "PostgreSQL","OpenCV"],
};

/** Display label for each filter key, shown in the sidebar + status bar. */
const CATEGORY_LABEL: Record<FilterKey, string> = {
  All: "All Projects",
  Web: "Web Development",
  "Data Analysis": "Data Analysis",
  Tools: "Tools",
};

const CATEGORY_ORDER: FilterKey[] = ["All", "Web", "Data Analysis", "Tools"];

/* ------------------------------------------------------------------ *
 * Presentation-only metadata: classic XP icon + "file type" label.
 * (Does not touch project data, descriptions, links or categories.)
 * ------------------------------------------------------------------ */

const PROJECT_META: Record<string, { icon: string; type: string }> = {
  "hospital-management": { icon: "/assets/folder.png", type: "Web Application" },
  "daraz-clone": { icon: "/assets/folder.png", type: "Web Application" },
  "sales-insights": { icon: "/assets/doc.png", type: "Data Analysis" },
  "ecommerce-pipeline": { icon: "/assets/hardware.png", type: "Data Pipeline" },
  "valentines-special": { icon: "/assets/folder.png", type: "Web Application" },
  "url-slice": { icon: "/assets/internet.png", type: "Web Service" },
  "monkey-pose": { icon: "/assets/defaultprog.png", type: "Application" },
};

const metaFor = (id: string) => PROJECT_META[id] ?? { icon: "/assets/folder.png", type: "File Folder" };

const FONT = `"Tahoma", "Segoe UI", Arial, sans-serif`;
const MENU_ITEMS = ["File", "Edit", "View", "Favorites", "Tools", "Help"];

/* ------------------------------------------------------------------ *
 * Small presentational pieces (mirrors the My Computer Explorer chrome)
 * ------------------------------------------------------------------ */

const MenuBarItem: React.FC<{ label: string }> = ({ label }) => {
  const [hover, setHover] = useState(false);
  return (
    <span
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        padding: "2px 7px",
        fontSize: 11,
        cursor: "default",
        userSelect: "none",
        border: hover ? "1px solid #98B7E3" : "1px solid transparent",
        background: hover ? "#C5D9F1" : "transparent",
      }}
    >
      <span style={{ textDecoration: "underline" }}>{label.charAt(0)}</span>
      {label.slice(1)}
    </span>
  );
};

interface ToolbarButtonProps {
  icon: string;
  label?: string;
  caret?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}

const ToolbarButton: React.FC<ToolbarButtonProps> = ({ icon, label, caret, disabled, onClick }) => {
  const [hover, setHover] = useState(false);
  const active = hover && !disabled;
  return (
    <button
      onClick={disabled ? undefined : onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      disabled={disabled}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 4,
        padding: "3px 7px",
        height: 28,
        background: active ? "#E3ECFB" : "transparent",
        border: active ? "1px solid #98B7E3" : "1px solid transparent",
        cursor: disabled ? "default" : "pointer",
        fontFamily: FONT,
        fontSize: 11,
        color: disabled ? "#9A968B" : "#000",
        opacity: disabled ? 0.55 : 1,
        whiteSpace: "nowrap",
      }}
    >
      <Image
        src={icon}
        alt={label ?? ""}
        width={22}
        height={22}
        draggable={false}
        unoptimized
        style={{ filter: disabled ? "grayscale(1)" : "none", flexShrink: 0 }}
      />
      {label && <span>{label}</span>}
      {caret && (
        <span
          style={{
            width: 0,
            height: 0,
            marginLeft: 1,
            borderLeft: "3px solid transparent",
            borderRight: "3px solid transparent",
            borderTop: `4px solid ${disabled ? "#9A968B" : "#1B1B1B"}`,
          }}
        />
      )}
    </button>
  );
};

const ToolbarSeparator: React.FC = () => (
  <span style={{ width: 1, height: 22, background: "#B6B0A0", boxShadow: "1px 0 0 #FFFFFF", margin: "0 3px" }} />
);

/** Up-chevron inside the small blue task-pane header button. */
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

/** A collapsible-looking group box in the left task pane. */
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

interface TaskLinkProps {
  icon?: string;
  label: string;
  disabled?: boolean;
  onClick?: () => void;
}

const TaskLink: React.FC<TaskLinkProps> = ({ icon, label, disabled, onClick }) => {
  const [hover, setHover] = useState(false);
  const interactive = !!onClick && !disabled;
  return (
    <div
      onClick={interactive ? onClick : undefined}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 6,
        padding: "2px 0",
        cursor: interactive ? "pointer" : "default",
        userSelect: "none",
        opacity: disabled ? 0.45 : 1,
      }}
    >
      {icon && <Image src={icon} alt="" width={16} height={16} draggable={false} unoptimized style={{ flexShrink: 0 }} />}
      <span
        style={{
          fontSize: 11,
          color: disabled ? "#5A5A5A" : hover && interactive ? "#1E5FCC" : "#0E3A8C",
          textDecoration: hover && interactive ? "underline" : "none",
        }}
      >
        {label}
      </span>
    </div>
  );
};

/* ------------------------------------------------------------------ *
 * Details-view list (the right-hand Explorer pane)
 * ------------------------------------------------------------------ */

const COLS = "minmax(150px, 1.5fr) 130px minmax(120px, 1.6fr)";

const ColumnHeader: React.FC<{ label: string; last?: boolean }> = ({ label, last }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      padding: "2px 8px",
      fontSize: 11,
      color: "#000",
      background: "linear-gradient(180deg, #FFFFFF 0%, #F2F0E6 50%, #E7E4D6 100%)",
      borderRight: last ? "none" : "1px solid #ACA899",
      borderBottom: "1px solid #ACA899",
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
      userSelect: "none",
    }}
  >
    {label}
  </div>
);

interface RowProps {
  project: Project;
  selected: boolean;
  onClick: () => void;
  onDoubleClick: () => void;
}

const DetailRow: React.FC<RowProps> = ({ project, selected, onClick, onDoubleClick }) => {
  const [hover, setHover] = useState(false);
  const m = metaFor(project.id);
  const bg = selected ? "#316AC5" : hover ? "#E8F0FC" : "transparent";
  const fg = selected ? "#FFFFFF" : "#000000";
  const sub = selected ? "#DCE7FA" : "#3A3A3A";

  const cell: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    padding: "3px 8px",
    height: 38,
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
  };

  return (
    <div
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: "grid",
        gridTemplateColumns: COLS,
        background: bg,
        color: fg,
        cursor: "default",
        userSelect: "none",
        fontSize: 11,
      }}
    >
      <div style={{ ...cell, gap: 8 }}>
        <Image src={m.icon} alt="" width={32} height={32} draggable={false} unoptimized style={{ flexShrink: 0 }} />
        <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>{project.title}</span>
      </div>
      <div style={cell}>{m.type}</div>
      <div style={{ ...cell, color: sub }}>{project.technologies.join(", ")}</div>
    </div>
  );
};

/* ------------------------------------------------------------------ *
 * Main window
 * ------------------------------------------------------------------ */

export const ProjectsWindow: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<FilterKey>("All");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filtered = useMemo(
    () =>
      activeFilter === "All"
        ? projects
        : projects.filter((p) => p.technologies.some((t) => FILTER_MAP[activeFilter].includes(t))),
    [activeFilter],
  );

  const selected = useMemo(
    () => filtered.find((p) => p.id === selectedId) ?? null,
    [filtered, selectedId],
  );

  const openProject = (p: Project | null) => {
    if (p?.github) window.open(p.github, "_blank", "noopener,noreferrer");
  };

  const selectCategory = (key: FilterKey) => {
    setActiveFilter(key);
    setSelectedId(null);
  };

  const objectLabel =
    selected != null
      ? `${selected.title} selected`
      : activeFilter === "All"
        ? `${filtered.length} object(s)`
        : `Showing ${filtered.length} ${CATEGORY_LABEL[activeFilter]} project(s)`;

  return (
    <div
      style={{
        fontFamily: FONT,
        fontSize: 11,
        color: "#000",
        // Cancel the host window's 12px content padding so the Explorer
        // chrome runs edge-to-edge and fills the full window height.
        margin: -12,
        height: "calc(100% + 24px)",
        display: "flex",
        flexDirection: "column",
        background: "#FFFFFF",
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
        }}
      >
        {MENU_ITEMS.map((m) => (
          <MenuBarItem key={m} label={m} />
        ))}
      </div>

      {/* ---------------- Toolbar ---------------- */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          padding: "1px 4px",
          background: "linear-gradient(180deg, #F6F5EE 0%, #E4E0CF 100%)",
          borderBottom: "1px solid #D6D1BE",
        }}
      >
        <ToolbarButton
          icon="/assets/toolbar/back.png"
          label="Back"
          caret
          disabled={activeFilter === "All"}
          onClick={() => selectCategory("All")}
        />
        <ToolbarButton icon="/assets/toolbar/forward.png" label="Forward" caret disabled />
        <ToolbarSeparator />
        <ToolbarButton icon="/assets/toolbar/search.png" label="Search" />
        <ToolbarButton icon="/assets/toolbar/folders.png" label="Folders" />
        <ToolbarSeparator />
        <ToolbarButton icon="/assets/toolbar/thumbnail.png" label="Views" caret />
      </div>

      {/* ---------------- Address Bar ---------------- */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          padding: "3px 5px",
          background: "linear-gradient(180deg, #F6F5EE 0%, #E4E0CF 100%)",
          borderBottom: "1px solid #ACA899",
        }}
      >
        <span style={{ color: "#4A4A4A", paddingLeft: 2 }}>Address</span>
        <div
          className="xp-inset"
          style={{ flex: 1, display: "flex", alignItems: "center", background: "#FFFFFF", height: 22 }}
        >
          <Image src="/assets/folder_program.png" alt="" width={16} height={16} draggable={false} unoptimized style={{ margin: "0 4px", flexShrink: 0 }} />
          <span style={{ flex: 1, fontSize: 11 }}>Projects</span>
          <span
            style={{
              width: 17,
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderLeft: "1px solid #ACA899",
              background: "linear-gradient(180deg, #FFFFFF 0%, #ECE9D8 100%)",
            }}
          >
            <span
              style={{
                width: 0,
                height: 0,
                borderLeft: "3px solid transparent",
                borderRight: "3px solid transparent",
                borderTop: "4px solid #1B1B1B",
              }}
            />
          </span>
        </div>
        <button
          className="xp-button"
          style={{ display: "flex", alignItems: "center", gap: 4, padding: "1px 8px 1px 5px", height: 22 }}
        >
          <Image src="/assets/toolbar/go.png" alt="Go" width={16} height={16} draggable={false} unoptimized />
          Go
        </button>
      </div>

      {/* ---------------- Main Content ---------------- */}
      <div style={{ flex: 1, display: "flex", minHeight: 0 }}>
        {/* Left task pane */}
        <div
          style={{
            width: 200,
            flexShrink: 0,
            overflowY: "auto",
            padding: "10px 8px",
            background: "linear-gradient(180deg, #E9EFFB 0%, #C9D7EF 100%)",
            borderRight: "1px solid #BAC6DD",
          }}
        >
          {/* Section 1 — Project Tasks */}
          <TaskGroup title="Project Tasks">
            <TaskLink
              icon="/assets/folder_program.png"
              label="Open Project"
              disabled={!selected?.github}
              onClick={() => openProject(selected)}
            />
            <TaskLink
              icon="/assets/github.png"
              label="View GitHub"
              disabled={!selected?.github}
              onClick={() => openProject(selected)}
            />
            <TaskLink
              icon="/assets/help.png"
              label="View Details"
              disabled={!selected}
              onClick={() => {/* details already shown below */}}
            />
          </TaskGroup>

          {/* Section 2 — Categories */}
          <TaskGroup title="Categories">
            {CATEGORY_ORDER.map((key) => {
              const isActive = activeFilter === key;
              return (
                <div
                  key={key}
                  onClick={() => selectCategory(key)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "2px 6px",
                    margin: "1px 0",
                    cursor: "pointer",
                    userSelect: "none",
                    background: isActive ? "#316AC5" : "transparent",
                    color: isActive ? "#FFFFFF" : "#0E3A8C",
                  }}
                >
                  <Image src="/assets/folder.png" alt="" width={20} height={20} draggable={false} unoptimized style={{ flexShrink: 0 }} />
                  <span style={{ fontSize: 11 }}>{CATEGORY_LABEL[key]}</span>
                </div>
              );
            })}
          </TaskGroup>

          {/* Section 3 — Details */}
          <TaskGroup title="Details">
            {selected ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                  <Image src={metaFor(selected.id).icon} alt="" width={48} height={48} draggable={false} unoptimized style={{ flexShrink: 0 }} />
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontWeight: "bold", color: "#1B438F" }}>{selected.title}</div>
                    <div style={{ color: "#3A3A3A" }}>{metaFor(selected.id).type}</div>
                  </div>
                </div>

                <div>
                  <div style={{ fontWeight: "bold", color: "#1B438F" }}>Technologies:</div>
                  <div style={{ color: "#1A1A1A" }}>{selected.technologies.join(", ")}</div>
                </div>

                <div>
                  <div style={{ fontWeight: "bold", color: "#1B438F" }}>Description:</div>
                  <div style={{ color: "#1A1A1A", lineHeight: 1.4 }}>{selected.description}</div>
                </div>

                {selected.github && (
                  <div>
                    <div style={{ fontWeight: "bold", color: "#1B438F" }}>GitHub:</div>
                    <span
                      onClick={() => openProject(selected)}
                      style={{ color: "#0E3A8C", textDecoration: "underline", cursor: "pointer", wordBreak: "break-all" }}
                    >
                      {selected.github}
                    </span>
                  </div>
                )}
              </div>
            ) : (
              <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                <Image src="/assets/folder_program.png" alt="" width={48} height={48} draggable={false} unoptimized style={{ flexShrink: 0 }} />
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontWeight: "bold", color: "#1B438F" }}>Projects</div>
                  <div style={{ color: "#3A3A3A" }}>File Folder</div>
                </div>
              </div>
            )}
          </TaskGroup>
        </div>

        {/* Right content area — Details view list */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, background: "#FFFFFF" }}>
          {/* Column headers */}
          <div style={{ display: "grid", gridTemplateColumns: COLS, borderTop: "1px solid #FFFFFF" }}>
            <ColumnHeader label="Name" />
            <ColumnHeader label="Type" />
            <ColumnHeader label="Technology" last />
          </div>

          {/* Rows */}
          <div style={{ flex: 1, overflowY: "auto" }} onClick={() => setSelectedId(null)}>
            <div onClick={(e) => e.stopPropagation()}>
              {filtered.map((p) => (
                <DetailRow
                  key={p.id}
                  project={p}
                  selected={selectedId === p.id}
                  onClick={() => setSelectedId(p.id)}
                  onDoubleClick={() => openProject(p)}
                />
              ))}
            </div>
            {filtered.length === 0 && (
              <div style={{ padding: "16px", color: "#808080", fontSize: 11 }}>
                There are no projects in this category.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ---------------- Status Bar ---------------- */}
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
        <div style={{ flex: 1, display: "flex", alignItems: "center", padding: "0 8px", borderTop: "1px solid #ACA899", margin: "1px 0 1px 1px" }}>
          {objectLabel}
        </div>
        <div style={{ width: 160, display: "flex", alignItems: "center", gap: 5, padding: "0 8px", borderTop: "1px solid #ACA899", borderLeft: "1px solid #ACA899", margin: "1px 1px 1px 0" }}>
          <Image src="/assets/folder_program.png" alt="" width={14} height={14} draggable={false} unoptimized />
          Projects
        </div>
      </div>
    </div>
  );
};
