import { useGameStore } from "../store/gameStore";
import { BigBoard } from "./BigBoard";
import { GameStatus } from "./GameStatus";

export function Game() {
  const newGame = useGameStore((state) => state.newGame);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-4 py-8 gap-6">
      <h1 className="text-3xl font-bold text-slate-800 tracking-tight">
        Ultimate Tic-Tac-Toe
      </h1>
      <GameStatus />
      <BigBoard />
      <button
        className="px-5 py-2 bg-slate-800 text-white rounded-lg font-medium hover:bg-slate-700 active:scale-95 transition-all"
        onClick={newGame}
      >
        New Game
      </button>
    </div>
  );
}
