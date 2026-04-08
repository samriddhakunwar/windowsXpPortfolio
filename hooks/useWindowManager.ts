"use client";

import { Window, WindowType } from "@/types";
import { useCallback, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";

export const useWindowManager = () => {
  const [windows, setWindows] = useState<Window[]>([]);
  const nextZIndexRef = useRef(100);

  const openWindow = useCallback(
    (type: WindowType, title: string, width = 600, height = 400) => {
      const id = uuidv4();
      const offsetX = 40 + (nextZIndexRef.current % 10) * 26;
      const offsetY = 40 + (nextZIndexRef.current % 10) * 26;

      const newWindow: Window = {
        id,
        type,
        title,
        isMinimized: false,
        isMaximized: false,
        isFocused: true,
        x: offsetX,
        y: offsetY,
        width,
        height,
        zIndex: nextZIndexRef.current++,
      };

      setWindows((prev) => [
        ...prev.map((w) => ({ ...w, isFocused: false })),
        newWindow,
      ]);
      return id;
    },
    [],
  );

  const closeWindow = useCallback((id: string) => {
    setWindows((prev) => prev.filter((w) => w.id !== id));
  }, []);

  const minimizeWindow = useCallback((id: string) => {
    setWindows((prev) =>
      prev.map((w) =>
        w.id === id ? { ...w, isMinimized: true, isFocused: false } : w,
      ),
    );
  }, []);

  const restoreWindow = useCallback((id: string) => {
    const z = nextZIndexRef.current++;
    setWindows((prev) =>
      prev.map((w) =>
        w.id === id
          ? { ...w, isMinimized: false, isFocused: true, zIndex: z }
          : { ...w, isFocused: false },
      ),
    );
  }, []);

  const maximizeWindow = useCallback((id: string) => {
    setWindows((prev) =>
      prev.map((w) => {
        if (w.id !== id) return w;
        if (w.isMaximized) {
          // Restore from maximized
          return {
            ...w,
            isMaximized: false,
            x: w._restoreX ?? 100,
            y: w._restoreY ?? 100,
            width: w._restoreW ?? 600,
            height: w._restoreH ?? 400,
          };
        }
        // Maximize — save current position for restore
        return {
          ...w,
          isMaximized: true,
          _restoreX: w.x,
          _restoreY: w.y,
          _restoreW: w.width,
          _restoreH: w.height,
          x: 0,
          y: 0,
          width: window.innerWidth,
          height: window.innerHeight - 40,
        };
      }),
    );
  }, []);

  const focusWindow = useCallback((id: string) => {
    const z = nextZIndexRef.current++;
    setWindows((prev) =>
      prev.map((w) =>
        w.id === id
          ? { ...w, isFocused: true, zIndex: z, isMinimized: false }
          : { ...w, isFocused: false },
      ),
    );
  }, []);

  const updateWindowPosition = useCallback(
    (id: string, x: number, y: number) => {
      setWindows((prev) =>
        prev.map((w) => (w.id === id ? { ...w, x, y } : w)),
      );
    },
    [],
  );

  return {
    windows,
    openWindow,
    closeWindow,
    minimizeWindow,
    restoreWindow,
    maximizeWindow,
    focusWindow,
    updateWindowPosition,
  };
};
