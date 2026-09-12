"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useDesktop } from "@/desktop/DesktopProvider";

/* ------------------------------------------------------------------ *
 * Data model
 * ------------------------------------------------------------------ */

interface Repo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  updated_at: string;
  topics: string[];
}

const GITHUB_USER = "samriddhakunwar";
const PROFILE_URL = `https://github.com/${GITHUB_USER}`;

const LANG_COLOR: Record<string, string> = {
  TypeScript: "#3178C6",
  JavaScript: "#F7DF1E",
  Python: "#3572A5",
  "C#": "#178600",
  Java: "#B07219",
  HTML: "#E34C26",
  CSS: "#563D7C",
  Go: "#00ADD8",
};

const FONT = `"Tahoma", "Segoe UI", Arial, sans-serif`;
const MENU_ITEMS = ["File", "Edit", "View", "Favorites", "Tools", "Help"];

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-US", { month: "numeric", day: "numeric", year: "numeric" });
}

/* ------------------------------------------------------------------ *
 * Small presentational pieces (XP Explorer chrome — matches the
 * conventions used in MyComputerWindow.tsx / RecycleBinWindow.tsx)
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
  onClick?: () => void;
}

const TaskLink: React.FC<TaskLinkProps> = ({ icon, label, onClick }) => {
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
        padding: "2px 0",
        cursor: onClick ? "pointer" : "default",
        userSelect: "none",
      }}
    >
      {icon && <Image src={icon} alt="" width={16} height={16} draggable={false} unoptimized style={{ flexShrink: 0 }} />}
      <span
        style={{
          fontSize: 11,
          color: hover && onClick ? "#1E5FCC" : "#0E3A8C",
          textDecoration: hover && onClick ? "underline" : "none",
        }}
      >
        {label}
      </span>
    </div>
  );
};

const DetailRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div style={{ display: "flex", gap: 4, marginTop: 2 }}>
    <span style={{ color: "#3A3A3A", fontWeight: "bold", flexShrink: 0 }}>{label}:</span>
    <span style={{ color: "#1B1B1B", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
      {value}
    </span>
  </div>
);

/* ------------------------------------------------------------------ *
 * Repository list (Explorer "Details view" style)
 * ------------------------------------------------------------------ */

const COL_LANG = 92;
const COL_STARS = 50;
const COL_MODIFIED = 84;

const ListHeader: React.FC = () => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      height: 20,
      flexShrink: 0,
      background: "linear-gradient(180deg, #FEFEFE 0%, #ECE9D8 100%)",
      borderBottom: "1px solid #ACA899",
      fontSize: 11,
      color: "#000",
    }}
  >
    <div style={{ flex: 1, minWidth: 0, padding: "0 6px 0 26px", borderRight: "1px solid #D4D0C8" }}>Name</div>
    <div style={{ width: COL_LANG, flexShrink: 0, padding: "0 6px", borderRight: "1px solid #D4D0C8" }}>Language</div>
    <div style={{ width: COL_STARS, flexShrink: 0, padding: "0 6px", textAlign: "right", borderRight: "1px solid #D4D0C8" }}>Stars</div>
    <div style={{ width: COL_MODIFIED, flexShrink: 0, padding: "0 6px", textAlign: "right" }}>Modified</div>
  </div>
);

interface ListRowProps {
  repo: Repo;
  selected: boolean;
  onSelect: () => void;
  onOpen: () => void;
}

