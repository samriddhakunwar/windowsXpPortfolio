"use client";

import React, { useState } from "react";
import Image from "next/image";

interface BreadcrumbItem {
  label: string;
  path: string;
}

interface FsItem {
  id: string;
  name: string;
  type: "folder" | "file" | "link";
  children?: FsItem[];
  href?: string;
  desc?: string;
  icon?: string;
}

const fileSystem: FsItem[] = [
  {
    id: "docs",
    name: "My Documents",
    type: "folder",
    children: [
      { id: "resume", name: "Resume.pdf", type: "file", icon: "📄", desc: "My professional resume" },
      { id: "coverletter", name: "Cover Letter Template.docx", type: "file", icon: "📝", desc: "Generic cover letter" },
    ],
  },
  {
    id: "projects",
    name: "Projects",
    type: "folder",
    children: [
      { id: "p1", name: "Smart Traffic System", type: "folder", icon: "📁", desc: "AI-powered traffic management using Django + OpenCV" },
      { id: "p2", name: "Search Engine", type: "folder", icon: "📁", desc: "Full-stack search engine with crawler" },
      { id: "p3", name: "XP Portfolio", type: "folder", icon: "📁", desc: "This very website!" },
      { id: "p4", name: "ML Model", type: "folder", icon: "📁", desc: "Predictive ML time-series model" },
    ],
  },
  {
    id: "pictures",
    name: "Pictures",
    type: "folder",
    children: [
      { id: "u1", name: "profile.jpg", type: "file", icon: "🖼", desc: "Profile photo" },
      { id: "u2", name: "projects-preview.png", type: "file", icon: "🖼", desc: "Project screenshots" },
    ],
  },
  {
    id: "links",
    name: "Favorites",
    type: "folder",
    children: [
      { id: "gh", name: "GitHub.url", type: "link", icon: "🔗", href: "https://github.com/samriddhakunwar", desc: "My GitHub profile" },
      { id: "li", name: "LinkedIn.url", type: "link", icon: "🔗", href: "https://linkedin.com/in/samriddhakunwar", desc: "My LinkedIn profile" },
    ],
  },
];

export const MyComputerWindow: React.FC = () => {
  const [path, setPath] = useState<BreadcrumbItem[]>([{ label: "My Computer", path: "root" }]);
  const [currentItems, setCurrentItems] = useState<FsItem[]>(fileSystem);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [statusText, setStatusText] = useState(`${fileSystem.length} object(s)`);

  const navigateTo = (folder: FsItem) => {
    if (folder.type === "link" && folder.href) {
      window.open(folder.href, "_blank", "noopener,noreferrer");
      return;
    }
    if (folder.type !== "folder") return;
    setPath((prev) => [...prev, { label: folder.name, path: folder.id }]);
    setCurrentItems(folder.children ?? []);
    setSelectedId(null);
    setStatusText(`${folder.children?.length ?? 0} object(s)`);
  };

  const navigateBreadcrumb = (index: number) => {
    if (index === 0) {
      setPath([{ label: "My Computer", path: "root" }]);
      setCurrentItems(fileSystem);
      setSelectedId(null);
      setStatusText(`${fileSystem.length} object(s)`);
      return;
    }
    // Find the item at that breadcrumb level
    let items = fileSystem;
    const newPath = path.slice(0, index + 1);
    for (let i = 1; i <= index; i++) {
      const found = items.find((it) => it.id === newPath[i].path);
      if (found?.children) items = found.children;
    }
    setPath(newPath);
    setCurrentItems(items);
    setSelectedId(null);
    setStatusText(`${items.length} object(s)`);
  };

  const getIcon = (item: FsItem) => {
    if (item.icon) return item.icon;
    return item.type === "folder" ? "📁" : item.type === "link" ? "🔗" : "📄";
  };

  return (
    <div style={{ fontFamily: "Tahoma, Arial, sans-serif", fontSize: "11px" }}>
      {/* Toolbar */}
      <div style={{ display: "flex", alignItems: "center", gap: "4px", marginBottom: "4px" }}>
        <button
          className="xp-button"
          style={{ padding: "1px 10px" }}
          disabled={path.length <= 1}
          onClick={() => navigateBreadcrumb(path.length - 2)}
        >
          ← Back
        </button>
        <button
          className="xp-button"
          style={{ padding: "1px 10px", opacity: 0.5, cursor: "not-allowed" }}
          disabled
        >
          → Forward
        </button>
      </div>

      {/* Address / Breadcrumb bar */}
      <div style={{ display: "flex", alignItems: "center", gap: "4px", marginBottom: "6px" }}>
        <span style={{ fontWeight: "bold", whiteSpace: "nowrap" }}>Address</span>
        <div
          className="xp-inset"
          style={{ flex: 1, padding: "2px 6px", display: "flex", alignItems: "center", gap: "4px" }}
        >
          {path.map((crumb, i) => (
            <span key={crumb.path} style={{ display: "flex", alignItems: "center", gap: "3px" }}>
              {i > 0 && <span style={{ color: "#666" }}>›</span>}
              <button
                onClick={() => navigateBreadcrumb(i)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: i < path.length - 1 ? "pointer" : "default",
                  color: i < path.length - 1 ? "#0066CC" : "#000",
                  textDecoration: i < path.length - 1 ? "underline" : "none",
                  fontSize: "11px",
                  fontFamily: "Tahoma, Arial, sans-serif",
                  padding: 0,
                }}
              >
                {crumb.label}
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* File list */}
      <div className="xp-inset" style={{ padding: "2px", minHeight: "220px" }}>
        {currentItems.length === 0 && (
          <div style={{ padding: "16px", color: "#808080", textAlign: "center" }}>
            This folder is empty
          </div>
        )}
        {currentItems.map((item) => (
          <div
            key={item.id}
            onClick={() => {
              setSelectedId(item.id);
              setStatusText(item.desc ?? `${item.name}`);
            }}
            onDoubleClick={() => navigateTo(item)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "3px 6px",
              cursor: "default",
              background: selectedId === item.id ? "#316AC5" : "transparent",
              color: selectedId === item.id ? "#FFF" : "#000",
              borderRadius: "1px",
              userSelect: "none",
            }}
          >
            <span style={{ fontSize: "16px", flexShrink: 0 }}>{getIcon(item)}</span>
            <span style={{ flex: 1 }}>{item.name}</span>
            {item.type === "folder" && (
              <span style={{ color: selectedId === item.id ? "#C8E0FF" : "#888", fontSize: "10px" }}>
                {item.children?.length ?? 0} items
              </span>
            )}
            {item.type === "link" && (
              <span style={{ color: selectedId === item.id ? "#C8E0FF" : "#0066CC", fontSize: "10px" }}>
                External ↗
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Status bar */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "4px",
          paddingTop: "4px",
          borderTop: "1px solid #ACA899",
          color: "#808080",
        }}
      >
        <span>{statusText}</span>
        <span>C:\Users\Portfolio</span>
      </div>
    </div>
  );
};
