import { useState } from "react";
import { useGameStore, GameMode } from "./store/gameStore";
import { useTheme } from "./hooks/useTheme";
import { Lobby } from "./components/Lobby";
import { Game } from "./components/Game";
import { Analytics } from "@vercel/analytics/react";

type Screen = "lobby" | "game";

const initialJoinId = new URLSearchParams(window.location.search).get("join");

if (initialJoinId) {
  useGameStore.setState({ mode: GameMode.Online });
}

function SunIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

function RetroIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm1 17.93V18a1 1 0 0 0-2 0v1.93A8 8 0 0 1 4.07 13H6a1 1 0 0 0 0-2H4.07A8 8 0 0 1 11 4.07V6a1 1 0 0 0 2 0V4.07A8 8 0 0 1 19.93 11H18a1 1 0 0 0 0 2h1.93A8 8 0 0 1 13 19.93zM12 10a2 2 0 1 0 2 2 2 2 0 0 0-2-2z" />
    </svg>
  );
}

export default function App() {
  const [screen, setScreen] = useState<Screen>(
    initialJoinId ? "game" : "lobby",
  );
  const [joinId] = useState<string | null>(initialJoinId);
  const { theme, toggle } = useTheme();

  return (
    <>
      <button
        onClick={toggle}
        className="fixed top-3 right-3 z-50 p-2 rounded-full bg-slate-200 dark:bg-slate-700 retro:bg-[#1a1a3e] retro:border retro:border-[#ff2d78] text-slate-700 dark:text-slate-200 retro:text-[#ff2d78] hover:bg-slate-300 dark:hover:bg-slate-600 retro:hover:bg-[#2a1a3e] transition-colors"
        aria-label="Cycle theme"
      >
        {theme === "dark" ? (
          <MoonIcon />
        ) : theme === "retro" ? (
          <RetroIcon />
        ) : (
          <SunIcon />
        )}
      </button>

      {screen === "game" ? (
        <Game onBackToLobby={() => setScreen("lobby")} joinId={joinId} />
      ) : (
        <Lobby onStartGame={() => setScreen("game")} />
      )}

      <Analytics />
    </>
  );
}
