export type WindowType =
  | "about"
  | "projects"
  | "contact"
  | "resume"
  | "mycomputer"
  | "github"
  | "help"
  | "recycle"
  | "minesweeper";

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
