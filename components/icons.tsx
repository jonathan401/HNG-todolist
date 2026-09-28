export function PlusIcon({ small = false }: { small?: boolean }) {
  const size = small ? 24 : 32;
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <path
        d="M16 7.5v17M7.5 16h17"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function TagIcon({ color }: { color: string }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill={color}
        d="M4.2 6.4A2.4 2.4 0 0 1 6.6 4h6.4c.6 0 1.2.2 1.7.7l5.2 5.2a2.4 2.4 0 0 1 0 3.4l-5.6 5.6a2.4 2.4 0 0 1-3.4 0L5 13.7a2.4 2.4 0 0 1-.8-1.7V6.4Zm3.6 1.2a1.3 1.3 0 1 0 0 2.6 1.3 1.3 0 0 0 0-2.6Z"
      />
    </svg>
  );
}

export function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path
        d="M2.5 7.2 5.4 10 11.5 3.8"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function WriteIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M9.2 3.1 12.9 6.8 5.4 14.3H1.7v-3.7L9.2 3.1Z"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
      <path d="M7.6 4.7 11.3 8.4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

export function TrashIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M3 4.5h10M6 4.5V3.4A.9.9 0 0 1 6.9 2.5h2.2a.9.9 0 0 1 .9.9v1.1M4.4 4.5l.5 8.2a.9.9 0 0 0 .9.8h4.4a.9.9 0 0 0 .9-.8l.5-8.2"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function MoonIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path
        d="M14.6 11.4A6.2 6.2 0 0 1 6.6 3.4 6.2 6.2 0 1 0 14.6 11.4Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function SunIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <circle cx="9" cy="9" r="2.6" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M9 1.8v1.7M9 14.5v1.7M1.8 9h1.7M14.5 9h1.7M3.6 3.6l1.2 1.2M13.2 13.2l1.2 1.2M14.4 3.6l-1.2 1.2M4.8 13.2l-1.2 1.2"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
