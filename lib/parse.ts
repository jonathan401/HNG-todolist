import { PALETTE } from "@/lib/constants";
import type { Category, Draft, Item, Note } from "@/lib/types";

export function parseItems(raw: string | null): {
  items: Item[];
  liftedNotes: Note[];
} {
  if (!raw) return { items: [], liftedNotes: [] };
  try {
    const data: unknown = JSON.parse(raw);
    if (!Array.isArray(data)) return { items: [], liftedNotes: [] };
    const liftedNotes: Note[] = [];
    const items = data.flatMap((entry) => {
      if (!entry || typeof entry !== "object") return [];
      const item = entry as Partial<Item> & {
        notes?: unknown;
      };
      if (typeof item.id !== "string" || typeof item.title !== "string") return [];
      const legacyNotes = typeof item.notes === "string" ? item.notes.trim() : "";
      if (legacyNotes) {
        const liftedAt =
          typeof item.createdAt === "string" ? item.createdAt : new Date().toISOString();
        liftedNotes.push({
          id: `note-from-${item.id}`,
          title: item.title,
          body: legacyNotes,
          createdAt: liftedAt,
          updatedAt: liftedAt,
        });
      }
      return [
        {
          id: item.id,
          title: item.title,
          done: Boolean(item.done),
          categoryId: typeof item.categoryId === "string" ? item.categoryId : null,
          createdAt:
            typeof item.createdAt === "string" ? item.createdAt : new Date().toISOString(),
        },
      ];
    });
    return { items, liftedNotes };
  } catch {
    return { items: [], liftedNotes: [] };
  }
}

export function parseNotes(raw: string | null): Note[] {
  if (!raw) return [];
  try {
    const data: unknown = JSON.parse(raw);
    if (!Array.isArray(data)) return [];
    return data.flatMap((entry) => {
      if (!entry || typeof entry !== "object") return [];
      const note = entry as Partial<Note>;
      if (typeof note.id !== "string") return [];
      return [
        {
          id: note.id,
          title: typeof note.title === "string" ? note.title : "",
          body: typeof note.body === "string" ? note.body : "",
          createdAt:
            typeof note.createdAt === "string"
              ? note.createdAt
              : typeof note.updatedAt === "string"
                ? note.updatedAt
                : new Date().toISOString(),
          updatedAt:
            typeof note.updatedAt === "string"
              ? note.updatedAt
              : typeof note.createdAt === "string"
                ? note.createdAt
                : new Date().toISOString(),
        },
      ];
    });
  } catch {
    return [];
  }
}

export function parseCategories(raw: string | null): Category[] {
  if (!raw) return [];
  try {
    const data: unknown = JSON.parse(raw);
    if (!Array.isArray(data)) return [];
    return data.flatMap((entry) => {
      if (!entry || typeof entry !== "object") return [];
      const category = entry as Partial<Category>;
      if (
        typeof category.id !== "string" ||
        typeof category.name !== "string" ||
        !category.name.trim()
      )
        return [];
      return [
        {
          id: category.id,
          name: category.name.trim(),
          color: typeof category.color === "string" ? category.color : PALETTE[0],
        },
      ];
    });
  } catch {
    return [];
  }
}

export function emptyDraft(categoryId: string | null): Draft {
  return {
    id: null,
    title: "",
    done: false,
    categoryId,
    createdAt: new Date().toISOString(),
  };
}

export function draftFromItem(item: Item): Draft {
  return {
    id: item.id,
    title: item.title,
    done: item.done,
    categoryId: item.categoryId,
    createdAt: item.createdAt,
  };
}
