"use client";

import DesktopPanel from "@/desktop/ui/DesktopPanel";
import { ShutdownAction, ShutdownModal } from "@/desktop/ui/components/ShutdownModal";
import { useCallback, useEffect, useState } from "react";
import LoadingScreen from "./components/LoadingScreen";
import WindowsXPLogin from "./components/WindowsXPLogin";
import XPShutdownScreen from "./components/XPShutdownScreen";
import WelcomePage from "./components/page";

type Stage = "boot" | "login" | "welcome" | "desktop";

type ShutdownScreen =
  | { kind: "turnoff" }
  | { kind: "restart" }
  | { kind: "standby" };

export default function Home() {
  const [stage, setStage] = useState<Stage>("boot");
  const [shutdownModalOpen, setShutdownModalOpen] = useState(false);
  const [shutdownScreen, setShutdownScreen] = useState<ShutdownScreen | null>(null);
  const [screenVisible, setScreenVisible] = useState(false);   // fade-in trigger
  const [standbyDimmed, setStandbyDimmed] = useState(false);  // standby extra dim pulse
  const [logoffActive, setLogoffActive] = useState(false);     // logoff screen active
  const [logoffVisible, setLogoffVisible] = useState(false);   // logoff fade-in trigger

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

  // ── Log Off handler ──────────────────────────────────────────────────────
  const handleLogOffRequest = useCallback(() => {
    // Play the authentic Windows XP Log Off sound immediately
    const logoffAudio = new Audio("/audio/windows-xp-logoff.wav");
    logoffAudio.volume = 0.7;
    logoffAudio.play().catch(() => {});

    // 1. Immediately unmount the desktop (logoffActive gates DesktopPanel below)
    setLogoffActive(true);
    // 2. Tiny paint delay so the element is in the DOM before opacity transitions
    const fadeIn = setTimeout(() => setLogoffVisible(true), 30);
    // 3. After 2.8 s jump straight to login — no fade-out so desktop never bleeds through
    const navigate = setTimeout(() => {
      // Switch stage AND clear logoff state atomically (React 18 batches these)
      setLogoffActive(false);
      setLogoffVisible(false);
      setStage("login");
    }, 2800);
    return () => { clearTimeout(fadeIn); clearTimeout(navigate); };
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
      {/* ── Authentic XP shutdown screen (turnoff / restart) ─────────── */}
      {(shutdownScreen?.kind === "turnoff" || shutdownScreen?.kind === "restart") && (
        <XPShutdownScreen
          visible={screenVisible}
          mode={shutdownScreen.kind}
        />
      )}

      {/* ── Log Off screen ─────────────────────────────────────────────── */}
      {logoffActive && (
        <XPShutdownScreen
          visible={logoffVisible}
          mode="logoff"
        />
      )}

      {/* ── Standby fullscreen black overlay ─────────────────────────── */}
      {shutdownScreen?.kind === "standby" && (
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
          }}
        >
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
        </div>
      )}

      {stage === "boot" && <LoadingScreen />}
      {/* Page-level ShutdownModal — shared by login screen and desktop */}
      <ShutdownModal
        isOpen={shutdownModalOpen}
        onClose={() => setShutdownModalOpen(false)}
        onAction={(action) => {
          setShutdownModalOpen(false);
          handleShutdownAction(action);
        }}
      />

      {stage === "login" && (
        <WindowsXPLogin
          onLogin={() => setStage("welcome")}
          onShutdownRequest={() => setShutdownModalOpen(true)}
        />
      )}
      {stage === "welcome" && <WelcomePage />}
      {/* Desktop is unmounted the instant logoffActive becomes true */}
      {stage === "desktop" && !logoffActive && (
        <DesktopPanel
          onShutdownAction={handleShutdownAction}
          onLogOffRequest={handleLogOffRequest}
        />
      )}
    </>
  );
}



