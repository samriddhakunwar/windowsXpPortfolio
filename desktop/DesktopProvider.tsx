"use client";

import { useWindowManager } from "@/hooks/useWindowManager";
import { WindowType } from "@/types";
import React, { createContext, useContext, useEffect } from "react";
import { AppRegistry } from "./core/AppRegistry";
import { WindowManager } from "./core/WindowManager";
import { DesktopContextType } from "./types";

const DesktopContext = createContext<DesktopContextType | null>(null);

export function DesktopProvider({ children }: { children: React.ReactNode }) {
  const windowManager = useWindowManager();

  useEffect(() => {
    AppRegistry.initialize();
    WindowManager.setInstance(windowManager);
  }, [windowManager]);

  const launchApp = (type: WindowType): string | null => {
    const app = AppRegistry.getApp(type);
    if (!app) {
      console.error(`App not found: ${type}`);
      return null;
    }

    // Check if app is already open (regardless of minimized state)
    const existingWindow = windowManager.windows.find((w) => w.type === type);

    if (existingWindow) {
      if (existingWindow.isMinimized) {
        windowManager.restoreWindow(existingWindow.id);
      } else {
        windowManager.focusWindow(existingWindow.id);
      }
      return existingWindow.id;
    }

    return windowManager.openWindow(
      type,
      app.title,
      app.defaultWidth,
      app.defaultHeight,
    );
  };

  const value: DesktopContextType = {
    windows: windowManager.windows,
    launchApp,
    focusWindow: windowManager.focusWindow,
    closeWindow: windowManager.closeWindow,
    minimizeWindow: windowManager.minimizeWindow,
    restoreWindow: windowManager.restoreWindow,
    maximizeWindow: windowManager.maximizeWindow,
    updateWindowPosition: windowManager.updateWindowPosition,
  };

  return (
    <DesktopContext.Provider value={value}>{children}</DesktopContext.Provider>
  );
}

export function useDesktop(): DesktopContextType {
  const context = useContext(DesktopContext);
  if (!context) {
    throw new Error("useDesktop must be used inside DesktopProvider");
  }
  return context;
}
