import { useGameStore } from "../store/gameStore";

const BOARD_NAMES = [
  "top-left", "top-center", "top-right",
  "middle-left", "center", "middle-right",
  "bottom-left", "bottom-center", "bottom-right",
];

const markColor: Record<string, string> = {
  X: "text-blue-600",
  O: "text-red-500",
};

export function GameStatus() {
  const game = useGameStore((state) => state.game);

  if (game.winner) {
    const isMarkWinner = game.winner === "X" || game.winner === "O";
    return (
      <div className="text-center h-14 flex flex-col items-center justify-center">
        <p className={`text-2xl font-bold ${isMarkWinner ? markColor[game.winner] : "text-slate-600"}`}>
          {game.winner === "draw" ? "It's a draw!" : `${game.winner} wins!`}
        </p>
      </div>
    );
  }

  return (
    <div className="text-center h-14 flex flex-col items-center justify-center gap-1">
      <p className="text-lg font-semibold">
        <span className={`font-bold ${markColor[game.currentPlayer]}`}>
          {game.currentPlayer}
        </span>
        {" to move"}
      </p>
      <p className="text-sm text-slate-500">
        {game.activeBoard === null
          ? "Free move — play in any open board"
          : `Must play in the ${BOARD_NAMES[game.activeBoard]} board`}
      </p>
    </div>
  );
}
