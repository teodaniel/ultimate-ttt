import { useCallback, useEffect, useState } from "react";
import { useGameStore, GameMode } from "../store/gameStore";
import { useKeyboardNav } from "../hooks/useKeyboardNav";
import { useTimer } from "../hooks/useTimer";
import { usePeer } from "../net/usePeer";
import { PeerContext } from "../net/PeerContext";
import type { NetMessage } from "../net/messages";
import type { Mark } from "../game/types";
import { BigBoard } from "./BigBoard";
import { GameStatus } from "./GameStatus";
import { ShareLink } from "./ShareLink";
import { ConfirmDialog } from "./ConfirmDialog";
import { MoveHistory } from "./MoveHistory";
import { TimerDisplay } from "./TimerDisplay";

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
  const setFrozen = useGameStore((state) => state.setFrozen);
  const setTimerConfig = useGameStore((state) => state.setTimerConfig);
  const timerConfig = useGameStore((state) => state.timerConfig);
  const setGameWinner = useGameStore((state) => state.setGame);

  const isOnline = mode === GameMode.Online;
  const activeBoard = useGameStore((state) => state.game.activeBoard);
  const moveCount = useGameStore((state) => state.game.moveCount);
  useKeyboardNav(activeBoard, moveCount);
  const isHost = isOnline && !joinId;

  const handleTimeout = useCallback(
    (loser: Mark) => {
      const s = useGameStore.getState();
      setGameWinner({ ...s.game, winner: loser === "X" ? "O" : "X" });
    },
    [setGameWinner],
  );
  useTimer(handleTimeout);

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
      } else if (msg.type === "TIMER_CONFIG") {
        setTimerConfig(msg.payload);
      }
    },
    [applyRemoteMove, setMySymbol, setGame, newGame, setTimerConfig],
  );

  const peer = usePeer(isOnline, joinId ?? null, handleMessage);

  const [confirm, setConfirm] = useState<{
    message: string;
    action: () => void;
  } | null>(null);

  const isDisconnected =
    isOnline &&
    (peer.connectionStatus === "disconnected" ||
      peer.connectionStatus === "error");

  useEffect(() => {
    setFrozen(isDisconnected);
  }, [isDisconnected, setFrozen]);

  useEffect(() => {
    if (isHost && peer.connectionStatus === "connected" && timerConfig.enabled) {
      peer.send({ type: "TIMER_CONFIG", payload: timerConfig });
    }
  }, [isHost, peer.connectionStatus, peer, timerConfig]);

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
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 retro:bg-[#0d0d1a] flex flex-col items-center justify-center px-4 py-8 gap-6">
        <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100 retro:text-[#e0e0ff] retro:[font-family:'VT323',monospace] retro:text-4xl tracking-tight">
          Ultimate Tic-Tac-Toe
        </h1>
        <GameStatus />
        {isHost && peer.connectionStatus !== "connected" && <ShareLink />}

        <TimerDisplay />
        <BigBoard />

        <MoveHistory />

        <div className="flex gap-3">
          <button
            className="px-5 py-2 bg-slate-800 dark:bg-slate-200 retro:bg-transparent retro:border retro:border-[#ff2d78] retro:text-[#ff2d78] retro:[font-family:'VT323',monospace] retro:text-lg text-white dark:text-slate-900 rounded-lg font-medium hover:bg-slate-700 dark:hover:bg-slate-300 retro:hover:bg-[#ff2d78]/20 active:scale-95 transition-all"
            onClick={handleNewGame}
          >
            New Game
          </button>
          <button
            className="px-5 py-2 border border-slate-300 dark:border-slate-600 retro:border-[#00e5ff] retro:text-[#00e5ff] retro:[font-family:'VT323',monospace] retro:text-lg text-slate-600 dark:text-slate-300 rounded-lg font-medium hover:bg-slate-100 dark:hover:bg-slate-800 retro:hover:bg-[#00e5ff]/10 active:scale-95 transition-all"
            onClick={handleBackToLobby}
          >
            Back to Lobby
          </button>
        </div>
      </div>

      {confirm && (
        <ConfirmDialog
          message={confirm.message}
          onConfirm={() => {
            confirm.action();
            setConfirm(null);
          }}
          onCancel={() => setConfirm(null)}
        />
      )}
    </PeerContext.Provider>
  );
}
