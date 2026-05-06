"use client";

import DesktopPanel from "@/desktop/ui/DesktopPanel";
import { ShutdownAction } from "@/desktop/ui/components/ShutdownModal";
import { useCallback, useEffect, useState } from "react";
import LoadingScreen from "./components/LoadingScreen";
import WindowsXPLogin from "./components/WindowsXPLogin";
import WelcomePage from "./components/page";

type Stage = "boot" | "login" | "welcome" | "desktop";

type ShutdownScreen =
  | { kind: "turnoff" }
  | { kind: "restart" }
  | { kind: "standby" };

export default function Home() {
  const [stage, setStage] = useState<Stage>("boot");
  const [shutdownScreen, setShutdownScreen] = useState<ShutdownScreen | null>(null);
  const [screenVisible, setScreenVisible] = useState(false);   // fade-in trigger
  const [standbyDimmed, setStandbyDimmed] = useState(false);  // standby extra dim pulse

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

  // ── Animate shutdown screen in after it's mounted ───────────────────────
  useEffect(() => {
    if (shutdownScreen) {
      // tiny delay so React paints the element before the transition starts
      const t = setTimeout(() => setScreenVisible(true), 30);
      return () => clearTimeout(t);
    } else {
      setScreenVisible(false);
    }
  }, [shutdownScreen]);

  // ── Stand-by pulsing dim ─────────────────────────────────────────────────
  useEffect(() => {
    if (shutdownScreen?.kind !== "standby") {
      setStandbyDimmed(false);
      return;
    }
    const interval = setInterval(() => {
      setStandbyDimmed((prev) => !prev);
    }, 2200);
    return () => clearInterval(interval);
  }, [shutdownScreen]);

  // ── Standby: exit on click or keypress ──────────────────────────────────
  useEffect(() => {
    if (shutdownScreen?.kind !== "standby") return;
    const exit = () => {
      setScreenVisible(false);
      setTimeout(() => setShutdownScreen(null), 400);
    };
    document.addEventListener("click", exit);
    document.addEventListener("keydown", exit);
    return () => {
      document.removeEventListener("click", exit);
      document.removeEventListener("keydown", exit);
    };
  }, [shutdownScreen]);

  // ── Shutdown action handler ──────────────────────────────────────────────
  const handleShutdownAction = useCallback((action: ShutdownAction) => {
    if (action === "standby") {
      setShutdownScreen({ kind: "standby" });
      return;
    }

    // Play XP shutdown sound
    const audio = new Audio(
      "/audio/delon_boomkin-microsoft-windows-xp-shutdown-sound-effect-443256.mp3"
    );
    audio.volume = 0.75;
    audio.play().catch(() => {});

    setShutdownScreen({ kind: action });

    if (action === "restart") {
      // Fade to black → show "Restarting..." → reload after 2s more
      setTimeout(() => {
        window.location.reload();
      }, 4500);
    }
    // "turnoff" just stays faded to black — no reload
  }, []);

  // ── Overlay colours / content by screen kind ────────────────────────────
  const overlayBg =
    shutdownScreen?.kind === "standby"
      ? `rgba(0,0,0,${standbyDimmed ? 0.97 : 0.88})`
      : "#000000";

  const overlayOpacity =
    shutdownScreen === null ? 0 : screenVisible ? 1 : 0;

  const overlayPointerEvents = shutdownScreen !== null ? "all" : "none";

  const overlayTransition =
    shutdownScreen?.kind === "standby"
      ? "opacity 0.35s ease, background 2s ease"
      : "opacity 1.2s ease";

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <>
      {/* ── Fullscreen shutdown/standby overlay ─────────────────────── */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          background: overlayBg,
          opacity: overlayOpacity,
          pointerEvents: overlayPointerEvents as React.CSSProperties["pointerEvents"],
          transition: overlayTransition,
          zIndex: 999997,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "16px",
        }}
      >
        {/* Shutting down / Restarting text */}
        {(shutdownScreen?.kind === "turnoff" || shutdownScreen?.kind === "restart") && (
          <div
            style={{
              opacity: screenVisible ? 1 : 0,
              transform: screenVisible ? "translateY(0)" : "translateY(8px)",
              transition: "opacity 0.6s ease 0.8s, transform 0.6s ease 0.8s",
              textAlign: "center",
            }}
          >
            <p
              style={{
                color: "#ffffff",
                fontSize: "20px",
                fontFamily: "Tahoma, Arial, sans-serif",
                fontWeight: "normal",
                letterSpacing: "0.5px",
                margin: 0,
              }}
            >
              {shutdownScreen.kind === "restart" ? "Restarting..." : "Shutting down..."}
            </p>
            {/* Loading dots */}
            <LoadingDots />
          </div>
        )}

        {/* Stand By hint */}
        {shutdownScreen?.kind === "standby" && (
          <p
            style={{
              color: "rgba(255,255,255,0.25)",
              fontSize: "11px",
              fontFamily: "Tahoma, Arial, sans-serif",
              margin: 0,
              userSelect: "none",
              opacity: standbyDimmed ? 0.15 : 0.4,
              transition: "opacity 2s ease",
            }}
          >
            Press any key or click to wake
          </p>
        )}
      </div>

      {stage === "boot" && <LoadingScreen />}
      {stage === "login" && (
        <WindowsXPLogin onLogin={() => setStage("welcome")} />
      )}
      {stage === "welcome" && <WelcomePage />}
      {stage === "desktop" && (
        <DesktopPanel onShutdownAction={handleShutdownAction} />
      )}
    </>
  );
}

// ── Animated loading dots ────────────────────────────────────────────────────
function LoadingDots() {
  const [dots, setDots] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setDots((d) => (d + 1) % 4);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <p
      style={{
        color: "rgba(255,255,255,0.7)",
        fontSize: "14px",
        fontFamily: "Tahoma, Arial, sans-serif",
        marginTop: "8px",
        letterSpacing: "4px",
        minHeight: "20px",
      }}
    >
      {"•".repeat(dots)}
    </p>
  );
}
