"use client";

import DesktopPanel from "@/desktop/ui/DesktopPanel";
import { useCallback, useEffect, useState } from "react";
import LoadingScreen from "./components/LoadingScreen";
import WindowsXPLogin from "./components/WindowsXPLogin";
import WelcomePage from "./components/page";

type Stage = "boot" | "login" | "welcome" | "desktop";

export default function Home() {
  const [stage, setStage] = useState<Stage>("boot");
  const [isShuttingDown, setIsShuttingDown] = useState(false);

  // ── Initial boot delay (3s) ──────────────────────────────────────────────
  useEffect(() => {
    if (stage === "boot") {
      const timer = setTimeout(() => setStage("login"), 3000);
      return () => clearTimeout(timer);
    }
  }, [stage]);

  // ── Welcome → play XP startup sound → desktop ───────────────────────────
  useEffect(() => {
    if (stage === "welcome") {
      const timer = setTimeout(() => {
        const audio = new Audio("/audio/windows-xp-startup.mp3");
        audio.volume = 0.7;
        audio.play().catch(() => {});
        setStage("desktop");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [stage]);

  // ── Shutdown handler ─────────────────────────────────────────────────────
  const handleShutdown = useCallback(() => {
    // Trigger fade-to-black overlay
    setIsShuttingDown(true);

    // Play XP shutdown sound (user-triggered click → no autoplay block)
    const audio = new Audio(
      "/audio/delon_boomkin-microsoft-windows-xp-shutdown-sound-effect-443256.mp3"
    );
    audio.volume = 0.75;
    audio.play().catch(() => {});

    // After 5s reload → original boot sequence replays exactly
    setTimeout(() => {
      window.location.reload();
    }, 5000);
  }, []);

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <>
      {/* Fullscreen fade-to-black shutdown overlay */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          background: "#000000",
          opacity: isShuttingDown ? 1 : 0,
          pointerEvents: isShuttingDown ? "all" : "none",
          transition: "opacity 5s ease",
          zIndex: 999999,
        }}
      />

      {stage === "boot" && <LoadingScreen />}
      {stage === "login" && (
        <WindowsXPLogin onLogin={() => setStage("welcome")} />
      )}
      {stage === "welcome" && <WelcomePage />}
      {stage === "desktop" && <DesktopPanel onShutdown={handleShutdown} />}
    </>
  );
}
