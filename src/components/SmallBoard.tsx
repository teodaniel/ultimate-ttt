import { useGameStore } from "../store/gameStore";
import type { Theme } from "../store/gameStore";
import { Cell } from "./Cell";
import type { BoardIndex } from "../game/types";

interface SmallBoardProps {
  boardIndex: BoardIndex;
  isActive: boolean;
}

const overlayColors: Record<Theme, Record<string, string>> = {
  light: { X: "text-blue-600", O: "text-red-500", draw: "text-slate-400" },
  dark:  { X: "text-blue-600", O: "text-red-500", draw: "text-slate-400" },
  retro: { X: "text-[#ff2d78]", O: "text-[#00e5ff]", draw: "text-[#e0e0ff]/50" },
};

const winnerRings: Record<Theme, Record<string, string>> = {
  light: { X: "ring-2 ring-blue-500", O: "ring-2 ring-red-500", draw: "ring-2 ring-slate-400" },
  dark:  { X: "ring-2 ring-blue-500", O: "ring-2 ring-red-500", draw: "ring-2 ring-slate-400" },
  retro: { X: "ring-2 ring-[#ff2d78]", O: "ring-2 ring-[#00e5ff]", draw: "ring-2 ring-[#e0e0ff]/30" },
};

export function SmallBoard({ boardIndex, isActive }: SmallBoardProps) {
  const board = useGameStore((state) => state.game.boards[boardIndex]);
  const gameWinner = useGameStore((state) => state.game.winner);
  const lastMove = useGameStore((state) => state.game.lastMove);
  const theme = useGameStore((state) => state.theme);

  const isCompleted = board.winner !== null;
  const cellDisabled = !isActive || isCompleted || gameWinner !== null;

  const containerBase = "relative p-1 rounded transition-all";
  const activeBg =
    isActive && !isCompleted
      ? theme === "retro"
        ? "ring-2 ring-[#ffff00] bg-[#ffff00]/5"
        : "ring-2 ring-blue-400 bg-blue-50/40 dark:bg-blue-900/30"
      : "";
  const completedRing = isCompleted ? winnerRings[theme][board.winner!] : "";
  const dimmed = isCompleted && !isActive ? "opacity-60" : "";

  return (
    <div className={`${containerBase} ${activeBg} ${completedRing} ${dimmed}`}>
      <div className="grid grid-cols-3 gap-0.5">
        {board.cells.map((value, cellIndex) => (
          <Cell
            key={cellIndex}
            boardIndex={boardIndex}
            cellIndex={cellIndex}
            value={value}
            disabled={cellDisabled}
            isLastMove={
              lastMove?.boardIndex === boardIndex &&
              lastMove?.cellIndex === cellIndex
            }
          />
        ))}
      </div>

      {isCompleted && (
        <div
          className={`absolute inset-0 flex items-center justify-center font-black pointer-events-none select-none ${overlayColors[theme][board.winner!]}`}
          style={{
            fontFamily: theme === "retro" ? "'VT323', monospace" : "'Fredoka One', cursive",
            fontSize: "clamp(3rem, 10vw, 5rem)",
            opacity: 0.8,
          }}
        >
          {board.winner === "draw" ? "–" : board.winner}
        </div>
      )}
    </div>
  );
}
