"use client";

import { useTheme } from "./ThemeProvider";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={toggleTheme}
      aria-label={theme === "dark" ? "Chuyển sang sáng" : "Chuyển sang tối"}
      title={theme === "dark" ? "Light mode" : "Dark mode"}
    >
      <span className="theme-toggle-icon" aria-hidden="true">
        {theme === "dark" ? "☀" : "☾"}
      </span>
      <span className="theme-toggle-label">
        {theme === "dark" ? "light" : "dark"}
      </span>
    </button>
  );
}
