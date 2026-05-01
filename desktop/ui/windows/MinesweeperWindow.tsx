"use client";

import React, { useEffect, useReducer, useRef, useState } from "react";
import { useDesktop } from "@/desktop/DesktopProvider";

// ─── Config ───────────────────────────────────────────────────────────────────

const Config = {
  Beginner:     { rows: 9,  columns: 9,  mines: 10 },
  Intermediate: { rows: 16, columns: 16, mines: 40 },
  Expert:       { rows: 16, columns: 30, mines: 99 },
} as const;

type Difficulty = keyof typeof Config;
type CeilState = "cover" | "flag" | "unknown" | "open" | "die" | "mine" | "misflagged";
type GameStatus = "new" | "started" | "died" | "won";

interface Ceil {
  state: CeilState;
  minesAround: number;
  opening: boolean;
}

interface GameState {
  difficulty: Difficulty;
  status: GameStatus;
  marks: boolean;
  rows: number;
  columns: number;
  mines: number;
  ceils: Ceil[];
}

// ─── Assets ───────────────────────────────────────────────────────────────────

const A = (name: string) => `/assets/minesweeper/${name}`;
const DIGITS = [0,1,2,3,4,5,6,7,8,9].map((n) => A(`digit${n}.png`));
const DIGIT_MINUS = A("digit-.png");
const OPEN_IMGS = [A("empty.png"),A("open1.png"),A("open2.png"),A("open3.png"),
                   A("open4.png"),A("open5.png"),A("open6.png"),A("open7.png"),A("open8.png")];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function sampleSize<T>(arr: T[], n: number): T[] {
  const r = [...arr];
  for (let i = r.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [r[i], r[j]] = [r[j], r[i]];
  }
  return r.slice(0, n);
}

function getNearIndexes(index: number, rows: number, cols: number): number[] {
  if (index < 0 || index >= rows * cols) return [];
  const row = Math.floor(index / cols);
  const col = index % cols;
  return [
    index-cols-1, index-cols, index-cols+1,
    index-1,                  index+1,
    index+cols-1, index+cols, index+cols+1,
  ].filter((_, ai) => {
    if (row === 0        && ai < 3)                 return false;
    if (row === rows - 1 && ai > 4)                 return false;
    if (col === 0        && [0,3,5].includes(ai))   return false;
    if (col === cols - 1 && [2,4,7].includes(ai))   return false;
    return true;
  });
}

function genGameConfig(difficulty: Difficulty) {
  const { rows, columns, mines } = Config[difficulty];
  const ceils: Ceil[] = Array(rows * columns).fill(null).map(() => ({
    state: "cover" as CeilState, minesAround: 0, opening: false,
  }));
  return { rows, columns, mines, ceils };
}

function getInitState(difficulty: Difficulty = "Beginner"): GameState {
  return { difficulty, status: "new", marks: true, ...genGameConfig(difficulty) };
}

function insertMines(difficulty: Difficulty, exclude: number, originCeils: Ceil[]) {
  const { rows, columns, mines } = Config[difficulty];
  const ceils = originCeils.map((c) => ({ ...c }));
  sampleSize([...Array(rows * columns).keys()].filter((i) => i !== exclude), mines).forEach((chosen) => {
    ceils[chosen].minesAround = -10;
    getNearIndexes(chosen, rows, columns).forEach((ni) => { ceils[ni].minesAround += 1; });
  });
  return { rows, columns, mines, ceils };
}

function autoCeils(state: GameState, index: number): number[] {
  const { rows, columns } = state;
  const ceils = state.ceils.map((c) => ({ ...c, walked: false }));
  function walk(i: number): number[] {
    const c = ceils[i];
    if (!c || (c as any).walked || c.minesAround < 0 || c.state === "flag") return [];
    (c as any).walked = true;
    if (c.minesAround > 0) return [i];
    return [i, ...getNearIndexes(i, rows, columns).flatMap(walk)];
  }
  return walk(index);
}

