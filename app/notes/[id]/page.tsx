"use client";

import { useParams } from "next/navigation";
import { NoteView } from "@/components/notes/note-view";

export default function NotePage() {
  const params = useParams<{ id: string }>();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  return <NoteView id={id} />;
}
