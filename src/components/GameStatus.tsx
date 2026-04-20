import { useGameStore } from "../store/gameStore";

const BOARD_NAMES = [
  "top-left", "top-center", "top-right",
  "middle-left", "center", "middle-right",
  "bottom-left", "bottom-center", "bottom-right",
];

export function GameStatus() {
  const game = useGameStore((state) => state.game);

  if (game.winner) {
    return (
      <div className="text-center mb-4">
        <p className="text-2xl font-bold">
          {game.winner === "draw" ? "It's a draw!" : `${game.winner} wins!`}
        </p>
      </div>
    );
  }

  return (
    <div className="text-center mb-4 space-y-1">
      <p className="text-lg font-semibold">{game.currentPlayer} to move</p>
      <p className="text-sm text-gray-600">
        {game.activeBoard === null
          ? "Free move — play in any open board"
          : `Must play in the ${BOARD_NAMES[game.activeBoard]} board`}
      </p>
    </div>
  );
}
