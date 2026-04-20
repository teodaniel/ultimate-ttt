import { useGameStore } from "../store/gameStore";
import type { BoardIndex, CellIndex, CellValue } from "../game/types";

interface CellProps {
  boardIndex: BoardIndex;
  cellIndex: CellIndex;
  value: CellValue;
  disabled: boolean;
}

export function Cell({ boardIndex, cellIndex, value, disabled }: CellProps) {
  const makeMove = useGameStore((state) => state.makeMove);

  return (
    <button
      className="w-10 h-10 border border-gray-400 text-lg font-bold disabled:cursor-not-allowed"
      disabled={disabled || value !== null}
      onClick={() => makeMove(boardIndex, cellIndex)}
    >
      {value}
    </button>
  );
}
