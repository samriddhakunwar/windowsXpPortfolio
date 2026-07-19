"use client";

import { useDesktop } from "@/desktop/DesktopProvider";
import { AppRegistry } from "@/desktop/core/AppRegistry";
import { WindowType } from "@/types";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";

interface StartMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onShutdownRequest?: () => void;
  onLogOffRequest?: () => void;
}

export const StartMenu: React.FC<StartMenuProps> = ({ isOpen, onClose, onShutdownRequest, onLogOffRequest }) => {
  const { launchApp } = useDesktop();
  const menuRef = useRef<HTMLDivElement>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAllPrograms, setShowAllPrograms] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setSearchQuery("");
      setShowAllPrograms(false);
      return;
    }

    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        const target = e.target as HTMLElement;
        if (target.closest("[data-start-button]")) return;
        onClose();
      }
    };

    const timer = setTimeout(() => {
      document.addEventListener("mousedown", handleClickOutside);
    }, 50);

    return () => {
      clearTimeout(timer);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  const apps = AppRegistry.getAllLaunchableApps();

  const handleAppClick = (type: WindowType) => {
    launchApp(type);
    onClose();
  };

  const filteredApps = searchQuery
    ? apps.filter((a) => a.title.toLowerCase().includes(searchQuery.toLowerCase()))
    : apps;

  const leftPanelApps = searchQuery ? filteredApps : apps.slice(0, 5);

  const rightPanelItems = [
    { label: "My Computer", type: "mycomputer" as WindowType, bold: true },
    { label: "My Documents", type: null, bold: true },
    { label: "My Projects", type: "projects" as WindowType, bold: true },
  ];

  // 1.25× scaled from original: padding 6px→8px/10px→13px, fontSize 12px→15px, gap 10px→13px
  const menuItemStyle: React.CSSProperties = {
    padding: "8px 13px",
    fontSize: "15px",
    color: "#000",
    border: "none",
    background: "transparent",
    cursor: "pointer",
    width: "100%",
    display: "flex",
    alignItems: "center",
    gap: "13px",
    textAlign: "left" as const,
    transition: "background 120ms ease, color 120ms ease",
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={menuRef}
          className="fixed bottom-[40px] left-0"
          style={{ zIndex: 10001 }}
          initial={{ opacity: 0, y: 16, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.97 }}
          transition={{ type: "spring", stiffness: 420, damping: 28, mass: 0.7 }}
        >
          <div
            style={{
              width: "500px",
              borderRadius: "8px 8px 0 0",
              overflow: "hidden",
              border: "2px solid #0055E5",
              boxShadow: "4px 0 16px rgba(0,0,0,0.5), 2px 2px 8px rgba(0,0,0,0.4)",
            }}
          >
            {/* Header - User info */}
            <div
              style={{
                background: "linear-gradient(180deg, #1E6BC5 0%, #1659B3 40%, #1555AF 100%)",
                padding: "10px 13px",
                display: "flex",
                alignItems: "center",
                gap: "13px",
              }}
            >
              <Image
                src="/assets/userprofile.jpg"
                alt="User"
                width={50}
                height={50}
                className="rounded-md"
                style={{ border: "2px solid #C2DCF5", borderRadius: "4px", objectFit: "cover" }}
                draggable={false}
              />
              <span className="text-white font-bold" style={{ fontSize: "16px", textShadow: "1px 1px 1px rgba(0,0,0,0.5)" }}>
                Samriddha
              </span>
            </div>

            {/* Search bar */}
            <div
              style={{
                background: "#FFFFFF",
                padding: "5px 13px",
                borderBottom: "1px solid #C0C0C0",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <Image src="/assets/search.png" alt="Search" width={18} height={18} draggable={false} />
              <input
                type="text"
                placeholder="Search programs..."
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setShowAllPrograms(false); }}
                style={{
                  border: "none",
                  outline: "none",
                  fontSize: "14px",
                  flex: 1,
                  background: "transparent",
                  fontFamily: "Tahoma, Arial, sans-serif",
                  color: "#333",
                }}
                autoFocus={isOpen}
              />
            </div>

            {/* Body */}
            <div className="flex" style={{ minHeight: "350px", position: "relative" }}>
              {/* Left panel */}
              <div className="flex-1 flex flex-col" style={{ background: "#FFFFFF", padding: "5px 0", overflow: "hidden" }}>

                {/* All Programs slide-in panel */}
                <AnimatePresence>
                  {showAllPrograms && (
                    <motion.div
                      initial={{ x: "-100%", opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      exit={{ x: "-100%", opacity: 0 }}
                      transition={{ type: "spring", stiffness: 400, damping: 32 }}
                      style={{
                        position: "absolute",
                        top: 0, left: 0, bottom: 0,
                        width: "calc(100% - 225px)",
                        background: "#FFFFFF",
                        zIndex: 2,
                        overflowY: "auto",
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      {/* Back button */}
                      <button
                        onClick={() => setShowAllPrograms(false)}
                        style={{
                          ...menuItemStyle,
                          borderBottom: "1px solid #C0C0C0",
                          color: "#0055E5",
                          fontWeight: "bold",
                          fontSize: "14px",
                          padding: "6px 13px",
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = "#EEF4FF"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                      >
                        ◂ Back
                      </button>
                      <div style={{ padding: "4px 13px 3px", fontSize: "11px", fontWeight: "bold", color: "#808080", letterSpacing: "1px", textTransform: "uppercase" }}>
                        All Programs
                      </div>
                      {apps.map((app) => (
                        <button
                          key={app.id}
                          onClick={() => handleAppClick(app.id)}
                          style={menuItemStyle}
                          onMouseEnter={(e) => { e.currentTarget.style.background = "#2B71B3"; e.currentTarget.style.color = "#FFF"; }}
                          onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#000"; }}
                        >
                          <div className="flex items-center justify-center flex-shrink-0" style={{ width: "25px", height: "25px", fontSize: "16px" }}>
                            {app.icon}
                          </div>
                          <span style={{ fontSize: "14px", truncate: "true" } as any}>{app.title}</span>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Normal left panel apps */}
                {!showAllPrograms && (
                  <>
                    {leftPanelApps.map((app) => (
                      <button
                        key={app.id}
                        onClick={() => handleAppClick(app.id)}
                        style={menuItemStyle}
                        onMouseEnter={(e) => { e.currentTarget.style.background = "#2B71B3"; e.currentTarget.style.color = "#FFF"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#000"; }}
                      >
                        <div className="flex items-center justify-center flex-shrink-0" style={{ width: "30px", height: "30px" }}>
                          {app.icon}
                        </div>
                        <span className="font-bold truncate">{app.title}</span>
                      </button>
                    ))}

                    {searchQuery && filteredApps.length === 0 && (
                      <div style={{ padding: "15px 13px", color: "#808080", fontSize: "14px" }}>
                        No results for &ldquo;{searchQuery}&rdquo;
                      </div>
                    )}

                    {!searchQuery && (
                      <>
                        <div style={{ height: "1px", background: "#C0C0C0", margin: "5px 8px" }} />
                        <button
                          className="flex items-center gap-2 w-full text-left"
                          style={menuItemStyle}
                          onClick={() => setShowAllPrograms(true)}
                          onMouseEnter={(e) => { e.currentTarget.style.background = "#2B71B3"; e.currentTarget.style.color = "#FFF"; }}
                          onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#000"; }}
                        >
                          <Image src="/assets/all-programs.ico" alt="" width={20} height={20} draggable={false} />
                          <span className="font-bold">All Programs</span>
                          <span style={{ marginLeft: "auto" }}>▸</span>
                        </button>
                      </>
                    )}
                  </>
                )}
              </div>

              {/* Right panel */}
              <div
                className="flex flex-col"
                style={{
                  width: "225px",
                  background: "linear-gradient(180deg, #4B97D7 0%, #3983C9 20%, #3983C9 80%, #2F76BE 100%)",
                  padding: "5px 0",
                  borderLeft: "1px solid #3B87CB",
                  flexShrink: 0,
                }}
              >
                {rightPanelItems.map((item, i) => (
                  <button
                    key={i}
                    onClick={() => item.type && handleAppClick(item.type)}
                    className="flex items-center gap-2 w-full text-left text-white"
                    style={{
                      padding: "6px 13px",
                      fontSize: "14px",
                      border: "none",
                      background: "transparent",
                      cursor: item.type ? "pointer" : "default",
                      fontWeight: item.bold ? "bold" : "normal",
                      textShadow: "1px 1px 0 rgba(0,0,0,0.3)",
                      transition: "background 120ms ease",
                    }}
                    onMouseEnter={(e) => { if (item.type) e.currentTarget.style.background = "rgba(0,0,0,0.18)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                  >
                    <Image
                      src={
                        item.label === "My Computer"
                          ? "/assets/mycomputer.png"
                          : item.label === "My Documents"
                            ? "/assets/folder_plain.png"
                            : "/assets/folder_program.png"
                      }
                      alt=""
                      width={25}
                      height={25}
                      draggable={false}
                      unoptimized
                    />
                    <span>{item.label}</span>
                  </button>
                ))}

                <div style={{ height: "1px", background: "rgba(255,255,255,0.3)", margin: "5px 8px" }} />

                {[
                  { label: "Resume",      type: "resume"      as WindowType, icon: "/assets/pdf.png" },
                  { label: "GitHub",      type: "github"      as WindowType, icon: "/assets/github.png" },
                  { label: "Contact",     type: "contact"     as WindowType, icon: "/assets/outlook.png" },
                  { label: "Minesweeper", type: "minesweeper" as WindowType, icon: "/assets/minesweeper.png" },
                ].map((item) => (
                  <button
                    key={item.label}
                    onClick={() => handleAppClick(item.type)}
                    className="flex items-center gap-2 w-full text-left text-white"
                    style={{
                      padding: "6px 13px",
                      fontSize: "14px",
                      border: "none",
                      background: "transparent",
                      cursor: "pointer",
                      textShadow: "1px 1px 0 rgba(0,0,0,0.3)",
                      transition: "background 120ms ease",
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(0,0,0,0.18)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                  >
                    <Image src={item.icon} alt="" width={25} height={25} draggable={false} unoptimized />
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div
              style={{
                background: "linear-gradient(180deg, #3580CB 0%, #295EA8 50%, #25559F 100%)",
                padding: "8px 10px",
                display: "flex",
                justifyContent: "flex-end",
                gap: "8px",
                borderTop: "1px solid #1548A0",
              }}
            >
              {/* Log Off */}
              <button
                className="flex items-center gap-2 text-white"
                style={{
                  fontSize: "14px",
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                  padding: "3px 8px",
                  borderRadius: "4px",
                  textShadow: "1px 1px 0 rgba(0,0,0,0.3)",
                  transition: "background 120ms ease",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(0,0,0,0.2)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                onClick={() => {
                  onClose();
                  onLogOffRequest?.();
                }}
              >
                <Image src="/assets/logoff.png" alt="Log Off" width={25} height={25} draggable={false} />
                <span>Log Off</span>
              </button>

              {/* Turn Off Computer */}
              <button
                className="flex items-center gap-2 text-white"
                style={{
                  fontSize: "14px",
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                  padding: "3px 8px",
                  borderRadius: "4px",
                  textShadow: "1px 1px 0 rgba(0,0,0,0.3)",
                  transition: "background 120ms ease",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(0,0,0,0.2)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                onClick={() => {
                  onClose();
                  onShutdownRequest?.();
                }}
              >
                <Image src="/assets/shutdown.png" alt="Turn Off Computer" width={25} height={25} draggable={false} />
                <span>Turn Off Computer</span>
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
