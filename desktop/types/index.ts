import { Window, WindowType } from "@/types";

export interface DesktopContextType {
  windows: Window[];
  launchApp: (type: WindowType) => string | null;
  focusWindow: (id: string) => void;
  closeWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  restoreWindow: (id: string) => void;
  maximizeWindow: (id: string) => void;
  updateWindowPosition: (id: string, x: number, y: number) => void;
  resizeWindow: (id: string, w: number, h: number, x: number, y: number) => void;
  minimizeAll: () => void;
  closeAllWindows: () => void;
}
