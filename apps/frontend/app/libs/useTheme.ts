// --- app/libs/useTheme.ts ---
// Custom hook for theme logic.
import { useTheme as useThemeContext } from "~/context/theme-provider";

export const useTheme = () => {
  const { theme, toggleTheme } = useThemeContext();
  const themeIcon = theme === "dark" ? "☀️" : "🌙"; // Unicode sun/moon

  return { theme, toggleTheme, themeIcon };
};
