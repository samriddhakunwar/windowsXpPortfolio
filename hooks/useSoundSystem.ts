"use client";

import { useCallback, useEffect, useRef } from "react";

type SoundType = "click" | "open" | "close" | "error" | "minimize";

const SOUND_PATHS: Record<SoundType, string> = {
  click: "/audio/click.wav",
  open: "/audio/open.wav",
  close: "/audio/close.wav",
  error: "/audio/error.wav",
  minimize: "/audio/minimize.wav",
};

function isEnabled(): boolean {
  try {
    const stored = localStorage.getItem("xp-settings");
    if (stored) {
      const settings = JSON.parse(stored);
      return settings.soundEnabled !== false;
    }
  } catch {}
  return true;
}

export function useSoundSystem() {
  const audioCache = useRef<Map<SoundType, HTMLAudioElement>>(new Map());

  const preload = useCallback((type: SoundType) => {
    if (audioCache.current.has(type)) return;
    if (typeof window === "undefined") return;
    const audio = new Audio(SOUND_PATHS[type]);
    audio.preload = "auto";
    audio.volume = 0.6;
    audioCache.current.set(type, audio);
  }, []);

  // Preload common sounds on mount
  useEffect(() => {
    (["click", "open", "close"] as SoundType[]).forEach(preload);
  }, [preload]);

  const playSound = useCallback((type: SoundType) => {
    if (!isEnabled()) return;
    if (typeof window === "undefined") return;

    try {
      let audio = audioCache.current.get(type);
      if (!audio) {
        audio = new Audio(SOUND_PATHS[type]);
        audio.volume = 0.6;
        audioCache.current.set(type, audio);
      }

      // Clone for overlapping sounds
      const clone = audio.cloneNode() as HTMLAudioElement;
      clone.volume = 0.6;
      clone.play().catch(() => {
        // Autoplay restrictions — safe to ignore
      });
    } catch {
      // Ignore audio errors
    }
  }, []);

  return { playSound };
}
