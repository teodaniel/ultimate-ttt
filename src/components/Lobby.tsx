import { useGameStore, GameMode } from "../store/gameStore";
import beforeImageDark from "../assets/beforeBoardDark.png";
import beforeImageLight from "../assets/beforeBoardLight.png";
import afterImageDark from "../assets/afterBoardDark.png";
import afterImageLight from "../assets/afterBoardLight.png";
import winImageDark from "../assets/winBoardDark.png";
import winImageLight from "../assets/winBoardLight.png";

const TIMER_OPTIONS = [
  { label: "10s", value: 10 },
  { label: "30s", value: 30 },
  { label: "1 min", value: 60 },
  { label: "2 min", value: 120 },
];

interface LobbyProps {
  onStartGame: () => void;
}

export function Lobby({ onStartGame }: LobbyProps) {
  const setMode = useGameStore((state) => state.setMode);
  const newGame = useGameStore((state) => state.newGame);
  const theme = useGameStore((state) => state.theme);
  const timerConfig = useGameStore((state) => state.timerConfig);
  const setTimerConfig = useGameStore((state) => state.setTimerConfig);
  const useDarkImages = theme !== "light";

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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 retro:bg-[#0d0d1a] flex flex-col items-center justify-center px-4 py-8 gap-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-slate-800 dark:text-slate-100 retro:text-[#e0e0ff] retro:[font-family:'VT323',monospace] retro:text-5xl tracking-tight">
          Ultimate Tic-Tac-Toe
        </h1>
        <p className="mt-2 text-slate-500 dark:text-slate-400 retro:text-[#e0e0ff]/60">
          3×3 boards inside a 3×3 board
        </p>
      </div>

      <div className="w-full max-w-xs text-sm text-slate-600 dark:text-slate-300 retro:text-[#e0e0ff]/70 space-y-4">
        <p>
          Ultimate Tic-Tac-Toe is a strategic and challenging version of the
          classic Tic-Tac-Toe game. Instead of playing on a single 3x3 grid, you
          play on a larger board that contains nine smaller Tic-Tac-Toe boards
          arranged in a 3x3 pattern.
        </p>
        <p>
          Players can only play on active fields which depends on your
          opponent's last move. If that board is already won or full, they can
          play anywhere. Capture three fields in a row to win.
        </p>

        <div className="flex flex-col gap-6 mt-4">
          <div className="flex flex-col justify-center gap-1">
            <div className="flex justify-center gap-4">
              <img
                src={useDarkImages ? beforeImageDark : beforeImageLight}
                className="flex-1 min-w-0 h-auto rounded-md object-contain"
                alt="Red plays 'O' the third active cell in the board"
              />
              <img
                src={useDarkImages ? afterImageDark : afterImageLight}
                className="flex-1 min-w-0 h-auto rounded-md object-contain"
                alt="The third field is highlighted and Blue must play there"
              />
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 retro:text-[#e0e0ff]/50 text-center">
              Red plays the third active cell, Blue must play in the third field
              on the board
            </p>
          </div>

          <div className="flex flex-col items-center gap-1">
            <img
              src={useDarkImages ? winImageDark : winImageLight}
              className="w-full max-w-[200px] h-auto rounded-md object-contain"
              alt="Scenario where 'X' wins"
            />
            <p className="text-xs text-slate-500 dark:text-slate-400 retro:text-[#e0e0ff]/50 text-center">
              Blue wins with 3 fields captured in a row.
            </p>
          </div>
        </div>
      </div>

      <div className="w-full max-w-xs flex flex-col gap-2">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={timerConfig.enabled}
            onChange={(e) =>
              setTimerConfig({ ...timerConfig, enabled: e.target.checked })
            }
            className="w-4 h-4 accent-slate-700 dark:accent-slate-300 retro:accent-[#ff2d78]"
          />
          <span className="text-sm text-slate-600 dark:text-slate-300 retro:text-[#e0e0ff]/70">
            Turn timer
          </span>
        </label>

        {timerConfig.enabled && (
          <div className="flex gap-2">
            {TIMER_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() =>
                  setTimerConfig({ ...timerConfig, limitSeconds: opt.value })
                }
                className={`flex-1 py-1.5 text-sm rounded-md border transition-all ${
                  timerConfig.limitSeconds === opt.value
                    ? "bg-slate-800 dark:bg-slate-200 retro:bg-[#ff2d78]/20 retro:border-[#ff2d78] text-white dark:text-slate-900 retro:text-[#ff2d78] border-transparent"
                    : "border-slate-300 dark:border-slate-600 retro:border-[#3a3a6a] text-slate-600 dark:text-slate-300 retro:text-[#e0e0ff]/60 hover:bg-slate-100 dark:hover:bg-slate-800 retro:hover:bg-[#1a1a3e]"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-3 w-full max-w-xs">
        <button
          className="px-6 py-3 bg-slate-800 dark:bg-slate-200 retro:bg-transparent retro:border retro:border-[#ff2d78] retro:text-[#ff2d78] retro:[font-family:'VT323',monospace] retro:text-xl text-white dark:text-slate-900 rounded-lg font-medium text-lg hover:bg-slate-700 dark:hover:bg-slate-300 retro:hover:bg-[#ff2d78]/20 active:scale-95 transition-all"
          onClick={startHotseat}
        >
          Play local
        </button>

        <button
          className="px-6 py-3 bg-blue-600 dark:bg-blue-500 retro:bg-transparent retro:border retro:border-[#00e5ff] retro:text-[#00e5ff] retro:[font-family:'VT323',monospace] retro:text-xl text-white rounded-lg font-medium text-lg hover:bg-blue-500 dark:hover:bg-blue-400 retro:hover:bg-[#00e5ff]/10 active:scale-95 transition-all"
          onClick={startOnline}
        >
          Create online game
        </button>
      </div>
    </div>
  );
}
