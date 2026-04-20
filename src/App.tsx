import { useState } from "react";
import { useGameStore } from "./store/gameStore";
import { Lobby } from "./components/Lobby";
import { Game } from "./components/Game";

type Screen = "lobby" | "game";

// Read once at module load — URL params don't change during the session
const initialJoinId = new URLSearchParams(window.location.search).get("join");

// Prime the store synchronously before first render if joining via URL
if (initialJoinId) {
  useGameStore.setState({ mode: "online" });
}

export default function App() {
  const [screen, setScreen] = useState<Screen>(initialJoinId ? "game" : "lobby");
  const [joinId] = useState<string | null>(initialJoinId);

  if (screen === "game") {
    return (
      <Game
        onBackToLobby={() => setScreen("lobby")}
        joinId={joinId}
      />
    );
  }

  return <Lobby onStartGame={() => setScreen("game")} />;
}
