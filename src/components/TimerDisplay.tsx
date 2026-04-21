import { useGameStore } from "../store/gameStore";
import type { Theme } from "../store/gameStore";

const markColors: Record<Theme, Record<string, string>> = {
  light: { X: "text-blue-600", O: "text-red-500" },
  dark:  { X: "text-blue-600", O: "text-red-500" },
  retro: { X: "text-[#ff2d78]", O: "text-[#00e5ff]" },
};

function formatTime(ms: number): string {
  const totalSeconds = Math.ceil(ms / 1000);
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return m > 0 ? `${m}:${s.toString().padStart(2, "0")}` : `${s}s`;
}

export function TimerDisplay() {
  const timerConfig = useGameStore((state) => state.timerConfig);
  const timerRemaining = useGameStore((state) => state.timerRemaining);
  const currentPlayer = useGameStore((state) => state.game.currentPlayer);
  const gameWinner = useGameStore((state) => state.game.winner);
  const theme = useGameStore((state) => state.theme);

  if (!timerConfig.enabled) return null;

  const mc = markColors[theme];
  const marks = ["X", "O"] as const;

  return (
    <div className="flex gap-4">
      {marks.map((mark) => {
        const remaining = timerRemaining[mark];
        const isActive = currentPlayer === mark && !gameWinner;
        const isLow = remaining <= 10_000;

        return (
          <div
            key={mark}
            className={`flex flex-col items-center px-4 py-2 rounded-lg border transition-all ${
              isActive
                ? "border-current shadow-sm scale-105"
                : "border-slate-200 dark:border-slate-700 retro:border-[#3a3a6a] opacity-60"
            } ${mc[mark]}`}
          >
            <span className="text-xs font-semibold uppercase tracking-wide opacity-70">
              {mark}
            </span>
            <span
              className={`text-2xl font-bold tabular-nums ${isLow && isActive ? "animate-pulse" : ""}`}
              style={theme === "retro" ? { fontFamily: "'VT323', monospace" } : undefined}
            >
              {formatTime(remaining)}
            </span>
          </div>
        );
      })}
    </div>
  );
}
