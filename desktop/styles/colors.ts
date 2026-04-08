/**
 * Windows XP Desktop Color Palette
 * Standard XP colors for consistent theming
 */

export const XP_COLORS = {
  // Primary UI Colors
  primary: {
    darkBlue: "#000080", // Title bar blue
    mediumBlue: "#0a5f99", // Desktop background
    lightBlue: "#1084d7", // Accent blue
    darkAccent: "#0a246a", // Dark selection
  },

  // Window/Surface Colors
  surface: {
    light: "#efefef", // Main window background
    lightest: "#dfdfdf", // Button/panel background
    highlight: "#ffffff", // Border highlight (light bevel)
    shadow: "#808080", // Border shadow (dark bevel)
    darkShadow: "#404040", // Additional shadow depth
    trayBackground: "#0a5f99", // Taskbar background
  },

  // Text Colors
  text: {
    dark: "#000000",
    light: "#ffffff",
    disabled: "#808080",
  },

  // Window Title Bar
  titleBar: {
    from: "#000080",
    to: "#1084d7",
    textColor: "#ffffff",
  },

  // Button States
  button: {
    background: "#dfdfdf",
    hoverFrom: "#efefef",
    hoverTo: "#a0a0a0",
    activeFrom: "#808080",
    activeTo: "#dfdfdf",
  },

  // Scrollbar
  scrollbar: {
    track: "#c0c0c0",
    thumb: "#dfdfdf",
    thumbBorder: "#ffffff",
    thumbShadow: "#808080",
  },

  // Special Effects
  focus: "#0a246a", // Selection highlight
  hover: "#c0c0c0", // Hover state
  disabled: "#c0c0c0", // Disabled state
  error: "#ff0000", // Error/danger
  warning: "#ffff00", // Warning
  success: "#00aa00", // Success
} as const;

/**
 * Tailwind compatible color utilities
 * Use these in className strings with arbitrary values
 */
export const XP_COLOR_MAP = {
  "xp-primary-dark": "from-[#000080] to-[#1084d7]",
  "xp-surface-light": "bg-[#efefef]",
  "xp-surface-light-text": "text-black",
  "xp-button":
    "bg-[#dfdfdf] border border-[#ffffff] border-r-[#808080] border-b-[#808080]",
  "xp-window":
    "bg-gradient-to-b from-[#000080] to-[#1084d7] border-2 border-t-[#dfdfdf] border-l-[#dfdfdf] border-b-[#808080] border-r-[#808080]",
} as const;
