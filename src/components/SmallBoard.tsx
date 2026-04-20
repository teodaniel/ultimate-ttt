import { useGameStore } from "../store/gameStore";
import { Cell } from "./Cell";
import type { BoardIndex } from "../game/types";

interface SmallBoardProps {
  boardIndex: BoardIndex;
  isActive: boolean;
}

const overlayColor: Record<string, string> = {
  X: "text-blue-600",
  O: "text-red-500",
  draw: "text-slate-400",
};

export function SmallBoard({ boardIndex, isActive }: SmallBoardProps) {
  const board = useGameStore((state) => state.game.boards[boardIndex]);
  const gameWinner = useGameStore((state) => state.game.winner);
  const lastMove = useGameStore((state) => state.game.lastMove);

  const isCompleted = board.winner !== null;
  const cellDisabled = !isActive || isCompleted || gameWinner !== null;

  const containerBase = "relative p-1 rounded transition-all";
  const activeBg = isActive ? "ring-2 ring-blue-400 bg-blue-50/40 dark:bg-blue-900/30" : "";
  const dimmed = isCompleted && !isActive ? "opacity-60" : "";

  return (
    <div className={`${containerBase} ${activeBg} ${dimmed}`}>
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
          className={`absolute inset-0 flex items-center justify-center text-5xl font-black pointer-events-none select-none ${overlayColor[board.winner!]} opacity-40`}
          style={{ fontFamily: "'Fredoka One', cursive" }}
        >
          {board.winner === "draw" ? "–" : board.winner}
        </div>
      )}
    </div>
  );
}
