"use client";

import React, { useCallback, useMemo, useState } from "react";
import Image from "next/image";
import { useDesktop } from "@/desktop/DesktopProvider";
import { useRecycleBin } from "@/desktop/context/RecycleBinContext";

/* ------------------------------------------------------------------ *
 * Constants & helpers
 * ------------------------------------------------------------------ */

const FONT = `"Tahoma", "Segoe UI", Arial, sans-serif`;

const MENU_ITEMS = ["File", "Edit", "View", "Favorites", "Tools", "Help"];

/** Map a file extension to a human-readable Windows file type. */
function fileType(name: string): string {
  const ext = name.slice(name.lastIndexOf(".") + 1).toLowerCase();
  switch (ext) {
    case "txt":
      return "Text Document";
    case "md":
      return "MD File";
    case "doc":
    case "docx":
      return "Microsoft Word Document";
    case "xls":
    case "xlsx":
      return "Microsoft Excel Worksheet";
    case "zip":
      return "Compressed (zipped) Folder";
    case "pdf":
      return "Adobe Acrobat Document";
    default:
      return ext ? `${ext.toUpperCase()} File` : "File";
  }
}

/** Pick the best-matching XP icon asset for a file name. */
function fileIcon(name: string): string {
  const ext = name.slice(name.lastIndexOf(".") + 1).toLowerCase();
  switch (ext) {
    case "pdf":
      return "/assets/pdf.png";
    case "jpg":
    case "jpeg":
    case "png":
    case "gif":
    case "bmp":
      return "/assets/image.png";
    default:
      return "/assets/doc.png";
  }
}

/** Parse the leading number out of a "12 KB" style size string. */
function sizeKb(size: string): number {
  const n = parseInt(size, 10);
  return Number.isNaN(n) ? 0 : n;
}

