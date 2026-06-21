"use client";

import React, { useCallback, useMemo, useState } from "react";
import Image from "next/image";
import { useDesktop } from "@/desktop/DesktopProvider";
import { WindowType } from "@/types";

/* ------------------------------------------------------------------ *
 * Data model
 * ------------------------------------------------------------------ */

type FolderId = "computer" | "cdrive" | "ddrive";

/** A folder-style entry that launches one of the registered apps. */
interface FolderEntry {
  id: string;
  label: string;
  icon: string;
  app: WindowType;
  /** Shown in the "Details" task-pane when the item is selected. */
  type: string;
}

/** A drive shown on the root "My Computer" view. */
interface DriveEntry {
  id: string;
  label: string;
  icon: string;
  target: FolderId;
  type: string;
  detail: string;
}

const FONT = `"Tahoma", "Segoe UI", Arial, sans-serif`;

const STORED_FILES: FolderEntry[] = [
  { id: "mydocs", label: "My Resume", icon: "/assets/folder.png", app: "resume", type: "File Folder" },
  { id: "projects", label: "Projects", icon: "/assets/folder_program.png", app: "projects", type: "File Folder" },
];

const HARD_DRIVES: DriveEntry[] = [
  { id: "cdrive", label: "Local Disk (C:)", icon: "/assets/hardware.png", target: "cdrive", type: "Local Disk", detail: "3.99 GB free of 9.99 GB" },
  { id: "ddrive", label: "Portfolio Drive (D:)", icon: "/assets/hardware.png", target: "ddrive", type: "Local Disk", detail: "12.4 GB free of 20.0 GB" },
];

const C_DRIVE_ITEMS: FolderEntry[] = [
  { id: "c-about", label: "About Me", icon: "/assets/users.png", app: "about", type: "File Folder" },
  { id: "c-resume", label: "Resume", icon: "/assets/pdf.png", app: "resume", type: "File Folder" },
  { id: "c-contact", label: "Contact", icon: "/assets/outlook_large.png", app: "contact", type: "File Folder" },
];

const D_DRIVE_ITEMS: FolderEntry[] = [
  { id: "d-projects", label: "Projects", icon: "/assets/folder_program.png", app: "projects", type: "File Folder" },
  { id: "d-github", label: "GitHub", icon: "/assets/github.png", app: "github", type: "File Folder" },
  { id: "d-help", label: "Help", icon: "/assets/help.png", app: "help", type: "File Folder" },
];

interface FolderMeta {
  /** Title used in the address bar / window context. */
  title: string;
  /** Icon used in the address bar. */
  icon: string;
  /** Name shown in the Details pane when nothing is selected. */
  detailsName: string;
  /** Type shown in the Details pane when nothing is selected. */
  detailsType: string;
  /** Flat list of launchable items (empty for the root view). */
  items: FolderEntry[];
}

const FOLDERS: Record<FolderId, FolderMeta> = {
  computer: { title: "My Computer", icon: "/assets/mycomputer.png", detailsName: "My Computer", detailsType: "System Folder", items: [] },
  cdrive: { title: "Local Disk (C:)", icon: "/assets/hardware.png", detailsName: "Local Disk (C:)", detailsType: "Local Disk", items: C_DRIVE_ITEMS },
  ddrive: { title: "Portfolio Drive (D:)", icon: "/assets/hardware.png", detailsName: "Portfolio Drive (D:)", detailsType: "Local Disk", items: D_DRIVE_ITEMS },
};

const MENU_ITEMS = ["File", "Edit", "View", "Favorites", "Tools", "Help"];

/* ------------------------------------------------------------------ *
 * Small presentational pieces
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
  onDoubleClick?: () => void;
}

const TaskLink: React.FC<TaskLinkProps> = ({ icon, label, onDoubleClick }) => {
  const [hover, setHover] = useState(false);
  return (
    <div
      onDoubleClick={onDoubleClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 6,
        padding: "2px 0",
        cursor: onDoubleClick ? "pointer" : "default",
        userSelect: "none",
      }}
    >
      {icon && <Image src={icon} alt="" width={16} height={16} draggable={false} unoptimized style={{ flexShrink: 0 }} />}
      <span
        style={{
          fontSize: 11,
          color: hover ? "#1E5FCC" : "#0E3A8C",
          textDecoration: hover ? "underline" : "none",
        }}
      >
        {label}
      </span>
    </div>
  );
};

/** Blue divider header used above each content category. */
const CategoryHeader: React.FC<{ title: string }> = ({ title }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 8, margin: "2px 0 10px 0" }}>
    <span style={{ fontSize: 12, fontWeight: "bold", color: "#003399", whiteSpace: "nowrap" }}>{title}</span>
    <span
      style={{
        flex: 1,
        height: 2,
        background: "linear-gradient(to right, #A6C0E8 0%, #E8EEF8 60%, transparent 100%)",
      }}
    />
  </div>
);

interface TileProps {
  icon: string;
  label: string;
  sub?: string;
  selected: boolean;
  onClick: () => void;
  onDoubleClick: () => void;
}

