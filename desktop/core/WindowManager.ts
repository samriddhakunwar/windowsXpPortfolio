import { Window, WindowType } from "@/types";
import { AppRegistry } from "./AppRegistry";
import { DESKTOP_EVENTS, EventBus } from "./EventBus";

export interface UseWindowManagerType {
  windows: Window[];
  openWindow: (type: WindowType, title: string, width?: number, height?: number) => string;
  closeWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  restoreWindow: (id: string) => void;
  maximizeWindow: (id: string) => void;
  focusWindow: (id: string) => void;
  updateWindowPosition: (id: string, x: number, y: number) => void;
}

export class WindowManager {
  private static instance: UseWindowManagerType | null = null;

  static setInstance(instance: UseWindowManagerType) {
    this.instance = instance;
  }

  static getInstance(): UseWindowManagerType | null {
    return this.instance;
  }

  static launchApp(type: WindowType) {
    if (!this.instance) {
      console.error("WindowManager not initialized");
      return null;
    }

    const app = AppRegistry.getApp(type);
    if (!app) {
      console.error(`App not found in registry: ${type}`);
      return null;
    }

    const windowId = this.instance.openWindow(type, app.title, app.defaultWidth, app.defaultHeight);
    EventBus.emit(DESKTOP_EVENTS.APP_LAUNCHED, {
      type,
      windowId,
      title: app.title,
    });
    return windowId;
  }

  static close(windowId: string) {
    if (!this.instance) return;
    this.instance.closeWindow(windowId);
    EventBus.emit(DESKTOP_EVENTS.APP_CLOSED, { windowId });
  }

  static minimize(windowId: string) {
    if (!this.instance) return;
    this.instance.minimizeWindow(windowId);
    EventBus.emit(DESKTOP_EVENTS.WINDOW_MINIMIZED, { windowId });
  }

  static restore(windowId: string) {
    if (!this.instance) return;
    this.instance.restoreWindow(windowId);
  }

  static maximize(windowId: string) {
    if (!this.instance) return;
    this.instance.maximizeWindow(windowId);
    EventBus.emit(DESKTOP_EVENTS.WINDOW_MAXIMIZED, { windowId });
  }

  static focus(windowId: string) {
    if (!this.instance) return;
    this.instance.focusWindow(windowId);
    EventBus.emit(DESKTOP_EVENTS.WINDOW_FOCUSED, { windowId });
  }

  static updatePosition(windowId: string, x: number, y: number) {
    if (!this.instance) return;
    this.instance.updateWindowPosition(windowId, x, y);
  }

  static getWindows(): Window[] {
    return this.instance?.windows ?? [];
  }

  static getWindowById(id: string): Window | undefined {
    return this.getWindows().find((w) => w.id === id);
  }
}
