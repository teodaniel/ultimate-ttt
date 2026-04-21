import { useEffect } from "react";
import { useGameStore } from "../store/gameStore";
import type { Mark } from "../game/types";

export function useTimer(onTimeout: (loser: Mark) => void) {
  const timerConfig = useGameStore((state) => state.timerConfig);
  const timerRemaining = useGameStore((state) => state.timerRemaining);
  const currentPlayer = useGameStore((state) => state.game.currentPlayer);
  const gameWinner = useGameStore((state) => state.game.winner);
  const isViewingHistory = useGameStore((state) => state.isViewingHistory);
  const tickTimer = useGameStore((state) => state.tickTimer);

  useEffect(() => {
    if (!timerConfig.enabled || gameWinner || isViewingHistory) return;

    const interval = setInterval(() => {
      const remaining = useGameStore.getState().timerRemaining[currentPlayer];
      if (remaining <= 0) {
        onTimeout(currentPlayer);
        return;
      }
      tickTimer(currentPlayer, 100);
    }, 100);

    return () => clearInterval(interval);
  }, [timerConfig.enabled, currentPlayer, gameWinner, isViewingHistory, tickTimer, onTimeout]);

  return { timerRemaining, timerConfig };
}