/** Icon-above-text tile used in the right content area. */
const Tile: React.FC<TileProps> = ({ icon, label, sub, selected, onClick, onDoubleClick }) => {
  const [hover, setHover] = useState(false);
  return (
    <div
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        width: 230,
        padding: "5px 6px",
        cursor: "default",
        userSelect: "none",
        background: selected ? "#C1D5F0" : hover ? "#E8F0FC" : "transparent",
        border: selected ? "1px solid #7BA0DD" : "1px solid transparent",
      }}
    >
      <Image src={icon} alt="" width={44} height={44} draggable={false} unoptimized style={{ flexShrink: 0 }} />
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 11, color: "#000", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {label}
        </div>
        {sub && <div style={{ fontSize: 11, color: "#5A5A5A" }}>{sub}</div>}
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ *
 * Main window
 * ------------------------------------------------------------------ */

export const MyComputerWindow: React.FC = () => {
  const { launchApp } = useDesktop();

  const [view, setView] = useState<FolderId>("computer");
  const [history, setHistory] = useState<FolderId[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const meta = FOLDERS[view];

  const navigateTo = useCallback(
    (next: FolderId) => {
      setHistory((h) => [...h, view]);
      setView(next);
      setSelectedId(null);
    },
    [view],
  );

  const goBack = useCallback(() => {
    setHistory((h) => {
      if (h.length === 0) return h;
      setView(h[h.length - 1]);
      setSelectedId(null);
      return h.slice(0, -1);
    });
  }, []);

  // Resolve the currently-selected entry (across whichever list it belongs to).
  const selectedEntry = useMemo(() => {
    const pool: (FolderEntry | DriveEntry)[] =
      view === "computer" ? [...STORED_FILES, ...HARD_DRIVES] : meta.items;
    return pool.find((e) => e.id === selectedId) ?? null;
  }, [view, meta.items, selectedId]);

  // Details pane content — updates as drives/folders are selected.
  const details = selectedEntry
    ? { name: selectedEntry.label, type: selectedEntry.type }
    : { name: meta.detailsName, type: meta.detailsType };

  const objectCount =
    view === "computer" ? STORED_FILES.length + HARD_DRIVES.length : meta.items.length;

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
        <ToolbarButton icon="/assets/toolbar/back.png" label="Back" caret disabled={history.length === 0} onClick={goBack} />
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
          <Image src={meta.icon} alt="" width={16} height={16} draggable={false} unoptimized style={{ margin: "0 4px", flexShrink: 0 }} />
          <span style={{ flex: 1, fontSize: 11 }}>{meta.title}</span>
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
          {view === "computer" && (
            <TaskGroup title="System Tasks">
              <TaskLink icon="/assets/mycomputer.png" label="View system information" />
              <TaskLink icon="/assets/defaultprog.png" label="Add or remove programs" />
              <TaskLink icon="/assets/hardware.png" label="Change a setting" />
            </TaskGroup>
          )}

          <TaskGroup title="Other Places">
            <TaskLink icon="/assets/folder.png" label="My Documents" onDoubleClick={() => launchApp("resume")} />
            <TaskLink icon="/assets/folder_program.png" label="Projects" onDoubleClick={() => launchApp("projects")} />
            <TaskLink icon="/assets/pdf.png" label="Resume" onDoubleClick={() => launchApp("resume")} />
            <TaskLink icon="/assets/outlook_large.png" label="Contact" onDoubleClick={() => launchApp("contact")} />
          </TaskGroup>

          <TaskGroup title="Details">
            <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
              <Image src={meta.icon} alt="" width={28} height={28} draggable={false} unoptimized style={{ flexShrink: 0 }} />
              <div style={{ minWidth: 0 }}>
                <div style={{ fontWeight: "bold", color: "#1B438F", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {details.name}
                </div>
                <div style={{ color: "#3A3A3A" }}>{details.type}</div>
              </div>
            </div>
          </TaskGroup>
        </div>

        {/* Right content area */}
        <div style={{ flex: 1, overflowY: "auto", background: "#FFFFFF", padding: "12px 14px" }}>
          {view === "computer" ? (
            <>
              <CategoryHeader title="Files Stored on This Computer" />
              <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 18 }}>
                {STORED_FILES.map((f) => (
                  <Tile
                    key={f.id}
                    icon={f.icon}
                    label={f.label}
                    selected={selectedId === f.id}
                    onClick={() => setSelectedId(f.id)}
                    onDoubleClick={() => launchApp(f.app)}
                  />
                ))}
              </div>

              <CategoryHeader title="Hard Disk Drives" />
              <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                {HARD_DRIVES.map((d) => (
                  <Tile
                    key={d.id}
                    icon={d.icon}
                    label={d.label}
                    sub={d.detail}
                    selected={selectedId === d.id}
                    onClick={() => setSelectedId(d.id)}
                    onDoubleClick={() => navigateTo(d.target)}
                  />
                ))}
              </div>
            </>
          ) : (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
              {meta.items.map((item) => (
                <Tile
                  key={item.id}
                  icon={item.icon}
                  label={item.label}
                  selected={selectedId === item.id}
                  onClick={() => setSelectedId(item.id)}
                  onDoubleClick={() => launchApp(item.app)}
                />
              ))}
            </div>
          )}
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
          {objectCount} object(s)
        </div>
        <div style={{ width: 150, display: "flex", alignItems: "center", gap: 5, padding: "0 8px", borderTop: "1px solid #ACA899", borderLeft: "1px solid #ACA899", margin: "1px 1px 1px 0" }}>
          <Image src="/assets/mycomputer.png" alt="" width={14} height={14} draggable={false} unoptimized />
          My Computer
        </div>
      </div>
    </div>
  );
};
