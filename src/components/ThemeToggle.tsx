"use client";

import { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem("theme") as "dark" | "light" | null;
    setTheme(stored || "dark");
  }, []);

  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    document.documentElement.classList.add("transition-colors", "duration-300");
    localStorage.setItem("theme", next);
    setTimeout(() => {
      document.documentElement.classList.remove("transition-colors", "duration-300");
    }, 300);
  };

  if (!mounted) {
    return (
      <button
        className="flex items-center justify-center w-10 h-10 rounded-lg border border-white/10 bg-white/5"
        aria-label="Toggle theme"
      >
        <span className="w-5 h-5" />
      </button>
    );
  }

  return (
    <button
      onClick={toggle}
      className="flex items-center justify-center w-10 h-10 rounded-lg border border-border/50 bg-bg-secondary/50 hover:bg-bg-tertiary/80 text-text-secondary hover:text-accent-primary transition-colors duration-200"
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
    >
      {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}
