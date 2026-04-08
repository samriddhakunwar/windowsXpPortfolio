"use client";

import React, { useEffect, useState } from "react";

type SettingKey = "soundEnabled" | "animationsEnabled";

interface ToggleSettings {
  soundEnabled: boolean;
  animationsEnabled: boolean;
}

const DEFAULT_SETTINGS: ToggleSettings = {
  soundEnabled: true,
  animationsEnabled: true,
};

export const SettingsWindow: React.FC = () => {
  const [settings, setSettings] = useState<ToggleSettings>(DEFAULT_SETTINGS);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("xp-settings");
      if (stored) setSettings(JSON.parse(stored));
    } catch {}
  }, []);

  const toggle = (key: SettingKey) => {
    const next = { ...settings, [key]: !settings[key] };
    setSettings(next);
    localStorage.setItem("xp-settings", JSON.stringify(next));
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  const categories = [
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

      {/* Settings categories */}
      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        {categories.map((cat) => (
          <div key={cat.id} className="xp-panel" style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div
              style={{
                width: "40px",
                height: "40px",
                background: "linear-gradient(135deg, #E8F0FF, #C8D8F0)",
                border: "1px solid #ACA899",
                borderRadius: "4px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "20px",
                flexShrink: 0,
              }}
            >
              {cat.icon}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: "bold", marginBottom: "2px" }}>{cat.title}</div>
              <div style={{ color: "#666", fontSize: "10px" }}>{cat.description}</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
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
          </div>
        ))}
      </div>

      {/* Status */}
      {saved && (
        <div
          className="xp-panel"
          style={{
            marginTop: "8px",
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
      <div className="xp-panel" style={{ marginTop: "8px", background: "#EEF4FF" }}>
        <div style={{ fontWeight: "bold", marginBottom: "4px" }}>💡 About This Portfolio</div>
        <div style={{ color: "#555", lineHeight: "1.6" }}>
          Built by <strong>Samriddha Kunwar</strong> using Next.js 16, React 19, TypeScript, and Framer Motion.
          Inspired by the classic Windows XP experience, blended with modern web design.
        </div>
      </div>
    </div>
  );
};
