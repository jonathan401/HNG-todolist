"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  CATEGORIES_KEY,
  ITEMS_KEY,
  NOTES_KEY,
  PALETTE,
  THEME_KEY,
  UNCATEGORIZED_ID,
} from "@/lib/constants";
import { formatDayMonth } from "@/lib/format";
import { draftFromItem, emptyDraft, parseCategories, parseItems, parseNotes } from "@/lib/parse";
import type {
  Category,
  CategoryDraft,
  Draft,
  Item,
  Note,
  PendingDelete,
  Theme,
} from "@/lib/types";

type TodoContextValue = {
  ready: boolean;
  theme: Theme | null;
  todayLabel: string;
  items: Item[];
  notes: Note[];
  categories: Category[];
  activeCategoryId: string | "all";
  categoryFilter: string | "all" | typeof UNCATEGORIZED_ID;
  draft: Draft | null;
  setDraft: (draft: Draft | null) => void;
  categoryDraft: CategoryDraft | null;
  pendingDelete: PendingDelete | null;
  setActiveCategoryId: (id: string | "all") => void;
  setCategoryDraft: (draft: CategoryDraft | null) => void;
  setPendingDelete: (pending: PendingDelete | null) => void;
  toggleTheme: () => void;
  updateItem: (id: string, patch: Partial<Item>) => void;
  openTask: (id: string | null) => void;
  closeTask: () => void;
  saveTask: () => void;
  updateNote: (id: string, patch: Partial<Pick<Note, "title" | "body">>) => void;
  createNote: (title: string, body: string) => void;
  saveCategory: () => void;
  confirmDelete: () => void;
};

const TodoContext = createContext<TodoContextValue | null>(null);

