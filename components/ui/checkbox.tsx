"use client";

import { motion } from "framer-motion";
import { CheckIcon } from "@/components/icons";

export function CheckBox({
  checked,
  onClick,
  label,
}: {
  checked: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      aria-label={label}
      onClick={onClick}
      className="mt-px grid size-6 shrink-0 cursor-pointer place-items-center rounded-[6px] border-2 transition-colors hover:border-[var(--fab)]"
      style={{
        borderColor: checked ? "var(--fab)" : "var(--checkbox)",
        background: checked ? "var(--fab)" : "transparent",
        color: "var(--fab-text)",
      }}
    >
      <motion.span
        initial={false}
        animate={{ scale: checked ? 1 : 0.4, opacity: checked ? 1 : 0 }}
        transition={{ type: "spring", stiffness: 500, damping: 28 }}
        className="grid place-items-center"
      >
        <CheckIcon />
      </motion.span>
    </button>
  );
}
