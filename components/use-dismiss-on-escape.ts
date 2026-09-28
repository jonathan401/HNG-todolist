"use client";

import { useEffect, useRef } from "react";

const escapeHandlers: Array<() => void> = [];

export function useDismissOnEscape(onDismiss: () => void) {
  const onDismissRef = useRef(onDismiss);
  

  useEffect(() => {
    const dismiss = () => onDismissRef.current();
    escapeHandlers.push(dismiss);
    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      if (escapeHandlers[escapeHandlers.length - 1] !== dismiss) return;
      event.preventDefault();
      dismiss();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => {
      const index = escapeHandlers.lastIndexOf(dismiss);
      if (index !== -1) escapeHandlers.splice(index, 1);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, []);
}
