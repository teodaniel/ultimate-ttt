import { useGameStore, GameMode } from "../store/gameStore";

interface LobbyProps {
  onStartGame: () => void;
}

export function Lobby({ onStartGame }: LobbyProps) {
  const setMode = useGameStore((state) => state.setMode);
  const newGame = useGameStore((state) => state.newGame);

  function startHotseat() {
    setMode(GameMode.Hotseat);
    newGame();
    onStartGame();
  }

  function startOnline() {
    setMode(GameMode.Online);
    newGame();
    onStartGame();
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col items-center justify-center px-4 gap-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">
          Ultimate Tic-Tac-Toe
        </h1>
        <p className="mt-2 text-slate-500 dark:text-slate-400">3×3 boards inside a 3×3 board</p>
      </div>

      <div className="w-full max-w-xs text-sm text-slate-600 dark:text-slate-300 space-y-2">
        <p>
          Players can only play on active fields which depends on your
          opponent's last move. For example, if your opponent played in the
          third field (right column, top row), your next move must be within the
          third small grid:
        </p>
        <p>If that board is already won or full, you can play anywhere.</p>
        <p>
          To win the game, you need to win three small grids in a row
          (horizontally, vertically, or diagonally) on the large board:
        </p>
      </div>

      <div className="flex flex-col gap-3 w-full max-w-xs">
        <button
          className="px-6 py-3 bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-900 rounded-lg font-medium text-lg hover:bg-slate-700 dark:hover:bg-slate-300 active:scale-95 transition-all"
          onClick={startHotseat}
        >
          Play local (hot-seat)
        </button>

        <button
          className="px-6 py-3 bg-blue-600 dark:bg-blue-500 text-white rounded-lg font-medium text-lg hover:bg-blue-500 dark:hover:bg-blue-400 active:scale-95 transition-all"
          onClick={startOnline}
        >
          Create online game
        </button>
      </div>
    </div>
  );
}
