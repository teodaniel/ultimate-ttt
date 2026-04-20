import { useGameStore } from "../store/gameStore";
import { usePeerContext } from "../net/PeerContext";
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
  const mode = useGameStore((state) => state.mode);
  const mySymbol = useGameStore((state) => state.mySymbol);
  const currentPlayer = useGameStore((state) => state.game.currentPlayer);
  const { send, connectionStatus } = usePeerContext();

  const isReady = mode === "hotseat" || (connectionStatus === "connected" && mySymbol !== null);
  const isMyTurn = mode === "hotseat" || currentPlayer === mySymbol;
  const isDisabled = disabled || value !== null || !isReady || !isMyTurn;

  function handleClick() {
    if (isDisabled) return;
    const applied = makeMove(boardIndex, cellIndex);
    if (applied && mode === "online") {
      send({ type: "MOVE", payload: { boardIndex, cellIndex } });
    }
  }

  const base = "aspect-square w-full flex items-center justify-center rounded-sm transition-colors";
  const bg = isLastMove
    ? "bg-yellow-100"
    : value === null && !isDisabled
    ? "bg-white hover:bg-blue-50 cursor-pointer"
    : "bg-white";
  const color = value ? markColor[value] : "text-transparent";
  const border = "border border-slate-300";

  return (
    <button
      className={`${base} ${bg} ${color} ${border}`}
      style={{ fontFamily: "'Fredoka One', cursive", fontSize: "clamp(0.9rem, 4.5vw, 1.6rem)", lineHeight: 1 }}
      disabled={isDisabled}
      onClick={handleClick}
      aria-label={`Board ${boardIndex}, cell ${cellIndex}${value ? `: ${value}` : ""}`}
    >
      {value ?? ""}
    </button>
  );
}
