import { MONTHS } from "@/lib/constants";

export function formatDayMonth(date: Date) {
  return `${date.getDate()} ${MONTHS[date.getMonth()]}`;
}

export function formatTimestamp(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const time = new Intl.DateTimeFormat(undefined, {
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
  return `${date.getDate()} ${MONTHS[date.getMonth()]}, ${time}`;
}

export function tint(color: string) {
  return `${color}1a`;
}

export function noteWasEdited(note: { createdAt: string; updatedAt: string }) {
  return (
    Math.abs(new Date(note.updatedAt).getTime() - new Date(note.createdAt).getTime()) >
    60_000
  );
}
