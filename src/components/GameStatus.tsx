import { useGameStore, GameMode } from "../store/gameStore";
import type { Theme } from "../store/gameStore";
import { usePeerContext } from "../net/PeerContext";

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

const statusLabel: Record<string, string> = {
  idle: "",
  waiting: "Waiting for opponent…",
  connected: "Connected",
  disconnected: "Opponent disconnected",
  error: "Connection error",
};

const statusColor: Record<string, string> = {
  waiting: "text-amber-500",
  connected: "text-green-600",
  disconnected: "text-red-500",
  error: "text-red-500",
};

export function GameStatus() {
  const game = useGameStore((state) => state.game);
  const mode = useGameStore((state) => state.mode);
  const mySymbol = useGameStore((state) => state.mySymbol);
  const theme = useGameStore((state) => state.theme);
  const { connectionStatus, error } = usePeerContext();

  const isOnline = mode === GameMode.Online;
  const mc = markColors[theme];

  function turnLabel() {
    if (isOnline && mySymbol) {
      return game.currentPlayer === mySymbol ? "Your turn" : "Opponent's turn";
    }
    return (
      <>
        <span className={`font-bold ${mc[game.currentPlayer]}`}>
          {game.currentPlayer}
        </span>
        {" to move"}
      </>
    );
  }

  return (
    <div
      className="text-center flex flex-col items-center gap-1"
      style={{ minHeight: "4rem" }}
    >
      {game.winner ? (
        <p
          className={`text-2xl font-bold ${game.winner !== "draw" ? mc[game.winner] : "text-slate-600 dark:text-slate-400 retro:text-[#e0e0ff]/60"}`}
        >
          {game.winner === "draw" ? "It's a draw!" : `${game.winner} wins!`}
        </p>
      ) : (
        <>
          <p className="text-lg font-semibold text-slate-800 dark:text-slate-100 retro:text-[#e0e0ff]">
            {turnLabel()}
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-400 retro:text-[#e0e0ff]/60">
            {game.activeBoard === null
              ? "Free move — play in any open board"
              : `Must play in the ${BOARD_NAMES[game.activeBoard]} board`}
          </p>
        </>
      )}
      {isOnline && mySymbol && (
        <p className="text-xs text-slate-500 dark:text-slate-400 retro:text-[#e0e0ff]/60">
          You are playing as{" "}
          <span
            style={{
              fontFamily: "'Fredoka One', cursive",
              fontSize: "clamp(0.1rem, 1vw, 1rem)",
              lineHeight: 1,
            }}
            className={`font-bold ${mc[mySymbol]}`}
          >
            {mySymbol}
          </span>
        </p>
      )}
      {isOnline && (
        <p
          className={`text-xs ${statusColor[connectionStatus] ?? "text-slate-400"}`}
        >
          {error ?? statusLabel[connectionStatus]}
        </p>
      )}
    </div>
  );
}
