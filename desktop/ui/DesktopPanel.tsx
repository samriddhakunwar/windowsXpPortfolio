"use client";

import { useDesktop } from "@/desktop/DesktopProvider";
import { AppRegistry } from "@/desktop/core/AppRegistry";
import { Window as WindowType } from "@/types";
import { useSoundSystem } from "@/hooks/useSoundSystem";
import { AnimatePresence } from "framer-motion";
import { Suspense, useCallback, useMemo, useState } from "react";
import { ContextMenu } from "./components/ContextMenu";
import { DesktopIcon } from "./components/DesktopIcon";
import { StartMenu } from "./components/StartMenu";
import { TaskBar } from "./components/TaskBar";
import { XPWindow } from "./components/XPWindow";

interface ContextMenuState {
  x: number;
  y: number;
  type: "desktop" | "window";
  windowId?: string;
}

export default function DesktopPanel() {
  const {
    windows,
    launchApp,
    focusWindow,
    closeWindow,
    minimizeWindow,
    restoreWindow,
    maximizeWindow,
    updateWindowPosition,
  } = useDesktop();

  const { playSound } = useSoundSystem();
  const [startMenuOpen, setStartMenuOpen] = useState(false);
  const [contextMenu, setContextMenu] = useState<ContextMenuState | null>(null);

  const desktopIcons = useMemo(() => {
    const apps = AppRegistry.getAllLaunchableApps();
    const icons = apps.map((app) => ({
      type: app.id,
      label: app.title,
      icon: app.icon,
    }));
    // Add recycle bin manually (it's not launchable so not in getAllLaunchableApps)
    const recycleApp = AppRegistry.getApp("recycle");
    if (recycleApp) {
      icons.push({ type: "recycle", label: "Recycle Bin", icon: recycleApp.icon });
    }
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
      }
    },
    [],
  );

  const handleDesktopContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY, type: "desktop" });
  }, []);

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
    {
      label: "Arrange Icons By",
      icon: "🗂",
      onClick: () => {},
      disabled: true,
    },
    { separator: true as const },
    {
      label: "Refresh",
      icon: "🔄",
      onClick: () => window.location.reload(),
    },
    { separator: true as const },
    {
      label: "New Folder",
      icon: "📁",
      onClick: () => {},
      disabled: true,
    },
    { separator: true as const },
    {
      label: "About Me",
      icon: "👤",
      onClick: () => {
        launchApp("about");
        playSound("open");
      },
    },
    {
      label: "Contact",
      icon: "✉",
      onClick: () => {
        launchApp("contact");
        playSound("open");
      },
    },
    {
      label: "Settings",
      icon: "⚙",
      onClick: () => {
        launchApp("settings");
        playSound("open");
      },
    },
  ];

  const getWindowContextItems = (windowId: string) => {
    const win = windows.find((w) => w.id === windowId);
    if (!win) return [];
    return [
      {
        label: "Restore",
        icon: "🔲",
        onClick: () => restoreWindow(windowId),
        disabled: !win.isMinimized && !win.isMaximized,
      },
      {
        label: "Minimize",
        icon: "➖",
        onClick: () => {
          minimizeWindow(windowId);
          playSound("minimize");
        },
      },
      {
        label: "Maximize",
        icon: "⬜",
        onClick: () => maximizeWindow(windowId),
        disabled: win.isMaximized,
      },
      { separator: true as const },
      {
        label: "Close",
        icon: "✕",
        onClick: () => {
          closeWindow(windowId);
          playSound("close");
        },
      },
    ];
  };

  return (
    <div
      onClick={handleDesktopClick}
      onContextMenu={handleDesktopContextMenu}
      style={{
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        position: "relative",
        backgroundImage: "url(/assets/bg.jpg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        cursor: "default",
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
          gap: "4px",
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
          />
        ))}
      </div>

      {/* Windows */}
      <AnimatePresence>
        {windows.map((window) => (
          <div
            key={window.id}
            onContextMenu={(e) => handleWindowContextMenu(e, window.id)}
          >
            <XPWindow
              id={window.id}
              title={window.title}
              x={window.x}
              y={window.y}
              width={window.width}
              height={window.height}
              isMaximized={window.isMaximized}
              isMinimized={window.isMinimized}
              isFocused={window.isFocused}
              zIndex={window.zIndex}
              onClose={() => {
                closeWindow(window.id);
                playSound("close");
              }}
              onMinimize={() => {
                minimizeWindow(window.id);
                playSound("minimize");
              }}
              onMaximize={() => maximizeWindow(window.id)}
              onFocus={() => focusWindow(window.id)}
              onDragEnd={(x, y) => updateWindowPosition(window.id, x, y)}
            >
              {renderWindowContent(window)}
            </XPWindow>
          </div>
        ))}
      </AnimatePresence>

      {/* Context Menu */}
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

      {/* Start Menu */}
      <StartMenu
        isOpen={startMenuOpen}
        onClose={() => setStartMenuOpen(false)}
      />

      {/* Taskbar */}
      <TaskBar
        windows={windows}
        onWindowClick={(id) => {
          focusWindow(id);
          playSound("click");
        }}
        onMinimize={(id) => {
          minimizeWindow(id);
          playSound("minimize");
        }}
        onRestore={(id) => {
          restoreWindow(id);
          playSound("open");
        }}
        onStartClick={() => setStartMenuOpen((prev) => !prev)}
        startMenuOpen={startMenuOpen}
      />
    </div>
  );
}
