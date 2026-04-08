import { Window, WindowType } from "@/types";
import { ReactNode } from "react";

export interface DesktopContextType {
  windows: Window[];
  launchApp: (type: WindowType) => string | null;
  focusWindow: (id: string) => void;
  closeWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  restoreWindow: (id: string) => void;
  maximizeWindow: (id: string) => void;
  updateWindowPosition: (id: string, x: number, y: number) => void;
}

export interface DesktopIconData {
  type: WindowType;
  label: string;
  icon: ReactNode;
}
