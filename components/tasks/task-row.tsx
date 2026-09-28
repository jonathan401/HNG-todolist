"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { TrashIcon, WriteIcon } from "@/components/icons";
import { CheckBox } from "@/components/ui/checkbox";
import type { Item } from "@/lib/types";

export function TaskRow({
  item,
  onToggle,
  onOpen,
  onAskDelete,
}: {
  item: Item;
  onToggle: () => void;
  onOpen: () => void;
  onAskDelete: () => void;
}) {
  const [pendingDone, setPendingDone] = useState(false);
  const checked = item.done || pendingDone;

  function handleToggle() {
    if (!item.done) {
      setPendingDone(true);
      window.setTimeout(onToggle, 180);
      return;
    }
    onToggle();
  }

  return (
    <motion.li
      layout
      initial={false}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, x: 28, height: 0, paddingTop: 0, paddingBottom: 0 }}
      transition={{ type: "spring", stiffness: 420, damping: 34 }}
      className="overflow-hidden border-b border-[var(--line)] px-4 py-5"
    >
      <div className="flex items-start gap-4">
        <CheckBox
          checked={checked}
          onClick={handleToggle}
          label={`Mark ${item.title} ${checked ? "open" : "done"}`}
        />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <span
              className={`block min-w-0 text-[17px] leading-[21px] ${checked ? "text-[var(--muted)] line-through" : ""}`}
            >
              {item.title}
            </span>
            <div className="flex shrink-0 items-center">
              <button
                type="button"
                onClick={onOpen}
                aria-label={`Edit ${item.title}`}
                className="grid size-8 cursor-pointer place-items-center rounded-lg text-[var(--muted)] transition-colors hover:bg-[var(--hover)] hover:text-foreground"
              >
                <WriteIcon />
              </button>
              <button
                type="button"
                onClick={onAskDelete}
                aria-label={`Delete ${item.title}`}
                className="grid size-8 cursor-pointer place-items-center rounded-lg text-[var(--muted)] transition-colors hover:bg-[var(--hover)] hover:text-[#b42334]"
              >
                <TrashIcon />
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.li>
  );
}
