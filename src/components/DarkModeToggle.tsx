"use client";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "./ThemeProvider";

export function DarkModeToggle({ className }: { className?: string }) {
  const { theme, toggle } = useTheme();
  return (
    <button
      onClick={toggle}
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      className={className}
      style={{
        minWidth: 44, minHeight: 44,
        display: "flex", alignItems: "center", justifyContent: "center",
        borderRadius: "9999px",
        background: "rgba(255,255,255,0.12)",
        border: "none", cursor: "pointer",
        transition: "background 0.2s",
        color: "white",
      }}
    >
      {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}
