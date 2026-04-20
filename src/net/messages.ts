import type { Mark } from "../game/types";

export type NetMessage =
  | { type: "HELLO"; payload: { mark: Mark } }
  | { type: "MOVE"; payload: { boardIndex: number; cellIndex: number } }
  | { type: "NEW_GAME" }
  | { type: "RESIGN" };
