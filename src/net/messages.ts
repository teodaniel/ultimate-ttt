import type { GameState, Mark } from "../game/types";

export type NetMessage =
  | { type: "HELLO"; payload: { mark: Mark } }
  | { type: "SYNC"; payload: { game: GameState } }
  | { type: "MOVE"; payload: { boardIndex: number; cellIndex: number } }
  | { type: "NEW_GAME" }
  | { type: "RESIGN" };
