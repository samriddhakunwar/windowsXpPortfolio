"use client";

import { useRecycleBin } from "@/desktop/context/RecycleBinContext";
import Image from "next/image";
import React from "react";

/**
 * Renders the correct Recycle Bin icon based on the shared RecycleBinContext.
 * - Full  → /assets/Recycle_bin_full.webp  (when files exist)
 * - Empty → /assets/recycling_bin.png       (when bin is empty)
 *
 * Because this is a real React component, it re-renders automatically whenever
 * the context state changes — no page refresh needed.
 */
export const RecycleBinDynamicIcon: React.FC = () => {
  const { isEmpty } = useRecycleBin();

  return (
    <Image
      src={isEmpty ? "/assets/recycling_bin.png" : "/assets/Recycle_bin_full.webp"}
      alt="Recycle Bin"
      width={32}
      height={32}
      draggable={false}
      unoptimized
    />
  );
};
