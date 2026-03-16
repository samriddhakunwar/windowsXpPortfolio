"use client";

import { useState, useEffect } from "react";
import LoadingScreen from "./components/LoadingScreen";
import WindowsXPLogin from "./components/WindowsXPLogin";
import WelcomePage from "./components/page";
import Desktop from "./components/Desktop";

export default function Home() {
  const [stage, setStage] = useState<
    "boot" | "login" | "welcome" | "desktop"
  >("boot");

  // Boot delay (3s)
  useEffect(() => {
    if (stage === "boot") {
      const timer = setTimeout(() => {
        setStage("login");
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [stage]);

  // Welcome delay (3s) → play sound → desktop
  useEffect(() => {
    if (stage === "welcome") {
      const timer = setTimeout(() => {
        // 🔊 Play XP sound
        const audio = new Audio("/audio/windows-xp-startup.mp3");
        audio.volume = 0.7;
        audio.play().catch(() => {
          console.log("Autoplay blocked");
        });

        setStage("desktop");
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [stage]);

  if (stage === "boot") return <LoadingScreen />;

  if (stage === "login")
    return <WindowsXPLogin onLogin={() => setStage("welcome")} />;

  if (stage === "welcome") return <WelcomePage />;

  return <Desktop />;
}
