/**
 * Windows XP Shutdown / Restart Screen — Shared Theme Constants
 *
 * Single source of truth for the background styling used by both:
 *   - app/components/XPShutdownScreen.tsx   (full-screen shutdown overlay)
 *   - desktop/ui/components/ShutdownModal.tsx  (Turn off computer dialog)
 *
 * Values are copied verbatim from XPShutdownScreen.tsx so both components
 * are pixel-for-pixel identical in background appearance.
 */

export const XP_SHUTDOWN_THEME = {
  /**
   * Header bar — solid navy strip at the very top.
   * XPShutdownScreen: <div style={{ background: "#00309c" }} />
   */
  headerBar: "#00309c",

  /**
   * Header stripe — 2 px iridescent divider below the header bar.
   * XPShutdownScreen: linear-gradient(45deg, #466dcd, #c7ddff, #b0c9f7, #5a7edc)
   */
  headerStripe: "linear-gradient(45deg, #466dcd, #c7ddff, #b0c9f7, #5a7edc)",

  /**
   * Center / body background — XP Luna Blue radial highlight.
   * XPShutdownScreen: radial-gradient(circle at 5% 5%, #91b1ef 0, #7698e6 6%, #5a7edc 12%)
   */
  body: "radial-gradient(circle at 5% 5%, #91b1ef 0, #7698e6 6%, #5a7edc 12%)",

  /**
   * Footer stripe — 2 px iridescent divider above the footer bar.
   * XPShutdownScreen: linear-gradient(45deg, #003399, #f99736, #c2814d, #00309c)
   */
  footerStripe: "linear-gradient(45deg, #003399, #f99736, #c2814d, #00309c)",

  /**
   * Footer bar — solid deep purple-navy strip at the very bottom.
   * XPShutdownScreen: linear-gradient(90deg, #3833ac, #00309c)
   */
  footerBar: "linear-gradient(90deg, #3833ac, #00309c)",
} as const;
