"use client";

import { useDismissOnEscape } from "@/components/use-dismiss-on-escape";
import { formatTimestamp, noteWasEdited } from "@/lib/format";
import type { NoteDraft } from "@/lib/types";

export function NoteModal({
  draft,
  onChange,
  onCancel,
  onSave,
  onAskDelete,
}: {
  draft: NoteDraft;
  onChange: (draft: NoteDraft) => void;
  onCancel: () => void;
  onSave: () => void;
  onAskDelete: () => void;
}) {
  const canSave = Boolean(draft.title.trim() || draft.body.trim());
  const edited =
    draft.createdAt &&
    draft.updatedAt &&
    Math.abs(new Date(draft.updatedAt).getTime() - new Date(draft.createdAt).getTime()) > 60_000;

  useDismissOnEscape(onCancel);

  return (
    <div
      className="fixed inset-0 z-40 flex items-end justify-center bg-black/40 px-4 py-6 sm:items-center"
      onClick={onCancel}
    >
      <form
        role="dialog"
        aria-modal="true"
        aria-labelledby="note-dialog-title"
        onClick={(event) => event.stopPropagation()}
        onSubmit={(event) => {
          event.preventDefault();
          if (canSave) onSave();
        }}
        className="w-full max-w-lg rounded-2xl bg-background p-6 text-foreground"
      >
        <div className="flex items-start justify-between gap-3">
          <h2 id="note-dialog-title" className="text-[20px] leading-6 font-semibold">
            {draft.id ? "Edit note" : "New note"}
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
        {draft.createdAt && (
          <p className="mt-2 text-[13px] text-[var(--muted)]">
            <time dateTime={draft.createdAt}>{formatTimestamp(draft.createdAt)}</time>
            {edited && draft.updatedAt ? (
              <>
                {" · Edited "}
                <time dateTime={draft.updatedAt}>{formatTimestamp(draft.updatedAt)}</time>
              </>
            ) : null}
          </p>
        )}
        <label className="sr-only" htmlFor="note-title">
          Note title
        </label>
        <input
          id="note-title"
          autoFocus
          value={draft.title}
          onChange={(event) => onChange({ ...draft, title: event.target.value })}
          placeholder="Note title"
          className="mt-4 w-full bg-transparent text-[22px] leading-7 font-semibold tracking-[-0.02em] outline-none placeholder:text-[var(--date)]"
        />
        <label className="sr-only" htmlFor="note-body">
          Note
        </label>
        <textarea
          id="note-body"
          value={draft.body}
          onChange={(event) => onChange({ ...draft, body: event.target.value })}
          placeholder="Write your note"
          rows={6}
          className="mt-3 w-full resize-y rounded-xl bg-[var(--selected-bg)] px-4 py-3 text-[17px] leading-6 outline-none placeholder:text-[var(--muted)]"
        />
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
