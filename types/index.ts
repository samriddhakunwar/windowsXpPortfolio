export type WindowType =
  | "about"
  | "projects"
  | "skills"
  | "contact"
  | "resume"
  | "mycomputer"
  | "github"
  | "settings"
  | "help"
  | "recycle";

export interface Window {
  id: string;
  type: WindowType;
  title: string;
  isMinimized: boolean;
  isMaximized: boolean;
  isFocused: boolean;
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
  // Used to restore position after un-maximizing
  _restoreX?: number;
  _restoreY?: number;
  _restoreW?: number;
  _restoreH?: number;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  github?: string;
  liveDemo?: string;
  image?: string;
}

export interface Skill {
  category: string;
  items: {
    name: string;
    proficiency: number;
  }[];
}

export interface DesktopIcon {
  type: WindowType;
  label: string;
  icon: string;
}