// ─── Reducer ──────────────────────────────────────────────────────────────────

type Action =
  | { type: "CLEAR_MAP"; payload?: Difficulty }
  | { type: "START_GAME"; payload: number }
  | { type: "OPEN_CEIL"; payload: number }
  | { type: "CHANGE_CEIL_STATE"; payload: number }
  | { type: "GAME_OVER"; payload: number }
  | { type: "WON" }
  | { type: "OPENING_CEIL"; payload: number }
  | { type: "OPENING_CEILS"; payload: number }
  | { type: "TOGGLE_MARKS" };

function reducer(state: GameState, action: Action): GameState {
  switch (action.type) {
    case "CLEAR_MAP":
      return getInitState(action.payload ?? state.difficulty);
    case "START_GAME":
      return { ...state, ...insertMines(state.difficulty, action.payload, state.ceils), status: "started" };
    case "OPEN_CEIL": {
      const indexes = autoCeils(state, action.payload);
      const ceils = [...state.ceils];
      indexes.forEach((i) => { ceils[i] = { ...ceils[i], state: "open" }; });
      return { ...state, ceils };
    }
    case "CHANGE_CEIL_STATE": {
      const ceils = [...state.ceils];
      const ceil = ceils[action.payload];
      let ns: CeilState;
      switch (ceil.state) {
        case "cover":   ns = "flag"; break;
        case "flag":    ns = state.marks ? "unknown" : "cover"; break;
        case "unknown": ns = "cover"; break;
        default: return state;
      }
      ceils[action.payload] = { ...ceil, state: ns };
      return { ...state, ceils };
    }
    case "GAME_OVER": {
      const ceils = state.ceils.map((c) => {
        if (c.minesAround < 0 && c.state !== "flag") return { ...c, state: "mine" as CeilState };
        if (c.state === "flag" && c.minesAround >= 0) return { ...c, state: "misflagged" as CeilState };
        return { ...c, opening: false };
      });
      ceils[action.payload] = { ...ceils[action.payload], state: "die" };
      return { ...state, status: "died", ceils };
    }
    case "WON": {
      const ceils = state.ceils.map((c) =>
        c.minesAround >= 0 ? { ...c, state: "open" as CeilState } : { ...c, state: "flag" as CeilState }
      );
      return { ...state, status: "won", ceils };
    }
    case "OPENING_CEIL": {
      const ceils = state.ceils.map((c) => ({ ...c, opening: false }));
      if (action.payload >= 0) ceils[action.payload] = { ...ceils[action.payload], opening: true };
      return { ...state, ceils };
    }
    case "OPENING_CEILS": {
      const indexes = getNearIndexes(action.payload, state.rows, state.columns);
      const ceils = state.ceils.map((c) => ({ ...c, opening: false }));
      [...indexes, action.payload].forEach((i) => { ceils[i] = { ...ceils[i], opening: true }; });
      return { ...state, ceils };
    }
    case "TOGGLE_MARKS":
      return { ...state, marks: !state.marks };
    default:
      return state;
  }
}

// ─── Timer ────────────────────────────────────────────────────────────────────

function useTimer(status: GameStatus) {
  const [seconds, setSeconds] = useState(0);
  useEffect(() => {
    let t: ReturnType<typeof setInterval>;
    if (status === "started") t = setInterval(() => setSeconds((s) => s + 1), 1000);
    if (status === "new") setSeconds(0);
    return () => clearInterval(t);
  }, [status]);
  return seconds;
}

// ─── Window size ──────────────────────────────────────────────────────────────

const CELL = 16;

function calcGameSize(difficulty: Difficulty) {
  const { rows, columns } = Config[difficulty];
  // Game content:  menuBar(20) + frame(border3*2 + pad5*2=16) + scoreBar(34) + scorePad(5) + grid(rows*16 + border6)
  const gameW = columns * CELL + 6 + 10 + 6;
  const gameH = 20 + 16 + 34 + 5 + rows * CELL + 6;
  // XPWindow chrome: titleBar(32) + 2px border top/bottom(4). margin:-12px cancels p-3 padding.
  return { width: gameW + 4, height: gameH + 36 };
}

