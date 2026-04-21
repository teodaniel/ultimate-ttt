import { useCallback, useEffect, useState } from "react";
import { useGameStore, GameMode } from "../store/gameStore";
import { usePeer } from "../net/usePeer";
import { PeerContext } from "../net/PeerContext";
import type { NetMessage } from "../net/messages";
import { BigBoard } from "./BigBoard";
import { GameStatus } from "./GameStatus";
import { ShareLink } from "./ShareLink";
import { ConfirmDialog } from "./ConfirmDialog";

interface GameProps {
  onBackToLobby: () => void;
  joinId?: string | null;
}

export function Game({ onBackToLobby, joinId }: GameProps) {
  const mode = useGameStore((state) => state.mode);
  const newGame = useGameStore((state) => state.newGame);
  const applyRemoteMove = useGameStore((state) => state.applyRemoteMove);
  const setMySymbol = useGameStore((state) => state.setMySymbol);
  const setGame = useGameStore((state) => state.setGame);
  const setMode = useGameStore((state) => state.setMode);
  const setFrozen = useGameStore((state) => state.setFrozen);

  const isOnline = mode === GameMode.Online;
  const isHost = isOnline && !joinId;

  const handleMessage = useCallback(
    (msg: NetMessage) => {
      if (msg.type === "HELLO") {
        setMySymbol(msg.payload.mark);
      } else if (msg.type === "SYNC") {
        setGame(msg.payload.game);
      } else if (msg.type === "MOVE") {
        applyRemoteMove(msg.payload.boardIndex, msg.payload.cellIndex);
      } else if (msg.type === "NEW_GAME") {
        newGame();
      }
    },
    [applyRemoteMove, setMySymbol, setGame, newGame],
  );

  const peer = usePeer(isOnline, joinId ?? null, handleMessage);

  const [confirm, setConfirm] = useState<{ message: string; action: () => void } | null>(null);

  const isDisconnected =
    isOnline &&
    (peer.connectionStatus === "disconnected" || peer.connectionStatus === "error");

  useEffect(() => {
    setFrozen(isDisconnected);
  }, [isDisconnected, setFrozen]);

  function handleNewGame() {
    setConfirm({
      message: "Start a new game? Current game progress will be lost.",
      action: () => {
        newGame();
        if (isOnline && peer.connectionStatus === "connected") {
          peer.send({ type: "NEW_GAME" });
        }
      },
    });
  }

  function handleBackToLobby() {
    setConfirm({
      message: "Go back to the lobby? Current game progress will be lost.",
      action: () => {
        setMySymbol(null);
        onBackToLobby();
      },
    });
  }

  return (
    <PeerContext.Provider value={peer}>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col items-center justify-center px-4 py-8 gap-6">
        <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">
          Ultimate Tic-Tac-Toe
        </h1>
        <GameStatus />
        {isHost && peer.connectionStatus !== "connected" && <ShareLink />}

        {isDisconnected && (
          <div className="w-full max-w-[480px] rounded-lg bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 px-4 py-4 flex flex-col items-center gap-3">
            <p className="text-sm text-red-700 dark:text-red-300 text-center">
              {peer.error ?? "Opponent disconnected."}
            </p>
            <div className="flex gap-2">
              <button
                className="px-4 py-1.5 bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-900 rounded-lg text-sm font-medium hover:bg-slate-700 dark:hover:bg-slate-300 active:scale-95 transition-all"
                onClick={() => { newGame(); setMode(GameMode.Hotseat); setMySymbol(null); }}
              >
                New local game
              </button>
              <button
                className="px-4 py-1.5 border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 rounded-lg text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-800 active:scale-95 transition-all"
                onClick={() => { setMySymbol(null); onBackToLobby(); }}
              >
                Back to lobby
              </button>
            </div>
          </div>
        )}

        <BigBoard />

        <div className="flex gap-3">
          <button
            className="px-5 py-2 bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-900 rounded-lg font-medium hover:bg-slate-700 dark:hover:bg-slate-300 active:scale-95 transition-all"
            onClick={handleNewGame}
          >
            New Game
          </button>
          <button
            className="px-5 py-2 border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 rounded-lg font-medium hover:bg-slate-100 dark:hover:bg-slate-800 active:scale-95 transition-all"
            onClick={handleBackToLobby}
          >
            Back to Lobby
          </button>
        </div>
      </div>

      {confirm && (
        <ConfirmDialog
          message={confirm.message}
          onConfirm={() => { confirm.action(); setConfirm(null); }}
          onCancel={() => setConfirm(null)}
        />
      )}
    </PeerContext.Provider>
  );
}
