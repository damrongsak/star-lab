module.exports = {
  darkMode: "class", // Enable dark mode using the 'class' strategy
  theme: {
    extend: {
      colors: {
        // Custom light theme colors
        light: {
          bg: "#ffffff",
          bgSecondary: "#f3f4f6",
          text: "#1f2937",
          textSecondary: "#6b7280",
          border: "#e5e7eb",
          accent: "#2563eb",
        },
        // Custom dark theme colors
        dark: {
          bg: "#18181b",
          bgSecondary: "#232336",
          text: "#f3f4f6",
          textSecondary: "#a1a1aa",
          border: "#27272a",
          accent: "#60a5fa",
        },
      },
    },
  },
  plugins: [],
};
