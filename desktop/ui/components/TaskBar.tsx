"use client";

import { AppRegistry } from "@/desktop/core/AppRegistry";
import { Window } from "@/types";
import Image from "next/image";
import React, { useEffect, useState } from "react";

interface TaskbarProps {
  windows: Window[];
  onWindowClick: (id: string) => void;
  onMinimize: (id: string) => void;
  onRestore: (id: string) => void;
  onStartClick: () => void;
  startMenuOpen: boolean;
}

export const TaskBar: React.FC<TaskbarProps> = ({
  windows,
  onWindowClick,
  onMinimize,
  onRestore,
  onStartClick,
  startMenuOpen,
}) => {
  const [time, setTime] = useState<string>("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = String(now.getMinutes()).padStart(2, "0");
      const ampm = hours >= 12 ? "PM" : "AM";
      hours = hours % 12 || 12;
      setTime(`${hours}:${minutes} ${ampm}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleTaskbarButtonClick = (win: Window) => {
    if (win.isMinimized) {
      onRestore(win.id);
    } else if (win.isFocused) {
      onMinimize(win.id);
    } else {
      onWindowClick(win.id);
    }
  };

  return (
    <div
      className="fixed bottom-0 left-0 right-0 flex items-center"
      style={{
        height: "40px",
        background:
          "linear-gradient(180deg, #1F5FC7 0%, #1252B9 3%, #1252B9 4%, #1958BE 5%, #3478D8 20%, #3478D8 30%, #2D6FD2 40%, #2563C8 55%, #1C57BE 70%, #1C57BE 85%, #1650B5 92%, #1650B5 100%)",
        borderTop: "1px solid #0C3F9C",
        zIndex: 9999,
      }}
    >
      {/* Start Button */}
      <button
        data-start-button
        onClick={onStartClick}
        className="flex items-center gap-1 h-full px-3 text-white text-sm font-bold select-none"
        style={{
          background: startMenuOpen
            ? "linear-gradient(180deg, #1A7E18 0%, #2D9F27 15%, #32A62B 30%, #3DB934 50%, #2DA226 70%, #238F1A 85%, #1A7E18 100%)"
            : "linear-gradient(180deg, #1F8C1A 0%, #3BA435 15%, #40AC39 30%, #4FC247 50%, #3BA235 70%, #2D9527 85%, #1F8C1A 100%)",
          borderRadius: "0 8px 8px 0",
          border: "none",
          paddingLeft: "8px",
          paddingRight: "12px",
          minWidth: "100px",
          textShadow: "1px 1px 1px rgba(0,0,0,0.5)",
          letterSpacing: "0.3px",
        }}
      >
        <Image
          src="/img/logo-small.png"
          alt="Windows"
          width={20}
          height={20}
          draggable={false}
        />
        <span style={{ fontSize: "13px" }}>start</span>
      </button>

      {/* Quick Launch Separator */}
      <div
        style={{
          width: "2px",
          height: "24px",
          background:
            "linear-gradient(180deg, transparent, #0842A2 30%, #0842A2 70%, transparent)",
          margin: "0 4px",
        }}
      />

      {/* Window Buttons */}
      <div className="flex-1 flex gap-[3px] overflow-x-auto items-center px-1">
        {windows.map((win) => {
          const app = AppRegistry.getApp(win.type);
          return (
            <button
              key={win.id}
              onClick={() => handleTaskbarButtonClick(win)}
              className="text-white text-xs font-normal truncate select-none flex items-center gap-[5px]"
              style={{
                background: win.isFocused
                  ? "linear-gradient(180deg, #1C5FC0 0%, #306FCA 20%, #2462C0 40%, #1C58B8 60%, #1C58B8 80%, #1550B0 100%)"
                  : "linear-gradient(180deg, #3E87E0 0%, #4E98EC 20%, #4890E5 40%, #428ADF 60%, #3C82D8 80%, #3479D0 100%)",
                border: win.isFocused
                  ? "1px solid #0B3E8F"
                  : "1px solid #1B60BB",
                borderRadius: "3px",
                height: "26px",
                padding: "0 8px",
                minWidth: "120px",
                maxWidth: "200px",
                textShadow: "1px 1px 0px rgba(0,0,0,0.3)",
                boxShadow: win.isFocused
                  ? "inset 0 1px 1px rgba(0,0,0,0.2)"
                  : "none",
              }}
            >
              {app && (
                <span
                  style={{
                    width: 16,
                    height: 16,
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  {app.icon}
                </span>
              )}
              <span className="truncate">{win.title}</span>
            </button>
          );
        })}
      </div>

      {/* System Tray */}
      <div
        className="flex items-center gap-2 h-full px-3"
        style={{
          background:
            "linear-gradient(180deg, #0D8DE5 0%, #1791E7 20%, #1791E7 40%, #0D81D5 60%, #0D81D5 80%, #0D77C8 100%)",
          borderLeft: "2px solid #0966B5",
        }}
      >
        <Image
          src="/assets/sound.png"
          alt="Volume"
          width={16}
          height={16}
          draggable={false}
        />
        <Image
          src="/assets/internet.png"
          alt="Volume"
          width={16}
          height={16}
          draggable={false}
        />
        <Image
          src="/assets/green_shield.png"
          alt="Volume"
          width={16}
          height={16}
          draggable={false}
        />
        <div
          className="text-white font-normal"
          style={{ fontSize: "11px", textShadow: "1px 1px 0 rgba(0,0,0,0.3)" }}
        >
          {time}
        </div>
      </div>
    </div>
  );
};
