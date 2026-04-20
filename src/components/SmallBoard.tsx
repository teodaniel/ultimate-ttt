import { useGameStore } from "../store/gameStore";
import { Cell } from "./Cell";
import type { BoardIndex } from "../game/types";

interface SmallBoardProps {
  boardIndex: BoardIndex;
  isActive: boolean;
}

export function SmallBoard({ boardIndex, isActive }: SmallBoardProps) {
  const board = useGameStore((state) => state.game.boards[boardIndex]);
  const gameWinner = useGameStore((state) => state.game.winner);

  const isCompleted = board.winner !== null;
  const cellDisabled = !isActive || isCompleted || gameWinner !== null;

  return (
    <div className={`relative p-1 ${isActive ? "ring-2 ring-blue-500" : ""}`}>
      <div className="grid grid-cols-3 gap-0.5">
        {board.cells.map((value, cellIndex) => (
          <Cell
            key={cellIndex}
            boardIndex={boardIndex}
            cellIndex={cellIndex}
            value={value}
            disabled={cellDisabled}
          />
        ))}
      </div>

      {isCompleted && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/70 text-4xl font-bold pointer-events-none">
          {board.winner === "draw" ? "–" : board.winner}
        </div>
      )}
    </div>
  );
}
