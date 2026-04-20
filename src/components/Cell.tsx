import { useGameStore } from "../store/gameStore";
import type { BoardIndex, CellIndex, CellValue } from "../game/types";

interface CellProps {
  boardIndex: BoardIndex;
  cellIndex: CellIndex;
  value: CellValue;
  disabled: boolean;
  isLastMove: boolean;
}

const markColor: Record<string, string> = {
  X: "text-blue-600",
  O: "text-red-500",
};

export function Cell({ boardIndex, cellIndex, value, disabled, isLastMove }: CellProps) {
  const makeMove = useGameStore((state) => state.makeMove);

  const base = "aspect-square w-full flex items-center justify-center text-lg font-bold rounded-sm transition-colors";
  const bg = isLastMove
    ? "bg-yellow-100"
    : value === null && !disabled
    ? "bg-white hover:bg-blue-50 cursor-pointer"
    : "bg-white";
  const color = value ? markColor[value] : "text-transparent";
  const border = "border border-slate-300";

  return (
    <button
      className={`${base} ${bg} ${color} ${border}`}
      disabled={disabled || value !== null}
      onClick={() => makeMove(boardIndex, cellIndex)}
      aria-label={`Board ${boardIndex}, cell ${cellIndex}${value ? `: ${value}` : ""}`}
    >
      {value ?? ""}
    </button>
  );
}
