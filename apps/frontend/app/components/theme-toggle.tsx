import { useTheme } from "../context/theme-provider";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="p-2 rounded-full hover:bg-muted transition-colors"
      aria-label="Toggle theme"
      type="button"
    >
      {theme === "dark" ? (
        <Sun className="w-5 h-5 text-white-400" />
      ) : (
        <Moon className="w-5 h-5 text-gray-700" />
      )}
    </button>
  );
}

export default ThemeToggle;
