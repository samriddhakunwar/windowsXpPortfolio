"use client";

import { useEffect, useState } from "react";
import LoadingScreen from "./components/LoadingScreen";
import WindowsXPLogin from "./components/WindowsXPLogin";
// import Desktop from "@/components/Desktop";
// import Taskbar from "@/components/Taskbar";

export default function Home() {
  const [booted, setBooted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setBooted(true);
    }, 1000); // XP-style delay 😈

    return () => clearTimeout(timer);
  }, []);

  if (!booted) return <LoadingScreen />;

  return <WindowsXPLogin />;

}