// ─── Sub-components ───────────────────────────────────────────────────────────

const imgS: React.CSSProperties = { width: 13, height: 23, imageRendering: "pixelated" };

function DigitDisplay({ number }: { number: number }) {
  if (number < 0) {
    const n = Math.min(-number, 99);
    const s = n < 10 ? "0" + n : String(n);
    return <><img src={DIGIT_MINUS} alt="-" style={imgS} />{s.split("").map((d, i) => <img key={i} src={DIGITS[+d]} alt={d} style={imgS} />)}</>;
  }
  const c = Math.min(number, 999);
  const s = c < 10 ? "00"+c : c < 100 ? "0"+c : String(c);
  return <>{s.split("").map((d, i) => <img key={i} src={DIGITS[+d]} alt={d} style={imgS} />)}</>;
}

const COVER: React.CSSProperties = { position:"absolute", width:16, height:16, borderLeft:"rgb(245,245,245) solid 2px", borderTop:"rgb(245,245,245) solid 2px", borderRight:"rgb(128,128,128) solid 2px", borderBottom:"rgb(128,128,128) solid 2px" };
const OPENBG: React.CSSProperties = { position:"absolute", width:16, height:16, borderLeft:"rgb(128,128,128) solid 1px", borderTop:"rgb(128,128,128) solid 1px" };
const CI: React.CSSProperties = { position:"absolute", width:16, height:16, pointerEvents:"none", imageRendering:"pixelated" };

function CeilContent({ ceil }: { ceil: Ceil }) {
  const { state, minesAround, opening } = ceil;
  switch (state) {
    case "open":       return <><div style={OPENBG}/><img style={CI} src={OPEN_IMGS[minesAround]} alt="" /></>;
    case "flag":       return <><div style={COVER}/><img style={CI} src={A("flag.png")} alt="flag" /></>;
    case "misflagged": return <><div style={OPENBG}/><img style={CI} src={A("misflagged.png")} alt="" /></>;
    case "mine":       return <><div style={OPENBG}/><img style={CI} src={A("mine-ceil.png")} alt="" /></>;
    case "die":        return <><div style={OPENBG}/><img style={CI} src={A("mine-death.png")} alt="" /></>;
    case "unknown":    return opening
      ? <><div style={OPENBG}/><img style={CI} src={A("question.png")} alt="?" /></>
      : <><div style={COVER}/><img style={CI} src={A("question.png")} alt="?" /></>;
    default:           return opening ? <div style={OPENBG}/> : <div style={COVER}/>;
  }
}

// ─── DDRow helper (hover highlight for menu rows) ─────────────────────────────

function DDRow({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  const [hov, setHov] = useState(false);
  return (
    <div style={{ display: "contents" }} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} onMouseUp={onClick}>
      {React.Children.map(children, (child) =>
        React.isValidElement(child)
          ? React.cloneElement(child as React.ReactElement<any>, {
              style: { ...(child as any).props.style, background: hov ? "#316AC5" : "transparent", color: hov ? "#fff" : "#000" },
            })
          : child
      )}
    </div>
  );
}

function DDSep() {
  return <div style={{ gridColumn: "1/5", height: 1, background: "gray", margin: "3px 1px" }} />;
}

