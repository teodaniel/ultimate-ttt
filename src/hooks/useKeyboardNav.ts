import { useEffect, useCallback } from "react";
import type { BoardIndex, CellIndex } from "../game/types";

export function useKeyboardNav(activeBoard: BoardIndex | null, moveCount: number) {
  const focusCell = useCallback((board: BoardIndex, cell: CellIndex) => {
    const btn = document.querySelector<HTMLButtonElement>(
      `button[data-board="${board}"][data-cell="${cell}"]`,
    );
    btn?.focus();
  }, []);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (!["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key))
        return;

      const focused = document.activeElement as HTMLElement | null;
      const boardAttr = focused?.getAttribute("data-board");
      const cellAttr = focused?.getAttribute("data-cell");
      if (boardAttr === null || boardAttr === undefined) return;
      if (cellAttr === null || cellAttr === undefined) return;

      e.preventDefault();

      let board = parseInt(boardAttr) as BoardIndex;
      const cell = parseInt(cellAttr) as CellIndex;

      let row = Math.floor(cell / 3);
      let col = cell % 3;
      let boardRow = Math.floor(board / 3);
      let boardCol = board % 3;

      if (e.key === "ArrowRight") {
        col++;
        if (col > 2) {
          col = 0;
          if (activeBoard === null) {
            boardCol = (boardCol + 1) % 3;
            board = (boardRow * 3 + boardCol) as BoardIndex;
          }
        }
      } else if (e.key === "ArrowLeft") {
        col--;
        if (col < 0) {
          col = 2;
          if (activeBoard === null) {
            boardCol = (boardCol + 2) % 3;
            board = (boardRow * 3 + boardCol) as BoardIndex;
          }
        }
      } else if (e.key === "ArrowDown") {
        row++;
        if (row > 2) {
          row = 0;
          if (activeBoard === null) {
            boardRow = (boardRow + 1) % 3;
            board = (boardRow * 3 + boardCol) as BoardIndex;
          }
        }
      } else if (e.key === "ArrowUp") {
        row--;
        if (row < 0) {
          row = 2;
          if (activeBoard === null) {
            boardRow = (boardRow + 2) % 3;
            board = (boardRow * 3 + boardCol) as BoardIndex;
          }
        }
      }

      focusCell(board, (row * 3 + col) as CellIndex);
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeBoard, focusCell]);

  useEffect(() => {
    if (moveCount === 0) return;
    const selector =
      activeBoard !== null
        ? `button[data-board="${activeBoard}"]:not(:disabled)`
        : "button[data-board]:not(:disabled)";
    const btn = document.querySelector<HTMLButtonElement>(selector);
    btn?.focus();
  }, [moveCount, activeBoard]);
}
