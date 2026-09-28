"use client";

import Link from "next/link";
import { useState } from "react";
import { NoteModal } from "@/components/notes/note-modal";
import { useTodo } from "@/components/todo-store";
import { formatTimestamp, noteWasEdited } from "@/lib/format";
import type { NoteDraft } from "@/lib/types";

export function NotesList() {
  const { ready, notes, createNote, setPendingDelete } = useTodo();
  const [draft, setDraft] = useState<NoteDraft | null>(null);

  function saveNote() {
    if (!draft) return;
    const title = draft.title.trim();
    const body = draft.body.trim();
    if (!title && !body) return;
    createNote(title, body);
    setDraft(null);
  }

  return (
    <div className="mt-8 px-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-[15px] text-[var(--muted)]">
          {!ready
            ? "Loading notes…"
            : notes.length === 0
              ? "No notes yet"
              : `${notes.length} ${notes.length === 1 ? "note" : "notes"}`}
        </p>
        <button
          type="button"
          onClick={() =>
            setDraft({ id: null, title: "", body: "", createdAt: null, updatedAt: null })
          }
          className="h-11 cursor-pointer rounded-xl bg-[var(--fab)] px-4 text-[15px] font-medium text-[var(--fab-text)] transition-opacity hover:opacity-80"
        >
          Add note
        </button>
      </div>

      {notes.length > 0 && (
        <ul className="mt-4">
          {notes.map((note) => {
            const title = note.title.trim() || "Untitled";
            const preview = note.body.replace(/\s+/g, " ").trim();
            const edited = noteWasEdited(note);
            return (
              <li key={note.id} className="border-b border-[var(--line)]">
                <Link
                  href={`/notes/${note.id}`}
                  className="block cursor-pointer py-5 transition-colors hover:bg-[var(--hover)]"
                >
                  <span className="block truncate text-[17px] leading-[21px] font-bold">{title}</span>
                  {preview && (
                    <span className="mt-1 block truncate text-[15px] leading-6 text-[var(--muted)]">
                      {preview}
                    </span>
                  )}
                  <time
                    dateTime={note.createdAt}
                    className="mt-2 block text-[12px] leading-4 text-[var(--muted)]"
                  >
                    {formatTimestamp(note.createdAt)}
                    {edited ? ` · Edited ${formatTimestamp(note.updatedAt)}` : ""}
                  </time>
                </Link>
              </li>
            );
          })}
        </ul>
      )}

      {draft && (
        <NoteModal
          draft={draft}
          onChange={setDraft}
          onCancel={() => setDraft(null)}
          onSave={saveNote}
          onAskDelete={() => {
            const note = notes.find((entry) => entry.id === draft.id);
            if (note) setPendingDelete({ type: "note", id: note.id });
          }}
        />
      )}
    </div>
  );
}
