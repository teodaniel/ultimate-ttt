import { WIN_LINES } from "./constants";
import type {
  GameState,
  SmallBoardState,
  CellValue,
  SmallBoardWinner,
  Mark,
  BoardIndex,
  CellIndex,
} from "./types";

export function createInitialState(): GameState {
  const emptyBoard = (): SmallBoardState => ({
    cells: Array<CellValue>(9).fill(null),
    winner: null,
  });
  return {
    boards: Array.from({ length: 9 }, emptyBoard),
    currentPlayer: "X",
    activeBoard: null,
    winner: null,
    moveCount: 0,
    lastMove: null,
  };
}

export function checkSmallBoardWinner(cells: CellValue[]): SmallBoardWinner {
  for (const [pos0, pos1, pos2] of WIN_LINES) {
    if (cells[pos0] && cells[pos0] === cells[pos1] && cells[pos0] === cells[pos2]) {
      return cells[pos0] as Mark;
    }
  }

  if (cells.every((cell) => cell !== null)) return "draw";

  return null;
}

export function checkBigBoardWinner(
  boards: SmallBoardState[],
): Mark | "draw" | null {
  const smallBoardWinners = boards.map((smallBoard) => smallBoard.winner);

  for (const [pos0, pos1, pos2] of WIN_LINES) {
    const lineWinner = smallBoardWinners[pos0];
    if (
      lineWinner &&
      lineWinner !== "draw" &&
      lineWinner === smallBoardWinners[pos1] &&
      lineWinner === smallBoardWinners[pos2]
    )
      return lineWinner;
  }

  if (smallBoardWinners.every((boardWinner) => boardWinner !== null)) return "draw";

  return null;
}

export function getNextActiveBoard(
  boards: SmallBoardState[],
  lastCellIndex: CellIndex,
): BoardIndex | null {
  const targetBoard = boards[lastCellIndex];
  return targetBoard.winner === null ? lastCellIndex : null;
}

export function isValidMove(
  state: GameState,
  boardIndex: BoardIndex,
  cellIndex: CellIndex,
): boolean {
  if (state.winner !== null) return false;
  if (state.activeBoard !== null && boardIndex !== state.activeBoard)
    return false;
  const board = state.boards[boardIndex];
  if (board.winner !== null) return false;
  if (board.cells[cellIndex] !== null) return false;
  return true;
}

export function applyMove(
  state: GameState,
  boardIndex: BoardIndex,
  cellIndex: CellIndex,
): GameState {
  if (!isValidMove(state, boardIndex, cellIndex)) {
    throw new Error(`Invalid move: board=${boardIndex} cell=${cellIndex}`);
  }

  const player = state.currentPlayer;

  const newCells = state.boards[boardIndex].cells.map((cell, idx) =>
    idx === cellIndex ? player : cell,
  );
  const smallWinner = checkSmallBoardWinner(newCells);
  const newBoard: SmallBoardState = { cells: newCells, winner: smallWinner };

  const newBoards = state.boards.map((smallBoard, idx) =>
    idx === boardIndex ? newBoard : smallBoard,
  );

  const bigWinner = checkBigBoardWinner(newBoards);
  const nextActive = getNextActiveBoard(newBoards, cellIndex);

  return {
    boards: newBoards,
    currentPlayer: player === "X" ? "O" : "X",
    activeBoard: nextActive,
    winner: bigWinner,
    moveCount: state.moveCount + 1,
    lastMove: { boardIndex, cellIndex, player },
  };
}
