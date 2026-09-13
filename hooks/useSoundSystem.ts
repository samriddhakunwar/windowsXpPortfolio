"use client";

import { useCallback, useEffect, useRef, useSyncExternalStore } from "react";

type SoundType = "click" | "open" | "close" | "error" | "minimize";

const SOUND_PATHS: Record<SoundType, string> = {
  click: "/audio/click.wav",
  open: "/audio/open.wav",
  close: "/audio/close.wav",
  error: "/audio/error.wav",
  minimize: "/audio/minimize.wav",
};

const SETTINGS_KEY = "xp-settings";
const SETTINGS_CHANGE_EVENT = "xp-settings-change";
const BASE_VOLUME = 0.6;

interface XPSettings {
  soundEnabled?: boolean;
  volume?: number;
  muted?: boolean;
  [key: string]: unknown;
}

function readSettings(): XPSettings {
  try {
    const stored = localStorage.getItem(SETTINGS_KEY);
    if (stored) return JSON.parse(stored);
  } catch {}
  return {};
}

function writeSettings(patch: Partial<XPSettings>) {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify({ ...readSettings(), ...patch }));
    window.dispatchEvent(new Event(SETTINGS_CHANGE_EVENT));
  } catch {}
}

function isEnabled(): boolean {
  return readSettings().soundEnabled !== false;
}

/** Master volume, 0-100. Defaults to 100 so existing sound levels are unchanged. */
export function getVolume(): number {
  const v = readSettings().volume;
  return typeof v === "number" && v >= 0 && v <= 100 ? v : 100;
}

export function setVolume(volume: number) {
  writeSettings({ volume: Math.max(0, Math.min(100, Math.round(volume))) });
}

export function getMuted(): boolean {
  return readSettings().muted === true;
}

export function setMuted(muted: boolean) {
  writeSettings({ muted });
}

function subscribeToSettings(callback: () => void) {
  window.addEventListener(SETTINGS_CHANGE_EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(SETTINGS_CHANGE_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}

/** Reactive access to the master volume/mute state, shared with playSound below. */
export function useVolumeSettings() {
  const volume = useSyncExternalStore(subscribeToSettings, getVolume, () => 100);
  const muted = useSyncExternalStore(subscribeToSettings, getMuted, () => false);

  return { volume, muted, setVolume, setMuted };
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
    if (getMuted()) return;
    if (typeof window === "undefined") return;

    const effectiveVolume = BASE_VOLUME * (getVolume() / 100);
    if (effectiveVolume <= 0) return;

    try {
      let audio = audioCache.current.get(type);
      if (!audio) {
        audio = new Audio(SOUND_PATHS[type]);
        audio.volume = BASE_VOLUME;
        audioCache.current.set(type, audio);
      }

      // Clone for overlapping sounds
      const clone = audio.cloneNode() as HTMLAudioElement;
      clone.volume = effectiveVolume;
      clone.play().catch(() => {
        // Autoplay restrictions — safe to ignore
      });
    } catch {
      // Ignore audio errors
    }
  }, []);

  return { playSound };
}
