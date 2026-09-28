"use client";

import { MoonIcon, SunIcon } from "@/components/icons";
import type { Theme } from "@/lib/types";

export function ThemeButton({
  theme,
  onClick,
  className = "",
}: {
  theme: Theme | null;
  onClick: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      className={`grid size-9 cursor-pointer place-items-center rounded-lg p-1 transition-colors hover:bg-[var(--hover)] ${className}`}
    >
      {theme === "dark" ? <SunIcon /> : <MoonIcon />}
    </button>
  );
}