export function TodoProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Item[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [ready, setReady] = useState(false);
  const [theme, setTheme] = useState<Theme | null>(null);
  const [activeCategoryId, setActiveCategoryId] = useState<string | "all">(UNCATEGORIZED_ID);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [pendingDelete, setPendingDelete] = useState<PendingDelete | null>(null);
  const [categoryDraft, setCategoryDraft] = useState<CategoryDraft | null>(null);
  const [todayLabel, setTodayLabel] = useState("");

  useEffect(() => {
    const storedTheme = localStorage.getItem(THEME_KEY);
    const nextTheme: Theme =
      storedTheme === "light" || storedTheme === "dark"
        ? storedTheme
        : window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light";
    document.documentElement.classList.toggle("dark", nextTheme === "dark");
    const loaded = parseItems(localStorage.getItem(ITEMS_KEY));
    const storedNotes = parseNotes(localStorage.getItem(NOTES_KEY));
    const known = new Set(storedNotes.map((note) => note.id));
    setTheme(nextTheme);
    setItems(loaded.items);
    setNotes([...loaded.liftedNotes.filter((note) => !known.has(note.id)), ...storedNotes]);
    setCategories(parseCategories(localStorage.getItem(CATEGORIES_KEY)));
    setTodayLabel(formatDayMonth(new Date()));
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(ITEMS_KEY, JSON.stringify(items));
  }, [items, ready]);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(NOTES_KEY, JSON.stringify(notes));
  }, [notes, ready]);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
  }, [categories, ready]);

  const categoryFilter =
    activeCategoryId === UNCATEGORIZED_ID ||
    categories.some((category) => category.id === activeCategoryId)
      ? activeCategoryId
      : UNCATEGORIZED_ID;

  const value = useMemo<TodoContextValue>(() => {
    function updateItem(id: string, patch: Partial<Item>) {
      setItems((prev) => prev.map((item) => (item.id === id ? { ...item, ...patch } : item)));
    }

    function openTask(id: string | null) {
      if (id === null) {
        setDraft(
          emptyDraft(
            categoryFilter === "all" || categoryFilter === UNCATEGORIZED_ID ? null : categoryFilter,
          ),
        );
        return;
      }
      const item = items.find((entry) => entry.id === id);
      if (!item) return;
      setDraft(draftFromItem(item));
    }

    function closeTask() {
      setDraft(null);
    }

    function saveTask() {
      if (!draft) return;
      const title = draft.title.trim();
      if (!title) return;
      const next: Item = {
        id: draft.id ?? crypto.randomUUID(),
        title,
        done: draft.done,
        categoryId: categories.some((category) => category.id === draft.categoryId)
          ? draft.categoryId
          : null,
        createdAt: draft.createdAt,
      };
      setItems((prev) => {
        const exists = prev.some((item) => item.id === next.id);
        return exists ? prev.map((item) => (item.id === next.id ? next : item)) : [...prev, next];
      });
      closeTask();
    }

    function updateNote(id: string, patch: Partial<Pick<Note, "title" | "body">>) {
      setNotes((prev) =>
        prev.map((note) =>
          note.id === id ? { ...note, ...patch, updatedAt: new Date().toISOString() } : note,
        ),
      );
    }

    function createNote(title: string, body: string) {
      const timestamp = new Date().toISOString();
      const note: Note = {
        id: crypto.randomUUID(),
        title: title.trim(),
        body: body.trim(),
        createdAt: timestamp,
        updatedAt: timestamp,
      };
      setNotes((prev) => [note, ...prev]);
    }

    function saveCategory() {
      if (!categoryDraft) return;
      const name = categoryDraft.name.trim();
      if (!name) return;
      if (categoryDraft.id) {
        setCategories((prev) =>
          prev.map((category) =>
            category.id === categoryDraft.id
              ? { ...category, name, color: categoryDraft.color }
              : category,
          ),
        );
      } else {
        const category = {
          id: crypto.randomUUID(),
          name,
          color: categoryDraft.color,
        };
        setCategories((prev) => [...prev, category]);
        setActiveCategoryId(category.id);
        setDraft((current) => (current ? { ...current, categoryId: category.id } : current));
      }
      setCategoryDraft(null);
    }

    function confirmDelete() {
      if (!pendingDelete) return;
      if (pendingDelete.type === "task") {
        setItems((prev) => prev.filter((item) => item.id !== pendingDelete.id));
        setDraft((current) => (current?.id === pendingDelete.id ? null : current));
      } else if (pendingDelete.type === "note") {
        setNotes((prev) => prev.filter((note) => note.id !== pendingDelete.id));
      } else {
        setCategories((prev) => prev.filter((category) => category.id !== pendingDelete.id));
        setItems((prev) =>
          prev.map((item) =>
            item.categoryId === pendingDelete.id ? { ...item, categoryId: null } : item,
          ),
        );
        setDraft((current) =>
          current?.categoryId === pendingDelete.id ? { ...current, categoryId: null } : current,
        );
        setActiveCategoryId((current) =>
          current === pendingDelete.id ? UNCATEGORIZED_ID : current,
        );
      }
      setPendingDelete(null);
    }

    function toggleTheme() {
      if (!theme) return;
      const next = theme === "dark" ? "light" : "dark";
      localStorage.setItem(THEME_KEY, next);
      document.documentElement.classList.toggle("dark", next === "dark");
      setTheme(next);
    }

    return {
      ready,
      theme,
      todayLabel,
      items,
      notes,
      categories,
      activeCategoryId,
      categoryFilter,
      draft,
      setDraft,
      categoryDraft,
      pendingDelete,
      setActiveCategoryId,
      setCategoryDraft,
      setPendingDelete,
      toggleTheme,
      updateItem,
      openTask,
      closeTask,
      saveTask,
      updateNote,
      createNote,
      saveCategory,
      confirmDelete,
    };
  }, [
    ready,
    theme,
    todayLabel,
    items,
    notes,
    categories,
    activeCategoryId,
    categoryFilter,
    draft,
    categoryDraft,
    pendingDelete,
  ]);

  return <TodoContext.Provider value={value}>{children}</TodoContext.Provider>;
}

export function useTodo() {
  const value = useContext(TodoContext);
  if (!value) throw new Error("useTodo must be used within TodoProvider");
  return value;
}
