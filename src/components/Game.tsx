import { useCallback, useEffect } from "react";
import { useGameStore } from "../store/gameStore";
import { usePeer } from "../net/usePeer";
import { PeerContext } from "../net/PeerContext";
import type { NetMessage } from "../net/messages";
import { BigBoard } from "./BigBoard";
import { GameStatus } from "./GameStatus";
import { ShareLink } from "./ShareLink";

interface GameProps {
  onBackToLobby: () => void;
  joinId?: string | null;
}

export function Game({ onBackToLobby, joinId }: GameProps) {
  const mode = useGameStore((state) => state.mode);
  const newGame = useGameStore((state) => state.newGame);
  const applyRemoteMove = useGameStore((state) => state.applyRemoteMove);
  const setMySymbol = useGameStore((state) => state.setMySymbol);

  const isOnline = mode === "online";
  const isHost = isOnline && !joinId;

  const handleMessage = useCallback(
    (msg: NetMessage) => {
      if (msg.type === "HELLO") {
        setMySymbol(msg.payload.mark);
      } else if (msg.type === "MOVE") {
        applyRemoteMove(msg.payload.boardIndex, msg.payload.cellIndex);
      } else if (msg.type === "NEW_GAME") {
        newGame();
      }
    },
    [applyRemoteMove, setMySymbol, newGame],
  );

  const peer = usePeer(isOnline, joinId ?? null, handleMessage);

  // Host is always X; set mySymbol once the peer ID is assigned
  useEffect(() => {
    if (isHost && peer.myPeerId) {
      setMySymbol("X");
    }
  }, [isHost, peer.myPeerId, setMySymbol]);

  const isDisconnected =
    isOnline &&
    (peer.connectionStatus === "disconnected" || peer.connectionStatus === "error");

  function handleNewGame() {
    newGame();
    if (isOnline && peer.connectionStatus === "connected") {
      peer.send({ type: "NEW_GAME" });
    }
  }

  function handleBackToLobby() {
    setMySymbol(null);
    onBackToLobby();
  }

  return (
    <PeerContext.Provider value={peer}>
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-4 py-8 gap-6">
        <h1 className="text-3xl font-bold text-slate-800 tracking-tight">
          Ultimate Tic-Tac-Toe
        </h1>
        <GameStatus />
        {isHost && peer.connectionStatus !== "connected" && <ShareLink />}

        {isDisconnected && (
          <div className="w-full max-w-[480px] rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700 text-center">
            {peer.error ?? "Opponent disconnected. You can start a new game or go back to the lobby."}
          </div>
        )}

        <BigBoard />

        <div className="flex gap-3">
          <button
            className="px-5 py-2 bg-slate-800 text-white rounded-lg font-medium hover:bg-slate-700 active:scale-95 transition-all"
            onClick={handleNewGame}
          >
            New Game
          </button>
          <button
            className="px-5 py-2 border border-slate-300 text-slate-600 rounded-lg font-medium hover:bg-slate-100 active:scale-95 transition-all"
            onClick={handleBackToLobby}
          >
            Back to Lobby
          </button>
        </div>
      </div>
    </PeerContext.Provider>
  );
}
