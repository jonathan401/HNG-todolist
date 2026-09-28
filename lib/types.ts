export type Theme = "light" | "dark";
export type TaskStatus = "open" | "completed";
export type PendingDelete = { type: "task" | "note" | "category"; id: string };

export type Category = {
  id: string;
  name: string;
  color: string;
};

export type Item = {
  id: string;
  title: string;
  done: boolean;
  categoryId: string | null;
  createdAt: string;
};

export type Note = {
  id: string;
  title: string;
  body: string;
  createdAt: string;
  updatedAt: string;
};

export type Draft = {
  id: string | null;
  title: string;
  done: boolean;
  categoryId: string | null;
  createdAt: string;
};

export type CategoryDraft = {
  id: string | null;
  name: string;
  color: string;
};

export type NoteDraft = {
  id: string | null;
  title: string;
  body: string;
  createdAt: string | null;
  updatedAt: string | null;
};