/* ------------------------------------------------------------------ *
 * Small presentational pieces (XP Explorer chrome)
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
  onDoubleClick?: () => void;
}

const TaskLink: React.FC<TaskLinkProps> = ({ icon, label, disabled, onClick, onDoubleClick }) => {
  const [hover, setHover] = useState(false);
  const interactive = !disabled && (onClick || onDoubleClick);
  return (
    <div
      onClick={disabled ? undefined : onClick}
      onDoubleClick={disabled ? undefined : onDoubleClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 6,
        padding: "2px 0",
        cursor: interactive ? "pointer" : "default",
        userSelect: "none",
        opacity: disabled ? 0.5 : 1,
      }}
    >
      {icon && <Image src={icon} alt="" width={16} height={16} draggable={false} unoptimized style={{ flexShrink: 0 }} />}
      <span
        style={{
          fontSize: 11,
          color: disabled ? "#6B6B6B" : hover ? "#1E5FCC" : "#0E3A8C",
          textDecoration: !disabled && hover ? "underline" : "none",
        }}
      >
        {label}
      </span>
    </div>
  );
};

interface TileProps {
  icon: string;
  label: string;
  selected: boolean;
  onClick: (e: React.MouseEvent) => void;
  onDoubleClick: () => void;
}

/** Large-icon-above-text tile used in the right content area (XP icon view). */
const Tile: React.FC<TileProps> = ({ icon, label, selected, onClick, onDoubleClick }) => {
  const [hover, setHover] = useState(false);
  return (
    <div
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: 96,
        padding: "6px 4px",
        cursor: "default",
        userSelect: "none",
      }}
    >
      <div
        style={{
          width: 56,
          height: 56,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: selected ? "#316AC5" : "transparent",
          marginBottom: 3,
        }}
      >
        <Image
          src={icon}
          alt=""
          width={42}
          height={42}
          draggable={false}
          unoptimized
          style={{ opacity: selected ? 0.85 : 1 }}
        />
      </div>
      <span
        style={{
          maxWidth: "100%",
          padding: "1px 3px",
          fontSize: 11,
          textAlign: "center",
          color: selected ? "#FFFFFF" : "#000",
          background: selected ? "#316AC5" : hover ? "#E8F0FC" : "transparent",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          lineHeight: 1.3,
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
 * Main window
 * ------------------------------------------------------------------ */

export const RecycleBinWindow: React.FC = () => {
  const { launchApp } = useDesktop();
  const { files, isEmpty, emptyBin, restoreFile, restoreAll } = useRecycleBin();

  // Selection is a set of file names so Ctrl+Click multi-select works.
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const clearSelection = useCallback(() => setSelected(new Set()), []);

  const handleSelect = useCallback((name: string, ctrl: boolean) => {
    setSelected((prev) => {
      const next = new Set(ctrl ? prev : []);
      if (ctrl && prev.has(name)) {
        next.delete(name);
      } else {
        next.add(name);
      }
      return next;
    });
  }, []);

  const selectAll = useCallback(() => {
    setSelected(new Set(files.map((f) => f.name)));
  }, [files]);

  const handleEmpty = useCallback(() => {
    emptyBin();
    clearSelection();
  }, [emptyBin, clearSelection]);

  const handleRestoreAll = useCallback(() => {
    restoreAll();
    clearSelection();
  }, [restoreAll, clearSelection]);

  const handleRestoreSelected = useCallback(() => {
    if (selected.size === 0) return;
    selected.forEach((name) => restoreFile(name));
    clearSelection();
  }, [selected, restoreFile, clearSelection]);

  const handleRestoreOne = useCallback(
    (name: string) => {
      restoreFile(name);
      setSelected((prev) => {
        const next = new Set(prev);
        next.delete(name);
        return next;
      });
    },
    [restoreFile],
  );

  // Ctrl+A inside the content area selects all items.
  const onContentKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "a") {
        e.preventDefault();
        selectAll();
      }
    },
    [selectAll],
  );

  // Resolve the single selected file (for the Details pane).
  const soleSelected = useMemo(() => {
    if (selected.size !== 1) return null;
    const name = [...selected][0];
    return files.find((f) => f.name === name) ?? null;
  }, [selected, files]);

  const totalKb = useMemo(() => files.reduce((acc, f) => acc + sizeKb(f.size), 0), [files]);

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
          <Image
            src={isEmpty ? "/assets/recycling_bin.png" : "/assets/Recycle_bin_full.webp"}
            alt=""
            width={16}
            height={16}
            draggable={false}
            unoptimized
            style={{ margin: "0 4px", flexShrink: 0 }}
          />
          <span style={{ flex: 1, fontSize: 11 }}>Recycle Bin</span>
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
            width: 230,
            flexShrink: 0,
            overflowY: "auto",
            padding: "10px 8px",
            background: "linear-gradient(180deg, #E9EFFB 0%, #C9D7EF 100%)",
            borderRight: "1px solid #BAC6DD",
          }}
        >
          <TaskGroup title="Recycle Bin Tasks">
            <TaskLink
              icon="/assets/toolbar/removepaper.png"
              label="Empty the Recycle Bin"
              disabled={isEmpty}
              onClick={isEmpty ? undefined : handleEmpty}
            />
            {selected.size > 0 && (
              <TaskLink
                icon="/assets/toolbar/recyclepaper.png"
                label={selected.size === 1 ? "Restore this item" : "Restore the selected items"}
                onClick={handleRestoreSelected}
              />
            )}
            <TaskLink
              icon="/assets/toolbar/recyclepaper.png"
              label="Restore all items"
              disabled={isEmpty}
              onClick={isEmpty ? undefined : handleRestoreAll}
            />
          </TaskGroup>

          <TaskGroup title="Other Places">
            <TaskLink icon="/assets/mycomputer.png" label="Desktop" onClick={() => launchApp("mycomputer")} />
            <TaskLink icon="/assets/folder.png" label="My Documents" onClick={() => launchApp("resume")} />
            <TaskLink icon="/assets/mycomputer.png" label="My Computer" onClick={() => launchApp("mycomputer")} />
            <TaskLink icon="/assets/internet.png" label="My Network Places" onClick={() => launchApp("github")} />
          </TaskGroup>

          <TaskGroup title="Details">
            {soleSelected ? (
              <div>
                <DetailRow label="File Name" value={soleSelected.name} />
                <DetailRow label="Type" value={fileType(soleSelected.name)} />
                <DetailRow label="Size" value={soleSelected.size} />
                <DetailRow label="Date Deleted" value={soleSelected.date} />
              </div>
            ) : (
              <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                <Image
                  src={isEmpty ? "/assets/recycling_bin.png" : "/assets/Recycle_bin_full.webp"}
                  alt=""
                  width={28}
                  height={28}
                  draggable={false}
                  unoptimized
                  style={{ flexShrink: 0 }}
                />
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontWeight: "bold", color: "#1B438F" }}>Recycle Bin</div>
                  <div style={{ color: "#3A3A3A" }}>
                    {selected.size > 1 ? `${selected.size} items selected` : "System Folder"}
                  </div>
                </div>
              </div>
            )}
          </TaskGroup>
        </div>

        {/* Right content area */}
        <div
          tabIndex={0}
          onKeyDown={onContentKeyDown}
          onClick={(e) => {
            // Clicking empty space clears the selection.
            if (e.target === e.currentTarget) clearSelection();
          }}
          style={{ flex: 1, overflowY: "auto", background: "#FFFFFF", padding: 8, outline: "none" }}
        >
          {isEmpty ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
                gap: 8,
                color: "#5A5A5A",
              }}
            >
              <Image src="/assets/recycling_bin.png" alt="" width={48} height={48} draggable={false} unoptimized />
              <span style={{ fontSize: 11 }}>The Recycle Bin is empty.</span>
            </div>
          ) : (
            <div
              onClick={(e) => {
                if (e.target === e.currentTarget) clearSelection();
              }}
              style={{ display: "flex", flexWrap: "wrap", alignContent: "flex-start", gap: 2 }}
            >
              {files.map((file) => (
                <Tile
                  key={file.name}
                  icon={fileIcon(file.name)}
                  label={file.name}
                  selected={selected.has(file.name)}
                  onClick={(e) => handleSelect(file.name, e.ctrlKey || e.metaKey)}
                  onDoubleClick={() => handleRestoreOne(file.name)}
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
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            padding: "0 8px",
            borderTop: "1px solid #ACA899",
            margin: "1px 0 1px 1px",
          }}
        >
          {selected.size > 0 ? `${selected.size} object(s) selected` : `${files.length} object(s)`}
        </div>
        <div
          style={{
            width: 150,
            display: "flex",
            alignItems: "center",
            gap: 5,
            padding: "0 8px",
            borderTop: "1px solid #ACA899",
            borderLeft: "1px solid #ACA899",
            margin: "1px 1px 1px 0",
          }}
        >
          {totalKb > 0 ? `${totalKb} KB` : ""}
        </div>
      </div>
    </div>
  );
};
