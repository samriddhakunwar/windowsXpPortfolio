"use client";

import { useDesktop } from "@/desktop/DesktopProvider";
import { AppRegistry } from "@/desktop/core/AppRegistry";
import { useSoundSystem } from "@/hooks/useSoundSystem";
import { Window as WindowType } from "@/types";
import { AnimatePresence } from "framer-motion";
import React, { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { ContextMenu } from "./components/ContextMenu";
import { DesktopIcon } from "./components/DesktopIcon";
import { DesktopIconContextMenu, DesktopIconInfo } from "./components/DesktopIconContextMenu";
import { RecycleBinDynamicIcon } from "./components/RecycleBinDynamicIcon";
import { ShutdownAction, ShutdownModal } from "./components/ShutdownModal";
import { StartMenu } from "./components/StartMenu";
import { TaskBar } from "./components/TaskBar";
import { XPWindow } from "./components/XPWindow";

interface ContextMenuState {
  x: number;
  y: number;
  type: "desktop" | "window";
  windowId?: string;
}

interface IconContextMenuState {
  icon: DesktopIconInfo;
  x: number;
  y: number;
}

function getWallpaper(): string {
  try {
    const s = localStorage.getItem("xp-settings");
    if (s) {
      const parsed = JSON.parse(s);
      if (parsed.wallpaper) return parsed.wallpaper;
    }
  } catch {}
  return "/assets/bg.jpg";
}

interface DesktopPanelProps {
  onShutdownAction?: (action: ShutdownAction) => void;
  onLogOffRequest?: () => void;
}

export default function DesktopPanel({ onShutdownAction, onLogOffRequest }: DesktopPanelProps) {
  const {
    windows,
    launchApp,
    focusWindow,
    closeWindow,
    minimizeWindow,
    restoreWindow,
    maximizeWindow,
    updateWindowPosition,
    resizeWindow,
    minimizeAll,
    closeAllWindows,
  } = useDesktop();

  const { playSound } = useSoundSystem();
  const [startMenuOpen, setStartMenuOpen] = useState(false);
  const [shutdownModalOpen, setShutdownModalOpen] = useState(false);
  const [contextMenu, setContextMenu] = useState<ContextMenuState | null>(null);
  const [iconContextMenu, setIconContextMenu] = useState<IconContextMenuState | null>(null);
  const [wallpaper, setWallpaper] = useState("/assets/bg.jpg");

  // Load wallpaper from localStorage on mount
  useEffect(() => {
    setWallpaper(getWallpaper());
    const onStorage = () => setWallpaper(getWallpaper());
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName;
      const isInput = tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT";
      if (isInput) return;

      // Win/Meta key → toggle Start Menu
      if (e.key === "Meta" || e.key === "OS") {
        e.preventDefault();
        setStartMenuOpen((prev) => !prev);
      }

      // Escape → close menus
      if (e.key === "Escape") {
        setStartMenuOpen(false);
        setContextMenu(null);
        setIconContextMenu(null);
      }

      // Alt + F4 → close focused window
      if (e.altKey && e.key === "F4") {
        e.preventDefault();
        const focused = windows.find((w) => w.isFocused);
        if (focused) {
          closeWindow(focused.id);
          playSound("close");
        }
      }

      // Win + D or Win + M → minimize all
      if ((e.metaKey || e.key === "d" || e.key === "m") && e.ctrlKey) {
        // fallback for Windows — many browsers intercept Meta+D
      }
      if (e.key === "d" && e.metaKey) {
        e.preventDefault();
        minimizeAll();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [windows, closeWindow, minimizeAll, playSound]);

  const desktopIcons = useMemo(() => {
    const apps = AppRegistry.getAllLaunchableApps();
    const icons = apps.map((app) => ({
      type: app.id,
      label: app.title,
      icon: app.icon,
    }));
    // Recycle Bin uses a live React element that reads from RecycleBinContext
    // so the icon switches between empty/full without any page refresh.
    // Insert at index 6 (after GitHub, before Minesweeper) → col-2 row-2.
    icons.splice(6, 0, {
      type: "recycle" as const,
      label: "Recycle Bin",
      icon: React.createElement(RecycleBinDynamicIcon),
    });
    return icons;
  }, []);

  const handleIconDoubleClick = useCallback(
    (type: any) => {
      setStartMenuOpen(false);
      playSound("open");
      launchApp(type);
    },
    [launchApp, playSound],
  );

  const handleDesktopClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) {
        setStartMenuOpen(false);
        setContextMenu(null);
        setIconContextMenu(null);
      }
    },
    [],
  );

  const handleDesktopContextMenu = useCallback((e: React.MouseEvent) => {
    // Only show desktop context menu when clicking the actual desktop background element itself,
    // not desktop icons, windows, taskbar, start menu, or any other UI elements.
    const target = e.target as HTMLElement;
    if (!target.hasAttribute("data-desktop-background")) return;
    e.preventDefault();
    setIconContextMenu(null);
    setContextMenu({ x: e.clientX, y: e.clientY, type: "desktop" });
  }, []);

  const handleIconContextMenu = useCallback(
    (e: React.MouseEvent, iconData: DesktopIconInfo) => {
      // e.preventDefault() and e.stopPropagation() are already called inside DesktopIcon
      setContextMenu(null);
      setIconContextMenu({ icon: iconData, x: e.clientX, y: e.clientY });
    },
    [],
  );

  const handleWindowContextMenu = useCallback(
    (e: React.MouseEvent, windowId: string) => {
      e.preventDefault();
      e.stopPropagation();
      setContextMenu({ x: e.clientX, y: e.clientY, type: "window", windowId });
    },
    [],
  );

  const renderWindowContent = (window: WindowType) => {
    const app = AppRegistry.getApp(window.type);
    if (!app) return null;
    return (
      <Suspense fallback={<div style={{ padding: "16px", fontFamily: "Tahoma, Arial, sans-serif", fontSize: "11px" }}>Loading...</div>}>
        <app.component />
      </Suspense>
    );
  };

  const desktopContextItems = [
    { label: "Arrange Icons By", icon: "🗂", onClick: () => {}, disabled: true },
    { separator: true as const },
    { label: "Refresh", icon: "🔄", onClick: () => {}, disabled: true },
    { separator: true as const },
    { label: "New Folder", icon: "📁", onClick: () => {}, disabled: true },
    { separator: true as const },
    { label: "About Me", icon: "👤", onClick: () => { launchApp("about"); playSound("open"); } },
    { label: "Contact", icon: "✉", onClick: () => { launchApp("contact"); playSound("open"); } },
  ];


  const getWindowContextItems = (windowId: string) => {
    const win = windows.find((w) => w.id === windowId);
    if (!win) return [];
    return [
      { label: "Restore", icon: "🔲", onClick: () => restoreWindow(windowId), disabled: !win.isMinimized && !win.isMaximized },
      { label: "Minimize", icon: "➖", onClick: () => { minimizeWindow(windowId); playSound("minimize"); } },
      { label: "Maximize", icon: "⬜", onClick: () => maximizeWindow(windowId), disabled: win.isMaximized },
      { separator: true as const },
      { label: "Close", icon: "✕", onClick: () => { closeWindow(windowId); playSound("close"); } },
    ];
  };

  return (
    <>
    <div
      data-desktop-background
      onClick={handleDesktopClick}
      onContextMenu={handleDesktopContextMenu}
      style={{
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        position: "relative",
        backgroundImage: `url(${wallpaper})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        cursor: "default",
        transition: "background-image 0.4s ease",
      }}
    >
      {/* Desktop Icons */}
      <div
        style={{
          position: "absolute",
          top: "8px",
          left: "8px",
          display: "flex",
          flexDirection: "column",
          flexWrap: "wrap",
          gap: "6px",
          maxHeight: "calc(100vh - 56px)",
          alignContent: "flex-start",
          zIndex: 5,
        }}
      >
        {desktopIcons.map((iconData) => (
          <DesktopIcon
            key={iconData.type}
            type={iconData.type}
            label={iconData.label}
            icon={iconData.icon}
            onDoubleClick={() => handleIconDoubleClick(iconData.type)}
            onContextMenu={(e) =>
              handleIconContextMenu(e, { type: iconData.type, label: iconData.label })
            }
          />
        ))}
      </div>

      {/* Windows */}
      <AnimatePresence>
        {windows.map((window) => {
          const app = AppRegistry.getApp(window.type);
          return (
            <div
              key={window.id}
              onContextMenu={(e) => handleWindowContextMenu(e, window.id)}
            >
              <XPWindow
                id={window.id}
                title={window.title}
                icon={app?.icon}
                x={window.x}
                y={window.y}
                width={window.width}
                height={window.height}
                isMaximized={window.isMaximized}
                isMinimized={window.isMinimized}
                isFocused={window.isFocused}
                zIndex={window.zIndex}
                onClose={() => { closeWindow(window.id); playSound("close"); }}
                onMinimize={() => { minimizeWindow(window.id); playSound("minimize"); }}
                onMaximize={() => maximizeWindow(window.id)}
                onFocus={() => focusWindow(window.id)}
                onDragEnd={(x, y) => updateWindowPosition(window.id, x, y)}
                onResize={(w, h, x, y) => resizeWindow(window.id, w, h, x, y)}
                disableMaximize={window.type === "minesweeper"}
              >
                {renderWindowContent(window)}
              </XPWindow>
            </div>
          );
        })}
      </AnimatePresence>

      {/* Desktop / Window Context Menu */}
      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          items={
            contextMenu.type === "desktop"
              ? desktopContextItems
              : getWindowContextItems(contextMenu.windowId ?? "")
          }
          onClose={() => setContextMenu(null)}
        />
      )}

      {/* Desktop Icon Context Menu */}
      {iconContextMenu && (
        <DesktopIconContextMenu
          icon={iconContextMenu.icon}
          position={{ x: iconContextMenu.x, y: iconContextMenu.y }}
          onOpen={() => {
            handleIconDoubleClick(iconContextMenu.icon.type);
          }}
          onClose={() => setIconContextMenu(null)}
        />
      )}

      {/* Start Menu */}
      <StartMenu
        isOpen={startMenuOpen}
        onClose={() => setStartMenuOpen(false)}
        onShutdownRequest={() => {
          setStartMenuOpen(false);
          setShutdownModalOpen(true);
        }}
        onLogOffRequest={() => {
          setStartMenuOpen(false);
          closeAllWindows();
          onLogOffRequest?.();
        }}
      />

      {/* Taskbar */}
      <TaskBar
        windows={windows}
        onWindowClick={(id) => { focusWindow(id); playSound("click"); }}
        onMinimize={(id) => { minimizeWindow(id); playSound("minimize"); }}
        onRestore={(id) => { restoreWindow(id); playSound("open"); }}
        onStartClick={() => setStartMenuOpen((prev) => !prev)}
        startMenuOpen={startMenuOpen}
      />
    </div>

      {/* Shutdown Modal — outside overflow:hidden desktop div for perfect centering */}
      <ShutdownModal
        isOpen={shutdownModalOpen}
        onClose={() => setShutdownModalOpen(false)}
        onAction={(action) => {
          setShutdownModalOpen(false);
          onShutdownAction?.(action);
        }}
      />
    </>
  );
}
