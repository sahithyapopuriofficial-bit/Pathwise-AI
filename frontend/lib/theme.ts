export type ThemeMode = "light" | "dark" | "system";

export const STORAGE_KEY = "pathwise-theme";

export function getSystemTheme(): "light" | "dark" {
  if (typeof window === "undefined") return "light";

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export function applyTheme(theme: ThemeMode) {
  if (typeof document === "undefined") return;

  const html = document.documentElement;

  html.classList.remove("light", "dark");

  const activeTheme =
    theme === "system" ? getSystemTheme() : theme;

  html.classList.add(activeTheme);
}

export function saveTheme(theme: ThemeMode) {
  localStorage.setItem(STORAGE_KEY, theme);
}

export function loadTheme(): ThemeMode {
  if (typeof window === "undefined") return "system";

  return (localStorage.getItem(STORAGE_KEY) as ThemeMode) ?? "system";
}