import { create } from "zustand";
import { createInitialState, applyMove, isValidMove } from "../game/logic";
import type {
  GameState,
  BoardIndex,
  CellIndex,
  CellValue,
  Mark,
} from "../game/types";

export interface TimerConfig {
  enabled: boolean;
  limitSeconds: number;
}

export type Theme = "light" | "dark" | "retro";

function getInitialTheme(): Theme {
  const stored = localStorage.getItem("theme");
  if (stored === "dark" || stored === "light" || stored === "retro") return stored;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export const GameMode = {
  Hotseat: "hotseat",
  Online: "online",
} as const;
export type GameMode = (typeof GameMode)[keyof typeof GameMode];

interface GameStore {
  game: GameState;
  mode: GameMode;
  mySymbol: CellValue;
  frozen: boolean;
  theme: Theme;
  stateHistory: GameState[];
  historyIndex: number;
  isViewingHistory: boolean;
  timerConfig: TimerConfig;
  timerRemaining: Record<Mark, number>;

  newGame: () => void;
  setGame: (game: GameState) => void;
  setMode: (mode: GameMode) => void;
  setMySymbol: (symbol: CellValue) => void;
  setFrozen: (frozen: boolean) => void;
  setTheme: (theme: Theme) => void;
  setTimerConfig: (config: TimerConfig) => void;
  tickTimer: (player: Mark, ms: number) => void;
  resetTimerForPlayer: (player: Mark) => void;
  makeMove: (boardIndex: BoardIndex, cellIndex: CellIndex) => boolean;
  applyRemoteMove: (boardIndex: BoardIndex, cellIndex: CellIndex) => boolean;
  stepBack: () => void;
  stepForward: () => void;
  jumpToMove: (index: number) => void;
  undoMove: () => void;
}

function _apply(
  game: GameState,
  boardIndex: BoardIndex,
  cellIndex: CellIndex,
  set: (fn: (s: GameStore) => Partial<GameStore>) => void,
): boolean {
  if (!isValidMove(game, boardIndex, cellIndex)) return false;
  const newGame = applyMove(game, boardIndex, cellIndex);
  set((s) => ({
    game: newGame,
    stateHistory: [...s.stateHistory.slice(0, s.historyIndex + 1), newGame],
    historyIndex: s.historyIndex + 1,
    isViewingHistory: false,
    timerRemaining: {
      ...s.timerRemaining,
      [game.currentPlayer]: s.timerConfig.limitSeconds * 1000,
    },
  }));
  return true;
}

const initialState = createInitialState();
const DEFAULT_TIMER: TimerConfig = { enabled: false, limitSeconds: 30 };

export const useGameStore = create<GameStore>((set, get) => ({
  game: initialState,
  mode: GameMode.Hotseat,
  mySymbol: null,
  frozen: false,
  theme: getInitialTheme(),
  stateHistory: [initialState],
  historyIndex: 0,
  isViewingHistory: false,
  timerConfig: DEFAULT_TIMER,
  timerRemaining: { X: DEFAULT_TIMER.limitSeconds * 1000, O: DEFAULT_TIMER.limitSeconds * 1000 },

  newGame: () => {
    const s = createInitialState();
    const limit = get().timerConfig.limitSeconds * 1000;
    set({
      game: s,
      frozen: false,
      stateHistory: [s],
      historyIndex: 0,
      isViewingHistory: false,
      timerRemaining: { X: limit, O: limit },
    });
  },
  setGame: (game) => set({ game }),
  setMode: (mode) => set({ mode }),
  setMySymbol: (symbol) => set({ mySymbol: symbol }),
  setFrozen: (frozen) => set({ frozen }),
  setTheme: (theme) => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    document.documentElement.classList.toggle("retro", theme === "retro");
    localStorage.setItem("theme", theme);
    set({ theme });
  },
  setTimerConfig: (config) => {
    const limit = config.limitSeconds * 1000;
    set({ timerConfig: config, timerRemaining: { X: limit, O: limit } });
  },
  tickTimer: (player, ms) =>
    set((s) => ({
      timerRemaining: {
        ...s.timerRemaining,
        [player]: Math.max(0, s.timerRemaining[player] - ms),
      },
    })),
  resetTimerForPlayer: (player) =>
    set((s) => ({
      timerRemaining: {
        ...s.timerRemaining,
        [player]: s.timerConfig.limitSeconds * 1000,
      },
    })),

  makeMove: (boardIndex, cellIndex) =>
    _apply(get().game, boardIndex, cellIndex, set),

  applyRemoteMove: (boardIndex, cellIndex) =>
    _apply(get().game, boardIndex, cellIndex, set),

  stepBack: () =>
    set((s) => {
      const idx = Math.max(0, s.historyIndex - 1);
      return { historyIndex: idx, game: s.stateHistory[idx], isViewingHistory: idx < s.stateHistory.length - 1 };
    }),

  stepForward: () =>
    set((s) => {
      const idx = Math.min(s.stateHistory.length - 1, s.historyIndex + 1);
      return { historyIndex: idx, game: s.stateHistory[idx], isViewingHistory: idx < s.stateHistory.length - 1 };
    }),

  jumpToMove: (index) =>
    set((s) => {
      const idx = Math.max(0, Math.min(s.stateHistory.length - 1, index));
      return { historyIndex: idx, game: s.stateHistory[idx], isViewingHistory: idx < s.stateHistory.length - 1 };
    }),

  undoMove: () =>
    set((s) => {
      if (s.isViewingHistory || s.historyIndex === 0) return {};
      const idx = s.historyIndex - 1;
      return {
        stateHistory: s.stateHistory.slice(0, s.historyIndex),
        historyIndex: idx,
        game: s.stateHistory[idx],
        isViewingHistory: false,
      };
    }),
}));
