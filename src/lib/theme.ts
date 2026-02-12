export type Theme = "light" | "dark" | "system";

const THEME_KEY = "theme";

// 🔥 SATU INSTANCE SAJA
const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

export function applyTheme(theme: Theme) {
  const root = document.documentElement;
  root.classList.remove("dark");

  if (theme === "dark") {
    root.classList.add("dark");
  }

  if (theme === "system" && mediaQuery.matches) {
    root.classList.add("dark");
  }
}

export function setTheme(theme: Theme) {
  localStorage.setItem(THEME_KEY, theme);
  applyTheme(theme);
}

export function getTheme(): Theme {
  return (localStorage.getItem(THEME_KEY) as Theme) || "system";
}

export function initTheme() {
  applyTheme(getTheme());

  const handler = () => {
    const isDark = mediaQuery.matches;

    if (isDark) {
      localStorage.setItem(THEME_KEY, "dark");
      applyTheme("dark");
    } else {
      localStorage.setItem(THEME_KEY, "light");
      applyTheme("light");
    }
  };

  mediaQuery.addEventListener("change", handler);
  mediaQuery.addListener?.(handler);
}
