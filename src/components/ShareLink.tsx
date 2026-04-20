import { useState } from "react";
import { usePeerContext } from "../net/PeerContext";

export function ShareLink() {
  const { myPeerId, connectionStatus } = usePeerContext();
  const [copied, setCopied] = useState(false);

  if (!myPeerId) {
    return (
      <p className="text-sm text-slate-500 animate-pulse">
        Setting up connection…
      </p>
    );
  }

  if (connectionStatus === "connected") return null;

  const inviteUrl = `${window.location.origin}${window.location.pathname}?join=${myPeerId}`;

  function copyLink() {
    navigator.clipboard.writeText(inviteUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div className="flex flex-col items-center gap-2 w-full max-w-sm">
      <p className="text-sm font-medium text-slate-600">
        Share this link with your opponent:
      </p>
      <div className="flex gap-2 w-full">
        <input
          readOnly
          value={inviteUrl}
          className="flex-1 text-xs border border-slate-300 rounded px-2 py-1.5 bg-white text-slate-700 min-w-0"
        />
        <button
          onClick={copyLink}
          className="px-3 py-1.5 bg-slate-800 text-white text-xs rounded hover:bg-slate-700 transition-colors whitespace-nowrap"
        >
          {copied ? "Copied!" : "Copy link"}
        </button>
      </div>
      <p className="text-xs text-slate-400 animate-pulse">
        Waiting for opponent…
      </p>
    </div>
  );
}
