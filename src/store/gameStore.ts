import { create } from "zustand";
import { createInitialState, applyMove, isValidMove } from "../game/logic";
import type {
  GameState,
  BoardIndex,
  CellIndex,
  CellValue,
} from "../game/types";

interface GameStore {
  game: GameState;
  mode: "hotseat" | "online";
  mySymbol: CellValue;

  newGame: () => void;
  setGame: (game: GameState) => void;
  setMode: (mode: "hotseat" | "online") => void;
  setMySymbol: (symbol: CellValue) => void;
  makeMove: (boardIndex: BoardIndex, cellIndex: CellIndex) => boolean;
  applyRemoteMove: (boardIndex: BoardIndex, cellIndex: CellIndex) => boolean;
}

function _apply(
  game: GameState,
  boardIndex: BoardIndex,
  cellIndex: CellIndex,
  set: (partial: Partial<GameStore>) => void,
): boolean {
  if (!isValidMove(game, boardIndex, cellIndex)) return false;
  set({ game: applyMove(game, boardIndex, cellIndex) });
  return true;
}

export const useGameStore = create<GameStore>((set, get) => ({
  game: createInitialState(),
  mode: "hotseat",
  mySymbol: null,

  newGame: () => set({ game: createInitialState() }),
  setGame: (game) => set({ game }),
  setMode: (mode) => set({ mode }),
  setMySymbol: (symbol) => set({ mySymbol: symbol }),

  makeMove: (boardIndex, cellIndex) =>
    _apply(get().game, boardIndex, cellIndex, set),

  applyRemoteMove: (boardIndex, cellIndex) =>
    _apply(get().game, boardIndex, cellIndex, set),
}));
