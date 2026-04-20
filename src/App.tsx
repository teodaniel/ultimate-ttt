import { useState, useEffect } from "react";
import { useGameStore } from "./store/gameStore";
import { Lobby } from "./components/Lobby";
import { Game } from "./components/Game";

type Screen = "lobby" | "game";

export default function App() {
  const [screen, setScreen] = useState<Screen>("lobby");
  const setMode = useGameStore((state) => state.setMode);
  const newGame = useGameStore((state) => state.newGame);

  // Auto-join if URL contains ?join=<peerId>
  useEffect(() => {
    const joinId = new URLSearchParams(window.location.search).get("join");
    if (joinId) {
      setMode("online");
      newGame();
      setScreen("game");
    }
  }, [setMode, newGame]);

  if (screen === "game") {
    return <Game onBackToLobby={() => setScreen("lobby")} />;
  }

  return <Lobby onStartGame={() => setScreen("game")} />;
}
