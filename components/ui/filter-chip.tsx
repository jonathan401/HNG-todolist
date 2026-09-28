"use client";

import type { ReactNode } from "react";
import { tint } from "@/lib/format";

export function FilterChip({
  selected,
  onClick,
  color,
  children,
}: {
  selected: boolean;
  onClick: () => void;
  color?: string;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className="inline-flex cursor-pointer items-center gap-2 rounded-full px-3 py-2 text-[14px] leading-5 transition-opacity hover:opacity-80"
      style={{
        background: color ? tint(color) : selected ? "var(--fab)" : "transparent",
        color: color ? color : selected ? "var(--fab-text)" : "var(--foreground)",
        border: selected && color ? `1px solid ${color}` : "1px solid var(--line)",
      }}
    >
      {color && <span className="size-2 rounded-full" style={{ background: color }} />}
      {children}
    </button>
  );
}
