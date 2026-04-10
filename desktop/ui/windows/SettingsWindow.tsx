"use client";

import React, { useEffect, useState } from "react";

type SettingKey = "soundEnabled" | "animationsEnabled";

const WALLPAPERS = [
  { id: "default", label: "Bliss (Default)", value: "/assets/bg.jpg", preview: "linear-gradient(135deg, #4CAF50 30%, #64B5F6 100%)" },
  { id: "night",   label: "Night Sky",       value: "/assets/bg.jpg", preview: "linear-gradient(135deg, #0d1b2a 0%, #1b2838 50%, #162032 100%)" },
  { id: "sunset",  label: "Sunset",          value: "/assets/bg.jpg", preview: "linear-gradient(135deg, #FF6B6B 0%, #FFA07A 40%, #FFD700 100%)" },
  { id: "ocean",   label: "Deep Ocean",      value: "/assets/bg.jpg", preview: "linear-gradient(135deg, #006994 0%, #1B6CA8 50%, #00BFFF 100%)" },
];

interface ToggleSettings {
  soundEnabled: boolean;
  animationsEnabled: boolean;
  wallpaper: string;
  wallpaperId: string;
}

const DEFAULT_SETTINGS: ToggleSettings = {
  soundEnabled: true,
  animationsEnabled: true,
  wallpaper: "/assets/bg.jpg",
  wallpaperId: "default",
};

export const SettingsWindow: React.FC = () => {
  const [settings, setSettings] = useState<ToggleSettings>(DEFAULT_SETTINGS);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("xp-settings");
      if (stored) setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(stored) });
    } catch {}
  }, []);

  const toggle = (key: SettingKey) => {
    const next = { ...settings, [key]: !settings[key] };
    setSettings(next);
    localStorage.setItem("xp-settings", JSON.stringify(next));
    flashSaved();
  };

  const setWallpaper = (id: string, value: string) => {
    const next = { ...settings, wallpaper: value, wallpaperId: id };
    setSettings(next);
    localStorage.setItem("xp-settings", JSON.stringify(next));
    flashSaved();
  };

  const flashSaved = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  const toggleCategories = [
    {
      id: "sounds",
      icon: "🔊",
      title: "Sounds",
      description: "Enable or disable Windows XP sound effects",
      settingKey: "soundEnabled" as SettingKey,
      label: "Play sounds",
    },
    {
      id: "animations",
      icon: "🎞",
      title: "Animations",
      description: "Enable or disable window and UI animations",
      settingKey: "animationsEnabled" as SettingKey,
      label: "Animate windows",
    },
  ];

  return (
    <div style={{ fontFamily: "Tahoma, Arial, sans-serif", fontSize: "11px" }}>
      {/* Header */}
      <div
        className="xp-panel"
        style={{
          marginBottom: "8px",
          display: "flex",
          alignItems: "center",
          gap: "10px",
          background: "linear-gradient(180deg, #FFFFFF 0%, #E8F0FF 100%)",
        }}
      >
        <span style={{ fontSize: "28px" }}>⚙</span>
        <div>
          <div style={{ fontWeight: "bold", fontSize: "13px" }}>Control Panel</div>
          <div style={{ color: "#666" }}>Customize your Windows XP Portfolio experience</div>
        </div>
      </div>

      {/* Toggle settings */}
      <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginBottom: "8px" }}>
        {toggleCategories.map((cat) => (
          <div key={cat.id} className="xp-panel" style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div
              style={{
                width: "40px", height: "40px",
                background: "linear-gradient(135deg, #E8F0FF, #C8D8F0)",
                border: "1px solid #ACA899", borderRadius: "4px",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "20px", flexShrink: 0,
              }}
            >
              {cat.icon}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: "bold", marginBottom: "2px" }}>{cat.title}</div>
              <div style={{ color: "#666", fontSize: "10px" }}>{cat.description}</div>
            </div>
            <label style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={settings[cat.settingKey]}
                onChange={() => toggle(cat.settingKey)}
                style={{ cursor: "pointer", width: "13px", height: "13px" }}
              />
              <span>{cat.label}</span>
            </label>
          </div>
        ))}
      </div>

      {/* Wallpaper selector */}
      <div className="xp-panel" style={{ marginBottom: "8px" }}>
        <div style={{ fontWeight: "bold", marginBottom: "8px", fontSize: "12px" }}>🖼 Desktop Background</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px" }}>
          {WALLPAPERS.map((wp) => {
            const isActive = settings.wallpaperId === wp.id;
            return (
              <button
                key={wp.id}
                onClick={() => setWallpaper(wp.id, wp.value)}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "4px",
                  padding: "6px",
                  border: isActive ? "2px solid #316AC5" : "2px solid #ACA899",
                  background: isActive ? "#EEF4FF" : "#ECE9D8",
                  borderRadius: "3px",
                  cursor: "pointer",
                  transition: "all 120ms ease",
                }}
              >
                <div
                  style={{
                    width: "100%",
                    height: "40px",
                    background: wp.preview,
                    borderRadius: "2px",
                    border: "1px solid rgba(0,0,0,0.1)",
                  }}
                />
                <span style={{ fontSize: "10px", fontWeight: isActive ? "bold" : "normal", color: isActive ? "#316AC5" : "#333" }}>
                  {wp.label}
                </span>
                {isActive && <span style={{ fontSize: "9px", color: "#316AC5" }}>✓ Active</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* Status */}
      {saved && (
        <div
          className="xp-panel"
          style={{
            marginBottom: "6px",
            color: "#0A6A00",
            fontWeight: "bold",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            background: "#E8FFE8",
          }}
        >
          ✓ Settings saved automatically
        </div>
      )}

      {/* Info panel */}
      <div className="xp-panel" style={{ background: "#EEF4FF" }}>
        <div style={{ fontWeight: "bold", marginBottom: "4px" }}>💡 About This Portfolio</div>
        <div style={{ color: "#555", lineHeight: "1.6" }}>
          Built by <strong>Samriddha Kunwar</strong> using Next.js 16, React 19, TypeScript, and Framer Motion.
          Inspired by the classic Windows XP experience, blended with modern web design.
        </div>
      </div>
    </div>
  );
};
