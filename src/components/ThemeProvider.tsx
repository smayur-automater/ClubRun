"use client";
import { createContext, useContext, useEffect, useSyncExternalStore } from "react";

type Theme = "dark" | "light";

/**
 * Theme state lives in localStorage (the external store); React subscribes
 * via useSyncExternalStore, so there is no setState-in-effect and the server
 * snapshot is always "dark" — the default register (docs/DESIGN_SYSTEM.md).
 */
const listeners = new Set<() => void>();

function readTheme(): Theme {
  return (localStorage.getItem("cr.theme") as Theme | null) ?? "dark";
}

function writeTheme(next: Theme): void {
  localStorage.setItem("cr.theme", next);
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

const ThemeContext = createContext<{ theme: Theme; toggle: () => void }>({
  theme: "dark",
  toggle: () => {},
});

export function useTheme() {
  return useContext(ThemeContext);
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useSyncExternalStore(subscribe, readTheme, () => "dark" as Theme);

  useEffect(() => {
    document.documentElement.classList.toggle("light", theme === "light");
  }, [theme]);

  const toggle = () => writeTheme(theme === "dark" ? "light" : "dark");

  return <ThemeContext.Provider value={{ theme, toggle }}>{children}</ThemeContext.Provider>;
}
