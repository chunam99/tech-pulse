"use client";

import { useTheme, type Theme } from "@/providers/ThemeProvider";
import { useTranslations } from "@/providers/I18nProvider";

const cycle: Theme[] = ["light", "dark", "system"];

function ThemeIcon({ resolved }: { resolved: "light" | "dark" }) {
  if (resolved === "dark") {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        className="h-4 w-4"
        aria-hidden
      >
        <path
          fillRule="evenodd"
          d="M7.455 2.004a.75.75 0 01.26.77 7 7 0 009.958 9.958.75.75 0 01.77.26A8.25 8.25 0 1115.5 3.5a8.24 8.24 0 01-8.045 1.496z"
          clipRule="evenodd"
        />
      </svg>
    );
  }
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className="h-4 w-4"
      aria-hidden
    >
      <path d="M10 2a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 0110 2zM10 15a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 0110 15zM3.05 4.22a.75.75 0 011.06 0l1.06 1.06a.75.75 0 11-1.06 1.06l-1.06-1.06a.75.75 0 010-1.06zM14.83 15.99a.75.75 0 011.06 0l1.06 1.06a.75.75 0 11-1.06 1.06l-1.06-1.06a.75.75 0 010-1.06zM2 10a.75.75 0 01.75-.75h1.5a.75.75 0 010 1.5h-1.5A.75.75 0 012 10zM15 10a.75.75 0 01.75-.75h1.5a.75.75 0 010 1.5h-1.5A.75.75 0 0115 10zM4.22 15.95a.75.75 0 010-1.06l1.06-1.06a.75.75 0 111.06 1.06l-1.06 1.06a.75.75 0 01-1.06 0zM15.99 5.17a.75.75 0 010-1.06l1.06-1.06a.75.75 0 111.06 1.06l-1.06 1.06a.75.75 0 01-1.06 0zM10 5.5a4.5 4.5 0 100 9 4.5 4.5 0 000-9z"
      />
    </svg>
  );
}

export function ThemeToggle() {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const { t } = useTranslations();

  const label =
    theme === "system"
      ? t("theme.system")
      : theme === "dark"
        ? t("theme.dark")
        : t("theme.light");

  function handleClick() {
    const index = cycle.indexOf(theme);
    setTheme(cycle[(index + 1) % cycle.length]);
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-surface text-muted transition-colors hover:bg-surface-hover hover:text-foreground"
      title={`${t("theme.toggle")}: ${label}`}
      aria-label={`${t("theme.toggle")}: ${label}`}
    >
      <ThemeIcon resolved={resolvedTheme} />
    </button>
  );
}
