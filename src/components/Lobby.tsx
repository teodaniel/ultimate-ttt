import { useGameStore, GameMode } from "../store/gameStore";

interface LobbyProps {
  onStartGame: () => void;
}

export function Lobby({ onStartGame }: LobbyProps) {
  const setMode = useGameStore((state) => state.setMode);
  const newGame = useGameStore((state) => state.newGame);

  function startHotseat() {
    setMode(GameMode.Hotseat);
    newGame();
    onStartGame();
  }

  function startOnline() {
    setMode(GameMode.Online);
    newGame();
    onStartGame();
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col items-center justify-center px-4 gap-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">
          Ultimate Tic-Tac-Toe
        </h1>
        <p className="mt-2 text-slate-500 dark:text-slate-400">3×3 boards inside a 3×3 board</p>
      </div>

      <div className="w-full max-w-xs text-sm text-slate-600 dark:text-slate-300 space-y-4">
        <p>
          Your move sends your opponent to a specific board — whichever small
          grid matches the cell you played in. If that board is already won or
          full, they can play anywhere. Win three boards in a row to win.
        </p>

        <div className="flex gap-4 justify-center">
          {/* Panel A: forced board rule */}
          <div className="flex flex-col items-center gap-1">
            <svg width="108" height="108" viewBox="0 0 108 108" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* 3x3 big grid lines */}
              <line x1="36" y1="2" x2="36" y2="106" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.3"/>
              <line x1="72" y1="2" x2="72" y2="106" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.3"/>
              <line x1="2" y1="36" x2="106" y2="36" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.3"/>
              <line x1="2" y1="72" x2="106" y2="72" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.3"/>
              {/* Highlight: top-right board (index 2) — where opponent played cell 2 */}
              <rect x="74" y="2" width="32" height="32" rx="3" fill="#6366f1" fillOpacity="0.25" stroke="#6366f1" strokeWidth="1.5"/>
              {/* X played in top-center board, cell 2 (top-right of that board) */}
              {/* top-center board spans x:37–71, y:2–35. Cell 2 = col2,row0 → x:61–71,y:2–12 */}
              <rect x="62" y="3" width="8" height="8" rx="1" fill="#2563eb" fillOpacity="0.6"/>
              {/* Arrow from that cell pointing right to the top-right board */}
              <path d="M71 7 L73 7" stroke="#6366f1" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M71 7 L74 7" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" markerEnd="url(#arr)"/>
              <defs>
                <marker id="arr" markerWidth="4" markerHeight="4" refX="2" refY="2" orient="auto">
                  <path d="M0,0 L4,2 L0,4 Z" fill="#6366f1"/>
                </marker>
              </defs>
              {/* Label in highlighted board */}
              <text x="90" y="23" textAnchor="middle" fontSize="8" fill="#6366f1" fontWeight="bold">next</text>
            </svg>
            <p className="text-xs text-slate-500 dark:text-slate-400 text-center">Cell played → board sent to</p>
          </div>

          {/* Panel B: win condition */}
          <div className="flex flex-col items-center gap-1">
            <svg width="108" height="108" viewBox="0 0 108 108" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* 3x3 big grid lines */}
              <line x1="36" y1="2" x2="36" y2="106" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.3"/>
              <line x1="72" y1="2" x2="72" y2="106" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.3"/>
              <line x1="2" y1="36" x2="106" y2="36" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.3"/>
              <line x1="2" y1="72" x2="106" y2="72" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.3"/>
              {/* Diagonal win: boards 0, 4, 8 (top-left, center, bottom-right) */}
              {/* Board 0: x:2–35, y:2–35 */}
              <rect x="3" y="3" width="32" height="32" rx="3" fill="#2563eb" fillOpacity="0.15"/>
              <text x="19" y="25" textAnchor="middle" fontSize="20" fill="#2563eb" fontWeight="900" fontFamily="serif">X</text>
              {/* Board 4: x:38–71, y:38–71 */}
              <rect x="38" y="38" width="32" height="32" rx="3" fill="#2563eb" fillOpacity="0.15"/>
              <text x="54" y="60" textAnchor="middle" fontSize="20" fill="#2563eb" fontWeight="900" fontFamily="serif">X</text>
              {/* Board 8: x:74–106, y:74–106 */}
              <rect x="74" y="74" width="32" height="32" rx="3" fill="#2563eb" fillOpacity="0.15"/>
              <text x="90" y="96" textAnchor="middle" fontSize="20" fill="#2563eb" fontWeight="900" fontFamily="serif">X</text>
              {/* Diagonal strike-through */}
              <line x1="8" y1="8" x2="100" y2="100" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round" strokeOpacity="0.5"/>
            </svg>
            <p className="text-xs text-slate-500 dark:text-slate-400 text-center">Win 3 boards in a row</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 w-full max-w-xs">
        <button
          className="px-6 py-3 bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-900 rounded-lg font-medium text-lg hover:bg-slate-700 dark:hover:bg-slate-300 active:scale-95 transition-all"
          onClick={startHotseat}
        >
          Play local (hot-seat)
        </button>

        <button
          className="px-6 py-3 bg-indigo-600 dark:bg-indigo-500 text-white rounded-lg font-medium text-lg hover:bg-indigo-500 dark:hover:bg-indigo-400 active:scale-95 transition-all"
          onClick={startOnline}
        >
          Create online game
        </button>
      </div>
    </div>
  );
}
