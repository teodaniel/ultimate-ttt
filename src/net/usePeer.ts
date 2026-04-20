import { useEffect, useRef, useState, useCallback } from "react";
import type { NetMessage } from "./messages";
import { useGameStore } from "../store/gameStore";

export type ConnectionStatus =
  | "idle"
  | "waiting"
  | "connected"
  | "disconnected"
  | "error";

export interface UsePeerResult {
  myPeerId: string | null;
  connectionStatus: ConnectionStatus;
  error: string | null;
  send: (msg: NetMessage) => void;
}

export function usePeer(
  enabled: boolean,
  hostId: string | null,
  onMessage: (msg: NetMessage) => void,
): UsePeerResult {
  const [myPeerId, setMyPeerId] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] =
    useState<ConnectionStatus>("idle");
  const [error, setError] = useState<string | null>(null);

  const onMessageRef = useRef(onMessage);
  useEffect(() => {
    onMessageRef.current = onMessage;
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const connRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const peerRef = useRef<any>(null);

  const send = useCallback((msg: NetMessage) => {
    connRef.current?.send(msg);
  }, []);

  useEffect(() => {
    if (!enabled) return;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let peer: any;

    async function init() {
      const { Peer } = await import("peerjs");
      peer = new Peer();
      peerRef.current = peer;

      peer.on("open", (id: string) => {
        setMyPeerId(id);

        if (hostId) {
          // Guest: connect to host
          const conn = peer.connect(hostId, { reliable: true });
          connRef.current = conn;
          setConnectionStatus("waiting");

          conn.on("open", () => setConnectionStatus("connected"));
          conn.on("data", (data: unknown) =>
            onMessageRef.current(data as NetMessage),
          );
          conn.on("close", () => setConnectionStatus("disconnected"));
          conn.on("error", () => setConnectionStatus("error"));
        } else {
          // Host: wait for incoming connection
          setConnectionStatus("waiting");
          peer.on("connection", (conn: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
            connRef.current = conn;
            conn.on("open", () => {
              setConnectionStatus("connected");
              conn.send({ type: "HELLO", payload: { mark: "O" } } satisfies NetMessage);
              // Send current board state so a rejoining guest is always in sync
              conn.send({ type: "SYNC", payload: { game: useGameStore.getState().game } } satisfies NetMessage);
            });
            conn.on("data", (data: unknown) =>
              onMessageRef.current(data as NetMessage),
            );
            conn.on("close", () => setConnectionStatus("disconnected"));
            conn.on("error", () => setConnectionStatus("error"));
          });
        }
      });

      peer.on("error", (err: { type: string }) => {
        setConnectionStatus("error");
        setError(
          err.type === "peer-unavailable"
            ? "Could not connect — check the link."
            : "Connection error. Please try again.",
        );
      });
    }

    init().catch(() => {
      setConnectionStatus("error");
      setError("Failed to initialize connection.");
    });

    return () => {
      peer?.destroy();
      peerRef.current = null;
      connRef.current = null;
    };
  }, [enabled, hostId]);

  return { myPeerId, connectionStatus, error, send };
}
