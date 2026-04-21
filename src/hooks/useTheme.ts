import { useEffect } from "react";
import { useGameStore } from "../store/gameStore";

export function useTheme() {
  const theme = useGameStore((state) => state.theme);
  const setTheme = useGameStore((state) => state.setTheme);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    document.documentElement.classList.toggle("retro", theme === "retro");
  }, [theme]);

  const cycle: Record<string, "light" | "dark" | "retro"> = { light: "dark", dark: "retro", retro: "light" };
  const toggle = () => setTheme(cycle[theme]);

  return { theme, toggle };
}