const ListRow: React.FC<ListRowProps> = ({ repo, selected, onSelect, onOpen }) => {
  const [hover, setHover] = useState(false);
  const color = selected ? "#FFFFFF" : "#000";
  return (
    <div
      onClick={onSelect}
      onDoubleClick={onOpen}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: "flex",
        alignItems: "center",
        height: 20,
        flexShrink: 0,
        cursor: "default",
        userSelect: "none",
        background: selected ? "#316AC5" : hover ? "#E8F0FC" : "transparent",
        borderBottom: "1px solid #ECEAE1",
      }}
    >
      <div style={{ flex: 1, minWidth: 0, display: "flex", alignItems: "center", gap: 6, padding: "0 6px 0 4px" }}>
        <Image src="/assets/folder_program.png" alt="" width={16} height={16} draggable={false} unoptimized style={{ flexShrink: 0 }} />
        <span style={{ color, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{repo.name}</span>
      </div>
      <div style={{ width: COL_LANG, flexShrink: 0, padding: "0 6px", display: "flex", alignItems: "center", gap: 4, overflow: "hidden" }}>
        {repo.language && (
          <>
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: LANG_COLOR[repo.language] ?? "#aaa",
                border: "1px solid rgba(0,0,0,0.15)",
                flexShrink: 0,
              }}
            />
            <span style={{ color, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{repo.language}</span>
          </>
        )}
      </div>
      <div style={{ width: COL_STARS, flexShrink: 0, padding: "0 6px", textAlign: "right", color }}>{repo.stargazers_count}</div>
      <div style={{ width: COL_MODIFIED, flexShrink: 0, padding: "0 6px", textAlign: "right", color }}>{formatDate(repo.updated_at)}</div>
    </div>
  );
};

/* ------------------------------------------------------------------ *
 * Main window
 * ------------------------------------------------------------------ */