function CheckCell({ checked }: { checked: boolean }) {
  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
      {checked && <img src={A("checked.png")} alt="✓" style={{ width: 11, height: 11, imageRendering: "pixelated" }} />}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export const MinesweeperWindow: React.FC = () => {
  const { windows, resizeWindow } = useDesktop();
  const [gameState, dispatch] = useReducer(reducer, getInitState("Beginner"));
  const seconds = useTimer(gameState.status);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const topBarRef   = useRef<HTMLDivElement>(null);
  const faceRef     = useRef<HTMLDivElement>(null);

  const [mouseDownContent, setMouseDownContent] = useState(false);
  const [openOption, setOpenOption] = useState<string | null>(null);
  const [openBehavior, setOpenBehavior] = useState({ index: -1, behavior: "" });

  // Win check
  useEffect(() => {
    if (gameState.status === "started") {
      const rem = gameState.ceils.filter((c) => c.state !== "open" && c.minesAround >= 0).length;
      if (rem === 0) dispatch({ type: "WON" });
    }
  });

  // Opening highlight
  useEffect(() => {
    const { index, behavior } = openBehavior;
    if (behavior === "single") dispatch({ type: "OPENING_CEIL", payload: index });
    else if (behavior === "multi") dispatch({ type: "OPENING_CEILS", payload: index });
    else dispatch({ type: "OPENING_CEIL", payload: -1 });
  }, [openBehavior.index, openBehavior.behavior]); // eslint-disable-line

  // Global listeners
  useEffect(() => {
    function onUp(e: MouseEvent) {
      setOpenBehavior({ index: -1, behavior: "" });
      setMouseDownContent(false);
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setOpenOption("");
    }
    function onTouch(e: TouchEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node) &&
          topBarRef.current && !topBarRef.current.contains(e.target as Node)) setOpenOption("");
    }
    window.addEventListener("mouseup", onUp);
    window.addEventListener("touchend", onTouch);
    return () => { window.removeEventListener("mouseup", onUp); window.removeEventListener("touchend", onTouch); };
  }, []);

  // Resize on difficulty change
  useEffect(() => {
    const win = windows.find((w) => w.type === "minesweeper" && !w.isMaximized);
    if (!win) return;
    const { width, height } = calcGameSize(gameState.difficulty);
    resizeWindow(win.id, width, height, win.x, win.y);
  }, [gameState.difficulty]); // eslint-disable-line

  // Game logic
  function onReset(difficulty?: Difficulty) { dispatch({ type: "CLEAR_MAP", payload: difficulty }); }

  function openCeil(index: number) {
    if (gameState.status === "new") {
      dispatch({ type: "START_GAME", payload: index });
      dispatch({ type: "OPEN_CEIL", payload: index });
    } else if (gameState.status === "started") {
      const ceil = gameState.ceils[index];
      if (["flag","open"].includes(ceil.state)) return;
      if (ceil.minesAround < 0) dispatch({ type: "GAME_OVER", payload: index });
      else dispatch({ type: "OPEN_CEIL", payload: index });
    }
  }

  function openCeils(index: number) {
    const ceil = gameState.ceils[index];
    if (ceil.state !== "open" || ceil.minesAround <= 0 || gameState.status !== "started") return;
    const idxs = getNearIndexes(index, gameState.rows, gameState.columns);
    if (idxs.filter((i) => gameState.ceils[i].state === "flag").length !== ceil.minesAround) return;
    const mineIdx = idxs.find((i) => gameState.ceils[i].minesAround < 0 && gameState.ceils[i].state !== "flag");
    if (mineIdx !== undefined) dispatch({ type: "GAME_OVER", payload: mineIdx });
    else idxs.forEach((i) => dispatch({ type: "OPEN_CEIL", payload: i }));
  }

  function onMouseDownCeils(e: React.MouseEvent, index: number) {
    if (["died","won"].includes(gameState.status)) return;
    if (e.button === 4 || e.buttons === 3 || e.ctrlKey || e.altKey || e.shiftKey || e.metaKey) {
      setOpenBehavior({ index, behavior: "multi" });
    } else if (e.button === 2) {
      dispatch({ type: "CHANGE_CEIL_STATE", payload: index });
    } else if (e.button === 0) {
      setOpenBehavior({ index, behavior: "single" });
    }
  }

  function onMouseUpCeils() {
    const { behavior, index } = openBehavior;
    if (index === -1) return;
    if (behavior === "single") openCeil(index);
    else if (behavior === "multi") openCeils(index);
  }

  function hoverOption(opt: string) { if (openOption) setOpenOption(opt); }

  const remainMines = gameState.mines - gameState.ceils.filter((c) => c.state === "flag" || c.state === "misflagged").length;

  function statusFace() {
    const s16: React.CSSProperties = { width: 16, height: 16, imageRendering: "pixelated" };
    if (mouseDownContent) return <img src={A("ohh.png")} alt="ohh" style={s16} />;
    switch (gameState.status) {
      case "died": return <img src={A("dead.png")} alt="dead" style={s16} />;
      case "won":  return <img src={A("win.png")}  alt="win"  style={s16} />;
      default:     return <img src={A("smile.png")} alt="smile" style={s16} />;
    }
  }

  const boardW = gameState.columns * CELL + 6;
  const boardH = gameState.rows    * CELL + 6;

  const ddMenuStyle: React.CSSProperties = {
    backgroundColor: "#ECE9D8", position: "absolute", top: "20px", left: 0,
    boxShadow: "2px 2px 4px rgba(0,0,0,0.4), inset 0 0 0 1px rgba(255,255,255,0.5)",
    border: "1px solid #7a7a7a", padding: "2px",
    display: "grid", gridTemplateColumns: "18px auto auto 15px", lineHeight: "18px",
    fontSize: "11px", zIndex: 10, whiteSpace: "nowrap", fontFamily: "Tahoma, Arial, sans-serif",
    color: "#000",
  };
  const cb: React.CSSProperties = { padding: "0 5px", whiteSpace: "nowrap" };

  return (
    <div style={{ margin: "-12px" }}>
      <div
        style={{ display: "inline-block", fontFamily: "Tahoma, Arial, sans-serif", userSelect: "none" }}
        onContextMenu={(e) => { e.preventDefault(); e.stopPropagation(); }}
        onMouseDown={(e) => {
          if (e.button !== 0) return;
          if (faceRef.current?.contains(e.target as Node)) return;
          if (["won","died"].includes(gameState.status)) return;
          setMouseDownContent(true);
        }}
      >
        {/* Menu bar */}
        <div ref={dropdownRef} style={{ position: "relative", display: "flex", height: 20 }}>
          {/* Game menu */}
          <div style={{ position: "relative", zIndex: 1 }}>
            <div
              ref={topBarRef}
              style={{ padding: "0 5px", height: "100%", lineHeight: "20px", fontSize: "11px", cursor: "default",
                color: openOption === "Game" ? "#fff" : "#000",
                background: openOption === "Game" ? "#0b61ff" : "rgb(236,233,216)" }}
              onMouseDown={() => setOpenOption((o) => (o === "Game" ? "" : "Game"))}
              onMouseOver={() => hoverOption("Game")}
            >Game</div>
            {openOption === "Game" && (
              <div style={ddMenuStyle}>
                <DDRow onClick={() => { onReset(); setOpenOption(""); }}>
                  <CheckCell checked={false} /><div style={cb}>New</div><span style={cb}>F2</span><div />
                </DDRow>
                <DDSep />
                {(["Beginner","Intermediate","Expert"] as Difficulty[]).map((d) => (
                  <DDRow key={d} onClick={() => { onReset(d); setOpenOption(""); }}>
                    <CheckCell checked={gameState.difficulty === d} />
                    <div style={cb}>{d}</div><span /><div />
                  </DDRow>
                ))}
                <DDSep />
                <DDRow onClick={() => dispatch({ type: "TOGGLE_MARKS" })}>
                  <CheckCell checked={gameState.marks} /><div style={cb}>Marks (?)</div><span /><div />
                </DDRow>
                <DDSep />
                <DDRow onClick={() => setOpenOption("")}>
                  <CheckCell checked={false} /><div style={cb}>Exit</div><span /><div />
                </DDRow>
              </div>
            )}
          </div>
          {/* Help menu */}
          <div style={{ position: "relative", zIndex: 1 }}>
            <div
              style={{ padding: "0 5px", height: "100%", lineHeight: "20px", fontSize: "11px", cursor: "default",
                color: openOption === "Help" ? "#fff" : "#000",
                background: openOption === "Help" ? "#0b61ff" : "rgb(236,233,216)" }}
              onMouseDown={() => setOpenOption((o) => (o === "Help" ? "" : "Help"))}
              onMouseOver={() => hoverOption("Help")}
            >Help</div>
            {openOption === "Help" && (
              <div style={ddMenuStyle}>
                <DDRow>
                  <CheckCell checked={false} /><div style={cb}>About Minesweeper...</div><span /><div />
                </DDRow>
              </div>
            )}
          </div>
        </div>

        {/* Game content */}
        <div style={{ borderLeft:"rgb(245,245,245) solid 3px", borderTop:"rgb(245,245,245) solid 3px",
          borderRight:"rgb(128,128,128) solid 3px", borderBottom:"rgb(128,128,128) solid 3px",
          backgroundColor:"rgb(192,192,192)", padding: 5 }}>

          {/* Score bar */}
          <div style={{ height:34, borderRadius:1, borderTop:"rgb(128,128,128) solid 2px",
            borderLeft:"rgb(128,128,128) solid 2px", borderRight:"rgb(245,245,245) solid 2px",
            borderBottom:"rgb(245,245,245) solid 2px", marginBottom:5, display:"flex",
            alignItems:"center", justifyContent:"space-between", padding:"3px 7px 3px 4px" }}>
            <div style={{ width:39, height:24, borderWidth:"0 1px 1px 0", borderStyle:"solid",
              borderColor:"#fff", background:"#000", display:"flex", alignItems:"center",
              justifyContent:"flex-end", overflow:"hidden" }}>
              <DigitDisplay number={remainMines} />
            </div>
            <div ref={faceRef} onClick={() => onReset()} style={{ width:26, height:26, cursor:"default",
              borderTop:"rgb(245,245,245) solid 2px", borderLeft:"rgb(245,245,245) solid 2px",
              borderRight:"rgb(128,128,128) solid 2px", borderBottom:"rgb(128,128,128) solid 2px",
              display:"flex", alignItems:"center", justifyContent:"center", backgroundColor:"rgb(192,192,192)" }}>
              {statusFace()}
            </div>
            <div style={{ width:39, height:24, borderWidth:"0 1px 1px 0", borderStyle:"solid",
              borderColor:"#fff", background:"#000", display:"flex", alignItems:"center",
              justifyContent:"flex-end", overflow:"hidden" }}>
              <DigitDisplay number={seconds} />
            </div>
          </div>

          {/* Mine grid */}
          <div
            style={{ display:"grid", gridTemplateColumns:`repeat(${gameState.columns}, 16px)`,
              gridTemplateRows:`repeat(${gameState.rows}, 16px)`, width:boardW, height:boardH,
              borderTop:"rgb(128,128,128) solid 3px", borderLeft:"rgb(128,128,128) solid 3px",
              borderRight:"rgb(245,245,245) solid 3px", borderBottom:"rgb(245,245,245) solid 3px" }}
            onMouseUp={onMouseUpCeils}
            onContextMenu={(e) => e.stopPropagation()}
          >
            {gameState.ceils.map((ceil, index) => (
              <div
                key={index}
                style={{ position:"relative", width:16, height:16, cursor:"default" }}
                onMouseEnter={() => setOpenBehavior((ob) => ({ index, behavior: ob.behavior }))}
                onMouseDown={(e) => { e.stopPropagation(); onMouseDownCeils(e, index); }}
              >
                <CeilContent ceil={ceil} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
