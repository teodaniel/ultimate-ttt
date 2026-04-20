import { useGameStore } from "../store/gameStore";

interface LobbyProps {
  onStartGame: () => void;
}

export function Lobby({ onStartGame }: LobbyProps) {
  const setMode = useGameStore((state) => state.setMode);
  const newGame = useGameStore((state) => state.newGame);

  function startHotseat() {
    setMode("hotseat");
    newGame();
    onStartGame();
  }

  function startOnline() {
    setMode("online");
    newGame();
    onStartGame();
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-4 gap-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-slate-800 tracking-tight">
          Ultimate Tic-Tac-Toe
        </h1>
        <p className="mt-2 text-slate-500">3×3 boards inside a 3×3 board</p>
      </div>

      <div className="flex flex-col gap-3 w-full max-w-xs">
        <button
          className="px-6 py-3 bg-slate-800 text-white rounded-lg font-medium text-lg hover:bg-slate-700 active:scale-95 transition-all"
          onClick={startHotseat}
        >
          Play local (hot-seat)
        </button>

        <button
          className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium text-lg hover:bg-blue-500 active:scale-95 transition-all"
          onClick={startOnline}
        >
          Create online game
        </button>
      </div>
    </div>
  );
}
