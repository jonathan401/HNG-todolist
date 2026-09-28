"use client";

import { useDismissOnEscape } from "@/components/use-dismiss-on-escape";
import { PALETTE } from "@/lib/constants";
import type { CategoryDraft } from "@/lib/types";

export function CategoryDialog({
  draft,
  onChange,
  onCancel,
  onSave,
}: {
  draft: CategoryDraft;
  onChange: (draft: CategoryDraft) => void;
  onCancel: () => void;
  onSave: () => void;
}) {
  useDismissOnEscape(onCancel);

  return (
    <div
      className="fixed inset-0 z-40 flex items-end justify-center bg-black/40 px-4 py-6 sm:items-center"
      onClick={onCancel}
    >
      <form
        role="dialog"
        aria-modal="true"
        aria-labelledby="category-dialog-title"
        onClick={(event) => event.stopPropagation()}
        onSubmit={(event) => {
          event.preventDefault();
          onSave();
        }}
        className="w-full max-w-sm rounded-2xl bg-background p-6 text-foreground"
      >
        <h2 id="category-dialog-title" className="text-[20px] leading-6 font-semibold">
          {draft.id ? "Rename category" : "New category"}
        </h2>
        <label className="mt-5 grid gap-2">
          <span className="text-[12px] font-semibold tracking-[0.04em] text-[var(--muted)] uppercase">
            Name
          </span>
          <input
            autoFocus
            value={draft.name}
            onChange={(event) => onChange({ ...draft, name: event.target.value })}
            placeholder="Groceries"
            className="rounded-lg border border-[var(--line)] bg-transparent px-3 py-2 text-[17px] outline-none"
          />
        </label>
        <div className="mt-5" role="group" aria-label="Color">
          <span className="text-[12px] font-semibold tracking-[0.04em] text-[var(--muted)] uppercase">
            Color
          </span>
          <div className="mt-2 flex flex-wrap gap-2">
            {PALETTE.map((color) => (
              <button
                key={color}
                type="button"
                aria-label={color}
                aria-pressed={draft.color === color}
                onClick={() => onChange({ ...draft, color })}
                className="size-8 cursor-pointer rounded-full transition-transform hover:scale-110"
                style={{
                  background: color,
                  outline: draft.color === color ? "2px solid var(--foreground)" : "none",
                  outlineOffset: 2,
                }}
              />
            ))}
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="cursor-pointer rounded-full px-4 py-2 text-[15px] transition-colors hover:bg-[var(--hover)]"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="cursor-pointer rounded-full bg-[var(--fab)] px-4 py-2 text-[15px] text-[var(--fab-text)] transition-opacity hover:opacity-80"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
}

export function ConfirmDialog({
  title,
  message,
  onCancel,
  onConfirm,
}: {
  title: string;
  message: string;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  useDismissOnEscape(onCancel);

  return (
    <div
      data-confirm-dialog=""
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 px-4 py-6 sm:items-center"
      onClick={onCancel}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        aria-describedby="confirm-message"
        onClick={(event) => event.stopPropagation()}
        className="w-full max-w-sm rounded-2xl bg-background p-6 text-foreground"
      >
        <h2 id="confirm-title" className="text-[20px] leading-6 font-semibold">
          {title}
        </h2>
        <p id="confirm-message" className="mt-2 text-[15px] leading-6 text-[var(--muted)]">
          {message}
        </p>
        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            autoFocus
            onClick={onCancel}
            className="cursor-pointer rounded-full px-4 py-2 text-[15px] transition-colors hover:bg-[var(--hover)]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="cursor-pointer rounded-full bg-[#b42334] px-4 py-2 text-[15px] text-white transition-opacity hover:opacity-80"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
