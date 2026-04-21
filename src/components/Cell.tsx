import { useGameStore, GameMode } from "../store/gameStore";
import { usePeerContext } from "../net/PeerContext";
import type { BoardIndex, CellIndex, CellValue } from "../game/types";

interface CellProps {
  boardIndex: BoardIndex;
  cellIndex: CellIndex;
  value: CellValue;
  disabled: boolean;
  isLastMove: boolean;
}

const markColors: Record<string, Record<string, string>> = {
  light: { X: "text-blue-600", O: "text-red-500" },
  dark:  { X: "text-blue-600", O: "text-red-500" },
  retro: { X: "text-[#ff2d78]", O: "text-[#00e5ff]" },
};

export function Cell({
  boardIndex,
  cellIndex,
  value,
  disabled,
  isLastMove,
}: CellProps) {
  const makeMove = useGameStore((state) => state.makeMove);
  const mode = useGameStore((state) => state.mode);
  const mySymbol = useGameStore((state) => state.mySymbol);
  const currentPlayer = useGameStore((state) => state.game.currentPlayer);
  const { send, connectionStatus } = usePeerContext();

  const theme = useGameStore((state) => state.theme);
  const isFrozen = useGameStore((state) => state.frozen);
  const isViewingHistory = useGameStore((state) => state.isViewingHistory);
  const isReady =
    mode === GameMode.Hotseat ||
    (connectionStatus === "connected" && mySymbol !== null);
  const isMyTurn = mode === GameMode.Hotseat || currentPlayer === mySymbol;
  const isDisabled =
    disabled || value !== null || !isReady || !isMyTurn || isFrozen || isViewingHistory;

  function handleClick() {
    if (isDisabled) return;
    const applied = makeMove(boardIndex, cellIndex);
    if (applied && mode === GameMode.Online) {
      send({ type: "MOVE", payload: { boardIndex, cellIndex } });
    }
  }

  const base =
    "aspect-square w-full flex items-center justify-center p-0 rounded-sm transition-colors";
  const bg = isLastMove
    ? "bg-yellow-100 dark:bg-yellow-500/25 retro:bg-[#ffff00]/15"
    : value === null && !isDisabled
      ? "bg-white dark:bg-slate-800 retro:bg-[#1a1a3e] hover:bg-blue-200 dark:hover:bg-blue-700/40 retro:hover:bg-[#2a1a4e] cursor-pointer"
      : "bg-white dark:bg-slate-800 retro:bg-[#1a1a3e]";
  const color = value ? markColors[theme][value] : "text-transparent";
  const border = "border border-slate-300 dark:border-slate-600 retro:border-[#3a3a6a]";

  return (
    <button
      className={`${base} ${bg} ${color} ${border}`}
      style={{
        fontFamily: "'Fredoka One', cursive",
        fontSize: "clamp(0.9rem, 4.5vw, 1.6rem)",
        lineHeight: 1,
      }}
      disabled={isDisabled}
      onClick={handleClick}
      data-board={boardIndex}
      data-cell={cellIndex}
      aria-label={`Board ${boardIndex}, cell ${cellIndex}${value ? `: ${value}` : ""}`}
    >
      {value ?? ""}
    </button>
  );
}
