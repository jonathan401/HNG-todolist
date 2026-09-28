"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { CategoryDialog, ConfirmDialog } from "@/components/ui/dialogs";
import { ThemeButton } from "@/components/ui/theme-button";
import { TaskModal } from "@/components/tasks/task-modal";
import { useTodo } from "@/components/todo-store";
import { PALETTE } from "@/lib/constants";

const links = [
  { href: "/", label: "Tasks" },
  { href: "/notes", label: "Notes" },
];

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const {
    theme,
    todayLabel,
    toggleTheme,
    draft,
    categories,
    closeTask,
    saveTask,
    setDraft,
    setPendingDelete,
    setCategoryDraft,
    categoryDraft,
    pendingDelete,
    items,
    notes,
    saveCategory,
    confirmDelete,
  } = useTodo();

  const pendingTarget = describePending(pendingDelete, items, notes, categories);

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <div className="relative mx-auto min-h-dvh w-full max-w-[430px] md:max-w-[760px] lg:max-w-[960px]">
        <div className="px-[22px] pt-[68px] pb-28 md:px-8 lg:px-10 lg:pt-14">
          <header className="flex items-center gap-2.5 px-4">
            <h1 className="text-[36px] leading-[44px] font-bold tracking-[-0.02em]">Today</h1>
            <p className="text-[36px] leading-[44px] font-medium tracking-[-0.02em] text-[var(--date)]">
              {todayLabel}
            </p>
            <ThemeButton theme={theme} onClick={toggleTheme} className="ml-auto" />
          </header>

          <nav
            className="mt-6 inline-flex rounded-full border border-[var(--line)] p-1"
            aria-label="Sections"
          >
            {links.map((link) => {
              const selected =
                link.href === "/"
                  ? pathname === "/"
                  : pathname === link.href || pathname.startsWith(`${link.href}/`);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={selected ? "page" : undefined}
                  className={`cursor-pointer rounded-full px-5 py-2 text-[15px] transition-colors ${
                    selected
                      ? "bg-[var(--fab)] text-[var(--fab-text)]"
                      : "text-[var(--muted)] hover:bg-[var(--hover)]"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {children}
        </div>
      </div>

      {draft && (
        <TaskModal
          draft={draft}
          categories={categories}
          onChange={setDraft}
          onCancel={closeTask}
          onSave={saveTask}
          onAskDelete={() => {
            if (draft.id) setPendingDelete({ type: "task", id: draft.id });
          }}
          onAddCategory={() =>
            setCategoryDraft({
              id: null,
              name: "",
              color: PALETTE[categories.length % PALETTE.length],
            })
          }
        />
      )}

      {categoryDraft && (
        <CategoryDialog
          draft={categoryDraft}
          onChange={setCategoryDraft}
          onCancel={() => setCategoryDraft(null)}
          onSave={saveCategory}
        />
      )}

      {pendingTarget && (
        <ConfirmDialog
          title={pendingTarget.title}
          message={pendingTarget.message}
          onCancel={() => setPendingDelete(null)}
          onConfirm={confirmDelete}
        />
      )}
    </div>
  );
}

function describePending(
  pending: { type: "task" | "note" | "category"; id: string } | null,
  items: { id: string; title: string }[],
  notes: { id: string; title: string }[],
  categories: { id: string; name: string }[],
) {
  if (!pending) return null;
  if (pending.type === "task") {
    const item = items.find((entry) => entry.id === pending.id);
    if (!item) return null;
    return {
      title: "Delete this task?",
      message: `“${item.title}” will be removed from your list.`,
    };
  }
  if (pending.type === "note") {
    const note = notes.find((entry) => entry.id === pending.id);
    if (!note) return null;
    const label = note.title.trim() || "Untitled";
    return {
      title: "Delete this note?",
      message: `“${label}” will be removed.`,
    };
  }
  const category = categories.find((entry) => entry.id === pending.id);
  if (!category) return null;
  return {
    title: "Delete this category?",
    message: `“${category.name}” will be removed. Tasks in it stay on your list.`,
  };
}
