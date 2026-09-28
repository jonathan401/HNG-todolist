"use client";

import { useMemo, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { PlusIcon, TagIcon } from "@/components/icons";
import { TaskRow } from "@/components/tasks/task-row";
import { useTodo } from "@/components/todo-store";
import { PALETTE, UNCATEGORIZED, UNCATEGORIZED_ID } from "@/lib/constants";
import { tint } from "@/lib/format";
import type { TaskStatus } from "@/lib/types";

export function TasksPage() {
  const {
    ready,
    items,
    categories,
    categoryFilter,
    setActiveCategoryId,
    setCategoryDraft,
    setPendingDelete,
    updateItem,
    openTask,
  } = useTodo();
  const [status, setStatus] = useState<TaskStatus>("open");

  const inCategory = (categoryId: string | null) =>
    categoryFilter === UNCATEGORIZED_ID ? categoryId === null : categoryId === categoryFilter;

  const visibleItems = useMemo(() => {
    return items
      .filter((item) => (status === "completed" ? item.done : !item.done))
      .filter((item) => inCategory(item.categoryId))
      .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  }, [items, categoryFilter, status]);

  const selected = categories.find((category) => category.id === categoryFilter) ?? null;
  const categoryName = selected?.name ?? UNCATEGORIZED.name;

  return (
    <>
      <div className="mt-8 grid grid-cols-2 gap-2 lg:grid-cols-4 lg:gap-3">
        <CategoryCard
          name={UNCATEGORIZED.name}
          color={UNCATEGORIZED.color}
          openCount={items.filter((item) => item.categoryId === null && !item.done).length}
          doneCount={items.filter((item) => item.categoryId === null && item.done).length}
          selected={categoryFilter === UNCATEGORIZED_ID}
          onClick={() => setActiveCategoryId(UNCATEGORIZED_ID)}
        />
        {categories.map((category) => (
          <CategoryCard
            key={category.id}
            name={category.name}
            color={category.color}
            openCount={items.filter((item) => item.categoryId === category.id && !item.done).length}
            doneCount={items.filter((item) => item.categoryId === category.id && item.done).length}
            selected={categoryFilter === category.id}
            onClick={() => setActiveCategoryId(category.id)}
          />
        ))}
        <button
          type="button"
          onClick={() =>
            setCategoryDraft({
              id: null,
              name: "",
              color: PALETTE[categories.length % PALETTE.length],
            })
          }
          className="flex h-[93px] cursor-pointer flex-col items-start justify-center gap-4 rounded-xl border border-dashed border-[var(--line)] px-4 text-left text-[var(--muted)] transition-colors hover:bg-[var(--hover)]"
        >
          <PlusIcon small />
          <span className="text-[17px] leading-[21px] font-bold">Add category</span>
        </button>
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
        <div
          className="inline-flex shrink-0 rounded-full border border-[var(--line)] p-1"
          role="tablist"
          aria-label="Task status"
        >
          {(
            [
              ["open", "Open"],
              ["completed", "Completed"],
            ] as const
          ).map(([value, label]) => (
            <button
              key={value}
              type="button"
              role="tab"
              aria-selected={status === value}
              onClick={() => setStatus(value)}
              className={`cursor-pointer rounded-full px-5 py-2 text-[15px] transition-colors ${
                status === value
                  ? "bg-[var(--fab)] text-[var(--fab-text)]"
                  : "text-[var(--muted)] hover:bg-[var(--hover)]"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="flex min-h-8 w-full items-center gap-1 text-[14px] sm:w-auto">
          {selected && (
            <>
              <button
                type="button"
                onClick={() => setCategoryDraft({ ...selected })}
                className="cursor-pointer rounded-full px-2 py-1 text-[var(--muted)] transition-colors hover:bg-[var(--hover)]"
              >
                Rename
              </button>
              <button
                type="button"
                onClick={() => setPendingDelete({ type: "category", id: selected.id })}
                className="cursor-pointer rounded-full px-2 py-1 text-[#b42334] transition-colors hover:bg-[#b42334]/10"
              >
                Delete category
              </button>
            </>
          )}
        </div>
      </div>

      <section className="mt-4" aria-label="Tasks">
        <p className="px-4 pb-2 text-[15px] text-[var(--muted)]">
          {status === "completed" ? "Completed" : "Open"} in {categoryName}
        </p>
        {!ready ? (
          <p className="px-4 py-5 text-[17px] leading-[21px] text-[var(--muted)]">Loading your list…</p>
        ) : (
          <>
            {visibleItems.length === 0 && (
              <p className="px-4 py-5 text-[17px] leading-[21px] text-[var(--muted)]">
                {status === "completed"
                  ? `No completed tasks in ${categoryName}.`
                  : `No open tasks in ${categoryName}.`}
              </p>
            )}
            <ul className="relative">
              <AnimatePresence initial={false} mode="popLayout">
                {visibleItems.map((item) => (
                  <TaskRow
                    key={`${categoryFilter}-${status}-${item.id}`}
                    item={item}
                    category={null}
                    onToggle={() => updateItem(item.id, { done: !item.done })}
                    onOpen={() => openTask(item.id)}
                    onAskDelete={() => setPendingDelete({ type: "task", id: item.id })}
                  />
                ))}
              </AnimatePresence>
            </ul>
          </>
        )}
      </section>

      <div className="pointer-events-none fixed inset-x-0 bottom-8 z-10">
        <div className="mx-auto flex w-full max-w-[430px] justify-end px-[30px] md:max-w-[760px] md:px-8 lg:max-w-[960px] lg:px-10">
          <button
            type="button"
            onClick={() => openTask(null)}
            aria-label="Add task"
            className="pointer-events-auto grid size-[60px] cursor-pointer place-items-center rounded-xl bg-[var(--fab)] text-[var(--fab-text)] transition-opacity hover:opacity-80"
          >
            <PlusIcon />
          </button>
        </div>
      </div>
    </>
  );
}

function CategoryCard({
  name,
  color,
  openCount,
  doneCount,
  selected,
  onClick,
}: {
  name: string;
  color: string;
  openCount: number;
  doneCount: number;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className="flex h-[93px] cursor-pointer flex-col items-start justify-center gap-1 rounded-xl px-4 text-left transition hover:brightness-95"
      style={{
        background: tint(color),
        border: selected ? "1px solid var(--selected)" : "1px solid transparent",
      }}
    >
      <TagIcon color={color} />
      <span className="w-full truncate text-[17px] leading-[21px] font-bold">
        {openCount} {name}
      </span>
      <span className="text-[12px] leading-4 font-medium text-[var(--muted)]">{doneCount} done</span>
    </button>
  );
}
