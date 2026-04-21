import { useEffect, useRef } from "react";
import { useGameStore, GameMode } from "../store/gameStore";
import type { Theme } from "../store/gameStore";

const BOARD_NAMES = [
  "top-left",
  "top-center",
  "top-right",
  "middle-left",
  "center",
  "middle-right",
  "bottom-left",
  "bottom-center",
  "bottom-right",
];

const markColors: Record<Theme, Record<string, string>> = {
  light: { X: "text-blue-600", O: "text-red-500" },
  dark:  { X: "text-blue-600", O: "text-red-500" },
  retro: { X: "text-[#ff2d78]", O: "text-[#00e5ff]" },
};

export function MoveHistory() {
  const stateHistory = useGameStore((state) => state.stateHistory);
  const historyIndex = useGameStore((state) => state.historyIndex);
  const isViewingHistory = useGameStore((state) => state.isViewingHistory);
  const mode = useGameStore((state) => state.mode);
  const stepBack = useGameStore((state) => state.stepBack);
  const stepForward = useGameStore((state) => state.stepForward);
  const jumpToMove = useGameStore((state) => state.jumpToMove);
  const undoMove = useGameStore((state) => state.undoMove);
  const theme = useGameStore((state) => state.theme);

  const isHotseat = mode === GameMode.Hotseat;
  const listRef = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const el = listRef.current?.children[historyIndex] as
      | HTMLElement
      | undefined;
    el?.scrollIntoView({ block: "nearest" });
  }, [historyIndex]);

  const moves = stateHistory.slice(1).map((s) => s.lastMove!);

  return (
    <div className="w-full max-w-xs flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 retro:text-[#e0e0ff]/60 uppercase tracking-wide">
          Move history
        </span>
        <div className="flex gap-1">
          <button
            onClick={stepBack}
            disabled={historyIndex === 0}
            className="px-2 py-1 text-xs rounded bg-slate-200 dark:bg-slate-700 retro:bg-transparent retro:border retro:border-[#3a3a6a] retro:text-[#e0e0ff]/70 text-slate-700 dark:text-slate-200 disabled:opacity-40 hover:bg-slate-300 dark:hover:bg-slate-600 retro:hover:bg-[#3a3a6a]/40 transition-colors"
            aria-label="Step back"
          >
            ←
          </button>
          <button
            onClick={stepForward}
            disabled={!isViewingHistory}
            className="px-2 py-1 text-xs rounded bg-slate-200 dark:bg-slate-700 retro:bg-transparent retro:border retro:border-[#3a3a6a] retro:text-[#e0e0ff]/70 text-slate-700 dark:text-slate-200 disabled:opacity-40 hover:bg-slate-300 dark:hover:bg-slate-600 retro:hover:bg-[#3a3a6a]/40 transition-colors"
            aria-label="Step forward"
          >
            →
          </button>
          {isHotseat && (
            <button
              onClick={undoMove}
              disabled={historyIndex === 0 || isViewingHistory}
              className="px-2 py-1 text-xs rounded bg-slate-200 dark:bg-slate-700 retro:bg-transparent retro:border retro:border-[#3a3a6a] retro:text-[#e0e0ff]/70 text-slate-700 dark:text-slate-200 disabled:opacity-40 hover:bg-slate-300 dark:hover:bg-slate-600 retro:hover:bg-[#3a3a6a]/40 transition-colors"
              aria-label="Undo last move"
            >
              Undo
            </button>
          )}
        </div>
      </div>

      <ol
        ref={listRef}
        className="max-h-36 overflow-y-auto flex flex-col gap-0.5 text-xs"
      >
        <li
          key="start"
          onClick={() => jumpToMove(0)}
          className={`px-2 py-1 rounded cursor-pointer transition-colors ${
            historyIndex === 0
              ? "bg-slate-200 dark:bg-slate-600 font-semibold"
              : "hover:bg-slate-100 dark:hover:bg-slate-700/50"
          } text-slate-500 dark:text-slate-400`}
        >
          Start
        </li>
        {moves.map((move, i) => (
          <li
            key={i}
            onClick={() => jumpToMove(i + 1)}
            className={`px-2 py-1 rounded cursor-pointer transition-colors ${
              historyIndex === i + 1
                ? "bg-slate-200 dark:bg-slate-600 font-semibold"
                : "hover:bg-slate-100 dark:hover:bg-slate-700/50"
            } text-slate-700 dark:text-slate-300`}
          >
            <span className={`font-bold ${markColors[theme][move.player]}`}>
              {move.player}
            </span>
            {" · "}
            {BOARD_NAMES[move.boardIndex]} board, {BOARD_NAMES[move.cellIndex]}{" "}
            cell
          </li>
        ))}
      </ol>
    </div>
  );
}
