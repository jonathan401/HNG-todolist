"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { NoteModal } from "@/components/notes/note-modal";
import { useTodo } from "@/components/todo-store";
import { formatTimestamp, noteWasEdited } from "@/lib/format";
import type { NoteDraft } from "@/lib/types";

export function NoteView({ id }: { id: string }) {
  const router = useRouter();
  const { ready, notes, updateNote, setPendingDelete } = useTodo();
  const note = notes.find((entry) => entry.id === id) ?? null;
  const [draft, setDraft] = useState<NoteDraft | null>(null);

  useEffect(() => {
    if (!ready) return;
    if (!notes.some((entry) => entry.id === id)) router.replace("/notes");
  }, [ready, notes, id, router]);

  function saveNote() {
    if (!draft?.id) return;
    const title = draft.title.trim();
    const body = draft.body.trim();
    if (!title && !body) return;
    updateNote(draft.id, { title, body });
    setDraft(null);
  }

  if (!ready || !note) {
    return <p className="mt-8 text-[17px] text-[var(--muted)]">Loading note…</p>;
  }

  const edited = noteWasEdited(note);
  const paragraphs = note.body
    .trim()
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  return (
    <article className="mt-8">
      <div className="flex items-center gap-2">
        <Link
          href="/notes"
          className="cursor-pointer rounded-full px-3 py-2 text-[15px] text-[var(--muted)] transition-colors hover:bg-[var(--selected-bg)] hover:text-foreground"
        >
          Notes
        </Link>
        <div className="ml-auto flex items-center gap-1">
          <button
            type="button"
            onClick={() =>
              setDraft({
                id: note.id,
                title: note.title,
                body: note.body,
                createdAt: note.createdAt,
                updatedAt: note.updatedAt,
              })
            }
            className="cursor-pointer rounded-full px-4 py-2 text-[15px] transition-colors hover:bg-[var(--selected-bg)]"
          >
            Edit
          </button>
          <button
            type="button"
            onClick={() => setPendingDelete({ type: "note", id: note.id })}
            className="cursor-pointer rounded-full px-4 py-2 text-[15px] text-[#b42334] transition-colors hover:bg-[#b42334]/10"
          >
            Delete
          </button>
        </div>
      </div>
      <header className="mt-8 border-b border-[var(--line)] pb-6">
        <h2 className="max-w-[20ch] text-[40px] leading-[48px] font-bold tracking-[-0.03em]">
          {note.title.trim() || "Untitled"}
        </h2>
        <p className="mt-4 text-[14px] leading-5 text-[var(--muted)]">
          <time dateTime={note.createdAt}>{formatTimestamp(note.createdAt)}</time>
          {edited ? (
            <>
              <span aria-hidden="true"> · </span>
              Edited <time dateTime={note.updatedAt}>{formatTimestamp(note.updatedAt)}</time>
            </>
          ) : null}
        </p>
      </header>
      {paragraphs.length > 0 ? (
        <div className="mt-8 max-w-[62ch] space-y-6 text-[18px] leading-8">
          {paragraphs.map((paragraph) => (
            <p key={paragraph} className="whitespace-pre-wrap">
              {paragraph}
            </p>
          ))}
        </div>
      ) : (
        <p className="mt-8 text-[18px] leading-8 text-[var(--muted)]">This note is empty.</p>
      )}

      {draft && (
        <NoteModal
          draft={draft}
          onChange={setDraft}
          onCancel={() => setDraft(null)}
          onSave={saveNote}
          onAskDelete={() => setPendingDelete({ type: "note", id: note.id })}
        />
      )}
    </article>
  );
}
