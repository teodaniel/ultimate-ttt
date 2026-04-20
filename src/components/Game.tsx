import { useGameStore } from "../store/gameStore";
import { BigBoard } from "./BigBoard";
import { GameStatus } from "./GameStatus";

export function Game() {
  const newGame = useGameStore((state) => state.newGame);

  return (
    <div className="flex flex-col items-center gap-4 p-6">
      <h1 className="text-2xl font-bold">Ultimate Tic-Tac-Toe</h1>
      <GameStatus />
      <BigBoard />
      <button
        className="mt-4 px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700"
        onClick={newGame}
      >
        New Game
      </button>
    </div>
  );
}
