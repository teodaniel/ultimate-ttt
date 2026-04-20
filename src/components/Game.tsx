import { useGameStore } from "../store/gameStore";
import { BigBoard } from "./BigBoard";
import { GameStatus } from "./GameStatus";

interface GameProps {
  onBackToLobby: () => void;
}

export function Game({ onBackToLobby }: GameProps) {
  const newGame = useGameStore((state) => state.newGame);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-4 py-8 gap-6">
      <h1 className="text-3xl font-bold text-slate-800 tracking-tight">
        Ultimate Tic-Tac-Toe
      </h1>
      <GameStatus />
      <BigBoard />
      <div className="flex gap-3">
        <button
          className="px-5 py-2 bg-slate-800 text-white rounded-lg font-medium hover:bg-slate-700 active:scale-95 transition-all"
          onClick={newGame}
        >
          New Game
        </button>
        <button
          className="px-5 py-2 border border-slate-300 text-slate-600 rounded-lg font-medium hover:bg-slate-100 active:scale-95 transition-all"
          onClick={onBackToLobby}
        >
          Back to Lobby
        </button>
      </div>
    </div>
  );
}
