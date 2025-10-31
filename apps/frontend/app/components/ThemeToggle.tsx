"use client";

import { MoonIcon, SunIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const [isDark, setIsDark] = useState(false);

  // Initialize theme on mount
  useEffect(() => {
    setMounted(true);
    // Check current theme from DOM and localStorage
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const shouldBeDark = savedTheme === "dark" || (!savedTheme && prefersDark);

    setIsDark(shouldBeDark);

    // Ensure DOM is in sync
    if (shouldBeDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  // Toggle theme handler
  const toggleTheme = () => {
    const newDarkMode = !isDark;
    setIsDark(newDarkMode);

    // Update DOM
    const root = document.documentElement;
    if (newDarkMode) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
      console.log("Theme switched to DARK mode");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
      console.log("Theme switched to LIGHT mode");
    }

    // Log the current state for debugging
    console.log("HTML classes:", root.classList.toString());
    console.log("CSS variables:", {
      background: getComputedStyle(root).getPropertyValue("--background"),
      foreground: getComputedStyle(root).getPropertyValue("--foreground"),
    });
  };

  // Avoid hydration mismatch by not rendering until mounted
  if (!mounted) {
    return (
      <button
        className="inline-flex h-10 w-10 items-center justify-center rounded-md"
        aria-label="Toggle theme"
        disabled
      >
        <MoonIcon className="h-5 w-5 opacity-50" />
      </button>
    );
  }

  return (
    <button
      className="inline-flex h-10 w-10 items-center justify-center rounded-md transition-colors hover:bg-accent"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      onClick={toggleTheme}
    >
      {isDark ? (
        <SunIcon className="h-5 w-5" />
      ) : (
        <MoonIcon className="h-5 w-5" />
      )}
    </button>
  );
}