export const GithubWindow: React.FC = () => {
  const { launchApp } = useDesktop();

  const [repos, setRepos] = useState<Repo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const loadRepos = useCallback(() => {
    fetch(`https://api.github.com/users/${GITHUB_USER}/repos?sort=updated&per_page=12`)
      .then((r) => {
        if (!r.ok) throw new Error("Failed to fetch repositories");
        return r.json();
      })
      .then((data) => {
        setRepos(data);
        setLoading(false);
      })
      .catch((e) => {
        setError(e.message);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    loadRepos();
  }, [loadRepos]);

  const refreshRepos = useCallback(() => {
    setLoading(true);
    setError(null);
    loadRepos();
  }, [loadRepos]);

  const openProfile = useCallback(() => {
    window.open(PROFILE_URL, "_blank", "noopener,noreferrer");
  }, []);

  const clearSelection = useCallback(() => setSelectedId(null), []);

  const selectedRepo = useMemo(() => repos.find((r) => r.id === selectedId) ?? null, [repos, selectedId]);

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
        <ToolbarButton icon="/assets/toolbar/back.png" label="Back" caret disabled />
        <ToolbarButton icon="/assets/toolbar/forward.png" label="Forward" caret disabled />
        <ToolbarSeparator />
        <ToolbarButton icon="/assets/toolbar/home.png" label="Home" onClick={clearSelection} />
        <ToolbarButton icon="/assets/folder_program.png" label="Repositories" onClick={clearSelection} />
        <ToolbarSeparator />
        <ToolbarButton icon="/assets/toolbar/row-1-column-13.png" label="Refresh" onClick={refreshRepos} />
        <ToolbarSeparator />
        <ToolbarButton icon="/assets/github.png" label="Open GitHub" onClick={openProfile} />
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
          <Image src="/assets/github.png" alt="" width={16} height={16} draggable={false} unoptimized style={{ margin: "0 4px", flexShrink: 0 }} />
          <span style={{ flex: 1, fontSize: 11, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {PROFILE_URL}
          </span>
          <span
            style={{
              width: 17,
              alignSelf: "stretch",
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
        <button onClick={openProfile} className="xp-button" style={{ display: "flex", alignItems: "center", gap: 4, padding: "1px 8px 1px 5px", height: 22 }}>
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
          <TaskGroup title="GitHub">
            <TaskLink icon="/assets/folder_program.png" label="My Repositories" onClick={clearSelection} />
            <TaskLink icon="/assets/folder_program.png" label="Projects" onClick={() => launchApp("projects")} />
            <TaskLink icon="/assets/users.png" label="Profile" onClick={openProfile} />
            <TaskLink icon="/assets/internet.png" label="GitHub Website" onClick={() => window.open("https://github.com", "_blank", "noopener,noreferrer")} />
          </TaskGroup>

          <TaskGroup title="Details">
            {selectedRepo ? (
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 4 }}>
                  <Image src="/assets/folder_program.png" alt="" width={28} height={28} draggable={false} unoptimized style={{ flexShrink: 0 }} />
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontWeight: "bold", color: "#1B438F", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {selectedRepo.name}
                    </div>
                    <div style={{ color: "#3A3A3A" }}>Repository</div>
                  </div>
                </div>
                <DetailRow label="Description" value={selectedRepo.description || "None"} />
                <DetailRow label="Language" value={selectedRepo.language || "Unspecified"} />
                <DetailRow label="Stars" value={String(selectedRepo.stargazers_count)} />
                <DetailRow label="Forks" value={String(selectedRepo.forks_count)} />
                <DetailRow label="Modified" value={formatDate(selectedRepo.updated_at)} />
              </div>
            ) : (
              <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                <Image src="/assets/github.png" alt="" width={28} height={28} draggable={false} unoptimized style={{ flexShrink: 0 }} />
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontWeight: "bold", color: "#1B438F" }}>{GITHUB_USER}</div>
                  <div style={{ color: "#3A3A3A" }}>GitHub Repositories</div>
                </div>
              </div>
            )}
          </TaskGroup>
        </div>

        {/* Right content area */}
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) clearSelection();
          }}
          style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, background: "#FFFFFF" }}
        >
          {loading ? (
            <div style={{ padding: 16, textAlign: "center" }}>
              <div style={{ marginBottom: 8, fontWeight: "bold" }}>Fetching repositories from GitHub…</div>
              <div className="xp-progress-bar" style={{ maxWidth: 240, margin: "0 auto" }}>
                <div className="xp-progress-fill" />
              </div>
            </div>
          ) : error ? (
            <div style={{ padding: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#CC0000" }}>
                <Image src="/assets/error.png" alt="Error" width={20} height={20} />
                <span style={{ fontWeight: "bold" }}>Could not load repositories</span>
              </div>
              <p style={{ marginTop: 8, color: "#666" }}>{error}</p>
              <p style={{ color: "#666" }}>
                Check your internet connection or visit{" "}
                <a href={PROFILE_URL} target="_blank" rel="noopener noreferrer" style={{ color: "#0066CC" }}>
                  {PROFILE_URL.replace("https://", "")}
                </a>{" "}
                directly.
              </p>
            </div>
          ) : (
            <>
              <ListHeader />
              <div style={{ flex: 1, overflowY: "auto" }}>
                {repos.map((repo) => (
                  <ListRow
                    key={repo.id}
                    repo={repo}
                    selected={selectedId === repo.id}
                    onSelect={() => setSelectedId(repo.id)}
                    onOpen={() => window.open(repo.html_url, "_blank", "noopener,noreferrer")}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* ---------------- Status Bar ---------------- */}
      <div
        style={{
          display: "flex",
          alignItems: "stretch",
          height: 20,
          flexShrink: 0,
          borderTop: "1px solid #FFFFFF",
          background: "#ECE9D8",
          fontSize: 11,
          color: "#3A3A3A",
        }}
      >
        <div style={{ flex: 1, display: "flex", alignItems: "center", padding: "0 8px", borderTop: "1px solid #ACA899", margin: "1px 0 1px 1px" }}>
          {loading ? "Loading…" : error ? "Error loading repositories" : `${repos.length} repositories`}
        </div>
        <div style={{ width: 150, display: "flex", alignItems: "center", gap: 5, padding: "0 8px", borderTop: "1px solid #ACA899", borderLeft: "1px solid #ACA899", margin: "1px 1px 1px 0" }}>
          <Image src="/assets/github.png" alt="" width={14} height={14} draggable={false} unoptimized />
          {GITHUB_USER}
        </div>
      </div>
    </div>
  );
};
