"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

// ─── Fake files (restored on every new browser session) ───────────────────────
export const FAKE_FILES = [
  { name: "bad_ideas_2019.txt", size: "12 KB", date: "3/14/2019" },
  { name: "excuses.docx", size: "4 KB", date: "7/22/2021" },
  { name: "todo_next_week.txt", size: "2 KB", date: "1/1/2020" },
  { name: "definitely_not_important.zip", size: "128 KB", date: "9/9/2022" },
  { name: "resume_final_FINAL_v3.docx", size: "86 KB", date: "2/28/2023" },
  { name: "why_it_doesnt_work.md", size: "9 KB", date: "5/5/2024" },
  { name: "my_plans.xlsx", size: "44 KB", date: "11/11/2021" },
];

const SESSION_KEY = "recycleBinEmptied";

function getInitialFiles() {
  if (typeof window === "undefined") return FAKE_FILES;
  try {
    const emptied = sessionStorage.getItem(SESSION_KEY);
    if (emptied === "true") return [];
  } catch {}
  return FAKE_FILES;
}

// ─── Context type ─────────────────────────────────────────────────────────────
export interface RecycleBinFile {
  name: string;
  size: string;
  date: string;
}

export interface RecycleBinContextType {
  files: RecycleBinFile[];
  isEmpty: boolean;
  emptyBin: () => void;
  restoreFile: (name: string) => void;
  setFiles: React.Dispatch<React.SetStateAction<RecycleBinFile[]>>;
}

// ─── Context ──────────────────────────────────────────────────────────────────
const RecycleBinContext = createContext<RecycleBinContextType | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────
export function RecycleBinProvider({ children }: { children: React.ReactNode }) {
  const [files, setFiles] = useState<RecycleBinFile[]>(getInitialFiles);

  const emptyBin = useCallback(() => {
    setFiles([]);
    try {
      sessionStorage.setItem(SESSION_KEY, "true");
    } catch {}
  }, []);

  const restoreFile = useCallback((name: string) => {
    setFiles((prev) => prev.filter((f) => f.name !== name));
  }, []);

  const isEmpty = files.length === 0;

  const value = useMemo<RecycleBinContextType>(
    () => ({ files, isEmpty, emptyBin, restoreFile, setFiles }),
    [files, isEmpty, emptyBin, restoreFile],
  );

  return (
    <RecycleBinContext.Provider value={value}>
      {children}
    </RecycleBinContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────
export function useRecycleBin(): RecycleBinContextType {
  const ctx = useContext(RecycleBinContext);
  if (!ctx) {
    throw new Error("useRecycleBin must be used inside <RecycleBinProvider>");
  }
  return ctx;
}
