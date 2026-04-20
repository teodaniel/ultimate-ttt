import { createContext, useContext } from "react";
import type { ConnectionStatus, UsePeerResult } from "./usePeer";
import type { NetMessage } from "./messages";

const noop = (_msg: NetMessage) => {};

const defaultValue: UsePeerResult = {
  myPeerId: null,
  connectionStatus: "idle" as ConnectionStatus,
  error: null,
  send: noop,
};

export const PeerContext = createContext<UsePeerResult>(defaultValue);

export function usePeerContext() {
  return useContext(PeerContext);
}
