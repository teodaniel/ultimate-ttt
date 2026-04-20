import { useGameStore } from "../store/gameStore";
import { SmallBoard } from "./SmallBoard";

export function BigBoard() {
  const activeBoard = useGameStore((state) => state.game.activeBoard);
  const boards = useGameStore((state) => state.game.boards);
  const gameWinner = useGameStore((state) => state.game.winner);

  function isSmallBoardActive(boardIndex: number): boolean {
    if (gameWinner !== null) return false;
    if (activeBoard === null) return boards[boardIndex].winner === null;
    return boardIndex === activeBoard;
  }

  return (
    <div className="grid grid-cols-3 gap-2 border-2 border-gray-700 p-2">
      {boards.map((_, boardIndex) => (
        <SmallBoard
          key={boardIndex}
          boardIndex={boardIndex}
          isActive={isSmallBoardActive(boardIndex)}
        />
      ))}
    </div>
  );
}
