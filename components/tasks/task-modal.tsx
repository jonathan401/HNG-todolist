"use client";

import { useDismissOnEscape } from "@/components/use-dismiss-on-escape";
import { FilterChip } from "@/components/ui/filter-chip";
import { UNCATEGORIZED } from "@/lib/constants";
import type { Category, Draft } from "@/lib/types";

export function TaskModal({
  draft,
  categories,
  onChange,
  onCancel,
  onSave,
  onAskDelete,
  onAddCategory,
}: {
  draft: Draft;
  categories: Category[];
  onChange: (draft: Draft) => void;
  onCancel: () => void;
  onSave: () => void;
  onAskDelete: () => void;
  onAddCategory: () => void;
}) {
  const canSave = Boolean(draft.title.trim());
  useDismissOnEscape(onCancel);

  return (
    <div
      className="fixed inset-0 z-40 flex items-end justify-center bg-black/40 px-4 py-6 sm:items-center"
      onClick={onCancel}
    >
      <form
        role="dialog"
        aria-modal="true"
        aria-labelledby="task-dialog-title"
        onClick={(event) => event.stopPropagation()}
        onSubmit={(event) => {
          event.preventDefault();
          if (canSave) onSave();
        }}
        className="max-h-[min(640px,calc(100dvh-3rem))] w-full max-w-lg overflow-y-auto rounded-2xl bg-background p-6 text-foreground"
      >
        <div className="flex items-start justify-between gap-3">
          <h2 id="task-dialog-title" className="text-[20px] leading-6 font-semibold">
            {draft.id ? "Edit task" : "New task"}
          </h2>
          {draft.id && (
            <button
              type="button"
              onClick={onAskDelete}
              className="cursor-pointer rounded-full px-3 py-1 text-[15px] text-[#b42334] transition-colors hover:bg-[#b42334]/10"
            >
              Delete
            </button>
          )}
        </div>
        <label className="sr-only" htmlFor="new-task-title">
          Task title
        </label>
        <input
          id="new-task-title"
          autoFocus
          value={draft.title}
          onChange={(event) => onChange({ ...draft, title: event.target.value })}
          placeholder="Task title"
          className="mt-4 w-full bg-transparent text-[22px] leading-7 font-semibold tracking-[-0.02em] outline-none placeholder:text-[var(--date)]"
        />
        <div className="mt-5" role="group" aria-label="Category">
          <span className="text-[12px] font-semibold tracking-[0.04em] text-[var(--muted)] uppercase">
            Category
          </span>
          <div className="mt-2 flex flex-wrap gap-2">
            <FilterChip
              selected={draft.categoryId === null}
              color={UNCATEGORIZED.color}
              onClick={() => onChange({ ...draft, categoryId: null })}
            >
              {UNCATEGORIZED.name}
            </FilterChip>
            {categories.map((category) => (
              <FilterChip
                key={category.id}
                selected={draft.categoryId === category.id}
                color={category.color}
                onClick={() => onChange({ ...draft, categoryId: category.id })}
              >
                {category.name}
              </FilterChip>
            ))}
            <button
              type="button"
              onClick={onAddCategory}
              className="cursor-pointer rounded-full px-2 text-[14px] text-[var(--muted)] transition-colors hover:bg-[var(--hover)]"
            >
              Add category
            </button>
          </div>
        </div>
        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="cursor-pointer rounded-full px-4 py-2 text-[15px] transition-colors hover:bg-[var(--hover)]"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!canSave}
            className="h-11 cursor-pointer rounded-xl bg-[var(--fab)] px-5 text-[15px] font-medium text-[var(--fab-text)] transition-opacity hover:opacity-80 disabled:opacity-40"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
}
